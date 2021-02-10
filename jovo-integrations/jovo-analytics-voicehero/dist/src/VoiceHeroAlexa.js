"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _merge = require("lodash.merge");
const voicehero = require("voicehero-sdk"); // tslint:disable-line
class VoiceHeroAlexa {
    constructor(config) {
        this.config = {
            key: '',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.track = this.track.bind(this);
    }
    install(app) {
        // @ts-ignore
        this.voicehero = voicehero(this.config.key).alexa;
        app.on('response', this.track);
    }
    uninstall(app) {
        app.removeListener('response', this.track);
    }
    track(handleRequest) {
        if (!handleRequest.jovo) {
            return;
        }
        if (handleRequest.jovo.constructor.name === 'AlexaSkill') {
            this.voicehero.logIncoming(handleRequest.host.getRequestObject());
            this.voicehero.logOutgoing(handleRequest.host.getRequestObject(), handleRequest.jovo.$response);
        }
    }
}
exports.VoiceHeroAlexa = VoiceHeroAlexa;
//# sourceMappingURL=VoiceHeroAlexa.js.map