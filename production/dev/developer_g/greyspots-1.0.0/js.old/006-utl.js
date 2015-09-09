
window.addEventListener('design-register-element', function () {
    'use strict';
    
    registerDesignSnippet('GS.rightPad', 'GS.rightPad',
                                    'GS.rightPad(${1:stringToPad}, \'${2:stringToPadWith}\', ${0:lengthToPadTo});');
    
    registerDesignSnippet('GS.leftPad', 'GS.leftPad',
                                    'GS.leftPad(${1:stringToPad}, \'${2:stringToPadWith}\', ${0:lengthToPadTo});');
    
    registerDesignSnippet('GS.pxToEm', 'GS.pxToEm', 'GS.pxToEm(${1:elementToTestIn}, ${0:pxToConvert});');
    
    registerDesignSnippet('GS.emToPx', 'GS.emToPx', 'GS.emToPx(${1:elementToTestIn}, ${0:emToConvert});');
    
    registerDesignSnippet('GS.keyCode', 'GS.keyCode', 'GS.keyCode(\'${0:characterToGetTheKeyCodeOf}\');');
    
    registerDesignSnippet('GS.getStyle', 'GS.getStyle', 'GS.getStyle(${1:element}, \'${0:CSSProperty}\');');
    
    registerDesignSnippet('GS.listAdd', 'GS.listAdd', 'GS.listAdd(${1:arrayToAddTo}, \'${0:valueToAddIfUnique}\');');
    
    registerDesignSnippet('GS.triggerEvent', 'GS.triggerEvent', 'GS.triggerEvent(${1:target}, \'${2:eventName}\', ${0:jsnModifiers});');
    
    registerDesignSnippet('GS.strToTitle', 'GS.strToTitle', 'GS.strToTitle(${0:valueToConvert});');
    
    registerDesignSnippet('GS.mousePosition', 'GS.mousePosition', 'GS.mousePosition(${0:event});');
    
    registerDesignSnippet('GS.GUID', 'GS.GUID', 'GS.GUID();');
    
    registerDesignSnippet('GS.safeDecodeURIComponent', 'GS.safeDecodeURIComponent', 'GS.safeDecodeURIComponent(${0:valueToDecode});');
    
    registerDesignSnippet('GS.getTextHeight', 'GS.getTextHeight', 'GS.getTextHeight(${1:elementToTestIn}, ${0:bolNormalLineHeight});');
    
    registerDesignSnippet('GS.scrollParent', 'GS.scrollParent', 'GS.scrollParent(${0:elementToStartFrom});');
    
    registerDesignSnippet('GS.scrollIntoView', 'GS.scrollIntoView', 'GS.scrollIntoView(${0:elementToScrollIntoView});');
    
    registerDesignSnippet('GS.envGetCell', 'GS.envGetCell', 'GS.envGetCell(${1:envelopeData}, ${2:recordNumber}, \'${0:columnName}\');');
    
    registerDesignSnippet('GS.trim', 'GS.trim', 'GS.trim(${1:stringToBeTrimmed}, \'${0:stringToTrimOff}\');');
    
    registerDesignSnippet('GS.setCookie', 'GS.setCookie', 'GS.setCookie(\'${1:cookieName}\', ${2:newValue}, ${0:daysUntilExpire});');
    
    registerDesignSnippet('GS.getCookie', 'GS.getCookie', 'GS.getCookie(\'${1:cookieName}\');');
    
    registerDesignSnippet('GS.pushState', 'GS.pushState', 'GS.pushState(${1:stateObj}, ${2:title}, ${0:newURL});');
    
    registerDesignSnippet('GS.replaceState', 'GS.replaceState', 'GS.replaceState(${1:stateObj}, ${2:title}, ${0:newURL});');
    
    registerDesignSnippet('GS.searchToWhere', 'GS.searchToWhere', 'GS.searchToWhere(\'${1:columns}\', ${0:searchClause});');
    
    registerDesignSnippet('GS.pushQueryString', 'GS.pushQueryString', 'GS.pushQueryString(${0:newQueryString});');
    
    registerDesignSnippet('GS.iconList', 'GS.iconList', 'GS.iconList();');
    
    registerDesignSnippet('GS.lorem', 'GS.lorem', 'GS.lorem();');
});

// ###########################################################
// #################### PADDING FUNCTIONS ####################
// ###########################################################

// pad a string with another string on the right side of the string
//      repeating until the pad_str until the str length is >= the padToLength

//  PARAM         "str": string to pad
//  PARAM   "padString": string to pad with
//  PARAM "padToLength": number of characters to pad for
GS.rightPad = function (str, padString, padToLength) {
    'use strict';
    str = String(str);
    
    while (str.length < padToLength) {// <a
        str += padString;
    }
   
    return str;
};


// pad a string with another string on the left side of the string
//      repeating until the padString until the str length is >= the padToLength

//  PARAM         "str": string to pad
//  PARAM   "padString": string to pad with
//  PARAM "padToLength": number of characters to pad for
GS.leftPad = function (str, padString, padToLength) {
    'use strict';
    str = String(str);
    
    while (str.length < padToLength) {
        str = padString + str;
    }
   
    return str;
};



// ################################################################
// ################ EM AND PX CONVERSION FUNCTIONS ################
// ################################################################

// convert pixels to ems
GS.pxToEm = function (elementScope, fromPX) {
    'use strict';
	var intPX = parseFloat(fromPX),
	    heightTestElement = document.createElement('div'),
	    intElementHeight;
    
    elementScope = elementScope || document.body;
    
    heightTestElement.style.fontSize = '1em';
    heightTestElement.style.margin = '0';
    heightTestElement.style.padding = '0';
    heightTestElement.style.lineHeight = '1';
    heightTestElement.style.border = '0';
    
    heightTestElement.innerHTML = 'a';
    
    elementScope.appendChild(heightTestElement);
    intElementHeight = heightTestElement.offsetHeight;
    elementScope.removeChild(heightTestElement);
    
	return parseFloat((intPX / intElementHeight).toFixed(8), 10);
};

