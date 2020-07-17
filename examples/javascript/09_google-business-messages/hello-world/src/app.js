'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { BusinessMessages } = require('jovo-platform-google-business-messages');
const { FileDb } = require('jovo-db-filedb');
const { NlpjsNlu } = require('jovo-nlu-nlpjs');

const app = new App();

const businessMessages = new BusinessMessages();
businessMessages.use(
    new NlpjsNlu({
        languages: ['en'],
    }),
)
app.use(
    businessMessages,
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        // console.log(this.$inputs);

        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});

module.exports.app = app;
