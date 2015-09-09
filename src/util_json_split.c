#include "util_json_split.h"

static bool parse_hex16(const char **sp, int *out);
static int utf8_write_char(int unicode, char *out);

DArray *DArray_json_split(char *str_form_data) {
	DArray *darr_list = NULL;
	DEFINE_VAR_ALL(str_current, str_temp, str_result);
	
	int int_form_data_len = strlen(str_form_data);  
	ERROR_CHECK(int_form_data_len >= 1, "No JSON to parse.");
	
	darr_list = DArray_create(1, 1);
	ERROR_CHECK(darr_list != NULL, "DArray_create failed");
	int int_qs = 0;
	
	// we'll go through the loop just one time. we don't need to copy it.
	char *ptr_loop = str_form_data;  // increments by one character per loop
	
	//move past [
	if (*ptr_loop == '[') {
		ptr_loop++;
	}
	int int_current_len;
	
	// quote status
	// 0 =>  0 = between elements
	// 1 =>  1 = inside element (between double quotes)
	
	// the plan:
	// loop through form_data with loop_ptr one char at a time
	// along the way, fill up a variable with the first element one char at a time
	// if we encounter a slash then "\\" => "\", "\"" => '"', "\f" => '\f', "\n" => '\n', "\r" => '\r', "\t" => '\t'
	while (int_form_data_len > 0) {
		// found a beginning quote
		if (int_qs == 0 && *ptr_loop == '"') {
			ERROR_CAT_CSTR(str_current, "");
			DEBUG("str_current>%s<", str_current);
			int_current_len = 1;
			int_qs = 1;
		
		// looking for a beginning quote
		} else if (int_qs == 0 && *ptr_loop != '"') {
			int_qs = 0;
			
		// we've found an ending quote
		} else if (int_qs == 1 && *ptr_loop == '"') {
			DEBUG("use str_current>%s<", str_current);
			ERROR_CHECK(str_current != NULL, "trying to push str_current without allocating it first");
			DArray_push(darr_list, str_current);
			str_current = NULL;
			DEBUG("str_current?: %s", str_current != NULL ? "NOT NULL" : "NULL");
			int_qs = 0;
			
		// deal with slashes
		} else if (int_qs == 1 && *ptr_loop == '\\') {
			ptr_loop = ptr_loop + 1;
			int_form_data_len = int_form_data_len - 1;
			int_current_len = int_current_len + 1;
			
			ERROR_SREALLOC(str_current, int_current_len);
			str_current[int_current_len - 1] = '\0';
			
			//waterfall
			if (*ptr_loop == '"' || *ptr_loop == '\\'  || *ptr_loop == '/') {
				str_current[int_current_len - 2] = *ptr_loop;
			} else if (*ptr_loop == 'b') {
				str_current[int_current_len - 2] = '\b';
			} else if (*ptr_loop == 'f') {
				str_current[int_current_len - 2] = '\f';
			} else if (*ptr_loop == 'n') {
				str_current[int_current_len - 2] = '\n';
			} else if (*ptr_loop == 'r') {
				str_current[int_current_len - 2] = '\r';
			} else if (*ptr_loop == 't') {
				str_current[int_current_len - 2] = '\t';
			} else if (*ptr_loop == 'u') {
				ERROR_SALLOC(str_temp, 5);
				memcpy(str_temp, ptr_loop + 1, 4);
				str_temp[4] = '\0';
				char *ptr_temp = str_temp;
				
				int int_unicode;
				parse_hex16((const char **)&ptr_temp, &int_unicode);
				SFREE(str_temp);
				ERROR_SALLOC(str_result, 5);
				int int_result_len = utf8_write_char(int_unicode, str_result);
				str_result[int_result_len] = '\0';
				
				//DEBUG(">%i|%i|%i|%s<", element_len, int_result_len, int_unicode, str_result);
				int_current_len = int_current_len + int_result_len - 1; //we already realloced 1 byte before waterfall
				ERROR_SREALLOC(str_current, int_current_len);
				
				memcpy(str_current + int_current_len - int_result_len - 1, str_result, int_result_len);
				SFREE(str_result);
				str_current[int_current_len - 1] = '\0';
				
				//move past 4 hex chars
				ptr_loop = ptr_loop + 4;
				int_form_data_len = int_form_data_len - 4;
				
			}
		
		// accumulate inside an element
		} else if (int_qs == 1) {
			int_current_len = int_current_len + 1;
			ERROR_SREALLOC(str_current, int_current_len);
			str_current[int_current_len - 2] = *ptr_loop;
			str_current[int_current_len - 1] = '\0';
		}
		
		ptr_loop = ptr_loop + 1;
		int_form_data_len = int_form_data_len - 1;
	}
	
	SFREE_ALL();
	return darr_list;
error:
	SFREE_ALL();
	if (darr_list) DArray_clear_destroy(darr_list);
	return NULL;
}

/*
 * Parses exactly 4 hex characters (capital or lowercase).
 * Fails if any input chars are not [0-9A-Fa-f].
 */
static bool parse_hex16(const char **sp, int *out) {
	const char *s = *sp;
	int ret = 0;
	int i;
	int tmp;
	char c;

	for (i = 0; i < 4; i++) {
		c = *s++;
		if (c >= '0' && c <= '9')
			tmp = c - '0';
		else if (c >= 'A' && c <= 'F')
			tmp = c - 'A' + 10;
		else if (c >= 'a' && c <= 'f')
			tmp = c - 'a' + 10;
		else
			return false;
		
		ret <<= 4;
		ret += tmp;
	}
	
	if (out)
		*out = ret;
	*sp = s;
	return true;
}

/*
 * Write a single UTF-8 character to @s,
 * returning the length, in bytes, of the character written.
 *
 * @unicode must be U+0000..U+10FFFF, but not U+D800..U+DFFF.
 *
 * This function will write up to 4 bytes to @out.
 */
static int utf8_write_char(int unicode, char *out) {
	unsigned char *o = (unsigned char*) out;
	
	//assert(unicode <= 0x10FFFF && !(unicode >= 0xD800 && unicode <= 0xDFFF));
	if ((unicode <= 0x10FFFF && !(unicode >= 0xD800 && unicode <= 0xDFFF)) == 0) {
		return 0;
	}

	if (unicode <= 0x7F) {
		/* U+0000..U+007F */
		*o++ = unicode;
		return 1;
	} else if (unicode <= 0x7FF) {
		/* U+0080..U+07FF */
		*o++ = 0xC0 | unicode >> 6;
		*o++ = 0x80 | (unicode & 0x3F);
		return 2;
	} else if (unicode <= 0xFFFF) {
		/* U+0800..U+FFFF */
		*o++ = 0xE0 | unicode >> 12;
		*o++ = 0x80 | (unicode >> 6 & 0x3F);
		*o++ = 0x80 | (unicode & 0x3F);
		return 3;
	} else {
		/* U+10000..U+10FFFF */
		*o++ = 0xF0 | unicode >> 18;
		*o++ = 0x80 | (unicode >> 12 & 0x3F);
		*o++ = 0x80 | (unicode >> 6 & 0x3F);
		*o++ = 0x80 | (unicode & 0x3F);
		return 4;
	}
}
