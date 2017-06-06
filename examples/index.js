'use strict';

//=================================================================================
// The below code is used to set up a server and a webhook at /webhook.
// Danger Zone: Editing might break your app.
//=================================================================================

const app = require('jovo-framework').Jovo;
const webhook = require('jovo-framework').Webhook;

// Listen for post requests
webhook.listen(3000, function () {
    console.log('Local development server listening on port 3000.');
})

webhook.post('/webhook', function (req, res) {
    app.init(req, res, handlers);
    app.execute();
});


//=================================================================================
// Below is where the logic of your voice app should be happening
// Get started by adding some intents and Jovo functions
//=================================================================================

let handlers = {

    "LAUNCH" : function() {
        app.goTo("HelloWorldIntent");
    },

    "HelloWorldIntent" : function() {
        app.tell("Hello World!");
    }

};