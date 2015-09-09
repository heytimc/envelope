

window.addEventListener('design-register-element', function () {
    'use strict';
    registerDesignSnippet('Dialog', 'Dialog', 'GS.dialog({\n' +
                                              '    \'header\': \'${1}\',\n' +
                                              '    \'content\': \'${2}\',\n' +
                                              '    \'buttons\': ${3:[\'Cancel\', \'Ok\']},\n' +
                                              '    \'after_open\': function () {\n' +
                                              '        ${4}\n' +
                                              '    },\n' +
                                              '    \'before_close\': function (event, strAnswer) {\n' +
                                              '        if (strAnswer === \'${5:Ok}\') {\n' +
                                              '            $0\n' +
                                              '        }\n' +
                                              '    }\n' +
                                              '});');
    
    registerDesignSnippet('GS.dialog', 'GS.dialog', 'GS.dialog({\n' +
                                                    '    \'header\': \'${1}\',\n' +
                                                    '    \'content\': \'${2}\',\n' +
                                                    '    \'buttons\': ${3:[\'Cancel\', \'Ok\']},\n' +
                                                    '    \'after_open\': function () {\n' +
                                                    '        ${4}\n' +
                                                    '    },\n' +
                                                    '    \'before_close\': function (event, strAnswer) {\n' +
                                                    '        if (strAnswer === \'${5:Ok}\') {\n' +
                                                    '            $0\n' +
                                                    '        }\n' +
                                                    '    }\n' +
                                                    '});');
    
    registerDesignSnippet('Dialog From Template', 'Dialog From Template', 'GS.openDialog(\'${1:templateID}\', function () {\n' +
                                                                          '    // after dialog open \n' +
                                                                          '}, function (event, strAnswer) {\n' +
                                                                          '    if (strAnswer === \'${2:Ok}\') {\n' +
                                                                          '        // before dialog close\n' +
                                                                          '        $0\n' +
                                                                          '    }\n' +
                                                                          '});');
    
    registerDesignSnippet('GS.openDialog', 'GS.openDialog', 'GS.openDialog(\'${1:templateID}\', function () {\n' +
                                                            '    // after dialog open \n' +
                                                            '}, function (event, strAnswer) {\n' +
                                                            '    if (strAnswer === \'${2:Ok}\') {\n' +
                                                            '        // beforedialog close\n' +
                                                            '        $0\n' +
                                                            '    }\n' +
                                                            '});');
    
    
    registerDesignSnippet('GS.closeDialog', 'GS.closeDialog', 'GS.closeDialog(${1:dialog}, ${2:\'Ok\'});');
    registerDesignSnippet('Close Dialog', 'Close Dialog', 'GS.closeDialog(${1:dialog}, ${2:\'Ok\'});');
    
    registerDesignSnippet('GS.msgbox', 'GS.msgbox', 'GS.msgbox(${1:\'Are you sure...\'}, ${2:\'Are you sure you want to do this?\'}, ' +
                                                                            '${3:[\'Cancel\', \'Ok\']}, function (strAnswer) {\n' +
                                                    '    if (strAnswer === ${4:\'Ok\'}) {\n' +
                                                    '        // before dialog close\n' +
                                                    '        $0\n' +
                                                    '    }\n' +
                                                    '});');
    registerDesignSnippet('Message Box', 'Message Box', 'GS.msgbox(${1:\'Are you sure...\'}, ${2:\'Are you sure you want to do this?\'}, ' +
                                                                                '${3:[\'Cancel\', \'Ok\']}, function (strAnswer) {\n' +
                                                        '    if (strAnswer === ${4:\'Ok\'}) {\n' +
                                                        '        // before dialog close\n' +
                                                        '        $0\n' +
                                                        '    }\n' +
                                                        '});');
    
    registerDesignSnippet('GS.inputbox', 'GS.inputbox', 'GS.inputbox(${1:\'Are you sure...\'}, ${2:\'Are you sure you want to do this?\'}, ' +
                                                                                'function (strInputValue) {\n' +
                                                        '    // before dialog close\n' +
                                                        '    $0\n' +
                                                        '});');
    registerDesignSnippet('Input Box', 'Input Box', 'GS.inputbox(${1:\'Are you sure...\'}, ${2:\'Are you sure you want to do this?\'}, ' +
                                                                            'function (strInputValue) {\n' +
                                                    '    // before dialog close\n' +
                                                    '    $0\n' +
                                                    '});');
    
    registerDesignSnippet('GS.openDialogToElement', 'GS.openDialogToElement',
                                        'GS.openDialogToElement(${1:document.getElementById(\'target\')}, \'${2:templateID}\', ' +
                                                                            '\'${3:right}\', function () {\n' +
                                        '    // after dialog open \n' +
                                        '}, function (event, strAnswer) {\n' +
                                        '    if (strAnswer === \'${4:Ok}\') {\n' +
                                        '        // beforedialog close\n' +
                                        '        $0\n' +
                                        '    }\n' +
                                        '});');
    registerDesignSnippet('Dialog For Element', 'Dialog For Element',
                                        'GS.openDialogToElement(${1:document.getElementById(\'target\')}, \'${2:templateID}\', ' +
                                                                            '\'${3:right}\', function () {\n' +
                                        '    // after dialog open \n' +
                                        '}, function (event, strAnswer) {\n' +
                                        '    if (strAnswer === \'${4:Ok}\') {\n' +
                                        '        // beforedialog close\n' +
                                        '        $0\n' +
                                        '    }\n' +
                                        '});');
});

