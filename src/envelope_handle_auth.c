#include "envelope_handle_auth.h"

/*
TODO: return null remove
*/

//response with redirect
char *link_auth(PGconn *cnxn, char *str_request) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_form_data, str_action, str_user, str_password, str_expires);
	DEFINE_VAR_MORE(str_uri_expires, str_cookie_decrypted, str_cookie_encrypted);
	DEFINE_VAR_MORE(str_escape_password, str_conn, str_conn_debug, str_host, str_body);
	DEFINE_VAR_MORE(str_email_error, str_user_literal, str_sql, str_new_password);
	DEFINE_VAR_MORE(str_old_check_password, str_super_user, str_super_password);
	DEFINE_VAR_MORE(str_expiration, str_session_user, str_uri_super_password);
	DEFINE_VAR_MORE(str_uri_new_password, str_uri_session_user, str_uri_expiration);
	DEFINE_VAR_MORE(str_new_cookie, str_user_quote, str_new_password_literal);
	DEFINE_VAR_MORE(str_uri_timeout, str_one_day_expire);
	
	sun_res *sun_working = NULL;
    
	// get form data
    str_form_data = query(str_request);
	FINISH_CHECK(str_form_data != NULL, "str_query failed");
    str_action = getpar(str_form_data, "action");
	FINISH_CHECK(str_action != NULL, "getpar failed");
    
    // LOGGING IN, SET COOKIE
    if (strncmp(str_action, "login", 5) == 0) {
		NOTICE("REQUEST TYPE: ENVELOPE LOGIN");
		str_user = str_tolower(getpar(str_form_data, "username"));
		FINISH_CHECK(str_user != NULL, "str_tolower failed");
		NOTICE("REQUEST USERNAME: %s", str_user);
		str_password = getpar(str_form_data, "password");
		FINISH_CHECK(str_password != NULL, "getpar failed");
		
		//cookie expiration
		str_expires = str_expire_two_day();
		FINISH_CHECK(str_expires != NULL, "str_expire_two_day failed");
		
		str_one_day_expire = str_expire_one_day();
		FINISH_CHECK(str_one_day_expire != NULL, "str_expire_one_day failed");
		str_uri_expires = cstr_to_uri(str_one_day_expire);
		SFREE(str_one_day_expire);
		FINISH_CHECK(str_uri_expires != NULL, "cstr_to_uri failed");
		FINISH_CAT_CSTR(str_cookie_decrypted, str_form_data, "&expiration=", str_uri_expires);
		
		//COOKIE TIMEOUT INIT
		FINISH_SALLOC(str_uri_timeout, 50);
		time_t time_current1 = time(&time_current1) + int_global_cookie_timeout;
		sprintf(str_uri_timeout, "%ld", time_current1);
		DEBUG("str_uri_timeout: %s", str_uri_timeout);
		FINISH_CAT_APPEND(str_cookie_decrypted, "&timeout=", str_uri_timeout);
		SFREE(str_uri_timeout);
		
		//encrypt
		SFREE(str_uri_expires);
		SFREE_PWORD(str_form_data);
		int cookie_len = strlen(str_cookie_decrypted);
		str_cookie_encrypted = aes_encrypt(str_cookie_decrypted, &cookie_len);
		SFREE_PWORD(str_cookie_decrypted);
		//done encrypting
		
		// assemble connection string, get cnxn handle
		str_escape_password = escape_conninfo_value(str_password);
		FINISH_CHECK(str_escape_password != NULL, "escape_conninfo_value failed");
		char str_conn_port[25];
		sprintf(str_conn_port, "%d", int_global_conn_port);
		FINISH_CAT_CSTR(str_conn, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
			" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
			" user=", str_user, " password=", str_escape_password);
		SFREE(str_escape_password);
		
		FINISH_CAT_CSTR(str_conn_debug, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
			" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
			" user=", str_user, " password=???");
		DEBUG("str_conn>%s<", str_conn_debug);
		SFREE(str_conn_debug);
		
		// **** WARNING ****
		//DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE NEW PASSWORD IN THE CLEAR IN THE LOG!!!!
		//debug("str_conn>%s<", str_conn);
		// **** WARNING ****
		SFREE_PWORD(str_password);
		cnxn = PQconnectdb(str_conn);
		if (PQstatus(cnxn) != CONNECTION_OK) {
			if (str_global_email_work_hours != NULL && strlen(str_global_email_work_hours) > 0) {
				//send email
				str_host = request_header(str_request, "host");
				FINISH_CHECK(str_host != NULL, "request_header failed");
				
				FINISH_CAT_CSTR(str_body, "From: ", str_global_email_from, "\n",
					"To: ", is_work_hours() ? str_global_email_work_hours : str_global_email_off_hours, "\n",
					"Content-Type: text/plain\n",
					"Subject: ", str_host, " Login Failed: ", str_user, "\n\n",
					str_host, " Login Failed: ", str_user);
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
					ERROR_NORESPONSE("str_email_error: %s", str_email_error);
				}
				SFREE(str_email_error);
			}
			
			FINISH("Connection to database failed: %s", PQerrorMessage(cnxn));
		}
  
		// execute cmd, get result
		str_user_literal = PQescapeLiteral(cnxn, str_user, strlen(str_user));
		SFREE(str_user);
		FINISH_CAT_CSTR(str_sql, "SELECT CASE WHEN rolsuper THEN 'TRUE' ELSE 'FALSE' END AS result \
									FROM pg_catalog.pg_roles WHERE rolname = ", str_user_literal, ";");
		SFREE(str_user_literal);
		
		FINISH_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		
		if (strncmp(sun_working->str_result, "TRUE", 4) == 0) {
			ERROR_NORESPONSE("You must not login as a superuser to use envelope.");
			FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n\r\n",
				"{\"stat\": false, \"dat\": {\"error\": \"You must not login as a superuser to use envelope.\"}}");
		} else {
			str_host = request_header(str_request, "host");
			FINISH_CHECK(str_host != NULL, "request_header failed");
			
			char *ptr_host = strchr(str_host, '.');
			str_expires = str_expire_one_day();
			FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
				"Set-Cookie: envelope=", str_cookie_encrypted, "; domain=", ptr_host,
				"; path=/; expires=", str_expires, "; secure; HttpOnly;\r\n\r\n",
				"{\"stat\": true, \"dat\": \"/v1/app/all/index.html\"}");
			SFREE(str_expires);
			SFREE(str_host);
		}
		SFREE_SUN_RES(sun_working);
		
		DEBUG("ENVELOPE COOKIE SET");
		PQfinish(cnxn); cnxn = NULL;
		SFREE(str_action);
		SFREE(str_cookie_encrypted);
		DEBUG("LOGIN END");
		
    //////
    // CHANGE PW, RESET ENVELOPE COOKIE
    } else if (strncmp(str_action, "change_pw", 9) == 0) {
		NOTICE("REQUEST TYPE: PASSWORD CHANGE");
		SFREE(str_action);
		str_new_password = getpar(str_form_data, "password_new");
		FINISH_CHECK(str_new_password != NULL, "getpar failed");
		str_old_check_password = getpar(str_form_data, "password_old");
		FINISH_CHECK(str_old_check_password != NULL, "getpar failed");
		
		SFREE_PWORD(str_form_data);
		str_cookie_encrypted = str_cookie(str_request, "envelope");
		FINISH_CHECK(str_cookie_encrypted != NULL, "str_cookie failed");
		int cookie_len = strlen(str_cookie_encrypted);
		str_cookie_decrypted = aes_decrypt(str_cookie_encrypted, &cookie_len);
		SFREE(str_cookie_encrypted);
		str_user  = str_tolower(getpar(str_cookie_decrypted, "username"));
		str_password = getpar(str_cookie_decrypted, "password");
		str_super_user  = str_tolower(getpar(str_cookie_decrypted, "superusername"));
		str_super_password = getpar(str_cookie_decrypted, "superpassword");
		str_expiration = getpar(str_cookie_decrypted, "expiration");
		str_session_user = getpar(str_cookie_decrypted, "session_user");
		SFREE_PWORD(str_cookie_decrypted);
		
		str_uri_super_password = cstr_to_uri(str_super_password);
		SFREE_PWORD(str_super_password);
		str_uri_new_password = cstr_to_uri(str_new_password);
		str_uri_session_user = cstr_to_uri(str_session_user);
		SFREE(str_session_user);
		str_uri_expiration = cstr_to_uri(str_expiration);
		FINISH_CAT_CSTR(str_new_cookie, "username=", str_user, "&password=", str_uri_new_password,
										"&superusername=", str_super_user, "&superpassword=", str_uri_super_password,
										"&session_user=", str_uri_session_user, "&expiration=", str_uri_expiration);
		SFREE_PWORD(str_uri_new_password);
		SFREE_PWORD(str_uri_super_password);
		SFREE(str_uri_session_user);
		SFREE(str_uri_expiration);
		SFREE(str_super_user);
		
		str_escape_password = escape_conninfo_value(str_password);
		
		// assemble connection string, get cnxn handle
		char str_conn_port[25];
		sprintf(str_conn_port, "%d", int_global_conn_port);
		FINISH_CAT_CSTR(str_conn, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
			" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
			" user=", str_user, " password=", str_escape_password);
		SFREE_PWORD(str_escape_password);
		
		FINISH_CAT_CSTR(str_conn_debug, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
			" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
			" user=", str_user, " password=???");
		DEBUG("str_conn>%s<", str_conn_debug);
		SFREE(str_conn_debug);
		
		// **** WARNING ****
		//DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE NEW PASSWORD IN THE CLEAR IN THE LOG!!!!
		//DEBUG("str_conn>%s<", str_conn);
		// **** WARNING ****
		cnxn = PQconnectdb(str_conn);
		FINISH_CHECK(PQstatus(cnxn) == CONNECTION_OK,
			"connection to database failed: %s", PQerrorMessage(cnxn));
		
		str_user_quote = sun_quote_ident(cnxn, str_user, strlen(str_user));
		SFREE(str_user);
		
		// **** WARNING ****
		//DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE NEW PASSWORD IN THE CLEAR IN THE LOG!!!!
		//DEBUG("pw check>%s|%s|%i<", str_password_old, pword, strncmp(str_password_old, pword, strlen(pword) ));
		// **** WARNING ****
		FINISH_CHECK(strncmp(str_old_check_password, str_password, strlen(str_password)) == 0,
			"Old password does not match.");
		SFREE_PWORD(str_old_check_password);
		SFREE_PWORD(str_password);
		
		str_new_password_literal = PQescapeLiteral(cnxn, str_new_password, strlen(str_new_password));
		SFREE_PWORD(str_new_password);
		FINISH_CAT_CSTR(str_sql, "ALTER ROLE ", str_user_quote, " PASSWORD ", str_new_password_literal, ";");
		// **** WARNING ****
		//DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE NEW PASSWORD IN THE CLEAR IN THE LOG!!!!
		//DEBUG("str_sql>%s<", str_sql);
		// **** WARNING ****
		SFREE(str_user_quote);
		SFREE_PWORD(str_new_password_literal);
		FINISH_EXECUTE(sun_working, cnxn, str_sql);
		SFREE(str_sql);
		
		SFREE_SUN_RES(sun_working);
		
		// **** WARNING ****
		//DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE NEW PASSWORD IN THE CLEAR IN THE LOG!!!!
		//DEBUG("str_new_cookie>%s<", str_new_cookie);
		// **** WARNING ****
		cookie_len = strlen(str_new_cookie);
		str_cookie_encrypted = aes_encrypt(str_new_cookie, &cookie_len);
		SFREE_PWORD(str_new_cookie);
		
		DEBUG("PASSWORD CHANGE");
		str_expires = str_expire_one_day();
		
		str_host = request_header(str_request, "host");
		FINISH_CHECK(str_host != NULL, "request_header failed");
		
		char *ptr_host = strchr(str_host, '.');
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\nContent-Type: application/json; charset=UTF-8\r\n",
			"Set-Cookie: envelope=", str_cookie_encrypted, "; domain=", ptr_host,
			"; path=/; expires=", str_expires, "; secure; HttpOnly\r\n\r\n",
			"{\"stat\": true, \"dat\": \"-1\"}");
		SFREE(str_cookie_encrypted);
		PQfinish(cnxn); cnxn = NULL;
		return str_response;
		
    } else if (strncmp(str_action, "logout", 6) == 0) {
		NOTICE("REQUEST TYPE: LOGOUT ENVELOPE");
		
		str_host = request_header(str_request, "host");
		FINISH_CHECK(str_host != NULL, "request_header failed");
		
		char *ptr_host = strchr(str_host, '.');
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Set-Cookie: envelope=; domain=", str_global_subdomain, ptr_host,
			"; path=/; expires=Tue, 01 Jan 1990 00:00:00 GMT; secure; HttpOnly\r\n",
			"Set-Cookie: envelope=; domain=", ptr_host,
			"; path=/; expires=Tue, 01 Jan 1990 00:00:00 GMT; secure; HttpOnly\r\n",
			"Set-Cookie: postage=; domain=", str_global_subdomain, ptr_host,
			"; path=/; expires=Tue, 01 Jan 1990 00:00:00 GMT; secure; HttpOnly\r\n"
			"Set-Cookie: postage=; domain=", ptr_host,
			"; path=/; expires=Tue, 01 Jan 1990 00:00:00 GMT; secure; HttpOnly\r\n\r\n",
			"<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n",
			"<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en-GB\">\n",
			"<head><script>window.open('https://", str_global_subdomain, ptr_host,
			"', '_self');</script></head><body></body></html>");
		SFREE(str_host);
		SFREE_PWORD(str_form_data);
		SFREE(str_action);
		return str_response;
    }
