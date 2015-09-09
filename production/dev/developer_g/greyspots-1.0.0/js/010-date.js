window.addEventListener('design-register-element', function () {
    
    registerDesignSnippet('<gs-date>', '<gs-date>', 'gs-date column="${1:name}"></gs-date>');
    registerDesignSnippet('<gs-date> With Label', '<gs-date>', 'label for="${1:date-insert-start_date}">${2:Start Date}:</label>\n' +
                                                               '<gs-date id="${1:date-insert-start_date}" column="${3:start_date}"></gs-date>');
    
    designRegisterElement('gs-date', '/v1/dev/developer_g/greyspots-' + GS.version() + '/tools/documentation/doc-elem-date.html');
    
    window.designElementProperty_GSDATE = function(selectedElement) {
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
        
        addProp('Date Picker', true, '<gs-checkbox class="target" value="' + (!selectedElement.hasAttribute('no-picker')) + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'no-picker', (this.value === 'true'), false);
        });
        
        addProp('Format', true, '<gs-combo class="target" value="' + (selectedElement.getAttribute('format') || '') + '" mini>' + 
                        ml(function () {/*<template>
                                            <table>
                                                <tbody>
                                                    <tr value="">
                                                        <td hidden>Default</td>
                                                        <td><center>Default<br /> (01/01/2015)</center></td>
                                                    </tr>
                                                    <tr value="shortdate">
                                                        <td hidden>shortdate</td>
                                                        <td><center>shortdate<br /> (1/1/15)</center></td>
                                                    </tr>
                                                    <tr value="mediumdate">
                                                        <td hidden>mediumdate</td>
                                                        <td><center>mediumdate<br /> (Jan 1, 2015)</center></td>
                                                    </tr>
                                                    <tr value="longdate">
                                                        <td hidden>longdate</td>
                                                        <td><center>longdate<br /> (January 1, 2015)</center></td>
                                                    </tr>
                                                    <tr value="fulldate">
                                                        <td hidden>fulldate</td>
                                                        <td><center>fulldate<br /> (Thursday, January 1, 2015)</center></td>
                                                    </tr>
                                                    <tr value="isodate">
                                                        <td hidden>isodate</td>
                                                        <td><center>isodate<br /> (2015-01-01)</center></td>
                                                    </tr>
                                                    <tr value="isodatetime">
                                                        <td hidden>isodatetime</td>
                                                        <td><center>isodatetime<br /> (2015-01-01T00:00:00)</center></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </template>
                                    </gs-combo>
                                */}), function () {
            return setOrRemoveTextAttribute(selectedElement, 'format', this.value);
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
        
        //// SUSPEND-CREATED attribute
        //addProp('suspend-created', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('suspend-created') || '') + '" mini></gs-checkbox>', function () {
        //    return setOrRemoveBooleanAttribute(selectedElement, 'suspend-created', this.value === 'true', true);
        //});
        
        // SUSPEND-INSERTED attribute
        addProp('suspend-inserted', true, '<gs-checkbox class="target" value="' + (selectedElement.hasAttribute('suspend-inserted') || '') + '" mini></gs-checkbox>', function () {
            return setOrRemoveBooleanAttribute(selectedElement, 'suspend-inserted', this.value === 'true', true);
        });
    };
});

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    var singleLineTemplateElement = document.createElement('template'),
        singleLineTemplate;
    
    singleLineTemplateElement.innerHTML = '<input class="control" gs-dynamic type="text" />' +
                             '<gs-button class="date-picker-button" gs-dynamic inline icononly icon="calendar" no-focus></gs-button>';
    
    singleLineTemplate = singleLineTemplateElement.content;
    
    // re-target change event from control to element
    function changeFunction(event) {
        event.preventDefault();
        event.stopPropagation();
        
        GS.triggerEvent(event.target.parentNode, 'change');
        
        handleFormat(event.target.parentNode, event);
    }
    
    // re-target focus event from control to element
    function focusFunction(event) {
        GS.triggerEvent(event.target.parentNode, 'focus');
    }
    
    function buttonClickFunction(event) {
        openDatePicker(event.target.parentNode);
    }
    
    function pushReplacePopHandler(element) {
        element.value = GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs'));
    }
    
    function refresh(element) {
        var arrPassThroughAttributes, i, len;
        
        // set a variable for the control element for convenience and speed
        element.control = xtag.query(element, '.control')[0];
        
        // set a variable for the date picker button element for convenience and speed
        element.datePickerButton = xtag.query(element, '.date-picker-button')[0];
        
        //console.log(element.control, element.getAttribute('value'), element.getAttribute('column'));
        
        if (element.control) {
            element.control.removeEventListener('change', changeFunction);
            element.control.addEventListener('change', changeFunction);
            
            element.control.removeEventListener('focus', focusFunction);
            element.control.addEventListener('focus', focusFunction);
        }
        if (element.datePickerButton) {
            element.datePickerButton.addEventListener('click', buttonClickFunction);
        }
        
        // if there is a value already in the attributes of the element: set the control value
        if (element.control && element.hasAttribute('value')) {
            element.control.value = element.getAttribute('value');
            handleFormat(element, undefined, false);
        }
        
        if (element.control) {
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
                if (element.hasAttribute(arrPassThroughAttributes[i])) {
                    element.control.setAttribute(arrPassThroughAttributes[i], element.getAttribute(arrPassThroughAttributes[i]) || '');
                }
            }
        }
    }
    
    // sync control value and resize to text
    function syncView(element) {
        if (element.control) {
            element.setAttribute('value', element.control.value);
        }
    }
    
    function openDatePicker(element, dteDate) {
        var divElement = document.createElement('div'), jsnOffset = GS.getElementOffset(element.datePickerButton),
            datePickerContainer, datePicker, strHTML = '', intTop, bolSelectOrigin, i, len, dateClickHandler, arrDateButtons, dteCurrent,
            strInputValue = element.control.value;
        
        // if there is a day of the week in the value: remove it
        if (strInputValue.match(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/gim)) {
            strInputValue = strInputValue.replace(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/gim, '')
                                         .replace(/  /gim, ' ')
                                         .trim();
        }
        
        // 
        strInputValue = strInputValue.replace(/-/, '/')  // replace first dash with forward slash
                                     .replace(/-/, '/'); // replace second dash with forward slash
        
        dteCurrent = new Date(strInputValue);
        
        element.datePickerButton.setAttribute('selected', '');
        
        // if no date was sent
        if (!dteDate) {
            // try using the value from the input
            if (element.control.value) {
                dteDate = dteCurrent;
                bolSelectOrigin = true;
                
            // else just use now
            } else {
                dteDate = new Date();
            }
        }
        
        //if we are in the current month and year, Highlight the day we are on
        if (dteDate.getMonth() === dteCurrent.getMonth() && dteDate.getYear() === dteCurrent.getYear()) {
            bolSelectOrigin = true;
        }
        
        // set html using date
        strHTML = getContentForDatePicker(dteDate, bolSelectOrigin);
        
        divElement.innerHTML =  '<div class="gs-date-date-picker-container" gs-dynamic>' +
                                    '<div class="gs-date-date-picker" gs-dynamic>' + strHTML + '</div>' +
                                '</div>';
        
        datePickerContainer = divElement.children[0];
        element.datePickerContainer = datePickerContainer;
        
        datePicker = datePickerContainer.children[0];
        
        document.body.appendChild(datePickerContainer);
        
        // position datePickerContainer
        intTop = jsnOffset.top + element.offsetHeight;
        
        if (intTop + datePicker.offsetHeight > window.innerHeight) {
            intTop -= datePicker.offsetHeight;
            intTop -= element.offsetHeight;
            
            if (intTop < 0) {
                intTop = 0;
            }
        }
        
        datePicker.style.top = intTop + 'px';
        
        // if window width is wider than 450 pixels width AND the date picker will not fall off of the screen:
        if (window.innerWidth > 450 && jsnOffset.left > 450) {
            // datepicker width: 450px; right: calculated;
            datePicker.style.width = '450px';
            datePicker.style.right = window.innerWidth - (jsnOffset.left + element.datePickerButton.offsetWidth) + 'px';
            
        // else:
        } else {
            // datepicker width: 96%; right: 2%;
            datePicker.style.width = '96%';
            datePicker.style.right = '2%';
        }
        
        // next month, previous month, next year, previous year click events
        datePickerContainer.getElementsByClassName('prev-month')[0].addEventListener('click', function () {
            dteDate.setMonth((dteDate.getMonth() - 1 < 0 ? 11 : dteDate.getMonth() - 1));
            closeDatePicker(element);
            openDatePicker(element, dteDate);
        });
        datePickerContainer.getElementsByClassName('next-month')[0].addEventListener('click', function () {
            var i, oldMonth;
            
            oldMonth = dteDate.getMonth();
            dteDate.setMonth((oldMonth + 1 > 11 ? 0 : oldMonth + 1));
            
            // if a month is skipped (no need to worry about the loop back to january because december and january both seem to have 31 days)
            if (dteDate.getMonth() === oldMonth + 2) {
                // loop backwards until we reach the correct month
                i = 0;
                while (dteDate.getMonth() === oldMonth + 2 && i < 20) {
                    dteDate.setDate(dteDate.getDate() - 1);
                    i += 1;
                }
            }
            
            closeDatePicker(element);
            openDatePicker(element, dteDate);
        });
        datePickerContainer.getElementsByClassName('prev-year')[0].addEventListener('click', function () {
            dteDate.setFullYear(dteDate.getFullYear() - 1);
            closeDatePicker(element);
            openDatePicker(element, dteDate);
        });
        datePickerContainer.getElementsByClassName('next-year')[0].addEventListener('click', function () {
            dteDate.setFullYear(dteDate.getFullYear() + 1);
            closeDatePicker(element);
            openDatePicker(element, dteDate);
        });
        
        // background click event
        datePickerContainer.addEventListener('click', function (event) {
            if (event.target.classList.contains('gs-date-date-picker-container')) {
                closeDatePicker(element);
            }
        });
        
        // date click events
        dateClickHandler = function () {
            var dteNewDate = new Date(this.getAttribute('data-date'));
            
            closeDatePicker(element);
            
            element.control.value = (dteNewDate.getMonth() + 1) + '/' + dteNewDate.getDate() + '/' + dteNewDate.getFullYear();
            handleFormat(element);
            xtag.fireEvent(element, 'change', { bubbles: true, cancelable: true });
        };
        
        arrDateButtons = datePickerContainer.getElementsByClassName('day-marker');
        
        for (i = 0, len = arrDateButtons.length; i < len; i += 1) {
            arrDateButtons[i].addEventListener('click', dateClickHandler);
        }
    }
    
    function closeDatePicker(element) {
        element.datePickerButton.removeAttribute('selected');
        document.body.removeChild(element.datePickerContainer);
    }
    
    function getContentForDatePicker(originDate, bolSelectOrigin) {
        var strHTML = '', i, looperDate, lookaheadDate, intFirstDayOfWeek = 0, dteToday = new Date(),
            arrDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            arrShortDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            arrMonths = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
            ];
        
        looperDate = new Date(originDate);
        looperDate.setDate(1);
        
        strHTML =   '<div class="month-marker" flex-horizontal gs-dynamic>' +
                        '<gs-button class="prev-month" inline icononly icon="arrow-left" gs-dynamic>Prev</gs-button>' +
                        '<span flex gs-dynamic>' + arrMonths[originDate.getMonth()] + '</span>' +
                        '<gs-button class="next-month" inline icononly icon="arrow-right" gs-dynamic>Next</gs-button>' +
                    '</div>' +
                    '<div class="year-marker" flex-horizontal gs-dynamic>' +
                        '<gs-button class="prev-year" inline icononly icon="arrow-left" gs-dynamic>Prev</gs-button>' +
                        '<span flex gs-dynamic>' + originDate.getFullYear() + '</span>' +
                        '<gs-button class="next-year" inline icononly icon="arrow-right" gs-dynamic>Next</gs-button>' +
                    '</div>';
        
        if (!isNaN(looperDate.getTime())) {
            
            // reverse back to the previous intFirstDayOfWeek
            i = 0;
            while (looperDate.getDay() !== intFirstDayOfWeek && i < 20) {
                looperDate.setDate(looperDate.getDate() - 1);
                
                i += 1;
            }
            //console.log(looperDate);
            
            // add day of week markers
            strHTML += '<div class="date-picker-divider" gs-dynamic></div><div class="day-of-week-markers-container" gs-dynamic>';
            for (i = 0; i < 7; i += 1) {
                strHTML += '<div class="day-of-week-marker" gs-dynamic>' + arrShortDays[i] + '</div>';
            }
            strHTML += '</div>';
            
            // loop through till at least the end of the month (or further to find the day that is before the next intFirstDayOfWeek)
            i = 0;
            
            lookaheadDate = new Date(looperDate);
            lookaheadDate.setDate(lookaheadDate.getDate() + 1);
            
            while (!(looperDate.getDay()         === intFirstDayOfWeek &&
                    (looperDate.getMonth()       !== originDate.getMonth() && i > 0) &&
                     lookaheadDate.getFullYear() >=  originDate.getFullYear()) &&
                   i < 50) {
                
                strHTML +=  '<gs-button inline class="day-marker';
                
                if (looperDate.getMonth() !== originDate.getMonth()) {
                    strHTML += ' other-month';
                }
                if (looperDate.getFullYear() === dteToday.getFullYear() &&
                    looperDate.getMonth() === dteToday.getMonth() &&
                    looperDate.getDate() === dteToday.getDate()) {
                    strHTML += ' today';
                }
                strHTML += '"';
                
                if (looperDate.getTime() === originDate.getTime() && bolSelectOrigin) {
                    strHTML += ' selected ';
                }
                
                strHTML +=  'data-date="' + looperDate + '" gs-dynamic>';
                if (looperDate.getFullYear() === dteToday.getFullYear() &&
                    looperDate.getMonth() === dteToday.getMonth() &&
                    looperDate.getDate() === dteToday.getDate()) {
                    strHTML += 'T';
                } else {
                    strHTML += looperDate.getDate();
                }
                strHTML += '</gs-button>';
                
                //console.log(looperDate, lookaheadDate);
                
                lookaheadDate.setDate(lookaheadDate.getDate() + 1);
                looperDate.setDate(looperDate.getDate() + 1);
                i += 1;
            }
        }
        
        return strHTML;
    }
    
    function handleFormat(element, event, bolAlertOnError) {
        var strFormat, dteValue, strValueToFormat = element.value;
        
        if (element.hasAttribute('format')) {
            strFormat = element.getAttribute('format');
        }
        
        // if there is a day of the week in the value: remove it
        if (strValueToFormat.match(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/gim)) {
            strValueToFormat = strValueToFormat.replace(/monday|tuesday|wednesday|thursday|friday|saturday|sunday/gim, '')
                                               .replace(/  /gim, ' ')
                                               .trim();
        }
        
        // if there are only six numbers in the field assume that
        //      the first  two are the month
        //      the second two are the day   and
        //      the third  two are the year  and make a date out of that
        if (strValueToFormat.length === 6 && strValueToFormat.match(/[0-9]/g).join('') === element.value) {
            dteValue = new Date(strValueToFormat.substring(0, 2) + '/' +
                                strValueToFormat.substring(2, 4) + '/' +
                                strValueToFormat.substring(4, 6));
            
        } else {
            //console.log(strValueToFormat.replace(/-/, '/').replace(/-/, '/').replace(/-.*/, ''));
            dteValue = new Date(strValueToFormat.replace(/-/, '/').replace(/-/, '/').replace(/-.*/, ''));
        }
        
        if (isNaN(dteValue.getTime())) {
            if (bolAlertOnError !== undefined && bolAlertOnError !== false) {
                alert('Invalid Date: ' + element.value);
            }
            
            GS.setInputSelection(element.control, 0, element.value.length);
            
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            
        } else {
            if (element.control) {
                element.control.value = formatDate(dteValue, strFormat);
            } else {
                element.innerHTML = formatDate(dteValue, strFormat);
            }
        }
    }
    
    function formatDate(dteValue, strFormat) {
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
        var i = 0, j = 0, l = 0, c = '', token = '', x, y,
            formatNumber = function (n, s) {
                if (typeof s == 'undefined' || s == 2) {
                  return (n >= 0 && n < 10 ? '0' : '') + n;
                } else {
                    if (n >= 0 && n < 10) {
                       return '00' + n; 
                    }
                    if (n >= 10 && n <100) {
                       return '0' + n;
                    }
                    return n;
                }
            },
            locale = {
                monthsFull:   ['January','February','March','April','May','June', 'July','August','September','October','November','December'],
                monthsShort:  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                daysFull:     ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                daysShort:    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
                shortDateFormat: 'M/d/yyyy h:mm a',
                longDateFormat: 'EEEE, MMMM dd, yyyy h:mm:ss a'
            };
        
        //console.log(strFormat, !strFormat);
        if (!strFormat) {
            strFormat = 'MM/dd/yyyy';
        } else if (strFormat.toLowerCase() === 'shortdate') {
            strFormat = 'M/d/yy';
        } else if (strFormat.toLowerCase() === 'mediumdate') {
            strFormat = 'MMM d, yyyy';
        } else if (strFormat.toLowerCase() === 'longdate') {
            strFormat = 'MMMM d, yyyy';
        } else if (strFormat.toLowerCase() === 'fulldate') {
            strFormat = 'EEEE, MMMM d, yyyy';
        } else if (strFormat.toLowerCase() === 'shorttime') {
            strFormat = 'h:mm a';
        } else if (strFormat.toLowerCase() === 'mediumtime') {
            strFormat = 'h:mm:ss a';
        } else if (strFormat.toLowerCase() === 'isodate') {
            strFormat = 'yyyy-MM-dd';
        } else if (strFormat.toLowerCase() === 'isotime') {
            strFormat = 'HH:mm:ss';
        } else if (strFormat.toLowerCase() === 'isodatetime') {
            strFormat = 'yyyy-MM-dd\'T\'HH:mm:ss';
        }

        y = dteValue.getYear();
        if (y < 1000) {
            y = String(y + 1900);
        }

        var M = dteValue.getMonth() + 1,
            d = dteValue.getDate(),
            E = dteValue.getDay(),
            H = dteValue.getHours(),
            m = dteValue.getMinutes(),
            s = dteValue.getSeconds(),
            S = dteValue.getMilliseconds();

        dteValue = {
            y: y,
            yyyy: y,
            yy: String(y).substring(2, 4), // <---- this will break in the year 10000, please fix
            M: M,
            MM: formatNumber(M),
            MMM: locale.monthsShort[M-1],
            MMMM: locale.monthsFull[M-1],
            d: d,
            dd: formatNumber(d),
            EEE: locale.daysShort[E],
            EEEE: locale.daysFull[E],
            H: H,
            HH: formatNumber(H)
        };

        if (H === 0) {
            dteValue.h = 12;
        } else if (H > 12) {
            dteValue.h = H - 12;
        } else {
            dteValue.h = H;
        }

        dteValue.hh = formatNumber(dteValue.h);
        dteValue.k = H !== 0 ? H : 24;
        dteValue.kk = formatNumber(dteValue.k);

        if (H > 11) {
            dteValue.K = H - 12;
        } else {
            dteValue.K = H;
        }

        dteValue.KK = formatNumber(dteValue.K);

        if (H > 11) {
            dteValue.a = 'PM';
        } else {
            dteValue.a = 'AM';
        }

        dteValue.m = m;
        dteValue.mm = formatNumber(m);
        dteValue.s = s;
        dteValue.ss = formatNumber(s);
        dteValue.S = S;
        dteValue.SS = formatNumber(S);
        dteValue.SSS = formatNumber(S, 3);

        var result = '';

        i = 0;
        c = '';
        token = '';
        s = false;

        while (i < strFormat.length) {
            token = '';   
            c = strFormat.charAt(i);
            if (c == '\'') {
                i++;
                if (strFormat.charAt(i) == c) {
                    result = result + c;
                    i++;
                } else {
                    s = !s;
                }
            } else {
                while (strFormat.charAt(i) == c) {
                    token += strFormat.charAt(i++);
                }
                if (token.indexOf('MMMM') != -1 && token.length > 4) {
                    token = 'MMMM';
                }
                if (token.indexOf('EEEE') != -1 && token.length > 4) {
                    token = 'EEEE';
                }
                if (typeof dteValue[token] != 'undefined' && !s) {
                    result = result + dteValue[token];
                } else {
                    result = result + token;
                }
            }
        }
        
        return result;
    }
    
    // dont do anything that modifies the element here
    function elementCreated(element) {
        // if "created" hasn't been suspended: run created code
        if (!element.hasAttribute('suspend-created')) {
            // if the value was set before the "created" lifecycle code runs: set attribute
            //      (discovered when trying to set a value of a date control in the after_open of a dialog)
            //      ("delete" keyword added because of firefox)
            if (element.value && new Date(element.value).getTime()) {
                element.setAttribute('value', element.value);
                delete element.value;
                //element.value = undefined;
                //element.value = null;
            }
            
        }
    }
    
    //
    function elementInserted(element) {
        var today, strQSValue;
        
        // if "created" hasn't been suspended and "inserted" hasn't been suspended: run inserted code
        if (!element.hasAttribute('suspend-created') && !element.hasAttribute('suspend-inserted')) {
            // if this is the first time inserted has been run: continue
            if (!element.inserted) {
                element.inserted = true;
                
                if (element.hasAttribute('tabindex')) {
                    element.oldTabIndex = element.getAttribute('tabindex');
                    element.removeAttribute('tabindex');
                }
                
                if (element.hasAttribute('value') && element.getAttribute('value').trim().toLowerCase() === 'today') {
                    today = new Date();
                    element.setAttribute('value', GS.leftPad(today.getFullYear(), '0', 4) + '/' + GS.leftPad(today.getMonth() + 1, '0', 2) + '/' + GS.leftPad(today.getDate(), '0', 2));
                }
                
                // handle "qs" attribute
                if (element.getAttribute('qs')) {
                    strQSValue = GS.qryGetVal(GS.getQueryString(), element.getAttribute('qs'));
                    
                    if (strQSValue !== '' || !element.getAttribute('value')) {
                        element.setAttribute('value', strQSValue);
                    }
                    
                    window.addEventListener('pushstate',    function () { pushReplacePopHandler(element); });
                    window.addEventListener('replacestate', function () { pushReplacePopHandler(element); });
                    window.addEventListener('popstate',     function () { pushReplacePopHandler(element); });
                }
                
                //if (element.hasAttribute('disabled')) {
                //    element.innerHTML = element.getAttribute('value') || element.getAttribute('placeholder') || '';
                //} else {
                element.innerHTML = '';
                element.appendChild(singleLineTemplate.cloneNode(true));
                if (element.oldTabIndex) {
                    xtag.query(element, '.control')[0].setAttribute('tabindex', element.oldTabIndex);
                }
                //}
                
                //if (element.innerHTML === '') {
                //    element.appendChild(singleLineTemplate.cloneNode(true));
                //    if (element.oldTabIndex) {
                //        xtag.query(element, '.control')[0].setAttribute('tabindex', element.oldTabIndex);
                //    }
                //}
                element.refresh();
            }
        }
    }
    
    xtag.register('gs-date', {
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
                    if (strAttrName === 'disabled' && newValue !== null) {
                        this.innerHTML = this.getAttribute('value') || this.getAttribute('placeholder');
                    } else if (strAttrName === 'disabled' && newValue === null) {
                        this.innerHTML = '';
                        this.appendChild(singleLineTemplate.cloneNode(true));
                        if (this.oldTabIndex) {
                            xtag.query(this, '.control')[0].setAttribute('tabindex', this.oldTabIndex);
                        }
                        refresh(this);
                    }
                }
            }
        },
        events: {
            // on keydown and keyup sync the value attribute and the control value
            keydown: function (event) {
                var element = this, currentDate, currentSelectionRange, currentSelectionText, currentSelectionNumber, currentSelectionFormatText,
                    currentValue, newValue, strDateFormat, formatDivider,
                    daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                
                if (!element.hasAttribute('suspend-created') && !element.hasAttribute('suspend-inserted')) {
                    if (this.getAttribute('disabled') !== null && event.keyCode !== 9) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        // If it was an arrow that was pressed
                        if (event.keyCode === GS.keyCode('left arrow') ||
                            event.keyCode === GS.keyCode('up arrow') ||
                            event.keyCode === GS.keyCode('right arrow') ||
                            event.keyCode === GS.keyCode('down arrow')) {
                            
                            currentSelectionRange = GS.getInputSelection(this.control);
                            
                            // Prevent the browser from moving the cursor
                            event.preventDefault();
                            
                            strDateFormat = this.getAttribute('format');
                            if (!strDateFormat) {
                                strDateFormat = 'MM/dd/yyyy';
                            } else if (strDateFormat.toLowerCase() === 'shortdate') {
                                strDateFormat = 'M/d/yy';
                            } else if (strDateFormat.toLowerCase() === 'mediumdate') {
                                strDateFormat = 'MMM d, yyyy';
                            } else if (strDateFormat.toLowerCase() === 'longdate') {
                                strDateFormat = 'MMMM d, yyyy';
                            } else if (strDateFormat.toLowerCase() === 'fulldate') {
                                strDateFormat = 'EEEE, MMMM d, yyyy';
                            } else if (strDateFormat.toLowerCase() === 'shorttime') {
                                strDateFormat = 'h:mm a';
                            } else if (strDateFormat.toLowerCase() === 'mediumtime') {
                                strDateFormat = 'h:mm:ss a';
                            } else if (strDateFormat.toLowerCase() === 'isodate') {
                                strDateFormat = 'yyyy-MM-dd';
                            } else if (strDateFormat.toLowerCase() === 'isotime') {
                                strDateFormat = 'HH:mm:ss';
                            } else if (strDateFormat.toLowerCase() === 'isodatetime') {
                                strDateFormat = 'yyyy-MM-dd\'T\'HH:mm:ss';
                            }
                            
                            formatDivider = strDateFormat.match(/[^mdyehmsa]/gi).join('');
                            
                            currentValue = element.control.value;
                            currentDate = new Date(currentValue.replace('\'T\'', ' ').replace(/-/g, '/'));
                            
                            if (strDateFormat.indexOf('M') === -1) {
                                currentDate = new Date('2015/6/15 ' + currentValue);
                            }
                            
                            if (strDateFormat.substring(0, 4) === 'EEEE' ||
                                strDateFormat.substring(0, 4) === 'MMMM') {
                                strDateFormat = strDateFormat.replace('EEEE', new Array(daysOfTheWeek[currentDate.getDay()].length + 1).join('E'));
                                strDateFormat = strDateFormat.replace('MMMM', new Array(daysOfTheWeek[currentDate.getDay()].length + 1).join('M'));
                            }
                            
                            // Encompass the field in which the cursor is inside
                            while (currentSelectionRange.start >= 0 && formatDivider.indexOf(currentValue[currentSelectionRange.start - 1]) < 0) {
                                currentSelectionRange.start -= 1;
                            }
                            
                            currentSelectionRange.end = currentSelectionRange.start;
                            while (currentSelectionRange.end < currentValue.length &&
                                    formatDivider.indexOf(currentValue[currentSelectionRange.end]) < 0) {
                                currentSelectionRange.end += 1;
                            }
                            
                            GS.setInputSelection(element.control, currentSelectionRange.start, currentSelectionRange.end);
                            
                            currentSelectionText = currentValue.substring(currentSelectionRange.start, currentSelectionRange.end);
                            currentSelectionFormatText = strDateFormat.substring(currentSelectionRange.start, currentSelectionRange.end);
                            
                            // If it is up or down
                            if (event.keyCode === arrowCodes.up ||
                                event.keyCode === arrowCodes.down) {
                                var increment = event.keyCode === arrowCodes.up ? 1 : -1;
                                
                                if (currentSelectionFormatText[0] === 'M') {
                                    currentDate.setMonth(currentDate.getMonth() +       increment);
                                    if ((currentSelectionRange.end - currentSelectionRange.start) > 2) {
                                        currentSelectionRange.end = currentSelectionRange.start + currentSelectionText.indexOf(' ');
                                    } else {
                                        currentSelectionRange.end = currentSelectionRange.start + currentDate.getMonth().toString().length;
                                    }
                                    
                                } else if (currentSelectionFormatText[0] === 'd') {
                                    currentDate.setDate(currentDate.getDate() + increment);
                                    currentSelectionRange.end = currentSelectionRange.start + currentDate.getDate().toString().length;
                                    
                                } else if (currentSelectionFormatText[0] === 'y') {
                                    currentDate.setFullYear(currentDate.getFullYear() + increment);
                                    currentSelectionRange.end = currentSelectionRange.start + currentDate.getFullYear().toString().length;
                                    
                                } else if (currentSelectionFormatText[0] === 'E') {
                                    currentDate.setDate(currentDate.getDate() + increment);
                                    currentSelectionRange.start = 0;
                                    currentSelectionRange.end = daysOfTheWeek[currentDate.getDay()].length;
                                    
                                } else if (currentSelectionFormatText[0] === 'h' || currentSelectionFormatText[0] === 'H') {
                                    currentDate.setHours(currentDate.getHours() + increment);
                                    currentSelectionRange.end = currentSelectionRange.start + currentDate.getHours().toString().length;
                                    
                                } else if (currentSelectionFormatText[0] === 'm') {
                                    currentDate.setMinutes(currentDate.getMinutes() + increment);
                                    currentSelectionRange.end = currentSelectionRange.start + currentDate.getMinutes().toString().length;
                                    
                                } else if (currentSelectionFormatText[0] === 's') {
                                    currentDate.setSeconds(currentDate.getSeconds() + increment);
                                    currentSelectionRange.end = currentSelectionRange.start + currentDate.getSeconds().toString().length;
                                    
                                } else if (currentSelectionFormatText[0] === 'a') {
                                    currentDate.setHours(currentDate.getHours() + 12);
                                }
                                
                                newValue = formatDate(this, currentDate, strDateFormat);
                                this.control.value = newValue;
                                currentValue = newValue;
                            } else if (event.keyCode === arrowCodes.left ||
                                event.keyCode === arrowCodes.right) {
                                if (event.keyCode === arrowCodes.left) {
                                    currentSelectionRange.end = currentSelectionRange.start - 2;
                                    currentSelectionRange.start = currentSelectionRange.end;
                                } else if (event.keyCode === arrowCodes.right) {
                                    currentSelectionRange.end = currentSelectionRange.end + 2;
                                    currentSelectionRange.start = currentSelectionRange.end;
                                }
                            }
                            
                            if (strDateFormat[0] === 'E' ||
                                strDateFormat[0] === 'M') {
                                strDateFormat = strDateFormat.replace(/E+/g, new Array(daysOfTheWeek[currentDate.getDay()].length + 1).join('E'));
                                strDateFormat = strDateFormat.replace(/M+/g, new Array(daysOfTheWeek[currentDate.getDay()].length + 1).join('M'));
                            }
                            
                            // Copied from above
                            while (currentSelectionRange.start >= 0 && formatDivider.indexOf(currentValue[currentSelectionRange.start - 1]) < 0) {
                                currentSelectionRange.start -= 1;
                            }
                            currentSelectionRange.end = currentSelectionRange.start;
                            while (currentSelectionRange.end < currentValue.length &&
                                    formatDivider.indexOf(currentValue[currentSelectionRange.end]) < 0) {
                                currentSelectionRange.end += 1;
                            }
                            
                            GS.setInputSelection(element.control, currentSelectionRange.start, currentSelectionRange.end);
                        }
                        
                        syncView(element);
                    }
                }
            },
            keyup: function () {
                var element = this;
                if (!element.hasAttribute('suspend-created') && !element.hasAttribute('suspend-inserted')) {
                    syncView(element);
                }
            }
        },
        accessors: {
            value: {
                // get value straight from the input
                get: function () {
                    if (this.control) {
                        return this.control.value;
                    } else if (this.hasAttribute('disabled')) {
                        return this.innerHTML;
                    }
                    
                    return undefined;
                },
                
                // set the value of the input and set the value attribute
                set: function (newValue) {
                    if (this.control) {
                        if (typeof newValue === 'object') {
                            this.control.value = newValue.toLocaleDateString();
                        } else {
                            this.control.value = newValue;
                        }
                        
                    } else if (this.hasAttribute('disabled')) {
                        this.innerHTML = newValue;
                        
                    } else {
                        this.setAttribute('value', newValue);
                    }
                    
                    handleFormat(this);
                    syncView(this);
                }
            }
        },
        methods: {
            refresh: function () {
                var element = this, arrPassThroughAttributes, i, len;
                
                // set a variable for the control element for convenience and speed
                element.control = xtag.query(element, '.control')[0];
                
                // set a variable for the date picker button element for convenience and speed
                element.datePickerButton = xtag.query(element, '.date-picker-button')[0];
                
                //console.log(element.control, element.getAttribute('value'), element.getAttribute('column'));
                
                if (element.control) {
                    element.control.removeEventListener('change', changeFunction);
                    element.control.addEventListener('change', changeFunction);
                    
                    element.control.removeEventListener('focus', focusFunction);
                    element.control.addEventListener('focus', focusFunction);
                }
                if (element.datePickerButton) {
                    element.datePickerButton.addEventListener('click', buttonClickFunction);
                }
                
                // if there is a value already in the attributes of the element: set the control value
                if (element.control && element.hasAttribute('value')) {
                    element.control.value = element.getAttribute('value');
                    handleFormat(element, undefined, false);
                }
                
                if (element.control) {
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
                        if (element.hasAttribute(arrPassThroughAttributes[i])) {
                            element.control.setAttribute(arrPassThroughAttributes[i], element.getAttribute(arrPassThroughAttributes[i]) || '');
                        }
                    }
                }
            },
            
            focus: function () {
                this.control.focus();
            }
        }
    });
});