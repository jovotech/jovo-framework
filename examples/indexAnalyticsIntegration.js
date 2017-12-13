'use strict';

// =================================================================================
// App Configuration: Create Webhook + Enable Logging + Add Analytics
// =================================================================================

const webhook = require('../index').Webhook;
const app = require('../index').Jovo;

// Enable Logging for Quick Testing
app.setConfig({
    requestLogging: true,
    responseLogging: true,
    analytics: {
        services: {
            VoiceLabsAlexa: {
                key: '23b55e80-3e3f-11a7-2167-0e2486876586',
            },
            DashbotAlexa: {
                key: '6Idg1n3pCbk4bMh4XYubQVx5ckjVtuHctMND4sMM',
            },
        },
    },
});

// Add Analytics Integrations
// app.addVoiceLabsAlexa('23b55e80-3e3f-11a7-2167-0e2486876586');
// app.addVoiceLabsGoogleAction('228f1d00-5764-11a7-023a-0e2486876586');
// app.addDashbotGoogleAction('1T3ZonKcbNzLv6eFLBwI9Fv8JAU5SBVorCCvvD1D');
// app.addDashbotAlexa('6Idg1n3pCbk4bMh4XYubQVx5ckjVtuHctMND4sMM');
// app.addBespokenAnalytics('Bespoken secret key');
// Listen for post requests
webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


// =================================================================================
// App Logic: Hello World
// =================================================================================

let handlers = {

    'LAUNCH': function() {
        app.hasVideoInterface()
        app.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        app.tell('Hello World!');
    },
};
