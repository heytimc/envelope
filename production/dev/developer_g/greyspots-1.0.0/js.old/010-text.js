
window.addEventListener('design-register-element', function () {
    
    registerDesignSnippet('<gs-text>', '<gs-text>', 'gs-text column="${1:name}"></gs-text>');
    registerDesignSnippet('<gs-text> With Label', '<gs-text>', 'label for="${1:text-insert-last_name}">${2:Last Name}:</label>\n' +
                                                               '<gs-text id="${1:text-insert-last_name}" column="${3:last_name}"></gs-text>');
    
    designRegisterElement('gs-text', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-text.html');
    
    window.designElementProperty_GSTEXT = function(selectedElement) {
        addProp('Column', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('column') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'column', this.value);
        });
        
        addProp('Value', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('value') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'value', this.value);
        });
        
        addProp('Column In Querystring', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('qs') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'qs', this.value, false);
        });
        
        addProp('Placeholder', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('placeholder') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'placeholder', this.value);
        });
        
        //console.log(selectedElement.hasAttribute('mini'));
        
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
        
        addProp('Autocorrect', true, '<gs-checkbox class="target" value="' + (selectedElement.getAttribute('autocorrect') !== 'off') + '" mini></gs-checkbox>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'autocorrect', (this.value === 'false' ? 'off' : ''));
        });
        
        addProp('Autocapitalize', true, '<gs-checkbox class="target" value="' + (selectedElement.getAttribute('autocapitalize') !== 'off') + '" mini></gs-checkbox>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'autocapitalize', (this.value === 'false' ? 'off' : ''));
        });
        
        addProp('Autocomplete', true, '<gs-checkbox class="target" value="' + (selectedElement.getAttribute('autocomplete') !== 'off') + '" mini></gs-checkbox>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'autocomplete', (this.value === 'false' ? 'off' : ''));
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
});

document.addEventListener('DOMContentLoaded', function () {    
    'use strict';
    
    // re-target change event from control to element
    function changeFunction(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        GS.triggerEvent(event.target.parentNode, 'change');
        
        return false;
    }
    
    // re-target focus event from control to element
    function focusFunction(event) {
        GS.triggerEvent(event.target.parentNode, 'focus');
    }
    
    // re-target blur event from control to element
    function blurFunction(event) {
        GS.triggerEvent(event.target.parentNode, 'blur');
    }
    
    function createPushReplacePopHandler(element) {
        element.value = GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs'));
    }
    
    xtag.register('gs-text', {
        lifecycle: {
            // Fires when an instance of the element is created
            created: function() {
                var element = this, strQSValue;
                
                // if the value was set before the "created" lifecycle code runs: set attribute
                //      (discovered when trying to set a value of a date control in the after_open of a dialog)
                //      ("delete" keyword added because of firefox)
                if (this.value) {
                    this.setAttribute('value', this.value);
                    delete this.value;
                    //this.value = null;
                }
                
                // handle control
                this.handleContents();
                
                // fill control
                this.syncView();
                
                // bind/handle query string
                if (this.getAttribute('qs')) {
                    strQSValue = GS.qryGetVal(GS.getQueryString(), this.getAttribute('qs'));
                    
                    if (strQSValue !== '' || !this.getAttribute('value')) {
                        this.value = strQSValue;
                    }
                    
                    window.addEventListener('pushstate',    function () { createPushReplacePopHandler(element); });
                    window.addEventListener('replacestate', function () { createPushReplacePopHandler(element); });
                    window.addEventListener('popstate',     function () { createPushReplacePopHandler(element); });
                }
            },
            
            inserted: function () {
                // if this element is empty when it is inserted: initalize
                if (this.innerHTML.trim() === '') {
                    // handle control
                    this.handleContents();
                    
                    // fill control
                    this.syncView();
                }
            },
            
            attributeChanged: function (strAttrName, oldValue, newValue) {
                var currentValue;
                
                if (strAttrName === 'disabled') {
                    // handle control
                    this.handleContents();
                    
                    // fill control
                    this.syncView();
                    
                } else if (strAttrName === 'value' && this.initalized) {
                    
                    if (this.hasAttribute('disabled')) {
                        currentValue = this.innerHTML;
                    } else {
                        currentValue = this.control.value;
                    }
                    
                    // if there is a difference between the new value in the
                    //      attribute and the valued in the front end: refresh the front end
                    if (newValue !== currentValue) {
                        this.syncView();
                    }
                }
            }
        },
        events: {
            // on keydown and keyup sync the value attribute and the control value
            'keydown': function (event) {
                if (this.hasAttribute('disabled') && event.keyCode !== 9) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    this.syncGetters();
                }
            },
            'keyup': function () {
                this.syncGetters();
            }
        },
        accessors: {
            value: {
                // get value straight from the input
                get: function () {
                    return this.getAttribute('value');
                },
                
                // set the value of the input and set the value attribute
                set: function (strNewValue) {
                    this.setAttribute('value', strNewValue);
                }
            }
        },
        methods: {
            focus: function () {
                if (this.control) {
                    this.control.focus();
                }
            },
            
            handleContents: function () {
                var arrPassThroughAttrs = [
                        'placeholder', 'name', 'type', 'maxlength', 'autocorrect',
                        'autocapitalize', 'autocomplete', 'autofocus'
                    ], i, len;
                
                // if the gs-text element has a tabindex: save the tabindex and remov the attribute
                if (this.hasAttribute('tabindex')) {
                    this.savedTabIndex = this.getAttribute('tabindex');
                    this.removeAttribute('tabindex');
                }
                
                // if the gs-text doesn't have a disabled attribute: use an input element
                if (!this.hasAttribute('disabled')) {
                    // add control input and save it to a variable for later use
                    this.innerHTML = '<input class="control" gs-dynamic type="text" />';
                    this.control = this.children[0];
                    
                    // bind event re-targeting functions
                    this.control.removeEventListener('change', changeFunction);
                    this.control.addEventListener('change', changeFunction);
                    
                    this.control.removeEventListener('focus', focusFunction);
                    this.control.addEventListener('focus', focusFunction);
                    
                    this.control.removeEventListener('blur', blurFunction);
                    this.control.addEventListener('blur', blurFunction);
                    
                    // copy passthrough attributes to control
                    for (i = 0, len = arrPassThroughAttrs.length; i < len; i += 1) {
                        if (this.hasAttribute(arrPassThroughAttrs[i])) {
                            this.control.setAttribute(arrPassThroughAttrs[i], this.getAttribute(arrPassThroughAttrs[i]) || '');
                        }
                    }
                    
                    // if we saved a tabindex: apply the tabindex to the control
                    if (this.savedTabIndex !== undefined && this.savedTabIndex !== null) {
                        this.control.setAttribute('tabindex', this.savedTabIndex);
                    }
                    
                // else if the gs-text is disabled: clear the control variable and empty the gs-text
                } else {
                    this.control = undefined;
                    this.innerHTML = '';
                }
            },
            
            syncView: function () {
                if (this.hasAttribute('disabled')) {
                    this.textContent = this.getAttribute('value') || this.getAttribute('placeholder');
                } else {
                    this.control.value = this.getAttribute('value') || '';
                }
                this.initalized = true;
            },
            
            syncGetters: function () {
                this.setAttribute('value', this.control.value);
            }
        }
    });
});