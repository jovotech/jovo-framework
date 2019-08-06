'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
);

const PHONE_NUMBER = require("../components/PHONE_NUMBER");

app.useComponents(new PHONE_NUMBER());

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.delegate('PHONE_NUMBER', 'CompletedIntent');
    },
    CompletedIntent() {
        console.log(this.$components.PHONE_NUMBER.$response);
        this.tell('completed!');
    }
});

module.exports.app = app;
