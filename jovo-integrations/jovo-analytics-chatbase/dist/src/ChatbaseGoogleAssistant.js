"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
class ChatbaseGoogleAssistant {
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
        if (handleRequest.jovo.constructor.name === 'GoogleAction') {
            const data = this.createChatbaseData(handleRequest.jovo);
            this.sendDataToChatbase(data);
        }
    }
    createChatbaseData(jovo) {
        return {
            api_key: this.config.key,
            intent: jovo.$type.type !== 'INTENT' ? jovo.$type.type : jovo.$request.getIntentName(),
            platform: 'Actions',
            session_id: jovo.$request.getSessionId(),
            time_stamp: Date.now(),
            type: 'user',
            user_id: jovo.$user.getId(),
            version: this.config.appVersion,
        };
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
exports.ChatbaseGoogleAssistant = ChatbaseGoogleAssistant;
//# sourceMappingURL=ChatbaseGoogleAssistant.js.map