var arrLoopID = [], dteLastTransactionDate, bolLastTransationErrorOccured;

function setDrawerHeight(strSize) {
    document.getElementById('button-drawer-height-small').removeAttribute('selected');
    document.getElementById('button-drawer-height-half').removeAttribute('selected');
    document.getElementById('button-drawer-height-full').removeAttribute('selected');
    
    document.getElementById('button-drawer-height-' + strSize).setAttribute('selected', '');
    
    document.body.classList.remove('results-small');
    document.body.classList.remove('results-half');
    document.body.classList.remove('results-full');
    
    document.body.classList.add('results-' + strSize);
    
    editor.resize();
}

function resultFinish(bolInterrupted) {
    var hour = dteLastTransactionDate.getHours(),
        timestamp = (dteLastTransactionDate.getMonth() + 1) + '-' +
                    dteLastTransactionDate.getDate() + '-' +
                    dteLastTransactionDate.getFullYear() + ' ' +
                    (hour > 12 ? hour - 12 : hour) + ':' +
                    GS.leftPad(dteLastTransactionDate.getMinutes(), '0', 2) +
                    (hour > 12 ? ' PM' : ' AM'),
        arrElement, i, len;
    
    if (bolLastTransationErrorOccured === false) {
        document.getElementById('results-title').innerHTML = 'Results: ' +
                                                '<span class="transaction_committed">Transaction committed</span> (' + timestamp + ')';
        document.getElementById('results-pane').classList.add('success');
        document.getElementById('results-pane').classList.remove('error');
        document.getElementById('results-pane').classList.remove('loading');
    } else {
        document.getElementById('results-title').innerHTML = 'Results: ' +
                                                '<span class="transaction_aborted">Transaction aborted</span> (' + timestamp + ')';
        document.getElementById('results-pane').classList.add('error');
        document.getElementById('results-pane').classList.remove('success');
        document.getElementById('results-pane').classList.remove('loading');
    }
    
    if (bolInterrupted) {
        document.getElementById('results-title').innerHTML += ' (Result Loading Interrupted)';
    }
    
    // make tables selectable and copyable
    arrElement = xtag.query(document.getElementById('results'), 'table');
    
    //console.log(arrElement, document.getElementById('results').innerHTML);
    
    for (i = 0, len = arrElement.length; i < len; i += 1) {
        GS.makeTableSelectable(arrElement[i]);
    }
}

function stopResultLooper() {
    var i, len;
    
    for (i = 0, len = arrLoopID.length; i < len; i += 1) {
        clearTimeout(arrLoopID[i]);
    }
    
    arrLoopID = [];
    
    resultFinish(true);
}

function resultLooper(targetElement, data, intLoop, bolLargestQuery, intLoopID) {
    var i, len, col_i, col_len, html, intBatchSize = 100, intTimeLength = 500;
    
    i = (intLoop * intBatchSize) + 2;
    
    len = i + intBatchSize;
    if (len > data.length) {
        len = data.length;
    }
    
    //console.log(targetElement, i, len);
    for (html = ''; i < len; i += 1) {
        html += '<tr>' +
                    '<th>' + (i - 1) + '</th>';
        
        for (col_i = 0, col_len = data[i].length; col_i < col_len; col_i += 1) {
            html += '<td><pre>' + encodeHTML(data[i][col_i]) + '</pre></td>';
        }
        
        html += '</tr>';
    }
    
    targetElement.innerHTML += html;
    
    //console.log('1***', bolLargestQuery, i < data.length - 1);
    arrLoopID.splice(arrLoopID.indexOf(intLoopID), 1);
    
    if (i < data.length - 1) {
        intLoopID = setTimeout(function() {
            resultLooper(targetElement, data, intLoop + 1, bolLargestQuery, intLoopID);
        }, intTimeLength);
        
        arrLoopID.push(intLoopID);
        
    } else if (bolLargestQuery) {
        //console.log('2***');
        resultFinish();
    }
}

