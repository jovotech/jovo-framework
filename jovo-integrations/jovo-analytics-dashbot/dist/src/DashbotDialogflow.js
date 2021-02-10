"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashbot = require("dashbot"); // tslint:disable-line
const _merge = require("lodash.merge");
class DashbotDialogflow {
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
        this.dashbot = dashbot(this.config.key).google;
        app.on('response', this.track);
    }
    uninstall(app) {
        app.removeListener('response', this.track);
    }
    track(handleRequest) {
        if (!handleRequest.jovo) {
            return;
        }
        if (handleRequest.jovo.constructor.name === 'DialogflowAgent') {
            this.dashbot.logIncoming(handleRequest.host.getRequestObject());
            this.dashbot.logOutgoing(handleRequest.host.getRequestObject(), handleRequest.jovo.$response);
        }
    }
}
exports.DashbotDialogflow = DashbotDialogflow;
//# sourceMappingURL=DashbotDialogflow.js.map