const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
// const { Dialogflow } = require('jovo-platform-dialogflow');
const { GoogleSheetsCMS, DefaultSheet } = require('jovo-cms-googlesheets');

const app = new App();

app.use(
    new GoogleAssistant(),
    // new Dialogflow(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
    new GoogleSheetsCMS()
);

app.setHandler({
    async LAUNCH(jovo) {
        // this.$speech.t('WELCOME');
        this.$speech.addT('WELCOME');
        return this.tell(this.$speech);
    },
});


module.exports.app = app;
