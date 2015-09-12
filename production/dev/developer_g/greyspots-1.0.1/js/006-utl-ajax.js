

window.addEventListener('design-register-element', function () {
    var strNormalCallbackContent = '    if (!error) {\n' +
                                   '        $0\n' +
                                   '    } else {\n' +
                                   '        GS.ajaxErrorDialog(data);\n' +
                                   '    }\n';
    
    registerDesignSnippet('JSON Ajax', 'JSON Ajax', 'GS.ajaxJSON(\'/v1/${1:cluster}/${2:test.action_ship}\', \'${3:action=ship&id=}\', function (data, error) {\n' +
                                                        strNormalCallbackContent +
                                                    '});');
    registerDesignSnippet('GS.ajaxJSON', 'GS.ajaxJSON', 'GS.ajaxJSON(\'/v1/${1:cluster}/${2:test.action_ship}\', \'${3:action=ship&id=}\', function (data, error) {\n' +
                                                            strNormalCallbackContent +
                                                        '});');
    
    
    registerDesignSnippet('TEXT Ajax', 'TEXT Ajax', 'GS.ajaxText(\'/v1/${1:cluster}/${2:test.action_description}\', \'${3:action=get&id=}\', function (data, error) {\n' +
                                                        strNormalCallbackContent +
                                                    '});');
    registerDesignSnippet('GS.ajaxText', 'GS.ajaxText', 'GS.ajaxText(\'/v1/${1:cluster}/${2:test.action_description}\', \'${3:action=get&id=}\', function (data, error) {\n' +
                                                            strNormalCallbackContent +
                                                        '});');
    
    registerDesignSnippet('PG FUNCTION AJAX', 'PG FUNCTION AJAX', 'GS.ajaxJSON(\'/v1/${1:cluster}/${2:test.action_ship}\', \'${3:action=ship&id=}\', function (data, error) {\n' +
                                                  strNormalCallbackContent +
                                              '});');
    
    registerDesignSnippet('ENV SELECT AJAX', 'ENV SELECT AJAX', 'GS.ajaxJSON(\'/v1/env/action_select\', \'view=${1:test.tpeople}&where=&order_by=&limit=&offset=\', function (data, error) {\n' +
                                                                    strNormalCallbackContent +
                                                                '});');
    
    registerDesignSnippet('ENV UPDATE AJAX', 'ENV UPDATE AJAX', 'GS.ajaxJSON(\'/v1/env/action_update\', \'view=${1:test.tpeople}\' +\n' +
                                                                '                                        \'&where=\' + encodeURIComponent(\'id=\' + ${2:strID} + \'&change_stamp=\' + ${3:strChangeStamp}) +\n' +
                                                                '                                        \'&column=${4:first_name}&value=\' + encodeURIComponent(${5:newValue}), function (data, error) {\n' +
                                                                    strNormalCallbackContent +
                                                                '});');
    
    registerDesignSnippet('ENV INSERT AJAX', 'ENV INSERT AJAX', 'GS.ajaxJSON(\'/v1/env/action_insert\', \'view=${1:test.tpeople}&data=\' + encodeURIComponent(${2:strInsertString}), function (data, error) {\n' +
                                                                    strNormalCallbackContent +
                                                                '});');
    
    registerDesignSnippet('ENV DELETE AJAX', 'ENV DELETE AJAX', 'GS.ajaxJSON(\'/v1/env/action_delete\', \'view=${1:test.tpeople}&id=\' + ${2:strIDs}, function (data, error) {\n' +
                                                                    strNormalCallbackContent +
                                                                '});');
    
    registerDesignSnippet('GS.ajaxErrorDialog', 'GS.ajaxErrorDialog', 'GS.ajaxErrorDialog(data,\n' +
              '                   function () {\n' +
              '                       // Try Again Button Callback\n' +
              '                       // delete this function if you dont want a try again button\n' +
              '                   },\n' +
              '                   function () {\n' +
              '                       // Cance Button Callback\n' +
              '                       // if you dont need to do anything when the cancel button is clicked: delete this function\n' +
              '                   });');
    
    registerDesignSnippet('GS.dataFetch', 'GS.dataFetch', 
            'function getData(bolClearPrevious) {\n' +
            '    var data, strLink, dataResultHandler, dataEventFunction;\n' +
            '    \n' +
            '    // create function that will use the data\n' +
            '    dataResultHandler = function (data, error) {\n' +
            '        \n' +
            '    };\n' +
            '    \n' +
            '    // save data from request or\n' +
            '    //     start ajax if it hasn\'t already gotten the data yet or\n' +
            '    //     start new ajax if bolClearPrevious is true\n' +
            '    data = GS.dataFetch(strLink, bolClearPrevious);\n' +
            '    \n' +
            '    // if this request already has been completed\n' +
            '    if (data) {\n' +
            '        // handle result\n' +
            '        dataResultHandler(data.response, data.error);\n' +
            '    } else {\n' +
            '        dataEventFunction = function (event) {\n' +
            '            // unbind data event function\n' +
            '            document.removeEventListener(\'dataready_\' + encodeURIComponent(strLink), dataEventFunction);\n' +
            '            \n' +
            '            // handle result\n' +
            '            dataResultHandler(event.detail.response, event.detail.error);\n' +
            '        };\n' +
            '        \n' +
            '        // bind data event function\n' +
            '        document.addEventListener(\'dataready_\' + encodeURIComponent(strLink), dataEventFunction);\n' +
            '    }\n' +
            '}');
    
});

