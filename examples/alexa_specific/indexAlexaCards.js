'use strict';

// =================================================================================
// App Configuration: Create Webhook + Enable Logging
// =================================================================================

const webhook = require('../../index').Webhook;
const app = require('../../index').Jovo;

app.setConfig({
    requestLogging: true,
    responseLogging: true,
});

// Listen for post requests
webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});

const SimpleCard = require('../../index').AlexaSkill.SimpleCard;
const StandardCard = require('../../index').AlexaSkill.StandardCard;
const LinkAccountCard = require('../../index').AlexaSkill.LinkAccountCard;
const AskForListPermissionsCard = require('../../index').AlexaSkill.AskForListPermissionsCard;
const AskForLocationPermissionsCard = require('../../index').AlexaSkill.AskForLocationPermissionsCard;


// =================================================================================
// App Logic: Displays Alexa-specific cards
// =================================================================================

let handlers = {

    'LAUNCH': function() {
        // this.tell('App launched.');
        this.toIntent('AskForCountryAndPostalCodeCardIntent');
    },

    'SimpleCardIntent': function() {
        this.alexaSkill().showSimpleCard('Title', 'Content');

        // or

        this.alexaSkill().showCard(
            new SimpleCard()
            .setTitle('Title')
            .setContent('Content')
        );

        this.tell('This is a simple card');
    },

    'StandardCardIntent': function() {
        this.alexaSkill().showStandardCard('Title', 'Content', {
            smallImageUrl: 'https://via.placeholder.com/720x480',
            largeImageUrl: 'https://via.placeholder.com/1200x800',
        });

        // or
        this.alexaSkill().showCard(
            new StandardCard()
                .setTitle('Title')
                .setText('Text')
                .setSmallImageUrl('https://via.placeholder.com/720x480')
                .setLargeImageUrl('https://via.placeholder.com/720x480')
        );

        this.tell('This is a standard card with an image');
    },

    'AccountLinkingCardIntent': function() {
        this.alexaSkill().showAccountLinkingCard();
        // or
        this.alexaSkill().showCard(new LinkAccountCard());

        this.tell('This is a card with an account linking CTA');
    },

    'AskForCountryAndPostalCodeCardIntent': function() {
        this.alexaSkill().showAskForCountryAndPostalCodeCard();

        // or
        this.alexaSkill().showCard(
            new AskForLocationPermissionsCard().setAskForCountryAndPostalCodePermission());
        this.tell('This is a card that asks for country and postal code permissions.');
    },

    'AskForAddressCardIntent': function() {
        this.alexaSkill().showAskForAddressCard();

        // or
        this.alexaSkill().showCard(
            new AskForLocationPermissionsCard().setAskForAddressPermission());
        this.tell('This is a card that asks for address permissions.');
    },

    'AskForListPermissionCardIntent': function() {
        this.alexaSkill().showAskForListPermissionCard(['read', 'write']);

        // or
        this.alexaSkill().showCard(
            new AskForListPermissionsCard()
                .addReadPermission()
                .addWritePermission());
        this.tell('This is a card that asks for lists permissions.');
    },
};
