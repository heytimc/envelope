#include "envelope_handle_public.h"

char *main_public_action(PGconn *cnxn, int csock, char *str_uri_part, char *str_request, int int_len_request, char *str_subdomain) {
	char *str_response = NULL;
	sun_res *sun_working = NULL;
	NOTICE("REQUEST IS PUBLIC");
	DEFINE_VAR_ALL(str_view, str_view_copy, str_sql, str_where);
	DEFINE_VAR_MORE(str_cols, str_view_literal, str_form_data);
	
    str_form_data = query(str_request);
	
	if (strncmp(str_uri_part, "/v1/env/", 8) == 0) {
		str_uri_part += 8;
	} else if (strncmp(str_uri_part, "/v1/envelope/", 13) == 0) {
		str_uri_part += 13;
	} else if (strncmp(str_uri_part, "/v1/cluster/", 12) == 0) {
		return link_cluster(cnxn, str_uri_part + 3, str_request, csock);
	}
	
    if (strncmp(str_uri_part, "action_select", 14) == 0 ||
		strncmp(str_uri_part, "action_insert", 14) == 0 ||
		strncmp(str_uri_part, "action_update", 14) == 0 ||
		strncmp(str_uri_part, "action_delete", 14) == 0 ||
		strncmp(str_uri_part, "action_order" , 13) == 0) {
		//view must start with anc_
		str_view = getpar(str_form_data, "src");
		if (str_view == NULL || strlen(str_view) < 1) {
			str_view = getpar(str_form_data, "view");
		}
		FINISH_CHECK(str_view != NULL, "getpar failed");
		FINISH_CHECK(strlen(str_view) > 0, "no src argument");
		
		//does view or table exist
		str_view_literal = PQescapeLiteral(cnxn, str_view, strlen(str_view));
		FINISH_CAT_CSTR(str_sql,
			"SELECT CASE WHEN count(*) > 0 THEN 'TRUE' ELSE 'FALSE' END AS result ",
			"FROM pg_catalog.pg_class ",
			"LEFT JOIN pg_catalog.pg_namespace ON pg_class.relnamespace = pg_namespace.oid ",
			"WHERE (pg_namespace.nspname || '.' || pg_class.relname = ", str_view_literal, " ",
			"OR (pg_namespace.nspname ILIKE 'pg_temp_%' AND pg_class.relname = ", str_view_literal, "));");
		SFREE(str_view_literal);
		FINISH_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		FINISH_CHECK(strncmp(sun_working->str_result, "TRUE", 5) == 0,
			"View or Table does not exist, cannot use arbitrary sql. This feature requires you to login.");
		SFREE_SUN_RES(sun_working);
		
		//view must start with anc_
		FINISH_CHECK((strstr(str_view, ".anc_") > str_view) || strncmp(str_view, "anc_", 4) == 0,
			"Cannot use views that don't start with 'anc_'. This feature requires you to login.");
		SFREE(str_view);
	}
	
    // postage data service functions
    if (strncmp(str_uri_part, "action_update", 14) == 0) {
        str_response = action_update(cnxn, str_form_data);
		
    } else if (strncmp(str_uri_part, "action_select", 14) == 0) {
		//where clause cannot have ()
		str_where = getpar(str_form_data, "where");
		FINISH_CHECK(str_where != NULL, "getpar failed");
		FINISH_CHECK(strchr(str_where, '(') > str_where && strchr(str_where, ')') > str_where,
			"Where clause cannot have parenthesis. This feature requires you to login.");
		
		//cannot have cols clause cannot have ()
		str_cols = getpar(str_form_data, "cols");
		FINISH_CHECK(str_cols != NULL, "getpar failed");
		FINISH_CHECK(strlen(str_cols),
			"Cannot set columns. This feature requires you to login.");
		
        str_response = action_select(cnxn, csock, str_form_data);
		
    } else if (strncmp(str_uri_part, "action_delete", 14) == 0) {
        str_response = action_delete(cnxn, str_form_data);
		
    } else if (strncmp(str_uri_part, "action_insert", 14) == 0) {
        str_response = action_insert(cnxn, str_form_data);
		
	//action order only uses envelope, action_order must be fixed before public can use it
    } else if (strncmp(str_uri_part, "action_order", 13) == 0) {
        str_response = action_order(cnxn, str_form_data);
		
    } else if (strncmp(str_uri_part, "action_info", 12) == 0) {
        str_response = action_info(cnxn, str_form_data, str_request);
		
    } else if (strncmp(str_uri_part, "action_upload", 14) == 0) {
        str_response = link_upload(cnxn, str_request, int_len_request, str_subdomain);
		
    } else if (strncmp(str_uri_part, "accept_download", 15) == 0) {
        str_response = accept_download(cnxn, csock, str_request, str_uri_part, str_subdomain);
		
    } else {
        FINISH_CAT_CSTR(str_response, "HTTP/1.1 500 Internal Server Error\r\n",
            "Content-Type: application/json; charset=UTF-8\r\n\r\n",
            "{\"stat\": false, \"dat\": {\"error\": \"This action requires you to login.\"}}");
    }
finish:
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	return str_response;
}
