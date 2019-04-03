
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
    async LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        this.$session.$data.name = 'John Doe';

        this
            .addSessionAttribute('foo', 'bar')
            .ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },
    MyNameIsIntent() {


        return this.tell(`Session attribute values are ${this.$session.$data.name} and ${this.$session.$data.foo}`);
    },
});

export {app};
