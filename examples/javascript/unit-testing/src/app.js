const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new FileDb(),
);


app.setHandler({
    LAUNCH() {
        this.$user.$data.foo = 'bar';

        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.followUpState('IntroductionState')
            .ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    'IntroductionState': {
        MyNameIsIntent() {

            this.toStatelessIntent('MyNameIsIntent');
        },

        // // Test fails if this is commented out
        // 'Unhandled': function(name) {
        //     this.ask('What\'s your name?');
        // },
    },

    MyNameIsIntent() {
        this.$user.$data.name = this.$inputs.name.value;
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },

    NameFromDbIntent() {
        const name = this.$user.$data.name;
        this.tell('Hey ' + name + ', nice to meet you!');
    },

    CheckPowerUserIntent() {
        const sessionsCount = this.$user.$metaData.sessionsCount;

        if (sessionsCount > 10) {
            this.tell('Hey buddy!');
        } else {
            this.tell('Hello sir!')
        }
    },

});
module.exports.app = app;
