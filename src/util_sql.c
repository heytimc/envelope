#include "util_sql.h"

//!! IMPORTANT NOTE ON DDL FUNCTIONS !!
//users with 'developer_g' ALWAYS returns true with ddl_readable and ddl_writeable
//the 'postgres' user ALWAYS returns true with ddl_readable and ddl_writeable
//the 'all' folder ALWAYS returns true with ddl_readable and ddl_writeable

bool ddl_readable(PGconn *cnxn, char *str_path) {
	NOTICE("SQL.C READABLE");
	sun_res *sun_working = NULL;
	bool bol_ret;
	DEFINE_VAR_ALL(str_folder, str_folder_literal, str_sql);
	
	char *ptr_path = str_path;
	if (*ptr_path == '/') {
		ptr_path++;
	}
	char *ptr_slash = strchr(ptr_path, '/');
	int slash_position;
	if (ptr_slash == 0) {
		slash_position = strlen(ptr_path);
	} else {
		slash_position = ptr_slash - ptr_path;
	}
	ERROR_CAT_CSTR(str_folder, ptr_path);
	str_folder[slash_position] = '\0';
	str_folder_literal = PQescapeLiteral(cnxn, str_folder, strlen(str_folder));
	ERROR_CHECK(str_folder_literal != NULL, "PQescapeLiteral failed");
	//DEBUG(">%s|%s<", ptr_path, str_folder);
	SFREE(str_folder);
	if (strncmp(str_current_subdomain, str_current_user, strlen(str_current_user)) != 0) {
		ERROR_CAT_CSTR(str_sql, "\
			SELECT CASE WHEN count(*) > 0 OR 'all' = lower(", str_folder_literal, ") OR \
					lower(", str_folder_literal, ") = lower(session_user) THEN 'TRUE' ELSE 'FALSE' END::text \
			FROM pg_roles r \
			JOIN pg_auth_members ON r.oid=roleid \
			JOIN pg_roles u ON member = u.oid \
			WHERE (lower(r.rolname) = lower(", str_folder_literal, ") OR \
				  lower(r.rolname) = 'developer_g') AND lower(u.rolname) = lower(session_user);");
		//DEBUG(">%s<", str_sql);
		SFREE(str_folder_literal);
		
		ERROR_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		bol_ret = strncmp(sun_working->str_result, "TRUE", 5) == 0;
		SFREE_SUN_RES(sun_working);
	} else {
		WARN_NORESPONSE("str_current_subdomain = str_current_user");
		bol_ret = true;
	}
	INFO("SQL.C READABLE END");
	SFREE_ALL();
	return bol_ret;
error:
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	return false;
}

//return 1 on fail and 0 on success
bool ddl_writeable(PGconn *cnxn, char * str_path) {
	NOTICE("SQL.C WRITEABLE");
	sun_res *sun_working = NULL;
	bool bol_ret;
	DEFINE_VAR_ALL(str_folder, str_folder_write, str_folder_literal, str_folder_write_literal, str_sql);
	//DEBUG(">%s<", str_path);
	// if we start with a slash, remove it
	if (*str_path == '/') {
		str_path++;
	}
	
	char *ptr_slash = strchr(str_path, '/');
	int slash_position;
	if (ptr_slash == 0) {
		slash_position = strlen(str_path);
	} else {
		slash_position = (ptr_slash - str_path);
	}
	
	ERROR_CAT_CSTR(str_folder, str_path);
	str_folder[slash_position] = '\0';
	ERROR_CAT_CSTR(str_folder_write, str_folder);
	str_folder_write[slash_position - 1] = 'w';
	DEBUG("writeable>%i|%s|%s|%s<", slash_position, str_path, str_folder, str_folder_write);
	
	str_folder_literal       = PQescapeLiteral(cnxn, str_folder      , strlen(str_folder      ));
	ERROR_CHECK(str_folder_literal != NULL, "PQescapeLiteral failed");
	str_folder_write_literal = PQescapeLiteral(cnxn, str_folder_write, strlen(str_folder_write));
	ERROR_CHECK(str_folder_write_literal != NULL, "PQescapeLiteral failed");
	SFREE(str_folder);
	SFREE(str_folder_write);
	if (strncmp(str_current_subdomain, str_current_user, strlen(str_current_user)) != 0) {
		ERROR_CAT_CSTR(str_sql, "\
			SELECT CASE WHEN count(*) > 0 OR \
				   lower(", str_folder_literal, ") = lower(session_user) THEN 'TRUE' ELSE 'FALSE' END::text \
			FROM pg_roles r \
			JOIN pg_auth_members ON r.oid=roleid \
			JOIN pg_roles u ON member = u.oid \
			WHERE (lower(r.rolname) = lower(", str_folder_write_literal, ") OR \
				  lower(r.rolname) = 'developer_g') AND lower(u.rolname) = lower(session_user); \
			");
		//DEBUG(">%s<", str_sql);
		SFREE(str_folder_literal);
		SFREE(str_folder_write_literal);
		ERROR_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		bol_ret = strncmp(sun_working->str_result, "TRUE", 5) == 0;
		SFREE_SUN_RES(sun_working);
	} else {
		WARN_NORESPONSE("str_current_subdomain = str_current_user");
		bol_ret = true;
	}
	INFO("SQL.C WRITEABLE END");
	SFREE_ALL();
	return bol_ret;
error:
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	return false;
}

