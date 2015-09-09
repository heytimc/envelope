#ifndef UTIL_SYSLOG_H
#define UTIL_SYSLOG_H

#include <unistd.h>
#include <syslog.h>
#include <string.h>
#include <stdarg.h>
#include <stdlib.h>
#include <stdbool.h>

#include "util_string.h"

//for configuration
bool STDERR;
char *str_global_log_level;

void sunlogf_root(char *str_file, int int_line_no, char *str_function, int int_error_level, const char *str_format, va_list va_arg);


#endif /* UTIL_SYSLOG_H */
