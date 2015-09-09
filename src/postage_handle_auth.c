#include "postage_handle_auth.h"

char *link_auth_postage(char *str_request) {
    char *str_response = NULL;
	DEFINE_VAR_ALL(str_form_data, str_action, str_old_cookie_encrypted);
	DEFINE_VAR_MORE(str_cookie_decrypted_part1, str_cookie_decrypted);
	DEFINE_VAR_MORE(str_super_password, str_cookie_encrypted);
	DEFINE_VAR_MORE(str_super_password_escape, str_conn, str_host);
	DEFINE_VAR_MORE(str_body, str_email_error, str_json, str_user_literal);
	DEFINE_VAR_MORE(str_sql, str_superuser_result, str_expires);
	DEFINE_VAR_MORE(str_session_user, str_username, str_password);
	DEFINE_VAR_MORE(str_super_username, str_expiration, str_new_cookie);
	DEFINE_VAR_MORE(str_new_password, str_old_check_password);
	DEFINE_VAR_MORE(str_uri_super_username, str_uri_super_password);
	DEFINE_VAR_MORE(str_super_new_password, str_uri_super_new_password);
	DEFINE_VAR_MORE(str_uri_session_user, str_uri_expiration);
	DEFINE_VAR_MORE(str_super_username_quote, str_new_password_literal);
	DEFINE_VAR_MORE(str_conn_debug, str_developer_result);
	DEFINE_VAR_MORE(str_uri_username, str_uri_password, str_timeout);
	PGconn *cnxn = NULL;
	sun_res *sun_working = NULL;
	
	// get form data
    str_form_data = query(str_request);
	FINISH_CHECK(str_form_data != NULL, "str_query failed");
	
    str_action = getpar(str_form_data, "action");
	FINISH_CHECK(str_action != NULL, "str_action failed");
	
    
    // LOGGING IN, SET COOKIE
    if (strncmp(str_action, "login", 5) == 0) {
		NOTICE("REQUEST TYPE: SUPERUSER LOGIN");
		str_old_cookie_encrypted = str_cookie(str_request, "envelope");
		FINISH_CHECK(str_old_cookie_encrypted != NULL, "str_cookie failed");
		int int_cookie_len = strlen(str_old_cookie_encrypted);
		FINISH_CHECK(int_cookie_len > 0, "No Cookie.");
		
		str_cookie_decrypted_part1 = aes_decrypt(str_old_cookie_encrypted, &int_cookie_len);
		FINISH_CHECK(str_cookie_decrypted_part1 != NULL, "aes_decrypt failed");
		SFREE_PWORD(str_old_cookie_encrypted);
		FINISH_CAT_CSTR(str_cookie_decrypted, str_cookie_decrypted_part1, "&", str_form_data);
		SFREE_PWORD(str_cookie_decrypted_part1);
		SFREE_PWORD(str_form_data);
		
		
		str_envelope_user = str_tolower(getpar(str_cookie_decrypted, "username"));
		FINISH_CHECK(str_envelope_user != NULL, "str_tolower(getpar) failed");
		str_current_user = str_tolower(getpar(str_cookie_decrypted, "superusername"));
		FINISH_CHECK(str_current_user != NULL, "str_tolower(getpar) failed");
		str_super_password = getpar(str_cookie_decrypted, "superpassword");
		FINISH_CHECK(str_current_user != NULL, "getpar failed");
		
		//encrypt
		int_cookie_len = strlen(str_cookie_decrypted);
		str_cookie_encrypted = aes_encrypt(str_cookie_decrypted, &int_cookie_len);
		FINISH_CHECK(str_cookie_encrypted != NULL, "aes_encrypt failed");
		SFREE_PWORD(str_cookie_decrypted);
		//done encrypting
		
		// assemble connection string, get cnxn handle
		str_super_password_escape = escape_conninfo_value(str_super_password);
		SFREE_PWORD(str_super_password);
		FINISH_CHECK(str_super_password_escape != NULL, "escape_conninfo_value failed");
		char str_conn_port[25];
		sprintf(str_conn_port, "%d", int_global_current_conn_port);
	    FINISH_CAT_CSTR(str_conn, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
			" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
			" user=", str_current_user, " password=", str_super_password_escape);
		SFREE_PWORD(str_super_password_escape);
		
		FINISH_CAT_CSTR(str_conn_debug, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
			" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
			" user=", str_current_user, " password=???");
		DEBUG("str_conn>%s<", str_conn_debug);
		SFREE(str_conn_debug);
		// **** WARNING ****
		//DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE NEW PASSWORD IN THE CLEAR IN THE LOG!!!!
		//DEBUG("str_conn>%s<", str_conn);
		// **** WARNING ****
		cnxn = PQconnectdb(str_conn);
		if (PQstatus(cnxn) != CONNECTION_OK) {
			if (str_global_email_work_hours != NULL && strlen(str_global_email_work_hours) > 0) {
				//send email
				str_host = request_header(str_request, "host");
				FINISH_CHECK(str_host != NULL, "request_header failed");
				
				FINISH_CAT_CSTR(str_body, "From: ", str_global_email_from, "\n",
					"To: ", is_work_hours() ? str_global_email_work_hours : str_global_email_off_hours, "\n",
					"Content-Type: text/plain\n",
					"Subject: ", str_host, " Superuser Login Failed: ", str_current_user, "\n\n",
					str_host, " Superuser Login Failed: ", str_current_user);
				SFREE(str_host);
				DEBUG("str_body: %s", str_body);
				char str_sendmail_script[255];
				sprintf(str_sendmail_script, "%s/bin/%s", str_global_install_path, str_global_sendmail_script);
				str_email_error = sunny_return("", str_sendmail_script, str_body,
					is_work_hours() ? str_global_email_work_hours : str_global_email_off_hours);
				FINISH_CHECK(str_email_error != NULL, "sunny_return failed");
				SFREE(str_body);
				//if there is a return then error
				if (strlen(str_email_error) > 0) {
					DEBUG("str_email_error: %s", str_email_error);
				}
				SFREE(str_email_error);
			}
			
			str_json = jsonify(PQerrorMessage(cnxn));
			FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
				"Access-Control-Allow-Origin: *\r\n\r\n",
				"{\"stat\": false, \"dat\": {\"error\": ", str_json, "}}");
			ERROR_NORESPONSE("Connection to database failed: %s ", PQerrorMessage(cnxn));
			goto finish;
		}
		
		
		// must be a superuser
		str_user_literal = PQescapeLiteral(cnxn, str_current_user, strlen(str_current_user));
		FINISH_CHECK(str_user_literal != NULL, "PQescapeLiteral failed");
		FINISH_CAT_CSTR(str_sql, "SELECT CASE WHEN rolsuper THEN 'TRUE' ELSE 'FALSE' END AS result \
			  FROM pg_catalog.pg_roles WHERE rolname = ", str_user_literal, ";");
		SFREE(str_user_literal);
		
		
		FINISH_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		FINISH_CAT_CSTR(str_superuser_result, sun_working->str_result);
		SFREE_SUN_RES(sun_working);
		
		// must be a developer
		str_user_literal = PQescapeLiteral(cnxn, str_envelope_user, strlen(str_envelope_user));
		FINISH_CHECK(str_user_literal != NULL, "PQescapeLiteral failed");
		FINISH_CAT_CSTR(str_sql, "SELECT CASE WHEN count(*) > 0 THEN 'TRUE' ELSE 'FALSE' END AS result \
		FROM pg_roles r \
		JOIN pg_auth_members ON r.oid=roleid \
		JOIN pg_roles u ON member = u.oid \
		WHERE lower(r.rolname) = 'developer_g' AND lower(u.rolname) = lower(", str_user_literal, ");");
		SFREE(str_user_literal);
		
		
		FINISH_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		FINISH_CAT_CSTR(str_developer_result, sun_working->str_result);
		SFREE_SUN_RES(sun_working);
		
		//todo seperate errors
		if (strncmp(str_developer_result, "TRUE", 4) != 0) {
			ERROR_NORESPONSE("You must be a developer to use the envelope developer tools.");
			FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
				"Access-Control-Allow-Origin: *\r\n\r\n",
				"{\"stat\": false, \"dat\": {\"error\": \"You be a developer to use the envelope developer tools.\"}}");
		} else if (strncmp(str_superuser_result, "TRUE", 4) != 0) {
			ERROR_NORESPONSE("You must login as a superuser to use the envelope developer tools.");
			FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
				"Access-Control-Allow-Origin: *\r\n\r\n",
				"{\"stat\": false, \"dat\": {\"error\": \"You must login as a superuser to use the envelope developer tools.\"}}");
		} else if (strncmp(str_superuser_result, "TRUE", 4) == 0 && strncmp(str_developer_result, "TRUE", 4) == 0) {
			str_host = request_header(str_request, "host");
			FINISH_CHECK(str_host != NULL, "request_header failed");
			
			char *ptr_host = strchr(str_host, '.');
			str_expires = str_expire_one_day();
			FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
				"Set-Cookie: envelope=", str_cookie_encrypted, "; domain=", ptr_host,
				"; path=/; expires=", str_expires, "; secure; HttpOnly\r\n",
				"Access-Control-Allow-Origin: *\r\n\r\n",
				"{\"stat\": true, \"dat\": \"/v1/app/all/postage/index.html\"}");
			SFREE(str_host);
		} else {
			ERROR_NORESPONSE("You must be a developer to use the envelope developer tools.");
			FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
				"Access-Control-Allow-Origin: *\r\n\r\n",
				"{\"stat\": false, \"dat\": {\"error\": \"You be a developer to use the envelope developer tools.\"}}");
		}
		SFREE(str_superuser_result);
		SFREE(str_developer_result);
		
		PQfinish(cnxn); cnxn = NULL;
		SFREE(str_cookie_encrypted);
		
    } else if (strncmp(str_action, "change", 7) == 0) {
		str_session_user = getpar(str_form_data, "session_user");
		FINISH_CHECK(str_session_user != NULL, "getpar failed");
		SFREE_PWORD(str_form_data);
		
		str_cookie_encrypted = str_cookie(str_request, "envelope");
		FINISH_CHECK(str_cookie_encrypted != NULL, "str_cookie failed");
		
		int int_cookie_len = strlen(str_cookie_encrypted);
		DEBUG("int_cookie_len: %d", int_cookie_len);
		str_cookie_decrypted = aes_decrypt(str_cookie_encrypted, &int_cookie_len);
		FINISH_CHECK(str_cookie_decrypted != NULL, "aes_decrypt failed");
		SFREE(str_cookie_encrypted);
		
		str_username = str_tolower(getpar(str_cookie_decrypted, "username"));
		FINISH_CHECK(str_username != NULL, "str_tolower(getpar) failed");
		str_password = getpar(str_cookie_decrypted, "password");
		FINISH_CHECK(str_password != NULL, "getpar failed");
		
		str_super_username = str_tolower(getpar(str_cookie_decrypted, "superusername"));
		FINISH_CHECK(str_super_username != NULL, "str_tolower(getpar) failed");
		str_super_password = getpar(str_cookie_decrypted, "superpassword");
		FINISH_CHECK(str_super_password != NULL, "getpar failed");
		
		str_timeout = getpar(str_cookie_decrypted, "timeout");
		str_expiration = getpar(str_cookie_decrypted, "expiration");
		FINISH_CHECK(str_super_password != NULL, "getpar failed");
		//DEBUG("str_cookie_decrypted: %s", str_cookie_decrypted);
		SFREE_PWORD(str_cookie_decrypted);
		
		FINISH_CAT_CSTR(str_new_cookie, "username=", str_username, "&password=", str_password,
										"&superusername=", str_super_username, "&superpassword=", str_super_password,
										"&session_user=", str_session_user, "&expiration=", str_expiration,
										"&timeout=", str_timeout);
		SFREE(str_session_user);
		SFREE(str_super_username);
		SFREE_PWORD(str_super_password);
		SFREE(str_username);
		SFREE_PWORD(str_password);
		SFREE(str_timeout);
		
		//encrypt
		int_cookie_len = strlen(str_new_cookie);
		str_cookie_encrypted = aes_encrypt(str_new_cookie, &int_cookie_len);
		SFREE_PWORD(str_new_cookie);
		//done encrypting
		
		str_host = request_header(str_request, "host");
		FINISH_CHECK(str_host != NULL, "request_header failed");
		
	    char *ptr_host = strchr(str_host, '.');
		str_expires = str_expire_one_day();
		FINISH_CHECK(str_expires != NULL, "str_expire_one_day failed");
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Set-Cookie: envelope=", str_cookie_encrypted, "; domain=", ptr_host,
			"; path=/; expires=", str_expires, "; secure; HttpOnly\r\n",
			"Access-Control-Allow-Origin: *\r\n\r\n",
			"{\"stat\": true, \"dat\": \"/v1/app/all/index.html\"}");
		SFREE(str_expires);
		SFREE(str_host);
		SFREE_PWORD(str_cookie_encrypted);
		
    //////
    // CHANGE PW, RESET ENVELOPE COOKIE
    } else if (strncmp(str_action, "change_pw", 9) == 0) {
		NOTICE("REQUEST TYPE: SUPERUSER CHANGE PASSWORD");
		str_new_password = getpar(str_form_data, "password_new");
		FINISH_CHECK(str_new_password != NULL, "getpar failed");
		str_old_check_password = getpar(str_form_data, "password_old");
		FINISH_CHECK(str_old_check_password != NULL, "getpar failed");
		
		SFREE_PWORD(str_form_data);
		str_cookie_encrypted = str_cookie(str_request, "envelope");
		FINISH_CHECK(str_cookie_encrypted != NULL, "str_cookie failed");
		int int_cookie_len = strlen(str_cookie_encrypted);
		DEBUG("int_cookie_len: %d", int_cookie_len);
		str_cookie_decrypted = aes_decrypt(str_cookie_encrypted, &int_cookie_len);
		FINISH_CHECK(str_cookie_decrypted != NULL, "aes_decrypt failed");
		SFREE(str_cookie_encrypted);
		
		str_username = str_tolower(getpar(str_cookie_decrypted, "username"));
		FINISH_CHECK(str_username != NULL, "str_tolower(getpar) failed");
		
		str_password = getpar(str_cookie_decrypted, "password");
		FINISH_CHECK(str_password != NULL, "getpar failed");
		
		str_super_username = str_tolower(getpar(str_cookie_decrypted, "superusername"));
		FINISH_CHECK(str_super_username != NULL, "str_tolower(getpar) failed");
		
		str_super_password = getpar(str_cookie_decrypted, "superpassword");
		FINISH_CHECK(str_super_password != NULL, "getpar failed");
		
		str_expiration = getpar(str_cookie_decrypted, "expiration");
		FINISH_CHECK(str_expiration != NULL, "getpar failed");
		
		str_session_user = getpar(str_cookie_decrypted, "session_user");
		FINISH_CHECK(str_session_user != NULL, "getpar failed");
		
		//DEBUG("str_cookie_decrypted: %s", str_cookie_decrypted);
		SFREE_PWORD(str_cookie_decrypted);
		
		str_uri_username = cstr_to_uri(str_username);
		FINISH_CHECK(str_uri_username != NULL, "getpar failed");
		
		str_uri_password = cstr_to_uri(str_password);
		FINISH_CHECK(str_uri_password != NULL, "getpar failed");
		
		str_uri_super_username = cstr_to_uri(str_super_username);
		FINISH_CHECK(str_uri_super_username != NULL, "getpar failed");
		
		str_uri_super_password = cstr_to_uri(str_super_password);
		FINISH_CHECK(str_uri_super_password != NULL, "getpar failed");
		
		str_uri_super_new_password = cstr_to_uri(str_super_new_password);
		FINISH_CHECK(str_uri_super_new_password != NULL, "getpar failed");
		
		str_uri_super_username = cstr_to_uri(str_super_username);
		FINISH_CHECK(str_uri_super_username != NULL, "getpar failed");
		
		SFREE(str_session_user);
		str_uri_expiration = cstr_to_uri(str_expiration);
		
		FINISH_CHECK(str_uri_expiration != NULL, "getpar failed");
		FINISH_CAT_CSTR(str_new_cookie, "username=", str_uri_username, "&password=", str_uri_password,
										"&superusername=", str_uri_super_username, "&superpassword=", str_uri_super_new_password,
										"&session_user=", str_uri_session_user, "&expiration=", str_uri_expiration);
		SFREE(str_uri_expiration);
		SFREE(str_uri_session_user);
		SFREE(str_username);
		SFREE_PWORD(str_password);
		SFREE_PWORD(str_uri_password);
		SFREE_PWORD(str_uri_super_new_password);
		if (strncmp(str_super_password, str_old_check_password, strlen(str_old_check_password)) != 0) {
			ERROR_NORESPONSE("Old password doesn't match.");
			FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
				"Access-Control-Allow-Origin: *\r\n\r\n",
				"{\"stat\": false, \"dat\": {\"error\": \"Old password doesn't match.\"}}");
			goto finish;
		}
		SFREE_PWORD(str_old_check_password);
		
		
		str_super_password_escape = escape_conninfo_value(str_super_password);
		FINISH_CHECK(str_super_password_escape != NULL, "escape_conninfo_value failed");
		SFREE_PWORD(str_super_password);
		
		// assemble connection string, get cnxn handle
		DEBUG("int_global_current_conn_port: %d", int_global_current_conn_port);
		char str_conn_port[25];
		sprintf(str_conn_port, "%d", int_global_current_conn_port);
		FINISH_CAT_CSTR(str_conn, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
			" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
			" user=", str_super_username, " password=", str_super_password_escape);
		
		// **** WARNING ****
		//DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE NEW PASSWORD IN THE CLEAR IN THE LOG!!!!
		//DEBUG("str_conn>%s<", str_conn);
		// **** WARNING ****
		cnxn = PQconnectdb(str_conn);
		FINISH_CHECK(PQstatus(cnxn) == CONNECTION_OK, "Connection to database failed: %s ", PQerrorMessage(cnxn));
		
		str_super_username_quote = sun_quote_ident(cnxn, str_super_username, strlen(str_super_username));
		FINISH_CHECK(str_super_username_quote != NULL, "sun_quote_ident failed");
		
		
		str_new_password_literal = PQescapeLiteral(cnxn, str_new_password, strlen(str_new_password));
		FINISH_CHECK(str_new_password_literal != NULL, "PQescapeLiteral failed");
		
		FINISH_CAT_CSTR(str_sql, "ALTER ROLE ", str_super_username_quote, " PASSWORD ", str_new_password_literal, ";");
		// **** WARNING ****
		//DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE NEW PASSWORD IN THE CLEAR IN THE LOG!!!!
		//DEBUG("str_sql>%s<", str_sql);
		// **** WARNING ****
		FINISH_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		
		SFREE_SUN_RES(sun_working);
		PQfinish(cnxn); cnxn = NULL;
		
		// assemble connection string, get cnxn handle
		FINISH_CAT_CSTR(str_conn, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
			" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
			" user=", str_super_username, " password=", str_super_password_escape);
		SFREE(str_super_password_escape);
		
		FINISH_CAT_CSTR(str_conn_debug, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
			" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
			" user=", str_super_username, " password=???");
		DEBUG("str_conn>%s<", str_conn_debug);
		SFREE(str_super_username);
		SFREE(str_conn_debug);
		
		// **** WARNING ****
		//DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE NEW PASSWORD IN THE CLEAR IN THE LOG!!!!
		//DEBUG("str_conn>%s<", str_conn);
		// **** WARNING ****
		cnxn = PQconnectdb(str_conn);
		FINISH_CHECK(PQstatus(cnxn) == CONNECTION_OK, "Connection to database failed: %s ", PQerrorMessage(cnxn));
		
		
		str_new_password_literal = PQescapeLiteral(cnxn, str_new_password, strlen(str_new_password));
		FINISH_CHECK(str_new_password_literal != NULL, "PQescapeLiteral failed");
		SFREE_PWORD(str_new_password);
		FINISH_CAT_CSTR(str_sql, "ALTER ROLE ", str_super_username_quote, " PASSWORD ", str_new_password_literal, ";");
		// **** WARNING ****
		//DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE NEW PASSWORD IN THE CLEAR IN THE LOG!!!!
		//DEBUG("str_sql>%s<", str_sql);
		// **** WARNING ****
		SFREE(str_super_username_quote);
		SFREE_PWORD(str_new_password_literal);
		FINISH_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		SFREE_SUN_RES(sun_working);
		PQfinish(cnxn); cnxn = NULL;
		
		//encrypt
		int_cookie_len = strlen(str_new_cookie);
		str_cookie_encrypted = aes_encrypt(str_new_cookie, &int_cookie_len);
		FINISH_CHECK(str_cookie_encrypted != NULL, "aes_encrypt failed");
		SFREE_PWORD(str_new_cookie);
		//done encrypting
		
		str_host = request_header(str_request, "host");
		FINISH_CHECK(str_host != NULL, "request_header failed");
		
	    char *ptr_host = strchr(str_host, '.');
		str_expires = str_expire_one_day();
		FINISH_CHECK(str_expires != NULL, "str_expire_one_day failed");
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Set-Cookie: envelope=", str_cookie_encrypted, "; domain=", ptr_host,
			"; path=/; expires=", str_expires, "; secure; HttpOnly\r\n",
			"Access-Control-Allow-Origin: *\r\n\r\n",
			"{\"stat\": true, \"dat\": \"/v1/app/all/index.html\"}");
		SFREE(str_expires);
		SFREE(str_host);
		SFREE_PWORD(str_cookie_encrypted);
		
    /////
    // LOGGING OUT, REMOVE SUPERUSER FROM COOKIE
    } else if (strncmp(str_action, "logout", 6) == 0) {
		NOTICE("REQUEST TYPE: SUPER LOGOUT");
		SFREE_PWORD(str_form_data);
		
		str_old_cookie_encrypted = str_cookie(str_request, "envelope");
		FINISH_CHECK(str_old_cookie_encrypted != NULL, "str_cookie failed");
		
		int int_cookie_len = strlen(str_old_cookie_encrypted);
		
		str_cookie_decrypted = aes_decrypt(str_old_cookie_encrypted, &int_cookie_len);
		FINISH_CHECK(str_cookie_decrypted != NULL, "aes_decrypt failed");
		
		SFREE_PWORD(str_old_cookie_encrypted);
		
		str_username = getpar(str_cookie_decrypted, "username");
		FINISH_CHECK(str_username != NULL, "getpar failed");
		
		str_password = getpar(str_cookie_decrypted, "password");
		FINISH_CHECK(str_password != NULL, "getpar failed");
		
		str_expiration = getpar(str_cookie_decrypted, "expiration");
		FINISH_CHECK(str_expiration != NULL, "getpar failed");
		
		SFREE_PWORD(str_cookie_decrypted);
		FINISH_CAT_CSTR(str_new_cookie, "username=", str_username, "&password=", str_password, "&expiration=", str_expiration);
		SFREE_PWORD(str_username);
		SFREE_PWORD(str_password);
		SFREE_PWORD(str_expiration);
		
		str_cookie_encrypted = aes_encrypt(str_new_cookie, &int_cookie_len);
		FINISH_CHECK(str_cookie_encrypted != NULL, "aes_encrypt failed");
		
		SFREE_PWORD(str_new_cookie);
		
		str_host = request_header(str_request, "host");
		FINISH_CHECK(str_host != NULL, "request_header failed");
		
		char *ptr_host = strchr(str_host, '.');
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 303 See Other\r\n", "Location: https://", str_global_subdomain, ptr_host, "/v1/app/all/index.html\r\n",
			"Set-Cookie: envelope=", str_cookie_encrypted, "; domain=", ptr_host,
			"; path=/; expires=", str_expiration, "; secure; HttpOnly\r\n\r\n");
		SFREE_PWORD(str_cookie_encrypted);
		SFREE(str_host);
    } else {
		SFREE_PWORD(str_form_data);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 500 Internal Server Error\r\n\r\n",
			"{\"stat\": false, \"dat\": {\"error\": \"Action does not exist.\"}}");
	}
    SFREE(str_action);
