
window.addEventListener('design-register-element', function () {
    'use strict';
    
    registerDesignSnippet('GS.findParentTag', 'GS.findParentTag', 'GS.findParentTag(${1:element}, \'${0:tag-to-find}\');');
    
    registerDesignSnippet('GS.findParentElement', 'GS.findParentElement',
                                                    'GS.findParentElement(${1:element}, ${0:\'selector, element or function\'});');
    
    registerDesignSnippet('GS.insertElementAfter', 'GS.insertElementAfter',
                                                    'GS.insertElementAfter(${1:elementToInsert}, \'${0:elementToInsertAfter}\');');
    
    registerDesignSnippet('GS.getElementOffset', 'GS.getElementOffset', 'GS.getElementOffset(${0:element});');
    
    registerDesignSnippet('GS.animateStyle', 'GS.animateStyle',
                                            'GS.animateStyle(${1:elementToAnimate}, ' +
                                                            '${2:CSSPropertyToAnimate}, ' +
                                                            '${3:startValue}, ' +
                                                            '${4:endValue}, ' +
                                                            '${5:callbackAfterAnimation}, ' +
                                                            '${6:durationInMilliseconds}, ' +
                                                            '${0:numberOfFrames});');
    
    registerDesignSnippet('GS.stringToElement', 'GS.stringToElement', 'GS.stringToElement(\'${0:<div>your HTML here</div>}\');');
    
    registerDesignSnippet('GS.cloneElement', 'GS.cloneElement', 'GS.cloneElement(${0:element});');
    
    registerDesignSnippet('GS.isElementFocusable', 'GS.isElementFocusable', 'GS.isElementFocusable(${0:element});');
    
    registerDesignSnippet('GS.scrollParent', 'GS.scrollParent', 'GS.scrollParent(${0:element});');
    
    registerDesignSnippet('GS.scrollIntoView', 'GS.scrollIntoView', 'GS.scrollIntoView(${0:element});');
    
    registerDesignSnippet('GS.getInputSelection', 'GS.getInputSelection', 'GS.getInputSelection(${0:inputOrTextareaElement});');
    
    registerDesignSnippet('GS.setInputSelection', 'GS.setInputSelection',
                                    'GS.setInputSelection(${1:inputOrTextareaElement}, ${2:startAtNumber}, ${0:endAtNumber});');
    
    registerDesignSnippet('GS.getElementPositionData', 'GS.getElementPositionData', 'GS.getElementPositionData(${0:element});');
});

// #################################################################
// #################### DOM TRAVERSAL FUNCTIONS ####################
// #################################################################

// loop through parents until tag is found
GS.findParentTag = function (element, strTagName) {
    'use strict';
    var currentElement = element;
    
    strTagName = strTagName.toUpperCase();
    
    while (currentElement && currentElement.nodeName !== strTagName && currentElement.nodeName !== 'HTML') {
        currentElement = currentElement.parentNode;
    }
    
    if (!currentElement || currentElement.nodeName !== strTagName) {
        return undefined;
    }
    
    return currentElement;
};

// loop through parents until checkParameter is satisfied or we run into HTML
GS.findParentElement = function (element, checkParameter) {
    'use strict';
    var currentElement = element;
    
    // if checkParameter is a function: use it to check the element
    if (typeof checkParameter === 'function') {
        while (currentElement && !checkParameter(currentElement) && currentElement.nodeName !== 'HTML') {
            currentElement = currentElement.parentNode;
        }
        
    // else if checkParameter is a string: use checkParameter as a selector string and use xtag.matchSelector
    } else if (typeof checkParameter === 'string') {
        while (currentElement && !xtag.matchSelector(currentElement, checkParameter) && currentElement.nodeName !== 'HTML') {
            currentElement = currentElement.parentNode;
        }
        
    // else: assume checkParameter is an element and use ===
    } else {
        while (currentElement && currentElement === checkParameter && currentElement.nodeName !== 'HTML') {
            currentElement = currentElement.parentNode;
        }
    }
    
    if (!currentElement) {
        return undefined;
    }
    
    return currentElement;
};


// ################################################################
// #################### HTML ELEMENT FUNCTIONS ####################
// ################################################################

