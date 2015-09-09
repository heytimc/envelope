#include "envelope_handle_c.h"

char *link_system(PGconn *cnxn, int csock, char *str_uri, char *str_request, int int_len_request, char *str_subdomain) {
    DEBUG("C REQUEST");
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_form_data, str_uri_part);
	
    char *ptr_uri = str_uri + 5; //go past /env/
    int int_uri_len = strcspn(ptr_uri, "?");
    FINISH_SALLOC(str_uri_part, int_uri_len + 1);
    memcpy(str_uri_part, ptr_uri, int_uri_len);
    str_uri_part[int_uri_len] = '\0';
	
    DEBUG("str_uri_part: %s", str_uri_part);
    
    str_form_data = query(str_request);
    DEBUG("str_form_data: %s", str_form_data);
	
    str_response = main_action(cnxn, csock, str_uri_part, str_form_data, str_request, int_len_request, str_subdomain);
finish:
    SFREE_ALL();
	return str_response;
}

//no way to call a dynamic function name with a variable, so we're cheating =)
char *main_action(PGconn *cnxn, int csock, char *str_uri_part, char *str_form_data, char *str_request, int int_len_request, char *str_subdomain) {
	// postage data service functions
    if (strncmp(str_uri_part, "action_update"    , 13) == 0) {
        return action_update(cnxn, str_form_data);
    
    } else if (strncmp(str_uri_part, "action_select"    , 13) == 0) {
		
        return action_select(cnxn, csock, str_form_data);
    
    } else if (strncmp(str_uri_part, "action_delete"    , 13) == 0) {
        return action_delete(cnxn, str_form_data);
    
    } else if (strncmp(str_uri_part, "action_insert"    , 13) == 0) {
        return action_insert(cnxn, str_form_data);

    } else if (strncmp(str_uri_part, "action_order"     , 12) == 0) {
        return action_order(cnxn, str_form_data);
    
    } else if (strncmp(str_uri_part, "accept_csv"       , 10) == 0) {
        return accept_csv(cnxn, csock, str_form_data);
    
    // general information
    } else if (strncmp(str_uri_part, "action_info"      , 11) == 0) {
        return action_info(cnxn, str_form_data, str_request);
    
    } else if (strncmp(str_uri_part, "action_fil"       , 10) == 0) {
        return action_role(cnxn, csock, str_form_data, str_uri_part, str_subdomain);
    
    } else if (strncmp(str_uri_part, "action_role"      , 11) == 0) {
        return action_role(cnxn, csock, str_form_data, str_uri_part, str_subdomain);
    
    } else if (strncmp(str_uri_part, "action_upload"    , 13) == 0) {
		return link_upload(cnxn, str_request, int_len_request, str_subdomain);
    
    } else if (strncmp(str_uri_part, "accept_download"  , 15) == 0) {
		return accept_download(cnxn, csock, str_request, str_uri_part, str_subdomain);
    
    } else {
        return cat_cstr("HTTP/1.1 500 Internal Server Error\r\n",
            "Content-Type: application/json; charset=UTF-8\r\n\r\n",
            "{\"stat\": false, \"dat\": {\"error\": \"Action does not exist.\"}}");
    }
    //envelope admin function
    //strncmp(str_uri_part, "action_admin" , 12) == 0 ? action_admin (cnxn, str_form_data) :
    //envelope file function
}

// ******************************************************************************************
// ********************************* ACTION COUNT DOWNLOAD **********************************
// ******************************************************************************************

char *accept_download(PGconn *cnxn, int csock, char *str_request, char *str_uri, char *str_subdomain) {
	char *str_response = NULL;
	NOTICE("REQUEST TYPE: ACTION COUNT DOWNLOAD");
	DEFINE_VAR_ALL(str_canonical_start, str_buffer, str_sql, str_path_literal, str_user_agent);
	DEFINE_VAR_MORE(str_ip_address, str_user_agent_literal, str_ip_address_literal, str_uri_part);
	sun_res *sun_working = NULL;
	
	FINISH_CAT_CSTR(str_uri_part, str_uri + 15);
	if (strchr(str_uri_part, '?') != 0) {
		str_uri_part[strchr(str_uri_part, '?') - str_uri_part] = '\0';
	}
	if (strchr(str_uri_part, '#') != 0) {
		str_uri_part[strchr(str_uri_part, '#') - str_uri_part] = '\0';
	}
	
	//FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production/web_root/");
	if (strlen(str_subdomain) > 0) {
		if (strncmp(str_subdomain, "production", 10) == 0) {
			FINISH_CAT_CSTR(str_canonical_start, str_global_install_path, "fossil/production/web_root/");
		} else {
			FINISH_CHECK(username_check(str_subdomain), "Username not set up.");
			FINISH_CAT_CSTR(str_canonical_start, str_global_install_path, "fossil/production_", str_subdomain, "/web_root/");
		}
	} else {
		FINISH_CAT_CSTR(str_canonical_start, str_global_install_path, "fossil/production/web_root/");
	}
	
	//empty url, default to index.html in directories
	DEBUG("str_uri_part: %s strlen(str_uri_part): %d", str_uri_part, strlen(str_uri_part));
	if (strlen(str_uri_part) <= 1 ||
		canonical_exists_folder(str_canonical_start, str_uri_part)) {
		if (*(str_uri_part + strlen(str_uri_part) - 1) == '/') {
			FINISH_CAT_APPEND(str_uri_part, "index.html");
		} else {
			FINISH_CAT_APPEND(str_uri_part, "/index.html");
		}
	}
	
	str_user_agent = request_header(str_request, "User-Agent");
	FINISH_CHECK(str_user_agent != NULL, "request_header failed");
	
	str_ip_address = request_header(str_request, "X-Forwarded-For");
	FINISH_CHECK(str_ip_address != NULL, "request_header failed");
	
	str_path_literal = PQescapeLiteral(cnxn, str_uri + 15, strlen(str_uri + 15));
	str_user_agent_literal = PQescapeLiteral(cnxn, str_user_agent, strlen(str_user_agent));
	str_ip_address_literal = PQescapeLiteral(cnxn, str_ip_address, strlen(str_ip_address));
	FINISH_CAT_CSTR(str_sql, "INSERT INTO postage.tcount_download (path, user_agent, ip_address) ",
		"VALUES (", str_path_literal, ", ", str_user_agent_literal, ", ", str_ip_address_literal, ");");
	DEBUG("str_sql: %s", str_sql);
	SFREE(str_path_literal);
	SFREE(str_user_agent_literal);
	SFREE(str_ip_address_literal);
	FINISH_EXECUTE(sun_working, cnxn, str_sql);
	SFREE(str_sql);
	
	//// return file
	
	int int_length;
	str_buffer = canonical_read_file(str_canonical_start, str_uri_part, &int_length);
	SFREE(str_canonical_start);
	FINISH_CHECK(str_buffer != NULL, "canonical_read_file failed");
	
	char str_length[100];
	sprintf(str_length, "%i", int_length);
	DEBUG("int_length: %i", int_length);
	FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
		"Content-Type: ", contenttype(str_uri_part), "\r\n",
		"Content-Length: ", str_length, "\r\n\r\n");
	write(csock, str_response, strlen(str_response));
	SFREE(str_response);
	write(csock, str_buffer, int_length);
	SFREE(str_buffer);

	FINISH_CAT_CSTR(str_response, "");
	
