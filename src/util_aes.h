#ifndef UTIL_AES_H
#define UTIL_AES_H

#ifndef _CRT_SECURE_NO_DEPRECATE
#define _CRT_SECURE_NO_DEPRECATE 1
#endif

#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <time.h>

//#include "tropic_aes.h"
#include "util_base64.h"
#include "util_base64.h"
#include "aes.h"

bool bol_global_aes_key_reset;

char *aes_encrypt(char *str_plaintext, int *ptr_int_plaintext_length);
char *aes_decrypt(char *str_ciphertext_base64, int *ptr_int_ciphertext_length);

void init_aes_key_iv();
void set_aes_key_iv();

#endif /* UTIL_AES_H */