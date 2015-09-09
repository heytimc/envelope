#include "util_cookie.h"

char *expire_cookie(char *str_uri, char *str_request) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_host, str_uri_encoded);
	str_host = request_header(str_request, "host");
	FINISH_CHECK(str_host != NULL, "request_header failed");
	char *ptr_host = strchr(str_host, '.');
	//COOKIE DIDN'T DECRYPT RIGHT
	if (strncmp(str_uri, "/v1/app", 7) == 0 || strncmp(str_uri, "/v1/dev", 7) == 0) {
		ERROR_NORESPONSE("Cookie Expired, redirecting to homepage");
		str_uri_encoded = cstr_to_uri(str_uri);
		FINISH_CHECK(str_uri_encoded != NULL, "cstr_to_uri failed");
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 303 See Other\r\n",
			"Location: https://", str_global_subdomain, ptr_host, "/index.html?redirect=", str_uri_encoded, "\r\n",
			"Set-Cookie: envelope=; domain=", ptr_host,
			"; path=/; expires=Tue, 01 Jan 1990 00:00:00 GMT; secure; HttpOnly\r\n\r\n");
		SFREE(str_uri_encoded);
	} else {
		ERROR_NORESPONSE("Cookie Expired, returning json error");
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 500 Internal Server Error\r\n\r\n",
			"{\"stat\": false, \"dat\": {\"default_subdomain\": \"", str_global_subdomain, "\", \"error\": \"Session expired. Please log back in.\"}}");
	}
finish:
	SFREE_ALL();
	return str_response;
}

char *replace_cookie(char *str_response_input, char *str_request) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_host, str_expires);
	char *ptr_insert_into = strchr(str_response_input, '\n');
	if (ptr_insert_into != NULL && str_global_new_encrypted_cookie != NULL) {
		int int_beginning_length = ptr_insert_into - str_response_input;
		DEBUG("int_beginning_length: %d, int_return: %d", int_beginning_length, (int_beginning_length + 1) * sizeof(char));
		FINISH_SALLOC(str_response, (int_beginning_length + 1) * sizeof(char));
		memcpy(str_response, str_response_input, int_beginning_length);
		str_response[int_beginning_length] = '\0';
		str_host = request_header(str_request, "host");
		FINISH_CHECK(str_host != NULL, "request_header failed");
		char *ptr_host = strchr(str_host, '.');
		str_expires = str_expire_one_day();
		FINISH_CAT_APPEND(str_response, "\n",
			"Set-Cookie: envelope=", str_global_new_encrypted_cookie, "; domain=", ptr_host,
			"; path=/; expires=", str_expires, "; secure; HttpOnly;\r", ptr_insert_into);
	} else {
		FINISH_CAT_CSTR(str_response, str_response_input);
	}
	
finish:
	SFREE_PWORD_ALL();
	return str_response;
}

// return date formatted for cookie, midnight
// must be free'd
char *str_expire_one_day() {
	//malloc return string
	char *str_return = NULL;
	
	ERROR_SALLOC(str_return, 50);
    
    //get time zone
	time_t time_next_day;
	time(&time_next_day);
    
    //advance 24 hours
	time_next_day = time_next_day + (24 * 60 * 60); //next day
	
    //convert to localtime
	struct tm *tm_next_day = localtime(&time_next_day);
    
    //set to midnight
    tm_next_day->tm_sec = 0;
    tm_next_day->tm_min = 0;
    tm_next_day->tm_hour = 0;
    
	//back to time_t type
    time_t return_time_t = mktime(tm_next_day);
    
    //convert to gmt time
	struct tm *tm_return_time = gmtime(&return_time_t);
    
    //convert to string
	strftime(str_return, 50, "%a, %d %b %Y %H:%M:%S %Z", tm_return_time);
    
    //HARK YE ONLOOKER: GOOGLE CHROME DOES NOT UNDERSTAND ANYTHING BUT GMT TIME ZONES! DO NOT USE OTHER TIME ZONES!
	return str_return;
error:
	SFREE(str_return);
	return NULL;
}