(function () {
    function ajaxCheckJSONResponseForError(request) {
        'use strict';
        var jsnTemp;
        
        if (request.responseJSON) {
            if (request.responseJSON.stat === false) {
                return true;
            }
        } else {
            return true;
        }
        
        return false;
    }
    
    function ajaxNormalizeError (request, bolFrontEndTimeout) {
        'use strict';
        var response = request.response, jsnTemp, jsnRet = {
            'error_title': '',
            'error_hint': '',
            'error_text': '',
            'error_file': '',
            'error_context': '',
            'original_response': response
        };
        
        // get error title and error hint
        if (request.bolFrontEndTimeout === true) {
            jsnRet.error_text = 'Front-end Timeout Reached';
            jsnRet.error_title = 'Front-end Timeout Reached';
            jsnRet.error_hint = 'This request took too long. Please report this to a system administrator.';
            
        } else if (response.status === 403) {
            jsnRet.error_title = '403 Link Is Forbidden';
            jsnRet.error_hint = 'You have no permission to use this link. If you need this link contact a system administrator and request permission for this link.';
            
        } else if (response.status === 404) {
            jsnRet.error_title = '404 Link Could Not Be Found';
            jsnRet.error_hint = 'This link does not exist. Please report this to a system administrator.';
            
        } else if (response.status === 408) {
            jsnRet.error_title = '408 Request Took Too Long';
            jsnRet.error_hint = 'This link is broken. Please report this to a system administrator.';
            
        } else if (response.status === 500) {
            jsnRet.error_title = '500 Internal Server Error';
            jsnRet.error_hint = 'This call to the server failed. Please report this to a system administrator.';
            
        } else if (response.status === 502) {
            jsnRet.error_title = '502 Bad Gateway';
            jsnRet.error_hint = 'This link is broken. Please report this to a system administrator.';
            
        } else if (response.status === 504) {
            jsnRet.error_title = '504 Gateway Timeout';
            jsnRet.error_hint = 'This link is broken. Please report this to a system administrator.';
        }
        
        // get error text
        try {
            jsnTemp = JSON.parse((response.responseText || response)).dat;
            
            jsnRet.error_text = jsnTemp.error;
            jsnRet.error_file = jsnTemp.filename;
            jsnRet.error_context = jsnTemp.context;
            
            if (!jsnRet.error_text) {
                jsnRet.error_text = JSON.parse((response.responseText || response)).dat;
            }
        } catch (err) {
            if (response) {
                jsnRet.error_text = response.responseText || JSON.stringify(response);
            } else {
                jsnRet.error_text = jsnRet.error_text || response;
            }
        }
        
        jsnRet.error_file = jsnRet.error_file || '';
        
        return jsnRet;
    }
    
    GS.ajaxJSON = function (strLink, strParams, callback, intTimeout) {
        'use strict';
        var request = new XMLHttpRequest();
        
        callback = callback || function () {};
        
        request.onreadystatechange = function() {
            var normalizedError;
            
            if (request.readyState === 4) {
                try {
                    request.responseJSON = JSON.parse(request.responseText || request.response);
                } catch (e) {
                    //throw e;
                }
                
                if (!ajaxCheckJSONResponseForError(request)) {
                    callback(request.responseJSON);
                    
                } else {
                    normalizedError = ajaxNormalizeError(request);
                    
                    // if session error: have the user log back in and refresh
                    if (normalizedError.error_text.indexOf('Session expired') === 0 && strLink.indexOf('action_info') === -1) {
                        GS.normalUserLogin(function (data) {
                            if (window.location.hostname.substring(0, window.location.hostname.indexOf('.')) !== (request.responseJSON.dat.default_subdomain)) {
                                GS.superUserLogin(function () {
                                    window.location.reload();
                                });
                            } else {
                                window.location.reload();
                            }
                        }, '', request.responseJSON.dat.default_subdomain);
                        
                    // else: callback with normalized error
                    } else {
                        callback(normalizedError, 'error');
                    }
                }
            }
        };
        
        request.open('POST', strLink + '?anticache=' + ((new Date()).getMilliseconds() + Math.floor(Math.random() * 1e9)), true);
        request.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=UTF-8');
        request.send(strParams);
        
        // if intTimeout has been set: start a timer to abort
        if (typeof intTimeout === 'number') {
            if (request && request.readyState !== 4) {
                setTimeout(function() {
                    request.bolFrontEndTimeout = true;
                    request.abort();
                }, intTimeout);
            }
        }
        
        return request;
    };
    
    GS.ajaxText = function (strLink, strParams, callback) {
        'use strict';
        var request = new XMLHttpRequest();
        
        callback = callback || function () {};
        
        request.onreadystatechange = function() {
            var normalizedError;
            
            if (request.readyState === 4) {
                if (request.status === 200) {
                    callback(request.responseText);
                    
                } else {
                    normalizedError = ajaxNormalizeError(request);
                    
                    // if session error: have the user log back in and refresh
                    if (normalizedError.error_text.indexOf('Session expired') === 0 && strLink.indexOf('action_info') === -1) {
                        GS.normalUserLogin(function (data) {
                            if (window.location.hostname.substring(0, window.location.hostname.indexOf('.')) !== (data.default_domain || data.default_subdomain)) {
                                GS.superUserLogin(function () {
                                    window.location.reload();
                                });
                            } else {
                                window.location.reload();
                            }
                        }); //, '', JSON.parse(request.responseText || request.response).dat.default_subdomain
                        
                    // else: callback with normalized error
                    } else {
                        callback(normalizedError, 'error');
                    }
                }
            }
        };
        
        request.open('POST', strLink + '?anticache=' + ((new Date()).getMilliseconds() + Math.floor(Math.random() * 1e9)), true);
        request.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=UTF-8');
        request.send(strParams);
        
        // if intTimeout has been set: start a timer to abort
        if (typeof intTimeout === 'number') {
            if (request && request.readyState !== 4) {
                setTimeout(function() {
                    request.bolFrontEndTimeout = true;
                    request.abort();
                }, intTimeout);
            }
        }
        
        return request;
    };
})();