finish:
	SFREE_ALL();
	SFREE_SUN_RES(sun_working);
	return str_response;
}

// ******************************************************************************************
// ************************************** ACTION ORDER **************************************
// ******************************************************************************************

char *action_order(PGconn *cnxn, char *str_form_data) {
	char *str_response = NULL;
	NOTICE("REQUEST TYPE: ACTION ENVELOPE REORDER VIEW");
	sun_res *sun_working = NULL;
	DEFINE_VAR_ALL(str_view, str_order, str_id, str_sql);
	long *arr_id = NULL;
	long *arr_order = NULL;
	
    int i;
    int int_array_len = 0;
    str_id = getpar(str_form_data, "ids");
	FINISH_CHECK(str_id != NULL, "getpar failed");
    int int_str_len = strlen(str_id);
    
    // get number of array items
    char *ptr_loop = str_id;
    for (i = 0;i < int_str_len;i++) {
        if (*ptr_loop == ',') {
            int_array_len = int_array_len + 1;
        }
        ptr_loop = ptr_loop + 1;
    }
    
    // allocate id array
    FINISH_SALLOC(arr_id, sizeof(long) * (int_array_len + 1));
    arr_id[int_array_len] = 0; // null pointer at end of array
    
    // fill id array
    i = 0;
    ptr_loop = str_id;
    char *ptr_end = str_id;
    for (i = 0; i <= int_array_len; i = i + 1) {
        arr_id[i] = strtol(ptr_loop, &ptr_end, 10);
        ptr_loop = ptr_end;
        // strtol skips spaces automatically but only before the comma
        if (*ptr_loop == ',' || *ptr_loop == ' ') { 
            ptr_loop = ptr_loop + 1;
        }
        DEBUG("arr_id[i]: %ld", arr_id[i]);
    }
    SFREE(str_id);

    // allocate order array
    str_order = getpar(str_form_data, "values");
	FINISH_CHECK(str_order != NULL, "getpar failed");
	
    FINISH_SALLOC(arr_order, sizeof(long) * (int_array_len + 1));
    arr_order[int_array_len] = 0; // null pointer at end of array
    
    // fill order array
    i = 0;
    ptr_loop = str_order;
    ptr_end = str_order;
    for (i = 0;i <= int_array_len;i++) {
        arr_order[i] = strtol(ptr_loop, &ptr_end, 10);
        ptr_loop = ptr_end;
        // strtol skips spaces automatically but only before the comma
        if (*ptr_loop == ',' || *ptr_loop == ' ') {
            ptr_loop = ptr_loop + 1;
        }
        DEBUG("arr_order[i]: %ld", arr_order[i]);
    }
    SFREE(str_order);
    ptr_loop = 0;
    ptr_end = 0;
    
    str_view = getpar(str_form_data, "src");

    // generate sql:
    i = 0;
    FINISH_SALLOC(str_order, 30);
    int_str_len = snprintf(str_order, 29, "%ld", arr_order[0]);
    FINISH_SALLOC(str_id, 30);
    int_str_len = snprintf(str_id, 29, "%ld", arr_id[0]);
    FINISH_CAT_CSTR(str_sql, "UPDATE ", str_view, " SET order_no = ", str_order, " WHERE id = ", str_id, ";");
    for (i = 1;i <= int_array_len;i++) {
        int_str_len = snprintf(str_order, 29, "%ld", arr_order[i]);
        int_str_len = snprintf(str_id, 29, "%ld", arr_id[i]);
        FINISH_CAT_APPEND(str_sql, "UPDATE ", str_view, " SET order_no = ", str_order, " WHERE id = ", str_id, ";");
    }
    DEBUG("action_order.str_sql: %s", str_sql);
    
    // update items:
    FINISH_EXECUTE(sun_working, cnxn, str_sql);
    SFREE(str_sql);
    FINISH_CAT_CSTR(str_view, sun_working->str_result);
    SFREE_SUN_RES(sun_working);
	FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
		"Content-Type: application/json; charset=UTF-8\r\n\r\n",
		"{\"stat\": true, \"dat\": \"-1\"}");
    SFREE(str_view);
    SFREE(arr_id);
	
finish:
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	SFREE(arr_id);
	SFREE(arr_order);
    return str_response;
}


// ******************************************************************************************
// ************************************* ACTION INFO ************************************** 
// ******************************************************************************************

