#include "envelope_fossil.h"

bool create_fossil_user(char *str_username) {
	DEFINE_VAR_ALL(str_fork, str_env, str_content, str_full_content, str_search_username);
	DEBUG("create_fossil_user: %s", str_username);
	//fossil env
	ERROR_CAT_CSTR(str_fork, str_global_fossil_path, "production_", str_username, "/");
	ERROR_CAT_CSTR(str_env, "HOME=", str_fork);
	SFREE(str_fork);
	
	ERROR_CAT_CSTR(str_fork, str_global_fossil_path, "fossil_bare");
	ERROR_CAT_CSTR(str_content, str_env, str_global_fossil_binary, "user", "list", "-R", str_fork);
	
	ERROR_CAT_CSTR(str_full_content, "\n", str_content);
	SFREE(str_content);
	
	ERROR_CAT_CSTR(str_search_username, "\n", str_username, " ");
	DEBUG("str_full_content: %s, str_search_username: %s", str_full_content, str_search_username);
	SFREE(str_search_username);
	if (strstr(str_full_content, str_search_username) == 0) {
		sunny_exec(str_env, str_global_fossil_binary, "user", "new", str_username, "", "", "-R", str_fork);
		DEBUG("adding new");
	} else {
		DEBUG("already there");
	}
	SFREE_ALL();
	return true;
error:
	SFREE_ALL();
	return false;
}