// insert element after another element
GS.insertElementAfter = function (elementToInsert, target) {
    if (target.nextElementSibling) {
        target.parentNode.insertBefore(elementToInsert, target.nextElementSibling);
    } else {
        target.parentNode.appendChild(elementToInsert);
    }
};

// get element's position on the screen
GS.getElementOffset = function (element) {
    'use strict';
    var intX = 0, intY = 0, ret;
    
    if (element.getBoundingClientRect) {
        ret = element.getBoundingClientRect();
        
    } else {
        while (element && element.nodeName !== 'HTML') {
            intX += element.offsetLeft - element.scrollLeft;// + element.clientLeft;
            intY += element.offsetTop - element.scrollTop;// + element.clientTop;
            
            //console.log(element.offsetTop, element.scrollTop, element);
            
            element = element.parentNode; //element.offsetParent
        }
        
        ret = {
            left: intX,
            top: intY
        };
    }
    
    return ret;
};

//
GS.animateStyle = function (element, strStyleProperty, strStart, strEnd, callback, intDuration, intFrames) {
    var intStart         = parseInt(strStart, 10),
        intEnd           = parseInt(strEnd, 10),
        strStartUnit     = strStart.replace(/[0-9\.-]/gi, '').toLowerCase(),
        //strEndUnit       = strEnd.replace(/[0-9\.-]/gi, '').toLowerCase(),
        intFrameDuration = intDuration / intFrames,
        i, timeoutFunction, intCurrent, intJump;
    
    //if (strStartUnit !== 'em' && strStartUnit !== 'px' && strStartUnit !== '') {
    //    throw 'animateStyle error: strStart has an invalid unit, use px or em or nothing';
    //    
    //} else if (strEndUnit !== 'em' && strEndUnit !== 'px' && strEndUnit !== '') {
    //    throw 'animateStyle error: strEnd has an invalid unit, use px or em or nothing';
    //    
    //} else {
    intCurrent = intStart;
    intJump = (intEnd - intStart) / intFrames;
    i = 1;
    
    element.style[strStyleProperty] = strStart;
    
    timeoutFunction = function () {
        setTimeout(function () {
            intCurrent += intJump;
            //element.style[strStyleProperty] = intCurrent + strStartUnit;
            //console.log(intCurrent, i, intFrames, element, element.style[strStyleProperty], intStart, intCurrent, strStartUnit);
            
            if (i < intFrames) {
                element.style[strStyleProperty] = intCurrent + strStartUnit;
                i += 1;
                timeoutFunction();
            } else {
                element.style[strStyleProperty] = strEnd;
                callback();
            }
        }, intFrameDuration);
    };
    
    timeoutFunction();
    //}
};

//
GS.stringToElement = function (strHTML, optionalTargetDocument) {
    var strFirstTagName, parentElement, indexInElement, parsedElement, targetDocument;
    
    if (optionalTargetDocument) {
        targetDocument = optionalTargetDocument;
    } else {
        targetDocument = document;
    }
    
    //console.log(strFirstTagName);
    
    strFirstTagName = strHTML.substring(strHTML.indexOf('<') + 1, strHTML.indexOf('>'));
    
    //console.log(strFirstTagName);
    
    if (strFirstTagName.indexOf(' ') > -1) {
        strFirstTagName = strFirstTagName.substring(0, strFirstTagName.indexOf(' '));
    }
    
    //console.log(strFirstTagName);
    
    if (strFirstTagName === 'body') {
        parentElement = targetDocument.createElement('html');
        indexInElement = 1;
        
    } else if (strFirstTagName === 'thead' || strFirstTagName === 'tbody') {
        parentElement = targetDocument.createElement('table');
        indexInElement = 0;
        
    } else if (strFirstTagName === 'tr') {
        parentElement = targetDocument.createElement('tbody');
        indexInElement = 0;
        
    } else if (strFirstTagName === 'td' || strFirstTagName === 'th') {
        parentElement = targetDocument.createElement('tr');
        indexInElement = 0;
        
    } else if (strFirstTagName === 'li') {
        parentElement = targetDocument.createElement('ul');
        indexInElement = 0;
    } else {
        parentElement = targetDocument.createElement('div');
        indexInElement = 0;
    }
    
    parentElement.innerHTML = strHTML;
    parsedElement = parentElement.children[indexInElement];
    
    //console.log(strFirstTagName, parsedElement);
    
    return parsedElement;
};

