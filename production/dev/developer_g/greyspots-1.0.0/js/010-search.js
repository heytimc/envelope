
window.addEventListener('design-register-element', function () {
    registerDesignSnippet('<gs-search>', '<gs-search>', 'gs-search id="${1}"></gs-search>');
    
    designRegisterElement('gs-search', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-search.html');
    
    window.designElementProperty_GSSEARCH = function(selectedElement) {
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
});

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    
    var singleLineTemplateElement = document.createElement('template'),
        singleLineTemplate;
    
    singleLineTemplateElement.innerHTML = '<input class="control" gs-dynamic type="text" placeholder="Search..." />';
    
    singleLineTemplate = singleLineTemplateElement.content;
    
    // re-target change event from control to element
    function changeFunction(event) {
        event.preventDefault();
        event.stopPropagation();
        
        GS.triggerEvent(event.target.parentNode, 'change');
    }
    
    // re-target focus event from control to element
    function focusFunction(event) {
        GS.triggerEvent(event.target.parentNode, 'focus');
    }
    
    function loadPushReplacePopHandler(element) {
        element.value = GS.qryGetVal(GS.getQueryString(), element.getAttribute('id'));
    }
    
    // dont do anything that modifies the element here
    function elementCreated(element) {
        // if "created" hasn't been suspended: run created code
        if (!element.hasAttribute('suspend-created')) {
            
        }
    }
    
    //
    function elementInserted(element) {
        // if "created" hasn't been suspended and "inserted" hasn't been suspended: run inserted code
        if (!element.hasAttribute('suspend-created') && !element.hasAttribute('suspend-inserted')) {
            // if this is the first time inserted has been run: continue
            if (!element.inserted) {
                element.inserted = true;
                
                if (element.hasAttribute('tabindex')) {
                    element.oldTabIndex = element.getAttribute('tabindex');
                    element.removeAttribute('tabindex');
                }
                
                element.refresh();
                
                loadPushReplacePopHandler(element);
                window.addEventListener('pushstate',    function () { loadPushReplacePopHandler(element); });
                window.addEventListener('replacestate', function () { loadPushReplacePopHandler(element); });
                window.addEventListener('popstate',     function () { loadPushReplacePopHandler(element); });
            }
        }
    }
    
    xtag.register('gs-search', {
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
                    if (strAttrName === 'disabled') {
                        this.refresh();
                    }
                }
            }
        },
        events: {
            // on keydown and keyup sync the value attribute and the control value
            keydown: function (event) {
                if (this.hasAttribute('disabled') && event.keyCode !== 9) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    this.syncView();
                }
            },
            keyup: function () {
                this.syncView();
            },
            change: function () {
                var strQueryString = GS.getQueryString();
                
                if ((GS.qryGetVal(strQueryString, this.getAttribute('qs')) || '') !== (this.control.value || '')) {
                    GS.pushQueryString(this.getAttribute('qs') + '=' + encodeURIComponent(this.control.value));
                }
            }
        },
        accessors: {
            value: {
                // get value straight from the input
                get: function () {
                    if (this.control) {
                        return this.control.value;
                    } else {
                        return this.innerHTML;
                    }
                },
                
                // set the value of the input and set the value attribute
                set: function (strNewValue) {
                    if (this.control) {
                        this.control.value = strNewValue;
                    } else {
                        this.innerHTML = strNewValue;
                    }
                    this.syncView();
                }
            }
        },
        methods: {
            focus: function () {
                if (this.control) {
                    this.control.focus();
                }
            },
            
            // adapt gs-input element to whatever control is in it and
            //      set the value of the control to the value attribute (if there is a value attribute) and
            //      resize the resize to text 
            refresh: function () {
                var element = this, arrPassThroughAttributes, i, len;
                
                this.innerHTML = '';
                this.appendChild(singleLineTemplate.cloneNode(true));
                if (this.oldTabIndex) {
                    xtag.query(this, '.control')[0].setAttribute('tabindex', this.oldTabIndex);
                }
                
                // set a variable with the control element for convenience and speed
                element.control = xtag.query(element, '.control')[0];
                
                element.control.removeEventListener('change', changeFunction);
                element.control.addEventListener('change', changeFunction);
                
                element.control.removeEventListener('focus', focusFunction);
                element.control.addEventListener('focus', focusFunction);
                
                // if there is a value already in the attributes of the element: set the control value
                if (element.hasAttribute('value')) {
                    element.control.value = element.getAttribute('value');
                }
                
                // copy passthrough attributes to control
                arrPassThroughAttributes = [
                    'placeholder', 'name', 'type', 'maxlength', 'autocorrect', 'autocapitalize', 'autocomplete', 'autofocus'
                ];
                for (i = 0, len = arrPassThroughAttributes.length; i < len; i += 1) {
                    if (element.hasAttribute(arrPassThroughAttributes[i])) {
                        element.control.setAttribute(arrPassThroughAttributes[i], element.getAttribute(arrPassThroughAttributes[i]) || '');
                    }
                }
            },
            
            // sync control value and resize to text
            syncView: function () {
                if (this.control) {
                    this.setAttribute('value', this.control.value);
                } else {
                    this.innerHTML = this.control.value;
                }
            }
        }
    });
});