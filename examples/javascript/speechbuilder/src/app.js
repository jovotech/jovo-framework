const {App} = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
const app = new App();

app.use(
    new GoogleAssistant(),
    new Alexa()
);


app.setHandler({

    async LAUNCH() {
        let foo = false;
        let bar = true;
        this.$speech
            .addText('HelloWorld')
            .addBreak('100ms', false)
            .addAudio('http://www.any.url/test.mp3', 'Text')
            .addText('Foo', foo)
            .addText('Bar', bar)
            .addText(['Text1', 'Text2', 'Text3'])
            .addBreak(['500ms', '1s'])
            .addAudio(['url1', 'url2', 'url3'])
            .addText('Good Bye.');

        return this.tell(this.$speech);

    },
});

module.exports.app = app;
