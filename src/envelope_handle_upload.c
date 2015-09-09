#include "envelope_handle_upload.h"

// ############ EXTERNAL FUNCTION DEFINITIONS ####################

char *link_upload(PGconn *cnxn, char *str_request, int int_request_len, char *str_subdomain) {
	char *str_response = NULL;
    NOTICE("REQUEST TYPE: UPLOAD ROLE FILE");
    sun_upload *sun_current_upload = get_sun_upload(str_request, int_request_len);
	FINISH_CHECK(sun_current_upload != NULL, "get_sun_upload failed");
    DEBUG("upload length: %i", sun_current_upload->int_file_content_length);
    str_response = write_file(cnxn, sun_current_upload->str_name,
							  sun_current_upload->str_file_content,
							  sun_current_upload->int_file_content_length, str_subdomain);
finish:
	SFREE_SUN_UPLOAD(sun_current_upload);
	return str_response;
}

char *write_file(PGconn *cnxn, char *str_path, char *str_content, int int_content_length, char *str_subdomain) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_canonical_start);
	//check for role and move past if necessary
	char *ptr_path = str_path;
	if (*ptr_path == '/') {
		ptr_path++;
	}
	
	DEBUG("file_name>%s<", str_path);
	
	//check for permissions
	FINISH_CHECK(ddl_writeable(cnxn, ptr_path), "No permission to folder.");
	
	if (strlen(str_subdomain) > 0) {
		if (strncmp(str_subdomain, "production", 10) == 0) {
			FINISH_CAT_CSTR(str_canonical_start, str_global_role_path);
		} else {
			FINISH_CHECK(username_check(str_subdomain), "Username not set up");
			FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_subdomain, "_data/role/");
		}
	} else {
		FINISH_CAT_CSTR(str_canonical_start, str_global_role_path);
	}
	
	//char *str_real_path = canonical_write(str_canonical_start, ptr_path);
	DEBUG("str_canonical_start: %s ptr_path: %s str_content_length: %d int_content_length: %d", str_canonical_start, ptr_path, strlen(str_content), int_content_length);
	umask(002);
	FINISH_CHECK(canonical_write_file(str_canonical_start, ptr_path, str_content, int_content_length),
		"canonical_write_file failed");
	
	FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
		"Content-Type: application/json; charset=UTF-8\r\n\r\n{\"stat\": true, \"dat\": \"-1\"}");
finish:
	SFREE_ALL();
	return str_response;
}

