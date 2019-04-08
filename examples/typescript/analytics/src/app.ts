
import { App } from 'jovo-framework';


import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import { BotanalyticsAlexa } from 'jovo-analytics-botanalytics';
import { BotanalyticsGoogleAssistant } from 'jovo-analytics-botanalytics';
import { BespokenAlexa } from 'jovo-analytics-bespoken';
import { BespokenGoogleAssistant } from 'jovo-analytics-bespoken';
import { DashbotAlexa } from 'jovo-analytics-dashbot';
import { DashbotGoogleAssistant } from 'jovo-analytics-dashbot';
import { ChatbaseAlexa } from 'jovo-analytics-chatbase';
import { ChatbaseGoogleAssistant } from 'jovo-analytics-chatbase';


const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
    new BotanalyticsAlexa(),
    new BotanalyticsGoogleAssistant(),
    new BespokenAlexa(),
    new BespokenGoogleAssistant(),
    new DashbotAlexa(),
    new DashbotGoogleAssistant(),
    new ChatbaseAlexa(),
    new ChatbaseGoogleAssistant()
);

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
