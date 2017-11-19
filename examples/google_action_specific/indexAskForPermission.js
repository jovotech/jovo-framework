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
        app.googleAction().askForName('Pre text');

        // or location coordinates (assistant on phone)
        // app.googleAction().askForPreciseLocation('Precise Location pre text');

        // or location zip and city (google home)
        // app.googleAction().askForZipCodeAndCity('Location pre text');
    },
    'ON_PERMISSION': function() {
        if (!app.googleAction().isPermissionGranted()) {
            app.tell('Too bad. Bye');
            return;
        }
        let requestUser = app.googleAction().getRequest().getUser();

        if (requestUser.permissions.indexOf('NAME') > -1) {
            app.tell('Hey ' + requestUser.profile.givenName);
        }

        if (requestUser.permissions.indexOf('DEVICE_COARSE_LOCATION') > -1) {
            let device = app.googleAction().getRequest().getDevice();
            console.log(device);
            app.tell('Thanks for your location');
        }
        if (requestUser.permissions.indexOf('DEVICE_PRECISE_LOCATION') > -1) {
            let device = app.googleAction().getRequest().getDevice();
            console.log(device);
            app.tell('Thanks for your precise location');
        }
    },
};
