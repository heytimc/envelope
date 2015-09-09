#include "util_file.h"

//chown file/folder
bool canonical_chown(char *str_base_path, char *str_file_path, char *str_username, char *str_groupname) {
	if (canonical_is_file(str_base_path, str_file_path)) {
		return canonical_chown_file(str_base_path, str_file_path, str_username, str_groupname);
	} else {
		return canonical_chown_folder(str_base_path, str_file_path, str_username, str_groupname);
	}
}

bool canonical_chown_folder(char *str_base_path, char *str_file_path, char *str_username, char *str_groupname) {
	NOTICE("FILE.C CHOWN FOLDER");
	DEFINE_VAR_ALL(str_canonical_path, str_temp);
	DIR *dirp = NULL;
	struct dirent *dp = NULL;
	
	struct passwd *p = getpwnam(str_username);
	DEBUG(">%s|%s<", str_username, p != NULL ? "true" : "false");
	ERROR_CHECK(p != NULL,
		"getpwnam failed: %d (%s)", errno, strerror(errno));
	
	struct group *g = getgrnam(str_groupname);
	DEBUG(">%s|%s<", str_groupname, g != NULL ? "true" : "false");
	ERROR_CHECK(g != NULL,
		"getgrnam %s failed: %d (%s)", str_groupname, errno, strerror(errno));
	
	str_canonical_path = canonical(str_base_path, str_file_path, "read_dir");
	ERROR_CHECK(str_canonical_path != NULL,
		"Path must exist to run chown on it");
	
	if (*(str_canonical_path + strlen(str_canonical_path) - 1) != '/') {
		ERROR_CAT_APPEND(str_canonical_path, "/");
	}
	
	//files and folders
	dirp = opendir(str_canonical_path);
	
	ERROR_CHECK(dirp != NULL, "opendir failed: %d (%s)", errno, strerror(errno));
	
	while (dirp) {
		errno = 0;
		if ((dp = readdir(dirp)) != NULL) {
			//dp->d_name
			if (strncmp(dp->d_name, "..", 3) != 0 && strncmp(dp->d_name, ".", 2) != 0) {
				ERROR_CAT_CSTR(str_temp, "/", dp->d_name);
				if (canonical_is_file(str_canonical_path, dp->d_name)) {
					ERROR_CHECK(canonical_chown_file(str_canonical_path, str_temp, str_username, str_groupname), "canonical_remove_file failed");
				} else {
					ERROR_CHECK(canonical_chown_folder(str_canonical_path, str_temp, str_username, str_groupname), "canonical_remove_folder failed");
				}
				SFREE(str_temp);
			}
		} else {
			ERROR_CHECK(errno == 0, "opendir failed: %d %s", errno, strerror(errno));
			//no error, and no file, we've reached the end so close
			closedir(dirp);
			dirp = NULL;
		}
	}
	
	ERROR_CHECK(chown(str_canonical_path, p->pw_uid, g->gr_gid) == 0,
		"chown failed");
	
	INFO("FILE.C CHOWN FOLDER END");
	SFREE_ALL();
	return true;
error:
	SFREE_ALL();
	return false;
}

bool canonical_chown_file(char *str_base_path, char *str_file_path, char *str_username, char *str_groupname) {
	NOTICE("FILE.C CHOWN FILE");
	DEFINE_VAR_ALL(str_canonical_path);
	
	struct passwd *p = getpwnam(str_username);
	DEBUG(">%s|%s<", str_username, p != NULL ? "true" : "false");
	ERROR_CHECK(p != NULL,
		"getpwnam failed: %d (%s)", errno, strerror(errno));
	
	struct group *g = getgrnam(str_groupname);
	DEBUG(">%s|%s<", str_groupname, g != NULL ? "true" : "false");
	ERROR_CHECK(g != NULL,
		"getgrnam %s failed: %d (%s)", str_groupname, errno, strerror(errno));
	
	str_canonical_path = canonical(str_base_path, str_file_path, "read_file");
	ERROR_CHECK(str_canonical_path != NULL,
		"Path must exist to run chown on it");
	
	ERROR_CHECK(chown(str_canonical_path, p->pw_uid, g->gr_gid) == 0,
		"chown failed");
	
	INFO("FILE.C CHOWN FILE END");
	SFREE_ALL();
	return true;
error:
	SFREE_ALL();
	return false;
}

