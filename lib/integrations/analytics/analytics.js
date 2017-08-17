'use strict';

const Jovo = require('../../jovo');
/**
 * Class
 * Analytics (alpha)
 */
class Analytics {

    /**
     * Initializes stuff
     */
    constructor() {
        this.services = {};
        this.intentsToSkip = [];
        this.usersToSkip = [];
        this.intentsToTrack = [];
        this.enable();
    }

    /**
     * Adds analytics service to analytics module
     * @param {String} name
     * @param {*} implementation
     */
    addAnalytics(name, implementation) {
        this.services[name] = implementation;
    }

    /**
     * Enables analytics
     */
    enable() {
        this.analyticsEnabled = true;
    }

    /**
     * Disables analytics
     */
    disable() {
        this.analyticsEnabled = false;
    }

    /**
     * Checks if analytics is enabled
     * @return {boolean}
     */
    isEnabled() {
        return Object.keys(this.services).length > 0 && this.analyticsEnabled;
    }

    /**
     * Array of intents where tracking
     * will be skipped
     * @param {Array} intents
     */
    skipIntents(intents) {
        this.intentsToSkip = intents;
    }

    /**
     * Array of users where tracking
     * will be skipped
     * @param {Array} userIds
     */
    skipUsers(userIds) {
        this.usersToSkip = userIds;
    }

    /**
     * Initiates tracking
     * @param {Jovo} app
     */
    track(app) {
        if (this.isEnabled()) {
            for (let i = 0; i < Object.keys(this.services).length; i++) {
                let service = this.services[Object.keys(this.services)[i]];
                if (this.intentsToSkip.length > 0 &&
                    this.intentsToSkip.indexOf(app.getHandlerPath()) !== -1) {
                    continue;
                }
                if (this.usersToSkip.length > 0 &&
                    this.usersToSkip.indexOf(app.getUserId()) !== -1) {
                    continue;
                }
                if (app.getPlatform().getType() === service.platformType ) {
                    service.track(app);
                }
            }
        }
    }
}

/** DEFAULT INTEGRATIONS VOICELABS AND DASHBOT */

/**
 * Implementation of Voicelabs' analytics module for alexa
 */
class VoiceLabsAlexaAnalytics {

    /**
     * Constructor
     * @param {string} token token-app at insights.voicelabs.co
     * @param {boolean} trackSlots true tracks slots too
     * @param {boolean} trackSpeechText true tracks speechtext too
     */
    constructor(token, trackSlots, trackSpeechText) {
        try {
            this.voiceLabsAlexa = require('voicelabs');
            this.voiceLabsAlexa.initialize(token);
            this.trackSlots = trackSlots;
            this.trackSpeechText = trackSpeechText;
            this.platformType = Jovo.PLATFORM_ENUM.ALEXA_SKILL;
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
            this.trackSlots ? app.alexaSkill().request.getSlots() : null,
            this.trackSpeechText ? app.alexaSkill().getSpeechText() : null
        );
    };
}

/**
 * Implementation of Voicelabs' analytics module for google action
 */
class VoiceLabsGoogleActionAnalytics {

    /**
     * Constructor
     * @param {string} token token-app at insights.voicelabs.co
     */
    constructor(token) {
        try {
            this.voiceInsights = require('voicelabs-assistant-sdk');
            this.voiceInsights.initialize(token);
            this.platformType = Jovo.PLATFORM_ENUM.GOOGLE_ACTION;
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
            app.googleAction().getResponse().getSpeechText()
        );
    };
}

/**
 * Implementation of dashbot's analytics module for google action
 */
class DashbotGoogleActionAnalytics {

    /**
     * Constructor
     * @param {string} apiKey apiKey
     */
    constructor(apiKey) {
        try {
            this.dashbot = require('dashbot')(apiKey).google;
            this.platformType = Jovo.PLATFORM_ENUM.GOOGLE_ACTION;
        } catch (err) {
            console.log('\nPlease install dashbot: npm install dashbot\n');
        }
    }

    /**
     * Calls the dashbot log method
     * @param {Jovo} app jovo app object
     */
    track(app) {
        this.dashbot.logIncoming(app.googleAction().getRequest()
            .getRequestObject());
        this.dashbot.logOutgoing(app.googleAction().getRequest()
                .getRequestObject(),
            app.googleAction().getResponse().getResponseObject());
    };
}

/**
 * Implementation of dashbot's analytics module for alexa
 */
class DashbotAlexaAnalytics {

    /**
     * Constructor
     * @param {string} apiKey apiKey
     */
    constructor(apiKey) {
        try {
            this.dashbot = require('dashbot')(apiKey).alexa;
            this.platformType = Jovo.PLATFORM_ENUM.ALEXA_SKILL;
        } catch (err) {
            console.log('\nPlease install dashbot: npm install dashbot\n');
        }
    }

    /**
     * TODO: request object is not correct
     * Calls the dashbot log method
     * @param {Jovo} app jovo app object
     */
    track(app) {
        this.dashbot.logIncoming(app.alexaSkill()
            .getRequest().getRequestObject());
        this.dashbot.logOutgoing(app.alexaSkill()
                .getRequest().getRequestObject(),
            app.alexaSkill().getResponse().getResponseObject());
    };
}


module.exports.Analytics = Analytics;
module.exports.VoiceLabsAlexaAnalytics = VoiceLabsAlexaAnalytics;
module.exports.VoiceLabsGoogleActionAnalytics = VoiceLabsGoogleActionAnalytics;
module.exports.DashbotAlexaAnalytics = DashbotAlexaAnalytics;
module.exports.DashbotGoogleActionAnalytics = DashbotGoogleActionAnalytics;
