"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _merge = require("lodash.merge");
const botanalytics_1 = require("botanalytics");
class BotanalyticsAlexa {
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
        this.botanalytics = botanalytics_1.AmazonAlexa(this.config.key);
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
            this.botanalytics.log(handleRequest.jovo.$request.toJSON(), handleRequest.jovo.$response);
        }
    }
}
exports.BotanalyticsAlexa = BotanalyticsAlexa;
//# sourceMappingURL=BotanalyticsAlexa.js.map