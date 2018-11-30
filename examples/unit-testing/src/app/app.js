const {App, Alexa, GoogleAssistant} = require('jovo-framework');

const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa()
);


app.setHandler({
    LAUNCH() {
        this.toIntent('HelloWorldIntent');
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
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },

});
module.exports.app = app;
