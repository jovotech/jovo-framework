import { BaseApp, HandleRequest, Plugin, Jovo } from 'jovo-core';
import _merge = require('lodash.merge');
import type { BixbyRequest } from 'jovo-platform-bixby';
import type { AlexaSkill } from 'jovo-platform-alexa';
import type { BixbyCapsule } from 'jovo-platform-bixby';
import type { GoogleAction } from 'jovo-platform-googleassistant';

declare module 'jovo-core/dist/src/core/Jovo' {
	export interface Jovo {
		$logger: MyCustomLogger;
	}
}

export interface Config {
	prefix?: string;
}

export class PluginB implements Plugin {
	config: Config = {
		prefix: '--- ',
	};
	constructor(config?: Config) {
		if (config) {
			_merge(this.config, config);
		}
	}

	install(app: BaseApp): void {
		app
			.middleware('after.platform.init')!
			.use(this.afterPlatformInit.bind(this));
	}

	afterPlatformInit(handleRequest: HandleRequest) {
		if (!handleRequest.jovo) {
			return Promise.resolve();
		}

		handleRequest.jovo.$logger = new MyCustomLogger(
			handleRequest.jovo,
			this.config
		);
	}
}

export class MyCustomLogger {
	jovo: Jovo;
	config: Config;

	constructor(jovo: Jovo, config: Config) {
		this.jovo = jovo;
		this.config = config;
	}

	log(text: string) {
		let platform = '';

		if (this.jovo.getType() === 'AlexaSkill') {
			platform = (this.jovo.$alexaSkill! as AlexaSkill).constructor.name;
		} else if (this.jovo.getType() === 'GoogleAction') {
			platform = (this.jovo.$googleAction! as GoogleAction).constructor.name;
		} else if (this.jovo.getType() === 'BixbyCapsule') {
			platform = (this.jovo.$bixbyCapsule! as BixbyCapsule).constructor.name;
		}

		console.log(`${this.config.prefix}${platform}: ${text}`);
	}
}
