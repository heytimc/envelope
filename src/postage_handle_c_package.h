#ifndef POSTGRES_HANDLE_C_PACKAGE_H
#define POSTGRES_HANDLE_C_PACKAGE_H

#include <string.h>
#include <libpq-fe.h>

#include "util_sunlogf.h"
#include "util_sql.h"
#include "util_string.h"
#include "util_salloc.h"
#include "envelope_fossil.h"

char *link_package_upload(char *str_request, int int_request_len);
char *action_package(char *str_form_data);

#endif /* POSTGRES_HANDLE_C_PACKAGE_H */
