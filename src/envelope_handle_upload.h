#ifndef ENVELOPE_HANDLE_UPLOAD_H
#define ENVELOPE_HANDLE_UPLOAD_H

#include <stdlib.h>
#include <string.h>
#include <libpq-fe.h>

#include "util_request.h"
#include "util_sunlogf.h"
#include "util_sql.h"
#include "util_string.h"
//global variables
#include "envelope_config.h"
#include "util_json_split.h"
#include "util_exec.h"
#include "util_canonical.h"

#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <time.h>
#include <dirent.h>

#ifdef __linux__
//linux limits
#include <linux/limits.h>
#elif defined __FreeBSD__
//bsd limits
#include <limits.h>
#elif defined __APPLE__
//mac limits
#include <sys/syslimits.h>
#else
    // I would say that it is reasonable to assume that nobody on windows
    // is going to be able to compile our installer, even if they get the source -Nunzio 08/26/2015
    _Static_assert (0, "No platform detected.");
#endif

// ############ PREDEFINES ##############################

char *link_upload(PGconn *cnxn, char *request, int request_len, char *str_subdomain);
char *write_file(PGconn *cnxn, char *str_path, char *str_content, int int_content_length, char *str_subdomain);
char *action_role(PGconn *cnxn, int csock, char *str_form_data, char *str_uri, char *str_subdomain);

#endif /* ENVELOPE_HANDLE_UPLOAD_H */
