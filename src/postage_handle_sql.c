#include "postage_handle_sql.h"

char *link_sql(int csock, PGconn *cnxn, char *str_request) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_form_data, str_temp, str_temp_json);
	sun_res *sun_working = NULL;
	DArray *darr_list = NULL;
	
	NOTICE("REQUEST TYPE: SQL");
	
    str_form_data = query(str_request);
	FINISH_CHECK(str_form_data != NULL, "str_query failed");
	// execute cmd, get result
	FINISH_EXECUTE(sun_working, cnxn, "SELECT CASE WHEN rolsuper THEN 'TRUE' ELSE 'FALSE' END AS result \
		FROM pg_catalog.pg_roles WHERE rolname = SESSION_USER;");
	
	FINISH_CHECK(strncmp(sun_working->str_result, "TRUE", 5) == 0,
		"Must be a superuser to run arbituary sql.");
	SFREE_SUN_RES(sun_working);
	
    // BEGIN
	FINISH_EXECUTE(sun_working, cnxn, "BEGIN;");
	SFREE_SUN_RES(sun_working);
	
    // split off SQL
	
	FINISH_CHECK(str_form_data != NULL, "No query provided");
	FINISH_CHECK(strlen(str_form_data) > 0, "No query provided");
    darr_list = DArray_sql_split(str_form_data);
	FINISH_CHECK(darr_list != NULL, "DArray_sql_split failed");
	//TODO: check for empty query
    
    if (sun_notice != NULL) {
		SFREE(sun_notice);
		sun_notice = NULL;
    }
	
    // INITIAL RESPONSE
    write(csock, "HTTP/1.1 200 OK\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n{\"stat\": true, \"dat\": [", 89);
        
    // LOOP THROUGH SQL STATEMENTS
	int i, len;
    for (i = 0, len = DArray_count(darr_list);i < len; i++) {
		//DEBUG("SQL REQUEST While statement: arr_sql[%i]: %s",i, arr_sql[i]);
		
		//how notices work: the notice processer function fills global variable "sun_notice" with the jsonified notices, 
		//  When that variable is used, Free it, Then set it to NULL so that it can be re-used
  
		// EXECUTE SQL
		sun_working = sun_execute(cnxn, DArray_get(darr_list, i));
		
		////****tuples = true
		if (PQresultStatus(sun_working->res) == PGRES_TUPLES_OK) {
			INFO("PGRES_TUPLES_OK");
			if (i != 0) {
				write(csock, ", ", 2);
			}
			write(csock, "{\"type\": \"result\", ", 19);
			write(csock, "\"notice\": [", 11);
			if (sun_notice != NULL) {
				write(csock, sun_notice, strlen(sun_notice));
			}
			write(csock, "], ", 3);
			write(csock, "\"content\": ", 11);
			write(csock, "[[", 2);
			int z;
			int maxz = PQnfields(sun_working->res);//number of columns
			
			//add column names to json
			for (z = 0;z < maxz;z++) {
				str_temp_json = jsonify(PQfname(sun_working->res, z));
				if (z != 0) {
					write(csock, ",", 1);
				}
				write(csock, str_temp_json, strlen(str_temp_json));
				SFREE(str_temp_json);
			}
			write(csock, "], [", 4);
			
			//add column types to json
			for (z = 0;z < maxz;z++) {
				str_temp = sun_type(cnxn, PQftype(sun_working->res, z), PQfmod(sun_working->res, z));
				str_temp_json = jsonify(str_temp);
				SFREE(str_temp);
				if (z != 0) {
					write(csock, ",", 1);
				}
				write(csock, str_temp_json, strlen(str_temp_json));
				SFREE(str_temp_json);
			}
			write(csock, "]", 1);
			
			//add results to json
			int x;
			int y;
			int maxx = PQntuples(sun_working->res);//number of rows
			int maxy = maxz;//number of columns
			for (x = 0;x < maxx;x++) {
				write(csock, ",[", 2);
				for (y = 0;y < maxy;y++) {
					str_temp_json = jsonify(PQgetvalue(sun_working->res, x, y));
					if (y != 0) {
						write(csock, ",", 1);
					}
					write(csock, str_temp_json, strlen(str_temp_json));
					SFREE(str_temp_json);
				}
				write(csock, "]", 1);
			}
			write(csock, "]", 1);
			
			
		////****tuples = false
		} else if (PQresultStatus(sun_working->res) == PGRES_COMMAND_OK) {
			INFO("PGRES_COMMAND_OK");
			if (i != 0) {
				write(csock, ", ", 2);
			}
			write(csock, "{\"type\": \"rows\", \"notice\": [", 28);
			if (sun_notice != NULL) {
				write(csock, sun_notice, strlen(sun_notice));
			}
			write(csock, "], \"content\": ", 14);
			char *str_rows = PQcmdTuples(sun_working->res);
			str_rows = *str_rows == '\0' ? "-1" : str_rows;
			write(csock, str_rows, strlen(str_rows));
        
		//  PGRES_EMPTY_QUERY
		} else if (PQresultStatus(sun_working->res) == PGRES_EMPTY_QUERY) {
			INFO("PGRES_EMPTY_QUERY");
			//if last query is an empty query, end early
			if (i == len - 1) {
				break;
			}
			if (i != 0) {
				write(csock, ", ", 2);
			}
			write(csock, "{\"type\": \"rows\", \"notice\": [", 28);
			if (sun_notice != NULL) {
				write(csock, sun_notice, strlen(sun_notice));
			} else {
				write(csock, "\"Empty query.\"", 14);
			}
			write(csock, "], \"content\": ", 14);    
			char *str_rows = PQcmdTuples(sun_working->res);
			str_rows = *str_rows == '\0' ? "-1" : str_rows;
			write(csock, str_rows, strlen(str_rows));
			
		// ALL OTHER CASES ARE ERRORS. PRINT ERROR INFO AND EXIT TRANSACTION
		} else {
			INFO("ERROR");
			if (i != 0) {
				write(csock, ", ", 2);
			}
			str_response = _response_full_error(sun_working->res, 2, DArray_get(darr_list, i));
			goto finish;
		}
		str_temp_json = jsonify(DArray_get(darr_list, i));
		
		// CONTENT
		//write( csock, ret_value, strlen(ret_value) );
		write(csock, ", ", 2);
		
		// SQL
		write(csock, "\"sql\": ", 7);
		write(csock, str_temp_json, strlen(str_temp_json));
		write(csock, "}", 1);
		
		SFREE(str_temp_json);
		if (sun_notice != NULL) {
			SFREE(sun_notice);
			sun_notice = NULL;
		}
		SFREE_SUN_RES(sun_working);
		
		// go to next sql statement
    }
    
    // COMMIT TRANSACTION
    INFO("COMMIT TRANSACTION");
    sun_working = sun_execute(cnxn, "COMMIT;");
	if (! sun_working->bol_status) {
		write(csock, ", ", 2);
		str_response = _response_full_error(sun_working->res, 2, "COMMIT;");
		goto finish;
	}
	SFREE_SUN_RES(sun_working);
	DArray_clear_destroy(darr_list);
	darr_list = NULL;
    
    // FINALIZE RESPONSE
    DEBUG("FINALIZE RESPONSE");
    write(csock, "]}", 2);
    SFREE(str_form_data);
    FINISH_CAT_CSTR(str_response, "");
finish:
    DEBUG("FINISH");
	if (darr_list) DArray_clear_destroy(darr_list);
	SFREE_SUN_RES(sun_working);
    SFREE_ALL();
	return str_response;
}