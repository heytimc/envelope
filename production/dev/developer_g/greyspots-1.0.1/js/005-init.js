
// #############################################################
// ################### CROSS PLATFORM EVENTS ###################
// #############################################################

if (window.evt === undefined) {
    window.evt = {};
}

// function for testing if the device has touch capibilities
function touchDeviceTest() {
    'use strict';
    return 'ontouchstart' in window ||    // works on most browsers
           'onmsgesturechange' in window; // works on ie10
}

// display type based on size
function getDeviceType() {
    'use strict';
    // if we are not on a touch device than we must be a desktop
    if (evt.touchDevice === false) {
        return 'desktop';
    }
    // if touch device and screen is bigger than normal phone
    if (evt.touchDevice === true && screen.width > 500) {
        return 'tablet';
    }
    // if the screen is small and we are a touch device we are a phone
    return 'phone';
}

/*DOC
Name:
    evt.*

Description:
    This is a collection of global variables that are used for browser-type detection and for using different events for different devices.
    The reason for this is because even though the 'mousedown' event works on a phone it is substantially slower than if you had used 'touchstart',
    But if you used 'touchstart' it wouldn't work on the computer so we wrap both under the name evt.mousedown and only give mobile browsers
    'touchstart' and desktop browsers 'mousedown' so that you dont have to differentiate.
    
List of variables:
    evt.touchDevice  equals true|false depending on whether or not we are on a touch-enabled devide
    evt.deviceType   equals 'desktop'|'tablet'|'phone' depending on what type of device you are on
    
    evt.mousedown    if we are on a touch device: 'touchstart'  else  'mousedown'
    evt.mouseover    if we are on a touch device: 'touchenter'  else  'mouseover'
    evt.mousemove    if we are on a touch device: 'touchmove'   else  'mousemove'
    evt.mouseout     if we are on a touch device: 'touchleave'  else  'mouseout'
    evt.mouseup      if we are on a touch device: 'touchend'    else  'mouseup'
    evt.click        if we are on a touch device: 'touchend'    else  'click'

*/

// this is for detecting whether or not we are in an touch device
evt.touchDevice = touchDeviceTest();

// set global variable for display type
evt.deviceType = getDeviceType();

evt.mousedown = evt.touchDevice ? 'touchstart': 'mousedown';
evt.mouseover = evt.touchDevice ? 'touchenter': 'mouseover';
evt.mousemove = evt.touchDevice ? 'touchmove' : 'mousemove';
evt.mouseout  = evt.touchDevice ? 'touchleave': 'mouseout';
evt.mouseup   = evt.touchDevice ? 'touchend'  : 'mouseup';
evt.click     = 'click';

// #############################################################
// #################### DEFINE GS NAMESPACE ####################
// #############################################################

if (window.GS === undefined) {
    window.GS = {};
    
    GS.version = function () {
        'use strict';
        return '1.0.0';
    };
    
    window.addEventListener('design-register-element', function () {
        'use strict';
        
        registerDesignSnippet('GS.version', 'GS.version', 'GS.version();');
    });
}

// #############################################################
// #################### DEFINE support NAMESPACE ####################
// #############################################################

if (window.shimmed === undefined) {
    window.shimmed = {};
    
    
    window.addEventListener('design-register-element', function () {
        'use strict';
        
        
    });
}

// ##############################################################
// ####################### NO CONSOLE FIX #######################
// ##############################################################

// in IE8 when the dev tools are not open console.log is not defined so if there was a console.log() the page would error
//      this defines the console object if it is empty so that if there is a console.log() it will not error in IE8
if (typeof console === 'undefined' || !console.log) {
    window.console = {
        log:   function () { 'use strict'; },
        info:  function () { 'use strict'; },
        debug: function () { 'use strict'; },
        warn:  function () { 'use strict'; },
        trace: function () { 'use strict'; },
        error: function () { 'use strict'; }
    };
}