char *action_info(PGconn *cnxn, char *str_form_data, char *str_request) {
	char *str_response = NULL;
	NOTICE("REQUEST TYPE: ACTION INFO");
	sun_res *sun_working = NULL;
	DEFINE_VAR_ALL(str_json_username, str_json_groups, str_json_default_domain, str_postgres_version);
	DEFINE_VAR_MORE(str_json_postgres_version, str_json_db, str_json_current_user, str_cookie_encrypted);
	DEFINE_VAR_MORE(str_cookie_decrypted, str_json_user, str_json_super_user, str_json_session_user);
	DEFINE_VAR_MORE(str_user, str_super_user, str_session_user);
	
	if (str_form_data != NULL) {}//get rid of unused variable warning
	
	FINISH_EXECUTE(sun_working, cnxn, "SELECT SESSION_USER;");
	
	str_json_username = jsonify(sun_working->str_result);
	SFREE_SUN_RES(sun_working);
	
	FINISH_EXECUTE(sun_working, cnxn, "SELECT '[' || COALESCE(array_to_string(array_agg('\"' || coalesce(pg_roles.rolname,'') || '\"'), ',')::text, '\"\"') || ']' \
		FROM pg_roles \
		JOIN pg_auth_members ON pg_roles.oid=roleid \
		JOIN pg_roles u ON member = u.oid \
		WHERE u.rolname = SESSION_USER");
	
	FINISH_CAT_CSTR(str_json_groups, sun_working->str_result);
	SFREE_SUN_RES(sun_working);
	
	str_json_default_domain = jsonify(str_global_subdomain);
	
	FINISH_EXECUTE(sun_working, cnxn, "SELECT version();");
	FINISH_CAT_CSTR(str_postgres_version, sun_working->str_result);
	SFREE_SUN_RES(sun_working);
	//str_postgres_version[16] = '\0';//return only version number
	str_json_postgres_version = jsonify(str_postgres_version);
	SFREE(str_postgres_version);
	str_json_db = jsonify(str_global_conn_dbname);
	
	str_json_current_user = jsonify(str_current_user);
	
	str_cookie_encrypted = str_cookie(str_request, "envelope");
	if (str_cookie_encrypted != NULL) {
		int cookie_len = strlen(str_cookie_encrypted);
		str_cookie_decrypted = aes_decrypt(str_cookie_encrypted, &cookie_len);
		SFREE_PWORD(str_cookie_encrypted);
		str_user = str_tolower(getpar(str_cookie_decrypted, "username"));
		str_json_user = jsonify(str_user);
		SFREE_PWORD(str_user);
		str_super_user = str_tolower(getpar(str_cookie_decrypted, "superusername"));
		str_json_super_user = jsonify(str_super_user);
		SFREE_PWORD(str_super_user);
		str_session_user = str_tolower(getpar(str_cookie_decrypted, "session_user"));
		str_json_session_user = jsonify(str_session_user);
		SFREE_PWORD(str_session_user);
		SFREE_PWORD(str_cookie_decrypted);
	} else {
		FINISH_CAT_CSTR(str_json_user, "\"\"");
		FINISH_CAT_CSTR(str_json_super_user, "\"\"");
		FINISH_CAT_CSTR(str_json_session_user, "\"\"");
	}
	
	char str_conn_port[25];
	sprintf(str_conn_port, "%d", int_global_conn_port);
	FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
		"Content-Type: application/json; charset=UTF-8\r\n\r\n",
		"{\"stat\": true, \"dat\": {",
			"\"username\": ", str_json_user, ", ",
			"\"superusername\": ", str_json_super_user, ", ",
			"\"session_user\": ", str_json_session_user, ", ",
			"\"groups\": ", str_json_groups, ", ",
			"\"port\": ", str_conn_port, ", ",
			//"\"js_version\": ", str_json_version, ", ",
			"\"default_domain\": ", str_json_default_domain, ",",
			"\"default_subdomain\": ", str_json_default_domain, ",",
			"\"postgres_version\": ", str_json_postgres_version, ",",
			"\"database_name\": ", str_json_db, ",",
			"\"envelope\": \"1.0\", \"current_user\": ", str_json_current_user,
		"}}");
	
finish:
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	
	return str_response;
}

// ******************************************************************************************
// ************************************* ACTION UPDATE ************************************** 
// ******************************************************************************************

