import { BaseApp, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
import PulseLabsRecorder = require('pulselabs-recorder');

export interface Config extends PluginConfig {
    apiKey: string;
    debug?: boolean;
    timeout?: number;
}

export class PulseLabs implements Plugin {

    pulse: PulseLabsRecorder;

    constructor(config: Config) {
        const initOptions = {
            debug: config.debug,
            integrationType: 'Jovo',
            timeout: config.timeout
        };
        this.pulse = PulseLabsRecorder.init(config.apiKey, initOptions);
    }

    install(app: BaseApp) {
        app.on('after.response', this.logData.bind(this));
    }

    async logData(handleRequest: HandleRequest) {
        await this.pulse.logData(
            handleRequest.jovo!.$request,
            handleRequest.jovo!.$response
        );
    }
}
