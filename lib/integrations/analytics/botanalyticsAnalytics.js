'use strict';
const BaseApp = require('./../../app');
const _ = require('lodash');

/**
 * Botanalytics Amazon Alexa
 */
class BotanalyticsAlexa {
    /**
     * constructor
     * @param {config} config
     */
    constructor(config) {
        try {
            this.apiKey = _.get(config, 'key');
            this.debug = _.get(config, 'debug', false);
            const AmazonAlexa = require('botanalytics').AmazonAlexa;
            this.botanalytics = new AmazonAlexa(this.apiKey, {debug: this.debug});
            this.platformType = BaseApp.PLATFORM_ENUM.ALEXA_SKILL;
        } catch (err) {
            console.log('\nPlease install botanalytics: npm install botanalytics\n');
        }
    }
    /**
     * Botanalytics Logging
     * @param {Jovo} app, Jovo Application
     */
    track(app) {
        if (app.alexaSkill().getRequest().session) {
            this.botanalytics.log(
                app.alexaSkill().getRequest(),
                app.alexaSkill().getResponse().getResponseObject());
        }
    };
}

/**
 * Botanalytics Google Actions
 */
class BotanalyticsGoogleAction {
    /**
     * Constructor
     * @param {config} config
     */
    constructor(config) {
        try {
            this.apiKey = _.get(config, 'key');
            this.debug = _.get(config, 'debug', false);
            const GoogleAssistant = require('botanalytics').GoogleAssistant;
            this.botanalytics = new GoogleAssistant(this.apiKey, {debug: this.debug});
            this.platformType = BaseApp.PLATFORM_ENUM.GOOGLE_ACTION;
        } catch (err) {
            console.log('\nPlease install botanalytics: npm install botanalytics\n');
        }
    }
    /**
     * Botanalytics Logging
     * @param {Jovo} app, Jovo Application
     */
    track(app) {
        this.botanalytics.log(
            app.googleAction().getRequest(),
            app.googleAction().getResponse().getResponseObject());
    };
}

module.exports = {
    'BotanalyticsAlexa': BotanalyticsAlexa,
    'BotanalyticsGoogleAction': BotanalyticsGoogleAction,
};


