'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const SimpleCard = require('../../index').AlexaSkill.SimpleCard;
const StandardCard = require('../../index').AlexaSkill.StandardCard;
const LinkAccountCard = require('../../index').AlexaSkill.LinkAccountCard;
const AskForListPermissionsCard = require('../../index').AlexaSkill.AskForListPermissionsCard;
const AskForLocationPermissionsCard = require('../../index').AlexaSkill.AskForLocationPermissionsCard;
const AskForContactPermissionsCard = require('../../index').AlexaSkill.AskForContactPermissionsCard;

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        // this.tell('App launched.');
        // this.toIntent('AskForCountryAndPostalCodeCardIntent');
        this.alexaSkill().showCard(
            new SimpleCard()
                .setTitle('Title')
                .setContent('Content')
        );
        this.tell('yo');
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
    'AskForContactPermissionCardIntent': function() {
        this.alexaSkill().showAskForContactPermissionCard(['name', 'email', 'mobile_number']);

        // or
        this.alexaSkill().showCard(
            new AskForContactPermissionsCard()
                .setAskForContactPermission(['name', 'email', 'mobile_number']));
        this.tell('This is a card that asks for contact data permissions.');
    },
});

module.exports.app = app;

// quick testing
// node .\index.js .\alexa_specific\appAlexaCards.js --launch
