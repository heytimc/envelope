
--basic utilites for
--1: encoding URI strings
--2: decoding URI strings
--3: also for encoding JSON objects

CREATE SCHEMA postage;

-- Function: postage.text_to_uri(text)

-- DROP FUNCTION postage.text_to_uri(text);

CREATE OR REPLACE FUNCTION postage.text_to_uri(text)
  RETURNS text AS
$BODY$
DECLARE
  str_working text;
  str_slice text;
  str_ret text;
  
BEGIN
  str_working := $1;
  str_ret := '';
  WHILE length(str_working) > 0 LOOP
    str_slice := substring(str_working, 1, 1);
    IF str_slice ~* '[a-z]|[0-9]' THEN
      str_ret := str_ret || str_slice;
    ELSE
      str_ret := str_ret || '%' || encode(str_slice::bytea,'hex');
    END IF;
    str_working := substring(str_working, 2);
  END LOOP;

  RETURN str_ret;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION postage.text_to_uri(text)
  OWNER TO postgres;

--SELECT postage.text_to_uri(text);

-- Function: postage.getpar(text, text)

-- DROP FUNCTION postage.getpar(text, text);

CREATE OR REPLACE FUNCTION postage.getpar(text, text)
  RETURNS text AS
$BODY$
DECLARE
  strArray text[];
  ret text;
  -- accepts encoded uri ( key=value, key ) 

BEGIN
  strArray := string_to_array($1,'&');
  IF array_upper(strArray,1) IS NULL THEN
    RETURN NULL;
  ELSE
    for i IN 1..array_upper(strArray,1) loop
      IF split_part(strArray[i],'=',1) = $2 THEN
         ret = substring(strArray[i] FROM position('=' in strArray[i]) + 1);
      END IF;
    end loop;
    IF ret != '' THEN
      ret := gsdocumentation.uri_to_text(ret);
    ELSE
      ret := NULL;
    END IF;
    RETURN ret;
  END IF;
END
 
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION postage.getpar(text, text) OWNER TO postgres;

--SELECT postage.getpar(text, text);

-- Function: postage.jsonify(anyelement)

-- DROP FUNCTION postage.jsonify(anyelement);

CREATE OR REPLACE FUNCTION postage.jsonify(anyelement)
  RETURNS text AS
$BODY$
DECLARE
BEGIN
  RETURN rtrim(ltrim(array_to_json(ARRAY[[$1]])::text, '['), ']');
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

ALTER FUNCTION postage.jsonify(anyelement) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION postage.jsonify(anyelement) TO postgres;
GRANT EXECUTE ON FUNCTION postage.jsonify(anyelement) TO public;;

--SELECT postage.jsonify(anyelement);

-- Function: postage.uri_to_text(text)

-- DROP FUNCTION postage.uri_to_text(text);

CREATE OR REPLACE FUNCTION postage.uri_to_text(text)
  RETURNS text AS
$BODY$
DECLARE
  str_working text;
  str_slice text;
  arr_working text[];
  str_ret text;
  
BEGIN
  str_working := replace($1,'+',' ');
  arr_working := regexp_split_to_array(str_working, E'%');
  FOR i IN 2 .. array_upper(arr_working,1) LOOP
    str_slice := substring(arr_working[i] from 1 for 2);
    IF str_slice < '2' OR str_slice > '7E' THEN
      IF str_slice ilike '0D' THEN
        arr_working[i] := chr(13) ||- substring(arr_working[i] from 3);
      ELSE
        arr_working[i] := substring(arr_working[i] from 3);
      END IF;
    ELSE
      arr_working[i] := convert_from(decode(substring(arr_working[i] from 1 for 2),'hex'),'UTF8') ||- substring(arr_working[i] from 3);
    END IF;
  END LOOP;
  str_ret := array_to_string(arr_working, ''::text)::text; 
--SELECT decode('20','hex') => creates bytea return type, need convert_from to fix
--notes from php that helped me build this:
--$str =~ s/([^A-Za-z0-9])/sprintf("%%%02X", ord($1))/seg;
--Now, the reverse, decode a string from a url. Equivalent of urldecode in PHP. 
--$str =~ s/\%([A-Fa-f0-9]{2})/pack('C', hex($1))/seg;

  RETURN str_ret;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION postage.uri_to_text(text) OWNER TO postgres;

--SELECT postage.uri_to_text(text);