#include "util_string.h"

char *replace(char *str_input, char *str_find_in, char *str_replace_in, char *str_flags) {
	char *str_return = NULL;
	DEFINE_VAR_ALL(str_buffer, str_find, str_replace);
	
	ERROR_CAT_CSTR(str_return, "");
	ERROR_CAT_CSTR(str_find, str_find_in);
	ERROR_CAT_CSTR(str_replace, str_replace_in);
	if (strchr(str_flags, 'i') != NULL) {
		str_find = str_tolower(str_find);
		str_replace = str_tolower(str_replace);
	}
	
	int int_find_length = strlen(str_find);
	int int_input_length = strlen(str_input);
	
	char *ptr_last_input = str_input;
	char *ptr_input = str_input;
	char *ptr_end_input = str_input + int_input_length;
	int int_buffer_length;
	
	bool bol_continue = true;
	while ((ptr_input = strstr(ptr_input, str_find)) != NULL && bol_continue) {
		//get everything up to the instance of str_find into str_buffer
		int_buffer_length = ptr_input - ptr_last_input;
		ERROR_SALLOC(str_buffer, int_buffer_length + 1);
		memcpy(str_buffer, ptr_last_input, int_buffer_length);
		str_buffer[int_buffer_length] = '\0';
		//append str_buffer and str_replace into str_output
		ERROR_CAT_APPEND(str_return, str_buffer, str_replace);
		SFREE(str_buffer);
		ptr_input += int_find_length;
		ptr_last_input = ptr_input;
		
		if (strchr(str_flags, 'g') == NULL) {
			//this will prevent more than one replacement if there is no global flag
			bol_continue = false;
		}
	}
	
	//get everything up to the end of the input into str_buffer
	//DEBUG("ptr_end_input - ptr_last_input: %d", ptr_end_input - ptr_last_input);
	//DEBUG("ptr_end_input:%s", ptr_end_input);
	//DEBUG("ptr_last_input:%s", ptr_last_input);
	int_buffer_length = ptr_end_input - ptr_last_input;
	ERROR_SALLOC(str_buffer, int_buffer_length + 1);
	memcpy(str_buffer, ptr_last_input, int_buffer_length);
	str_buffer[int_buffer_length] = '\0';
	//append str_buffer into str_output
	ERROR_CAT_APPEND(str_return, str_buffer);
	
	SFREE_ALL();
	SFREE(str_input);
	return str_return;
error:
	SFREE_ALL();
	SFREE(str_return);
	SFREE(str_input);
	return NULL;
}

bool match_first_char(char *str_pattern, const char *str_string) {
	DEFINE_VAR_ALL(str_char);
    //DEBUG("match_one_char");
    int int_status;
    regex_t re;
    regex_t *ptr_re = &re;
    ERROR_SALLOC(str_char, 2);
    str_char[1] = '\0';
	
    memcpy(str_char, str_string, 1);
	
    int_status = regcomp(ptr_re, str_pattern, REG_EXTENDED|REG_NOSUB);
	ERROR_CHECK(int_status == 0, "regcomp failed");
	
    int_status = regexec(ptr_re, str_char, (size_t) 0, NULL, 0);
	ERROR_CHECK(int_status == 0, "regexec failed");
	
    regfree(ptr_re); ptr_re = NULL;
	SFREE(str_char);
    DEBUG("match_one_char END");
    SFREE_ALL();
	return true;
error:
    if (ptr_re) regfree(ptr_re);
    SFREE_ALL();
    return false;
}

// Return 1 for match, 0 for no match.
regmatch_t *sunny_regex(char *str_pattern, char *str_input) {
    DEBUG("sunny_regex");
    int int_status;
    regex_t *re = NULL;
    size_t     nmatch = 1;
    regmatch_t *pmatch = NULL;
	ERROR_SALLOC(re, sizeof(regex_t));
	ERROR_SALLOC(pmatch, sizeof(regmatch_t));
	
    ERROR_CHECK(regcomp(re, str_pattern, REG_EXTENDED) == 0, "sunny_regex comp error");
    int_status = regexec(re, str_input, nmatch, pmatch, 0);
    ERROR_CHECK(int_status == 0 || int_status == REG_NOMATCH, "sunny_regex exec error");
	
    DEBUG("sunny_regex exec return>%d<", int_status);
    DEBUG("sunny_regex END>%d|%d<", pmatch->rm_so, pmatch->rm_eo);
    regfree(re); SFREE(re); re = NULL;
	if (int_status == 0) {
		return pmatch;
	} else {
		SFREE(pmatch);
		return NULL;
	}
error:
    if (re != NULL) {
		regfree(re);
		SFREE(re);
	}
	SFREE(pmatch);
	return NULL;
}

