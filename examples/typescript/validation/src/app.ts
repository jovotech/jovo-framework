
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
        this.tell('name');
    },

    Unhandled() {
        this.tell('Unhandled!');
    }

});


export {app};
