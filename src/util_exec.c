#include "util_exec.h"

int global_csock = -1;
int global_csock2 = -1;

// safe system execute function
int s_exec(char *str_user_environment, int args, ...) {
	NOTICE("EXEC.C");
	
    // to use: umask(002); // if you plan on creating a file or copying a file then set the default perms.
    //         int int_test = sunny_exec("", "/usr/local/pgsql/bin/pg_ctl", "-D", "/opt/3comets/data", "stop");
    //         int int_test = sunny_exec("", "/bin/echo", "test1");
    //         printf( "%i: ", int_test ); // 1 = error, -1 = parent
	
	// #### secure execute of programs ###
	pid_t pid;
	int status;
	pid_t ret;
	
	// set errno to "Success" in case caller functions have errors in them
	errno = 0;
  
	// fork causes the existing program to split into two identical processes.
	pid = fork();
	ERROR_CHECK(pid != -1, "Fork error.");
	if (pid != 0) {
        // pid = -1 means wait for all children, 
        while((ret = waitpid(-1, &status, WUNTRACED)) > 0) {
			DEBUG("ret: %d", ret);
			if (errno != EINTR) {
				break;
			}
        }
		/*while ((ret = waitpid(pid, &status, 0)) == -1) {
			DEBUG("ret: %d", ret);
			if (errno != EINTR) {
				break;
			}
		}*/
		// keep this code in case you have problems
		if (ret != -1 && errno != 0 && (!WIFEXITED(status) || !WEXITSTATUS(status)) && errno != 10) {
			ERROR("Child has unexpected status. errno: %d (%s)", errno, strerror(errno));
		}
		
		INFO("EXEC.C END");
		DEBUG("TEST1>%d|%d<", status, WEXITSTATUS(status));
		return WEXITSTATUS(status);
error:
		DEBUG("TEST2");
		return -1;
	} else {
		DEBUG("global_csock: %i", global_csock);
		if (global_csock > -1) {
			DEBUG("close(global_csock): %i", global_csock);
			close(global_csock);
		}
		DEBUG("global_csock2: %i", global_csock2);
		if (global_csock2 > -1) {
			DEBUG("close(global_csock2): %i", global_csock2);
			close(global_csock2);
		}
		// the first item is our program executable
		// assemble a nice array of all our args with a null element at the end
		va_list ap;
		va_list bp;
		int     i;
		int     len = 0;
		// arr_args[0] is the program path
		// arr_args[1] is the program name
		// arr_args[2-args] are the arguments to the program
		int lengths[args+1];
		int prog_len;    // put args[0] len here
		int prog_name_len = 0;
	
		// allocate prog and an array large enough for everything
		va_start(ap, args);
		va_copy(bp, ap);  // powerpc can't do two va_starts. use va_copy instead.
	
		// fill prog
		char *prog = va_arg( ap, char *);
		prog_len = strlen(prog) + 1;
	
		// get program name length from path
		for (i = 0; i < prog_len; i = i + 1) {
			if ( strncmp( "/", prog + i, 1 ) == 0) {
				prog_name_len = prog_len - (i+1);
			}
		}
		ERROR_CHECK(prog_name_len > 0, "First arg must be a complete path, e.g. /bin/touch. You tried '%s'.", prog);
		lengths[0] = prog_name_len;
		
		// get the rest of the lengths
		for (i = 1; i < args; i = i + 1) {
			len = strlen(va_arg (ap, char *)) + 1;
			lengths[i] = len;
		}
		va_end( ap );
		
		// set up arr_args
		char  * arr_args[args+1];
		for (i = 0; i < args; i = i + 1) {
			ERROR_SALLOC(arr_args[i], lengths[i]);
		}
		
		// get prog name from path
		char  *prog_name = (char *)((prog + prog_len) - prog_name_len);
		
		len = strlen(prog_name) + 1;
		memcpy( arr_args[0], prog_name, len-1 );
		arr_args[0][len-1] = '\0';
		
		// we don't need the path again so run va_arg once to pass it.
		va_arg(bp, char *);
		for (i = 1; i < args; i = i + 1) {
			memcpy(arr_args[i], va_arg (bp, char *), lengths[i] - 1);
			arr_args[i][lengths[i]-1] = '\0';
		}
		va_end(bp);
		
		// add a null element to the array
		arr_args[args] = (char*)salloc(1);
		arr_args[args] = 0; // WRONG: arr_args[args][0] = '\0';
		
		char *pathbuf;
		size_t n;
		
		if (clearenv() != 0) {
			ERROR_NORESPONSE("Command clearenv failed. Exiting.");
			exit(1);
		}
		
		n = confstr(_CS_PATH, NULL, 0);
		if (n == 0) {
			ERROR_NORESPONSE("Command confstr not available. Exiting.");
			exit(1);
		}
		
		if ((pathbuf = salloc(n)) == NULL) {
			ERROR_NORESPONSE("Command salloc errored. Exiting.");
			exit(1);
		}
		
		if (confstr(_CS_PATH, pathbuf, n) == 0) {
			ERROR_NORESPONSE("Command confstr errored. Exiting.");
			exit(1);
		}
		
		if (setenv("PATH", pathbuf, 1) == -1) {
			ERROR_NORESPONSE("Command setenv PATH errored. Exiting.");
			exit(1);
		}
		
		SFREE(pathbuf);//void, no test
		
		if (setenv("IFS", " \t\n", 1) == -1) {
			ERROR_NORESPONSE("Command setenv IFS errored. Exiting.");
			exit(1);
		}
		
		// environment is sanitized
		//https://www.securecoding.cert.org/confluence/display/seccode/ENV03-C.+Sanitize+the+environment+when+invoking+external+programs
		
		char *ptr_user_environment = str_user_environment;
		char *ptr_end_user_environment = str_user_environment + strlen(str_user_environment);
		char str_name[255];
		char str_value[255];
		int int_length;
		while (ptr_user_environment < ptr_end_user_environment) {
			DEBUG(">%s<", ptr_user_environment);
			
			//get name
			//search for next comma, colon, or null byte
			int_length = strcspn(ptr_user_environment, "&=");
			memcpy(str_name, ptr_user_environment, int_length);
			str_name[int_length] = '\0';
			ptr_user_environment = ptr_user_environment + int_length + 1;
			
			//get value
			//search for next comma, colon, or null byte
			int_length = strcspn(ptr_user_environment, "&=");
			memcpy(str_value, ptr_user_environment, int_length);
			str_value[int_length] = '\0';
			ptr_user_environment = ptr_user_environment + int_length + 1;
			
			//use name and value
			DEBUG(">%s|%s<", str_name, str_value);
			
			char *temp = uri_to_cstr(str_value, strlen(str_value));
			setenv(str_name, temp, 1);
			SFREE(temp);
		}
		
		DEBUG(">%s|%i<", prog, args);
		for (i = 0; i < args; i += 1) {
			DEBUG(">%i|%s<", i, arr_args[i]);
		}
		int int_status = execv( prog, arr_args );
		
		ptr_user_environment = str_user_environment;
		while (ptr_user_environment < ptr_end_user_environment) {
			DEBUG(">%s<", ptr_user_environment);
			
			//get name
			//search for next comma, colon, or null byte
			int_length = strcspn(ptr_user_environment, "&=");
			memcpy(str_name, ptr_user_environment, int_length);
			str_name[int_length] = '\0';
			ptr_user_environment = ptr_user_environment + int_length + 1;
			
			//get value
			//search for next comma, colon, or null byte
			int_length = strcspn(ptr_user_environment, "&=");
			memcpy(str_value, ptr_user_environment, int_length);
			str_value[int_length] = '\0';
			ptr_user_environment = ptr_user_environment + int_length + 1;
			
			//use name and value
			DEBUG(">%s|%s<", str_name, str_value);
			
			unsetenv(str_name);
		}
		
		//DEBUG("%s %s %s %s %s", prog, arr_args[0], arr_args[1], arr_args[2], arr_args[3]);
		if (int_status == -1) {
			ERROR_NORESPONSE("Error executing '%s' %d (%s)\n", prog, errno, strerror(errno));
			for (i = 0; i < args; i = i + 1) {
				SFREE(arr_args[i]);
			}
			SFREE(arr_args[args]);
			_exit(127);
		}
		ERROR_NORESPONSE("Error in sunny_exec: '%s'\n", prog);
		for (i = 0; i < args; i = i + 1) {
			SFREE(arr_args[i]);
		}
		SFREE(arr_args[args]);
		// This process terminates. The calling (parent) process will now continue.
		//   we only return a value if there was an error. (errno will be set)
		// the following line won't execute unless there is an error.
		_exit(127);
	}
	
	DEBUG("TEST3");
	return -1;
}

