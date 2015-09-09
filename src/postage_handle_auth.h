#ifndef POSTAGE_HANDLE_AUTH_H
#define POSTAGE_HANDLE_AUTH_H

#include <libpq-fe.h>
#include <sys/wait.h>
#include <unistd.h>
#include <time.h>

#include "util_sql.h"
#include "util_string.h"
#include "util_sunlogf.h"
#include "envelope_config.h"
#include "util_split.h"
#include "util_request.h"
#include "util_aes.h"
#include "util_cookie.h"

char *link_auth_postage(char *str_request);
PGconn *set_cnxn_postage(int csock, char *str_uri, char *str_request);

#endif /* POSTAGE_HANDLE_AUTH_H */
