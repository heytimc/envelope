#include "envelope_config.h"

/*
global variable,config file name,command line letter
str_global_install_path,install_path,a
int_global_envelope_port,envelope_port,p
str_global_cluster_path,cluster_path,v
str_global_conn_host,conn_host,h
str_global_conn_sslmode,conn_sslmode,s
str_global_conn_dbname,conn_dbname,d
int_global_conn_port,conn_port,i
int_global_current_conn_port,conn_port,i
str_global_role_path,role_path,r
int_global_log_level,log_level,l
str_global_public_username,public_user,u
str_global_public_password,public_password,w
str_global_postmaster_binary,postmaster_binary,1
str_global_pg_ctl_binary,pg_ctl_binary,2
str_global_grep_binary,grep_binary,3
str_global_zip_binary,zip_binary,4
str_global_unzip_binary,unzip_binary,5
str_global_rsync_binary,rsync_binary,6
str_global_fossil_binary,fossil_binary,7
str_global_subdomain,subdomain,y
str_global_developers,developers,b
bol_global_aes_key_reset,aes_key_reset,kK
str_global_email_from,email_from,m
str_global_email_off_hours,email_off_hours,e
str_global_email_work_hours,email_work_hours,g
str_global_sendmail_script,sendmail_script,z
int_global_statement_timeout_public,statement_timeout_public,x
int_global_statement_timeout_trusted,statement_timeout_trusted,t
int_global_statement_timeout_super,statement_timeout_super,o
int_global_cookie_timeout,cookie_timeout,j
*/

//ini directive handler (this is called for each directive in the ini file)
static int handler(void *str_user, const char *str_section, const char *str_name, const char *str_value) {
	if (str_user != NULL) {}//get rid of unused variable warning
    #define MATCH(s, n) strcmp(str_section, s) == 0 && strcmp(str_name, n) == 0
    if (MATCH("", "install_path")) {
		SFREE(str_global_install_path);
		ERROR_CAT_CSTR(str_global_install_path, str_value);
    } else if (MATCH("", "envelope_port")) {
		int_global_envelope_port = atoi(str_value);
    } else if (MATCH("", "cluster_path")) {
		SFREE(str_global_cluster_path);
		ERROR_CAT_CSTR(str_global_cluster_path, str_value);
    } else if (MATCH("", "conn_host")) {
		SFREE(str_global_conn_host);
		ERROR_CAT_CSTR(str_global_conn_host, str_value);
    } else if (MATCH("", "conn_sslmode")) {
		SFREE(str_global_conn_sslmode);
		ERROR_CAT_CSTR(str_global_conn_sslmode, str_value);
    } else if (MATCH("", "conn_dbname")) {
		SFREE(str_global_conn_dbname);
		ERROR_CAT_CSTR(str_global_conn_dbname, str_value);
    } else if (MATCH("", "conn_port")) {
		int_global_conn_port = atoi(str_value);
		int_global_current_conn_port = atoi(str_value);
    } else if (MATCH("", "role_path")) {
		SFREE(str_global_role_path);
		ERROR_CAT_CSTR(str_global_role_path, str_value);
    } else if (MATCH("", "log_level")) {
		SFREE(str_global_log_level);
		ERROR_CAT_CSTR(str_global_log_level, str_value);
    } else if (MATCH("", "public_username")) {
		SFREE(str_global_public_username);
		ERROR_CAT_CSTR(str_global_public_username, str_value);
    } else if (MATCH("", "public_password")) {
		SFREE(str_global_public_password);
		ERROR_CAT_CSTR(str_global_public_password, str_value);
    } else if (MATCH("", "postmaster_binary")) {
		SFREE(str_global_postmaster_binary);
		ERROR_CAT_CSTR(str_global_postmaster_binary, str_value);
    } else if (MATCH("", "pg_ctl_binary")) {
		SFREE(str_global_pg_ctl_binary);
		ERROR_CAT_CSTR(str_global_pg_ctl_binary, str_value);
    } else if (MATCH("", "grep_binary")) {
		SFREE(str_global_grep_binary);
		ERROR_CAT_CSTR(str_global_grep_binary, str_value);
    } else if (MATCH("", "zip_binary")) {
		SFREE(str_global_zip_binary);
		ERROR_CAT_CSTR(str_global_zip_binary, str_value);
    } else if (MATCH("", "unzip_binary")) {
		SFREE(str_global_unzip_binary);
		ERROR_CAT_CSTR(str_global_unzip_binary, str_value);
    } else if (MATCH("", "rsync_binary")) {
		SFREE(str_global_rsync_binary);
		ERROR_CAT_CSTR(str_global_rsync_binary, str_value);
    } else if (MATCH("", "fossil_binary")) {
		SFREE(str_global_fossil_binary);
		ERROR_CAT_CSTR(str_global_fossil_binary, str_value);
    } else if (MATCH("", "subdomain")) {
		SFREE(str_global_subdomain);
		ERROR_CAT_CSTR(str_global_subdomain, str_value);
    } else if (MATCH("", "developers")) {
		SFREE(str_global_developers);
		ERROR_CAT_CSTR(str_global_developers, str_value);
    } else if (MATCH("", "aes_key_reset")) {
		bol_global_aes_key_reset = *str_value == 't' || *str_value == 'T';
    } else if (MATCH("", "email_from")) {
		SFREE(str_global_email_from);
		ERROR_CAT_CSTR(str_global_email_from, str_value);
    } else if (MATCH("", "email_off_hours")) {
		SFREE(str_global_email_off_hours);
		ERROR_CAT_CSTR(str_global_email_off_hours, str_value);
    } else if (MATCH("", "email_work_hours")) {
		SFREE(str_global_email_work_hours);
		ERROR_CAT_CSTR(str_global_email_work_hours, str_value);
    } else if (MATCH("", "sendmail_script")) {
		SFREE(str_global_sendmail_script);
		ERROR_CAT_CSTR(str_global_sendmail_script, str_value);
    } else if (MATCH("", "statement_timeout_public")) {
		int_global_statement_timeout_public = atoi(str_value);
    } else if (MATCH("", "statement_timeout_trusted")) {
		int_global_statement_timeout_trusted = atoi(str_value);
    } else if (MATCH("", "statement_timeout_super")) {
		int_global_statement_timeout_super = atoi(str_value);
    } else if (MATCH("", "cookie_timeout")) {
		int_global_cookie_timeout = atoi(str_value);
    } else {
        return 0;  /* unknown section/name, error */
    }
    return 1;
error:
	return 0;
}

