'use strict';

const config = require('./config/config');
const _ = require('lodash');
const moment = require('moment-timezone');

const tracking = require('./tracking');
const spreadsheet = require('./spreadsheet');

// =================================================================================
// App Configuration
// =================================================================================

const {App, AlexaSkill} = require('jovo-framework');

Object.assign(AlexaSkill.prototype, {
    ask: function(speech, repromptSpeech) {
        if (typeof speech === 'undefined' || speech.length === 0) {
            throw new Error('speech must not be empty');
        }
        if (_.isArray(repromptSpeech) && repromptSpeech.length > 0) {
            repromptSpeech = repromptSpeech[0];
        }

        if (speech instanceof SpeechBuilder) {
            speech = speech.build();
        }

        if (!repromptSpeech) {
            repromptSpeech = speech;
        }

        if (repromptSpeech instanceof SpeechBuilder) {
            repromptSpeech = repromptSpeech.build();
        }

        tracking.googleAnalytics.defaultEventAndState(this.jovo);

        this.response.ask(SpeechBuilder.toSSML(speech),
            SpeechBuilder.toSSML(repromptSpeech));
        this.jovo.emit('respond', this.jovo);
    },

    tell: function(speech) {
        if (speech && speech instanceof SpeechBuilder) {
            speech = speech.build();
        }
        if (!speech || speech.length === 0) {
            speech = '<break time="10ms"/>';
        }

        tracking.googleAnalytics.defaultEventAndState(this.jovo);

        this.response.tell(SpeechBuilder.toSSML(speech));
        this.jovo.emit('respond', this.jovo);
    }
});

