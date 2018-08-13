'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: false,
    analytics: {
        services: {
            DashbotAlexa: {
                key: '<key>',
            },
        },
    },
};

const app = new App(config);

app.addVoiceLabsAlexa('<key>');
// app.addVoiceLabsGoogleAction('<key>');
// app.addDashbotGoogleAction('<key>');
// app.addDashbotAlexa('<key>');
// app.addBespokenAnalytics('Bespoken secret key');
// app.addChatbaseAnalytics('<key>', 'version');
// app.addBotanalyticsAlexa('<key>');
// app.addBotanalyticsGoogleAction('<key>');
// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.tell('Hello World!');
    },
});

module.exports.app = app;

// quick testing
// node index.js appHelloWorld.js --launch
// node index.js appHelloWorld.js --intent MyNameIsIntent --parameter name=Alex

