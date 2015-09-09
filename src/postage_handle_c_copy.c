#include "postage_handle_c_copy.h"

static char *copy_sql(PGconn *cnxn, char *str_form_data);

char *action_copy(PGconn *cnxn, char *str_form_data) {
	char *str_response = NULL;
	DEFINE_VAR_ALL(str_action, str_result, str_content, str_sql, str_temp, str_json);
	PGresult *res = NULL;
	PGresult *res2 = NULL;
	char **buffer_ptr_ptr = NULL;
	
	str_action = getpar(str_form_data, "action");
	FINISH_CHECK(str_action != NULL, "getpar failed");
	
	DEBUG("COPY >%s|%s<", str_form_data, str_action);
	
	if (strncmp(str_action, "import", 6) == 0) {
		NOTICE("REQUEST TYPE: ACTION COPY IMPORT");
		SFREE(str_action);
		
		str_content = getpar(str_form_data, "content");
		int int_len_content = strlen(str_content);
		
		// start copy
		str_sql = copy_sql(cnxn, str_form_data);
		FINISH_CHECK(str_sql != NULL, "copy_sql failed");
		DEBUG("str_sql: %s", str_sql);
		
		res = PQexec(cnxn, str_sql);
		SFREE(str_sql);
		if (PQresultStatus(res) != PGRES_COPY_IN) {
			str_response = response_full_error(res);
			ERROR_NORESPONSE("PQexec failed");
			goto finish;
		}
		
		DEBUG("str_content: %s", str_content);
		
		// copy record loop
		int int_status = PQputCopyData(cnxn, str_content, int_len_content);
		if (int_status != 1) {
			str_response = response_full_error(res);
			ERROR_NORESPONSE("PQputCopyData failed");
			goto finish;
		}
		int_status = PQputCopyEnd(cnxn, 0);
		if (int_status != 1) {
			str_response = response_full_error(res);
			ERROR_NORESPONSE("PQputCopyEnd failed");
			goto finish;
		}
		SFREE(str_content);
		res2 = PQgetResult(cnxn);
		if (PQresultStatus(res2) != PGRES_COMMAND_OK) {
			str_response = response_full_error(res2);
			ERROR_NORESPONSE("PQgetResult failed");
			goto finish;
		}
		PQclear(res); res = NULL;
		PQclear(res2); res2 = NULL;
		
		//return in text/csv format
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: text/json; charset=UTF-8\r\n\r\n",
			"{\"stat\": true, \"dat\": \"\"}");
	} else if (strncmp(str_action, "export", 6) == 0) {
		NOTICE("REQUEST TYPE: ACTION COPY EXPORT");
		SFREE(str_action);
		
		// start copy
		str_sql = copy_sql(cnxn, str_form_data);
		FINISH_CHECK(str_sql != NULL, "copy_sql failed");
		
		DEBUG("str_sql: %s", str_sql);
		res = PQexec(cnxn, str_sql);
		SFREE(str_sql);
		if (PQresultStatus(res) != PGRES_COPY_OUT) {
			str_response = response_full_error(res);
			ERROR_NORESPONSE("PQexec failed");
			goto finish;
		}
		
		// copy record loop
		FINISH_SALLOC(buffer_ptr_ptr, sizeof(void *));
		int int_status;
		int_status = PQgetCopyData(cnxn, buffer_ptr_ptr, 0);
		FINISH_CAT_CSTR(str_result, "");
		while (int_status >= 0) {
			FINISH_CAT_APPEND(str_result, *buffer_ptr_ptr);
			PQfreemem(*buffer_ptr_ptr);
			int_status = PQgetCopyData(cnxn, buffer_ptr_ptr, 0);
			DEBUG("test3 %s", *buffer_ptr_ptr);
		}
		PQfreemem(*buffer_ptr_ptr);
		SFREE(buffer_ptr_ptr);
		PQclear(res); res = NULL;
		
		//return in text/csv format
		FINISH_CAT_CSTR(str_response, "HTTP/1.1 200 OK\r\n",
			"Content-Type: text/csv; charset=UTF-8\r\n\r\n",
			str_result);
	} else {
		FINISH("Action does not exist: %s", str_action);
	}
	DEBUG("str_response: %s", str_response);
finish:
	SFREE_ALL();
	if (res) PQclear(res);
	if (res2) PQclear(res2);
	return str_response;
}

