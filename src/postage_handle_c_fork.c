#include "postage_handle_c_fork.h"

//create dirty file (dirty flag)
static bool create_dirty(char *str_username);
static char *compile_xtags(char *str_path_base_to, char *str_path_to, char *str_path_base_from, char *str_path_from, bool bol_mini);

// ******************************************************************************************
// ************************************* ACTION FORK ************************************** 
// ******************************************************************************************

char *link_postage_upload(char *str_request, int int_request_len) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_folder, str_canonical_start);
	sun_upload *sun_current_upload = NULL;
	
	//owner = all | group = read, execute | all = none
	umask(027);
	
    sun_current_upload = get_sun_upload(str_request, int_request_len);
	
	char *str_path = sun_current_upload->str_name;
	char *str_content = sun_current_upload->str_file_content;
	int int_content_length = sun_current_upload->int_file_content_length;
	
    DEBUG("upload path: %s", str_path);
    DEBUG("upload content: %s", str_content);
    DEBUG("upload length: %i", int_content_length);
	
	//username
	char *str_username = str_current_user;
	DEBUG("str_username: %s", str_username);
	FINISH_CHECK(username_check(str_username), "Username not valid, please check your envelope.conf.");
	FINISH_CHECK(create_dirty(str_username), "create_dirty failed");
	fossil_user_add(str_username, str_envelope_user);
	
	//get folder
	FINISH_CHECK(strchr(str_path, '/') != 0, "Folder not valid.");
	int int_length = strchr(str_path, '/') - str_path;
	FINISH_SALLOC(str_folder, int_length);
	memcpy(str_folder, str_path, int_length);
	str_folder[int_length] = '\0';
	str_path = str_path + int_length + 1;
	FINISH_CHECK(strncmp(str_folder, "dev", 4) == 0 ||
				 strncmp(str_folder, "sql", 4) == 0 ||
				 strncmp(str_folder, "web_root", 9) == 0,
		"Folder not valid.");
	

    NOTICE("REQUEST TYPE: UPLOAD %s FILE", str_folder);
	FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
	
	
	FINISH_CHECK(
		canonical_write_file(str_canonical_start, str_path, str_content, int_content_length)
		, "canonical_write_file failed");

	FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
		"Content-Type: application/json; charset=UTF-8\r\n\r\n",
		"{\"stat\": true, \"dat\": \"0\"}");
	
finish:
	SFREE_ALL();
	SFREE_SUN_UPLOAD(sun_current_upload);
	return str_response;
}

