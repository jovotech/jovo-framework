'use strict';

// =================================================================================
// App Configuration: Create Webhook + Enable Logging
// =================================================================================

const webhook = require('../index').Webhook;
const app = require('../index').Jovo;

app.setConfig({
    requestLogging: true,
    responseLogging: true,

    userMetaData: {
        requestHistorySize: 10,
        devices: true,
    },
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
// App Logic: Using the User Object to store and get data
// =================================================================================

const handlers = {

    'LAUNCH': function() {
        this.toIntent('GetMetaDataIntent');
    },

    'SaveUserDataIntent': function() {
        this.user().data.score = 'over 9000';
        this.tell('Saved!');
    },

    'GetUserDataIntent': function() {
        let score = this.user().data.score ? this.user().data.score : 'zero';
        this.tell('You have ' + score + ' points');
    },

    'GetMetaDataIntent': function() {
        let userCreatedAt = this.user().metaData.createdAt;
        let userlastUsedAt = this.user().metaData.lastUsedAt;
        let userSessionsCount = this.user().metaData.sessionsCount;

        console.log(userCreatedAt);
        console.log(userlastUsedAt);
        console.log(userSessionsCount);
        this.tell('Here you go!');
    },
};


