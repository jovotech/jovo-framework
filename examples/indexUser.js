'use strict';

const webhook = require('../index').Webhook;

webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

const app = require('../index').Jovo;

app.setConfig({
    requestLogging: true,
    responseLogging: true,

    userMetaData: {
        requestHistorySize: 10,
        devices: true,
    },
});

// listen for post requests
webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


const handlers = {

    'LAUNCH': function() {
        app.toIntent('SaveUserDataIntent');
    },

    'HelperFunctionsIntent': function() {
        let seconds = this.user().getSecondsSinceLastSession();
        app.tell('Seconds '+ seconds);
    },
    'SaveUserDataIntent': function() {
        app.user().data.score = 'over 9000';
        app.tell('Saved!');
    },
    'GetUserDataIntent': function() {
        let score = app.user().data.score ? app.user().data.score : 'zero';
        app.tell('You have ' + score + ' points');
    },
    'GetMetaDataIntent': function() {
        let userMetaData = app.user().metaData;

        let userCreatedAt = userMetaData.createdAt;
        let userlastUsedAt = userMetaData.lastUsedAt;
        let userSessionsCount = userMetaData.sessionsCount;

        console.log(userCreatedAt);
        console.log(userlastUsedAt);
        console.log(userSessionsCount);
        app.tell('Here you go!');
    },
};


