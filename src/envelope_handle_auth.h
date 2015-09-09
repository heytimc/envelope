#ifndef ENVELOPE_HANDLE_AUTH_H
#define ENVELOPE_HANDLE_AUTH_H

#include <libpq-fe.h>
#include <sys/wait.h>
#include <unistd.h>
#include <time.h>

#include "envelope_handle_upload.h"
#include "util_aes.h"
#include "util_request.h"
#include "util_sql.h"
#include "util_string.h"
#include "util_sunlogf.h"
#include "envelope_config.h"
#include "util_cookie.h"
#include "util_salloc.h"

char *link_auth(PGconn *cnxn, char * request);
PGconn *set_cnxn_test(int csock, char *uri, char * request);
PGconn *set_cnxn(int csock, char *uri, char * request);
PGconn *set_cnxn_public(int csock, char * request);

#endif /* ENVELOPE_HANDLE_AUTH_H */
