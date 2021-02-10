"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _merge = require("lodash.merge");
const PulseLabsRecorder = require("pulselabs-recorder");
class PulseLabs {
    constructor(config) {
        this.config = {
            apiKey: '',
            options: {
                debug: false,
                timeout: 2000,
            },
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        const initOptions = Object.assign(Object.assign({}, this.config.options), { integrationType: 'Jovo' });
        this.pulse = PulseLabsRecorder.init(this.config.apiKey, initOptions);
    }
    install(app) {
        app.on('after.response', this.logData.bind(this));
    }
    async logData(handleRequest) {
        if (handleRequest.jovo.constructor.name === 'AlexaSkill') {
            await this.pulse.logData(handleRequest.jovo.$request, handleRequest.jovo.$response);
        }
        else if (handleRequest.jovo.constructor.name === 'GoogleAction') {
            await this.pulse.logGoogleData(handleRequest.jovo.$request, handleRequest.jovo.$response, handleRequest.jovo.$user.getId());
        }
    }
}
exports.PulseLabs = PulseLabs;
//# sourceMappingURL=PulseLabs.js.map