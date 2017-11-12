'use strict';

// =================================================================================
// App Configuration: Create Webhook + Enable Logging
// =================================================================================

const webhook = require('../../index').Webhook;
const app = require('../../index').Jovo;

// Enable Logging for Quick Testing
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
        app.toIntent('OnboardingIntent');
    },
    'OnboardingIntent': function() {
        delegate(app);
        // confirmSlotAndIntent(app);
        // elicitSlotExample(app);
        // elicitSlotExampleWithUpdatedIntent(app);
    },
};

function confirmSlotAndIntent(app) {
    if (app.alexaSkill().hasSlotValue('age') && !app.alexaSkill().isSlotConfirmed('age')) {
        app.alexaSkill().dialogConfirmSlot('age', 'Your age is ' + app.getInput('age') + '. Is that correct?');
    } else if (!app.alexaSkill().isDialogCompleted()) {
        app.alexaSkill().dialogDelegate();
    } else {
        // app.tell('Name: ' + app.getInput('name') + ', City: ' + app.getInput('city') + ', Age: ' + app.getInput('age') + ' years old.');
        app.alexaSkill().dialogConfirmIntent('Name: ' + app.getInput('name') + ', City: ' + app.getInput('city') + ', Age: ' + app.getInput('age') + ' years old.');
    }
}


/**
 * Creates delegate directive. Alexa handles next dialog
 * Alexa asks user in defined order until dialog is complete
 * @param {Jovo} app
 */
function delegate(app) {
    // simple dialog delegate example
    if (!app.alexaSkill().isDialogCompleted()) {
        app.alexaSkill().dialogDelegate();
    } else {
        app.tell('Name: ' + app.getInput('name') + ', City: ' + app.getInput('city') + ', Age: ' + app.getInput('age') + ' years old.');
    }
}

/**
 * Elicits specific slot
 * @param {Jovo} app
 */
function elicitSlotExample(app) {
    if (!app.alexaSkill().hasSlotValue('age')) {
        app.alexaSkill().dialogElicitSlot(
            'age',
            'What is your age?'
        );
    } else {
        app.alexaSkill().dialogDelegate();
    }
}

/**
 * Elicits slot with an updated intent object
 * @param {Jovo} app
 */
function elicitSlotExampleWithUpdatedIntent(app) {
    if (!app.alexaSkill().hasSlotValue('age')) {
        let updatedIntent = {
            name: 'OnboardingIntent',
            confirmationStatus: 'NONE',
            slots: {
                city: {
                    name: 'city',
                    value: 'New York',
                    confirmationStatus: 'NONE',
                },
                age: {
                    name: 'age',
                    confirmationStatus: 'NONE',
                },
                name: {
                    name: 'name',
                    value: 'Alex',
                    confirmationStatus: 'CONFIRMED',
                },
            },
        };
        app.alexaSkill().dialogElicitSlot(
            'age',
            'What is your age?',
            'Your age please',
            updatedIntent
        );
    } else if (!app.alexaSkill().isDialogCompleted()) {
        app.alexaSkill().dialogDelegate();
    } else {
        app.tell('Name: ' + app.getInput('name') + ', City: ' + app.getInput('city') + ', Age: ' + app.getInput('age') + ' years old.');
    }
}
