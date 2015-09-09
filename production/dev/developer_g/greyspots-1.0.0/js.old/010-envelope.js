window.addEventListener('design-register-element', function (event) {
    'use strict';
    
    registerDesignSnippet('<gs-envelope>', '<gs-envelope>', 'gs-envelope src="${1:test.tpeople}">\n' +
                                                            '    <template for="hud"></template>\n' +
                                                            '    <template for="table">\n' +
                                                            '        <table>\n' +
                                                            '            <tbody>\n' +
                                                            '                <tr>\n' +
                                                            '                    <th heading="#"><gs-static column="row_number"></gs-static></th>\n' +
                                                            '                    <td heading="">$0</td>\n' +
                                                            '                </tr>\n' +
                                                            '            </tbody>\n' +
                                                            '        </table>\n' +
                                                            '    </template>\n' +
                                                            '    <template for="insert"></template>\n' +
                                                            '</gs-envelope>');
    
    designRegisterElement('gs-envelope', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-envelope.html');
    
    window.designElementProperty_GSENVELOPE = function (selectedElement) {
        var intIdNumber = (Math.floor(Math.random() * 1000)) + (Math.floor(new Date().getTime() / (Math.random() * 100000)));
        
        addProp('Source', true,
                '<gs-memo class="target" autoresize rows="1" value="' + decodeURIComponent(selectedElement.getAttribute('src') ||
                                                                        selectedElement.getAttribute('source') || '') + '" mini></gs-memo>',
                function () {
            return setOrRemoveTextAttribute(selectedElement, 'src', encodeURIComponent(this.value));
        });
        
        addProp('Columns', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('cols') || '') + '" mini></gs-text>',
                function () {
            return setOrRemoveTextAttribute(selectedElement, 'cols', this.value);
        });
        
        addProp('Where', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('where') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'where', (this.value));
        });
        
        addProp('Order By', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('ord') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'ord', this.value);
        });
        
        addProp('Limit', true, '<gs-number class="target" value="' + (selectedElement.getAttribute('limit') || '') + '" mini></gs-number>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'limit', this.value);
        });
        
        addProp('Offset', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('offset') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'offset', this.value);
        });
        
        addProp('Column In Querystring', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('qs') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'qs', this.value, false);
        });
        
        addProp('Parent&nbsp;Column', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('column') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'column', this.value);
        });
        
        addProp('Line Column', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('child-column') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'child-column', this.value);
        });
        
        addProp('Reflow At', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('reflow-at') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'reflow-at', this.value);
        });
        
        addProp('HUD Orderby', true, '<gs-checkbox class="target" value="' + (!selectedElement.hasAttribute('no-hudorderby')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'no-hudorderby', (this.value === 'true'), false);
        });
        
        addProp('HUD Limit', true, '<gs-checkbox class="target" value="' + (!selectedElement.hasAttribute('no-hudlimit')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'no-hudlimit', (this.value === 'true'), false);
        });
        
        addProp('HUD Refresh', true, '<gs-checkbox class="target" value="' + (!selectedElement.hasAttribute('no-hudrefresh')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'no-hudrefresh', (this.value === 'true'), false);
        });
        
        addProp('HUD Delete', true, '<gs-checkbox class="target" value="' + (!selectedElement.hasAttribute('no-huddelete')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'no-huddelete', (this.value === 'true'), false);
        });
        
        addProp('Expand&nbsp;To&nbsp;Content', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('expand-to-content')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'expand-to-content', (this.value === 'true'), true);
        });
        
        addProp('Primary Keys', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('primary-keys') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'primary-keys', this.value);
        });
        
        addProp('Select Action', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('action-select') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'action-select', this.value);
        });
        
        addProp('Insert Action', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('action-insert') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'action-insert', this.value);
        });
        
        addProp('Update Action', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('action-update') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'action-update', this.value);
        });
        
        addProp('Delete Action', true, '<gs-text class="target" value="' + (selectedElement.getAttribute('action-delete') || '') + '" mini></gs-text>', function () {
            return setOrRemoveTextAttribute(selectedElement, 'action-delete', this.value);
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
    
    function queryStringTemplateFunction(template) {
        var strWrapperTemplate = '{{##def.snippet:\n' +
                                 '    {{ var qs = jo; }} {{# def.template }}\n' +
                                 '#}}\n' +
                                 '{{#def.snippet}}';
        
        return doT.template(strWrapperTemplate, null, {'template': decodeHTML(template)})(GS.qryToJSON(GS.getQueryString())).trim();
    }
    
    function getCellFromTarget(element) {
        var currentElement = element;
        
        while (currentElement.nodeName !== 'TD' && currentElement.nodeName !== 'TH' && currentElement.nodeName !== 'HTML') {
            currentElement = currentElement.parentNode;
        }
        
        if (currentElement.nodeName !== 'TD' && currentElement.nodeName !== 'TH') {
            return undefined;
        }
        
        return currentElement;
    }
    
    function pushReplacePopHandler(element) {
        var i, len, arrPopKeys, bolRefresh = false, currentValue, strQueryString = GS.getQueryString();
        
        if (element.getAttribute('qs')) {
            element.value = GS.qryGetVal(strQueryString, element.getAttribute('qs'));
        }
        
        if (element.hasAttribute('refresh-on-querystring-values')) {
            arrPopKeys = element.getAttribute('refresh-on-querystring-values').split(',');
            
            for (i = 0, len = arrPopKeys.length; i < len; i += 1) {
                currentValue = GS.qryGetVal(strQueryString, arrPopKeys[i]);
                
                if (element.popValues[arrPopKeys[i]] !== currentValue) {
                    bolRefresh = true;
                }
                
                element.popValues[arrPopKeys[i]] = currentValue;
            }
            
        } else if (element.hasAttribute('refresh-on-querystring-change')) {
            bolRefresh = true;
        }
        
        if (bolRefresh) {
            element.refresh();
        }
    }
    
    xtag.register('gs-envelope', {
        lifecycle: {
            // Fires when an instance of the element is created
            created: function () {
                var element = this, hudTemplateElement, tableTemplateElement, tableTemplateElementCopy, insertTemplateElement,
                    recordElement, divElement, oldRootElement, i, len, arrElement, arrColumnElement, arrTemplates, arrWhereColumns,
                    strQueryString = GS.getQueryString(), currentElement, strQSValue;
                
                // console.log(this.innerHTML);
                
                // handle "qs" attribute
                if (this.getAttribute('qs') ||
                        this.getAttribute('refresh-on-querystring-values') ||
                        this.hasAttribute('refresh-on-querystring-change')) {
                    this.popValues = {};
                    
                    strQSValue = GS.qryGetVal(strQueryString, this.getAttribute('qs'));
                    
                    if (strQSValue !== '' || !this.getAttribute('value')) {
                        this.setAttribute('value', strQSValue);
                    }
                    
                    window.addEventListener('pushstate',    function () { pushReplacePopHandler(element); });
                    window.addEventListener('replacestate', function () { pushReplacePopHandler(element); });
                    window.addEventListener('popstate',     function () { pushReplacePopHandler(element); });
                }
                
                // primary keys attribute and defaulting
                if (element.getAttribute('primary-keys')) {
                    arrWhereColumns = element.getAttribute('primary-keys').split(/\s*,\s*/gim);
                    if (arrWhereColumns.length === 0) {
                        arrWhereColumns = ['id', 'change_stamp'];
                    }
                } else {
                    arrWhereColumns = ['id', 'change_stamp'];
                }
                element.arrWhereColumns = arrWhereColumns;
                
                // set user order bys to default to empty
                element.user_order_bys = {
                    'columns': [],
                    'directions': []
                };
                
                // if there is an old root element: delete it
                oldRootElement = xtag.queryChildren(element, '.root');
                
                if (oldRootElement.length > 0) {
                    for (i = 0, len = oldRootElement.length; i < len; i += 1) {
                        element.removeChild(oldRootElement[i]);
                    }
                }
                
                // selecting for template elements
                hudTemplateElement    = xtag.queryChildren(element, 'template[for="hud"]')[0];
                tableTemplateElement  = xtag.queryChildren(element, 'template[for="table"]')[0];
                insertTemplateElement = xtag.queryChildren(element, 'template[for="insert"]')[0];
                
                // checking/saving template elements
                if (hudTemplateElement) {
                    element.hudTemplate = hudTemplateElement.innerHTML;
                }
                if (tableTemplateElement) {
                    tableTemplateElementCopy = document.createElement('template');
                    tableTemplateElementCopy.innerHTML = tableTemplateElement.innerHTML;
                    
                    recordElement = xtag.query(xtag.query(tableTemplateElementCopy.content, 'tbody')[0], 'tr')[0];
                    
                    if (recordElement) {
                        for (i = 0, len = element.arrWhereColumns.length; i < len; i += 1) {
                            recordElement.setAttribute('data-' + element.arrWhereColumns[i], '{{! row.' + element.arrWhereColumns[i] + ' }}');
                        }
                        
                        //recordElement.setAttribute('data-id', '{{! row.id }}');
                        //recordElement.setAttribute('data-change_stamp', '{{! row.change_stamp }}');
                        
                        arrColumnElement = xtag.query(recordElement, '[column]');
                        
                        // recursively go through templates whose parents do not have the source attribute
                        i = 0;
                        arrTemplates = xtag.query(tableTemplateElementCopy.content, 'template'); // *:not([source]) > 
                        //arrTemplates.push.apply(arrTemplates, xtag.toArray(tableTemplateElementCopy.content.querySelectorAll('template')));
                        
                        for (i = arrTemplates.length - 1; i >= 0; i -= 1) {
                            if (arrTemplates[i].parentNode.hasAttribute && (arrTemplates[i].parentNode.hasAttribute('src') || arrTemplates[i].parentNode.hasAttribute('source'))) {
                                arrTemplates.splice(i, 1);
                            }
                        }
                        
                        while (arrTemplates.length > 0 && i < 100) {
                            //console.log(arrTemplates.length, xtag.query(arrTemplates[0].content, '[column]'));
                            
                            // add all of the column elements to the arrColumnElement array
                            arrColumnElement.push.apply(arrColumnElement, xtag.query(arrTemplates[0].content, '[column]'));
                            
                            // add any template elements that do not have a source to the arrTemplates array
                            arrTemplates.push.apply(arrTemplates, xtag.query(arrTemplates[0].content, '*:not([source]) > template'));
                            
                            for (i = arrTemplates.length - 1; i >= 0; i -= 1) {
                                if (arrTemplates[i].parentNode.hasAttribute && (arrTemplates[i].parentNode.hasAttribute('src') || arrTemplates[i].parentNode.hasAttribute('source'))) {
                                    arrTemplates.splice(i, 1);
                                }
                            }
                            
                            // remove the current template from the arrTemplates array
                            arrTemplates.splice(0, 1);
                            
                            i += 1;
                        }
                        
                        //console.log(arrColumnElement); // recordElement, 
                        for (i = 0, len = arrColumnElement.length; i < len; i += 1) {
                            currentElement = arrColumnElement[i];
                            
                            //console.log(currentElement, currentElement.getAttribute('value'), currentElement.getAttribute('column'));
                            if ((!currentElement.getAttribute('value')) && currentElement.getAttribute('column')) {
                                currentElement.setAttribute('value', '{{! row.' + currentElement.getAttribute('column') + ' }}');
                            }
                        }
                        //console.log(tableTemplateElement.innerHTML);
                        
                        element.tableTemplate = tableTemplateElementCopy.innerHTML;
                    }
                } else {
                    throw 'Envelope error: table template is required.';
                }
                if (insertTemplateElement) {
                    element.insertTemplate = insertTemplateElement.innerHTML;
                }
                
                // clear element content
                element.innerHTML = '';
                
                // creating/setting root
                divElement = document.createElement('div');
                divElement.classList.add('root');
                divElement.setAttribute('flex-fill', '');
                divElement.setAttribute('flex-vertical', '');
                divElement.setAttribute('gs-dynamic', '');
                
                element.appendChild(divElement);
                element.root = divElement;
                
                // filling root with containers
                element.root.innerHTML = '<div class="hud-container-top" gs-dynamic></div>' +
                                         '<div class="fixed-header-container" gs-dynamic></div>' +
                                         '<div class="scroll-container" flex gs-dynamic></div>' +
                                         '<div class="hud-container-bottom" flex-horizontal gs-dynamic></div>' +
                                         '<input class="gs-envelope-copy-focus-target" value="firefox..." gs-dynamic />';
                
                element.hudTopElement =                 xtag.queryChildren(element.root, '.hud-container-top')[0];
                element.fixedHeaderContainerElement =   xtag.queryChildren(element.root, '.fixed-header-container')[0];
                element.scrollContainerElement =        xtag.queryChildren(element.root, '.scroll-container')[0];
                element.hudBottomElement =              xtag.queryChildren(element.root, '.hud-container-bottom')[0];
                element.copyFocusTargetElement =        xtag.queryChildren(element.root, '.gs-envelope-copy-focus-target')[0];
                
                element.addEventListener('focus', function (event) {
                    //console.log(document.activeElement, element, event.target, element.copyFocusTargetElement);
                    if (document.activeElement === element) { // event.target
                        element.copyFocusTargetElement.focus();
                        GS.setInputSelection(element.copyFocusTargetElement, 0, 'firefox...'.length);
                    }
                });
                
                // binding events
                element.scrollContainerElement.addEventListener('change', function (event) {
                    var newValue;
                    
                    if (event.target.getAttribute('column')) {
                        if (event.target.value !== null) {
                            newValue = event.target.value;
                        } else {
                            newValue = event.target.checked;
                        }
                        
                        element.updateRecord(GS.findParentTag(event.target, 'tr'), event.target.getAttribute('column'), newValue);
                    }
                });
                
                // if we are not on a touch device: cell by cell selection
                if (!evt.touchDevice) {
                    // mousedown (on selected and unselected) + drag
                    //      clear previous selection(s)
                    //      select cells from origin cell to current cell
                    //
                    // shift + mousedown (on selected and unselected) + drag
                    //      alter previous selection
                    //      select cells from previous origin cell to current cell
                    //
                    // command + mousedown (on unselected) + drag
                    //      maintain previous selection(s)
                    //      select cells from origin cell to current cell
                    //
                    // command + mousedown (on selected) + drag
                    //      maintain previous selection(s)
                    //      deselect cells from origin cell to current cell
                    //
                    // collision handling
                    //      when colliding with previous selections: dont treat them different
                    //
                    // copy handling
                    //      selection ("X" marks selected cells (imagine all cells contain the letter "a")):
                    //          1  2  3  4  5
                    //          -------------
                    //          a  a  a  a  a
                    //          a  X  X  a  a
                    //          a  a  X  X  a
                    //          a  a  a  a  a
                    //
                    //      yields ("'" marks an empty cell):
                    //          2  3  4 
                    //          --------
                    //          a  a  ' 
                    //          '  a  a 
                    
                    element.addEventListener(evt.mousedown, function (event) {
                        var target = event.target, cellFromTarget = getCellFromTarget(target), closestCell, arrSelectedCells, i, len;
                        
                        if (GS.findParentTag(event.target, 'table')) {
                            if (cellFromTarget) {
                                closestCell = cellFromTarget;
                            } else if (target.classList.contains('fixed-header-cell')) {
                                closestCell = element.theadElement.children[0].children[xtag.toArray(target.parentNode.children).indexOf(target)];
                            }
                            
                            if (closestCell) {
                                element.dragAllowed = true;
                                element.dragCurrentCell = closestCell;
                                element.selectionSelectedCells = [];
                                
                                // if shift is down and there is a previous origin: use previous origin for current origin
                                if (event.shiftKey && element.selectionPreviousOrigin) {
                                    
                                    // if there are previously selected cells: deselect the previous selected cells
                                    if (element.selectionPreviousSelectedCells) {
                                        arrSelectedCells = element.selectedCells;
                                        
                                        for (i = 0, len = element.selectionPreviousSelectedCells.length; i < len; i += 1) {
                                            arrSelectedCells.splice(arrSelectedCells.indexOf(element.selectionPreviousSelectedCells[i]), 1);
                                        }
                                        
                                        element.selectedCells = arrSelectedCells;
                                    }
                                    
                                    element.dragOrigin = element.selectionPreviousOrigin;
                                    element.dragMode = 'select';
                                    
                                // else if ctrl or cmd is down and the target cell is not selected: select cells from target cell to current cell
                                } else if (!event.shiftKey && (event.metaKey || event.ctrlKey) && !closestCell.hasAttribute('selected')) {
                                    element.dragOrigin = closestCell;
                                    element.dragMode = 'select';
                                    
                                // else if ctrl or cmd is down and the target cell is selected: deselect cells from target cell to current cell
                                } else if (!event.shiftKey && (event.metaKey || event.ctrlKey) && closestCell.hasAttribute('selected')) {
                                    element.dragOrigin = closestCell;
                                    element.dragMode = 'deselect';
                                    
                                // else: deselect all cells and start new selection
                                } else {
                                    element.selectedCells = [];
                                    element.dragOrigin = closestCell;
                                    element.dragMode = 'select';
                                }
                                
                                element.selectHandler(element.dragOrigin, element.dragCurrentCell, element.dragMode);
                            }
                        }
                    });
                    element.addEventListener(evt.mousemove, function (event) {
                        var target, closestCell, cellFromTarget;
                        
                        // if mouse is down
                        if (event.which !== 0) {
                            target = event.target;
                            cellFromTarget = getCellFromTarget(target);
                            
                            if (cellFromTarget) {
                                closestCell = cellFromTarget;
                            } else if (target.classList.contains('fixed-header-cell')) {
                                closestCell =
                                    element.theadElement.children[0].children[xtag.toArray(target.parentNode.children).indexOf(target)];
                            }
                            
                            // if selection is allowed at this point and closestCell is different from element.dragCurrentCell
                            if (element.dragAllowed && element.dragCurrentCell !== closestCell) {
                                element.dragCurrentCell = getCellFromTarget(closestCell);
                                element.selectHandler(element.dragOrigin, element.dragCurrentCell, element.dragMode);
                            }
                        } else {
                            element.dragAllowed = false;
                            element.selectionPreviousOrigin = element.dragOrigin;
                            element.selectionPreviousSelectedCells = element.selectionSelectedCells;
                        }
                    });
                    element.addEventListener(evt.mouseup, function (event) {
                        element.dragAllowed = false;
                        
                        if (element.dragMode === 'select') {
                            element.selectionPreviousOrigin = element.dragOrigin;
                            element.selectionPreviousSelectedCells = element.selectionSelectedCells;
                        }
                    });
                    
                // else we are on a touch device: record selection
                } else {
                    element.root.addEventListener(evt.mousedown, function (event) {
                        if (event.target.nodeName === 'TD' || event.target.nodeName === 'TH' || getCellFromTarget(event.target)) {
                            element.selectedCells = [];
                            
                            // if there is a parent record to the target: select all of the cells in the record
                            if (GS.findParentTag(event.target, 'tr')) {
                                element.selectedCells = GS.findParentTag(event.target, 'tr').children;
                            }
                        }
                    });
                }
                
                window.addEventListener('resize', function () {
                    element.refreshFixedHeader();
                    element.refreshReflow();
                });
                window.addEventListener('orientationchange', function () {
                    element.refreshFixedHeader();
                    element.refreshReflow();
                });
                element.addEventListener('size-changed', function (event) {
                    element.refreshFixedHeader();
                    //element.refreshReflow();
                });
                
                // key navigation
                element.addEventListener('keydown', function (event) {
                    var target = event.target, intKeyCode = event.which || event.keyCode, jsnSelection, bolCursorElement, i, len,
                        focusElement, tbodyElement, recordElement, cellElement, cellElements, tempElement;
                    
                    if (target !== element) {
                        bolCursorElement = target.nodeName === 'INPUT' || target.nodeName === 'TEXTAREA';
                        
                        if (bolCursorElement) {
                            jsnSelection = GS.getInputSelection(target);
                        } else {
                            jsnSelection = {};
                        }
                        
                        // up arrow
                        if (intKeyCode === 38) {
                            //console.log('if there is a record before this one: focus the same column in the previous record');
                            
                            cellElement = getCellFromTarget(target);
                            recordElement = cellElement.parentNode;
                            tbodyElement = recordElement.parentNode;
                            
                            if (recordElement.rowIndex > 1) { // recordIndex > 0
                                recordElement = tbodyElement.children[recordElement.rowIndex - 2];
                                
                                focusElement = xtag.query(recordElement.children[cellElement.cellIndex], '[column]')[0];
                            }
                            
                        // down arrow
                        } else if (intKeyCode === 40) {
                            //console.log('if there is another record after this one: focus the same column in the next record');
                            
                            cellElement = getCellFromTarget(target);
                            recordElement = cellElement.parentNode;
                            tbodyElement = recordElement.parentNode;
                            
                            if (recordElement.rowIndex < tbodyElement.children.length) {
                                recordElement = tbodyElement.children[recordElement.rowIndex];
                                
                                //focusElement = recordElement.children[cellElement.cellIndex].children[0];
                                focusElement = xtag.query(recordElement.children[cellElement.cellIndex], '[column]')[0];
                            }
                            
                        // if left or right arrow
                        } else if (intKeyCode === 37 || intKeyCode === 39) {
                            // left arrow and (at the beginning of the target OR target has no selected)
                            if (intKeyCode === 37 && (bolCursorElement === false || jsnSelection.start === 0)) {
                                //console.log('previous control if possible');
                                
                                cellElement = getCellFromTarget(target);
                                recordElement = cellElement.parentNode;
                                tbodyElement = recordElement.parentNode;
                                
                                cellElements = xtag.query(tbodyElement, 'tr > td, tr > th');
                                
                                // loop through previous cells looking for something focusable
                                for (i = cellElements.indexOf(cellElement) - 1; i > -1; i -= 1) {
                                    //console.log(i);
                                    
                                    tempElement = xtag.query(cellElements[i], '[column]')[0];
                                    
                                    if (tempElement && GS.isElementFocusable(tempElement)) { // tempElement.control
                                        focusElement = tempElement; // tempElement.control
                                        
                                        break;
                                    }
                                }
                                
                            // right arrow and (at the end of the target OR target has no selected)
                            } else if (intKeyCode === 39 && (bolCursorElement === false || jsnSelection.end === target.value.length)) {
                                cellElement = getCellFromTarget(target);
                                recordElement = cellElement.parentNode;
                                tbodyElement = recordElement.parentNode;
                                
                                cellElements = xtag.query(tbodyElement, 'tr > td, tr > th');
                                
                                // loop through previous cells looking for something focusable
                                for (i = cellElements.indexOf(cellElement) + 1, len = cellElements.length; i < len; i += 1) { // - 1
                                    tempElement = xtag.query(cellElements[i], '[column]')[0];
                                    
                                    if (tempElement && GS.isElementFocusable(tempElement)) { // tempElement.control
                                        focusElement = tempElement; // tempElement.control
                                        
                                        break;
                                    }
                                }
                            }
                        }
                        
                        if (focusElement && GS.isElementFocusable(focusElement)) {
                            event.preventDefault();
                            
                            focusElement.focus();
                            
                            if (document.activeElement.nodeName === 'INPUT' || document.activeElement.nodeName === 'TEXTAREA') {
                                GS.setInputSelection(document.activeElement, 0, document.activeElement.value.length);
                            }
                            
                            element.selectedRecords = GS.findParentTag(focusElement, 'TR');
                        }
                    }
                });
                
                // copy event
                element.tabIndex = 0;
                document.body.addEventListener('copy', function (event) {//console.log('test');
                    var elementClosestEnvelope = GS.findParentTag(document.activeElement, 'gs-envelope'), strCopyString,
                        i, len, cell_i, cell_len, arrSelected, intFromRecord = 9999999, intFromCell = 9999999, intToRecord = 0, intToCell = 0,
                        strCellText, arrRecords, arrCells, strRecordString;
                    
                    if (elementClosestEnvelope === element &&
                        (
                            document.activeElement.classList.contains('gs-envelope-copy-focus-target') ||
                            document.activeElement.selectionStart === document.activeElement.selectionEnd
                        )) {
                        arrSelected = element.selectedCells;
                        
                        // loop through the selected cells and create a tsv string using the text of the cell
                        if (arrSelected.length > 0) {
                            for (i = 0, len = arrSelected.length; i < len; i += 1) {
                                if (arrSelected[i].parentNode.rowIndex < intFromRecord) {
                                    intFromRecord = arrSelected[i].parentNode.rowIndex;
                                }
                                if (arrSelected[i].cellIndex < intFromCell) {
                                    intFromCell = arrSelected[i].cellIndex;
                                }
                                if (arrSelected[i].parentNode.rowIndex + 1 > intToRecord) {
                                    intToRecord = arrSelected[i].parentNode.rowIndex + 1;
                                }
                                if (arrSelected[i].cellIndex + 1 > intToCell) {
                                    intToCell = arrSelected[i].cellIndex + 1;
                                }
                            }
                            
                            arrRecords = xtag.query(element.scrollContainerElement, 'tr');
                            strCopyString = '';
                            
                            for (i = intFromRecord, len = intToRecord; i < len; i += 1) {
                                arrCells = arrRecords[i].children;
                                
                                for (cell_i = intFromCell, cell_len = intToCell, strRecordString = ''; cell_i < cell_len; cell_i += 1) {
                                    if (arrCells[cell_i].hasAttribute('selected')) {
                                        if (arrCells[cell_i].lastElementChild) { 
                                            strCellText = arrCells[cell_i].lastElementChild.textValue ||
                                                          arrCells[cell_i].lastElementChild.value ||
                                                          (arrCells[cell_i].lastElementChild.checked || '').toString();
                                        } else {
                                            strCellText = arrCells[cell_i].textContent;
                                        }
                                    } else {
                                        strCellText = '';
                                    }
                                    
                                    strRecordString += (cell_i !== intFromCell ? '\t' : '') + (strCellText || '');
                                }
                                if (strRecordString.trim()) {
                                    strCopyString += strRecordString;
                                }
                                if (i + 1 !== len && strRecordString.trim()) {
                                    strCopyString += '\n';
                                }
                            }
                        }
                        
                        if (strCopyString) {
                            if (element.handleClipboardData(event, strCopyString)) {
                                event.preventDefault(event);
                            }
                        }
                    }
                });
                
                // getData
                element.refreshHud();
                element.getData();
            },
            
            // Fires when an attribute was added, removed, or updated
            attributeChanged: function(strAttrName, oldVal, newVal) {
                if (strAttrName === 'no-hudlimit' || strAttrName === 'no-hudorderby' || strAttrName === 'no-huddelete' || strAttrName === 'no-hudrefresh') {
                    this.refreshHud();
                    
                // this.root is here becuase of an issue where refresh was called before the envelope was initialized
                } else if (strAttrName === 'value' && this.root) {
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
                    this.getData();
                }
            },
            selectedCells: {
                get: function () {
                    return xtag.query(this.scrollContainerElement, '[selected]');
                },
                
                set: function (newValue) {
                    var i, len, intIdIndex, arrCells = this.selectedCells, arrRecords, cell_i, cell_len,
                        fixedHeaderCells = xtag.queryChildren(this.fixedHeaderContainerElement, '.fixed-header-cell');
                    
                    //console.log(arrRecords);
                    
                    // clear old selection
                    for (i = 0, len = fixedHeaderCells.length; i < len; i += 1) {
                        fixedHeaderCells[i].removeAttribute('selected');
                    }
                    for (i = 0, len = arrCells.length; i < len; i += 1) {
                        arrCells[i].removeAttribute('selected');
                    }
                    
                    arrCells = xtag.query(this.scrollContainerElement, '[selected-secondary]');
                    for (i = 0, len = arrCells.length; i < len; i += 1) {
                        arrCells[i].removeAttribute('selected-secondary');
                    }
                    
                    // if newValue is not an array: make it an array
                    if (typeof newValue === 'object' && newValue.length === undefined) {
                        arrCells = [newValue];
                    } else {
                        arrCells = newValue;
                    }
                    
                    // set new selection
                    for (i = 0, len = arrCells.length; i < len; i += 1) {
                        arrCells[i].setAttribute('selected', '');
                        
                        if (arrCells[i].parentNode.parentNode.nodeName === 'THEAD') {
                            fixedHeaderCells[arrCells[i].cellIndex].setAttribute('selected', '');
                        }
                    }
                    
                    arrRecords = this.selectedRecords;
                    
                    for (i = 0, len = arrRecords.length; i < len; i += 1) {
                        arrCells = arrRecords[i].children;
                        
                        for (cell_i = 0, cell_len = arrCells.length; cell_i < cell_len; cell_i += 1) {
                            if (!arrCells[cell_i].hasAttribute('selected')) {
                                arrCells[cell_i].setAttribute('selected-secondary', '');
                            }
                        }
                    }
                    
                    GS.triggerEvent(this, 'after_selection');
                }
            },
            selectedRecords: {
                get: function () {
                    var i, len, intRecordIndex = -1, arrRecord = [], selected = this.selectedCells;
                    
                    // loop through the selected cells and create an array of trs
                    for (i = 0, len = selected.length; i < len; i += 1) {
                        if (selected[i].parentNode.rowIndex > intRecordIndex && selected[i].parentNode.parentNode.nodeName !== 'THEAD') {
                            intRecordIndex = selected[i].parentNode.rowIndex;
                            
                            arrRecord.push(selected[i].parentNode);
                        }
                    }
                    
                    return arrRecord;
                },
                
                set: function (newValue) {
                    var i, len, cell_i, cell_len, intIdIndex, arrCells = this.selectedCells, arrRecords, arrCellChildren,
                        fixedHeaderCells = xtag.queryChildren(this.fixedHeaderContainerElement, '.fixed-header-cell');
                    
                    // clear old selection
                    for (i = 0, len = arrCells.length; i < len; i += 1) {
                        arrCells[i].removeAttribute('selected');
                        
                        if (arrCells[i].parentNode.parentNode.nodeName === 'THEAD') {
                            fixedHeaderCells[arrCells[i].cellIndex].removeAttribute('selected', '');
                        }
                    }
                    
                    // if newValue is not an array: make it an array
                    if (typeof newValue === 'object' && newValue.length === undefined) {
                        arrRecords = [newValue];
                    } else {
                        arrRecords = newValue;
                    }
                    
                    // set new selection
                    for (i = 0, len = arrRecords.length, arrCells = []; i < len; i += 1) {
                        arrCellChildren = arrRecords[i].children;
                        
                        for (cell_i = 0, cell_len = arrCellChildren.length; cell_i < cell_len; cell_i += 1) {
                            arrCells.push(arrCellChildren[cell_i]);
                        }
                    }
                    
                    this.selectedCells = arrCells;
                    
                    GS.triggerEvent(this, 'after_selection');
                }
            },
            selectedIds: {
                get: function () {
                    var i, len, arrID = [], selected = this.selectedRecords;
                    
                    // loop through the selected records and create an array of ids
                    for (i = 0, len = selected.length; i < len; i += 1) {
                        arrID.push(String(selected[i].dataset.id));
                        //arrID.push(String(selected[i].parentNode.dataset.id));
                    }
                    
                    return arrID;
                },
                
                set: function (newValue) {
                    var i, len, cell_i, cell_len, arrCells = this.selectedCells, // intIdIndex,
                        arrRecords = xtag.query(this.scrollContainerElement, 'tbody > tr');
                    
                    //console.log(arrRecords);
                    
                    // clear old selection
                    for (i = 0, len = arrCells.length; i < len; i += 1) {
                        arrCells[i].removeAttribute('selected');
                    }
                    
                    // if newValue is not an array: make it an array
                    if (typeof newValue !== 'object') {
                        newValue = [String(newValue)];
                    }
                    
                    // set new selection
                    for (i = 0, len = arrRecords.length; i < len; i += 1) {
                        
                        if (newValue.indexOf(arrRecords[i].getAttribute('data-id')) > -1) {//String(.dataset.id) === String()
                            arrCells = arrRecords[i].children;
                            
                            for (cell_i = 0, cell_len = arrCells.length; cell_i < cell_len; cell_i += 1) {
                                arrCells[cell_i].setAttribute('selected', '');
                            }
                        }
                    }
                    
                    GS.triggerEvent(this, 'after_selection');
                }
            }
        },
        methods: {
            // ###################################################################
            // ########################## DRAG HANDLING ##########################
            // ###################################################################
            
            selectHandler: function (dragOrigin, dragCurrentCell, dragMode) {
                var bolThead, bolFirstTh, arrRecords, arrCells, arrRecordsToAffect = [], arrCellsToAffect = [],
                    arrNewSelection = [], arrCellsToRemoveFromSelection = [], i, len, intFrom, intTo;
                
                arrRecords = xtag.query(this.scrollContainerElement, 'tr');
                arrCells = xtag.query(this.scrollContainerElement, 'td, th');
                
                if (arrRecords.length > 0) {
                    bolThead = Boolean(this.theadElement);
                    
                    if ((bolThead && arrRecords.length > 1) || (!bolThead && arrRecords > 0)) {
                        if (bolThead) {
                            bolFirstTh = arrRecords[1].children[0].nodeName === 'TH';
                        } else {
                            bolFirstTh = arrRecords[0].children[0].nodeName === 'TH';
                        }
                    }
                    
                    // if origin & currentCell are both the top-left cell and the cell is a heading: select all cells
                    if (bolThead && bolFirstTh &&
                        dragOrigin.parentNode.rowIndex === 0 && dragCurrentCell.parentNode.rowIndex === 0 &&
                        dragOrigin.cellIndex === 0 && dragCurrentCell.cellIndex === 0) {
                        arrCellsToAffect = arrCells;
                        
                    // else if origin & currentCell are both first ths: select the records from origin to currentCell
                    } else if (bolFirstTh && dragOrigin.cellIndex === 0 && dragCurrentCell.cellIndex === 0) {
                        arrRecordsToAffect =
                            arrRecords.slice(Math.min(dragOrigin.parentNode.rowIndex, dragCurrentCell.parentNode.rowIndex),
                                             Math.max(dragOrigin.parentNode.rowIndex, dragCurrentCell.parentNode.rowIndex) + 1);
                        
                        for (i = 0, len = arrRecordsToAffect.length; i < len; i += 1) {
                            Array.prototype.push.apply(arrCellsToAffect, xtag.toArray(arrRecordsToAffect[i].children));
                        }
                        
                    // else if origin & currentCell are both headings: select the columns from origin to currentCell
                    } else if (bolThead && dragOrigin.parentNode.rowIndex === 0 && dragCurrentCell.parentNode.rowIndex === 0) {
                        intFrom = Math.min(dragOrigin.cellIndex, dragCurrentCell.cellIndex);
                        intTo   = Math.max(dragOrigin.cellIndex, dragCurrentCell.cellIndex) + 1;
                        
                        for (i = 0, len = arrRecords.length; i < len; i += 1) {
                            Array.prototype.push.apply(arrCellsToAffect, xtag.toArray(arrRecords[i].children).slice(intFrom, intTo));
                        }
                        
                    // else if origin & currentCell are the same cell: select the record
                    } else if (dragOrigin === dragCurrentCell) {
                        arrRecordsToAffect = arrRecords.slice(dragOrigin.parentNode.rowIndex, dragOrigin.parentNode.rowIndex + 1);
                        
                        for (i = 0, len = arrRecordsToAffect.length; i < len; i += 1) {
                            Array.prototype.push.apply(arrCellsToAffect, xtag.toArray(arrRecordsToAffect[i].children));
                        }
                        
                    // else select cells from origin to currentCell
                    } else {
                        arrRecordsToAffect =
                            arrRecords.slice(Math.min(dragOrigin.parentNode.rowIndex, dragCurrentCell.parentNode.rowIndex),
                                             Math.max(dragOrigin.parentNode.rowIndex, dragCurrentCell.parentNode.rowIndex) + 1);
                        
                        intFrom = Math.min(dragOrigin.cellIndex, dragCurrentCell.cellIndex);
                        intTo   = Math.max(dragOrigin.cellIndex, dragCurrentCell.cellIndex) + 1;
                        
                        for (i = 0, len = arrRecordsToAffect.length; i < len; i += 1) {
                            Array.prototype.push.apply(arrCellsToAffect, xtag.toArray(arrRecordsToAffect[i].children).slice(intFrom, intTo));
                        }
                    }
                    
                    if (dragMode === 'select') {
                        
                        // add new cells to this.selectionSelectedCells
                        for (i = 0, len = this.selectionSelectedCells.length; i < len; i += 1) {
                            if (arrCellsToAffect.indexOf(this.selectionSelectedCells[i]) === -1) {
                                arrCellsToRemoveFromSelection.push(this.selectionSelectedCells[i]);
                            }
                        }
                        this.selectionSelectedCells = arrCellsToAffect;
                        
                        // add new cells to this.selectedCells
                        arrNewSelection = this.selectedCells;
                        for (i = 0, len = arrCellsToAffect.length; i < len; i += 1) {
                            GS.listAdd(arrNewSelection, arrCellsToAffect[i]);
                        }
                        for (i = 0, len = arrCellsToRemoveFromSelection.length; i < len; i += 1) {
                            arrNewSelection.splice(arrNewSelection.indexOf(arrCellsToRemoveFromSelection[i]), 1);
                        }
                        this.selectedCells = arrNewSelection;
                        
                        //this.selectionSelectedCells = arrCellsToAffect;
                        //this.selectedCells = arrCellsToAffect;
                        
                    } else { // implied if: dragMode === 'deselect'
                        // deselect cells from arrCellsToAffect
                        arrNewSelection = this.selectedCells;
                        
                        for (i = 0, len = arrCellsToAffect.length; i < len; i += 1) {
                            if (arrNewSelection.indexOf(arrCellsToAffect[i]) > -1) {
                                arrNewSelection.splice(arrNewSelection.indexOf(arrCellsToAffect[i]), 1);
                            }
                        }
                        this.selectedCells = arrNewSelection;
                    }
                }
            },
            
            
            // #######################################################################
            // ############################ DATA HANDLING ############################
            // #######################################################################
            
            // just a semantic alias to the getData function
            refresh: function () {
                this.getData();
            },
            
            // get data and send it off to be templated
            getData: function () {
                var element = this, data, strLink, strOrderBy, strWhere, strWhereColumn, strSelectAction,
                    strWhereAttribute = this.queryStringTemplate((element.getAttribute('where') || '')),
                    strSource = this.queryStringTemplate(decodeURIComponent(element.getAttribute('src') ||
                                                                            element.getAttribute('source') || '')),
                    strCols = this.queryStringTemplate(this.getAttribute('cols') || ''), callbackFunction, i, len;
                
                strLink = '/v1/' + (element.getAttribute('action-select') || 'env/action_select') + '?src=' + encodeURIComponent(strSource);
                
                // if there is a column attribute on this element: combine the where attribute with a where generated by value
                if ((element.getAttribute('column') || element.getAttribute('qs')) && element.value) {
                    strWhereColumn = element.getAttribute('child-column') || element.getAttribute('column') || element.getAttribute('qs');
                    
                    if (isNaN(element.value)) {
                        strWhere = strWhereColumn + '::text=\'' + (element.value) + '\'::text' + (strWhereAttribute !== '' ? ' AND (' + strWhereAttribute + ')' : '');
                    } else {
                        strWhere = strWhereColumn + '=' + (element.value) + (strWhereAttribute !== '' ? ' AND (' + strWhereAttribute + ')' : '');
                    }
                    
                // else: just use the where attribute
                } else {
                    strWhere = strWhereAttribute;
                }
                
                // if the user has set an order by: use the user order bys
                if (element.user_order_bys && element.user_order_bys.columns.length > 0) {
                    for (i = 0, len = element.user_order_bys.columns.length, strOrderBy = ''; i < len; i += 1) {
                        strOrderBy += (strOrderBy !== '' ? ', ' : '') + element.user_order_bys.columns[i] + ' ' + element.user_order_bys.directions[i].toUpperCase();
                    }
                    
                // else: use the order by attribute
                } else {
                    strOrderBy = this.queryStringTemplate(decodeURIComponent(element.getAttribute('ord') || ''));
                }
                
                // append the rest of the parameters to the link
                strLink += '&where='    + encodeURIComponent(strWhere) +
                           '&limit='    + encodeURIComponent(this.queryStringTemplate(decodeURIComponent(this.getAttribute('limit') || ''))) +
                           '&offset='   + encodeURIComponent(this.queryStringTemplate(decodeURIComponent(this.getAttribute('offset') || ''))) +
                           '&order_by=' + encodeURIComponent(strOrderBy) +
                           '&cols='     + encodeURIComponent(strCols);
                
                // save the old scrolltop (so that we can scroll back to it)
                element.oldScrollTop = element.scrollContainerElement.scrollTop;
                
                //// clear out scroll container element
                //element.scrollContainerElement.innerHTML = '';
                
                //// hide fixed header container
                //element.fixedHeaderContainerElement.style.display = 'none';
                
                // get the data
                GS.dataFetch(strLink, true);
                
                callbackFunction = function (event) {
                    //// show fixed header container
                    //element.fixedHeaderContainerElement.style.display = '';
                    
                    //GS.addLoader('envelope-select', 'Loading...');
                    
                    // send data to data handler function
                    //console.log('test');
                    element.handleData(event.detail.response, event.detail.error);
                    
                    // remove loader
                    GS.removeLoader(element);
                    
                    // remove this listener
                    document.removeEventListener('dataready_' + encodeURIComponent(strLink), callbackFunction);
                };
                
                GS.addLoader(element, 'Loading...');
                document.addEventListener('dataready_' + encodeURIComponent(strLink), callbackFunction);
            },
            
            
            handleData: function (data, error) {
                var element = this, strHeaderHTML, strFixedHeaderHTML, theadElement, tbodyElement,
                    strBodyHTML, tableTemplateElement, arrCells, i, len,
                    bolHeaderTextFound = false, strCurrentHeadingText;
                
                if (!error) {
                    // remove old error class
                    this.classList.remove('error');
                    
                    // save data
                    this.lastSuccessData = data;
                    
                    // create HTMl for header
                    tableTemplateElement = document.createElement('template');
                    tableTemplateElement.innerHTML = this.tableTemplate;
                    
                    theadElement = xtag.query(tableTemplateElement.content, 'thead')[0];
                    tbodyElement = xtag.query(tableTemplateElement.content, 'tbody')[0];
                    
                    //console.log(tableTemplateElement, this.tableTemplate, theadElement, tbodyElement);
                    
                    if (!theadElement) {
                        arrCells = tbodyElement.getElementsByTagName('tr')[0].children;
                        
                        for (i = 0, len = arrCells.length, strHeaderHTML = '', strFixedHeaderHTML = ''; i < len; i += 1) {
                            strCurrentHeadingText = encodeHTML(this.queryStringTemplate(arrCells[i].getAttribute('heading') || ''));
                            
                            if (strCurrentHeadingText) {
                                bolHeaderTextFound = true;
                            }
                            
                            strHeaderHTML += '<th gs-dynamic>' + strCurrentHeadingText + '</th>';
                            strFixedHeaderHTML += '<div class="fixed-header-cell" gs-dynamic>' + strCurrentHeadingText + '</div>';
                        }
                        
                        if (bolHeaderTextFound) {
                            strHeaderHTML = '<thead gs-dynamic><tr gs-dynamic>' + strHeaderHTML + '</tr></thead>';
                            
                        } else {
                            strHeaderHTML = '';
                            strFixedHeaderHTML = '';
                        }
                    } else {
                        strHeaderHTML = theadElement.outerHTML;
                        arrCells = theadElement.getElementsByTagName('tr')[0].children;
                        
                        for (i = 0, len = arrCells.length, strFixedHeaderHTML = ''; i < len; i += 1) {
                            strFixedHeaderHTML += '<div class="fixed-header-cell" gs-dynamic>' + encodeHTML(arrCells[i].textContent || '') + '</div>';
                        }
                    }
                    
                    this.fixedHeaderContainerElement.innerHTML = strFixedHeaderHTML;
                    
                    // create HTMl for body using the templated data
                    strBodyHTML = '<tbody gs-dynamic>' + this.dataTemplateRecords(data) + '</tbody>';
                    
                    // set scroll container html
                    this.scrollContainerElement.innerHTML = '<table gs-dynamic>' +
                                                                strHeaderHTML +
                                                                strBodyHTML +
                                                            '</table>';
                    
                    this.theadElement = xtag.query(this.scrollContainerElement, 'thead')[0];
                    this.tbodyElement = xtag.query(this.scrollContainerElement, 'tbody')[0];
                    
                    // refresh fixed header widths and reflow status
                    this.refreshReflow();
                    this.refreshFixedHeader();
                    
                    // set scrolltop to the old scrolltop
                    element.scrollContainerElement.scrollTop = element.oldScrollTop;
                    
                    // this is triggered after the scrolling is set so that if someone wants to scroll
                    // to a record after select they aren't going to encounter a problem
                    GS.triggerEvent(element, 'after_select');
                    
                } else {
                    // add error class
                    this.classList.add('error');
                    
                    // error dialog
                    GS.ajaxErrorDialog(data, function () {
                        element.getData();
                    });
                }
            },
            
            
            updateRecord: function (record, strColumn, newValue) {
                var element = this, data, strLink, strWhere = '', len, i, strUpdateAction, callbackFunction,
                    strSource = this.queryStringTemplate(decodeURIComponent(element.getAttribute('src') ||
                                                                            element.getAttribute('source') || ''));
                
                for (i = 0, len = element.arrWhereColumns.length; i < len; i += 1) {
                    if (strWhere.length > 0) {
                        strWhere = strWhere + '&';
                    }
                    strWhere = strWhere + element.arrWhereColumns[i] + '=' + record.getAttribute('data-' + element.arrWhereColumns[i]);
                }
                
                strLink = '/v1/' + (element.getAttribute('action-update') || 'env/action_update') + '?src=' + encodeURIComponent(strSource);
                
                strLink +=  '&where=' +  encodeURIComponent(strWhere) +
                            '&column=' + strColumn +
                            '&value=' +  encodeURIComponent(newValue);
                
                GS.addLoader(element, 'Updating Record...');
                
                // run ajax
                GS.dataFetch(strLink, true);
                
                callbackFunction = function (event) {
                    var jsnData, i, len, idIndex, tbodyElement, recordIndex, focusElement = document.activeElement,
                        focusElementTag, focusElementRecord, focusElementCell, focusElementRecordIndex, focusElementCellIndex,
                        elementWalkResult;
                    
                    GS.removeLoader(element);
                    
                    focusElementCell = getCellFromTarget(focusElement);
                    
                    if (focusElementCell) {
                        focusElementTag = focusElement.nodeName;
                        focusElementRecord = GS.findParentTag(focusElementCell, 'tr'); // getParentRecord(focusElementCell);
                        
                        focusElementRecordIndex = focusElementRecord.rowIndex;
                        focusElementCellIndex = focusElementCell.cellIndex;
                    }
                    
                    // if no error: refresh just the updated record
                    if (!event.detail.error) {
                        GS.triggerEvent(element, 'after_update');
                        
                        // refresh record in lastSuccessData
                        idIndex = element.lastSuccessData.arr_column.indexOf('id');
                        
                        for (i = 0, len = element.lastSuccessData.dat.length; i < len; i += 1) {
                            if (String(element.lastSuccessData.dat[i][idIndex]) === String(record.getAttribute('data-id'))) {
                                recordIndex = i;
                                element.lastSuccessData.dat[i] = JSON.parse(JSON.stringify(event.detail.response));
                                
                                break;
                            }
                        }
                        
                        tbodyElement = document.createElement('tbody');
                        tbodyElement.innerHTML = element.dataTemplateRecords(element.lastSuccessData, recordIndex, 1); // jsnData // dataTemplate
                        record.parentNode.replaceChild(xtag.queryChildren(tbodyElement, 'tr')[0], record);
                        
                        // refocus
                        if (focusElementCell) {
                            elementWalkResult = xtag.query(element.scrollContainerElement, 'tr')[focusElementRecordIndex];
                            
                            if (elementWalkResult) {
                                elementWalkResult = xtag.queryChildren(elementWalkResult, 'th, td')[focusElementCellIndex];
                                
                                if (elementWalkResult) {
                                    elementWalkResult = xtag.query(elementWalkResult, '*')[1];
                                    
                                    if (elementWalkResult) {
                                        elementWalkResult.focus();
                                    }
                                }
                            }
                        }
                        
                        element.refreshFixedHeader();
                        
                    // else: errorDialog
                    } else {
                        // create addin to error response
                        event.detail.response.error_addin = '<b gs-dynamic>Your Unsaved Value:</b> "' + newValue + '"';
                        
                        GS.ajaxErrorDialog(event.detail.response, function () {
                            element.updateRecord(record, strColumn, newValue);
                        }, function () {
                            // revert
                            idIndex = element.lastSuccessData.arr_column.indexOf('id');
                            
                            for (i = 0, len = element.lastSuccessData.dat.length; i < len; i += 1) {
                                if (String(element.lastSuccessData.dat[i][idIndex]) === String(record.getAttribute('data-id'))) {
                                    recordIndex = i;
                                    break;
                                }
                            }
                            
                            tbodyElement = document.createElement('tbody');
                            tbodyElement.innerHTML = element.dataTemplateRecords(element.lastSuccessData, recordIndex, 1);
                            record.parentNode.replaceChild(xtag.queryChildren(tbodyElement, 'tr')[0], record);
                        });
                    }
                    
                    document.removeEventListener('dataready_' + encodeURIComponent(strLink), callbackFunction);
                };
                
                // when the ajax is finished
                document.addEventListener('dataready_' + encodeURIComponent(strLink), callbackFunction);
            },
            
            deleteRecords: function (arrID, arrRecord) {
                var element = this, strIDs = arrID.join(','), strDeleteAction, callbackFunction, strLink,
                    strSource = element.queryStringTemplate(decodeURIComponent(element.getAttribute('src') ||
                                                                               element.getAttribute('source') || ''));
                
                strLink = '/v1/' + (element.getAttribute('action-delete') || 'env/action_delete') +
                                            '?src=' + encodeURIComponent(strSource) + '&id=' + strIDs;
                
                GS.addLoader(element, 'Deleting Record...');
                
                GS.dataFetch(strLink, true);
                
                callbackFunction = function (event) {
                    var i, len, idColIndex, response = event.detail.response, error = event.detail.error, deleteIndex;
                    
                    GS.removeLoader(element);
                    
                    if (!error) {
                        GS.triggerEvent(element, 'after_delete');
                        
                        for (i = 0, len = arrRecord.length; i < len; i += 1) {
                            arrRecord[i].parentNode.removeChild(arrRecord[i]);
                        }
                        
                        idColIndex = element.lastSuccessData.arr_column.indexOf('id');
                        
                        if (element.hasAttribute('limit') || element.lastSuccessData.dat.length === arrID.length) {
                            element.refresh();
                            
                        } else {
                            
                            // remove the record data from our stored data and
                            //      stop looping when we have deleted all the ones we are supposed to
                            for (i = 0, len = element.lastSuccessData.dat.length; i < len; i += 1) {
                                deleteIndex = arrID.indexOf(String(element.lastSuccessData.dat[i][idColIndex]));
                                
                                // (arrID should only have strings so we cast the current id to string)
                                if (deleteIndex > -1) {
                                    element.lastSuccessData.dat.splice(i, 1);
                                    arrID.splice(deleteIndex, 1);
                                    len -= 1;
                                    i -= 1;
                                }
                                
                                if (arrID.length === 0) {
                                    break;
                                }
                            }
                            
                            element.handleData(element.lastSuccessData);
                        }
                        
                    } else {
                        GS.ajaxErrorDialog(response, function () {
                            element.deleteRecords(arrID, arrRecord);
                        });
                    }
                    
                    document.removeEventListener('dataready_' + encodeURIComponent(strLink), callbackFunction);
                };
                
                document.addEventListener('dataready_' + encodeURIComponent(strLink), callbackFunction);
            },
            
            insertRecord: function (strInsertString) {
                var element = this, strInsertAction, callbackFunction, strLink,
                    strSource = element.queryStringTemplate(decodeURIComponent(element.getAttribute('src') || element.getAttribute('source') || ''));
                
                // if there is a column attribute on this element: append child column (or column) and the value to the insert string
                if (element.getAttribute('column')) {
                    strInsertString += (strInsertString ? '&' : '') + (element.getAttribute('child-column') || element.getAttribute('column')) + '=' + (element.value);
                }
                
                strLink = '/v1/' + (element.getAttribute('action-insert') || 'env/action_insert') + '?src=' + encodeURIComponent(strSource) +
                                                                                                '&data=' + encodeURIComponent(strInsertString);
                
                GS.addLoader(element, 'Inserting Record...');
                
                GS.dataFetch(strLink, true);
                
                callbackFunction = function (event) {
                    var response = event.detail.response, error = event.detail.error;
                    
                    GS.removeLoader(element);
                    
                    if (!error) {
                        GS.triggerEvent(element, 'after_insert');
                        element.getData(true);
                        
                    } else {
                        GS.ajaxErrorDialog(response, function () {
                            var errorCallbackFunction;
                            
                            // If the user wants to try again then restore the values
                            errorCallbackFunction = function () {
                                var arrKey = GS.qryGetKeys(strInsertString);
                                function setValues() {
                                    for (var i = 0, len = arrKey.length; i < len; i += 1) {
                                        var elem = document.querySelector('#insert-dialog-content-container [column="' + arrKey[i] + '"]');
                                        elem.value = GS.qryGetVal(strInsertString, arrKey[i]);
                                    }
                                }
                                // Get all dynamic data for the insert
                                for (var i = 0, len = arrKey.length; i < len; i += 1) {
                                    var elem = document.querySelector('#insert-dialog-content-container [column="' + arrKey[i] + '"]');
                                    if (elem.getData) {
                                        // Callback sets all the values for the inputs
                                        elem.getData(true, true, setValues);
                                    }
                                }
                                element.removeEventListener('insert_dialog_open', errorCallbackFunction);
                            };
                            
                            element.addEventListener('insert_dialog_open', errorCallbackFunction);
                            
                            GS.triggerEvent(element.hudTopElement.children[0], 'click');
                        });
                    }
                    
                    document.removeEventListener('dataready_' + encodeURIComponent(strLink), callbackFunction);
                };
                
                document.addEventListener('dataready_' + encodeURIComponent(strLink), callbackFunction);
            },
            
            
            // ##################################################################
            // ########################### UI REFRESH ###########################
            // ##################################################################
            
            refreshReflow: function () {
                var intEnvelopeWidth = this.scrollContainerElement.clientWidth,
                    intWindowWidth = window.innerWidth,
                    intReflowAt = parseInt(this.getAttribute('reflow-at'), 10);
                
                if (this.reflowBreakPoint === undefined) {
                    this.reflowBreakPoint = 0;
                }
                
                //console.log('check for reflow', window.innerWidth, this.reflowBreakPoint,
                // this.scrollContainerElement.clientWidth < this.scrollContainerElement.scrollWidth);
                
                if (intWindowWidth > this.reflowBreakPoint) {
                    if (intEnvelopeWidth < this.scrollContainerElement.scrollWidth || 
                        (!isNaN(intReflowAt) && intEnvelopeWidth < intReflowAt)) {
                        if (!this.classList.contains('reflow')) {
                            this.selectedCells = [];
                        }
                        
                        this.reflowBreakPoint = intWindowWidth;
                        this.classList.add('reflow');
                        
                    } else {
                        if (this.classList.contains('reflow')) {
                            this.selectedCells = [];
                        }
                        
                        this.reflowBreakPoint = 0;
                        this.classList.remove('reflow');
                    }
                }
            },
            
            refreshFixedHeader: function () {
                var elementFixedHeaderCells = xtag.queryChildren(this.fixedHeaderContainerElement, '.fixed-header-cell'),
                    theadCellElements, i, len, intLeft;
                
                if (this.theadElement && GS.getStyle(this.theadElement, 'display') !== 'none') {
                    this.fixedHeaderContainerElement.removeAttribute('hidden');
                    theadCellElements = xtag.query(this.theadElement, 'th, td');
                    
                    for (i = 0, len = theadCellElements.length, intLeft = 0; i < len; i += 1) {
                        elementFixedHeaderCells[i].style.height = (theadCellElements[i].offsetHeight + 1) + 'px';
                        elementFixedHeaderCells[i].style.width = theadCellElements[i].offsetWidth + 'px';
                        elementFixedHeaderCells[i].style.left = (intLeft - this.scrollContainerElement.scrollLeft) + 'px';
                        
                        intLeft += theadCellElements[i].offsetWidth;
                    }
                } else {
                    this.fixedHeaderContainerElement.setAttribute('hidden', '');
                }
            },
            
            refreshHud: function () {
                var element = this, elementHudTopContainer, elementHudBottomContainer, divElement = document.createElement('div'),
                    hudInsertButton, hudRefreshButton, hudDeleteButton, hudOrderbyButton, hudLimitButton, intOffset, intLimit,
                    jsnOrderByCopy, i, len, customHudTemplate, customHudElements;
                
                elementHudTopContainer    = this.hudTopElement;
                elementHudBottomContainer = this.hudBottomElement;
                                
                elementHudTopContainer.innerHTML = '';
                elementHudBottomContainer.innerHTML = '';
                
                // insert hud button
                if (element.insertTemplate) {
                    divElement.innerHTML = '<gs-button inline icononly icon="plus" no-focus gs-dynamic>Insert</gs-button>';
                    
                    hudInsertButton = divElement.childNodes[0];
                    
                    elementHudTopContainer.appendChild(hudInsertButton);
                }
                
                // refresh hud button
                if (!element.hasAttribute('no-hudrefresh')) {
                    divElement.innerHTML = '<gs-button inline icononly icon="refresh" no-focus gs-dynamic>Refresh</gs-button>';
                    
                    hudRefreshButton = divElement.childNodes[0];
                    
                    elementHudTopContainer.appendChild(hudRefreshButton);
                }
                
                // delete hud button
                if (!element.hasAttribute('no-huddelete')) {
                    divElement.innerHTML = '<gs-button inline icononly icon="times" no-focus gs-dynamic>Delete</gs-button>';
                    
                    hudDeleteButton = divElement.childNodes[0];
                    
                    elementHudTopContainer.appendChild(hudDeleteButton);
                }
                
                // custom hud buttons (trim so that just whitespace doesn't count)
                if (element.hudTemplate && element.hudTemplate.trim()) {
                    customHudTemplate = document.createElement('template');
                    customHudTemplate.innerHTML = element.hudTemplate;
                    
                    customHudElements = customHudTemplate.content.childNodes;
                    
                    for (i = 0, len = customHudElements.length; i < len; i += 1) {
                        //customHudElements[i].setAttribute('inline', '');
                        elementHudTopContainer.appendChild(customHudElements[0]);
                    }
                    //elementHudTopContainer.innerHTML += element.hudTemplate; <-- this causes events to be lost in the hud-top container
                }
                
                // order by hud button
                if (!element.hasAttribute('no-hudorderby')) {
                    divElement.innerHTML = '<gs-button inline icononly icon="sort-amount-asc" no-focus gs-dynamic>Order By</gs-button>';
                    
                    hudOrderbyButton = divElement.childNodes[0];
                    
                    elementHudBottomContainer.appendChild(hudOrderbyButton);
                }
                
                // limit hud button
                if (!element.hasAttribute('no-hudlimit')) {
                    divElement.innerHTML = '<span flex></span><gs-button inline no-focus>Limit</gs-button>';
                    
                    hudLimitButton = divElement.childNodes[1];
                    
                    elementHudBottomContainer.appendChild(divElement.childNodes[0]);
                    elementHudBottomContainer.appendChild(divElement.childNodes[0]);
                }
                
                if (elementHudTopContainer.innerHTML === '') {
                    elementHudTopContainer.style.display = 'none';
                } else {
                    elementHudTopContainer.style.display = '';
                }
                
                if (elementHudBottomContainer.innerHTML === '') {
                    elementHudBottomContainer.style.display = 'none';
                } else {
                    elementHudBottomContainer.style.display = '';
                }
                
                
                // bind hud buttons
                if (hudInsertButton) {
                    hudInsertButton.addEventListener('click', function (event) {
                        GS.dialog({
                            'header': 'Insert',
                            'content': '<div id="insert-dialog-content-container" gs-dynamic>' + element.insertTemplate + '</div>',
                            'buttons': ['Cancel', 'Ok'],
                            'after_open': function () {
                                //document.getElementById('insert-dialog-content-container').innerHTML = element.insertTemplate;
                                GS.triggerEvent(element, 'insert_dialog_open');
                            },
                            'after_close': function (event, strAnswer) {
                                var insertContainer = xtag.query(this, '#insert-dialog-content-container')[0], controls, i, len, strInsertString, currentValue;
                                
                                if (strAnswer === 'Ok') {
                                    controls = xtag.query(insertContainer, '[column]');
                                    
                                    for (i = 0, len = controls.length, strInsertString = ''; i < len; i += 1) {
                                        currentValue = controls.checked !== undefined ? controls.checked : controls[i].value;
                                        
                                        if (currentValue === undefined || currentValue === null) {
                                            currentValue = '';
                                        }
                                        
                                        currentValue = encodeURIComponent(currentValue);
                                        
                                        if (currentValue !== undefined && currentValue !== null && currentValue !== '') {
                                            strInsertString += (strInsertString === '' ? '' : '&') +
                                                                controls[i].getAttribute('column') + '=' + currentValue;
                                        }
                                    }
                                    
                                    element.insertRecord(strInsertString);
                                }
                            }
                        });
                    });
                }
                
                if (hudRefreshButton) {
                    element.hudRefreshButton = hudRefreshButton;
                    hudRefreshButton.addEventListener('click', function (event) {
                        element.getData(true);
                    });
                }
                
                if (hudDeleteButton) {
                    element.hudDeleteButton = hudDeleteButton;
                    //console.log('binding click on', hudDeleteButton);
                    hudDeleteButton.addEventListener('click', function (event) {
                        var i, len, arrRecord = element.selectedRecords, arrID = [];
                        
                        // loop through the selected cells and create an array of ids
                        for (i = 0, len = arrRecord.length; i < len; i += 1) {
                            arrID.push(String(arrRecord[i].dataset.id));
                        }
                        
                        if (arrID.length > 0) {
                            GS.dialog({
                                'header': 'Are you sure...',
                                'content': '<br gs-dynamic /><center gs-dynamic>Are you sure you want to delete ' + (arrID.length > 1 ? 'these records' : 'this record') + '?</center><br />',
                                'buttons': ['Cancel', 'Ok'],
                                'height': 'auto',
                                'after_close': function (event, strAnswer) {
                                    if (strAnswer === 'Ok') {
                                        element.deleteRecords(arrID, arrRecord);
                                    }
                                }
                            });
                        } else {
                            GS.dialog({
                                'header': 'Nothing Selected.',
                                'content': '<br gs-dynamic /><center gs-dynamic>Nothing is selected. Please select something to delete.</center><br />',
                                'height': 'auto'
                            });
                        }
                    });
                }
                
                if (hudOrderbyButton) {
                    element.hudOrderbyButton = hudOrderbyButton;
                    hudOrderbyButton.addEventListener('click', function (event) {
                        jsnOrderByCopy = JSON.parse(JSON.stringify(element.user_order_bys));
                        
                        // TESTING LINE!!! COMMENT OUT WHEN NOT IN USE!!!
                        //jsnOrderByCopy = {'columns': ['billable', 'taxable', 'id', 'user_name'], 'directions': ['asc', 'desc', 'asc', 'asc']};
                        // TESTING LINE!!! COMMENT OUT WHEN NOT IN USE!!!
                        
                        GS.dialog({
                            'header': '<center gs-dynamic>Sorted Columns</center>' +
                                      '<gs-button id="order-by-dialog-add-column" gs-dynamic>Add A Column To Sort</gs-button>', //inline iconleft icon="plus"
                            'content':  '<div id="order-by-dialog-ghost-container" gs-dynamic></div>'+
                                        '<div id="order-by-dialog-used-columns" gs-dynamic></div>', //+
                                        //'<br gs-dynamic />' +
                                        //'<center gs-dynamic></center>' +
                                        //'<br gs-dynamic />',
                            'buttons': ['Cancel', 'Ok'],
                            'mode': 'touch',
                            'after_open': function () {
                                document.getElementById('order-by-dialog-add-column').addEventListener('click', function (event) {
                                    var dialog = GS.dialog({
                                            'header': 'Unsorted Columns',
                                            'content':  '<div id="order-by-dialog-unused-columns" gs-dynamic></div>',
                                            'buttons': ['Cancel'],
                                            'after_open': function () {
                                                var unusedColumnsContainer = document.getElementById('order-by-dialog-unused-columns'),
                                                    unusedColumnTapHandler, columnElements, i, len, strHTML;
                                                
                                                for (i = 0, len = element.lastSuccessData.arr_column.length, strHTML = ''; i < len; i += 1) {
                                                    if (jsnOrderByCopy.columns.indexOf(element.lastSuccessData.arr_column[i]) === -1) {
                                                        strHTML +=  '<div class="order_by_column" dialogclose data-column="' + element.lastSuccessData.arr_column[i] + '" gs-dynamic>' +
                                                                        '<div class="column_name" gs-dynamic>' + GS.strToTitle(element.lastSuccessData.arr_column[i]) + '</div>' +
                                                                    '</div>';
                                                    }
                                                }
                                                
                                                unusedColumnsContainer.innerHTML = strHTML;
                                                
                                                
                                                unusedColumnTapHandler = function (event) {
                                                    if (event.target.classList.contains('column_name')) {
                                                        jsnOrderByCopy.columns.push(event.target.parentNode.getAttribute('data-column'));
                                                    } else {
                                                        jsnOrderByCopy.columns.push(event.target.getAttribute('data-column'));
                                                    }
                                                    jsnOrderByCopy.directions.push('asc');
                                                    
                                                    // refresh the column list
                                                    refreshOrderBys();
                                                };
                                                
                                                columnElements = unusedColumnsContainer.getElementsByClassName('order_by_column');
                                                
                                                for (i = 0, len = columnElements.length; i < len; i += 1) {
                                                    columnElements[i].addEventListener('click', unusedColumnTapHandler);
                                                }
                                            }
                                        }),
                                        dialogButtons = dialog.getElementsByTagName('gs-button');
                                });
                                
                                var refreshOrderBys = function () {
                                    var usedColumnsElement = document.getElementById('order-by-dialog-used-columns'),
                                        ghostContainerElement = document.getElementById('order-by-dialog-ghost-container'),
                                        strHTML, i, len, sortButtons, sortMousedownHandler, deleteButtons,
                                        deleteTapHandler, directionButtons, directionTapHandler;
                                    
                                    
                                    for (i = 0, len = jsnOrderByCopy.columns.length, strHTML = ''; i < len; i += 1) {
                                        strHTML +=  '<div class="order_by_column" flex-horizontal data-column="' + jsnOrderByCopy.columns[i] + '" data-direction="' + jsnOrderByCopy.directions[i] + '" gs-dynamic>' +
                                                        '<gs-button inline icononly icon="bars" class="sort" gs-dynamic></gs-button>' +
                                                        '<div class="column_name" flex gs-dynamic>' + GS.strToTitle(jsnOrderByCopy.columns[i]) + '</div>' +
                                                        '<gs-button inline icononly icon="times" class="delete" gs-dynamic></gs-button>' +
                                                        '<gs-button inline icononly icon="sort-amount-' + jsnOrderByCopy.directions[i] + '" class="direction" gs-dynamic></gs-button>' +
                                                    '</div>';
                                    }
                                    
                                    usedColumnsElement.innerHTML = strHTML;
                                    
                                    // bind sort buttons
                                    sortMousedownHandler = function () {
                                        var columns = usedColumnsElement.getElementsByClassName('order_by_column'), offsetsCache = [], i, len,
                                            currentElement = this.parentNode, currentlyMarkedElement, markerElement, bolLast = false, intToIndex,
                                            currentElementClone, intCloneoffset, intFromIndex, sortMousemoveHandler, sortMouseupHandler, 
                                            strColumn = currentElement.getAttribute('data-column'),
                                            strDirection = currentElement.getAttribute('data-direction');
                                        
                                        markerElement = document.createElement('div');
                                        markerElement.classList.add('drop_marker');
                                        markerElement.setAttribute('gs-dynamic', '');
                                        
                                        currentElementClone = currentElement.cloneNode(true);
                                        ghostContainerElement.appendChild(currentElementClone);
                                        intCloneoffset = GS.getElementOffset(ghostContainerElement).top + (currentElementClone.offsetHeight / 2);
                                        
                                        
                                        for (i = 0, len = columns.length; i < len; i += 1) {
                                            offsetsCache.push({
                                                'element': columns[i],
                                                'top': GS.getElementOffset(columns[i]).top,
                                                'height': columns[i].offsetHeight//, 'iscurrentelement': columns[i] === currentElement
                                            });
                                            
                                            if (columns[i] === currentElement) {
                                                intFromIndex = i;
                                            }
                                        }
                                        
                                        sortMousemoveHandler = function (event) {
                                            var i, len, matchedElement, bolNewLast, intTop;
                                            
                                            event.preventDefault();
                                            event.stopPropagation();
                                            
                                            if (event.which === 0 && !evt.touchDevice) {
                                                sortMouseupHandler();
                                                
                                            } else {
                                                intTop = GS.mousePosition(event).top + usedColumnsElement.parentNode.scrollTop;
                                                
                                                currentElementClone.style.top = (intTop - intCloneoffset) + 'px';
                                                
                                                //console.log('mousemove', GS.mousePosition(event).top, usedColumnsElement.parentNode.scrollTop);
                                                
                                                if (offsetsCache[0].top > intTop) {
                                                    matchedElement = offsetsCache[0].element;
                                                    bolNewLast = false;
                                                    
                                                } else {
                                                    for (i = 0, len = offsetsCache.length; i < len; i += 1) {
                                                        
                                                        if (offsetsCache[i + 1]) {
                                                            if (offsetsCache[i].top <= intTop &&
                                                                offsetsCache[i].top + ((offsetsCache[i + 1].top - offsetsCache[i].top) / 2) > intTop) {
                                                                
                                                                matchedElement = offsetsCache[i].element;
                                                                bolNewLast = false;
                                                                intToIndex = i;
                                                                break;
                                                                
                                                            } else if (offsetsCache[i].top <= intTop &&
                                                                        offsetsCache[i].top + ((offsetsCache[i + 1].top - offsetsCache[i].top) / 2) <= intTop &&
                                                                        offsetsCache[i + 1].top > intTop) {
                                                                
                                                                matchedElement = offsetsCache[i + 1].element;
                                                                bolNewLast = false;
                                                                intToIndex = i + 1;
                                                                break;
                                                            }
                                                        } else {
                                                            if (offsetsCache[i].top + (offsetsCache[i].height / 2) >= intTop) {
                                                                matchedElement = offsetsCache[i].element;
                                                                bolNewLast = false;
                                                                intToIndex = i;
                                                                break;
                                                                
                                                            } else if (offsetsCache[i].top + (offsetsCache[i].height / 2) <= intTop) {
                                                                matchedElement = offsetsCache[i].element;
                                                                bolNewLast = true;
                                                                intToIndex = i;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                                
                                                if (matchedElement !== currentlyMarkedElement || bolNewLast !== bolLast) {
                                                    if (bolNewLast === true) {
                                                        if (markerElement) {
                                                            markerElement.parentNode.removeChild(markerElement);
                                                        }
                                                        matchedElement.parentNode.appendChild(markerElement);
                                                        
                                                    } else {
                                                        matchedElement.parentNode.insertBefore(markerElement, matchedElement);
                                                    }
                                                    
                                                    currentlyMarkedElement = matchedElement;
                                                    bolLast = bolNewLast;
                                                    
                                                    //console.log(currentlyMarkedElement, bolLast);
                                                }
                                                
                                                //console.log('mousemove', intTop);
                                            }
                                        };
                                        
                                        document.body.addEventListener(evt.mousemove, sortMousemoveHandler);
                                        
                                        sortMouseupHandler = function (event) {
                                            intToIndex = (intToIndex > intFromIndex ? intToIndex - 1: intToIndex);
                                            
                                            // if we have valid to and from indexes:
                                            if (intFromIndex !== intToIndex && intToIndex !== undefined) {
                                                
                                                if (intFromIndex !== undefined && intFromIndex !== '') {
                                                    jsnOrderByCopy.columns.splice(intFromIndex, 1);
                                                    jsnOrderByCopy.directions.splice(intFromIndex, 1);
                                                }
                                                
                                                jsnOrderByCopy.columns.splice(intToIndex, 0, strColumn);
                                                jsnOrderByCopy.directions.splice(intToIndex, 0, strDirection);
                                                
                                                // refresh the column list
                                                refreshOrderBys();
                                            } else {
                                                markerElement.parentNode.removeChild(markerElement);
                                            }
                                            
                                            //console.log(intFromIndex, intToIndex);
                                            ghostContainerElement.innerHTML = '';
                                            document.body.removeEventListener(evt.mousemove, sortMousemoveHandler);
                                            document.body.removeEventListener(evt.mouseup, sortMouseupHandler);
                                        };
                                        
                                        document.body.addEventListener(evt.mouseup, sortMouseupHandler);
                                        
                                        //console.log('sortMousedownHandler');
                                    };
                                    sortButtons = usedColumnsElement.getElementsByClassName('sort');
                                    
                                    for (i = 0, len = sortButtons.length; i < len; i += 1) {
                                        sortButtons[i].addEventListener(evt.mousedown, sortMousedownHandler);
                                    }
                                    //console.log(usedColumnsElement.getElementsByClassName('sort'));
                                    
                                    // bind delete buttons
                                    deleteTapHandler = function () {
                                        var indexToDelete = jsnOrderByCopy.columns.indexOf(this.parentNode.getAttribute('data-column'));
                                        
                                        jsnOrderByCopy.columns.splice(indexToDelete, 1);
                                        jsnOrderByCopy.directions.splice(indexToDelete, 1);
                                        
                                        refreshOrderBys();
                                        //console.log('deleteTapHandler');
                                    };
                                    deleteButtons = usedColumnsElement.getElementsByClassName('delete');
                                    
                                    for (i = 0, len = deleteButtons.length; i < len; i += 1) {
                                        deleteButtons[i].addEventListener('click', deleteTapHandler);
                                    }
                                    //console.log(usedColumnsElement.getElementsByClassName('delete'));
                                    
                                    
                                    // bind direction buttons
                                    directionTapHandler = function () {
                                        var indexToFlip = jsnOrderByCopy.columns.indexOf(this.parentNode.getAttribute('data-column'));
                                        
                                        if (jsnOrderByCopy.directions[indexToFlip] === 'asc') {
                                            jsnOrderByCopy.directions[indexToFlip] = 'desc';
                                        } else {
                                            jsnOrderByCopy.directions[indexToFlip] = 'asc';
                                        }
                                        
                                        refreshOrderBys();
                                        //console.log('directionTapHandler');
                                    };
                                    directionButtons = usedColumnsElement.getElementsByClassName('direction');
                                    
                                    for (i = 0, len = directionButtons.length; i < len; i += 1) {
                                        directionButtons[i].addEventListener('click', directionTapHandler);
                                    }
                                    //console.log(usedColumnsElement.getElementsByClassName('direction'));
                                }
                                
                                refreshOrderBys();
                            },
                            'after_close': function (event, strAnswer) {
                                
                                if (strAnswer === 'Ok') {
                                    element.user_order_bys = JSON.parse(JSON.stringify(jsnOrderByCopy));
                                    element.getData(true);
                                }
                            }
                        });
                    });
                }
                
                if (hudLimitButton) {
                    element.hudLimitButton = hudLimitButton;
                    hudLimitButton.addEventListener('click', function (event) {
                        var intLimit, intOffset, bolShowAll, fromValue, toValue;
                        
                        if (element.getAttribute('limit') && element.getAttribute('offset')) {
                            intOffset = parseInt(element.getAttribute('offset'), 10);
                            intLimit = parseInt(element.getAttribute('limit'), 10);
                            
                            fromValue = intOffset;
                            toValue = intOffset + intLimit;
                            bolShowAll = false;
                            
                        } else if (element.getAttribute('limit')) {
                            fromValue = '0';
                            toValue = element.getAttribute('limit');
                            bolShowAll = false;
                            
                        } else if (element.old_offset && element.old_limit) {
                            intOffset = parseInt(element.old_offset, 10);
                            intLimit = parseInt(element.old_limit, 10);
                            
                            fromValue = intOffset;
                            toValue = intOffset + intLimit;
                            bolShowAll = true;
                            
                        } else if (element.old_limit) {
                            fromValue = '0';
                            toValue = element.old_limit;
                            bolShowAll = true;
                            
                        } else {
                            fromValue = '0';
                            toValue = element.lastSuccessData.row_count;
                            bolShowAll = true;
                        }
                        
                        GS.dialog({
                            'header': 'Limit',
                            'content':  '<div style="padding: 1em;" gs-dynamic>' +
                                            '<gs-optionbox id="limit-dialog-choice" value="' + (bolShowAll === true ? 'all' : 'range') + '" gs-dynamic>' +
                                                '<gs-option value="range" gs-dynamic>' +
                                                    'Show Range:' +
                                                    '<div flex-horizontal gs-dynamic>' +
                                                        '<b gs-dynamic>    From: </b>' +
                                                        '<gs-text id="limit-dialog-from" value="' + fromValue + '" flex mini' + (bolShowAll ? ' disabled' : '') + ' gs-dynamic></gs-text>' +
                                                    '</div>' +
                                                    '<div flex-horizontal gs-dynamic>' +
                                                        '<b gs-dynamic>    To:   </b>' +
                                                        '<gs-text id="limit-dialog-to" value="' + toValue + '" flex mini' + (bolShowAll ? ' disabled' : '') + ' gs-dynamic></gs-text>' +
                                                    '</div>' +
                                                '</gs-option>' +
                                                '<gs-option value="all" gs-dynamic>Show All</gs-option>' +
                                            '</gs-optionbox>' +
                                        '</div>',
                            'height': 'auto',
                            'buttons': ['Cancel', 'Ok'],
                            'after_open': function () {
                                var choiceElement, showAllElement, fromElement, toElement, intLimit, intOffset, bolShowAll, fromValue, toValue;
                                
                                choiceElement = document.getElementById('limit-dialog-choice');
                                fromElement = document.getElementById('limit-dialog-from');
                                toElement = document.getElementById('limit-dialog-to');
                                
                                choiceElement.addEventListener('change', function (event) {
                                    if (this.value === 'all') {
                                        fromElement.setAttribute('disabled', '');
                                        toElement.setAttribute('disabled', '');
                                    } else {
                                        fromElement.removeAttribute('disabled');
                                        toElement.removeAttribute('disabled');
                                    }
                                });
                            },
                            'after_close': function (event, strAnswer) {
                                var dialog = this, choiceElement, showAllElement, fromElement, toElement, intLimit, intOffset;
                                
                                if (strAnswer === 'Ok') {
                                    choiceElement = xtag.query(dialog, '#limit-dialog-choice')[0];
                                    showAllElement = xtag.query(dialog, '#limit-dialog-show-all')[0];
                                    fromElement = xtag.query(dialog, '#limit-dialog-from')[0];
                                    toElement = xtag.query(dialog, '#limit-dialog-to')[0];
                                    
                                    //if (showAllElement.value === 'true') {
                                    if (choiceElement.value === 'all') {
                                        if (element.getAttribute('limit')) {
                                            element.old_limit = element.getAttribute('limit');
                                            element.removeAttribute('limit');
                                        }
                                        if (element.getAttribute('offset')) {
                                            element.old_offset = element.getAttribute('offset');
                                            element.removeAttribute('offset');
                                        }
                                        
                                    } else {
                                        if (fromElement.value) {
                                            element.setAttribute('offset', fromElement.value);
                                        }
                                        if (toElement.value) {
                                            element.setAttribute('limit', parseInt(toElement.value, 10) - parseInt(fromElement.value, 10));
                                        }
                                    }
                                    
                                    element.getData();
                                }
                            }
                        });
                    });
                }
            },
            
            
            // #################################################################
            // ########################### UTILITIES ###########################
            // #################################################################
            
            handleClipboardData: function (event, strCopyString) {
                var clipboardData = event.clipboardData || window.clipboardData, strMime;
                
                if (!clipboardData) {
                    return;
                }
                if (!clipboardData.setData) {
                    return;
                }
                
                if (window.clipboardData && window.clipboardData.getData) { // IE
                    strMime = 'Text';
                } else if (event.clipboardData && event.clipboardData.getData) {
                    strMime = 'text/plain';
                }
                
                if (strCopyString) {
                    return clipboardData.setData(strMime, strCopyString) !== false;
                } else {
                    return clipboardData.getData(strMime);
                }
            },
            
            queryStringTemplate: queryStringTemplateFunction,
            
            dataTemplateRecords: function (data, intStartRecordNumber, intNumberOfRecords) {
                var tableTemplateElement, tbodyElement, strID, arrTemplates, i, len, jsnTemplates, strRet;
                
                tableTemplateElement = document.createElement('template');
                tableTemplateElement.innerHTML = this.tableTemplate;
                
                tbodyElement = xtag.query(tableTemplateElement.content, 'tbody')[0];
                
                // temporarily remove templates
                // recursively go through templates whose parents do not have the source attribute
                i = 0;
                arrTemplates = xtag.query(tbodyElement, 'template');
                jsnTemplates = {};
                
                while (arrTemplates.length > 0 && i < 100) {
                    // if the current template has a source parent: remove temporarily
                    if (arrTemplates[0].parentNode.hasAttribute('src') || arrTemplates[0].parentNode.hasAttribute('source')) {
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
                
                strRet = doT.template(ml(function () {/*
                            {{##def.snippet:
                                {{ var row, row_number, i, len, col_i, col_len, qs = jo.qs, intAddToRowNumber = 0;
                                
                                if (!isNaN(jo.i)) {
                                    i = jo.i;
                                    len = jo.len || jo.i + 1;
                                    
                                } else {
                                    i = 0;
                                    len = jo.data.dat.length;
                                }
                                
                                for (; i < len; i += 1) {
                                    row = {};
                                    row_number = i + 1;
                                    row.row_number = row_number;
                                    
                                    for (col_i = 0, col_len = jo.data.arr_column.length; col_i < col_len; col_i += 1) {
                                        if (jo.data.dat[i][col_i] === undefined || jo.data.dat[i][col_i] === null) {
                                            row[jo.data.arr_column[col_i]] = '';
                                        } else {
                                            row[jo.data.arr_column[col_i]] = jo.data.dat[i][col_i];
                                        }
                                    } }}{{# def.record }}
                                {{ } }}
                            #}}
                            {{#def.snippet}}*/console.log;
                        }), null, {"record": decodeHTML(tbodyElement.innerHTML)})({
                            'data': data,
                            'qs': GS.qryToJSON(GS.getQueryString()),
                            'i': intStartRecordNumber,
                            'len': intStartRecordNumber + intNumberOfRecords
                        });
                
                for (strID in jsnTemplates) {
                    //                                                                  DO NOT DELETE, this allows single dollar signs to be inside dot notation
                    strRet = strRet.replace(new RegExp(strID, 'g'), jsnTemplates[strID].replace(/\$/g, '$$$$'));
                }
                
                return strRet;
            }
        }
    });
});