// GS.msgbox('test1', 'test2', ['cancel', 'ok'], function (strAnswer) { console.log(strAnswer); });

GS.msgbox = function (strTitle, strMessage, arrButtons, callback) {
    'use strict';
    GS.dialog({
        'theme': 'regular',
        //'type': 'formatted-text',
        'modal': true,
        'padded': true,
        'header': strTitle,
        'content': strMessage,
        'buttons': arrButtons || ['Ok'],
        'before_close': function (event, strAnswer) {
            if (typeof callback === 'function') {
                callback(strAnswer);
            }
        }
    });
};


// GS.inputbox('test1', 'test2', function (strNewValue) { console.log(strNewValue); } );
GS.inputbox = function (strTitle, strMessage, callback) {
    'use strict';
    GS.dialog({
        'theme': 'regular',
        'type': 'html',
        'modal': true,
        'padded': true,
        'header': strTitle,
        'content': '<pre>' + encodeHTML(strMessage) + '</pre>' +
                   '<gs-text></gs-text>',
        'buttons': ['Cancel', 'Ok'],
        'after_open': function () { },
        'before_close': function (event, strAnswer) {
            if (strAnswer === 'Ok') {
                callback(xtag.query(this, 'gs-text')[0].value);
            } else {
                callback('');
            }
        }
    });
};

GS.dialogClose = function (dialog, strAnswer) {
    'use strict';
    console.warn('Please use "GS.closeDialog" instead of "GS.dialogClose".');
    dialog.destroy(strAnswer);
};

GS.closeDialog = function (dialog, strAnswer) {
    'use strict';
    dialog.destroy(strAnswer);
};

