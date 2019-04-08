'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { AirtableCMS } = require('jovo-cms-airtable');

const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
    new AirtableCMS()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        this.tell(this.$speech.t('welcome.speech'));
    },
});

module.exports.app = app;
