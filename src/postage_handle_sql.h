#ifndef POSTAGE_HANDLE_SQL_H
#define POSTAGE_HANDLE_SQL_H

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

char *link_sql( int csock, PGconn *cnxn, char * request );

#endif /* POSTAGE_HANDLE_SQL_H */
