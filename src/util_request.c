#include "util_request.h"

char *query(char *str_request) {
	char *str_return = NULL;
	DEFINE_VAR_ALL(str_uri);
	
	// find the form_data by request type
	if (strncmp(str_request, "GET ", 4 ) == 0) {
		str_uri = str_uri_path(str_request);
		ERROR_CHECK(str_uri != NULL, "str_uri_path failed");
		
		char *ptr_query = strstr(str_uri, "?");
		ERROR_CHECK(ptr_query != NULL, "no form data");
		
		ERROR_CAT_CSTR(str_return, ptr_query + 1); // advance cursor past "?"
		SFREE(str_uri);
	} else {
		//rewritten to work with safari, still doesn't work
		char *temp1 = strstr(str_request, "\r\n\r\n");
		char *temp2 = strstr(str_request, "\n\n");
		char *ptr_query = NULL;
		if (temp1 == 0 && temp2 == 0) {
			ERROR("no form data");
		} else if (temp1 != 0 && temp2 == 0) {
			ptr_query = temp1 + 4;
		} else if (temp1 == 0 && temp2 != 0) {
			ptr_query = temp2 + 2;
		} else {
			if (temp1 < temp2) {
				ptr_query = temp1 + 4;
			} else {
				ptr_query = temp2 + 2;
			}
		}
		ERROR_CAT_CSTR(str_return, ptr_query);
	}
	
	// return just the form_data
	SFREE_ALL();
	return str_return;
error:
	SFREE_ALL();
	return NULL;
}

char *request_header(char *str_request, char *str_name) {
	char *str_return = NULL;
	
	DEFINE_VAR_ALL(str_full_name);
	ERROR_CAT_CSTR(str_full_name, str_name, ": ");
	// find the cookie
	char *ptr_header = strstr(str_request, str_full_name);
	WARN_CHECK(ptr_header != NULL, "no %s found", str_name);
	
	ptr_header = ptr_header + strlen(str_full_name); // advance cursor past "referer: "
	
	// get cookie length
	char *ptr_header_end_return = strstr(ptr_header, "\r\n");
	int int_header_len;
	if (ptr_header_end_return == NULL) {
		ptr_header_end_return = strstr(ptr_header, "\r");
		if (ptr_header_end_return == NULL) {
			ptr_header_end_return = strstr(ptr_header, "\n");
			if (ptr_header_end_return == NULL) {
				int_header_len = strlen(ptr_header);
			} else {
				int_header_len = ptr_header_end_return - ptr_header;
			}
		} else {
			int_header_len = ptr_header_end_return - ptr_header;
		}
	} else {
		int_header_len = ptr_header_end_return - ptr_header;
	}
	
	// return just the host
	ERROR_SALLOC(str_return, int_header_len + 1);
	memcpy(str_return, ptr_header, int_header_len);
	str_return[int_header_len] = '\0';
	
	SFREE_ALL();
	return str_return;
error:
	
	SFREE_ALL();
	SFREE(str_return);
	return NULL;
}

