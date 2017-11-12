'use strict';

// =================================================================================
// App Configuration: Create Webhook + Enable Logging
// =================================================================================

const webhook = require('../../index').Webhook;
const app = require('../../index').Jovo;


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
// App Logic: Hello World
// =================================================================================

let handlers = {

    'LAUNCH': function() {
        // app.toIntent('CatchAllIntent');
    },

    'CatchAllIntent': function(catchAll) {
        app.tell(catchAll);
    },
};