GS.ajaxErrorDialog = function (jsnError, tryAgainCallback, cancelCallback) {
    'use strict';
    var templateElement = document.createElement('template'), strHTML;
    
    templateElement.setAttribute('data-theme', 'error');
    strHTML = ml(function () {/*
        <gs-page>
            <gs-header><center><h3>There was an error!</h3></center></gs-header>
            <gs-body padded>
                {{HTML}}
            </gs-body>
            <gs-footer>{{BUTTONS}}</gs-footer>
        </gs-page>
    */}).replace('{{HTML}}',
                    '<pre style="white-space: pre-wrap;">' +
                        'There was an error:' +
                        (jsnError.error_text    ? '<br /><br />' + jsnError.error_text                          : '') +
                        (jsnError.error_file    ? '<br /><br />The error was on file: '  +  jsnError.error_file : '') +
                        (jsnError.error_hint    ? '<br /><br />' + jsnError.error_hint                          : '') +
                        (jsnError.error_context ? '<br /><br />' + jsnError.error_context                       : '') +
                        (jsnError.error_addin   ? '<br /><br />' + jsnError.error_addin                         : '') +
                    '</pre>');
    
    if (typeof tryAgainCallback === 'function') {
        templateElement.innerHTML = strHTML.replace('{{BUTTONS}}',  '<gs-grid>' +
                                                                    '  <gs-block><gs-button dialogclose>Cancel</gs-button></gs-block>' +
                                                                    '  <gs-block><gs-button dialogclose>Try Again</gs-button></gs-block>' +
                                                                    '</gs-grid>');
        GS.openDialog(templateElement, '', function (event, strAnswer) {
            if (strAnswer === 'Try Again') {
                tryAgainCallback(strAnswer);
            } else {
                if (typeof cancelCallback === 'function') {
                    cancelCallback(strAnswer);
                }
            }
        });
        
    } else {
        templateElement.innerHTML = strHTML.replace('{{BUTTONS}}',  '<gs-button dialogclose>Ok</gs-button>');
        GS.openDialog(templateElement);
    }
};

