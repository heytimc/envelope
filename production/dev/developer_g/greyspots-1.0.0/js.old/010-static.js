
window.addEventListener('design-register-element', function () {
    
    registerDesignSnippet('<gs-static>', '<gs-static>', 'gs-static column="${1:name}"></gs-static>');
    
    designRegisterElement('gs-static', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-static.html');
    
    window.designElementProperty_GSSTATIC = function(selectedElement) {
        addProp('Formatted&nbsp;Text', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('pre')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'pre', (this.value === 'true'), true);
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
        
        addProp('Inline', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('inline')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'inline', (this.value === 'true'), true);
        });
        
        addProp('Mini', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('mini')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'mini', (this.value === 'true'), true);
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
        
        //addFlexContainerProps(selectedElement);
        addFlexProps(selectedElement);
    };
});

document.addEventListener('DOMContentLoaded', function () {
    function createPushReplacePopHandler(element) {
        element.value = GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs'));
    }
    
    xtag.register('gs-static', {
        lifecycle: {
            created: function() {
                var element = this, strQSValue;
                
                // if the value was set before the "created" lifecycle code runs: set attribute
                //      (discovered when trying to set a value of a date control in the after_open of a dialog)
                //      ("delete" keyword added because of firefox)
                if (this.value && !this.hasAttribute('value')) {
                    this.setAttribute('value', this.value);
                    delete this.value;
                    //this.value = null;
                }
                
                this.refresh();
                
                if (this.getAttribute('qs')) {
                    strQSValue = GS.qryGetVal(GS.getQueryString(), this.getAttribute('qs'));
                    
                    if (strQSValue !== '' || !this.getAttribute('value')) {
                        element.value = strQSValue;
                    }
                    
                    window.addEventListener('pushstate',    function () { createPushReplacePopHandler(element); });
                    window.addEventListener('replacestate', function () { createPushReplacePopHandler(element); });
                    window.addEventListener('popstate',     function () { createPushReplacePopHandler(element); });
                }
            },
            
            attributeChanged: function () {
                this.refresh();
            }
        },
        events: {},
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
            refresh: function () {
                this.innerHTML = this.getAttribute('value');
            }
        }
    });
});