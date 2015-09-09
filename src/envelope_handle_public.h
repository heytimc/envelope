#ifndef ENVELOPE_HANDLE_PUBLIC_H
#define ENVELOPE_HANDLE_PUBLIC_H

#include <libpq-fe.h>
#include <sys/wait.h>
#include <unistd.h>

#include "util_request.h"
#include "util_sql.h"
#include "util_string.h"
#include "util_sunlogf.h"
#include "envelope_config.h"
#include "util_salloc.h"
#include "util_exec.h"
#include "util_cookie.h"
#include "envelope_handle_c.h"
#include "envelope_handle_cluster.h"
/*
char *link_cluster_public(PGconn *cnxn, char *str_request);
char *link_system_public(PGconn *cnxn, char *uri, char *str_request);
*/
char *main_public_action(PGconn *cnxn, int csock, char *str_uri_part, char *str_request, int int_len_request, char *str_subdomain);

#endif /* ENVELOPE_HANDLE_PUBLIC_H */
