
window.addEventListener('design-register-element', function () {
    'use strict';
    
    registerDesignSnippet('<gs-checkbox>', '<gs-checkbox>', 'gs-checkbox value="0" column="${1:ready_to_ship}">${2}</gs-checkbox>');
    registerDesignSnippet('<gs-checkbox> With Label', '<gs-checkbox>',
                    'label for="${1:date-insert-ready_to_ship}">${2:Ready To Ship?}:</label>\n' +
                    '<gs-checkbox id="${1:date-insert-ready_to_ship}" value="0" column="${3:ready_to_ship}"></gs-checkbox>');
    
    designRegisterElement('gs-checkbox',
                            '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-checkbox.html');
    
    window.designElementProperty_GSCHECKBOX = function(selectedElement) {
        var strVisibilityAttribute;
        
        addProp('Column', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('column') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'column', this.value);
        });
        
        addProp('Value', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('value') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'value', this.value);
        });
        
        addProp('Triple State', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('triplestate')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'triplestate', (this.value === 'true'), true);
        });
        
        addProp('Column In Querystring', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('qs') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'qs', this.value, false);
        });
        
        addProp('Mini', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('mini')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'mini', (this.value === 'true'), true);
        });
        
        addProp('Inline', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('inline')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'inline', (this.value === 'true'), true);
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
        
        addProp('Corners', true,   '<div class="target">' +
                    '<gs-checkbox value="' + (!(selectedElement.hasAttribute('remove-all') ||
                                                selectedElement.hasAttribute('remove-top') ||
                                                selectedElement.hasAttribute('remove-left') ||
                                                selectedElement.hasAttribute('remove-top-left'))).toString() + 
                            '" remove-right remove-bottom id="round-top-left-corner________" inline></gs-checkbox>' +
                            
                    '<gs-checkbox value="' + (!(selectedElement.hasAttribute('remove-all') ||
                                                selectedElement.hasAttribute('remove-top') ||
                                                selectedElement.hasAttribute('remove-right') ||
                                                selectedElement.hasAttribute('remove-top-right'))).toString() + 
                            '" remove-left remove-bottom id="round-top-right-corner________" inline></gs-checkbox><br />' +
                            
                    '<gs-checkbox value="' + (!(selectedElement.hasAttribute('remove-all') ||
                                                selectedElement.hasAttribute('remove-bottom') ||
                                                selectedElement.hasAttribute('remove-left') ||
                                                selectedElement.hasAttribute('remove-bottom-left'))).toString() + 
                            '" remove-right remove-top id="round-bottom-left-corner________" inline></gs-checkbox>' +
                            
                    '<gs-checkbox value="' + (!(selectedElement.hasAttribute('remove-all') ||
                                                selectedElement.hasAttribute('remove-bottom') ||
                                                selectedElement.hasAttribute('remove-right') ||
                                                selectedElement.hasAttribute('remove-bottom-right'))).toString() + 
                            '" remove-left remove-top id="round-bottom-right-corner________" inline></gs-checkbox>' +
                '</div>', function () {
            var topLeft =       document.getElementById('round-top-left-corner________').value === 'true',
                topRight =    document.getElementById('round-top-right-corner________').value === 'true',
                bottomLeft =    document.getElementById('round-bottom-left-corner________').value === 'true',
                bottomRight = document.getElementById('round-bottom-right-corner________').value === 'true',
                arrStrAttr = [], i, len;
            
            selectedElement.removeAttribute('remove-all');
            selectedElement.removeAttribute('remove-top');
            selectedElement.removeAttribute('remove-bottom');
            selectedElement.removeAttribute('remove-left');
            selectedElement.removeAttribute('remove-right');
            selectedElement.removeAttribute('remove-top-left');
            selectedElement.removeAttribute('remove-top-right');
            selectedElement.removeAttribute('remove-bottom-left');
            selectedElement.removeAttribute('remove-bottom-right');
            
            if (!topLeft && !topRight && !bottomLeft && !bottomRight) {
                arrStrAttr.push('remove-all');
                
            } else if (!topLeft && !topRight) {
                arrStrAttr.push('remove-top');
            } else if (!bottomLeft && !bottomRight) {
                arrStrAttr.push('remove-bottom');
                
            } else if (!topLeft && !bottomLeft) {
                arrStrAttr.push('remove-left');
            } else if (!topRight && !bottomRight) {
                arrStrAttr.push('remove-right');
            }
            
            if (!topLeft && !bottomLeft && arrStrAttr[0] !== 'remove-all') {
                arrStrAttr.push('remove-left');
            } else if (!topLeft && topRight) {
                arrStrAttr.push('remove-top-left');
            } else if (!bottomLeft && bottomRight) {
                arrStrAttr.push('remove-bottom-left');
            }
            
            if (!topRight && !bottomRight && arrStrAttr[0] !== 'remove-all') {
                arrStrAttr.push('remove-right');
            } else if (topLeft && !topRight) {
                arrStrAttr.push('remove-top-right');
            } else if (bottomLeft && !bottomRight) {
                arrStrAttr.push('remove-bottom-right');
            }
            
            for (i = 0, len = arrStrAttr.length; i < len; i += 1) {
                selectedElement.setAttribute(arrStrAttr[i], '');
            }
            
            return selectedElement;
        });
        
        //addFlexContainerProps(selectedElement);
        addFlexProps(selectedElement);
        
        //// SUSPEND-CREATED attribute
        //addProp('suspend-created', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('suspend-created') || '') + '" mini></gs-checkbox>', function () {
        //    return setOrRemoveBooleanAttribute(selectedElement, 'suspend-created', this.value === 'true', true);
        //});
        
        // SUSPEND-INSERTED attribute
        addProp('suspend-inserted', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('suspend-inserted') || '') + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'suspend-inserted', this.value === 'true', true);
        });
    };
});

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    function pushReplacePopHandler(element) {
        element.value = GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs'));
    }
    
    // dont do anything that modifies the element here
    function elementCreated(element) {
        // if "created" hasn't been suspended: run created code
        if (!element.hasAttribute('suspend-created')) {
            
        }
    }
    
    //
    function elementInserted(element) {
        var strQSValue;
        
        // if "created" hasn't been suspended and "inserted" hasn't been suspended: run inserted code
        if (!element.hasAttribute('suspend-created') && !element.hasAttribute('suspend-inserted')) {
            // if this is the first time inserted has been run: continue
            if (!element.inserted) {
                element.inserted = true;
                
                // if this checkbox has the "qs" attribute: fill from querystring and bind to querystring
                if (element.hasAttribute('qs')) {
                    strQSValue = GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs'));
                    
                    if (strQSValue !== '' || !element.getAttribute('value')) {
                        element.setAttribute('value', strQSValue);
                    }
                    
                    window.addEventListener('pushstate',    function () { pushReplacePopHandler(element); });
                    window.addEventListener('replacestate', function () { pushReplacePopHandler(element); });
                    window.addEventListener('popstate',     function () { pushReplacePopHandler(element); });
                }
                
                // default value to false
                element.value = element.getAttribute('value') || false;
                
                // add a tabindex to allow focus
                if (! element.tabIndex) {
                    element.tabIndex = 0;
                }
            }
        }
    }
    
    xtag.register('gs-checkbox', {
        lifecycle: {
            created: function () {
                // if the value was set before the "created" lifecycle code runs: set attribute
                //      (discovered when trying to set a value of a date control in the after_open of a dialog)
                //      ("delete" keyword added because of firefox)
                if (!this.getAttribute('value') &&
                    this.value !== null &&
                    this.value !== undefined && 
                    (
                        typeof this.value === 'boolean' ||
                        this.value === '-1' ||
                        this.value === '0' ||
                        this.value === 'true' ||
                        this.value === 'false' ||
                        this.value === 'null' ||
                        this.value === 'n'
                    )) {
                    this.setAttribute('value', this.value);
                    delete this.value;
                }
                
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
            'mousedown': function () {
                if (!this.hasAttribute('suspend-created') && !this.hasAttribute('suspend-inserted')) {
                    this.classList.add('down');
                }
            },
            'mouseout': function () {
                if (!this.hasAttribute('suspend-created') && !this.hasAttribute('suspend-inserted')) {
                    if (this.classList.contains('down')) {
                        this.classList.remove('down');
                    }
                }
            },
            'click': function (event) {
                var strValue, bolTripleState;
                
                if (!this.hasAttribute('suspend-created') && !this.hasAttribute('suspend-inserted')) {
                    strValue = this.getAttribute('value');
                    bolTripleState = this.hasAttribute('triplestate');
                    
                    // here be dragons
                    if (strValue === 'false') {
                        this.setAttribute('value', 'true');
                        
                    } else if (strValue === 'true') {
                        if (bolTripleState) {
                            this.setAttribute('value', 'null');
                        } else {
                            this.setAttribute('value', 'false');
                        }
                        
                    } else if (strValue === 'null') {
                        this.setAttribute('value', 'false');
                        
                    } else if (strValue === '0') {
                        this.setAttribute('value', '-1');
                        
                    } else if (strValue === '-1') {
                        if (bolTripleState) {
                            this.setAttribute('value', 'n');
                        } else {
                            this.setAttribute('value', '0');
                        }
                        
                    } else if (strValue === 'n') {
                        this.setAttribute('value', '0');
                        
                    } else if (strValue === 0) {
                        this.setAttribute('value', -1);
                        
                    } else if (strValue === -1) {
                        if (bolTripleState) {
                            this.setAttribute('value', 'n');
                        } else {
                            this.setAttribute('value', 0);
                        }
                        
                    } else if (strValue === 'n') {
                        this.setAttribute('value', 0);
                        
                    } else if (strValue === false) {
                        this.setAttribute('value', true);
                        
                    } else if (strValue === true) {
                        if (bolTripleState) {
                            this.setAttribute('value', null);
                        } else {
                            this.setAttribute('value', false);
                        }
                        
                    } else if (strValue === null) {
                        this.setAttribute('value', false);
                        
                    } else {
                        this.setAttribute('value', 'true');
                    }
                    
                    this.classList.remove('down');
                    
                    xtag.fireEvent(this, 'change', {
                        bubbles: true,
                        cancelable: true
                    });
                }
            },
            'keydown': function (event) {
                if (!this.hasAttribute('suspend-created') && !this.hasAttribute('suspend-inserted')) {
                    // if we pressed return (13) or space (32)
                    if (event.keyCode === 13 || event.keyCode === 32) {
                        // prevent default and stop propagation (to prevent scrolling of the page)
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    
                    // if we are not disabled and we pressed return (13) or space (32): trigger click
                    if (!this.attributes.disabled && (event.keyCode === 13 || event.keyCode === 32)) {
                        xtag.fireEvent(this, 'click', { bubbles: true, cancelable: true });
                    }
                }
            }
        },
        accessors: {
            value: {
                // get value straight from the attribute
                get: function () {
                    return this.getAttribute('value');
                },
                
                // set the value attribute
                set: function (newValue) {
                    this.setAttribute('value', newValue);
                }
            },
            textValue: {
                // return a text representation of the value
                get: function () {
                    var currentValue = this.getAttribute('value');
                    
                    // if value is true: return YES
                    if (currentValue === '-1' || currentValue === 'true') {
                        return 'YES';
                    }
                    
                    // if value is false: return NO
                    if (currentValue === '0' || currentValue === 'false') {
                        return 'NO';
                    }
                    
                    // if value is null: return empty string
                    return '';
                },
                
                // set the value attribute
                set: function (newValue) {
                    if (newValue === 'YES') {
                        newValue = 'true';
                    }
                    if (newValue === 'NO') {
                        newValue = 'false';
                    }
                    this.setAttribute('value', newValue);
                }
            }
        },
        methods: {
            
        }
    });
});