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
        this.tell(this.$cms.t('WELCOME'));
        
        // console.log(this.$cms.test2);
        
    },
});

module.exports.app = app;
