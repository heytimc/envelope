#ifndef UTIL_SALLOC_H
#define UTIL_SALLOC_H

#include <stdlib.h>
#include "util_sunlogf.h"
#include "util_error.h"

void *salloc(size_t size);
#define ERROR_SALLOC(A, B)     ERROR_CHECK(A = salloc(B), "salloc failed")
#define FINISH_SALLOC(A, B)     FINISH_CHECK(A = salloc(B), "salloc failed")
void *srealloc(void *void_ptr, size_t size);
#define ERROR_SREALLOC(A, B)     ERROR_CHECK(A = srealloc(A, B), "srealloc failed")
#define FINISH_SREALLOC(A, B)     FINISH_CHECK(A = srealloc(A, B), "srealloc failed")

// To free, or not to free, that is the question.
void free_pword(char volatile *pword);

//Macro code taken from https://github.com/pfultz2/Cloak/wiki/C-Preprocessor-tricks,-tips,-and-idioms
//HERE BE DRAGONS
//Maintainer: joseph
//@@@@@@@@@@@@@@@@@@@@@**^^""~~~"^@@^*@*@@**@@@@@@@@@
//@@@@@@@@@@@@@*^^'"~   , - ' '; ,@@b. '  -e@@@@@@@@@
//@@@@@@@@*^"~      . '     . ' ,@@@@(  e@*@@@@@@@@@@
//@@@@@^~         .       .   ' @@@@@@, ~^@@@@@@@@@@@
//@@@~ ,e**@@*e,  ,e**e, .    ' '@@@@@@e,  "*@@@@@'^@
//@',e@@@@@@@@@@ e@@@@@@       ' '*@@@@@@    @@@'   0
//@@@@@@@@@@@@@@@@@@@@@',e,     ;  ~^*^'    ;^~   ' 0
//@@@@@@@@@@@@@@@^""^@@e@@@   .'           ,'   .'  @
//@@@@@@@@@@@@@@'    '@@@@@ '         ,  ,e'  .    ;@
//@@@@@@@@@@@@@' ,&&,  ^@*'     ,  .  i^"@e, ,e@e  @@
//@@@@@@@@@@@@' ,@@@@,          ;  ,& !,,@@@e@@@@ e@@
//@@@@@,~*@@*' ,@@@@@@e,   ',   e^~^@,   ~'@@@@@@,@@@
//@@@@@@, ~" ,e@@@@@@@@@*e*@*  ,@e  @@""@e,,@@@@@@@@@
//@@@@@@@@ee@@@@@@@@@@@@@@@" ,e@' ,e@' e@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@" ,@" ,e@@e,,@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@~ ,@@@,,0@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@,,@@@@@@@@@@@@@@@@@@@@@@@@@
//"""""""""""""""""""""""""""""""""""""""""""""""""""

#define CAT(a, ...) PRIMITIVE_CAT(a, __VA_ARGS__)
#define PRIMITIVE_CAT(a, ...) a ## __VA_ARGS__

#define IIF(c) PRIMITIVE_CAT(IIF_, c)
#define IIF_0(t, ...) __VA_ARGS__
#define IIF_1(t, ...) t

#define COMPL(b) PRIMITIVE_CAT(COMPL_, b)
#define COMPL_0 1
#define COMPL_1 0
#define BITAND(x) PRIMITIVE_CAT(BITAND_, x)
#define BITAND_0(y) 0
#define BITAND_1(y) y

#define INC(x) PRIMITIVE_CAT(INC_, x)
#define INC_0 1
#define INC_1 2
#define INC_2 3
#define INC_3 4
#define INC_4 5
#define INC_5 6
#define INC_6 7
#define INC_7 8
#define INC_8 9
#define INC_9 9

#define DEC(x) PRIMITIVE_CAT(DEC_, x)
#define DEC_0 0
#define DEC_1 0
#define DEC_2 1
#define DEC_3 2
#define DEC_4 3
#define DEC_5 4
#define DEC_6 5
#define DEC_7 6
#define DEC_8 7
#define DEC_9 8

#define CHECK_N(x, n, ...) n
#define CHECK(...) CHECK_N(__VA_ARGS__, 0,)
#define PROBE(x) x, 1,

#define IS_PAREN(x) CHECK(IS_PAREN_PROBE x)
#define IS_PAREN_PROBE(...) PROBE(~)

#define NOT(x) CHECK(PRIMITIVE_CAT(NOT_, x))
#define NOT_0 PROBE(~)

#define BOOL(x) COMPL(NOT(x))
#define IF(c) IIF(BOOL(c))
#define EAT(...)
#define EXPAND(...) __VA_ARGS__
#define WHEN(c) IF(c)(EXPAND, EAT)

#define EMPTY()
#define DEFER(id) id EMPTY()
#define OBSTRUCT(...) __VA_ARGS__ DEFER(EMPTY)()
#define EXPAND(...) __VA_ARGS__

