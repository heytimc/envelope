//element.clientHeight < element.scrollHeight

window.addEventListener('design-register-element', function () {
    
    registerDesignSnippet('<gs-memo>', '<gs-memo>', 'gs-memo column="${1:name}"></gs-memo>');
    registerDesignSnippet('<gs-memo> With Label', '<gs-memo>', 'label for="${1:memo-insert-note}">${2:Notes}:</label>\n' +
                                                               '<gs-memo id="${1:memo-insert-note}" column="${3:note}"></gs-memo>');
    
    designRegisterElement('gs-memo', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-memo.html');
    
    window.designElementProperty_GSMEMO = function(selectedElement) {
        addProp('Column', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('column') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'column', this.value);
        });
        
        addProp('Value', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('value') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'value', this.value);
        });
        
        addProp('Column In Querystring', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('qs') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'qs', this.value, false);
        });
        
        addProp('Rows', true, '<gs-number class="target" value="' + (selectedElement.getAttribute('rows') || '') + '" mini></gs-number>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'rows', this.value);
        });
        
        addProp('Placeholder', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('placeholder') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'placeholder', this.value);
        });
        
        //console.log(selectedElement.hasAttribute('mini'));
        
        addProp('Autoresize', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('autoresize')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'autoresize', (this.value === 'true'), true);
        });
        addProp('Resize Handle', true, '<gs-checkbox class="target" value="' + (!selectedElement.hasAttribute('no-resize-handle')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'no-resize-handle', (this.value === 'true'), false);
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

// trigger resize to text on window resize
window.addEventListener('resize', function () {
    var i, len, arrElements = document.getElementsByTagName('gs-memo');
    
    for (i = 0, len = arrElements.length; i < len; i += 1) {
        //if (arrElements[i].control.clientHeight < arrElements[i].control.scrollHeight) {
        arrElements[i].handleResizeToText();
        //}
    }
});


if (!evt.touchDevice) {
    window.gsMemo = {};
    window.gsMemo.bolFirstMouseMoveWhileDown = true;
    window.gsMemo.currentMouseTarget = null;
    
    window.addEventListener('mousemove', function (event) {
        var mousePosition// = GS.mousePosition(event);
        
        if (window.bolFirstMouseMoveWhileDown === true && event.which !== 0) {
            mousePosition = GS.mousePosition(event);
            
            window.bolFirstMouseMoveWhileDown = false;
            window.gsMemo.currentMouseTarget = document.elementFromPoint(mousePosition.x, mousePosition.y);
            
        } else if (event.which === 0) {
            window.bolFirstMouseMoveWhileDown = true;
        }
        
        if (window.gsMemo.currentMouseTarget &&
            event.which !== 0 &&
            window.gsMemo.currentMouseTarget.nodeName === 'TEXTAREA' &&
            window.gsMemo.currentMouseTarget.parentNode.nodeName === 'GS-MEMO' && //event.target === element.control &&
            window.bolFirstMouseMoveWhileDown === false &&
                (window.gsMemo.currentMouseTarget.lastWidth !== window.gsMemo.currentMouseTarget.clientWidth ||
                window.gsMemo.currentMouseTarget.lastHeight !== window.gsMemo.currentMouseTarget.clientHeight)) {// && //element.control === window.lastMouseDownElement) {
            
            //GS.triggerEvent(window.gsMemo.currentMouseTarget.parentNode, 'size-changed');
            
            window.gsMemo.currentMouseTarget.style.margin = '';
            window.gsMemo.currentMouseTarget.style.marginLeft = '';
            window.gsMemo.currentMouseTarget.style.marginRight = '';
            window.gsMemo.currentMouseTarget.style.marginTop = '';
            window.gsMemo.currentMouseTarget.style.marginBottom = '';
            window.gsMemo.currentMouseTarget.lastWidth  = window.gsMemo.currentMouseTarget.clientWidth;
            window.gsMemo.currentMouseTarget.lastHeight = window.gsMemo.currentMouseTarget.clientHeight;
            
            GS.triggerEvent(window.gsMemo.currentMouseTarget.parentNode, 'size-changed');
            
            //console.log('mousemove (' + new Date().getTime() + ')');
        }
    });
    
    window.addEventListener('mouseup', function (event) {
        //var mousePosition = GS.mousePosition(event);
        
        window.bolFirstMouseMoveWhileDown = true;
        //console.log('3***'); //, document.elementFromPoint(mousePosition.x, mousePosition.y)); //event.target);
        //window.lastMouseDownElement = element.control;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var multiLineTemplateElement = document.createElement('template'),
        multiLineTemplate;
    
    multiLineTemplateElement.innerHTML = '<textarea class="control" gs-dynamic></textarea>';
    
    multiLineTemplate = multiLineTemplateElement.content;
    
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
    
    //
    function keydownFunction(event) {
        if (this.getAttribute('disabled') !== null && event.keyCode !== 9 && !(event.keyCode === 122 && event.metaKey)) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            //this.parentNode.syncView();
            this.parentNode.setAttribute('value', this.value);
            this.parentNode.handleResizeToText();
        }
    }
    
    //
    function keyupFunction(event) {
        //this.parentNode.syncView();
        this.parentNode.setAttribute('value', this.value);
        this.parentNode.handleResizeToText();
    }
    
    //
    function createPushReplacePopHandler(element) {
        element.value = GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs'));
    }
    
    xtag.register('gs-memo', {
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
                
                if (this.hasAttribute('tabindex')) {
                    this.setAttribute('data-tabindex', this.getAttribute('tabindex'));
                    this.removeAttribute('tabindex');
                }
                
                this.appendChild(multiLineTemplate.cloneNode(true));
                if (this.hasAttribute('data-tabindex')) {
                    xtag.query(this, '.control')[0].setAttribute('tabindex', this.getAttribute('data-tabindex'));
                }
                // set a variable with the control element for convenience and speed
                this.control = xtag.queryChildren(this, '.control')[0];
                
                this.control.lastWidth = this.control.clientWidth;
                this.control.lastHeight = this.control.clientHeight;
                this.syncView();
                
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
                this.syncView();
            },
            attributeChanged: function (strAttrName, oldVal, newVal) {
                //console.log(this.getAttribute('id'), strAttrName, oldVal, newVal);
                if (strAttrName === 'disabled' && newVal !== null) {
                    this.innerHTML = this.getAttribute('value') || this.getAttribute('placeholder');
                } else if (strAttrName === 'disabled' && newVal === null) {
                    this.innerHTML = '';
                    this.appendChild(multiLineTemplate.cloneNode(true));
                    if (this.hasAttribute('data-tabindex')) {
                        xtag.query(this, '.control')[0].setAttribute('tabindex', this.getAttribute('data-tabindex'));
                    }
                    // set a variable with the control element for convenience and speed
                    this.control = xtag.queryChildren(this, '.control')[0];
                    
                    this.control.lastWidth = this.control.clientWidth;
                    this.control.lastHeight = this.control.clientHeight;
                    this.syncView();
                }
            }
        },
        events: {
            //// on keydown and keyup sync the value attribute and the control value
            //'keydown:delegate(.control)': function (event) {
            //    if (this.getAttribute('disabled') !== null && event.keyCode !== 9) {
            //        event.preventDefault();
            //        event.stopPropagation();
            //    } else {
            //        this.parentNode.syncView();
            //    }
            //},
            //'keyup:delegate(.control)': function () {
            //    this.parentNode.syncView();
            //}//,
            //'change:delegate(.control)': function (event) {
            //    var element = this.parentNode;
            //    
            //    event.preventDefault();
            //    event.stopPropagation();
            //    
            //    xtag.fireEvent(element, 'change', {
            //        bubbles: true,
            //        cancelable: true
            //    });
            //}
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
                    this.setAttribute('value', strNewValue);
                    if (this.control) {
                        this.control.value = strNewValue;
                    } else {
                        this.innerHTML = strNewValue;
                    }
                    this.syncView();
                }
            },
            textValue: {
                // get value straight from the input
                get: function () {
                    if (this.control) {
                        return this.control.value;
                    } else {
                        return this.innerHTML;
                    }
                },
                
                // set the value attribute
                set: function (newValue) {
                    //this.setAttribute('value', newValue);
                    this.value = newValue;
                }
            }
        },
        methods: {
            focus: function () {
                if (this.control) {
                    this.control.focus();
                }
            },
            
            // sync control and resize to text
            syncView: function () {
                var element = this, arrPassThroughAttributes, i, len;
                
                /*
                if (this.innerHTML === '') {
                    this.appendChild(multiLineTemplate.cloneNode(true));
                }
                */
                /*
                if ((! this.hasAttribute('disabled')) && (! this.control)) {
                    this.appendChild(multiLineTemplate.cloneNode(true));
                    // set a variable with the control element for convenience and speed
                    this.control = xtag.queryChildren(this, '.control')[0];
                    
                    this.control.lastWidth = this.control.clientWidth;
                    this.control.lastHeight = this.control.clientHeight;
                }
                */
                
                if (this.hasAttribute('rows')) {
                    if (this.control) {
                        this.control.setAttribute('rows', this.getAttribute('rows'));
                    }
                }
                
                //if (!evt.touchDevice) {
                //    //element.control.addEventListener('mousedown', function (event) {//console.log('1***');
                //    //    window.lastMouseDownElement = element.control;
                //    //});
                //    
                //    window.addEventListener('mousemove', function (event) {
                //        //console.log(event.target);
                //        if (event.which !== 0 && event.target === element.control && //element.control === window.lastMouseDownElement &&
                //            (element.control.clientWidth !== element.control.lastWidth || element.control.lastHeight !== element.control.clientHeight)) {
                //            console.log('mousemove (' + new Date().getTime() + ')');
                //        }
                //    });
                //}
                if (this.control) {
                    this.control.removeEventListener('change', changeFunction);
                    this.control.addEventListener('change', changeFunction);
                    
                    this.control.removeEventListener('focus', focusFunction);
                    this.control.addEventListener('focus', focusFunction);
                    
                    this.control.removeEventListener('keydown', keydownFunction);
                    this.control.addEventListener('keydown', keydownFunction);
                }
                
                if (this.control) {
                    this.control.value = this.getAttribute('value');
                } else {
                    this.innerHTML = this.getAttribute('value') || this.getAttribute('placeholder') || '';
                }
                    
                if (this.getAttribute('value')) {
                    this.handleResizeToText();
                }
                
                if (this.control) {
                    arrPassThroughAttributes = [
                        'placeholder',
                        'name',
                        'maxlength',
                        'autocorrect',
                        'autocapitalize',
                        'autocomplete',
                        'autofocus',
                        'rows'
                    ];
                    for (i = 0, len = arrPassThroughAttributes.length; i < len; i += 1) {
                        if (this.hasAttribute(arrPassThroughAttributes[i])) {
                            this.control.setAttribute(arrPassThroughAttributes[i], this.getAttribute(arrPassThroughAttributes[i]) || '');
                        }
                    }
                }
                
                // copy passthrough attributes to control
            },
            
            // if element is multiline and autoresize is not turned off: resize the element to fit the content
            handleResizeToText: function () {
                var element = this, intMinHeight;
                
                if (element.control) {
                    if (element.hasAttribute('autoresize')) {
                        element.control.style.height = '';
                        intMinHeight = element.control.offsetHeight;
                        element.control.style.height = ''; // '0';
                        
                        if (element.control.scrollHeight > intMinHeight) {
                            element.control.style.height = element.control.scrollHeight + 'px';
                        } else {
                            element.control.style.height = intMinHeight + 'px';
                        }
                    }
                    
                    
                    if (element.control.lastWidth !== element.control.clientWidth && element.control.lastHeight !== element.control.clientHeight) {
                        element.control.lastWidth = element.control.clientWidth;
                        element.control.lastHeight = element.control.clientHeight;
                        
                        GS.triggerEvent(element, 'size-changed');
                    }
                }
            }
        }
    });
});