#include <arpa/inet.h>
#include <errno.h>
#include <pwd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netinet/ip.h>
#include <netdb.h>
#include <sys/wait.h>
#include <unistd.h>
#include <signal.h>

#include "util_sunlogf.h"
#include "envelope_config.h"
#include "envelope_handle.h"

//      ____          _                        _           _        _                                         
//     ||o o|     ___| |_ ___  _ __  _ __ ___ | |__   ___ | |_ __ _| |__  _   _ ___  ___   ___ ___  _ __ ___
//     ||===|    / __| __/ _ \| '_ \| '__/ _ \| '_ \ / _ \| __/ _` | '_ \| | | / __|/ _ \ / __/ _ \| '_ ` _ \
//   .-.`---'-.  \__ \ || (_) | |_) | | | (_) | |_) | (_) | || (_| | |_) | |_| \__ \  __/| (_| (_) | | | | | |
//   | | o .o |  |___/\__\___/| .__/|_|  \___/|_.__/ \___/ \__\__,_|_.__/ \__,_|___/\___(_)___\___/|_| |_| |_|
//   | | o:.o |               |_|                                                                             
//   | |      |
//   `-".-.-.-'    This code is officially robot abuse free.
//   _| | : |_
//  (oOoOo)_)_)

void   kill_handler(int sig);
void   free_config();
void   wait_for_child(int sig);

int main(int argc, char **argv) {
    ////joseph stuff
    
    get_full_conf(argc, argv);
    
    ////justin stuff
    int sock;
    struct addrinfo hints, *res;
    int reuseaddr = 1; /* True */

    /* Get the address info */
    memset(&hints, 0, sizeof hints);
    hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;
	char str_envelope_port[25];
	sprintf(str_envelope_port, "%d", int_global_envelope_port);
    if (getaddrinfo(NULL, str_envelope_port, &hints, &res) != 0) {
        DEBUG("getaddrinfo");
        return 1;
    }

    /* Create the socket */
    sock = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
    if (sock == -1) {
        DEBUG("socket");
        return 1;
    }

    /* Enable the socket to reuse the address */
    if (setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &reuseaddr, sizeof(int)) == -1) {
        DEBUG("setsockopt");
        return 1;
    }

    /* Bind to the address */
    if (bind(sock, res->ai_addr, res->ai_addrlen) == -1) {
        DEBUG("bind");
        return 1;
    }

    /* Listen */
    if (listen(sock, 128) == -1) {
        DEBUG("listen");
        return 1;
    }

    freeaddrinfo(res);

    /* Set up the zombie signal handler */
    struct sigaction sa1;
    sa1.sa_handler = wait_for_child;
    sigemptyset(&sa1.sa_mask);
    sa1.sa_flags = SA_RESTART | SA_NOCLDSTOP;
    if (sigaction(SIGCHLD, &sa1, NULL) == -1) {
        DEBUG("sigaction Set Listen SIGCHLD error");
        return 1;
    }
    
    /* Set up the kill signal handler */
    struct sigaction sa2;
    sa2.sa_handler = kill_handler;
    sigemptyset(&sa2.sa_mask);
    //sa2.sa_flags = SA_RESTART;
    sa2.sa_flags = 0;//nothing
    if (sigaction(SIGTERM, &sa2, NULL) == -1) {
        DEBUG("sigaction Set Listen SIGTERM error");
        return 1;
    }
	
	init_aes_key_iv();
	
	//get time zone
	time_t time_last;
	time(&time_last);
	
	//convert to localtime
	struct tm *tm_last = localtime(&time_last);
	time_t time_current;
	struct tm *tm_current;
	
    NOTICE("STARTUP SUCCESSFULL\n");
	bol_error_state = false;//stop var logs caused by startup non-error
	errno = 0;//now if there is an error that doesn't set errno, we know that it didn't
	
    /* Main loop */
    while (1) {
        struct sockaddr_in their_addr;
        socklen_t size = sizeof(struct sockaddr_in);
        int newsock = accept(sock, (struct sockaddr*)&their_addr, &size);
        if (newsock == -1) {
          DEBUG("accept:(%s)", strerror(errno));
          //perror("accept");
          free_config();           
          return 0;
        }
        DEBUG("Got a connection from %s on port %d\n", inet_ntoa(their_addr.sin_addr), htons(their_addr.sin_port));
        
        // when we were starting as root and then setting the user name
        //setuid( pwbufp->pw_uid );
		
		//get time zone
		time(&time_current);
		
		//convert to localtime
		tm_current = localtime(&time_current);
		
		//check for reinit
		if (tm_current->tm_yday != tm_last->tm_yday) {
			init_aes_key_iv();
			tm_last = tm_current;
		}
		
        DEBUG("###################################################\n");
        DEBUG("############## NEW ENVELOPE REQUEST ###############\n");
        
        // ############ development ###############
        /*
        handle(newsock);
        close(newsock);
        */
        // ############ production ###############
        
        int pid;
        pid = fork();
        if (pid == 0) {
			// In child process
			close(sock);
			
			/* Set up the default kill signal handler (read: remove custom handler) */
			/*
			struct sigaction sa3;
			sa3.sa_handler = SIG_DFL;
			sigemptyset(&sa3.sa_mask);
			//sa3.sa_flags = SA_RESTART;
			if (sigaction(SIGTERM, &sa3, NULL) == -1) {
				perror("sigaction Set Listen SIGTERM default error");
				return 1;
			}
			*/
			
			global_csock = newsock;
			errno = 0;//now if there is an error that doesn't set errno, we know that it didn't
			handle(newsock);
			if (close(newsock) != 0) {
				ERROR_NORESPONSE("close(newsock): %d (%s)", errno, strerror(errno));
			}
			free_config();
			//exit(EXIT_SUCCESS);
			return 0;
        } else {
            // Parent process
            if (pid == -1) {
				DEBUG("fork:(%s)", strerror(errno));
				//perror("fork");
				free_config();              
				return 1;
            } else {
				close(newsock);
            }
        }
        
        //##########################################
    }
    
    free_config();
    close(sock);    
    return 0;
}

// Signal handler to free everything before terminating 
void kill_handler(int sig) {
	if (sig != 0) {}//get rid of unused variable warning
	free_config();
	exit(0);
}

// Signal handler to reap zombie processes 
void wait_for_child(int sig) {
	//IMPORTANT! MALLOC AND FREE MUST NOT BE USED IN A SIGNAL HANDLER!
	//IMPORTANT! DEBUG() USES MALLOC AND FREE SO DON'T USE IT HERE
	if (sig != 0) {}//get rid of unused variable warning
	while (waitpid(-1, NULL, WNOHANG) > 0);
}

