const {App} = require('jovo-framework');
const {GoogleAssistant} = require('jovo-platform-googleassistant');

const app = new App();

app.use(
    new GoogleAssistant()
);


app.setHandler({
    LAUNCH() {
        // this.toIntent('AskForNameIntent');
        // this.toIntent('AskForPreciseLocationIntent');
        // this.toIntent('AskForZipCodeAndCityIntent');
        // this.toIntent('AskForPermissionIntent');
        this.toIntent('AskForConfirmationIntent');
        // this.toIntent('AskForSignInIntent');
    },
    AskForNameIntent() {
        this.$googleAction.askForName('Pre name text');
    },
    AskForPreciseLocationIntent() {
        this.$googleAction.askForPreciseLocation('Pre precise location text');
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
    ON_CONFIRMATION() {
        if (this.$googleAction.isConfirmed()) {
            this.tell('Confirmed')
        } else {
            this.tell('Not confirmed');
        }
    },
    ON_SIGN_IN() {
        if (this.$googleAction.isSignInOk()) {
            this.tell('Login successful')
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
});

module.exports.app = app;
