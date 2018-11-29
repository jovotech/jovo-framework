const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();


app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);


app.setHandler({
    LAUNCH() {
        // this.$speech.t('WELCOME_ARRAY');
        this.tell(this.t('WELCOME'));
    },
});

module.exports.app = app;
