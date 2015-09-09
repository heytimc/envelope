#include "util_salloc.h"

void *salloc(size_t size) {
	void *void_return = malloc(size);
// 	void *void_return = NULL; //for debugging only
	if (void_return) {
		bzero(void_return, sizeof *void_return);
		return void_return;
	}
	
	//Darn it. Oh Hey! Maybe memory will be okay in 2 seconds =)
	sleep(2);
	void_return = malloc(size);
	if (void_return) {
		bzero(void_return, sizeof *void_return);
		return void_return;
	}
	
	//Oh come on, it seems we have some serious problems
	ERROR_NORESPONSE("Out of memory.");
	return NULL;
}

void *srealloc(void *void_ptr, size_t size) {
	void *void_return = realloc(void_ptr, size);
// 	void *void_return = NULL; //for debugging only
	if (void_return) {
		return void_return;
	}
	
	//Darn it. Oh Hey! Maybe memory will be okay in 2 seconds =)
	sleep(2);
	void_return = realloc(void_ptr, size);
	if (void_return) {
		return void_return;
	}
	
	//Oh come on, it seems we have some serious problems
	ERROR_NORESPONSE("Out of memory.");
	return NULL;
}

/* overwrites a variable variable until the null byte, then frees it
*
* pword must be a C-string with a NUL terminator
*/
void free_pword(char volatile *pword) {
	memset((char *)pword, 0, strlen((char *)pword));
	//ERROR_NORESPONSE("secure free: >%s<", (char *)pword);
	free((char *)pword);
}
