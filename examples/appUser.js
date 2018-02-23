'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
    userMetaData: {
        requestHistorySize: 10,
        devices: true,
    },
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('SaveUserDataIntent');
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
});

module.exports.app = app;

// quick testing
// node index.js appUser.js --launch
// node .\index.js .\appUser.js --intent GetUserDataIntent
// node .\index.js .\appUser.js --intent GetMetaDataIntent

