/* global GS, ml, editor, Range */
'use strict';
var listQuery = {}, titleRefreshQuery = {}, scriptQuery = {};

function getListData(strQuery, loaderTarget, callback) {
    GS.addLoader(loaderTarget, 'Getting list...');
    GS.ajaxJSON('/v1/sql', strQuery, function (data, error) {
        var i, len, arrResults = [], bolError;
        
        GS.removeLoader(loaderTarget);
        
        if (!error) {
            // remove column types, add to results array
            for (i = 0, len = data.dat.length; i < len; i += 1) {
                if (data.dat[i].type === 'error') {
                    bolError = true;
                    break;
                } else {
                    data.dat[i].content.splice(1, 1);
                    arrResults.push(data.dat[i].content);
                }
            }
            
            if (bolError) {
                GS.msgbox('Error', data.dat[i].error, ['Cancel', 'Retry'], function (str_button) {
                    if (str_button === 'Retry') {
                        getListData(strQuery, loaderTarget, callback);
                    }
                });
            } else {
                callback(arrResults);
            }
            
        } else {
            GS.ajaxErrorDialog(data, function() {
                getListData(strQuery, loaderTarget, callback);
            });
        }
    });
}

function getSingleCellData(strQuery, callback) {
    //GS.addLoader('data-script', 'Getting script...');
    GS.ajaxJSON('/v1/sql', strQuery, function (data, error) {
        //GS.removeLoader('data-script');
        
        if (!error) {
            if (typeof callback === 'function') {
                if (data.dat[0].error) {
                    var jsnError = data.dat[0];
                    console.log(jsnError);
                    callback('There was an error:' +
                        (jsnError.error ? '\n\n' + jsnError.error       : '') +
                        (jsnError.hint  ? '\n\n' + jsnError.hint        : ''));
                } else {
                    callback(data.dat[0].content[2][0]);
                }
            }
            
        } else {
            GS.ajaxErrorDialog(data, function() {
                getSingleCellData(strQuery, callback);
            });
        }
    });
}

function getListForTree(target, strQuery, looperCallback) {
    target.style.position = 'relative';
    getListData(strQuery, target, function (arrList) {
        var i, len, col_i, col_len, jsnRow, arrColumns;
        
        arrList = arrList[0];
        target = GS.findParentElement(target, '.object-row');
        arrColumns = arrList.splice(0, 1)[0];
        
        //console.log(arrColumns);
        
        // if we wil be inserting before the targets next sibling reverse the order
        if (target.nextElementSibling) {
            arrList.reverse();
        }
        
        //
        for (i = 0, len = arrList.length; i < len; i += 1) {
            jsnRow = {};
            
            for (col_i = 0, col_len = arrColumns.length; col_i < col_len; col_i += 1) { 
                jsnRow[arrColumns[col_i]] = arrList[i][col_i];
            }
            
            if (looperCallback(jsnRow, i - 2)) {
                GS.insertElementAfter(GS.stringToElement(looperCallback(jsnRow, i - 2)), target);
            }
        }
    });
}

function getListsForDump(strQuery, callback) {
    getListData(strQuery, 'surgery-lists', callback);
}

function getScriptForAce(strQuery) {
    getSingleCellData(strQuery, function (strScript) {
        editor.setValue(strScript);
        editor.session.selection.setRange(new Range(0, 0, 0, 0));
    });
}

function getObjectTypeTitle(strQuery, callback) {
    getSingleCellData(strQuery, function (strResult) {
        callback(strResult);
    });
}

listQuery.schemas = ml(function () {/*
                     SELECT oid, nspname AS name
                       FROM pg_namespace
                      WHERE (NOT nspname LIKE 'pg\_%') AND (NOT nspname LIKE 'information%')
                   ORDER BY nspname;
                */});


listQuery.schemaContents = ml(function () {/*
                SELECT 3 AS sort, '{{INTOID}}' AS oid, 'Schema' as name, 'getSchema' AS action, '' AS refreshaction
                UNION
                SELECT 4 AS sort, '{{INTOID}}' AS oid, 'Aggregates (' || (SELECT count(proname) AS result
                        FROM pg_aggregate ag
                        JOIN pg_proc pr ON pr.oid = ag.aggfnoid
                       WHERE pr.pronamespace = {{INTOID}}) || ')' as name, 'getAggregates' AS action, 'refreshAggregateNumber' as refreshaction
                UNION
                SELECT 5 AS sort, '{{INTOID}}' AS oid, 'Functions (' || (SELECT count(proname) AS result
                       FROM pg_proc pr
                       JOIN pg_type typ ON typ.oid = pr.prorettype
                      WHERE proisagg = FALSE
                        AND typname <> 'trigger'
                        AND pr.pronamespace = {{INTOID}}) || ')' as name, 'getFunctions' AS action, 'refreshFunctionNumber' as refreshaction
                UNION
                SELECT 6 AS sort, '{{INTOID}}' AS oid, 'Operators (' || (SELECT count(oprname) AS result
                       FROM pg_operator
                      WHERE pg_operator.oprnamespace = {{INTOID}}) || ')' as name, 'getOperators' AS action, 'refreshOperatorNumber' as refreshaction
                UNION
                SELECT 7 AS sort, '{{INTOID}}' AS oid, 'Sequences (' || (SELECT count(relname)
                       FROM pg_class
                      WHERE relkind = 'S'
                        AND pg_class.relnamespace = {{INTOID}}) || ')' as name, 'getSequences' AS action, 'refreshSequenceNumber' as refreshaction
                UNION
                SELECT 8 AS sort, '{{INTOID}}' AS oid, 'Tables (' || (SELECT count(relname) AS result
                         FROM pg_class rel
                        WHERE relkind IN ('r','s','t')
                          AND rel.relnamespace = {{INTOID}}) || ')' as name, 'getTables' AS action, 'refreshTableNumber' as refreshaction
                UNION
                SELECT 9 AS sort, '{{INTOID}}' AS oid, 'Trigger Functions (' || (SELECT count(proname) AS result
                       FROM pg_proc
                       JOIN pg_type typ ON typ.oid=prorettype
                      WHERE proisagg = FALSE
                        AND typname = 'trigger'
                        AND pg_proc.pronamespace = {{INTOID}}) || ')' as name, 'getTriggers' AS action, 'refreshTriggerNumber' as refreshaction
                UNION
                SELECT 10 AS sort, '{{INTOID}}' AS oid, 'Views (' || (SELECT count(c.relname) AS result
                       FROM pg_class c
                      WHERE ((c.relhasrules AND (EXISTS (
                              SELECT r.rulename FROM pg_rewrite r
                               WHERE r.ev_class = c.oid))))
                        AND c.relnamespace = {{INTOID}}) || ')' as name, 'getViews' AS action, 'refreshViewNumber' as refreshaction
                ORDER BY sort ASC;
            */});


titleRefreshQuery.aggregateNumber = ml(function () {/*
        SELECT 'Aggregates (' || (SELECT count(proname) AS result
                                    FROM pg_aggregate ag
                                    JOIN pg_proc pr ON pr.oid = ag.aggfnoid
                                   WHERE pr.pronamespace = {{INTOID}}) || ')' as name;
    */});


titleRefreshQuery.functionNumber = ml(function () {/*
        SELECT 'Functions (' || (SELECT count(proname) AS result
                                   FROM pg_proc pr
                                   JOIN pg_type typ ON typ.oid = pr.prorettype
                                  WHERE proisagg = FALSE AND typname <> 'trigger' AND pr.pronamespace = {{INTOID}}) || ')' as name;
    */});

titleRefreshQuery.operatorNumber = ml(function () {/*
        SELECT 'Operators (' || (SELECT count(oprname) AS result
                                   FROM pg_operator
                                  WHERE pg_operator.oprnamespace = {{INTOID}}) || ')' as name;
    */});


titleRefreshQuery.sequenceNumber = ml(function () {/*
        SELECT 'Sequences (' || (SELECT count(relname)
                                   FROM pg_class
                                  WHERE relkind = 'S' AND pg_class.relnamespace = {{INTOID}}) || ')' as name;
    */});


titleRefreshQuery.tableNumber = ml(function () {/*
        SELECT 'Tables (' || (SELECT count(relname) AS result
                                FROM pg_class rel
                               WHERE relkind IN ('r','s','t') AND rel.relnamespace = {{INTOID}}) || ')' as name;
    */});


titleRefreshQuery.triggerNumber = ml(function () {/*
        SELECT 'Trigger Functions (' || (SELECT count(proname) AS result
                                           FROM pg_proc
                                           JOIN pg_type typ ON typ.oid=prorettype
                                          WHERE proisagg = FALSE AND typname = 'trigger' AND pg_proc.pronamespace = {{INTOID}}) || ')' as name;
    */});


