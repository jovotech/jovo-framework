'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
    i18n: {
        resources: {
            'en-US': {
                translation: {
                    WELCOME: 'Welcome',
                    WELCOME_WITH_PARAMETER: 'Welcome {{firstname}} {{lastname}}',
                    WELCOME_ARRAY: ['Welcome', 'Hello'],
                },
            },
            'de-DE': {
                translation: {
                    WELCOME: 'Willkommen',
                    WELCOME_WITH_PARAMETER: 'Willkommen {{firstname}} {{lastname}}',
                    WELCOME_ARRAY: ['Willkommen', 'Hey', 'Hallo'],
                },
            },
        },
    },
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        // app.tell(app.t('WELCOME'));
        this.tell(this.t('WELCOME_WITH_PARAMETER', {firstname: 'John', lastname: 'Doe'}));
    },
    'ParameterIntent': function() {
        this.tell(this.t('WELCOME'));
    },
    'HelloWorldIntent': function() {
        this.tell(this.t('WELCOME_WITH_PARAMETER', {firstname: 'John', lastname: 'Doe'}));
    },

    'HelloWorldIntentWithArrays': function() {
        let sb = this.speechBuilder();
        sb.addText(this.t('WELCOME_ARRAY'));
        this.tell(sb);
    },
});

module.exports.app = app;

// quick testing
// node index.js appI18n.js --launch --locale en-US
// node index.js appI18n.js --launch --locale de-DE


