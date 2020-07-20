
import { App } from 'jovo-framework';


import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import { GoogleBusiness } from 'jovo-platform-googlebusiness';

const app = new App();

app.use(
    new GoogleBusiness({
        serviceAccount: require('path-to-service-account-json')
    }),
    new JovoDebugger(),
    new FileDb(),
);

app.setHandler({
    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});


export {app};