function runSQL() {
    'use strict';
    var editorSelectionRange = editor.getSelectionRange(), strQuery = editor.getValue(),
        intStart = 0, intEnd = 0, i, len, arrLines, strRunQuery;
    
    if (editorSelectionRange.start.row !== editorSelectionRange.end.row ||
        editorSelectionRange.start.column !== editorSelectionRange.end.column) {
        
        arrLines = strQuery.split('\n');
        
        for (i = 0, len = arrLines.length; i < len; i += 1) {
            
            if (i < editorSelectionRange.start.row) {
                intStart += arrLines[i].length + 1;
            }
            if (i < editorSelectionRange.end.row) {
                intEnd += arrLines[i].length + 1;
            }
            
            if (i === editorSelectionRange.start.row) {
                intStart += editorSelectionRange.start.column;
            }
            if (i === editorSelectionRange.end.row) {
                intEnd += editorSelectionRange.end.column;
            }
            if (i > editorSelectionRange.end.row) {
                break;
            }
        }
        
        strRunQuery = strQuery.substring(intStart, intEnd);
    } else {
        strRunQuery = strQuery;
    }
    
    document.getElementById('results').innerHTML = '';
    document.getElementById('results-title').innerHTML = 'Running Query... ' +
                                                         '<gs-button onclick="dialogProcess()" inline>Process Manager</gs-button>';
    
    document.getElementById('results-pane').classList.remove('error');
    document.getElementById('results-pane').classList.remove('success');
    document.getElementById('results-pane').classList.add('fetching');
    document.getElementById('results-pane').classList.remove('loading');
    
    if (!(document.body.classList.contains('results-small') ||
        document.body.classList.contains('results-half') ||
        document.body.classList.contains('results-full'))) {
        setDrawerHeight('small');
    }
    document.body.classList.add('results-show');
    
    editor.resize();
    
    document.body.focus();
    GS.ajaxJSON('/v1/sql', strRunQuery, function (data, ajaxError) {
        var i, len, notice_i, notice_len, error_i, error_len, row_i, row_len, col_i, col_len, error_message,
            html = '', error = false, annotations = [], full_text = editor.getValue(), text = '', arrLines = full_text.split('\n'),
            error_line = 0, intSelectionLineOffset = 0, intPreviousQueryOffset = 0, element, intLongestResult, intLongestResultIndex,
            bolResultFound = false, resultsContainer = document.getElementById('results');
        
        dteLastTransactionDate = new Date();
        bolLastTransationErrorOccured = false;
        
        document.getElementById('results-title').innerHTML = 'Loading Results... ' +
                                                             '<gs-button onclick="stopResultLooper()" inline>Stop</gs-button>';
        
        document.getElementById('results-pane').classList.remove('error');
        document.getElementById('results-pane').classList.remove('success');
        document.getElementById('results-pane').classList.remove('fetching');
        document.getElementById('results-pane').classList.add('loading');
        
        if (!ajaxError) {
            if (editorSelectionRange.start.row !== editorSelectionRange.end.row ||
                editorSelectionRange.start.column !== editorSelectionRange.end.column) {
                
                intSelectionLineOffset = editorSelectionRange.start.row;
            }
            
            //console.log(data, error);
            
            if (data.dat.error === undefined) {
                for (i = 0, len = data.dat.length; i < len; i = i + 1) {
                    error_line = (data.dat[i].sql.substring(0, data.dat[i].err_pos).match(/\n/g) || []).length;
                    
                    if (data.dat[i].type === 'error') {
                        error = true;
                        
                        //console.log(data.dat[i].sql, intPreviousQueryOffset, data.dat[i].err_pos,
                        //            (data.dat[i].sql.substring(0, data.dat[i].err_pos).match(/\n/g) || []).length);
                        
                        annotations.push({"row": error_line + intPreviousQueryOffset + intSelectionLineOffset, "column": data.dat[i].err_pos, "text": data.dat[i].error, "type": "error"});
                        
                        editor.gotoLine(1 + error_line + intPreviousQueryOffset + intSelectionLineOffset, data.dat[i].err_pos, true);
                    }
                    
                    intPreviousQueryOffset += error_line;// + 1;
                }
                
                editor.getSession().setAnnotations(annotations);
            }
            
            intLongestResult = -1;
            for (i = 0, len = data.dat.length; i < len; i += 1) {
                if (data.dat[i].type === 'result' && data.dat[i].content.length > intLongestResult) {
                    intLongestResult = data.dat[i].content.length;
                    intLongestResultIndex = i;
                    bolResultFound = true;
                }
            }
            
            for (i = 0, len = data.dat.length; i < len; i += 1) {
                if (i > 0) {
                    resultsContainer.appendChild(document.createElement('hr'));
                }
                
                if (len > 1) {
                    element = document.createElement('h3');
                    element.textContent = 'Query #: ' + (i + 1);
                    resultsContainer.appendChild(element);
                }
                
                if (data.dat[i].notice) {
                    for (notice_i = 0, notice_len = data.dat[i].notice.length; notice_i < notice_len; notice_i += 1) {
                        element = document.createElement('h4');
                        element.textContent = data.dat[i].notice[notice_i];
                        resultsContainer.appendChild(element);
                    }
                }
                
                if (data.dat[i].type === 'rows') {
                    if (data.dat[i].content <= 0) {
                        resultsContainer.appendChild(document.createElement('br'));
                        element = document.createElement('div');
                        element.textContent = 'Command executed successfully with no rows affected.';
                        resultsContainer.appendChild(element);
                        
                    } else if (data.dat[i].content === 1) {
                        resultsContainer.appendChild(document.createElement('br'));
                        element = document.createElement('div');
                        element.textContent = 'Command executed successfully with 1 row affected.';
                        resultsContainer.appendChild(element);
                        
                    } else {
                        resultsContainer.appendChild(document.createElement('br'));
                        element = document.createElement('div');
                        element.textContent = 'Command executed successfully with ' + encodeHTML(data.dat[i].content) + ' rows affected.';
                        resultsContainer.appendChild(element);
                    }
    
                } else if (data.dat[i].type === 'result') {
                    
                    html =  '<div class="table" allow-text-selection>' +
                                '<table>' +
                                    '<thead>' +
                                        '<tr>' +
                                            '<th>#</th>';
                    
                    for (col_i = 0, col_len = data.dat[i].content[0].length; col_i < col_len; col_i += 1) {
                        html +=             '<th>' +
                                                '<b>' + encodeHTML(data.dat[i].content[0][col_i]) + '</b>' +
                                                '<h5>' + encodeHTML(data.dat[i].content[1][col_i]) + '</h5>' +
                                            '</th>';
                    }
                    
                    html +=             '</tr>' +
                                    '</thead>' +
                                    '<tbody>' +
                                    '</tbody>' +
                                '</table>' +
                            '</div>';
                    
                    element = GS.stringToElement(html);
                    
                    resultsContainer.appendChild(element);
                    
                    resultLooper(xtag.query(element, 'tbody')[0], data.dat[i].content, 0, i === intLongestResultIndex);
                    
                } else if (data.dat[i].type === 'error') {
                    bolLastTransationErrorOccured = true;
                    
                    resultsContainer.appendChild(document.createElement('br'));
                    resultsContainer.appendChild(document.createElement('br'));
                    
                    html  = '<div class="error">' +
                                '<h4 class="error_red">ERROR: ' + encodeHTML(data.dat[i].error) + '</h4>' +
                                '<br />';
                    
                    error_message = '<div class="error_text">';
                    
                    for (error_i = 0, error_len = data.dat[i].sql.length; error_i < error_len; error_i += 1) {
                        if (error_i === Number(data.dat[i].err_pos) - 1) {
                            error_message += '<span class="error_start">&gt;&gt;</span>';
                        }
                        error_message += encodeHTML(data.dat[i].sql[error_i]);
                    }
                    
                    html += error_message + '</div><br /><br />';
                    
                    html +=     '<h4>CONTEXT: ' + encodeHTML(data.dat[i].context) + '</h4>' +
                                '<h4>DETAIL: ' + encodeHTML(data.dat[i].detail) + '</h4>' +
                                '<h4>HINT: ' + encodeHTML(data.dat[i].hint) + '</h4>' +
                            '</div>';
                    
                    resultsContainer.appendChild(GS.stringToElement(html));
                }
            }
            
            if (!bolResultFound) {
                resultFinish();
            }
            
            editor.resize();
            
        } else {
            GS.ajaxErrorDialog(data, function () {
                runSQL();
            });
        }
    });
}

