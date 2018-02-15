// quick testing
// node indexInputs.js --intent NameIntent --parameter name=John


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
        this.ask('What\'s your name?', 'Tell me your name, please.');
    },

    'NameIntent': function(name) {
        this.tell('Hello ' + name.value);
    },

    'NameIntentObject': function() {
        let name = this.getInput('name');
        this.tell('Hello ' + name.value);
    },
});

module.exports.app = app;

// quick testing
// node index.js appInputs.js --intent NameIntent --parameter name=John
// node index.js appInputs.js --intent NameIntentObject --parameter name=John

