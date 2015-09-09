
function closeFolder(target) {
    'use strict';
    var targetGrid = GS.findParentTag(target, 'gs-grid'),
        intTargetLevel = parseInt(targetGrid.getAttribute('data-level'), 10),
        containerElement = document.getElementById('object-list-container'),
        arrElements = xtag.toArray(containerElement.children),
        i, len;
    
    //console.log('test', arrElements);
    
    for (i = arrElements.indexOf(targetGrid) + 1, len = arrElements.length; i < len; i += 1) {
        //console.log(arrElements[i], arrElements[i].outerHTML);
        if (parseInt(arrElements[i].getAttribute('data-level'), 10) <= intTargetLevel) {
            break;
        } else {
            containerElement.removeChild(arrElements[i]);
            //console.log(containerElement);
        }
    }
}

function getSchema(target, intOid) {
    'use strict';
    getScriptForAce(scriptQuery.schemaSql.replace(/{{INTOID}}/gim, intOid));
}

function getSchemas(target) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.schemas, function (jsnRow, i) {
            return createLevel(1, (i === 0), 'onclick="getSchemaContents(this, ' + jsnRow.oid + ', \'' + jsnRow.name + '\')"', jsnRow.name, //);
                        '<gs-button icononly icon="download" class="button-obj-grid" ' +
                                    'onclick="dialogSchemaSurgery(\'' + jsnRow.oid + '\', \'' + jsnRow.name + '\')"></gs-button>', true);
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}

function getSchemaContents(target, intOid, strName) {
    'use strict';
    var getSchemaContentsFromOid = function (intOid) {
            getListForTree(target, listQuery.schemaContents.replace(/\{\{INTOID\}\}/gim, intOid), function (jsnRow, i) {
                return createLevel(2, (i === 0), 'onclick="' +
                                                        jsnRow.action + '(this, ' + intOid + ', ' + jsnRow.oid + ');' +
                                                        (jsnRow.refreshaction ? jsnRow.refreshaction + '(this, ' + intOid + ');' : '') +
                                                        '"', jsnRow.name, '', Boolean(jsnRow.refreshaction));
            });
        };
    
    //console.log(target, intOid, strName);
    
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        if (intOid !== '' && intOid >= 0) {
            getSchemaContentsFromOid(intOid);
        } else {
            GS.addLoader(document.getElementById('object-list-container'), 'Getting OID...');
            GS.ajaxJSON('/v1/sql', 'SELECT oid FROM pg_namespace WHERE nspname = \'' + strName + '\';', function (data, error) {
                GS.removeLoader(document.getElementById('object-list-container'));
                
                if (!error) {
                    //console.log(data);
                    getSchemaContentsFromOid(data.dat[0].content[2][0]);
                } else {
                    GS.ajaxErrorDialog(response, function () {
                        getSchemaContents(target, intOid, strName);
                    });
                }
            });
        }
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}

function refreshAggregateNumber(target, intSchemaOid) {
    'use strict';
    var plusAndMinus = '';
    getObjectTypeTitle(titleRefreshQuery.aggregateNumber.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (data) {
        if (target.querySelector('.plus')) {
            plusAndMinus += target.querySelector('.plus').outerHTML;
            plusAndMinus += target.querySelector('.minus').outerHTML;
        }
        target.innerHTML = plusAndMinus + ' ' + data;
    });
}

function refreshFunctionNumber(target, intSchemaOid) {
    'use strict';
    var plusAndMinus = '';
    getObjectTypeTitle(titleRefreshQuery.functionNumber.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (data) {
        if (target.querySelector('.plus')) {
            plusAndMinus += target.querySelector('.plus').outerHTML;
            plusAndMinus += target.querySelector('.minus').outerHTML;
        }
        target.innerHTML = plusAndMinus + ' ' + data;
    });
}