char *action_update(PGconn *cnxn, char *str_form_data) {
	char *str_response = NULL;
	NOTICE("REQUEST TYPE: ACTION UPDATE");
	sun_res *sun_working = NULL;
	DEFINE_VAR_ALL(str_temp, str_view, str_view_literal, str_sql, str_col, str_value);
	DEFINE_VAR_MORE(str_col_literal, str_col_data_type, str_loop, str_u_where, str_where);
	DEFINE_VAR_MORE(str_one_col, str_one_val, str_data_type, str_one_col_literal);
	DEFINE_VAR_MORE(str_one_val_literal, str_value_literal, str_columns, str_data);
	
	// deal with null case
	FINISH_CHECK(str_form_data != NULL, "No arguments.");
	
	// **** Envelope or View? ****
	int int_count;
	
	// deal with null case
	FINISH_CHECK(str_form_data != NULL, "No arguments.");
	
	// get view name
	str_view = getpar(str_form_data, "src");
	if (str_view == NULL || strlen(str_view) < 1) {
		str_view = getpar(str_form_data, "view");
	}
	FINISH_CHECK(str_view != NULL, "getpar failed");
	FINISH_CHECK(strlen(str_view) > 0, "no src argument");
	
	str_view_literal = PQescapeLiteral(cnxn, str_view, strlen(str_view));
	FINISH_CHECK(str_view_literal != NULL, "PQescapeLiteral failed");
	
	// ACTION UPDATE 
	// we get the column and value
	// then we get the data type
	// 
	str_col = getpar(str_form_data, "column");
	FINISH_CHECK(str_col != NULL, "getpar failed");
	str_value = getpar(str_form_data, "value" );
	FINISH_CHECK(str_value != NULL, "getpar failed");
	str_col_literal = PQescapeLiteral(cnxn, str_col, strlen(str_col));
	FINISH_CHECK(str_col_literal != NULL, "PQescapeLiteral failed");
	// get data type for column
	FINISH_CAT_CSTR(str_sql, "SELECT typname FROM pg_catalog.pg_class ",
					"LEFT JOIN pg_catalog.pg_namespace ON pg_class.relnamespace = pg_namespace.oid ",
					"LEFT JOIN pg_catalog.pg_attribute ON pg_attribute.attrelid = pg_class.oid ",
					"LEFT JOIN pg_catalog.pg_type      ON pg_type.oid           = pg_attribute.atttypid ",
					"WHERE (pg_namespace.nspname || '.' || pg_class.relname = ", str_view_literal, " ",
							"OR (pg_namespace.nspname ILIKE 'pg_temp_%' AND pg_class.relname = ", str_view_literal, ")) ",
					" AND pg_attribute.attname = ", str_col_literal, "");
	DEBUG("str_sql: %s", str_sql);
	FINISH_EXECUTE(sun_working, cnxn, str_sql);
	SFREE(str_sql);
	
	//error if sql fails
	FINISH_CAT_CSTR(str_col_data_type, sun_working->str_result);
	//error "Column does not exist" if there are no records
	FINISH_CHECK(PQntuples(sun_working->res) != 0, "Column does not exist: %s.", str_col_literal);
	SFREE(str_col_literal);
	SFREE_SUN_RES(sun_working);
	
	// get str_where from args
	str_loop = getpar(str_form_data, "where");
	char *ptr_loop = str_loop;
	FINISH_CAT_CSTR(str_u_where, "");
	FINISH_CAT_CSTR(str_where, "");
	char *ptr_end;
	FINISH_CAT_CSTR(str_one_col, "");
	FINISH_CAT_CSTR(str_one_val, "");
	while (ptr_loop[0] != 0) {
		//DEBUG("while loop start:");
		//CHECK_FOR_INTERRUPTS();
		// get keys
		ptr_end = strstr(ptr_loop, "=");
		FINISH_CHECK(ptr_end != NULL, "Badly formed data string. Should be URI encoded and in format: 'key=value&key=value'.");
		// get col name
		int_count = ptr_end - ptr_loop;
		FINISH_SREALLOC(str_one_col, int_count + 1);
		memcpy(str_one_col, ptr_loop, int_count);
		ptr_loop = ptr_loop + int_count + 1;
		str_one_col[int_count] = 0;
		
		// decode if necessary
		ptr_end = strstr(str_one_col, "%");
		if (ptr_end != NULL) {
			str_temp = str_one_col;
			str_one_col = uri_to_cstr(str_one_col, int_count);
			SFREE(str_temp);
		}
		
		// get data type for column
		str_one_col_literal = PQescapeLiteral(cnxn, str_one_col, strlen(str_one_col));
		FINISH_CAT_CSTR(str_sql, "SELECT typname FROM pg_catalog.pg_class ",
						"LEFT JOIN pg_catalog.pg_namespace ON pg_class.relnamespace = pg_namespace.oid ",
						"LEFT JOIN pg_catalog.pg_attribute ON pg_attribute.attrelid = pg_class.oid ",
						"LEFT JOIN pg_catalog.pg_type      ON pg_type.oid           = pg_attribute.atttypid ",
						"WHERE (pg_namespace.nspname || '.' || pg_class.relname = ", str_view_literal, " ",
								"OR (pg_namespace.nspname ILIKE 'pg_temp_%' AND pg_class.relname = ", str_view_literal, ")) ",
						" AND pg_attribute.attname = ", str_one_col_literal, "");
		DEBUG("1 str_sql>%s<", str_sql);
		FINISH_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		
		//error if sql fails
		
		//error "Column does not exist" if there are no records
		FINISH_CHECK(PQntuples(sun_working->res) != 0, "Column does not exist: %s.", str_one_col_literal);
		
		SFREE(str_one_col_literal);
		FINISH_CAT_CSTR(str_data_type, sun_working->str_result);
		SFREE_SUN_RES(sun_working);
		
		// quote col name
		str_temp = str_one_col;
		str_one_col = sun_quote_ident(cnxn, str_one_col, strlen(str_one_col));
		SFREE(str_temp);
		if (strlen(str_u_where) == 0) {
			// first column no AND, just IS NOT DISTINCT FROM
			FINISH_CAT_APPEND(str_u_where, str_one_col, " IS NOT DISTINCT FROM ");
		} else {
			// all other columns get preceding AND and IS NOT DISTINCT FROM
			FINISH_CAT_APPEND(str_u_where, " AND ", str_one_col, " IS NOT DISTINCT FROM ");
		}
		if (strlen(str_where) == 0 && strlen(str_one_col) != 14 && strncmp(str_one_col, "change_stamp", 12 ) != 0) {
			FINISH_CAT_APPEND(str_where, str_one_col, " IS NOT DISTINCT FROM " );
		} else if (strlen(str_one_col) != 14 && strncmp(str_one_col, "change_stamp", 12 ) != 0) {
			FINISH_CAT_APPEND(str_where, " AND ", str_one_col, " IS NOT DISTINCT FROM ");
		}
		// get vals
		ptr_end = strstr(ptr_loop, "&");
		int_count = (ptr_end == 0) ? (int)strlen(ptr_loop) : ptr_end - ptr_loop;
		FINISH_SREALLOC(str_one_val, int_count + 1);
		memcpy(str_one_val, ptr_loop, int_count);
		ptr_loop = ptr_loop + int_count + ((ptr_end == 0) ? 0 : 1);
		str_one_val[int_count] = 0;
		// decode if necessary
		ptr_end = strstr(str_one_val, "%");
		if (ptr_end != NULL) {
			str_temp = str_one_val;
			str_one_val = uri_to_cstr(str_one_val, int_count);
			SFREE(str_temp);
		}
		// add value and data type
		if (strncmp(str_one_val, "NULL", 4) == 0) {
			FINISH_CAT_APPEND(str_u_where, "NULL::", str_data_type);
			if (strlen(str_one_col) != 14 && strncmp(str_one_col, "change_stamp", 12) != 0) {
				FINISH_CAT_APPEND(str_where, "NULL::", str_data_type);
			}
		} else {
			str_one_val_literal = PQescapeLiteral(cnxn, str_one_val, strlen(str_one_val));
			FINISH_CAT_APPEND(str_u_where, str_one_val_literal, "::", str_data_type);
			if (strlen(str_one_col) != 14 && strncmp(str_one_col, "change_stamp", 12 ) != 0) {
				FINISH_CAT_APPEND(str_where, str_one_val_literal, "::", str_data_type);
			}
			SFREE(str_one_val_literal);
		}
		SFREE(str_data_type);
		//DEBUG("str_where:%s;", str_where);
		//DEBUG("str_u_where:%s;", str_u_where);
	}
	SFREE(str_one_col);
	SFREE(str_one_val);
	SFREE(str_loop);
	
	//  -- If the data has been changed before our change_stamp then error
	//  EXECUTE $$ SELECT count(*) FROM $$ ||- str_view ||- $$ WHERE $$ || str_where || 
	//       $$ AND change_stamp = $$ || quote_nullable(dte_u_change_stamp) || $$;$$
	//    INTO int_count
	//    USING arr_str_u_data;
	//  IF int_count = 0 THEN
	//    RAISE EXCEPTION 'Someone updated this record before you.';
	//  END IF;
	FINISH_CAT_CSTR(str_sql, "SELECT count(*) FROM ", str_view, " WHERE ", str_u_where, ";");
	//DEBUG("3 str_sql>%s<", str_sql);
	FINISH_EXECUTE(sun_working, cnxn, str_sql);
	SFREE(str_sql);
	
	int_count = strtol(sun_working->str_result, NULL, 10);
	
	//error "Someone updated this record before you." if there are no records
	FINISH_CHECK(int_count != 0, "Someone updated this record before you.");
	SFREE_SUN_RES(sun_working);
	
	//   =>double quote column names in case of special characters
	//   =>use quote_literal_cstr for all values
	// str_col: column to be updated
	// str_value: new value for column
	// str_col_data_type: data type for updated column
	// str_u_where: id IS NOT DISTINCT FROM 106::integer AND system IS NOT DISTINCT FROM 0::character varying
	
	if (strncmp(str_value, "NULL", 5) == 0) {
		FINISH_CAT_CSTR(str_value_literal, "NULL");
	} else {
		str_value_literal = PQescapeLiteral(cnxn, str_value, strlen(str_value));
	}
	SFREE(str_value);
	FINISH_CAT_CSTR(str_sql, "UPDATE ", str_view, " SET ", str_col, "=", str_value_literal, "::", str_col_data_type, 
		" WHERE ", str_u_where, ";");
	DEBUG("2 str_sql>%s<", str_sql);
	SFREE(str_u_where);
	SFREE(str_value_literal);
	SFREE(str_col);
	SFREE(str_col_data_type);
	FINISH_EXECUTE(sun_working, cnxn, str_sql);
	SFREE(str_sql);
	
	SFREE_SUN_RES(sun_working);
	
	str_columns = getpar(str_form_data, "cols");
	if (str_columns == NULL || strlen(str_columns) < 1) {
		FINISH_CAT_CSTR(str_columns, "*");
	}
	
	DEBUG("str_columns: %s", str_columns);
	
	FINISH_CAT_CSTR(str_sql, "SELECT ", str_columns,
		  " FROM ",  str_view, 
		  " WHERE ", str_where, ";");
	DEBUG("3 str_sql>%s<", str_sql);
	FINISH_EXECUTE(sun_working, cnxn, str_sql);
	
	int y;
	int maxy = PQnfields(sun_working->res);//number of columns
	FINISH_CAT_CSTR(str_data, "[");
	for (y = 0;y < maxy;y++) {
		str_temp = jsonify(PQgetvalue(sun_working->res, 0, y));
		FINISH_CHECK(str_temp != NULL, "jsonify failed");
		FINISH_CAT_APPEND(str_data, (y == 0 ? "" : ","), str_temp);
		SFREE(str_temp);
	}
	FINISH_CAT_APPEND(str_data, "]");
	SFREE_SUN_RES(sun_working);
	
	FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n",
		"{\"stat\": true, \"dat\": ", str_data, "}");
	SFREE(str_data);
