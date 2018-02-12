'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        // async amazon api call
        // this.alexaSkill().progressiveResponse('Test', () => {
        //     console.log('lalal');
        // });

        // or more than one progressive responses

        this.alexaSkill().progressiveResponse('Processing your request', () => {
            setTimeout( () => {
                this.alexaSkill().progressiveResponse('Still processing');
            }, 1500);
        });


        dummyApiCall( () => {
            this.tell('Here is your information.');
        });
    },

    'HelloWorldIntent': function() {
        this.tell('Hello World!');
    },
    'Unhandled': function() {
        this.tell('Unhandled');
    },
});

module.exports.app = app;

/**
 * Simulates a long api call
 * @param {func} callback
 */
function dummyApiCall(callback) {
    setTimeout(callback, 7000);
}

