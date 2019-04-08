
import { App } from 'jovo-framework';
import { Host, Jovo, JovoError} from 'jovo-core';


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

app.hook('before.platform.output', async (error: JovoError, host: Host, jovo: Jovo) => {
    const pollyName = 'Hans';
    if (jovo.isAlexaSkill()) {
        if (jovo.$output.tell) {
            jovo.$output.tell.speech = `<voice name="${pollyName}">${jovo.$output.tell.speech}</voice>`;
        }

        if (jovo.$output.ask) {
            jovo.$output.ask.speech = `<voice name="${pollyName}">${jovo.$output.ask.speech}</voice>`;
            jovo.$output.ask.reprompt = `<voice name="${pollyName}">${jovo.$output.ask.reprompt}</voice>`;
        }
    }
});

// use next() in callbacks
app.hook('after.request', (error: JovoError, host: Host, jovo: Jovo, next: Function) => {
    setTimeout(() => {
        // do stuff
        console.log('setTimeout');
        next();
    }, 1000);
});


app.setHandler({
    LAUNCH() {
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