//
GS.cloneElement = function (element, optionalTargetDocument) {
    // if there is a template element in the element: copy the element without cloneNode because for some reason cloneNode breaks templates on IOS
    if (xtag.query(element, 'template').length > 0 || optionalTargetDocument) {
        return GS.stringToElement(element.outerHTML, optionalTargetDocument);
    }
    
    // else: just use cloneNode
    return element.cloneNode(true);
};

/*
// change the tag of an element
GS.changeElementTag = function (element, strNewTag, alterCallback) {
    var strHTML = element.outerHTML.trim(), newElement;
    
    strHTML = '<' + strNewTag + strHTML.substring(strHTML.indexOf(' '), strHTML.lastIndexOf('</')) + '</' + strNewTag + '>';
    
    //console.log(strHTML);
    
    newElement = GS.stringToElement(strHTML);
    
    if (typeof alterCallback === 'function') {
        alterCallback.apply(newElement);
    }
    
    return newElement;
};*/

// check to see if an element is focusable
GS.isElementFocusable = function (element) {
    return  (
                element.nodeName === 'INPUT' ||
                element.nodeName === 'TEXTAREA' ||
                element.nodeName === 'SELECT' ||
                element.nodeName === 'BUTTON' ||
                element.nodeName === 'IFRAME' ||
                element.hasAttribute('tabindex') ||
                (element.focus &&
                    element.focus.toString().indexOf('[native code]') === -1 &&
                    element.focus.toString() !== document.createElement('div').focus.toString()) ||
                (
                    element.nodeName === 'A' &&
                    element.hasAttribute('href')
                ) ||
                (
                    element.nodeName === 'AREA' &&
                    element.hasAttribute('href')
                )
            ) &&
            !element.hasAttribute('disabled');
};

// search for a parent with a scrollbar
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

// scroll an element to the middle of its scrollparent
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


// #################################################################
// ################### INPUT SELECTION FUNCTIONS ###################
// #################################################################

GS.getInputSelection = function (input) {
    'use strict';
    var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;
    
    if (typeof input.selectionStart === "number" && typeof input.selectionEnd === "number") {
        start = input.selectionStart;
        end = input.selectionEnd;
    } else {
        range = (document.createRange() || document.selection.createRange());
        
        if (range && range.parentElement() == input) {
            len = input.value.length;
            normalizedValue = input.value.replace(/\r\n/g, "\n");
            
            // Create a working TextRange that lives only in the input
            textInputRange = input.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());
            
            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = input.createTextRange();
            endRange.collapse(false);
            
            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;
                
                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }
    
    return {
        start: start,
        end: end
    };
};

GS.setInputSelection = function (input, intStart, intEnd) {
    'use strict';
    var range;
    
    if (intStart === undefined || intStart === '' || isNaN(intStart) || intStart === null) {
        intStart = input.value.length;
    }
    
    if (intEnd === undefined || intEnd === '' || isNaN(intEnd) || intEnd === null) {
        intEnd = intStart;
    }
    
    if (input.createTextRange) {
        range = input.createTextRange();
        range.collapse();
        range.moveStart('character', intStart);
        range.collapse();
        range.moveEnd('character', intEnd);
        range.select();
    } else if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(intStart, intEnd);
    }
};


// #################################################################
// ################### ELEMENT POSITION FUNCTION ###################
// #################################################################

