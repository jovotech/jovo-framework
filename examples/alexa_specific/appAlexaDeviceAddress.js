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
        // app.toIntent('GetFullAddressIntent');
        this.toIntent('GetCountryPostalCodeIntent');
    },

    'GetFullAddressIntent': function() {
        this.user().getDeviceAddress()
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
});

module.exports.app = app;