//remove file/folder
bool canonical_remove(char *str_base_path, char *str_file_path) {
	if (canonical_is_file(str_base_path, str_file_path)) {
		return canonical_remove_file(str_base_path, str_file_path);
	} else {
		return canonical_remove_folder(str_base_path, str_file_path);
	}
}

bool canonical_remove_folder(char *str_base_path, char *str_folder_path) {
	NOTICE("FILE.C REMOVE FOLDER");
	DEFINE_VAR_ALL(str_temp, str_canonical_path);
	DIR *dirp = NULL;
	struct dirent *dp = NULL;
	
	str_canonical_path = canonical(str_base_path, str_folder_path, "read_dir");
	ERROR_CHECK(str_canonical_path != NULL,
		"Failed to get canonical path: %s %s",
		str_base_path, str_folder_path);
	
	if (*(str_canonical_path + strlen(str_canonical_path) - 1) != '/') {
		ERROR_CAT_APPEND(str_canonical_path, "/");
	}
	
	printf("Removing %s\n", str_canonical_path);
	
	//files and folders
	dirp = opendir(str_canonical_path);
	
	ERROR_CHECK(dirp != NULL, "opendir failed: %d (%s)", errno, strerror(errno));
	
	while (dirp) {
		errno = 0;
		if ((dp = readdir(dirp)) != NULL) {
			//dp->d_name
			if (strncmp(dp->d_name, "..", 3) != 0 && strncmp(dp->d_name, ".", 2) != 0) {
				ERROR_CAT_CSTR(str_temp, "/", dp->d_name);
				if (canonical_is_file(str_canonical_path, dp->d_name)) {
					ERROR_CHECK(canonical_remove_file(str_canonical_path, str_temp), "canonical_remove_file failed");
				} else {
					ERROR_CHECK(canonical_remove_folder(str_canonical_path, str_temp), "canonical_remove_folder failed");
				}
				SFREE(str_temp);
			}
		} else {
			ERROR_CHECK(errno == 0, "opendir failed: %d %s", errno, strerror(errno));
			//no error, and no file, we've reached the end so close
			closedir(dirp);
			dirp = NULL;
		}
	}
	ERROR_CHECK(rmdir(str_canonical_path) == 0,
		"Folder not removed: %s %d (%s)",
		str_canonical_path, errno, strerror(errno));
	SFREE(str_canonical_path);
	fflush(0);
	
	INFO("FILE.C REMOVE FOLDER END");
	SFREE_ALL();
	return true;
error:
	if (dirp) closedir(dirp);
	SFREE_ALL();
	return false;
}

bool canonical_remove_file(char *str_base_path, char *str_file_path) {
	NOTICE("FILE.C REMOVE FILE");
	DEFINE_VAR_ALL(str_canonical_path);
	
	str_canonical_path = canonical(str_base_path, str_file_path, "write_file");
	ERROR_CHECK(str_canonical_path != NULL,
		"Failed to get canonical path: %s %s",
		str_base_path, str_file_path);
	
	printf("Removing %s\n", str_canonical_path);
	
	ERROR_CHECK(remove(str_canonical_path) == 0,
		"File not removed: %s %d (%s)",
		str_canonical_path, errno, strerror(errno));
	//TODO: check to make sure file was deleted, we had a situation where the permissions were bad and remove() didn't error
	SFREE(str_canonical_path);
	
	INFO("FILE.C REMOVE FILE END");
	SFREE_ALL();
	return true;
error:
	SFREE_ALL();
	return false;
}

