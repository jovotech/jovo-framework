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
        // app.tell('App launched.');
        app.toIntent('AskForCountryAndPostalCodeCardIntent');
    },

    'SimpleCardIntent': function() {
        app.alexaSkill().showSimpleCard('Title', 'Content');

        // or

        app.alexaSkill().showCard(
            new SimpleCard()
            .setTitle('Title')
            .setContent('Content')
        );

        app.tell('This is a simple card');
    },

    'StandardCardIntent': function() {
        app.alexaSkill().showStandardCard('Title', 'Content', {
            smallImageUrl: 'https://via.placeholder.com/720x480',
            largeImageUrl: 'https://via.placeholder.com/1200x800',
        });

        // or
        app.alexaSkill().showCard(
            new StandardCard()
                .setTitle('Title')
                .setText('Text')
                .setSmallImageUrl('https://via.placeholder.com/720x480')
                .setLargeImageUrl('https://via.placeholder.com/720x480')
        );

        app.tell('This is a standard card with an image');
    },

    'AccountLinkingCardIntent': function() {
        app.alexaSkill().showAccountLinkingCard();
        // or
        app.alexaSkill().showCard(new LinkAccountCard());

        app.tell('This is a card with an account linking CTA');
    },

    'AskForCountryAndPostalCodeCardIntent': function() {
        app.alexaSkill().showAskForCountryAndPostalCodeCard();

        // or
        app.alexaSkill().showCard(
            new AskForLocationPermissionsCard().setAskForCountryAndPostalCodePermission());
        app.tell('This is a card that asks for country and postal code permissions.');
    },

    'AskForAddressCardIntent': function() {
        app.alexaSkill().showAskForAddressCard();

        // or
        app.alexaSkill().showCard(
            new AskForLocationPermissionsCard().setAskForAddressPermission());
        app.tell('This is a card that asks for address permissions.');
    },

    'AskForListPermissionCardIntent': function() {
        app.alexaSkill().showAskForListPermissionCard(['read', 'write']);

        // or
        app.alexaSkill().showCard(
            new AskForListPermissionsCard()
                .addReadPermission()
                .addWritePermission());
        app.tell('This is a card that asks for lists permissions.');
    },
};
