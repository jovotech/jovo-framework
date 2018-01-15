'use strict';

const webhook = require('../../index').Webhook;

webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

const app = require('../../index').Jovo;

app.setConfig({
    requestLogging: true,
    responseLogging: true,
});

// listen for post requests
webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


let handlers = {

    'LAUNCH': function() {
        // works currently only on google assistant on phone
        this.googleAction().askForSignIn();
    },
    'ON_SIGN_IN': function() {
        if (this.googleAction().getSignInStatus() === 'CANCELLED') {
           this.tell('Please sign in.');
        } else if (this.googleAction().getSignInStatus() === 'OK') {
            console.log(this.getAccessToken());
            this.tell('You are signed in now.');
        }
    },
};