(function () {
    function bindDialogKeydown(dialog) {
        var bolBound = false, boundInput,
            arrInput = dialog.querySelectorAll('input'),
            keydownHandler = function (event) {
                if (event.keyCode === 13) {
                    arrElements = xtag.query(dialog, '[dialogclose]');
                    
                    if (arrElements.length > 0 && document.contains(dialog)) {
                        GS.triggerEvent(arrElements[arrElements.length - 1], 'click');
                    }
                }
            };
        
        
        // Loop backwards so that we end up with the first visible one focused
        for (i = arrInput.length - 1; i > 0; i -= 1) {
            if (arrInput[i].style.display !== 'none') {
                arrInput[i].focus();
            }
            if (arrInput[i].style.display !== 'none' && bolBound === false) {
                boundInput = arrInput[i];
                
                dialog.addEventListener('keydown', function (event) {
                    if (event.target === boundInput) {
                        keydownHandler(event);
                    }
                });
                bolBound = true;
            }
        }
    }
    
    GS.dialog = function (options) {
        var strHTML, dialogOverlay, dialog, strContent = '', strButtons = '', i, len, gridEach,
            arrElements, tapHandler, strHeader, sizingFunction, observer;
        
        // change button parameter to array format if it is string format (and the string is recognized)
        if (typeof options.buttons === 'string') {
            if (options.buttons === 'okcancel' || options.buttons === 'cancelok') {
                options.buttons = ['Cancel', 'Ok'];
                
            } else if (options.buttons === 'ok' || options.buttons === 'okonly') {
                options.buttons = ['Ok'];
                
            } else if (options.buttons === 'cancel' || options.buttons === 'cancelonly') {
                options.buttons = ['Cancel'];
                
            } else if (options.buttons === 'yesno' || options.buttons === 'noyes') {
                options.buttons = ['No', 'Yes'];
                
            } else if (options.buttons === 'Yes' || options.buttons === 'yesonly') {
                options.buttons = ['Yes'];
                
            } else if (options.buttons === 'No' || options.buttons === 'noonly') {
                options.buttons = ['No'];
            }
        }
        
        // option defaults
        options.theme      = options.theme        || 'regular';
        options.type       = options.type         || 'html';
        options.header     = options.header       || '';
        options.content    = options.content      || '';
        options.buttons    = options.buttons      || ['Ok']; // either array or string
        options.max_width  = options.max_width    || '700px';
        options.max_height = options.max_height   || '700px';
        options.mode       = options.mode         || 'detect'; // phone, touch, constrained, full, detect
        options.padded     = options.padded       || false;
        options.autofocus  = (options.autofocus === undefined ? true : false);
        
        // if type is html or, use content as is
        if (options.type === 'html') {
            strContent = options.content;
            strHeader = options.header;
            
        // if type is formatted-html, wrap content with a <pre>
        } else if (options.type === 'formatted-html') {
            strContent = '<pre gs-dynamic>' + options.content + '</pre>';
            strHeader = '<pre gs-dynamic>' + options.header + '</pre>';
            
        // if type is text, encode to be text only
        } else if (options.type === 'text') {
            strContent = encodeHTML(options.content);
            strHeader = encodeHTML(options.header);
            
        // if type is formatted-text, encode to be text only, and wrap with a <pre>
        } else if (options.type === 'formatted-text') {
            strContent = '<pre gs-dynamic>' + encodeHTML(options.content) + '</pre>';
            strHeader = '<pre gs-dynamic>' + encodeHTML(options.header) + '</pre>';
            
        // if type is unrecognized, use content as is
        } else {
            console.warn('Dialog type not recognized... Defaulting to \'html\'.');
            strContent = options.content;
            strHeader = options.header;
        }
        
        // if buttons is an array, build array into button html
        if (typeof options.buttons === 'object') {
            if (options.buttons.length > 0) {
                strButtons = '<gs-grid gs-dynamic>';
                
                for (i = 0, len = options.buttons.length; i < len; i += 1) {
                    strButtons +=
                        '<gs-block gs-dynamic>' +
                            '<gs-button value="' + options.buttons[i] + '" dialogclose ' + (i === len - 1 ? 'emphasis' : '') + ' gs-dynamic>' +
                                encodeHTML(options.buttons[i]) +
                            '</gs-button>' +
                        '</gs-block>';
                }
                strButtons += '</gs-grid>';
            } else {
                strButtons = '';
            }
        
        // if buttons is not an array, use as html
        } else {
            strButtons = options.buttons;
        }
        
        // append dialog overlay element
        dialogOverlay = GS.stringToElement('<gs-dialog-overlay gs-dynamic></gs-dialog-overlay>');
        document.body.appendChild(dialogOverlay);
        
        dialogOverlay.addEventListener(evt.mousedown, function (event) {
            event.preventDefault();
        });
        dialogOverlay.addEventListener(evt.mousemove, function (event) {
            event.preventDefault();
        });
        
        // build dialog html
        strHTML = '<gs-dialog class="' + encodeHTML(options.theme) + '" gs-dynamic ';
        
        // if mode is set to phone or touch and we are not on those types of devices: change mode to detect
        if ((options.mode === 'touch' && !evt.touchDevice) || (options.mode === 'phone' && evt.deviceType !== 'phone')) {
            options.mode = 'detect';
        }
        
        // deal with full page mode
        if ((options.mode === 'touch' && evt.touchDevice) || (options.mode === 'phone' && evt.deviceType === 'phone') || options.mode === 'full') {
            strHTML += 'style="width: 100%; height: 100%; top: 0;">';
            
        } else if (options.mode === 'constrained') {
            strHTML += 'style="max-width: ' + options.max_width + '; max-height: ' + options.max_height + '; width: 94%; height: 90%;">';// auto
                             //width: ' + options.width + '; ' +
                             //'height: ' + options.height + '; ' +
                             //'top: ' + options.top + '; ' +
                             //'margin-left: -' + ((parseInt(options.width, 10) / 2) + options.width.replace(/[0-9]/g, '')) + ';">' +
            
        } else { // if (options.mode === 'constrained')
            strHTML += 'style="max-width: ' + options.max_width + '; width: 94%;">';
        }
        
        strHTML +=      '<gs-page gs-dynamic>' +
                            (options.header ? '<gs-header gs-dynamic>' + strHeader + '</gs-header>' : '') +
                            '<gs-body' + (options.padded ? ' padded' : '') + ' gs-dynamic>' + strContent + '</gs-body>' +
                           (strButtons ? '<gs-footer gs-dynamic>' + strButtons + '</gs-footer>' : '') +
                        '</gs-page>' +
                    '</gs-dialog>';
        
        // append dialog
        dialog = GS.stringToElement(strHTML);
        document.body.appendChild(dialog);
        document.body.parentNode.classList.add('no-scroll-except-for-dialog');
        
        // bind dialog
        dialog.addEventListener('beforeclose', function (event) {
            if (typeof options.before_close === 'function') {
                options.before_close.apply(dialog, [event.originalEvent, event.data]);
            }
        });
        dialog.addEventListener('afterclose', function (event) {
            if (typeof options.after_close === 'function') {
                options.after_close.apply(dialog, [event.originalEvent, event.data]);
            }
        });
        
        // handle focus and the return key
        if (options.autofocus && dialog.querySelector('input')) {
            bindDialogKeydown(dialog);
            
        } else {
            // focus last button (if there are buttons)
            arrElements = xtag.query(dialog, '[dialogclose]');
            if (arrElements.length > 0) {
                arrElements[arrElements.length - 1].focus();
            }
        }
        
        // if mode is detect: do/bind detection
        if (options.mode === 'detect') {
            sizingFunction = function () {
                if (!document.contains(dialog)) {
                    window.removeEventListener('resize', sizingFunction);
                    observer.disconnect();
                    
                    return;
                }
                
                // if dialog is taller than 98% of the window: add max-height and height
                if (dialog.offsetHeight > ((window.innerHeight / 100) * 98)) {
                    dialog.style.height = '98%';
                    dialog.style.maxHeight = options.max_height;
                }
            };
            
            sizingFunction();
            
            window.addEventListener('resize', sizingFunction);
            window.addEventListener('orientationchange', sizingFunction);
            
            observer = new MutationObserver(sizingFunction);
            observer.observe(dialog, {childList: true, subtree: true});
        }
        
        // after open function call
        if (typeof options.after_open === 'function') {
            options.after_open.apply(dialog, []);
        }
        
        return dialog;
    };
    
    GS.openDialog = function (strTemplateID, afterOpenFunction, beforeCloseFunction) {
        var strHTML, dialogOverlay, dialog, i, len, arrCloseButtons, clickHandler, sizingFunction, observer;
        
        // build full dialog html
        strHTML = '<gs-dialog class="regular" gs-dynamic ';
        
        // deal with full page mode
        if (evt.touchDevice) { //  || options.mode === 'phone' && evt.deviceType === 'phone' || options.mode === 'full'
            strHTML += 'style="width: 100%; height: 100%; top: 0;">';
            
        } else {
            strHTML += 'style="max-width: 700px; width: 94%;">';
        }
        
        strHTML +=      '<gs-page gs-dynamic>' +
                            document.getElementById(strTemplateID).innerHTML +
                        '</gs-page>' +
                    '</gs-dialog>';
        
        // get elements
        dialogOverlay = GS.stringToElement('<gs-dialog-overlay gs-dynamic></gs-dialog-overlay>');
        dialog = GS.stringToElement(strHTML);
        
        // append overlay element
        document.body.appendChild(dialogOverlay);
        
        // bind overlay element
        dialogOverlay.addEventListener(evt.mousedown, function (event) {
            event.preventDefault();
        });
        dialogOverlay.addEventListener(evt.mousemove, function (event) {
            event.preventDefault();
        });
        
        // append dialog
        document.body.appendChild(dialog);
        document.body.parentNode.classList.add('no-scroll-except-for-dialog');
        
        // bind dialog
        dialog.addEventListener('beforeclose', function (event) {
            if (typeof beforeCloseFunction === 'function') {
                beforeCloseFunction.apply(dialog, [event.originalEvent, event.data]);
            }
        });
        
        if (dialog.querySelector('input')) {
            bindDialogKeydown(dialog);
            
        } else {
            // focus last button (if there are buttons)
            arrElements = xtag.query(dialog, '[dialogclose]');
            if (arrElements.length > 0) {
                arrElements[arrElements.length - 1].focus();
            }
        }
        
        // do/bind size detection
        sizingFunction = function () {
            if (!document.contains(dialog)) {
                window.removeEventListener('resize', sizingFunction);
                observer.disconnect();
                
                return;
            }
            
            // if dialog is taller than 98% of the window: add max-height and height
            if (dialog.offsetHeight > ((window.innerHeight / 100) * 98)) {
                dialog.style.height = '98%';
                dialog.style.maxHeight = options.max_height;
            }
        };
        
        sizingFunction();
        
        window.addEventListener('resize', sizingFunction);
        window.addEventListener('orientationchange', sizingFunction);
        
        observer = new MutationObserver(sizingFunction);
        observer.observe(dialog, {childList: true, subtree: true});
        
        // after open function call
        if (typeof afterOpenFunction === 'function') {
            afterOpenFunction.apply(dialog, []);
        }
        
        return dialog;
    };
    
    GS.openDialogToElement = function (elementTarget, strTemplateID, strDirectionRequest, afterOpenFunction, beforeCloseFunction) {
        'use strict';
        var positionHandlingFunction, jsnPositionData, divElement = document.createElement('div'), dialogElement, observer,
            intDialogResolvedWidth, intDialogResolvedHeight, strResolvedDirection, intMargin = 5, intMaxDimensions = 700,
            intElementMidPoint, intDialogMidPoint, i, len, arrTests, arrCloseButtons, clickHandler, arrElements;
        
        // create dialog element
        divElement.innerHTML =  '<gs-dialog class="regular" style="width: 94%; max-width: ' + intMaxDimensions + 'px;" no-window-listen gs-dynamic>' +
                                    '<gs-page gs-dynamic>' +
                                        document.getElementById(strTemplateID).innerHTML +
                                    '</gs-page>' +
                                '</gs-dialog>';
        
        dialogElement = divElement.children[0];
        
        // append dialog overlay element to the body
        document.body.appendChild(GS.stringToElement('<gs-dialog-overlay gs-dynamic></gs-dialog-overlay>'));
        
        // append dialog element to the body
        document.body.appendChild(dialogElement);
        
        // bind dialog
        dialogElement.addEventListener('beforeclose', function (event) {
            if (typeof beforeCloseFunction === 'function') {
                beforeCloseFunction.apply(dialogElement, [event.originalEvent, event.data]);
            }
        });
        
        if (dialogElement.querySelector('input')) {
            bindDialogKeydown(dialog);
            
        } else {
            // focus last button (if there are buttons)
            arrElements = xtag.query(dialogElement, '[dialogclose]');
            if (arrElements.length > 0) {
                arrElements[arrElements.length - 1].focus();
            }
        }
        
        // if no direction was sent: set direction to down
        strDirectionRequest = strDirectionRequest || 'down';
        
        // make strDirectionRequest lowercase
        strDirectionRequest.toLowerCase();
        
        // if the direction does not match any valid direction: set direction to down and warn
        if (!strDirectionRequest.match(/^up$|^down$|^left$|^right$|^full$/)) {
            console.warn('GS.openDialogToElement Error: ' +
                                'Direction \'' + strDirectionRequest + '\' not recognized. ' +
                                'Please use \'up\', \'down\', \'left\', \'right\' or \'full\'.');
            strDirectionRequest = 'down';
        }
        
        positionHandlingFunction = function () {
            var intDialogTop = '', intDialogLeft = '', intDialogMarginTop = '', intDialogMarginLeft = '';
            
            // if the dialog is not in the DOM: unbind and skip the contents of the function using return
            if (!document.contains(dialogElement)) {
                window.removeEventListener('resize', positionHandlingFunction);
                window.removeEventListener('orientationchange', positionHandlingFunction);
                observer.disconnect();
                return;
            }
            
            // clear dialog CSS
            dialogElement.style.top        = '';
            dialogElement.style.left       = '';
            dialogElement.style.marginTop  = '';
            dialogElement.style.marginLeft = '';
            dialogElement.style.width      = '94%';
            dialogElement.style.height     = '';
            dialogElement.style.maxHeight  = '';
            
            // resolve dialog width and height
            
            // if dialog is taller than: window height - (intMargin * 2): add max-height and height
            if (dialogElement.clientHeight > ((window.innerHeight / 100) * 94)) {
                dialogElement.style.height = '94%';
                dialogElement.style.maxHeight = intMaxDimensions + 'px';
            }
            
            intDialogResolvedWidth  = dialogElement.offsetWidth;
            intDialogResolvedHeight = dialogElement.offsetHeight;
            
            // set dialog width and height to resolved width and height
            dialogElement.style.width  = intDialogResolvedWidth  + 'px';
            dialogElement.style.height = intDialogResolvedHeight + 'px';
            
            // get target position data
            jsnPositionData = GS.getElementPositionData(elementTarget);
            
            // order of tests depending on direction
            if (strDirectionRequest === 'up') { // up: up, down, left, right, full
                arrTests = ['up', 'down', 'left', 'right'];
                
            } else if (strDirectionRequest === 'down') { // down: down, up, left, right, full
                arrTests = ['down', 'up', 'left', 'right'];
                
            } else if (strDirectionRequest === 'left') { // left: left, right, down, up, full
                arrTests = ['left', 'right', 'down', 'up'];
                
            } else if (strDirectionRequest === 'right') { // right: right, left, down, up, full
                arrTests = ['right', 'left', 'down', 'up'];
                
            } else { // full: no tests (just go to full)
                arrTests = [];
            }
            
            // up: compare room above to dialog resolved height
            //      pass: display
            //      fail: next test
            for (i = 0, len = arrTests.length; i < len; i += 1) {
                if ((arrTests[i] ===    'up' && (intDialogResolvedHeight + intMargin) <= jsnPositionData.intRoomAbove) ||
                    (arrTests[i] ===  'down' && (intDialogResolvedHeight + intMargin) <= jsnPositionData.intRoomBelow) ||
                    (arrTests[i] ===  'left' && (intDialogResolvedWidth  + intMargin) <=  jsnPositionData.intRoomLeft) ||
                    (arrTests[i] === 'right' && (intDialogResolvedWidth  + intMargin) <= jsnPositionData.intRoomRight)) {
                    strResolvedDirection = arrTests[i];
                    break;
                }
            }
            
            // if we could not resolve to a particular direction: set direction to full screen
            strResolvedDirection = strResolvedDirection || 'full';
            //console.log(strResolvedDirection);
            
            // if up or down: get as close to horizontally centered on the element as possible
            if (strResolvedDirection === 'up' || strResolvedDirection === 'down') {
                intElementMidPoint = (jsnPositionData.intElementLeft + (jsnPositionData.intElementWidth / 2));
                intDialogMidPoint = (intDialogResolvedWidth / 2);
                //console.log(intElementMidPoint, jsnPositionData.left, jsnPositionData.intElementWidth);
                
                // if centered goes past intMargin of the left edge of the screen: go to intMargin from the bottom
                if (intElementMidPoint - intDialogMidPoint < intMargin) {
                    intDialogLeft = intMargin;
                    //console.log('1***', intMargin);
                    
                // else if centered goes past intMargin of the right edge of the screen: go to intMargin less than the width of the viewport
                } else if (intElementMidPoint + intDialogMidPoint > window.innerWidth - intMargin) {
                    intDialogLeft = ((window.innerWidth - intDialogResolvedWidth) - intMargin);
                    //console.log('2***', window.innerWidth, intDialogResolvedWidth, intMargin);
                    
                // else centered does not go past intMargin of either edge of the screen: center
                } else {
                    intDialogLeft = (intElementMidPoint - intDialogMidPoint);
                    //console.log('3***', intElementMidPoint, intDialogMidPoint, (intElementMidPoint - intDialogMidPoint) + 'px');
                }
                
            // else if left or right: get as close to vertically centered next to the element as possible
            } else if (strResolvedDirection === 'left' || strResolvedDirection === 'right') {
                intElementMidPoint = (jsnPositionData.intElementTop + (jsnPositionData.intElementHeight / 2));
                intDialogMidPoint = (intDialogResolvedHeight / 2);
                
                //console.log('0***', intElementMidPoint, intDialogMidPoint, window.innerHeight, intMargin, intDialogResolvedHeight);
                
                // if centered goes past intMargin of the top edge of the screen: go to intMargin from the bottom
                if (intElementMidPoint - intDialogMidPoint < intMargin) {
                    intDialogTop = intMargin;
                    //console.log('1***', intMargin);
                    
                // else if centered goes past intMargin of the bottom edge of the screen: go to intMargin less than the height of the viewport
                } else if (intElementMidPoint + intDialogMidPoint > window.innerHeight - intMargin) {
                    intDialogTop = ((window.innerHeight - intDialogResolvedHeight) - intMargin);
                    //console.log('2***', window.innerHeight, intDialogResolvedHeight, intMargin);
                    
                // else centered does not go past intMargin of either edge of the screen: center
                } else {
                    intDialogTop = (intElementMidPoint - intDialogMidPoint);
                    //console.log('3***', intElementMidPoint, intDialogMidPoint, (intElementMidPoint - intDialogMidPoint) + 'px');
                }
                
            // else full: use dialog logic to get width and height and center both vertically and horizontally
            } else {
                intDialogTop        = '50%';
                intDialogLeft       = '50%';
                intDialogMarginTop  = '-' + (intDialogResolvedHeight / 2) + 'px';
                intDialogMarginLeft = '-' + (intDialogResolvedWidth / 2) + 'px';
            }
            
            // if direction is up: connect the bottom of the dialog to the top of the element
            if (strResolvedDirection === 'up') {
                intDialogTop = (jsnPositionData.intElementTop - intDialogResolvedHeight);
                
            // if direction is down: connect the top of the dialog to the bottom of the element
            } else if (strResolvedDirection === 'down') {
                intDialogTop = (jsnPositionData.intElementTop + jsnPositionData.intElementHeight);
                
            // if direction is left: connect the right of the dialog to the left of the element
            } else if (strResolvedDirection === 'left') {
                intDialogLeft = (jsnPositionData.intElementLeft - intDialogResolvedWidth);
                
            // if direction is right: connect the left of the dialog to the right of the element
            } else if (strResolvedDirection === 'right') {
                intDialogLeft = (jsnPositionData.intElementLeft + jsnPositionData.intElementWidth);
            }
            
            // prevent the dialog from vertically going outside the viewport
            if (intDialogTop + intDialogResolvedHeight > window.innerHeight) {
                intDialogTop -= (intDialogTop + intDialogResolvedHeight) - window.innerHeight;
                
            }
            
            // prevent the dialog from horizontally going outside the viewport
            if (intDialogLeft + intDialogResolvedWidth > window.innerWidth) {
                intDialogLeft -= (intDialogLeft + intDialogResolvedWidth) - window.innerWidth;
            }
            
            // apply CSS to the dialog
            dialogElement.style.top        = intDialogTop + 'px';
            dialogElement.style.left       = intDialogLeft + 'px';
            dialogElement.style.marginTop  = intDialogMarginTop + 'px';
            dialogElement.style.marginLeft = intDialogMarginLeft + 'px';
        };
        
        positionHandlingFunction();
        window.addEventListener('resize', positionHandlingFunction);
        window.addEventListener('orientationchange', positionHandlingFunction);
        
        // observer: on childlist update: recalculate positioning/sizing
        observer = new MutationObserver(positionHandlingFunction);
        observer.observe(dialogElement, {childList: true, subtree: true});
        
        // after open function call
        if (typeof afterOpenFunction === 'function') {
            afterOpenFunction.apply(dialogElement, []);
        }
        
        return dialogElement;
    };
})();

