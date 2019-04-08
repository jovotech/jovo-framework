const {App} = require('jovo-framework');
const {
    Alexa} = require('jovo-platform-alexa');

const app = new App();

app.use(
    new Alexa()
);


app.setHandler({
    async LAUNCH() {
        return this.toIntent('GetFullNameIntent');
        // return this.toIntent('GetGivenNameIntent');
        // return this.toIntent('GetEmailIntent');
        // return this.toIntent('GetMobileNumberIntent');
    },
    async GetFullNameIntent() {
        try {
            const name = await this.$alexaSkill.$user.getName();
            return this.tell(`Hello ${name}`);
        } catch(error) {
            if (error.code === 'NO_USER_PERMISSION') {
                this.$alexaSkill.showAskForContactPermissionCard(['name'])
                    .tell(`Please grant access to your full name.`);
            }
        }
    },
    async GetGivenNameIntent() {
        try {
            const givenName = await this.$alexaSkill.$user.getGivenName();
            this.tell(`Hello ${givenName}`);
        } catch(error) {
            if (error.code === 'NO_USER_PERMISSION') {
                this.$alexaSkill.showAskForContactPermissionCard(['given_name'])
                    .tell(`Please grant access to your given name.`);
            }
        }
    },
    async GetEmailIntent() {
        try {
            const email = await this.$alexaSkill.$user.getEmail();
            return this.tell(`Your email is ${email}`);
        } catch(error) {
            if (error.code === 'NO_USER_PERMISSION') {
                this.$alexaSkill.showAskForContactPermissionCard(['email'])
                    .tell(`Please grant access to your email address.`);
            }
        }
    },
    async GetMobileNumberIntent() {
        try {
            const mobileNumber = await this.$alexaSkill.$user.getMobileNumber();
            this.tell(`Your number is ${mobileNumber.countryCode} ${mobileNumber.phoneNumber}`);
        } catch(error) {
            if (error.code === 'NO_USER_PERMISSION') {
                this.$alexaSkill.showAskForContactPermissionCard(['mobile_number'])
                    .tell(`Please grant access to your mobile number.`);
            }
        }
    },
});


module.exports.app = app;
