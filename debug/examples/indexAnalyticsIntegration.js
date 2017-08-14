'use strict';

const webhook = require('../../index').Webhook;

webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

const app = require('../../index').Jovo;
app.enableRequestLogging();
app.enableResponseLogging();
app.addVoiceLabsAlexa('23b55e80-3e3f-11a7-2167-0e2486876586');
app.addVoiceLabsGoogleAction('228f1d00-5764-11a7-023a-0e2486876586');
app.addDashbotGoogleAction('1T3ZonKcbNzLv6eFLBwI9Fv8JAU5SBVorCCvvD1D');
app.addDashbotAlexa('6Idg1n3pCbk4bMh4XYubQVx5ckjVtuHctMND4sMM');

app.setIntentMap({
    'AMAZON.HelpIntent': 'HelpIntent',

});

// listen for post requests
webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


let handlers = {

    'LAUNCH': function() {
        app.toIntent('HelloWorld');
    },
    'HelloWorld': function() {
        app.tell('Hey');
    },
};
