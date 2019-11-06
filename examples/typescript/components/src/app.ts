
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

import { GetPhoneNumber } from "./components/jovo-component-get-phone-number";

app.useComponents(new GetPhoneNumber());

app.setHandler({
    LAUNCH() {
        return this.delegate('GetPhoneNumber', {
            onCompletedIntent: 'HelloWorldIntent'
        });
    },

    HelloWorldIntent() {
        console.log('GetPhoneNumber\'s response:');
        console.log(this.$components.GetPhoneNumber.$response);
        return this.tell('We\'re done!');
    },
});

export {app};
