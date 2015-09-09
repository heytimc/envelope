
window.addEventListener('design-register-element', function () {
    registerDesignSnippet('<gs-optionbox>', '<gs-optionbox>', 'gs-optionbox column="${1}">\n' +
                                                              '    <gs-option value="${2}">${3}</gs-option>\n' +
                                                              '</gs-optionbox>');
    
    designRegisterElement('gs-optionbox', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-optionbox.html');
    
    registerDesignSnippet('<gs-option>', '<gs-option>', 'gs-option value="${1}">${2}</gs-option>');
    
    designRegisterElement('gs-option', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-optionbox.html');
    
    window.designElementProperty_GSOPTIONBOX = function(selectedElement) {
        addProp('Column', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('column') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'column', this.value);
        });
        
        addProp('Value', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('value') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'value', this.value);
        });
        
        addProp('Column In Querystring', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('qs') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'qs', this.value, false);
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
        
        // DISABLED attribute
        addProp('Disabled', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('disabled') || '') + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'disabled', this.value === 'true', true);
        });
        
        //addFlexContainerProps(selectedElement);
        addFlexProps(selectedElement);
    };
    
    window.designElementProperty_GSOPTION = function(selectedElement) {
        addProp('Hidden Value:', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('value') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'value', this.value);
        });
        
        // TITLE attribute
        addProp('Title', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('title') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'title', this.value);
        });
        
        addFlexContainerProps(selectedElement);
        //addFlexProps(selectedElement);
    };
});

