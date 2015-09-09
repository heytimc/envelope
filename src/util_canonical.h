#ifndef UTIL_CANONICAL_H
#define UTIL_CANONICAL_H

#include <stdlib.h>
#include <string.h>

#ifndef INSTALLER
#include <libpq-fe.h>

#include "util_sql.h"
#endif // INSTALLER

#include "util_request.h"
#include "util_sunlogf.h"
#include "util_string.h"
#include "util_json_split.h"

#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <time.h>

#ifdef __linux__
//linux limits
#include <linux/limits.h>
#elif defined __FreeBSD__
//bsd limits
#include <limits.h>
#elif defined __APPLE__
//mac limits
#include <sys/syslimits.h>
#else
    // I would say that it is reasonable to assume that nobody on windows
    // is going to be able to compile our installer, even if they get the source -Nunzio 08/26/2015
    _Static_assert(0, "No platform detected.");
#endif

// ############ PREDEFINES ##############################

char *canonical(const char *str_file_base, const char *str_path, char *str_check_type);

#endif /* UTIL_CANONICAL_H */