// case uri with percent encoded hex to utf-8
char *uri_to_cstr(char *loop_ptr, int inputstring_len) {
	char    *result_text = NULL;
	char    *result_ptr;
	int	     result_len;
	int	     chunk_len;
	char    *x;
	
	// Dangerous loops ahead. We could go infinite if we aren't
	//   careful. So lets check for interrupts.
	ERROR_SALLOC(result_text, 1);
	result_len = 0;
	char buffer[3];
	buffer[2] = 0;
	
	while (inputstring_len > 0) {
		chunk_len = 1;
		
		//DEBUG("loop_ptr: %s, chunk_len: %i, inputlen: %i", loop_ptr, chunk_len, inputstring_len );
		//DEBUG("result_ptr: %s, result_len: %i ", result_ptr, result_len );
		
		// check for % characters
		//   if found, decode as percent encoded hex
		if ( strncmp(loop_ptr, "%", 1) == 0 ) {
			x = loop_ptr+1;
			//DEBUG("percent detected");
			
			// check if two digits  00..7F  //SELECT net.uri_to_text(E':%20:') => space character;
			if (( strncmp(x, "0", 1) >= 0 && strncmp(x, "7", 1) <= 0 ) &&
                ( ( strncmp(x+1, "0", 1) >= 0 && strncmp(x+1, "9", 1) <= 0 ) ||
                (strncasecmp(x+1, "a", 1) >= 0 && strncasecmp(x+1, "f", 1) <= 0) )) {
				//DEBUG("We have a one byte char. strtol:%ld;", strtol( x, 0, 16) );
				ERROR_SREALLOC(result_text, result_len + 1);
				memcpy( buffer, x, 2 );
				result_text[result_len] = strtol( buffer, 0, 16);
				result_len += 1;
				chunk_len = 3;
			
			// check if four digits C2..DF  //SELECT net.uri_to_text(E':%c4%b3'); => combined ij char
			} else if (( strncasecmp(x, "c", 1) == 0) &&
                ((strncmp(x+1,"2",1) >= 0 && strncmp(x+1, "9", 1) <= 0) ||
                (strncasecmp(x+1, "a", 1) >= 0 && strncasecmp(x+1, "f", 1) <= 0))) {
				//DEBUG("We have a two byte char 'C' x:%s;", x);
				ERROR_SREALLOC(result_text, result_len + 2);
				memcpy( buffer, x, 2 );
				result_text[result_len] = strtol( buffer, 0, 16);
				memcpy( buffer, x+3, 2 );
				result_text[result_len+1] = strtol( buffer, 0, 16);
				result_len += 2;
				chunk_len = 6;
				
			// check if four digits C2..DF
			} else if ((strncasecmp(x, "d", 1) == 0) &&
                ((strncmp(x+1, "0", 1) >= 0 && strncmp(x+1, "9", 1) <= 0) ||
                (strncasecmp(x+1, "a", 1) >= 0 && strncasecmp(x+1, "f", 1) <= 0))) {
				//DEBUG("We have a two byte char 'D'");
				ERROR_SREALLOC(result_text, result_len + 2);
				memcpy( buffer, x, 2 );
				result_text[result_len] = strtol( buffer, 0, 16);
				memcpy( buffer, x+3, 2 );
				result_text[result_len+1] = strtol( buffer, 0, 16);
				result_len += 2;
				chunk_len = 6;
			
			// check if six digits E0, E1..EC, ED, EE..EF   //SELECT net.uri_to_text(E':%ef%b9%a0:'); light ampersand
			} else if ((strncasecmp(x, "e", 1) == 0) &&
                ((strncmp(x+1, "0", 1) >= 0 && strncmp(x+1, "9", 1) <= 0) ||
                (strncasecmp(x+1, "a", 1) >= 0 && strncasecmp(x+1, "f", 1) <= 0))) {
				//DEBUG("We have a three byte char.");
				ERROR_SREALLOC(result_text, result_len + 3);
				memcpy( buffer, x, 2 );
				result_text[result_len] = strtol( buffer, 0, 16);
				memcpy( buffer, x+3, 2 );
				result_text[result_len+1] = strtol( buffer, 0, 16);
				memcpy( buffer, x+6, 2 );
				result_text[result_len+2] = strtol( buffer, 0, 16);
				result_len += 3;
				chunk_len = 9;
			
			// check if eight digits F0, F1..F3, F4  //SELECT net.uri_to_text(E':%f0%9d%90%80:'); bold A
			} else if ((strncasecmp(x, "f", 1) == 0) &&
                ((strncmp(x+1, "0", 1) >= 0 && strncmp(x+1, "4", 1) <= 0))) {
				//DEBUG("We have a four byte char.");
				ERROR_SREALLOC(result_text, result_len + 4);
				memcpy( buffer, x, 2 );
				result_text[result_len] = strtol( buffer, 0, 16);
				memcpy( buffer, x+3, 2 );
				result_text[result_len+1] = strtol( buffer, 0, 16);
				memcpy( buffer, x+6, 2 );
				result_text[result_len+2] = strtol( buffer, 0, 16);
				memcpy( buffer, x+9, 2 );
				result_text[result_len+3] = strtol( buffer, 0, 16);
				result_len += 4;
				chunk_len = 12;
			
			// not a valid character
			} else {
				//DEBUG("Invalid starting character detected. Returning literal percent character.");
				ERROR_SREALLOC(result_text, result_len + chunk_len);
				result_ptr = result_text + result_len;
				memcpy( result_ptr, loop_ptr, chunk_len );
				result_len += chunk_len;
			}
		
		// in case of + return a space
		} else if ( strncmp( loop_ptr, "+", 1) == 0 ) {
			//DEBUG("plus detected");
			ERROR_SREALLOC(result_text, result_len + 1);
			result_ptr = result_text + result_len;
			memcpy( result_ptr, " ", 1 );
			result_len += 1;
		
		// in case of everything else, just add to output as is
		} else {
			//DEBUG("char detected: %s;", loop_ptr);
			ERROR_SREALLOC(result_text, result_len + chunk_len);
			result_ptr = result_text + result_len;
			memcpy(result_ptr, loop_ptr, chunk_len);
			result_len += chunk_len;
		}
		// to debug: uncomment these three lines at the same time:
		//FINISH_SREALLOC(result_text, result_len + 1);
		//result_text[result_len] = 0;
		//DEBUG("result_len: %i, result_text: %s", result_len, result_text );
		
		
		// looping
		loop_ptr += chunk_len;
		inputstring_len -= chunk_len;
	}
	//DEBUG("end");
	ERROR_SREALLOC(result_text, result_len + 1);
	result_text[result_len] = '\0';
	return result_text;
error:
	SFREE(result_text);
	return NULL;
}

