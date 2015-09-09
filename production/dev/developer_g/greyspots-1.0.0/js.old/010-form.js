
window.addEventListener('design-register-element', function () {
    'use strict';
    
    registerDesignSnippet('<gs-form>', '<gs-form>', 'gs-form src="${1:test.tpeople}">\n' +
                                                    '    <template>\n' +
                                                    '        ${2}\n' +
                                                    '    </template>\n' +
                                                    '</gs-form>');
    
    designRegisterElement('gs-form', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-form.html');
    
    window.designElementProperty_GSFORM = function (selectedElement) {
        addProp('Source', true, '<gs-memo class="target" value="' + (decodeURIComponent(selectedElement.getAttribute('src') ||
                                                                                        selectedElement.getAttribute('source') || '')) + '" mini></gs-memo>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'src', encodeURIComponent(this.value));
        });
        
        addProp('Columns', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('cols') || '') + '" mini></gs-text>',
                function () {
            return setOrRemoveTextAttribute(selectedElement, 'cols', this.value);
        });
        
        addProp('Where', true, '<gs-text class="target" value="' + (decodeURIComponent(selectedElement.getAttribute('where') || '')) + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'where', encodeURIComponent(this.value));
        });
        
        addProp('Column In Querystring', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('qs') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'qs', this.value, false);
        });
        
        addProp('Order By', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('ord') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'ord', this.value);
        });
        
        addProp('Limit', true, '<gs-number class="target" value="' + (selectedElement.getAttribute('limit') || '') + '" mini></gs-number>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'limit', this.value);
        });
        
        addProp('Offset', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('offset') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'offset', this.value);
        });
        
        addProp('Save&nbsp;While&nbsp;Typing', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('save-while-typing')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'save-while-typing', (this.value === 'true'), true);
        });
        
        // TITLE attribute
        addProp('Title', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('title') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'title', this.value);
        });
        
        // visibility attributes
        strVisibilityAttribute = '';
        if (selectedElement.hasAttribute('hidden'))                   { strVisibilityAttribute = 'hidden'; }
        if (selectedElement.hasAttribute('hide-on-desktop'))  { strVisibilityAttribute = 'hide-on-desktop'; }
        if (selectedElement.hasAttribute('hide-on-tablet'))   { strVisibilityAttribute = 'hide-on-tablet'; }
        if (selectedElement.hasAttribute('hide-on-phone'))    { strVisibilityAttribute = 'hide-on-phone'; }
        if (selectedElement.hasAttribute('show-on-desktop'))   { strVisibilityAttribute = 'show-on-desktop'; }
        if (selectedElement.hasAttribute('show-on-tablet'))    { strVisibilityAttribute = 'show-on-tablet'; }
        if (selectedElement.hasAttribute('show-on-phone'))     { strVisibilityAttribute = 'show-on-phone'; }
        
        addProp('Visibility', true, '<gs-select class="target" value="' + strVisibilityAttribute + '" mini>' +
                                        '<option value="">Visible</option>' +
                                        '<option value="hidden">Invisible</option>' +
                                        '<option value="hide-on-desktop">Invisible at desktop size</option>' +
                                        '<option value="hide-on-tablet">Invisible at tablet size</option>' +
                                        '<option value="hide-on-phone">Invisible at phone size</option>' +
                                        '<option value="show-on-desktop">Visible at desktop size</option>' +
                                        '<option value="show-on-tablet">Visible at tablet size</option>' +
                                        '<option value="show-on-phone">Visible at phone size</option>' +
                                    '</gs-select>', function () {
            selectedElement.removeAttribute('hidden');
            selectedElement.removeAttribute('hide-on-desktop');
            selectedElement.removeAttribute('hide-on-tablet');
            selectedElement.removeAttribute('hide-on-phone');
            selectedElement.removeAttribute('show-on-desktop');
            selectedElement.removeAttribute('show-on-tablet');
            selectedElement.removeAttribute('show-on-phone');
            
            if (this.value) {
                selectedElement.setAttribute(this.value, '');
            }
            
            return selectedElement;
        });
        
        addProp('Refresh On Querystring Columns', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('refresh-on-querystring-values') || '') + '" mini></gs-text>', function () {
            this.removeAttribute('refresh-on-querystring-change');
            return setOrRemoveTextAttribute(selectedElement, 'refresh-on-querystring-values', this.value);
        });
        
        addProp('Refresh On Querystring Change', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('refresh-on-querystring-change')) + '" mini></gs-checkbox>', function () {
            this.removeAttribute('refresh-on-querystring-values');
            return setOrRemoveBooleanAttribute(selectedElement, 'refresh-on-querystring-change', this.value === 'true', true);
        });
        
        addFlexContainerProps(selectedElement);
        addFlexProps(selectedElement);
    };
});

