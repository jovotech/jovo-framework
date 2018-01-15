'use strict';

// =================================================================================
// App Configuration: Create Webhook + Enable Logging
// =================================================================================

const webhook = require('../../index').Webhook;
const app = require('../../index').Jovo;

// Enable Logging for Quick Testing
app.setConfig({
    requestLogging: true,
    responseLogging: true,
});

// Listen for post requests
webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


// =================================================================================
// App Logic: Get either full address or postal code
// =================================================================================

let handlers = {

    'LAUNCH': function() {
       // this.toIntent('GetFullAddressIntent');
       this.toIntent('GetCountryPostalCodeIntent');
    },

    'GetFullAddressIntent': function() {
        this.user().getAddress()
            .then((data) => {
                console.log(data);
                this.tell('Your address');
            }).catch((error) => {
            if (error.code === 'NO_USER_PERMISSION') {
                this.alexaSkill()
                    .showAskForAddressCard()
                    .tell('Please grant access to your address');
            }
        });
    },

    'GetCountryPostalCodeIntent': function() {
        this.user().getCountryAndPostalCode()
            .then((data) => {
                console.log(data);

                this.tell('Your address is ' + data.postalCode + ' in ' + data.countryCode);
            }).catch((error) => {
            console.log(error);
            if (error.code === 'NO_USER_PERMISSION') {
                this.alexaSkill()
                    .showAskForCountryAndPostalCodeCard()
                    .tell('Please grant access to your address');
            }
        });
    },
};