// this is where the configuration magic happens
bool get_full_conf(int argc, char **argv) {
	int index;
	int c;
	
	opterr = 0;
	optind = 1;
	
	// get the configuration file from the options
	while ((c = getopt (argc, argv, "c:")) != -1) {
		switch (c) {
			case 'c':
				ERROR_CAT_CSTR(str_global_config_file, optarg);
				break;
			case '?':
				/*
				if (optopt == 'c') {
					fprintf(stderr, "Option -%c requires an argument.\n", optopt);
				} else if (isprint(optopt)) {
					fprintf(stderr, "Unknown option `-%c'.\n", optopt);
				} else {
					fprintf(stderr, "Unknown option character `\\x%x'.\n", optopt);
				}
				*/
				break;
			default:
				abort();
		}
	}
	
	DEBUG(">%d|%s|%s|%s<\n", argc, argv[0], argv[1], argv[2]);
	DEBUG("str_global_config_file = %s\n", str_global_config_file);
	
	for (index = optind; index < argc; index++) {
		DEBUG("Non-option argument %s\n", argv[index]);
	}
	
	//put the defaults in the global variables
	ERROR_CAT_CSTR(str_global_install_path, "/opt/envelope");
	int_global_envelope_port = 8888;
	ERROR_CAT_CSTR(str_global_cluster_path, "/opt/envelope/data");
	ERROR_CAT_CSTR(str_global_conn_host, "127.0.0.1");
	ERROR_CAT_CSTR(str_global_conn_sslmode, "allow");
	ERROR_CAT_CSTR(str_global_conn_dbname, "postgres");
	//on the default domain, these will be the same
	//on superuser domains, int_global_conn_port will remain the same, int_global_current_conn_port will change
	int_global_conn_port = 5432;
	int_global_current_conn_port = 5432;
	ERROR_CAT_CSTR(str_global_role_path, "/opt/envelope/role");
	ERROR_CAT_CSTR(str_global_log_level, "error");
	ERROR_CAT_CSTR(str_global_public_username, "public_user");
	ERROR_CAT_CSTR(str_global_public_password, "public_password");
	ERROR_CAT_CSTR(str_global_postmaster_binary, "/usr/bin/postmaster");
	ERROR_CAT_CSTR(str_global_pg_ctl_binary, "/usr/bin/pg_ctl");
	ERROR_CAT_CSTR(str_global_grep_binary, "/bin/grep");
	ERROR_CAT_CSTR(str_global_zip_binary, "/usr/bin/zip");
	ERROR_CAT_CSTR(str_global_unzip_binary, "/usr/bin/unzip");
	ERROR_CAT_CSTR(str_global_rsync_binary, "/usr/bin/rsync");
	ERROR_CAT_CSTR(str_global_fossil_binary, "/usr/bin/fossil");
	ERROR_CAT_CSTR(str_global_subdomain, "www");
	ERROR_CAT_CSTR(str_global_developers, "postgres:5433");
	bol_global_aes_key_reset = true;
	ERROR_CAT_CSTR(str_global_email_from, "server@example.com");
	ERROR_CAT_CSTR(str_global_email_off_hours, "user@example.com");
	ERROR_CAT_CSTR(str_global_email_work_hours, "user@example.com");
	ERROR_CAT_CSTR(str_global_sendmail_script, "sendmail_script.plx");
	int_global_statement_timeout_public = 2000; //2 seconds in milliseconds
	int_global_statement_timeout_trusted = 0;
	int_global_statement_timeout_super = 0;
	int_global_cookie_timeout = 3600; //1 hour in seconds
	
	
	//this is where we parse the ini file, it will run the handler for each directive
    char *str_config_empty = "";
    if (ini_parse(str_global_config_file, handler, &str_config_empty) < 0) {
        printf("Can't load '%s'\n", str_config_empty);
        //exit;
    }
	
	
	opterr = 0;
	optind = 1;
	
	//after the defaults and the configuration file, we are ready to read the command line options
	//ini files are preferred, but command line option would work.
	//we may remove this in the furture if nobody wants it.
	//09-03-15
	while ((c = getopt (argc, argv, "c:i:p:d:h:kKfFd:u:w:m:e:a:z:y:xXl:g:1:2:3:4:5:6:7:8:9:r:q:v:x:t:o:j")) != -1) {
		switch (c) {
			case 'c':
				break;
			case 'a':
				SFREE(str_global_install_path);
				ERROR_CAT_CSTR(str_global_install_path, optarg);
				break;
			case 'p':
				int_global_envelope_port = atoi(optarg);
				SFREE(optarg);
				break;
			case 'v':
				SFREE(str_global_cluster_path);
				ERROR_CAT_CSTR(str_global_cluster_path, optarg);
				break;
			case 'h':
				SFREE(str_global_conn_host);
				ERROR_CAT_CSTR(str_global_conn_host, optarg);
				break;
			case 's':
				SFREE(str_global_conn_sslmode);
				ERROR_CAT_CSTR(str_global_conn_sslmode, optarg);
				break;
			case 'd':
				SFREE(str_global_conn_dbname);
				ERROR_CAT_CSTR(str_global_conn_dbname, optarg);
				break;
			case 'i':
				int_global_conn_port = atoi(optarg);
				int_global_current_conn_port = atoi(optarg);
				SFREE(optarg);
				break;
			case 'r':
				SFREE(str_global_role_path);
				ERROR_CAT_CSTR(str_global_role_path, optarg);
				break;
			case 'l':
				SFREE(str_global_log_level);
				ERROR_CAT_CSTR(str_global_log_level, optarg);
				break;
			case 'u':
				SFREE(str_global_public_username);
				ERROR_CAT_CSTR(str_global_public_username, optarg);
				break;
			case 'w':
				SFREE(str_global_public_password);
				ERROR_CAT_CSTR(str_global_public_password, optarg);
				break;
			case '1':
				SFREE(str_global_postmaster_binary);
				ERROR_CAT_CSTR(str_global_postmaster_binary, optarg);
				break;
			case '2':
				SFREE(str_global_pg_ctl_binary);
				ERROR_CAT_CSTR(str_global_pg_ctl_binary, optarg);
				break;
			case '3':
				SFREE(str_global_grep_binary);
				ERROR_CAT_CSTR(str_global_grep_binary, optarg);
				break;
			case '4':
				SFREE(str_global_zip_binary);
				ERROR_CAT_CSTR(str_global_zip_binary, optarg);
				break;
			case '5':
				SFREE(str_global_unzip_binary);
				ERROR_CAT_CSTR(str_global_unzip_binary, optarg);
				break;
			case '6':
				SFREE(str_global_rsync_binary);
				ERROR_CAT_CSTR(str_global_rsync_binary, optarg);
				break;
			case '7':
				SFREE(str_global_fossil_binary);
				ERROR_CAT_CSTR(str_global_fossil_binary, optarg);
				break;
			case 'y':
				SFREE(str_global_subdomain);
				ERROR_CAT_CSTR(str_global_subdomain, optarg);
				break;
			case 'b':
				SFREE(str_global_developers);
				ERROR_CAT_CSTR(str_global_developers, optarg);
				break;
			case 'k':
				bol_global_aes_key_reset = false;
				SFREE(optarg);
				break;
			case 'K':
				bol_global_aes_key_reset = true;
				SFREE(optarg);
				break;
			case 'm':
				SFREE(str_global_email_from);
				ERROR_CAT_CSTR(str_global_email_from, optarg);
				break;
			case 'e':
				SFREE(str_global_email_off_hours);
				ERROR_CAT_CSTR(str_global_email_off_hours, optarg);
				break;
			case 'g':
				SFREE(str_global_email_work_hours);
				ERROR_CAT_CSTR(str_global_email_work_hours, optarg);
				break;
			case 'z':
				SFREE(str_global_sendmail_script);
				ERROR_CAT_CSTR(str_global_sendmail_script, optarg);
				break;
			case 'x':
				int_global_statement_timeout_public = atoi(optarg);
				SFREE(optarg);
				break;
			case 't':
				int_global_statement_timeout_trusted = atoi(optarg);
				SFREE(optarg);
				break;
			case 'o':
				int_global_statement_timeout_super = atoi(optarg);
				SFREE(optarg);
				break;
			case 'j':
				int_global_cookie_timeout = atoi(optarg);
				SFREE(optarg);
				break;
			
			case '?':
				if (optopt == 'a' || optopt == 'p' || optopt == 'v' || optopt == 'h' || optopt == 's' || \
					optopt == 'd' || optopt == 'i' || optopt == 'r' || optopt == 'l' || optopt == 'u' || \
					optopt == 'w' || optopt == '1' || optopt == '2' || optopt == '3' || optopt == '4' || \
					optopt == '5' || optopt == '6' || optopt == '7' || optopt == 'y' || optopt == 'b' || \
					optopt == 'm' || optopt == 'e' || optopt == 'a' || optopt == 'z' || optopt == 'x' || \
					optopt == 't' || optopt == 'o' || optopt == 'j') {
					fprintf(stderr, "Option -%c requires an argument.\n", optopt);
				} else if (isprint(optopt)) {
					fprintf(stderr, "Unknown option `-%c'.\n", optopt);
				} else {
					fprintf(stderr, "Unknown option character `\\x%x'.\n", optopt);
				}
				//return 1;
				//exit;
				abort();
			default:
				abort();
		}
	}
	
	//make sure canonical paths have slashes at the end
	if (*(str_global_install_path + strlen(str_global_install_path) - 1) != '/') {
		ERROR_CAT_APPEND(str_global_install_path, "/");
	}
	if (*(str_global_cluster_path + strlen(str_global_cluster_path) - 1) != '/') {
		ERROR_CAT_APPEND(str_global_cluster_path, "/");
	}
	if (*(str_global_role_path + strlen(str_global_role_path) - 1) != '/') {
		ERROR_CAT_APPEND(str_global_role_path, "/");
	}
	
	ERROR_CAT_CSTR(str_global_fossil_path, str_global_install_path, "fossil/");
	
	//just show some basic variables when on the highest log level
	INFO("STARTUP VARIABLES");
	INFO("envelope_port: %d", int_global_envelope_port);
	INFO("aes_key_reset: %s", bol_global_aes_key_reset ? "true" : "false");
	INFO("postgresql connection string: host=%s sslmode=%s port=%d dbname=%s",
		str_global_conn_host, str_global_conn_sslmode,
		int_global_conn_port, str_global_conn_dbname);
	INFO("install_path: %s", str_global_install_path);
	INFO("cluster_path: %s", str_global_cluster_path);
	INFO("role_path: %s", str_global_role_path);
	INFO("public_username: %s", str_global_public_username);
	INFO("public_password: ---------");
	
	INFO("CREATE_HOME_FOLDERS");
	create_home_folders();
	DEBUG("CREATE_HOME_FOLDERS DONE");
	return true;
error:
	return false;
}

