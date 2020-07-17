'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { GoogleBusiness } = require('jovo-platform-googlebusiness');
const { FileDb } = require('jovo-db-filedb');
const { NlpjsNlu } = require('jovo-nlu-nlpjs');

const app = new App();

const googleBusiness = new GoogleBusiness();
googleBusiness.use(
    new NlpjsNlu({
        languages: ['en'],
    }),
)
app.use(
    googleBusiness,
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