// ##############################################################
// ######## PREVENT WINDOW OVERSCROLLING ON TOUCH DEVICE ########
// ##############################################################
/*
if (evt.touchDevice) {
    (function () {
        var startTime, startTouchTop, endTime, endTouchTop, lastTouchTop, currentTouchTop,
            bolCurrentlyMonitoring = false, bolTouchScrollPrevented = false, currentScrollingElement, scrollingLooper;
        
        window.ontouchstart = function(event){
            lastTouchTop = GS.mousePosition(event).top;
        };
        
        //window.addEventListener('scroll', function (event) {
        //    console.log(event);
        //}, true);
        
        window.ontouchmove = function (event) {
            var currentTouchTop = GS.mousePosition(event).top, currentElement = GS.scrollParent(event.target), bolFoundScrollable = Boolean(currentElement);
            
            //console.log(currentElement,
            //            event.target,
            //            bolFoundScrollable,
            //            currentElement.scrollTop,
            //            currentElement.clientHeight,
            //            currentElement.scrollHeight,
            //            currentTouchTop,
            //            lastTouchTop);
            //console.log(currentElement.scrollTop <= 0,
            //            currentTouchTop > lastTouchTop,
            //            currentElement.scrollTop + currentElement.clientHeight >= currentElement.scrollHeight,
            //            currentTouchTop < lastTouchTop);
            
            if (bolFoundScrollable === false ||
                (currentElement.scrollTop <= 0 && currentTouchTop > lastTouchTop) ||
                (currentElement.scrollTop + currentElement.clientHeight >= currentElement.scrollHeight && currentTouchTop < lastTouchTop)) {
                
                //console.log('prevent default');
                
                bolTouchScrollPrevented = true;
                event.preventDefault();
                //event.stopPropagation();
                
            } else if (bolFoundScrollable === true && bolTouchScrollPrevented === true) {
                currentElement.scrollTop += (lastTouchTop - currentTouchTop);
            }
            
            currentScrollingElement = currentElement;
            lastTouchTop = currentTouchTop;
        };
        
        window.ontouchend = function () {
            bolTouchScrollPrevented = false;
        };
    })();
}*/


// ##############################################################
// ########### LABEL CLICK: FOCUS USING FOR ATTRIBUTE ###########
// ##############################################################

window.addEventListener('click', function (event) {
    var labelElement, targetElement;
    
    //console.log(event.target, GS.findParentTag(event.target, 'LABEL'));
    
    if (event.target.nodeName === 'LABEL') {
        labelElement = event.target;
    } else if (GS.findParentTag(event.target, 'LABEL')) {
        labelElement = GS.findParentTag(event.target, 'LABEL');
    }
    
    //console.log(labelElement, labelElement.getAttribute('for'));
    
    if (labelElement && labelElement.hasAttribute('for')) {
        targetElement = document.getElementById(labelElement.getAttribute('for'));
        
        //console.log(targetElement);
        //console.log(targetElement.focus, !targetElement.hasAttribute('disabled'));
        
        if (targetElement && targetElement.focus && !targetElement.hasAttribute('disabled')) {
            targetElement.focus();
        }
    }
});


// ##############################################################
// ########### PINK BACKGROUND WHEN NOT IN PRODUCTION ###########
// ##############################################################

window.addEventListener('load', function () {
    var strPostageuName = GS.getCookie('postage_uname');
    if (strPostageuName &&
        window.location.host.indexOf(strPostageuName) === 0 &&
        window.location.pathname !== '/v1/app/all/index.html' &&
        window.location.pathname.indexOf('/v1/dev') !== 0) {
        
        var styleChild = document.createElement('style');
        styleChild.innerHTML =  'body, body gs-panel, body gs-panel gs-header, body gs-panel gs-body, ' +
                                    'body gs-page, body gs-page gs-header, body gs-page gs-body {' +
                                    'background-color: #FFBBBB;' +
                                '}';
        document.querySelector('head').appendChild(styleChild);
    }
});


// #############################################################
// ######################### PAGE CURL #########################
// #############################################################

