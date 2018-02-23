'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
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
});

module.exports.app = app;