// returns unencoded key for value as char
char *getpar(char *query, char *input_key) {
	//@ gets converted into _
	char  *answer;
	char  *end;
	char  *str_result = NULL;
	int    answer_len;
	int    key_len;
	DEFINE_VAR_ALL(key, result);
	
	//do not change original variable, but lets make a new one with the same name
	ERROR_CAT_CSTR(key, input_key, "=");
	key_len = strlen(key);
	
	do {
		//DEBUG("query:%s, key:%s, key_len:%i", query, key, key_len);
		if (strncmp(query, key, key_len) == 0) {
			answer = query + key_len;
			
			// strstr to find answer length.
			end = strstr(answer, "&");
			if (end == 0) {
				str_result = uri_to_cstr(answer, strlen(answer));
				ERROR_CHECK(str_result != NULL, "uri_to_cstr failed");
				SFREE_PWORD_ALL();
				return str_result;
			}
			
			answer_len = end-answer;
			//DEBUG("answer_len: %i", answer_len);
			ERROR_SALLOC(result, answer_len + 1);
			memcpy(result, answer, answer_len);
			result[answer_len] = 0;
			str_result = uri_to_cstr(result, answer_len);
			ERROR_CHECK(str_result != NULL, "uri_to_cstr failed");
			SFREE_PWORD_ALL();
			return str_result;
		
		}
		//DEBUG("rrsg");
		query = strstr(query, "&");
		if (query != 0)
			query += 1; 
	} while (query != 0);
	
	// didn't find anything
	SFREE(key);
	ERROR_CAT_CSTR(str_result, "");
	SFREE_PWORD_ALL();
	return str_result;
error:
	SFREE(str_result);
	SFREE_PWORD_ALL();
	return NULL;
}

