
window.addEventListener('design-register-element', function () {
    
    registerDesignSnippet('<gs-toggle>', '<gs-toggle>', 'gs-toggle column="${1}">${2}</gs-toggle>');
    
    designRegisterElement('gs-toggle', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-buttons-toggle.html');
    
    window.designElementProperty_GSTOGGLE = function(selectedElement) {
        addProp('Icon', true, '<div flex-horizontal>' +
                              '     <gs-text id="prop-icon-input" class="target" value="' + (selectedElement.getAttribute('icon') || '') + '" mini flex></gs-text>' +
                              '     <gs-button id="prop-icon-picker-button" mini icononly icon="list"></gs-button>' +
                              '     <style>#prop-icon-picker-button:after {font-size: 1em;}</style>' +
                              '</div>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'icon', this.value, false);
        });
        
        document.getElementById('prop-icon-picker-button').addEventListener('click', function () {
            var i, len, html, arrIcons = GS.iconList(), strName;
            
            for (i = 0, len = arrIcons.length, html = ''; i < len; i += 1) {
                strName = arrIcons[i].name;
                html += '<gs-block>' +
                            '<gs-button iconleft icon="' + strName + '" dialogclose value="' + strName + '">' + strName + '</gs-button>' +
                        '</gs-block>';
            }
            
            GS.dialog({
                'header': 'Choose An Icon',
                'content': '<gs-grid widths="1,1,1,1" reflow-at="767px">' + html + '</gs-grid>',
                'buttons': 'cancel',
                'max_width': '1100px',
                'after_close': function (event, strAnswer) {
                    var propInput = document.getElementById('prop-icon-input');
                    
                    //console.log(strAnswer);
                    
                    if (strAnswer !== 'cancel') {
                        propInput.value = strAnswer;
                        GS.triggerEvent(propInput, 'change');
                    }
                }
            });
        });
        
        if (selectedElement.getAttribute('icon') ||
            selectedElement.hasAttribute('iconleft') ||
            selectedElement.hasAttribute('iconright') ||
            selectedElement.hasAttribute('icontop') ||
            selectedElement.hasAttribute('iconbottom') ||
            selectedElement.hasAttribute('icononly') ||
            selectedElement.hasAttribute('iconrotateright') ||
            selectedElement.hasAttribute('iconrotatedown') ||
            selectedElement.hasAttribute('iconrotateleft')) {
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
        }
        
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
        
        addProp('Emphasis', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('emphasis')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'emphasis', (this.value === 'true'), true);
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
            var topLeft =     document.getElementById('round-top-left-corner________').value === 'true',
                topRight =    document.getElementById('round-top-right-corner________').value === 'true',
                bottomLeft =  document.getElementById('round-bottom-left-corner________').value === 'true',
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
    function pushReplacePopHandler(element) {
        element.value = GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs'));
    }
    
    xtag.register('gs-toggle', {
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
                
                // add a tabindex to allow focus
                if (!this.hasAttribute('tabindex')) {
                    this.tabIndex = 0;
                }
                
                if (typeof this.getAttribute('value') === 'string') {
                    if (this.getAttribute('value') === 'true' || this.getAttribute('value') === '-1') {
                        this.setAttribute('selected', '');
                    }
                }
                
                // handle "qs" attribute
                if (this.getAttribute('qs')) {
                    strQSValue = GS.qryGetVal(GS.getQueryString(), this.getAttribute('qs'));
                    
                    if (strQSValue !== '' || !this.getAttribute('value')) {
                        element.value = strQSValue;
                    }
                    
                    window.addEventListener('pushstate',    function () { pushReplacePopHandler(element); });
                    window.addEventListener('replacestate', function () { pushReplacePopHandler(element); });
                    window.addEventListener('popstate',     function () { pushReplacePopHandler(element); });
                }
            }
        },
        events: {
            'click': function (event) {
                if (this.hasAttribute('selected')) {
                    this.removeAttribute('selected');
                    
                    if (this.getAttribute('value') === 'true') {
                        this.setAttribute('value', 'false');
                    } else if (this.getAttribute('value') === '-1') {
                        this.setAttribute('value', '0');
                    }
                    
                } else {
                    this.setAttribute('selected', '');
                    
                    if (this.getAttribute('value') === 'false') {
                        this.setAttribute('value', 'true');
                    } else if (this.getAttribute('value') === '0') {
                        this.setAttribute('value', '-1');
                    }
                }
                
                xtag.fireEvent(this, 'change', {
                    bubbles: true,
                    cancelable: true
                });
            },
            
            'keypress': function (event) {
                // if we are not disabled and we pressed return (13) or space (32): trigger tap
                if (!this.hasAttribute('disabled') && (event.keyCode === 13 || event.keyCode === 32)) {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    xtag.fireEvent(this, 'click', {
                        bubbles: true,
                        cancelable: true
                    });
                }
            }
        },
        accessors: {
            'value': {
                'get': function () {
                    return this.hasAttribute('selected'); //this.classList.contains('down');
                },
                
                'set': function (newValue) {
                    if (newValue === true || newValue === 'true') {
                        this.setAttribute('selected', '');
                    } else {
                        this.removeAttribute('selected');
                    }
                }
            },
            
            'textValue': {
                'get': function () {
                    return this.hasAttribute('selected') ? 'YES' : 'NO';
                },
                
                'set': function (newValue) {
                    if (newValue === true || newValue === 'true' || newValue === 'YES') {
                        this.setAttribute('selected', '');
                    } else {
                        this.removeAttribute('selected');
                    }
                }
            }
        },
        methods: {}
    });
});