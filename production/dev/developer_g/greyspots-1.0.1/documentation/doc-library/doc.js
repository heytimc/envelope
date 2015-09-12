
function clearDocumentationFolder() {
    GS.addLoader('loader', 'Ajax running...');
    GS.ajaxJSON('/v1/env/action_fil', 'action=list', function (data, error) {
        if (!error) {
            if (data.dat.directories.indexOf('all') > 0) {
                GS.ajaxJSON('/v1/env/action_fil', 'action=list&path=all', function (data, error) {
                    if (!error) {
                        if (data.dat.directories.indexOf('gsdoc') >= 0) {
                            GS.ajaxJSON('/v1/env/action_fil', 'action=rm' +
                                '&paths=' + encodeURIComponent('[\"all/gsdoc\"]'), function (data, error) {
                                GS.removeLoader('loader');
                                
                                if (!error) {
                                    
                                } else {
                                    GS.ajaxErrorDialog(data);
                                }
                            });
                        } else {
                            GS.removeLoader('loader');
                        }
                    } else {
                        GS.removeLoader('loader');
                        GS.ajaxErrorDialog(data);
                    }
                });
            } else {
                GS.ajaxJSON('/v1/env/action_fil', 'action=create_folder&path=all', function (data, error) {
                    GS.removeLoader('loader');
                    
                    if (!error) {
                    } else {
                        GS.ajaxErrorDialog(data);
                    }
                });
            }
        } else {
            GS.removeLoader('loader');
            GS.ajaxErrorDialog(data);
        }
    });
}

function existsDocumentationSchema() {
    var strSQL = ml(function () {/*
SELECT CASE WHEN count(*) > 0 THEN 'TRUE' ELSE 'FALSE' END AS bol_result
FROM pg_catalog.pg_namespace
WHERE pg_namespace.nspname = 'gsdoc';
    */});
    GS.ajaxJSON('/v1/sql', strSQL, function (data, ajaxError) {
        var bolError = false, i, len, error_i;
        
        if (!ajaxError) {
            if (data.dat.error === undefined) {
                for (i = 0, len = data.dat.length; i < len; i = i + 1) {
                    if (data.dat[i].type === 'error') {
                        bolError = true;
                        error_i = i;
                        break;
                    }
                }
            }
            
            if (!bolError) {
                //no error
                //console.log(data.dat[0].content[2], data.dat[0].content[2][0] === 'TRUE');
                if (data.dat[0].content[2][0] === 'TRUE') {
                    //schema exists
                    var buttonGSDoc = document.getElementById('button-documentation-schema');
                    if (buttonGSDoc) {
                        buttonGSDoc.setAttribute('disabled');
                        buttonGSDoc.textContent = 'GSDoc schema already exists';
                    }
                }
            } else {
                console.error('Error found at position: "' + data.dat[error_i].err_pos + '". The position has been marked with "<<".\n\n' +
                              data.dat[error_i].sql.substring(0, parseInt(data.dat[error_i].err_pos, 10)) + '<<' +
                              data.dat[error_i].sql.substring(parseInt(data.dat[error_i].err_pos, 10), data.dat[error_i].sql.length));
                console.error(data.dat[error_i]);
                console.error(data);
                
                GS.openDialog(GS.stringToElement(ml(function () {/*
                    <template data-theme="error">
                        <gs-page>
                            <gs-header><center><h3>Documentation Schema Error</h3></center></gs-header>
                            <gs-body padded>
                                Please see the console for error details.
                            </gs-body>
                            <gs-footer>
                                <gs-button dialogclose>Ok</gs-button>
                            </gs-footer>
                        </gs-page>
                    </template>
                */})));
            }
            
        } else {
            GS.ajaxErrorDialog(data, function () {
                buildDocumentationSchema();
            });
        }
    });
}