bool create_home_folders() {
	DEFINE_VAR_ALL(str_folder, str_read_path_real);
	DEFINE_VAR_MORE(str_fork, str_env, str_fossil_bare, str_return, str_cmd, str_log);
	
	//change working directory
	DEBUG("chdir: %s", str_global_fossil_path);
	int int_stat = chdir(str_global_fossil_path);
	
	//loop through all the superusers
	char *ptr_developers = str_global_developers;
	char *ptr_end_developers = str_global_developers + strlen(str_global_developers);
	char str_user[255];
	char str_port[255];
	int int_length;
	while (ptr_developers < ptr_end_developers) {
		//get user
		//search for next comma, colon, or null byte
		int_length = strcspn(ptr_developers, ",:");
		memcpy(str_user, ptr_developers, int_length);
		str_user[int_length] = '\0';
		ptr_developers = ptr_developers + int_length + 1;
		
		//get port
		//search for next comma, colon, or null byte
		int_length = strcspn(ptr_developers, ",:");
		memcpy(str_port, ptr_developers, int_length);
		str_port[int_length] = '\0';
		ptr_developers = ptr_developers + int_length + 1;
		
		////use user and port
		DEBUG("str_user: %s\nstr_port: %s\nptr_developers: %s<", str_user, str_port, ptr_developers);
		
		//check if folder exists
		ERROR_CAT_CSTR(str_folder, "production_", str_user);
		
		DEBUG("str_global_fossil_path: %s, str_folder: %s", str_global_fossil_path, str_folder);
		
		str_read_path_real = canonical(str_global_fossil_path, str_folder, "read_dir");
		//ERROR_CHECK(str_read_path_real != NULL, "canonical failed");
		//if folder doesn't exist
		DEBUG("str_read_path_real: %s", str_read_path_real);
		if (str_read_path_real == NULL || is_directory_empty(str_global_fossil_path, str_folder)) {
			//create folder if it doesn't exist
			DEBUG("create folder");
			//clone
			
			//fossil env
			struct passwd *p = getpwuid(getuid());  // Check for NULL!
			if (!p) {
				//then null
				continue;
			}
			ERROR_CAT_CSTR(str_fork, str_global_fossil_path, str_folder, "/");
			ERROR_CAT_CSTR(str_env, "HOME=", str_fork);
			SFREE(str_fork);
			
			str_read_path_real = canonical(str_global_fossil_path, str_folder, "create_dir");
			ERROR_CHECK(str_read_path_real != NULL, "canonical failed");
			str_fossil_bare = canonical(str_global_fossil_path, "fossil_bare", "read_file");
			ERROR_CHECK(str_fossil_bare != NULL, "canonical failed");
			DEBUG("create_dir: %s", str_read_path_real);
			//TODO: chmod g+s
			//TODO: chown sunny:str_checkout_group
			DEBUG("chdir: %s", str_read_path_real);
			int_stat = chdir(str_read_path_real);
			
			ERROR_CHECK(fossil_user_add(str_user, str_user), "fossil_user_add failed");
			
			DEBUG("str_fossil_bare: %s", str_fossil_bare);
			str_return = sunny_return(str_env, str_global_fossil_binary, "open", str_fossil_bare, "--user", str_user);
			ERROR_CHECK(str_return != NULL, "sunny_return failed");
			SFREE(str_fossil_bare);
			SFREE(str_env);
			DEBUG("str_return: %s", str_return);
			SFREE(str_return);
			SFREE(str_read_path_real);
			
			
			DEBUG("chdir: %s", str_global_fossil_path);
			ERROR_CHECK(chdir(str_global_fossil_path) == 0, "chdir failed");
			
			//rsync database
			ERROR_CAT_CSTR(str_fork, str_global_fossil_path, str_folder, "_data/");
			NOTICE("%s -am --exclude=postmaster.pid %s %s", str_global_rsync_binary, str_global_cluster_path, str_fork);
			int int_stat = sunny_exec("", str_global_rsync_binary, "-a", "--exclude=postmaster.pid", "--exclude=scripts",
				str_global_cluster_path, str_fork);
			ERROR_CHECK(int_stat == 0, "sunny_exec failed");
			
			//start database
			ERROR_CAT_CSTR(str_cmd, "-p ", str_port, " -i -F -N 10 -c autovacuum=off -B 1MB -c track_activities=off -c track_counts=off");
			NOTICE("%s -p %s start -D %s -o \"%s\"", str_global_pg_ctl_binary, str_global_postmaster_binary, str_fork, str_cmd);
			ERROR_CAT_CSTR(str_log, str_fork, "/pg.log");
			int_stat = sunny_exec("", str_global_pg_ctl_binary, "-p",
				str_global_postmaster_binary, "start", "-D", str_fork, "-l", str_log, "-o", str_cmd);
			ERROR_CHECK(int_stat == 0, "sunny_exec failed");
			//TODO: if fail then action_fossil action=test
			//if (int_stat != 0) {
			//	action_fossil(cnxn, "action=test", "GET / HTTP/1.1")//needs cookie
			//}
			SFREE(str_log);
			SFREE(str_fork);
			SFREE(str_cmd);
		} else {
			//if folder does exist, start and stop
			//stop database
			ERROR_CAT_CSTR(str_fork, str_global_fossil_path, str_folder, "_data/");
			NOTICE("%s stop -D %s -m immediate", str_global_pg_ctl_binary, str_fork);
			int_stat = sunny_exec("", str_global_pg_ctl_binary, "stop", "-D", str_fork, "-m", "immediate");
			//ERROR_CHECK(int_stat == 0, "sunny_exec failed");
			//rsync database
			if (int_stat != 0) {
				NOTICE("%s -am --exclude=postmaster.pid %s %s", str_global_rsync_binary, str_global_cluster_path, str_fork);
				int_stat = sunny_exec("", str_global_rsync_binary, "-a", "--exclude=postmaster.pid", "--exclude=scripts",
					str_global_cluster_path, str_fork);
				ERROR_CHECK(int_stat == 0, "sunny_exec failed");
			}
			//start database
			ERROR_CAT_CSTR(str_cmd, "-p ", str_port, " -i -F -N 10 -c autovacuum=off -B 1MB -c track_activities=off -c track_counts=off");
			NOTICE("%s -p %s start -D %s -o \"%s\"", str_global_pg_ctl_binary, str_global_postmaster_binary, str_fork, str_cmd);
			ERROR_CAT_CSTR(str_log, str_fork, "pg.log");
			DEBUG("str_log: %s", str_log);
			int_stat = sunny_exec("", str_global_pg_ctl_binary, "-p", str_global_postmaster_binary
								  , "start", "-D", str_fork, "-l", str_log, "-o", str_cmd);
			ERROR_CHECK(int_stat == 0, "sunny_exec failed");
			SFREE(str_log);
			SFREE(str_fork);
			SFREE(str_cmd);
		}
		SFREE(str_folder);
	}
	DEBUG("end create home folders");
	return true;
error:
	SFREE_ALL();
	return false;
}

// free config variables
void free_config() {
	SFREE(str_global_config_file);
	SFREE(str_global_install_path);
	SFREE(str_global_cluster_path);
	SFREE(str_global_conn_host);
	SFREE(str_global_conn_sslmode);
	SFREE(str_global_conn_dbname);
	SFREE(str_global_role_path);
	SFREE(str_global_log_level);
	SFREE(str_global_public_username);
	SFREE(str_global_public_password);
	SFREE(str_global_postmaster_binary);
	SFREE(str_global_pg_ctl_binary);
	SFREE(str_global_grep_binary);
	SFREE(str_global_zip_binary);
	SFREE(str_global_unzip_binary);
	SFREE(str_global_rsync_binary);
	SFREE(str_global_fossil_binary);
	SFREE(str_global_subdomain);
	SFREE(str_global_developers);
	SFREE(str_global_email_from);
	SFREE(str_global_email_off_hours);
	SFREE(str_global_email_work_hours);
	SFREE(str_global_sendmail_script);
}

//make sure username is lowercase only
bool username_check(char *str_username) {
	//if there is a developer then return true
	if (strlen(getport(str_global_developers, str_username)) > 0) {
		return true;
	}
	return false;
}