titleRefreshQuery.viewNumber = ml(function () {/*
        SELECT 'Views (' || (SELECT count(c.relname) AS result
                               FROM pg_class c
                              WHERE ((c.relhasrules AND (EXISTS (
                                      SELECT r.rulename FROM pg_rewrite r
                                       WHERE r.ev_class = c.oid)))) AND c.relnamespace = {{INTOID}}) || ')' as name;
    */});


listQuery.tables = ml(function () {/*
                  SELECT pg_class.oid, relname AS name, pg_namespace.nspname AS schema_name
                    FROM pg_class
               LEFT JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
                   WHERE relkind IN ('r','s','t') AND pg_class.relnamespace = {{INTOID}}
                ORDER BY relname;
                */});


listQuery.triggers = ml(function () {/*
                      SELECT pr.oid, pr.proname || '()' AS name
                        FROM pg_proc pr
                        JOIN pg_type typ ON typ.oid = prorettype
                       WHERE proisagg = FALSE AND typname = 'trigger' AND pr.pronamespace = {{INTOID}}
                    ORDER BY proname;
                */});


listQuery.views = ml(function () {/*
                          SELECT c.oid, c.relname AS name, pg_namespace.nspname AS schema_name
                            FROM pg_class c
                       LEFT JOIN pg_namespace ON pg_namespace.oid = c.relnamespace
                           WHERE ((c.relhasrules AND
                                   (EXISTS (SELECT r.rulename
                                              FROM pg_rewrite r
                                             WHERE ((r.ev_class = c.oid)
                                               AND (bpchar(r.ev_type) = '1'::bpchar)) ))) OR (c.relkind = 'v'::char))
                             AND c.relnamespace = {{INTOID}}
                        ORDER BY relname;
                        */});


listQuery.sequences = ml(function () {/*
                          SELECT pg_class.oid, pg_class.relname AS name
                            FROM pg_class
                           WHERE relkind = 'S' AND pg_class.relnamespace = {{INTOID}}
                        ORDER BY relname;
                        */});


listQuery.operators = ml(function () {/*
                              SELECT pg_operator.oid,
                                     oprname || ' (' || format_type(oprleft, NULL) || ', ' || format_type(oprright, NULL) || ')' AS name
                                FROM pg_operator
                               WHERE pg_operator.oprnamespace = {{INTOID}}
                            ORDER BY oprname || ' (' || format_type(oprleft, NULL) || ', ' || format_type(oprright, NULL) || ')';
                        */});


listQuery.functions = ml(function () {/*
                              SELECT pr.oid, pr.proname || '(' || COALESCE(pg_get_function_arguments(pr.oid), '') || ')' AS name
                                FROM pg_proc pr
                                JOIN pg_type typ ON typ.oid = pr.prorettype
                               WHERE pr.proisagg = FALSE
                                 AND typname <> 'trigger'
                                 AND pr.pronamespace = {{INTOID}}
                            ORDER BY proname || '(' || COALESCE(pg_get_function_arguments(pr.oid), '') || ')';
                        */});


listQuery.aggregates = ml(function () {/*
                           SELECT pr.oid, proname || '(' || COALESCE(oidvectortypes(proargtypes), '') || ')' AS name
                             FROM pg_aggregate ag
                             JOIN pg_proc pr ON pr.oid = ag.aggfnoid
                            WHERE pr.pronamespace = {{INTOID}}
                         ORDER BY proname || '(' || COALESCE(oidvectortypes(proargtypes), '') || ')';
                        */});


listQuery.groups = ml(function () {/*
                     SELECT pg_roles.oid, rolname AS name, 'preview' AS type
                       FROM pg_roles
                      WHERE rolcanlogin = 'f'
                   ORDER BY rolname ASC;
                */});


listQuery.roles = ml(function () {/*
                     SELECT pg_roles.oid, rolname AS name, 'preview' AS type
                       FROM pg_roles
                      WHERE rolcanlogin = 't'
                   ORDER BY rolname ASC;
                */});


listQuery.casts = ml(function () {/*
                     SELECT ca.oid, format_type(st.oid,NULL) || '->' || format_type(tt.oid,tt.typtypmod) AS name, 'preview' AS type
                       FROM pg_cast ca
                       JOIN pg_type st ON st.oid=castsource
                       JOIN pg_type tt ON tt.oid=casttarget;
                */});


listQuery.languages = ml(function () {/*
                     SELECT pg_language.oid, lanname AS name, 'preview' AS type
                       FROM pg_language
                      WHERE lanname != 'internal'
                        AND lanispl IS TRUE;
                */});


listQuery.extensions = 'SELECT oid, extname AS name FROM pg_catalog.pg_extension;';


listQuery.ANSICatalog = ml(function () {/*
                     SELECT c.oid, c.relname AS name
                       FROM pg_class c
                  LEFT JOIN pg_description d ON d.objoid=c.oid
                  LEFT JOIN pg_namespace ON relnamespace=pg_namespace.oid
                      WHERE pg_namespace.nspname = 'pg_catalog';
                */});


scriptQuery.aggregate = ml(function () {/*
    -- DROP statement
    SELECT (SELECT  '-- DROP AGGREGATE ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(proname) || '(' || COALESCE(oidvectortypes(proargtypes), '') || ')' || E';\n\n'
    FROM pg_proc
    LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    WHERE pg_proc.oid = {{INTOID}} AND proisagg)
    
    || (SELECT  'CREATE AGGREGATE ' || quote_ident(fnnsp.nspname) || '.' || quote_ident(fnpr.proname) || '(' || COALESCE(oidvectortypes(fnpr.proargtypes), '') || ') (' 
    	|| rtrim(
    		CASE WHEN aggtransfn    IS NOT NULL     THEN E'\n  SFUNC='    ||
    	            CASE WHEN sfnsp.nspname != 'pg_catalog' THEN quote_ident(sfnsp.nspname) || '.' ELSE '' END || quote_ident(sfpr.proname)
    	            || ',' ELSE '' END ||
    		CASE WHEN format_type(aggtranstype::oid, null) IS NOT NULL THEN E'\n  STYPE='     || format_type(aggtranstype::oid, null) || ',' ELSE '' END ||
    		CASE WHEN aggfinalfn   != '-'::regproc THEN E'\n  FINALFUNC=' ||
    		        CASE WHEN flnsp.nspname != 'pg_catalog' THEN quote_ident(flnsp.nspname) || '.' ELSE '' END || quote_ident(flpr.proname)
    		        || ',' ELSE '' END ||
    		CASE WHEN agginitval   IS NOT NULL     THEN E'\n  INITCOND='  || quote_literal(agginitval)   || ',' ELSE '' END ||
    		CASE WHEN aggsortop    != 0            THEN E'\n  SORTOP='    ||
    		        CASE WHEN opnsp.nspname != '' THEN quote_ident(opnsp.nspname) || '.' ELSE '' END || quote_ident(pg_operator.oprname) ||
    		        ' (' || format_type(oprleft, NULL) || ', ' || format_type(oprright, NULL) || ')' || ',' ELSE '' END
                        , ',') || E'\n);\n\n'
    FROM pg_aggregate
    LEFT JOIN pg_proc       fnpr      ON fnpr.oid      = pg_aggregate.aggfnoid
    LEFT JOIN pg_namespace  fnnsp     ON fnnsp.oid = fnpr.pronamespace
    LEFT JOIN pg_proc       sfpr      ON sfpr.oid      = pg_aggregate.aggtransfn
    LEFT JOIN pg_namespace  sfnsp     ON sfnsp.oid = sfpr.pronamespace
    LEFT JOIN pg_proc       flpr      ON flpr.oid      = pg_aggregate.aggfinalfn
    LEFT JOIN pg_namespace  flnsp     ON flnsp.oid = flpr.pronamespace
    LEFT JOIN pg_operator        ON pg_operator.oid  = pg_aggregate.aggsortop
    LEFT JOIN pg_namespace opnsp ON opnsp.oid = pg_operator.oprnamespace
    WHERE fnpr.oid = {{INTOID}} AND fnpr.proisagg)
    
    -- OWNER
    || (SELECT E'ALTER AGGREGATE ' || COALESCE(quote_ident(nspname),'') || '.' || COALESCE(quote_ident(proname),'') || '(' || COALESCE(oidvectortypes(proargtypes), '') || ') OWNER TO ' || pg_roles.rolname || ';'
    FROM pg_aggregate
    JOIN pg_proc ON pg_proc.oid = pg_aggregate.aggfnoid
    LEFT JOIN pg_roles ON pg_proc.proowner=pg_roles.oid
    JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
    WHERE pg_proc.oid = {{INTOID}} AND proisagg) 
    
    -- grants:
    || CASE WHEN (SELECT count(*)
    	FROM (SELECT unnest(proacl)::text as acl, quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(oidvectortypes(proargtypes), '') || ')' as name
    		FROM pg_proc 
    		LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    		WHERE pg_proc.oid = {{INTOID}} AND proisagg) em
    	WHERE acl::text like '=%') > 0

        THEN (SELECT array_to_string(array_agg(E'\nGRANT ' || CASE WHEN substring(acl from strpos(acl, '=')+1) like '%X%' THEN 'EXECUTE' ELSE '' END || ' ON FUNCTION ' || name 
        	|| ' TO ' || substring(acl from 0 for strpos(acl, '=')) || CASE WHEN substring(acl from strpos(acl, '=')+1) like '%*%' THEN ' WITH GRANT OPTION;' ELSE ';' END),',')
        	FROM (SELECT acl, name FROM (SELECT unnest(proacl)::text as acl, quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(oidvectortypes(proargtypes), '') || ')' as name
        		FROM pg_proc 
        		LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
        		WHERE pg_proc.oid = {{INTOID}} AND proisagg) em
        	WHERE acl::text not like '=%'
            ORDER BY acl) em) 
        
        ELSE '' END
    
    || CASE WHEN -- public exists?
    	(SELECT count(*)
    	FROM (SELECT unnest(proacl)::text as acl, quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(oidvectortypes(proargtypes), '') || ')' as name
    		FROM pg_proc 
    		LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    		WHERE pg_proc.oid = {{INTOID}} AND proisagg) em
    	WHERE acl::text like '=%') >0 
    
       THEN
    	-- public grant:
    	(SELECT E'\nGRANT ' || CASE WHEN substring(acl from strpos(acl, '=')+1) like '%X%' THEN 'EXECUTE' ELSE '' END || ' ON FUNCTION ' || name 
    		|| ' TO public' || CASE WHEN substring(acl from strpos(acl, '=')+1) like '%*%' THEN ' WITH GRANT OPTION;' ELSE ';' END
    	FROM (SELECT unnest(proacl)::text as acl, quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(oidvectortypes(proargtypes), '') || ')' as name
    		FROM pg_proc 
    		LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    		WHERE pg_proc.oid = {{INTOID}} AND proisagg) em
    	WHERE acl::text like '=%')
    
       ELSE
    	-- public revoke
    	(SELECT E'\nREVOKE ALL ON FUNCTION ' || name || ' FROM public;'
    	FROM (SELECT quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(oidvectortypes(proargtypes), '') || ')' as name
    		FROM pg_proc 
    		LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    		WHERE pg_proc.oid = {{INTOID}} AND proisagg) em)
       END;
    */});