char *str_cookie(char *str_request, char *str_cookie_name) {
	char *str_return = NULL;
	DEFINE_VAR_ALL(str_full_cookie);
	
	DEBUG("str_cookie 1");
	
	ERROR_CAT_CSTR(str_full_cookie, str_cookie_name, "=");
	
	DEBUG("str_cookie 2");
	
	// find the cookie
	char *ptr_cookie = strstr(str_request, "Cookie:");
	WARN_CHECK(ptr_cookie != NULL, "no cookie found");
	ptr_cookie = strstr(ptr_cookie, str_full_cookie);
	WARN_CHECK(ptr_cookie != NULL, "no cookie found");
	ptr_cookie = ptr_cookie + strlen(str_full_cookie); // advance cursor past "postage="
	SFREE(str_full_cookie);
	
	DEBUG("str_cookie 3");
	
	// get cookie length
	char *ptr_cookie_end_return = strstr(ptr_cookie, "\r\n");
	char *ptr_cookie_end_semi = strstr(ptr_cookie, ";");
	int int_cookie_len;
	
	DEBUG("str_cookie 4");
	
	if (ptr_cookie_end_return == NULL && ptr_cookie_end_semi == NULL) {
		int_cookie_len = strlen(ptr_cookie);
	} else if (ptr_cookie_end_return != NULL && ptr_cookie_end_semi == NULL) {
		int_cookie_len = ptr_cookie_end_return - ptr_cookie;
	} else if (ptr_cookie_end_return == NULL && ptr_cookie_end_semi != NULL) {
		int_cookie_len = ptr_cookie_end_semi - ptr_cookie;
	} else {
		int_cookie_len = (ptr_cookie_end_return < ptr_cookie_end_semi) ? ptr_cookie_end_return - ptr_cookie : ptr_cookie_end_semi - ptr_cookie;
	}
	
	DEBUG("str_cookie 5");
	
	// return just the postage cookie
	ERROR_SALLOC(str_return, int_cookie_len + 1);
	memcpy(str_return, ptr_cookie, int_cookie_len);
	str_return[int_cookie_len] = '\0';
	
	DEBUG("str_cookie 6");
	
	SFREE_PWORD_ALL();
	return str_return;
error:
	SFREE_PWORD_ALL();
	SFREE_PWORD(str_return);
	return NULL;
}

char *str_uri_path(char *str_request) {
	char *str_return = NULL;
	
	// if the request is not long enough to have a URI then abort
	ERROR_CHECK(strlen(str_request) >= 5, "request too short to parse;");
	
	// find uri start character
	char *ptr_uri;
	if (strncmp(str_request, "GET ", 4) == 0 ) {
		ptr_uri = str_request + 4;
	} else if (strncmp(str_request, "HEAD ", 5) == 0 || strncmp(str_request, "POST ", 5) == 0) {
		ptr_uri = str_request + 5;
	} else {
		ERROR("unknown request type");
	}
	// return just the Request-URI
	char *ptr_uri_end = strstr(ptr_uri, " ");
	int int_uri_len = (int)(ptr_uri_end - ptr_uri);
	
	DEBUG("int_uri_len: %i", int_uri_len);
	
	ERROR_SALLOC(str_return, int_uri_len + 1);
	memcpy(str_return, ptr_uri, int_uri_len);
	str_return[int_uri_len] = '\0';
	return str_return;
error:
	SFREE(str_return);
	return NULL;
}

