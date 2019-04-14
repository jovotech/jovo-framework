
import { App } from 'jovo-framework';


import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
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
        const sessionsCount = this.$user.$metaData.sessionsCount as number;

        if (sessionsCount > 10) {
            this.tell('Hey buddy!');
        } else {
            this.tell('Hello sir!');
        }
    },

});


export {app};
