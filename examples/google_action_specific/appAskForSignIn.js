'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        // works currently only on google assistant on phone
        // this.ask('bla?', 'bla?');
        this.googleAction().askForSignIn();
        // this.tell('hallo');
    },
    'ParameterIntent': function() {
        if (!this.getAccessToken()) {
            this.googleAction().askForSignIn();
            return;
        }
    },
    'ON_SIGN_IN': function() {
        if (this.googleAction().getSignInStatus() === 'CANCELLED') {
            this.tell('Please sign in.');
        } else if (this.googleAction().getSignInStatus() === 'ERROR') {
            this.tell('Something went wrong.');
        } else if (this.googleAction().getSignInStatus() === 'OK') {
            this.tell('You are signed in now.');
        }
    },
});

module.exports.app = app;