finish:
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	
	return str_response;
}

// ******************************************************************************************
// ************************************* ACTION SELECT ************************************** 
// ******************************************************************************************

char *action_select(PGconn *cnxn, int csock, char *str_form_data) {
	char *str_response = NULL;
	NOTICE("REQUEST TYPE: ACTION SELECT");
    sun_res *sun_working = NULL;
	DEFINE_VAR_ALL(str_view, str_view_copy, str_view_literal, str_sql, str_limit);
	DEFINE_VAR_MORE(str_offset, str_limit_sql, str_offset_sql, str_temp, str_order_by);
	DEFINE_VAR_MORE(str_where, str_columns, str_json_column, str_temp_json, str_referer);
	int x;
	int y;
	int z;
	int maxx;
	int maxy;
	int maxz;
	int *arrType;
	
	// This function is the primary way to expose user application data to the browser.
	// It provides an interface similar to the insert, delete and update functionality.
	
	// deal with null case
	FINISH_CHECK(str_form_data != NULL, "No arguments.");
	
	// get view name
	str_view = getpar(str_form_data, "src");
	if (str_view == NULL || strlen(str_view) < 1) {
		str_view = getpar(str_form_data, "view");
	}
	FINISH_CHECK(str_view != NULL, "getpar failed");
	FINISH_CHECK(strlen(str_view) > 0, "no src argument");
	
	
	//wrap str_view with () em if it starts with SELECT
	FINISH_CAT_CSTR(str_view_copy, str_view);
	str_view_copy = str_tolower(str_view_copy);
	char *ptr_view = str_view_copy;
	while(isspace(*ptr_view)) ptr_view++;
	if (strncmp(ptr_view, "select", 6) == 0) {
		str_temp = str_view;
		str_view = NULL;
		FINISH_CAT_CSTR(str_view, "(", str_temp, ") sun_sub_query_you_wont_guess_this");
		SFREE(str_temp);
	}
	
	FINISH_CAT_CSTR(str_view_literal, "");
	str_view_literal = PQescapeLiteral(cnxn, str_view, strlen(str_view));
	
	
	//"arr_column":["id","sname","button_open","to_buy","change_stamp"],\n
	//"arr_column_type":["P","OIU","H","T","P"],\n
	//"arr_column_pretty":["","","Edit List","Things to Buy",""],\n
	//"arr_column_data_source":["","","","",""],\n
  
	// #####################################
	// ### Section two (2:) of response: ###
	// grab the limit and offset if they are present in the request
	// int_limit := net.getpar(str_args, 'limit')::integer;
	// int_offset := COALESCE(net.getpar(str_args, 'offset')::integer,0)::integer;
	str_limit  = getpar(str_form_data, "limit");
	str_offset = getpar(str_form_data, "offset");
	
	FINISH_CAT_CSTR(str_limit_sql, "");
	FINISH_CAT_CSTR(str_offset_sql, "");
	if (strlen(str_limit) > 0) {
		str_temp = PQescapeLiteral(cnxn, str_limit, strlen(str_limit));
		FINISH_CAT_APPEND(str_limit_sql, "LIMIT ", str_temp, "::integer ");
		SFREE(str_temp);
	}
	if (strlen(str_offset) > 0) {
		str_temp = PQescapeLiteral(cnxn, str_offset, strlen(str_offset));
		FINISH_CAT_APPEND(str_offset_sql, "OFFSET ", str_temp, "::integer ");
		SFREE(str_temp);
	}
	SFREE(str_limit);
	SFREE(str_offset);
	
	// -- if there is an order_by, add to select statement
	// IF net.getpar(str_args,'order_by') <> '' THEN
	//   str_order_by := 'ORDER BY ' ||- net.getpar(str_args, 'order_by');
	// END IF;
	str_order_by = getpar(str_form_data, "order_by");
	if (strlen(str_order_by) > 0) {
		str_temp = str_order_by;
		FINISH_CAT_CSTR(str_order_by, "ORDER BY ", str_temp);
		SFREE(str_temp);
	}
	
	// -- if there is a where, add to select statement
	// IF net.getpar(str_args,'where') <> '' THEN
	//   str_where := 'WHERE ' ||- net.getpar(str_args, 'where');
	// END IF;
	str_where = getpar(str_form_data, "where");
	if (strlen(str_where) > 0) {
		str_temp = str_where;
		FINISH_CAT_CSTR(str_where, "WHERE ", str_temp);
		SFREE(str_temp);
	} 
	
    // TODO: CHECK FOR PERMISSION TO OUR VIEW. IF NO PERMS THEN GIVE A GOOD ERROR.
	
	str_columns = getpar(str_form_data, "cols");
	if (str_columns == NULL || strlen(str_columns) < 1) {
		FINISH_CAT_CSTR(str_columns, "*");
	}
	
	DEBUG("str_columns: %s", str_columns);
	
	FINISH_CAT_CSTR(str_sql, "SELECT count(*) OVER () AS sun_row_count_you_wont_guess_this, * FROM (SELECT ", str_columns,
						" FROM ", str_view, " ", str_where, " ", str_order_by, " ",
						") sun_sub_query_you_wont_guess_this_either ", str_limit_sql, str_offset_sql, ";");
	DEBUG("str_sql>%s<", str_sql);
	
	SFREE(str_columns);
	SFREE(str_view);
	SFREE(str_limit_sql);
	SFREE(str_offset_sql);
	SFREE(str_order_by);
	SFREE(str_where);
	FINISH_EXECUTE(sun_working, cnxn, str_sql);
	SFREE(str_sql);
	
	char *str_row_count;
	if (PQntuples(sun_working->res) > 0) {
		str_row_count = //PQntuples(sun_working->res);
						PQgetvalue(sun_working->res, 0, 0);
	} else {
		str_row_count = "0";
	}
	
	maxz = PQnfields(sun_working->res);//number of columns
	FINISH_CAT_CSTR(str_json_column, "");
	//z = 1 so that we skip the first column
	for (z = 1;z < maxz;z++) {
		if (z != 1) {
			FINISH_CAT_APPEND(str_json_column, ",");
		}
		str_temp_json = jsonify(PQfname(sun_working->res, z));
		FINISH_CAT_APPEND(str_json_column, str_temp_json);
		SFREE(str_temp_json);
	}
	
	
	FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
		"Content-Type: application/json; charset=UTF-8\r\n\r\n",
		"{\"stat\": true, \"dat\": {\"arr_column\":[", str_json_column, "],\n\"row_count\":", str_row_count, ",\n\"dat\": [");
	
	// INITIAL RESPONSE
	write(csock, str_response, strlen(str_response));
	SFREE(str_response);
	
	//add results to json
	maxx = PQntuples(sun_working->res);//number of rows
	maxy = PQnfields(sun_working->res);//number of columns
	
	FINISH_SALLOC(arrType, sizeof(int) * maxy);
	
	//load oid types of columns in array
	for (y = 0;y < maxy;y++) {
		DEBUG(">%d<", PQftype(sun_working->res, y));
		arrType[y] = PQftype(sun_working->res, y);
	}
	
	for (x = 0;x < maxx;x++) {
		if (x != 0) {
			write(csock, ",", 1);
		}
		write(csock, "[", 1);
		for (y = 1;y < maxy;y++) {
			//20, 21, 23 are built in oids for integers
			if ((arrType[y] == 20) || (arrType[y] == 21) || (arrType[y] == 23)) {
				//integers should not be jsonified
				if (PQgetisnull(sun_working->res, x, y) == 1) {
					FINISH_CAT_CSTR(str_temp_json, "null");
				} else {
					FINISH_CAT_CSTR(str_temp_json, PQgetvalue(sun_working->res, x, y));
				}
			} else {
				if (PQgetisnull(sun_working->res, x, y) == 1) {
					FINISH_CAT_CSTR(str_temp_json, "null");
				} else {
					str_temp_json = jsonify(PQgetvalue(sun_working->res, x, y));
					FINISH_CHECK(str_temp_json != NULL, "jsonify failed");
				}
			}
			if (y != 1) {
				write(csock, ",", 1);
			}
			write(csock, str_temp_json, strlen(str_temp_json));
			SFREE(str_temp_json);
		}
		write(csock, "]", 1);
	}
	write(csock, "]}}", 3);
	
	SFREE_SUN_RES(sun_working);
	sun_working = NULL;
	
	FINISH_CAT_CSTR(str_response, "");
