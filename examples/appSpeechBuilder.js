'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        let speech = this.speechBuilder();

        let foo = false;
        let bar = true;

        speech
            .addText('HelloWorld')
            .addBreak('100ms', false)
            .addAudio('http://www.any.url/test.mp3', 'Text')
            .addText('Foo', foo)
            .addText('Bar', bar)
            .addText(['Text1', 'Text2', 'Text3'])
            .addBreak(['500ms', '1s'])
            .addAudio(['url1', 'url2', 'url3'])
            .addText('Good Bye.');
        this.tell(speech);
    },
});

module.exports.app = app;

// quick testing
// node node .\index.js .\appSpeechBuilder.js --launch