char *action_file(char *str_form_data, char *str_uri, int csock) {
	char *str_response = NULL;
	
	DEFINE_VAR_ALL(str_action, str_folder, str_path, str_canonical_start);
	DEFINE_VAR_MORE(str_date, str_buffer, str_json_date, str_json_buffer);
	DEFINE_VAR_MORE(str_pattern, str_fork, str_case_sensitive, str_regexp);
	DEFINE_VAR_MORE(str_flags, str_content, str_new_content, str_temp);
	DEFINE_VAR_MORE(str_json, str_path_real, str_search1, str_search2);
	DEFINE_VAR_MORE(str_env, str_content1, str_content2, str_content3);
	DEFINE_VAR_MORE(str_json_files, str_file, str_json_folders);
	DEFINE_VAR_MORE(str_files_string, str_files_to_string, str_source);
	DEFINE_VAR_MORE(str_files_from_string, str_input_date, str_file_modified);
	DEFINE_VAR_MORE(str_commit, str_full_path, str_zip_base_folder);
	DEFINE_VAR_MORE(str_zip_path_folder, str_zip_folder, str_zip_path_file);
	DEFINE_VAR_MORE(str_lib_name, str_lib_from_path, str_lib_to_path, str_to_name);
	DEFINE_VAR_MORE(str_temp_name, str_full_path2, str_mini);
	
	DArray *darr_list = NULL;
	DArray *darr_from_list = NULL;
	DArray *darr_to_list = NULL;
	
	//owner = all | group = read, execute | all = none
	umask(027);
	
	char *str_username = str_current_user;
	DEBUG("str_username: %s", str_username);
	FINISH_CHECK(username_check(str_username), "Username not valid.");
	FINISH_CHECK(fossil_user_add(str_username, str_envelope_user), "fossil_user_add failed");
	
	str_action = getpar(str_form_data, "action");
	FINISH_CHECK(str_action != NULL, "getpar failed");
	
	str_source = getpar(str_form_data, "src");
	FINISH_CHECK(str_source != NULL, "getpar failed");
	
	//get folder
	str_folder = getpar(str_form_data, "folder");
	FINISH_CHECK(str_folder != NULL, "getpar failed");
	FINISH_CHECK(strncmp(str_folder, "dev", 4) == 0 ||
				 strncmp(str_folder, "sql", 4) == 0 ||
				 strncmp(str_folder, "web_root", 9) == 0 ||
				 strncmp(str_action, "compile", 8) == 0 ||
				 strlen(str_source) > 0, "Folder not valid.");
	
	str_path = getpar(str_form_data, "path");
	//FINISH_CHECK(str_path != NULL, "getpar failed");
	
	if (strncmp(str_action, "exists", 7) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILE EXISTS", str_folder);
		SFREE(str_action);
		
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
		str_date = canonical_modified_file(str_canonical_start, str_path);
		//FINISH_CHECK(str_date != NULL, "canonical_modified_file failed");
		if (str_date == NULL) {
			FINISH_CAT_CSTR(str_date, "");
		}
		
		str_json_date = jsonify(str_date);
		FINISH_CHECK(str_json_date != NULL, "jsonify failed");
		SFREE(str_date);
		
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json_date, "}");
		SFREE(str_json_date);
	} else if (strncmp(str_action, "read", 5) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILE READ", str_folder);
		SFREE(str_action);
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
		str_date = canonical_modified_file(str_canonical_start, str_path);
		FINISH_CHECK(str_date != NULL, "canonical_modified_file failed");
		int int_length;
		str_buffer = canonical_read_file(str_canonical_start, str_path, &int_length);
		FINISH_CHECK(str_buffer != NULL, "canonical_read_file failed");
		
		char str_length[20];
		sprintf(str_length, "%d", int_length);
		
		str_json_date = jsonify(str_date);
		FINISH_CHECK(str_json_date != NULL, "jsonify failed");
		SFREE(str_date);
		str_json_buffer = jsonify(str_buffer);
		FINISH_CHECK(str_json_buffer != NULL, "jsonify failed");
		SFREE(str_buffer);
		
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json\r\n\r\n",
			"{\"stat\": true, \"dat\": ",
			"{\"date\": ", str_json_date, ", \"length\": \"", str_length, "\", \"content\": ", str_json_buffer, "}}");
		SFREE(str_json_date);
		SFREE(str_json_buffer);
	} else if (strncmp(str_action, "grep", 5) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILES GREP", str_folder);
		SFREE(str_action);
		
		//grep
		str_pattern = getpar(str_form_data, "pattern");
		FINISH_CHECK(str_pattern != NULL, "getpar failed");
		if (strlen(str_path) == 0) {
			SFREE(str_path);
			FINISH_CAT_CSTR(str_path, str_folder);
			
			//change working directory
			FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
			DEBUG("str_fork>%s<", str_fork);
			chdir(str_fork);
			SFREE(str_fork);
		} else {
			//change working directory
			FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
			DEBUG("str_fork>%s<", str_fork);
			chdir(str_fork);
			SFREE(str_fork);
		}
		
		str_case_sensitive = getpar(str_form_data, "case_sensitive");
		FINISH_CHECK(str_case_sensitive != NULL, "getpar failed");
		str_regexp = getpar(str_form_data, "regexp");
		FINISH_CHECK(str_regexp != NULL, "getpar failed");
		FINISH_CAT_CSTR(str_flags, "-", strncmp(str_regexp, "true", 5) == 0 ? "E" : "F",
			"rIn", strncmp(str_case_sensitive, "true", 5) == 0 ? "" : "i", "e");
		SFREE(str_regexp);
		SFREE(str_case_sensitive);
		DEBUG(">%s|%s|%s|%s<", str_global_grep_binary, str_flags, str_pattern, str_path);
		str_content = sunny_return("", str_global_grep_binary, str_flags, str_pattern, str_path);
		FINISH_CHECK(str_content != NULL, "sunny_return failed");
		SFREE(str_flags);
		SFREE(str_pattern);
		SFREE(str_path);
		
		//trim lines to length (prevent binary files from filling up the ajax request too much)
		FINISH_CAT_CSTR(str_new_content, "");
		char *ptr_content = str_content;
		char *ptr_end_content = str_content + strlen(str_content);
		int int_length;
		int int_short_length;
		while (ptr_content + 1 < ptr_end_content) {
			int_length = strcspn(ptr_content, "\n");
			int_short_length = (int_length > 700 ? 700 : int_length);
			FINISH_SALLOC(str_temp, int_short_length + 1);
			memcpy(str_temp, ptr_content, int_short_length);
			str_temp[int_short_length] = '\0';
			FINISH_CAT_APPEND(str_new_content, str_temp, int_length > 700 ? "...\n" : "\n");
			SFREE(str_temp);
			ptr_content = ptr_content + int_length + 1;
		}
		SFREE(str_content);
		
		//finish
		str_json = jsonify(str_new_content);
		FINISH_CHECK(str_json, "jsonify failed");
		SFREE(str_new_content);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json, "}");
		SFREE(str_json);
	} else if (strlen(str_source) > 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILES SELECT LIST", str_folder);
		SFREE(str_action);
		
		//find
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/dev/developer_g/");
		DEBUG("str_canonical_start>%s<", str_canonical_start);
		
		
		darr_list = canonical_list_folder(str_canonical_start, "/");
		FINISH_CHECK(darr_list != NULL, "canonical_list_folder failed");
		FINISH_CAT_CSTR(str_json_folders, "");
		int i, len;
		for (i = 0, len = DArray_count(darr_list);i < len;i++) {
			str_json = jsonify(DArray_get(darr_list, i));
			FINISH_CHECK(str_json != NULL, "jsonify failed");
			FINISH_CAT_APPEND(str_json_folders, i > 0 ? ", " : "", "[", str_json, "]");
			SFREE(str_json);
		}
		DArray_clear_destroy(darr_list); darr_list = NULL;
		
		SFREE(str_canonical_start);
		
		//finish
		char str_int_len[25];
		sprintf(str_int_len, "%d", len);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: text/plain\r\n\r\n",
			"{\"stat\": true, \"dat\": {\"arr_column\": [\"id\"], \"row_count\": ",
			str_int_len, ", \"dat\": [", str_json_folders, "]}}");
		SFREE(str_json_folders);
	} else if (strncmp(str_action, "compile", 8) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING COMPILE");
		SFREE(str_action);
		
		str_lib_name = getpar(str_form_data, "lib_name");
		FINISH_CHECK(str_lib_name != NULL, "getpar failed");
		str_to_name = getpar(str_form_data, "to_name");
		FINISH_CHECK(str_to_name != NULL, "getpar failed");
		
		str_mini = getpar(str_form_data, "mini");
		FINISH_CHECK(str_mini != NULL, "getpar failed");
		bool bol_mini = (*str_mini == 't') || (*str_mini == 'T');
		if (bol_mini) {
			NOTICE("MINIFICATION ENABLED");
		}
		
		FINISH_CHECK(create_dirty(str_username), "create_dirty failed");
		
		//change working directory
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		DEBUG("str_fork>%s<", str_fork);
		chdir(str_fork);
		
		FINISH_CAT_CSTR(str_lib_from_path, "dev/developer_g/", str_lib_name, "/js/");
		FINISH_CAT_CSTR(str_lib_to_path, "web_root/js/", str_to_name, ".js");
		
		str_response = compile_xtags(str_fork, str_lib_from_path, str_fork, str_lib_to_path, bol_mini);
		FINISH_CHECK(str_response != NULL, "compile_xtags failed");
		
		SFREE(str_lib_from_path);
		SFREE(str_lib_to_path);
		
		FINISH_CAT_CSTR(str_lib_to_path, "web_root/js/", str_to_name, ".js-baseline");
		if (canonical_exists_file(str_fork, str_lib_to_path)) {
			FINISH_CHECK(
				canonical_remove_file(str_fork, str_lib_to_path)
				, "canonical_remove_file failed");
			SFREE(str_lib_to_path);
			
			FINISH_CAT_CSTR(str_lib_to_path, "web_root/js/", str_to_name, ".js-merge");
			FINISH_CHECK(
				canonical_remove_file(str_fork, str_lib_to_path)
				, "canonical_remove_file failed");
			SFREE(str_lib_to_path);
			
			FINISH_CAT_CSTR(str_lib_to_path, "web_root/js/", str_to_name, ".js-original");
			FINISH_CHECK(
				canonical_remove_file(str_fork, str_lib_to_path)
				, "canonical_remove_file failed");
		}
		SFREE(str_lib_to_path);
		
		if (strncmp(str_response, "HTTP/1.1 200 OK", 15) == 0) {
			FINISH_CAT_CSTR(str_lib_from_path, "dev/developer_g/", str_lib_name, "/css/");
			FINISH_CAT_CSTR(str_lib_to_path, "web_root/css/", str_to_name, ".css");
			
			str_response = compile_xtags(str_fork, str_lib_from_path, str_fork, str_lib_to_path, false);
			FINISH_CHECK(str_response != NULL, "compile_xtags failed");
			
			SFREE(str_lib_from_path);
			SFREE(str_lib_to_path);
			
			FINISH_CAT_CSTR(str_lib_to_path, "web_root/css/", str_to_name, ".css-baseline");
			if (canonical_exists_file(str_fork, str_lib_to_path)) {
				FINISH_CHECK(
					canonical_remove_file(str_fork, str_lib_to_path)
					, "canonical_remove_file failed");
				SFREE(str_lib_to_path);
				
				FINISH_CAT_CSTR(str_lib_to_path, "web_root/css/", str_to_name, ".css-merge");
				FINISH_CHECK(
					canonical_remove_file(str_fork, str_lib_to_path)
					, "canonical_remove_file failed");
				SFREE(str_lib_to_path);
				
				FINISH_CAT_CSTR(str_lib_to_path, "web_root/css/", str_to_name, ".css-original");
				FINISH_CHECK(
					canonical_remove_file(str_fork, str_lib_to_path)
					, "canonical_remove_file failed");
			}
			SFREE(str_lib_to_path);
		}
		SFREE(str_fork);
		
	} else if (strncmp(str_action, "list_deleted", 13) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILES ACTION_SELECT LIST", str_folder);
		SFREE(str_action);
		
		//find
		str_path = getpar(str_form_data, "path");
		FINISH_CHECK(str_path != NULL, "getpar failed");
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
		str_path_real = canonical(str_canonical_start, str_path, "read_dir");
		FINISH_CHECK(str_path_real != NULL, "canonical failed");
		SFREE(str_canonical_start);
		FINISH_CAT_CSTR(str_search1, "   DELETED ", str_folder, "/", str_path);
		FINISH_CAT_CSTR(str_search2, "DELETED    ", str_folder, "/", str_path);
		SFREE(str_path);
		
		//remove last slash
		if (*(str_path_real + strlen(str_path_real) - 1) == '/') {
			str_path_real[strlen(str_path_real) - 1] = '\0';
		}
		
		//change working directory
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		DEBUG("str_fork>%s<", str_fork);
		chdir(str_fork);
		SFREE(str_fork);
		
		//fossil env
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		FINISH_CAT_CSTR(str_env, "HOME=", str_fork);
		SFREE(str_fork);
		
		//fossil timeline before now -n 0 -v -p dev/all
		str_content1 = sunny_return(str_env, str_global_fossil_binary, "timeline",
			"before", "now", "-n", "0", "-v", "-p", str_path_real, "--user", str_username);
		FINISH_CHECK(str_content1 != NULL, "sunny_return failed");
		str_content2 = sunny_return(str_env, str_global_fossil_binary, "addremove", "--user", str_username);
		FINISH_CHECK(str_content2 != NULL, "sunny_return failed");
		str_content3 = sunny_return(str_env, str_global_fossil_binary, "changes", "--user", str_username);
		FINISH_CHECK(str_content3 != NULL, "sunny_return failed");
		FINISH_CAT_CSTR(str_content, str_content1, str_content2, str_content3);
		SFREE(str_content3);
		SFREE(str_content2);
		SFREE(str_content1);
		
		FINISH_CAT_CSTR(str_json_files, "");
		char *ptr_next = str_content;
		
		char *ptr_next1;
		char *ptr_next2;
		
		char *ptr_end_content = str_content + strlen(str_content);
		//
		while (ptr_next < ptr_end_content) {
			ptr_next1 = strstr(ptr_next, str_search1);
			ptr_next2 = strstr(ptr_next, str_search2);
			if (ptr_next1 == NULL && ptr_next2 == NULL) {
				ptr_next = ptr_end_content;
				continue;
			} else if (ptr_next1 == NULL) {
				ptr_next = ptr_next2 + strlen(str_search2);
			} else if (ptr_next2 == NULL) {
				ptr_next = ptr_next1 + strlen(str_search1);
			} else if (ptr_next1 < ptr_next2) {
				ptr_next = ptr_next1 + strlen(str_search1);
			} else { //(ptr_next2 < ptr_next1)
				ptr_next = ptr_next2 + strlen(str_search2);
			}
			char *ptr_end;
			char *ptr_newline = strchr(ptr_next, '\n');
			char *ptr_carriage = strchr(ptr_next, '\r');
			if (ptr_newline == NULL && ptr_carriage == NULL) {
				ptr_end = ptr_next + strlen(ptr_next);
			} else if (ptr_newline != NULL && ptr_carriage == NULL) {
				ptr_end = ptr_newline;
			} else if (ptr_newline == NULL && ptr_carriage != NULL) {
				ptr_end = ptr_carriage;
			} else {
				ptr_end = ptr_newline < ptr_carriage ? ptr_newline : ptr_carriage;
			}
			int int_length = ptr_end - ptr_next;
			FINISH_SALLOC(str_file, int_length + 1);
			memcpy(str_file, ptr_next, int_length);
			str_file[int_length] = 0;
			if (strchr(str_file + 1, '/') == NULL) {
				str_temp = jsonify(str_file + 1);
				FINISH_CAT_APPEND(str_json_files, (strlen(str_json_files) > 0 ? ", " : ""), str_temp);
				SFREE(str_temp);
			}
			SFREE(str_file);
		}
		SFREE(str_search1);
		SFREE(str_search2);
		
		//finish
		FINISH_CAT_CSTR(str_json, "{\"files\": [", str_json_files, "]}");
		SFREE(str_content);
		SFREE(str_json_files);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: text/plain\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json, "}");
		SFREE(str_json);
	} else if (strncmp(str_action, "list", 5) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILES LIST", str_folder);
		SFREE(str_action);
		
		//find
		str_path = getpar(str_form_data, "path");
		FINISH_CHECK(str_path != NULL, "getpar failed");
		DEBUG("str_folder>%s<", str_folder);
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
		DEBUG("str_canonical_start>%s<", str_canonical_start);
		
		
		darr_list = canonical_list_file(str_canonical_start, str_path);
		FINISH_CHECK(darr_list != NULL, "canonical_list_file failed");
		FINISH_CAT_CSTR(str_json_files, "");
		int i, len;
		for (i = 0, len = DArray_count(darr_list);i < len;i++) {
			str_json = jsonify(DArray_get(darr_list, i));
			FINISH_CHECK(str_json != NULL, "jsonify failed");
			FINISH_CAT_APPEND(str_json_files, i > 0 ? ", " : "", str_json);
			SFREE(str_json);
		}
		DArray_clear_destroy(darr_list); darr_list = NULL;
		
		darr_list = canonical_list_folder(str_canonical_start, str_path);
		FINISH_CHECK(darr_list != NULL, "canonical_list_folder failed");
		FINISH_CAT_CSTR(str_json_folders, "");
		for (i = 0, len = DArray_count(darr_list);i < len;i++) {
			str_json = jsonify(DArray_get(darr_list, i));
			FINISH_CHECK(str_json != NULL, "jsonify failed");
			FINISH_CAT_APPEND(str_json_folders, i > 0 ? ", " : "", str_json);
			SFREE(str_json);
		}
		DArray_clear_destroy(darr_list); darr_list = NULL;
		
		SFREE(str_canonical_start);
		SFREE(str_path);
		
		//finish
		FINISH_CAT_CSTR(str_json, "{\"files\": [", str_json_files, "], \"directories\": [", str_json_folders, "]}");
		SFREE(str_json_files);
		SFREE(str_json_folders);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: text/plain\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json, "}");
		SFREE(str_json);
	} else if (strncmp(str_action, "create_folder", 14) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FOLDER CREATE", str_folder);
		SFREE(str_action);
		
		FINISH_CHECK(create_dirty(str_username), "create_dirty failed");
		
		//canonical create folder
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
		canonical_create_folder(str_canonical_start, str_path);
		SFREE(str_canonical_start);
		
		//finish
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: text/plain\r\n\r\n",
			"{\"stat\": true, \"dat\": \"-1\"}");
	} else if (strncmp(str_action, "rm", 3) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILE REMOVE", str_folder);
		SFREE(str_action);
		
		str_files_string = getpar(str_form_data, "paths");
		FINISH_CHECK(str_files_string != NULL, "getpar failed.");
		FINISH_CHECK(strlen(str_files_string) > 0, "Must send &paths=.");
		
		darr_list = DArray_json_split(str_files_string);
		SFREE(str_files_string);
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
		
		FINISH_CHECK(create_dirty(str_username), "create_dirty failed");
		
		int i, len;
		for (i = 0, len = DArray_count(darr_list);i < len;i++) {
			FINISH_CHECK(
				canonical_remove(str_canonical_start, DArray_get(darr_list, i))
				, "canonical_remove failed");
		}
		
		DArray_clear_destroy(darr_list); darr_list = NULL;
		
		//finish
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n{\"stat\": true, \"dat\": \"-1\"}");
	} else if (strlen(str_action) >= 7 && (strncmp(str_action, "mv_file", 8) == 0 || strncmp(str_action, "cp_file", 8) == 0)) {  // mv files
		if (strncmp(str_action, "mv_file", 7) == 0) {
			NOTICE("REQUEST TYPE: DEVELOPING %s FILE MOVE", str_folder);
		} else {
			NOTICE("REQUEST TYPE: DEVELOPING %s FILE COPY", str_folder);
		}
		// getpar file_to
		str_files_to_string = getpar(str_form_data, "paths_to");
		FINISH_CHECK(str_files_to_string != NULL, "getpar failed");
		darr_to_list = DArray_json_split(str_files_to_string);
		FINISH_CHECK(darr_to_list != NULL, "DArray_json_split failed");
		SFREE(str_files_to_string);
		
		str_files_from_string = getpar(str_form_data, "paths_from");
		FINISH_CHECK(str_files_from_string != NULL, "getpar failed");
		darr_from_list = DArray_json_split(str_files_from_string);
		FINISH_CHECK(darr_from_list != NULL, "DArray_json_split failed");
		SFREE(str_files_from_string);
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
		
		FINISH_CHECK(create_dirty(str_username), "create_dirty failed");
		
		int i, len;
		for (i = 0, len = DArray_count(darr_from_list);i < len;i++) {
			char *str_file_to = DArray_get(darr_to_list, i);
			char *str_file_from = DArray_get(darr_from_list, i);
			if (strncmp(str_action, "mv_file", 7) == 0) {
				DEBUG("mv>%s|%s|%s|%s<", str_canonical_start, str_file_from, str_canonical_start, str_file_to);
				FINISH_CHECK(canonical_move(str_canonical_start, str_file_from, str_canonical_start, str_file_to),
					"canonical_move failed");
			} else {
				DEBUG("cp>%s|%s|%s|%s<", str_canonical_start, str_file_from, str_canonical_start, str_file_to);
				FINISH_CHECK(canonical_copy(str_canonical_start, str_file_from, str_canonical_start, str_file_to),
					"canonical_move failed");
			}
		}
		DArray_clear_destroy(darr_from_list); darr_from_list = NULL;
		DArray_clear_destroy(darr_to_list); darr_to_list = NULL;
		//
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": \"0\"}");
		SFREE(str_canonical_start);
		SFREE(str_action);
	} else if (strncmp(str_action, "write", 6) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILE WRITE", str_folder);
		SFREE(str_action);
		
		str_content = getpar(str_form_data, "content");
		FINISH_CHECK(str_content != NULL, "getpar failed");
		int int_content_length = strlen(str_content);
		
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
		
		if (strstr(str_form_data, "change_stamp=")) {
			str_input_date = getpar(str_form_data, "change_stamp");
			FINISH_CHECK(str_input_date != NULL, "getpar failed");
			
			str_file_modified = canonical_modified_file(str_canonical_start, str_path);
			FINISH_CHECK(str_file_modified != NULL, "canonical_modified_file failed");
			
			DEBUG(">%s|%s|%d<", str_input_date, str_file_modified, strncmp(str_file_modified, str_input_date, strlen(str_file_modified)));
			FINISH_CHECK(strncmp(str_file_modified, str_input_date, strlen(str_file_modified)) == 0, "Change stamp does not match.");
			SFREE(str_input_date);
			SFREE(str_file_modified);
		}
		
		FINISH_CHECK(canonical_write_file(str_canonical_start, str_path, str_content, int_content_length),
			"canonical_write_file failed");
		str_date = canonical_modified_file(str_canonical_start, str_path);
		FINISH_CHECK(str_date != NULL, "canonical_modified_file failed");
		SFREE(str_canonical_start);
		
		str_json_date = jsonify(str_date);
		FINISH_CHECK(str_json_date != NULL, "jsonify failed");
		SFREE(str_date);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json_date, "}");
		SFREE(str_json_date);
		
	//create file
	} else if (strncmp(str_action, "create_file", 12) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILE CREATE", str_folder);
		SFREE(str_action);
		
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
		FINISH_CHECK(canonical_touch_file(str_canonical_start, str_path), "canonical_touch_file failed");
		SFREE(str_canonical_start);
		
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": \"\"}");
		
	//show history for file
	} else if (strncmp(str_action, "timeline", 9) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILE TIMELINE", str_folder);
		//change working directory
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		DEBUG("str_fork>%s<", str_fork);
		chdir(str_fork);
		SFREE(str_fork);
		
		//fossil env
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		FINISH_CAT_CSTR(str_env, "HOME=", str_fork);
		SFREE(str_fork);
		
		//fossil finfo
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
		str_path_real = canonical(str_canonical_start, str_path, "write_file");
		FINISH_CHECK(str_path_real != NULL, "canonical failed");
		SFREE(str_canonical_start);
		SFREE(str_path);
		
		
		str_content = sunny_return(str_env, str_global_fossil_binary, "timeline", "--path", str_path_real, "-n", "0", "-W", "0", "--user", str_envelope_user);
		FINISH_CHECK(str_content != NULL, "sunny_return failed");
		
		SFREE(str_env);
		SFREE(str_path_real);
		//int int_remove_length = strlen(str_path_real);
		
		//finish
		str_json = jsonify(str_content);
		FINISH_CHECK(str_json != NULL, "jsonify failed");
		SFREE(str_content);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: text/plain\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json, "}");
		SFREE(str_json);
		
	} else if (strncmp(str_action, "blame", 6) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILE BLAME", str_folder);
		//change working directory
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		DEBUG("str_fork: %s", str_fork);
		chdir(str_fork);
		SFREE(str_fork);
		
		//fossil env
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		FINISH_CAT_CSTR(str_env, "HOME=", str_fork);
		SFREE(str_fork);
		
		//fossil blame
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
		str_path_real = canonical(str_canonical_start, str_path, "read_file");
		FINISH_CHECK(str_path_real != NULL, "canonical failed");
		SFREE(str_canonical_start);
		SFREE(str_path);
		str_content = sunny_return(str_env, str_global_fossil_binary, "blame", str_path_real, "--user", str_envelope_user);
		FINISH_CHECK(str_content != NULL, "sunny_return failed");
		SFREE(str_env);
		SFREE(str_path_real);
		
		str_json = jsonify(str_content);
		FINISH_CHECK(str_json != NULL, "jsonify failed");
		SFREE(str_content);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: text/plain\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json, "}");
		SFREE(str_json);
	} else if (strncmp(str_action, "cat", 4) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILE CAT", str_folder);
		//change working directory
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		DEBUG("str_fork>%s<", str_fork);
		chdir(str_fork);
		SFREE(str_fork);
		
		//fossil env
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		FINISH_CAT_CSTR(str_env, "HOME=", str_fork);
		SFREE(str_fork);
		
		//fossil show
		FINISH_CAT_CSTR(str_full_path, str_folder, "/", str_path);
		SFREE(str_folder);
		SFREE(str_path);
		
		str_commit = getpar(str_form_data, "commit");
		FINISH_CHECK(str_commit != NULL, "getpar failed");
		str_content = sunny_return(str_env, str_global_fossil_binary, "cat", str_full_path, "-r", str_commit, "--user", str_envelope_user);
		FINISH_CHECK(str_content != NULL, "sunny_return failed");
		SFREE(str_commit);
		SFREE(str_full_path);
		SFREE(str_env);
		
		//return
		str_json = jsonify(str_content);
		FINISH_CHECK(str_json != NULL, "jsonify failed");
		SFREE(str_content);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: text/plain\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json, "}");
		SFREE(str_json);
	} else if (strncmp(str_action, "status", 7) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILE STATUS", str_folder);
		SFREE(str_folder);
		SFREE(str_path);
		
		//change working directory
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		DEBUG(">%s<", str_fork);
		chdir(str_fork);
		SFREE(str_fork);
		
		//fossil env
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		FINISH_CAT_CSTR(str_env, "HOME=", str_fork);
		SFREE(str_fork);
		
		//fossil status
		str_content = sunny_return(str_env, str_global_fossil_binary, "status", "--user", str_envelope_user);
		FINISH_CHECK(str_content != NULL, "sunny_return failed");
		SFREE(str_env);
		
		//return
		str_json = jsonify(str_content);
		FINISH_CHECK(str_json != NULL, "jsonify failed");
		SFREE(str_content);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: text/plain\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json, "}");
		SFREE(str_json);
	} else if (strncmp(str_action, "zip", 4) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILE ZIP", str_folder);
		SFREE(str_path);
		
		//str_zip_path_file = getpar(str_form_data, "to_zip");
		//FINISH_CHECK(str_zip_path_file != NULL, "getpar failed");
		FINISH_SALLOC(str_zip_path_file, 50);
		sprintf(str_zip_path_file, "temp_zip_%d.zip", getpid());
		str_files_string = getpar(str_form_data, "from_paths");
		FINISH_CHECK(str_files_string != NULL, "getpar failed");
		
		char str_pid[20];
		sprintf(str_pid, "%d", getpid());
		
		//create /zip/ folder
		FINISH_CAT_CSTR(str_zip_base_folder, str_global_fossil_path, "production_", str_username, "/");
		if (!canonical_exists_folder(str_zip_base_folder, "zip")) {
			FINISH_CHECK(
				canonical_create_folder(str_zip_base_folder, "zip")
				, "canonical_create_folder failed");
		}
		SFREE(str_zip_base_folder);
		
		FINISH_CAT_CSTR(str_zip_base_folder, str_global_fossil_path, "production_", str_username, "/zip/");
		//FINISH_CAT_CSTR(str_zip_path_folder, str_username, "_", str_pid, "/");
		char *ptr_zip_path_folder_sub = strrchr(str_uri, '/') + 1;
		FINISH_CAT_CSTR(str_zip_path_folder, ptr_zip_path_folder_sub);
		ptr_zip_path_folder_sub = strrchr(str_zip_path_folder, '.');
		*ptr_zip_path_folder_sub = '\0';
		
		//remove /to-zip/ folder if it exists, then create it
		if (canonical_exists_folder(str_zip_base_folder, str_zip_path_folder)) {
			FINISH_CHECK(
				canonical_remove_folder(str_zip_base_folder, str_zip_path_folder)
				, "canonical_remove_folder failed");
		}
		FINISH_CHECK(canonical_create_folder(str_zip_base_folder, str_zip_path_folder), "canonical_create_folder failed");
		
		//copy stuff to zip folder
		darr_list = DArray_json_split(str_files_string);
		SFREE(str_files_string);
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
		FINISH_CAT_CSTR(str_zip_folder, str_zip_base_folder, str_zip_path_folder);
		
		int i, len;
		for (i = 0, len = DArray_count(darr_list);i < len;i++) {
			char *str_shortname = strrchr(DArray_get(darr_list, i), '/');
			if (str_shortname == NULL) {
				str_shortname = DArray_get(darr_list, i);
			}
			DEBUG(">%s|%s|%s|%s<", str_canonical_start, DArray_get(darr_list, i), str_zip_folder, str_shortname);
			FINISH_CHECK(
				canonical_copy(str_canonical_start, DArray_get(darr_list, i), str_zip_folder, str_shortname)
				, "canonical_copy failed");
		}
		
		DArray_clear_destroy(darr_list); darr_list = NULL;
		
		//change working directory
		DEBUG("chdir: %s", str_zip_base_folder);
		chdir(str_zip_base_folder);
		
		//zip folder into file
		DEBUG("%s -r %s %s", str_global_zip_binary, str_zip_path_file, str_zip_path_folder);
		FINISH_CHECK(
			sunny_exec("", str_global_zip_binary, "-r", str_zip_path_file, str_zip_path_folder) == 0
			, "sunny_exec failed");
		SFREE(str_zip_folder);
		
		//remove zip folder
		FINISH_CHECK(
			canonical_remove(str_zip_base_folder, str_zip_path_folder)
			, "canonical_remove failed");
		SFREE(str_zip_path_folder);
		
		//return
		int int_response_length;
		str_content = canonical_read_file(str_zip_base_folder, str_zip_path_file, &int_response_length);
		FINISH_CHECK(str_content != NULL, "canonical_read_file failed");
		
		//remove zip file
		FINISH_CHECK(
			canonical_remove(str_zip_base_folder, str_zip_path_file)
			, "canonical_remove failed");
		SFREE(str_zip_base_folder);
		SFREE(str_zip_path_file);
		
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/zip\r\n\r\n");
		write(csock, str_response, strlen(str_response));
		SFREE(str_response);
		
		write(csock, str_content, int_response_length);
		SFREE(str_content);
		
		FINISH_CAT_CSTR(str_response, "");
	} else if (strncmp(str_action, "unzip", 6) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILE UNZIP", str_folder);
		
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_username, "/", str_folder, "/");
		
		//zip file must exist
		FINISH_CHECK(
			canonical_exists_file(str_canonical_start, str_path)
			, "zip file must exist");
		
		//get path to
		FINISH_CAT_CSTR(str_temp_name, str_path);
		char *ptr_temp_name = strrchr(str_temp_name, '/');
		if (ptr_temp_name != NULL) {
			*(ptr_temp_name + 1) = '\0';
			
			if (strlen(str_temp_name) == strlen(str_path)) {
				*(ptr_temp_name) = '\0';
				
				ptr_temp_name = strrchr(str_temp_name, '/');
				if (ptr_temp_name != NULL) {
					*(ptr_temp_name + 1) = '\0';
				} else {
					*str_temp_name = '\0';
				}
			}
		} else {
			*str_temp_name = '\0';
		}
		
		//unzip
		FINISH_CAT_CSTR(str_full_path, str_canonical_start, str_path);
		FINISH_CAT_CSTR(str_full_path2, str_canonical_start, str_temp_name);
		DEBUG("%s %s -d %s", str_global_unzip_binary, str_full_path, str_full_path2);
		FINISH_CHECK(
			sunny_exec("", str_global_unzip_binary, str_full_path, "-d", str_full_path2) == 0
			, "sunny_exec failed");
		
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": \"\"}");
	} else {
		NOTICE("REQUEST TYPE: DEVELOPING %s FILE INVALID", str_folder);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": false, \"dat\": {\"error\": \"Action not valid.\"}}");
	}

