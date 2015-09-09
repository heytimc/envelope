#ifndef UTIL_SPLIT_H
#define UTIL_SPLIT_H

#include <string.h>

#include "util_sunlogf.h"
#include "util_string.h"
#include "util_salloc.h"
#include "util_darray.h"

DArray *DArray_sql_split(char *str_form_data);

#endif /* UTIL_SPLIT_H */
