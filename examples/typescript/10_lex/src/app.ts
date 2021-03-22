import { App } from 'jovo-framework';


import { JovoDebugger } from 'jovo-plugin-debugger';
import { Lex } from 'jovo-platform-lex';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new JovoDebugger(),
    new FileDb(),
    new Lex()
);

process.env.JOVO_LOG_LEVEL = 'VERBOSE';

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?');
    },
});


export {app};