finish:
	SFREE_ALL();
	if (darr_list != NULL) DArray_clear_destroy(darr_list);
	if (darr_from_list != NULL) DArray_clear_destroy(darr_from_list);
	if (darr_to_list != NULL) DArray_clear_destroy(darr_to_list);
	
	return str_response;
}

char *action_fossil(char *str_form_data, char *str_request) {
	//owner = all | group = read, execute | all = none
	umask(027);
	char *str_response = NULL;
	
	DEFINE_VAR_ALL(str_username, str_fork, str_env, str_cookie_encrypted);
	DEFINE_VAR_MORE(str_cookie_decrypted, str_temp, str_password, str_pg_ctl);
	DEFINE_VAR_MORE(str_pg_postmaster, str_action, str_user_port);
	DEFINE_VAR_MORE(str_cmd, str_return1, str_return2, str_return3, str_return4);
	DEFINE_VAR_MORE(str_return5, str_return, str_conn, str_conn_debug, str_buffer);
	DEFINE_VAR_MORE(str_json_error, str_json_filename, str_full_json_error);
	DEFINE_VAR_MORE(str_json_return, str_final_buffer, str_reason, str_full_reason);
	DEFINE_VAR_MORE(str_super_username, str_super_password, str_super_escape_password);
	
	DArray *darr_list = NULL;
	PGconn *cnxn = NULL;
	sun_res *sun_working = NULL;
	PGconn *temp_cnxn = NULL;
	
	
	FINISH_CAT_CSTR(str_username, str_current_user);
	FINISH_CHECK(fossil_user_add(str_username, str_envelope_user), "fossil_user_add failed");
	
	//fossil environment
	FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
	FINISH_CAT_CSTR(str_env, "HOME=", str_fork);
	SFREE(str_fork);
	
	FINISH_CHECK(username_check(str_username), "Username not valid.");
	
	//get password
	str_cookie_encrypted = str_cookie(str_request, "envelope");
	FINISH_CHECK(str_cookie_encrypted != NULL, "str_cookie failed");
    int int_cookie_len = strlen(str_cookie_encrypted);
	DEBUG("int_cookie_len: %d", int_cookie_len);
    str_cookie_decrypted = aes_decrypt(str_cookie_encrypted, &int_cookie_len);
	FINISH_CHECK(str_cookie_decrypted != NULL && int_cookie_len > 0, "aes_decrypt failed");
    SFREE(str_cookie_encrypted);
    str_temp = getpar(str_cookie_decrypted, "superpassword");
	FINISH_CHECK(str_temp != NULL, "getpar failed");
    str_password = escape_conninfo_value(str_temp);
	FINISH_CHECK(str_password != NULL, "escape_conninfo_value failed");
	SFREE_PWORD(str_temp);
	SFREE_PWORD(str_cookie_decrypted);
    
	str_action = getpar(str_form_data, "action");
	FINISH_CHECK(str_action != NULL, "getpar failed");
	int int_stat;
	
	//must have subdomain string
	FINISH_CHECK(strlen(str_global_developers) != 0, "Must have sudomain string.");
	
	//get postmaster string
	str_user_port = getport(str_global_developers, str_username);
	FINISH_CHECK(str_user_port != NULL, "getport failed");
	DEBUG("str_user_port: %s", str_user_port);
	FINISH_CAT_CSTR(str_cmd, "-p ", str_user_port, " -i -F -N 10 -c autovacuum=off -B 1MB -c track_activities=off -c track_counts=off");
	
	//change working directory
	FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
	DEBUG("chdir: %s", str_fork);
	int_stat = chdir(str_fork);
	SFREE(str_fork);
	
	//start fork-to-develop from scratch
	if (strncmp(str_action, "abandon", 7) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING FOSSIL ABANDON");
		SFREE_PWORD(str_password);
		
		int_stat = sunny_exec(str_env, str_global_fossil_binary, "revert", "--user", str_envelope_user);
		int_stat = sunny_exec(str_env, str_global_fossil_binary, "checkout", "tag:working", "--user", str_envelope_user);
		
		//stop database
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "_data/");
		int_stat = sunny_exec("", str_global_pg_ctl_binary, "stop", "-D", str_fork, "-m", "immediate");
		
		//rsync database
		int_stat = sunny_exec("", str_global_rsync_binary, "-am", "--exclude=postmaster.pid", str_global_cluster_path, str_fork);
		
		//start database
		int_stat = sunny_exec("", str_global_pg_ctl_binary, "-p", str_global_postmaster_binary, "start", "-D", str_fork, "-o", str_cmd);
		SFREE(str_fork);
		
		//remove dirty
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		if (canonical_is_file(str_fork, ".dirty")) {
			FINISH_CHECK(canonical_remove(str_fork, ".dirty"), "canonical_remove failed");
		}
		SFREE(str_fork);
		
		//return
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": \"-1\"}");
	} else if (strncmp(str_action, "test", 4) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING FOSSIL PULL");
		//stop database
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "_data/");
		int int_stat = sunny_exec("", str_global_pg_ctl_binary, "stop", "-D", str_fork, "-m", "immediate");
		DEBUG("%s stop -D %s -m immediate", str_global_pg_ctl_binary, str_fork);
		//LFC FOR SOME REASON WORKS BUT RETURNS ERROR, DO NOT UNCOMMENT
		//FINISH_CHECK(int_stat == 0, "sunny_exec failed");
		
		//rsync database
		str_return1 = sunny_return("", str_global_rsync_binary, "-a", "--delete", "--exclude=postmaster.pid", "--exclude=scripts",
			str_global_cluster_path, str_fork);
		DEBUG("%s -a --delete --exclude=postmaster.pid %s %s", str_global_rsync_binary, str_global_cluster_path, str_fork);
		FINISH_CHECK(strlen(str_return1) < 1, "sunny_exec failed");
		
		//sleep(3); //slow filesystems
		
		//start database
		int_stat = sunny_exec("", str_global_pg_ctl_binary, "-p", str_global_postmaster_binary, "start", "-w", "-D", str_fork, "-o", str_cmd);
		DEBUG("%s -p %s start -w -D %s -o \"%s\"", str_global_pg_ctl_binary, str_global_postmaster_binary, str_fork, str_cmd);
		//LFC FOR SOME REASON WORKS BUT RETURNS ERROR, DO NOT UNCOMMENT
		//FINISH_CHECK(int_stat == 0, "sunny_exec failed");
		SFREE(str_fork);
		
		//change working directory
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		DEBUG("chdir: %s", str_fork);
		int_stat = chdir(str_fork);
		SFREE(str_fork);
		str_return2 = sunny_return(str_env, str_global_fossil_binary, "addremove", "--user", str_envelope_user);
		str_return3 = sunny_return(str_env, str_global_fossil_binary, "changes", "--user", str_envelope_user);
		str_return4 = sunny_return(str_env, str_global_fossil_binary, "update", "--user", str_envelope_user);
		str_return5 = sunny_return(str_env, str_global_fossil_binary, "clean", "--dirsonly", "--verily", "--user", str_envelope_user);
		FINISH_CAT_CSTR(str_return, "$ rsync\n", str_return1, "\n\n",
			"$ fossil addremove\n", str_return2, "\n\n",
			"$ fossil changes\n", str_return3, "\n\n",
			"$ fossil update\n", str_return4, "\n\n",
			"$ fossil clean --dirsonly --verily (dev)\n", str_return5, "\n\n");
		SFREE(str_return5);
		SFREE(str_return4);
		SFREE(str_return3);
		SFREE(str_return2);
		SFREE(str_return1);
		
		//sleep(2); //let postgres startup
		
		////cat sql
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/sql/");
		darr_list = canonical_list_file(str_fork, "");
		FINISH_CHECK(darr_list != NULL, "canonical_list_file failed");
		
		DEBUG("CONNECTING TO %s DATABASE", str_username);
		
		
		FINISH_CAT_CSTR(str_conn, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
			" port=", str_user_port, " dbname=", str_global_conn_dbname, 
			" user=", str_username, " password=", str_password);
		
		FINISH_CAT_CSTR(str_conn_debug, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
			" port=", str_user_port, " dbname=", str_global_conn_dbname, 
			" user=", str_username, " password=????");
		DEBUG(str_conn_debug);
		SFREE(str_conn_debug);
		
		cnxn = PQconnectdb(str_conn);
		SFREE(str_conn);
		FINISH_CHECK(PQstatus(cnxn) == CONNECTION_OK, "Connection to database failed: %s.", PQerrorMessage(cnxn));
		int x, len;
		for (x = 0, len = DArray_count(darr_list);x < len;x++) {
			//get file content
			char *str_name = DArray_get(darr_list, x);
			DEBUG("darr_list[%d]: %s", x, str_name);
			
			int int_buffer_length;
			
			str_buffer = canonical_read_file(str_fork, str_name, &int_buffer_length);
			FINISH_CHECK(str_buffer != NULL, "canonical_read_file failed");
			
			DEBUG("str_buffer: %s", str_buffer);
			
			// execute cmd, get result
			sun_working = sun_execute(cnxn, str_buffer);
			if (! sun_working->bol_status) {
				str_json_error = _response_full_error(sun_working->res, 2, str_buffer);
				SFREE(str_buffer);
				
				str_json_filename = jsonify(str_name);
				FINISH_SALLOC(str_full_json_error, strlen(str_json_error) + strlen(str_json_filename) + 17);
				
				//copy error json
				memcpy(str_full_json_error, str_json_error, strlen(str_json_error));
				char *ptr_full_json_error = str_full_json_error + strlen(str_json_error) - 3;
				
				//copy filename json part 1 over the "}]}" of the error json
				memcpy(ptr_full_json_error, ", \"filename\": ", 14);
				ptr_full_json_error = ptr_full_json_error + 14;
				
				memcpy(ptr_full_json_error, str_json_filename, strlen(str_json_filename));
				ptr_full_json_error = ptr_full_json_error + strlen(str_json_filename);
				
				*(ptr_full_json_error) = '}';
				*(ptr_full_json_error + 1) = '\0';
				
				FINISH_CAT_CSTR(str_response, "HTTP/1.1 500 Internal Server Error\r\n",
					"Content-Type: application/json; charset=UTF-8\r\n\r\n",
					"{\"stat\": false, \"dat\": ", str_full_json_error, "}");
				ERROR_NORESPONSE("sun_execute failed");
				goto finish;
			}
			SFREE(str_buffer);
			
			SFREE_SUN_RES(sun_working);
		}
		
		DArray_clear_destroy(darr_list); darr_list = NULL;
		
		SFREE(str_fork);
		PQfinish(cnxn); cnxn = NULL;
		
		//remove dirty
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		if (canonical_is_file(str_fork, ".dirty")) {
			FINISH_CHECK(canonical_remove(str_fork, ".dirty"), "canonical_remove failed");
		}
		SFREE(str_fork);
		
		//return
		str_json_return = jsonify(str_return);
		SFREE(str_return);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json_return, "}");
		SFREE(str_json_return);
		DEBUG("str_response: %d %s", strlen(str_response), str_response);
	} else if (strncmp(str_action, "push", 4) == 0) {
		NOTICE("REQUEST TYPE: DEVELOPING FOSSIL PUSH");
		SFREE_PWORD(str_password);
		
		//check .dirty flag
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		FINISH_CHECK(!canonical_exists_file(str_fork, ".dirty"), "There have been changes since last pull.");
		
		SFREE(str_fork);
		
		//change working directory
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/sql/");
		DEBUG("chdir: %s", str_fork);
		int_stat = chdir(str_fork);
		
		//cat sql
		FINISH_CAT_CSTR(str_final_buffer, "");
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/sql/");
		//files and folders
		
		darr_list = canonical_list_file(str_fork, "");
		FINISH_CHECK(darr_list != NULL, "canonical_list_file failed");
		
		int x, len;
		for (x = 0, len = DArray_count(darr_list);x < len;x++) {
			//str_full_path_to_entry
			//get file content
			int int_buffer_length;
			char *str_name = DArray_get(darr_list, x);
			
			str_buffer = canonical_read_file(str_fork, str_name, &int_buffer_length);
			
			FINISH_CAT_APPEND(str_final_buffer, str_buffer, "\n-- */\n;\n");
			SFREE(str_buffer);
			
			DEBUG(">%d|%s|%s<", strstr(str_name, ".once") == str_name + strlen(str_name) - 5,
				strstr(str_name, ".once"), str_name + strlen(str_name) - 5);
			//rm file
			if (strstr(str_name, ".once") == str_name + strlen(str_name) - 5) {
				FINISH_CHECK(canonical_remove_file(str_fork, str_name), "canonical_remove_file failed");
			}
		}
		SFREE(str_fork);
		
		//change working directory
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
		DEBUG("chdir: %s", str_fork);
		int_stat = chdir(str_fork);
		SFREE(str_fork);
		
		//fossil addremove
		str_return1 = sunny_return(str_env, str_global_fossil_binary, "addremove", "--user", str_envelope_user);
		
		//fossil commit
		str_reason = getpar(str_form_data, "reason");
		FINISH_CAT_CSTR(str_full_reason, str_username, " ", str_reason);
		SFREE(str_reason);
		str_return2 = sunny_return(str_env, str_global_fossil_binary, "changes", "--user", str_envelope_user);
		str_return3 = sunny_return(str_env, str_global_fossil_binary, "clean", "--dirsonly", "--verily", "--user", str_envelope_user);
		str_return4 = sunny_return(str_env, str_global_fossil_binary, "commit", "-m", str_full_reason,
			"--tag", "working", "--no-warnings", "--user", str_envelope_user);
		
		//clean production
		FINISH_CAT_CSTR(str_fork, str_global_fossil_path, "production/");
		DEBUG("chdir: %s", str_fork);
		int_stat = chdir(str_fork);
		SFREE(str_fork);
		str_return5 = sunny_return(str_env, str_global_fossil_binary, "clean", "--dirsonly", "--verily", "--user", str_envelope_user);
		
		int_stat = sunny_exec(str_env, str_global_fossil_binary, "update", "tag:working", "--user", str_envelope_user);
		
		
		//get cookie
		str_cookie_encrypted = str_cookie(str_request, "envelope");
		FINISH_CHECK(str_cookie_encrypted != NULL, "str_cookie failed");
		int int_cookie_len = strlen(str_cookie_encrypted);
		DEBUG("int_cookie_len: %d", int_cookie_len);
		str_cookie_decrypted = aes_decrypt(str_cookie_encrypted, &int_cookie_len);
		FINISH_CHECK(str_cookie_decrypted != NULL, "aes_decrypt failed");
		SFREE(str_cookie_encrypted);
		str_super_username = str_tolower(getpar(str_cookie_decrypted, "superusername"));
		FINISH_CHECK(str_super_username != NULL, "str_tolower(getpar()) failed");
		str_super_password = getpar(str_cookie_decrypted, "superpassword");
		FINISH_CHECK(str_super_password != NULL, "getpar failed");
		//DEBUG("str_cookie_decrypted: %s", str_cookie_decrypted);
		SFREE_PWORD(str_cookie_decrypted);
		
		//check cookie
		FINISH_CHECK(int_cookie_len > 0, "No Cookie.");
		DEBUG("str_current_user: %s", str_current_user);
		str_super_escape_password = escape_conninfo_value(str_super_password);
		FINISH_CHECK(str_super_escape_password != NULL, "escape_conninfo_value failed");
		
		//connection string
		char str_conn_port[25];
		sprintf(str_conn_port, "%d", int_global_conn_port);
		FINISH_CAT_CSTR(str_conn, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
			" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
			" user=", str_current_user, " password=", str_super_escape_password);
		
		FINISH_CAT_CSTR(str_conn_debug, "host=", str_global_conn_host, " sslmode=", str_global_conn_sslmode,
			" port=", str_conn_port, " dbname=", str_global_conn_dbname, 
			" user=", str_current_user, " password=????");
		DEBUG(str_conn_debug);
		SFREE(str_conn_debug);
		
		SFREE(str_current_user);
		SFREE_PWORD(str_super_escape_password);
		SFREE_PWORD(str_super_password);
		
		//connect
		temp_cnxn = PQconnectdb(str_conn);
		SFREE(str_conn);
		FINISH_CHECK(PQstatus(temp_cnxn) == CONNECTION_OK, "Connection to database failed: %s.", PQerrorMessage(temp_cnxn));
		
		//run sql
		sun_working = sun_execute(temp_cnxn, str_final_buffer);
		DEBUG("sun_execute strlen(str_final_buffer): %d", strlen(str_final_buffer));
		SFREE(str_final_buffer);
		if (! sun_working->bol_status) {
			int_stat = sunny_exec(str_env, str_global_fossil_binary, "tag", "cancel", "tag:working", "current", "--user", str_envelope_user);
			
			int_stat = sunny_exec(str_env, str_global_fossil_binary, "update", "tag:working", "--user", str_envelope_user);
			
			//now we do the normal erroring
			str_response = response_full_error(sun_working->res);
			goto finish;
		}
		PQfinish(temp_cnxn); temp_cnxn = NULL;
		
		
		//return
		FINISH_CAT_CSTR(str_return, ".once files deleted\n\n",
			"$ fossil addremove\n", str_return1, "\n\n",
			"$ fossil changes\n", str_return2, "\n\n",
			"$ fossil clean --dirsonly --verily (dev)\n", str_return3, "\n\n",
			"$ fossil commit --tag type=full\n", str_return4, "\n\n",
			"$ fossil clean --dirsonly --verily (pro)\n", str_return5, "\n\n");
		SFREE(str_return1);
		SFREE(str_return2);
		SFREE(str_return3);
		SFREE(str_return4);
		SFREE(str_return5);
		str_json_return = jsonify(str_return);
		FINISH_CHECK(str_json_return != NULL, "jsonify failed");
		SFREE(str_return);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json_return, "}");
		SFREE(str_json_return);
	} else {
		SFREE_PWORD(str_super_password);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": false, \"dat\": {\"error\": \"Action not valid.\"}}");
	}
