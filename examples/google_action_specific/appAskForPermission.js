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
        this.googleAction().askForName('Pre text');

        // or location coordinates (assistant on phone)
        // this.googleAction().askForPreciseLocation('Precise Location pre text');

        // or location zip and city (google home)
        // this.googleAction().askForZipCodeAndCity('Location pre text');

        // ask for more than one permission
        // this.googleAction().askForPermissions([
        //     'NAME', 'DEVICE_PRECISE_LOCATION',
        // ], 'Give me your data!');
    },
    'ON_PERMISSION': function() {
        if (!this.googleAction().isPermissionGranted()) {
            this.tell('Too bad. Bye');
            return;
        }
        let requestUser = this.googleAction().getRequest().getUser();

        if (requestUser.permissions.indexOf('DEVICE_PRECISE_LOCATION') > -1 &&
            requestUser.permissions.indexOf('NAME') > -1) {
            let device = this.googleAction().getRequest().getDevice();
            console.log(device);
            this.tell('Hey ' + requestUser.profile.givenName + '.Thanks for your location');
            return;
        }
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
});

module.exports.app = app;
