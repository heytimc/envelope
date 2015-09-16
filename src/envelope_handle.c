#include "envelope_handle.h"

// ###############################################
// handle connection

#define BUF_LEN 2048
bool handle(int csock) {
	NOTICE("################# REQUEST");
	PGconn *cnxn = NULL;
	char buf[BUF_LEN + 2];
	buf[0] = 0;
	DEFINE_VAR_ALL(str_response, str_request, str_uri, str_temp, str_form_data);
	DEFINE_VAR_MORE(str_correct_referer_start1, str_correct_referer_start2);
	DEFINE_VAR_MORE(str_referer, str_host, str_request_len, str_boundary);
	DEFINE_VAR_MORE(str_cookie_envelope, str_complete_response, str_buffer);
	
	DEBUG("### get the str_request\n");
	//##########################################
	//### get the str_request
	
	//DEBUG(">%d|%d<", SSIZE_MAX, BUF_LEN);
	
	int int_request_len = BUF_LEN;
	memset(buf, 0, BUF_LEN + 1);
	int_request_len = read(csock, buf, BUF_LEN);
	FINISH_SALLOC(str_request, int_request_len + 1);
	memcpy(str_request, buf, int_request_len);
	str_request[int_request_len] = '\0';
	
	//HERE BE DRAGONS
	//Maintainer: joseph
	//This code reads from the socket only for as long as is necessary.
	//If we have just one extra read command, it will hang until the browser
	//sends more data. Which it won't. So read until end of request.
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

	char *ptr_boundary_start = strstr(str_request, "Content-Type: multipart/form-data; boundary=");
	if (ptr_boundary_start != NULL &&
		strchr(ptr_boundary_start, 13) == NULL) {
		memset(buf, 0, BUF_LEN + 1);
		int int_current_length = read(csock, buf, BUF_LEN);
		FINISH_SREALLOC(str_request, int_current_length + int_request_len + 1);
		memcpy(str_request + int_request_len, buf, int_current_length);
		str_request[int_current_length + int_request_len] = '\0';
		int_request_len = int_request_len + int_current_length;
	}
	
	//DEBUG("test0>%s|%i<", str_request, int_request_len);
	
	char *request_ptr;
	//// ****if upload then special case
	if (strstr(str_request, "Content-Type: multipart/form-data; boundary=") != 0) {
		//get boundary
		char *boundary_ptr = strstr(str_request, "Content-Type: multipart/form-data; boundary=") + 44;
		char *boundary_end_ptr = strchr(boundary_ptr, 13) != 0 ?	strchr(boundary_ptr, 13) : strchr(boundary_ptr, 10);
		DEBUG("str_boundary: %d %d", boundary_end_ptr, boundary_ptr);
		int int_boundary_length = boundary_end_ptr - boundary_ptr;
		DEBUG("str_boundary: %d", int_boundary_length);
		FINISH_SALLOC(str_boundary, int_boundary_length + 3); //extra and null byte
		DEBUG("TESTING1");
		memcpy(str_boundary, boundary_ptr, int_boundary_length);
		DEBUG("TESTING2");
		str_boundary[int_boundary_length + 0] = '-';
		DEBUG("TESTING3");
		str_boundary[int_boundary_length + 1] = '-';
		DEBUG("TESTING4");
		str_boundary[int_boundary_length + 2] = '\0';
		DEBUG("TESTING5");
		int int_current_length = BUF_LEN;
		DEBUG("TESTING6");
		//DEBUG("str_boundary: %s", str_boundary);
		//DEBUG("str_request: %s", str_request);
		DEBUG("bstrstr(\"%-10s\", %d, \"%s\", %d", str_request, int_request_len, str_boundary, int_boundary_length + 2);
		/*
		DEBUG("test0>%s<", bstrstr(
						str_request, int_request_len,
						str_boundary, int_boundary_length + 2) == NULL ? "NULL" : "NOT NULL");
		while (bstrstr(
					str_request, int_request_len,
					str_boundary, int_boundary_length + 2) == NULL) {//while null
			DEBUG("test1");
			memset(buf, 0, BUF_LEN + 1);
			//FINISH_SALLOC(str_buffer, BUF_LEN + 2);
			DEBUG("test2");
			int_current_length = read(csock, buf, BUF_LEN);
			DEBUG("test3");
			FINISH_SREALLOC(str_request, int_request_len + int_current_length + 1);
			DEBUG("test4>%s<", str_request);
			memcpy(str_request + int_request_len, buf, int_current_length);
			int_request_len = int_request_len + int_current_length;
			str_request[int_request_len] = '\0';
			//SFREE(str_buffer);
			DEBUG("test5>%i<", int_request_len);
		}
		*/
		DEBUG(">%s<", bstrstr(
						str_request + int_request_len - int_current_length - int_boundary_length,
						int_current_length + int_boundary_length,
						str_boundary, int_boundary_length + 2) == NULL ? "NULL" : "NOT NULL");
		while (bstrstr(
					str_request + int_request_len - int_current_length - int_boundary_length,
					int_current_length + int_boundary_length,
					str_boundary, int_boundary_length + 2) == NULL) {//while null
			memset(buf, 0, BUF_LEN + 1);
			//DEBUG("test1");
			int_current_length = read(csock, buf, BUF_LEN);
			//DEBUG("test2");
			FINISH_SREALLOC(str_request, int_request_len + int_current_length + 1);
			//DEBUG("test3>%s<", str_request);
			memcpy(str_request + int_request_len, buf, int_current_length);
			int_request_len = int_request_len + int_current_length;
			str_request[int_request_len] = '\0';
			//DEBUG("test4>%i<", int_request_len);
		}
		DEBUG("test5>%s<", bstrstr(
						str_request,
						int_request_len,
						str_boundary, int_boundary_length + 2) - 25);
		SFREE(str_boundary);
	
	////  ****
	// if post or put, then get content length and receive that amount after two newlines, then break
	} else if (strncmp(str_request, "P", 1) == 0) {
		//we need Content-Length: before we can continue
		while (! strstr(str_request, "Content-Length:")) {
			memset(buf, 0, BUF_LEN + 1);
			//DEBUG("test1");
			int_request_len = read(csock, buf, BUF_LEN);
			//DEBUG("test2>%i<", int_request_len);
			//buf[request_len] = 0;
			FINISH_CAT_APPEND(str_request, buf);
			//DEBUG("#request_len:%d", int_request_len);
		}
		request_ptr = strstr(str_request, "Content-Length:");
		// if we didn't find anything we need to stop, len("Content-Length")==15
		if (strlen(request_ptr) < 16) {
			// error bad str_request
			FINISH("Bad str_request");
		}
		// move pointer to start of content length value
		request_ptr = request_ptr + 15;
		//DEBUG("request_ptr>%s<", request_ptr);
		
		// step through the buffer and see if we can get the length
		int req_len = 0;
		while (request_ptr != 0 && *request_ptr != '\r' && *request_ptr != '\n') {
			if (request_ptr == 0 && req_len == 0) {
				// error bad str_request
			}
			//do not comment next line!!!!!!!! give inconsistent output without this line!!!!!! idk why!!!!!!!
			//DEBUG("test1>%c<", *request_ptr);
			///////////////
			if (*request_ptr != '\r' && *request_ptr != '\n') {
				request_ptr = request_ptr + 1;
				req_len = req_len + 1;
			}
		}
		FINISH_SALLOC(str_request_len, req_len + 1);
		request_ptr = request_ptr - req_len;
		memcpy(str_request_len, request_ptr, req_len);
		str_request_len[req_len] = '\0';
		//DEBUG("test2>%s|%s<", str_request_len, request_ptr, req_len);
		req_len = atoi(str_request_len);
		SFREE(str_request_len);
		while (strstr(str_request,"\r\n\r\n") == 0 && strstr(str_request, "\n\n") == 0 && strstr(str_request, "\r\r") == 0) {
			memset(buf,0,BUF_LEN + 1);
			int_request_len = read(csock, buf, BUF_LEN);
			FINISH_CAT_APPEND(str_request, buf);
		}
		request_ptr = strstr(str_request,"\r\n\r\n") != 0 ? strstr(str_request,"\r\n\r\n") + 4 :
			strstr(str_request,"\n\n") != 0 ? strstr(str_request,"\n\n") + 2 :
			strstr(str_request,"\r\r") != 0 ? strstr(str_request,"\r\r") + 2 : 0;
		unsigned int int_length_we_want = ((request_ptr - str_request) + req_len);
		//DEBUG("test3>%s|%s<", str_request, request_ptr);
		//DEBUG("test4>%i|%i|%i|%i<\n", int_length_we_want, strlen( str_request ), (request_ptr - str_request), req_len);
	
		while (int_length_we_want > strlen(str_request)) {
			memset(buf,0,BUF_LEN + 1);
			int_request_len = read(csock, buf, BUF_LEN);
			FINISH_CAT_APPEND(str_request, buf);
			//DEBUG("test4.1>%i|%i<\n", int_length_we_want, strlen( str_request ));
		}
		//DEBUG("test5\n");
		int_request_len = strlen(str_request);
    
	// if not POST, then break at two newlines.
	// (only other request we accept is GET, we don't use any other methods of request)
	} else {
		while (strstr(str_request,"\r\n\r\n") == 0 && strstr(str_request,"\n\n") == 0 && strstr(str_request,"\r\r") == 0) {
			memset(buf, 0, BUF_LEN + 1);
			int_request_len = read(csock, buf, BUF_LEN);
			FINISH_CAT_APPEND(str_request, buf);
		}
		int_request_len = strlen(str_request);
	}
	DEBUG("request_len>%i<", strlen(str_request));
	
	
	/*
	//for testing actions
	GS.ajaxJSON('URI', 'PARAMS', function (data, error) {
		if (!error) {
			console.log(data);
			
		} else {
			GS.ajaxErrorDialog(data);
		}
	});
	*/
	
	
	
	
	str_uri = str_uri_path(str_request);
	FINISH_CHECK(str_uri != NULL,
		"str_uri_path failed");
	INFO("### str_uri: %s", str_uri);
	
	str_host = request_header(str_request, "host");
	INFO("### str_host: %s", str_host);
	//DEBUG("### REQUEST: %s", str_request);
	
	//check referer
	str_referer = request_header(str_request, "Referer");
	INFO("### str_referer: %s", str_referer);
	
	//when we have a referer, we should make sure it matches our website, but we have a few exceptions.
	if (str_referer != NULL) {
		FINISH_CAT_CSTR(str_correct_referer_start1, "https://", str_host);
		FINISH_CAT_CSTR(str_correct_referer_start2, "http://" , str_host);
		FINISH_CHECK(
			strncmp(str_correct_referer_start1, str_referer, strlen(str_correct_referer_start1)) == 0 ||
			strncmp(str_correct_referer_start2, str_referer, strlen(str_correct_referer_start2)) == 0 ||
			strlen(str_referer) <= 0 ||
			strncmp(str_uri, "/v1/"        , 4 ) != 0 ||
			//strncmp(str_uri, "/v1/env/auth", 12) == 0 ||
			strncmp(str_uri, "/v1/cluster" , 11) == 0 ||
			strncmp(str_uri, "/v1/app"     , 7 ) == 0 ||
			strncmp(str_uri, "/v1/dev"     , 7 ) == 0,
			"Referer does not match host.");
		SFREE(str_correct_referer_start1);
		SFREE(str_correct_referer_start2);
	}
	
	//####################################################################################################
	//######################################### MANAGE COOKIES ###########################################
	// set up database connection
	// FEAR NOT GCC! This will not be used uninitialized.
	//PQinitOpenSSL(0, 0); //prevent Libpq from initializing ssl
	
	bool bol_valid_subdomain = false;
	
	//if subdomain database configuration is active, then change int_global_current_conn_port
	//we use int_global_current_conn_port to connect to the postgres instance
	//if the subdomain is the default subdomain, we should connect to production
	//if the subdomain is not the default subdomain, we should connect to the correct developer area
	//if the subdomain is not recognized, we should connect to production
	if (strlen(str_global_developers) > 0) {
		char *temp = strchr(str_host, '.');
		int int_length = temp - str_host;
		FINISH_SALLOC(str_current_subdomain, int_length + 1);
		DEBUG("### str_host: %s, temp: %s, char: %c, int_length: %d\n", str_host, temp, '.', int_length);
		memcpy(str_current_subdomain, str_host, int_length);
		str_current_subdomain[int_length] = '\0';
		str_temp = getport(str_global_developers, str_current_subdomain);
		FINISH_CHECK(str_temp != NULL, "getport failed");
		if (strlen(str_temp) > 0) {
			DEBUG("VALID SUBDOMAIN DETECTED >%s|%s<", str_global_developers, str_temp);
			int_global_current_conn_port = atoi(str_temp);
			bol_valid_subdomain = true;
		}
		SFREE(str_temp);
	} else {
		FINISH_CAT_CSTR(str_current_subdomain, "");
	}
	
	DEBUG(">%s|%s|%i|%i<", str_uri, "/auth_envelope/accept_auth", strlen(str_uri), strncmp(str_uri, "/auth_envelope/accept_auth", 26) == 0);
	
	DEBUG("test0>str_request: %s", str_request);
	str_cookie_envelope = str_cookie(str_request, "envelope");
	DEBUG("test1");
	
	bol_global_public = false;
	
	DEBUG("str_uri: >%s< str_uri + 13 + strcspn(str_uri + 13, \"./\"): >%s<", str_uri, str_uri + 13 + strcspn(str_uri + 13, "./"));
	
	// if the URL does not start with /v1
	// then serve from the web_root
	if (strncmp(str_uri, "/v1/", 4) != 0) {
		str_response = link_web_root(csock, str_uri, bol_valid_subdomain ? str_current_subdomain : "");
		FINISH_CHECK(str_response != NULL, "link_web_root failed");
		goto finish;
		
	// postgres functions that start with actionnc_ or acceptnc_
	// these CAN have a COOKIE, but it WON'T BE USED
	// set up a public connection
	} else if (//str_cookie_envelope == NULL &&
		strlen(str_uri) >= 13 && strncmp(str_uri, "/v1/cluster/", 12) == 0 &&
		(strncmp(str_uri + 13 + strcspn(str_uri + 13, "./"), ".acceptnc_", 10) == 0 ||
		 strncmp(str_uri + 13 + strcspn(str_uri + 13, "./"), ".actionnc_", 10) == 0)) {
		cnxn = set_cnxn_public(csock, str_request);
		
	// built in envelope functions
	// these links CAN have a COOKIE, but if we don't then set up a public connection
	} else if (str_cookie_envelope == NULL &&
			   ((strlen(str_uri) >= 18 && strncmp(str_uri, "/v1/env/action_info"         , 18) == 0) ||
				(strlen(str_uri) >= 20 && strncmp(str_uri, "/v1/env/action_upload"       , 20) == 0) ||
				(strlen(str_uri) >= 22 && strncmp(str_uri, "/v1/env/accept_download"     , 22) == 0) ||
				(strlen(str_uri) >= 23 && strncmp(str_uri, "/v1/envelope/action_info"    , 23) == 0) ||
				(strlen(str_uri) >= 25 && strncmp(str_uri, "/v1/envelope/action_upload"  , 25) == 0) ||
				(strlen(str_uri) >= 27 && strncmp(str_uri, "/v1/envelope/accept_download", 27) == 0) ||
			    (strlen(str_uri) >= 21 && strncmp(str_uri, "/v1/env/action_select", 21) == 0) ||
				(strlen(str_uri) >= 21 && strncmp(str_uri, "/v1/env/action_update", 21) == 0) ||
				(strlen(str_uri) >= 21 && strncmp(str_uri, "/v1/env/action_insert", 21) == 0) ||
				(strlen(str_uri) >= 21 && strncmp(str_uri, "/v1/env/action_delete", 21) == 0) ||
				(strlen(str_uri) >= 20 && strncmp(str_uri, "/v1/env/action_order" , 20) == 0))) {
		cnxn = set_cnxn_public(csock, str_request);
		
	// authentication links for normal user, these CAN have a COOKIE
	} else if ((strlen(str_uri) >= 26 && strncmp(str_uri, "/auth_envelope/accept_auth", 26) == 0) ||
		(strlen(str_uri) >= 12 && strncmp(str_uri, "/v1/env/auth", 12) == 0)) {
		/*
		FINISH_CHECK(strncmp(str_current_subdomain, str_global_subdomain, strlen(str_global_subdomain)) == 0,
			"Must be in \"%s\" subdomain.", str_global_subdomain);
		*/
		
		str_response = link_auth(cnxn, str_request);
		FINISH_CHECK(str_response != NULL, "link_auth failed");
		goto finish;
	
	// authentication links for superuser, these REQUIRE a COOKIE
	} else if ((strlen(str_uri) >= 16 && strncmp(str_uri, "/v1/postage/auth", 16) == 0)) {
		str_response = link_auth_postage(str_request);
		FINISH_CHECK(str_response != NULL, "link_auth_postage failed");
		goto finish;
	
	// superuser links, these REQUIRE a COOKIE
	} else if (strncmp(str_uri, "/v1/dev"    , 7 ) == 0 ||
			   strncmp(str_uri, "/v1/postage", 11) == 0 ||
			   strncmp(str_uri, "/v1/sql"    , 7 ) == 0) {
		cnxn = set_cnxn_postage(csock, str_uri, str_request);
	
	// subdomain links, these REQUIRE a COOKIE
	} else if (bol_valid_subdomain) {
		cnxn = set_cnxn_test(csock, str_uri, str_request);
	
	// production links, these REQUIRE a COOKIE
	} else {
		cnxn = set_cnxn(csock, str_uri, str_request);
	}
	
	//IF NULL THEN EXIT, CSOCK IS ALREADY WRITTEN TO BY set_cnxn AND set_cnxn_test
	if (cnxn == NULL) {
		//if we use FINISH_CHECK, there will be a sunlogf
		//we don't want a sunlogf cause there is no error. we just want to return
		goto finish;
	}
	
	// cnxn GARANTEED TO BE VALID HERE
	
	//if public cookie (or nocookie always) then public action
	if (bol_global_public) {
		str_response = main_public_action(cnxn, csock, str_uri, str_request, int_request_len,
										  bol_valid_subdomain ? str_current_subdomain : "");
		FINISH_CHECK(str_response != NULL, "link_auth failed");
		goto finish;
	}
	
	//################################################################################################
	//########################## HAVE COOKIE, HAVE CNXN, PARSE REQUESTS ##############################
	DEBUG("COOKIE IS VALID");
	
	//not a webroot request
	if (strncmp(str_uri, "/v1/", 4) == 0) {
		char *ptr_uri = str_uri + 3;
		
		//this link is for accessing the database
		if (strlen(ptr_uri) >= 9 && strncmp(ptr_uri, "/cluster/", 9) == 0) {
			str_response = link_cluster(cnxn, ptr_uri, str_request, csock);
			FINISH_CHECK(str_response != NULL, "link_cluster failed");
			
		//this link is for uploading a file to role
		} else if (strlen(ptr_uri) >= 16 && strncmp(ptr_uri, "/upload_envelope", 16) == 0) {
			str_response = link_upload(cnxn, str_request, int_request_len, bol_valid_subdomain ? str_current_subdomain : "");
			FINISH_CHECK(str_response != NULL, "link_upload failed");
			
		//this link is for builtin c actions like action_select (read from view)
		} else if (strlen(ptr_uri) >= 10 && strncmp(ptr_uri, "/envelope/", 10) == 0) {
			// link system is in envelope_handle_c.c
			str_response = link_system(cnxn, csock, ptr_uri + 5, str_request, int_request_len, bol_valid_subdomain ? str_current_subdomain : "");
			FINISH_CHECK(str_response != NULL, "link_system failed");
		
		//shorter version of the above link
		} else if (strlen(ptr_uri) >= 5 && strncmp(ptr_uri, "/env/", 5) == 0) {
			// link system is in envelope_handle_c.c
			str_response = link_system(cnxn, csock, ptr_uri, str_request, int_request_len, bol_valid_subdomain ? str_current_subdomain : "");
			FINISH_CHECK(str_response != NULL, "link_system failed");
			
		//read file from role
		} else if (strlen(ptr_uri) >= 6 && strncmp(ptr_uri, "/role/", 6) == 0) {
			str_response = link_role(csock, cnxn, ptr_uri, bol_valid_subdomain ? str_current_subdomain : "");
			FINISH_CHECK(str_response != NULL, "link_role failed");
			
		//read app file
		} else if (strncmp(ptr_uri, "/app/", 5) == 0) {
			str_response = link_apps(csock, cnxn, ptr_uri, bol_valid_subdomain ? str_current_subdomain : "");
			FINISH_CHECK(str_response != NULL, "link_apps failed");
			
		//read app file, but require superuser
		} else if (strncmp(ptr_uri, "/dev/", 5) == 0) {
			str_response = link_apps(csock, cnxn, ptr_uri, bol_valid_subdomain ? str_current_subdomain : "");
			FINISH_CHECK(str_response != NULL, "link_apps failed");
			
		//more builtin c actions, but require superuser
		} else if (strlen(ptr_uri) >= 9 && strncmp(ptr_uri, "/postage/", 9) == 0) {
			// link system is in postage_handle_c2.c
			str_response = link_system_postage(cnxn, csock, ptr_uri, str_request, int_request_len);
			FINISH_CHECK(str_response != NULL, "link_system_postage failed");
			
		//run arbitrary sql, must be superuser
		} else if (strlen(ptr_uri) >= 4 && strncmp(ptr_uri, "/sql", 4) == 0) {
			str_response = link_sql(csock, cnxn, str_request);
			FINISH_CHECK(str_response != NULL, "link_sql failed");
			
		//if none of these, error
		} else {
			NOTICE("REQUEST TYPE: UNHANDLED str_uri:%s", str_uri);
			FINISH_CAT_CSTR(str_response, "HTTP/1.1 303 See Other\r\nLocation: /index.html\r\n");
		}
	
	//web_root request should already have been handled, error
	} else {
		NOTICE("REQUEST TYPE: UNHANDLED str_uri:%s", str_uri);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 303 See Other\r\nLocation: /index.html\r\n");
	}
	
finish:
	if (str_response != NULL) {
		INFO("REPLACE COOKIE IN str_response");
		//replace cookie before expiration
		str_complete_response = replace_cookie(str_response, str_request);
		SFREE_PWORD(str_response);
		
		DEBUG("str_complete_response: %s", str_complete_response);
		
		if ((long)write(csock, str_complete_response, strlen(str_complete_response)) != (long)strlen(str_complete_response)) {
			str_complete_response = ERROR_RESPONSE("write failed: %d (%s)", errno, strerror(errno));
			write(csock, str_complete_response, strlen(str_complete_response));
		}
	} else {
		ERROR_NORESPONSE("no str_response");
	}
	fsync(csock);
	NOTICE("RESPONSE SENT %d bytes", strlen(str_complete_response));
	if (cnxn != NULL) PQfinish(cnxn);
	SFREE_PWORD(str_request);
	SFREE_ALL();
	return true;
}

