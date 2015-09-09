#include "util_error.h"
bool bol_error_state = false;

void info_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...) {
    va_list va_arg;
	va_start(va_arg, str_error);
	
	sunlogf_root(str_file, int_line_no, str_function, 6, str_error, va_arg);
}

void notice_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...) {
    va_list va_arg;
	va_start(va_arg, str_error);
	
	sunlogf_root(str_file, int_line_no, str_function, 5, str_error, va_arg);
}

void warn_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...) {
    va_list va_arg;
	va_start(va_arg, str_error);
	
	sunlogf_root(str_file, int_line_no, str_function, 4, str_error, va_arg);
}

void debug_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...) {
    va_list va_arg;
	va_start(va_arg, str_error);
	
	sunlogf_root(str_file, int_line_no, str_function, 3, str_error, va_arg);
}

void var_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...) {
    va_list va_arg;
	va_start(va_arg, str_error);
	
	sunlogf_root(str_file, int_line_no, str_function, 2, str_error, va_arg);
}

void error_noresponse_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...) {
    va_list va_arg;
	va_start(va_arg, str_error);
	
	sunlogf_root(str_file, int_line_no, str_function, 1, str_error, va_arg);
}

char *error_response_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...) {
	DEFINE_VAR_ALL(str_full_error, str_json_error);
	char *str_response = NULL;
	
    va_list va_arg;
	va_start(va_arg, str_error);
    va_list va_arg2;
	va_copy(va_arg2, va_arg);
	
	ERROR_SALLOC(str_full_error, 255 + 1);
	vsnprintf(str_full_error, 255, str_error, va_arg2);
	
	str_json_error = jsonify(str_full_error);
	ERROR_CHECK(str_json_error != NULL, "jsonify failed");
	SFREE(str_full_error);
	
	ERROR_CAT_CSTR(str_response, "HTTP/1.1 500 Internal Server Error\r\n\
Content-Type: application/json; charset=UTF-8\r\n\r\n\
{\"stat\": false, \"dat\": {\"error\": ", str_json_error, "}}");
	SFREE(str_json_error);
	
	DEBUG("str_file >%s<", str_file);
	DEBUG("int_line_no >%d<", int_line_no);
	DEBUG("str_function >%s<", str_function);
	DEBUG("str_error >%s<", str_error);
	sunlogf_root(str_file, int_line_no, str_function, 1, str_error, va_arg);
	SFREE_PWORD_ALL();
	return str_response;
error:
	perror("TOTAL FAILURE! CANNOT EVEN ERROR CORRECTLY!");
	SFREE_PWORD_ALL();
	SFREE_PWORD(str_response);
	return NULL;
}
