#ifndef UTIL_FILE_H
#define UTIL_FILE_H

#include <stdio.h>
#include <string.h>
#include <stdarg.h>
#include <errno.h>
#include <ctype.h>
#include <stdbool.h>
#include <dirent.h>
#include <pwd.h>
#include <grp.h>

#include "util_darray.h"
#include "util_canonical.h"
#include "util_sunlogf.h"
#include "util_error.h"

//chown file/folder
bool canonical_chown(char *str_base_path, char *str_file_path, char *str_username, char *str_groupname);
bool canonical_chown_file(char *str_base_path, char *str_file_path, char *str_username, char *str_groupname);
bool canonical_chown_folder(char *str_base_path, char *str_file_path, char *str_username, char *str_groupname);

//remove file/folder
bool canonical_remove(char *str_base_path, char *str_file_path);
bool canonical_remove_folder(char *str_base_path, char *str_file_path);
bool canonical_remove_file(char *str_base_path, char *str_file_path);

//list file/folder
DArray *canonical_list_filefolder(char *str_base_path, char *str_folder_path, bool bol_folder);
#define canonical_list_folder(A, B)  canonical_list_filefolder(A, B, true)
#define canonical_list_file(A, B)  canonical_list_filefolder(A, B, false)

//create folder
bool canonical_create_folder(char *str_base_path, char *str_folder_path);

//is path a file?
bool canonical_is_file(char *str_base_path, char *str_file_path);

//copy file/folder
bool canonical_copy(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to);
bool canonical_copy_folder(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to);
bool canonical_copy_file(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to);

//copy overwrite file/folder
bool canonical_copy_overwrite(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to);
bool canonical_copy_overwrite_folder(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to);
bool canonical_copy_overwrite_file(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to);

//move file/folder
bool canonical_move(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to);
bool canonical_move_filefolder(char *str_base_path_from, char *str_file_path_from, char *str_base_path_to, char *str_file_path_to, bool bol_folder);
#define canonical_move_folder(A, B, C, D)  canonical_move_filefolder(A, B, C, D, true)
#define canonical_move_file(A, B, C, D)  canonical_move_filefolder(A, B, C, D, false)

//chmod file/folder
bool canonical_chmod(char *str_base_path, char *str_file_path, char *str_mode);
bool canonical_chmod_file(char *str_base_path, char *str_file_path, char *str_mode);
bool canonical_chmod_folder(char *str_base_path, char *str_file_path, char *str_mode);

//write file
#define canonical_overwrite_file(A, B)  canonical_write_file(A, B, "", 0)
bool canonical_touch_file(char *str_base_path, char *str_file_path);
bool canonical_write_file(char *str_base_path, char *str_file_path, char *str_new_content, int int_new_content_length);
bool canonical_append_file(char *str_base_path, char *str_file_path, char *str_new_content, int int_new_content_length);

//read file
char *canonical_read_file(char *str_base_path, char *str_file_path, int *int_ptr_file_length);

//does path exist?
bool canonical_exists(char *str_base_path, char *str_file_path);

//file exists
bool canonical_exists_file(char *str_base_path, char *str_file_path);

//folder exists
bool canonical_exists_folder(char *str_base_path, char *str_folder_path);

//get modify date of file
char *canonical_modified_file(char *str_base_path, char *str_file_path);

// directory is empty?
bool is_directory_empty(char *str_base_path, char *str_folder_path);

#endif /* UTIL_FILE_H */
