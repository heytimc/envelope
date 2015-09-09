#ifndef UTIL_JSONSPLIT_H
#define UTIL_JSONSPLIT_H

#include <string.h>
#include <stdbool.h>

#include "util_sunlogf.h"
#include "util_string.h"
#include "util_darray.h"

DArray *DArray_json_split(char *str_form_data);

#endif /* UTIL_JSONSPLIT_H */