DArray *canonical_list_filefolder(char *str_base_path, char *str_folder_path, bool bol_folder) {
	NOTICE("FILE.C LIST %s", bol_folder ? "FOLDERS" : "FILES");
	DIR *dirp = NULL;
	DArray *darr_list = NULL;
	struct dirent *dp = NULL;
	DEFINE_VAR_ALL(str_canonical_path, str_name);
	
	DEBUG("canonical_list_filefolder(%s, %s, %s)", str_base_path, str_folder_path, bol_folder ? "true" : "false");
	
	str_canonical_path = canonical(str_base_path, str_folder_path, "read_dir");
	ERROR_CHECK(str_canonical_path != NULL,
		"Failed to get canonical path: %s %s",
		str_base_path, str_folder_path);
	
	darr_list = DArray_create(1, 1);
	ERROR_CHECK(darr_list != NULL, "DArray_create failure");
	
	if (*(str_canonical_path + strlen(str_canonical_path) - 1) != '/') {
		ERROR_CAT_APPEND(str_canonical_path, "/");
	}
	
	//files and folders
	dirp = opendir(str_canonical_path);
	ERROR_CHECK(dirp != NULL, "opendir failed: %d %s", errno, strerror(errno));
	
	while (dirp) {
		errno = 0;
		if ((dp = readdir(dirp)) != NULL) {
			//dp->d_name
			ERROR_CAT_CSTR(str_name, dp->d_name);
			if (strncmp(str_name, "..", 3) != 0 && strncmp(str_name, ".", 2) != 0) {
				if (bol_folder != canonical_is_file(str_canonical_path, str_name)) {
					DArray_push(darr_list, str_name);
				} else {
					SFREE(str_name);
				}
			} else {
				SFREE(str_name);
			}
			// HARK YE ONLOOKER:
			// DO NOT UNCOMMENT!!! WE ARE PUSHING TO AN ARRY!!!
			//SFREE(str_name);
			str_name = NULL;
		} else {
			ERROR_CHECK(errno == 0, "opendir failed: %d %s", errno, strerror(errno));
			//no error, and no file, we've reached the end so close
			closedir(dirp);
			dirp = NULL;
		}
	}
	
	DArray_qsort(darr_list, (DArray_compare)darray_strcmp);
	SFREE(str_canonical_path);
	
	INFO("FILE.C LIST %s END", bol_folder ? "FOLDERS" : "FILES");
	SFREE_ALL();
	return darr_list;
error:
	if (dirp) closedir(dirp);
	if (darr_list) DArray_clear_destroy(darr_list);
	SFREE_ALL();
	return NULL;
}

bool canonical_create_folder(char *str_base_path, char *str_folder_path) {
	NOTICE("FILE.C CREATE FOLDER");
	DEFINE_VAR_ALL(str_canonical_path);
	
	str_canonical_path = canonical(str_base_path, str_folder_path, "create_dir");
	ERROR_CHECK(str_canonical_path != NULL,
		"Failed to get canonical path: %s %s",
		str_base_path, str_folder_path);
	SFREE(str_canonical_path);
	
	INFO("FILE.C CREATE FOLDER END");
	SFREE_ALL();
	return true;
error:
	SFREE_ALL();
	return false;
}

bool canonical_is_file(char *str_base_path, char *str_file_path) {
	NOTICE("FILE.C IS FILE");
	DEFINE_VAR_ALL(str_canonical_path);
	
	str_canonical_path = canonical(str_base_path, str_file_path, "valid_path");
	ERROR_CHECK(str_canonical_path != NULL,
		"Failed to get canonical path: %s %s",
		str_base_path, str_file_path);
	SFREE(str_canonical_path);
	
	//ERROR_NORESPONSE("is_file>%s|%s|%s<", str_base_path, str_file_path, str_canonical_path);
	
	INFO("FILE.C IS FILE END");
	SFREE_ALL();
	return canonical_exists_file(str_base_path, str_file_path);
error:
	//TODO: What to do in case of error?
	SFREE_ALL();
	return false;
}

