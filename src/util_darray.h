#ifndef _DArray_h
#define _DArray_h
#include <stdlib.h>
#include <stdbool.h>
#include <assert.h>

// HARK YE ONLOOKER: DO NOT MOVE THIS BELOW INCLUDES
// That would cause Darray not to be declared for util_string included by util_sunlogf
typedef struct DArray {
    int end;
    int max;
    size_t element_size;
    size_t expand_rate;
    void **contents;
} DArray;

#include "util_salloc.h"
#include "util_error.h"

DArray *DArray_create(size_t element_size, size_t initial_max);
void DArray_destroy(DArray *array);
void DArray_clear(DArray *array);
bool DArray_expand(DArray *array);
bool DArray_contract(DArray *array);
void DArray_push(DArray *array, void *el);
void *DArray_pop(DArray *array);
void DArray_clear_destroy(DArray *array);
bool DArray_set(DArray *array, int i, void *el);
void *DArray_get(DArray *array, int i);
void *DArray_remove(DArray *array, int i);
void *DArray_new(DArray *array);

#define DArray_last(A) ((A)->contents[(A)->end - 1])
#define DArray_first(A) ((A)->contents[0])
#define DArray_end(A) ((A)->end)
#define DArray_count(A) DArray_end(A)
#define DArray_max(A) ((A)->max)

#define DEFAULT_EXPAND_RATE 300

#define DArray_free(E) free((E))

typedef int (*DArray_compare)(const void *a, const void *b);

int darray_strcmp(char **a, char **b);

void DArray_qsort(DArray *array, DArray_compare cmp);

#endif
