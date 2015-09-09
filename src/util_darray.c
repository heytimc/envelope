#include "util_darray.h"

DArray *DArray_create(size_t element_size, size_t initial_max) {
	DArray *array;
    ERROR_SALLOC(array, sizeof(DArray));
    array->max = initial_max;
    ERROR_CHECK(array->max > 0, "You must set an initial_max > 0.");

    ERROR_SALLOC(array->contents, initial_max * sizeof(void *));

    array->end = 0;
    array->element_size = element_size;
    array->expand_rate = DEFAULT_EXPAND_RATE;

    return array;
error:
	return NULL;
}

void DArray_clear(DArray *array) {
    int i = 0;
    if(array->element_size > 0) {
        for(i = 0; i < array->end; i++) {
        	DEBUG("clear: %i", i);
            SFREE(array->contents[i]);
        }
    }
}

static inline bool DArray_resize(DArray *array, size_t newsize) {
    array->max = newsize;
    ERROR_CHECK(array->max > 0, "The newsize must be > 0.");
    ERROR_SREALLOC(array->contents, array->max * sizeof(void *));
	return true;
error:
	return false;
}

bool DArray_expand(DArray *array) {
    size_t old_max = array->max;
    ERROR_CHECK(DArray_resize(array, array->max + array->expand_rate), "DArray_resize failed.");

    memset(array->contents + old_max, 0, array->expand_rate * sizeof(void *));
    
	return true;
error:
	return false;
}

bool DArray_contract(DArray *array) {
    int new_size = array->end < (int)array->expand_rate ? (int)array->expand_rate : array->end;

    ERROR_CHECK(DArray_resize(array, new_size + 1), "DArray_resize failed.");
	return true;
error:
	return false;
}


void DArray_destroy(DArray *array) {
    if (array) {
        SFREE(array->contents);
    }
    SFREE(array);
}

void DArray_clear_destroy(DArray *array) {
    DArray_clear(array);
    DArray_destroy(array);
}

void DArray_push(DArray *array, void *el) {
    array->contents[array->end] = el;
    array->end++;
	
    if(DArray_end(array) >= DArray_max(array)) {
        DArray_expand(array);
    }
}

void *DArray_pop(DArray *array) {
    ERROR_CHECK(array->end - 1 >= 0, "Attempt to pop from empty array.");

    void *el = DArray_remove(array, array->end - 1);
    array->end--;

    if(DArray_end(array) > (int)array->expand_rate && DArray_end(array) % array->expand_rate) {
		ERROR_CHECK(DArray_contract(array), "DArray_contract failed.");
    }

    return el;
error:
	return NULL;
}

int darray_strcmp(char **a, char **b) {
    return strncmp(*a, *b, strlen(*a));
}

void DArray_qsort(DArray *array, DArray_compare cmp) {
    qsort(array->contents, DArray_count(array), sizeof(void *), cmp);
}

bool DArray_set(DArray *array, int i, void *el) {
	ERROR_CHECK(i < array->max, "darray attempt to set past max.");
    array->contents[i] = el;
	return true;
error:
	return false;
}

void *DArray_get(DArray *array, int i) {
	ERROR_CHECK(i < array->max, "darray attempt to get past max.");
    return array->contents[i];
error:
	return NULL;
}

void *DArray_remove(DArray *array, int i) {
    void *el = array->contents[i];

    array->contents[i] = NULL;

    return el;
}

void *DArray_new(DArray *array) {
	void *vod_ptr = NULL;
	ERROR_CHECK(array->element_size > 0, "Can't use DArray_new on 0 size darrays.");
    ERROR_SALLOC(vod_ptr, array->element_size);
	return vod_ptr;
error:
	SFREE(vod_ptr);
	return NULL;
}
