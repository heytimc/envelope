
window.addEventListener('design-register-element', function () {
    registerDesignSnippet('Empty <gs-page>', '<gs-page>', 'gs-page>\n' +
                                                          '    $0\n' +
                                                          '</gs-page>');
    registerDesignSnippet('<gs-page> With Header', '<gs-page>', 'gs-page>\n' +
                                                         '    <gs-header><h3>${1}</h3></gs-header>\n' +
                                                         '    <gs-body>\n' +
                                                         '        $0\n' +
                                                         '    </gs-body>\n' +
                                                         '</gs-page>');
    registerDesignSnippet('Full <gs-page>', '<gs-page>', 'gs-page>\n' +
                                                         '    <gs-header><h3>${1}</h3></gs-header>\n' +
                                                         '    <gs-body>\n' +
                                                         '        $0\n' +
                                                         '    </gs-body>\n' +
                                                         '    <gs-footer>${2}</gs-footer>\n' +
                                                         '</gs-page>');
    
    designRegisterElement('gs-page', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-page.html');
    
    window.designElementProperty_GSPAGE = function (selectedElement) {
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
    xtag.register('gs-page', {
        lifecycle: {
            created: function () {
                var element = this, observer,
                    headerElement = xtag.queryChildren(element, 'gs-header')[0],
                    footerElement = xtag.queryChildren(element, 'gs-footer')[0];
                
                element.recalculatePadding();
                
                window.addEventListener('load', function () {
                    element.recalculatePadding();
                });
                window.addEventListener('resize', function () {
                    element.recalculatePadding();
                });
                
                // create an observer instance
                observer = new MutationObserver(function(mutations) {
                    element.recalculatePadding();
                    //console.log('mutation observed');
                });
                
                // pass in the element node, as well as the observer options
                if (headerElement) {
                    observer.observe(headerElement, {childList: true, subtree: true});
                }
                if (footerElement) {
                    observer.observe(footerElement, {childList: true, subtree: true});
                }
            },
            
            inserted: function () {
                this.recalculatePadding();
            }
        },
        events: {},
        accessors: {},
        methods: {
            recalculatePadding: function () {
                var headerElement = xtag.queryChildren(this, 'gs-header')[0],
                    footerElement = xtag.queryChildren(this, 'gs-footer')[0];
                
                //console.log('1***', headerElement, footerElement);
                
                this.style.paddingTop = '';
                this.style.paddingBottom = '';
                
                if (headerElement) {
                    //console.log('2***', headerElement.offsetHeight);
                    this.style.paddingTop = headerElement.offsetHeight + 'px';
                }
                if (footerElement) {
                    //console.log('3***', footerElement.offsetHeight);
                    this.style.paddingBottom = footerElement.offsetHeight + 'px';
                }
            }
        }
    });
});