finish:
	if (cnxn != NULL) {PQfinish(cnxn); cnxn = NULL;}
	SFREE_SUN_RES(sun_working);
	
	SFREE_PWORD(str_form_data);
	SFREE_PWORD(str_password);
	SFREE_PWORD(str_cookie_decrypted);
	SFREE_PWORD(str_cookie_encrypted);
	SFREE_PWORD(str_escape_password);
	SFREE_PWORD(str_conn);
	SFREE_PWORD(str_sql);
	SFREE_PWORD(str_new_password);
	SFREE_PWORD(str_old_check_password);
	SFREE_PWORD(str_super_password);
	SFREE_PWORD(str_uri_super_password);
	SFREE_PWORD(str_uri_new_password);
	SFREE_PWORD(str_new_cookie);
	SFREE_PWORD(str_new_password_literal);
	SFREE_ALL();
	
	return str_response;
}

PGconn *set_cnxn(int csock, char *str_uri, char *str_request) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_host, str_cookie_encrypted, str_cookie_decrypted, str_expires, str_password);
	DEFINE_VAR_MORE(str_escape_password, str_conn, str_conn_debug, str_error, str_json_error, str_uri_encoded);
	DEFINE_VAR_MORE(str_sql, str_statement_timeout_literal, str_timeout, str_uri_timeout, str_cookie_to_encrypt);
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
	
    str_cookie_decrypted = aes_decrypt(str_cookie_encrypted, &int_cookie_len);
	FINISH_CHECK(str_cookie_decrypted != NULL, "aes_decrypt failed");
    SFREE_PWORD(str_cookie_encrypted);
    
	
	//EXPIRATION
	//get expired time
    str_expires = getpar(str_cookie_decrypted, "expiration");
	if (str_expires == NULL) {
		//COOKIE DIDN'T DECRYPT RIGHT
		str_response = expire_cookie(str_uri, str_request);
		goto finish;
	}
	struct tm tm_expires;
	strptime(str_expires, "%a, %d %b %Y %H:%M:%S %Z", &tm_expires);
	SFREE(str_expires);
	time_t time_expires = mktime(&tm_expires);
	
    //get current time
	time_t time_current;
	time(&time_current);
	
	//get diff
	double seconds = difftime (time_current, time_expires);
	DEBUG("seconds: %f", seconds);
	if (seconds > 0) {
		str_response = expire_cookie(str_uri, str_request);
		goto finish;
	}
	
	//COOKIE TIMEOUT
    str_timeout = getpar(str_cookie_decrypted, "timeout");
	FINISH_CHECK(str_timeout != NULL, "getpar failed");
	str_response = cookie_timeout(str_timeout, str_cookie_decrypted, str_request, str_uri);
	SFREE(str_timeout);
	if (str_response) {
		goto finish;
	}
    
	str_current_user = str_tolower(getpar(str_cookie_decrypted, "username"));
	FINISH_CHECK(str_current_user != NULL, "str_tolower(getpar()) failed");
	NOTICE("REQUEST USERNAME: %s", str_current_user);
	str_envelope_user = str_current_user;
    str_password = getpar(str_cookie_decrypted, "password");
	FINISH_CHECK(str_password != NULL, "getpar failed");
    // assemble connection string, get cnxn handle
	
	str_escape_password = escape_conninfo_value(str_password);
    char str_conn_port[25];
	sprintf(str_conn_port, "%d", int_global_conn_port);
    FINISH_CAT_CSTR(str_conn, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
		" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
	    " user=", str_current_user, " password=", str_escape_password);
	SFREE_PWORD(str_escape_password);
	
	FINISH_CAT_CSTR(str_conn_debug, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
		" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
	    " user=", str_current_user, " password=???");
	DEBUG("str_conn>%s<", str_conn_debug);
	SFREE(str_conn_debug);
	
	  // **** WARNING ****
	  //DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE NEW PASSWORD IN THE CLEAR IN THE LOG!!!!
	  //DEBUG("conn>%s< cookie>%s<", conn, str_cookie_decrypted);
	  // **** WARNING ****
    SFREE_PWORD(str_cookie_decrypted);
    SFREE_PWORD(str_password);
    
    cnxn = PQconnectdb(str_conn);
	FINISH_CHECK(cnxn != NULL, "PQconnectdb failed");
	FINISH_CHECK(PQstatus(cnxn) == CONNECTION_OK, "Connection to database failed: %s", PQerrorMessage(cnxn));
    SFREE_PWORD(str_conn);
	
    // must not be super
    FINISH_EXECUTE(sun_working, cnxn,
		"SELECT CASE WHEN sum(CASE WHEN pg_member.rolsuper THEN 1 ELSE 0 END) = 0 THEN 'TRUE' ELSE '' END AS super \
			  , CASE WHEN sum(CASE WHEN pg_grantor.rolname = 'developer_g' THEN 1 ELSE 0 END) > 0 THEN 'TRUE' ELSE '' END AS developer_g \
			  , CASE WHEN sum(CASE WHEN pg_grantor.rolname = 'normal_g' OR \
							            pg_grantor.rolname = 'trusted_g' THEN 1 ELSE 0 END) = 0 THEN 'FALSE' ELSE '' END AS trusted_g \
		   FROM pg_catalog.pg_roles pg_member \
	  LEFT JOIN pg_catalog.pg_auth_members ON pg_auth_members.member = pg_member.oid \
	  LEFT JOIN pg_catalog.pg_roles pg_grantor ON pg_auth_members.roleid = pg_grantor.oid \
	      WHERE pg_member.rolname = SESSION_USER;");

	DEBUG(">%s<", sun_working->str_result);
	
	//only developers get notices back
    if (strncmp(PQgetvalue(sun_working->res, 0, 1), "TRUE", 4) == 0) {
		//set notice processor
		DEBUG("notice proccesser set");
		PQsetNoticeProcessor(cnxn, sunNoticeProcessor, "");
	}
    
    if (strncmp(PQgetvalue(sun_working->res, 0, 2), "FALSE", 5) == 0) {
		bol_global_public = true;
	}
	
    // If we have a good cookie continue, otherwise exit
    FINISH_CHECK(strncmp(sun_working->str_result, "TRUE", 4) == 0, "MUST NOT BE SUPERUSER.");
	SFREE_SUN_RES(sun_working);
	
	char str_statement_timeout[25];
	if (bol_global_public) {
		sprintf(str_statement_timeout, "%d", int_global_statement_timeout_public);
	} else {
		sprintf(str_statement_timeout, "%d", int_global_statement_timeout_trusted);
	}
	str_statement_timeout_literal = PQescapeLiteral(cnxn, str_statement_timeout, strlen(str_statement_timeout));
	FINISH_CAT_CSTR(str_sql, "SET statement_timeout = ", str_statement_timeout_literal, ";");
	FINISH_EXECUTE(sun_working, cnxn, str_sql);
	SFREE_SUN_RES(sun_working);
	
	vod_return = cnxn; cnxn = NULL;