// return a whole bunch of position data variables for an element
GS.getElementPositionData = function (element) {
    var objElementOffset  = GS.getElementOffset(element),
        intElementWidth   = element.offsetWidth,
        intElementHeight  = element.offsetHeight,
        intElementTop     = objElementOffset.top,
        intElementLeft    = objElementOffset.left,
        intElementBottom  = window.innerHeight - (intElementTop    + intElementHeight),
        intElementRight   = window.innerWidth  - (intElementLeft   + intElementWidth),
        intRoomAbove      = window.innerHeight - (intElementBottom + intElementHeight),
        intRoomBelow      = intElementBottom,
        intRoomLeft       = window.innerWidth  - (intElementRight  + intElementWidth),
        intRoomRight      = intElementRight;
    
    /*console.log(element, '\n' +
                'intElementWidth:   ' + intElementWidth + '\n' +
                'intElementHeight:  ' + intElementHeight + '\n' +
                'intElementTop:     ' + intElementTop + '\n' +
                'intElementBottom:  ' + intElementBottom + '\n' +
                'intElementLeft:    ' + intElementLeft + '\n' +
                'intElementRight:   ' + intElementRight + '\n' +
                'intRoomAbove:      ' + intRoomAbove + '\n' +
                'intRoomBelow:      ' + intRoomBelow + '\n' +
                'intRoomLeft:       ' + intRoomLeft + '\n' +
                'intRoomRight:      ' + intRoomRight);*/
    
    return {
        'element':           element,
        'objElementOffset':  objElementOffset,
        'intElementWidth':   intElementWidth,
        'intElementHeight':  intElementHeight,
        'intElementTop':     intElementTop,
        'intElementLeft':    intElementLeft,
        'intElementBottom':  intElementBottom,
        'intElementRight':   intElementRight,
        'intRoomAbove':      intRoomAbove,
        'intRoomBelow':      intRoomBelow,
        'intRoomLeft':       intRoomLeft,
        'intRoomRight':      intRoomRight
    };
};

// #################################################################
// ####################### DOCUMENT FRAGMENT #######################
// #################################################################
/*                                       ,--- the problem with this code is the DOM we get back is not 100% reliably inert. 
                                         V          To make it reliable I believe I have to change how my elements work.
GS.createDocumentFragment = function (strHTML) {
    'use strict';
    var element = document.createElement('div'),
        fragment = document.createDocumentFragment(),
        arrChildren = element.childNodes;
    
    // fill element with HTML
    element.innerHTML = strHTML;
    
    // append the element to the body (NECCESSARY FOR THE HTML TO BE INERT, I DON'T KNOW WHY -michael)
    document.body.appendChild(element);
    
    // transfer children from element to fragment
    while (arrChildren[0]) {
        fragment.appendChild(arrChildren[0]);
    }
    
    // remove element from the body
    document.body.removeChild(element);
    
    // return inert fragment
    return fragment;
};

GS.getDocumentFragmentHTML = function (fragment) {
    'use strict';
    var strHTML, i, len, arrChildren = fragment.children;
    
    for (strHTML = '', i = 0, len = arrChildren.length; i < len; i += 1) {
        strHTML += arrChildren[i].outerHTML;
    }
    
    return strHTML;
};
*/

// #################################################################
// ########################### INERT DOM ###########################
// #################################################################

GS.createInertDOM = function (strHTML) {
    'use strict';
    var templateElement = document.createElement('template'), iframeElement;
    
    // if the content property is on a template element: no iframe neccessary
    if ('content' in templateElement) {
        templateElement.innerHTML = strHTML;
        
        return templateElement.content;
        
    // else: use iframe to create inert HTML
    } else {
        if (!document.getElementById('gs-inert-dom-generator')) {
            iframeElement = document.createElement('iframe');
            
            iframeElement.setAttribute('id', 'gs-inert-dom-generator');
            iframeElement.setAttribute('hidden', '');
            
            document.body.appendChild(iframeElement);
            
        } else {
            iframeElement = document.getElementById('gs-inert-dom-generator');
        }
        
        iframeElement.contentWindow.inertDOM = iframeElement.contentWindow.document.createElement('div');
        iframeElement.contentWindow.inertDOM.innerHTML = strHTML;
        
        return iframeElement.contentWindow.inertDOM;
    }
};

GS.getInertDOMHTML = function (inertDOM) {
    'use strict';
    var strHTML, i, len, arrChildren = inertDOM.children;
    
    for (strHTML = '', i = 0, len = arrChildren.length; i < len; i += 1) {
        strHTML += arrChildren[i].outerHTML;
    }
    
    return strHTML;
};



