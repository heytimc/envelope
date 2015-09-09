window.addEventListener('design-register-element', function () {
    
    registerDesignSnippet('<gs-map-button>', '<gs-map-button>', 'gs-map-button>${1}</gs-map-button>');
    
    designRegisterElement('gs-map-button', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-buttons-toggle.html');
    
    window.designElementProperty_GSMAPBUTTON = function(selectedElement) {
        var strIconPos, strIconRotation;
        
        addProp('Icon', true, '<div flex-horizontal>' +
                              '     <gs-text id="prop-icon-input" class="target" value="' + (selectedElement.getAttribute('icon') || '') + '" mini flex></gs-text>' +
                              '     <gs-button id="prop-icon-picker-button" mini icononly icon="list"></gs-button>' +
                              '     <style>#prop-icon-picker-button:after {font-size: 1em;}</style>' +
                              '</div>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'icon', this.value, false);
        });
        
        document.getElementById('prop-icon-picker-button').addEventListener('click', function () {
            var i, len, html, arrIcons = GS.iconList(), strName, templateElement;
            
            for (i = 0, len = arrIcons.length, html = ''; i < len; i += 1) {
                strName = arrIcons[i].name;
                html += '<gs-block>' +
                            '<gs-button iconleft icon="' + strName + '" dialogclose>' + strName + '</gs-button>' +
                        '</gs-block>';
            }
            
            templateElement = document.createElement('template');
            templateElement.setAttribute('data-max-width', '1100px');
            
            templateElement.innerHTML = ml(function () {/*
                <gs-page>
                    <gs-header><center><h3>Choose An Icon</h3></center></gs-header>
                    <gs-body padded>
                        <gs-grid widths="1,1,1,1" reflow-at="767px">{{HTML}}</gs-grid>
                    </gs-body>
                    <gs-footer><gs-button dialogclose>Cancel</gs-button></gs-footer>
                </gs-page>
            */}).replace('{{HTML}}', html);
            
            GS.openDialog(templateElement, '', function (event, strAnswer) {
                var propInput = document.getElementById('prop-icon-input');
                
                if (strAnswer !== 'Cancel') {
                    propInput.value = strAnswer;
                    GS.triggerEvent(propInput, 'change');
                }
            });
        });
        
        // iconleft
        // iconright
        // icontop
        // iconbottom
        // icononly
               if (selectedElement.hasAttribute('iconleft'))   { strIconPos = 'iconleft';
        } else if (selectedElement.hasAttribute('iconright'))  { strIconPos = 'iconright';
        } else if (selectedElement.hasAttribute('icontop'))    { strIconPos = 'icontop';
        } else if (selectedElement.hasAttribute('iconbottom')) { strIconPos = 'iconbottom';
        } else if (selectedElement.hasAttribute('icononly'))   { strIconPos = 'icononly';
        } else { strIconPos = ''; }
        
        addProp('Icon Position', true, '<gs-select class="target" value="' + strIconPos + '" mini>' +
                                            '   <option value="">Default</option>' +
                                            '   <option value="iconleft">Left</option>' +
                                            '   <option value="iconright">Right</option>' +
                                            '   <option value="icontop">Top</option>' +
                                            '   <option value="iconbottom">Bottom</option>' +
                                            '   <option value="icononly">Icononly</option>' +
                                            '</gs-select>', function () {
            selectedElement.removeAttribute('iconleft');
            selectedElement.removeAttribute('iconright');
            selectedElement.removeAttribute('icontop');
            selectedElement.removeAttribute('iconbottom');
            selectedElement.removeAttribute('icononly');
            
            if (this.value) {
                selectedElement.setAttribute(this.value, '');
            }
            
            return selectedElement;
        });
        
        // None
        // 90 degrees  (iconrotateright)
        // 180 degrees (iconrotatedown)
        // 270 degrees (iconrotateleft)
        
               if (selectedElement.hasAttribute('iconrotateright')) { strIconRotation = 'iconrotateright';
        } else if (selectedElement.hasAttribute('iconrotatedown'))  { strIconRotation = 'iconrotatedown';
        } else if (selectedElement.hasAttribute('iconrotateleft'))  { strIconRotation = 'iconrotateleft';
        } else { strIconRotation = ''; }
        
        addProp('Icon&nbsp;Rotation', true, '<gs-select class="target" value="' + strIconRotation + '" mini>' +
                                            '   <option value="">None</option>' +
                                            '   <option value="iconrotateright">90 degrees</option>' +
                                            '   <option value="iconrotatedown">180 degrees</option>' +
                                            '   <option value="iconrotateleft">270 degrees</option>' +
                                            '</gs-select>', function () {
            selectedElement.removeAttribute('iconrotateright');
            selectedElement.removeAttribute('iconrotatedown');
            selectedElement.removeAttribute('iconrotateleft');
            
            if (this.value) {
                selectedElement.setAttribute(this.value, '');
            }
            
            return selectedElement;
        });
        
        addProp('Column', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('column') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'column', this.value, false);
        });
        
        addProp('Value', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('value') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'value', this.value, false);
        });
        
        addProp('Column In Querystring', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('qs') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'qs', this.value, false);
        });
        
        addProp('Focusable', true, '<gs-checkbox class="target" value="' + (!selectedElement.hasAttribute('no-focus')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'no-focus', (this.value === 'true'), false);
        });
        
        // TABINDEX attribute
        addProp('Tabindex', true, '<gs-number class="target" value="' + (selectedElement.getAttribute('tabindex') || '0') + '" mini></gs-number>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'tabindex', this.value);
        });
        
        addProp('Inline', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('inline')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'inline', (this.value === 'true'), true);
        });
        addProp('Mini', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('mini')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'mini', (this.value === 'true'), true);
        });
        addProp('Emphasis', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('emphasis')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'emphasis', (this.value === 'true'), true);
        });
        
        addProp('Key', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('key') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'key', this.value, false);
        });
        
        addProp('No Modifier Key For Hot Key', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('no-modifier-key') || '') + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'no-modifier-key', this.value === 'true', true);
        });
        
        // TEXT CONTENT
        addProp('Text', true, '<gs-text class="target" value="' + (selectedElement.textContent || '') + '" mini></gs-text>', function () {
            selectedElement.textContent = this.value;
            
            return selectedElement;
        });
        
        // TITLE attribute
        addProp('Title', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('title') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'title', this.value);
        });
        
        // DISABLED attribute
        addProp('Disabled', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('disabled') || '') + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'disabled', this.value === 'true', true);
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
        
        addProp('Corners', true,   '<div class="target">' +
                                        '<gs-grid>\n' +
                                        '    <gs-block>\n' +
                                        '        <gs-checkbox value="' + (!(selectedElement.hasAttribute('remove-all') ||
                                                                    selectedElement.hasAttribute('remove-top') ||
                                                                    selectedElement.hasAttribute('remove-left') ||
                                                                    selectedElement.hasAttribute('remove-top-left'))).toString() + 
                                                    '" remove-right remove-bottom id="round-top-left-corner________"></gs-checkbox>' +
                                                
                                        '        <gs-checkbox value="' + (!(selectedElement.hasAttribute('remove-all') ||
                                                                    selectedElement.hasAttribute('remove-bottom') ||
                                                                    selectedElement.hasAttribute('remove-left') ||
                                                                    selectedElement.hasAttribute('remove-bottom-left'))).toString() + 
                                                    '" remove-right remove-top id="round-bottom-left-corner________"></gs-checkbox>' +
                                        '    </gs-block>\n' +
                                        '    <gs-block>\n' +
                                        '        <gs-checkbox value="' + (!(selectedElement.hasAttribute('remove-all') ||
                                                                    selectedElement.hasAttribute('remove-top') ||
                                                                    selectedElement.hasAttribute('remove-right') ||
                                                                    selectedElement.hasAttribute('remove-top-right'))).toString() + 
                                                    '" remove-left remove-bottom id="round-top-right-corner________"></gs-checkbox>' +
                                                
                                        '        <gs-checkbox value="' + (!(selectedElement.hasAttribute('remove-all') ||
                                                                    selectedElement.hasAttribute('remove-bottom') ||
                                                                    selectedElement.hasAttribute('remove-right') ||
                                                                    selectedElement.hasAttribute('remove-bottom-right'))).toString() + 
                                                    '" remove-left remove-top id="round-bottom-right-corner________"></gs-checkbox>' +
                                        '    </gs-block>\n' +
                                        '</gs-grid>\n' +
                                    '</div>', function () {
            var topLeft     = document.getElementById('round-top-left-corner________').value === 'true',
                topRight    = document.getElementById('round-top-right-corner________').value === 'true',
                bottomLeft  = document.getElementById('round-bottom-left-corner________').value === 'true',
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
    };
});

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    
    function handleDisable(element) {
        if (element.getAttribute('value')) {
            element.removeAttribute('disabled');
        } else {
            element.setAttribute('disabled', '');
        }
    }
    
    function pushReplacePopHandler(element) {
        element.setAttribute('value', GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs')));
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
                
                var strKey;
                
                if (element.getAttribute('qs')) {
                    strQSValue = GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs'));
                    
                    if (strQSValue !== '' || !element.getAttribute('value')) {
                        element.setAttribute('value', strQSValue);
                    }
                    
                    window.addEventListener('pushstate',    function () { pushReplacePopHandler(element); });
                    window.addEventListener('replacestate', function () { pushReplacePopHandler(element); });
                    window.addEventListener('popstate',     function () { pushReplacePopHandler(element); });
                }
                
                // add a tabindex to allow focus (if allowed)
                if (!element.hasAttribute('no-focus')) {
                    if ((!element.tabIndex) || element.tabIndex === -1) {
                        element.tabIndex = 0;
                    }
                } else {
                    element.removeAttribute('tabindex');
                }
                
                if (!evt.touchDevice) {
                    element.addEventListener(evt.mousedown, function (event) {
                        element.classList.add('down');
                        //console.log('down');
                    });
                    
                    element.addEventListener(evt.mouseout, function (event) {
                        element.classList.remove('down');
                        //if (!evt.touchDevice) {
                        element.classList.remove('hover');
                        //}
                    });
                    
                    element.addEventListener(evt.mouseover, function (event) {
                        element.classList.remove('down');
                        //if (!evt.touchDevice) {
                        element.classList.add('hover');
                        //}
                    });
                    
                    element.addEventListener('keydown', function (event) {
                        if (!element.hasAttribute('disabled') && !element.classList.contains('down') && (event.keyCode === 13 || event.keyCode === 32)) {
                            element.classList.add('down');
                        }
                    });
                    
                    element.addEventListener('keyup', function (event) {
                        // if we are not disabled and we pressed return (13) or space (32): trigger click
                        if (!element.hasAttribute('disabled') && (event.keyCode === 13 || event.keyCode === 32)) {
                            xtag.fireEvent(element, 'click', {
                                bubbles: true,
                                cancelable: true
                            });
                        }
                    });
                }
                
                element.addEventListener('click', function (event) {
                    //console.log('click');
                    element.classList.remove('down');
                    
                    if (element.hasAttribute('value') === true) {
                        var number = element.getAttribute('value');
                        if (element.hasAttribute('google') === true) {
                            window.open('https://maps.google.com/maps?q=' + number);
                        } else if (element.hasAttribute('bing') === true) {
                            window.open('http://www.bing.com/maps/default.aspx?q=' + encodeURIComponent(number));
                        } else {
                            window.open('https://maps.google.com/maps?q=' + number);
                        }
                    }
                });
                
                element.addEventListener('keypress', function (event) {
                    // if we pressed return (13) or space (32): prevent default and stop propagation (to prevent scrolling of the page)
                    if (event.keyCode === 13 || event.keyCode === 32) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                });
                
                strKey = element.getAttribute('key');
                
                if (strKey) {
                    if (GS.keyCode(strKey)) {
                        if (strKey.match(/[arfcvxzntypq]/gim)) {
                            console.warn('gs-map-button Warning: by setting the hot key of this button to "' + strKey + '" you may be overriding browser functionality.', element);
                        }
                        
                        window.addEventListener('keydown', function (event) {
                            if (
                                    String(event.keyCode || event.which) === GS.keyCode(strKey) &&
                                    (
                                        (
                                            element.hasAttribute('no-modifier-key') &&
                                            !event.metaKey &&
                                            !event.ctrlKey
                                        ) ||
                                        (
                                            !element.hasAttribute('no-modifier-key') &&
                                            (event.metaKey || event.ctrlKey)
                                        )
                                    )
                                ) {
                                event.preventDefault();
                                event.stopPropagation();
                                
                                element.focus();
                                GS.triggerEvent(element, 'click');
                            }
                        });
                        
                    } else if (strKey.length > 1) {
                        console.error('gs-map-button Error: \'key="' + strKey + '"\' is not a valid hot-key.', element);
                    }
                }
                
                handleDisable(element);
            }
        }
    }
    
    xtag.register('gs-map-button', {
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
                    if (strAttrName === 'no-focus') {
                        if (!this.hasAttribute('no-focus')) {
                            if ((!this.tabIndex) || this.tabIndex === -1) {
                                this.tabIndex = 0;
                            }
                        } else {
                            this.removeAttribute('tabindex');
                        }
                    } else if (strAttrName === 'disabled') {
                        this.classList.remove('down');
                    } else if (strAttrName === 'value') {
                        handleDisable(this);
                    }
                }
            }
        },
        events: {},
        accessors: {
            value: {
                get: function () {
                    return this.getAttribute('value');
                },
                set: function (newValue) {
                    this.setAttribute('value', newValue);
                }
            }
        },
        methods: {
            
        }
    });
});