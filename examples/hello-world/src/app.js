
const { App, Log, Util } = require('jovo-framework');
const { Jovo } = require('jovo-core');

const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { Dialogflow } = require('jovo-platform-dialogflow');

const app = new App();
Util.consoleLog();

app.use(
    new GoogleAssistant(),
    // new Dialogflow(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);


app.setHandler({
    async LAUNCH(jovo) {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this
            .followUpState('NameState')
            .ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },
    NameState: {
        MyNameIsIntent() {
            this.$user.$data.name = this.$inputs.name.value;
            return this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');

        },
    },
});


module.exports.app = app;
