
import { App } from 'jovo-framework';
import { Handler } from 'jovo-core';


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


const handlers: Handler = {
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },
};

const alexaHandlers: Handler = {

    HelloWorldIntent() {
        this.tell('Hello Alexa User');
    },
};

const googleActionHandlers: Handler = {
    HelloWorldIntent() {
        this.tell('Hello Google User');
    },
};

app.setHandler(handlers);
app.setAlexaHandler(alexaHandlers);
app.setGoogleAssistantHandler(googleActionHandlers);


export {app};
