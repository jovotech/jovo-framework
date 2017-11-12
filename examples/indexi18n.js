'use strict';

// =================================================================================
// App Configuration: Create Webhook + Enable Logging + Language Resources Object
// =================================================================================

const webhook = require('../index').Webhook;
const app = require('../index').Jovo;

// Enable Logging for Quick Testing
app.setConfig({
    requestLogging: true,
    responseLogging: true,
});


let languageResources = {
    'en-US': {
        translation: {
            WELCOME: 'Welcome',
            WELCOME_WITH_PARAMETER: 'Welcome %s %s',
            WELCOME_ARRAY: ['Welcome', 'Hello'],
        },
    },
    'de-DE': {
        translation: {
            WELCOME: 'Willkommen',
            WELCOME_WITH_PARAMETER: 'Willkommen %s %s',
            WELCOME_ARRAY: ['Willkommen', 'Hey', 'Hallo'],
        },
    },
};
// Listen for post requests
webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

// extending i18next configuration with second parameter
app.setLanguageResources(languageResources, {returnObjects: true});

webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.setLanguageResources(languageResources);
    app.execute();
});


// =================================================================================
// App Logic:
// =================================================================================

let handlers = {

    'LAUNCH': function() {
        app.tell(app.t('WELCOME'));
    },

    'HelloWorldIntent': function() {
        app.tell(app.t('WELCOME_WITH_PARAMETER', 'John', 'Doe'));
    },

    'HelloWorldIntentWithArrays': function() {
        let sb = app.speechBuilder();
        sb.addText(app.t('WELCOME_ARRAY'));
        app.tell(sb);
    },
};


// quick testing
// node indexi18n.js --launch --locale de-DE
// node indexi18n.js --launch --locale en-US
// node indexi18n.js --intent HelloWorldIntent --locale en-US