// convert ems to pixels
GS.emToPx = function (elementScope, fromEM) {
    'use strict';
	var intEM = parseFloat(fromEM),
	    heightTestElement = document.createElement('div'),
	    intElementHeight;
    
    elementScope = elementScope || document.body;
    
    heightTestElement.style.fontSize = '1em';
    heightTestElement.style.margin = '0';
    heightTestElement.style.padding = '0';
    heightTestElement.style.lineHeight = '1';
    heightTestElement.style.border = '0';
    
    heightTestElement.innerHTML = 'a';
    
    elementScope.appendChild(heightTestElement);
    intElementHeight = heightTestElement.offsetHeight;
    elementScope.removeChild(heightTestElement);
    
	return Math.round(intEM * intElementHeight); // not sure if we want to round here but the old function did
	                                             // so I will leave it here until there is a problem -michael
};



// ################################################################
// #################### MISC UTILITY FUNCTIONS ####################
// ################################################################

// keyCode string to number
GS.keyCode = function (inChar) {
    "use strict";
	/*
	Key 	Code
backspace 	8
tab 	9
enter 	13
shift 	16
ctrl 	17
alt 	18
pause/break 	19
caps lock 	20
escape 	27
(space) 	32
page up 	33
page down 	34
end 	35
home 	36
left arrow 	37
up arrow 	38
right arrow 	39
down arrow 	40
insert 	45
delete 	46
0 	48
1 	49
2 	50
3 	51
4 	52
5 	53
6 	54
7 	55
8 	56
9 	57
a 	65
b 	66
c 	67
d 	68

Key 	Code
e 	69
f 	70
g 	71
h 	72
i 	73
j 	74
k 	75
l 	76
m 	77
n 	78
o 	79
p 	80
q 	81
r 	82
s 	83
t 	84
u 	85
v 	86
w 	87
x 	88
y 	89
z 	90
left window key 	91
right window key 	92
select key 	93
numpad 0 	96
numpad 1 	97
numpad 2 	98
numpad 3 	99
numpad 4 	100
numpad 5 	101
numpad 6 	102
numpad 7 	103
*/
    inChar = inChar.toLowerCase();
	return '\b'          == inChar ? '8' :
	       'backspace'   == inChar ? '8' :
	       '\t'          == inChar ? '9' :
	       'tab'         == inChar ? '9' :
	       '\r'          == inChar ? '13' :
	       '\n'          == inChar ? '13' :
	       'enter'       == inChar ? '13' :
	       'return'      == inChar ? '13' :
	       'newline'     == inChar ? '13' :
	       'shift'       == inChar ? '16' :
	       'ctrl'        == inChar ? '17' :
	       'alt'         == inChar ? '18' :
	       'pause/break' == inChar ? '19' :
	       'caps lock'   == inChar ? '20' :
	       'escape'      == inChar ? '27' :
	       'space'       == inChar ? '32' :
	       ' '           == inChar ? '32' :
	       'page up'     == inChar ? '33' :
	       'page down'   == inChar ? '34' :
	       'end'         == inChar ? '35' :
	       'home'        == inChar ? '36' :
	       'left arrow'  == inChar ? '37' :
	       'up arrow'    == inChar ? '38' :
	       'right arrow' == inChar ? '39' :
	       'down arrow'  == inChar ? '40' :
	       'insert'      == inChar ? '45' :
	       'delete'      == inChar ? '46' :
	       '0'           == inChar ? '48' :
	       '1'           == inChar ? '49' :
	       '2'           == inChar ? '50' :
	       '3'           == inChar ? '51' :
	       '4'           == inChar ? '52' :
	       '5'           == inChar ? '53' :
	       '6'           == inChar ? '54' :
	       '7'           == inChar ? '55' :
	       '8'           == inChar ? '56' :
	       '9'           == inChar ? '57' :
	       'a'           == inChar ? '65' :
	       'b'           == inChar ? '66' :
	       'c'           == inChar ? '67' :
	       'd'           == inChar ? '68' :
	       'e'           == inChar ? '69' :
	       'f'           == inChar ? '70' :
	       'g'           == inChar ? '71' :
	       'h'           == inChar ? '72' :
	       'i'           == inChar ? '73' :
	       'j'           == inChar ? '74' :
	       'k'           == inChar ? '75' :
	       'l'           == inChar ? '76' :
	       'm'           == inChar ? '77' :
	       'n'           == inChar ? '78' :
	       'o'           == inChar ? '79' :
	       'p'           == inChar ? '80' :
	       'q'           == inChar ? '81' :
	       'r'           == inChar ? '82' :
	       's'           == inChar ? '83' :
	       't'           == inChar ? '84' :
	       'u'           == inChar ? '85' :
	       'v'           == inChar ? '86' :
	       'w'           == inChar ? '87' :
	       'x'           == inChar ? '88' :
	       'y'           == inChar ? '89' :
	       'z'           == inChar ? '90' :
	       'left window key'  == inChar ? '91' :
	       'right window key' == inChar ? '92' :
	       'select key'  == inChar ? '93' :
	       'numpad 0'    == inChar ? '96' :
	       'numpad 1'    == inChar ? '97' :
	       'numpad 2'    == inChar ? '98' :
	       'numpad 3'    == inChar ? '99' :
	       'numpad 4'    == inChar ? '100' :
	       'numpad 5'    == inChar ? '101' :
	       'numpad 6'    == inChar ? '102' :
	       'numpad 7'    == inChar ? '103' :
	       'numpad 8'    == inChar ? '104' :
	       'numpad 9'    == inChar ? '105' :
	       'multiply'    == inChar ? '106' :
	       'add'         == inChar ? '107' :
	       '+'           == inChar ? '107' :
	       'subtract'    == inChar ? '109' :
	       '-'           == inChar ? '109' :
	       'decimal point' == inChar ? '110' :
	       'divide'      == inChar ? '111' :
	       'f1'          == inChar ? '112' :
	       'f2'          == inChar ? '113' :
	       'f3'          == inChar ? '114' :
	       'f4'          == inChar ? '115' :
	       'f5'          == inChar ? '116' :
	       'f6'          == inChar ? '117' :
	       'f7'          == inChar ? '118' :
	       'f8'          == inChar ? '119' :
	       'f9'          == inChar ? '120' :
	       'f10'         == inChar ? '121' :
	       'f11'         == inChar ? '122' :
	       'f12'         == inChar ? '123' :
	       'num lock'    == inChar ? '144' :
	       'scroll lock' == inChar ? '145' :
	       'semi-colon'  == inChar ? '186' :
	       ';'           == inChar ? '186' :
	       'equal sign'  == inChar ? '187' :
	       '='           == inChar ? '187' :
	       'comma'       == inChar ? '188' :
	       ','           == inChar ? '188' :
	       'dash'        == inChar ? '189' :
	       '-'           == inChar ? '189' :
	       'period'      == inChar ? '190' :
	       '.'           == inChar ? '190' :
	       'forward slash' == inChar ? '191' :
	       '/'             == inChar ? '191' :
	       'grave accent'  == inChar ? '192' :
	       'open bracket'  == inChar ? '219' :
	       '['             == inChar ? '219' :
	       'back slash'    == inChar ? '220' :
	       '\\'            == inChar ? '220' :
	       'close bracket' == inChar ? '221' :
	       ']'             == inChar ? '221' :
	       'single quote'  == inChar ? '222' :
	       '\''            == inChar ? '222' :
	       '';
	/*
Key 	Code
numpad 8 	104
numpad 9 	105
multiply 	106
add 	107
subtract 	109
decimal point 	110
divide 	111
f1 	112
f2 	113
f3 	114
f4 	115
f5 	116
f6 	117
f7 	118
f8 	119
f9 	120
f10 	121
f11 	122
f12 	123
num lock 	144
scroll lock 	145
semi-colon 	186
equal sign 	187
comma 	188
dash 	189
period 	190
forward slash 	191
grave accent 	192
open bracket 	219
back slash 	220
close braket 	221
single quote 	222
*/
};

