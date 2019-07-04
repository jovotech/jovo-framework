import { Handler, PluginConfig } from 'jovo-core';

import _merge = require('lodash.merge');

class Component {
	config: Config = {};
	handler: Handler = {};
	data?: ComponentData;
	onCompletedIntent?: string; // intent to which the component routes to, when it sends out response
	$response?: Response;
	stateBeforeDelegate?: string; // Used to route the app back to the state where it left off after the component is done.

	constructor(config?: Config) {
		if (config) {
			this.config = _merge(this.config, config);
		}
	}
}

interface ComponentData {
	[key: string]: any; // tslint:disable-line
}

interface Config extends PluginConfig {
	intentMap?: {
		[key: string]: string;
	};
}

interface DelegationOptions {
	data?: ComponentData
	onCompletedIntent: string;
}

interface Response {
	data?: ComponentData
	error?: Error;
	status: ResponseStatus;
}

type ResponseStatus = 'SUCCESSFUL' | 'REJECTED' | 'ERROR';

export {
	Component,
	ComponentData,
	Config as ComponentConfig,
	DelegationOptions as ComponentDelegationOptions,
	Response as ComponentResponse,
	ResponseStatus as ComponentResponseStatus
};