bool canonical_copy(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to) {
	if (canonical_is_file(str_base_path_from, str_file_path_from)) {
		return canonical_copy_file(str_base_path_from, str_file_path_from, str_base_path_to, str_file_path_to);
	} else {
		return canonical_copy_folder(str_base_path_from, str_file_path_from, str_base_path_to, str_file_path_to);
	}
}

bool canonical_copy_folder(char *str_base_path_from, char *str_folder_path_from, char *str_base_path_to, char *str_folder_path_to) {
	NOTICE("FILE.C COPY FOLDER");
	DEFINE_VAR_ALL(str_from, str_to, str_canonical_path_from, str_canonical_path_to);
	DIR *dirp = NULL;
	struct dirent *dp = NULL;
	ERROR_CHECK(!canonical_exists(str_base_path_to, str_folder_path_to),
		"Path to already exists. %s %s", str_base_path_to, str_folder_path_to);
	str_canonical_path_from = canonical(str_base_path_from, str_folder_path_from, "read_dir");
	ERROR_CHECK(str_canonical_path_from != NULL,
		"Failed to get canonical path: %s %s",
		str_base_path_from, str_folder_path_from);
	
	str_canonical_path_to = canonical(str_base_path_to, str_folder_path_to, "create_dir");
	ERROR_CHECK(str_canonical_path_to != NULL,
		"Failed to get canonical path: %s %s",
		str_base_path_to, str_folder_path_to);
	SFREE(str_canonical_path_to);
	
	//files and folders
	dirp = opendir(str_canonical_path_from);
	SFREE(str_canonical_path_from);
	ERROR_CHECK(dirp != NULL, "opendir failed: %d (%s)", errno, strerror(errno));
	
	while (dirp) {
		errno = 0;
		if ((dp = readdir(dirp)) != NULL) {
			//dp->d_name
			if (strncmp(dp->d_name, "..", 3) != 0 && strncmp(dp->d_name, ".", 2) != 0) {
				ERROR_CAT_CSTR(str_from, str_folder_path_from, "/", dp->d_name);
				ERROR_CAT_CSTR(str_to, str_folder_path_to, "/", dp->d_name);
				if (canonical_is_file(str_base_path_from, str_from)) {
					DEBUG("file>%s/%s|%s/%s<", str_base_path_from, str_from, str_base_path_to, str_to);
					ERROR_CHECK(canonical_copy_file(str_base_path_from, str_from, str_base_path_to, str_to),
						"Error copying %s|%s", str_base_path_from, str_from);
				} else {
					DEBUG("folder>%s/%s|%s/%s<", str_base_path_from, str_from, str_base_path_to, str_to);
					ERROR_CHECK(canonical_copy_folder(str_base_path_from, str_from, str_base_path_to, str_to),
						"Error copying %s|%s", str_base_path_from, str_from);
				}
				SFREE(str_to);
				SFREE(str_from);
			}
			
		} else {
			ERROR_CHECK(errno == 0, "opendir error: %d (%s)", errno, strerror(errno));
			//no error, and no file, we've reached the end so close
			closedir(dirp); dirp = NULL;
		}
	}
	
	INFO("FILE.C COPY FOLDER END");
	SFREE_ALL();
	return true;
error:
	SFREE_ALL();
	if (dirp) closedir(dirp);
	return false;
}

bool canonical_copy_file(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to) {
	NOTICE("FILE.C COPY FILE");
	//TODO: possible optimize this, read 255 chars from file, then write, etc
	//probably only do that if we have a salloc error from this function
	DEFINE_VAR_ALL(str_content);
	
	ERROR_CHECK(!canonical_exists(str_base_path_to, str_file_path_to),
		"Path to already exists. %s %s", str_base_path_to, str_file_path_to);
	
	int int_content_length;
	str_content = canonical_read_file(str_base_path_from, str_file_path_from, &int_content_length);
	ERROR_CHECK(str_content != NULL, "canonical_read_file failed");
	bool bol_result = canonical_write_file(str_base_path_to, str_file_path_to, str_content, int_content_length);
	SFREE(str_content);
	
	INFO("FILE.C COPY FILE END");
	SFREE_ALL();
	return bol_result;
error:
	SFREE_ALL();
	return false;
}