// returns port from developers list
char *getport(char *query, char *input_key) {
	//@ gets converted into _
	char *answer;
	char *end;
	char *str_result = NULL;
	int answer_len;
	int key_len;
	DEFINE_VAR_ALL(key, result);
	
	ERROR_CAT_CSTR(key, input_key, ":");
	key_len = strlen(key);
	
	do {
		DEBUG("query:%s, key:%s, key_len:%i", query, key, key_len);
		if (strncmp(query, key, key_len) == 0) {
			answer = query + key_len;
			
			// strstr to find answer length.
			end = strstr(answer, ",");
			if (end == NULL) {
				str_result = uri_to_cstr(answer, strlen(answer));
				ERROR_CHECK(str_result != NULL, "uri_to_cstr failed");
				SFREE_ALL();
				return str_result;
			}
			
			answer_len = end - answer;
			//DEBUG("answer_len: %i", answer_len);
			ERROR_SALLOC(result, answer_len + 1);
			memcpy(result, answer, answer_len);
			result[answer_len] = 0;
			str_result = uri_to_cstr(result, answer_len);
			ERROR_CHECK(str_result != NULL, "uri_to_cstr failed");
			SFREE_ALL();
			return str_result;
		}
		//DEBUG("rrsg");
		query = strstr(query, ",");
		if (query != 0)
			query += 1; 
	} while (query != 0);
	
	// didn't find anything
	ERROR_CAT_CSTR(str_result, "");
	SFREE_ALL();
	return str_result;
error:
	SFREE(str_result);
	SFREE_ALL();
	return NULL;
}

// returns key for value as int
int getint(char *query, char *input_key) {
	char  *answer;
	char  *endptr;
	char  *end;
	DEFINE_VAR_ALL(result, key);
	int    answer_len;
	int    key_len;
	int    ret;
	
	ERROR_CAT_CSTR(key, input_key, "=");
	key_len = strlen(key);
	
	// Dangerous loops ahead. We could go infinite if we aren't
	//   careful. So lets check for interrupts.
	do {
		//DEBUG("query:%s, key:%s, key_len:%i", query, key, key_len);
		if ( strncmp( query, key, key_len ) == 0 ) {
			answer = query + key_len;
			
			// strstr to find answer length.
			end = strstr( answer, "&" );
			if (end == 0) {
				errno = 0;
				ret = strtol(answer, &endptr, 10);
				if ((errno != 0 && ret == 0) || answer == endptr) {
					ERROR("No integer found.");
				}
				SFREE_ALL();
				return ret;
			}
			
			answer_len = end - answer;
			//DEBUG("answer_len: %i", answer_len);
			ERROR_SALLOC(result, answer_len + 1);
			memcpy(result, answer, answer_len);
			result[answer_len] = 0;
			errno = 0;
			ret = strtol(result, &endptr, 10);
			if ((errno != 0 && ret == 0) || result == endptr) {
				DEBUG("No integer found.");
			}
			SFREE_ALL();
			return ret;    
		}
		//DEBUG("rrsg");
		query = strstr(query, "&");
		if (query != 0)
			query += 1;
	} while (query != 0);
	
error:
	SFREE_ALL();
	// didn't find anything
	return -1;
}

