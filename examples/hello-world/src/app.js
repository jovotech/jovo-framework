
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
    async LAUNCH() {
        this.ask('How can I help you?')

    },

    HelpIntent()  {
        this.showImageCard('Title', 'Content', 'https://www.icone-png.com/png/18/18221.png')
            .tell('Bla Bla');
    },

    HelloWorldIntent() {
        this.showImageCard('Title', 'Content', 'https://www.icone-png.com/png/18/18221.png')
            .tell('Bla Bla');
    },
    NameState: {
        GuessMovieIntent() {
            this.$user.$data.name = this.$inputs.name.value;
            this.showImageCard('Title', 'Content', 'https://www.icone-png.com/png/18/18221.png')
                .tell('Bla Bla', 'Bla Bla');



        },
    },
});


module.exports.app = app;