char *s_exec_return(char *str_user_environment, int args, ... ) {
	NOTICE("EXEC.C");
	char *str_final_buffer = NULL;
	FILE *pFile = NULL;
	int	pfp[2], pid;		/* the pipe and the process	*/
	int	parent_end, child_end;	/* of pipe 			*/

	parent_end = SUN_READ;
	child_end = SUN_WRITE;

	ERROR_CHECK(pipe(pfp) == 0,
		"pipe failed: %d (%s)"); /* get a pipe		*/
	
	ERROR_CHECK((pid = fork()) != -1,
		"fork failed: %d (%s)", errno, strerror(errno)); /* and a process	*/

	/* --------------- parent code here ------------------- */
	/*   need to close one end and fdopen other end		*/

	if (pid > 0) {	
		ERROR_CHECK(close(pfp[child_end]) == 0, "close failed: %d (%s)", errno, strerror(errno));
		
		//get content
		pFile = fdopen(pfp[parent_end], "r");
		
		//filehandle error
		ERROR_CHECK(pFile, "fdopen error: %d (%s)\n", errno, strerror(errno));
		
		//put content into final_buffer
		ERROR_CAT_CSTR(str_final_buffer, "");
		char buffer[2048 + 1];
		while (fgets(buffer, 2048, pFile) != NULL) {
			buffer[2048] = '\0';
			ERROR_CAT_APPEND(str_final_buffer, buffer);
		}
		ERROR_CHECK(ferror(pFile) == 0, "ferror failed: %d (%s)", errno, strerror(errno));
		ERROR_CHECK(fclose(pFile) != -1, "fclose failed: %d (%s)", errno, strerror(errno));
		
		INFO("EXEC.C END");
		return str_final_buffer;

error:
		if(pFile) fclose(pFile);
		SFREE(str_final_buffer);
		if(pfp[0]) close(pfp[0]);
		if(pfp[1]) close(pfp[1]);
		return NULL;
	}

	/* --------------- child code here --------------------- */
	/*   need to redirect stdin or stdout then exec the cmd	 */
	DEBUG("global_csock: %i", global_csock);
	if (global_csock > -1) {
		DEBUG("close(global_csock): %i", global_csock);
		close(global_csock);
	}
	DEBUG("global_csock2: %i", global_csock2);
	if (global_csock2 > -1) {
		DEBUG("close(global_csock2): %i", global_csock2);
		close(global_csock2);
	}

	if (close(pfp[parent_end]) == -1)	{/* close the other end	*/
		exit(1);
	}
	
	if (dup2(pfp[child_end], child_end) == -1) {
		exit(1);
	}
	
	//copy stderr as well as stdout
	if (dup2(pfp[child_end], 2) == -1) {
		exit(1);
	}
	
	if (close(pfp[child_end]) == -1) {	/* done with this one	*/
		exit(1);
	}
						/* all set to run cmd	*/
	// the first item is our program executable
	// assemble a nice array of all our args with a null element at the end
	va_list ap;
	va_list bp;
	int     i;
	int     len = 0;
	// arr_args[0] is the program path
	// arr_args[1] is the program name
	// arr_args[2-args] are the arguments to the program
	int     lengths[args+1];
	int     prog_len;    // put args[0] len here
	int     prog_name_len = 0;

	// allocate prog and an array large enough for everything
	va_start (ap, args);
	va_copy (bp, ap);  // powerpc can't do two va_starts. use va_copy instead.

	// fill prog
	char *prog = va_arg( ap, char *);
	prog_len = strlen(prog) + 1;

	// get program name length from path
	for (i = 0; i < prog_len; i = i + 1) {
		if ( strncmp( "/", prog + i, 1 ) == 0) {
			prog_name_len = prog_len - (i+1);
		}
	}
	if (prog_name_len == 0) {
		ERROR_NORESPONSE("First arg must be a complete path, e.g. /bin/touch. You tried '%s'.");
		exit(1);
	}
	lengths[0] = prog_name_len;

	// get the rest of the lengths
	for (i = 1; i < args; i = i + 1) {
		len = strlen(va_arg (ap, char *)) + 1;
		lengths[i] = len;
	}
	va_end(ap);

	// set up arr_args
	char  * arr_args[args+1];
	for (i = 0; i < args; i = i + 1) {
		arr_args[i] = (char*)salloc(lengths[i]);
	}

	// get prog name from path
	char *prog_name = (char *)((prog + prog_len) - prog_name_len);

	len = strlen(prog_name) + 1;
	memcpy(arr_args[0], prog_name, len - 1);
	arr_args[0][len-1] = '\0';

	// we don't need the path again so run va_arg once to pass it.
	va_arg(bp, char *);
	for (i = 1; i < args; i = i + 1) {
		memcpy(arr_args[i], va_arg (bp, char *), lengths[i] - 1);
		arr_args[i][lengths[i] - 1] = '\0';
		DEBUG("arr_args[i]: %s, %i", arr_args[i], i);
	}
	va_end(bp);

	// add a null element to the array
	arr_args[args] = (char*)salloc(1);
	arr_args[args] = 0; // WRONG: arr_args[args][0] = '\0';

	char *pathbuf;
	size_t n;
	
	if (clearenv() != 0) {
		ERROR_NORESPONSE("Command clearenv failed. Exiting.");
		exit(1);
	}
	
	n = confstr(_CS_PATH, NULL, 0);
	if (n == 0) {
		ERROR_NORESPONSE("Command confstr not available. Exiting.");
		exit(1);
	}
	
	if ((pathbuf = salloc(n)) == NULL) {
		ERROR_NORESPONSE("Command salloc errored. Exiting.");
		exit(1);
	}
	
	if (confstr(_CS_PATH, pathbuf, n) == 0) {
		ERROR_NORESPONSE("Command confstr errored. Exiting.");
		exit(1);
	}

	if (setenv("PATH", pathbuf, 1) == -1) {
		ERROR_NORESPONSE("Command setenv PATH errored. Exiting.");
		exit(1);
	}

	SFREE(pathbuf);//void, no test

	if (setenv("IFS", " \t\n", 1) == -1) {
		ERROR_NORESPONSE("Command setenv IFS errored. Exiting.");
		exit(1);
	}
	
	// environment is sanitized
	//https://www.securecoding.cert.org/confluence/display/seccode/ENV03-C.+Sanitize+the+environment+when+invoking+external+programs
	
	// user environment variables
	
	char *ptr_user_environment = str_user_environment;
	char *ptr_end_user_environment = str_user_environment + strlen(str_user_environment);
	char str_name[255];
	char str_value[255];
	int int_length;
	while (ptr_user_environment < ptr_end_user_environment) {
		//get name
		//search for next comma, colon, or null byte
		int_length = strcspn(ptr_user_environment, "&=");
		memcpy(str_name, ptr_user_environment, int_length);
		str_name[int_length] = '\0';
		ptr_user_environment = ptr_user_environment + int_length + 1;
		
		//get value
		//search for next comma, colon, or null byte
		int_length = strcspn(ptr_user_environment, "&=");
		memcpy(str_value, ptr_user_environment, int_length);
		str_value[int_length] = '\0';
		ptr_user_environment = ptr_user_environment + int_length + 1;
		
		//use name and value
		if (ptr_user_environment < ptr_end_user_environment) {
			DEBUG(">%s|%s|%s<", str_name, str_value, ptr_user_environment);
		}
		
		char *temp = uri_to_cstr(str_value, strlen(str_value));
		setenv(str_name, temp, 1);
		SFREE(temp);
	}
	
	
	DEBUG("prog: %s", prog);
	int int_status = execv(prog, arr_args);
	
	ptr_user_environment = str_user_environment;
	while (ptr_user_environment < ptr_end_user_environment) {
		//get name
		//search for next comma, colon, or null byte
		int_length = strcspn(ptr_user_environment, "&=");
		memcpy(str_name, ptr_user_environment, int_length);
		str_name[int_length] = '\0';
		ptr_user_environment = ptr_user_environment + int_length + 1;
		
		//get value
		//search for next comma, colon, or null byte
		int_length = strcspn(ptr_user_environment, "&=");
		memcpy(str_value, ptr_user_environment, int_length);
		str_value[int_length] = '\0';
		ptr_user_environment = ptr_user_environment + int_length + 1;
		
		//use name and value
		//UNSAFE! password was put in the clear
		//DEBUG(">%s|%s|%s<", str_name, str_value, ptr_user_environment);
		
		unsetenv(str_name);
	}
	
	if (int_status == -1) {
		ERROR_NORESPONSE("Error executing '%s' %d (%s)\n", prog, errno, strerror(errno));
		for (i = 0; i < args; i = i + 1) {
			SFREE(arr_args[i]);
		}
		SFREE(arr_args[args]);
		_exit(127);
	}
	ERROR_NORESPONSE("Error in sunny_exec: '%s'\n", prog);
	for (i = 0; i < args; i = i + 1) {
		SFREE(arr_args[i]);
	}
	SFREE(arr_args[args]);
	// This process terminates. The calling (parent) process will now continue.
	//   we only return a value if there was an error. (errno will be set)
	// the following line won't execute unless there is an error.
	exit(1);
}

