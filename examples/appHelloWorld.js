'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
    // responseLogging: true,
    intentsToSkipUnhandled: ['Intent.A'],
    // db: {
    //     type: 'file',
    //     localDbFilename: __dirname + '/db/db.json',
    // },
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({

    'NEW_SESSION': function() {
        this.speech = 'Hello New User';
        this.toStateIntent('State1.State11.State111', 'HelloWorldIntent');
    },
    // 'LAUNCH': function() {
    //     // this.tell('LAUNCH');
    // },
    'State1': {
        'State11': {
            'State111': {
                'HelloWorldIntent': function() {
                    let localVariable = 'bla';
                    this.tell('HelloWorldIntent ' + magicFunc(this.speech));
                },
                'IntentAa': function(arg1, arg2) {
                    console.log(arg1, arg2);
                    this.tell('IntentA');
                },
                // 'Unhandled': function() {
                //     this.tell('unhandled State111');
                // },
            },
            'Intent.A': function() {
                this.tell('State11 Intent.A');
            },
            // 'Unhandled': function() {
            //     this.tell('unhandled State11');
            // },
        },
        // 'Unhandled': function() {
        //     this.tell('unhandled State1');
        // },
    },
    
    'HelpIntent': function() {
        this.tell('Global HelpIntent');
    },
    
    'State2': {
        'HelpIntentaaa': function() {
            this.tell('State2 HelpIntent');
        },
        'Unhandled': function() {
            this.tell('Unhandled State2');
        },
    },
    'Unhandled': function() {
        this.tell('unhandled Global');
    },
    'AMAZON.PauseIntent': function() {
        this.tell('AMAZON.PauseIntent');
    },
});

function magicFunc(str) {
    str += 'foo';
    str += 'bar';
    str += 'blub';
    str += 'bla';
    return str;
}

module.exports.app = app;

// quick testing
// node index.js appHelloWorld.js --launch
// node index.js appHelloWorld.js --intent MyNameIsIntent --parameter name=Alex