scriptQuery.functionSql = ml(function () {/*
    -- DROP statement
    SELECT (SELECT  '-- DROP FUNCTION ' || quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(pg_get_function_arguments(pg_proc.oid), '') || ')' || E';\n\n'
    FROM pg_proc
    LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    WHERE pg_proc.oid = {{INTOID}} AND proisagg = FALSE)
    
    -- CREATE STATEMENT
    || (SELECT  'CREATE OR REPLACE FUNCTION ' || quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(pg_get_function_arguments(pg_proc.oid), '') 
    	|| E')\n  RETURNS ' || pg_get_function_result(pg_proc.oid) || E' AS\n'
    	|| CASE WHEN prolang = '13' THEN
    		'    ' || quote_literal(probin) || ', ' || quote_literal(prosrc) || E'\n'
    	    ELSE
    		'$BODY$' || prosrc || E'$BODY$\n'
    	    END
    	||'  LANGUAGE ' || lanname 
    	|| CASE WHEN provolatile = 'v' THEN
    		' VOLATILE'
    	    WHEN provolatile = 'i' THEN
    		' IMMUTABLE'
    	    WHEN provolatile = 's' THEN
    		' STABLE'
    	    END
    	|| CASE WHEN prosecdef THEN ' SECURITY DEFINER' ELSE '' END
    	|| CASE WHEN proisstrict THEN E' STRICT\n' ELSE E'\n' END
    	|| E'  COST ' || procost ||
    	CASE WHEN prorows <> 0 THEN E'\n  ROWS ' || prorows ELSE '' END || E';\n\n'
    FROM pg_proc 
    LEFT JOIN pg_language ON pg_language.oid = pg_proc.prolang
    LEFT JOIN pg_namespace ON pg_namespace.oid=pg_proc.pronamespace
    WHERE pg_proc.oid = {{INTOID}} AND proisagg = FALSE)
    
    -- OWNER
    || (SELECT E'ALTER FUNCTION ' || COALESCE(quote_ident(nspname),'') || '.' || COALESCE(quote_ident(proname),'') || '(' || COALESCE(pg_get_function_arguments(pg_proc.oid), '') || ') OWNER TO ' || pg_roles.rolname || ';'
    FROM pg_proc
    LEFT JOIN pg_roles ON pg_proc.proowner=pg_roles.oid
    JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
    WHERE pg_proc.oid = {{INTOID}} AND proisagg = FALSE)
    
    -- grants:
    || CASE WHEN (SELECT count(*)
    	FROM (SELECT unnest(proacl)::text as acl, quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(pg_get_function_arguments(pg_proc.oid), '') || ')' as name
    		FROM pg_proc 
    		LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    		WHERE pg_proc.oid = {{INTOID}} AND proisagg = FALSE) em
    	WHERE acl::text like '=%') > 0

        THEN (SELECT array_to_string(array_agg(E'\nGRANT ' || CASE WHEN substring(acl from strpos(acl, '=')+1) like '%X%' THEN 'EXECUTE' ELSE '' END || ' ON FUNCTION ' || name 
        	|| ' TO ' || substring(acl from 0 for strpos(acl, '=')) || CASE WHEN substring(acl from strpos(acl, '=')+1) like '%*%' THEN ' WITH GRANT OPTION;' ELSE ';' END),'')
        	FROM (SELECT acl, name FROM (SELECT unnest(proacl)::text as acl, quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(pg_get_function_arguments(pg_proc.oid), '') || ')' as name
        		FROM pg_proc 
        		LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
        		WHERE pg_proc.oid = {{INTOID}} AND proisagg = FALSE) em
        	WHERE acl::text not like '=%'
            ORDER BY acl) em) 
        
        ELSE '' END
    
    || CASE WHEN -- public exists?
    	(SELECT count(*)
    	FROM (SELECT unnest(proacl)::text as acl, quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(pg_get_function_arguments(pg_proc.oid), '') || ')' as name
    		FROM pg_proc 
    		LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    		WHERE pg_proc.oid = {{INTOID}} AND proisagg = FALSE) em
    	WHERE acl::text like '=%') > 0 
    
       THEN
    	-- public grant:
    	(SELECT E'\nGRANT ' || CASE WHEN substring(acl from strpos(acl, '=')+1) like '%X%' THEN 'EXECUTE' ELSE '' END || ' ON FUNCTION ' || name 
    		|| ' TO public' || CASE WHEN substring(acl from strpos(acl, '=')+1) like '%*%' THEN ' WITH GRANT OPTION;' ELSE ';' END
    	FROM (SELECT unnest(proacl)::text as acl, quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(pg_get_function_arguments(pg_proc.oid), '') || ')' as name
    		FROM pg_proc 
    		LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    		WHERE pg_proc.oid = {{INTOID}} AND proisagg = FALSE) em
    	WHERE acl::text like '=%')
    
       ELSE
    	-- public revoke
    	(SELECT E'\nREVOKE ALL ON FUNCTION ' || name || ' FROM public;'
    	FROM (SELECT quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(pg_get_function_arguments(pg_proc.oid), '') || ')' as name
    		FROM pg_proc 
    		LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    		WHERE pg_proc.oid = {{INTOID}} AND proisagg = FALSE) em)
       END
    
    -- COMMENT
    || (SELECT CASE WHEN description IS NOT NULL THEN E'\n\nCOMMENT ON FUNCTION ' 
    	|| quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(pg_get_function_arguments(pg_proc.oid), '') || ')' 
    	|| $$ IS '$$ || description || $$;'$$ ELSE '' END 
    	FROM pg_proc 
    	LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    	LEFT JOIN pg_description ON pg_proc.oid=pg_description.objoid
    	WHERE pg_proc.oid = {{INTOID}} AND proisagg = FALSE)
    	
    -- SELECT
    || (SELECT CASE WHEN typname != 'trigger' THEN E'\n\n--SELECT ' 
    	|| quote_ident(nspname) || '.' || quote_ident(proname) || '(' || COALESCE(pg_get_function_arguments(pg_proc.oid), '') || ')' 
    	|| E';\n' ELSE '' END 
    	FROM pg_proc 
    	LEFT JOIN pg_type ON pg_type.oid = pg_proc.prorettype
    	LEFT JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    	LEFT JOIN pg_description ON pg_proc.oid=pg_description.objoid
    	WHERE pg_proc.oid = {{INTOID}} AND proisagg = FALSE);
    */});

