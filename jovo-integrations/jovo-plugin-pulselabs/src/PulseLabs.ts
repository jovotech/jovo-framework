import { BaseApp, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
import _merge = require('lodash.merge');
import PulseLabsRecorder = require('pulselabs-recorder');

export interface Config extends PluginConfig {
    apiKey: string;
}

export class PulseLabs implements Plugin {
    config: Config = {
        apiKey: ''
    };
    pulse: PulseLabsRecorder;
    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.pulse = PulseLabsRecorder.init(this.config.apiKey);
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
