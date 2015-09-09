#include "util_split.h"

// NOTES:                   Start   End
// Dash Comment             --      \r or \n
// Multi-line comment       /*      */
// Slash                    \       next char
// Single Quote             '       '
// Double Quote             "       "
// dollar tag               $$      $$
// custom dollar tag        $xx$    $xx$    case sensitive

DArray *DArray_sql_split(char *str_form_data) {
	int int_inputstring_len;
	int int_qs = 0; // quote status
	int int_ps = 0; // parenthesis level
	int int_element_len = 0;
	int int_chunk_len = 0;
	int int_tag = 0;
	DEFINE_VAR_ALL(str_tag, str_temp, str_trailing);
	DArray *darr_list = NULL;
	
	ERROR_CAT_CSTR(str_tag, "");
	
	darr_list = DArray_create(1, 1);
	
	ERROR_CHECK(str_form_data != NULL, "No SQL to parse.");
	
	int_inputstring_len = strlen(str_form_data);
	ERROR_CHECK(int_inputstring_len >= 1, "No SQL to parse.");
	
	// I considered copying input to local memory but we don't change it.
	//   So don't copy the entire item into a new variable, it could be large.
	char *ptr_loop = str_form_data;  // increments by one character per loop
	char *ptr_start = str_form_data; // increments when we push SQL to array
	
	// quote status
	// 0 => no quotes
	// 1 => start a dollar tag
	// 2 => have a dollar tag
	// 3 => single quote
	// 4 => double quote
	// 5 => multiline comment
	// 6 => line comment
	
	while (int_inputstring_len > 0) {
		DEBUG("1");
		DEBUG("ptr_loop: %s", ptr_loop);
		int_chunk_len = 1;
		int_element_len += int_chunk_len;
		DEBUG("int_inputstring_len: %i, int_chunk_len: %i, int_element_len: %i ", int_inputstring_len, int_chunk_len, int_element_len);
		
		// if we're beginning a new element then strip white space
		/*if ( element_len == 1 && ( start_ptr[0] == ' ' || start_ptr[0] == '\r' || start_ptr[0] == '\n' || start_ptr[0] == '\t' ) ) {
			start_ptr = start_ptr + 1;
			element_len = 0;
			DEBUG("test start_ptr: %i;", start_ptr[0] );
		
		// FOUND MULTILINE COMMENT:
		} else*/ if (int_qs == 0 && int_inputstring_len > 1 && strncmp(ptr_loop, "/*", int_chunk_len + 1) == 0) {
			int_qs = 5;
			DEBUG("found multiline comment");
		
		// ENDING MULTILINE COMMENT
		} else if (int_qs == 5 && int_inputstring_len > 1 && strncmp(ptr_loop, "*/", int_chunk_len + 1) == 0) {
			int_qs = 0;
			DEBUG("found end of multiline comment");
		
		// FOUND DASH COMMENT:
		} else if (int_qs == 0 && int_inputstring_len > 1 && strncmp(ptr_loop, "--", int_chunk_len + 1) == 0) {
			int_qs = 6;
			DEBUG("found dash comment");
		
		// ENDING DASH COMMENT
		} else if (int_qs == 6 && (strncmp(ptr_loop, "\n", int_chunk_len) == 0 || strncmp(ptr_loop, "\r", int_chunk_len) == 0)) {
			int_qs = 0;
			DEBUG("found end of dash comment");
		
		// CONSUME COMMENT
		} else if (int_qs == 6 || int_qs == 5) {
			// this speeds things up but it doesn't consume comments because we can't overwrite the incoming pointer
			// and we don't memcpy one letter at a time, we copy each element as a whole. Trying to get rid of SQL with 
			// only comments in them is going to require a re-write
		
		// FOUND SLASH:  we don't skip slashed chars within dollar tags, double quotes and comments.
		} else if (strncmp(ptr_loop, "\\", int_chunk_len) == 0 && int_qs != 4 && int_qs != 2 && int_qs != 5 && int_qs != 6) {
			// skip next character
			ptr_loop = ptr_loop + int_chunk_len;
			int_inputstring_len -= int_chunk_len;
			int_chunk_len = 1;
			int_element_len += int_chunk_len;
			DEBUG("found slash ptr_loop: %s", ptr_loop);
		
		// FOUND SINGLE QUOTE:
		} else if (int_qs == 0 && strncmp(ptr_loop, "'", int_chunk_len) == 0 ) {
			int_qs = 3;
			DEBUG("found single quote");
		
		// ENDING SINGLE QUOTE
		} else if (int_qs == 3 && strncmp(ptr_loop, "'", int_chunk_len) == 0 ) {
			int_qs = 0;
			DEBUG("found end of single quote");
		
		// FOUND DOUBLE QUOTE:
		} else if (int_qs == 0 && strncmp(ptr_loop, "\"", int_chunk_len) == 0) {
			int_qs = 4;
			DEBUG("found double quote");
		
		// ENDING DOUBLE QUOTE 
		} else if (int_qs == 4 && strncmp(ptr_loop, "\"", int_chunk_len) == 0) {
			int_qs = 0;
			DEBUG("found end of double quote");
		
		// FOUND OPEN PARENTHESIS:
		} else if (int_qs == 0 && strncmp(ptr_loop, "(", int_chunk_len) == 0) {
			int_ps = int_ps + 1;
			DEBUG("found open parenthesis");
		
		// FOUND CLOSE PARENTHESIS 
		} else if (int_qs == 0 && strncmp(ptr_loop, ")", int_chunk_len) == 0 && int_ps > 0) {
			int_ps = int_ps - 1;
			DEBUG("found close parenthesis");
		
		// FOUND DOLLAR TAG START:
		} else if (int_qs == 0 && strncmp(ptr_loop, "$", int_chunk_len) == 0) {
			// we should be looking ahead here. get the tag or if false start then just continue
			char *ptr_test_loop = ptr_loop + 1;
			
			DEBUG("b4 while test_loop_ptr: %s", ptr_test_loop);
			while (match_first_char("^[a-zA-Z0-9_]$", ptr_test_loop)) {
				DEBUG("in while test_loop_ptr: %s", ptr_test_loop);
				ptr_test_loop += 1;
			}
			
			if (strncmp(ptr_test_loop, "$", 1) == 0) {
				int_tag = ptr_test_loop - (ptr_loop - 1);
				DEBUG("int_tag: %i", int_tag);
				ERROR_SREALLOC(str_tag, int_tag + 1);
				memcpy(str_tag, ptr_loop, int_tag);
				str_tag[int_tag] = 0;
				DEBUG("str_tag[0]: %s", str_tag);
				// we found the end of the tag, now look for the close tag
				ptr_loop += int_tag;
				int_inputstring_len -= int_tag;
				int_element_len += int_tag;
				int_qs = 2;
				DEBUG("after ptr_loop: %s", ptr_loop);
			} else {
				// false alarm, do nothing
			}
			
		// END DOLLAR TAG
		} else if (int_qs == 2 && strncmp(ptr_loop, str_tag, int_tag) == 0) { 
			DEBUG("END DOLLAR TAG START: %s", ptr_loop);
			DEBUG("int_tag: %i", int_tag);
			int_qs = 0;
			// move pointer to end of end dollar tag
			int_tag -= 1;
			int_element_len += int_tag;
			ptr_loop += int_tag;
			int_inputstring_len -= int_tag;
			DEBUG("found end dollar tag");
			DEBUG("End dollar tag: 2: end ptr_loop: %s", ptr_loop);
			
		// FOUND AN UNQUOTED/ UNPARENTHESISED SEMICOLON:
		} else if (int_ps == 0 && int_qs == 0 && strncmp(ptr_loop, ";", 1) == 0)  {
			DEBUG("found semicolon;");
			// stash away this array element
			ERROR_SALLOC(str_temp, int_element_len + 1);
			DArray_push(darr_list, str_temp);
			
			memcpy(str_temp, ptr_start, int_element_len);
			str_temp[int_element_len] = 0;
			DEBUG("darr_list[%i]: %s", DArray_count(darr_list), str_temp);
			DEBUG("ptr_start: %s, element_len: %i", ptr_start, int_element_len);
			
			ptr_start = ptr_loop + int_chunk_len;
			int_element_len = 0;
			str_temp = NULL;
		}
		ptr_loop += int_chunk_len;
		int_inputstring_len -= int_chunk_len;
		DEBUG("END: %s, int_ps: %i, int_qs: %i, element_len: %i, inputstring_len: %i",
			ptr_loop, int_ps, int_qs, int_element_len, int_inputstring_len);
	}
	SFREE(str_temp);
	DEBUG("int_element_len: %i, ptr_loop: %s, ptr_start: %s;", int_element_len, ptr_loop, ptr_start);  
	DEBUG("int_ps: %i, int_qs: %i, int_element_len: %i", int_ps, int_qs, int_element_len);
	SFREE(str_tag);
	
	// if we have a trailing SQL statement (or nothing in form data at all)
	if (int_element_len > 0) {
#ifdef UTIL_DEBUG
		ERROR_SALLOC(str_trailing, int_element_len + 1);
		memcpy(str_trailing, ptr_start, int_element_len);
		str_trailing[int_element_len] = '\0';
		DEBUG("Found trailing chars! element_len: %i, trailing: %s", int_element_len, str_trailing);
		DEBUG("int_qs: %i", int_qs);
		DEBUG("ptr_start: %i, ptr_start: %s", ptr_start, ptr_start);
		DEBUG("ptr_loop: %i, ptr_loop: (%s)", ptr_loop, ptr_loop);
#endif /* UTIL_DEBUG */
		// *** up to here ***
		
		// if you are reading this see the comment above marked "consume comment"
		
		// stash away this array element
		
		ERROR_SALLOC(str_temp, int_element_len + 1);
		DArray_push(darr_list, str_temp);
		memcpy(str_temp, ptr_start, int_element_len);
		str_temp[int_element_len] = '\0';
		
		DEBUG("ptr_start: %i", ptr_start);
		DEBUG("ptr_loop: %i", ptr_loop);    
		DEBUG("int_element_len: %i", int_element_len);    
		str_temp = NULL;
		
	}
	//DEBUG("done");
	
	SFREE_ALL();
	return darr_list;
error:
	SFREE_ALL();
	if (darr_list) DArray_clear_destroy(darr_list);
	return NULL;
}
