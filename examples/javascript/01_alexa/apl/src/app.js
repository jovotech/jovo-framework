const {App} = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');

const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
);


app.setHandler({
    LAUNCH() {

        this.$alexaSkill.addAplDirective({
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
        this.tell('Hello World');
    },
});


module.exports.app = app;