document.addEventListener('DOMContentLoaded', function () {
    function columnParentsUntilForm(form, element) {
        var intColumnParents = 0, currentElement = element, maxLoops = 50, i = 0;
        
        while (currentElement !== form && currentElement.parentNode && i < maxLoops) {
            if (currentElement.parentNode.hasAttribute('column') === true) {
                intColumnParents += 1;
            }
            
            currentElement = currentElement.parentNode;
            i += 1;
        }
        
        return intColumnParents;
    }
    
    function pushReplacePopHandler(element) {
        var i, len, arrPopKeys, bolRefresh = false, currentValue, strQueryString = GS.getQueryString();
        
        if (element.getAttribute('qs')) {
            element.setAttribute('where', 'id=' + GS.qryGetVal(strQueryString, element.getAttribute('qs')));
            bolRefresh = true;
            
        } else if (element.hasAttribute('refresh-on-querystring-values')) {
            arrPopKeys = element.getAttribute('refresh-on-querystring-values').split(/\s*,\s*/gim);
            
            for (i = 0, len = arrPopKeys.length; i < len; i += 1) {
                currentValue = GS.qryGetVal(strQueryString, arrPopKeys[i]);
                
                if (element.popValues[arrPopKeys[i]] !== currentValue) {
                    bolRefresh = true;
                }
                
                element.popValues[arrPopKeys[i]] = currentValue;
            }
            
        } else if (element.hasAttribute('refresh-on-querystring-change')) {
            bolRefresh = true;
        }
        
        if (bolRefresh) {
            element.refresh();
        }
    }
    
    xtag.register('gs-form', {
        lifecycle: {
            // Fires when an instance of the element is created
            created: function() {
                var element = this, templateElement = document.createElement('template'),
                    firstChildElement = this.children[0], arrElements, i, len, arrColumnElement, arrTemplates,
                    strQueryString = GS.getQueryString(), changeHandler;
                
                // if this form has the "save-while-typing" attribute
                if (this.hasAttribute('save-while-typing')) {
                    window.onbeforeunload = function () {
                        if (element.bolCurrentlySaving) {
                            return 'The page has not finished saving.';
                        }
                    };
                }
                
                // if the first child is a template element: save its HTML
                if (firstChildElement.nodeName === 'TEMPLATE') {
                    this.templateHTML = firstChildElement.innerHTML;
                    
                // else: save the innerHTML of the form and send a warning
                } else {
                    console.warn('Warning: gs-form is now built to use a template element. ' +
                                 'Please use a template element to contain the template for this form. ' + // this warning was added: March 12th 2015
                                 'A fix has been included so that it is not necessary to use the template element, but that code may be removed at a future date.');
                    
                    this.templateHTML = this.innerHTML;
                }
                
                // if there is no HTML: throw an error
                if (!this.templateHTML.trim()) { throw 'GS-FORM error: no template HTML.'; }
                
                // fill a virtual template element with the templateHTML (by virtual I mean: not in the DOM)
                templateElement.innerHTML = this.templateHTML;
                
                // find anything with a column attribute and add the doT.js to the value unless there is already a value
                arrColumnElement = xtag.query(templateElement.content, '[column]');
                
                // recursively go through templates whose parents do not have the source attribute
                i = 0;
                arrTemplates = xtag.query(templateElement.content, 'template'); // *:not([source]) > 
                //arrTemplates.push.apply(arrTemplates, xtag.toArray(templateElement.content.querySelectorAll('template')));
                
                //console.log(arrTemplates);
                
                for (i = arrTemplates.length - 1; i >= 0; i -= 1) {
                    if (arrTemplates[i].parentNode.hasAttribute && (arrTemplates[i].parentNode.hasAttribute('src') || arrTemplates[i].parentNode.hasAttribute('source'))) {
                        arrTemplates.splice(i, 1);
                    }
                }
                
                //console.log(arrTemplates);
                //console.log(xtag.toArray(templateElement.content.querySelectorAll('template')));
                
                while (arrTemplates.length > 0 && i < 100) {
                    // add all of the column elements to the arrColumnElement array
                    arrColumnElement.push.apply(arrColumnElement, xtag.query(arrTemplates[0].content, '[column]'));
                    
                    // add any template elements that do not have a source to the arrTemplates array
                    arrTemplates.push.apply(arrTemplates, xtag.query(arrTemplates[0].content, '*:not([source]) > template'));
                    
                    for (i = arrTemplates.length - 1; i >= 0; i -= 1) {
                        if (arrTemplates[i].parentNode.hasAttribute && (arrTemplates[i].parentNode.hasAttribute('src') || arrTemplates[i].parentNode.hasAttribute('source'))) {
                            arrTemplates.splice(i, 1);
                        }
                    }
                    
                    // remove the current template from the arrTemplates array
                    arrTemplates.splice(0, 1);
                    
                    i += 1;
                }
                
                for (i = 0, len = arrColumnElement.length; i < len; i += 1) {
                    if (!arrColumnElement[i].hasAttribute('value')) {
                        arrColumnElement[i].setAttribute('value', '{{! row.' + arrColumnElement[i].getAttribute('column') + ' }}');
                    }
                }
                
                // set the templateHTML property of the form with the virtual template's innerHTML
                this.templateHTML = templateElement.innerHTML;
                
                // handle "qs" attribute
                if (this.getAttribute('qs') ||
                        this.getAttribute('refresh-on-querystring-values') ||
                        this.hasAttribute('refresh-on-querystring-change')) {
                    this.popValues = {};
                    
                    if (this.getAttribute('qs')) {
                        if (GS.qryGetVal(strQueryString, this.getAttribute('qs'))) {
                            this.setAttribute('where', 'id=' + GS.qryGetVal(strQueryString, this.getAttribute('qs')));
                        } else {
                            this.setAttribute('where', 'false');
                        }
                    }
                    
                    if (GS.getQueryString() || this.hasAttribute('refresh-on-querystring-change')) {
                        pushReplacePopHandler(element);
                    }
                    
                    window.addEventListener('pushstate',    function () { pushReplacePopHandler(element); });
                    window.addEventListener('replacestate', function () { pushReplacePopHandler(element); });
                    window.addEventListener('popstate',     function () { pushReplacePopHandler(element); });
                } else {
                    this.getData();
                }
                
                this.addEventListener('keydown', function (event) {
                    var intKeyCode = event.which || event.keyCode, jsnSelection;
                    
                    if (document.activeElement.nodeName === 'INPUT' || document.activeElement.nodeName === 'TEXTAREA') {
                        jsnSelection = GS.getInputSelection(event.target);
                    }
                    
                    if ((intKeyCode === 37 && (!jsnSelection || jsnSelection.start === 0)) ||
                        (intKeyCode === 39 && (!jsnSelection || jsnSelection.end === event.target.value.length))) {
                        var focusToElement, i, len, arrElementsFocusable, currentElement;
                        //Left
                        if (intKeyCode === 37 && (!jsnSelection || jsnSelection.start === 0)) {
                            arrElementsFocusable = xtag.query(document, 'input:not([disabled]), ' +
                                'select:not([disabled]), memo:not([disabled]), button:not([disabled]), ' +
                                '[tabindex]:not([disabled]), [column]');
                            
                            for (i = 0,len = arrElementsFocusable.length;i < len;i++) {
                                currentElement = arrElementsFocusable[i];
                                //console.log(currentElement === event.target, currentElement, event.target);
                                if (currentElement === event.target ||
                                    ((event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA') &&
                                    currentElement === event.target.parentNode)) {
                                    if (i === 0) {
                                        focusToElement = currentElement;
                                    } else {
                                        focusToElement = arrElementsFocusable[i - 1];
                                    }
                                    break;
                                }
                            }
                            //console.log(focusToElement);
                        //Right
                        } else if (intKeyCode === 39 && (!jsnSelection || jsnSelection.end === event.target.value.length)) {
                            arrElementsFocusable = xtag.query(document, 'input:not([disabled]), ' +
                                'select:not([disabled]), memo:not([disabled]), button:not([disabled]), ' +
                                '[tabindex]:not([disabled]), [column]');
                            
                            for (i = 0,len = arrElementsFocusable.length;i < len;i++) {
                                currentElement = arrElementsFocusable[i];
                                if (currentElement === event.target) {
                                    if (i === len) {
                                        focusToElement = currentElement;
                                    } else {
                                        focusToElement = arrElementsFocusable[i + 1];
                                    }
                                    break;
                                }
                            }
                        }
                        
                        //console.log('focusable', GS.isElementFocusable(focusToElement));
                        if (focusToElement && GS.isElementFocusable(focusToElement)) {
                            //console.log('focus');
                            event.preventDefault();
                            
                            focusToElement.focus();
                            
                            if (document.activeElement.nodeName === 'INPUT' || document.activeElement.nodeName === 'TEXTAREA') {
                                GS.setInputSelection(document.activeElement, 0, document.activeElement.value.length);
                            }
                        }
                    }
                });
                
                // bind save code
                if (this.hasAttribute('save-while-typing')) {
                    this.bolCurrentlySaving = false;
                    this.jsnUpdate = {};
                    this.state = 'saved';
                    //this.currentSaveAjax = false;
                    
                    // possible states:
                    //      'saved'
                    //      'waiting to save'
                    //      'saving'
                    
                    // JSON object for holding columns to update
                    // on keydown, keyup, change add to JSON object
                    // keep updating until all columns have been saved (undefined marks an empty column)
                    
                    changeHandler = function (event) {
                        var intKeyCode = event.which || event.keyCode, newValue,
                            targetColumnParent = GS.findParentElement(event.target, '[column]'),
                            parentRecordElement, strID;
                        
                        //console.log(event.target, targetColumnParent);
                        
                        if (targetColumnParent.getAttribute('column') && columnParentsUntilForm(element, targetColumnParent) === 0 &&
                            element.column(targetColumnParent.getAttribute('column')) !== targetColumnParent.value) {
                            
                            //event.stopPropagation();
                            if (element.saveTimerID) {
                                clearTimeout(element.saveTimerID);
                            }
                            
                            element.addMessage('waiting');
                            element.state = 'waiting to save';
                            
                            if (targetColumnParent.value !== null && targetColumnParent.value !== null) {
                                newValue = targetColumnParent.value;
                            } else {
                                newValue = targetColumnParent.checked;
                            }
                            
                            parentRecordElement = GS.findParentElement(targetColumnParent, '.form-record[data-id]');
                            strID = parentRecordElement.getAttribute('data-id');
                            strChangeStamp = parentRecordElement.getAttribute('data-change_stamp');
                            
                            element.jsnUpdate[strID] = element.jsnUpdate[strID] = {};
                            element.jsnUpdate[strID][targetColumnParent.getAttribute('column')] = newValue;
                            
                            element.saveTimerID = setTimeout(function () {
                                element.updateDataWithoutTemplate();
                                element.saveTimerID = undefined;
                            }, 300);
                        }
                    };
                    
                    this.addEventListener('keydown', changeHandler);
                    this.addEventListener('keyup', changeHandler);
                    this.addEventListener('change', changeHandler);
                    
                } else {
                    this.addEventListener('change', function (event) {
                        var newValue;
                        
                        if (event.target.getAttribute('column') && columnParentsUntilForm(element, event.target) === 0) {
                            //event.stopPropagation();
                            
                            if (event.target.value !== null && event.target.value !== null) {
                                newValue = event.target.value;
                            } else {
                                newValue = event.target.checked;
                            }
                            
                            this.updateData(event.target, event.target.getAttribute('column'), newValue);
                        }
                    });
                }
            },
            
            //inserted: function () {
            //    if (this.hasAttribute('id')) {
            //        queryStringAttributeHandler(this);
            //    }
            //},
            
            removed: function () {
                if (this.hasAttribute('save-while-typing') && this.saveTimerID) {
                    clearTimeout(this.saveTimerID);
                    this.emergencyUpdate();
                }
            }
        },
        events: {},
        accessors: {},
        methods: {
            refresh: function () {
                this.getData();
            },
            
            column: function (strColumn) {
                //console.log(this.lastSuccessData);
                return GS.envGetCell(this.lastSuccessData, 0, strColumn);
            },
            
            // ##################################################################
            // ######################## UPDATE FUNCTIONS ########################
            // ##################################################################
            
            emergencyUpdate: function () {
                if (this.currentSaveAjax) {
                    this.currentSaveAjax.abort();
                }
                this.bolCurrentlySaving = false;
                this.updateDataWithoutTemplate(false);
            },
            
            updateData: function (updateElement, strColumn, newValue) {
                var element = this, data, strLink,
                    strSource = this.queryStringTemplate(decodeURIComponent(element.getAttribute('src') ||
                                                                            element.getAttribute('source') || '')),
                    parentRecordElement, strID;
                
                strLink = '/v1/' + (element.getAttribute('action-update') || 'env/action_update') + '?src=' + encodeURIComponent(strSource);
                
                // 'id=' + GS.envGetCell(element.lastSuccessData, 0, 'id') + 
                // '&change_stamp=' + GS.envGetCell(element.lastSuccessData, 0, 'change_stamp'))
                
                parentRecordElement = GS.findParentElement(updateElement, '.form-record[data-id]');
                
                strID = parentRecordElement.getAttribute('data-id');
                
                strLink +=  '&where=' + encodeURIComponent('id=' + strID +
                                                          '&change_stamp=' + parentRecordElement.getAttribute('data-change_stamp')) +
                            '&column=' + strColumn +
                            '&value=' +  encodeURIComponent(newValue);
                
                // run ajax
                GS.dataFetch(strLink, true);
                
                // when the ajax is finished
                document.addEventListener('dataready_' + encodeURIComponent(strLink), function (event) {
                    var idIndex, i, len;
                    
                    if (!event.detail.error) {
                        idIndex = element.lastSuccessData.arr_column.indexOf('id');
                        
                        for (i = 0, len = element.lastSuccessData.dat.length; i < len; i += 1) {
                            if (String(element.lastSuccessData.dat[i][idIndex]) === strID) {
                                element.lastSuccessData.dat[i] = event.detail.response;
                                break;
                            }
                        }
                        
                        //element.lastSuccessData.dat[0] = event.detail.response;
                        GS.triggerEvent(element, 'after_update');
                        element.handleData(element.lastSuccessData);
                    } else {
                        GS.ajaxErrorDialog(event.detail.response);
                    }
                    
                    document.removeEventListener('dataready_' + encodeURIComponent(strLink), arguments.callee);
                });
            },
            
            updateDataWithoutTemplate: function (bolErrorHandling) {
                var element = this, data, strLink, strParameters, strSource, strUpdate, key, col_key, functionUpdateRecord,
                    idIndex, i, len, strID;
                
                if (this.bolCurrentlySaving === false) {
                    strSource = this.queryStringTemplate(decodeURIComponent(this.getAttribute('src') || this.getAttribute('source') || ''));
                    strLink = '/v1/' + (element.getAttribute('action-update') || 'env/action_update');
                    
                    functionUpdateRecord = function (strID, strColumn, recordIndex, strParameters) {
                        this.bolCurrentlySaving = true;
                        
                        element.jsnUpdate[strID][strColumn] = undefined;
                        
                        // run ajax
                        element.removeMessage('waiting');
                        element.addMessage('saving');
                        element.state = 'saving';
                        
                        element.currentSaveAjax = GS.ajaxJSON(strLink, strParameters, function (data, error) {
                            var col_key, key, bolSaveWaiting;
                            element.removeMessage('saving');
                            element.state = 'saved';
                            
                            if (!error) {
                                element.lastSuccessData.dat[recordIndex] = data.dat;
                                
                                element.bolCurrentlySaving = false;
                                
                                // if there is another save in the pipeline: bolSaveWaiting = true
                                for (key in element.jsnUpdate) {
                                    for (col_key in element.jsnUpdate[key]) {
                                        if (element.jsnUpdate[key][col_key] !== undefined) {
                                            bolSaveWaiting = true;
                                            break;
                                        }
                                    }
                                }
                                
                                // if there is a save waiting: update again
                                if (bolSaveWaiting) {
                                    element.updateDataWithoutTemplate();
                                    
                                } else {
                                    GS.triggerEvent(element, 'after_update');
                                }
                                
                            } else if (bolErrorHandling !== false) {
                                element.bolCurrentlySaving = false;
                                element.bolSaveWaiting = false;
                                
                                GS.ajaxErrorDialog(data, function () {
                                    if (element.saveTimerID) {
                                        clearTimeout(element.saveTimerID);
                                    }
                                    
                                    functionUpdateRecord(strID, strColumn, recordIndex, strParameters);
                                });
                            }
                        });
                    };
                    
                    // loop through the jsnUpdate variable and make one update for every record that needs an update
                    for (key in element.jsnUpdate) {
                        for (col_key in element.jsnUpdate[key]) {
                            if (element.jsnUpdate[key][col_key] !== undefined) {
                                strID = key;
                                strColumn = col_key;
                                newValue = element.jsnUpdate[key][col_key];
                                idIndex = element.lastSuccessData.arr_column.indexOf('id');
                                
                                for (i = 0, len = element.lastSuccessData.dat.length; i < len; i += 1) {
                                    if (String(element.lastSuccessData.dat[i][idIndex]) === strID) {
                                        functionUpdateRecord(strID, strColumn, i,
                                                            'src=' + encodeURIComponent(strSource) +
                                                            '&where=' + encodeURIComponent('id=' + strID +
                                                                  '&change_stamp=' + GS.envGetCell(element.lastSuccessData, i, 'change_stamp')) +
                                                            '&column=' + strColumn +
                                                            '&value=' +  encodeURIComponent(newValue));
                                        
                                        break;
                                    }
                                }
                                
                                break;
                            }
                        }
                    }
                }
            },
            
            
            // #################################################################
            // ######################### DATA HANDLING #########################
            // #################################################################
            
            // handles fetching the data
            //      if bolInitalLoad === true then
            //          use: initialize query COALESCE TO source query
            //      else
            //          use: source query
            getData: function () { //bolClearPrevious
                var element = this, data, strLink,
                    strSource = this.queryStringTemplate(decodeURIComponent(element.getAttribute('src') ||
                                                                            element.getAttribute('source') || '')),
                    strCols = this.getAttribute('cols') || '';
                
                //// use the source query and prepare the parameters for a fetch that would use the source query
                //if (strSource.trim().toLowerCase().indexOf('select') === 0) {
                //    strLink = '/v1/env/action_select_sql?select=' + encodeURIComponent(strSource);
                //} else {
                //    strLink = '/v1/env/action_select?view=' + encodeURIComponent(strSource);
                //}
                
                if (this.getAttribute('where') !== 'false') {
                    strLink = '/v1/' + (element.getAttribute('action-select') || 'env/action_select') + '?src=' + encodeURIComponent(strSource);
                    
                    strLink += '&where='    + encodeURIComponent(this.queryStringTemplate(decodeURIComponent(this.getAttribute('where') || ''))) +
                               '&limit='    + encodeURIComponent(this.queryStringTemplate(decodeURIComponent(this.getAttribute('limit') || '1'))) +
                               '&offset='   + encodeURIComponent(this.queryStringTemplate(decodeURIComponent(this.getAttribute('offset') || ''))) +
                               '&order_by=' + encodeURIComponent(this.queryStringTemplate(decodeURIComponent(this.getAttribute('ord') || ''))) +
                               '&cols='     + encodeURIComponent(strCols);
                    
                    
                    GS.addLoader('refresh_' + encodeURIComponent(strLink));
                    //if (GS.dataFetch(strLink, bolClearPrevious)) {
                    //    data = GS.dataFetch(strLink, bolClearPrevious);
                    //    
                    //    element.handleData(data.response, data.error);
                    //} else {
                    GS.dataFetch(strLink, true);
                    
                    document.addEventListener('dataready_' + encodeURIComponent(strLink), function (event) {
                        GS.removeLoader('refresh_' + encodeURIComponent(strLink));
                        element.handleData(event.detail.response, event.detail.error, 'load');
                        document.removeEventListener('dataready_' + encodeURIComponent(strLink), arguments.callee);
                    });
                }
            },
            
            // handles data result from method function: getData 
            //      success:  template
            //      error:    add error classes
            handleData: function (data, error, strAction, failCallback) {
                var arrElements, i, len, arrHeaders = [], self = this, intColumnElementFocusNumber, matchElement;
                
                // clear any old error status
                this.classList.remove('error');
                
                if (!error && data.dat.length === 0 && !this.hasAttribute('limit')) {
                    GS.dialog({
                        'header': 'Error',
                        'content': 'No record found',
                        'buttons': ['cancel', 'Try Again'],
                        'theme': 'error',
                        'after_close': function (event, strAnswer) {
                            if (strAnswer.toLowerCase() === 'Try Again'.toLowerCase()) {
                                self.refresh();
                            }
                        }
                    });
                }
                
                // if there was no error
                if (!error) {
                    this.error = false;
                    
                    // save success data
                    this.lastSuccessData = data;
                    
                    if (GS.findParentElement(document.activeElement, 'gs-form') === this) {
                        //console.log('Hey');
                        arrElements = xtag.query(this, '[column]');
                        matchElement = GS.findParentElement(document.activeElement, '[column]');
                        
                        if (matchElement) {
                            for (i = 0, len = arrElements.length; i < len; i += 1) {
                                if (arrElements[i] === matchElement) {
                                    intColumnElementFocusNumber = i;
                                    break;
                                }
                            }
                        }
                    }
                    
                    this.innerHTML = this.dataTemplateRecords(data);
                    
                    //console.log('hey again', intColumnElementFocusNumber);
                    // if there is a intColumnElementFocusNumber: restore focus
                    if (intColumnElementFocusNumber) {
                        arrElements = xtag.query(this, '[column]');
                        
                        if (arrElements.length > intColumnElementFocusNumber) {
                            arrElements[intColumnElementFocusNumber].focus();
                        }
                    }
                    
                    //trigger after_select
                    GS.triggerEvent(this, 'after_select');
                    //console.log('after_select');
                    
                // else there was an error: add error class, title attribute
                } else {
                    this.error = true;
                    this.classList.add('error');
                    
                    this.innerHTML = 'This form encountered an error.'
                    
                    //GS.ajaxErrorDialog(event.detail.response);
                    GS.ajaxErrorDialog(data);
                }
            },
            
            
            dataTemplateRecords: function (data) {
                var templateElement, strID, arrTemplates, i, len, jsnTemplates, strRet;
                
                templateElement = document.createElement('template');
                templateElement.innerHTML = this.templateHTML;
                
                // temporarily remove templates
                // recursively go through templates whose parents do not have the source attribute
                i = 0;
                arrTemplates = xtag.query(templateElement.content, 'template');
                jsnTemplates = {};
                
                //console.log(arrTemplates.length);
                
                while (arrTemplates.length > 0 && i < 100) {
                    //console.log(arrTemplates[0], arrTemplates[0].parentNode);
                    // if the current template has a source parent: remove temporarily
                    if (arrTemplates[0].parentNode.hasAttribute && (arrTemplates[0].parentNode.hasAttribute('src') || arrTemplates[0].parentNode.hasAttribute('source'))) {
                        strID = 'UNIqUE_PLaCEhOLDER-' + GS.GUID() + '-UNiQUE_PLaCEhOLdER';
                        jsnTemplates[strID] = arrTemplates[0].outerHTML;
                        arrTemplates[0].outerHTML = strID;
                        
                    // else: add to the arrTemplates array
                    } else {
                        //console.log(arrTemplates.length, xtag.query(arrTemplates[0].content, 'template'));
                        arrTemplates.push.apply(arrTemplates, xtag.query(arrTemplates[0].content, 'template'));
                        
                        //for (i = arrTemplates.length - 1; i >= 0; i -= 1) {
                        //    if (arrTemplates[i].parentNode.hasAttribute && (arrTemplates[i].parentNode.hasAttribute('src') || arrTemplates[i].parentNode.hasAttribute('source'))) {
                        //        arrTemplates.splice(i, 1);
                        //    }
                        //}
                    }
                    
                    // remove the current template from the arrTemplates array
                    arrTemplates.splice(0, 1);
                    
                    i += 1;
                }
                //console.log(templateElement.outerHTML);
                
                /* for (i = 0, len = arrTemplates.length, jsnTemplates = {}; i < len; i += 1) {
                    strID = 'UNiQUE_PLaCEHOLdAR-' + GS.GUID() + '-UNiQUE_PLaCEHOLdAR';
                    
                    //console.log(arrTemplates[i]);
                    
                    jsnTemplates[strID] = arrTemplates[i].outerHTML;
                    
                    arrTemplates[i].outerHTML = strID;
                } */
                
                strRet = doT.template(ml(function () {/*
                            {{##def.snippet:
                                {{ var row = {}, row_i, row_len, col_i, col_len, qs = jo.qs;
                                
                                for (row_i = 0, row_len = jo.data.dat.length; row_i < row_len; row_i += 1) {
                                    for (col_i = 0, col_len = jo.data.arr_column.length; col_i < col_len; col_i += 1) {
                                        if (jo.data.dat[row_i][col_i] === undefined || jo.data.dat[row_i][col_i] === null) {
                                            row[jo.data.arr_column[col_i]] = '';
                                        } else {
                                            row[jo.data.arr_column[col_i]] = jo.data.dat[row_i][col_i];
                                        }
                                    } }}{{# def.record }}
                                {{ } }} 
                            #}}
                            {{#def.snippet}}*/console.log
                        }), null, {"record": '<div class="form-record" ' +
                                                 (data.dat.length === 1 ? 'style="height: 100%;" ' : '') +
                                                  'data-id="{{! row.id }}" ' +
                                                  'data-change_stamp="{{! row.change_stamp }}" gs-dynamic>' +
                                                 decodeHTML(templateElement.innerHTML) +
                                             '</div>'})({
                            'data': data,
                            'qs': GS.qryToJSON(GS.getQueryString())
                        });
                
                //console.log(strRet);
                
                for (strID in jsnTemplates) {
                    //console.log(jsnTemplates[strID]);//, new RegExp(strID, 'g'), jsnTemplates, strID);
                    //                                                                  DO NOT DELETE, this allows single dollar signs to be inside dot notation
                    strRet = strRet.replace(new RegExp(strID, 'g'), jsnTemplates[strID].replace(/\$/g, '$$$$'));
                }
                
                //console.log(strRet);
                
                return strRet;
            },
            
            
            // #################################################################
            // ########################### UTILITIES ###########################
            // #################################################################
            
            addMessage: function (strMessageName) {
                if (strMessageName === 'saving') {
                    if (this.savingMessage) {
                        this.removeMessage('saving');
                    }
                    this.savingMessage = document.createElement('div');
                    this.savingMessage.classList.add('message');
                    this.savingMessage.innerHTML = 'Saving...';
                    
                    this.appendChild(this.savingMessage);
                    
                } else if (strMessageName === 'waiting') {
                    if (this.waitingMessage) {
                        this.removeMessage('waiting');
                    }
                    this.waitingMessage = document.createElement('div');
                    this.waitingMessage.classList.add('message');
                    this.waitingMessage.innerHTML = 'Waiting<br />to save...';
                    
                    this.appendChild(this.waitingMessage);
                }
            },
            
            removeMessage: function (strMessageName) {
                if (strMessageName === 'saving' && this.savingMessage) {
                    this.removeChild(this.savingMessage);
                    this.savingMessage = undefined;
                    
                } else if (strMessageName === 'waiting' && this.waitingMessage) {
                    this.removeChild(this.waitingMessage);
                    this.waitingMessage = undefined;
                }
            },
            
            queryStringTemplate: function (template) {
                var strWrapperTemplate = '{{##def.snippet:\n' +
                                         '    {{ var qs = jo; }} {{# def.template }}\n' +
                                         '#}}\n' +
                                         '{{#def.snippet}}';
                
                return doT.template(strWrapperTemplate, null, {'template': template})(GS.qryToJSON(GS.getQueryString())).trim();
            }
        }
    });
});