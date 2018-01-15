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
        this.toIntent('OnboardingIntent');
    },
    'OnboardingIntent': function() {
        delegate(app);
        // confirmSlotAndIntent(app);
        // elicitSlotExample(app);
        // elicitSlotExampleWithUpdatedIntent(app);
    },
};

function confirmSlotAndIntent(app) {
    if (this.alexaSkill().hasSlotValue('age') && !this.alexaSkill().isSlotConfirmed('age')) {
        this.alexaSkill().dialogConfirmSlot('age', 'Your age is ' + this.getInput('age') + '. Is that correct?');
    } else if (!this.alexaSkill().isDialogCompleted()) {
        this.alexaSkill().dialogDelegate();
    } else {
        // this.tell('Name: ' + this.getInput('name') + ', City: ' + this.getInput('city') + ', Age: ' + this.getInput('age') + ' years old.');
        this.alexaSkill().dialogConfirmIntent('Name: ' + this.getInput('name') + ', City: ' + this.getInput('city') + ', Age: ' + this.getInput('age') + ' years old.');
    }
}


/**
 * Creates delegate directive. Alexa handles next dialog
 * Alexa asks user in defined order until dialog is complete
 * @param {Jovo} app
 */
function delegate(app) {
    // simple dialog delegate example
    if (!this.alexaSkill().isDialogCompleted()) {
        this.alexaSkill().dialogDelegate();
    } else {
        this.tell('Name: ' + this.getInput('name') + ', City: ' + this.getInput('city') + ', Age: ' + this.getInput('age') + ' years old.');
    }
}

/**
 * Elicits specific slot
 * @param {Jovo} app
 */
function elicitSlotExample(app) {
    if (!this.alexaSkill().hasSlotValue('age')) {
        this.alexaSkill().dialogElicitSlot(
            'age',
            'What is your age?'
        );
    } else {
        this.alexaSkill().dialogDelegate();
    }
}

/**
 * Elicits slot with an updated intent object
 * @param {Jovo} app
 */
function elicitSlotExampleWithUpdatedIntent(app) {
    if (!this.alexaSkill().hasSlotValue('age')) {
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
        this.alexaSkill().dialogElicitSlot(
            'age',
            'What is your age?',
            'Your age please',
            updatedIntent
        );
    } else if (!this.alexaSkill().isDialogCompleted()) {
        this.alexaSkill().dialogDelegate();
    } else {
        this.tell('Name: ' + this.getInput('name') + ', City: ' + this.getInput('city') + ', Age: ' + this.getInput('age') + ' years old.');
    }
}