finish:
	if (cnxn != NULL) PQfinish(cnxn); cnxn = NULL;
	SFREE_SUN_RES(sun_working);
	SFREE_PWORD(str_form_data);
	SFREE_PWORD(str_old_cookie_encrypted);
	SFREE_PWORD(str_cookie_decrypted_part1);
	SFREE_PWORD(str_cookie_decrypted);
	SFREE_PWORD(str_super_password);
	SFREE_PWORD(str_cookie_encrypted);
	SFREE_PWORD(str_super_password_escape);
	SFREE_PWORD(str_conn);
	SFREE_PWORD(str_password);
	SFREE_PWORD(str_super_password);
	SFREE_PWORD(str_new_cookie);
	SFREE_PWORD(str_new_password);
	SFREE_PWORD(str_old_check_password);
	SFREE_PWORD(str_uri_super_password);
	SFREE_PWORD(str_uri_super_new_password);
	SFREE_PWORD(str_super_new_password);
	SFREE_PWORD(str_new_cookie);
	SFREE_PWORD(str_new_password_literal);
	SFREE_PWORD(str_uri_password);
	SFREE_ALL();
    return str_response;
}

PGconn *set_cnxn_postage(int csock, char *str_uri, char *str_request) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_cookie_encrypted, str_cookie_decrypted, str_expires, str_sql, str_uri_encoded);
	DEFINE_VAR_MORE(str_super_password, str_super_password_escape, str_host, str_conn, str_conn_debug);
	DEFINE_VAR_MORE(str_statement_timeout_literal, str_timeout, str_uri_timeout, str_cookie_to_encrypt);
	PGconn *cnxn = NULL;
	sun_res *sun_working = NULL;
	
	void *vod_return = NULL;
	
	str_host = request_header(str_request, "host");
	FINISH_CHECK(str_host != NULL, "request_header failed");
	
	char *ptr_host = strchr(str_host, '.');
	
	str_cookie_encrypted = str_cookie(str_request, "envelope");
	if (str_cookie_encrypted == NULL || strlen(str_cookie_encrypted) <= 0) {
		if (strncmp(str_uri, "/file", 5) == 0 || strncmp(str_uri, "/v1/app", 7) == 0 || strncmp(str_uri, "/v1/dev", 7) == 0) {
			ERROR_NORESPONSE("No cookie, redirecting to homepage.");
			str_uri_encoded = cstr_to_uri(str_uri);
			FINISH_CHECK(str_uri_encoded != NULL, "cstr_to_uri failed");
			FINISH_CAT_CSTR(str_response, "HTTP/1.1 303 See Other\r\n",
				"Location: https://", str_global_subdomain, ptr_host, "/index.html?redirect=", str_uri_encoded, "\r\n\r\n");
			SFREE(str_uri_encoded);
			goto finish;
		} else {
			FINISH("No Cookie.");
		}
	}
    int int_cookie_len = strlen(str_cookie_encrypted);
	
	DEBUG("int_cookie_len: %d", int_cookie_len);
    str_cookie_decrypted = aes_decrypt(str_cookie_encrypted, &int_cookie_len);
	FINISH_CHECK(str_cookie_decrypted != NULL, "aes_decrypt failed");
    SFREE(str_cookie_encrypted);
	
	
	//EXPIRATION
	//get expired time
    str_expires = getpar(str_cookie_decrypted, "expiration");
	FINISH_CHECK(str_expires != NULL, "getpar failed");
	
	struct tm tm_expires;
	strptime(str_expires, "%a, %d %b %Y %H:%M:%S %Z", &tm_expires);
	SFREE(str_expires);
	time_t time_expires = mktime(&tm_expires);
	
    //get current time
	time_t time_current;
	time(&time_current);
	
	//get diff
	double seconds = difftime(time_current, time_expires);
	DEBUG("seconds: %f", seconds);
	if (seconds > 0) {
		SFREE_PWORD(str_cookie_decrypted);
		
		str_response = expire_cookie(str_uri, str_request);
		write(csock, str_response, strlen(str_response));
		FINISH("Cookie Expired.");
	}
    
	//COOKIE TIMEOUT
    str_timeout = getpar(str_cookie_decrypted, "timeout");
	FINISH_CHECK(str_timeout != NULL, "getpar failed");
	str_response = cookie_timeout(str_timeout, str_cookie_decrypted, str_request, str_uri);
	SFREE(str_timeout);
	if (str_response) {
		goto finish;
	}
    
	str_envelope_user = str_tolower(getpar(str_cookie_decrypted, "username"));
	FINISH_CHECK(str_envelope_user != NULL, "str_tolower(getpar) failed");
	
    str_current_user = str_tolower(getpar(str_cookie_decrypted, "superusername"));
	FINISH_CHECK(str_current_user != NULL, "str_tolower(getpar) failed");
	NOTICE("REQUEST USERNAME: %s", str_current_user);
	
    str_super_password = getpar(str_cookie_decrypted, "superpassword");
	FINISH_CHECK(str_super_password != NULL, "getpar failed");
	
	//DEBUG("str_cookie_decrypted: %s", str_cookie_decrypted);
    SFREE_PWORD(str_cookie_decrypted);
    
	FINISH_CHECK(int_cookie_len > 0, "No Cookie.");
	
    // assemble connection string, get cnxn handle
    DEBUG("str_envelope_user: %s\n", str_envelope_user);
    DEBUG("str_current_user: %s\n", str_current_user);
    
    str_super_password_escape = escape_conninfo_value(str_super_password);
	
	char str_conn_port[25];
	sprintf(str_conn_port, "%d", int_global_current_conn_port);
	FINISH_CAT_CSTR(str_conn, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
		" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
		" user=", str_current_user, " password=", str_super_password_escape);
	FINISH_CAT_CSTR(str_conn_debug, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
		" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
		" user=", str_current_user, " password=???");
	DEBUG("str_conn_debug: %s", str_conn_debug);
	SFREE_PWORD(str_super_password_escape);
    SFREE_PWORD(str_super_password);
    
    cnxn = PQconnectdb(str_conn);
    SFREE_PWORD(str_conn);
    FINISH_CHECK(PQstatus(cnxn) == CONNECTION_OK, "Connection to database failed: ", PQerrorMessage(cnxn));

    // execute cmd, get result
	char str_statement_timeout[25];
	sprintf(str_statement_timeout, "%d", int_global_statement_timeout_super);
	str_statement_timeout_literal = PQescapeLiteral(cnxn, str_statement_timeout, strlen(str_statement_timeout));
	FINISH_CAT_CSTR(str_sql, "SET statement_timeout = ", str_statement_timeout_literal, ";",
		"SELECT CASE WHEN rolsuper THEN 'TRUE'::text ELSE ''::text END AS result ",
		"FROM pg_catalog.pg_roles WHERE rolname = SESSION_USER;");
	SFREE(str_statement_timeout_literal);
    FINISH_EXECUTE(sun_working, cnxn, str_sql);
	SFREE(str_sql);

    //set notice processor
    PQsetNoticeProcessor(cnxn, sunNoticeProcessor, "");
    
    // If we have a good cookie continue, otherwise exit
    FINISH_CHECK(strncmp(sun_working->str_result, "TRUE", 4) == 0, "MUST BE SUPERUSER.");
	SFREE_SUN_RES(sun_working);
	
	vod_return = cnxn; cnxn = NULL;
finish:
	SFREE_PWORD(str_conn);
	SFREE_PWORD(str_cookie_encrypted);
	SFREE_PWORD(str_cookie_decrypted);
	SFREE_PWORD(str_super_password_escape);
	SFREE_PWORD(str_super_password);
	if (cnxn != NULL) PQfinish(cnxn); cnxn = NULL;
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	
	if (str_response != NULL) {
		write(csock, str_response, strlen(str_response));
		SFREE_PWORD(str_response);
	}
	
	return vod_return;
}