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
        this.apiKey = _.get(config, 'key');
        this.appVersion = _.get(config, 'version');
        this.platformType = platformType;
    };

    /**
     * Builds an object to send to chatbase containing both the request and
     * response messages.
     * @param {Jovo} app
     * @param {string} platform Name of the platform this is from (ex. Alexa)
     * @param {string} sessionId Unique session id
     * @param {number} timeStamp Time the original message was received
     * @param {string} responseMessage Contents of the generated message
     * @return {object} The message to send to chatbase
     */
    buildMessages(app, platform, sessionId, timeStamp, responseMessage) {
        const slots = [];
        const intentSlots = app.getInputs();
        let intentName = '';
        let userId = app.getUserId();
        let message = '';

        if (app.handler.route.type === 'INTENT') {
            if (intentSlots) {
                for (const name in intentSlots) {
                    if (intentSlots[name] && intentSlots[name].value) {
                        const value = intentSlots[name].value;
                        slots.push(`${name}: ${value}`);
                    }
                }
                intentName = app.handler.route.intent;
                message = intentName + '\n' + slots.join('\n');
            }
        } else {
            intentName = app.handler.route.type;
        }

        const data = {
            messages: [
                {
                    api_key: this.apiKey,
                    type: 'user',
                    user_id: userId,
                    time_stamp: timeStamp,
                    platform,
                    intent: intentName,
                    message,
                    not_handled: app.handler.route.path.endsWith('Unhandled'),
                    version: this.appVersion,
                    session_id: sessionId,
                },
                {
                    api_key: this.apiKey,
                    type: 'agent',
                    user_id: userId,
                    time_stamp: Date.now(),
                    platform,
                    responseMessage,
                    version: this.appVersion,
                    session_id: sessionId,
                },
            ],
        };

        return data;
    };

    /**
     * Creates the data object from an Alexa request needed for the API request
     * @param {Object} app jovo app object
     * @return {object} data needed to submit the message
     */
    createChatbaseDataAlexa(app) {
        if (app.alexaSkill().getRequest().session) {
            let responseMessage = '';

            let outputSpeech = app.alexaSkill().getResponse().responseObj
                .response.outputSpeech;

            if (outputSpeech.type === 'SSML') {
                responseMessage = outputSpeech.ssml.replace(/<[^>]*>/g, '');
            } else {
                responseMessage = outputSpeech.text;
            }

            let timeStamp = Date.parse(
                app.alexaSkill().getRequest().request.timestamp
            );

            return this.buildMessages(
                app,
                'Alexa',
                app.alexaSkill().getRequest().session.sessionId,
                timeStamp,
                responseMessage
            );
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
        if (
            app.googleAction().getRequest().constructor.name ===
            'GoogleActionDialogFlowRequest'
        ) {
            sessionId = app.googleAction().getRequest().sessionId;
        } else if (
            app.googleAction().getRequest().constructor.name ===
            'GoogleActionDialogFlowV2Request'
        ) {
            sessionId = app.googleAction().getRequest()
                .originalDetectIntentRequest.payload.conversation
                .conversationId;
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
            const multiple = data.messages !== undefined;

            const objectAsString = JSON.stringify(data);
            const options = {
                host: 'chatbase.com',
                path: multiple ? '/api/messages' : '/api/message',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(objectAsString),
                },
            };
            const httpRequest = https.request(options);

            httpRequest.on('error ', function(error) {
                console.error(
                    'Error while logging to Chatbase Services',
                    error
                );
            });
            httpRequest.end(objectAsString);
        }
    };

    /**
     * Calls the Chatbase API
     * @param {Jovo} app jovo app object
     */
    track(app) {
        const data =
            this.platformType === BaseApp.PLATFORM_ENUM.ALEXA_SKILL
                ? this.createChatbaseDataAlexa(app)
                : this.createChatbaseDataGoogleAction(app);
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