document.addEventListener('DOMContentLoaded', function () {
    xtag.register('gs-dialog', {
        lifecycle: {
            created: function () {
                'use strict';
                var element = this;
                
                document.body.focus();
                
                document.body.parentNode.classList.add('no-scroll-except-for-dialog');
                element.header = xtag.queryChildren(element, 'gs-header')[0];
                element.footer = xtag.queryChildren(element, 'gs-footer')[0];
                
                window.addEventListener('resize', function () {
                    element.refreshPadding();
                });
                window.addEventListener('orientationchange', function () {
                    element.refreshPadding();
                });
            },
            
            inserted: function () {
                'use strict';
                this.refreshPadding();
                
                if (!this.hasAttribute('no-window-listen')) {
                    this.bind();
                    
                    this.windowResizeHandler();
                }
            },
            
            removed: function () {
                'use strict';
                this.unbind();
            }
        },
        events: {
            'click:delegate([dialogclose])': function (event) {
                'use strict';
                var dialogcloseElement = GS.findParentElement(event.target, '[dialogclose]');
                
                GS.findParentTag(event.target, 'gs-dialog')
                        .destroy(dialogcloseElement.getAttribute('value') || dialogcloseElement.textContent, event);
            }
        },
        accessors: {},
        methods: {
            bind: function () {
                'use strict';
                var element = this;
                
                if (!element.hasAttribute('no-window-listen')) {
                    element.windowResizeHandler = function () {
                        element.style.left = (window.innerWidth / 2) - (element.offsetWidth / 2) + 'px';
                    };
                    
                    window.addEventListener('resize', element.windowResizeHandler);
                    window.addEventListener('orientationchange', element.windowResizeHandler);
                }
            },
            
            unbind: function () {
                'use strict';
                window.removeEventListener('resize', this.windowResizeHandler);
                window.removeEventListener('orientationchange', this.windowResizeHandler);
                
                GS.triggerEvent(window, 'resize');
            },
            
            destroy: function (strAnswer, originalEvent) {
                'use strict';
                GS.triggerEvent(this, 'beforeclose', {'data': strAnswer, 'originalEvent': originalEvent});
                
                document.body.removeChild(this.previousElementSibling);
                document.body.removeChild(this);
                
                GS.triggerEvent(this, 'afterclose', {'data': strAnswer, 'originalEvent': originalEvent});
                
                if (document.getElementsByTagName('gs-dialog').length === 0) {
                    document.body.parentNode.classList.remove('no-scroll-except-for-dialog');
                }
            },
            
            refreshPadding: function () {
                'use strict';
                if (this.header) {
                    this.style.paddingTop = this.header.offsetHeight + 'px';
                }
                if (this.footer) {
                    this.style.paddingBottom = this.footer.offsetHeight + 'px';
                }
            }
        }
    });
    
    xtag.register('gs-dialog-overlay', {
        lifecycle: {},
        events: {},
        accessors: {},
        methods: {}
    });
});