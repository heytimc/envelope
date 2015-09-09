#ifndef UTIL_COOKIE_H
#define UTIL_COOKIE_H

#include <string.h>
#include <time.h>

#include "envelope_config.h"
#include "util_sunlogf.h"
#include "util_salloc.h"

char *expire_cookie(char *str_uri, char *str_request);
char *replace_cookie(char *str_response, char *str_request);
char *str_expire_two_day();
char *str_expire_one_day();
char *cookie_timeout(char *str_timeout, char *str_cookie_decrypted, char *str_request, char *str_uri);
bool is_work_hours();

#endif /* UTIL_COOKIE_H */