// #######################################################################
// type function, returns list of types, used for postage execute results
char *sun_type(PGconn *cnxn, Oid oid_type, int int_mod) {
	NOTICE("SQL.C TYPE");
	//define str_oid_type
	sun_res *sun_working = NULL;
	DEFINE_VAR_ALL(str_temp, str_oid_type, str_int_mod, str_sql);
	char *str_result = NULL;
	
	ERROR_SALLOC(str_temp, 20);
	sprintf(str_temp, "%d", oid_type);
	str_oid_type = PQescapeLiteral(cnxn, str_temp, strlen(str_temp));
	SFREE(str_temp);
	
	//define str_oid_type
	ERROR_SALLOC(str_temp, 20);
	sprintf(str_temp, "%d", int_mod);
	str_int_mod = PQescapeLiteral(cnxn, str_temp, strlen(str_temp));
	SFREE(str_temp);
	
	//get type
	ERROR_CAT_CSTR(str_sql, "SELECT format_type(", str_oid_type, ", ", str_int_mod, ");");
	SFREE(str_oid_type);
	SFREE(str_int_mod);
	
	ERROR_EXECUTE(sun_working, cnxn, str_sql);
	SFREE(str_sql);
	
	//return
	INFO("SQL.C TYPE END");
	ERROR_CAT_CSTR(str_result, sun_working->str_result);
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	return str_result;
error:
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	return NULL;
}

// ###############################################
// returns first column, first row inside a struct.
//   Also returns result as 'res'.
sun_res *sun_execute(PGconn *cnxn, char *str_sql) {
	NOTICE("SQL.C EXECUTE");
	PGresult *res = NULL;
	sun_res *sun_ret = NULL;
	ERROR_SALLOC(sun_ret, sizeof(sun_res));
	
	res = PQexec(cnxn, str_sql);
	ERROR_CHECK(res != NULL, "PQexec failed");
	sun_ret->bol_status = (PQresultStatus(res) == PGRES_TUPLES_OK ||
						   PQresultStatus(res) == PGRES_COMMAND_OK ||
						   PQresultStatus(res) == PGRES_EMPTY_QUERY);
	sun_ret->str_result = (PQntuples(res) == 0 ||
						   PQresultStatus(res) == PGRES_COMMAND_OK ||
						   PQresultStatus(res) == PGRES_EMPTY_QUERY ? "" :
		PQresultStatus(res) == PGRES_TUPLES_OK ? PQgetvalue(res, 0, 0) :
		PQresultStatus(res) == PGRES_EMPTY_QUERY ? "" :
		PQresultErrorMessage(res));
	sun_ret->res = res;
	//  sun_ret->int_status  // 0 on success, 1 on fail
	//  sun_ret->str_result  // result on success, error message on fail
	//  sun_ret->res // full result 
	
	INFO("SQL.C EXECUTE END");
	return sun_ret;
error:
	SFREE(sun_ret);
	return NULL;
}

// ###############################################
// frees an entire 'sun_execute' including struct
void free_sun_res(sun_res *sun_working) {
	PQclear(sun_working->res);
	SFREE(sun_working);
	//IMPORTANT! DO NOT UNCOMMENT NEXT LINE! DOING A PQclear FREES THE RESULT AUTOMATICALLY
	//free(sun_working->str_result);
}

