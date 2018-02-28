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
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.tell('Hello World! What is your name?');
    },

    'ON_EVENT': {
        'AlexaSkillEvent.SkillEnabled': function() {
            console.log('AlexaSkillEvent.SkillEnabled');
        },
        'AlexaSkillEvent.SkillDisabled': function() {
            console.log('AlexaSkillEvent.SkillDisabled');
        },
        'AlexaSkillEvent.SkillAccountLinked': function() {
            console.log('AlexaSkillEvent.SkillAccountLinked');
        },
        'AlexaSkillEvent.SkillPermissionAccepted': function() {
            console.log('AlexaSkillEvent.SkillPermissionAccepted');
        },
        'AlexaSkillEvent.SkillPermissionChanged': function() {
            console.log('AlexaSkillEvent.SkillPermissionChanged');
        },
        'AlexaHouseholdListEvent.ItemsCreated': function() {
            console.log('AlexaHouseholdListEvent.ItemsCreated');
            console.log(this.request().getBody());
        },
        'AlexaHouseholdListEvent.ListUpdated': function() {
            console.log('AlexaHouseholdListEvent.ListUpdated');
        },
        'AlexaHouseholdListEvent.ListDeleted': function() {
            console.log('AlexaHouseholdListEvent.ListDeleted');
        },
        'AlexaHouseholdListEvent.ListCreated': function() {
            console.log('AlexaHouseholdListEvent.ListDeleted');
        },
    },
});

module.exports.app = app;

// quick testing
// node index.js appHelloWorld.js --launch
// node index.js appHelloWorld.js --intent MyNameIsIntent --parameter name=Alex

