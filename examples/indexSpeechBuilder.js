'use strict';

// =================================================================================
// App Configuration: Create Webhook + Enable Logging
// =================================================================================

const webhook = require('../index').Webhook;
const app = require('../index').Jovo;

// Enable Logging for Quick Testing
app.setConfig({
    requestLogging: true,
    responseLogging: true,
});

// Listen for post requests
webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


// =================================================================================
// App Logic: Example of speechBuilder methods and conditions
// =================================================================================

let handlers = {

    'LAUNCH': function() {
        app.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        let speech = app.speechBuilder();

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
        app.tell(speech);
    },
};

// quick testing
// node indexSpeechBuilder --launch

