#include "postage_handle_c_package.h"

char *link_package_upload(char *str_request, int int_request_len) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_canonical_start, str_full_path);
	sun_upload *sun_current_upload = NULL;
	
	//owner = all | group = read, execute | all = none
	umask(027);
	
    NOTICE("REQUEST TYPE: UPLOAD PACKAGE FILE");
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
	
	//make sure folder exists
	if (! canonical_exists_folder(str_global_fossil_path, "package/")) {
		FINISH_CHECK(
			canonical_create_folder(str_global_fossil_path, "package/")
			, "canonical_create_folder failed");
	}
	
	FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "package/");
	
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

static bool token_folder(char *str_from, char *str_to, char *str_find, char *str_replace);
static bool token_file(char *str_from, char *str_to, char *str_find, char *str_replace);

char *action_package(char *str_form_data) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_action, str_canonical_start, str_canonical_start_upgrade, str_date);
	DEFINE_VAR_MORE(str_buffer, str_json_date, str_json_buffer, str_path, str_new_name);
	DEFINE_VAR_MORE(str_json_files, str_json, str_json_folders, str_files_string);
	DEFINE_VAR_MORE(str_find, str_replace, str_full_path, str_folder_path);
	DArray *darr_list = NULL;
	
	str_action = getpar(str_form_data, "action");
	FINISH_CHECK(str_action != NULL, "getpar failed");
	
	str_path = getpar(str_form_data, "path");
	FINISH_CHECK(str_path != NULL, "getpar failed");
	
	if (strncmp(str_action, "open", 5) == 0) {
		NOTICE("REQUEST TYPE: PACKAGE OPEN");
		SFREE(str_action);
		
		//get find/replace
		str_find = getpar(str_form_data, "find");
		FINISH_CHECK(str_find != NULL, "getpar failed");
		str_replace = getpar(str_form_data, "replace");
		FINISH_CHECK(str_replace != NULL, "getpar failed");
		
		//remove .zip
		FINISH_CAT_CSTR(str_folder_path, str_path);
		char *ptr_folder_path = strrchr(str_folder_path, '.');
		*ptr_folder_path = '\0';
		
		str_new_name = replace(str_folder_path, str_find, str_replace, "g");
		
		//chdir
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "package/");
		DEBUG("chdir: %s", str_canonical_start);
		FINISH_CHECK(
			chdir(str_canonical_start) == 0
			, "chdir failed");	
		
		//zip file must exist
		FINISH_CHECK(
			canonical_exists_file(str_canonical_start, str_path)
			, "zip file must exist");
		
		//destination must not exist
		DEBUG("str_new_name: >%s|%s<", str_canonical_start, str_new_name);
		FINISH_CHECK(
			!canonical_exists_folder(str_canonical_start, str_new_name)
			, "zip folder already exists: (%s) Either delete the (%s) or unzip to a different folder.", str_new_name, str_new_name);
		
		//temp folder
		char str_temp_name[25];
		sprintf(str_temp_name, "temp_%d", getpid());
		
		//unzip
		FINISH_CAT_CSTR(str_full_path, str_canonical_start, str_path);
		DEBUG("TEST1");
		FINISH_CHECK(
			sunny_exec("", str_global_unzip_binary, str_full_path, "-d", str_temp_name) == 0
			, "sunny_exec failed");
		DEBUG("TEST2");
		
		char str_temp_name_macosx[35];
		sprintf(str_temp_name_macosx, "temp_%d/__MACOSX", getpid());
		if (canonical_exists_folder(str_canonical_start, str_temp_name_macosx)) {
			FINISH_CHECK(
				canonical_remove(str_canonical_start, str_temp_name_macosx)
				, "canonical_remove failed");
		}
		
		char str_temp_name_folder[45];
		sprintf(str_temp_name_folder, "temp_%d/%s", getpid(), str_folder_path);
		FINISH_CHECK(
			token_folder(str_temp_name_folder, str_new_name, str_find, str_replace)
			, "token_folder failed");
		
		if (canonical_exists_folder(str_canonical_start, str_temp_name)) {
			FINISH_CHECK(
				canonical_remove(str_canonical_start, str_temp_name)
				, "canonical_remove failed");
		}
		
		SFREE(str_new_name);
		SFREE(str_canonical_start);
		SFREE(str_folder_path);
		SFREE(str_path);
		
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": \"0\"}");
		
	} else if (strncmp(str_action, "read", 5) == 0) {
		NOTICE("REQUEST TYPE: PACKAGE READ");
		SFREE(str_action);
		
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "package/");
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
		
	} else if (strncmp(str_action, "rm", 3) == 0) {
		NOTICE("REQUEST TYPE: PACKAGE REMOVE");
		SFREE(str_action);
		
		str_files_string = getpar(str_form_data, "paths");
		FINISH_CHECK(str_files_string != NULL, "getpar failed.");
		FINISH_CHECK(strlen(str_files_string) > 0, "Must send &paths=.");
		
		darr_list = DArray_json_split(str_files_string);
		SFREE(str_files_string);
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "package/");
		
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
		
	} else if (strncmp(str_action, "list", 5) == 0) {
		NOTICE("REQUEST TYPE: PACKAGE LIST");
		SFREE(str_action);
		
		//find
		str_path = getpar(str_form_data, "path");
		FINISH_CHECK(str_path != NULL, "getpar failed");
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "package/");
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
		
	} else if (strncmp(str_action, "upgrade", 8) == 0) {
		NOTICE("REQUEST TYPE: PACKAGE UPGRADE");
		SFREE(str_action);
		
		FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "package/");
		FINISH_CAT_CSTR(str_canonical_start_upgrade, str_global_fossil_path, "production_", str_current_user, "/");
		
		//get folders
		str_files_string = getpar(str_form_data, "folders");
		FINISH_CHECK(str_files_string != NULL, "getpar failed");
		
		darr_list = DArray_json_split(str_files_string);
		SFREE(str_files_string);
		
		int int_len_path = strlen(str_path);
		
		int i, len;
		for (i = 0, len = DArray_count(darr_list);i < len;i++) {
			char *str_name = DArray_get(darr_list, i);
			
			//TODO: check first part of str_new_name for valid folder
			if (! canonical_exists_folder(str_canonical_start_upgrade, str_name + int_len_path)) {
				FINISH_CHECK(
					canonical_create_folder(str_canonical_start_upgrade, str_name + int_len_path)
					, "canonical_create_folder failed");
			}
		}
		
		DArray_clear_destroy(darr_list); darr_list = NULL;
		
		//get files
		str_files_string = getpar(str_form_data, "files");
		FINISH_CHECK(str_files_string != NULL, "getpar failed");
		
		darr_list = DArray_json_split(str_files_string);
		SFREE(str_files_string);
		
		for (i = 0, len = DArray_count(darr_list);i < len;i++) {
			char *str_name = DArray_get(darr_list, i);
			//TODO: check first part of str_new_name for valid folder
			FINISH_CHECK(
				canonical_copy_overwrite_file(str_canonical_start, str_name, str_canonical_start_upgrade, str_name + int_len_path)
				, "canonical_copy_overwrite_file failed");
		}
		
		DArray_clear_destroy(darr_list); darr_list = NULL;
		
		FINISH_CHECK(
			canonical_remove(str_canonical_start, str_path)
			, "canonical_remove failed");
		
		SFREE(str_canonical_start);
		SFREE(str_canonical_start_upgrade);
		
		//response
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: text/plain\r\n\r\n",
			"{\"stat\": true, \"dat\": \"\"}");
		
	} else {
		NOTICE("REQUEST TYPE: PACKAGE INVALID ACTION");
		//action not recognized
		FINISH("Action does not exist: %s", str_action);
	}
	
