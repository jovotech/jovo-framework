'use strict';

//=================================================================================
// The below code is used to set up a server and a webhook at /webhook.
// Danger Zone: Editing might break your app.
//=================================================================================

const Jovo = require('jovo-framework');
const app = Jovo.App;

exports.handler = function (event, context, callback) {
    app.initLambda(event, callback, handlers);
    app.execute();
};


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
