
window.addEventListener('design-register-element', function () {
    'use strict';
    
    registerDesignSnippet('GS.userChangePassword', 'GS.userChangePassword', 'GS.userChangePassword();');
    
    registerDesignSnippet('GS.superChangePassword', 'GS.superChangePassword', 'GS.superChangePassword();');
    
    registerDesignSnippet('GS.superUserLogin', 'GS.superUserLogin', 'GS.superUserLogin(${0:loggedInCallback});');
});

(function () {
    function changePassword(strLink, strRank) {
        GS.dialog({
            'header': 'Change ' + strRank + ' Password',
            'content': '<div style="padding: 1em;">' +
                       '    <div id="pword-error" style="color: #FF0000;"></div>' +
                       '    <label for="old-password">Old Password:</label>' +
                       '    <gs-text id="old-password" type="password"></gs-text>' +
                       '    <label for="new-password">New Password:</label>' +
                       '    <gs-text id="new-password" type="password"></gs-text>' +
                       '    <label for="new-password-confirm">Confirm New Password:</label>' +
                       '    <gs-text id="new-password-confirm" type="password"></gs-text>' +
                       '</div>',
            'buttons': '<gs-grid>' +
                       '    <gs-block><gs-button dialogclose value="cancel">Cancel</gs-button></gs-block>' +
                       '    <gs-block><gs-button id="button-change-password" disabled>Change ' + strRank + ' Password</gs-button></gs-block>' +
                       '</gs-grid>',
            'after_open': function() {
                var dialog = this, keydownHandler;
                
                keydownHandler = function (event) {
                    var intKeyCode = event.which || event.keyCode;
                    
                    if (intKeyCode === 13 &&
                        document.getElementById('old-password').value &&
                        document.getElementById('new-password').value &&
                        document.getElementById('new-password-confirm').value) {
                        GS.triggerEvent(document.getElementById('button-change-password'), 'click');
                        //GS.dialogClose(dialog, 'change');
                    } else {
                        if (document.getElementById('old-password').value &&
                            document.getElementById('new-password').value &&
                            document.getElementById('new-password-confirm').value) {
                            document.getElementById('button-change-password').removeAttribute('disabled');
                        } else {
                            document.getElementById('button-change-password').setAttribute('disabled');
                        }
                    }
                };
                
                document.getElementById('old-password').addEventListener('keydown', keydownHandler);
                document.getElementById('new-password').addEventListener('keydown', keydownHandler);
                document.getElementById('new-password-confirm').addEventListener('keydown', keydownHandler);
                
                document.getElementById('button-change-password').addEventListener('click', function () {
                    var newPassword, parameters;
                    
                    if (document.getElementById('new-password').value === document.getElementById('new-password-confirm').value) {
                        parameters = 'action=change_pw' +
                                    '&password_old=' + encodeURIComponent(document.getElementById('old-password').value) +
                                    '&password_new=' + encodeURIComponent(document.getElementById('new-password').value);
                        
                        document.getElementById('old-password').value = '';
                        document.getElementById('new-password').value = '';
                        document.getElementById('new-password-confirm').value = '';
                        
                        GS.ajaxJSON('/v1/' + strLink + '/auth', parameters, function (data, error) {
                            if (!error) {
                                GS.pushMessage('Password Successfully Changed', 1000);
                                GS.dialogClose(dialog, 'change');
                            } else {
                                document.getElementById('pword-error').textContent = data.error_text;
                            }
                        });
                    } else {
                        document.getElementById('pword-error').textContent = 'New Password Doesn\'t Match Confirm New Password.';
                    }
                });
            }
        });
    }
    
    GS.userChangePassword = function () {
        changePassword('env', 'User');
    };
    
    GS.superChangePassword = function () {
        changePassword('postage', 'SUPERUSER');
    };
})();

// check if the user is logged in as a superuser
// if there is no login dialog create it then open it
GS.superUserLogin = function (loggedInCallback, strOldError) {
    'use strict';
    
    // this action checks to see if we are logged in as a super user
    // if not, open a login dialog
    GS.ajaxJSON('/v1/env/action_info', '', function (data, error) {
        
        if (!error && data.dat && data.dat.superusername) {
            if (typeof loggedInCallback === 'function') {
                loggedInCallback(data.dat);
            }
        } else {
            GS.dialog({
                'header': 'Login as a Superuser',
                'content': 'You are not currently logged in as a superuser, please fill in the login form below.<br /><br />' +
                            '<label for="postage-uname">Username:</label>' +
                            '<gs-text id="postage-uname" autocapitalize="off" autocomplete="off" autocorrect="off"></gs-text>' +
                            '<label for="postage-pword">Password:</label>' +
                            '<gs-text id="postage-pword" type="password"></gs-text>' +
                            (strOldError ? '<br /><p>' + strOldError + '</p>' : ''),
                'padded': true,
                'autofocus': false,
                'buttons': ml(function () {/*
                                <gs-grid>
                                    <gs-block><gs-button dialogclose value="cancel">Cancel</gs-button></gs-block>
                                    <gs-block><gs-button id="postage-login" disabled>Log In</gs-button></gs-block>
                                </gs-grid>
                            */}),
                'after_open': function () {
                    var dialog = this;
                    
                    if (GS.getCookie('postage_uname')) {
                        document.getElementById('postage-uname').value = decodeURIComponent(GS.getCookie('postage_uname'));
                        document.getElementById('postage-pword').focus();
                    } else {
                        document.getElementById('postage-uname').focus();
                    }
                    
                    document.getElementById('postage-pword').addEventListener('keydown', function (event) {
                        var intKeyCode = event.which || event.keyCode;
                        
                        if (intKeyCode === 13) {
                            GS.triggerEvent(document.getElementById('postage-login'), 'click');
                        }
                        if (this.value) {
                            document.getElementById('postage-login').removeAttribute('disabled');
                        } else {
                            document.getElementById('postage-login').setAttribute('disabled', '');
                        }
                    });
                    
                    document.getElementById('postage-login').addEventListener('click', function () {
                        var strUserName = document.getElementById('postage-uname').value;
                        
                        if (document.getElementById('postage-pword').value) {
                            GS.addLoader('super-log-in', 'Logging In...');
                            
                            GS.ajaxJSON('/v1/postage/auth/', 'action=login&session_user=' + encodeURIComponent(GS.getCookie('greyspots_uname')) +
                                                                          '&superusername=' + encodeURIComponent(strUserName) +
                                                                          '&superpassword=' + encodeURIComponent(document.getElementById('postage-pword').value), function (data, error) {
                                GS.removeLoader('super-log-in');
                                GS.closeDialog(dialog, '');
                                
                                if (!error) {
                                    GS.setCookie('postage_uname', strUserName, 30);
                                    
                                    if (typeof loggedInCallback === 'function') {
                                        GS.superUserLogin(loggedInCallback);
                                    }
                                    
                                } else {
                                    GS.superUserLogin(loggedInCallback, data.error_text);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};