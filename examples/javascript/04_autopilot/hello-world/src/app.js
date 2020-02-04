'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { Autopilot } = require('jovo-platform-twilioautopilot');

const app = new App();

app.use(
    new Autopilot(),
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
        this.ask('Hello World! What\'s your name?');
    },

    MyNameIsIntent() {
        return this.$autopilotBot.setActions([
            {
              say: `Hi ${this.$inputs.name.value}! I'm Jaimie your new Assistant. How can I help you?`
            },
            {
              play: {
                loop: 2,
                url: 'https://api.twilio.com/cowbell.mp3'
              }
            },
            {
              redirect: 'task://customer-satisfaction-survey'
            }
        ]);
    },
});

module.exports.app = app;
