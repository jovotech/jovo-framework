'use strict';

// =================================================================================
// App Configuration: Create Webhook + Enable Logging
// =================================================================================

const webhook = require('../../index').Webhook;
const app = require('../../index').Jovo;

// Enable Logging for Quick Testing
app.setConfig({
    logging: true,
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
// App Logic: Add (Echo Show) Render Templates
// =================================================================================

let handlers = {
    'LAUNCH': function() {
        app.alexaSkill().showVideo('https://www.url.to/video.mp4', 'Any Title', 'Any Subtitle');
    },
};