// get computed or current style (current style if it is availible)
GS.getStyle = function (element, style) {
	if (element.currentStyle !== undefined) {
        return element.currentStyle[style];
	}
    
    return document.defaultView.getComputedStyle(element, null)[style];
};

// push to array if the value is unique
GS.listAdd = function (arrArray, newValue) {
    'use strict';
    if (arrArray.indexOf(newValue) === -1) {
        arrArray.push(newValue);
    }
};

// trigger an event on a target
GS.triggerEvent = function (target, strEventName, jsnConfig) {
    'use strict';
    var event, key;
    
    //console.trace('trigger', target);
    
    if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(strEventName, true, true);
    } else {
        event = document.createEventObject();
        event.eventType = strEventName;
    }
    
    event.eventName = strEventName;
    
    if (jsnConfig) {
        for (key in jsnConfig) {
            event[key] = jsnConfig[key];
        }
    }
    
    if (document.createEvent) {
        target.dispatchEvent(event);
    } else {
        target.fireEvent("on" + event.eventType, event);
    }
};

// converts a string into a more user readable format
GS.strToTitle = function (strInput) {
    'use strict';
    var i, len, chrCurrent, chrLast = '', strRet = '';
    
    strInput = strInput || '';
    
    for (i = 0, len = strInput.length; i < len; i += 1) {
        chrCurrent = strInput.charAt(i);
        
        if (!(/[a-zA-Z]/).test(chrLast)) {
            strRet += chrCurrent.toUpperCase();
            
        } else if (chrCurrent === '_') {
            strRet += ' ';
            
        } else {
            strRet += chrCurrent;
        }
        
        chrLast = chrCurrent;
    }
    
    return strRet;
};

// normalize top, left, bottom and right on a mouse event
GS.mousePosition = function (event) {
    'use strict';
    var pageX = (evt.touchDevice ? event.touches[0].pageX: event.pageX),// get the left and top of the mouse
        pageY = (evt.touchDevice ? event.touches[0].pageY: event.pageY);//   (or the touch position if we are on a phone)
    
    return {
        'top':    pageY,
        'left':   pageX,
        'bottom': window.innerHeight - pageY,
        'right':  window.innerWidth - pageX,
        
        //'x':      pageY, // alias <== messed these up
        //'y':      pageX  // alias
        
        'x':      pageX, // alias
        'y':      pageY  // alias
    };
};

// original function found here: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
GS.GUID = function () {
    var strTime = new Date().getTime().toString();
    
    function randomString() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    
    return  randomString() + randomString() + '-' +
            randomString() + '-' +
            randomString() + '-' +
            randomString() + '-' +
            strTime.substring(strTime.length - 4) + '-' +
            randomString() + randomString() + randomString();
};

/*  ,---- no longer works
//  V
GS.getSelectedText = function () {
    if (window.getSelection) {
        return window.getSelection() + '';
    }
    
    // FireFox
    if (document.getSelection) {
        return document.getSelection() + '';
    }
    
    // IE 6/7
    if (document.selection) {
        return document.selection.createRange().text + '';
    }
    
    console.warn('GS.getSelectedText warning: no selection collection function found (could not find a way to get the selected text)');
    return '';
}*/

// decode uri component safe from "URI malformed" error
GS.safeDecodeURIComponent = function (string) {
    var strRet;
    
    try {
        strRet = decodeURIComponent(string);
        
    } catch (error) {
        if (error.toString().indexOf('URI malformed') > -1) {
            strRet = string;
        } else {
            throw error;
        }
    }
    
    return strRet;
};

//
GS.getTextHeight = function (scope, bolNormalLineHeight) {
    var divElement = document.createElement('div'), intHeight;
    
    scope = scope || document.body;
    
    divElement.style.visibility = 'invisible';
    divElement.style.fontSize   = '1em';
    divElement.style.margin     = '0';
    divElement.style.padding    = '0';
    if (bolNormalLineHeight) {
        divElement.style.lineHeight = 'normal';
    } else {
        divElement.style.lineHeight = '1';
    }
    divElement.style.border     = '0';
    divElement.textContent = 'a';
    
    scope.appendChild(divElement);
    
    intHeight = divElement.clientHeight;
    
    scope.removeChild(divElement);
    
    return intHeight;
};



