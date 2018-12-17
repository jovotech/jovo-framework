import { Analytics, PluginConfig, BaseApp, HandleRequest, Jovo } from "jovo-core";
import * as https from 'https';
import _merge = require('lodash.merge');
export interface Config extends PluginConfig {
    key: string;
    appVersion: string;
}


export class ChatbaseGoogleAssistant implements Analytics {
    config: Config = {
        key: '',
        appVersion: ''
    };

    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.track = this.track.bind(this);
    }

    install(app: BaseApp) {
        app.on('response', this.track);
    }

    uninstall(app: BaseApp) {
        app.removeListener('response', this.track);
    }

    track(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            return;
        }

        if (handleRequest.jovo.constructor.name === 'GoogleAction') {
            const data = this.createChatbaseData(handleRequest.jovo);
            this.sendDataToChatbase(JSON.stringify(data));
        }
    }

    createChatbaseData(jovo: Jovo) {
        return {
            api_key: this.config.key,
            type: 'user',
            user_id: jovo.$request!.getUserId(),
            time_stamp: Date.now(),
            platform: 'Actions',
            intent: jovo.$type.type !== 'INTENT' ? jovo.$type.type
                : jovo.$request!.toJSON().request.intent.name,
            version: this.config.appVersion,
            session_id: jovo.$request!.toJSON().session.sessionId,
        };
    }

    sendDataToChatbase(data: string) {
        const dataAsJSON = JSON.parse(data);
        if(dataAsJSON) {
            const multiple = dataAsJSON.messages !== undefined;

            const objectAsString = data;
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

            httpRequest.on('error ', (error) => {
                console.error(
                    'Error while logging to Chatbase Services',
                    error
                );
            });
            httpRequest.end(objectAsString);
        }
    }
}