function refreshOperatorNumber(target, intSchemaOid) {
    'use strict';
    var plusAndMinus = '';
    getObjectTypeTitle(titleRefreshQuery.operatorNumber.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (data) {
        if (target.querySelector('.plus')) {
            plusAndMinus += target.querySelector('.plus').outerHTML;
            plusAndMinus += target.querySelector('.minus').outerHTML;
        }
        target.innerHTML = plusAndMinus + ' ' + data;
    });
}

function refreshSequenceNumber(target, intSchemaOid) {
    'use strict';
    var plusAndMinus = '';
    getObjectTypeTitle(titleRefreshQuery.sequenceNumber.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (data) {
        if (target.querySelector('.plus')) {
            plusAndMinus += target.querySelector('.plus').outerHTML;
            plusAndMinus += target.querySelector('.minus').outerHTML;
        }
        target.innerHTML = plusAndMinus + ' ' + data;
    });
}

function refreshTableNumber(target, intSchemaOid) {
    'use strict';
    var plusAndMinus = '';
    getObjectTypeTitle(titleRefreshQuery.tableNumber.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (data) {
        if (target.querySelector('.plus')) {
            plusAndMinus += target.querySelector('.plus').outerHTML;
            plusAndMinus += target.querySelector('.minus').outerHTML;
        }
        target.innerHTML = plusAndMinus + ' ' + data;
    });
}

function refreshTriggerNumber(target, intSchemaOid) {
    'use strict';
    var plusAndMinus = '';
    getObjectTypeTitle(titleRefreshQuery.triggerNumber.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (data) {
        if (target.querySelector('.plus')) {
            plusAndMinus += target.querySelector('.plus').outerHTML;
            plusAndMinus += target.querySelector('.minus').outerHTML;
        }
        target.innerHTML = plusAndMinus + ' ' + data;
    });
}

function refreshViewNumber(target, intSchemaOid) {
    'use strict';
    var plusAndMinus = '';
    getObjectTypeTitle(titleRefreshQuery.viewNumber.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (data) {
        if (target.querySelector('.plus')) {
            plusAndMinus += target.querySelector('.plus').outerHTML;
            plusAndMinus += target.querySelector('.minus').outerHTML;
        }
        target.innerHTML = plusAndMinus + ' ' + data;
    });
}

function getTables(target, intSchemaOid) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.tables.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (jsnRow, i) {
            return createLevel(3, (i === 0), 'onclick="getScriptForAce(scriptQuery.table.replace(/{{INTOID}}/gim, ' + jsnRow.oid + '));"', jsnRow.name,
                        '<gs-button icononly icon="table" class="button-obj-grid" ' +
                                    'href="data-edit.html?type=table&name=' + jsnRow.schema_name + '.' + jsnRow.name + '"></gs-button>');
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}

function getTriggers(target, intSchemaOid) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.triggers.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (jsnRow, i) {
            return createLevel(3, (i === 0), 'onclick="getScriptForAce(scriptQuery.functionSql.replace(/{{INTOID}}/g, ' + jsnRow.oid + '));"', jsnRow.name);
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}

function getViews(target, intSchemaOid) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.views.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (jsnRow, i) {
            return createLevel(3, (i === 0), 'onclick="getScriptForAce(scriptQuery.view.replace(/{{INTOID}}/gim, ' + jsnRow.oid + '));"', jsnRow.name,
                        '<gs-button icononly icon="table" class="button-obj-grid" ' +
                                    'href="data-edit.html?type=view&name=' + jsnRow.schema_name + '.' + jsnRow.name + '"></gs-button>');
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}

function getSequences(target, intSchemaOid) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.sequences.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (jsnRow, i) {
            // needs CACHE
            return createLevel(3, (i === 0), 'onclick="getScriptForAce(scriptQuery.sequence.replace(/{{INTOID}}/gim, ' + jsnRow.oid + '));"', jsnRow.name);
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}

function getOperators(target, intSchemaOid) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.operators.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (jsnRow, i) {
            return createLevel(3, (i === 0), 'onclick="getScriptForAce(scriptQuery.operator.replace(/{{INTOID}}/gim, ' + jsnRow.oid + '));"', jsnRow.name);
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}