GS.scrollParent = function (element) {
    var i = 0, currentElement = element, bolFoundScrollable = false, strOverflow;
    while (currentElement.nodeName !== 'HTML' && bolFoundScrollable === false && i < 75) {
        strOverflow = GS.getStyle(currentElement, 'overflow');
        
        if (strOverflow === 'scroll' || (strOverflow === 'auto' && currentElement.clientHeight < currentElement.scrollHeight)) {
            bolFoundScrollable = true;
        } else {
            currentElement = currentElement.parentNode;
            i += 1;
        }
    }
    return bolFoundScrollable ? currentElement : undefined;
};

//
GS.scrollIntoView = function (element) {
    var scrollingContainer = GS.scrollParent(element), arrSiblings, i, len, intScrollTop;
    
    if (scrollingContainer) {
        //console.log(scrollingContainer);
        
        arrSiblings = element.parentNode.children;
        
        for (i = 0, intScrollTop = 0, len = arrSiblings.length; i < len; i += 1) {
            if (arrSiblings[i] === element) {
                intScrollTop += arrSiblings[i].offsetHeight / 2;
                
                break;
            } else {
                intScrollTop += arrSiblings[i].offsetHeight;
            }
        }
        
        intScrollTop = intScrollTop - (scrollingContainer.offsetHeight / 2);
        
        //console.log(intScrollTop);
        
        scrollingContainer.scrollTop = intScrollTop;
    }
};

// return value from: envelope data, record number and column name
GS.envGetCell = function (data, record_number, column_name) {
    'use strict';
    var index;
    
    if (data.stat) {
        data = data.dat;
    }
    
    index = data.arr_column.indexOf(column_name);
    
    if (index === -1) {
        console.error(column_name, data);
        throw 'Error in GS.envGetCell: column not found';
    }
    
    return data.dat[record_number][index];
};

GS.trim = function(string, strStringToTrim) {
    "use strict";
    var safeRegexString = strStringToTrim.replace(/([.?*+^$[\]\\(){}|-])/g,'\\$1'),
        trimRegex = new RegExp('^' + safeRegexString + '+|' + safeRegexString + '+$', 'g');
    
    return string.replace(trimRegex, '');
};

// set a cookie in the browser
GS.setCookie = function (c_name, value, exdays) {
    'use strict';
    var hostname = location.hostname;
    var exdate = new Date(), c_value;
    hostname = hostname.substring(hostname.indexOf('.'));
    exdate.setDate(exdate.getDate() + exdays);
    
    c_value = encodeURIComponent(value) + ((exdays === null || exdays === undefined) ? '' : '; expires=' + exdate.toUTCString()) + '; domain=' + hostname + '; path=/';
    
    document.cookie = c_name + '=' + c_value;
};

