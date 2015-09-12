
window.addEventListener('design-register-element', function () {
    'use strict';
    // websockets have not been built into Envelope yet when they are uncomment these snippets
    
    //var strNormalCallbackContent = '    if (!error) {\n' +
    //                               '        $0\n' +
    //                               '    } else {\n' +
    //                               '        GS.webSocketErrorDialog(data);\n' +
    //                               '    }\n';
    //
    //registerDesignSnippet('Open WebSocket', 'Open WebSocket',
    //        'GS.openWebSocket(\'/v1/${1:cluster}/${2:test.tpeople}\', function (data, error) {\n' +
    //            strNormalCallbackContent +
    //        '}, function (data, error) {\n' +
    //            strNormalCallbackContent +
    //        '});');
    //
    //registerDesignSnippet('GS.openWebSocket', 'GS.openWebSocket',
    //        'openWebSocket(\'/v1/${1:cluster}/${2:test.tpeople}\', function (data, error) {\n' +
    //            strNormalCallbackContent +
    //        '}, function (data, error) {\n' +
    //            strNormalCallbackContent +
    //        '});');
});

(function () {
    'use strict';
    function webSocketNormalizeError(data) {
        var jsnRet = {
            'error_title': '',
            'error_hint': '',
            'error_text': '',
            'original_data': data
        };
        
        data = data || {};
        
        // get error title and error hint
        if (data.code === 1001) {
            jsnRet.error_title = 'Going Away';
            jsnRet.error_hint = 'The server or client closed the connection because of server shutdown or navigating away from the page.';
            
        } else if (data.code === 1002) {
            jsnRet.error_title = 'Protocol';
            jsnRet.error_hint = 'The connection was closed because of error related to the protocol used.';
            
        } else if (data.code === 1003) {
            jsnRet.error_title = 'Unsupported Data';
            jsnRet.error_hint = 'The connection was closed because the data that was received was not it a supported format.';
            
        } else if (data.code === 1005) {
            jsnRet.error_title = 'No Status Received';
            jsnRet.error_hint = 'The connection was closed because it received an empty status.';
            
        } else if (data.code === 1006) {
            jsnRet.error_title = 'Abnormal Closure';
            jsnRet.error_hint = 'The connection was closed because of abnormal circumstances.';
            
        } else if (data.code === 1007) {
            jsnRet.error_title = 'Invalid Payload Data';
            jsnRet.error_hint = 'The connection was closed because the payload type did not match the defined message type.';
            
        } else if (data.code === 1008) {
            jsnRet.error_title = 'Policy Violation';
            jsnRet.error_hint = 'The connection was closed because policy governing this connection was violated.';
            
        } else if (data.code === 1009) {
            jsnRet.error_title = 'Message Too Big';
            jsnRet.error_hint = 'The connection was closed because the message was too long for it to proccess.';
            
        } else if (data.code === 1010) {
            jsnRet.error_title = 'Mandatory Extenstion';
            jsnRet.error_hint = 'The client closed the connection because the server was supposed to negotiate extension(s) but it did not.';
            
        } else if (data.code === 1011) {
            jsnRet.error_title = 'Internal Server';
            jsnRet.error_hint = 'The server closed the connection because it could not fulfill the request.';
            
        } else if (data.code === 1015) {
            jsnRet.error_title = 'TLS handshake';
            jsnRet.error_hint = 'The connection was closed because the handshake failed.';
        }
        
        jsnRet.error_text = data.reason || '';
        
        return jsnRet;
    }
    
    GS.webSocketErrorDialog = function (jsnError, tryAgainCallback, cancelCallback) {
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
                            'There was ' + (['A', 'E', 'I', 'O', 'U'].indexOf(jsnError.error_title[0]) === -1 ? 'a' : 'an') +
                                    ' "' + jsnError.error_title + '" error:' +
                            (jsnError.error_text  ? '<br /><br />' + jsnError.error_text  : '') +
                            (jsnError.error_hint  ? '<br /><br />' + jsnError.error_hint  : '') +
                            (jsnError.error_addin ? '<br /><br />' + jsnError.error_addin : '') +
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
    
    GS.openWebSocket = function (strPath, callback, onMessageCallback, protocol) {
        var socket = new WebSocket('wss://' + window.location.host + strPath, protocol);
        
        socket.onopen = function (event) {
            if (typeof callback === 'function') {
                callback.apply(socket, [event]);
            }
        };
        
        socket.onerror = function () {
            socket.onclose = function (event) {
                if (typeof callback === 'function') {
                    callback.apply(socket, [webSocketNormalizeError(event), 'error']);
                }
            };
        };
        
        socket.onmessage = function (event) {
            if (typeof onMessageCallback === 'function') {
                onMessageCallback.apply(socket, [event]);
            }
        };
        
        return socket;
    };
    
    GS.messageWebSocket = function (socket, strParameters) {
        socket.send(strParameters);
    };
    
    GS.closeWebSocket = function (socket, onCloseCallback) {
        socket.onclose = function () {
            if (typeof onCloseCallback === 'function') {
                onCloseCallback.apply(socket);
            }
        };
        socket.close();
    };
})();