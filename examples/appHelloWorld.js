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
        this.ask('Hello World! What is your name?', 'Please tell me your name.');
    },
    'MyNameIsIntent': function(name) {
        this.tell('Hey ' + name.value + ', nice to meet you!');
    },
});

module.exports.app = app;

// quick testing
// node index.js appHelloWorld.js --launch
// node index.js appHelloWorld.js --intent MyNameIsIntent --parameter name=Alex