scriptQuery.role = ml(function () {/*
        SELECT '-- Role: ' || quote_ident(r.rolname) || E'\n\n-- DROP ROLE ' || quote_ident(r.rolname) || E';\n\n' ||
                'CREATE ROLE ' || quote_ident(r.rolname) || E'\n   ' ||
                CASE WHEN r.rolcanlogin        THEN E'LOGIN PASSWORD \'*******\'\n  ' ELSE 'NOLOGIN' END || 
                CASE WHEN NOT r.rolcreaterole  THEN ' NO' ELSE '' END || 'CREATEROLE ' || 
                CASE WHEN NOT r.rolsuper       THEN ' NO' ELSE '' END || E'SUPERUSER \n   ' || 
                CASE WHEN NOT r.rolinherit     THEN ' NO' ELSE '' END || 'INHERIT ' || 
                CASE WHEN NOT r.rolcreatedb    THEN ' NO' ELSE '' END || 'CREATEDB ' || 
                CASE WHEN NOT r.rolreplication THEN ' NO' ELSE '' END || 'REPLICATION ' || 
                E'\n   CONNECTION LIMIT ' || r.rolconnlimit ||
                E'\n   VALID UNTIL ' || CASE WHEN r.rolvaliduntil is null OR length(r.rolvaliduntil::date::text) < 1 
                    OR r.rolvaliduntil = 'infinity'
                    THEN E'\'infinity\'' ELSE r.rolvaliduntil::date::text END || E';\n' ||
                COALESCE((SELECT array_to_string(array_agg(E'\nALTER ROLE ' || quote_ident(r.rolname) || ' SET ' || em.unnest || ';'), '')
           FROM (SELECT unnest(s.setconfig)) em), '') || E'\n' ||
                COALESCE((SELECT array_to_string(array_agg(E'\nGRANT ' || quote_ident(em.unnest) || ' TO ' || quote_ident(r.rolname) || ';'), '')
           FROM (SELECT unnest(array_agg(g.rolname))) em), '')
           FROM pg_roles r 
      LEFT JOIN pg_auth_members m ON r.oid = m.member 
      LEFT JOIN pg_roles g ON g.oid = m.roleid 
      LEFT JOIN pg_db_role_setting s ON r.oid = s.setrole 
      LEFT JOIN pg_database d ON d.oid = s.setdatabase 
          WHERE r.oid = {{INTOID}}
       GROUP BY r.oid, r.rolname, r.rolcanlogin, r.rolcreaterole, r.rolsuper, r.rolinherit, r.rolcreatedb, 
                r.rolreplication, r.rolconnlimit, r.rolvaliduntil, s.setconfig;
    */});


scriptQuery.language = ml(function () {/*  
        SELECT '-- Language: ' || quote_ident(pg_language.lanname) || E'\n\n-- DROP LANGUAGE ' || quote_ident(pg_language.lanname) || E';\n\n' ||
        	'CREATE ' || CASE WHEN lanpltrusted THEN 'TRUSTED ' ELSE '' END || 'PROCEDURAL LANGUAGE ' ||
        	quote_literal(pg_language.lanname) || 
        	E'\n   HANDLER ' || vp.proname ||
        	E'\n   INLINE ' || ip.proname ||
        	E'\n   VALIDATOR ' || vp.proname || ';' ||
        	E'\n\nALTER LANGUAGE ' || quote_ident(pg_language.lanname) || ' OWNER TO ' || quote_ident(pg_get_userbyid(pg_language.lanowner)) || E';\n\n' ||
        	 
        	COALESCE((SELECT array_to_string(array_agg('GRANT ' || CASE WHEN acl_items[2] ~ 'U' THEN 'USAGE' ELSE '' END || 
        	' ON LANGUAGE ' || quote_ident(pg_language.lanname) || ' TO ' || 
        	CASE WHEN acl_items[1] = '' THEN 'public' ELSE acl_items[1] END ||
        	CASE WHEN acl_items[2] ~ 'U\*' THEN ' WITH GRANT OPTION;' ELSE ';' END
        	),E'\n') 
        	FROM (SELECT regexp_split_to_array(unnest(lanacl)::text, '[=]') AS acl_items) em), '')
        
        FROM pg_language
        JOIN pg_proc hp on hp.oid=lanplcallfoid 
        LEFT OUTER JOIN pg_proc ip on ip.oid=laninline 
        LEFT OUTER JOIN pg_proc vp on vp.oid=lanvalidator 
        LEFT OUTER JOIN pg_description des ON des.objoid=pg_language.oid AND des.objsubid=0 
        WHERE pg_language.oid = {{INTOID}};
    */});


scriptQuery.schemaSql = ml(function () {/*  
        SELECT (SELECT '-- DROP SCHEMA ' || quote_ident(nspname) || E';\n\n' ||
          'CREATE SCHEMA ' || quote_ident(nspname) || E'\n  AUTHORIZATION ' || quote_ident(pg_roles.rolname) || E';\n' ||
          COALESCE(E'\nCOMMENT ON SCHEMA '|| quote_ident(nspname) || ' IS ' || quote_literal(pg_description.description) || E';\n', '') || E'\n' ||
          
        	COALESCE((SELECT array_to_string(array_agg( 'GRANT ' || 
        	(SELECT array_to_string((SELECT array_agg(perms ORDER BY srt)
        	FROM (	SELECT 1 as srt, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'U($|[^*])' THEN 'USAGE' END as perms
        		UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'C($|[^*])' THEN 'CREATE' END ) em
        		WHERE perms is not null),',')) ||
        	' ON SCHEMA ' || quote_ident(nspname) || ' TO ' ||
        	CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[1] = '' THEN 'public' ELSE (regexp_split_to_array(unnest::text,'[=/]'))[1] END || 
        	E';'), E'\n')
        	FROM unnest(nspacl) 
        	WHERE (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ '(U|C)($|[^*])' 
        	),'') ||
            
        	COALESCE((SELECT array_to_string(array_agg( 'GRANT ' || 
        	(SELECT array_to_string((SELECT array_agg(perms ORDER BY srt)
        	FROM (	SELECT 1 as srt, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'U\*' THEN 'USAGE' END as perms
        		UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'C\*' THEN 'CREATE' END ) em
        		WHERE perms is not null),',')) ||
        	' ON SCHEMA ' || quote_ident(nspname) || ' TO ' ||
        	CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[1] = '' THEN 'public' ELSE (regexp_split_to_array(unnest::text,'[=/]'))[1] END || 
        	E' WITH GRANT OPTION;'), E'\n')
        	FROM unnest(nspacl) 
        	WHERE (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ '(U|C)\*' 
        	),'')
        FROM pg_catalog.pg_namespace nsp
        LEFT JOIN pg_roles ON pg_roles.oid = nsp.nspowner
        LEFT JOIN pg_description ON pg_description.objoid = nsp.oid
        WHERE nsp.oid = {{INTOID}})
        
        || COALESCE((SELECT array_to_string(array_agg(
        	(SELECT array_to_string((SELECT array_agg('ALTER DEFAULT PRIVILEGES IN SCHEMA ' || quote_ident(nspname) || E'\n   GRANT ' || ok) FROM 
        	    (SELECT array_to_string((SELECT array_agg(perms ORDER BY srt) 
        		FROM (  SELECT 1 as srt, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'r($|[^*])' THEN 'SELECT' END as perms
        			UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'w($|[^*])' THEN 'UPDATE' END
        			UNION SELECT 3, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'a($|[^*])' THEN 'INSERT' END
        			UNION SELECT 4, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'd($|[^*])' THEN 'DELETE' END
        			UNION SELECT 5, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'D($|[^*])' THEN 'TRUNCATE' END
        			UNION SELECT 6, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'x($|[^*])' THEN 'REFERENCES' END
        			UNION SELECT 7, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 't($|[^*])' THEN 'TRIGGER' END) em
        			WHERE perms is not null),',') ||
        	' ON ' || ' ' || E'\n   TO ' ||
              	CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[1] = '' THEN 'public' 
        		ELSE quote_ident((regexp_split_to_array(unnest::text,'[=/]'))[1]) END || E';\n' as ok
        
        	FROM unnest(defaclacl)
        	WHERE (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ '(r|w|a|d|D|x|t)($|[^*])') as em),'')
        	)
        	),'')
        
        FROM pg_default_acl
        LEFT JOIN pg_namespace ON pg_default_acl.defaclnamespace = pg_namespace.oid
        WHERE defaclnamespace = {{INTOID}}),'')
        
        || COALESCE((SELECT array_to_string(array_agg(
        	(SELECT array_to_string((SELECT array_agg('ALTER DEFAULT PRIVILEGES IN SCHEMA ' || quote_ident(nspname) || E'\n   GRANT ' || ok) FROM 
        	    (SELECT array_to_string((SELECT array_agg(perms ORDER BY srt) 
        		FROM (  SELECT 1 as srt, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'r\*' THEN 'SELECT' END as perms
        			UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'w\*' THEN 'UPDATE' END
        			UNION SELECT 3, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'a\*' THEN 'INSERT' END
        			UNION SELECT 4, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'd\*' THEN 'DELETE' END
        			UNION SELECT 5, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'D\*' THEN 'TRUNCATE' END
        			UNION SELECT 6, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'x\*' THEN 'REFERENCES' END
        			UNION SELECT 7, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 't\*' THEN 'TRIGGER' END) em
        			WHERE perms is not null),',') ||
        	' ON ' || ' ' || E'\n   TO ' ||
              	CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[1] = '' THEN 'public' 
        		ELSE quote_ident((regexp_split_to_array(unnest::text,'[=/]'))[1]) END || E';\n' as ok
        
        	FROM unnest(defaclacl)
        	WHERE (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ '(r|w|a|d|D|x|t)\*') as em),'')
        	)
        	),'')
        
        FROM pg_default_acl
        LEFT JOIN pg_namespace ON pg_default_acl.defaclnamespace = pg_namespace.oid
        WHERE defaclnamespace = {{INTOID}}),'');
    */});


