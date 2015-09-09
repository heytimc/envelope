#include "postage_handle_c2.h"

char *link_system_postage(PGconn *cnxn, int csock, char *str_uri, char *str_request, int int_request_len) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_form_data, str_uri_part);
    // uri comes in looking like: /system_postage/action_aggregates?test=testanswer
    // we use uri to fill a new variable uri_part to just have the part we want: action_aggregates\0
    char *ptr_uri = str_uri + 9; //go past /postage/
    int int_uri_len = strcspn(ptr_uri, "?");
    FINISH_SALLOC(str_uri_part, int_uri_len + 1);
    memcpy(str_uri_part, ptr_uri, int_uri_len);
    str_uri_part[int_uri_len] = '\0';
    
    // we use uri to fill form_data with str_query(uri)
    // str_query() will pull the query string or in case of a POST it will get the form data
    str_form_data = query(str_request);
    DEBUG("str_uri_part: %s", str_uri_part);
    DEBUG("str_form_data: %s", str_form_data);
	
    str_response = main_action_postage(cnxn, csock, str_uri_part, str_form_data, str_request, int_request_len);
	FINISH_CHECK(str_response != NULL, "main_action_postage failed");
finish:
    SFREE_ALL();
    return str_response;
}

//no way to call a dynamic function name with a variable, so we're cheating =)
char *main_action_postage(PGconn *cnxn, int csock, char *str_uri_part, char *str_form_data, char *str_request, int int_request_len) {
  return
    // beware of prefixes! action_sequence will hit before action_sequences!
    // to fix, put the longer items first! E.g. action_sequences, then action_sequence
	
    //COPY csv action
    strncmp(str_uri_part, "action_copy", 12) == 0 ? action_copy(cnxn, str_form_data) :
	
    //PACKAGE
    strncmp(str_uri_part, "action_package_upload", 22) == 0 ? link_package_upload(str_request, int_request_len) :
    strncmp(str_uri_part, "action_package"       , 15) == 0 ? action_package     (str_form_data) :
	
    //FORK
    strncmp(str_uri_part, "action_upload", 14) == 0 ? link_postage_upload(str_request, int_request_len) :
    strncmp(str_uri_part, "action_file"  , 11) == 0 ? action_file        (str_form_data, str_uri_part, csock) :
    strncmp(str_uri_part, "action_fossil", 14) == 0 ? action_fossil      (str_form_data, str_request) :
	
	//data service
    strncmp(str_uri_part, "action_order" , 13) == 0 ? action_order (cnxn, str_form_data) :
    strncmp(str_uri_part, "action_select", 14) == 0 ? action_select(cnxn, csock, str_form_data) :
    strncmp(str_uri_part, "action_update", 14) == 0 ? action_update(cnxn, str_form_data) :
    strncmp(str_uri_part, "action_insert", 14) == 0 ? action_insert(cnxn, str_form_data) :
    strncmp(str_uri_part, "action_delete", 14) == 0 ? action_delete(cnxn, str_form_data) :
	
    // didn't find a match:
    cat_cstr("HTTP/1.1 500 Internal Server Error\r\n",
		"Content-Type: application/json; charset=UTF-8\r\n\r\n",
		"{\"stat\": false, \"dat\": {\"error\": \"Action does not exist.\"}}");
}
