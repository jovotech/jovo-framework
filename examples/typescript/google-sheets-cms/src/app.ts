
import { App } from 'jovo-framework';


import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import { GoogleSheetsCMS } from 'jovo-cms-googlesheets';


const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
    new GoogleSheetsCMS()

);

app.setHandler({
    LAUNCH() {
        this.$speech.addText(this.$cms.t('WELCOME'));

        console.log(this.$cms.testSheet);

        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});


export {app};
