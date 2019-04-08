const {App} = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const app = new App();


app.use(
    new GoogleAssistant(),
    new Alexa()
);

app.setHandler({
    async LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        this.$session.$data.name = 'John Doe';

        this
            .addSessionAttribute('foo', 'bar')
            .ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },
    MyNameIsIntent() {


        return this.tell(`Session attribute values are ${this.$session.$data.name} and ${this.$session.$data.foo}`);
    },
});

module.exports.app = app;
