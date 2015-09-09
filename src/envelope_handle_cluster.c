#include "envelope_handle_cluster.h"

//respond with partial error
char *link_cluster(PGconn *cnxn, char *str_uri, char *str_request, int csock) {
	char *str_response = NULL;
	NOTICE("REQUEST TYPE: CLUSTER");
	DEFINE_VAR_ALL(str_uri_part, str_uri_part_literal, str_form_data, str_temp_path);
	DEFINE_VAR_MORE(str_query, str_sql, str_result, str_type);
	sun_res *sun_working = NULL;
    char *ptr_uri = str_uri + 9; //go past /cluster/
	
	DEBUG("ptr_uri: %s", ptr_uri);
	
    //int uri_len = strcspn(ptr_uri, "?");
	
    int int_uri_len = strcspn(ptr_uri, "/?");
	
    FINISH_SALLOC(str_uri_part, int_uri_len + 1);
    memcpy(str_uri_part, ptr_uri, int_uri_len);
    str_uri_part[int_uri_len] = '\0';
    
	char *str_uri_path = ptr_uri + int_uri_len;
	int int_uri_path_len = strcspn(str_uri_path, "?");
	//if there is something after the function name, then also send path=& to function
	if (int_uri_path_len > 0) {
		FINISH_SALLOC(str_temp_path, int_uri_path_len + 1);
		memcpy(str_temp_path, str_uri_path, int_uri_path_len);
		str_temp_path[int_uri_path_len] = '\0';
		str_query = query(str_request);
		FINISH_CHECK(str_query != NULL, "str_query failed");
		FINISH_CAT_CSTR(str_form_data, "path=", str_temp_path, "&", str_query);
		SFREE(str_temp_path);
		SFREE(str_query);
	} else {
		str_form_data = query(str_request);
		FINISH_CHECK(str_form_data != NULL, "str_query failed");
	}
	
	
	
    DEBUG("str_form_data:>%s<", str_form_data);
    char *str_temp = str_form_data;
    str_form_data = PQescapeLiteral(cnxn, str_temp, strlen(str_temp));
	FINISH_CHECK(str_form_data != NULL, "PQescapeLiteral failed");
    SFREE(str_temp);
    DEBUG("str_uri_part: %s", str_uri_part);
    DEBUG("str_form_data: %s", str_form_data);
	
	FINISH_CHECK(strstr(ptr_uri, ".") != NULL, "must be schema.function not function");
	
	INFO("REQUEST CLUSTER %s", str_uri_part);
	
    // handle ACTIONS: /cluster/schema.ACTION_xxxxx
    if (strncmp((strstr(ptr_uri, ".") + 1), "action_"  , 7) == 0 ||
		strncmp((strstr(ptr_uri, ".") + 1), "actionnc_", 9) == 0) {
		FINISH_CAT_CSTR(str_sql, "SELECT ", str_uri_part, "(", str_form_data, ") AS result;");
		SFREE(str_form_data);
		
		FINISH_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n", 
			"{\"stat\": true, \"dat\": ", sun_working->str_result, "}");
		SFREE_SUN_RES(sun_working);
		
		DEBUG("ACTION_ END");
	
    // handle RESPONSES: /cluster/schema.RESPONSE_xxxxx
    } else if (strncmp((strstr(ptr_uri, ".") + 1), "accept_"  , 7) == 0 ||
			   strncmp((strstr(ptr_uri, ".") + 1), "acceptnc_", 9) == 0) {
		str_uri_part_literal = PQescapeLiteral(cnxn, str_uri_part, strlen(str_uri_part));
		FINISH_CAT_CSTR(str_sql, "SELECT typname ",
			"FROM pg_catalog.pg_proc ",
			"LEFT JOIN pg_catalog.pg_namespace ON pg_namespace.oid = pg_proc.pronamespace ",
			"LEFT JOIN pg_catalog.pg_type ON pg_type.oid = pg_proc.prorettype ",
			"WHERE ", str_uri_part_literal, " = pg_namespace.nspname || '.' || pg_proc.proname;");
		SFREE(str_uri_part_literal);
		FINISH_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		
		FINISH_CAT_CSTR(str_type, sun_working->str_result);
		if (strncmp(str_type, "bytea", 6) == 0) {
			FINISH_CAT_CSTR(str_sql, "SELECT encode(", str_uri_part, "(", str_form_data, "), 'base64') AS result;");
		} else {
			FINISH_CAT_CSTR(str_sql, "SELECT ", str_uri_part, "(", str_form_data, ") AS result;");
		}
		SFREE_SUN_RES(sun_working);
		
		SFREE(str_form_data);
		
		FINISH_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		
		int int_ret_len = PQgetlength(sun_working->res, 0, 0);
		DEBUG("int_ret_len: %d, sun_working->str_result: %s", int_ret_len, sun_working->str_result);
        DEBUG(">%s<", "NEWLINE>\n<NEWLINE");
		
		if (strncmp(str_type, "bytea", 6) == 0) {
			str_result = b64decode(sun_working->str_result, &int_ret_len);
			FINISH_CHECK(str_result != NULL, "b64decode failed");
		} else {
			FINISH_CAT_CSTR(str_result, sun_working->str_result);
		}
		SFREE(str_type);
		SFREE_SUN_RES(sun_working);
		
        write(csock, str_result, int_ret_len + 1);
		SFREE(str_result);
		
		FINISH_CAT_CSTR(str_response, "");
		DEBUG("ACCEPT_ END");
		
    } else {
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 500 Internal Server Error\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n", 
        "{\"stat\": true, \"dat\": \"Function must start with action_, actionnc_, accept_, acceptnc_\"}");
	}
finish:
	SFREE_ALL();
	SFREE_SUN_RES(sun_working);
	return str_response;
}