finish:
    SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	return str_response;
}

// ******************************************************************************************
// ************************************* ACTION DELETE ************************************** 
// ******************************************************************************************

//  ACTION DELETE
//-- assuming a record with id=1 in a table named wfp.aatest;
//-- SELECT wfp.action_delete('env_id=12345&id=1');
//-- this section will delete the record with id=1 out of data service 12345

char *action_delete(PGconn *cnxn, char *str_form_data) {
	char *str_response = NULL;
	NOTICE("REQUEST TYPE: ACTION DELETE");
	sun_res *sun_working = NULL;
	DEFINE_VAR_ALL(str_sql, str_view, str_of_id_values, str_of_id_values_literal);
	
	// deal with null case
	FINISH_CHECK(str_form_data != NULL, "No arguments.");
	
	// get view name
	str_view = getpar(str_form_data, "src");
	if (str_view == NULL || strlen(str_view) < 1) {
		str_view = getpar(str_form_data, "view");
	}
	FINISH_CHECK(str_view != NULL, "getpar failed");
	FINISH_CHECK(strlen(str_view) > 0, "no src argument");
	
	
	//  -- delete the requested record
	//  EXECUTE $$DELETE FROM $$ ||- str_view ||- $$ WHERE id IN ($$ || net.getpar(str_args, 'id') || $$)$$;
	//  ret := '""';
	
	str_of_id_values = getpar(str_form_data, "id");
	FINISH_CHECK(str_of_id_values != NULL, "getpar failed")
	FINISH_CAT_CSTR(str_sql, "DELETE FROM ", str_view, " WHERE id IN (", str_of_id_values, ")");
	SFREE(str_view);
	FINISH_EXECUTE(sun_working, cnxn, str_sql);
	SFREE(str_sql);
	
	//error "No records found with IDs in" if there are no records deleted
	str_of_id_values_literal = PQescapeLiteral(cnxn, str_of_id_values, strlen(str_of_id_values));
	FINISH_CHECK(strncmp(PQcmdTuples(sun_working->res), "0", 1) != 0, "No records found with IDs in: (%s).", str_of_id_values_literal);
	
	SFREE(str_of_id_values);
	SFREE_SUN_RES(sun_working);

	FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
		"Content-Type: application/json; charset=UTF-8\r\n\r\n",
		"{\"stat\": true, \"dat\": \"\"}");
finish:
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	return str_response;
}

// ******************************************************************************************
// ************************************* ACTION INSERT ************************************** 
// ******************************************************************************************

