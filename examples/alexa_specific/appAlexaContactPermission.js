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
        this.toIntent('GetFullNameIntent');
    },

    'GetFullNameIntent': function() {
        this.user().getName().then((name) => {
            this.tell(`Hello ${name}`);
        }).catch((error) => {
            if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForContactPermissionCard('name')
                .tell(`Please grant access to your full name.`);
            }
        });
    },

    'GetGivenNameIntent': function() {
        this.user().getGivenName().then((givenName) => {
            this.tell(`Hello ${givenName}`);
        }).catch((error) => {
            if (error.code === 'NO_USER_PERMISSION') {
                this.alexaSkill().showAskForContactPermissionCard('given-name')
                    .tell(`Please grant access to your given name.`);
            }
        });
    },

    'GetEmailIntent': function() {
        this.user().getEmail().then((email) => {
            this.tell(`Your email is ${email}`);
        }).catch((error) => {
            if (error.code === 'NO_USER_PERMISSION') {
                this.alexaSkill().showAskForContactPermissionCard('email')
                    .tell(`Please grant access to your email address.`);
            }
        });
    },

    'GetMobileNumberIntent': function() {
        this.user().getMobileNumber().then((mobileNumber) => {
            this.tell(`Your number is ${mobileNumber.countryCode} ${mobileNumber.phoneNumber}`);
        }).catch((error) => {
            if (error.code === 'NO_USER_PERMISSION') {
                this.alexaSkill().showAskForContactPermissionCard('mobile_number')
                    .tell(`Please grant access to your mobile number.`);
            }
        });
    },
});

module.exports.app = app;

