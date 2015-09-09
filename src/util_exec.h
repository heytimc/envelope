#ifndef VA_NUM_ARGS
#define     VA_NUM_ARGS(...) VA_NUM_ARGS_IMPL(22,##__VA_ARGS__, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0)

#define     VA_NUM_ARGS_IMPL(_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99,N,...) N

// On August 13, 2015, nunzio made this capable of 100 args because he went past the 48 arg
// limit writing the save config function for the installer
//#define     VA_NUM_ARGS(...) VA_NUM_ARGS_IMPL(11,##__VA_ARGS__, 48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0)
//#define     VA_NUM_ARGS_IMPL(_0,_1,_2,_3,_4,_5,_6,_7,_8,_9,_10,_11,_12,_13,_14,_15,_16,_17,_18,_19,_20,_21,_22,_23,_24,_25,_26,_27,_28,_29,_30,_31,_32,_33,_34,_35,_36,_37,_38,_39,_40,_41,_42,_43,_44,_45,_46,_47,_48,N,...) N

//_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99
#endif
// only want this defined one time

#ifndef UTIL_EXEC_H
#define UTIL_EXEC_H

#include <unistd.h>
#include <string.h>
#include <stdarg.h>
#include <stdlib.h>

#if defined(__linux) || defined(__FreeBSD__)
//linux waitpid
#include <sys/types.h>
#include <sys/wait.h>
#endif

#include "util_canonical.h"
#include "util_string.h"
#include "util_sunlogf.h"
#include "util_salloc.h"

#include	<stdio.h>
#include	<signal.h>

#define	SUN_READ	0
#define	SUN_WRITE	1

#define         sunny_exec(str_user_environment, ...)                 s_exec(str_user_environment, VA_NUM_ARGS(__VA_ARGS__),##__VA_ARGS__)
#define       sunny_return(str_user_environment, ...)          s_exec_return(str_user_environment, VA_NUM_ARGS(__VA_ARGS__),##__VA_ARGS__)
#define  sunny_send_return(str_user_environment, str_stdin_input, ...)     s_exec_send_return(str_user_environment, str_stdin_input, VA_NUM_ARGS(__VA_ARGS__),##__VA_ARGS__)

extern int global_csock;

int s_exec(char *str_user_environment, int args, ... );
char *s_exec_return(char *str_user_environment, int args, ... );
char *s_exec_send_return(char *str_user_environment, char *str_stdin_input, int args, ... );
extern char **environ;
int clearenv(void);
char *file_list_to_json (char *str_content, int int_remove_length);
char *where_is_program(char *str_program_name);
#endif /* UTIL_EXEC_H */

