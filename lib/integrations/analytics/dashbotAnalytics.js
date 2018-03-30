'use strict';
const _ = require('lodash');
const BaseApp = require('./../../app');

/**
 * Implementation of dashbot's analytics module for alexa
 */
class DashbotAlexa {

    /**
     * Constructor
     * @param {*} config
     */
    constructor(config) {
        try {
            this.dashbot = require('dashbot')(_.get(config, 'key')).alexa;
            this.platformType = BaseApp.PLATFORM_ENUM.ALEXA_SKILL;
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
        if (app.alexaSkill().getRequest().session) {
            this.dashbot.logIncoming(app.alexaSkill()
            .getRequest());
            this.dashbot.logOutgoing(app.alexaSkill()
                .getRequest(),
            app.alexaSkill().getResponse().getResponseObject());
        }
    };
}

/**
 * Implementation of dashbot's analytics module for google action
 */
class DashbotGoogleAction {

    /**
     * Constructor
     * @param {*} config
     */
    constructor(config) {
        try {
            this.dashbot = require('dashbot')(_.get(config, 'key')).google;
            this.platformType = BaseApp.PLATFORM_ENUM.GOOGLE_ACTION;
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
            );
        this.dashbot.logOutgoing(app.googleAction().getRequest()
                ,
            app.googleAction().getResponse().getResponseObject());
    };
}

module.exports.DashbotAlexa = DashbotAlexa;
module.exports.DashbotGoogleAction = DashbotGoogleAction;

