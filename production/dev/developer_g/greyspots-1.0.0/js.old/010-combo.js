
window.addEventListener('design-register-element', function () {
    'use strict';
    
    registerDesignSnippet('<gs-combo>', '<gs-combo>', 'gs-combo src="${1:test.tpeople}" column="${2}"></gs-combo>');
    
    designRegisterElement('gs-combo', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-combo.html');
    
    window.designElementProperty_GSCOMBO = function (selectedElement) {
        addProp('Source', true,
                '<gs-memo class="target" value="' + (decodeURIComponent(selectedElement.getAttribute('src') ||
                                                                        selectedElement.getAttribute('source') || '')) + '" mini></gs-memo>',
                function () {
            return setOrRemoveTextAttribute(selectedElement, 'src', encodeURIComponent(this.value));
        });
        
        addProp('Columns', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('cols') || '') + '" mini></gs-text>',
                function () {
            return setOrRemoveTextAttribute(selectedElement, 'cols', this.value);
        });
        
        addProp('Initialize Source', true,
                '<gs-memo class="target" value="' + (decodeURIComponent(selectedElement.getAttribute('initialize') || '')) + '" mini></gs-memo>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'initialize', encodeURIComponent(this.value));
        });
        
        addProp('Hide Columns', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('hide') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'hide', this.value);
        });
        
        addProp('Where', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('where') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'where', this.value);
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
        addProp('Column', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('column') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'column', this.value);
        });
        
        addProp('Value', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('value') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'value', this.value);
        });
        
        addProp('Column In Querystring', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('qs') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'qs', this.value, false);
        });
        
        addProp('Allow Empty', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('allow-empty')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'allow-empty', (this.value === 'true'), true);
        });
        
        addProp('Limit&nbsp;To&nbsp;List', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('limit-to-list')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'limit-to-list', (this.value === 'true'), true);
        });
        
        addProp('Mini', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('mini')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'mini', (this.value === 'true'), true);
        });
        
        // TITLE attribute
        addProp('Title', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('title') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'title', this.value);
        });
        
        // TABINDEX attribute
        addProp('Tabindex', true, '<gs-number class="target" value="' + (selectedElement.getAttribute('tabindex') || '') + '" mini></gs-number>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'tabindex', this.value);
        });
        
        // visibility attributes
        strVisibilityAttribute = '';
        if (selectedElement.hasAttribute('hidden'))          { strVisibilityAttribute = 'hidden'; }
        if (selectedElement.hasAttribute('hide-on-desktop')) { strVisibilityAttribute = 'hide-on-desktop'; }
        if (selectedElement.hasAttribute('hide-on-tablet'))  { strVisibilityAttribute = 'hide-on-tablet'; }
        if (selectedElement.hasAttribute('hide-on-phone'))   { strVisibilityAttribute = 'hide-on-phone'; }
        if (selectedElement.hasAttribute('show-on-desktop')) { strVisibilityAttribute = 'show-on-desktop'; }
        if (selectedElement.hasAttribute('show-on-tablet'))  { strVisibilityAttribute = 'show-on-tablet'; }
        if (selectedElement.hasAttribute('show-on-phone'))   { strVisibilityAttribute = 'show-on-phone'; }
        
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
        
        // DISABLED attribute
        addProp('Disabled', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('disabled') || '') + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'disabled', this.value === 'true', true);
        });
        
        addProp('Refresh On Querystring Columns', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('refresh-on-querystring-values') || '') + '" mini></gs-text>', function () {
            this.removeAttribute('refresh-on-querystring-change');
            return setOrRemoveTextAttribute(selectedElement, 'refresh-on-querystring-values', this.value);
        });
        
        addProp('Refresh On Querystring Change', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('refresh-on-querystring-change')) + '" mini></gs-checkbox>', function () {
            this.removeAttribute('refresh-on-querystring-values');
            return setOrRemoveBooleanAttribute(selectedElement, 'refresh-on-querystring-change', this.value === 'true', true);
        });
        
        //addFlexContainerProps(selectedElement);
        addFlexProps(selectedElement);
    };
});


