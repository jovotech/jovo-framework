
const { App } = require('jovo-framework');

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

app.hook('before.platform.output', async (error, host, jovo) => {
    const pollyName = 'Hans';
    if (jovo.isAlexaSkill()) {
        if (jovo.$output.tell) {
            jovo.$output.tell.speech = `<voice name="${pollyName}">${jovo.$output.tell.speech}</voice>`;
        }

        if (jovo.$output.ask) {
            jovo.$output.ask.speech = `<voice name="${pollyName}">${jovo.$output.ask.speech}</voice>`;
            jovo.$output.ask.reprompt = `<voice name="${pollyName}">${jovo.$output.ask.reprompt}</voice>`;
        }
    }
});


// use next() in callbacks
app.hook('after.request', (error, host, jovo, next) => {
    setTimeout(() => {
        // do stuff
        console.log('setTimeout');
        next();
    }, 1000)
});



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
