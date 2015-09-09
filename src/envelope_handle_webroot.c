#include "envelope_handle_webroot.h"

//respond with partial error
char *link_web_root(int csock, char *str_uri, char *str_subdomain) {
	char *str_response = NULL;
	NOTICE("REQUEST TYPE: READ WEB_ROOT FILE");
	DEFINE_VAR_ALL(str_buffer, str_canonical_start, str_path, str_uri_part);
	
	//remove ? and everything after (same with #)
	FINISH_CAT_CSTR(str_uri_part, str_uri);
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
	
	INFO("REQUEST FILE: %s", str_uri_part);
	
	
	////
	str_path = uri_to_cstr(str_uri_part, strlen(str_uri_part));
	FINISH_CHECK(str_path != NULL, "uri_to_cstr failed");
	
	int int_length;
	DEBUG("str_canonical_start: %s, str_path: %s", str_canonical_start, str_path);
	FINISH_CHECK(canonical_exists_file(str_canonical_start, str_path), "File does not exist.");
	str_buffer = canonical_read_file(str_canonical_start, str_path, &int_length);
	FINISH_CHECK(str_buffer != NULL, "canonical_read_file failed");
	SFREE(str_path);
	SFREE(str_canonical_start);
	
	//write
	char str_length[100];
	sprintf(str_length, "%i", int_length);
	FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\nContent-type: ", contenttype(str_uri_part), "\r\n",
		"Content-Length: ", str_length, "\r\n\r\n");
	DEBUG("strlen(str_response): %d", strlen(str_response));
    write(csock, str_response, strlen(str_response));
	SFREE(str_response);
	FINISH_CAT_CSTR(str_response, "");
	DEBUG("int_length: %d", int_length);
	write(csock, str_buffer, int_length);
	SFREE(str_buffer);
	////
	
	SFREE(str_uri_part);
finish:
	SFREE_ALL();
	return str_response;
}