function buildDocumentationSchema() {
    'use strict';
    var strSQL = ml(function () {/*
DROP SCHEMA IF EXISTS gsdoc CASCADE;

CREATE SCHEMA gsdoc AUTHORIZATION postgres;

GRANT USAGE, CREATE ON SCHEMA gsdoc TO postgres;
GRANT USAGE ON SCHEMA gsdoc TO normal_g;
GRANT USAGE ON SCHEMA gsdoc TO public_g;

-- ####### gsdoc.default_stamp_fn(); #######
CREATE OR REPLACE FUNCTION gsdoc.default_stamp_fn()
  RETURNS trigger AS
$BODY$ 
DECLARE
  
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.create_stamp := date_trunc('second',now());
  END IF;
  NEW.change_login := "session_user"();
  NEW.change_stamp := date_trunc('second',now());
  RETURN NEW; 
END; 

$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

ALTER FUNCTION gsdoc.default_stamp_fn() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION gsdoc.default_stamp_fn() TO postgres;
GRANT EXECUTE ON FUNCTION gsdoc.default_stamp_fn() TO normal_g;


-- ####### gsdoc.global_seq; #######
CREATE SEQUENCE gsdoc.global_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 2316;

ALTER SEQUENCE gsdoc.global_seq OWNER TO postgres;
GRANT SELECT, UPDATE, USAGE ON TABLE gsdoc.global_seq TO postgres;
GRANT USAGE ON TABLE gsdoc.global_seq TO normal_g;


-- ####### gsdoc.rpeople; #######
CREATE TABLE gsdoc.rpeople(
  id integer NOT NULL DEFAULT nextval(('gsdoc.global_seq'::text)::regclass),
  first_name text NOT NULL,
  last_name text,
  birth_date timestamp with time zone,
  change_login name DEFAULT "current_user"(),
  change_stamp timestamp with time zone DEFAULT date_trunc('second'::text, ('now'::text)::timestamp with time zone),
  create_stamp timestamp with time zone DEFAULT date_trunc('second'::text, ('now'::text)::timestamp with time zone),
  CONSTRAINT rpeople_pk PRIMARY KEY (id)
) WITH (
  OIDS= FALSE
);

ALTER TABLE gsdoc.rpeople OWNER TO postgres;
GRANT SELECT,UPDATE,INSERT,DELETE,TRUNCATE,REFERENCES,TRIGGER ON TABLE gsdoc.rpeople TO postgres;


-- ####### ds_trg_rpeople ON gsdoc.rpeople; #######
CREATE TRIGGER ds_trg_rpeople
   BEFORE INSERT OR UPDATE
   ON gsdoc.rpeople
   FOR EACH ROW
   EXECUTE PROCEDURE gsdoc.default_stamp_fn();


-- ####### gsdoc.rpeople_line; #######
CREATE TABLE gsdoc.rpeople_line(
  id integer NOT NULL DEFAULT nextval(('gsdoc.global_seq'::text)::regclass),
  people_id integer NOT NULL,
  pet_name text NOT NULL,
  birth_date timestamp with time zone NOT NULL,
  change_login name DEFAULT "current_user"(),
  change_stamp timestamp with time zone DEFAULT date_trunc('second'::text, ('now'::text)::timestamp with time zone),
  create_stamp timestamp with time zone DEFAULT date_trunc('second'::text, ('now'::text)::timestamp with time zone),
  CONSTRAINT rpeople_line_pk PRIMARY KEY (id)
) WITH (
  OIDS= FALSE
);

ALTER TABLE gsdoc.rpeople_line OWNER TO postgres;
GRANT SELECT,UPDATE,INSERT,DELETE,TRUNCATE,REFERENCES,TRIGGER ON TABLE gsdoc.rpeople_line TO postgres;


-- ####### ds_trg_rpeople_line ON gsdoc.rpeople_line; #######
CREATE TRIGGER ds_trg_rpeople_line
   BEFORE INSERT OR UPDATE
   ON gsdoc.rpeople_line
   FOR EACH ROW
   EXECUTE PROCEDURE gsdoc.default_stamp_fn();


-- ####### gsdoc.tpeople; #######
CREATE OR REPLACE VIEW gsdoc.tpeople AS
 SELECT rpeople.id, rpeople.first_name, rpeople.last_name, rpeople.birth_date, 
    date_part('year'::text, age(rpeople.birth_date)) AS age, rpeople.change_stamp, 
    count(rpeople_line.id) AS number_of_pets
   FROM gsdoc.rpeople
   LEFT JOIN gsdoc.rpeople_line ON rpeople_line.people_id = rpeople.id
  GROUP BY rpeople.id, rpeople.first_name, rpeople.last_name, rpeople.birth_date, rpeople.change_stamp;

ALTER TABLE gsdoc.tpeople OWNER TO postgres;
GRANT SELECT,UPDATE,INSERT,DELETE,TRUNCATE,REFERENCES,TRIGGER ON TABLE gsdoc.tpeople TO postgres;
GRANT SELECT,UPDATE,INSERT,DELETE ON TABLE gsdoc.tpeople TO normal_g;

-- ####### rpeople_delete ON gsdoc.tpeople; #######
CREATE OR REPLACE RULE rpeople_delete AS
    ON DELETE TO gsdoc.tpeople DO INSTEAD  DELETE FROM gsdoc.rpeople
  WHERE old.id = rpeople.id;

-- ####### rpeople_insert ON gsdoc.tpeople; #######
CREATE OR REPLACE RULE rpeople_insert AS
    ON INSERT TO gsdoc.tpeople DO INSTEAD  INSERT INTO gsdoc.rpeople (first_name, last_name, birth_date) 
  VALUES (new.first_name, new.last_name, new.birth_date);

-- ####### rpeople_update ON gsdoc.tpeople; #######
CREATE OR REPLACE RULE rpeople_update AS
    ON UPDATE TO gsdoc.tpeople DO INSTEAD  UPDATE gsdoc.rpeople SET first_name = new.first_name, last_name = new.last_name, birth_date = new.birth_date
  WHERE old.id = rpeople.id;


-- ####### gsdoc.tpeople_list; #######
CREATE OR REPLACE VIEW gsdoc.tpeople_list AS
 SELECT rpeople.id, rpeople.first_name || ' ' || rpeople.last_name AS name, date_part('year'::text, age(rpeople.birth_date)) AS age
   FROM gsdoc.rpeople;

ALTER TABLE gsdoc.tpeople_list OWNER TO postgres;
GRANT SELECT,UPDATE,INSERT,DELETE,TRUNCATE,REFERENCES,TRIGGER ON TABLE gsdoc.tpeople_list TO postgres;
GRANT SELECT,UPDATE,INSERT,DELETE ON TABLE gsdoc.tpeople_list TO normal_g;


-- ####### gsdoc.tpeople_list_inital; #######
CREATE OR REPLACE VIEW gsdoc.tpeople_list_inital AS
 SELECT rpeople.id, rpeople.first_name || ' ' || rpeople.last_name AS name
   FROM gsdoc.rpeople;

ALTER TABLE gsdoc.tpeople_list_inital OWNER TO postgres;
GRANT SELECT,UPDATE,INSERT,DELETE,TRUNCATE,REFERENCES,TRIGGER ON TABLE gsdoc.tpeople_list_inital TO postgres;
GRANT SELECT,UPDATE,INSERT,DELETE ON TABLE gsdoc.tpeople_list_inital TO normal_g;


-- ####### gsdoc.tpeople_line; #######
CREATE OR REPLACE VIEW gsdoc.tpeople_line AS
 SELECT rpeople_line.id, rpeople_line.people_id, rpeople_line.pet_name, rpeople_line.birth_date, 
    date_part('year'::text, age(rpeople_line.birth_date)) AS age, rpeople_line.change_stamp
   FROM gsdoc.rpeople_line;

ALTER TABLE gsdoc.tpeople_line OWNER TO postgres;
GRANT SELECT,UPDATE,INSERT,DELETE,TRUNCATE,REFERENCES,TRIGGER ON TABLE gsdoc.tpeople_line TO postgres;
GRANT SELECT,UPDATE,INSERT,DELETE ON TABLE gsdoc.tpeople_line TO normal_g;

-- ####### rpeople_line_delete ON gsdoc.tpeople_line; #######
CREATE OR REPLACE RULE rpeople_line_delete AS
    ON DELETE TO gsdoc.tpeople_line DO INSTEAD  DELETE FROM gsdoc.rpeople_line
  WHERE old.id = rpeople_line.id;

-- ####### rpeople_line_insert ON gsdoc.tpeople_line; #######
CREATE OR REPLACE RULE rpeople_line_insert AS
    ON INSERT TO gsdoc.tpeople_line DO INSTEAD  INSERT INTO gsdoc.rpeople_line (people_id, pet_name, birth_date) 
  VALUES (new.people_id, new.pet_name, new.birth_date);

-- ####### rpeople_line_update ON gsdoc.tpeople_line; #######
CREATE OR REPLACE RULE rpeople_line_update AS
    ON UPDATE TO gsdoc.tpeople_line DO INSTEAD  UPDATE gsdoc.rpeople_line SET people_id = new.people_id, pet_name = new.pet_name, birth_date = new.birth_date
  WHERE old.id = rpeople_line.id;


-- ##########################################################
-- ################# RANDOM DATA GENERATION #################
-- ##########################################################

-- generate 1 person with the first name of "Apple" so that when testing where clauses based on first name: we can count on "Apple"
INSERT INTO gsdoc.rpeople
    SELECT nextval(('gsdoc.global_seq'::text)::regclass) AS id,
           'Apple',
           arr_names[trunc(random() * 19 + 1)] AS last_name,
           now() - (trunc(random() * 10000 + 1) || ' day')::interval AS birth_date
     FROM (SELECT ARRAY['Apple', 'Mango', 'Kiwi', 'Pineapple',
                        'Grapefruit', 'Plum', 'Coconut', 'Fig',
                        'Lemon', 'Grapes', 'Raspberries', 'Blackberries',
                        'Blueberries', 'Strawberries', 'Cranberries', 'Orange',
                        'Banana', 'Lime', 'Pear'] AS arr_names) em;

-- generate 100 random people
INSERT INTO gsdoc.rpeople
    SELECT nextval(('gsdoc.global_seq'::text)::regclass) AS id,
           arr_names[trunc(random() * 19 + 1)] AS first_name,
           arr_names[trunc(random() * 19 + 1)] AS last_name,
           now() - (trunc(random() * 10000 + 1) || ' day')::interval AS birth_date
     FROM (SELECT generate_series(1,100) AS series_maker,
            ARRAY['Apple', 'Mango', 'Kiwi', 'Pineapple',
                  'Grapefruit', 'Plum', 'Coconut', 'Fig',
                  'Lemon', 'Grapes', 'Raspberries', 'Blackberries',
                  'Blueberries', 'Strawberries', 'Cranberries', 'Orange',
                  'Banana', 'Lime', 'Pear'] AS arr_names) em;

-- generate 120 random pets and assign them to random people
INSERT INTO gsdoc.rpeople_line
    SELECT nextval(('gsdoc.global_seq'::text)::regclass) AS id,
           (SELECT id FROM gsdoc.rpeople LIMIT 1 OFFSET random_offset) AS people_id,
           arr_names[trunc(random() * 13 + 1)] AS pet_name,
           now() - (trunc(random() * 5000 + 1) || ' day')::interval AS birth_date
     FROM (SELECT generate_series(1,120) AS series_maker,
            trunc(random() * 99 + 1) random_offset,
            ARRAY['Spot', 'Roger', 'Cookie', 'Tracer',
                  'Tracy', 'Fido', 'King', 'Queen',
                  'Hound', 'Shepherd', 'Wolfy', 'Max',
                  'Bear'] AS arr_names) em;

-- generate 3 random pets and assign them to person #2341 so that we can depend on there being line items
INSERT INTO gsdoc.rpeople_line
    SELECT nextval(('gsdoc.global_seq'::text)::regclass) AS id,
           2341 AS people_id,
           arr_names[trunc(random() * 13 + 1)] AS pet_name,
           now() - (trunc(random() * 5000 + 1) || ' day')::interval AS birth_date
     FROM (SELECT generate_series(1,3) AS series_maker,
            ARRAY['Spot', 'Roger', 'Cookie', 'Tracer',
                  'Tracy', 'Fido', 'King', 'Queen',
                  'Hound', 'Shepherd', 'Wolfy', 'Max',
                  'Bear'] AS arr_names) em;

CREATE OR REPLACE FUNCTION gsdoc.text_to_uri(text)
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
ALTER FUNCTION gsdoc.text_to_uri(text)
  OWNER TO postgres;

-- Function: gsdoc.getpar(text, text)

-- DROP FUNCTION gsdoc.getpar(text, text);

CREATE OR REPLACE FUNCTION gsdoc.getpar(text, text)
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
      ret := gsdoc.uri_to_text(ret);
    ELSE
      ret := NULL;
    END IF;
    RETURN ret;
  END IF;
END
 
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION gsdoc.getpar(text, text) OWNER TO postgres;

-- DROP FUNCTION gsdoc.jsonify(anyelement);

CREATE OR REPLACE FUNCTION gsdoc.jsonify(anyelement)
  RETURNS text AS
$BODY$
DECLARE
BEGIN
  RETURN rtrim(ltrim(array_to_json(ARRAY[[$1]])::text, '['), ']');
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

ALTER FUNCTION gsdoc.jsonify(anyelement) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION gsdoc.jsonify(anyelement) TO postgres;
GRANT EXECUTE ON FUNCTION gsdoc.jsonify(anyelement) TO public;;

--SELECT gsdoc.jsonify(anyelement);

-- Function: gsdoc.uri_to_text(text)

-- DROP FUNCTION gsdoc.uri_to_text(text);

CREATE OR REPLACE FUNCTION gsdoc.uri_to_text(text)
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
ALTER FUNCTION gsdoc.uri_to_text(text) OWNER TO postgres;
    */});
    
    GS.addLoader('build-documentation-schema', 'Building Test Schema...<br />Please Wait.');
    GS.ajaxJSON('/v1/sql', strSQL, function (data, ajaxError) {
        var bolError = false, i, len, error_i;
        GS.removeLoader('build-documentation-schema');
        
        if (!ajaxError) {
            if (data.dat.error === undefined) {
                for (i = 0, len = data.dat.length; i < len; i = i + 1) {
                    if (data.dat[i].type === 'error') {
                        bolError = true;
                        error_i = i;
                        break;
                    }
                }
            }
            
            if (!bolError) {
                existsDocumentationSchema();
                GS.triggerEvent(window, 'example-refresh');
                GS.pushMessage('Schema Has Been Refreshed', 1500);
            } else {
                console.error('Error found at position: "' + data.dat[error_i].err_pos + '". The position has been marked with "<<".\n\n' +
                              data.dat[error_i].sql.substring(0, parseInt(data.dat[error_i].err_pos, 10)) + '<<' +
                              data.dat[error_i].sql.substring(parseInt(data.dat[error_i].err_pos, 10), data.dat[error_i].sql.length));
                console.error(data.dat[error_i]);
                console.error(data);
                
                GS.openDialog(GS.stringToElement(ml(function () {/*
                    <template data-theme="error">
                        <gs-page>
                            <gs-header><center><h3>Documentation Schema Error</h3></center></gs-header>
                            <gs-body padded>
                                Please see the console for error details.
                            </gs-body>
                            <gs-footer>
                                <gs-button dialogclose>Ok</gs-button>
                            </gs-footer>
                        </gs-page>
                    </template>
                */})));
            }
            
        } else {
            GS.ajaxErrorDialog(data, function () {
                buildDocumentationSchema();
            });
        }
    });
}

