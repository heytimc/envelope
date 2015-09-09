#include "util_sunlogf.h"
bool STDERR = false;
char *str_global_log_level = "error";

void sunlogf_root(char *str_file, int int_line_no, char *str_function, int int_error_level, const char *str_format, va_list va_arg) {
	char *str_new_format = NULL;
	
	char str_error[256];
	if (errno != 0 && int_error_level == 1) {
		sprintf(str_error, "CERR: %d (%s) === ", errno, strerror(errno));
	} else {
		str_error[0] = '\0';//empty string
	}
	
	// str_pid format
	char str_pid[256] = "0000000"; //was 4 but that seemed small- justin
	char str_file_full[256];
	sprintf(str_file_full, "%s:%d:%s()", str_file, int_line_no, str_function);
	sprintf(str_pid, "PID: %-7d FILE: %-55s",
		getpid(), str_file_full);
	
	// all strings so no need to free
	char *log_level =
		int_error_level == 1 ? " ERROR      === " :
		int_error_level == 2 ? "    VAR     === " :
		int_error_level == 3 ? "   DEBUG    === " :
		int_error_level == 4 ? "     WARN   === " :
		int_error_level == 5 ? "    NOTICE  === " :
		                       "       INFO === ";
	
	
	str_new_format = cat_cstr(str_pid, log_level, str_error, str_format, STDERR ? "\n" : "");
	if (str_new_format == NULL) {
		goto error;
	}
	
	if (str_global_log_level == NULL) {
		ERROR_CAT_CSTR(str_global_log_level, "info");
	}
	if ((strncmp(str_global_log_level, "info"  , 5) == 0 && int_error_level <= 6) ||
		(strncmp(str_global_log_level, "notice", 7) == 0 && int_error_level <= 5) ||
		(strncmp(str_global_log_level, "warn"  , 5) == 0 && int_error_level <= 4) ||
		int_error_level <= 3) {
		
		if (STDERR) {
			vfprintf(stderr, str_new_format, va_arg);
		} else {
			vsyslog(5, str_new_format, va_arg);
		}
	}
	
	
	SFREE(str_new_format);
	va_end(va_arg);
	
	return;
error:
	SFREE(str_new_format);
	perror("ERROR IN SUNLOGF");
}
