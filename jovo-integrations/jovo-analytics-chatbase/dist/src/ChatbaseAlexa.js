"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
class ChatbaseAlexa {
    constructor(config) {
        this.config = {
            appVersion: '',
            key: '',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.track = this.track.bind(this);
    }
    install(app) {
        app.on('response', this.track);
    }
    uninstall(app) {
        app.removeListener('response', this.track);
    }
    track(handleRequest) {
        if (!handleRequest.jovo) {
            return;
        }
        if (handleRequest.jovo.constructor.name === 'AlexaSkill') {
            const data = this.createChatbaseData(handleRequest.jovo);
            this.sendDataToChatbase(data);
        }
    }
    createChatbaseData(jovo) {
        const responseMessage = jovo.$response.getSpeechPlain() || '';
        const timeStamp = Date.parse(jovo.$request.getTimestamp());
        return this.buildMessages(jovo, timeStamp, jovo.$request.toJSON().session.sessionId, responseMessage);
    }
    buildMessages(jovo, timeStamp, sessionId, responseMessage) {
        const userId = jovo.$request.getUserId();
        return {
            messages: [
                this.buildUserMessage(jovo, userId, timeStamp, sessionId),
                this.buildAgentMessage(userId, responseMessage, sessionId),
            ],
        };
    }
    buildAgentMessage(userId, message, sessionId) {
        return {
            api_key: this.config.key,
            message,
            platform: 'Alexa',
            session_id: sessionId,
            time_stamp: Date.now(),
            type: 'agent',
            user_id: userId,
            version: this.config.appVersion,
        };
    }
    buildUserMessage(jovo, userId, timeStamp, sessionId) {
        const unhandledRx = /Unhandled$/;
        const intentSlots = jovo.$inputs;
        let intentName = '';
        let message = '';
        const notHandled = unhandledRx.test(jovo.$plugins.Router.route.path);
        if (jovo.$type.type === 'INTENT') {
            intentName = notHandled
                ? jovo.$request.toJSON().request.intent.name
                : jovo.$plugins.Router.route.path;
            message = this.buildMessage(intentName, intentSlots);
        }
        else {
            intentName = jovo.$type.type;
        }
        return {
            api_key: this.config.key,
            intent: intentName,
            message,
            not_handled: notHandled,
            platform: 'Alexa',
            session_id: sessionId,
            time_stamp: timeStamp,
            type: 'user',
            user_id: userId,
            version: this.config.appVersion,
        };
    }
    buildMessage(intentName, intentSlots) {
        const messageElements = [intentName];
        if (intentSlots) {
            const slots = this.buildMessageSlotString(intentSlots);
            if (slots.length) {
                messageElements.push(slots);
            }
        }
        return messageElements.join('\n');
    }
    /**
     * Takes an Inputs object, and converts it into a readable string for analtyics
     * @param intentSlots All of the slots passed to the intent
     */
    buildMessageSlotString(intentSlots) {
        const slots = [];
        for (const name in intentSlots) {
            if (intentSlots[name] !== undefined) {
                slots.push(`${name}: ${intentSlots[name]}`);
            }
        }
        return slots.join('\n').trim();
    }
    sendDataToChatbase(data) {
        const multiple = typeof data.messages !== 'undefined';
        const config = {
            data,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            url: `https://chatbase.com/api/message${multiple ? 's' : ''}`,
        };
        return jovo_core_1.HttpService.request(config).catch((e) => {
            jovo_core_1.Log.error('Error while logging to Chatbase Services');
            jovo_core_1.Log.error(e);
        });
    }
}
exports.ChatbaseAlexa = ChatbaseAlexa;
//# sourceMappingURL=ChatbaseAlexa.js.map