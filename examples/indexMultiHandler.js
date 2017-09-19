'use strict';

const webhook = require('../index').Webhook;

webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

const app = require('../index').Jovo;
app.setConfig({
    requestLogging: true,
    responseLogging: true,
});

// listen for post requests
webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.setAlexaHandler(alexaHandlers);
    app.setGoogleActionHandler(googleActionHandlers);
    app.execute();
});

const handlers = {
    'LAUNCH': function() {
        app.toIntent('HelloWorldIntent');
    },
};

const alexaHandlers = {

    'HelloWorldIntent': function() {
        app.tell('Hello Alexa User');
    },
};

const googleActionHandlers = {

    'HelloWorldIntent': function() {
        app.tell('Hello Google User');
    },
};
