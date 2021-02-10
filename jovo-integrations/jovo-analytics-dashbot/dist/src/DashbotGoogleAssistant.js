"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashbot = require("dashbot"); // tslint:disable-line
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
class DashbotGoogleAssistant {
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
        if (handleRequest.jovo.constructor.name === 'GoogleAction') {
            this.dashbot.logIncoming(handleRequest.host.getRequestObject());
            const responseObj = Object.assign({}, handleRequest.jovo.$response);
            // @ts-ignore
            let userStorage = {};
            try {
                userStorage = JSON.parse(_get(responseObj, 'payload.google.userStorage', {}));
                userStorage.dashbotUser = {
                    userId: handleRequest.jovo.$user.getId(),
                };
                _set(responseObj, 'payload.google.userStorage', JSON.stringify(userStorage, null, ''));
            }
            catch (e) {
                jovo_core_1.Log.error(e);
            }
            this.dashbot.logOutgoing(handleRequest.host.getRequestObject(), responseObj);
        }
    }
}
exports.DashbotGoogleAssistant = DashbotGoogleAssistant;
//# sourceMappingURL=DashbotGoogleAssistant.js.map