scriptQuery.operator = ml(function () {/*  
        SELECT '-- Operator: ' || nsp.nspname || '.' || op.oprname || 
        	'(' || format_type(op.oprleft, NULL) || ', ' || format_type(op.oprright, NULL) || ');' ||
        	E'\n\n-- DROP OPERATOR ' || nsp.nspname || '.' || op.oprname || 
        	'(' || format_type(op.oprleft, NULL) || ', ' || format_type(op.oprright, NULL) || ');' ||
        	E'\n\nCREATE OPERATOR ' || nsp.nspname || '.' || op.oprname || 
        	E' (\n   PROCEDURE = ' || op.oprcode ||
        	E',\n   LEFTARG = ' || format_type(op.oprleft, null) ||
        	E',\n   RIGHTARG = ' || format_type(op.oprright, null) ||  ');' ||
        	E'\n\nALTER OPERATOR ' || nsp.nspname || '.' || op.oprname || '(' || format_type(op.oprleft, null) || ', ' || format_type(op.oprright, null) || ') OWNER TO ' || rol.rolname || ';',
        
        	nsp.nspname || '.' || op.oprname || ' (' || format_type(op.oprleft, NULL) || ', ' || format_type(op.oprright, NULL) || ')', 
        	op.oprcode, format_type(op.oprleft, null), format_type(op.oprright, null), rol.rolname, nsp.nspname || '.' || op.oprname 
        FROM pg_operator op 
        JOIN pg_namespace nsp ON nsp.oid = op.oprnamespace 
        JOIN pg_roles rol ON rol.oid = op.oprowner 
        WHERE op.oid = {{INTOID}};
    */});


scriptQuery.sequence = ml(function () {/* 
        SELECT (SELECT '-- DROP SEQUENCE ' || quote_ident(n.nspname) || '.' || quote_ident(c.relname) || E';\n\n' ||
              'CREATE SEQUENCE ' || quote_ident(n.nspname) || '.' || quote_ident(c.relname) || E'\n' ||
              '  INCREMENT ' || s.increment || E'\n' ||
              '  MINVALUE '  || s.minimum_value || E'\n' ||
              '  MAXVALUE '  || s.maximum_value || E'\n' ||
              '  START '     || s.start_value || E';\n\n' ||
              'ALTER SEQUENCE ' || quote_ident(n.nspname) || '.' || quote_ident(c.relname) || ' OWNER TO ' || pg_roles.rolname || E';\n\n' ||
              COALESCE('COMMENT ON SEQUENCE 
                            ' || quote_ident(n.nspname) || '.' || quote_ident(c.relname) ||
                            ' IS ' || quote_literal(pg_description.description) || E';\n\n', '') 
        	
        FROM pg_class c 
        LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
        LEFT JOIN pg_roles ON pg_roles.oid = c.relowner
        LEFT JOIN pg_description ON pg_description.objoid = c.oid
        LEFT JOIN information_schema.sequences s ON s.sequence_schema = n.nspname
                                             AND s.sequence_name = c.relname
        WHERE c.relkind = 'S'::char AND c.oid = {{INTOID}})
        
        || COALESCE((SELECT array_to_string(array_agg(
        	(SELECT array_to_string((SELECT array_agg('GRANT ' || ok) FROM 
        	    (SELECT array_to_string((SELECT array_agg(perms ORDER BY srt) 
        		FROM (  SELECT 1 as srt, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'r($|[^*])' THEN 'SELECT' END as perms
        			UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'w($|[^*])' THEN 'UPDATE' END
        			UNION SELECT 3, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'U($|[^*])' THEN 'USAGE' END) em
        			WHERE perms is not null),',') ||
        	' ON TABLE ' || quote_ident(n.nspname) || '.' || quote_ident(c.relname) || ' TO ' ||
              	CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[1] = '' THEN 'public' 
        		ELSE (regexp_split_to_array(unnest::text,'[=/]'))[1] END || E';\n' as ok
        
        	FROM unnest(c.relacl)
        	WHERE (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ '(r|w|U)($|[^*])') as em),'')
        	)
        	),'')
        FROM pg_class c 
        LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
        LEFT JOIN pg_roles ON pg_roles.oid = c.relowner
        LEFT JOIN pg_description ON pg_description.objoid = c.oid
        LEFT JOIN information_schema.sequences s ON s.sequence_schema = n.nspname
                                             AND s.sequence_name = c.relname
        WHERE c.relkind = 'S'::char AND c.oid = {{INTOID}}),'')
        
        || COALESCE((SELECT array_to_string(array_agg(
        	(SELECT array_to_string((SELECT array_agg('GRANT ' || ok) FROM 
        	    (SELECT array_to_string((SELECT array_agg(perms ORDER BY srt) 
        		FROM (  SELECT 1 as srt, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'r\*' THEN 'SELECT' END as perms
        			UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'w\*' THEN 'UPDATE' END
        			UNION SELECT 3, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'U\*' THEN 'USAGE' END) em
        			WHERE perms is not null),',') ||
        	' ON TABLE ' || quote_ident(n.nspname) || '.' || quote_ident(c.relname) || ' TO ' ||
              	CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[1] = '' THEN 'public' 
        		ELSE (regexp_split_to_array(unnest::text,'[=/]'))[1] END || E' WITH GRANT OPTION;\n' as ok
        
        	FROM unnest(c.relacl)
        	WHERE (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ '(r|w|U)\*') as em),'')
        	)
        	),'')
        FROM pg_class c 
        LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
        LEFT JOIN pg_roles ON pg_roles.oid = c.relowner
        LEFT JOIN pg_description ON pg_description.objoid = c.oid
        LEFT JOIN information_schema.sequences s ON s.sequence_schema = n.nspname
                                             AND s.sequence_name = c.relname
        WHERE c.relkind = 'S'::char AND c.oid = {{INTOID}}),'');
    */});


