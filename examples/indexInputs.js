'use strict';

const webhook = require('../index').Webhook;

webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

const app = require('../index').Jovo;
app.enableRequestLogging();
app.enableResponseLogging();

// listen for post requests
webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


let handlers = {

    'LAUNCH': function() {
        app.tell('App launched');
    },
    'NameIntent': function(name) {
        app.tell('Hello ' + name);
    },
};

// quick testing
// node indexInputs.js --intent NameIntent --parameter name=John

