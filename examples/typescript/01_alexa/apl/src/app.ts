
import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);



app.setHandler({
    LAUNCH() {
        this.$alexaSkill!.addAplDirective({
            "type": "APL",
            "version": "1.0",
            "import": [
                {
                    "name": "alexa-layouts",
                    "version": "1.0.0"
                }
            ],
            "mainTemplate": {
                "parameters": [
                    "payload"
                ],
                "items": [
                    {
                        "type": "Text",
                        "text": "Hello World"
                    }
                ]
            }
        });
    },
});


export {app};
