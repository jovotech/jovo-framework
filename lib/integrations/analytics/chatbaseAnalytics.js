'use strict';
const _ = require('lodash');
const BaseApp = require('./../../app');
const https = require('https');

/**
 * Implementation of Chatbase's analytics module
 */
class Chatbase {

    /**
     * Constructor
     * @param {*} config
     * @param {Jovo.PLATFORM_ENUM} platformType Alexa Skill or Google Action
     */
    constructor(config, platformType) {
        this.apiKey= _.get(config, 'key');
        this.appVersion = _.get(config, 'version');
        this.platformType = platformType;
    };

    /**
     * Creates the data object from an Alexa request needed for the API request
     * @param {Object} app jovo app object
     * @return {object} data needed to submit the message
     */
    createChatbaseDataAlexa(app) {
        if (app.alexaSkill().getRequest().session) {
            // Uses intent name if available, else request type (LaunchRequest)
            let intentName = '';
            if (app.alexaSkill().getRequest().request.intent) {
                intentName = app.alexaSkill().getRequest().request.intent.name;
            } else {
                intentName = app.alexaSkill().getRequest().request.type;
            }
            const data = {
                api_key: this.apiKey,
                type: 'user',
                user_id: app.alexaSkill().getUserId(),
                time_stamp: Date.now(),
                platform: 'Alexa',
                intent: intentName,
                version: this.appVersion,
                session_id: app.alexaSkill().getRequest().session.sessionId,
            };
            return data;
        } else {
            return null;
        }
    };

    /**
     * Creates the data object from a Google Action request needed for the API request
     * @param {Object} app jovo app object
     * @return {object} data needed to submit the message
     */
    createChatbaseDataGoogleAction(app) {
        let sessionId = '';
        if (app.googleAction().getRequest().constructor.name === 'GoogleActionDialogFlowRequest') {
            sessionId = app.googleAction().getRequest().sessionId;
        } else if (app.googleAction().getRequest().constructor.name === 'GoogleActionDialogFlowV2Request') {
            sessionId = app.googleAction().getRequest()
                .originalDetectIntentRequest.payload.conversation.conversationId;
        }
        const data = {
            api_key: this.apiKey,
            type: 'user',
            user_id: app.googleAction().getUserId(),
            time_stamp: Date.now(),
            platform: 'Actions',
            intent: app.googleAction().getIntentName(),
            version: this.appVersion,
            session_id: sessionId,
        };
        return data;
    };

    /**
     * Send data to Chatbase API
     * @param {object} data
     */
    sendDataToChatbase(data) {
        if (data) {
            const objectAsString = JSON.stringify(data);
            const options = {
                host: 'chatbase.com',
                path: '/api/message',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(objectAsString),
                },
            };
            const httpRequest = https.request(options);

            httpRequest.on('error', function(error) {
                console.error('Error while logging to Chatbase Services', error);
            });

            httpRequest.end(objectAsString);
        }
    }

    /**
     * Calls the Chatbase API
     * @param {Jovo} app jovo app object
     */
    track(app) {
        const data = this.platformType === BaseApp.PLATFORM_ENUM.ALEXA_SKILL ?
                    this.createChatbaseDataAlexa(app) : this.createChatbaseDataGoogleAction(app);
        this.sendDataToChatbase(data);
    };
}

/**
 * Chatbase Alexa Analytics
 */
class ChatbaseAlexa extends Chatbase {

    /**
     * Constructor
     * @param {*} config
     */
    constructor(config) {
        super(config, BaseApp.PLATFORM_ENUM.ALEXA_SKILL);
    }
}

/**
 * Chatbase GoogleAction Analytics
 */
class ChatbaseGoogleAction extends Chatbase {

    /**
     * Constructor
     * @param {*} config
     */
    constructor(config) {
        super(config, BaseApp.PLATFORM_ENUM.GOOGLE_ACTION);
    }
}

module.exports.ChatbaseAlexa = ChatbaseAlexa;
module.exports.ChatbaseGoogleAction = ChatbaseGoogleAction;
