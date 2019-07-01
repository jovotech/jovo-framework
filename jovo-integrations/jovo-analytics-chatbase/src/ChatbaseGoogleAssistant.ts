import * as https from 'https';
import {
    Analytics,
    BaseApp,
    HandleRequest,
    Jovo,
    Log,
    PluginConfig
} from 'jovo-core';
import _merge = require('lodash.merge');
export interface Config extends PluginConfig {
	key: string;
	appVersion: string;
}

export class ChatbaseGoogleAssistant implements Analytics {
	config: Config = {
        appVersion: '',
        key: ''
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
            intent:
				jovo.$type.type !== 'INTENT'
					? jovo.$type.type
					: jovo.$request!.toJSON().request.intent.name,
            platform: 'Actions',
            session_id: jovo.$request!.toJSON().session.sessionId,
            time_stamp: Date.now(),
            type: 'user',
            user_id: jovo.$request!.getUserId(),
            version: this.config.appVersion
        };
	}

	sendDataToChatbase(data: string) {
		const dataAsJSON = JSON.parse(data);
		if (dataAsJSON) {
			const multiple = dataAsJSON.messages !== undefined;

			const objectAsString = data;
			const options = {
                headers: {
                    'Content-Length': Buffer.byteLength(objectAsString),
                    'Content-Type': 'application/json'
                },
                host: 'chatbase.com',
                method: 'POST',
                path: multiple ? '/api/messages' : '/api/message'
			};

			const httpRequest = https.request(options);

			httpRequest.on('error ', error => {
				Log.error('Error while logging to Chatbase Services');
				Log.error(error);
			});
			httpRequest.end(objectAsString);
		}
	}
}
