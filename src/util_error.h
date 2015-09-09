#ifndef UTIL_ERROR_H
#define UTIL_ERROR_H

#include <stdlib.h>
#include <stdbool.h>
#include "util_sunlogf.h"
#include "util_salloc.h"
#include "util_string.h"

bool bol_error_state;

void debug_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...);
#ifdef UTIL_DEBUG
#define DEBUG(M, ...)  debug_root(__FILE__, __LINE__, (char *)__func__, M, ##__VA_ARGS__)
#else
#define DEBUG(M, ...)
#endif /* UTIL_DEBUG */
void var_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...);
#define VAR(M, ...)  var_root(__FILE__, __LINE__, (char *)__func__, M, ##__VA_ARGS__)
void info_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...);
#define INFO(M, ...)  info_root(__FILE__, __LINE__, (char *)__func__, M, ##__VA_ARGS__)
void notice_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...);
#define NOTICE(M, ...)  notice_root(__FILE__, __LINE__, (char *)__func__, M, ##__VA_ARGS__)
void warn_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...);
#define WARN_NORESPONSE(M, ...)  warn_root(__FILE__, __LINE__, (char *)__func__, M, ##__VA_ARGS__);

void error_noresponse_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...);
#define ERROR_NORESPONSE(M, ...)  error_noresponse_root(__FILE__, __LINE__, (char *)__func__, M, ##__VA_ARGS__);
#define ERROR(M, ...)  bol_error_state = true; ERROR_NORESPONSE(M, ##__VA_ARGS__); goto error;

#define WARN(M, ...)  WARN_NORESPONSE(M, ##__VA_ARGS__); goto error;

char *error_response_root(char *str_file, int int_line_no, char *str_function, char *str_error, ...);
#define ERROR_RESPONSE(M, ...)  error_response_root(__FILE__, __LINE__, (char *)__func__, M, ##__VA_ARGS__)
#define FINISH(M, ...)  bol_error_state = true; str_response = ERROR_RESPONSE(M, ##__VA_ARGS__); goto finish;

#define ERROR_CHECK(A, M, ...)  if(!(A)) { ERROR(M, ##__VA_ARGS__); }
#define WARN_CHECK(A, M, ...)  if(!(A)) { WARN(M, ##__VA_ARGS__); }
#define FINISH_CHECK(A, M, ...)  if(!(A)) { FINISH(M, ##__VA_ARGS__); }

#endif /* UTIL_ERROR_H */