scriptQuery.table = ml(function () {/*
        
SELECT (SELECT '-- Table: ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(pg_class.relname) ||
        	E'\n\n-- DROP TABLE ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(pg_class.relname) ||
        	E';\n\nCREATE TABLE ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(pg_class.relname) ||
        	E'(\n' || array_to_string(array_agg( '  ' ||
        	em1.attname || ' ' || format_type(em1.atttypid,em1.atttypmod) ||
        	CASE WHEN em1.attnotnull THEN ' NOT NULL' ELSE '' END ||
        	CASE WHEN em1.atthasdef  THEN ' DEFAULT ' || pg_catalog.pg_get_expr(em1.adbin, em1.adrelid) ELSE '' END
        	), E',\n') || COALESCE(em2.con_full, '') || COALESCE(em3.con_full, '') || E'\n)\nWITH (\n  OIDS=' || CASE WHEN pg_class.relhasoids THEN ' TRUE' ELSE ' FALSE' END || E'\n);' ||
              E'\n\nALTER TABLE ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(pg_class.relname) || 
              ' OWNER TO ' || pg_roles.rolname || E';\n\n' ||
              COALESCE(E'COMMENT ON TABLE ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(pg_class.relname) || ' IS ' ||
                quote_literal(pg_description.description) || E';', '') || E'\n' ||
                '--SELECT' || (array_to_string(array_agg(' ' || em1.attname), ','::text)) || ' FROM ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(pg_class.relname) || ';'
        
        FROM pg_class
        LEFT JOIN pg_description ON pg_class.oid = pg_description.objoid
        LEFT JOIN (SELECT attrelid, attname, atttypid, atttypmod, typname, attnotnull, atthasdef, pg_attrdef.adbin, pg_attrdef.adrelid,
                   CASE WHEN typname = 'varchar' AND atttypmod = 6 THEN 'chk_'
                        WHEN typname ~ '^(text|varchar|bpchar|name|char)$' THEN 'str_'
                        WHEN typname = 'int2' THEN 'shr_'
                        WHEN typname = 'int4' THEN 'int_'
                        WHEN typname = 'int8' THEN 'lng_'
                        WHEN typname = 'numeric' THEN 'num_'
                        WHEN typname = 'date' THEN 'dte_'
                        WHEN typname ~ '^(abstime|time|timetz)$' THEN 'tme_'
                        WHEN typname ~ '^(timestamp|timestamptz)$' THEN 'dtetme_'
                        WHEN typname = 'oid' THEN 'oid_' END || attname AS att_var
          FROM pg_attribute
          JOIN pg_type ON pg_type.oid = pg_attribute.atttypid
        LEFT OUTER JOIN pg_attrdef ON pg_attrdef.adrelid = pg_attribute.attrelid AND pg_attrdef.adnum = pg_attribute.attnum
          WHERE pg_attribute.attisdropped IS FALSE AND pg_attribute.attnum > 0
          ORDER BY attnum ASC) em1 ON pg_class.oid = em1.attrelid
          
          -- non-CHECK CONSTRAINTs
        LEFT JOIN (SELECT pg_class.oid, array_to_string(array_agg(
                E',\n  CONSTRAINT ' || pg_constraint.conname || ' ' || pg_get_constraintdef(pg_constraint.oid, true)
              ), E'') as con_full
             FROM pg_class
             JOIN pg_index ON pg_class.oid = pg_index.indrelid
             JOIN pg_class clidx ON clidx.oid = pg_index.indexrelid
        LEFT JOIN pg_constraint ON pg_constraint.conindid = clidx.oid
        WHERE pg_constraint.oid IS NOT NULL
        GROUP BY pg_class.oid) em2 ON pg_class.oid = em2.oid
        
          -- CHECK CONSTRAINTs
        LEFT JOIN (SELECT pg_class.oid, array_to_string(array_agg(
                                E',\n  CONSTRAINT ' || conname || ' ' || pg_get_constraintdef(pg_constraint.oid, true)
                          ), E'') as con_full
          FROM pg_constraint--(SELECT conname, oid, conrelid, contype FROM pg_constraint ORDER BY pg_constraint.conname) AS pg_constraint
          JOIN pg_class pg_class ON pg_class.oid = conrelid
          JOIN pg_namespace nl ON nl.oid = relnamespace
          LEFT OUTER JOIN pg_description des ON des.objoid = pg_constraint.oid
         WHERE contype = 'c'
        GROUP BY pg_class.oid) em3 ON pg_class.oid = em3.oid
        
        -- back to the unknown program
         JOIN pg_roles ON pg_roles.oid = pg_class.relowner
         JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
        WHERE pg_class.oid = {{INTOID}}
        GROUP BY pg_namespace.nspname, pg_class.relname, pg_class.relacl,
                pg_class.relhasoids, pg_roles.rolname, em2.oid, em2.con_full, em3.con_full, pg_description.description)
        
        || COALESCE((SELECT E'\n\n' || (SELECT array_to_string(array_agg( 'GRANT ' || 
        	(SELECT array_to_string((SELECT array_agg(perms ORDER BY srt)
        	FROM (	SELECT 1 as srt, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'r($|[^*])' THEN 'SELECT' END as perms
        		UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'w($|[^*])' THEN 'UPDATE' END
        		UNION SELECT 3, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'a($|[^*])' THEN 'INSERT' END
        		UNION SELECT 4, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'd($|[^*])' THEN 'DELETE' END
        		UNION SELECT 5, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'D($|[^*])' THEN 'TRUNCATE' END
        		UNION SELECT 6, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'x($|[^*])' THEN 'REFERENCES' END
        		UNION SELECT 7, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 't($|[^*])' THEN 'TRIGGER' END ) em
        		WHERE perms is not null),',')) ||
        	' ON TABLE ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(pg_class.relname) || ' TO ' ||
        	CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[1] = '' THEN 'public' ELSE (regexp_split_to_array(unnest::text,'[=/]'))[1] END || 
        	';' ), E'\n')
        	FROM unnest(relacl) 
        	WHERE (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ '(r|w|a|d|D|x|t)($|[^*])' 
        	)
        FROM pg_class 
        JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
        WHERE pg_class.oid = {{INTOID}} ),'')
        
        ||  COALESCE((SELECT E'\n\n' || (SELECT array_to_string(array_agg( 'GRANT ' || 
        	(SELECT array_to_string((SELECT array_agg(perms ORDER BY srt)
        	FROM (	SELECT 1 as srt, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'r\*' THEN 'SELECT' END as perms
        		UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'w\*' THEN 'UPDATE' END
        		UNION SELECT 3, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'a\*' THEN 'INSERT' END
        		UNION SELECT 4, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'd\*' THEN 'DELETE' END
        		UNION SELECT 5, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'D\*' THEN 'TRUNCATE' END
        		UNION SELECT 6, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'x\*' THEN 'REFERENCES' END
        		UNION SELECT 7, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 't\*' THEN 'TRIGGER' END ) em
        		WHERE perms is not null),',')) ||
        	' ON TABLE ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(pg_class.relname) || ' TO ' ||
        	CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[1] = '' THEN 'public' ELSE quote_ident((regexp_split_to_array(unnest::text,'[=/]'))[1]) END || 
        	' WITH GRANT OPTION;'), E'\n')
        	FROM unnest(relacl) 
        	WHERE (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ '(r|w|a|d|D|x|t)\*' )
        FROM pg_class 
        JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
        WHERE pg_class.oid = {{INTOID}} ), '')
        
        || COALESCE(
        (SELECT E'\n\n' || array_to_string((SELECT array_agg(ok.perms || E'\n') FROM (SELECT 'GRANT ' || (SELECT array_to_string((SELECT array_agg(perms)
        	FROM (	SELECT 4, CASE WHEN (regexp_split_to_array((att.attacl)::text, '[=/]'))[2] ~ 'r[^*]' THEN 'SELECT(' || att.attname || ')' END as perms
        		UNION SELECT 3, CASE WHEN (regexp_split_to_array((att.attacl)::text, '[=/]'))[2] ~ 'w[^*]' THEN 'UPDATE(' || att.attname || ')' END
        		UNION SELECT 2, CASE WHEN (regexp_split_to_array((att.attacl)::text, '[=/]'))[2] ~ 'a[^*]' THEN 'INSERT(' || att.attname || ')' END
        		UNION SELECT 1, CASE WHEN (regexp_split_to_array((att.attacl)::text, '[=/]'))[2] ~ 'x[^*]' THEN 'REFERENCES(' || att.attname || ')' END ) em
        		WHERE perms is not null
        		ORDER BY 1),','
        		)) ||
        	' ON ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(pg_class.relname) || 
        	' TO ' || CASE WHEN (regexp_split_to_array(att.attacl::text,'[=/]'))[1] = '' THEN 'public' ELSE quote_ident((regexp_split_to_array(att.attacl::text,'[=/]'))[1]) END ||
        	';' as perms
        FROM pg_class 
        LEFT JOIN pg_attribute att ON att.attrelid = pg_class.oid 
        JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
        WHERE pg_class.oid = {{INTOID}} AND (regexp_split_to_array((att.attacl)::text, '[=/]'))[2] ~ 'r[^*]|w[^*]|a[^*]|x[^*]')ok),'')), '')
        
        || COALESCE((SELECT E'\n' || array_to_string((SELECT array_agg(ok.perms || E'\n') FROM (SELECT 'GRANT ' || (SELECT array_to_string((SELECT array_agg(perms)
        	FROM (	SELECT 4, CASE WHEN (regexp_split_to_array((att.attacl)::text, '[=/]'))[2] ~ 'r\*' THEN 'SELECT(' || att.attname || ')' END as perms
        		UNION SELECT 3, CASE WHEN (regexp_split_to_array((att.attacl)::text, '[=/]'))[2] ~ 'w\*' THEN 'UPDATE(' || att.attname || ')' END
        		UNION SELECT 2, CASE WHEN (regexp_split_to_array((att.attacl)::text, '[=/]'))[2] ~ 'a\*' THEN 'INSERT(' || att.attname || ')' END
        		UNION SELECT 1, CASE WHEN (regexp_split_to_array((att.attacl)::text, '[=/]'))[2] ~ 'x\*' THEN 'REFERENCES(' || att.attname || ')' END ) em
        		WHERE perms is not null
        		ORDER BY 1),','
        		)) ||
        	' ON ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(pg_class.relname) || 
        	' TO ' || CASE WHEN (regexp_split_to_array(att.attacl::text,'[=/]'))[1] = '' THEN 'public' ELSE quote_ident((regexp_split_to_array(att.attacl::text,'[=/]'))[1]) END  ||
        	' WITH GRANT OPTION;' as perms
        FROM pg_class 
        LEFT JOIN pg_attribute att ON att.attrelid = pg_class.oid 
        JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
        WHERE pg_class.oid = {{INTOID}} AND (regexp_split_to_array((att.attacl)::text, '[=/]'))[2] ~ '(r|w|a|x)\*')ok),'')), '')
        
        || COALESCE((SELECT E'\n\n' || array_to_string((SELECT array_agg(perms) FROM (
        
        SELECT E'-- DROP RULE ' || quote_ident(pg_rewrite.rulename) ||
        ' ON ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(pg_class.relname) || E';\n' ||
        E'\nCREATE OR REPLACE ' || substring(pg_get_ruledef(pg_rewrite.oid, true), 8) ||
        E'\n\n' as perms
        FROM pg_class
        LEFT JOIN pg_rewrite ON pg_class.oid=pg_rewrite.ev_class
        LEFT JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
        WHERE pg_rewrite.rulename <> '_RETURN' AND pg_class.oid = {{INTOID}} )ok),'')), '')
        
        || COALESCE((SELECT E'\n\n' || array_to_string((SELECT array_agg(ok.perms || E'\n') FROM (
        
        SELECT '-- Trigger: ' || quote_ident(pg_trigger.tgname) || ' ON ' || quote_ident(nspname) || '.' || quote_ident(relname) || E';\n\n' || 
        	'-- DROP TRIGGER ' || quote_ident(pg_trigger.tgname) || ' ON ' || quote_ident(nspname) || '.' || quote_ident(relname) || E';\n\n' ||
        	regexp_replace(regexp_replace(regexp_replace(regexp_replace(pg_get_triggerdef(pg_trigger.oid, true),
        	' BEFORE ', E'\n   BEFORE '), ' ON ', E'\n   ON '), ' FOR ', E'\n   FOR '), ' EXECUTE ', E'\n   EXECUTE ') || E';\n\n' as perms
        FROM pg_class 
        JOIN pg_trigger ON pg_trigger.tgrelid = pg_class.oid
        JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
        WHERE pg_class.oid = {{INTOID}}
        )ok),'')), '')
        
        || COALESCE((SELECT E'\n\n' || array_to_string((SELECT array_agg(ok.perms || E'\n') FROM (
        SELECT E'-- Index: ' || quote_ident(nsp.nspname) || '.' || quote_ident(clidx.relname) || 
        	E'\n\n-- DROP INDEX ' || quote_ident(nsp.nspname) || '.' || quote_ident(clidx.relname) || 
        	E';\n\n' ||
        	regexp_replace(regexp_replace(pg_get_indexdef(clidx.oid),' ON ', E'\n   ON '),
        	' USING ', E'\n   USING ') || E';\n\n' as perms
        FROM pg_class cl 
        JOIN pg_index idx ON cl.oid=idx.indrelid 
        JOIN pg_class clidx ON clidx.oid=idx.indexrelid 
        LEFT JOIN pg_namespace nsp ON nsp.oid = cl.relnamespace 
        WHERE cl.oid = {{INTOID}} AND (SELECT count(*) FROM pg_constraint con WHERE con.conindid = clidx.oid) = 0
        )ok),'')), '');
    */});


