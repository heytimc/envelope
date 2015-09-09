#ifndef ENVELOPE_HANDLE_FILE_H
#define ENVELOPE_HANDLE_FILE_H

#include <libpq-fe.h>
#include <sys/wait.h>
#include <unistd.h>
#include <time.h>

#include "envelope_handle_upload.h"
#include "util_sql.h"
#include "util_string.h"
#include "util_sunlogf.h"
#include "envelope_config.h"

char *link_file(int csock, PGconn *cnxn, char * uri);
char *link_apps(int csock, PGconn * cnxn, char * uri, char *str_subdomain);
char *link_dev_file(int csock, PGconn *cnxn, char * uri);

#endif /* ENVELOPE_HANDLE_FILE_H */