document.addEventListener('DOMContentLoaded', function () {
    function getParentOption(element) {
        var currentElement = element;
        
        while (currentElement.nodeName !== 'GS-OPTION' && currentElement.nodeName !== 'HTML') {
            currentElement = currentElement.parentNode;
        }
        
        if (currentElement.nodeName !== 'GS-OPTION') {
            return undefined;
        }
        
        return currentElement;
    }
    
    function createPushReplacePopHandler(element) {
        element.value = GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs'));
    }
    
    xtag.register('gs-optionbox', {
        lifecycle: {
            created: function() {
                var element = this, strQSValue;
                
                // if the value was set before the "created" lifecycle code runs: set attribute
                //      (discovered when trying to set a value of a date control in the after_open of a dialog)
                //      ("delete" keyword added because of firefox)
                if (this.value) {
                    this.setAttribute('value', this.value);
                    delete this.value;
                    // this.value = null;
                }
                
                // allows the element to have focus
                this.setAttribute('tabindex', '0');
                
                if (this.getAttribute('value')) {
                    this.selectOption(this.getAttribute('value'), false);
                }
                
                if (this.getAttribute('qs')) {
                    strQSValue = GS.qryGetVal(GS.getQueryString(), this.getAttribute('qs'));
                    
                    if (strQSValue !== '' && !this.getAttribute('value')) {
                        this.selectOption(strQSValue, false);
                    }
                    
                    window.addEventListener('pushstate',    function () { createPushReplacePopHandler(element); });
                    window.addEventListener('replacestate', function () { createPushReplacePopHandler(element); });
                    window.addEventListener('popstate',     function () { createPushReplacePopHandler(element); });
                    
                }
            }
        },
        events: {
            'keydown': function (event) {
                this.handleKeyDown(event);
            },
            
            'click': function (event) {
                var parentOption = getParentOption(event.target);
                
                //console.log(parentOption);
                
                if (parentOption && !parentOption.hasAttribute('selected')) {
                    this.selectOption(parentOption, true);
                }
            },
            
            'focusout': function () {
                var selectedOption = xtag.query(this, 'gs-option[selected]')[0],
                    tempSelectedOption = xtag.query(this, 'gs-option[tempselect]')[0];
                
                if (tempSelectedOption) {
                    this.selectOption(tempSelectedOption, true);
                    
                } else if (selectedOption) {
                    this.selectOption(selectedOption, true);
                }
            }
        },
        accessors: {
            value: {
                get: function () {
                    return this.innerValue;
                },
                
                set: function (strNewValue) {
                    this.selectOption(strNewValue);
                }
            },
            
            selectedOption: {
                get: function () {
                    return this.innerSelectedOption;
                },
                
                set: function (newValue) {
                    this.selectOption(newValue);
                }
            },
            
            textValue: {
                get: function () {
                    return this.innerSelectedOption.textContent;
                },
                
                set: function (newValue) {
                    this.selectOption(newValue);
                }
            }
        },
        methods: {
            
            // removes selected attribute from old selected option adds selected attribute to option
            highlightOption: function (option) {
                var i, len, arrSelectedOptions, arrTempSelectedOptions;
                
                // clear previous selection
                arrSelectedOptions = xtag.query(this, 'gs-option[selected]');
                arrTempSelectedOptions = xtag.query(this, 'gs-option[tempselect]');
                
                for (i = 0, len = arrSelectedOptions.length; i < len; i += 1) {
                    arrSelectedOptions[i].removeAttribute('selected');
                }
                
                for (i = 0, len = arrTempSelectedOptions.length; i < len; i += 1) {
                    arrTempSelectedOptions[i].removeAttribute('tempselect');
                }
                
                // select/highlight the record that was provided
                option.setAttribute('selected', '');
            },
            
            // loops through the options and finds a option using the parameter
            findOptionFromString: function (strSearchString) {
                var i, len, matchedOption, arrOptions = xtag.query(this, 'gs-option');
                
                // search exact text and search both the value attribute (if present) and the text content
                for (i = 0, len = arrOptions.length; i < len; i += 1) {
                    if (arrOptions[i].getAttribute('value') === strSearchString || arrOptions[i].textContent === strSearchString) {
                        matchedOption = arrOptions[i];
                        
                        break;
                    }
                }
                
                return matchedOption;
            },
            
            selectOption: function (handle, bolChange) {
                var option, strOptionValue, strOptionText;
                
                if (typeof handle === 'string') {
                    option = this.findOptionFromString(handle);
                    
                    if (!option) {
                        throw 'gs-optionbox Error: value: \'' + handle + '\' not found.';
                    }
                } else {
                    option = handle;
                }
                
                this.highlightOption(option);
                
                strOptionValue = option.getAttribute('value');
                strOptionText = option.textContent;
                
                if (this.value !== (strOptionValue || strOptionText)) {
                    this.innerValue = strOptionValue || strOptionText;
                    this.innerSelectedOption = option;
                    
                    if (bolChange) {
                        xtag.fireEvent(this, 'change', {
                            bubbles: true,
                            cancelable: true
                        });
                    }
                }
            },
            
            
            // #################################################################
            // ########################## USER EVENTS ##########################
            // #################################################################
            
            // handle behaviours on keydown
            handleKeyDown: function (event) {
                var element = this, intKeyCode = event.keyCode || event.which, selectedOption, selectedOptionIndex,
                    tempSelectedOption, tempSelectedOptionIndex, arrOptions, i, len;
                
                if (!element.hasAttribute('disabled')) {
                    if ((intKeyCode === 40 || intKeyCode === 38) && !event.shiftKey && !event.metaKey && !event.ctrlKey && !element.error) {
                        
                        arrOptions = xtag.query(this, 'gs-option');
                        
                        for (i = 0, len = arrOptions.length; i < len; i += 1) {
                            if (arrOptions[i].hasAttribute('tempselect')) {
                                tempSelectedOptionIndex = i;
                                tempSelectedOption = arrOptions[i];
                                arrOptions[i].removeAttribute('tempselect');
                            }
                            
                            if (arrOptions[i].hasAttribute('selected')) {
                                selectedOptionIndex = i;
                                selectedOption = arrOptions[i];
                            }
                            
                            if (selectedOption && tempSelectedOption) {
                                break;
                            }
                        }
                        
                        //console.log(selectedOption, selectedOptionIndex, tempSelectedOption, tempSelectedOptionIndex, arrOptions.length);
                        
                        //
                        if (tempSelectedOption && tempSelectedOptionIndex !== arrOptions.length - 1 && intKeyCode === 40) {
                            if (!arrOptions[tempSelectedOptionIndex + 1].hasAttribute('selected')) {
                                arrOptions[tempSelectedOptionIndex + 1].setAttribute('tempselect', '');
                            }
                            
                        //
                        } else if (tempSelectedOption && tempSelectedOptionIndex !== 0 && intKeyCode === 38) {
                            if (!arrOptions[tempSelectedOptionIndex - 1].hasAttribute('selected')) {
                                arrOptions[tempSelectedOptionIndex - 1].setAttribute('tempselect', '');
                            }
                            
                        //
                        } else if (!tempSelectedOption && selectedOption && selectedOptionIndex !== arrOptions.length - 1 && intKeyCode === 40) {
                            if (!arrOptions[selectedOptionIndex + 1].hasAttribute('selected')) {
                                arrOptions[selectedOptionIndex + 1].setAttribute('tempselect', '');
                            }
                            
                        //
                        } else if (!tempSelectedOption && selectedOption && selectedOptionIndex !== 0 && intKeyCode === 38) {
                            if (!arrOptions[selectedOptionIndex - 1].hasAttribute('selected')) {
                                arrOptions[selectedOptionIndex - 1].setAttribute('tempselect', '');
                            }
                            
                        // tempselect first record
                        } else if (intKeyCode === 40) {
                            if (!arrOptions[0].hasAttribute('selected')) {
                                arrOptions[0].setAttribute('tempselect', '');
                            }
                            
                        // tempselect last record
                        } else if (intKeyCode === 38) {
                            if (!arrOptions[arrOptions.length - 1].hasAttribute('selected')) {
                                arrOptions[arrOptions.length - 1].setAttribute('tempselect', '');
                            }
                        }
                        
                        event.preventDefault();
                        
                    } else if (event.keyCode === 13) {
                        selectedOption = xtag.query(this, 'gs-option[selected]')[0];
                        tempSelectedOption = xtag.query(this, 'gs-option[tempselect]')[0];
                        
                        if (tempSelectedOption) {
                            this.selectOption(tempSelectedOption, true);
                            
                        } else if (selectedOption) {
                            this.selectOption(selectedOption, true);
                        }
                    }
                } else {
                    if (event.keyCode !== 9) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
                
                //console.log('handleKeyDown', intKeyCode, event);
            }
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    
    xtag.register('gs-option', {
        lifecycle: {},
        events: {},
        accessors: {},
        methods: {}
    });
});