char *renew_par_pword(char *str_query, char *str_key, char *str_value) {
	char *str_return = NULL;
	DEFINE_VAR_ALL(str_key_equals);
	ERROR_CAT_CSTR(str_key_equals, str_key, "=");
	if (strncmp(str_query, str_key_equals, strlen(str_key_equals)) == 0) {
		ERROR_CAT_CSTR(str_return, str_key, "=", str_value);
		char *ptr_rest_of_query = strchr(str_query, '&');
		if (ptr_rest_of_query != NULL) {
			ERROR_CAT_APPEND(str_return, ptr_rest_of_query);
		}
	} else {
		SFREE_PWORD(str_key_equals);
		ERROR_CAT_CSTR(str_key_equals, "&", str_key, "=");
		char *ptr_query_key = strstr(str_query, str_key_equals);
		if (ptr_query_key != NULL) {
			int int_beginning_query = (ptr_query_key - str_query);
			ERROR_SALLOC(str_return, (int_beginning_query + 1) * sizeof(char));
			memcpy(str_return, str_query, int_beginning_query);
			str_return[int_beginning_query] = '\0';
			ERROR_CAT_APPEND(str_return, str_key_equals);
			ERROR_CAT_APPEND(str_return, str_value);
			char *ptr_rest_of_query = strchr(ptr_query_key + 1, '&');
			if (ptr_rest_of_query != NULL) {
				ERROR_CAT_APPEND(str_return, ptr_rest_of_query);
			}
		} else {
			ERROR_CAT_CSTR(str_return, str_query);
		}
	}

	SFREE_PWORD_ALL();
	return str_return;
error:
	SFREE_PWORD_ALL();
	return NULL;
}

// cast string to JSON
char *jsonify(char *inputstring) {
	int      inputstring_len;
	char    *str_result = NULL;
	char    *result_ptr;
	char    *loop_ptr;
	int      result_len;
	int      chunk_len;
	
	inputstring_len = strlen(inputstring);
	
	/* return empty array for empty input string */
	if (inputstring_len < 1) {
	    ERROR_CAT_CSTR(str_result, "\"\"");
		return str_result;
	}
	
	// pointer to current location in text input
	loop_ptr = inputstring;  // increments by one character per loop
	
	// Dangerous loops ahead. We could go infinite if we aren't
	//   careful. So lets check for interrupts.
	result_len = 1;
	ERROR_SALLOC(str_result, 1);
	str_result[0] = '"';
	
	while (inputstring_len > 0) {
		chunk_len = 1;
		
		//DEBUG("loop_ptr: %s, chunk_len: %i, inputlen: %i", loop_ptr, chunk_len, inputstring_len );
		//DEBUG("result_ptr: %s, result_len: %i ", result_ptr, result_len );
		
		ERROR_SREALLOC(str_result, result_len + 2);
		result_ptr = str_result + result_len;
		
		// FOUND SLASH:
		if ( strncmp( loop_ptr, "\\", chunk_len ) == 0 ) {
			memcpy( result_ptr, "\\\\", 2 );
			result_len += 2;
		
		// FOUND DOUBLE QUOTE:
		} else if ( strncmp( loop_ptr, "\"", chunk_len ) == 0 ) {
			memcpy( result_ptr, "\\\"", 2 );
			result_len += 2;
		
		// FOUND REV SLASH:
		} else if ( strncmp( loop_ptr, "/", chunk_len ) == 0 ) {
			memcpy( result_ptr, "\\/", 2 );
			result_len += 2;
		
		// FOUND CHR(13):
		} else if ( strncmp( loop_ptr, "\r", chunk_len ) == 0 ) {
			memcpy( result_ptr, "\\r", 2 );
			result_len += 2;
		
		// FOUND CHR(10):
		} else if ( strncmp( loop_ptr, "\n", chunk_len ) == 0 ) {
			memcpy( result_ptr, "\\n", 2 );
			result_len += 2;
		
		// FOUND TAB:
		} else if ( strncmp( loop_ptr, "\t", chunk_len ) == 0 ) {
			memcpy( result_ptr, "\\t", 2 );
			result_len += 2;
		
		// FOUND FORMFEED:
		} else if ( strncmp( loop_ptr, "\f", chunk_len ) == 0 ) {
			memcpy( result_ptr, "\\f", 2 );
			result_len += 2;
		
		// FOUNDBACKSPACE:
		} else if ( strncmp( loop_ptr, "\b", chunk_len ) == 0 ) {
			memcpy( result_ptr, "\\b", 2 );
			result_len += 2;
		
		} else {
			// NORMAL CHAR:
			memcpy( result_ptr, loop_ptr, chunk_len );
			result_len += chunk_len;
		}
		
		// to debug: uncomment all three lines at the same time:
		//FINISH_SREALLOC(result_text, result_len + 1);
		//result_text[result_len] = 0;
		//DEBUG("result_len: %i, result_text: %s", result_len, result_text );
		
		// looping
		loop_ptr += chunk_len;
		inputstring_len -= chunk_len;
	}
	//DEBUG("end");
	ERROR_SREALLOC(str_result, result_len + 2);
	str_result[result_len] = 34; // dbl quote(")
	str_result[result_len+1] = 0; // null term(\0)
	return str_result;
error:
	SFREE(str_result);
	return NULL;
}