function getFunctions(target, intSchemaOid) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.functions.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (jsnRow, i) {
            return createLevel(3, (i === 0), 'onclick="getScriptForAce(scriptQuery.functionSql.replace(/{{INTOID}}/g, ' + jsnRow.oid + '));"', jsnRow.name);
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}

function getAggregates(target, intSchemaOid) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.aggregates.replace(/\{\{INTOID\}\}/gim, intSchemaOid), function (jsnRow, i) {
            return createLevel(3, (i === 0), 'onclick="getScriptForAce(scriptQuery.aggregate.replace(/{{INTOID}}/g, ' + jsnRow.oid + '));"', jsnRow.name);
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}

function getGroups(target) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.groups, function (jsnRow, i) {
            return createLevel(1, (i === 0), 'onclick="getScriptForAce(scriptQuery.role.replace(/{{INTOID}}/gim, ' + jsnRow.oid + '));"', jsnRow.name);
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}

function getRoles(target) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.roles, function (jsnRow, i) {
            return createLevel(1, (i === 0), 'onclick="getScriptForAce(scriptQuery.role.replace(/{{INTOID}}/gim, ' + jsnRow.oid + '));"', jsnRow.name);
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}




function getCasts(target) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.casts, function (jsnRow, i) {
            return createLevel(2, (i === 0), 'onclick="getScriptForAce(scriptQuery.cast.replace(/{{INTOID}}/gim, ' + jsnRow.oid + '));"', jsnRow.name);
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}

function getLanguages(target) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.languages, function (jsnRow, i) {
            return createLevel(2, (i === 0), 'onclick="getScriptForAce(scriptQuery.language.replace(/{{INTOID}}/gim, ' + jsnRow.oid + '));"', jsnRow.name);
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}

function getExtensions(target) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.extensions, function (jsnRow, i) {
            return createLevel(2, (i === 0), 'onclick=" getScriptForAce(scriptQuery.extension.replace(/{{INTOID}}/g, ' + jsnRow.oid + '));"', jsnRow.name);
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}

function getANSICatalog(target) {
    'use strict';
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        getListForTree(target, listQuery.ANSICatalog, function (jsnRow, i) {
            return createLevel(2, (i === 0), 'onclick="getScriptForAce(scriptQuery.ansi.replace(/{{STRNAME}}/gim, this.lastChild.textContent));"', jsnRow.name);
        });
    } else {
        target.removeAttribute('open');
        closeFolder(target);
    }
}


function getMore(target) {
    'use strict';
    var listContainer = document.getElementById('object-list-container');
    
    target = target.parentNode;
    
    if (!target.hasAttribute('open')) {
        target.setAttribute('open', '');
        
        GS.insertElementAfter(GS.stringToElement(createLevel(1, true,  'onclick="getScriptForAce(scriptQuery.db);"', 'Database')), target);
        GS.insertElementAfter(GS.stringToElement(createLevel(1, false, 'onclick="getANSICatalog(this)"', 'ANSI Catalog', '', true)), target);
        GS.insertElementAfter(GS.stringToElement(createLevel(1, false, 'onclick="getSchemaContents(this, \'\', \'pg_catalog\')"', 'PG Catalog', '', true)), target);
        GS.insertElementAfter(GS.stringToElement(createLevel(1, false, 'onclick="getExtensions(this)"', 'Extensions', '', true)), target);
        GS.insertElementAfter(GS.stringToElement(createLevel(1, false, 'onclick="getLanguages(this)"', 'Languages', '', true)), target);
        GS.insertElementAfter(GS.stringToElement(createLevel(1, false, 'onclick="getCasts(this)"', 'Casts', '', true)), target);
        
    } else {
        target.removeAttribute('open');
        closeFolder(target.children[0]);
    }
}

