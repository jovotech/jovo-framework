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
        return this.toIntent('SimpleDirectiveIntent');
    },

    SimpleDirectiveIntent() {
        this.$alexaSkill.addDirective({
            "type": "Alexa.Presentation.APL.RenderDocument",
            "token": "MYTOKEN",
            "document": {
                "type": "APL",
                "version": "1.1",
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
                            "id": "myText",
                            "text": "Hello World",
                            "color": "#FFFFFF"
                        }
                    ]
                }
            }
        });
        this.ask('SimpleDirectiveIntent');
    },

    TouchWrapperIntent() {
        this.$alexaSkill.$apl.addDocumentDirective({
            "token": "MYTOKEN",
            "document": {
                "type": "APL",
                "version": "1.1",
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
                            "type": "TouchWrapper",
                            "item": {
                                "type": "Text",
                                "text": "There are 5 peas in the pod",
                                "color": "#FFFFFF"
                            },
                            "onPress": {
                                "type": "SendEvent",
                                "arguments": [
                                    "peasinapod"
                                ]
                            }
                        }
                    ]
                }
            }
        });
        this.ask('Touchwrapper Example');

    },

    ON_ELEMENT_SELECTED() {
        if (this.$alexaSkill.$apl.isUserEvent()) {
            console.log(this.$alexaSkill.$apl.getEventArguments());
            this.tell('Ok');
        }


    },
});


module.exports.app = app;