/*
 * c string concatenation for building commands in a way
 *      that is more easy to read than nesting 
 */
char *c_cat(int args, ...) {
	va_list ap;
	va_list bp;
	//va_list cp;
	char *str_result;
	
	int i;
	va_start (ap, args);
	va_copy (bp, ap);
	//va_copy (cp, ap);
	int total_len = 0;
	int lengths[args];
	
	// store lengths for the args
	for (i = 0; i < args; i = i + 1) {
		char *temp = va_arg(ap, char *);
		int len;
		if (temp) {
			len = strlen(temp);
		} else {
			len = 0;
		}
		lengths[i] = len;
		total_len += len;
		//DEBUG("total len:%d", total_len );
	}
	va_end (ap);
	
	// allocate a field large enough for everything
	ERROR_SALLOC(str_result, total_len + 1);
	char *result = str_result;
	char *temp_ptr;
	
	// fill the new field
	for (i = 0; i < args; i = i + 1) {
		temp_ptr = va_arg(bp, char *);
		if ( lengths[i] > 0 ) {
			//DEBUG("\nlengths[i]: %i", lengths[i]);
			memcpy(result, temp_ptr, lengths[i]);
			result += lengths[i];
		}
		//DEBUG("\ni: %i, lengths:%d   result:%s   output_len:%d   output:%s;", i, lengths[i], result, strlen(output), output );
		//DEBUG("\nva_arg(cp, char *):%s:\n", va_arg(cp, char *));
	}
	
	// add a null terminator
	*result = '\0';
	va_end (bp);
	
	return str_result;
error:
	SFREE(str_result);
	return NULL;
}

/*
 * c string concatenation for building commands in a way
 *      that is more easy to read than nesting 
 */
//cat_append is just like cat_cstr except the first argument is free()d
char *c_append ( int args, ...) {
	va_list ap;
	va_list bp;
	//va_list cp;
	char *str_result;
	
	int i;
	va_start (ap, args);
	va_copy (bp, ap);
	//va_copy (cp, ap);
	int total_len = 0;
	int lengths[args];
	
	// store lengths for the args
	for (i = 0; i < args; i = i + 1) {
		int len = strlen(va_arg (ap, char *));
		lengths[i] = len;
		total_len += len;
		//DEBUG("i:%d\n", i );
		//DEBUG("total len:%d", total_len );
	}
	va_end (ap);
	
	// allocate a field large enough for everything
	ERROR_SALLOC(str_result, total_len + 1);
	char *result = str_result;
	char * temp_ptr;
	
	// fill the new field
	for (i = 0; i < args; i = i + 1) {
		temp_ptr = va_arg(bp, char *);
		if ( lengths[i] > 0 ) {
		  //DEBUG("\nlengths[i]: %i", lengths[i]);
		  memcpy( result, temp_ptr, lengths[i] );
		  result += lengths[i];
		}
		
		//free first arg
		//INFO("OUTSIDE %i", i);
		if (i == 0) {
			//INFO("INSIDE %i", i);
			SFREE(temp_ptr);
		}
		//DEBUG("\ni: %i, lengths:%d   result:%s   output_len:%d   output:%s;", i, lengths[i], result, strlen(output), output );
		//DEBUG("\nva_arg(cp, char *):%s:\n", va_arg(cp, char *));
	}
	
	// add a null terminator
	*result = '\0';
	va_end (bp);
	
	return str_result;
error:
	SFREE(str_result);
	return NULL;
}