scriptQuery.view = ml(function () {/*  
        SELECT  (SELECT array_to_string(array_agg(full_sql), E'\n')
        	FROM (SELECT '-- DROP VIEW ' || quote_ident(n.nspname) || '.' || quote_ident(c.relname) || E';\n\n' ||
        	       'CREATE OR REPLACE VIEW ' || quote_ident(n.nspname) || '.' || quote_ident(c.relname) || E' AS\n' ||
        	       pg_get_viewdef(c.oid, 100) || E'\n\n' ||
        	       'ALTER TABLE ' || quote_ident(n.nspname) || '.' || quote_ident(c.relname) ||
        		 E' OWNER TO ' || quote_ident(pg_roles.rolname) || E';\n' ||
        	       COALESCE('COMMENT ON VIEW ' || quote_ident(n.nspname) || '.' || quote_ident(c.relname) ||
        		 E' IS ' || quote_literal(pg_description.description) || E';\n', '') AS full_sql--, c.relacl
        	  FROM pg_class c
        	LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
        	LEFT JOIN pg_roles ON pg_roles.oid = c.relowner
        	LEFT JOIN pg_description ON pg_description.objoid = c.oid
        	 WHERE c.relkind = 'v'::char AND c.oid = {{INTOID}}) em)
         
        || COALESCE((SELECT E'\n' || (SELECT array_to_string(array_agg( 'GRANT ' || 
        	(SELECT array_to_string((SELECT array_agg(perms ORDER BY srt)
        	FROM (	SELECT 1 as srt, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'r($|[^*])' THEN 'SELECT' END as perms
        		UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'w($|[^*])' THEN 'UPDATE' END
        		UNION SELECT 3, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'a($|[^*])' THEN 'INSERT' END
        		UNION SELECT 4, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'd($|[^*])' THEN 'DELETE' END
        		UNION SELECT 5, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'D($|[^*])' THEN 'TRUNCATE' END
        		UNION SELECT 6, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'x($|[^*])' THEN 'REFERENCES' END
        		UNION SELECT 7, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 't($|[^*])' THEN 'TRIGGER' END ) em
        		WHERE perms is not null),',')) ||
        	' ON TABLE ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(pg_class.relname) || ' TO ' ||
        	CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[1] = '' THEN 'public' ELSE quote_ident((regexp_split_to_array(unnest::text,'[=/]'))[1]) END || 
        	';' ), E'\n')
        	FROM unnest(relacl) 
        	WHERE (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ '(r|w|a|d|D|x|t)($|[^*])' 
        	)
        FROM pg_class 
        JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
        WHERE pg_class.oid = {{INTOID}} ),'')
        
        || COALESCE((SELECT E'\n\n' || (SELECT array_to_string(array_agg( 'GRANT ' || 
        	(SELECT array_to_string((SELECT array_agg(perms ORDER BY srt)
        	FROM (	SELECT 1 as srt, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'r\*' THEN 'SELECT' END as perms
        		UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'w\*' THEN 'UPDATE' END
        		UNION SELECT 3, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'a\*' THEN 'INSERT' END
        		UNION SELECT 4, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'd\*' THEN 'DELETE' END
        		UNION SELECT 5, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'D\*' THEN 'TRUNCATE' END
        		UNION SELECT 6, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'x\*' THEN 'REFERENCES' END
        		UNION SELECT 7, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 't\*' THEN 'TRIGGER' END ) em
        		WHERE perms is not null),',')) ||
        	' ON TABLE ' || quote_ident(pg_namespace.nspname) || '.' || quote_ident(pg_class.relname) || ' TO ' ||
        	CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[1] = '' THEN 'public' ELSE quote_ident((regexp_split_to_array(unnest::text,'[=/]'))[1]) END || 
        	' WITH GRANT OPTION;'), E'\n')
        	FROM unnest(relacl) 
        	WHERE (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ '(r|w|a|d|D|x|t)\*' )
        FROM pg_class 
        JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
        WHERE pg_class.oid = {{INTOID}} ), '')
        	
        
        || COALESCE((SELECT E'\n' || array_to_string(array_agg(drp),E'\n')
        	FROM ( SELECT E'\n-- DROP RULE ' || quote_ident(pg_rewrite.rulename) ||
        		  ' ON ' || quote_ident(n.nspname) || '.' || quote_ident(c.relname) || E';\n' ||
        		  E'\nCREATE OR REPLACE ' || substring(pg_get_ruledef(pg_rewrite.oid, true), 8) ||
        		  '' as drp
          FROM pg_class c
        LEFT JOIN pg_rewrite ON c.oid=pg_rewrite.ev_class
        LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
         WHERE pg_rewrite.rulename <> '_RETURN' AND c.oid = {{INTOID}}) em
        	),'')
        
        
        || COALESCE((SELECT E'\n' || array_to_string(array_agg(trg),E'\n')
        	FROM ( SELECT E'\n-- DROP TRIGGER ' || quote_ident(pg_trigger.tgname) || ' ON ' ||
            quote_ident(pg_namespace.nspname) || '.' || quote_ident(c.relname) || E';\n\n' ||
            replace(replace(replace(replace(pg_get_triggerdef(pg_trigger.oid, true),' INSTEAD ', E'\n   INSTEAD ')
            ,' ON ', E'\n   ON ')
            ,' FOR ', E'\n   FOR ')
            ,' EXECUTE ', E'\n   EXECUTE ') || E';\n' as trg
          FROM pg_class c
          JOIN pg_trigger ON pg_trigger.tgrelid = c.oid
        LEFT JOIN pg_namespace ON pg_namespace.oid = c.relnamespace
        WHERE c.oid = {{INTOID}}) em
        	),'');
    */});


