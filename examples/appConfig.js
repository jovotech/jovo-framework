'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
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
    allowedApplicationIds: ['id1', 'id2'], // default []
    userMetaData: {
        lastUsedAt: false, // default true
        sessionsCount: false, // default true
        createdAt: false, // default true
        requestHistorySize: 5, // default 0
        devices: true, // default false
    },
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.tell('App launched');
    },
});

module.exports.app = app;

// quick testing
// node index.js appConfig.js --launch