// get a cookie from the browser
GS.getCookie = function (c_name) {
    'use strict';
    var c_value = document.cookie, c_end,
        c_start = c_value.indexOf(" " + c_name + "=");
    
    if (c_start === -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    
    if (c_start === -1) {
        c_value = null;
    } else {
        c_start = c_value.indexOf("=", c_start) + 1;
        c_end = c_value.indexOf(";", c_start);
        if (c_end === -1) {
            c_end = c_value.length;
        }
        c_value = decodeURIComponent(c_value.substring(c_start, c_end));
    }
    
    return c_value;
};

GS.pushState = function (stateObj, title, url) {
    history.pushState(stateObj, title, url);
    GS.triggerEvent(window, 'pushstate');
};

GS.replaceState = function (stateObj, title, url) {
    history.replaceState(stateObj, title, url);
    GS.triggerEvent(window, 'replacestate');
};

GS.searchToWhere = function (columns, searchClause) {
    //console.log(searchClause);
    var arrToken, arrNoQuotes = [], strNoQuotes = '', arrColumn, arrRequired = [], strRequired = '', arrWhere = [], strWhere = '', strRet = '', token, numTokens, col, numCols, i, len, strSearch;
    
    if (!searchClause) {
        return 'TRUE';
    }
    
    arrColumn = columns.split(',');
    
    // First get all quoted tokens, leave everything else
    arrToken = searchClause.match(/[\+|\-]?"[^"]*?"/g);
    
    if (arrToken) {
        for (token = 0, numTokens = arrToken.length; token < numTokens; token += 1) {
            arrToken[token] = GS.trim(arrToken[token], '+');
            for (col = 0, numCols = arrColumn.length; col < numCols; col += 1) {
                if (arrToken[token][0] === '-') {
                    arrToken[token] = GS.trim(arrToken[token], '-');
                    arrRequired[token] =
                        (arrRequired[token] ? arrRequired[token] + ' AND ' : '') +
                        'CASE WHEN ' + arrColumn[col] +
                        ' IS NOT NULL THEN ' + arrColumn[col] +
                        ' NOT ILIKE \'%' + GS.trim(arrToken[token], '"') +
                        '%\' ELSE TRUE END';
                    arrToken[token] = '-' + arrToken[token];
                } else {
                    arrRequired[token] = 
                        (arrRequired[token] ? arrRequired[token] + ' OR ' : '') +
                        (arrColumn[col] + ' ILIKE \'%' + GS.trim(arrToken[token], '"') + '%\'');
                }
            }
        }
        
        for (i = 0, len = arrRequired.length; i < len; i += 1) {
            strRequired = (strRequired ? strRequired + ' AND ' : '') + '(' + arrRequired[i] + ')';
        }
        //console.log('strRequired:', strRequired);
    }
    
    // Get non-quoted tokens and remove extra space
    /*
    //NOT CROSS BROWSER
    arrNoQuotes = strSearch.split(/([\+|\-]?"[^"]*?")/);
    strNoQuotes = arrNoQuotes.join(' ');
    arrNoQuotes = strNoQuotes.split(/[ ]+/);
    */
    strSearch = searchClause.trim();
    strSearch = strSearch.replace('-"', '"');
    strSearch = strSearch.replace('+"', '"');
    strSearch = strSearch.replace(/"[^"]*"/, '""');
    arrNoQuotes = strSearch.split('""');
    //console.log("arrNoQuotes: ", arrNoQuotes);
    strNoQuotes = arrNoQuotes.join(' ');
    //console.log("strNoQuotes: >" + strNoQuotes + "<");
    strNoQuotes = strNoQuotes.replace('  ', ' ');
    strNoQuotes = strNoQuotes.replace('  ', ' ');
    arrNoQuotes = strNoQuotes.split(' ');
    //console.log("arrNoQuotes: ", arrNoQuotes);
    /*
    //DIDN'T WORK
    strSearch = searchClause.trim();
    strSearch = strSearch.replace('-"', '"');
    strSearch = strSearch.replace('+"', '"');
    arrNoQuotes = strSearch.split('"');
    strSearch = '';
    if (searchClause.trim()[0] === '"') {
        for (i = 1, len = arrNoQuotes.length; i < len; i += 2) {
            strSearch = strSearch + (strSearch === '' ? '' : ' ') + arrNoQuotes[i].trim();
        }
    } else {
        for (i = 0, len = arrNoQuotes.length; i < len; i += 2) {
            strSearch = strSearch + (strSearch === '' ? '' : ' ') + arrNoQuotes[i].trim();
        }
    }
    //console.log(strSearch);
    strSearch = strSearch.replace('  ', ' ');
    strSearch = strSearch.replace('  ', ' ');
    arrNoQuotes = strSearch.split(' ');
    //console.log(arrNoQuotes);
    */
    // Put items into arrRequired or arrWhere
    arrRequired = [''];
    if (arrNoQuotes.length > 0) {
        //console.log('1');
        for (token = 0, numTokens = arrNoQuotes.length; token < numTokens; token += 1) {
            //console.log('2');
            for (col = 0, numCols = arrColumn.length; col < numCols; col += 1) {
                //console.log('3 arrNoQuotes[' + token + ']: ' + arrNoQuotes[token]);
                if (arrNoQuotes[token].length > 0) {
                    //console.log('4');
                    if (arrNoQuotes[token][0] === '-') {
                        arrRequired[token] = 
                            (arrRequired[token] ? arrRequired[token] + ' AND ' : '') +
                            ' CASE WHEN ' + arrColumn[col] +
                            ' IS NOT NULL THEN ' + arrColumn[col] +
                            ' NOT ILIKE $$%' + GS.trim(GS.trim(arrNoQuotes[token], '-'), ' ') +
                            '%$$ ELSE TRUE END ';
                    } else if (arrNoQuotes[token][0] === '+') {
                        arrRequired[token] = 
                            (arrRequired[token] ? arrRequired[token] + ' OR ' : '') +
                            arrColumn[col] + ' ILIKE $$%' +
                            GS.trim(GS.trim(arrNoQuotes[token], '+'), ' ') + '%$$ ';
                    } else {
                        arrWhere[token] = 
                            (arrWhere[token] ? arrWhere[token] + ' OR ' : '') +
                            arrColumn[col] + ' ILIKE $$%' + GS.trim(arrNoQuotes[token], ' ') + '%$$ ';
                    }
                }
            }
        }
    }
    
    if (arrRequired.length > 0) {
        for (i = 0, len = arrRequired.length; i < len; i += 1) {
            if (arrRequired[i]) {
                strRequired = (strRequired ? strRequired + ' AND ' : '') + '(' + arrRequired[i] + ')';
            }
        }
    }
    //console.log('strRequired: ', strRequired);
    
    if (arrWhere.length > 0) {
        for (i = 0, len = arrWhere.length; i < len; i += 1) {
            if (arrWhere[i]) {
                strWhere = (strWhere ? strWhere + ' AND ' : '') + '(' + arrWhere[i] + ')';
            }
        }
    }
    //console.log('strWhere: ', strWhere);
    
    strRet = 
        (
            strWhere && strRequired ? '(' + strWhere + ') AND (' + strRequired + ')' :
            strWhere ? strWhere :
            strRequired
        );
    
    //console.log('strRet: ' + strRet);
    
    return strRet;
};

GS.pushQueryString = function (QS) {
    var arrNewQS = QS.split('&'), i, len, newQS = GS.getQueryString();
    for (i = 0, len = arrNewQS.length; i < len; i += 1) {
        newQS = GS.qrySetVal(newQS, arrNewQS[i]);
    }
    GS.pushState({}, '', '?' + newQS);
};

GS.iconList = function () {
    return [{'name': 'glass', 'code': 'f000'}, {'name': 'music', 'code': 'f001'}, {'name': 'search', 'code': 'f002'}, {'name': 'envelope-o', 'code': 'f003'}, {'name': 'heart', 'code': 'f004'}, {'name': 'star', 'code': 'f005'}, {'name': 'star-o', 'code': 'f006'}, {'name': 'user', 'code': 'f007'}, {'name': 'film', 'code': 'f008'}, {'name': 'th-large', 'code': 'f009'}, {'name': 'th', 'code': 'f00a'}, {'name': 'th-list', 'code': 'f00b'}, {'name': 'check', 'code': 'f00c'}, {'name': 'times', 'code': 'f00d'}, {'name': 'search-plus', 'code': 'f00e'}, {'name': 'search-minus', 'code': 'f010'}, {'name': 'power-off', 'code': 'f011'}, {'name': 'signal', 'code': 'f012'}, {'name': 'cog', 'code': 'f013'}, {'name': 'trash-o', 'code': 'f014'}, {'name': 'home', 'code': 'f015'}, {'name': 'file-o', 'code': 'f016'}, {'name': 'clock-o', 'code': 'f017'}, {'name': 'road', 'code': 'f018'}, {'name': 'download', 'code': 'f019'}, {'name': 'arrow-circle-o-down', 'code': 'f01a'}, {'name': 'arrow-circle-o-up', 'code': 'f01b'}, {'name': 'inbox', 'code': 'f01c'}, {'name': 'play-circle-o', 'code': 'f01d'}, {'name': 'repeat', 'code': 'f01e'}, {'name': 'refresh', 'code': 'f021'}, {'name': 'list-alt', 'code': 'f022'}, {'name': 'lock', 'code': 'f023'}, {'name': 'flag', 'code': 'f024'}, {'name': 'headphones', 'code': 'f025'}, {'name': 'volume-off', 'code': 'f026'}, {'name': 'volume-down', 'code': 'f027'}, {'name': 'volume-up', 'code': 'f028'}, {'name': 'qrcode', 'code': 'f029'}, {'name': 'barcode', 'code': 'f02a'}, {'name': 'tag', 'code': 'f02b'}, {'name': 'tags', 'code': 'f02c'}, {'name': 'book', 'code': 'f02d'}, {'name': 'bookmark', 'code': 'f02e'}, {'name': 'print', 'code': 'f02f'}, {'name': 'camera', 'code': 'f030'}, {'name': 'font', 'code': 'f031'}, {'name': 'bold', 'code': 'f032'}, {'name': 'italic', 'code': 'f033'}, {'name': 'text-height', 'code': 'f034'}, {'name': 'text-width', 'code': 'f035'}, {'name': 'align-left', 'code': 'f036'}, {'name': 'align-center', 'code': 'f037'}, {'name': 'align-right', 'code': 'f038'}, {'name': 'align-justify', 'code': 'f039'}, {'name': 'list', 'code': 'f03a'}, {'name': 'outdent', 'code': 'f03b'}, {'name': 'indent', 'code': 'f03c'}, {'name': 'video-camera', 'code': 'f03d'}, {'name': 'picture-o', 'code': 'f03e'}, {'name': 'pencil', 'code': 'f040'}, {'name': 'map-marker', 'code': 'f041'}, {'name': 'adjust', 'code': 'f042'}, {'name': 'tint', 'code': 'f043'}, {'name': 'pencil-square-o', 'code': 'f044'}, {'name': 'share-square-o', 'code': 'f045'}, {'name': 'check-square-o', 'code': 'f046'}, {'name': 'arrows', 'code': 'f047'}, {'name': 'step-backward', 'code': 'f048'}, {'name': 'fast-backward', 'code': 'f049'}, {'name': 'backward', 'code': 'f04a'}, {'name': 'play', 'code': 'f04b'}, {'name': 'pause', 'code': 'f04c'}, {'name': 'stop', 'code': 'f04d'}, {'name': 'forward', 'code': 'f04e'}, {'name': 'fast-forward', 'code': 'f050'}, {'name': 'step-forward', 'code': 'f051'}, {'name': 'eject', 'code': 'f052'}, {'name': 'chevron-left', 'code': 'f053'}, {'name': 'chevron-right', 'code': 'f054'}, {'name': 'plus-circle', 'code': 'f055'}, {'name': 'minus-circle', 'code': 'f056'}, {'name': 'times-circle', 'code': 'f057'},
    {'name': 'check-circle', 'code': 'f058'}, {'name': 'question-circle', 'code': 'f059'}, {'name': 'info-circle', 'code': 'f05a'}, {'name': 'crosshairs', 'code': 'f05b'}, {'name': 'times-circle-o', 'code': 'f05c'}, {'name': 'check-circle-o', 'code': 'f05d'}, {'name': 'ban', 'code': 'f05e'}, {'name': 'arrow-left', 'code': 'f060'}, {'name': 'arrow-right', 'code': 'f061'}, {'name': 'arrow-up', 'code': 'f062'}, {'name': 'arrow-down', 'code': 'f063'}, {'name': 'share', 'code': 'f064'}, {'name': 'expand', 'code': 'f065'}, {'name': 'compress', 'code': 'f066'}, {'name': 'plus', 'code': 'f067'}, {'name': 'minus', 'code': 'f068'}, {'name': 'asterisk', 'code': 'f069'}, {'name': 'exclamation-circle', 'code': 'f06a'}, {'name': 'gift', 'code': 'f06b'}, {'name': 'leaf', 'code': 'f06c'}, {'name': 'fire', 'code': 'f06d'}, {'name': 'eye', 'code': 'f06e'}, {'name': 'eye-slash', 'code': 'f070'}, {'name': 'exclamation-triangle', 'code': 'f071'}, {'name': 'plane', 'code': 'f072'}, {'name': 'calendar', 'code': 'f073'}, {'name': 'random', 'code': 'f074'}, {'name': 'comment', 'code': 'f075'}, {'name': 'magnet', 'code': 'f076'}, {'name': 'chevron-up', 'code': 'f077'}, {'name': 'chevron-down', 'code': 'f078'}, {'name': 'retweet', 'code': 'f079'}, {'name': 'shopping-cart', 'code': 'f07a'}, {'name': 'folder', 'code': 'f07b'}, {'name': 'folder-open', 'code': 'f07c'}, {'name': 'arrows-v', 'code': 'f07d'}, {'name': 'arrows-h', 'code': 'f07e'}, {'name': 'bar-chart-o', 'code': 'f080'}, {'name': 'twitter-square', 'code': 'f081'}, {'name': 'facebook-square', 'code': 'f082'}, {'name': 'camera-retro', 'code': 'f083'}, {'name': 'key', 'code': 'f084'}, {'name': 'cogs', 'code': 'f085'}, {'name': 'comments', 'code': 'f086'}, {'name': 'thumbs-o-up', 'code': 'f087'}, {'name': 'thumbs-o-down', 'code': 'f088'}, {'name': 'star-half', 'code': 'f089'}, {'name': 'heart-o', 'code': 'f08a'}, {'name': 'sign-out', 'code': 'f08b'}, {'name': 'linkedin-square', 'code': 'f08c'}, {'name': 'thumb-tack', 'code': 'f08d'}, {'name': 'external-link', 'code': 'f08e'}, {'name': 'sign-in', 'code': 'f090'}, {'name': 'trophy', 'code': 'f091'}, {'name': 'github-square', 'code': 'f092'}, {'name': 'upload', 'code': 'f093'}, {'name': 'lemon-o', 'code': 'f094'}, {'name': 'phone', 'code': 'f095'}, {'name': 'square-o', 'code': 'f096'}, {'name': 'bookmark-o', 'code': 'f097'}, {'name': 'phone-square', 'code': 'f098'}, {'name': 'twitter', 'code': 'f099'}, {'name': 'facebook', 'code': 'f09a'}, {'name': 'github', 'code': 'f09b'}, {'name': 'unlock', 'code': 'f09c'}, {'name': 'credit-card', 'code': 'f09d'}, {'name': 'rss', 'code': 'f09e'}, {'name': 'hdd-o', 'code': 'f0a0'}, {'name': 'bullhorn', 'code': 'f0a1'}, {'name': 'bell', 'code': 'f0f3'}, {'name': 'certificate', 'code': 'f0a3'}, {'name': 'hand-o-right', 'code': 'f0a4'}, {'name': 'hand-o-left', 'code': 'f0a5'}, {'name': 'hand-o-up', 'code': 'f0a6'}, {'name': 'hand-o-down', 'code': 'f0a7'}, {'name': 'arrow-circle-left', 'code': 'f0a8'}, {'name': 'arrow-circle-right', 'code': 'f0a9'}, {'name': 'arrow-circle-up', 'code': 'f0aa'}, {'name': 'arrow-circle-down', 'code': 'f0ab'}, {'name': 'globe', 'code': 'f0ac'}, {'name': 'wrench', 'code': 'f0ad'}, {'name': 'tasks', 'code': 'f0ae'}, {'name': 'filter', 'code': 'f0b0'}, {'name': 'briefcase', 'code': 'f0b1'}, {'name': 'arrows-alt', 'code': 'f0b2'}, {'name': 'users', 'code': 'f0c0'}, {'name': 'link', 'code': 'f0c1'},
    {'name': 'cloud', 'code': 'f0c2'}, {'name': 'flask', 'code': 'f0c3'}, {'name': 'scissors', 'code': 'f0c4'}, {'name': 'files-o', 'code': 'f0c5'}, {'name': 'paperclip', 'code': 'f0c6'}, {'name': 'floppy-o', 'code': 'f0c7'}, {'name': 'square', 'code': 'f0c8'}, {'name': 'bars', 'code': 'f0c9'}, {'name': 'list-ul', 'code': 'f0ca'}, {'name': 'list-ol', 'code': 'f0cb'}, {'name': 'strikethrough', 'code': 'f0cc'}, {'name': 'underline', 'code': 'f0cd'}, {'name': 'table', 'code': 'f0ce'}, {'name': 'magic', 'code': 'f0d0'}, {'name': 'truck', 'code': 'f0d1'}, {'name': 'pinterest', 'code': 'f0d2'}, {'name': 'pinterest-square', 'code': 'f0d3'}, {'name': 'google-plus-square', 'code': 'f0d4'}, {'name': 'google-plus', 'code': 'f0d5'}, {'name': 'money', 'code': 'f0d6'}, {'name': 'caret-down', 'code': 'f0d7'}, {'name': 'caret-up', 'code': 'f0d8'}, {'name': 'caret-left', 'code': 'f0d9'}, {'name': 'caret-right', 'code': 'f0da'}, {'name': 'columns', 'code': 'f0db'}, {'name': 'sort', 'code': 'f0dc'}, {'name': 'sort-asc', 'code': 'f0dd'}, {'name': 'sort-desc', 'code': 'f0de'}, {'name': 'envelope', 'code': 'f0e0'}, {'name': 'linkedin', 'code': 'f0e1'}, {'name': 'undo', 'code': 'f0e2'}, {'name': 'gavel', 'code': 'f0e3'}, {'name': 'tachometer', 'code': 'f0e4'}, {'name': 'comment-o', 'code': 'f0e5'}, {'name': 'comments-o', 'code': 'f0e6'}, {'name': 'bolt', 'code': 'f0e7'}, {'name': 'sitemap', 'code': 'f0e8'}, {'name': 'umbrella', 'code': 'f0e9'}, {'name': 'clipboard', 'code': 'f0ea'}, {'name': 'lightbulb-o', 'code': 'f0eb'}, {'name': 'exchange', 'code': 'f0ec'}, {'name': 'cloud-download', 'code': 'f0ed'}, {'name': 'cloud-upload', 'code': 'f0ee'}, {'name': 'user-md', 'code': 'f0f0'}, {'name': 'stethoscope', 'code': 'f0f1'}, {'name': 'suitcase', 'code': 'f0f2'}, {'name': 'bell-o', 'code': 'f0a2'}, {'name': 'coffee', 'code': 'f0f4'}, {'name': 'cutlery', 'code': 'f0f5'}, {'name': 'file-text-o', 'code': 'f0f6'}, {'name': 'building-o', 'code': 'f0f7'}, {'name': 'hospital-o', 'code': 'f0f8'}, {'name': 'ambulance', 'code': 'f0f9'}, {'name': 'medkit', 'code': 'f0fa'}, {'name': 'fighter-jet', 'code': 'f0fb'}, {'name': 'beer', 'code': 'f0fc'}, {'name': 'h-square', 'code': 'f0fd'}, {'name': 'plus-square', 'code': 'f0fe'}, {'name': 'angle-double-left', 'code': 'f100'}, {'name': 'angle-double-right', 'code': 'f101'}, {'name': 'angle-double-up', 'code': 'f102'}, {'name': 'angle-double-down', 'code': 'f103'}, {'name': 'angle-left', 'code': 'f104'}, {'name': 'angle-right', 'code': 'f105'}, {'name': 'angle-up', 'code': 'f106'}, {'name': 'angle-down', 'code': 'f107'}, {'name': 'desktop', 'code': 'f108'}, {'name': 'laptop', 'code': 'f109'}, {'name': 'tablet', 'code': 'f10a'}, {'name': 'mobile', 'code': 'f10b'}, {'name': 'circle-o', 'code': 'f10c'}, {'name': 'quote-left', 'code': 'f10d'}, {'name': 'quote-right', 'code': 'f10e'}, {'name': 'spinner', 'code': 'f110'}, {'name': 'circle', 'code': 'f111'}, {'name': 'reply', 'code': 'f112'}, {'name': 'github-alt', 'code': 'f113'}, {'name': 'folder-o', 'code': 'f114'}, {'name': 'folder-open-o', 'code': 'f115'}, {'name': 'smile-o', 'code': 'f118'}, {'name': 'frown-o', 'code': 'f119'}, {'name': 'meh-o', 'code': 'f11a'}, {'name': 'gamepad', 'code': 'f11b'}, {'name': 'keyboard-o', 'code': 'f11c'}, {'name': 'flag-o', 'code': 'f11d'}, {'name': 'flag-checkered', 'code': 'f11e'}, {'name': 'terminal', 'code': 'f120'}, 
    {'name': 'code', 'code': 'f121'}, {'name': 'reply-all', 'code': 'f122'}, {'name': 'mail-reply-all', 'code': 'f122'}, {'name': 'star-half-o', 'code': 'f123'}, {'name': 'location-arrow', 'code': 'f124'}, {'name': 'crop', 'code': 'f125'}, {'name': 'code-fork', 'code': 'f126'}, {'name': 'chain-broken', 'code': 'f127'}, {'name': 'question', 'code': 'f128'}, {'name': 'info', 'code': 'f129'}, {'name': 'exclamation', 'code': 'f12a'}, {'name': 'superscript', 'code': 'f12b'}, {'name': 'subscript', 'code': 'f12c'}, {'name': 'eraser', 'code': 'f12d'}, {'name': 'puzzle-piece', 'code': 'f12e'}, {'name': 'microphone', 'code': 'f130'}, {'name': 'microphone-slash', 'code': 'f131'}, {'name': 'shield', 'code': 'f132'}, {'name': 'calendar-o', 'code': 'f133'}, {'name': 'fire-extinguisher', 'code': 'f134'}, {'name': 'rocket', 'code': 'f135'}, {'name': 'maxcdn', 'code': 'f136'}, {'name': 'chevron-circle-left', 'code': 'f137'}, {'name': 'chevron-circle-right', 'code': 'f138'}, {'name': 'chevron-circle-up', 'code': 'f139'}, {'name': 'chevron-circle-down', 'code': 'f13a'}, {'name': 'html5', 'code': 'f13b'}, {'name': 'css3', 'code': 'f13c'}, {'name': 'anchor', 'code': 'f13d'}, {'name': 'unlock-alt', 'code': 'f13e'}, {'name': 'bullseye', 'code': 'f140'}, {'name': 'ellipsis-h', 'code': 'f141'}, {'name': 'ellipsis-v', 'code': 'f142'}, {'name': 'rss-square', 'code': 'f143'}, {'name': 'play-circle', 'code': 'f144'}, {'name': 'ticket', 'code': 'f145'}, {'name': 'minus-square', 'code': 'f146'}, {'name': 'minus-square-o', 'code': 'f147'}, {'name': 'level-up', 'code': 'f148'}, {'name': 'level-down', 'code': 'f149'}, {'name': 'check-square', 'code': 'f14a'}, {'name': 'pencil-square', 'code': 'f14b'}, {'name': 'external-link-square', 'code': 'f14c'}, {'name': 'share-square', 'code': 'f14d'}, {'name': 'compass', 'code': 'f14e'}, {'name': 'caret-square-o-down', 'code': 'f150'}, {'name': 'caret-square-o-up', 'code': 'f151'}, {'name': 'caret-square-o-right', 'code': 'f152'}, {'name': 'eur', 'code': 'f153'}, {'name': 'gbp', 'code': 'f154'}, {'name': 'usd', 'code': 'f155'}, {'name': 'inr', 'code': 'f156'}, {'name': 'jpy', 'code': 'f157'}, {'name': 'rub', 'code': 'f158'}, {'name': 'krw', 'code': 'f159'}, {'name': 'btc', 'code': 'f15a'}, {'name': 'file', 'code': 'f15b'}, {'name': 'file-text', 'code': 'f15c'}, {'name': 'sort-alpha-asc', 'code': 'f15d'}, {'name': 'sort-alpha-desc', 'code': 'f15e'}, {'name': 'sort-amount-asc', 'code': 'f160'}, {'name': 'sort-amount-desc', 'code': 'f161'}, {'name': 'sort-numeric-asc', 'code': 'f162'}, {'name': 'sort-numeric-desc', 'code': 'f163'}, {'name': 'thumbs-up', 'code': 'f164'}, {'name': 'thumbs-down', 'code': 'f165'}, {'name': 'youtube-square', 'code': 'f166'}, {'name': 'youtube', 'code': 'f167'}, {'name': 'xing', 'code': 'f168'}, {'name': 'xing-square', 'code': 'f169'}, {'name': 'youtube-play', 'code': 'f16a'}, {'name': 'dropbox', 'code': 'f16b'}, {'name': 'stack-overflow', 'code': 'f16c'}, {'name': 'instagram', 'code': 'f16d'}, {'name': 'flickr', 'code': 'f16e'}, {'name': 'adn', 'code': 'f170'}, {'name': 'bitbucket', 'code': 'f171'}, {'name': 'bitbucket-square', 'code': 'f172'}, {'name': 'tumblr', 'code': 'f173'}, {'name': 'tumblr-square', 'code': 'f174'}, {'name': 'long-arrow-down', 'code': 'f175'}, {'name': 'long-arrow-up', 'code': 'f176'}, {'name': 'long-arrow-left', 'code': 'f177'}, {'name': 'long-arrow-right', 'code': 'f178'}, {'name': 'apple', 'code': 'f179'}, {'name': 'windows', 'code': 'f17a'}, {'name': 'android', 'code': 'f17b'},
    {'name': 'linux', 'code': 'f17c'}, {'name': 'dribbble', 'code': 'f17d'}, {'name': 'skype', 'code': 'f17e'}, {'name': 'foursquare', 'code': 'f180'}, {'name': 'trello', 'code': 'f181'}, {'name': 'female', 'code': 'f182'}, {'name': 'male', 'code': 'f183'}, {'name': 'gittip', 'code': 'f184'}, {'name': 'sun-o', 'code': 'f185'}, {'name': 'moon-o', 'code': 'f186'}, {'name': 'archive', 'code': 'f187'}, {'name': 'bug', 'code': 'f188'}, {'name': 'vk', 'code': 'f189'}, {'name': 'weibo', 'code': 'f18a'}, {'name': 'renren', 'code': 'f18b'}, {'name': 'pagelines', 'code': 'f18c'}, {'name': 'stack-exchange', 'code': 'f18d'}, {'name': 'arrow-circle-o-right', 'code': 'f18e'}, {'name': 'arrow-circle-o-left', 'code': 'f190'}, {'name': 'caret-square-o-left', 'code': 'f191'}, {'name': 'dot-circle-o', 'code': 'f192'}, {'name': 'wheelchair', 'code': 'f193'}, {'name': 'vimeo-square', 'code': 'f194'}, {'name': 'try', 'code': 'f195'}, {'name': 'plus-square-o', 'code': 'f196'}];
};

GS.lorem = function () {
    return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
};

