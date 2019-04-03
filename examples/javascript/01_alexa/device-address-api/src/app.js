const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const app = new App();

app.use(
    new Alexa()
);


app.setHandler({
    async LAUNCH() {
        return this.toIntent('GetFullAddressIntent');
        // return this.toIntent('GetCountryPostalCodeIntent');
    },
    async GetFullAddressIntent() {
        try {
            const address = await this.$alexaSkill.$user.getDeviceAddress();
            console.log(address);
            return this.tell(`Hello`);
        } catch(error) {
            if (error.code === 'NO_USER_PERMISSION') {
                this.$alexaSkill.showAskForAddressCard()
                    .tell(`Please grant access to your address.`);
            }
        }
    },
    async GetCountryPostalCodeIntent() {
        try {
            const countryAndPostalCode = await this.$alexaSkill.$user.getCountryAndPostalCode();
            this.tell(`${countryAndPostalCode.postalCode} in ${countryAndPostalCode.countryCode}`);
        } catch(error) {
            console.log(error);
            if (error.code === 'NO_USER_PERMISSION') {
                this.$alexaSkill.showAskForCountryAndPostalCodeCard()
                    .tell(`Please grant access to your address.`);
            }
        }
    },
});


module.exports.app = app;