bool canonical_copy_overwrite(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to) {
	if (canonical_is_file(str_base_path_from, str_file_path_from)) {
		return canonical_copy_overwrite_file(str_base_path_from, str_file_path_from, str_base_path_to, str_file_path_to);
	} else {
		return canonical_copy_overwrite_folder(str_base_path_from, str_file_path_from, str_base_path_to, str_file_path_to);
	}
}

bool canonical_copy_overwrite_folder(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to) {
	NOTICE("FILE.C COPY OVERWRITE FOLDER");
	if (canonical_exists_folder(str_base_path_to, str_file_path_to)) {
		ERROR_CHECK(canonical_remove_folder(str_base_path_to, str_file_path_to),
			"canonical_remove_folder failed");
	}
	ERROR_CHECK(canonical_copy_folder(str_base_path_from, str_file_path_from, str_base_path_to, str_file_path_to),
		"canonical_copy_folder failed");
	INFO("FILE.C COPY OVERWRITE FOLDER END");
	return true;
error:
	return false;
}

bool canonical_copy_overwrite_file(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to) {
	NOTICE("FILE.C COPY OVERWRITE FILE");
	if (canonical_is_file(str_base_path_to, str_file_path_to)) {
		ERROR_CHECK(canonical_remove_file(str_base_path_to, str_file_path_to),
			"canonical_remove_file failed");
	}
	ERROR_CHECK(canonical_copy_file(str_base_path_from, str_file_path_from, str_base_path_to, str_file_path_to),
		"canonical_copy_file failed");
	INFO("FILE.C COPY OVERWRITE FILE END");
	return true;
error:
	return false;
}

bool canonical_move(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to) {
	if (canonical_is_file(str_base_path_from, str_file_path_from)) {
		return canonical_move_filefolder(str_base_path_from, str_file_path_from, str_base_path_to, str_file_path_to, false);
	} else {
		return canonical_move_filefolder(str_base_path_from, str_file_path_from, str_base_path_to, str_file_path_to, true);
	}
}

bool canonical_move_filefolder(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to, bool bol_folder) {
	NOTICE("FILE.C MOVE %s", bol_folder ? "FOLDER" : "FILE");
	DEFINE_VAR_ALL(str_canonical_path_from, str_canonical_path_to);
	ERROR_CHECK(!canonical_exists(str_base_path_to, str_file_path_to),
		"Path to already exists. %s %s", str_base_path_to, str_file_path_to);
	
	str_canonical_path_from = canonical(str_base_path_from, str_file_path_from,
		bol_folder ? "valid_path" : "read_file");
	ERROR_CHECK(str_canonical_path_from != NULL,
		"Failed to get canonical path: %s %s",
		str_base_path_from, str_file_path_from);
	
	str_canonical_path_to = canonical(str_base_path_to, str_file_path_to,
		bol_folder ? "valid_path" : "write_file");
	ERROR_CHECK(str_canonical_path_to != NULL,
				"Failed to get canonical path: %s %s",
				str_base_path_to, str_file_path_to);
	
	ERROR_CHECK(rename(str_canonical_path_from, str_canonical_path_to) == 0,
		"Error renaming from %s to %s: %d (%s)",
		str_canonical_path_from, str_canonical_path_to, errno, strerror(errno));
	SFREE(str_canonical_path_from);
	SFREE(str_canonical_path_to);
	
	INFO("FILE.C MOVE %s END", bol_folder ? "FOLDER" : "FILE");
	SFREE_ALL();
	return true;
error:
	SFREE_ALL();
	return false;
}

