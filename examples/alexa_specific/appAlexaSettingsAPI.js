'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');
const moment = require('moment-timezone');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('GetTimezoneIntent');
    },

    'GetTimezoneIntent': function() {
        this.user().getTimezone().then((timezone) => {
            this.tell(`Your timezone is ${timezone}`);
        }).catch((error) => {
        });
    },

    'GetLocalTimeIntent': function() {
        this.user().getTimezone().then((timezone) => {
            const now = moment.utc();
            const localTime = now.tz(timezone).format('ddd, MMM D, YYYY [at] h:mma');

            this.tell(`Your local time is ${localTime}`);
        }).catch((error) => {
        });
    },

    'GetDistanceUnitIntent': function() {
        this.user().getDistanceUnit().then((distanceUnit) => {
            this.tell(`Your distance measurement unit is ${distanceUnit}`);
        }).catch((error) => {
        });
    },

});

module.exports.app = app;