document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    function pushReplacePopHandler(element) {
        var i, len, arrPopKeys, currentValue, bolRefresh = false, strQueryString = GS.getQueryString();
        
        if (element.getAttribute('qs')) {
            element.value = GS.qryGetVal(strQueryString, element.getAttribute('qs'));
        }
        if (element.hasAttribute('refresh-on-querystring-values')) {
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
            element.getData();
        }
    }
    
    function comboCreate(element) {
        var tableTemplateElement, tableTemplateElementCopy, oldRootElement, i, len,
            recordElement, strQueryString = GS.getQueryString(), arrElement, currentElement, strQSValue;
        
        element.open = false;
        element.error = false;
        element.ready = false;
        
        // handle "qs" attribute
        if (element.getAttribute('qs') ||
                element.getAttribute('refresh-on-querystring-values') ||
                element.hasAttribute('refresh-on-querystring-change')) {
            strQSValue = GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs'));
            
            if (strQSValue !== '' || !element.getAttribute('value')) {
                element.setAttribute('value', strQSValue);
            }
            
            element.popValues = {};
            window.addEventListener('pushstate', function () {    pushReplacePopHandler(element); });
            window.addEventListener('replacestate', function () { pushReplacePopHandler(element); });
            window.addEventListener('popstate', function () {     pushReplacePopHandler(element); });
        }
        
        //
        tableTemplateElement = xtag.queryChildren(element, 'template')[0];
        
        if (tableTemplateElement) {
            tableTemplateElementCopy = document.createElement('template');
            tableTemplateElementCopy.innerHTML = tableTemplateElement.innerHTML;
            
            recordElement = xtag.query(xtag.query(tableTemplateElementCopy.content, 'tbody')[0], 'tr')[0];
            
            if (recordElement) {
                arrElement = xtag.query(recordElement, '[column]');
                
                for (i = 0, len = arrElement.length; i < len; i += 1) {
                    currentElement = arrElement[i];
                    
                    if ((!currentElement.getAttribute('value')) && currentElement.getAttribute('column')) {
                        currentElement.setAttribute('value', '{{! row.' + currentElement.getAttribute('column') + ' }}');
                    }
                }
                
                element.tableTemplate = tableTemplateElementCopy.innerHTML;
                
                if (!element.getAttribute('src') && !element.getAttribute('source') && !element.getAttribute('initalize')) {
                    element.dropDownTable = GS.cloneElement(tableTemplateElementCopy.content.children[0]);
                }
            }
        }
        
        // filling root
        element.refreshControl();
        
        //
        element.addEventListener('click', function (event) {
            if (event.target.classList.contains('drop_down_button')) {
                if (!element.open && !element.error) {
                    element.openDropDown();
                } else {
                    element.closeDropDown();
                }
            }
        });
        
        element.addEventListener('keydown', function (event) {
            if (event.target.classList.contains('control')) {
                element.handleKeyDown(event);
            }
        });
        
        element.addEventListener('keyup', function (event) {
            if (event.target.classList.contains('control')) {
                element.handleKeyUp(event);
            }
        });
    }
    
    function comboInsert() {
        var element = this;
        
        if (xtag.queryChildren(element, '.root').length < 1) {
            element.refreshControl();
        }
        
        if (element.getAttribute('src') || element.getAttribute('source') || element.getAttribute('initalize')) {
            element.getData(true);
        } else {
            element.ready = true;
        }
    }
    
    xtag.register('gs-combo', {
        lifecycle: {
            created: function () {
                // if the value was set before the "created" lifecycle code runs: set attribute
                //      (discovered when trying to set a value of a date control in the after_open of a dialog)
                //      ("delete" keyword added because of firefox)
                if (this.value && !this.hasAttribute('value')) {
                    this.setAttribute('value', this.value);
                    delete this.value;
                }
                if (!this.hasAttribute('hold-init')) {
                    comboCreate(this);
                }
            },
            
            inserted: function () {
                if (!this.hasAttribute('hold-init')) {
                    comboInsert(this);
                }
            },
            
            removed: function () {
                this.innerHTML = this.initalHTML || '';
                this.bolPreviouslyRemoved = true;
            },
            
            attributeChanged: function (strAttrName, oldValue, newValue) {
                if (strAttrName === 'hold-init' && newValue === null) {
                    comboCreate(this);
                }
            }
        },
        events: {},
        accessors: {
            value: {
                get: function () {
                    if (this.control || this.innerValue) {
                        return this.innerValue || this.control.value;
                    } else if (this.getAttribute('value')) {
                        return this.getAttribute('value');
                    }
                    return undefined;
                },
                
                // set the value of the input and set the value attribute
                set: function (newValue) {
                    
                    // if we have not yet templated: just stick the value in an attribute
                    if (this.ready === false) {
                        this.setAttribute('value', newValue);
                        
                    // else if the value is empty and allow-empty is present
                    } else if (newValue === '' && this.hasAttribute('allow-empty')) {
                        this.innerValue = '';
                        this.control.value = '';
                        
                    // else select the record using the string that was sent
                    } else {
                        this.selectRecordFromValue(newValue, false);
                    }
                }
            },
            textValue: {
                // get value straight from the input
                get: function () {
                    return this.control.value;
                },
                
                // set the value of the input and set the value attribute
                set: function (newValue) {
                    
                    // if we have not yet templated: just stick the value in an attribute
                    if (this.ready === false) {
                        this.setAttribute('value', newValue);
                        
                    // else select the record using the string that was sent
                    } else {
                        this.selectRecordFromValue(newValue, false);
                    }
                }
            }
        },
        methods: {
            refresh: function () {
                getData(this);
            }
            
            focus: function () {
                this.control.focus();
            },
            
            // #################################################################
            // ########### SELECTION / HIGHLIGHTING / RECORD / VALUE ###########
            // #################################################################
            
            // scroll the dropdown to the selected record
            scrollToSelectedRecord: function () {
                var positioningContainer, scrollingContainer, arrTrs, i, len, intScrollTop, bolFoundSelected = false;
                
                if (this.currentDropDownContainer) {
                    positioningContainer = xtag.queryChildren(this.currentDropDownContainer, '.gs-combo-positioning-container')[0];
                    scrollingContainer = xtag.queryChildren(positioningContainer, '.gs-combo-scroll-container')[0];
                    arrTrs = xtag.query(this.dropDownTable, 'tr');
                    
                    for (i = 0, intScrollTop = 0, len = arrTrs.length; i < len; i += 1) {
                        if (arrTrs[i].hasAttribute('selected')) {
                            intScrollTop += arrTrs[i].offsetHeight / 2;
                            
                            bolFoundSelected = true;
                            
                            break;
                        } else {
                            intScrollTop += arrTrs[i].offsetHeight;
                        }
                    }
                    
                    if (bolFoundSelected) {
                        intScrollTop = intScrollTop - scrollingContainer.offsetHeight / 2;
                    } else {
                        intScrollTop = 0;
                    }
                    
                    scrollingContainer.scrollTop = intScrollTop;
                }
            },
            
            // removes selected class from old selected records
            clearSelection: function () {
                var i, len, arrSelectedTrs;
                
                // clear previous selection
                arrSelectedTrs = xtag.queryChildren(xtag.queryChildren(this.dropDownTable, 'tbody')[0], 'tr[selected]');
                
                for (i = 0, len = arrSelectedTrs.length; i < len; i += 1) {
                    arrSelectedTrs[i].removeAttribute('selected');
                }
            },
            
            // clears old selection and adds selected class to record
            highlightRecord: function (record) {
                
                // clear previous selection
                this.clearSelection();
                
                // select/highlight the record that was provided
                record.setAttribute('selected', '');
                //console.log(xtag.query(this, 'tr[selected]'));
            },
            
            // loops through the records and finds a record using the parameter (if bolPartialMatchAllowed === true then only search the first td text)
            findRecordFromString: function (strSearchString, bolPartialMatchAllowed) {
                var i, len, matchedRecord, arrTrs = xtag.queryChildren(xtag.queryChildren(this.dropDownTable, 'tbody')[0], 'tr');
                
                // if bolPartialMatchAllowed is true: only search the first td text (case insensitive)
                if (bolPartialMatchAllowed === true) {
                    strSearchString = strSearchString.toLowerCase();
                    
                    for (i = 0, len = arrTrs.length; i < len; i += 1) {
                        if (xtag.queryChildren(arrTrs[i], 'td')[0].textContent.toLowerCase().indexOf(strSearchString) === 0) {
                            matchedRecord = arrTrs[i];
                            
                            break;
                        }
                    }
                    
                // else: search exact text and search both the value attribute (if present) and the first td text
                } else {
                    for (i = 0, len = arrTrs.length; i < len; i += 1) {
                        if (arrTrs[i].getAttribute('value') === strSearchString || xtag.queryChildren(arrTrs[i], 'td')[0].textContent === strSearchString) {
                            matchedRecord = arrTrs[i];
                            
                            break;
                        }
                    }
                }
                
                return matchedRecord;
            },
            
            // highlights record, sets value of the combobox using record
            selectRecord: function (record, bolChange) {
                
                // add the yellow selection to the record
                this.highlightRecord(record);
                
                this.handleChange(bolChange);
            },
            
            // highlights record, sets value of the combobox using value attribute
            //      if bolChange === true then:
            //          change event and check for limit to list
            selectRecordFromValue: function (strValue, bolChange) {
                var record = this.findRecordFromString(strValue, false);
                
                // if a record was found: select it
                if (record) {
                    this.selectRecord(record, bolChange);
                    
                // else if limit to list (and no record was found):
                } else if (this.hasAttribute('limit-to-list') && bolChange) {
                    if (strValue === '' && this.hasAttribute('allow-empty')) {
                        this.handleChange(bolChange);
                        
                    } else {
                        alert('The text you entered is not in the list');
                        this.openDropDown();
                        GS.setInputSelection(this.control, 0, strValue.length);
                    }
                    
                // else (not limit to list and no record found):
                } else {
                    this.clearSelection();
                    
                    if (!this.hasAttribute('limit-to-list')) {
                        this.control.value = strValue;
                        this.innerValue = strValue;
                    }
                    
                    this.handleChange(bolChange);
                }
            },
            
            
            // #################################################################
            // ######################### UNCATEGORIZED #########################
            // #################################################################
            
            handleChange: function (bolChange) {
                var element = this, arrSelectedTrs, strHiddenValue = '', strTextValue = '', beforechangeevent, oldRecord,
                    oldInnerValue = this.innerValue,
                    oldControlValue = this.control.value;
                
                if (element.dropDownTable) {
                    arrSelectedTrs = xtag.queryChildren(xtag.queryChildren(element.dropDownTable, 'tbody')[0], 'tr[selected]');
                    //console.log(arrSelectedTrs.length);
                    // if there is a selected record
                    if (arrSelectedTrs.length > 0) {
                        // gather values from the selected record
                        strHiddenValue = arrSelectedTrs[0].getAttribute('value');
                        var firstTd = xtag.queryChildren(arrSelectedTrs[0], 'td')[0],
                            lastChild = firstTd.lastElementChild;
                        if (lastChild && lastChild.tagName.substring(0, 3) === 'GS-') {
                            strTextValue = lastChild.textValue || lastChild.value || lastChild.textContent;
                        } else {
                            strTextValue = firstTd.textContent;
                        }
                        
                    } else {
                        strTextValue = element.control.value;
                    }
                    
                } else {
                    strTextValue = element.control.value;
                }
                
                // set innervalue and control value using the values we gather from the record
                this.innerValue = strHiddenValue || strTextValue;
                this.control.value = strTextValue || strHiddenValue;
                
                if (bolChange) {
                    
                    if (document.createEvent) {
                        beforechangeevent = document.createEvent('HTMLEvents');
                        beforechangeevent.initEvent('beforechange', true, true);
                    } else {
                        beforechangeevent = document.createEventObject();
                        beforechangeevent.eventType = 'beforechange';
                    }
                    
                    beforechangeevent.eventName = 'beforechange';
                    
                    if (document.createEvent) {
                        element.dispatchEvent(beforechangeevent);
                    } else {
                        element.fireEvent("on" + beforechangeevent.eventType, beforechangeevent);
                    }
                    
                    // xtag.fireEvent(this, 'beforechange', { bubbles: true, cancelable: true });
                    
                    //console.log(beforechangeevent.defaultPrevented);
                    if (beforechangeevent.defaultPrevented !== true) {
                        xtag.fireEvent(this, 'change', { bubbles: true, cancelable: true });
                        
                    } else {
                        this.innerValue = oldInnerValue;
                        this.control.value = oldControlValue;
                        
                        oldRecord = this.findRecordFromString(oldInnerValue, false);
                        
                        if (oldRecord) {
                            this.highlightRecord(oldRecord);
                        } else {
                            this.clearSelection();
                        }
                    }
                    
                    element.ignoreChange = false;
                }
            },
            
            
            // ################################################################
            // ########################### DROPDOWN ###########################
            // ################################################################
            
            // open/position dropdown
            openDropDown: function () {
                var element = this;
                
                // if there is a source attribute on the combobox: refresh data
                if (element.getAttribute('src') || element.getAttribute('source')) {
                    element.getData(false, true, function () {
                        element.dropDown();
                    });
                } else {
                    element.dropDown();
                }
            },
            
            dropDown: function () {
                var element = this, dropDownContainer = document.createElement('div'), overlay,
                    positioningContainer, scrollContainer, observer;
                
                // create the dropdown element (and its children)
                dropDownContainer.classList.add('gs-combo-dropdown-container');
                dropDownContainer.setAttribute('gs-dynamic', '');
                dropDownContainer.innerHTML =   '<div class="gs-combo-overlay" gs-dynamic></div>' +
                                                '<div class="gs-combo-positioning-container" gs-dynamic>' +
                                                '    <div class="gs-combo-scroll-container" gs-dynamic></div>' +
                                                '</div>';
                
                // append dropdown to the body
                document.body.appendChild(dropDownContainer);
                
                // set variables for the various elements that we will need for calculation
                positioningContainer = xtag.queryChildren(dropDownContainer, '.gs-combo-positioning-container')[0];
                scrollContainer =      xtag.queryChildren(positioningContainer, '.gs-combo-scroll-container')[0];
                
                element.currentDropDownContainer = dropDownContainer;
                
                // fill dropdown with content
                if (element.dropDownTable) {
                    scrollContainer.appendChild(element.dropDownTable);
                    
                //} else if (element.tableTemplate) {
                //    scrollContainer.innerHTML = element.tableTemplate;
                //    
                } else {
                    scrollContainer.innerHTML = element.initalHTML;
                }
                
                // create an observer instance
                observer = new MutationObserver(function(mutations) {
                    element.dropDownSize();
                });
                
                // pass in the element node, as well as the observer options
                observer.observe(scrollContainer, {childList: true, subtree: true});
                
                element.dropDownSize();
            },
            
            dropDownSize: function () {
                var element = this,
                    dropDownContainer    = element.currentDropDownContainer,
                    positioningContainer = xtag.queryChildren(dropDownContainer, '.gs-combo-positioning-container')[0],
                    scrollContainer      = xtag.queryChildren(positioningContainer, '.gs-combo-scroll-container')[0],
                    overlay, jsnComboOffset, intComboHeight, intComboWidth, intViewportWidth, intViewportHeight,
                    intFromControlToBottomHeight, intFromControlToTopHeight, intContentHeight, intNewWidth,
                    strWidth = '', strHeight = '', strLeft = '', strTop = '', strBottom = '';
                
                // set variables needed for position calculation
                intComboHeight               = element.offsetHeight;
                intComboWidth                = element.offsetWidth;
                intViewportHeight            = dropDownContainer.offsetHeight;
                intViewportWidth             = dropDownContainer.offsetWidth;
                jsnComboOffset               = GS.getElementOffset(element);
                intContentHeight             = scrollContainer.scrollHeight;
                intFromControlToBottomHeight = intViewportHeight - (jsnComboOffset.top + intComboHeight);
                intFromControlToTopHeight    = jsnComboOffset.top;
                
                
                // set position, height and (top or bottom) variables
                // if desktop:
                if (!evt.touchDevice) {
                    // if viewport is too small go full page
                    if (window.innerHeight < 500 &&
                        intContentHeight > intFromControlToTopHeight &&
                        intContentHeight > intFromControlToBottomHeight) {
                        strHeight = window.innerHeight + 'px';
                        strTop =  '0px';
                        
                    // try 200px
                    } else if (intContentHeight < 500) {
                        strHeight = '200px';
                        
                        if (intFromControlToBottomHeight > intFromControlToTopHeight || intFromControlToBottomHeight > 200) {
                            strTop = (intFromControlToTopHeight + intComboHeight) + 'px';
                        } else {
                            strBottom = (intFromControlToBottomHeight + intComboHeight) + 'px';
                        }
                        
                    // try height from control to bottom of viewport
                    } else if (intFromControlToBottomHeight >= intFromControlToTopHeight) {
                        strHeight = intFromControlToBottomHeight + 'px';
                        strTop = (intFromControlToTopHeight + intComboHeight) + 'px';
                        
                    // else height from control to top of viewport
                    } else {// if (intFromControlToTopHeight >= intFromControlToBottomHeight) {
                        strHeight = intFromControlToTopHeight + 'px';
                        strBottom = (intFromControlToBottomHeight + intComboHeight) + 'px';
                    }
                    
                // else mobile:
                } else {
                    // try 200px bottom
                    if (intFromControlToBottomHeight > 200 && intContentHeight < 500) {
                        strHeight = intFromControlToBottomHeight + 'px';
                        strTop = (intFromControlToTopHeight + intComboHeight) + 'px';
                        
                    // try 200px top
                    } else if (intFromControlToTopHeight > 200 && intContentHeight < 500) {
                        strHeight = intFromControlToTopHeight + 'px';
                        strBottom = (intFromControlToBottomHeight + intComboHeight) + 'px';
                    
                    // else full page
                    } else {
                        strHeight = window.innerHeight + 'px';
                        strTop =  '0px';
                    }
                }
                
                
                // set width and left variables
                // try regular
                if (scrollContainer.scrollWidth <= scrollContainer.offsetWidth) {
                    if (intComboWidth < 150) {
                        intNewWidth = (window.innerWidth - jsnComboOffset.left) - 20;
                        
                        if (intNewWidth < 300) {
                            strWidth = intNewWidth + 'px';
                        } else {
                            strWidth = '300px';
                        }
                        
                    } else {
                        strWidth = intComboWidth + 'px';
                    }
                    strLeft = jsnComboOffset.left + 'px';
                    
                // else full width
                } else {
                    strWidth = '100%';
                    strLeft = '0px';
                }
                
                
                // set position and size using variables
                positioningContainer.style.left   = strLeft;
                positioningContainer.style.top    = strTop;
                positioningContainer.style.bottom = strBottom;
                positioningContainer.style.width  = strWidth;
                positioningContainer.style.height = strHeight;
                
                if (strTop) {
                    dropDownContainer.classList.add('below');
                } else {
                    dropDownContainer.classList.add('above');
                }
                
                
                // if the table is wider than the drop down: reflow
                if (scrollContainer.clientWidth < scrollContainer.scrollWidth) {
                    scrollContainer.classList.add('reflow');
                }
                
                
                // if the table is shorter than the drop down: resize the dropdown to be as short as the table
                if (intContentHeight < scrollContainer.clientHeight) {
                    positioningContainer.style.height = intContentHeight + 'px';
                }
                
                
                // make combobox float over overlay so that you can focus into the input box
                element.classList.add('open');
                
                // if there is already a placeholder: delete the old one
                if (element.placeholderElement) {
                    element.parentNode.removeChild(element.placeholderElement);
                    element.placeholderElement = undefined;
                    
                    element.style.left   = element.oldLeft;
                    element.style.right  = element.oldRight;
                    element.style.top    = element.oldTop;
                    element.style.bottom = element.oldBottom;
                    element.style.width  = element.oldWidth;
                    element.style.height = element.oldHeight;
                }
                
                // save old styles
                element.oldLeft   = element.style.left;
                element.oldRight  = element.style.right;
                element.oldTop    = element.style.top;
                element.oldBottom = element.style.bottom;
                element.oldWidth  = element.style.width;
                element.oldHeight = element.style.height;
                
                element.style.left = '';
                element.style.right = '';
                element.style.top = '';
                element.style.bottom = '';
                element.style.width = '';
                element.style.height = '';
                
                element.style.left   = jsnComboOffset.left + 'px';
                element.style.top    = jsnComboOffset.top + 'px';
                element.style.width  = intComboWidth + 'px';
                element.style.height = intComboHeight + 'px';
                
                // put a placeholder element so that elements dont jump under where the combobox was
                element.placeholderElement = document.createElement('div');
                
                element.placeholderElement.setAttribute('gs-dynamic', '');
                element.placeholderElement.style.left   = element.oldLeft;
                element.placeholderElement.style.right  = element.oldRight;
                element.placeholderElement.style.top    = element.oldTop;
                element.placeholderElement.style.bottom = element.oldBottom;
                element.placeholderElement.style.width  = element.oldWidth;      // this will set the width of the placholder if
                                                                                 //     the combobox had a set width
                element.placeholderElement.style.height = intComboHeight + 'px'; // set the height of the placeholder to the
                                                                                 //     actual height of the combobox
                
                element.parentNode.insertBefore(element.placeholderElement, element);
                
                // change element open state variable
                element.open = true;
                
                
                // bind drop down
                element.bindDropDown();
                
                
                // scroll to the selected record (if any)
                element.scrollToSelectedRecord();
            },
            
            // bind dropdown events
            bindDropDown: function () {
                var element = this, selectableTrs, closeDropDownHandler, selectRecordHandler, i, len,
                    overlay = xtag.queryChildren(element.currentDropDownContainer, '.gs-combo-overlay')[0],
                    unbindSelectRecordHandler, unbindDropDownEvents;
                
                // unbind function
                unbindDropDownEvents = function () {
                    var i, len;
                    
                    for (i = 0, len = selectableTrs.length; i < len; i += 1) {
                        selectableTrs[i].removeEventListener('click', selectRecordHandler);
                    }
                    
                    window.removeEventListener('resize', closeDropDownHandler);
                    window.removeEventListener('orientationchange', closeDropDownHandler);
                    window.removeEventListener('scroll', closeDropDownHandler);
                    overlay.removeEventListener('mousedown', closeDropDownHandler);
                };
                
                
                // handle record tap
                selectableTrs = xtag.queryChildren(xtag.queryChildren(element.dropDownTable, 'tbody')[0], 'tr');
                
                selectRecordHandler = function (event) {
                    element.selectRecord(event.target.parentNode, true);
                    closeDropDownHandler();
                };
                
                for (i = 0, len = selectableTrs.length; i < len; i += 1) {
                    selectableTrs[i].addEventListener('click', selectRecordHandler);
                }
                
                
                // handle dropdown close
                closeDropDownHandler = function () {
                    element.closeDropDown();
                    unbindDropDownEvents();
                };
                
                window.addEventListener('resize', closeDropDownHandler);
                window.addEventListener('orientationchange', closeDropDownHandler);
                window.addEventListener('scroll', closeDropDownHandler);
                overlay.addEventListener('mousedown', closeDropDownHandler);
            },
            
            // remove dropdown from screen
            closeDropDown: function () {
                
                // if there is a dropdown to remove: remove the dropdown
                if (this.currentDropDownContainer) {
                    document.body.removeChild(this.currentDropDownContainer);
                    this.currentDropDownContainer = undefined;
                    
                    this.classList.remove('open');
                    this.open = false;
                    
                    this.parentNode.removeChild(this.placeholderElement);
                    this.placeholderElement = undefined;
                    
                    this.style.left   = this.oldLeft;
                    this.style.right  = this.oldRight;
                    this.style.top    = this.oldTop;
                    this.style.bottom = this.oldBottom;
                    this.style.width  = this.oldWidth;
                    this.style.height = this.oldHeight;
                }
            },
            
            
            // #################################################################
            // ########################## USER EVENTS ##########################
            // #################################################################
            
            // handle behaviours on keydown
            handleKeyDown: function (event) {
                var element = this, intKeyCode = event.keyCode || event.which, selectedTr, trs, i, len, selectedRecordIndex;
                
                if (!this.hasAttribute('disabled')) {
                    if ((intKeyCode === 40 || intKeyCode === 38) && !event.shiftKey && !event.metaKey && !event.ctrlKey && !element.error) {
                        if (!element.open) {
                            element.openDropDown();
                            
                        } else {
                            trs = xtag.queryChildren(xtag.queryChildren(element.dropDownTable, 'tbody')[0], 'tr');
                            
                            for (i = 0, len = trs.length; i < len; i += 1) {
                                if (trs[i].hasAttribute('selected')) {
                                    selectedRecordIndex = i;
                                    selectedTr = trs[i];
                                    trs[i].removeAttribute('selected');
                                    
                                    break;
                                }
                            }
                            
                            if (intKeyCode === 40) {// next record or circle to first record or start selection at the first
                                if (!selectedTr || selectedRecordIndex === trs.length - 1) {
                                    element.highlightRecord(trs[0]);
                                    selectedTr = trs[0];
                                    
                                } else {
                                    element.highlightRecord(trs[selectedRecordIndex + 1]);
                                    selectedTr = trs[selectedRecordIndex + 1];
                                }
                                
                            } else if (intKeyCode === 38) {// prev record or circle to last record or start selection at the last
                                if (!selectedTr || selectedRecordIndex === 0) {
                                    element.highlightRecord(trs[trs.length - 1]);
                                    selectedTr = trs[trs.length - 1];
                                    
                                } else {
                                    element.highlightRecord(trs[selectedRecordIndex - 1]);
                                    selectedTr = trs[selectedRecordIndex - 1];
                                }
                            }
                            this.scrollToSelectedRecord();
                        }
                        if (selectedTr) {
                            element.control.value = xtag.queryChildren(selectedTr, 'td')[0].textContent;
                        }
                        GS.setInputSelection(element.control, 0, element.control.value.length);
                        event.preventDefault();
                        
                    } else if (event.keyCode === 13 || event.keyCode === 9) {
                        if (element.dropDownTable && xtag.queryChildren(xtag.queryChildren(element.dropDownTable, 'tbody')[0], 'tr[selected]').length > 0) {
                            element.selectRecordFromValue(this.control.value, true);
                            element.ignoreChange = true;
                        }
                        
                        element.closeDropDown();
                        
                    } else if (!event.metaKey &&       // not command key
                               !event.ctrlKey &&       // not control key
                               event.keyCode !== 37 && // not arrow keys
                               event.keyCode !== 38 &&
                               event.keyCode !== 39 &&
                               event.keyCode !== 40 &&
                               event.keyCode !== 46 && // not forward delete key
                               event.keyCode !== 8) {  // not delete key
                        this.attemptSearchOnNextKeyup = true;
                    }
                } else {
                    if (event.keyCode !== 9) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
                
                //console.log('handleKeyDown', intKeyCode, event);
            },
            
            // search on keyup
            //      the reason we are using keyup for search is because on keydown the letter has not been typed in yet and
            //      it would be harder if we tried to use the keycode to get the letter that was typed. so on keydown
            //      (which is where we can tell if CMD or CTRL and other keys that we dont want to search on and pressed)
            //      if we didn't type something that we dont want to search on but we typed somthing else: set this.attemptSearchOnNextKeyup
            //      to true and on keyup we read that and if it is set to true then we do a search and set it back to false
            handleKeyUp: function (event) {
                var element = this, intKeyCode = event.keyCode || event.which, strSearch = element.control.value, matchRecord;
                
                // if this.attemptSearchOnNextKeyup is true and
                //      there is a search string and
                //      the user has their text selection at the end of the of the input
                if (this.attemptSearchOnNextKeyup === true &&
                    strSearch &&
                    GS.getInputSelection(this.control).start === strSearch.length) {
                    
                    matchRecord = element.findRecordFromString(strSearch, true);
                    
                    // if we found a record and its was already selected: selected the matched record and dont 
                    if (matchRecord) {
                        this.highlightRecord(matchRecord);
                        element.control.value = xtag.queryChildren(matchRecord, 'td')[0].textContent;
                        GS.setInputSelection(element.control, strSearch.length, element.control.value.length);
                        
                        //if (strSearch.length === element.control.value.length) {
                        //    this.selectRecord(matchRecord, true);
                        //}
                        
                        this.scrollToSelectedRecord();
                        
                    } else {
                        element.clearSelection();
                        //element.selectRecordFromValue(strSearch, false);
                        //GS.setInputSelection(element.control, strSearch.length, element.control.value.length);
                    }
                }
                
                //console.log('handleKeyUp', this.attemptSearchOnNextKeyup, intKeyCode, event);
                
                if (this.attemptSearchOnNextKeyup === true) {
                    this.attemptSearchOnNextKeyup = false;
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
            getData: function (bolInitalLoad, bolClearPrevious, callback) {
                var element = this, data, strLink, dataFunction,
                    strInitalize = this.queryStringTemplate(decodeURIComponent(element.getAttribute('initialize') || '')),
                    strSource = this.queryStringTemplate(decodeURIComponent(element.getAttribute('src') ||
                                                                            element.getAttribute('source') || '')),
                    strCols = this.getAttribute('cols') || '';
                
                // if there is a initial query and this is the inital load: prepare the parameters for a fetch that would use the initial query
                if (strInitalize && bolInitalLoad) {
                    strLink = '/v1/' + (element.getAttribute('action-select') || 'env/action_select') + '?src=' + encodeURIComponent(strInitalize);
                    
                // else: use the source query and prepare the parameters for a fetch that would use the source query
                } else {
                    strLink = '/v1/' + (element.getAttribute('action-select') || 'env/action_select') + '?src=' + encodeURIComponent(strSource);
                }
                
                //console.log(strLink);
                
                strLink += '&where='    + encodeURIComponent(this.queryStringTemplate(decodeURIComponent(this.getAttribute('where') || ''))) +
                           '&limit='    + encodeURIComponent(this.queryStringTemplate(decodeURIComponent(this.getAttribute('limit') || ''))) +
                           '&offset='   + encodeURIComponent(this.queryStringTemplate(decodeURIComponent(this.getAttribute('offset') || ''))) +
                           '&order_by=' + encodeURIComponent(this.queryStringTemplate(decodeURIComponent(this.getAttribute('ord') || ''))) +
                           '&cols='     + encodeURIComponent(strCols);
                
                if (GS.dataFetch(strLink, bolClearPrevious)) {
                    data = GS.dataFetch(strLink, bolClearPrevious);
                    
                    element.handleData(bolInitalLoad, data.response, data.error); // (data.status === 'error' ? 'error' : null)
                } else {
                    dataFunction = function (event) {
                        document.removeEventListener('dataready_' + encodeURIComponent(strLink), dataFunction);
                        element.handleData(bolInitalLoad, event.detail.response, event.detail.error);
                        if (typeof callback === 'function') {
                            callback();
                        }
                    };
                    
                    document.addEventListener('dataready_' + encodeURIComponent(strLink), dataFunction);
                }
            },
            
            // handles data result from method function: getData 
            //      success:  template
            //      error:    add error classes
            handleData: function (bolInitalLoad, data, error) {
                var divElement, tableElement, theadElement, theadCellElements, tbodyElement, tbodyCellElements, lastRecordElement,
                    currentCellLabelElement, template, i, len, arrHeaders = [], strTemplate, arrHide, strHeaderCells, strRecordCells,
                    tableTemplateElement, recordElements, recordElement;
                
                //GS.triggerEvent(this, 'after_select'); <== caused a MAJOR issue where code that was supposed to
                //                                              run after an envelope after_select caught all of
                //                                              the after selects of the comboboxes in the envelope
                
                // clear any old error status
                this.classList.remove('error');
                this.dropDownButton.setAttribute('title', '');
                this.dropDownButton.setAttribute('icon', 'angle-down');
                
                // if there was no error
                if (!error) {
                    this.error = false;
                    
                    //console.log(this, this.tableTemplate);
                    
                    if (this.tableTemplate) {
                        //tableTemplateElement = document.createElement('template');
                        //tableTemplateElement.innerHTML = this.tableTemplate;
                        //
                        //theadElement = xtag.query(tableTemplateElement.content, 'thead')[0];
                        //tbodyElement = xtag.query(tableTemplateElement.content, 'tbody')[0];
                        //
                        //console.log(theadElement, tbodyElement);
                        
                        strTemplate = this.tableTemplate; //this.initalHTML;
                        
                    } else { // if (data.arr_column)
                        // create an array of hidden column numbers
                        arrHide = (this.getAttribute('hide') || '').split(/[\s]*,[\s]*/);
                        
                        // build up the header cells variable and the record cells variable
                        for (i = 0, len = data.arr_column.length, strHeaderCells = '', strRecordCells = ''; i < len; i += 1) {
                            // if this column is not hidden
                            if (arrHide.indexOf((i + 1) + '') === -1 && arrHide.indexOf(data.arr_column[i]) === -1) {
                                // append a new cell to each of the header cells and record cells variables
                                strHeaderCells += '<th gs-dynamic>' + encodeHTML(data.arr_column[i]) + '</th> ';
                                strRecordCells += '<td gs-dynamic>{{! row[\'' + data.arr_column[i] + '\'] }}</td> ';
                            }
                        }
                        
                        // put everything together
                        strTemplate =   '<table gs-dynamic>' +
                                            '<thead gs-dynamic>' +
                                                '<tr gs-dynamic>' +
                                                    strHeaderCells +
                                                '</tr>' +
                                            '</thead>' +
                                            '<tbody gs-dynamic>' +
                                                '<tr value="{{! row[\'' + data.arr_column[0] + '\'] }}" gs-dynamic>' +
                                                    strRecordCells +
                                                '</tr>' +
                                            '</tbody>' +
                                        '<table>';
                    }
                    
                    divElement = document.createElement('div');
                    
                    divElement.innerHTML = strTemplate;
                    
                    tableElement = xtag.queryChildren(divElement, 'table')[0];
                    theadElement = xtag.queryChildren(tableElement, 'thead')[0];
                    tbodyElement = xtag.queryChildren(tableElement, 'tbody')[0];
                    
                    // if there is a tbody
                    if (tbodyElement) {
                        recordElement = xtag.queryChildren(tbodyElement, 'tr')[0];
                        
                        // if there is a record: template
                        if (recordElement) {
                            
                            // if there is a thead element: add reflow cell headers to the tds
                            if (theadElement) {
                                theadCellElements = xtag.query(theadElement, 'td, th');
                                tbodyCellElements = xtag.query(tbodyElement, 'td, th');
                                
                                for (i = 0, len = theadCellElements.length; i < len; i += 1) {
                                    currentCellLabelElement = document.createElement('b');
                                    currentCellLabelElement.classList.add('cell-label');
                                    currentCellLabelElement.setAttribute('data-text', (theadCellElements[i].textContent || '') + ':');
                                    currentCellLabelElement.setAttribute('gs-dynamic', '');
                                    
                                    if (tbodyCellElements[i].childNodes) {
                                        tbodyCellElements[i].insertBefore(currentCellLabelElement, tbodyCellElements[i].childNodes[0]);
                                    } else {
                                        tbodyCellElements[i].insertChild(currentCellLabelElement);
                                    }
                                }
                            }
                            
                            // template the html
                            tbodyElement.innerHTML = doT.template(ml(function () {/*
                                {{##def.snippet:
                                    {{ var row, row_number, i, len, col_i, col_len, qs = jo.qs, intAddToRowNumber = 0;
                                    
                                    if (!isNaN(jo.i)) {
                                        i = jo.i;
                                        len = jo.len || jo.i + 1;
                                        
                                    } else {
                                        i = 0;
                                        len = jo.data.dat.length;
                                    }
                                    
                                    for (; i < len; i += 1) {
                                        row = {};
                                        row_number = i + 1;
                                        row.row_number = row_number;
                                        
                                        for (col_i = 0, col_len = jo.data.arr_column.length; col_i < col_len; col_i += 1) {
                                            if (jo.data.dat[i][col_i] === undefined || jo.data.dat[i][col_i] === null) {
                                                row[jo.data.arr_column[col_i]] = '';
                                            } else {
                                                row[jo.data.arr_column[col_i]] = jo.data.dat[i][col_i];
                                            }
                                        } }}{{# def.record }}
                                    {{ } }}
                                #}}
                                {{#def.snippet}}*/console.log
                            }), null, {"record": tbodyElement.innerHTML})({'data': data, 'qs': GS.qryToJSON(GS.getQueryString())});
                            
                            this.dropDownTable = tableElement;
                            this.ready = true;
                        }
                    }
                    
                    //if (data.arr_column) {
                    if (bolInitalLoad && this.getAttribute('value')) {
                        this.selectRecordFromValue(this.getAttribute('value'), false);
                        
                    } else if (this.value) {
                        this.selectRecordFromValue(this.value, false);
                    }
                    //}
                    
                // else there was an error: add error class, title attribute
                } else {
                    console.error(data);
                    this.error = true;
                    this.ready = false;
                    this.classList.add('error');
                    this.dropDownButton.setAttribute('title', 'This combobox has failed to load.');
                    this.dropDownButton.setAttribute('icon', 'exclamation-circle');
                    
                    if (this.hasAttribute('limit-to-list')) {
                        this.setAttribute('disabled', '');
                    }
                }
            },
            
            
            // #################################################################
            // ########################### UTILITIES ###########################
            // #################################################################
            
            refreshControl: function () {
                var element = this, i, len, divElement, arrPassThroughAttributes = [
                        'placeholder',
                        'name',
                        'maxlength',
                        'autocorrect',
                        'autocapitalize',
                        'autocomplete',
                        'autofocus'
                    ];
                
                // clear out the combobox HTML
                element.innerHTML = '';
                
                // creating/setting root
                divElement = document.createElement('div');
                divElement.setAttribute('gs-dynamic', '');
                divElement.classList.add('root');
                
                element.appendChild(divElement);
                element.root = divElement;
                
                //element.root.appendChild(template.cloneNode(true));
                element.root.innerHTML = '<input gs-dynamic class="control" type="text" />' +
                                         '<gs-button gs-dynamic class="drop_down_button" icononly icon="angle-down" no-focus></gs-button>';
                
                element.control = xtag.query(element, '.control')[0];
                element.dropDownButton = xtag.query(element, '.drop_down_button')[0];
                
                // copy passthrough attrbutes to control
                for (i = 0, len = arrPassThroughAttributes.length; i < len; i += 1) {
                    if (element.hasAttribute(arrPassThroughAttributes[i])) {
                        element.control.setAttribute(arrPassThroughAttributes[i], element.getAttribute(arrPassThroughAttributes[i]) || '');
                    }
                }
                
                // bind change event to control
                element.control.addEventListener('change', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    if (!element.ignoreChange) {
                        element.selectRecordFromValue(this.value, true);
                    }
                    element.ignoreChange = false;
                });
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
}); // ()