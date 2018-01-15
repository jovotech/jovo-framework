'use strict';

// =================================================================================
// App Configuration: Create Webhook + Enable Logging
// =================================================================================

const webhook = require('../index').Webhook;
const app = require('../index').Jovo;

// Enable Logging for Quick Testing
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


// =================================================================================
// App Logic: Say hey when in OnboardingState
// =================================================================================

let handlers = {

    'LAUNCH': function() {
        this
            .followUpState('OnboardingState')
            .ask('Say hi', 'Say hello');
    },

    'HelloWorldIntent': function() {
        this.tell('Welcome back!');
    },

    'OnboardingState': {
        'HelloWorldIntent': function() {
            this.followUpState(null).ask('Hey', 'Hello');
        },
    },
};

// quick test
// node indexFollowUpState.js -i HelloIntent -s OnboardingState
// node indexFollowUpState.js -i HelloIntent

