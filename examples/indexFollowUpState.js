'use strict';

const webhook = require('../index').Webhook;

webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

const app = require('../index').Jovo;
app.enableRequestLogging();
app.enableResponseLogging();

// listen for post requests
webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


let handlers = {

    'LAUNCH': function() {
        app
            .followUpState('OnboardingState')
            .ask('Say hi', 'Say hello');
    },
    'HelloIntent': function() {
        app.tell('Welcome back!');
    },
    'OnboardingState': {
        'HelloIntent': function() {
            app.tell('Hey');
        },
    },
};

// quick test
// node indexFollowUpState.js -i HelloIntent -s OnboardingState
// node indexFollowUpState.js -i HelloIntent

