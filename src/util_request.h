#ifndef UTIL_REQUEST_H
#define UTIL_REQUEST_H

#include <stdio.h>
#include <string.h>

#include "util_sunlogf.h"
#include "util_string.h"
#include "util_salloc.h"

char *query(char *str_request);
char *request_header(char *str_request, char *str_name);
char *str_cookie(char *str_request, char *str_cookie_name);
char *str_uri_path(char *str_request);


typedef struct
{
  char *str_name;
  char *str_file_content;
  int int_file_content_length;
} sun_upload;

sun_upload *get_sun_upload(char *str_request, int int_request_length);
void free_sun_upload(sun_upload *sun_current_upload);
#define SFREE_SUN_UPLOAD(A) if (A != NULL) { free_sun_upload(A); A = NULL; }
#endif /* UTIL_REQUEST_H */