function refreshProcessList() {
    var strQuery = 'SELECT datname, pid, usename, client_addr, client_port, query_start, waiting, state, query\n' +
                   '  FROM pg_stat_activity;';
    
    GS.addLoader(document.getElementById('process-container'), 'Getting Process List...');
    GS.ajaxJSON('/v1/sql', strQuery, function (response, error) {
        var i, len, strHTML, data;
        
        GS.removeLoader(document.getElementById('process-container'));
        
        if (!error) {
            data = response.dat[0].content;
            
            for (i = 2, len = data.length, strHTML = ''; i < len; i += 1) {
                if (data[i][8] !== strQuery) {
                    strHTML +=  '<tr>' +
                                    '<td>' + encodeHTML(data[i][0]) + '</td>' +
                                    '<td>' + encodeHTML(data[i][1]) + '</td>' +
                                    '<td>' + encodeHTML(data[i][2]) + '</td>' +
                                    '<td>' + encodeHTML(data[i][3]) + '</td>' +
                                    '<td>' + encodeHTML(data[i][4]) + '</td>' +
                                    '<td>' + encodeHTML(data[i][5]) + '</td>' +
                                    '<td>' + encodeHTML(data[i][6]) + '</td>' +
                                    '<td>' + encodeHTML(data[i][7]) + '</td>' +
                                    '<td><pre>' + encodeHTML(data[i][8]) + '</pre></td>' +
                                    '<td><gs-button onclick="stopProcess(' + encodeHTML(data[i][1]) + ')">Kill</gs-button></td>' +
                                '</tr>';
                }
            }
            
            //console.log(strHTML);
            
            document.getElementById('process-container').innerHTML = '<table>' +
                                                                            '<thead>' +
                                                                                '<tr>' +
                                                                                    '<th>DB</th>' +
                                                                                    '<th>PID</th>' +
                                                                                    '<th>User</th>' +
                                                                                    '<th>Client Address</th>' +
                                                                                    '<th>Client Port</th>' +
                                                                                    '<th>Query Start</th>' +
                                                                                    '<th>Waiting</th>' +
                                                                                    '<th>State</th>' +
                                                                                    '<th>Query Text</th>' +
                                                                                    '<th></th>' +
                                                                                '</tr>' +
                                                                            '</thead>' +
                                                                            '<tbody>' +
                                                                                strHTML +
                                                                            '</tbody>' +
                                                                     '</table>';
            document.getElementById('process-container').style.minHeight = '';
            
        } else {
            GS.ajaxErrorDialog(response);
        }
    });
}