//chmod file/folder
bool canonical_chmod(char *str_base_path, char *str_file_path, char *str_mode) {
	if (canonical_is_file(str_base_path, str_file_path)) {
		return canonical_chmod_file(str_base_path, str_file_path, str_mode);
	} else {
		return canonical_chmod_folder(str_base_path, str_file_path, str_mode);
	}
}
bool canonical_chmod_folder(char *str_base_path, char *str_file_path, char *str_mode) {
	NOTICE("FILE.C CHMOD FOLDER");
	DEFINE_VAR_ALL(str_canonical_path, str_temp);
	DIR *dirp = NULL;
	struct dirent *dp = NULL;
	
	str_canonical_path = canonical(str_base_path, str_file_path, "read_dir");
    ERROR_CHECK(str_canonical_path != NULL, "Failed to get canonical path: %s", str_canonical_path);
	
	//files and folders
	dirp = opendir(str_canonical_path);
	
	ERROR_CHECK(dirp != NULL, "opendir failed: %d (%s)", errno, strerror(errno));
	
	while (dirp) {
		errno = 0;
		if ((dp = readdir(dirp)) != NULL) {
			//dp->d_name
			if (strncmp(dp->d_name, "..", 3) != 0 && strncmp(dp->d_name, ".", 2) != 0) {
				ERROR_CAT_CSTR(str_temp, "/", dp->d_name);
				if (canonical_is_file(str_canonical_path, dp->d_name)) {
					ERROR_CHECK(canonical_chmod_file(str_canonical_path, str_temp, str_mode), "canonical_remove_file failed");
				} else {
					ERROR_CHECK(canonical_chmod_folder(str_canonical_path, str_temp, str_mode), "canonical_remove_folder failed");
				}
				SFREE(str_temp);
			}
		} else {
			ERROR_CHECK(errno == 0, "opendir failed: %d %s", errno, strerror(errno));
			//no error, and no file, we've reached the end so close
			closedir(dirp);
			dirp = NULL;
		}
	}
	
	int i = strtol(str_mode, 0, 8);
	ERROR_CHECK(chmod(str_canonical_path, i) >= 0,
		"Failed to chmod %s %s: %d (%s)\n",
		str_mode, str_canonical_path, errno, strerror(errno));
	SFREE(str_canonical_path);
	
	INFO("FILE.C CHMOD FOLDER END");
	SFREE_ALL();
	return true;
error:
	SFREE_ALL();
	return false;
}
bool canonical_chmod_file(char *str_base_path, char *str_file_path, char *str_mode) {
	NOTICE("FILE.C CHMOD FILE");
	DEFINE_VAR_ALL(str_canonical_path);
	
	str_canonical_path = canonical(str_base_path, str_file_path, "read_file");
    ERROR_CHECK(str_canonical_path != NULL, "Failed to get canonical path: %s", str_canonical_path);
	
	int i = strtol(str_mode, 0, 8);
	ERROR_CHECK(chmod(str_canonical_path, i) >= 0,
		"Failed to chmod %s %s: %d (%s)\n",
		str_mode, str_canonical_path, errno, strerror(errno));
	SFREE(str_canonical_path);
	
	INFO("FILE.C CHMOD FILE END");
	SFREE_ALL();
	return true;
error:
	SFREE_ALL();
	return false;
}

//touch file
bool canonical_touch_file(char *str_base_path, char *str_file_path) {
	if (!canonical_exists_file(str_base_path, str_file_path)) {
		return canonical_write_file(str_base_path, str_file_path, "", 0);
	}
	return true;
}