finish:
	SFREE_PWORD(str_cookie_encrypted);
	SFREE_PWORD(str_cookie_decrypted);
	SFREE_PWORD(str_password);
	SFREE_PWORD(str_escape_password);
	SFREE_PWORD(str_conn);
	if (cnxn != NULL) {PQfinish(cnxn); cnxn = NULL;}
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	
	if (str_response != NULL) {
		write(csock, str_response, strlen(str_response));
		SFREE_PWORD(str_response);
	}
	return vod_return;
}

PGconn *set_cnxn_test(int csock, char *uri, char *str_request) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_host, str_expires, str_cookie_encrypted, str_cookie_decrypted);
	DEFINE_VAR_MORE(str_user, str_password, str_escape_password, str_conn, str_conn_debug);
	DEFINE_VAR_MORE(str_sql, str_session_user_quote, str_timeout_literal, str_timeout, str_uri_timeout, str_cookie_to_encrypt);
	PGconn *cnxn = NULL;
	sun_res *sun_working = NULL;
	
	void *vod_return = NULL;
	
	str_host = request_header(str_request, "host");
	FINISH_CHECK(str_host != NULL, "request_header failed");
	
	char *ptr_host = strchr(str_host, '.');
	
	str_cookie_encrypted = str_cookie(str_request, "envelope");
	if (str_cookie_encrypted == NULL || strlen(str_cookie_encrypted) <= 0) {
		if (strncmp(uri, "/file", 5) == 0 || strncmp(uri, "/v1/app", 7) == 0 || strncmp(uri, "/v1/dev", 7) == 0) {
			FINISH_CAT_CSTR(str_response, "HTTP/1.1 303 See Other\r\nLocation: https://",
				str_global_subdomain, ptr_host, "/index.html\r\n\r\n");
			goto finish;
		} else {
			FINISH("No Cookie.");
		}
	}
	
    int int_cookie_len = strlen(str_cookie_encrypted);
	
    str_cookie_decrypted = aes_decrypt(str_cookie_encrypted, &int_cookie_len);
	FINISH_CHECK(str_cookie_decrypted != NULL, "aes_decrypt failed");
    SFREE_PWORD(str_cookie_encrypted);
	
	
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
	double seconds = difftime (time_current, time_expires);
	DEBUG("seconds: %f", seconds);
	if (seconds > 0) {
		str_response = expire_cookie(uri, str_request);
		goto finish;
	}
    
	//COOKIE TIMEOUT
    str_timeout = getpar(str_cookie_decrypted, "timeout");
	FINISH_CHECK(str_timeout != NULL, "getpar failed");
	str_response = cookie_timeout(str_timeout, str_cookie_decrypted, str_request, uri);
	SFREE(str_timeout);
	if (str_response) {
		goto finish;
	}
    
	str_envelope_user = str_tolower(getpar(str_cookie_decrypted, "username"));
	FINISH_CHECK(str_envelope_user != NULL, "str_tolower(getpar()) failed");
    str_user = str_tolower(getpar(str_cookie_decrypted, "superusername"));
	FINISH_CHECK(str_user != NULL, "str_tolower(getpar()) failed");
	NOTICE("REQUEST USERNAME: %s", str_user);
    str_password = getpar(str_cookie_decrypted, "superpassword");
	FINISH_CHECK(str_password != NULL, "getpar failed");
	
	// **** WARNING ****
	//DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE NEW PASSWORD IN THE CLEAR IN THE LOG!!!!
	//DEBUG("str_cookie_decrypted>%s<", str_cookie_decrypted);
	// **** WARNING ****
	
    // assemble connection string, get cnxn handle

	str_escape_password = escape_conninfo_value(str_password);
	FINISH_CHECK(str_escape_password != NULL, "escape_conninfo_value failed");
    
	char str_conn_port[25];
	sprintf(str_conn_port, "%d", int_global_current_conn_port);
    FINISH_CAT_CSTR(str_conn, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
		" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
	    " user=", str_user, " password=", str_escape_password);
	SFREE_PWORD(str_escape_password);
	
	FINISH_CAT_CSTR(str_conn_debug, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
		" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
	    " user=", str_user, " password=???");
	DEBUG("str_conn>%s<", str_conn_debug);
	SFREE(str_conn_debug);
	
	SFREE(str_user);
	
	// **** WARNING ****
	//DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE NEW PASSWORD IN THE CLEAR IN THE LOG!!!!
	//DEBUG("conn>%s<", conn);
	// **** WARNING ****
    SFREE_PWORD(str_password); 
    
    cnxn = PQconnectdb(str_conn);
    SFREE_PWORD(str_conn);
	FINISH_CHECK(PQstatus(cnxn) == CONNECTION_OK, "Connection to database failed: %s", PQerrorMessage(cnxn));
	
    str_current_user = str_tolower(getpar(str_cookie_decrypted, "session_user"));
	
	FINISH_CHECK(strlen(str_current_user) != 0, "Session User is empty.");
	
	str_session_user_quote = sun_quote_ident(cnxn, str_current_user, strlen(str_current_user));
	FINISH_CHECK(str_session_user_quote != NULL, "sun_quote_ident failed");
    SFREE_PWORD(str_cookie_decrypted);

    // execute cmd, get result
	char str_statement_timeout[25];
	sprintf(str_statement_timeout, "%d", int_global_statement_timeout_super);
	str_timeout_literal = PQescapeLiteral(cnxn, str_statement_timeout, strlen(str_statement_timeout));
	FINISH_CAT_CSTR(str_sql, "SET statement_timeout = ", str_timeout_literal, ";",
		"SET SESSION AUTHORIZATION ", str_session_user_quote, "; SELECT 'TRUE'::text;");
	SFREE(str_timeout_literal);
	DEBUG("str_sql: %s", str_sql);
	SFREE(str_session_user_quote);
    FINISH_EXECUTE(sun_working, cnxn, str_sql);
	SFREE(str_sql);

	DEBUG("sun_working->str_result: %s", sun_working->str_result);
	
    //set notice processor
	PQsetNoticeProcessor(cnxn, sunNoticeProcessor, "");
    
    // If we have a good cookie continue, otherwise exit
	FINISH_CHECK(strncmp(sun_working->str_result, "TRUE", 4) == 0, "COOKIE INVALID.");
	SFREE_SUN_RES(sun_working);
	
	vod_return = cnxn;
	cnxn = NULL;
