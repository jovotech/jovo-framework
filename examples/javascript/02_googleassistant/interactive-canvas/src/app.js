const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');

const app = new App();

app.use(
    new GoogleAssistant(),
    new JovoDebugger()
);
const WEBAPP_URL = '';


app.setHandler({
    async LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        this.$googleAction.htmlResponse({
            url: WEBAPP_URL,
            data: {
                state: 'HelloWorldIntent',
                text: 'Hello World! What\'s your name?',
            },
        });
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },
    MyNameIsIntent() {
        this.$googleAction.htmlResponse({
            url: WEBAPP_URL,
            data: {
                state: 'MyNameIsIntent',
                text: 'Hey ' + this.$inputs.name.value + ', nice to meet you!',
            }
        });
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});


module.exports.app = app;