char *s_exec_send_return(char *str_user_environment, char *str_stdin_input, int args, ... ) {
	NOTICE("EXECUTE");
	char *str_final_buffer = NULL;
	FILE *pFile = NULL;
	FILE *pWriteFile = NULL;
	int	pfp1[2], pfp2[2], pid;		/* the pipe and the process	*/
	//FILE	*fdopen();		/* fdopen makes a fd a stream	*/
	int	parent1_end, child1_end,
	    parent2_end, child2_end;	/* of pipe 			*/

	parent1_end = SUN_READ;
	child1_end  = SUN_WRITE;
	parent2_end = SUN_WRITE;
	child2_end  = SUN_READ;

	ERROR_CHECK(pipe(pfp1) == 0, "pipe failed: %d (%s)", errno, strerror(errno));
	ERROR_CHECK(pipe(pfp2) == 0, "pipe failed: %d (%s)", errno, strerror(errno));
	ERROR_CHECK((pid = fork()) != -1,
		"fork failed: %d (%s)", errno, strerror(errno));
	
	/* --------------- parent code here ------------------- */
	/*   need to close one end and fdopen other end		*/
	
	if (pid > 0) {
		ERROR_CHECK(close(pfp1[child1_end]) == 0, "close failed: %d (%s)", errno, strerror(errno));
		ERROR_CHECK(close(pfp2[child2_end]) == 0, "close failed: %d (%s)", errno, strerror(errno));
		
		//send content
		pWriteFile = fdopen(pfp2[parent2_end], "w");
		
		//filehandle error
		ERROR_CHECK(pWriteFile, "fopen pWriteFile failed: %d (%s)\n", errno, strerror(errno));
		
		//write content
		ERROR_CHECK(fwrite(str_stdin_input, 1, strlen(str_stdin_input), pWriteFile) == strlen(str_stdin_input),
			"fwrite pWriteFile failed: %d (%s)\n", errno, strerror(errno));
		ERROR_CHECK(fclose(pWriteFile) == 0,
			"fclose pWriteFile failed: %d (%s)\n", errno, strerror(errno));
		
		//get content
		pFile = fdopen(pfp1[parent1_end], "r");
		
		//filehandle error
		ERROR_CHECK(pFile, "fopen pFile failed. %d (%s)\n", errno, strerror(errno));
		
		//put content into final_buffer
		ERROR_CAT_CSTR(str_final_buffer, "");
		char buffer[2048 + 1];
		while (fgets(buffer, 2048, pFile) != NULL) {
			buffer[2048] = '\0';
			ERROR_CAT_APPEND(str_final_buffer, buffer);
		}
		//int int_len_file = strlen(final_buffer);
		ERROR_CHECK(ferror(pFile) == 0, "ferror failed: %d (%s)", errno, strerror(errno));
		ERROR_CHECK(fclose(pFile) != -1, "fclose pWriteFile failed. %d (%s)\n", errno, strerror(errno));
		
		return str_final_buffer;
error:
		if(pfp1[0]) close(pfp1[0]);
		if(pfp1[1]) close(pfp1[1]);
		if(pfp2[0]) close(pfp2[0]);
		if(pfp2[1]) close(pfp2[1]);
		if (pFile) fclose(pFile);
		if (pWriteFile) fclose(pWriteFile);
		SFREE(str_final_buffer);
		return NULL;
	}

	/* --------------- child code here --------------------- */
	/*   need to redirect stdin or stdout then exec the cmd	 */
	DEBUG("global_csock: %i", global_csock);
	if (global_csock > -1) {
		DEBUG("close(global_csock): %i", global_csock);
		close(global_csock);
	}
	DEBUG("global_csock2: %i", global_csock2);
	if (global_csock2 > -1) {
		DEBUG("close(global_csock2): %i", global_csock2);
		close(global_csock2);
	}
	
	if (close(pfp1[parent1_end]) == -1)	{/* close the parent end	*/
		ERROR_NORESPONSE("CHILD: Could not close(pfp1[parent1_end])");
		exit(1);			/* do NOT return	*/
	}
	
	if (close(pfp2[parent2_end]) == -1)	{/* close the parent end	*/
		ERROR_NORESPONSE("CHILD: Could not close(pfp2[parent2_end])");
		exit(1);			/* do NOT return	*/
	}
	
	if (dup2(pfp1[child1_end], child1_end) == -1) {
		ERROR_NORESPONSE("CHILD: Could not dup2(pfp1[child1_end], child1_end)");
		exit(1);
	}
	
	if (dup2(pfp2[child2_end], child2_end) == -1) {
		ERROR_NORESPONSE("CHILD: Could not dup2(pfp2[child2_end], child2_end)");
		exit(1);
	}
	
	//copy stderr as well as stdout
	if (dup2(pfp1[child1_end], 2) == -1) {
		ERROR_NORESPONSE("CHILD: Could not dup2(pfp1[child1_end], 2)");
		exit(1);
	}
	
	if (close(pfp1[child1_end]) == -1) {	/* done with this one	*/
		ERROR_NORESPONSE("CHILD: Could not close(pfp1[child1_end])");
		exit(1);
	}
	
	if (close(pfp2[child2_end]) == -1) {	/* done with this one	*/
		ERROR_NORESPONSE("CHILD: Could not close(pfp2[child2_end])");
		exit(1);
	}

						/* all set to run cmd	*/
	// the first item is our program executable
	// assemble a nice array of all our args with a null element at the end
	va_list ap;
	va_list bp;
	
	int     i;
	int     len = 0;
	
	// arr_args[0] is the program path
	// arr_args[1] is the program name
	// arr_args[2-args] are the arguments to the program
	int     lengths[args + 1];
	int     prog_len;    // put args[0] len here
	int     prog_name_len = 0;

	// allocate prog and an array large enough for everything
	va_start(ap, args);
	va_copy(bp, ap);  // powerpc can't do two va_starts. use va_copy instead.

	// fill prog
	char *prog = va_arg(ap, char *);
	prog_len = strlen(prog) + 1;

	// get program name length from path
	for (i = 0; i < prog_len; i = i + 1) {
		if ( strncmp( "/", prog + i, 1 ) == 0) {
			prog_name_len = prog_len - (i+1);
		}
	}
	if (prog_name_len == 0) {
		ERROR_NORESPONSE("First arg must be a complete path, e.g. /bin/touch. You tried '%s'.", prog );
		exit(1);
	}
	lengths[0] = prog_name_len;

	// get the rest of the lengths
	for (i = 1; i < args; i = i + 1) {
		len = strlen(va_arg (ap, char *)) + 1;
		lengths[i] = len;
	}
	va_end(ap);

	// set up arr_args
	char  * arr_args[args+1];
	for (i = 0; i < args; i = i + 1) {
		arr_args[i] = (char*)salloc(lengths[i]);
	}

	// get prog name from path
	char *prog_name = (char *)((prog + prog_len) - prog_name_len);

	len = strlen(prog_name) + 1;
	memcpy(arr_args[0], prog_name, len - 1);
	arr_args[0][len-1] = '\0';

	// we don't need the path again so run va_arg once to pass it.
	va_arg(bp, char *);
	for (i = 1; i < args; i = i + 1) {
		memcpy(arr_args[i], va_arg (bp, char *), lengths[i] - 1);
		arr_args[i][lengths[i] - 1] = '\0';
		ERROR_NORESPONSE("arr_args[i]: %s, %i", arr_args[i], i);
	}
	va_end(bp);

	// add a null element to the array
	arr_args[args] = (char*)salloc(1);
	arr_args[args] = 0; // WRONG: arr_args[args][0] = '\0';
	
	char *pathbuf;
	size_t n;
	
	if (clearenv() != 0) {
		ERROR_NORESPONSE("Command clearenv failed. Exiting.");
		exit(1);
	}
	
	n = confstr(_CS_PATH, NULL, 0);
	if (n == 0) {
		ERROR_NORESPONSE("Command confstr not available. Exiting.");
		exit(1);
	}
	
	if ((pathbuf = salloc(n)) == NULL) {
		ERROR_NORESPONSE("Command salloc errored. Exiting.");
		exit(1);
	}
	
	if (confstr(_CS_PATH, pathbuf, n) == 0) {
		ERROR_NORESPONSE("Command confstr errored. Exiting.");
		exit(1);
	}

	if (setenv("PATH", pathbuf, 1) == -1) {
		ERROR_NORESPONSE("Command setenv PATH errored. Exiting.");
		exit(1);
	}

	SFREE(pathbuf);//void, no test

	if (setenv("IFS", " \t\n", 1) == -1) {
		ERROR_NORESPONSE("Command setenv IFS errored. Exiting.");
		exit(1);
	}
	
	// environment is sanitized
	//https://www.securecoding.cert.org/confluence/display/seccode/ENV03-C.+Sanitize+the+environment+when+invoking+external+programs
	
	// user environment variables
	
	char *ptr_user_environment = str_user_environment;
	char *ptr_end_user_environment = str_user_environment + strlen(str_user_environment);
	char str_name[255];
	char str_value[255];
	int int_length;
	while (ptr_user_environment < ptr_end_user_environment) {
		//get name
		//search for next comma, colon, or null byte
		int_length = strcspn(ptr_user_environment, "&=");
		memcpy(str_name, ptr_user_environment, int_length);
		str_name[int_length] = '\0';
		ptr_user_environment = ptr_user_environment + int_length + 1;
		
		//get value
		//search for next comma, colon, or null byte
		int_length = strcspn(ptr_user_environment, "&=");
		memcpy(str_value, ptr_user_environment, int_length);
		str_value[int_length] = '\0';
		ptr_user_environment = ptr_user_environment + int_length + 1;
		
		//use name and value
		if (ptr_user_environment < ptr_end_user_environment) {
			DEBUG(">%s|%s|%s<", str_name, str_value, ptr_user_environment);
		}
		
		char *temp = uri_to_cstr(str_value, strlen(str_value));
		setenv(str_name, temp, 1);
		SFREE(temp);
	}
	
	
	DEBUG("prog: %s", prog);
	int int_status = execv(prog, arr_args);
	
	ptr_user_environment = str_user_environment;
	while (ptr_user_environment < ptr_end_user_environment) {
		//get name
		//search for next comma, colon, or null byte
		int_length = strcspn(ptr_user_environment, "&=");
		memcpy(str_name, ptr_user_environment, int_length);
		str_name[int_length] = '\0';
		ptr_user_environment = ptr_user_environment + int_length + 1;
		
		//get value
		//search for next comma, colon, or null byte
		int_length = strcspn(ptr_user_environment, "&=");
		memcpy(str_value, ptr_user_environment, int_length);
		str_value[int_length] = '\0';
		ptr_user_environment = ptr_user_environment + int_length + 1;
		
		//use name and value
		if (ptr_user_environment < ptr_end_user_environment) {
			DEBUG(">%s|%s|%s<", str_name, str_value, ptr_user_environment);
		}
		
		unsetenv(str_name);
	}
	
	if (int_status == -1) {
		ERROR_NORESPONSE("Error executing '%s' %d (%s)\n", prog_name, errno, strerror(errno));
		_exit(127);
	}
	// This process terminates. The calling (parent) process will now continue.
	//   we only return a value if there was an error. (errno will be set)
	// the following line won't execute unless there is an error.
	ERROR_NORESPONSE("Error in sunny_exec: '%s'\n", prog_name);
	exit(1);
}