window.addEventListener('load', function () {
    'use strict';
    var bolOpen, intMaxHeight, curlElement, menuElement, strPostageUName, strHTML, toggleCurl;
    
    if (window.bolCurl !== false) {
        bolOpen = false;
        intMaxHeight = 0;
        curlElement = document.createElement('div');
        menuElement = document.createElement('div');
        strPostageUName = GS.getCookie('postage_uname');
        strHTML = '';
        
        curlElement.setAttribute('id', 'gs-document-curl-container');
        curlElement.innerHTML = '<div id="gs-document-curl-part-1"></div>' +
                                '<div id="gs-document-curl-part-2"></div>' +
                                '<div id="gs-document-curl-part-3"></div>' +
                                '<div id="gs-document-curl-part-4"></div>';
        
        document.body.appendChild(curlElement);
        
        if (evt.deviceType === 'phone') {
            curlElement.setAttribute('style', 'font-size: 1.3em;');
        } else {
            curlElement.setAttribute('style', 'font-size: 0.7em;');
        }
        
        menuElement.setAttribute('id', 'gs-document-menu-container');
        menuElement.setAttribute('style', 'height: 0px;');
        
        strHTML += '<center><b><a target="_self" href="/v1/app/all/index.html">Home</a></b></center>';
        strHTML += '<center><b><a target="_self" href="/v1/env/auth/?action=logout">Log out</a></b></center>';
        strHTML += '<center><b><a onclick="GS.userChangePassword()">Change Password</a></b></center>';
        //strHTML += '<center><b><gs-button id="" iconleft icon="lock">Report Bug</gs-button></b></center>' +
        
        intMaxHeight += 4.2;
        
        //// if developer_g
        //if (userData.groups.indexOf('developer_g') >= 0) {
        //    // if logged in as a superuser
        //    if (userData.superusername) {
        
        if (window.location.host.indexOf(strPostageUName) === 0) {
            strHTML += '<center><b><a target="_self" href="/v1/postage/auth/?action=logout">Log Superuser out</a></b></center>';
            strHTML += '<center><b><a onclick="GS.superChangePassword()">Change Superuser Password</a></b></center>';
            intMaxHeight += 2.8;
            
            //    // else if not logged in as a superuser
            //    } else {
            //        strHTML += '<center><b><a onclick="GS.superUserLogin(window.location.reload)">Log in to Superuser</a></b></center>';
            //        intMaxHeight += 1.4;
            //    }
            //}
        }
        
        strHTML += '<b>&nbsp;<a onclick="GS.showShimmed()">Browser Support</a></b>';
        intMaxHeight += 1.4;
        
        menuElement.innerHTML = '<div id="gs-document-menu-link-container" style="height: ' + intMaxHeight + 'em;">' + strHTML + '</div>';
        document.body.appendChild(menuElement);
        
        // define function for toggling the page curl
        toggleCurl = function () {
            var intFontSize = GS.pxToEm(document.body, window.innerWidth) / 4,
                intBottomLine = window.innerHeight - (GS.emToPx(document.body, intFontSize)),
                closedSize = (evt.deviceType === 'phone' ? '1.3em' : '0.7em'); // replace evt.touchDevice with true to test on a desktop
            
            // maximum bottom line
            if (GS.pxToEm(document.body, intBottomLine) > intMaxHeight) {
                intBottomLine = GS.emToPx(document.body, intMaxHeight);
            }
            
            curlElement.classList.add('animating');
            menuElement.classList.add('animating');
            
            if (bolOpen === false) {
                document.body.insertBefore(GS.stringToElement('<div id="gs-document-curl-modal-background"></div>'), curlElement);
                document.getElementById('gs-document-curl-modal-background').addEventListener('click', toggleCurl);
                
                GS.animateStyle(curlElement, 'font-size', closedSize, intFontSize + 'em', function () {
                    curlElement.classList.remove('animating');
                }, 185, 18);
                
                GS.animateStyle(curlElement, 'bottom', '0px', intBottomLine + 'px', function () {
                    curlElement.classList.remove('animating');
                }, 185, 18);
                
                GS.animateStyle(menuElement, 'height', '0px', intBottomLine + 'px', function () {
                    menuElement.classList.remove('animating');
                }, 185, 18);
                
                bolOpen = true;
            } else {
                document.body.removeChild(document.getElementById('gs-document-curl-modal-background'));
                
                GS.animateStyle(curlElement, 'font-size', intFontSize + 'em', closedSize, function () {
                    curlElement.classList.remove('animating');
                }, 185, 18);
                
                GS.animateStyle(curlElement, 'bottom', intBottomLine + 'px', '0px', function () {
                    curlElement.classList.remove('animating');
                }, 185, 18);
                
                GS.animateStyle(menuElement, 'height', intBottomLine + 'px', '0px', function () {
                    menuElement.classList.remove('animating');
                }, 185, 18);
                
                bolOpen = false;
            }
        };
        
        curlElement.addEventListener('click', toggleCurl);
    }
});


