
window.addEventListener('design-register-element', function () {
    'use strict';
    
    registerDesignSnippet('<gs-grid>', '<gs-grid>', 'gs-grid widths="${1}">\n' +
                                                    '    <gs-block>${2}</gs-block>\n' +
                                                    '</gs-grid>');
    
    designRegisterElement('gs-grid', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-grid.html');
    
    window.designElementProperty_GSGRID = function(selectedElement) {
        addProp('Widths', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('widths') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'widths', this.value);
        });
        
        addProp('Padded:', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('padded')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'padded', (this.value === 'true'), true);
        });
        
        addProp('Reflow At', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('reflow-at') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'reflow-at', this.value);
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
        
        //addFlexContainerProps(selectedElement);
        addFlexProps(selectedElement);
    };
});
    
window.addEventListener('design-register-element', function () {
    'use strict';
    
    registerDesignSnippet('<gs-block>', '<gs-block>', 'gs-block>${2}</gs-block>');
    
    designRegisterElement('gs-block', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-grid.html');
    
    window.designElementProperty_GSBLOCK = function(selectedElement) {
        addProp('Width:', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('width') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'width', this.value);
        });
        
        // TITLE attribute
        addProp('Title', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('title') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'title', this.value);
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
        
        addFlexContainerProps(selectedElement);
        //addFlexProps(selectedElement);
    };
});

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    
    function handleObserver(element) {
        var observer = new MutationObserver(function(mutations) {
            element.handleColumnCSS();
        });
        
        observer.observe(element, {childList: true});
    }
    
    // dont do anything that modifies the element here
    function elementCreated(element) {
        // if "created" hasn't been suspended: run created code
        if (!element.hasAttribute('suspend-created')) {
            handleObserver(element);
        }
    }
    
    //
    function elementInserted(element) {
        // if "created" hasn't been suspended and "inserted" hasn't been suspended: run inserted code
        if (!element.hasAttribute('suspend-created') && !element.hasAttribute('suspend-inserted')) {
            // if this is the first time inserted has been run: continue
            if (!element.inserted) {
                element.inserted = true;
                
                element.handleColumnCSS();
                element.handleReflowCSS();
            }
        }
    }
    
    xtag.register('gs-grid', {
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
                    // if the "widths" attribute changed: redo the column CSS
                    if (strAttrName === 'widths') {
                        this.calculatedWidths = !newValue;
                        
                        this.clearColumnCSS();
                        this.handleColumnCSS();
                        
                    // if the "reflow-at" attribute changed: redo the reflow CSS
                    } else if (strAttrName === 'reflow-at') {
                        this.clearReflowCSS();
                        this.handleReflowCSS();
                    }
                }
            }
        },
        events: {},
        accessors: {},
        methods: {
            // #######################################################
            // ################# BLOCK CSS FUNCTIONS #################
            // #######################################################
            
            handleColumnCSS: function () {
                var styleElement = document.getElementById('gs-grid-dynamic-css'), i, len, arrWidths, intGridWidth;
                
                // if the style element for the grid column CSS doesn't exist: create it
                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.setAttribute('id', 'gs-grid-dynamic-css');
                    styleElement.setAttribute('gs-dynamic', '');
                    document.head.appendChild(styleElement);
                }
                
                // if the widths of this element have been calculated before: clear the widths
                //if (this.calculatedWidths && this.hasAttribute('widths')) {
                //    this.removeAttribute('widths');
                //    return;
                //}
                
                // if no widths attribute is set: balance widths of all of the blocks
                if (!this.hasAttribute('widths') || this.calculatedWidths) {
                    this.calculatedWidths = true;
                    this.setAttribute('widths', new Array(xtag.queryChildren(this, 'gs-block').length + 1).join('1').split('').join(','));
                }
                
                // get an array of widths for the blocks
                arrWidths = this.getAttribute('widths')
                                        .replace(/[^0-9,]/gim, '') // remove everything except commas and numbers
                                        .replace(/,{1,}/gim, ',')  // replace multiple commas right next to each other with a single comma
                                        .replace(/^,|,$/gim, '')   // remove commas at the end and the beginning of the line
                                        .split(',');               // split on commas to make an array of numbers (which are currently type 'string')
                
                // if the array doesn't have content: error
                if (arrWidths.length === 0) {
                    throw 'gs-grid Error: no valid widths found. Please put a comma seperated list of widths in the "widths" attribute.';
                }
                
                // convert the array of strings to an array of integers
                for (i = 0, len = arrWidths.length; i < len; i += 1) {
                    arrWidths[i] = parseInt(arrWidths[i], 10);
                }
                
                // add up the array of integers to come up with a grid width
                for (i = 0, len = arrWidths.length, intGridWidth = 0; i < len; i += 1) {
                    intGridWidth += arrWidths[i];
                }
                
                // if the column CSS for this grid width doesn't already exist: generate then append it
                if (!styleElement.classList.contains('col-' + intGridWidth)) {
                    this.appendColumnCSS(this.generateColumnCSS(arrWidths, intGridWidth), intGridWidth);
                }
                
                // apply widths to the blocks
                this.applyColumnCSS(arrWidths, intGridWidth);
                
                // save the current grid width
                this.intGridWidth = intGridWidth;
            },
            
            generateColumnCSS: function (arrWidths, intGridWidth) {
                var i, len, strCurrentWidth, intCurrentWidth, widthIncreaseAmount, strCSS;
                
                // calculate the amount to increase every block width setting by
                widthIncreaseAmount = 100 / intGridWidth;
                
                // create a style for every block
                for (i = 0, len = intGridWidth, intCurrentWidth = 0, strCSS = ''; i < len; i += 1) {
                    intCurrentWidth += widthIncreaseAmount;
                    strCurrentWidth = String(parseFloat(intCurrentWidth.toFixed(5).toString(), 10));
                    
                    strCSS += 'gs-grid.width-' + intGridWidth + ' gs-block[width="' + (i + 1) + '"] { width: ' + strCurrentWidth + '%; }\n';
                }
                
                // return generated column CSS
                return strCSS;
            },
            
            appendColumnCSS: function (strCSS, intGridWidth) {
                var styleElement = document.getElementById('gs-grid-dynamic-css');
                
                // add col-NUM to the styleElement's "class" attribute
                styleElement.classList.add('col-' + intGridWidth);
                
                // append the column CSS
                styleElement.innerHTML += '\n/* grid width: ' + intGridWidth + ' */\n' + strCSS;
            },
            
            applyColumnCSS: function (arrWidths, intGridWidth) {
                var i, len, unset_i, arrElements, intNumberOfWidths = arrWidths.length, intCurrentRowWidth = 0;
                
                // get all child blocks
                arrElements = xtag.queryChildren(this, 'gs-block');
                
                // loop through the blocks
                for (i = 0, unset_i = 0, len = arrElements.length; i < len; i += 1) {
                    // if this is the first block in the row
                    if (intCurrentRowWidth === 0) {
                        // set the clear to left, this fixes an issue where a tall cell will move a cell over to the right
                        arrElements[i].style.clear = 'left';
                    }
                    
                    // if this block doesn't have a set width: set its width (if there are more unset width blocks than widths: the widths repeat)
                    if (!arrElements[i].hasAttribute('width')) {
                        arrElements[i].setAttribute('width', arrWidths[unset_i % intNumberOfWidths]);
                        unset_i += 1;
                        
                    // else if the block already has a width: set the "initallySet" to true
                    } else {
                        arrElements[i].initallySet = true;
                    }
                    
                    intCurrentRowWidth += parseInt(arrElements[i].getAttribute('width'), 10) || arrWidths[i % intNumberOfWidths];
                    //console.log(intCurrentRowWidth, intGridWidth);
                    intCurrentRowWidth = intCurrentRowWidth % intGridWidth;
                }
                
                // add class to the gs-grid so that the generated column CSS will apply
                this.classList.add('width-' + intGridWidth);
            },
            
            clearColumnCSS: function () {
                var i, len, arrElements;
                
                // get all blocks 
                arrElements = xtag.queryChildren(this, 'gs-block');
                
                // loop through the blocks
                for (i = 0, len = arrElements.length; i < len; i += 1) {
                    // if this block wasn't initally set: remove the width attribute
                    if (!arrElements[i].initallySet) {
                        arrElements[i].removeAttribute('width');
                    }
                }
                
                // remove class from the gs-grid that allowed the generated column CSS to apply
                this.classList.remove('width-' + this.intGridWidth);
            },
            
            // ########################################################
            // ################# REFLOW CSS FUNCTIONS #################
            // ########################################################
            
            clearReflowCSS: function () {
                // remove class from the gs-grid that allowed the generated reflow CSS to apply
                this.classList.remove('reflow-' + this.strReflowAt);
            },
            
            handleReflowCSS: function () {
                var styleElement = document.getElementById('gs-grid-dynamic-css'), strReflowAt = this.getAttribute('reflow-at') || '';
                
                // clean reflow-at attribute variable
                strReflowAt = strReflowAt.replace(/[^0-9a-z]/gi, '');
                
                // if reflow-at contains anything
                if (strReflowAt) {
                    // if reflow-at doesn't have a unit specified: add 'px' to the end of it
                    if (strReflowAt.replace(/[0-9]/gi, '') === '') {
                        strReflowAt += 'px';
                    }
                    
                    // add class to the gs-grid so that the generated reflow CSS will apply
                    this.classList.add('reflow-' + strReflowAt);
                    
                    // save the current reflow width so that we can use it later
                    this.strReflowAt = strReflowAt;
                    
                    // if the reflow CSS for this grid width doesn't already exist: append it
                    if (!styleElement.classList.contains('reflow-' + strReflowAt)) {
                        
                        // add reflow-SIZE to the styleElement's "class" attribute
                        styleElement.classList.add('reflow-' + strReflowAt);
                        
                        // append the reflow CSS
                        styleElement.innerHTML += '\n/* grid reflow width: ' + strReflowAt + ' */\n' +
                                                  '@media only screen and (max-width: ' + strReflowAt + ') {\n' +
                                                  '    gs-grid.reflow-' + strReflowAt + '            { width: 100%; }\n' +
                                                  '    gs-grid.reflow-' + strReflowAt + ' > gs-block { width: auto !important; float: none; }\n' +
                                                  '}\n';
                    }
                }
            }
        }
    });
    
    xtag.register('gs-block', {
        lifecycle: {},
        events: {},
        accessors: {},
        methods: {}
    });
});