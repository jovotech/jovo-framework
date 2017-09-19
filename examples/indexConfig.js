'use strict';

const webhook = require('../index').Webhook;

webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

const app = require('../index').Jovo;

app.setConfig({
    requestLogging: true, // default false
    responseLogging: true, // default false
    saveUserOnResponseEnabled: false, // default true
    userDataCol: 'otherColumnName', // default 'userData'
    inputMap: { // default {}
        'given-name': 'name',
    },
    intentMap: { // default {}
        'AMAZON.StopIntent': 'StopIntent',
    },
    requestLoggingObjects: ['session'], // default []
    responseLoggingObjects: ['response'], // default []
    saveBeforeResponseEnabled: true, // default false
    allowedApplicationIds: ['id1', 'id2'], // default []
    userMetaData: {
        lastUsedAt: false, // default true
        sessionsCount: false, // default true
        createdAt: false, // default true
        requestHistorySize: 5, // default 0
        devices: true, // default false
    },
});

// listen for post requests
webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


let handlers = {

    'LAUNCH': function() {
        app.tell('App launched');
    },
    'HelloWorld': function() {
        app.tell('Hello World');
    },
};
