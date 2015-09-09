#ifndef ENVELOPE_HANDLE_CLUSTER_H
#define ENVELOPE_HANDLE_CLUSTER_H

#include <libpq-fe.h>
#include <sys/wait.h>
#include <unistd.h>
#include <time.h>

#include "envelope_handle_upload.h"
#include "util_sql.h"
#include "util_string.h"
#include "util_sunlogf.h"
#include "envelope_config.h"
#include "util_request.h"

char *link_cluster( PGconn *cnxn, char * uri, char * request, int csock );

#endif /* ENVELOPE_HANDLE_CLUSTER_H */