//  ACTION INSERT
//  SELECT wfp.action_data('action=insert&env_id=12345')
char *action_insert(PGconn *cnxn, char *str_form_data) {
	char *str_response = NULL;
	NOTICE("REQUEST TYPE: ACTION INSERT");
	
	sun_res *sun_working = NULL;
	DEFINE_VAR_ALL(str_temp, str_sql, str_env_id, str_view, str_view_literal, str_data);
	DEFINE_VAR_MORE(str_currval, str_currval_literal, str_id, str_cols, str_vals);
	DEFINE_VAR_MORE(str_data_type, str_one_col, str_one_val, str_one_col_literal);
	
	// deal with null case
	FINISH_CHECK(str_form_data != NULL, "No arguments.");
	
	// get view name
	str_view = getpar(str_form_data, "src");
	if (str_view == NULL || strlen(str_view) < 1) {
		str_view = getpar(str_form_data, "view");
	}
	FINISH_CHECK(str_view != NULL, "getpar failed");
	FINISH_CHECK(strlen(str_view) > 0, "no src argument");
	
	str_view_literal = PQescapeLiteral(cnxn, str_view, strlen(str_view));
	FINISH_CHECK(str_view_literal != NULL, "PQescapeLiteral failed");
	
	// the rest of this action was rewritten
	str_data = getpar(str_form_data, "data");
	char *ptr_loop = str_data;
	// populate keys into an INSERT column list and values into an INSERT value list
	//   keys will get double quoted in case they have odd characters
	//   values will get uri_to_cstr if they are encoded, also c function quote_literal_cstr
	//   will be used to double any internal quotes.
	FINISH_CAT_CSTR(str_cols, "");
	FINISH_CAT_CSTR(str_vals, "");
	char *ptr_end;
	int int_len;
	FINISH_CAT_CSTR(str_data_type, "");
	int int_count;
	while (ptr_loop[0] != 0) {
		FINISH_CAT_CSTR(str_one_col, "");
		FINISH_CAT_CSTR(str_one_val, "");
		//DEBUG("while loop start:");
		//CHECK_FOR_INTERRUPTS();
		// get keys
		ptr_end = strstr(ptr_loop, "=");
		FINISH_CHECK(ptr_end != 0, "Badly formed data string. Should be URI encoded 'key=value&key=value'.");
		
		// get col name
		int_count = ptr_end - ptr_loop;
		FINISH_SREALLOC(str_one_col, int_count + 1);
		memcpy(str_one_col, ptr_loop, int_count);
		ptr_loop = ptr_loop + int_count + 1;
		str_one_col[int_count] = 0;
		// decode if necessary
		ptr_end = strstr(str_one_col, "%");
		if (ptr_end != NULL) {
			str_temp = str_one_col;
			str_one_col = uri_to_cstr(str_one_col, int_count);
			SFREE(str_temp);
		}
		// quote col name
		str_temp = str_one_col;
		str_one_col = PQescapeIdentifier(cnxn, str_temp, strlen(str_temp));
		str_one_col_literal = PQescapeLiteral(cnxn, str_temp, strlen(str_temp));
		SFREE(str_temp);
		// get data type
		FINISH_CAT_CSTR(str_sql, "SELECT typname FROM pg_catalog.pg_class ",
						"LEFT JOIN pg_catalog.pg_namespace ON pg_class.relnamespace = pg_namespace.oid ",
						"LEFT JOIN pg_catalog.pg_attribute ON pg_attribute.attrelid = pg_class.oid ",
						"LEFT JOIN pg_catalog.pg_type      ON pg_type.oid           = pg_attribute.atttypid ",
						"WHERE (pg_namespace.nspname || '.' || pg_class.relname = ", str_view_literal, " ",
								"OR (pg_namespace.nspname ILIKE 'pg_temp_%' AND pg_class.relname = ", str_view_literal, ")) ",
						" AND pg_attribute.attname = ", str_one_col_literal, "");
		FINISH_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		
		SFREE(str_data_type);
		FINISH_CAT_CSTR(str_data_type, sun_working->str_result);
		//error "Column does not exist" if there are no records
		FINISH_CHECK(PQntuples(sun_working->res) != 0, "Column does not exist: %s.", str_one_col_literal);
		SFREE(str_one_col_literal);
		
		SFREE_SUN_RES(sun_working);
		
		int_count = strlen(str_cols);
		if (int_count == 0) {
			// first column no comma
			int_len = strlen(str_one_col);
			FINISH_SREALLOC(str_cols, int_len + 1);
			memcpy(str_cols, str_one_col, int_len);
			str_cols[int_len] = 0;
		} else {
			// all other columns get preceding commas
			int_len = strlen(str_one_col);
			FINISH_SREALLOC(str_cols, int_count + int_len + 2);
			ptr_end = str_cols + int_count;
			ptr_end[0] = 44; // 44 = ','
			ptr_end = ptr_end + 1;
			memcpy(ptr_end, str_one_col, int_len);
			ptr_end[int_len] = 0;
		}
		DEBUG("str_cols:%s;", str_cols);
		// get vals
		ptr_end = strstr(ptr_loop, "&");
		int_count = (ptr_end == 0) ? (int)strlen(ptr_loop) : ptr_end - ptr_loop;
		FINISH_SREALLOC(str_one_val, int_count + 1);
		memcpy(str_one_val, ptr_loop, int_count);
		ptr_loop = ptr_loop + int_count + ((ptr_end == 0) ? 0 : 1);
		str_one_val[int_count] = 0;
		// decode if necessary
		ptr_end = strstr(str_one_val, "%");
		if (ptr_end != NULL) {
			str_temp = str_one_val;
			str_one_val = uri_to_cstr(str_one_val, int_count);
			SFREE(str_temp);
		}
		// quote val data
		if (strncmp(str_one_val, "NULL", 4) == 0) {
			str_temp = str_one_val;
			FINISH_CAT_CSTR(str_one_val, "NULL::", str_data_type);
			SFREE(str_temp);
		} else {
			str_temp = str_one_val;
			str_one_val = PQescapeLiteral(cnxn, str_one_val, strlen(str_one_val));
			SFREE(str_temp);
			str_temp = str_one_val;
			FINISH_CAT_CSTR(str_one_val, str_one_val, "::", str_data_type);
			SFREE(str_temp);
		}
		int_count = strlen(str_vals);
		if (int_count == 0) {
			// first value no comma
			int_len = strlen(str_one_val);
			FINISH_SREALLOC(str_vals, int_len + 1);
			memcpy(str_vals, str_one_val, int_len);
			str_vals[int_len] = 0;
		} else {
			// all other values get preceding commas
			int_len = strlen(str_one_val);
			FINISH_SREALLOC(str_vals, int_count + int_len + 2);
			ptr_end = str_vals + int_count;
			ptr_end[0] = ',';
			ptr_end = ptr_end + 1;
			memcpy(ptr_end, str_one_val, int_len);
			ptr_end[int_len] = 0;
		}
		SFREE(str_one_col);
		SFREE(str_one_val);
	}
	SFREE(str_data_type);
	SFREE(str_data);
	
	//EXECUTE 'INSERT INTO ' ||- str_view ||- ' (' ||- str_columns ||- ') VALUES (' ||- str_insert_val ||- '); '
	
	if (strlen(str_cols) > 0) {
		FINISH_CAT_CSTR(str_sql, "INSERT INTO ", str_view, " (", str_cols, ") VALUES (", str_vals, ");");
	} else {
		FINISH_CAT_CSTR(str_sql, "INSERT INTO ", str_view, " DEFAULT VALUES;");
	}
	
	//get
	str_currval = getpar(str_form_data, "currval");
	if (strlen(str_currval) > 0) {
		str_currval_literal = PQescapeLiteral(cnxn, str_currval, strlen(str_currval));
		FINISH_CAT_APPEND(str_sql, "SELECT currval(", str_currval_literal, ");");
		SFREE(str_currval_literal);
	} else {
		FINISH_CAT_APPEND(str_currval, "lastval");
		FINISH_CAT_APPEND(str_sql, "SELECT lastval()::text;");
	}
	
	DEBUG("str_sql>%s<", str_sql);
	SFREE(str_view);
	SFREE(str_view_literal);
	SFREE(str_cols);
	SFREE(str_vals);
	FINISH_EXECUTE(sun_working, cnxn, str_sql);
	SFREE(str_sql);
	
	
	//response
	FINISH_CAT_CSTR(str_id, sun_working->str_result);
	
	SFREE_SUN_RES(sun_working);
	
	FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
		"Content-Type: application/json; charset=UTF-8\r\n\r\n",
		"{\"stat\": true, \"dat\": {",
		"\"", str_currval, "\": ", str_id, " }}");	
	SFREE(str_currval);	
	SFREE(str_id);
