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

const GetPhoneNumber = require("./components/jovo-component-get-phone-number");

app.useComponents(new GetPhoneNumber());

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        return this.delegate('GetPhoneNumber', {
            onCompletedIntent: 'CompletedIntent'
        });
    },
    CompletedIntent() {
        console.log(this.$components.GetPhoneNumber.$response);
        return this.tell('completed!');
    }
});

module.exports.app = app;
