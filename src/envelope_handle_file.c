#include "envelope_handle_file.h"

//return file
char *link_apps(int csock, PGconn * cnxn, char *str_uri, char *str_subdomain) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_uri_part, str_path, str_canonical_start, str_result, str_response_part1);
	
	NOTICE("REQUEST TYPE: READ APP PAGE");
	
	char *ptr_uri = str_uri + 5; //go past /app/
    
	//remove ? and everything after (same with #)
	FINISH_CAT_CSTR(str_uri_part, ptr_uri);
	if (strchr(str_uri_part, '?') != NULL) {
		str_uri_part[strchr(str_uri_part, '?') - str_uri_part] = '\0';
	}
	if (strchr(str_uri_part, '#') != NULL) {
		str_uri_part[strchr(str_uri_part, '#') - str_uri_part] = '\0';
	}
	
	//users with 'developer_g' ALWAYS returns true with ddl_readable and ddl_writeable
	//the 'postgres' user ALWAYS returns true with ddl_readable and ddl_writeable.
	//the 'all' folder ALWAYS returns true with ddl_readable and ddl_writeable
	
	FINISH_CHECK(ddl_readable(cnxn, str_uri_part), "No permission to folder.");
	
	if (strlen(str_subdomain) > 0) {
		if (strncmp(str_subdomain, "production", 10) == 0) {
			FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production/dev/");
		} else {
			FINISH_CHECK(username_check(str_subdomain), "Username not set up.");
			FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_subdomain, "/dev/");
		}
	} else {
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production/dev/");
	}
	int int_result_len;
	
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
	
	str_path = uri_to_cstr(str_uri_part, strlen(str_uri_part));
	FINISH_CHECK(str_path != NULL, "uri_to_cstr failed");
	
	// permission checking
	INFO("REQUEST PAGE: %s", str_uri_part);
	
	FINISH_CHECK(canonical_exists_file(str_canonical_start, str_path), "File does not exist.");
	str_result = canonical_read_file(str_canonical_start, str_path, &int_result_len);
	SFREE(str_canonical_start);
	FINISH_CHECK(str_result != NULL, "canonical_read_file failed");
	
	char str_result_len[50];
	sprintf(str_result_len, "%d", int_result_len);
	DEBUG("str_uri_part>%s<", str_uri_part);
	FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
		"Length: ", str_result_len, "\r\n",
		"Content-type: ", contenttype(str_uri_part), "\r\n\r\n");
	SFREE(str_uri_part);
	
	int int_response_len = strlen(str_response);
    write(csock, str_response, int_response_len);
	SFREE(str_response);
	FINISH_CAT_CSTR(str_response, "");
    write(csock, str_result, int_result_len);
    SFREE(str_result);
	
finish:
    SFREE_ALL();
	return str_response;
}
