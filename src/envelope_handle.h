#ifndef ENVELOPE_HANDLE_H
#define ENVELOPE_HANDLE_H

#include <libpq-fe.h>
#include <sys/wait.h>
#include <unistd.h>
#include <time.h>

#include "util_string.h"
#include "util_sunlogf.h"
#include "envelope_config.h"
#include "util_aes.h"
#include "util_request.h"
#include "util_split.h"
#include "util_salloc.h"

bool handle(int csock);

// for links
#include "envelope_handle_public.h"
#include "envelope_handle_auth.h"
#include "envelope_handle_c.h"
#include "envelope_handle_upload.h"
#include "envelope_handle_role.h"
#include "envelope_handle_file.h"
#include "envelope_handle_cluster.h"
#include "envelope_handle_webroot.h"
#include "postage_handle_sql.h"
#include "postage_handle_c2.h"
#include "postage_handle_auth.h"

#endif /* ENVELOPE_HANDLE_H */
