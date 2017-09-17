'use strict';

// =================================================================================
// App Configuration: Create Webhook + Enable Logging
// =================================================================================

const webhook = require('../index').Webhook;
const app = require('../index').Jovo;

// Enable Logging for Quick Testing
app.enableRequestLogging();
app.enableResponseLogging();

// Listen for post requests
webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


// =================================================================================
// App Logic: Displays Alexa-specific cards
// =================================================================================

let handlers = {

    'LAUNCH': function() {
        app.tell('App launched.');
    },

    'SimpleCardIntent': function() {
        app.alexaSkill().showSimpleCard('Title', 'Content');
        app.tell('This is a simple card.');
    },

    'StandardCardIntent': function() {
        app.alexaSkill().showStandardCard('Title', 'Content', {
            smallImageUrl: 'https://via.placeholder.com/720x480',
            largeImageUrl: 'https://via.placeholder.com/1200x800',
        });
        app.tell('This is a standard card with an image.');
    },

    'AccountLinkingCardIntent': function() {
        app.alexaSkill().showAccountLinkingCard();
        app.tell('This is a card with an account linking call to action.');
    },

    'AskForCountryAndPostalCodeCardIntent': function() {
        app.alexaSkill().showAskForCountryAndPostalCodeCard();
        app.tell('This is a card that asks for country and postal code permissions.');
    },

    'AskForAddressCardIntent': function() {
        app.alexaSkill().showAskForAddressCard();
        app.tell('This is a card that asks for address permissions.');
    },

    'AskForListPermissionCardIntent': function() {
        app.alexaSkill().showAskForListPermissionCard(['read', 'write']);
        app.tell('This is a card that asks for lists permissions.');
    },
};
