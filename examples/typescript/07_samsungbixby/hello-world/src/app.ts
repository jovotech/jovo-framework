import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { Bixby } from 'jovo-platform-bixby';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
    new Alexa(),
    new Bixby(),
    new JovoDebugger(),
    new FileDb(),
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

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

// ------------------------------------------------------------------
// BIXBY-SPECIFIC APP LOGIC
// ------------------------------------------------------------------

app.setBixbyHandler({
    HelloWorldIntent() {
        this.ask('Welcome to Bixby! What\'s your name?');
    }
});

export { app };
