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
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.addSessionAttribute('name', 'John Doe');
        this.ask('What\'s your name?', 'Tell me your name, please.');
    },

    'SessionIntent': function() {
        this.tell('Hello ' + this.getSessionAttribute('name'));
    },
});

module.exports.app = app;

// quick testing
// node index.js appSession.js --launch
// node node index.js appSession.js --intent SessionIntent --session name='John Doe'

