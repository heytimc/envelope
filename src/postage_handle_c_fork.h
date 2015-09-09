#ifndef POSTAGE_HANDLE_C_FORK_H
#define POSTAGE_HANDLE_C_FORK_H

#include <stdlib.h>
#include <string.h>
#include <libpq-fe.h>
#include <sys/stat.h> // mkdir
#include <sys/types.h>
#include <pwd.h>
#include <dirent.h>

#include "util_sunlogf.h"
#include "util_sql.h"
#include "util_string.h"
#include "util_aes.h"
#include "util_exec.h"
#include "util_file.h"
#include "util_request.h"
#include "util_cookie.h"
#include "util_canonical.h"
#include "util_jsmin.h"
#include "util_json_split.h"
#include "envelope_fossil.h"

char *link_postage_upload(char *str_request, int int_request_len);
char *action_develop(PGconn *cnxn, char *str_form_data, char *str_request);
char *action_file(char *str_form_data, char *str_uri, int csock);
char *action_fossil(char *str_form_data, char *str_request);
bool fossil_user_add(char *str_username, char *str_add_username);
//char *action_fork(PGconn *cnxn, char *str_form_data, int csock, char *str_request);

#endif /* POSTAGE_HANDLE_C_FORK_H */