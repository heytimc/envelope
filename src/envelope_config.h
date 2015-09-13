#ifndef UTIL_CONFIG_H
#define UTIL_CONFIG_H

#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <time.h>
#include <sys/types.h>
#include <pwd.h>
#include "util_sunlogf.h"
#include "util_salloc.h"
#include "util_string.h"
#include "util_ini.h"
#include "util_canonical.h"
#include "util_exec.h"
#include "envelope_fossil.h"
#include "envelope_handle_auth.h"
#include "postage_handle_c_fork.h"

// ###############################################
// configuration variables

//filled by envelope_handle
char *str_global_new_encrypted_cookie;
bool bol_global_public;
//generated from globals
char *str_global_fossil_path;
//from conf
char *str_global_install_path;
int int_global_envelope_port;
char *str_global_cluster_path;
char *str_global_conn_host;
char *str_global_conn_sslmode;
char *str_global_conn_dbname;
int int_global_conn_port;
int int_global_current_conn_port;
char *str_global_role_path;
//char *str_global_log_level;//in util_error.h
char *str_global_public_username;
char *str_global_public_password;
char *str_global_postmaster_binary;
char *str_global_pg_ctl_binary;
char *str_global_grep_binary;
char *str_global_zip_binary;
char *str_global_unzip_binary;
char *str_global_rsync_binary;
char *str_global_fossil_binary;
char *str_global_subdomain;
char *str_global_developers;
//bool bol_global_aes_key_reset;//in util_aes.h
char *str_global_email_from;
char *str_global_email_off_hours;
char *str_global_email_work_hours;
char *str_global_sendmail_script;
int int_global_statement_timeout_public;
int int_global_statement_timeout_trusted;
int int_global_statement_timeout_super;
int int_global_cookie_timeout;

//old
/*
char ENVELOPEPORT[6];

//on the default domain, these will be the same
//on superuser domains, the regular port will remain the same, connport will change
char CONNREGULARPORT[6];
char CONNPORT[6];

char CONNDB[64];
char CONNHOST[17];
extern char CONNSSL[10];
char SECURE_FLAG[6];
char PUBLIC_USER[64];
char PUBLIC_PASSWORD[64];

//if true, the key for cookie encryption is always the same

#define BACKLOG     128
#define BUF_LEN     2048

char *str_statement_timeout_public;
char *str_statement_timeout_trusted;
char *str_statement_timeout_super;
char *str_cookie_timeout;
char *str_global_new_encrypted_cookie;

char *str_config_file;
char *str_email_warnings_from;
char *str_email_warnings_to;
char *str_email_work_warnings_to;
char *str_sendmail_script;
char *str_default_domain;
char *str_developers;
char *str_checkout_group;
char *str_user_script;
char *str_bin_zip;
char *str_bin_unzip;
char *str_bin_grep;
char *str_bin_rsync;
char *str_bin_fossil;
char *str_canonical_role;
char *str_canonical_fork;
char *str_canonical_data;
char *str_postgres_binary_path;

bool bol_global_public;
 */

//the current user logged in
char *str_envelope_user;
char *str_current_user;
char *str_current_subdomain;

bool get_full_conf(int argc, char **argv);
bool create_home_folders();
void free_config();
bool username_check(char *str_username);

#endif /* UTIL_CONFIG_H */