scriptQuery.cast = ml(function () {/*  
        SELECT '-- DROP CAST (' || pg_type1.typname || ' AS ' || pg_type2.typname || E') \n\n' ||
         'CREATE CAST (' || pg_type1.typname || ' AS ' || pg_type2.typname || E')\n' ||
         '  ' || CASE castmethod
                      WHEN 'f' THEN 'WITH FUNCTION ' ||
                                    quote_ident(nsp.nspname) || '.' || quote_ident(pg_proc.proname) || '(' || oidvectortypes(proargtypes) || ')'
                      WHEN 'i' THEN 'WITH INOUT'
                      WHEN 'b' THEN 'WITHOUT' END || E'\n' ||
         '  ' || CASE castcontext
                      WHEN 'e' THEN ''
                      WHEN 'a' THEN 'AS ASSIGNMENT'
                      WHEN 'i' THEN 'AS IMPLICIT' END || ';'
         FROM pg_catalog.pg_cast
        LEFT JOIN pg_catalog.pg_type pg_type1 ON pg_type1.oid = pg_cast.castsource
        LEFT JOIN pg_catalog.pg_type pg_type2 ON pg_type2.oid = pg_cast.casttarget
        LEFT JOIN pg_catalog.pg_proc ON pg_proc.oid = pg_cast.castfunc
        LEFT JOIN pg_catalog.pg_namespace nsp ON nsp.oid = pg_proc.pronamespace
        WHERE pg_cast.oid = {{INTOID}};
    */});


scriptQuery.ansi = ml(function () {/* 
        SELECT '-- Catalog Object: ' || $ASDF${{STRNAME}}$ASDF$;
    */});


scriptQuery.db = ml(function () {/*  
        SELECT
        (SELECT '-- DROP DATABASE ' || quote_ident(datname) || E';\n\n' ||
             'CREATE DATABASE ' || quote_ident(datname) || E'\n  WITH ' ||
             trim(trailing E'\n ' from
               COALESCE('OWNER = ' || rolname || E'\n       ', '') ||
               COALESCE('ENCODING = ' || pg_encoding_to_char(encoding) || E'\n       ', '') ||
               COALESCE('TABLESPACE = ' || spcname || E'\n       ', '') ||
               COALESCE('LC_COLLATE = ' || datcollate || E'\n       ', '') ||
               COALESCE('LC_LC_CTYPE = ' || datctype || E'\n       ', '') ||
               COALESCE('CONNECTION LIMIT = ' || datconnlimit || E'\n       ', '')) || E';\n\n' ||
             COALESCE((SELECT array_to_string(array_agg( 'GRANT ' || 
        	 (SELECT array_to_string((SELECT array_agg(perms ORDER BY srt)
        	 FROM (	SELECT 1 as srt, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'C($|[^*])' THEN 'CREATE' END as perms
        		UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'c($|[^*])' THEN 'CONNECT' END
        		UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'T($|[^*])' THEN 'TEMPORARY' END ) em
        		WHERE perms is not null),',')) ||
        	 ' ON DATABASE ' || quote_ident(datname) || ' TO ' ||
        	 CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[1] = '' THEN 'public' ELSE quote_ident((regexp_split_to_array(unnest::text,'[=/]'))[1]) END || 
        	 E';\n'), E'\n')
        	 FROM unnest(datacl) 
        	 WHERE (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ '(C|c|T)($|[^*])' 
        	 ),'') ||
        
        	 COALESCE((SELECT array_to_string(array_agg( 'GRANT ' || 
        	 (SELECT array_to_string((SELECT array_agg(perms ORDER BY srt)
        	 FROM (	SELECT 1 as srt, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'C\*' THEN 'CREATE' END as perms
        		UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'c\*' THEN 'CONNECT' END
        		UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'T\*' THEN 'TEMPORARY' END ) em
        		WHERE perms is not null),',')) ||
        	 ' ON DATABASE ' || quote_ident(datname) || ' TO ' ||
        	 CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[1] = '' THEN 'public' ELSE quote_ident((regexp_split_to_array(unnest::text,'[=/]'))[1]) END || 
        	 E' WITH GRANT OPTION;\n'), E'\n')
        	 FROM unnest(datacl) 
        	 WHERE (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ '(C|c|T)\*' 
        	 ),'') ||
             COALESCE((SELECT array_to_string(array_agg(E'\nALTER DATABASE ' || quote_ident(datname) || ' SET ' || em.unnest || ';'), '')
                         FROM (SELECT unnest(setconfig)) em), '') || E'\n' ||
             COALESCE('COMMENT ON DATABASE ' || quote_ident(datname) || ' IS ' || quote_literal(description) || ';', '')
             FROM pg_database
        LEFT JOIN pg_tablespace ON pg_tablespace.oid = pg_database.dattablespace
        LEFT JOIN pg_shdescription ON pg_shdescription.objoid = pg_database.oid
        LEFT JOIN pg_roles ON pg_roles.oid = pg_database.datdba
        LEFT JOIN pg_db_role_setting ON pg_database.oid = pg_db_role_setting.setdatabase
            WHERE datname = CURRENT_DATABASE()) ||
        COALESCE((SELECT array_to_string(array_agg(
        	(SELECT array_to_string((SELECT array_agg('ALTER DEFAULT PRIVILEGES\n   GRANT ' || ok) FROM 
        	    (SELECT array_to_string((SELECT array_agg(perms ORDER BY srt) 
        		FROM (  SELECT 1 as srt, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'r($|[^*])' THEN 'SELECT' END as perms
        			UNION SELECT 2, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'w($|[^*])' THEN 'UPDATE' END
        			UNION SELECT 3, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'a($|[^*])' THEN 'INSERT' END
        			UNION SELECT 4, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'd($|[^*])' THEN 'DELETE' END
        			UNION SELECT 5, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'D($|[^*])' THEN 'TRUNCATE' END
        			UNION SELECT 6, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 'x($|[^*])' THEN 'REFERENCES' END
        			UNION SELECT 7, CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ 't($|[^*])' THEN 'TRIGGER' END) em
        			WHERE perms is not null),',') ||
        	' ON ' || ' ' || E'\n   TO ' ||
            	CASE WHEN (regexp_split_to_array(unnest::text,'[=/]'))[1] = '' THEN 'public' 
        		ELSE quote_ident((regexp_split_to_array(unnest::text,'[=/]'))[1]) END || E';\n' as ok
        
        	FROM unnest(defaclacl)
        	WHERE (regexp_split_to_array(unnest::text,'[=/]'))[2] ~ '(r|w|a|d|D|x|t)($|[^*])') as em),'')
        	)
        	),'')
        FROM pg_default_acl
        WHERE defaclnamespace = 0),'');
    */});

scriptQuery.extension = ml(function () {/*
            SELECT 'CREATE EXTENSION IF NOT EXISTS ' || quote_ident(extname) || E'\n' ||
                    CASE WHEN extversion IS NOT NULL OR extnamespace IS NOT NULL THEN '  WITH ' ELSE '' END ||
                    COALESCE('SCHEMA ' || quote_ident(pg_namespace.nspname), '') ||
                    CASE WHEN extversion IS NOT NULL AND extnamespace IS NOT NULL THEN E'\n      ' ELSE '' END ||
                    COALESCE('VERSION ' || extversion, '') || ';', *
             FROM pg_catalog.pg_extension
        LEFT JOIN pg_catalog.pg_namespace ON pg_extension.extnamespace = pg_namespace.oid
            WHERE pg_extension.oid = {{INTOID}};
    */});
