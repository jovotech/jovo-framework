'use strict';
const _ = require('lodash');
const BaseApp = require('./../../app');

/**
 * @deprecated Implementation of Voicelabs' analytics module for alexa
 */
class VoiceLabsAlexa {

    /**
     * Constructor
     * @param {*} config
     */
    constructor(config) {
        try {
            this.voiceLabsAlexa = require('voicelabs');
            this.voiceLabsAlexa.initialize(_.get(config, 'key'));
            this.trackSlots = _.get(config, 'trackSlots');
            this.trackSpeechText = _.get(config, 'trackSpeechText');
            this.platformType = BaseApp.PLATFORM_ENUM.ALEXA_SKILL;
        } catch (err) {
            console.log('\nPlease install VoiceLabs: npm install voicelabs\n');
        }
    }

    /**
     * Calls the voicelabs track method
     * @param {Jovo} app jovo app object
     */
    track(app) {
        this.voiceLabsAlexa.track(
            app.alexaSkill().getSession(),
            app.getHandlerPath(),
            this.trackSlots ? app.alexaSkill().getRequest().getSlots() : null,
            this.trackSpeechText ? app.alexaSkill().getSpeechText() : null
        );
    };
}


/**
 * Implementation of Voicelabs' analytics module for google action
 */
class VoiceLabsGoogleAction {

    /**
     * Constructor
     * @param {*} config
     */
    constructor(config) {
        try {
            this.voiceInsights = require('voicelabs-assistant-sdk');
            this.voiceInsights.initialize(_.get(config, 'key'));
            this.platformType = BaseApp.PLATFORM_ENUM.GOOGLE_ACTION;
        } catch (err) {
            console.log('\nPlease install VoiceLabs: npm install voicelabs-assistant-sdk\n');
        }
    }

    /**
     * Calls the voicelabs track method
     * @param {Jovo} app jovo app object
     */
    track(app) {
        let request = app.googleAction().getRequest().getOriginalRequest() ?
            app.googleAction().getRequest().getOriginalRequest() : null;

        this.voiceInsights.track(
            app.getIntentName(),
            request.data,
            app.googleAction().getSpeechText()
        );
    };
}

module.exports.VoiceLabsAlexa = VoiceLabsAlexa;
module.exports.VoiceLabsGoogleAction = VoiceLabsGoogleAction;
