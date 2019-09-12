
import { App, Project } from 'jovo-framework';


import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb(),
);

const WEBAPP_URL = '';

app.setHandler({

    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        this.$googleAction!.htmlResponse({
            url: WEBAPP_URL,
            data: {
                state: 'HelloWorldIntent',
                text: 'Hello World! What\'s your name?',
            },
        });
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        this.$googleAction!.htmlResponse({
            url: WEBAPP_URL,
            data: {
                state: 'MyNameIsIntent',
                text: 'Hey ' + this.$inputs.name.value + ', nice to meet you!',
            }
        });
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});


export {app};