// ###############################################
// Respond with full error including notices.
//   Send result direct to the socket.
char *_response_full_error(PGresult *res, int bol_response, char *str_sql) {
	char *str_response = NULL;
	char *temp_notice = NULL;
	
	DEFINE_VAR_ALL(return_error, return_detail, return_hint, return_query, return_context, return_err_pos, return_sql);
	
	//get vars with error stuff
	return_error   = PQresultErrorField(res, PG_DIAG_MESSAGE_PRIMARY);
	return_detail  = PQresultErrorField(res, PG_DIAG_MESSAGE_DETAIL);
	return_hint    = PQresultErrorField(res, PG_DIAG_MESSAGE_HINT);
	return_query   = PQresultErrorField(res, PG_DIAG_INTERNAL_QUERY);
	return_context = PQresultErrorField(res, PG_DIAG_CONTEXT);
	return_err_pos = PQresultErrorField(res, PG_DIAG_STATEMENT_POSITION);
	FINISH_CAT_CSTR(temp_notice, "[", (sun_notice != NULL ? sun_notice : ""), "]");
	
	//jsonify vars
	return_error   = return_error   != NULL ? jsonify(return_error  ) : cat_cstr("\"\"");
	return_detail  = return_detail  != NULL ? jsonify(return_detail ) : cat_cstr("\"\"");
	return_hint    = return_hint    != NULL ? jsonify(return_hint   ) : cat_cstr("\"\"");
	return_query   = return_query   != NULL ? jsonify(return_query  ) : cat_cstr("\"\"");
	return_context = return_context != NULL ? jsonify(return_context) : cat_cstr("\"\"");
	return_err_pos = return_err_pos != NULL ? jsonify(return_err_pos) : cat_cstr("\"\"");
	return_sql     = str_sql        != NULL ? jsonify(str_sql       ) : cat_cstr("\"\"");
	
	FINISH_CHECK(return_error   != NULL, "return_error failed"  );
	FINISH_CHECK(return_detail  != NULL, "return_detail failed" );
	FINISH_CHECK(return_hint    != NULL, "return_hint failed"   );
	FINISH_CHECK(return_query   != NULL, "return_query failed"  );
	FINISH_CHECK(return_context != NULL, "return_context failed");
	FINISH_CHECK(return_err_pos != NULL, "return_err_pos failed");
	FINISH_CHECK(return_sql     != NULL, "return_sql failed"    );
	
	DEBUG("postgres execute error\n\
error: %s\ndetail: %s\nhint: %s\n\
query: %s\ncontext: %s\nerr_pos: %s\n\
sql: %s\ntemp_notice: %s\n",
		return_error, return_detail, return_hint,
		return_query, return_context, return_err_pos,
		return_sql, temp_notice);
	
	//build response
	FINISH_CAT_CSTR(str_response, "");
	if (bol_response == 0 || bol_response == 1) {
		FINISH_CAT_APPEND(str_response, "HTTP/1.1 ", (bol_response == 0 ? "200 OK" : "500 Internal Server Error"),
			"\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": false, \"dat\": ");
	}
	FINISH_CAT_APPEND(str_response, "{",
		"\"error\": "  , return_error  , ", ",
		"\"detail\": " , return_detail , ", ",
		"\"hint\": "   , return_hint   , ", ",
		"\"query\": "  , return_query  , ", ",
		"\"context\": ", return_context, ", ",
		"\"err_pos\": ", return_err_pos, ", ",
		"\"sql\": "    , return_sql    , ", ",
		"\"notice\": " , temp_notice,
		(bol_response == 0 || bol_response == 1 ? "" : ", \"type\": \"error\""),
		"}", bol_response == 0 || bol_response == 1 ? "}" : "]}");

finish:
	//free
	SFREE_ALL();
	
	return str_response;
}


// ###############################################
// used to double quote only items that need it
//    --replacement for PQescapeIdentifier 
char *sun_quote_ident(PGconn *conn, const char *str_input, size_t length) {
	int int_escape = 1;
	char *str_return;
	char *end_input = ((char *)str_input) + length;
	char *pstr;
	for (pstr = (char *)str_input;pstr < end_input;pstr++) {
		if (!(
				(*pstr >= 'a' && *pstr <= 'z') ||
				(*pstr >= 'A' && *pstr <= 'Z') ||
				(*pstr >= '0' && *pstr <= '9') ||
				(*pstr == '_')
			 )) {
			int_escape = 0;
			break;
		}
	}
	if (int_escape == 0) {
		str_return = PQescapeIdentifier(conn, str_input, length);
		ERROR_CHECK(str_return != NULL, "PQescapeIdentifier failed");
	} else {
		ERROR_CAT_CSTR(str_return, str_input);
	}
	return str_return;
error:
	SFREE(str_return);
	return NULL;
}

// ###############################################
// used to capture notices on valid cookie connections
//  this allows us to print notices via global
//  variable 'sun_notice'. (definition below)
//  One place we use this is when postage executes
//  arbitrary sql for the user. It also is used for errors.
char *sun_notice = NULL;//DECLARATION IN HEADER FILE, DEFINITION IN SOURCE FILE

void sunNoticeProcessor(void *arg, const char *message) {
	if (*(char *)arg == '\0') {}//gets rid of unused argument warning
	char *temp_json = NULL;
	if (sun_notice == NULL) {
		sun_notice = jsonify((char *)message);
	} else {
		temp_json = jsonify((char *)message);
		ERROR_CAT_APPEND(sun_notice, ", ", temp_json);
		SFREE(temp_json);
	}
	//DEBUG("%s", message);
	return;
error:
	perror("error in sunNoticeProcessor");
}