function dialogProcess() {
    'use strict';
    var templateElement = document.createElement('template');
    
    templateElement.setAttribute('data-mode', 'constrained');
    templateElement.setAttribute('data-max-width', '900px');
    templateElement.innerHTML = ml(function () {/*
        <gs-page>
            <gs-header><center><h3>Process Manager</h3></center></gs-header>
            <gs-body padded>
                <div id="process-container" style="min-height: 7em; position: relative;"></div>
            </gs-body>
            <gs-footer><gs-button dialogclose>Done</gs-button></gs-footer>
        </gs-page>
    */});
    
    GS.openDialog(templateElement, function () {
        refreshProcessList();
    });
}

function stopProcess(intPID) {//element, 
    //console.log(intPID);
    
    GS.addLoader(document.getElementById('process-container'), 'Getting Process List...');
    GS.ajaxJSON('/v1/sql', 'SELECT pg_cancel_backend(' + intPID + ');', function (response, error) {
        var templateElement = document.createElement('template');
        
        GS.removeLoader(document.getElementById('process-container'));
        
        if (!error) {
            if (response.dat[0].type === 'error') {
                templateElement.setAttribute('data-theme', 'error');
                templateElement.innerHTML = ml(function () {/*
                    <gs-page>
                        <gs-header><center><h3>Error</h3></center></gs-header>
                        <gs-body padded>
                            {{ERROR}}
                        </gs-body>
                        <gs-footer><gs-button dialogclose>Done</gs-button></gs-footer>
                    </gs-page>
                */}).replace('{{ERROR}}', encodeHTML(response.dat[0].error));
                
                GS.openDialog(templateElement);
            }
            
            refreshProcessList();
            
        } else {
            GS.ajaxErrorDialog(response);
        }
    });
}