int clearenv(void) {
	static char *namebuf = NULL;
	static size_t lastlen = 0;
	
	while (environ != NULL && environ[0] != NULL) {
		size_t len = strcspn(environ[0], "=");
		ERROR_CHECK(len > 0, "corrupted environ[]");
		if (len > lastlen) {
			ERROR_SREALLOC(namebuf, len + 1);
			if (namebuf == NULL) {
				/* Handle error */
			}
			lastlen = len;
		}
		memcpy(namebuf, environ[0], len);
		namebuf[len] = '\0';
		ERROR_CHECK(unsetenv(namebuf) == 0, "unsetenv failed");
	}
	return 0;
error:
	SFREE(namebuf);
	return -1;
}

//take a file list and convert it into json
//int_remove_length is the number of characters to remove from each line
//useful if your list is like:
//  /path/to/file1
//  /path/to/file2
//and you want it like:
//  file1
//  file2
char *file_list_to_json (char *str_content, int int_remove_length) {
	char *str_return = NULL;
	char *str_temp = NULL;
	char *str_temp_json = NULL;
	ERROR_NORESPONSE("int_remove_length: %d", int_remove_length);
	ERROR_CAT_CSTR(str_return, "");
	char *ptr_content = str_content + int_remove_length + 1; // + 1 means remove /
	if (*(ptr_content - 1) == '\n') { //if we are at a newline,
		//then the first line must be the full length to remove, so skip that line
		ptr_content = ptr_content + int_remove_length + 1; // + 1 means remove \n
	}
	int int_length;
	int int_done = 1;
	char *ptr_end_content = str_content + strlen(str_content);
	while (int_done > 0) {
		if (ptr_content <= ptr_end_content && strchr(ptr_content, '\n') != 0) {
			int_length = (strchr(ptr_content, '\n') - ptr_content);
			if (int_length > 0) {
				ERROR_SALLOC(str_temp, int_length + 1);
				memcpy(str_temp, ptr_content, int_length);
				str_temp[int_length] = 0;
				str_temp_json = jsonify(str_temp);
				SFREE(str_temp);
				if (strlen(str_return) > 0) {
					ERROR_CAT_APPEND(str_return, ",", str_temp_json);
				} else {
					ERROR_CAT_APPEND(str_return, str_temp_json);
				}
				ERROR_NORESPONSE(">%s|%s|%s<", str_return, str_temp_json, ptr_content);
				SFREE(str_temp_json);
			}
			ptr_content = strchr(ptr_content, '\n') + int_remove_length + 1 + 1; // + 1 means remove \n // + 1 means remove /
		} else {
			int_done = 0;
		}
	}
	return str_return;
error:
	SFREE(str_temp);
	SFREE(str_temp_json);
	SFREE(str_return);
	return NULL;
}

