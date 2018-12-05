const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { Dialogflow } = require('jovo-platform-dialogflow');
const { GoogleSheetsCMS, DefaultSheet } = require('jovo-cms-googlesheets');

const app = new App();

app.use(
    // new GoogleAssistant(),
    new Dialogflow(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
    new GoogleSheetsCMS()
);

app.setHandler({
    async LAUNCH(jovo) {
        return this.tell(this.$cms.t('WELCOME') + ' ' + this.$cms.config.foo + " - " + this.$cms.config2.bla);
    },
});


module.exports.app = app;
