"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const __1 = require("..");
const __2 = require("..");
const jovo_core_2 = require("jovo-core");
class ProactiveEvent {
    constructor(alexaSkill) {
        this.alexaSkill = alexaSkill;
    }
    async getAccessToken(clientId, clientSecret) {
        const authObject = await this.sendAuthRequest(clientId, clientSecret);
        return authObject.access_token;
    }
    async sendAuthRequest(clientId, clientSecret) {
        const authObject = await __2.AlexaAPI.proactiveEventAuthorization(clientId, clientSecret);
        return authObject;
    }
    async sendProactiveEvent(proactiveEvent, accessToken, live = false) {
        if (!accessToken) {
            throw new jovo_core_2.JovoError("Can't find accessToken", jovo_core_1.ErrorCode.ERR, 'jovo-platform-alexa', 'To send out Proactive Events you have to provide an accessToken', 'Try to get an accessToken by calling "this.$alexaSkill.$proactiveEvent.getAccessToken(clientId, clientSecret)"');
        }
        const alexaRequest = this.alexaSkill.$request;
        const options = {
            endpoint: alexaRequest.getApiEndpoint(),
            method: 'POST',
            path: live ? '/v1/proactiveEvents' : '/v1/proactiveEvents/stages/development',
            permissionToken: accessToken,
            json: proactiveEvent,
        };
        const result = await __2.AlexaAPI.apiCall(options);
        return result;
    }
}
exports.ProactiveEvent = ProactiveEvent;
class ProactiveEventPlugin {
    install(alexa) {
        alexa.middleware('$type').use(this.type.bind(this));
        __1.AlexaSkill.prototype.$proactiveEvent = undefined;
        __1.AlexaSkill.prototype.proactiveEvent = function () {
            return this.$proactiveEvent;
        };
    }
    uninstall(alexa) { }
    type(alexaSkill) {
        alexaSkill.$proactiveEvent = new ProactiveEvent(alexaSkill);
    }
}
exports.ProactiveEventPlugin = ProactiveEventPlugin;
//# sourceMappingURL=ProactiveEvent.js.map