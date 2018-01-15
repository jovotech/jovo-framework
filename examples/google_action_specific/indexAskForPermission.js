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
        this.googleAction().askForName('Pre text');

        // or location coordinates (assistant on phone)
        // this.googleAction().askForPreciseLocation('Precise Location pre text');

        // or location zip and city (google home)
        // this.googleAction().askForZipCodeAndCity('Location pre text');
    },
    'ON_PERMISSION': function() {
        if (!this.googleAction().isPermissionGranted()) {
            this.tell('Too bad. Bye');
            return;
        }
        let requestUser = this.googleAction().getRequest().getUser();

        if (requestUser.permissions.indexOf('NAME') > -1) {
            this.tell('Hey ' + requestUser.profile.givenName);
        }

        if (requestUser.permissions.indexOf('DEVICE_COARSE_LOCATION') > -1) {
            let device = this.googleAction().getRequest().getDevice();
            console.log(device);
            this.tell('Thanks for your location');
        }
        if (requestUser.permissions.indexOf('DEVICE_PRECISE_LOCATION') > -1) {
            let device = this.googleAction().getRequest().getDevice();
            console.log(device);
            this.tell('Thanks for your precise location');
        }
    },
};