sun_upload *get_sun_upload(char *str_request, int int_request_length) {
	sun_upload *sun_return = NULL;
	DEFINE_VAR_ALL(str_boundary, str_full_boundary, str_name, str_file_content);
	
	////GET BOUNDARY
	//get boundary length
	char *ptr_boundary = strstr(str_request, "Content-Type: multipart/form-data; boundary=") + 44;
	ERROR_CHECK(ptr_boundary != NULL, "No Boundary");
	int int_boundary_carriage = strchr(ptr_boundary, '\r') - ptr_boundary;
	int int_boundary_newline = strchr(ptr_boundary, '\n') - ptr_boundary;
	int int_boundary_length = int_boundary_carriage < int_boundary_newline ? int_boundary_carriage : int_boundary_newline;
	
	//copy boundary
	ERROR_SALLOC(str_boundary, int_boundary_length + 1);
	memcpy(str_boundary, ptr_boundary, int_boundary_length);
	str_boundary[int_boundary_length] = '\0';
	ERROR_CAT_CSTR(str_full_boundary, "--", str_boundary);
	DEBUG(">BOUNDARY|%s<", str_boundary);
	SFREE(str_boundary);
	
	////GET FILE NAME
	//get file name
	char *ptr_name = bstrstr(str_request, int_request_length, "Content-Disposition: form-data; name=\"file_name\"", 48);
	ERROR_CHECK(ptr_name != NULL, "No Content Disposition for File Name, (Maybe there is no file name?)");
	ptr_name = ptr_name + 48;
	
	char *ptr_name_dos  = strstr(ptr_name, "\r\n\r\n");
	char *ptr_name_unix = strstr(ptr_name, "\n\n");
	char *ptr_name_mac  = strstr(ptr_name, "\r\r");
	ptr_name = ptr_name_dos > ptr_name_unix ? ptr_name_dos + 4 :
		ptr_name_dos > ptr_name_mac ? ptr_name_dos + 4 :
		ptr_name_unix > ptr_name_mac ? ptr_name_unix + 2 :
		ptr_name_mac + 2;
	
	//copy file name
	int int_name_carriage = strchr(ptr_name, '\r') - ptr_name;
	int int_name_newline  = strchr(ptr_name, '\n') - ptr_name;
	int int_name_boundary = strstr(ptr_name, str_full_boundary) - ptr_name;
	int int_name_length   =
		int_name_carriage < int_name_newline ? int_name_carriage :
		int_name_carriage < int_name_boundary ? int_name_carriage :
		int_name_boundary < int_name_carriage ? int_name_boundary :
		int_name_boundary;
	ERROR_SALLOC(str_name, int_name_length + 1);
	memcpy(str_name, ptr_name, int_name_length);
	str_name[int_name_length] = '\0';
	DEBUG(">FILE NAME|%s<", str_name);
	
	////GET FILE
	//get file content
	DEBUG("str_request: %20.20s", str_request);
	
	char *ptr_file_content = bstrstr(str_request, int_request_length, "Content-Disposition: form-data; name=\"file_content\"", 51);
	ERROR_CHECK(ptr_file_content != NULL, "No Content Disposition for File Content, (Maybe there is no file content?)");
	ptr_file_content = ptr_file_content + 51;
	
	DEBUG("str_request + int_request_length d: %d", str_request + int_request_length);
	DEBUG("ptr_file_content: %20.20s", ptr_file_content);
	
	char *ptr_file_content_dos  = strstr(ptr_file_content, "\r\n\r\n");
	char *ptr_file_content_unix = strstr(ptr_file_content, "\n\n");
	char *ptr_file_content_mac  = strstr(ptr_file_content, "\r\r");
	ptr_file_content = ptr_file_content_dos > ptr_file_content_unix ? ptr_file_content_dos + 4 :
		ptr_file_content_dos > ptr_file_content_mac ? ptr_file_content_dos + 4 :
		ptr_file_content_unix > ptr_file_content_mac ? ptr_file_content_unix + 2 :
		ptr_file_content_mac + 2;
	
	//copy file content
	int int_file_content_length =
		bstrstr(ptr_file_content,
				(str_request + int_request_length) - ptr_file_content,
				str_full_boundary,
				int_boundary_length + 2) -
		ptr_file_content;
	ERROR_SALLOC(str_file_content, int_file_content_length + 1);
	memcpy(str_file_content, ptr_file_content, int_file_content_length);
	str_file_content[int_file_content_length] = '\0';
	DEBUG(">FILE CONTENT|%s<", str_file_content);
	DEBUG(">FILE CONTENT LENGTH|%i<", int_file_content_length);
	
	////RETURN
	ERROR_SALLOC(sun_return, sizeof(sun_upload));
	SFREE(str_full_boundary);
	sun_return->str_name = str_name;
	str_name = NULL;
	sun_return->str_file_content = str_file_content;
	str_file_content = NULL;
	sun_return->int_file_content_length = int_file_content_length;
	
	SFREE_ALL();
	return sun_return;
error:
	SFREE_ALL();
	SFREE(sun_return);
	return NULL;
}

void free_sun_upload(sun_upload *sun_current_upload) {
	SFREE(sun_current_upload->str_name);
	SFREE(sun_current_upload->str_file_content);
	SFREE(sun_current_upload);
}