char *c_char_append(char *str_input, char chr_input) {
	int int_length = strlen(str_input);
	ERROR_SREALLOC(str_input, int_length + 2);
	str_input[int_length + 0] = chr_input;
	str_input[int_length + 1] = '\0';
	
	return str_input;
error:
	return NULL;
}

/* upper-cases s in place */
char *str_toupper(char *str) {
    char *s = str;
    while(*s) {
        *s=toupper(*s);
        s++;
    }
    return str;
}

/* lower-cases s in place */
char *str_tolower(char *str) {
    char *s = str;
    while(*s) {
        *s=tolower(*s);
        s++;
    }
    return str;
}

/* filename to file extension to content type */
char *contenttype(char *str_filename) {
    char *str_ptr_fileextension = strrchr(str_filename, '.');
	ERROR_CHECK(str_ptr_fileextension, "strrchr failed, no '.'?");
	str_ptr_fileextension = str_ptr_fileextension + 1;
	return strncmp(str_ptr_fileextension, "js"   , 2) == 0 ? "application/javascript" :
		   strncmp(str_ptr_fileextension, "css"  , 3) == 0 ? "text/css" :
		   strncmp(str_ptr_fileextension, "html" , 4) == 0 ? "text/html" :
		   strncmp(str_ptr_fileextension, "htm"  , 3) == 0 ? "text/html" :
		   strncmp(str_ptr_fileextension, "gif"  , 3) == 0 ? "image/gif" :
		   strncmp(str_ptr_fileextension, "txt"  , 3) == 0 ? "text/plain" :
		   strncmp(str_ptr_fileextension, "csv"  , 3) == 0 ? "text/csv" :
		   strncmp(str_ptr_fileextension, "ps"   , 2) == 0 ? "application/postscript" :
		   strncmp(str_ptr_fileextension, "pdf"  , 3) == 0 ? "application/pdf" :
		   strncmp(str_ptr_fileextension, "jpg"  , 3) == 0 ? "image/jpeg" :
		   strncmp(str_ptr_fileextension, "zip"  , 3) == 0 ? "application/zip" :
		   strncmp(str_ptr_fileextension, "gzip" , 4) == 0 ? "application/x-gzip" :
		   strncmp(str_ptr_fileextension, "jpeg" , 4) == 0 ? "image/jpeg" :
		   strncmp(str_ptr_fileextension, "png"  , 3) == 0 ? "image/png" :
		   strncmp(str_ptr_fileextension, "tiff" , 4) == 0 ? "image/tiff" :
		   strncmp(str_ptr_fileextension, "svg"  , 3) == 0 ? "image/svg+xml" :
		   strncmp(str_ptr_fileextension, "ico"  , 3) == 0 ? "image/vnd.microsoft.icon" :
		   // HARK YE ONLOOKER: THESE ARE NOT NEEDED AND MIGHT BE THE CAUSE OF A CRASH
		   //strncmp(str_ptr_fileextension, "woff" , 4) == 0 ? "application/x-font-woff" :
		   //strncmp(str_ptr_fileextension, "woff2", 5) == 0 ? "application/x-font-woff" :
		   "text/plain";
error:
	return NULL;
}

char *cstr_to_uri(char *str_input) {
	char *str_result = NULL;
	
	ERROR_CAT_CSTR(str_result, "");
	char str_temp[10];
	
	char *ptr_input = str_input;
	for (; *ptr_input; ptr_input++) {
		sprintf(str_temp, "%%%02X", *ptr_input);
		ERROR_CAT_APPEND(str_result, str_temp);
	}
	return str_result;
error:
	SFREE(str_result);
	return NULL;
}