/*

var strLink = '/v1/env/action_select?view=wtkv2.ttime&where=user_name%20%3D%20\'michael%40tocci.org\'&offset=0&limit=25&order_by=id%20DESC&header=true';

document.addEventListener('dataready_' + encodeURIComponent(strLink), function (event) {
    console.log(event);
});f

dataFetch(strLink, false);

*/

if (GS.dataLedger === undefined) {
    GS.dataLedger = {};
}

GS.dataFetch = function (strLink, bolClearPrevious) {
    'use strict';
    var arrLinkParts = strLink.split('?'), strId = encodeURIComponent(strLink);
    
    // if something wants to fetch data where the id does not already exist then do an ajax call 
    if (GS.dataLedger[strId] === undefined || bolClearPrevious === true) {
        
        GS.dataLedger[strId] = {'status': 'waiting', 'response': ''};
        
        GS.ajaxJSON(arrLinkParts[0], arrLinkParts[1] || '', function (data, error) {
            var event; // The custom event that will be created
            
            if (document.createEvent) {
                event = document.createEvent('HTMLEvents');
                event.initEvent('dataready_' + strId, true, true);
                event.eventName = 'dataready_' + strId;
            } else {
                event = document.createEventObject();
                event.eventType = 'dataready_' + strId;
                event.eventName = 'dataready_' + strId;
            }
            
            if (!error) {
                GS.dataLedger[strId].response = (data.dat !== undefined ? data.dat : data);
                GS.dataLedger[strId].status = 'finished';
                
                event.detail = {'response': GS.dataLedger[strId].response};
                
            } else {
                GS.dataLedger[strId].data = data;
                GS.dataLedger[strId].status = 'error';
                GS.dataLedger[strId].error = 'error';
                
                event.detail = {'response': data, 'error': 'error'};
            }
            
            if (document.createEvent) {
                document.dispatchEvent(event);
            } else {
                document.fireEvent('on' + event.eventType, event);
            }
        });
        
        return '';
    }
    
    if (GS.dataLedger[strId].status === 'finished' || GS.dataLedger[strId].status === 'error') {
        return GS.dataLedger[strId];
    }
    
    return '';
};