finish:
	SFREE_ALL();
	if (darr_list) DArray_clear_destroy(darr_list);
	return str_response;
}

static bool token_folder(char *str_from, char *str_to, char *str_find, char *str_replace) {
	DEFINE_VAR_ALL(str_canonical_start, str_new_name, str_new_find, str_new_from, str_new_to);
	DArray *darr_list = NULL;
	int i, len;
	
	ERROR_CAT_CSTR(str_canonical_start, str_global_fossil_path, "package/");
	
	ERROR_CHECK(
		canonical_create_folder(str_canonical_start, str_to)
		, "canonical_create_folder failed");
	
	DEBUG("folder from>%s|%s<", str_canonical_start, str_from);
	DEBUG("folder to>%s|%s<", str_canonical_start, str_to);
	
	//deal with files
	darr_list = canonical_list_file(str_canonical_start, str_from);
	ERROR_CHECK(darr_list != NULL, "canonical_list_file failed");
	for (i = 0, len = DArray_count(darr_list);i < len;i++) {
		char *str_name = DArray_get(darr_list, i);
		ERROR_CAT_CSTR(str_new_find, "=-", str_find, "-=");
		str_new_name = replace(str_name, str_new_find, str_replace, "g");
		SFREE(str_new_find);
		ERROR_CHECK(str_new_name != NULL, "find_replace failed");
		
		ERROR_CAT_CSTR(str_new_from, str_from, "/", str_name);
		ERROR_CAT_CSTR(str_new_to, str_to, "/", str_new_name);
		SFREE(str_new_name);
		
		ERROR_CHECK(
			token_file(str_new_from, str_new_to, str_find, str_replace)
			, "token_file failed");
		SFREE(str_new_from);
		SFREE(str_new_to);
	}
	DArray_clear_destroy(darr_list); darr_list = NULL;
	
	//deal with folders
	darr_list = canonical_list_folder(str_canonical_start, str_from);
	ERROR_CHECK(darr_list != NULL, "canonical_list_folder failed");
	for (i = 0, len = DArray_count(darr_list);i < len;i++) {
		char *str_name = DArray_get(darr_list, i);
		ERROR_CAT_CSTR(str_new_find, "=-", str_find, "-=");
		str_new_name = replace(str_name, str_new_find, str_replace, "g");
		SFREE(str_new_find);
		ERROR_CHECK(str_new_name != NULL, "find_replace failed");
		
		ERROR_CAT_CSTR(str_new_from, str_from, "/", str_name);
		ERROR_CAT_CSTR(str_new_to, str_to, "/", str_new_name);
		SFREE(str_new_name);
		ERROR_CHECK(
			token_folder(str_new_from, str_new_to, str_find, str_replace)
			, "token_folder failed");
		SFREE(str_new_from);
		SFREE(str_new_to);
		
	}
	DArray_clear_destroy(darr_list); darr_list = NULL;
	
	SFREE(str_canonical_start);
	return true;
error:
	if (darr_list) DArray_clear_destroy(darr_list);
	SFREE_ALL();
	return false;
}

