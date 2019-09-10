import { Analytics, BaseApp, HandleRequest, PluginConfig } from 'jovo-core';
import _merge = require('lodash.merge');
import { AmazonAlexa } from 'voicehero-sdk';
import * as voicehero from 'voicehero-sdk'; // tslint:disable-line

export interface Config extends PluginConfig {
	key: string;
}

export class VoiceHeroAlexa implements Analytics {
	config: Config = {
		key: ''
	};
	voicehero!: AmazonAlexa;

	constructor(config?: Config) {
		if (config) {
			this.config = _merge(this.config, config);
		}
		this.track = this.track.bind(this);
	}

	install(app: BaseApp) {
		// @ts-ignore
		this.voicehero = voicehero(this.config.key).alexa;
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
			this.voicehero.logIncoming(handleRequest.host.getRequestObject());
			this.voicehero.logOutgoing(
				handleRequest.host.getRequestObject(),
				handleRequest.jovo.$response!
			);
		}
	}
}
