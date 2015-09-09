#ifndef ENVELOPE_HANDLE_C_H
#define ENVELOPE_HANDLE_C_H

#include <stdlib.h>
#include <string.h>
#include <libpq-fe.h>

#include "util_sunlogf.h"
#include "util_sql.h"
#include "util_string.h"
#include "util_exec.h"
#include "envelope_handle_upload.h"
#include "util_request.h"
#include "util_aes.h"
#include "util_split.h"

char *link_system(PGconn *cnxn, int csock, char *str_uri_part, char *str_request, int int_request_len, char *str_subdomain);
char *main_action(PGconn *cnxn, int csock, char *str_uri_part, char *str_form_data, char *str_request, int int_request_len, char *str_subdomain);
char *accept_download(PGconn *cnxn, int csock, char *str_request, char *str_uri_part, char *str_subdomain);
char *action_order (PGconn *cnxn, char *str_form_data);
char *action_info  (PGconn *cnxn, char *str_form_data, char *str_request);
char *action_update(PGconn *cnxn, char *str_form_data);
char *action_select(PGconn *cnxn, int csock, char *str_form_data);
char *action_delete(PGconn *cnxn, char *str_form_data);
char *action_insert(PGconn *cnxn, char *str_form_data);
char *accept_csv   (PGconn *cnxn, int csock, char *str_form_data);

#endif /* ENVELOPE_HANDLE_C_H */