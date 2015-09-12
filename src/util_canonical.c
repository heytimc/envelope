#include "util_canonical.h"

static int path_valid_char (char * path);
static int is_file (char * filepath);

// ############ EXTERNAL FUNCTION DEFINITIONS ####################

char *canonical(const char * file_base, const char *path, char *check_type) {
	DEFINE_VAR_ALL(str_file_base);//, str, canonical_filename);
	DEFINE_VAR_MORE(str);
	DEFINE_VAR_MORE(canonical_filename);
	
    char *str_return = NULL;
	
    bool bol_path_exists;
    ERROR_CAT_CSTR(str_file_base, file_base);
    int int_file_base_len = strlen(str_file_base);
    
    if (int_file_base_len == 0 || str_file_base[int_file_base_len - 1] != '/') {
    	ERROR_CAT_APPEND(str_file_base, "/");
    }
    
    if (path[0] == '/') {
    	path += 1;
    }
    ERROR_CAT_CSTR(str, str_file_base, path);
    
    // if no path to canonicalize was provided then just return the file_base
    if (strlen(path) == 0) {
		ERROR_CAT_CSTR(str_return, str_file_base);
		SFREE_ALL();
		return str_return;
    }
    
    errno = 0;
    
    // check for invalid path chars
	WARN_CHECK(path_valid_char(str),
		"%s is a bad path. Path contains invalid characters.\n", path);
    
    // check path length
	WARN_CHECK(!(strlen(str) > PATH_MAX - 1),
		"%s is a bad path. Path exceeds maximum length.\n", path);
    
    // get resolved path
    errno = 0;
    ERROR_SALLOC(canonical_filename, PATH_MAX);
    char *realpath_res = realpath(str, canonical_filename);
	
    // save whether or not we found a file/folder at the path (errno = 2 means file does not exist)
    if (errno == 2) {
        bol_path_exists = false;
    } else if (errno == 0) {
        bol_path_exists = true;
		WARN_CHECK(realpath_res != NULL, "realpath failed: %d (%s)", errno, strerror(errno));
    } else {
		WARN("realpath failed: %d (%s)", errno, strerror(errno));
	}
    
    // DO NOT COMMENT, THIS IS SO THAT THE ERROR DOES NOT PROPOGATE
    errno = 0;
    
    // check base of the resolved path with file_base if they do not match
    //      the path is out of the allowed directory therefore we must error
	WARN_CHECK(strncmp(canonical_filename, str_file_base, strlen(str_file_base)) == 0,
		"%s|%s is a bad path. Path is not in a valid base directory.\n", str_file_base, path);
    
    if (strncmp(check_type, "write_file", 11) == 0) {
        // check to make sure it is a file (or does not exist)
        if (bol_path_exists) {
			WARN_CHECK(is_file((char *)canonical_filename),
				"%s|%s is a bad path. Path is not a file.\n", file_base, path);
            
        // if no such file exists create any dirs that are needed
        } else {
            int limit_mkdir = 4;
			//DEBUG("test1>%s|%s|%s<", canonical_filename, str_file_base, str);
			//if (strncmp(canonical_filename, str_file_base, strlen(str_file_base)) != 0) {
				//DEBUG("test2");
				while (strncmp(canonical_filename, str, strlen(str)) != 0 && limit_mkdir > 0) {
					DEBUG("mkdir>%s|%s<", canonical_filename, str);
					ERROR_CHECK(mkdir(canonical_filename, S_IRWXU | S_IRWXG) == 0,
						"%s is a bad path. Directory creation error.\n",
						path);
					realpath_res = realpath(str, canonical_filename);
					limit_mkdir -= 1;
				}
				//DEBUG("test3");
			//}
			//DEBUG("test4");
			
			ERROR_CAT_CSTR(str_return, str);
            SFREE_ALL();
            return str_return;
        }
        
    } else if (strncmp(check_type, "read_file", 10) == 0) {
        // check to make sure path exists if it does not: error
        WARN_CHECK(bol_path_exists,
			"%s: %s|%s is a bad path. Path does not exist.\n", check_type, str_file_base, path);
        
        // check to make sure path is a file if it is not: error
        WARN_CHECK(is_file((char *)canonical_filename),
			"%s: %s|%s is a bad path. Path is not a file.\n", check_type, str_file_base, path);
        
    } else if (strncmp(check_type, "read_dir", 9) == 0) {
        // check to make sure path exists if it does not: error
        WARN_CHECK(bol_path_exists,
			"%s: %s|%s is a bad path. Path does not exist.\n", check_type, str_file_base, path);
        
        WARN_CHECK(!is_file((char *)canonical_filename),
			"%s: %s|%s is a bad path. Path is not a folder.\n", check_type, str_file_base, path);
		
    } else if (strncmp(check_type, "create_dir", 10) == 0) {
        // check to make sure path does not exist if it does: error
        WARN_CHECK(!bol_path_exists,
			"%s: %s|%s is a bad path. Path already exists.\n", check_type, str_file_base, path);
        
        // if no such directory exists: create it
        ERROR_CHECK(0 == mkdir(canonical_filename, S_IRWXU | S_IRWXG ),
			"%s: %s|%s is a bad path. Directory creation error.\n", check_type, str_file_base, path);
        
    } else if (strncmp(check_type, "read_dir_or_file", 17) == 0) {
        // check to make sure path exists if it does not: error
        WARN_CHECK(bol_path_exists,
			"%s: %s|%s is a bad path. Path does not exist.\n", check_type, str_file_base, path);
        
    } else if (strncmp(check_type, "valid_path", 10) == 0) {
        
    } else {
        // error canonical type does not exist
		ERROR("%s is not a valid canonical type.\n", check_type);
    }
    
	ERROR_CAT_CSTR(str_return, canonical_filename);
    SFREE_ALL();
    return str_return;
error:
	SFREE_ALL();
    SFREE(str_return);
	return NULL;
}



