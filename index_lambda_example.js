'use strict';

//=================================================================================
// The below code is used make your voice app work on AWS Lambda
// Danger Zone: Editing might break your app.
//=================================================================================

const Jovo = require('./Jovo').Jovo;
const app = new Jovo();

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




