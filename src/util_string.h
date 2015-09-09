#ifndef VA_NUM_ARGS
#define     VA_NUM_ARGS(...) VA_NUM_ARGS_IMPL(22,##__VA_ARGS__, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0)

#define     VA_NUM_ARGS_IMPL(_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99,N,...) N

// On August 13, 2015, nunzio made this capable of 100 args because he went past the 48 arg
// limit writing the save config function for the installer
//#define     VA_NUM_ARGS(...) VA_NUM_ARGS_IMPL(11,##__VA_ARGS__, 48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0)
//#define     VA_NUM_ARGS_IMPL(_0,_1,_2,_3,_4,_5,_6,_7,_8,_9,_10,_11,_12,_13,_14,_15,_16,_17,_18,_19,_20,_21,_22,_23,_24,_25,_26,_27,_28,_29,_30,_31,_32,_33,_34,_35,_36,_37,_38,_39,_40,_41,_42,_43,_44,_45,_46,_47,_48,N,...) N

#endif
// only want this defined one time

#ifndef UTIL_STRING_H
#define UTIL_STRING_H

#include <stdio.h>
#include <string.h>
#include <stdarg.h>
#include <regex.h>
#include <errno.h>
#include <ctype.h>
#include <stdbool.h>

#include "util_darray.h"
#include "util_sunlogf.h"
#include "util_salloc.h"

char *replace(char *str_input, char *str_find, char *str_replace, char *str_flags);
bool match_first_char(char *str_pattern, const char *str_string);
regmatch_t *sunny_regex(char *str_pattern, char *str_input);
char *uri_to_cstr(char *ptr_loop, int int_inputstring_len);
char *getport(char *query, char *key);
char *getpar(char *query, char *key);
int getint(char *query, char *key);
char *renew_par_pword(char *str_query, char *str_key, char *str_value);

char *jsonify(char *inputstring);
char *c_cat(int args, ...);
char *c_append(int args, ...);
char *c_char_append(char *str_input, char chr_input);
char *str_tolower(char *str);
char *str_toupper(char *str);
char *contenttype(char *str_filename);
char *cstr_to_uri(char *str_input);
char *bstrstr (char *buff1, int len1, char *buff2, int len2);
char *escape_conninfo_value(char *src);
DArray *split_cstr(char *str_to_split, const char *str_delim);
//size_t explode(const char *delim, char *str, char **pointers_out, char *bytes_out);

#define     cat_cstr(...)             c_cat(VA_NUM_ARGS(__VA_ARGS__),##__VA_ARGS__)
#define  ERROR_CAT_CSTR(A, ...)    ERROR_CHECK(A = cat_cstr(__VA_ARGS__), "cat_cstr failed")
#define FINISH_CAT_CSTR(A, ...)   FINISH_CHECK(A = cat_cstr(__VA_ARGS__), "cat_cstr failed")

#define     cat_append(...)           c_append(VA_NUM_ARGS(__VA_ARGS__),##__VA_ARGS__)
#define  ERROR_CAT_APPEND(A, ...)    ERROR_CHECK(A = cat_append(A, __VA_ARGS__), "cat_append failed")
#define FINISH_CAT_APPEND(A, ...)   FINISH_CHECK(A = cat_append(A, __VA_ARGS__), "cat_append failed")

#define     cat_char_append(A, B)           c_char_append(A, B)
#define  ERROR_CAT_CHAR_APPEND(A, B)    ERROR_CHECK(A = cat_char_append(A, B), "cat_char_append failed")
#define FINISH_CAT_CHAR_APPEND(A, B)   FINISH_CHECK(A = cat_char_append(A, B), "cat_char_append failed")

#define  ERROR_REPLACE(A, B, C, D)    ERROR_CHECK(A = replace(A, B, C, D), "replace failed")
#define FINISH_REPLACE(A, B, C, D)   FINISH_CHECK(A = replace(A, B, C, D), "replace failed")

//cat_append is just like cat_cstr except the first argument is free()d

#endif /* UTIL_STRING_H */