// ###############################################################################################################
// ###############################################################################################################
// ######################################## INTERNAL FUNCTION DEFINITIONS ########################################
// ###############################################################################################################
// ###############################################################################################################

// check to see if path is a file
static int is_file(char *str_filepath) {
    struct stat st;
    int fd = open(str_filepath, O_NOFOLLOW | O_RDONLY);
    WARN_CHECK(fd, "open failed: %d (%s)", errno, strerror(errno));
	
    // ######### CHECK LINKS #########
	WARN_CHECK(fstat(fd, &st) == 0, "fstat failed: %d (%s)", errno, strerror(errno));
	
	// ######### EXCLUDE MULTIPLE HARD LINKS #########
	WARN_CHECK(st.st_nlink <= 1, "Multiple Hard Links");
    
        // ######### EXCLUDE SYMBOLIC LINKS #########
    WARN_CHECK(S_ISREG(st.st_mode), "Symbolic Links");
	
	return close(fd) == 0;
error:
	if (fd) close(fd);
	return false;
}

// check for invalid chars in path
static int path_valid_char(char *str_path) {
	// ######### EXCLUDE NON-ASCII ######
	char *ptr_path = str_path;
	char *ptr_path_end = str_path + strlen(str_path);
	char chr_path;
	
	while (ptr_path < ptr_path_end) {
		chr_path = *ptr_path;
		if (!(
				(chr_path >= 'a' && chr_path <= 'z') ||
				(chr_path >= 'A' && chr_path <= 'Z') ||
				(chr_path >= '0' && chr_path <= '9') ||
				chr_path == '%' || chr_path == '&' ||
				chr_path == '+' || chr_path == ',' ||
				chr_path == '.' || chr_path == ':' ||
				chr_path == '=' || chr_path == '_' ||
				chr_path == '/' || chr_path == ' ' ||
				chr_path == '-'
			)) {
			WARN("%s is a bad path. Only standard ascii characters are allowed.", str_path);
		}
		ptr_path++;
	}
	
	//WARN_CHECK(sunny_regex("^([A-Za-z0-9\%&+,.:=_/ -])*$", str_path),
	//	"%s is a bad path. Only standard ascii characters are allowed.", str_path);
	
	// ######### EXCLUDE ".GIT" #########
	WARN_CHECK(strstr(str_path, ".git") == NULL, "%s is a bad path. '.git' not allowed.", str_path);
	//WARN_CHECK(!sunny_regex("\\.git", str_path), "%s is a bad path. '.git' not allowed.", str_path);
	
	// ######### EXCLUDE "--"   #########
	WARN_CHECK(strstr(str_path, "--") == NULL, "%s is a bad path. '--' not allowed.", str_path);
	//WARN_CHECK(!sunny_regex("--", str_path), "%s is a bad path. '--' not allowed.", str_path);
	
	// ######### EXCLUDE "//"   #########
	WARN_CHECK(strstr(str_path, "//") == NULL, "%s is a bad path. '--' not allowed.", str_path);
	//WARN_CHECK(!sunny_regex("//", str_path), "%s is a bad path. '//' not allowed.", str_path);
	
	return true;
error:
	return false;
}
