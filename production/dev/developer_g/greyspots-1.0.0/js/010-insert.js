window.addEventListener('design-register-element', function () {
    registerDesignSnippet('<gs-insert>', '<gs-insert>', 'gs-insert src="${1:test.tpeople}">\n' +
                                                        '    ${2}\n' +
                                                        '</gs-insert>');
    
    designRegisterElement('gs-insert', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-insert.html');
    
    window.designElementProperty_GSINSERT = function(selectedElement) {
        addProp('Source&nbsp;Query', true,
                        '<gs-memo rows="1" autoresize class="target" value="' + (selectedElement.getAttribute('src') ||
                                selectedElement.getAttribute('source') || '') + '" mini></gs-memo>',
                function () {
            return setOrRemoveTextAttribute(selectedElement, 'src', this.value);
        });
        
        addProp('Additional&nbsp;Values', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('addin') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'addin', this.value);
        });
        
        // TITLE attribute
        addProp('Title', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('title') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'title', this.value);
        });
        
        // visibility attributes
        strVisibilityAttribute = '';
        if (selectedElement.hasAttribute('hidden'))          { strVisibilityAttribute = 'hidden'; }
        if (selectedElement.hasAttribute('hide-on-desktop')) { strVisibilityAttribute = 'hide-on-desktop'; }
        if (selectedElement.hasAttribute('hide-on-tablet'))  { strVisibilityAttribute = 'hide-on-tablet'; }
        if (selectedElement.hasAttribute('hide-on-phone'))   { strVisibilityAttribute = 'hide-on-phone'; }
        if (selectedElement.hasAttribute('show-on-desktop')) { strVisibilityAttribute = 'show-on-desktop'; }
        if (selectedElement.hasAttribute('show-on-tablet'))  { strVisibilityAttribute = 'show-on-tablet'; }
        if (selectedElement.hasAttribute('show-on-phone'))   { strVisibilityAttribute = 'show-on-phone'; }
        
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
        addFlexProps(selectedElement);
    };
});

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    
    function queryStringTemplateFunction(template) {
        var strWrapperTemplate = '{{##def.snippet:\n' +
                                 '    {{ var qs = jo; }} {{# def.template }}\n' +
                                 '#}}\n' +
                                 '{{#def.snippet}}';
        
        return doT.template(strWrapperTemplate, null, {'template': template})(GS.qryToJSON(GS.getQueryString())).trim();
    }
    
    xtag.register('gs-insert', {
        lifecycle: {},
        events: {},
        accessors: {},
        methods: {
            submit: function (callback) {
                var element = this, strInsertString = '', arrElement, i, len, jsnRow = {},
                    strSource = element.queryStringTemplate(decodeURIComponent(element.getAttribute('src') ||
                                                                               element.getAttribute('source') || ''));
                
                // if there is an addin attribute on this element:
                if (element.getAttribute('addin')) {
                    strInsertString += element.queryStringTemplate(element.getAttribute('addin'));
                }
                
                // build insert string
                arrElement = xtag.query(element, '[column]');
                
                for (i = 0, len = arrElement.length; i < len; i += 1) {
                    jsnRow[arrElement[i].getAttribute('column')] = arrElement[i].value;
                    strInsertString += (strInsertString ? '&' : '') + arrElement[i].getAttribute('column') + '=' +
                                                                            encodeURIComponent(arrElement[i].value);
                }
                
                strInsertString = encodeURIComponent(strInsertString);
                
                // add a loader to the page
                GS.addLoader('gs-insert', 'Inserting Record...');
                
                // make the insert call
                GS.ajaxJSON('/v1/' + (element.getAttribute('action-insert') || 'env/action_insert'),
                            'src=' + encodeURIComponent(strSource) + '&data=' + strInsertString, function (data, error) {
                    GS.removeLoader('gs-insert');
                    
                    // if there was no error: trigger event
                    if (!error) {
                        GS.triggerEvent(element, 'after_insert');
                        
                        if (typeof callback === 'function') {
                            callback(data.dat.lastval, jsnRow);
                        }
                        
                    // else if there was an error: error dialog
                    } else {
                        GS.ajaxErrorDialog(data);
                    }
                });
            },
            
            queryStringTemplate: queryStringTemplateFunction
        }
    });
});