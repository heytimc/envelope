#ifndef UTIL_SQL_H
#define UTIL_SQL_H

#include <stdio.h>
#include <string.h>
#include <syslog.h>
#include <libpq-fe.h>

#include "util_sunlogf.h"
#include "util_string.h"
#include "util_salloc.h"
#include "envelope_config.h"

// ddl functions
bool ddl_readable(PGconn *cnxn, char * str_path);
bool ddl_writeable(PGconn *cnxn, char * str_path);

// type function
char *sun_type(PGconn *cnxn, Oid oid_type, int int_mod);

//sql execute function
typedef struct {
	bool bol_status;
	char *str_result;
	PGresult *res;
} sun_res;
sun_res *sun_execute(PGconn *cnxn, char * str_sql);
//ERROR_EXECUTE and FINISH_EXECUTE do the same thing as
//A = sun_execute(B, C);
//but with error checking
#define ERROR_EXECUTE(A, B, C)   A = sun_execute(B, C); if (! A->bol_status) { ERROR(A->str_result); }
#define FINISH_EXECUTE(A, B, C)  A = sun_execute(B, C); if (! A->bol_status) { str_response = response_full_error(A->res); goto finish; }
void free_sun_res(sun_res *sun_working);
#define SFREE_SUN_RES(A) if (A != NULL) { free_sun_res(A); A = NULL; }

//functions that return a response
char *_response_full_error(PGresult *res, int bol_response, char *str_sql);
#define response_full_error(A)      _response_full_error(A, 1, "");

//replacement for PQescapeIdentifier
char *sun_quote_ident(PGconn *conn, const char *str_input, size_t length);

//postgresql notice processing
extern char *sun_notice;//DECLARATION IN HEADER FILE, DEFINITION IN SOURCE FILE
void sunNoticeProcessor(void *arg, const char *message);

#endif /* UTIL_SQL_H */
