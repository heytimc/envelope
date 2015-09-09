
window.addEventListener('design-register-element', function () {
    
    registerDesignSnippet('<gs-number>', '<gs-number>', 'gs-number column="${1:name}"></gs-number>');
    registerDesignSnippet('<gs-number> With Label', '<gs-number>', 'label for="${1:number-insert-qty}">${2:Quantity}:</label>\n' +
                                                                   '<gs-number id="${1:number-insert-qty}" column="${3:qty}"></gs-number>');
    
    designRegisterElement('gs-number', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-number.html');
    
    window.designElementProperty_GSNUMBER = function(selectedElement) {
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
    var singleLineTemplateElement = document.createElement('template'),
        singleLineTemplate;
    
    singleLineTemplateElement.innerHTML = '<input class="control" gs-dynamic type="text" />';
    
    singleLineTemplate = singleLineTemplateElement.content;
    
    // re-target change event from control to element
    function changeFunction(event) {
        event.preventDefault();
        event.stopPropagation();
        
        GS.triggerEvent(event.target.parentNode, 'change');
        
        event.target.parentNode.handleFormat(event);
    }
    
    // re-target focus event from control to element
    function focusFunction(event) {
        GS.triggerEvent(event.target.parentNode, 'focus');
    }
    
    function createPushReplacePopHandler(element) {
        element.value = GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs'));
    }
    
    xtag.register('gs-number', {
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
                if (this.hasAttribute('disabled')) {
                    this.innerHTML = this.getAttribute('value') || this.getAttribute('placeholder');
                } else {
                    this.innerHTML = '';
                    this.appendChild(singleLineTemplate.cloneNode(true));
                    if (this.hasAttribute('data-tabindex')) {
                        xtag.query(this, '.control')[0].setAttribute('tabindex', this.getAttribute('data-tabindex'));
                    }
                }
                
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
                if (this.innerHTML === '') {
                    this.appendChild(singleLineTemplate.cloneNode(true));
                    if (this.hasAttribute('data-tabindex')) {
                        xtag.query(this, '.control')[0].setAttribute('tabindex', this.getAttribute('data-tabindex'));
                    }
                }
                this.refresh();
            },
            
            attributeChanged: function (strAttrName, oldVal, newVal) {
                //console.log(this.getAttribute('id'), strAttrName, oldVal, newVal);
                if (strAttrName === 'disabled' && newVal !== null) {
                    this.innerHTML = this.getAttribute('value') || this.getAttribute('placeholder');
                } else if (strAttrName === 'disabled' && newVal === null) {
                    this.innerHTML = '';
                    this.appendChild(singleLineTemplate.cloneNode(true));
                    if (this.hasAttribute('data-tabindex')) {
                        xtag.query(this, '.control')[0].setAttribute('tabindex', this.getAttribute('data-tabindex'));
                    }
                    this.refresh();
                }
            }
        },
        events: {
            // on keydown and keyup sync the value attribute and the control value
            keydown: function (event) {
                if (window.bolDesignMode !== true) {
                    if (this.getAttribute('disabled') !== null && event.keyCode !== 9) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        this.syncView();
                    }
                }
            },
            keyup: function () {
                if (window.bolDesignMode !== true) {
                    this.syncView();
                }
            }//,
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
                        return parseFloat(this.control.value.replace(/[^0-9.]*/g, ''), 10); // this.control.value;
                    } else {
                        return parseFloat(this.innerHTML.replace(/[^0-9.]*/g, ''), 10); // this.control.value;
                    }
                },
                
                // set the value of the input and set the value attribute
                set: function (strNewValue) {
                    if (this.control) {
                        this.control.value = strNewValue;
                    } else {
                        this.innerHTML = strNewValue;
                    }
                    this.handleFormat();
                    this.syncView();
                }
            }
        },
        methods: {
            focus: function () {
                this.control.focus();
            },
            
            refresh: function () {
                var arrPassThroughAttributes, i, len;
                
                // set a variable with the control element for convenience and speed
                this.control = xtag.query(this, '.control')[0];
                
                if (this.control) {
                    this.control.removeEventListener('change', changeFunction);
                    this.control.addEventListener('change', changeFunction);
                    
                    this.control.removeEventListener('focus', focusFunction);
                    this.control.addEventListener('focus', focusFunction);
                }
                // if there is a value already in the attributes of the element: set the control value
                if (this.hasAttribute('value')) {
                    if (this.control) {
                        this.control.value = this.getAttribute('value') || this.getAttribute('placeholder');
                    } else {
                        this.innerHTML = this.getAttribute('value') || this.getAttribute('placeholder');
                    }
                    this.handleFormat(undefined, false);
                }
                
                if (this.control) {
                    // copy passthrough attributes to control
                    arrPassThroughAttributes = [
                        'placeholder',
                        'name',
                        'maxlength',
                        'autocorrect',
                        'autocapitalize',
                        'autocomplete',
                        'autofocus'
                    ];
                    for (i = 0, len = arrPassThroughAttributes.length; i < len; i += 1) {
                        if (this.hasAttribute(arrPassThroughAttributes[i])) {
                            this.control.setAttribute(arrPassThroughAttributes[i], this.getAttribute(arrPassThroughAttributes[i]) || '');
                        }
                    }
                }
            },
            
            // sync control value and resize to text
            syncView: function () {
                if (this.control) {
                    this.setAttribute('value', this.control.value);
                } else {
                    this.setAttribute('value', this.innerHTML);
                }
            },
            
            handleFormat: function (event, bolAlertOnError) {
                'use strict';
                var element = this, strFormat, intValue;
                
                if (element.hasAttribute('format')) {
                    strFormat = element.getAttribute('format');
                    
                    intValue = element.value; // parseFloat(element.value.replace(/[^0-9.]*/g, ''), 10);
                    
                    if (isNaN(intValue)) {
                        if (bolAlertOnError !== undefined && bolAlertOnError !== false) {
                            alert('Invalid Number: ' + element.value);
                        }
                        
                        if (element.control) {
                            GS.setInputSelection(element.control, 0, element.value.length);
                        }
                        
                        if (event) {
                            event.stopPropagation();
                            event.preventDefault();
                        }
                        
                    } else {
                        if (this.control) {
                            element.control.value = element.formatNumber(intValue, strFormat);
                        } else {
                            element.innerHTML = element.formatNumber(intValue, strFormat);
                        }
                    }
                }
            },
            
            formatNumber: function (intValue, strFormat) {
                'use strict';
                /* (this function contains a (modified) substantial portion of code from another source
                    here is the copyright for sake of legality) (Uses code by Matt Kruse)
                Copyright (c) 2006-2009 Rostislav Hristov, Asual DZZD
                
                Permission is hereby granted, free of charge, to any person obtaining a 
                copy of this software and associated documentation files 
                (the "Software"), to deal in the Software without restriction, 
                including without limitation the rights to use, copy, modify, merge, 
                publish, distribute, sublicense, and/or sell copies of the Software, 
                and to permit persons to whom the Software is furnished to do so, 
                subject to the following conditions:
                
                The above copyright notice and this permission notice shall be included 
                in all copies or substantial portions of the Software.
                
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
                OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
                IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
                CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
                TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
                SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/
                var groupingSeparator,
                    groupingIndex,
                    decimalSeparator,
                    decimalIndex,
                    roundFactor,
                    result,
                    i,
                    locale = {
                        groupingSeparator: ',',
                        decimalSeparator: '.',
                        currencySymbol: '$',
                        percentSymbol: '%'
                    };
                
                if (strFormat.toLowerCase() === 'currency') {
                    strFormat = locale.currencySymbol + '0.00';
                    
                } else if (strFormat.toLowerCase() === 'percent') {
                    intValue = intValue * 100;
                    strFormat = locale.percentSymbol + '0.00';
                }
                
                var integer = '',
                    fraction = '',
                    negative,
                    minFraction,
                    maxFraction,
                    powFraction,
                    bolCurrencySymbol = strFormat[0] === locale.currencySymbol,
                    bolPercentSymbol = strFormat[0] === locale.percentSymbol;
                
                if (bolCurrencySymbol || bolPercentSymbol) {
                    strFormat = strFormat.substring(1);
                }
                
                groupingSeparator = ',';
                groupingIndex = strFormat.lastIndexOf(groupingSeparator);
                decimalSeparator = '.';
                decimalIndex = strFormat.indexOf(decimalSeparator);
                
                negative = intValue < 0;
                minFraction = strFormat.substr(decimalIndex + 1).replace(/#/g, '').length;
                maxFraction = strFormat.substr(decimalIndex + 1).length;
                powFraction = 10;
                
                intValue = Math.abs(intValue);

                if (decimalIndex != -1) {
                    fraction = locale.decimalSeparator;
                    if (maxFraction > 0) {
                        roundFactor = 1000;
                        powFraction = Math.pow(powFraction, maxFraction);
                        var tempRound = Math.round(parseInt(intValue * powFraction * roundFactor -
                                    Math.round(intValue) * powFraction * roundFactor, 10) / roundFactor),
                            tempFraction = String(tempRound < 0 ? Math.round(parseInt(intValue * powFraction * roundFactor -
                                    parseInt(intValue, 10) * powFraction * roundFactor, 10) / roundFactor) : tempRound),
                            parts = intValue.toString().split('.');
                        if (typeof parts[1] != 'undefined') {
                            for (i = 0; i < maxFraction; i++) {
                                if (parts[1].substr(i, 1) == '0' && i < maxFraction - 1 &&
                                        tempFraction.length != maxFraction) {
                                    tempFraction = '0' + tempFraction;
                                } else {
                                    break;
                                }
                            }
                        }
                        for (i = 0; i < (maxFraction - fraction.length); i++) {
                            tempFraction += '0';
                        }
                        var symbol, 
                            formattedFraction = '';
                        for (i = 0; i < tempFraction.length; i++) {
                            symbol = tempFraction.substr(i, 1);
                            if (i >= minFraction && symbol == '0' && /^0*$/.test(tempFraction.substr(i+1))) {
                                break;
                            }
                            formattedFraction += symbol;
                        }
                        fraction += formattedFraction;
                    }
                    if (fraction == locale.decimalSeparator) {
                        fraction = '';
                    }
                }

                if (decimalIndex !== 0) {
                    if (fraction !== '') {
                        integer = String(parseInt(Math.round(intValue * powFraction) / powFraction, 10));
                    } else {
                        integer = String(Math.round(intValue));
                    }
                    var grouping = locale.groupingSeparator,
                        groupingSize = 0;
                    if (groupingIndex != -1) {
                        if (decimalIndex != -1) {
                            groupingSize = decimalIndex - groupingIndex;
                        } else {
                            groupingSize = strFormat.length - groupingIndex;
                        }
                        groupingSize--;
                    }
                    if (groupingSize > 0) {
                        var count = 0, 
                            formattedInteger = '';
                        i = integer.length;
                        while (i--) {
                            if (count !== 0 && count % groupingSize === 0) {
                                formattedInteger = grouping + formattedInteger;    
                            }
                            formattedInteger = integer.substr(i, 1) + formattedInteger;
                            count++;
                        }
                        integer = formattedInteger;
                    }
                    var maxInteger, maxRegExp = /#|,/g;
                    if (decimalIndex != -1) {
                        maxInteger = strFormat.substr(0, decimalIndex).replace(maxRegExp, '').length;
                    } else {
                        maxInteger = strFormat.replace(maxRegExp, '').length;
                    }
                    var tempInteger = integer.length;
                    for (i = tempInteger; i < maxInteger; i++) {
                        integer = '0' + integer;
                    }
                }
                result = integer + fraction;
                return (bolPercentSymbol ? locale.percentSymbol : '') +
                       (bolCurrencySymbol ? locale.currencySymbol : '') +
                       (negative ? '-' : '') + result;
            }
        }
    });
});