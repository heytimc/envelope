window.addEventListener('design-register-element', function () {
    'use strict';
    registerDesignSnippet('<gs-switch>', '<gs-switch>', 'gs-switch>\n' +
                                                        '    <template for="${1:none}"></template>\n' +
                                                        '    <template for="${2:detail}"></template>\n' +
                                                        '</gs-switch>');
    
    designRegisterElement('gs-switch', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-switch.html');
    
    window.designElementProperty_GSSWITCH = function(selectedElement) {
        addFlexContainerProps(selectedElement);
        addFlexProps(selectedElement);
        
        addProp('Value', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('value') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'value', this.value);
        });
        
        addProp('Refresh On Querystring Columns', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('refresh-on-querystring-values') || '') + '" mini></gs-text>', function () {
            this.removeAttribute('refresh-on-querystring-change');
            return setOrRemoveTextAttribute(selectedElement, 'refresh-on-querystring-values', this.value);
        });
        
        addProp('Refresh On Querystring Change', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('refresh-on-querystring-change')) + '" mini></gs-checkbox>', function () {
            this.removeAttribute('refresh-on-querystring-values');
            return setOrRemoveBooleanAttribute(selectedElement, 'refresh-on-querystring-change', this.value === 'true', true);
        });
    };
});

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    function subsafeTemplate(strTemplate) {
        var templateElement = document.createElement('template'), strID, arrTemplates, i, len, jsnTemplates, strRet;
        
        templateElement.innerHTML = strTemplate;
        
        // temporarily remove templates. recursively go through templates whose parents do not have the source attribute
        i = 0;
        arrTemplates = xtag.query(templateElement.content, 'template');
        
        jsnTemplates = {};
        
        while (arrTemplates.length > 0 && i < 100) {
            // if the current template has a source parent: remove temporarily
            if (arrTemplates[0].parentNode.hasAttribute && (arrTemplates[0].parentNode.hasAttribute('src') ||
                                                            arrTemplates[0].parentNode.hasAttribute('source'))) {
                strID = 'UNIqUE_PLaCEhOLDER-' + GS.GUID() + '-UNiQUE_PLaCEhOLdER';
                jsnTemplates[strID] = arrTemplates[0].outerHTML;
                arrTemplates[0].outerHTML = strID;
                
            // else: add to the arrTemplates array
            } else {
                arrTemplates.push.apply(arrTemplates, xtag.query(arrTemplates[0].content, 'template'));
            }
            
            // remove the current template from the arrTemplates array
            arrTemplates.splice(0, 1);
            
            i += 1;
        }
        
        strRet = doT.template('{{##def.snippet:\n' +
                              '    {{ var qs = GS.qryToJSON(GS.getQueryString()); }} {{# def.template }}\n' +
                              '#}}\n' +
                              '{{#def.snippet}}', null, {"template": templateElement.innerHTML})();
        
        for (strID in jsnTemplates) {
            //                                                                  DO NOT DELETE, this allows single dollar signs to be inside dot notation
            strRet = strRet.replace(new RegExp(strID, 'g'), jsnTemplates[strID].replace(/\$/g, '$$$$'));
        }
        
        return strRet;
    }
    
    function querystringTemplate(strTemplate) {
        var strWrapperTemplate = '{{##def.snippet:\n' +
                                 '    {{ var qs = GS.qryToJSON(GS.getQueryString()); }} {{# def.template }}\n' +
                                 '#}}\n' +
                                 '{{#def.snippet}}';
        
        return doT.template(strWrapperTemplate, null, {'template': strTemplate})().trim();
    }
    
    function pushReplacePopHandler(element) {
        var i, len, arrPopKeys = [], bolRefresh = false, strQueryString = GS.getQueryString(), currentValue;
        
        if (element.hasAttribute('refresh-on-querystring-values') || element.hasAttribute('qs')) {
            if (element.hasAttribute('refresh-on-querystring-values')) {
                arrPopKeys = element.getAttribute('refresh-on-querystring-values').split(/\s*,\s*/gim);
            }
            if (element.hasAttribute('qs')) {
                GS.listAdd(arrPopKeys, element.getAttribute('qs'));
            }
            
            for (i = 0, len = arrPopKeys.length; i < len; i += 1) {
                currentValue = GS.qryGetVal(strQueryString, arrPopKeys[i]);
                
                if (element.popValues[arrPopKeys[i]] !== currentValue) {
                    bolRefresh = true;
                }
                
                element.popValues[arrPopKeys[i]] = currentValue;
            }
        } else {
            bolRefresh = true;
        }
        
        if (bolRefresh) {
            element.refresh();
        }
    }
    
    xtag.register('gs-switch', {
        lifecycle: {
            created: function () {
                // Get templates and define some variables
                var element = this, arrTemplate = xtag.queryChildren(this, 'template'), i, len, attr_i, attr_len,
                    arrAttrNames, arrAttrValues, strAttrName, root, strContent;
                
                this.attributesFromTemplate = [];
                this.templates = {};
                
                for (i = 0, len = arrTemplate.length; i < len; i += 1) {
                    if (i === 0) {
                        this.firstTemplate = arrTemplate[i].getAttribute('for') || arrTemplate[i].getAttribute('id');
                    }
                    
                    arrAttrNames = [];
                    arrAttrValues = [];
                    
                    for (attr_i = 0, attr_len = arrTemplate[i].attributes.length; attr_i < attr_len; attr_i += 1) {
                        strAttrName = arrTemplate[i].attributes[attr_i].nodeName;
                        
                        if (strAttrName !== 'for' && strAttrName !== 'id') {
                            arrAttrNames.push(strAttrName);
                            arrAttrValues.push(arrTemplate[i].attributes[attr_i].value);
                        }
                    }
                    
                    strContent = arrTemplate[i];
                    this.templates[strContent.getAttribute('for') || strContent.getAttribute('id')] = {
                        'content': strContent.innerHTML,
                        'arrAttrNames':  arrAttrNames,
                        'arrAttrValues': arrAttrValues,
                        'templated': !(this.hasAttribute('static') || strContent.hasAttribute('static'))
                    };


                    //console.log(arrTemplate[i].innerHTML);
                    
                    // this.templates[arrTemplate[i].getAttribute('for') || arrTemplate[i].getAttribute('id')] = {
                    //     'content': arrTemplate[i].innerHTML,
                    //     'arrAttrNames':  arrAttrNames,
                    //     'arrAttrValues': arrAttrValues,
                    //     'templated': !(this.hasAttribute('static') || arrTemplate[i].hasAttribute('static'))
                    // };
                }
                
                // Clear out the templates from the DOM
                this.innerHTML = '';
                
                this.arrQueryStringAttributes = [];
                this.popValues = {};
                
                if ((this.hasAttribute('value') && this.getAttribute('value').indexOf('{{') > -1) || this.hasAttribute('qs') ||
                    this.hasAttribute('refresh-on-querystring-values') || this.hasAttribute('refresh-on-querystring-change')) {
                    window.addEventListener('pushstate',    function () { pushReplacePopHandler(element); });
                    window.addEventListener('replacestate', function () { pushReplacePopHandler(element); });
                    window.addEventListener('popstate',     function () { pushReplacePopHandler(element); });
                }
                
                this.refresh();
            },
            attributeChanged: function (strAttributeName, oldValue, newValue) {
                if (strAttributeName === 'value') {
                    this.refresh();
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
            refresh: function () {
                var strQueryString = GS.getQueryString(),
                    strQSAttribute = this.getAttribute('qs'),
                    strValueAttribute = this.getAttribute('value'),
                    templateName, i, len;
                
                if (strQSAttribute && GS.qryGetVal(strQueryString, strQSAttribute)) {
                    templateName = GS.qryGetVal(strQueryString, strQSAttribute);
                    
                } else if (strValueAttribute) {
                    templateName = querystringTemplate(strValueAttribute);
                }
                
                templateName = templateName || this.firstTemplate;
                
                if (this.templates[templateName] && this.templates[templateName].content) {
                    
                    // if there are values in this.attributesFromTemplate
                    if (this.attributesFromTemplate.length > 0) {
                        // loop through them
                        for (i = 0, len = this.attributesFromTemplate.length; i < len; i += 1) {
                            // if attribute was initallySet: set it back to initalvalue
                            if (this.attributesFromTemplate[i].initallySet) {
                                this.setAttribute(this.attributesFromTemplate[i].name, this.attributesFromTemplate[i].initalValue);
                                
                            // else: remove it
                            } else {
                                this.removeAttribute(this.attributesFromTemplate[i].name);
                            }
                        }
                    }
                    
                    // clear this.attributesFromTemplate
                    this.attributesFromTemplate = [];
                    
                    // if there are values in this.templates[templateName].arrAttrNames
                    if (this.templates[templateName].arrAttrNames.length > 0) {
                        // loop through them
                        for (i = 0, len = this.templates[templateName].arrAttrNames.length; i < len; i += 1) {
                            // add to this.attributesFromTemplate
                            this.attributesFromTemplate.push({
                                'name': this.templates[templateName].arrAttrNames[i],
                                'initallySet': this.hasAttribute(this.templates[templateName].arrAttrNames[i]),
                                'initalValue': this.getAttribute(this.templates[templateName].arrAttrNames[i])
                            });
                            
                            // set attribute
                            this.setAttribute(this.templates[templateName].arrAttrNames[i], querystringTemplate(this.templates[templateName].arrAttrValues[i]));
                        }
                    }
                    
                    if (this.templates[templateName].templated) {
                        this.innerHTML = subsafeTemplate(this.templates[templateName].content);
                    } else {
                        this.innerHTML = this.templates[templateName].content;
                    }
                    
                    GS.triggerEvent(this, 'templatechange', {'templateName': templateName});
                } else {
                    this.innerHTML = '';
                }
            }
        }
    });
});