/*
    .------ turns out I was under the mistaken impression that $ was being defined globally
    |           by the browser as a shortcut to run a selector, this is not the case. $ is only
    |           for use in the console which is why when I tested "window.$ = $;" it worked in a
    |           console but not here, and also why the onclick of elements had no access either
    |           so this section of code never did anything for me.
    V
// #############################################################
// ################## ONCLICK ATTRIBUTE $ FIX ##################
// #############################################################

window.addEventListener('load', function () {
    // this fixes an issue where onclick attributes did not have access to the $ function provided by the browser
    
    
    
    //try {                                                <== Illegal invocation when $() is called
    //    window.$ = $;
    //} catch (e) {
    //    window.$ = document.querySelector;
    //}
    
    //if ($) {                                             <== $ not defined
    //    window.$ = $;
    //} else {
    //    window.$ = document.querySelector;
    //}
    
    //window.$ = $ || document.querySelector;              <== $ not defined
});
*/



// ################################################################
// ###################### FASTCLICK POLYFILL ######################
// ################################################################

/*// custom event: gs-tap
(function () {
    var bolMousedown = false, bolMouseWithinRange = false, intOriginX, intOriginY, intMaxHorizontalDiff = 10, intMaxVerticalDiff = 10, originTarget, mousedownTime;
    
    window.addEventListener(evt.mousedown, function (event) {
        var jsnMousePos = GS.mousePosition(event);
        
        //if (event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'TEXTAREA' && event.target.nodeName !== 'SELECT') {
        //    event.preventDefault();
        //}
        
        intOriginY = jsnMousePos.top;
        intOriginX = jsnMousePos.left;
        
        bolMousedown = true;
        bolMouseWithinRange = true;
        
        originTarget = event.target;
        
        //console.log(evt.mousedown, event, mousedownTime !== undefined ? new Date().getTime() - mousedownTime : mousedownTime, event.target);
        
        mousedownTime = new Date().getTime();
    });
    
    window.addEventListener(evt.mousemove, function (event) {
        var jsnMousePos = GS.mousePosition(event), intCurrentX, intCurrentY;
        
        //if (!evt.touchDevice && event.which === 0) {
        //    bolMousedown = false;
        //} else 
        if (bolMousedown === true) {
            intCurrentY = jsnMousePos.top;
            intCurrentX = jsnMousePos.left;
            
            bolMouseWithinRange = !(Math.abs(intOriginX - intCurrentX) > intMaxHorizontalDiff || Math.abs(intOriginY - intCurrentY) > intMaxVerticalDiff);
            
            //console.log(evt.mousemove, bolMouseWithinRange);
        }
    });
    
    //window.addEventListener('touchcancel', function (event) {
    //    console.log('touchcancel');
    //});
    
    window.addEventListener(evt.mouseup, function (event) {
        bolMousedown = false;
        
        //console.log(evt.mouseup, bolMouseWithinRange);
        
        //if (event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'TEXTAREA' && event.target.nodeName !== 'SELECT') {
        //    event.preventDefault();
        //}
        
        //console.log(originTarget, event.target, bolMouseWithinRange);
        
        if (bolMouseWithinRange === true && originTarget === event.target && new Date().getTime() - mousedownTime < 220) {
            xtag.fireEvent(originTarget, 'gs-tap');
            
            //console.log(event.target);
            //alert(event.target.nodeName);
        }
        
        bolMouseWithinRange = false;
    });
})();
*/

