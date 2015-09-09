#ifndef ENVELOPE_HANDLE_ROLE_H
#define ENVELOPE_HANDLE_ROLE_H

#include <libpq-fe.h>
#include <sys/wait.h>
#include <unistd.h>
#include <time.h>

#include "envelope_handle_upload.h"
#include "util_sql.h"
#include "util_string.h"
#include "util_sunlogf.h"
#include "envelope_config.h"

char *link_role(int csock, PGconn *cnxn, char *str_uri, char *str_subdomain);

#endif /* ENVELOPE_HANDLE_ROLE_H */
