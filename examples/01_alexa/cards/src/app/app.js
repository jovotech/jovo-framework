const {App} = require('jovo-framework');
const {
    Alexa,
    SimpleCard,
    StandardCard,
    LinkAccountCard,
    AskForListPermissionsCard} = require('jovo-platform-alexa');

const app = new App();

app.use(
    new Alexa()
);


app.setHandler({
    LAUNCH() {
        // this.toIntent('SimpleCardIntent');
        // this.toIntent('StandardCardIntent');
        // this.toIntent('AccountLinkingCard');
        // this.toIntent('AskForCountryAndPostalCodeCardIntent');
        // this.toIntent('AskForAddressCardIntent');
        // this.toIntent('AskForListPermissionCardIntent');
        this.toIntent('AskContactPermissionCardIntent');
    },
    SimpleCardIntent() {
        return this.$alexaSkill
            .showCard(new SimpleCard().setTitle('Title').setContent('Content'))
            .tell('Simple Card');
    },
    StandardCardIntent() {
        return this.$alexaSkill
            .showCard(
                new StandardCard()
                    .setTitle('Title')
                    .setText('Text')
                    .setSmallImageUrl('https://via.placeholder.com/720x480')
                    .setLargeImageUrl('https://via.placeholder.com/720x480')
            ).tell('Standard Card');
    },
    AccountLinkingCard() {
        // return this.showAccountLinkingCard().tell('AccountLinking Card');
        // or
        return this.$alexaSkill
            .showCard(
                new LinkAccountCard()
            ).tell('AccountLinking Card');
    },
    AskForCountryAndPostalCodeCardIntent() {
        return this.$alexaSkill
            .showAskForCountryAndPostalCodeCard()
            .tell('This is a card that asks for country and postal code permissions.');
    },
    AskForAddressCardIntent() {
        return this.$alexaSkill
            .showAskForAddressCard()
            .tell('This is a card that asks for address permissions.');
    },
    AskForListPermissionCardIntent() {
        this.$alexaSkill.showAskForListPermissionCard(['read', 'write']);
        this.tell('This is a card that asks for lists permissions.');
    },
    AskContactPermissionCardIntent() {
        const permissions = [
            'name',
            'email',
            'mobile_number',
            // 'given_name'
        ];
        this.$alexaSkill.showAskForContactPermissionCard(permissions);
        this.tell('This is a card that asks for contact permissions.');
    },
});


module.exports.app = app;
