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
        this.toIntent('OnboardingIntent');
    },
    'OnboardingIntent': function() {
        delegate(this);
        // confirmSlotAndIntent(this);
        // elicitSlotExample(this);
        // elicitSlotExampleWithUpdatedIntent(this);
    },
});

module.exports.app = app;


function confirmSlotAndIntent(jovo) {
    if (jovo.alexaSkill().hasSlotValue('age') && !jovo.alexaSkill().isSlotConfirmed('age')) {
        jovo.alexaSkill().dialogConfirmSlot('age', 'Your age is ' + jovo.getInput('age').value + '. Is that correct?');
    } else if (!jovo.alexaSkill().isDialogCompleted()) {
        jovo.alexaSkill().dialogDelegate();
    } else {
        // jovo.tell('Name: ' + jovo.getInput('name') + ', City: ' + jovo.getInput('city') + ', Age: ' + jovo.getInput('age') + ' years old.');
        jovo.alexaSkill().dialogConfirmIntent('Name: ' + jovo.getInput('name').value + ', City: ' + jovo.getInput('city').value + ', Age: ' + jovo.getInput('age').value + ' years old.');
    }
}


/**
 * Creates delegate directive. Alexa handles next dialog
 * Alexa asks user in defined order until dialog is complete
 * @param {Jovo} jovo
 */
function delegate(jovo) {
    // simple dialog delegate example
    if (!jovo.alexaSkill().isDialogCompleted()) {
        jovo.alexaSkill().dialogDelegate();
    } else {
        jovo.tell('Name: ' + jovo.getInput('name').value + ', City: ' + jovo.getInput('city').value + ', Age: ' + jovo.getInput('age').value + ' years old.');
    }
}

/**
 * Elicits specific slot
 * @param {Jovo} jovo
 */
function elicitSlotExample(jovo) {
    if (!jovo.alexaSkill().hasSlotValue('age')) {
        jovo.alexaSkill().dialogElicitSlot(
            'age',
            'What is your age?'
        );
    } else {
        jovo.alexaSkill().dialogDelegate();
    }
}

/**
 * Elicits slot with an updated intent object
 * @param {Jovo} jovo
 */
function elicitSlotExampleWithUpdatedIntent(jovo) {
    if (!jovo.alexaSkill().hasSlotValue('age')) {
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
        jovo.alexaSkill().dialogElicitSlot(
            'age',
            'What is your age?',
            'Your age please',
            updatedIntent
        );
    } else if (!jovo.alexaSkill().isDialogCompleted()) {
        jovo.alexaSkill().dialogDelegate();
    } else {
        jovo.tell('Name: ' + jovo.getInput('name').value + ', City: ' + jovo.getInput('city').value + ', Age: ' + jovo.getInput('age').value + ' years old.');
    }
}
