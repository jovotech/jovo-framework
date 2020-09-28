import { SpeechBuilder } from 'jovo-core';
import { WebApp } from './WebApp';

export class WebAppSpeechBuilder extends SpeechBuilder {
	constructor(webApp: WebApp) {
		super(webApp);
	}
}
