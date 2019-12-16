const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { GoogleSheetsCMS, DefaultSheet } = require('jovo-cms-googlesheets');

const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
    new GoogleSheetsCMS()
);

app.middleware('setup').use((handleRequest) => {


});

app.setHandler({
    async LAUNCH(jovo) {
        this.$speech.addText(this.$cms.t('WELCOME'));

        this.$config.

        console.log(this.$cms.testSheet);
        return this.tell(this.$speech);
    },
});


module.exports.app = app;