static char *copy_sql(PGconn *cnxn, char *str_form_data) {
	char *str_result = NULL;
	DEFINE_VAR_ALL(str_schema, str_schema_quote, str_table, str_table_quote, str_action);
	DEFINE_VAR_MORE(str_format, str_oids, str_delimiter, str_delimiter_literal, str_null);
	DEFINE_VAR_MORE(str_null_literal, str_header, str_quote, str_quote_literal, str_escape);
	DEFINE_VAR_MORE(str_escape_literal, str_encoding, str_encoding_literal);
	
	str_schema = getpar(str_form_data, "schema");
	ERROR_CHECK(str_schema != NULL, "getpar failed");
	str_schema_quote = sun_quote_ident(cnxn, str_schema, strlen(str_schema));
	ERROR_CHECK(str_schema_quote != NULL, "sun_quote_ident failed");
	
	str_table = getpar(str_form_data, "table" );
	ERROR_CHECK(str_schema != NULL, "getpar failed");
	str_table_quote = sun_quote_ident(cnxn, str_table, strlen(str_table));
	ERROR_CHECK(str_table_quote != NULL, "sun_quote_ident failed");
	
	SFREE(str_schema);
	SFREE(str_table);
	
	ERROR_CAT_CSTR(str_result, "COPY ", str_schema_quote, ".", str_table_quote, " ");
	SFREE(str_schema_quote);
	SFREE(str_table_quote);
	
	
	str_action = getpar(str_form_data, "action");
	ERROR_CHECK(str_action != NULL, "getpar failed");
	if (strncmp(str_action, "export", 6) == 0) {
		ERROR_CAT_APPEND(str_result, "TO STDOUT ");
	} else {
		ERROR_CAT_APPEND(str_result, "FROM STDIN ");
	}
	SFREE(str_action);
	
	
	str_format = getpar(str_form_data, "format");
	ERROR_CHECK(str_format != NULL, "getpar failed");
	if (strncmp(str_format, "text", 4) == 0) {
		ERROR_CAT_APPEND(str_result, "WITH (FORMAT 'text'");
	} else if (strncmp(str_format, "binary", 6) == 0) {
		ERROR_CAT_APPEND(str_result, "WITH (FORMAT 'binary'");
	} else {
		ERROR_CAT_APPEND(str_result, "WITH (FORMAT 'csv'");
	}
	SFREE(str_format);
	
	
	str_oids = getpar(str_form_data, "oids");
	ERROR_CHECK(str_oids != NULL, "getpar failed");
	if (strncmp(str_oids, "true", 4) == 0) {
		ERROR_CAT_APPEND(str_result, ", OIDS TRUE");
	} else if (strncmp(str_oids, "false", 5) == 0) {
		ERROR_CAT_APPEND(str_result, ", OIDS FALSE");
	}
	SFREE(str_oids);
	
	
	str_delimiter = getpar(str_form_data, "delimiter");
	ERROR_CHECK(str_delimiter != NULL, "getpar failed");
	if (strlen(str_delimiter) > 0) {
		str_delimiter_literal = PQescapeLiteral(cnxn, str_delimiter, strlen(str_delimiter));
		ERROR_CHECK(str_delimiter_literal != NULL, "PQescapeLiteral failed");
		ERROR_CAT_APPEND(str_result, ", DELIMITER ", str_delimiter_literal);
		SFREE(str_delimiter_literal);
	}
	SFREE(str_delimiter);
	
	
	str_null = getpar(str_form_data, "null");
	ERROR_CHECK(str_null != NULL, "getpar failed");
	if (strlen(str_null) > 0) {
		str_null_literal = PQescapeLiteral(cnxn, str_null, strlen(str_null));
		ERROR_CHECK(str_null_literal != NULL, "PQescapeLiteral failed");
		ERROR_CAT_APPEND(str_result, ", NULL ", str_null_literal);
		SFREE(str_null_literal);
	}
	SFREE(str_null);
	
	
	str_header = getpar(str_form_data, "header");
	ERROR_CHECK(str_header != NULL, "getpar failed");
	if (strncmp(str_header, "true", 4) == 0) {
		ERROR_CAT_APPEND(str_result, ", HEADER TRUE");
	} else if (strncmp(str_header, "false", 5) == 0) {
		ERROR_CAT_APPEND(str_result, ", HEADER FALSE");
	}
	SFREE(str_header);
	
	
	str_quote = getpar(str_form_data, "quote");
	ERROR_CHECK(str_quote != NULL, "getpar failed");
	if (strlen(str_quote) > 0) {
		str_quote_literal = PQescapeLiteral(cnxn, str_quote, strlen(str_quote));
		ERROR_CHECK(str_quote_literal != NULL, "PQescapeLiteral failed");
		ERROR_CAT_APPEND(str_result, ", QUOTE ", str_quote_literal);
		SFREE(str_quote_literal);
	}
	SFREE(str_quote);
	
	
	str_escape = getpar(str_form_data, "escape");
	ERROR_CHECK(str_escape != NULL, "getpar failed");
	if (strlen(str_escape) > 0) {
		str_escape_literal = PQescapeLiteral(cnxn, str_escape, strlen(str_escape));
		ERROR_CHECK(str_escape_literal != NULL, "PQescapeLiteral failed");
		ERROR_CAT_APPEND(str_result, ", ESCAPE ", str_escape_literal);
		SFREE(str_escape_literal);
	}
	SFREE(str_escape);
	
	
	str_encoding = getpar(str_form_data, "encoding");
	ERROR_CHECK(str_encoding != NULL, "getpar failed");
	if (strlen(str_encoding) > 0) {
		str_encoding_literal = PQescapeLiteral(cnxn, str_encoding, strlen(str_encoding));
		ERROR_CHECK(str_encoding_literal != NULL, "PQescapeLiteral failed");
		ERROR_CAT_APPEND(str_result, ", ENCODING ", str_encoding_literal);
		SFREE(str_encoding_literal);
	}
	SFREE(str_encoding);
	
	ERROR_CAT_APPEND(str_result, ");");
	
	return str_result;
error:
	SFREE_ALL();
	return NULL;
}
