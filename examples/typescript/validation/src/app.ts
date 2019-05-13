
import { App } from 'jovo-framework';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import { Validation } from 'jovo-plugin-validation';


const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
    new Validation()
);

app.setHandler({
    LAUNCH() {
        console.log(this.t('WELCOME_GLOBAL'));

        this.toStateIntent('STATE', 'ExampleIntent');
    },

    MyNameIsIntent() {
        console.log('MyNameIsIntent called!');
        this.tell(`Hey ${this.$inputs.name.value}`);
    },

    MyNameIsIntentFailed() {
        this.tell('MyNameIsIntent failed.');
    },

    DayIntent() {
        this.tell(`${this.$inputs.day.value}, huh?`);
    },

    DayIntentFailed() {
        this.tell('DayIntent failed.');
    },

    Unhandled() {
        this.tell('Unhandled');
    },

    STATE: {
        ExampleIntent() {
            console.log('Example');
            this.ask('What is your name?');
        },

        MyNameIsIntent() {
            console.log('MyNameIsIntent called in STATE!');
            this.tell(`Hey ${this.$inputs.name.value}`);
        },

        MyNameIsIntentFailed() {
            this.tell('MyNameIsIntent failed in STATE.');
        },

        DayIntent() {
            this.tell(`STATE: ${this.$inputs.day.value}, huh?`);
        },

        DayIntentFailed() {
            this.tell('DayIntent failed in STATE.');
        },
    }

});


export { app };