finish:
	SFREE_ALL();
	if (cnxn) PQfinish(cnxn);
	if (darr_list) DArray_clear_destroy(darr_list);
	if (temp_cnxn) PQfinish(temp_cnxn);
	SFREE_SUN_RES(sun_working);
	
	return str_response;
}

bool fossil_user_add(char *str_username, char *str_add_username) {
	int int_stat;
	DEFINE_VAR_ALL(str_fork, str_fossil, str_env, str_user_list);
	//fossil environment
	DEBUG("fossil_user_add: %s", str_add_username);
	ERROR_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
	ERROR_CAT_CSTR(str_fossil, str_global_fossil_path, "fossil_bare");
	ERROR_CAT_CSTR(str_env, "HOME=", str_fork);
	SFREE(str_fork);

	//check if user already exists, create if doesn't
	str_user_list = sunny_return(str_env, str_global_fossil_binary, "user", "-R", str_fossil, "list");
	ERROR_CHECK(str_user_list != NULL, "sunny_exec failed");
	DEBUG("str_user_list: %s", str_user_list);
	if (strstr(str_user_list, str_add_username) == 0) {
		DEBUG("%s %s user -R %s new %s", str_env, str_global_fossil_binary, str_fossil, str_add_username);
		int_stat = sunny_exec(str_env, str_global_fossil_binary, "user", "-R", str_fossil, "new", str_add_username);
		ERROR_CHECK(int_stat == EXIT_SUCCESS, "sunny_exec failed");
	}
	SFREE_ALL();
	return true;
error:
	SFREE_ALL();
	return false;
}

