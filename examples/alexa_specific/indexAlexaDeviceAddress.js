'use strict';

const webhook = require('../../index').Webhook;

webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

const app = require('../../index').Jovo;
app.enableRequestLogging();
app.enableResponseLogging();

// listen for post requests
webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


let handlers = {

    'LAUNCH': function() {
       // app.toIntent('GetFullAddressIntent');
       app.toIntent('GetCountryPostalCodeIntent');
    },
    'GetFullAddressIntent': function() {
        app.user().getAddress()
            .then((data) => {
                console.log(data);
                app.tell('Your address');
            }).catch((error) => {
            if (error.code === 'NO_USER_PERMISSION') {
                app
                    .showAskForAddressCard()
                    .tell('Please grant access to your address');
            }
        });
    },
    'GetCountryPostalCodeIntent': function() {
        app.user().getCountryAndPostalCode()
            .then((data) => {
                console.log(data);
                app.tell('Your address');
            }).catch((error) => {
            console.log(error);
            if (error.code === 'NO_USER_PERMISSION') {
                app
                    .showAskForCountryAndPostalCodeCard()
                    .tell('Please grant access to your address');
            }
        });
    },
};