finish:
	SFREE_PWORD(str_cookie_encrypted);
	SFREE_PWORD(str_cookie_decrypted);
	SFREE_PWORD(str_password);
	SFREE_PWORD(str_escape_password);
	SFREE_PWORD(str_conn);
	if (cnxn != NULL) PQfinish (cnxn);
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	
	if (str_response != NULL) {
		write(csock, str_response, strlen(str_response));
		SFREE_PWORD(str_response);
	}
	return vod_return;
}

PGconn *set_cnxn_public(int csock, char *str_request) {
	////connect to cnxn with public password
	// assemble connection string, get cnxn handle
	char *str_response = NULL;
	NOTICE("REQUEST USERNAME: %s", str_global_public_username);
	DEFINE_VAR_ALL(str_escape_pword, str_conn, str_conn_debug, str_ip, str_ip_literal);
	DEFINE_VAR_MORE(str_host, str_host_literal, str_sql, str_timeout_literal, str_user_agent, str_user_agent_literal);
	PGconn *cnxn = NULL;
	sun_res *sun_working = NULL;
	
	void *vod_return = NULL;
	
	
	str_escape_pword = escape_conninfo_value(str_global_public_password);
	FINISH_CHECK(str_escape_pword != NULL, "escape_conninfo_value failed");
	
	char str_conn_port[25];
	sprintf(str_conn_port, "%d", int_global_current_conn_port);
	//sprintf(str_conn_port, "%d", int_global_conn_port);//this is production only
	FINISH_CAT_CSTR(str_conn, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
		" port=", str_conn_port, " dbname=", str_global_conn_dbname,
		" user=", str_global_public_username, " password=", str_escape_pword);
	SFREE(str_escape_pword);
	
	FINISH_CAT_CSTR(str_conn_debug, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
		" port=", str_conn_port, " dbname=", str_global_conn_dbname,
		" user=", str_global_public_username, " password=???");
	DEBUG("str_conn>%s<", str_conn_debug);
	SFREE(str_conn_debug);
	
	str_envelope_user = str_global_public_username;
	str_current_user = str_global_public_username;
	
	// **** WARNING ****
	//DO NOT UNCOMMENT THE NEXT LINE! THAT WILL PUT THE PUBLIC PASSWORD IN THE CLEAR IN THE LOG!!!!
	//DEBUG("str_conn>%s<", str_conn);
	// **** WARNING ****
	cnxn = PQconnectdb(str_conn);
	SFREE_PWORD(str_conn);
	FINISH_CHECK(PQstatus(cnxn) == CONNECTION_OK, "Connection to database failed: %s ", PQerrorMessage(cnxn));
	
	//sunny.request_ip
	//set_config('sunny.request_ip', new_value, false)
	str_user_agent = request_header(str_request, "User-Agent");
	FINISH_CHECK(str_user_agent != NULL, "request_header failed");
	
	str_user_agent_literal = PQescapeLiteral(cnxn, str_user_agent, strlen(str_user_agent));
	FINISH_CHECK(str_user_agent_literal != NULL, "PQescapeLiteral failed");
	SFREE(str_user_agent);
	
	str_ip = request_header(str_request, "X-Forwarded-For");
	FINISH_CHECK(str_ip != NULL, "request_header failed");
	
	str_ip_literal = PQescapeLiteral(cnxn, str_ip, strlen(str_ip));
	FINISH_CHECK(str_ip_literal != NULL, "PQescapeLiteral failed");
	SFREE(str_ip);
	
	str_host = request_header(str_request, "host");
	FINISH_CHECK(str_host != NULL, "request_header failed");
	
	str_host_literal = PQescapeLiteral(cnxn, str_host, strlen(str_host));
	FINISH_CHECK(str_host_literal != NULL, "PQescapeLiteral failed");
	SFREE(str_host);
	
	char str_statement_timeout[25];
	sprintf(str_statement_timeout, "%d", int_global_statement_timeout_public);
	str_timeout_literal = PQescapeLiteral(cnxn, str_statement_timeout, strlen(str_statement_timeout));
	FINISH_CAT_CSTR(str_sql, "SET statement_timeout = ", str_timeout_literal, ";\
		SELECT set_config('sunny.request_user_agent', ", str_user_agent_literal, ", false);\
		SELECT set_config('sunny.request_ip', ", str_ip_literal, ", false);\
		SELECT set_config('sunny.request_host', ", str_host_literal, ", false);");
	SFREE(str_timeout_literal);
	SFREE(str_user_agent_literal);
	SFREE(str_ip_literal);
	SFREE(str_host_literal);
	FINISH_EXECUTE(sun_working, cnxn, str_sql);
	SFREE(str_sql);
	SFREE_SUN_RES(sun_working);
	
	bol_global_public = true;
	vod_return = cnxn; cnxn = NULL;
finish:
	SFREE_PWORD(str_escape_pword);
	SFREE_PWORD(str_conn);
	if (cnxn != NULL) {PQfinish(cnxn); cnxn = NULL;}
	SFREE_SUN_RES(sun_working);
	SFREE_ALL();
	
	if (str_response != NULL) {
		write(csock, str_response, strlen(str_response));
		SFREE_PWORD(str_response);
	}
	return vod_return;
}
