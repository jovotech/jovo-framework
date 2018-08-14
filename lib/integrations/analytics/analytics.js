'use strict';

const _ = require('lodash');
const VoiceLabsAlexa = require('./voiceLabsAnalytics').VoiceLabsAlexa;
const VoiceLabsGoogleAction = require('./voiceLabsAnalytics').VoiceLabsGoogleAction;
const DashbotAlexa = require('./dashbotAnalytics').DashbotAlexa;
const DashbotGoogleAction = require('./dashbotAnalytics').DashbotGoogleAction;
const BespokenAlexa = require('./bespokenAnalytics').BespokenAlexa;
const BespokenGoogleAction = require('./bespokenAnalytics').BespokenGoogleAction;
const ChatbaseAlexa = require('./chatbaseAnalytics').ChatbaseAlexa;
const ChatbaseGoogleAction = require('./chatbaseAnalytics').ChatbaseGoogleAction;
const BotanalyticsAlexa = require('./botanalyticsAnalytics').BotanalyticsAlexa;
const BotanalyticsGoogleAction = require('./botanalyticsAnalytics').BotanalyticsGoogleAction;

const DEFAULT_CONFIG = {
    intentsToSkip: [],
    usersToSkip: [],
    services: {},
    devMode: false,
};
const classesMapping = {
    'VoiceLabsAlexa': VoiceLabsAlexa,
    'VoiceLabsGoogleAction': VoiceLabsGoogleAction,
    'DashbotAlexa': DashbotAlexa,
    'DashbotGoogleAction': DashbotGoogleAction,
    'BespokenAlexa': BespokenAlexa,
    'BespokenGoogleAction': BespokenGoogleAction,
    'ChatbaseAlexa': ChatbaseAlexa,
    'ChatbaseGoogleAction': ChatbaseGoogleAction,
    'BotanalyticsAlexa': BotanalyticsAlexa,
    'BotanalyticsGoogleAction': BotanalyticsGoogleAction,
};

/**
 * Analytics class
 */
class Analytics {

    /**
     * Initializes stuff
     * @param {*} config
     */
    constructor(config) {
        _.assign(this, DEFAULT_CONFIG);
        this.services = {};
        this.enable();
        if (config) {
            if (typeof config.intentsToSkip !== 'undefined') {
                this.skipIntents(config.intentsToSkip);
            }
            if (typeof config.usersToSkip !== 'undefined') {
                this.skipUsers(config.usersToSkip);
            }

            if (typeof config.devMode !== 'undefined') {
                this.setEnable(!config.devMode);
            }
            if (typeof config.services !== 'undefined') {
                Object.keys(config.services).forEach((key) => {
                    this.addAnalytics(key, config.services[key]);
                });
            }
        }
    }

    /**
     * Adds analytics service to analytics module
     * @param {String} name
     * @param {*} serviceConfig
     */
    addAnalytics(name, serviceConfig) {
        this.services[name] = new classesMapping[name](serviceConfig);
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
     * Sets enabled
     * @param {boolean} enabled
     */
    setEnable(enabled) {
        this.analyticsEnabled = enabled;
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
    handleTracking(app) {
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

module.exports.Analytics = Analytics;
module.exports.VoiceLabsAlexa = require('./voiceLabsAnalytics').VoiceLabsAlexa;
module.exports.VoiceLabsGoogleAction = require('./voiceLabsAnalytics').VoiceLabsGoogleAction;
module.exports.DashbotAlexa = require('./dashbotAnalytics').DashbotAlexa;
module.exports.DashbotGoogleAction = require('./dashbotAnalytics').DashbotGoogleAction;
module.exports.BespokenAlexa = require('./bespokenAnalytics').BespokenAlexa;
module.exports.BespokenGoogleAction = require('./bespokenAnalytics').BespokenGoogleAction;
module.exports.ChatbaseAlexa = require('./chatbaseAnalytics').ChatbaseAlexa;
module.exports.ChatbaseGoogleAction = require('./chatbaseAnalytics').ChatbaseGoogleAction;
module.exports.BotanalyticsAlexa = require('./botanalyticsAnalytics').BotanalyticsAlexa;
module.exports.BotanalyticsGoogleAction = require('./botanalyticsAnalytics').BotanalyticsGoogleAction;
