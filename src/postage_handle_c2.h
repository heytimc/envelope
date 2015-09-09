#ifndef POSTAGE_HANDLE_C_H
#define POSTAGE_HANDLE_C_H

#include <stdlib.h>
#include <string.h>
#include <libpq-fe.h>

#include "util_sunlogf.h"
#include "util_sql.h"
#include "envelope_handle_c.h"
#include "postage_handle_c_fork.h"
#include "postage_handle_c_copy.h"
#include "postage_handle_c_package.h"
#include "util_string.h"

char *link_system_postage(PGconn *cnxn, int csock, char *str_uri, char *str_request, int int_request_len);
char *main_action_postage(PGconn *cnxn, int csock, char *str_uri_part, char *str_form_data, char *str_request, int int_request_len);

#endif /* POSTAGE_HANDLE_C_H */
