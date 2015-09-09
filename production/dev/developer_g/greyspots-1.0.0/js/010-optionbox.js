
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
        
        // SUSPEND-CREATED attribute
        addProp('suspend-created', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('suspend-created') || '') + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'suspend-created', this.value === 'true', true);
        });
        
        // SUSPEND-INSERTED attribute
        addProp('suspend-inserted', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('suspend-inserted') || '') + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'suspend-inserted', this.value === 'true', true);
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
    'use strict';
    
    // removes selected attribute from old selected option adds selected attribute to option
    function highlightOption(element, option) {
        var i, len, arrSelectedOptions, arrTempSelectedOptions;
        
        // clear previous selection
        arrSelectedOptions = xtag.query(element, 'gs-option[selected]');
        arrTempSelectedOptions = xtag.query(element, 'gs-option[tempselect]');
        
        for (i = 0, len = arrSelectedOptions.length; i < len; i += 1) {
            arrSelectedOptions[i].removeAttribute('selected');
        }
        
        for (i = 0, len = arrTempSelectedOptions.length; i < len; i += 1) {
            arrTempSelectedOptions[i].removeAttribute('tempselect');
        }
        
        // select/highlight the record that was provided
        option.setAttribute('selected', '');
    }
    
    // loops through the options and finds a option using the parameter
    function findOptionFromString(element, strSearchString) {
        var i, len, matchedOption, arrOptions = xtag.query(element, 'gs-option');
        
        // search exact text and search both the value attribute (if present) and the text content
        for (i = 0, len = arrOptions.length; i < len; i += 1) {
            if (arrOptions[i].getAttribute('value') === strSearchString || arrOptions[i].textContent === strSearchString) {
                matchedOption = arrOptions[i];
                
                break;
            }
        }
        
        return matchedOption;
    }
    
    function selectOption(element, handle, bolChange) {
        var option, strOptionValue, strOptionText;
        
        if (typeof handle === 'string') {
            option = findOptionFromString(element, handle);
            
            if (!option) {
                throw 'gs-optionbox Error: value: \'' + handle + '\' not found.';
            }
        } else {
            option = handle;
        }
        
        highlightOption(element, option);
        
        strOptionValue = option.getAttribute('value');
        strOptionText = option.textContent;
        
        if (element.value !== (strOptionValue || strOptionText)) {
            element.innerValue = strOptionValue || strOptionText;
            element.innerSelectedOption = option;
            
            if (bolChange) {
                xtag.fireEvent(element, 'change', {
                    bubbles: true,
                    cancelable: true
                });
            }
        }
    }
    
    
    // #################################################################
    // ########################## USER EVENTS ##########################
    // #################################################################
    
    // handle behaviours on keydown
    function handleKeyDown(event) {
        var element = event.target, intKeyCode = event.keyCode || event.which, selectedOption, selectedOptionIndex,
            tempSelectedOption, tempSelectedOptionIndex, arrOptions, i, len;
        
        if (!element.hasAttribute('disabled')) {
            if ((intKeyCode === 40 || intKeyCode === 38) && !event.shiftKey && !event.metaKey && !event.ctrlKey && !element.error) {
                
                arrOptions = xtag.query(element, 'gs-option');
                
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
                
            } else if (event.keyCode === 13 || event.keyCode === 32) {
                selectedOption = xtag.query(element, 'gs-option[selected]')[0];
                tempSelectedOption = xtag.query(element, 'gs-option[tempselect]')[0];
                
                if (tempSelectedOption) {
                    selectOption(element, tempSelectedOption, true);
                    
                } else if (selectedOption) {
                    selectOption(element, selectedOption, true);
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
    
    // dont do anything that modifies the element here
    function elementCreated(element) {
        // if "created" hasn't been suspended: run created code
        if (!element.hasAttribute('suspend-created')) {
            // if the value was set before the "created" lifecycle code runs: set attribute
            //      (discovered when trying to set a value of a date control in the after_open of a dialog)
            //      ("delete" keyword added because of firefox)
            if (element.value) {
                element.setAttribute('value', element.value);
                delete element.value;
                // element.value = null;
            }
        }
    }
    
    //
    function elementInserted(element) {
        // if "created" hasn't been suspended and "inserted" hasn't been suspended: run inserted code
        if (!element.hasAttribute('suspend-created') && !element.hasAttribute('suspend-inserted')) {
            // if this is the first time inserted has been run: continue
            if (!element.inserted) {
                element.inserted = true;
                
                var strQSValue;
                
                // allows the element to have focus
                if (!element.hasAttribute('tabindex')) {
                    element.setAttribute('tabindex', '0');
                }
                
                if (element.getAttribute('value')) {
                    selectOption(element, element.getAttribute('value'), false);
                }
                
                if (element.getAttribute('qs')) {
                    strQSValue = GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs'));
                    
                    if (strQSValue !== '' && !element.getAttribute('value')) {
                        selectOption(element, strQSValue, false);
                    }
                    
                    window.addEventListener('pushstate',    function () { createPushReplacePopHandler(element); });
                    window.addEventListener('replacestate', function () { createPushReplacePopHandler(element); });
                    window.addEventListener('popstate',     function () { createPushReplacePopHandler(element); });
                }
            }
        }
    }
    
    xtag.register('gs-optionbox', {
        lifecycle: {
            created: function () {
                elementCreated(this);
            },
            
            inserted: function () {
                elementInserted(this);
            },
            
            attributeChanged: function (strAttrName, oldValue, newValue) {
                // if "suspend-created" has been removed: run created and inserted code
                if (strAttrName === 'suspend-created' && newValue === null) {
                    elementCreated(this);
                    elementInserted(this);
                    
                // if "suspend-inserted" has been removed: run inserted code
                } else if (strAttrName === 'suspend-inserted' && newValue === null) {
                    elementInserted(this);
                    
                } else if (!this.hasAttribute('suspend-created') && !this.hasAttribute('suspend-inserted')) {
                    // attribute code
                }
            }
        },
        events: {
            'keydown': function (event) {
                if (!this.hasAttribute('suspend-created') && !this.hasAttribute('suspend-inserted')) {
                    handleKeyDown(event);
                }
            },
            
            'click': function (event) {
                if (!this.hasAttribute('suspend-created') && !this.hasAttribute('suspend-inserted')) {
                    var parentOption = getParentOption(event.target);
                    
                    //console.log(parentOption);
                    
                    if (parentOption && !parentOption.hasAttribute('selected')) {
                        selectOption(this, parentOption, true);
                    }
                }
            },
            
            'focusout': function () {
                if (!this.hasAttribute('suspend-created') && !this.hasAttribute('suspend-inserted')) {
                    var selectedOption = xtag.query(this, 'gs-option[selected]')[0],
                        tempSelectedOption = xtag.query(this, 'gs-option[tempselect]')[0];
                    
                    if (tempSelectedOption) {
                        selectOption(this, tempSelectedOption, true);
                        
                    } else if (selectedOption) {
                        selectOption(this, selectedOption, true);
                    }
                }
            }
        },
        accessors: {
            value: {
                get: function () {
                    return this.innerValue;
                },
                
                set: function (strNewValue) {
                    selectOption(this, strNewValue);
                }
            },
            
            selectedOption: {
                get: function () {
                    return this.innerSelectedOption;
                },
                
                set: function (newValue) {
                    selectOption(this, newValue);
                }
            },
            
            textValue: {
                get: function () {
                    return this.innerSelectedOption.textContent;
                },
                
                set: function (newValue) {
                    selectOption(this, newValue);
                }
            }
        },
        methods: {
            
        }
    });
});
