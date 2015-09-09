#ifndef POSTGRES_HANDLE_C_COPY_H
#define POSTGRES_HANDLE_C_COPY_H

#include <string.h>
#include <libpq-fe.h>

#include "util_sunlogf.h"
#include "util_sql.h"
#include "util_string.h"
#include "util_salloc.h"

char *action_copy(PGconn *cnxn, char *str_form_data);

#endif /* POSTGRES_HANDLE_C_COPY_H */
