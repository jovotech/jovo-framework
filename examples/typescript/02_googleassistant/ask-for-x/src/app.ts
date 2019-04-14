
import { App } from 'jovo-framework';


import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();
app.use(
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);

app.setHandler({
    LAUNCH() {
        // return this.toIntent('AskForNameIntent');
        // return this.toIntent('AskForPreciseLocationIntent');
        return this.toIntent('AskForZipCodeAndCityIntent');
        // return this.toIntent('AskForPermissionIntent');
        // return this.toIntent('AskForConfirmationIntent');
        // return this.toIntent('AskForSignInIntent');
        // return this.toIntent('AskForPlaceIntent');
    },
    AskForNameIntent() {
        this.$googleAction!.askForName('Pre name text');
    },
    AskForPreciseLocationIntent() {
        this.$googleAction!.askForPreciseLocation('Pre precise location text');
    },
    AskForZipCodeAndCityIntent() {
        this.$googleAction!.askForZipCodeAndCity('Pre zip location text');
    },
    AskForPermissionIntent() {
        this.$googleAction!.askForPermission(['DEVICE_PRECISE_LOCATION', 'NAME'], 'Pre permissions text');
    },
    AskForSignInIntent() {
        this.$googleAction!.askForSignIn('Pre sign in text');
    },
    AskForConfirmationIntent() {
        this.$googleAction!.askForConfirmation('Is this correct?');
    },
    AskForPlaceIntent() {
        this.$googleAction!.askForPlace('request prompt text', 'permission context');
    },
    ON_CONFIRMATION() {
        if (this.$googleAction!.isConfirmed()) {
            this.tell('Confirmed');
        } else {
            this.tell('Not confirmed');
        }
    },
    ON_SIGN_IN() {

        console.log('ON SIGN IN');
        if (this.$googleAction!.isSignInOk()) {
            this.tell('Login successful');
        } else {
            this.tell('Login not successful');
        }
    },
    ON_PERMISSION() {

        if (this.$googleAction!.isPermissionGranted()) {
            // this.tell('thanks ' + this.$googleAction.$user.getProfile());
            this.tell('thanks');
            console.log(this.$googleAction!.getDevice());
        } else {
            this.tell('too bad');
        }
    },
    ON_PLACE() {
        console.log('ON_PLACE');
        const place = this.$googleAction!.getPlace();
    }
});

export {app};