// double clicks will not work while using fastclick
// click events will not have a delay while using fastclick
// we chose fastclick :)

// if you need to turn fastclick off for an element use the "needsclick" class
// if you need to turn fastclick off for an elements children (but not the element itself) use the "childrenneedsclick" class
// if you need to turn fastclick off for an elements children and the element itself use the "childrenneedsclick" class and the "needsclick" class
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        'use strict';
        FastClick.attach(document.body);
    }, false);
}



// ##################################################################
// ##################### TEMPLATE GET INERT DOM #####################
// ##################################################################
/*
HTMLTemplateElement.prototype.contentTemplate = function () {
    'use strict';
    
    if (this.content) {
        
    } else {
        
    }
};
*/

// #################################################################
// ###################### POLYFILL/SHIM CHECK ######################
// #################################################################

window.addEventListener('design-register-element', function () {
    'use strict';
    
    registerDesignSnippet('GS.showShimmed', 'GS.showShimmed', 'GS.showShimmed();');
});

window.addEventListener('load', function () {
    'use strict';
    function cleanFunctionForTest(fn) {
        fn = fn.toString().toLowerCase();   // convert function string and turn all text lowercase
        fn = fn.substring(fn.indexOf('{')); // remove everything up until the first open curly brace
        fn = fn.replace(/ /gim, '');        // remove all spaces
        
        return fn;
    }
    
    function nativeTest(fn) {
        // if there is not function: not native: return false
        if (!fn) {
            return false;
        }
        
        // clean function for native testing
        fn = cleanFunctionForTest(fn);
        
        return fn.indexOf('[nativecode]') > -1 ||                   // if '[nativecode]' is found in the cleaned text: native
               fn === cleanFunctionForTest(document.createElement); // else if the cleaned text matches a native function: native
    }
    
    shimmed.matchesSelector     = !nativeTest(Element.prototype.matchesSelector) &&
                                  !nativeTest(Element.prototype.webkitMatchesSelector) &&
                                  !nativeTest(Element.prototype.mozMatchesSelector) &&
                                  !nativeTest(Element.prototype.msMatchesSelector) &&
                                  !nativeTest(Element.prototype.MSMatchesSelector);
    
    shimmed.MutationObserver    = !nativeTest(window.MutationObserver);
    shimmed.WeakMap             = !nativeTest(window.WeakMap);
    shimmed.registerElement     = !nativeTest(document.registerElement);
    shimmed.DOMTokenList        = !nativeTest(window.DOMTokenList);
    shimmed.HTMLTemplateElement = Boolean(HTMLTemplateElement.bootstrap);
    
    GS.showShimmed = function () {
        var strHTML = '', key, templateElement;
        
        strHTML += '<br />\n' +
                   '<center>This dialog is for developers so that they can determine what technologies this browser supports and what technologies are being implemented manually.</center>\n' +
                   '<br />\n' +
                   '<hr />\n';
        
        for (key in shimmed) {
            strHTML += '<gs-grid reflow-at="450px">\n' +
                       '    <gs-block><center>' + encodeHTML(key) + '</center></gs-block>\n' +
                       '    <gs-block>\n' +
                       '        <center>\n' +
                                    (shimmed[key] ?
                                        '            <b style="color: #F00;">SHIMMED</b>\n' :
                                        '            <b style="color: #11A511;">NATIVE</b>\n') +
                       '        </center>\n' +
                       '    </gs-block>\n' +
                       '</gs-grid>\n' +
                       '<hr />\n';
        }
        
        strHTML += '<br />';
        
        
        templateElement = document.createElement('template');
        
        templateElement.innerHTML = ml(function () {/*
            <gs-page>
                <gs-header><center><h3>Native Detection</h3></center></gs-header>
                <gs-body padded>
                    {{HTML}}
                </gs-body>
                <gs-footer><gs-button dialogclose>Done</gs-button></gs-footer>
            </gs-page>
        */}).replace('{{HTML}}', strHTML);
        
        GS.openDialog(templateElement);
    };
});

