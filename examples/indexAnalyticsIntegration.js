'use strict';

const webhook = require('../index').Webhook;

webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

const app = require('../index').Jovo;
app.enableRequestLogging();
app.enableResponseLogging();
app.addVoiceLabsAlexa('Voicelabs Alexa Key');
app.addVoiceLabsGoogleAction('Voicelabs Google Action Key');
app.addDashbotGoogleAction('Dashbot Google Action Key');
app.addDashbotAlexa('Dashbot Alexa Key');

app.setIntentMap({
    'AMAZON.HelpIntent': 'HelpIntent',

});

// listen for post requests
webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


let handlers = {

    'LAUNCH': function() {
        app.toIntent('HelloWorld');
    },
    'HelloWorld': function() {
        app.tell('Hey');
    },
};