char *action_role(PGconn *cnxn, int csock, char *str_form_data, char *str_uri, char *str_subdomain) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_fork, str_case_sensitive, str_pattern, str_regexp, str_flags);
	DEFINE_VAR_MORE(str_content, str_new_content, str_temp, str_json, str_input_date);
	DEFINE_VAR_MORE(str_file_modified, str_date, str_buffer, str_json_buffer);
	DEFINE_VAR_MORE(str_from_paths_string, str_to_paths_string, str_paths_string);
	DEFINE_VAR_MORE(str_path, str_json_folders, str_json_files, str_action);
	DEFINE_VAR_MORE(str_canonical_start, str_path_to_entry);
	DEFINE_VAR_MORE(str_zip_path_file, str_files_string, str_zip_base_folder);
	DEFINE_VAR_MORE(str_zip_folder, str_full_path, str_zip_path_folder);
	DEFINE_VAR_MORE(str_full_path2, str_temp_name);
	
	DArray *darr_from_paths = NULL;
	DArray *darr_to_paths = NULL;
	DArray *darr_paths = NULL;
	DArray *darr_list = NULL;
	
	if (strlen(str_subdomain) > 0) {
		if (strncmp(str_subdomain, "production", 10) == 0) {
			FINISH_CAT_CSTR(str_canonical_start, str_global_role_path);
		} else {
			FINISH_CHECK(username_check(str_subdomain), "Username not set up.");
			FINISH_CAT_CSTR(str_canonical_start, str_global_fossil_path, "production_", str_subdomain, "_data/role/");
		}
	} else {
		FINISH_CAT_CSTR(str_canonical_start, str_global_role_path);
	}
	
	str_action = getpar(str_form_data, "action");
	FINISH_CHECK(str_action != NULL, "getpar failed");
	if (strncmp(str_action, "exists", 7) == 0) {
		NOTICE("REQUEST TYPE: EXISTS ROLE FILE");
		SFREE(str_action);
		
		str_path = getpar(str_form_data, "path");
		FINISH_CHECK(str_path != NULL, "getpar failed");
		
		str_date = canonical_modified_file(str_canonical_start, str_path);
		//FINISH_CHECK(str_date != NULL, "canonical_modified_file failed");
		if (str_date == NULL) {
			FINISH_CAT_CSTR(str_date, "");
		}
		
		str_json = jsonify(str_date);
		FINISH_CHECK(str_json != NULL, "jsonify failed");
		SFREE(str_date);
		
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json, "}");
		SFREE(str_json);
	} else if (strncmp(str_action, "grep", 4) == 0) {
		NOTICE("REQUEST TYPE: GREP ROLE");
		SFREE(str_action);
		
		//grep
		FINISH_CAT_CSTR(str_fork, str_canonical_start);
		str_fork[strlen(str_fork) - 5] = '\0'; // /role
		
		DEBUG("chdir: ", str_fork);
		chdir(str_fork);
		SFREE(str_fork);
		
		str_pattern = getpar(str_form_data, "pattern");
		FINISH_CHECK(str_pattern != NULL, "getpar failed");
		
		str_case_sensitive = getpar(str_form_data, "case_sensitive");
		FINISH_CHECK(str_case_sensitive != NULL, "getpar failed");
		
		str_regexp = getpar(str_form_data, "regexp");
		FINISH_CHECK(str_regexp != NULL, "getpar failed");
		FINISH_CAT_CSTR(str_flags, "-", strncmp(str_regexp, "true", 5) == 0 ? "" : "F",
			"rIn", strncmp(str_case_sensitive, "true", 5) == 0 ? "" : "i", "e");
		SFREE(str_regexp);
		SFREE(str_case_sensitive);
		
		
		darr_list = canonical_list_folder(str_canonical_start, "");
		FINISH_CHECK(darr_list != NULL, "canonical_list_folder failed");
		FINISH_CAT_CSTR(str_content, "");
		
		int i, len;
		for (i = 0, len = DArray_count(darr_list);i < len;i++) {
			str_temp = DArray_get(darr_list, i);
			FINISH_CAT_CSTR(str_path_to_entry, str_canonical_start, str_temp);
			if (ddl_readable(cnxn, str_temp)) {
				str_temp = sunny_return("", str_global_grep_binary, str_flags, str_pattern, str_path_to_entry);
				FINISH_CAT_APPEND(str_content, str_temp);
				SFREE(str_temp);
			}
		}
		DArray_clear_destroy(darr_list);
		darr_list = NULL;
		
		SFREE(str_flags);
		SFREE(str_pattern);
		
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
		FINISH_CHECK(str_json != NULL, "jsonify failed");
		SFREE(str_new_content);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json, "}");
		SFREE(str_json);
		
	} else if (strlen(str_action) >= 5 && strncmp(str_action, "write", 5) == 0) {
		NOTICE("REQUEST TYPE: WRITE ROLE FILE");
		SFREE(str_action);
		str_path = getpar(str_form_data, "path");
		FINISH_CHECK(str_path != NULL, "getpar failed");
		str_content = getpar(str_form_data, "content");
		FINISH_CHECK(str_content != NULL, "getpar failed");
		int int_content_length = strlen(str_content);
		
		//check for role and move past if necessary
		char *ptr_path = str_path;
		if (*ptr_path == '/') {
			ptr_path++;
		}
		//check for permissions
		FINISH_CHECK(ddl_writeable(cnxn, ptr_path), "No permission to folder.");
		
		if (strstr(str_form_data, "change_stamp=")) {
			str_input_date = getpar(str_form_data, "change_stamp");
			FINISH_CHECK(str_input_date != NULL, "getpar failed");
			str_file_modified = canonical_modified_file(str_canonical_start, ptr_path);
			FINISH_CHECK(str_file_modified != NULL, "canonical_modified_file failed");
			DEBUG(">%s|%s|%d<", str_input_date, str_file_modified, strncmp(str_file_modified, str_input_date, strlen(str_file_modified)));
			FINISH_CHECK(strncmp(str_file_modified, str_input_date, strlen(str_file_modified)) == 0,
				"Change stamp does not match.");
			SFREE(str_input_date);
			SFREE(str_file_modified);
		}
		
		FINISH_CHECK(canonical_write_file(str_canonical_start, ptr_path, str_content, int_content_length),
			"canonical_write_file failed");
		str_date = canonical_modified_file(str_canonical_start, ptr_path);
		SFREE(str_path);
		SFREE(str_canonical_start);
		
		str_json = jsonify(str_date);
		SFREE(str_date);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json, "}");
		SFREE(str_json);
		
	} else if (strlen(str_action) >= 4 && strncmp(str_action, "read", 4) == 0) {
		NOTICE("REQUEST TYPE: READ ROLE FILE");
		SFREE(str_action);
		str_path = getpar(str_form_data, "path");
		FINISH_CHECK(str_path != NULL, "getpar failed");
		
		//check for role and move past if necessary
		char *ptr_path = str_path;
		if (*ptr_path == '/') {
			ptr_path++;
		}
		//check for permissions
		FINISH_CHECK(ddl_readable(cnxn, ptr_path), "No permission to folder.");
		
		str_date = canonical_modified_file(str_canonical_start, ptr_path);
		FINISH_CHECK(str_date != NULL, "canonical_modified_file failed");
		int int_length;
		str_buffer = canonical_read_file(str_canonical_start, ptr_path, &int_length);
		FINISH_CHECK(str_buffer != NULL, "canonical_read_file failed");
		SFREE(str_path);
		
		char str_length[20];
		sprintf(str_length, "%d", int_length);
		
		str_json = jsonify(str_date);
		SFREE(str_date);
		str_json_buffer = jsonify(str_buffer);
		SFREE(str_buffer);
		
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json\r\n\r\n",
			"{\"stat\": true, \"dat\": ",
			"{\"date\": ", str_json, ", \"length\": \"", str_length, "\", \"content\": ", str_json_buffer, "}}");
		SFREE(str_json);
		SFREE(str_json_buffer);
		
	} else if (strlen(str_action) >= 13 && strncmp(str_action, "create_folder", 13) == 0) {
		NOTICE("REQUEST TYPE: CREATE ROLE FOLDER");
		SFREE(str_action);
		str_path = getpar(str_form_data, "path");
		FINISH_CHECK(str_path != NULL, "getpar failed");
		if (*(str_path + strlen(str_path) - 1) != '/') {
			FINISH_CAT_APPEND(str_path, "/");
		}
		//check for role and move past if necessary
		char *ptr_path = str_path;
		if (*ptr_path == '/') {
			ptr_path++;
		}
		//check for permissions
		FINISH_CHECK(ddl_writeable(cnxn, ptr_path), "No permission to folder.");
		
		FINISH_CHECK(! canonical_exists_folder(str_canonical_start, ptr_path), "Folder already exists.");
		
		FINISH_CHECK(canonical_create_folder(str_canonical_start, ptr_path),
			"canonical_create_folder failed");
		SFREE(str_path);
		
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n", 
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": \"-1\"}");
		
	} else if (strlen(str_action) >= 11 && strncmp(str_action, "create_file", 11) == 0) {
		NOTICE("REQUEST TYPE: CREATE ROLE FILE");
		SFREE(str_action);
		str_path = getpar(str_form_data, "path");
		FINISH_CHECK(str_path != NULL, "getpar failed");
		
		//check for role and move past if necessary
		char *ptr_path = str_path;
		if (*ptr_path == '/') {
			ptr_path++;
		}
		//check for permissions
		FINISH_CHECK(ddl_writeable(cnxn, ptr_path), "No permission to folder.");
		
		FINISH_CHECK(! canonical_exists_file(str_canonical_start, ptr_path), "File already exists.");
		
		FINISH_CHECK(canonical_touch_file(str_canonical_start, ptr_path),
			"canonical_touch_file failed");
		SFREE(str_path);
		
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n", 
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": \"-1\"}");
		
	} else if (strlen(str_action) >= 7 && (strncmp(str_action, "mv_file", 7) == 0 || strncmp(str_action, "cp_file", 7) == 0)) {  // mv files
		NOTICE("REQUEST TYPE: %s ROLE FILE", strncmp(str_action, "mv_file", 7) == 0 ? "MOVE" : "COPY");
		// get all froms
		str_from_paths_string = getpar(str_form_data, "paths_from");
		FINISH_CHECK(str_from_paths_string != NULL, "getpar failed");
		darr_from_paths = DArray_json_split(str_from_paths_string);
		FINISH_CHECK(darr_from_paths != NULL, "DArray_json_split failed");
		SFREE(str_from_paths_string);
		
		FINISH_CHECK(darr_from_paths != NULL, "No files in query string.");
		
		// git all tos
		str_to_paths_string = getpar(str_form_data, "paths_to");
		FINISH_CHECK(str_to_paths_string != NULL, "getpar failed");
		darr_to_paths = DArray_json_split(str_to_paths_string);
		FINISH_CHECK(darr_to_paths != NULL, "DArray_json_split failed");
		SFREE(str_to_paths_string);
		
		FINISH_CHECK(darr_to_paths != NULL, "No files in query string.");
		
		int i, len;
		for (i = 0, len = DArray_count(darr_to_paths);i < len;i++) {
			char *str_file_from = DArray_get(darr_from_paths, i);
			char *str_file_to = DArray_get(darr_to_paths, i);
			FINISH_CHECK(ddl_writeable(cnxn, str_file_from) && ddl_writeable(cnxn, str_file_to), "No permission to folder.");
			if (strncmp(str_action, "mv_file", 7) == 0) {
				canonical_move(str_canonical_start, str_file_from, str_canonical_start, str_file_to);
			} else {
				canonical_copy(str_canonical_start, str_file_from, str_canonical_start, str_file_to);
			}
		}
		DArray_clear_destroy(darr_from_paths); darr_from_paths = NULL;
		DArray_clear_destroy(darr_to_paths); darr_to_paths = NULL;
		SFREE(str_action);
		
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": \"-1\"}");

	} else if (strlen(str_action) >= 2 && strncmp(str_action, "rm", 2) == 0) {  // rm file
		NOTICE("REQUEST TYPE: REMOVE ROLE FILE");
		SFREE(str_action);
		str_paths_string = getpar(str_form_data, "paths");
		FINISH_CHECK(str_paths_string != NULL, "No files in query string.");
		darr_paths = DArray_json_split(str_paths_string);
		SFREE(str_paths_string);
		FINISH_CHECK(darr_paths != NULL, "No files in query string.");
		
		int i, len;
		DEBUG("count: %d", DArray_count(darr_paths));
		for (i = 0, len = DArray_count(darr_paths);i < len;i++) {
			//check for role and move past if necessary
			char *ptr_path = DArray_get(darr_paths, i);
			if (*ptr_path == '/') {
				ptr_path++;
			}
			//check for permissions
			DEBUG("ptr_path: %s", ptr_path);
			FINISH_CHECK(ddl_writeable(cnxn, ptr_path), "No permission for folder.");
			
			DEBUG("str_canonical_start: %s str_path: %s", str_canonical_start, str_path);
			FINISH_CHECK(canonical_remove(str_canonical_start, ptr_path),
				"canonical_remove failed");
		}
		DArray_clear_destroy(darr_paths);
		darr_paths = NULL;
		
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": \"-1\"}");
		
	} else if (strlen(str_action) >= 4 && strncmp(str_action, "list", 4) == 0) {  // get list of folders and files in dir
		NOTICE("REQUEST TYPE: LIST ROLE");
		SFREE(str_action);
		str_path = getpar(str_form_data, "path");
		FINISH_CHECK(str_path != NULL, "getpar failed");
		//check for role and move past if necessary
		char *ptr_path = str_path;
		if (*ptr_path == '/') {
			ptr_path++;
		}
		//check for permissions
		DEBUG(">%s|%s<", str_canonical_start, ptr_path);
		FINISH_CHECK(ddl_readable(cnxn, ptr_path), "No permission for folder");
		
		darr_paths = canonical_list_file(str_canonical_start, ptr_path);
		FINISH_CHECK(darr_paths != NULL, "canonical_list_file failed");
		FINISH_CAT_CSTR(str_json_files, "");
		int i, len;
		for (i = 0, len = DArray_count(darr_paths);i < len;i++) {
			str_json = jsonify(DArray_get(darr_paths, i));
			FINISH_CHECK(str_json != NULL, "jsonify failed");
			FINISH_CAT_APPEND(str_json_files, i > 0 ? ", " : "", str_json);
			SFREE(str_json);
		}
		DArray_clear_destroy(darr_paths);
		darr_paths = NULL;
		
		darr_paths = canonical_list_folder(str_canonical_start, ptr_path);
		FINISH_CHECK(darr_paths != NULL, "canonical_list_folder failed");
		SFREE(str_path);
		FINISH_CAT_CSTR(str_json_folders, "");
		for (i = 0, len = DArray_count(darr_paths);i < len;i++) {
			str_json = jsonify(DArray_get(darr_paths, i));
			FINISH_CHECK(str_json != NULL, "jsonify failed");
			FINISH_CAT_APPEND(str_json_folders, i > 0 ? ", " : "", str_json);
			SFREE(str_json);
		}
		DArray_clear_destroy(darr_paths);
		darr_paths = NULL;
		
		//DEBUG(">%s<", str_list);
		FINISH_CAT_CSTR(str_json, "{\"files\": [", str_json_files, "], \"directories\": [", str_json_folders, "]}");
		SFREE(str_json_files);
		SFREE(str_json_folders);
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": ", str_json, "}");
		SFREE(str_json);
		
	} else if (strncmp(str_action, "zip", 4) == 0) {
		NOTICE("REQUEST TYPE: ROLE FILE ZIP");
		
		//str_zip_path_file = getpar(str_form_data, "to_zip");
		//FINISH_CHECK(str_zip_path_file != NULL, "getpar failed");
		FINISH_SALLOC(str_zip_path_file, 50);
		sprintf(str_zip_path_file, "temp_zip_%d.zip", getpid());
		str_files_string = getpar(str_form_data, "from_paths");
		FINISH_CHECK(str_files_string != NULL, "getpar failed");
		
		char str_pid[20];
		sprintf(str_pid, "%d", getpid());
		
		//create /zip/ folder
		FINISH_CAT_CSTR(str_zip_base_folder, str_canonical_start);
		if (!canonical_exists_folder(str_zip_base_folder, "zip")) {
			FINISH_CHECK(
				canonical_create_folder(str_zip_base_folder, "zip")
				, "canonical_create_folder failed");
		}
		
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
		int int_status = sunny_exec("", str_global_zip_binary, "-r", str_zip_path_file, str_zip_path_folder);
		FINISH_CHECK(
			int_status == 0 || int_status == 1
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
		NOTICE("REQUEST TYPE: ROLE FILE UNZIP");
		
		str_path = getpar(str_form_data, "path");
		FINISH_CHECK(str_path != NULL, "getpar failed");
		
		DEBUG("TEST1>%s|%s<", str_canonical_start, str_path);
		
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
		NOTICE("REQUEST TYPE: INVALID ROLE ACTION");
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 500 Internal Server Error\r\n",
			"Content-Type: application/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": false, \"dat\": {\"error\": \"Invalid action.\"}}");
	}
	
finish:
	SFREE_ALL();
	if (darr_from_paths != NULL) DArray_clear_destroy(darr_from_paths);
	if (darr_to_paths != NULL) DArray_clear_destroy(darr_to_paths);
	if (darr_paths != NULL) DArray_clear_destroy(darr_paths);
	if (darr_list != NULL) DArray_clear_destroy(darr_list);
	
	return str_response;
}