// custom surgery/dump
function dialogSchemaSurgery(intSchemaOid, strSchemaName) {
    'use strict';
    
    GS.openDialog('dialog-sql-dump', function () {
        document.getElementById('dialog-sql-dump-schema').textContent = strSchemaName;
        
        document.getElementById('schema-dump-change-event-catcher').addEventListener('change', function () {
            var bolSchema, bolFunctions, bolOperators, bolAggregates,
                bolTriggerFunctions, bolSequences, bolTables, bolViews;
            
            bolSchema           = document.getElementById('checkbox-schema-dump-schema').value            === 'true';
            bolFunctions        = document.getElementById('checkbox-schema-dump-functions').value         === 'true';
            bolOperators        = document.getElementById('checkbox-schema-dump-operators').value         === 'true';
            bolAggregates       = document.getElementById('checkbox-schema-dump-aggregates').value        === 'true';
            bolTriggerFunctions = document.getElementById('checkbox-schema-dump-trigger-functions').value === 'true';
            bolSequences        = document.getElementById('checkbox-schema-dump-sequences').value         === 'true';
            bolTables           = document.getElementById('checkbox-schema-dump-tables').value            === 'true';
            bolViews            = document.getElementById('checkbox-schema-dump-views').value             === 'true';
            
            if (!bolSchema && !bolFunctions && !bolOperators && !bolAggregates &&
                !bolTriggerFunctions && !bolSequences && !bolTables && !bolViews) {
                document.getElementById('button-schema-dump').setAttribute('disabled', '');
            } else {
                document.getElementById('button-schema-dump').removeAttribute('disabled');
            }
        });
    }, function (event, strAnswer) {
        var bolDropStatments, bolSchema, bolFunctions, bolOperators, bolAggregates,
            bolTriggerFunctions, bolSequences, bolTables, bolViews, strQuery, handleListResults;
        
        if (strAnswer === 'Download') {
            bolDropStatments    = document.getElementById('checkbox-schema-dump-drop-statements').value   === 'true';
            bolSchema           = document.getElementById('checkbox-schema-dump-schema').value            === 'true';
            bolFunctions        = document.getElementById('checkbox-schema-dump-functions').value         === 'true';
            bolOperators        = document.getElementById('checkbox-schema-dump-operators').value         === 'true';
            bolAggregates       = document.getElementById('checkbox-schema-dump-aggregates').value        === 'true';
            bolTriggerFunctions = document.getElementById('checkbox-schema-dump-trigger-functions').value === 'true';
            bolSequences        = document.getElementById('checkbox-schema-dump-sequences').value         === 'true';
            bolTables           = document.getElementById('checkbox-schema-dump-tables').value            === 'true';
            bolViews            = document.getElementById('checkbox-schema-dump-views').value             === 'true';
            
            // build query for getting all of the lists of objects
            strQuery = '';
            
            if (bolFunctions) {        strQuery += '\n\n' + listQuery.functions.replace(/\{\{INTOID\}\}/gim, intSchemaOid);  }
            if (bolOperators) {        strQuery += '\n\n' + listQuery.operators.replace(/\{\{INTOID\}\}/gim, intSchemaOid);  }
            if (bolAggregates) {       strQuery += '\n\n' + listQuery.aggregates.replace(/\{\{INTOID\}\}/gim, intSchemaOid); }
            if (bolTriggerFunctions) { strQuery += '\n\n' + listQuery.triggers.replace(/\{\{INTOID\}\}/gim, intSchemaOid);   }
            if (bolSequences) {        strQuery += '\n\n' + listQuery.sequences.replace(/\{\{INTOID\}\}/gim, intSchemaOid);  }
            if (bolTables) {           strQuery += '\n\n' + listQuery.tables.replace(/\{\{INTOID\}\}/gim, intSchemaOid);     }
            if (bolViews) {            strQuery += '\n\n' + listQuery.views.replace(/\{\{INTOID\}\}/gim, intSchemaOid);      }
            
            // function to handle the query results
            handleListResults = function (jsnResults) {
                var strDumpQuery = '', strQuery, i, len, tempFunction, handleScriptResults;
                
                // drop statements (reverse order of schema then listed objects)
                if (bolDropStatments) {
                    tempFunction = function (objectType, arrResult) {
                        var strTempQuery = '';
                        
                        for (i = 1, len = arrResult.length; i < len; i += 1) {
                            strTempQuery += 'DROP ' + objectType + ' ' + strSchemaName + '.' + arrResult[i][1] + ';\n';
                        }
                        
                        return strTempQuery;
                    };
                    
                    if (bolViews) {            strDumpQuery += tempFunction('VIEW',      jsnResults.views);      }
                    if (bolTables) {           strDumpQuery += tempFunction('TABLE',     jsnResults.tables);     }
                    if (bolSequences) {        strDumpQuery += tempFunction('SEQUENCE',  jsnResults.sequences);  }
                    if (bolTriggerFunctions) { strDumpQuery += tempFunction('FUNCTION',  jsnResults.triggers);   }
                    if (bolAggregates) {       strDumpQuery += tempFunction('AGGREGATE', jsnResults.aggregates); }
                    if (bolOperators) {        strDumpQuery += tempFunction('OPERATOR',  jsnResults.operators);  }
                    if (bolFunctions) {        strDumpQuery += tempFunction('FUNCTION',  jsnResults.functions);  }
                    
                    if (bolSchema) {
                        strDumpQuery += 'DROP SCHEMA ' + strSchemaName + ';\n\n\n';
                    }
                }
                
                // load querys for:
                //      schema
                //      listed objects
                tempFunction = function (arrResult, query) {
                    var strTempQuery = '';
                    
                    for (i = 1, len = arrResult.length; i < len; i += 1) {
                        strTempQuery += '\n\n' + query.replace(/\{\{INTOID\}\}/gim, arrResult[i][0]);
                    }
                    
                    return strTempQuery;
                };
                strQuery = '';
                if (bolSchema) {           strQuery += '\n\n' + scriptQuery.schemaSql.replace(/\{\{INTOID\}\}/gim, intSchemaOid); }
                if (bolFunctions) {        strQuery += tempFunction(jsnResults.functions,  scriptQuery.functionSql); }
                if (bolOperators) {        strQuery += tempFunction(jsnResults.operators,  scriptQuery.operator);    }
                if (bolAggregates) {       strQuery += tempFunction(jsnResults.aggregates, scriptQuery.aggregate);   }
                if (bolTriggerFunctions) { strQuery += tempFunction(jsnResults.triggers,   scriptQuery.functionSql); }
                if (bolSequences) {        strQuery += tempFunction(jsnResults.sequences,  scriptQuery.sequence);    }
                if (bolTables) {           strQuery += tempFunction(jsnResults.tables,     scriptQuery.table);       }
                if (bolViews) {            strQuery += tempFunction(jsnResults.views,      scriptQuery.view);        }
                
                handleScriptResults = function (arrResults) {
                    var i, len;
                    
                    //console.log(arrResults);
                    
                    for (i = 0, len = arrResults.length; i < len; i += 1) {
                        strDumpQuery += arrResults[i][1][0] + '\n\n';
                    }
                    
                    editor.setValue(strDumpQuery);
                    editor.resize();
                };
                
                if (strQuery) {
                    getListsForDump(strQuery, handleScriptResults);
                } else {
                    handleScriptResults([]);
                }
            };
            
            // load lists of objects to download
            if (strQuery) {
                getListsForDump(strQuery, function (arrResults) {
                    var index = 0, jsnResults = {};
                    
                    if (bolFunctions) {        jsnResults.functions = arrResults[index];  index += 1; }
                    if (bolOperators) {        jsnResults.operators = arrResults[index];  index += 1; }
                    if (bolAggregates) {       jsnResults.aggregates = arrResults[index]; index += 1; }
                    if (bolTriggerFunctions) { jsnResults.triggers = arrResults[index];   index += 1; }
                    if (bolSequences) {        jsnResults.sequences = arrResults[index];  index += 1; }
                    if (bolTables) {           jsnResults.tables = arrResults[index];     index += 1; }
                    if (bolViews) {            jsnResults.views = arrResults[index];      index += 1; }
                    
                    handleListResults(jsnResults);
                });
            } else {
                handleListResults({});
            }
        }
    });
}