// create dirty
static bool create_dirty(char *str_username) {
	DEFINE_VAR_ALL(str_fork);
	ERROR_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
	ERROR_CHECK(canonical_touch_file(str_fork, ".dirty"), "canonical_touch_file failed");
	SFREE_ALL();
	return true;
error:
	SFREE_ALL();
	return false;
}

static char *compile_xtags(char *str_path_base_from, char *str_path_from, char *str_path_base_to, char *str_path_to, bool bol_mini) {
	char *str_response = NULL;
	DArray *darr_file_list = NULL;
	DEFINE_VAR_ALL(str_current_path, str_content, str_new_content);
	
	char *str_log_level = str_global_log_level;
	FINISH_CAT_CSTR(str_global_log_level, "error");
	
	darr_file_list = canonical_list_file(str_path_base_from, str_path_from);
	FINISH_CHECK(darr_file_list != NULL, "canonical_list_file failed");
	
	FINISH_CHECK(canonical_overwrite_file(str_global_fossil_path, "temp_compile.txt"),
		"canonical_overwrite_file failed");
	
	int i, len;
	DEBUG("compile base>%s<", str_path_base_from);
	for (i = 0, len = DArray_count(darr_file_list);i < len;i++) {
		char *ptr_file = DArray_get(darr_file_list, i);
		if (strncmp((ptr_file + strlen(ptr_file)) - 9, "-baseline", 9) == 0 ||
			strncmp((ptr_file + strlen(ptr_file)) - 6, "-merge"   , 6) == 0 ||
			strncmp((ptr_file + strlen(ptr_file)) - 9, "-original", 9) == 0) {
			FINISH("Merge conflict file exists: \"%s\". Please resolve merge conflict(s) and try again.", ptr_file);
		}
		
		DEBUG("compile>%s/%s<", str_path_from, ptr_file);
		
		FINISH_CAT_CSTR(str_current_path, str_path_from, ptr_file);
		
		int int_content_length;
		str_content = canonical_read_file(str_path_base_from, str_current_path, &int_content_length);
		FINISH_CHECK(str_content != NULL, "canonical_read_file failed");
		
		if (strstr(str_content, "\n<<<<<<< ") > str_content ||
			strstr(str_content, "\n======= ") > str_content ||
			strstr(str_content, "\n>>>>>>> ") > str_content) {
			FINISH("Merge conflict in file: \"%s\". Please resolve merge conflict(s) and try again.", ptr_file);
		}
		
		FINISH_CHECK(canonical_append_file(str_global_fossil_path, "temp_compile.txt", str_content, int_content_length),
			"canonical_append_file failed");
		SFREE(str_content);
		SFREE(str_current_path);
	}
	DArray_clear_destroy(darr_file_list); darr_file_list = NULL;
	
	SFREE(str_global_log_level);
	str_global_log_level = str_log_level;
	
	if (bol_mini) {
		int int_content_length;
		str_content = canonical_read_file(str_global_fossil_path, "temp_compile.txt", &int_content_length);
		FINISH_CHECK(str_content != NULL, "canonical_read_file failed");
		
		str_new_content = jsmin(str_content);
		FINISH_CHECK(str_new_content, "jsmin failed");
		
		FINISH_CHECK(canonical_write_file(str_path_base_to, str_path_to, str_new_content, strlen(str_new_content)),
			"canonical_write_file failed");
		
	} else {
		FINISH_CHECK(canonical_copy_overwrite_file(str_global_fossil_path, "temp_compile.txt", str_path_base_to, str_path_to),
			"canonical_copy_overwrite_file failed");
	}
	
	FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
		"Content-Type: application/json; charset=UTF-8\r\n\r\n",
		"{\"stat\": true, \"dat\": \"\"}");
finish:
	if (canonical_is_file(str_global_fossil_path, "temp_compile.txt")) {
		if (! canonical_remove_file(str_global_fossil_path, "temp_compile.txt")) {
			ERROR_NORESPONSE("also: canonical_remove_file failed");
		}
	}
	SFREE_ALL();
	if (darr_file_list != NULL) DArray_clear_destroy(darr_file_list);
	
	return str_response;
}