bool canonical_write_file(char *str_base_path, char *str_file_path, char *str_new_content, int int_new_content_length) {
	NOTICE("FILE.C WRITE FILE");
	DEFINE_VAR_ALL(str_canonical_path);
    //// Make sure path exists and is canonical
	FILE *fp = NULL;
	str_canonical_path = canonical(str_base_path, str_file_path, "write_file");
	DEBUG("Writing to %s (%s|%s)", str_canonical_path, str_base_path, str_file_path);
    ERROR_CHECK(str_canonical_path != NULL, "Failed to get canonical path: %s %s, %d: (%s)", str_base_path, str_file_path, errno, strerror(errno));
	
    //// Open file
    fp = fopen(str_canonical_path, "w");
    ERROR_CHECK(fp != NULL, "Failed to open %s for writing.", str_canonical_path);
    
    //// Write content
	ERROR_CHECK(!((fwrite(str_new_content, 1, int_new_content_length, fp) == 0 && int_new_content_length > 0) || ferror(fp)),
		"Error writing to file: %d \"%s\".\n", errno, strerror(errno));
	
	ERROR_CHECK(!fclose(fp), "Error closing file: %d (%s).", errno, strerror(errno));
	fp = NULL;
	
    //// Clean up variables
    SFREE(str_canonical_path);
	
	INFO("FILE.C WRITE FILE END");
	
    SFREE_ALL();
	
	return true;
error:
    if (fp != NULL) fclose(fp);
    SFREE_ALL();
	return false;
}

bool canonical_append_file(char *str_base_path, char *str_file_path, char *str_new_content, int int_new_content_length) {
	NOTICE("FILE.C APPEND FILE");
    //// Make sure path exists and is canonical
	FILE *fp = NULL;
	DEFINE_VAR_ALL(str_canonical_path);
	
	str_canonical_path = canonical(str_base_path, str_file_path, "write_file");
    ERROR_CHECK(str_canonical_path != NULL, "Failed to get canonical path: %s %s", str_base_path, str_file_path);
	
    //// Open file
    fp = fopen(str_canonical_path, "a");
    ERROR_CHECK(fp != NULL, "Failed to open %s for writing.", str_canonical_path);
    
    //// Write content
	ERROR_CHECK(!((fwrite(str_new_content, 1, int_new_content_length, fp) == 0 && int_new_content_length > 0) || ferror(fp)),
		"Error writing to file: %d (%s)", errno, strerror(errno));
	
	ERROR_CHECK(! fclose(fp), "Error closing file: %d (%s)", errno, strerror(errno));
	fp = NULL;
	
    //// Clean up variables
    SFREE(str_canonical_path);
	
	INFO("FILE.C APPEND FILE END");
    SFREE_ALL();
	return true;
error:
    if (fp != NULL) fclose(fp);
    SFREE_ALL();
	return false;
}

char *canonical_read_file(char *str_base_path, char *str_file_path, int *int_ptr_file_length) {
	NOTICE("FILE.C READ FILE");
	//// Make sure path exists and is canonical
	char *str_return = NULL;
	FILE *fp = NULL;
	DEFINE_VAR_ALL(str_canonical_path);
	
	str_canonical_path = canonical(str_base_path, str_file_path, "read_file");
    ERROR_CHECK(str_canonical_path != NULL, "Failed to get canonical path: %s %s", str_base_path, str_file_path);
	
    //// Open file
    fp = fopen(str_canonical_path, "r");
    ERROR_CHECK(fp != NULL, "Failed to open %s for reading: %d (%s)", str_canonical_path, errno, strerror(errno));
    
    //// Get file length
    fseek(fp, 0, SEEK_END);
    *int_ptr_file_length = ftell(fp);
    fseek(fp, 0, SEEK_SET);
    
	//// Read file into variable
    ERROR_SALLOC(str_return, *int_ptr_file_length + 1);
    fread(str_return, 1, *int_ptr_file_length, fp);
    str_return[*int_ptr_file_length] = '\0';
	
    //// Clean up variables and return
    ERROR_CHECK(! fclose(fp), "Error closing file: %d (%s).", errno, strerror(errno));
	fp = NULL;
	
    SFREE(str_canonical_path);
	
	INFO("FILE.C READ FILE END");
    SFREE_ALL();
    return str_return;
error:
    if (fp != NULL) fclose(fp);
    SFREE_ALL();
    SFREE(str_return);
	return NULL;
}