//binary version of strstr
char *bstrstr (char *buff1, int len1, char *buff2, int len2) {
  // WE RETURN THE FIRST ARGUMENT, USER NEEDS TO FREE BOTH BUFFERS THEMSELVES
	if (! buff1) return (char *)NULL;
	if (! buff2) return (char *)NULL;
	if (len1 == 0) return (char *)NULL;
	if (len2 == 0) return (char *)NULL;
	if (len1 < len2) return (char *)NULL;
	int i;
	for (i = 0; i <= (len1 - len2); i++) {
		if (memcmp(buff1 + i, buff2, len2) == 0) {
			return buff1 + i;
		}
	}
	
	return (char *)NULL;
}

/* Expands a parameter value for a connection info string
*
* src must be a C-string with a NUL terminator
*/
char *escape_conninfo_value(char *str_src) {
	char *str_result;
	
	ERROR_SALLOC(str_result, (strlen(str_src) * 2) + 3);
	char *ptr_dest = str_result;
	if (strlen(str_src) == 0) {
		ERROR_NORESPONSE("escape_conninfo_value: strlen = 0");
		*str_result = '\0';
		return str_result;
	}
	
	*(ptr_dest++) = '\'';
	char c;
	
	while ((c = *(str_src++))) {
		switch(c) {
			case '\\':
				*(ptr_dest++) = '\\';
				*(ptr_dest++) = '\\';
				break;
			case '\'':
				*(ptr_dest++) = '\\';
				*(ptr_dest++) = '\'';
				break;
			default:
				*(ptr_dest++) = c;
		}
	}
	
	*(ptr_dest++) = '\'';
	*ptr_dest = '\0'; /* Ensure nul terminator */
	
	return str_result;
error:
	SFREE(str_result);
	return NULL;
}

//string to array of strings
//see text_sort function for example
/*size_t explode(const char *delim, char *str, char **pointers_out, char *bytes_out) {
    size_t delim_length = strlen(delim);
    char **pointers_out_start = pointers_out;
	
	if (delim_length == 0) {
		ERROR_NORESPONSE("explode: Must send delimeter");
		return 0;
	}

    for (;;) {
        // Find the next occurrence of the item delimiter. //
        char *delim_pos = strstr(str, delim);

        //
        // Emit the current output buffer position, since that is where the
        // next item will be written.
        ///
        *pointers_out++ = bytes_out;

        if (delim_pos == NULL) {
            //
            // No more item delimiters left.  Treat the rest of the input
            // string as the last item.
            ///
            strcpy(bytes_out, str);
            return pointers_out - pointers_out_start;
        } else {
            //
            // Item delimiter found.  The bytes leading up to it form the next
            // string.
            ///
            while (str < delim_pos) {
                *bytes_out++ = *str++;
			}
			
            // Don't forget the NUL terminator. //
            *bytes_out++ = '\0';

            // Skip over the delimiter. //
            str += delim_length;
        }
    }
}*/

// You must Darray_clear_destroy what this returns (unless it fails)
DArray *split_cstr(char *str_to_split, const char *str_delim) {
    DArray *darr_ret = DArray_create(1, sizeof(char *));
    
    char *str = NULL;
    char *ptr_start = NULL;
    char *ptr_end = NULL;
    char *ptr_delim_pos = NULL;
    char *str_temp = NULL;
    ERROR_CAT_CSTR(str, str_to_split);
    ptr_start = str;
    
    int int_length = strlen(str);
    int int_delim_length = strlen(str_delim);
    ptr_end = str + int_length;
    
    while (str < ptr_end) {
        ptr_delim_pos = strstr(str, str_delim);
        if (ptr_delim_pos == NULL) {
            ptr_delim_pos = ptr_end;
        }
        *ptr_delim_pos = '\0';
        
        ERROR_CAT_CSTR(str_temp, str);
        DArray_push(darr_ret, str_temp);
        str_temp = NULL;
        
        str = ptr_delim_pos + int_delim_length;
    }
    
    SFREE(ptr_start);
    
    return darr_ret;
error:
    SFREE(ptr_start);
    
    return NULL;
}
