import { BaseApp, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
import _merge = require('lodash.merge');
const pulseLabsRecorder = require('pulselabs-recorder');

export interface Config extends PluginConfig {
    apiKey: string;
}

export class PulseLabs implements Plugin {
    config: Config = {
        apiKey: ''
    };
    pulse: typeof pulseLabsRecorder;
    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.pulse = pulseLabsRecorder.init(this.config.apiKey);
    }

    async install(app: BaseApp) {
        app.on('after.response', await this.logData.bind(this));
    }

    async logData(handleRequest: HandleRequest) {
        await this.pulse.logData(
            handleRequest.jovo!.$request,
            handleRequest.jovo!.$response
        );
    }
}