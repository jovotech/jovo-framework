
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

app.$data.APP_SCOPE = 'APP_SCOPE';

app.setHandler({
    ON_REQUEST() {
        this.$data.REQUEST_SCOPE = 'REQUEST_SCOPE';
    },
    async LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        this.$session.$data.SESSION_SCOPE = 'SESSION_SCOPE';
        this.$user.$data.USER_DB_SCOPE = 'USER_DB_SCOPE';
        this
            .followUpState('NameState')
            .ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },
    NameState: {
        MyNameIsIntent() {
            this.$user.$data.name = this.$inputs.name.value;
            console.log(this.$app.$data.APP_SCOPE);
            console.log(this.$data.REQUEST_SCOPE);
            console.log(this.$user.$data.USER_DB_SCOPE);
            console.log(this.$session.$data.SESSION_SCOPE);

            return this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');

        },
    }
});


module.exports.app = app;
