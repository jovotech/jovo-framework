
import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);


app.setHandler({
    async LAUNCH() {
        return this.toIntent('GetFullAddressIntent');
        // return this.toIntent('GetCountryPostalCodeIntent');
    },
    async GetFullAddressIntent() {
        try {
            const address = await this.$alexaSkill!.$user.getDeviceAddress();
            console.log(address);
            return this.tell(`Hello`);
        } catch(error) {
            if (error.code === 'NO_USER_PERMISSION') {
                this.$alexaSkill!.showAskForAddressCard()
                    .tell(`Please grant access to your address.`);
            }
        }
    },
    async GetCountryPostalCodeIntent() {
        try {
            const countryAndPostalCode = await this.$alexaSkill!.$user.getCountryAndPostalCode();
            this.tell(`${countryAndPostalCode.postalCode} in ${countryAndPostalCode.countryCode}`);
        } catch(error) {
            console.log(error);
            if (error.code === 'NO_USER_PERMISSION') {
                this.$alexaSkill!.showAskForCountryAndPostalCodeCard()
                    .tell(`Please grant access to your address.`);
            }
        }
    },
});



export {app};