#define PP_ARG0_(arg0, ...) arg0
#define PP_REST_(arg0, ...) __VA_ARGS__
#define PP_ARG0(args) PP_ARG0_ args
#define PP_REST(args) PP_REST_ args

#define EVAL(...)  EVAL1(EVAL1(EVAL1(__VA_ARGS__)))
#define EVAL1(...) EVAL2(EVAL2(EVAL2(__VA_ARGS__)))
#define EVAL2(...) EVAL3(EVAL3(EVAL3(__VA_ARGS__)))
#define EVAL3(...) EVAL4(EVAL4(EVAL4(__VA_ARGS__)))
#define EVAL4(...) EVAL5(EVAL5(EVAL5(__VA_ARGS__)))
#define EVAL5(...) __VA_ARGS__


#define REPEAT(count, macro, ...) \
    WHEN(count) \
    ( \
        OBSTRUCT(REPEAT_INDIRECT) () \
        ( \
            DEC(count), macro, PP_REST_(__VA_ARGS__) \
        ) \
        OBSTRUCT(macro) \
        ( \
            DEC(count), PP_ARG0_(__VA_ARGS__) \
        ) \
    )
#define REPEAT_INDIRECT() REPEAT



//NOBODY CAN EVER USE sun_len OR sun_list
#define DEFINE_VAR_ALL(...) int sun_len = VA_NUM_ARGS(__VA_ARGS__);\
							int old_sun_len = sun_len; if (old_sun_len) {}\
							EVAL(REPEAT(VA_NUM_ARGS(__VA_ARGS__), DEFINE_REPEAT, ##__VA_ARGS__)) \
							char ***sun_list = salloc(sizeof(char **) * VA_NUM_ARGS(__VA_ARGS__)); \
							char **sun_name_list = salloc(sizeof(char *) * VA_NUM_ARGS(__VA_ARGS__)); \
							char ***old_sun_list = {0};if (old_sun_list) {}\
							char **old_sun_name_list = {0};if (old_sun_name_list) {}\
							EVAL(REPEAT(VA_NUM_ARGS(__VA_ARGS__), DEFINE_ADDRESSOF_REPEAT, ##__VA_ARGS__))
#define DEFINE_VAR_MORE(...) old_sun_len = sun_len; \
							sun_len = sun_len + VA_NUM_ARGS(__VA_ARGS__); \
							EVAL(REPEAT(VA_NUM_ARGS(__VA_ARGS__), DEFINE_REPEAT, ##__VA_ARGS__)) \
							old_sun_list = sun_list;\
							old_sun_name_list = sun_name_list;\
							sun_list = salloc(sizeof(char **) * (old_sun_len + VA_NUM_ARGS(__VA_ARGS__))); \
							sun_name_list = salloc(sizeof(char *) * (old_sun_len + VA_NUM_ARGS(__VA_ARGS__))); \
							memcpy(sun_list, old_sun_list, sizeof(char **) * old_sun_len); \
							memcpy(sun_name_list, old_sun_name_list, sizeof(char *) * old_sun_len); \
							SFREE(old_sun_list); \
							SFREE(old_sun_name_list); \
							EVAL(REPEAT(VA_NUM_ARGS(__VA_ARGS__), DEFINE_ADDRESSOF_MORE_REPEAT, ##__VA_ARGS__))

#define STR_VALUE(arg)      #arg
#define DEFINE_ADDRESSOF_REPEAT(A, B) sun_list[A] = &B; sun_name_list[A] = STR_VALUE(B);
#define DEFINE_ADDRESSOF_MORE_REPEAT(A, B) sun_list[old_sun_len + A] = &B; sun_name_list[old_sun_len + A] = STR_VALUE(B);

//WRAP CODE IN BLOCK TO PUT VARIABLES IN SCOPE
#define SFREE_ALL() 		{int i = 0; \
							while (i < sun_len) {\
								if (bol_error_state) {\
									VAR("%s: %s", sun_name_list[i], *sun_list[i]);\
								}\
								SFREE(*sun_list[i]);\
								i++;\
							}}\
							SFREE(sun_list);\
							SFREE(sun_name_list);

//WRAP CODE IN BLOCK TO PUT VARIABLES IN SCOPE
#define SFREE_PWORD_ALL() 	{int i = 0; \
							while (i < sun_len) {\
								SFREE_PWORD(*sun_list[i]);\
								i++;\
							}}\
							SFREE(sun_list);\
							SFREE(sun_name_list);




#define DEFINE_REPEAT(A, B) /*A*/ DEFINE_VAR(B)


#define DEFINE_VAR(A) char *A = NULL;
#define SFREE(A) if (A != NULL) { free(A); A = NULL; }
#define SFREE_PWORD(A) if (A != NULL) { free_pword(A); A = NULL; }

#endif /* UTIL_SALLOC_H */
