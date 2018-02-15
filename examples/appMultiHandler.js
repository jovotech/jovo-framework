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

const handlers = {
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },
};

const alexaHandlers = {

    'HelloWorldIntent': function() {
        this.tell('Hello Alexa User');
    },
};

const googleActionHandlers = {

    'HelloWorldIntent': function() {
        this.tell('Hello Google User');
    },
};

app.setHandler(handlers);
app.setAlexaHandler(alexaHandlers);
app.setGoogleActionHandler(googleActionHandlers);

module.exports.app = app;

// quick testing
// node index.js appMultiHandler.js --launch

