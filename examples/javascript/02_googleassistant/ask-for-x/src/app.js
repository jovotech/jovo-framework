const {App} = require('jovo-framework');
const {GoogleAssistant} = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');

const app = new App();

app.use(
    new GoogleAssistant(),
    new JovoDebugger(),
);


app.setHandler({
    LAUNCH() {
        // return this.toIntent('AskForNameIntent');
        // return this.toIntent('AskForPreciseLocationIntent');
        // return this.toIntent('AskForZipCodeAndCityIntent');
        // return this.toIntent('AskForPermissionIntent');
        // return this.toIntent('AskForConfirmationIntent');
        return this.toIntent('AskForNameAndPreciseLocationIntent');
        // return this.toIntent('AskForPlaceIntent');
    },
    AskForNameIntent() {
        this.$googleAction.askForName('Pre name text');
    },

    AskForPreciseLocationIntent() {
        this.$googleAction.askForPreciseLocation('Pre precise location text');
    },

    AskForNameAndPreciseLocationIntent() {
        const permissions = ['NAME'];
        let context = 'To address you by name';
        if (this.$googleAction.isVerifiedUser()) {
            permissions.push('DEVICE_PRECISE_LOCATION');
            context += ' and your location';
        }
        return this.$googleAction.askForPermission(permissions, context);
    },

    AskForZipCodeAndCityIntent() {
        this.$googleAction.askForZipCodeAndCity('Pre zip location text');
    },
    AskForPermissionIntent() {
        this.$googleAction.askForPermission(['DEVICE_PRECISE_LOCATION', 'NAME'], 'Pre permissions text');
    },
    AskForSignInIntent() {
        this.$googleAction.askForSignIn('Pre sign in text');
    },
    AskForConfirmationIntent() {
        this.$googleAction.askForConfirmation('Is this correct?');
    },
    AskForPlaceIntent() {
        this.$googleAction.askForPlace('request prompt text', 'permission context');
    },
    ON_CONFIRMATION() {
        if (this.$googleAction.isConfirmed()) {
            this.tell('Confirmed')
        } else {
            this.tell('Not confirmed');
        }
    },
    async ON_SIGN_IN() {

        console.log('ON SIGN IN');
        if (this.$googleAction.isSignInOk()) {
            const res = await this.$googleAction.$user.getGoogleProfile();
            console.log(res);
            this.tell('Login successful');
        } else {
            this.tell('Login not successful');
        }

    },
    ON_PERMISSION() {

        if (this.$googleAction.isPermissionGranted()) {
            // this.tell('thanks ' + this.$googleAction.$user.getProfile());
            this.tell('thanks');
            console.log(this.$googleAction.getDevice());
        } else {
            this.tell('too bad');
        }
    },
    ON_PLACE() {
        console.log('ON_PLACE');
        const place = this.$googleAction.getPlace();
    }
});

module.exports.app = app;