// Check path environment variable for a program
char *where_is_program(char *str_program_name) {
	DEFINE_VAR_ALL(str_PATH, str_PATH2);
	char *str_return = NULL;
	
	ERROR_CAT_CSTR(str_PATH, getenv("PATH"));
	char *ptr_PATH = str_PATH;
	char *ptr_PATH_end = str_PATH + strlen(str_PATH);
	int int_next_colon;
	
	while (ptr_PATH < ptr_PATH_end) {
		//DEBUG("%s", ptr_PATH);
		int_next_colon = strcspn(ptr_PATH, ":");
		
		ERROR_SALLOC(str_PATH2, int_next_colon + 2);
		memcpy(str_PATH2, ptr_PATH, int_next_colon);
		str_PATH2[int_next_colon] = '/';
		str_PATH2[int_next_colon + 1] = '\0';
		//DEBUG("%s", str_ptr_PATH);
		str_return = canonical(str_PATH2, str_program_name, "read_dir_or_file"); //"read_file");
		SFREE(str_PATH2);
		if (str_return != NULL) {
			SFREE_ALL();
			return str_return;
		}
		
		//DEBUG("%i", int_next_colon);
		ptr_PATH += int_next_colon + 1;
	}
	
	WARN("Could not find program: %s", str_program_name);
	//ERROR("Could not find program: %s", str_program_name);
error:
	SFREE_ALL();
	SFREE(str_return);
	return NULL;
}
