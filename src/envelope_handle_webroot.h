#ifndef ENVELOPE_HANDLE_WEBROOT_H
#define ENVELOPE_HANDLE_WEBROOT_H

#include <libpq-fe.h>
#include <sys/wait.h>
#include <unistd.h>
#include <time.h>

#include "util_string.h"
#include "util_sunlogf.h"
#include "envelope_config.h"

char *link_web_root(int csock, char *str_uri, char *str_subdomain);

#endif /* ENVELOPE_HANDLE_WEBROOT_H */