// return date formatted for cookie, midnight
// must be free'd
char *str_expire_two_day() {
	//malloc return string
	char *str_return = NULL;
	
	ERROR_SALLOC(str_return, 50);
    
    //get time zone
	time_t time_next_day;
	time(&time_next_day);
    
    //advance 48 hours
	time_next_day = time_next_day + (2 * 24 * 60 * 60); //day after next
	
    //convert to localtime
	struct tm *tm_next_day = localtime(&time_next_day);
    
    //set to midnight
    tm_next_day->tm_sec = 0;
    tm_next_day->tm_min = 0;
    tm_next_day->tm_hour = 0;
    
	//back to time_t type
    time_t return_time_t = mktime(tm_next_day);
    
    //convert to gmt time
	struct tm *tm_return_time = gmtime(&return_time_t);
    
    //convert to string
	strftime(str_return, 50, "%a, %d %b %Y %H:%M:%S %Z", tm_return_time);
    
    //HARK YE ONLOOKER: GOOGLE CHROME DOES NOT UNDERSTAND ANYTHING BUT GMT TIME ZONES! DO NOT USE OTHER TIME ZONES!
	return str_return;
error:
	SFREE(str_return);
	return NULL;
}

char *cookie_timeout(char *str_timeout, char *str_cookie_decrypted, char *str_request, char *str_uri) {
	char *str_response;
	DEFINE_VAR_ALL(str_temp, str_uri_timeout, str_cookie_to_encrypt);
	
	time_t time_current = time(&time_current);
	
	//COOKIE TIMEOUT
	time_t time_cookie_timeout = time(&time_cookie_timeout);
	FINISH_SALLOC(str_temp, 50);
	sprintf(str_temp, "%ld", time_cookie_timeout);
	DEBUG("TIMEOUT current: %s", str_temp);
	SFREE(str_temp);
	//get cookie timeout
	DEBUG("TIMEOUT timeout: %s", str_timeout);
	time_t time_timeout = atoi(str_timeout);
	
	//did we timeout?
	DEBUG("TIMEOUT current seconds: %ld", time_current);
	DEBUG("TIMEOUT timeout seconds: %ld", time_timeout);
	time_t seconds = time_current - time_timeout;
	DEBUG("TIMEOUT refresh seconds: %ld", seconds);
	if (seconds > 0) {
		str_response = expire_cookie(str_uri, str_request);
		goto finish;
	}
	
    //get checking time
	time_timeout -= int_global_cookie_timeout;
	time_timeout += 120;
	
	//should we create a new cookie?
	seconds = time_current - time_timeout;
	DEBUG("TIMEOUT create seconds: %ld", seconds);
	if (seconds > 0) {
		
		FINISH_SALLOC(str_uri_timeout, 50);
		sprintf(str_uri_timeout, "%ld", time_current + int_global_cookie_timeout);
		str_cookie_to_encrypt = renew_par_pword(str_cookie_decrypted, "timeout", str_uri_timeout);
		FINISH_CHECK(str_cookie_to_encrypt != NULL, "renew_par_pword failed");
		SFREE(str_uri_timeout);
		
		int int_cookie_len = strlen(str_cookie_to_encrypt);
		str_global_new_encrypted_cookie = aes_encrypt(str_cookie_to_encrypt, &int_cookie_len);
		SFREE_PWORD(str_cookie_to_encrypt);
	}
    
	SFREE_PWORD_ALL();
	return NULL;
finish:
	SFREE_PWORD_ALL();
	return str_response;
}

// returns whether or not we are currently in normal work hours
bool is_work_hours() {
	time_t time_current;
	time(&time_current);
	struct tm *tm_current = localtime(&time_current);
    return tm_current->tm_hour >= 9 && tm_current->tm_hour <= 17 && tm_current->tm_wday != 0;
}
