'use strict';

// =================================================================================
// App Configuration: Create Webhook + Enable Logging + Add Analytics
// =================================================================================

const webhook = require('../index').Webhook;
const app = require('../index').Jovo;

// Enable Logging for Quick Testing
app.enableRequestLogging();
app.enableResponseLogging();

// Add Analytics Integrations
app.addVoiceLabsAlexa('Voicelabs Alexa Key');
app.addVoiceLabsGoogleAction('Voicelabs Google Action Key');
app.addDashbotGoogleAction('Dashbot Google Action Key');
app.addDashbotAlexa('Dashbot Alexa Key');

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
        app.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        app.tell('Hello World!');
    },
};
