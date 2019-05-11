
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

        this.tell(this.t('WELCOME'));
    },

    MyNameIsIntent() {
        console.log('MyNameIsIntent called!');
        this.tell(`Hey ${this.$inputs.name.value}`);
    },

    Unhandled() {
        this.tell('InvalidValues failed!');
    },

    STATE: {
        Unhandled() {
            this.tell('Function failed!');
        },

        SecondUnhandled() {
            this.tell('IsRequired failed!');
        }
    }

});


export { app };
