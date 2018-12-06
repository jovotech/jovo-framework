import { Analytics, PluginConfig, BaseApp, HandleRequest, Jovo } from "jovo-core";
import * as https from 'https';
import * as _ from 'lodash';

export interface Config extends PluginConfig {
    key: string;
    appVersion: string;
}


export class ChatbaseAlexa implements Analytics {
    config: Config = {
        key: '',
        appVersion: ''
    };

    constructor(config?: Config) {
        if (config) {
            this.config = _.merge(this.config, config);
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

        if (handleRequest.jovo.constructor.name === 'AlexaSkill') {
            const data = this.createChatbaseData(handleRequest.jovo);
            this.sendDataToChatbase(JSON.stringify(data));
        }
    }

    createChatbaseData(jovo: Jovo) {
        const outputSpeech = jovo.$response!.getOutputSpeech();
        const responseMessage = outputSpeech!.replace(/<[^>]*>/g, '');
        const timeStamp = Date.parse(jovo.$request!.getTimestamp());

        return this.buildMessages(
            jovo,
            timeStamp,
            jovo.$request!.toJSON().session.sessionId,
            responseMessage
        );
    }

    buildMessages(jovo: Jovo, timeStamp: number, sessionId: string, responseMessage: string) {
        const slots = [];
        const intentSlots = jovo.$inputs;
        let intentName = '';
        const userId = jovo.$request!.getUserId();
        let message = '';

        if(jovo.$type.type === 'INTENT') {
            if(intentSlots) {
                for(const name in intentSlots) {
                    if(intentSlots[name] && intentSlots[name].value) {
                        const value = intentSlots[name].value;
                        slots.push(`${name}: ${value}`);
                    }
                }
                intentName = jovo.$request!.toJSON().request.intent.name;
                message = intentName + '\n' + slots.join('\n');
            }
        } else {
            intentName = jovo.$type.type!;
        }

        return {
            messages: [
                {
                    api_key: this.config.key,
                    type: 'user',
                    user_id: userId,
                    time_stamp: timeStamp,
                    platform: 'Alexa',
                    intent: intentName,
                    message,
                    not_handled: jovo.$plugins.Router.route.path, // TODO substring with path
                    version: this.config.appVersion,
                    session_id: sessionId,
                },
                {
                    api_key: this.config.key,
                    type: 'agent',
                    user_id: userId,
                    time_stamp: Date.now(),
                    platform: 'Alexa',
                    responseMessage,
                    version: this.config.appVersion,
                    session_id: sessionId,
                }
            ]
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