bool canonical_exists(char *str_base_path, char *str_file_path) {
	return canonical_exists_file(str_base_path, str_file_path) ||
		canonical_exists_folder(str_base_path, str_file_path);
}

bool canonical_exists_file(char *str_base_path, char *str_file_path) {
	NOTICE("FILE.C EXISTS FILE");
	DEFINE_VAR_ALL(str_canonical_path);
	
	str_canonical_path = canonical(str_base_path, str_file_path, "read_file");
	bool bol_return = str_canonical_path != NULL;
	SFREE(str_canonical_path);
	
	INFO("FILE.C EXISTS FILE END");
	SFREE_ALL();
	return bol_return;
}

bool canonical_exists_folder(char *str_base_path, char *str_folder_path) {
	NOTICE("FILE.C EXISTS FOLDER");
	DEFINE_VAR_ALL(str_canonical_path);
	
	str_canonical_path = canonical(str_base_path, str_folder_path, "read_dir");
	bool bol_return = str_canonical_path != NULL;
	SFREE(str_canonical_path);
	
	INFO("FILE.C EXISTS FOLDER END");
	SFREE_ALL();
	return bol_return;
}

char *canonical_modified_file(char *str_base_path, char *str_file_path) {
	NOTICE("FILE.C MODIFIED_TIME FILE");
	//// Make sure path exists and is canonical
	char *str_return = NULL;
	DEFINE_VAR_ALL(str_canonical_path);
	
	struct stat attr;
	struct tm *tm_return_time = NULL;
	
	str_canonical_path = canonical(str_base_path, str_file_path, "read_file");
    ERROR_CHECK(str_canonical_path != NULL, "Failed to get canonical path: %s %s", str_base_path, str_file_path);
	
	//get file modified date
	ERROR_CHECK(! stat(str_canonical_path, &attr), "Stat failed: %d (%s)", errno, strerror(errno));
	
	tm_return_time = gmtime(&(attr.st_ctime));
    ERROR_CHECK(tm_return_time != NULL, "gmtime failed: %d (%s)", errno, strerror(errno));
	ERROR_SALLOC(str_return, 50 + 1);
	strftime(str_return, 50, "%a, %d %b %Y %H:%M:%S %Z", tm_return_time);
	
	SFREE(str_canonical_path);
	
	INFO("FILE.C MODIFIED_TIME FILE END");
	SFREE_ALL();
	return str_return;
error:
	SFREE(str_return);
	SFREE(tm_return_time);
	SFREE_ALL();
	return NULL;
}

bool is_directory_empty(char *str_base_path, char *str_folder_path) {
	NOTICE("FILE.C IS_DIR_EMPTY");
    int n = 0;
	DIR *dir = NULL;
    struct dirent *d = NULL;
	DEFINE_VAR_ALL(str_canonical_path);
	
	str_canonical_path = canonical(str_base_path, str_folder_path, "read_dir");
    ERROR_CHECK(str_canonical_path != NULL, "Failed to get canonical folder path: %s %s", str_base_path, str_folder_path);
	
    dir = opendir(str_canonical_path);
    SFREE(str_canonical_path);
    if (dir == NULL) { //Not a directory or doesn't exist
        return true;
    }
    while ((d = readdir(dir)) != NULL) {
        if (++n > 2) {
            break;
        }
    }
    ERROR_CHECK(closedir(dir) == 0, "closedir failed: %d (%s)", errno, strerror(errno));
	dir = NULL;
	
	INFO("FILE.C IS_DIR_EMPTY END");
    SFREE_ALL();
    if (n <= 2) { //Directory Empty
        return true;
    } else {
        return false;
    }
error:
	//TODO: what to do on error?
    SFREE_ALL();
    if (dir) closedir(dir);
	return false;
}
