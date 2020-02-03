import { App } from 'jovo-framework';


import { JovoDebugger } from 'jovo-plugin-debugger';
import { Autopilot } from 'jovo-platform-twilioautopilot';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new JovoDebugger(),
    new FileDb(),
    new Autopilot()
);

process.env.JOVO_LOG_LEVEL = 'VERBOSE';

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?');
    },

    MyNameIsIntent() {
        return this.$autopilotBot!.setActions([
            {
              say: `Hi ${this.$inputs.name.value}! I'm Jaimie your new Assistant. How can I help you?`
            },
            {
              play: {
                loop: 2,
                url: 'https://api.twilio.com/cowbell.mp3'
              }
            },
            {
              redirect: 'task://customer-satisfaction-survey'
            }
        ]);
    },
});


export {app};