finish:
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	return str_response;
}

// ******************************************************************************************
// ********************************** CSV EXPORT FOR USERS ********************************** 
// ******************************************************************************************

char *accept_csv(PGconn *cnxn, int csock, char *str_form_data) {
	char *str_response = NULL;
	NOTICE("REQUEST TYPE: ACCEPT CSV");
	sun_res *sun_working = NULL;
	
	DEFINE_VAR_ALL(str_view, str_limit, str_limit_sql, str_offset, str_offset_sql, str_temp);
	DEFINE_VAR_MORE(str_order_by, str_where, str_sql, str_columns, str_column_list);
	
	// deal with null case
	FINISH_CHECK(str_form_data != NULL, "No arguments.");
	
	// get view name
	str_view = getpar(str_form_data, "src");
	if (str_view == NULL || strlen(str_view) < 1) {
		str_view = getpar(str_form_data, "view_name");
	}
	FINISH_CHECK(str_view != NULL, "getpar failed");
	FINISH_CHECK(strlen(str_view) > 0, "no src argument");
	
	
	
	// -- ### Section one (1:) of response: ###
	// -- grab the limit and offset if they are present in the request
	// int_limit := net.getpar(str_args, 'limit')::integer;
	// int_offset := COALESCE(net.getpar(str_args, 'offset')::integer,0)::integer;
	str_limit  = getpar(str_form_data, "limit" );
	str_offset = getpar(str_form_data, "offset");
	
	FINISH_CAT_CSTR(str_limit_sql, "");
	FINISH_CAT_CSTR(str_offset_sql, "");
	if (strlen(str_limit) > 0) {
		str_temp = PQescapeLiteral(cnxn, str_limit, strlen(str_limit));
		SFREE(str_limit_sql);
		FINISH_CAT_CSTR(str_limit_sql, "LIMIT ", str_temp, "::integer ");
		SFREE(str_temp);
	}
	if (strlen(str_offset) > 0) {
		str_temp = PQescapeLiteral(cnxn, str_offset, strlen(str_offset));
		SFREE(str_offset_sql);
		FINISH_CAT_CSTR(str_offset_sql, "OFFSET ", str_temp, "::integer ");
		SFREE(str_temp);
	}
	SFREE(str_limit);
	SFREE(str_offset);
	
	// -- if there is an order_by, add to select statement
	// IF net.getpar(str_args,'order_by') <> '' THEN
	//   str_order_by := 'ORDER BY ' ||- net.getpar(str_args, 'order_by');
	// END IF;
	str_order_by = getpar(str_form_data, "order_by");
	if (strlen(str_order_by) > 0) {
		str_temp = str_order_by;
		FINISH_CAT_CSTR(str_order_by, "ORDER BY ", str_order_by);
		SFREE(str_temp);
	} 
	
	// -- if there is a where, add to select statement
	// IF net.getpar(str_args,'where') <> '' THEN
	//   str_where := 'WHERE ' ||- net.getpar(str_args, 'where');
	// END IF;
	str_where = getpar(str_form_data, "where");
	if (strlen(str_where) > 0) {
		str_temp = str_where;
		FINISH_CAT_CSTR(str_where, "WHERE ", str_where);
		SFREE(str_temp);
	}
	
	// -- ### Section three (3:) of response: ###
	// -- get the column list
	
	str_columns = getpar(str_form_data, "cols");
	if (str_columns == NULL || strlen(str_columns) < 1) {
		FINISH_CAT_CSTR(str_columns, "*");
	}
	
	FINISH_CAT_CSTR(str_sql, "SELECT ", str_columns, " FROM ",
	  str_view, " ", str_where, " ", str_order_by, " ", str_limit_sql, " ", str_offset_sql, ";");
	DEBUG("str_sql>%s<", str_sql);
	SFREE(str_columns);
	SFREE(str_view);
	FINISH_EXECUTE(sun_working, cnxn, str_sql);
	
	FINISH_CAT_CSTR(str_column_list, "");
	//add columns to json
	int z;
	int maxz = PQnfields(sun_working->res);//number of columns
	for (z = 0;z < maxz;z++) {
		str_temp = jsonify(PQfname(sun_working->res, z));
		FINISH_CHECK(str_temp != NULL, "jsonify failed");
		FINISH_CAT_APPEND(str_column_list, (z == 0 ? "" : ","), str_temp);
		SFREE(str_temp);
	}
	FINISH_CAT_APPEND(str_column_list, "");
	
	FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
		"Content-Type: text/csv\r\n\r\n",
		//"Content-Type: text/csv; charset=UTF-8\r\n\r\n",
		str_column_list);
	SFREE(str_column_list);
	
	// INITIAL RESPONSE
	write(csock, str_response, strlen(str_response));
	SFREE(str_response);
	
	//add results to json
	int x;
	int y;
	int maxx = PQntuples(sun_working->res);//number of rows
	int maxy = PQnfields(sun_working->res);//number of columns
	for (x = 0;x < maxx;x++) {
		write(csock, "\r\n", 2);
		for (y = 0;y < maxy;y++) {
			str_temp = jsonify(PQgetvalue(sun_working->res, x, y));
			if (y != 0) {
				write(csock, ",", 1);
			}
			write(csock, str_temp, strlen(str_temp));
			SFREE(str_temp);
		}
	}
	
	SFREE_SUN_RES(sun_working);
	FINISH_CAT_CSTR(str_response, "");
finish:
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	return str_response;
}