window.addEventListener('load', function () {
    'use strict';
    var documentationButton = document.getElementById('button-documentation-schema')
      , testFolderButton = document.getElementById('button-test-folder');
    
    if (documentationButton) {
        documentationButton.addEventListener('click', function () {
            buildDocumentationSchema();
        });
    }
    
    if (testFolderButton) {
        testFolderButton.addEventListener('click', function () {
            clearDocumentationFolder();
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    existsDocumentationSchema();
    xtag.register('gs-doc-example', {
        'lifecycle': {
            'created': function () {
                'use strict';
                var element = this, HTMLTemplate, JSTemplate, DBTemplate, strHTML, strHTMLCode, strJSCode, strDBCode,
                    intQSTimer, strHTMLHeight, strJSHeight, strDBHeight;
                
                window.Range = require('ace/range').Range;
                
                HTMLTemplate = xtag.queryChildren(this, 'template[for="html"]')[0];
                JSTemplate   = xtag.queryChildren(this, 'template[for="js"]')[0];
                DBTemplate   = xtag.queryChildren(this, 'template[for="db"]')[0];
                
                strHTMLCode                 = this.dedentCode(HTMLTemplate.innerHTML);
                if (JSTemplate) { strJSCode = this.dedentCode(JSTemplate.innerHTML); }
                if (DBTemplate) { strDBCode = this.dedentCode(DBTemplate.innerHTML); }
                
                strHTMLHeight                 = HTMLTemplate.getAttribute('height') || '10';
                if (JSTemplate) { strJSHeight = JSTemplate.getAttribute('height') || '10'; }
                if (DBTemplate) { strDBHeight = DBTemplate.getAttribute('height') || '10'; }
                
                // remove templates and add sections
                strHTML =      '<div class="root" gs-dynamic>' +
                               '    <div class="example-parent">' +
                               '        <div class="example-html-ace"></div>' +
                               '        <div class="example-js-ace"></div>' +
                               '        <div class="example-db-ace-status-flag"></div>' +
                               '        <div class="example-db-ace"></div>' +
                               '        <div class="example-display-container" flex-vertical flex-fill>';
                
                if (this.hasAttribute('query-string')) {
                    strHTML += '            <div class="query-string-container" flex-horizontal>' +
                               '                <label>Query String:</label>' +
                               '                <gs-text flex mini class="example-querystring"></gs-text>' +
                               '            </div>';
                }
                
                strHTML +=     '            <iframe class="example-display" flex></iframe>' +
                               '            <div class="example-display-refresh-modal" hidden></div>' +
                               '            <gs-button class="example-display-refresh-button" hidden>Reload Example</gs-button>' +
                               '        </div>' +
                               '    </div>' +
                               '</div>';
                
                this.innerHTML = strHTML;
                
                // gather selectors
                this.root               = xtag.query(this, '.root')[0];
                this.codeContainer      = xtag.query(this, '.example-code-container')[0];
                this.HTMLAce            = xtag.query(this, '.example-html-ace')[0];
                this.JSAce              = xtag.query(this, '.example-js-ace')[0];
                this.DBAce              = xtag.query(this, '.example-db-ace')[0];
                this.DBEditorStatusFlag = xtag.query(this, '.example-db-ace-status-flag')[0];
                this.displayContainer   = xtag.query(this, '.example-display-container')[0];
                this.displayIframe      = xtag.query(this, '.example-display')[0];
                this.refreshModal       = xtag.query(this, '.example-display-refresh-modal')[0];
                this.refreshButton      = xtag.query(this, '.example-display-refresh-button')[0];
                if (this.hasAttribute('query-string')) {
                    this.queryStringControl = xtag.query(this, '.example-querystring')[0];
                }
                
                // create html ace
                this.HTMLEditor = ace.edit(this.HTMLAce);
                this.HTMLEditor.setTheme('ace/theme/eclipse');
                this.HTMLEditor.getSession().setMode('ace/mode/html');
                this.HTMLEditor.setShowPrintMargin(false);
                this.HTMLEditor.setDisplayIndentGuides(true);
                this.HTMLEditor.setShowFoldWidgets(false);
                this.HTMLEditor.session.setUseWorker(false);
                this.HTMLEditor.session.setUseWrapMode('free');
                this.HTMLEditor.setBehavioursEnabled(false);
                this.HTMLEditor.$blockScrolling = Infinity; // <== blocks a warning
                this.HTMLEditor.setOptions({
                    'enableBasicAutocompletion': true,
                    'enableSnippets'           : true,
                    'enableLiveAutocompletion' : true
                });
                
                // bind html ace
                this.HTMLAce.addEventListener('keyup', function () {
                    element.displayRefreshModal();
                });
                
                // set height of HTML ace
                if (strHTMLHeight === 'auto') {
                    this.HTMLEditor.setOptions({ maxLines: Infinity });
                    strHTMLCode += '\n';
                    //this.HTMLAce.style.height = (GS.getTextHeight(this.HTMLAce, true) * strHTMLCode.split('\n').length) + 'px';
                    
                } else {
                    this.HTMLAce.style.height = strHTMLHeight + 'em';
                }
                
                // fill html ace and move the cursor to the beginning
                this.HTMLEditor.setValue(strHTMLCode);
                this.HTMLEditor.selection.setSelectionRange(new Range(0, 0, 0, 0));
                
                // create/bind/fill/height javascript ace if there was a template for it
                if (JSTemplate) {
                    // create javascript ace
                    this.JSEditor = ace.edit(this.JSAce);
                    this.JSEditor.setTheme('ace/theme/eclipse');
                    this.JSEditor.getSession().setMode('ace/mode/javascript');
                    this.JSEditor.setShowPrintMargin(false);
                    this.JSEditor.setDisplayIndentGuides(true);
                    this.JSEditor.setShowFoldWidgets(false);
                    this.JSEditor.session.setUseWorker(false);
                    this.JSEditor.session.setUseWrapMode('free');
                    this.JSEditor.setBehavioursEnabled(false);
                    this.JSEditor.$blockScrolling = Infinity; // <== blocks a warning
                    this.JSEditor.setOptions({
                        'enableBasicAutocompletion': true,
                        'enableSnippets'           : true,
                        'enableLiveAutocompletion' : true
                    });
                    
                    // bind javascript ace
                    this.JSAce.addEventListener('keyup', function () {
                        element.displayRefreshModal();
                    });
                    
                    // set height of JS ace
                    if (strJSHeight === 'auto') {
                        this.JSEditor.setOptions({ maxLines: Infinity });
                        strJSCode += '\n';
                        //this.JSAce.style.height = (GS.getTextHeight(this.JSAce, true) * strJSCode.split('\n').length) + 'px';
                        
                    } else {
                        this.JSAce.style.height = strJSHeight + 'em';
                    }
                    
                    // fill javascript ace and move the cursor to the beginning
                    this.JSEditor.setValue(decodeHTML(strJSCode));
                    this.JSEditor.selection.setSelectionRange(new Range(0, 0, 0, 0));
                }
                
                // create/bind/fill/height DB ace if there was a template for it
                if (DBTemplate) {
                    // create DB ace
                    this.DBEditor = ace.edit(this.DBAce);
                    this.DBEditor.setTheme('ace/theme/eclipse');
                    this.DBEditor.getSession().setMode('ace/mode/pgsql');
                    this.DBEditor.setShowPrintMargin(false);
                    this.DBEditor.setDisplayIndentGuides(true);
                    this.DBEditor.setShowFoldWidgets(false);
                    this.DBEditor.session.setUseWorker(false);
                    this.DBEditor.session.setUseWrapMode('free');
                    this.DBEditor.setBehavioursEnabled(false);
                    this.DBEditor.$blockScrolling = Infinity; // <== blocks a warning
                    this.DBEditor.setOptions({
                        'enableBasicAutocompletion': true,
                        'enableSnippets'           : true,
                        'enableLiveAutocompletion' : true
                    });
                    
                    // bind DB ace
                    this.DBAce.addEventListener('keyup', function () {
                        element.displayRefreshModal(true);
                    });
                    
                    // set height of DB ace
                    if (strDBHeight === 'auto') {
                        this.DBEditor.setOptions({ maxLines: Infinity });
                        strDBCode += '\n';
                        //this.DBAce.style.height = (GS.getTextHeight(this.DBAce, true) * strDBCode.split('\n').length) + 'px';
                        
                    } else {
                        this.DBAce.style.height = strDBHeight + 'em';
                    }
                    
                    // fill DB ace and move the cursor to the beginning
                    this.DBEditor.setValue(decodeHTML(strDBCode));
                    this.DBEditor.selection.setSelectionRange(new Range(0, 0, 0, 0));
                }
                
                // fill/bind query string input it it is turned on
                if (this.hasAttribute('query-string')) {
                    this.queryStringControl.value = this.getAttribute('query-string') || '';
                    
                    this.queryStringControl.addEventListener('keyup', function () {
                        if (intQSTimer) {
                            clearTimeout(intQSTimer);
                        }
                        intQSTimer = setTimeout(function() {
                            //element.refreshDisplay();
                            element.displayIframe.contentWindow.history.pushState({},'','doc-library/doc-target.html');
                            element.displayIframe.contentWindow.history.pushState({},'','doc-library/doc-target.html?' + element.queryStringControl.value);
                            GS.triggerEvent(element.displayIframe.contentWindow, 'pushstate');
                        }, 250);
                    });
                }
                
                // bind example refresh button
                this.refreshButton.addEventListener('click', function () {
                    element.refreshModal.setAttribute('hidden', '');
                    element.refreshButton.setAttribute('hidden', '');
                    
                    element.refreshDisplay(element.refreshButton.bolSQL);
                });
                
                // handle display height
                this.sizeHandler();
                
                // refresh iframe
                this.refreshDisplay(Boolean(DBTemplate));
                
                // if the 'example-refresh' event is triggered on the window: refresh iframe
                window.addEventListener('example-refresh', function () {
                    element.refreshDisplay(Boolean(DBTemplate));
                });
                
                // if the 'example-refresh' event is triggered on the window: refresh iframe
                window.addEventListener('resize', function () {
                    element.sizeHandler();
                });
            }
        },
        'methods': {
            displayRefreshModal: function (bolSQL) {
                'use strict';
                this.refreshModal.removeAttribute('hidden');
                this.refreshButton.removeAttribute('hidden');
                
                this.refreshButton.bolSQL = bolSQL;
            },
            
            refreshDisplay: function (bolSQL) {
                'use strict';
                var element = this, newIframe, loadFunction, strHTML = ml(function () {/*
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, minimal-ui" />
                            
                            <script src="/js/greyspots.js" type="text/javascript"></script>
                            <link href="/css/greyspots.css" type="text/css" rel="stylesheet" />
                            
                            <style>
                                .doc-red {
                                    background-color: #F00;
                                }
                                .doc-light-red {
                                    background-color: #FAA;
                                }
                                .doc-blue {
                                    background-color: #00F;
                                }
                                .doc-lavender {
                                    background-color: #AAF;
                                }
                                .doc-green {
                                    background-color: #0F0;
                                }
                                .doc-yellow {
                                    background-color: #FF0;
                                }
                                .doc-cyan {
                                    background-color: #0FF;
                                }
                                .doc-orange {
                                    background-color: #FFC55A;
                                }
                            </style>
                            
                            <script>
                                window.bolCurl = false;
                            </script>
                            
                            <script>
                                {{JS}}
                            </script>
                        </head>
                        <body>
                            {{HTML}}
                        </body>
                    </html>
                */}).replace(/\{\{HTML\}\}/gim, element.HTMLEditor.getValue());
                
                if (element.JSEditor) {
                    strHTML = strHTML.replace(/\{\{JS\}\}/gim, element.JSEditor.getValue());
                } else {
                    strHTML = strHTML.replace(/\{\{JS\}\}/gim, '');
                }
                
                newIframe = GS.stringToElement('<iframe class="example-display" flex></iframe>'); // tabindex="-1"
                
                //if (element.hasAttribute('query-string')) {
                //    newIframe.setAttribute('src', 'doc-library/doc-target.html?' + element.queryStringControl.value);
                //} else {
                //    newIframe.setAttribute('src', 'doc-library/doc-target.html');
                //}
                
                //newIframe.addEventListener('focus', function (event) {
                //    event.preventDefault();
                //    event.stopPropagation();
                //});
                
                element.displayIframe.parentNode.replaceChild(newIframe, element.displayIframe);
                element.displayIframe = newIframe;
                
                if (bolSQL) {
                    //loadFunction = function () {
                    element.DBEditorStatusFlag.classList.add('running');
                    GS.ajaxJSON('/v1/sql', element.DBEditor.getValue(), function (data, ajaxError) {
                        var bolError = false, i, len, errorSQL, errorPos, strError;
                        
                        //element.DBEditor.focus();
                        element.DBEditorStatusFlag.classList.remove('running');
                        
                        if (!ajaxError) {
                            if (data.dat.error === undefined) {
                                for (i = 0, len = data.dat.length; i < len; i = i + 1) {
                                    if (data.dat[i].type === 'error') {
                                        bolError = true;
                                        errorSQL = data.dat[i].sql;
                                        errorPos = parseInt(data.dat[i].err_pos, 10);
                                        
                                        if (isNaN(errorPos)) {
                                            strError = data.dat[i].error + '\n' +
                                                       '<hr/>' +
                                                       errorSQL;
                                        } else {
                                            strError = data.dat[i].error + '\n' +
                                               'Error found at position: "' + errorPos + '". The position has been marked with "&lt;&lt;".\n\n' +
                                               '<hr />' +
                                               errorSQL.substring(0, errorPos) + '<span style="color: #FF0000; font-weight: 900;">&lt;&lt;</span>' +
                                               errorSQL.substring(errorPos, errorSQL.length);
                                        }
                                        
                                        console.error('Error specific: ', data.dat[i]);
                                        console.error('All returned data: ', data);
                                        
                                        break;
                                    }
                                }
                            }
                            
                            if (!bolError) {
                                element.displayIframe.contentWindow.document.write(strHTML);
                                
                                // close the layout stream, causing everything to render
                                element.displayIframe.contentWindow.document.close();
                                element.handleQueryString();
                            } else {
                                element.displayIframe.contentWindow.document.write(
                                    '<pre style="white-space: pre-wrap;">' +
                                        '<center><h3>SQL Error</h3></center>' +
                                        strError + '<hr />Please see the console if you need more details.' +
                                    '</pre>');
                                
                                // close the layout stream, causing everything to render
                                element.displayIframe.contentWindow.document.close();
                                element.handleQueryString();
                            }
                            
                        } else {
                            GS.ajaxErrorDialog(data, function () {
                                element.refreshDisplay(true);
                            });
                        }
                    });
                    //    
                    //    element.displayIframe.removeEventListener('load', loadFunction);
                    //};
                    //element.displayIframe.addEventListener('load', loadFunction);
                } else {
                    element.displayIframe.contentWindow.document.write(strHTML);
                    
                    // close the layout stream, causing everything to render
                    element.displayIframe.contentWindow.document.close();
                    element.handleQueryString();
                }
            },
            
            handleQueryString: function () {
                var element = this;
                
                if (element.hasAttribute('query-string')) {
                    element.displayIframe.contentWindow.addEventListener('pushstate', function () {
                        element.queryStringControl.value = element.displayIframe.contentWindow.location.search.substring(1);
                    });
                    element.displayIframe.contentWindow.addEventListener('replacestate', function () {
                        element.queryStringControl.value = element.displayIframe.contentWindow.location.search.substring(1);
                    });
                    element.displayIframe.contentWindow.addEventListener('popstate', function () {
                        element.queryStringControl.value = element.displayIframe.contentWindow.location.search.substring(1);
                    });
                    
                    element.displayIframe.contentWindow.history.pushState({},'','doc-library/doc-target.html');
                    element.displayIframe.contentWindow.history.pushState({},'','doc-library/doc-target.html?' + element.queryStringControl.value);
                    GS.triggerEvent(element.displayIframe.contentWindow, 'pushstate');
                }
            },
            
            dedentCode: function (strCode) {
                'use strict';
                var arrLines, i, len, intChopLength;
                
                strCode = strCode.replace(/=""/gim, '');
                
                if (strCode[0] === '\n') {
                    strCode = strCode.substring(1, strCode.lastIndexOf('\n'));
                }
                
                arrLines = strCode.split('\n');
                intChopLength = arrLines[0].match(/^\s*/i)[0].length;
                
                for (i = 0, len = arrLines.length; i < len; i += 1) {
                    arrLines[i] = arrLines[i].substring(intChopLength, arrLines[i].length);
                }
                
                strCode = arrLines.join('\n');
                
                return strCode;
            },
            
            sizeHandler: function () {
                var newHeight = 0;
                
                if (window.innerWidth <= 768 && !this.displayContainer.style.height) {
                    newHeight += this.HTMLAce.offsetHeight;
                    
                    if (this.JSAce) {
                        newHeight += this.JSAce.offsetHeight;
                    }
                    
                    if (this.DBAce) {
                        newHeight += this.DBAce.offsetHeight;
                    }
                    
                    this.displayContainer.style.height = newHeight + 'px';
                    
                } else if (window.innerWidth > 768 && this.displayContainer.style.height) {
                    this.displayContainer.style.height = '';
                }
            }
        }
    });
});