static bool token_file(char *str_from, char *str_to, char *str_find, char *str_replace) {
	DEFINE_VAR_ALL(str_canonical_start, str_buffer, str_new_buffer, str_new_find);
	
	ERROR_CAT_CSTR(str_canonical_start, str_global_fossil_path, "package/");
	
	DEBUG("file from>%s|%s<", str_canonical_start, str_from);
	DEBUG("file to>%s|%s<", str_canonical_start, str_to);
	
	//get file
	int int_length;
	str_buffer = canonical_read_file(str_canonical_start, str_from, &int_length);
	ERROR_CHECK(str_buffer != NULL, "canonical_read_file failed");
	
	//find/replace
	ERROR_CAT_CSTR(str_new_find, "<~", str_find, "~>");
	str_new_buffer = replace(str_buffer, str_new_find, str_replace, "g");
	ERROR_CHECK(str_new_buffer != NULL, "find_replace failed");
	SFREE(str_buffer);
	SFREE(str_new_find);
	
	DEBUG("file sizes>%d|%d<", int_length, strlen(str_new_buffer));
	int_length = strlen(str_new_buffer);
	
	//set file
	ERROR_CHECK(
		canonical_write_file(str_canonical_start, str_to, str_new_buffer, int_length)
		, "canonical_write_file failed");
	SFREE(str_canonical_start);
	SFREE(str_new_buffer);
	
	SFREE_ALL();
	return true;
error:
	SFREE_ALL();
	return false;
}
