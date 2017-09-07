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


const handlers = {

    'LAUNCH': function() {
        app.toIntent('SaveUserDataIntent');
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
        let userCreatedAt = app.user().metaData.createdAt;
        let userlastUsedAt = app.user().metaData.lastUsedAt;
        let userSessionsCount = app.user().metaData.sessionsCount;

        console.log(userCreatedAt);
        console.log(userlastUsedAt);
        console.log(userSessionsCount);
        app.tell('Here you go!');
    },
};


