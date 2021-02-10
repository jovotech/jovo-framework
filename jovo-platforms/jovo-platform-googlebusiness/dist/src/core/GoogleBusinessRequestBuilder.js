"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const path = require("path");
const GoogleBusiness_1 = require("../GoogleBusiness");
const GoogleBusinessRequest_1 = require("./GoogleBusinessRequest");
class GoogleBusinessRequestBuilder {
    constructor() {
        this.type = GoogleBusiness_1.GoogleBusiness.appType;
    }
    async launch(json) {
        return this.launchRequest(json);
    }
    // tslint:disable-next-line:no-any
    async intent(obj, inputs) {
        if (typeof obj === 'string') {
            const req = await this.intentRequest();
            req.setIntentName(obj);
            if (inputs) {
                for (const slot in inputs) {
                    if (inputs.hasOwnProperty(slot)) {
                        req.addInput(slot, inputs[slot]);
                    }
                }
            }
            return req;
        }
        else {
            return this.intentRequest(obj);
        }
    }
    async launchRequest(json) {
        return this.intentRequest(json);
    }
    async intentRequest(json) {
        if (json) {
            return GoogleBusinessRequest_1.GoogleBusinessRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('IntentRequest')));
            return GoogleBusinessRequest_1.GoogleBusinessRequest.fromJSON(JSON.parse(request))
                .setTimestamp(new Date().toISOString())
                .setSessionId(jovo_core_1.Util.randomStr(12));
        }
    }
    async end(json) {
        jovo_core_1.Log.warn("Google Business Messages doesn't have a separate request type marking the end of a session.");
        return this.intentRequest(json);
    }
    async audioPlayerRequest(json) {
        jovo_core_1.Log.warn("Google Business Messages doesn't have audio player requests.");
        return this.intentRequest(json);
    }
    async rawRequest(json) {
        return GoogleBusinessRequest_1.GoogleBusinessRequest.fromJSON(json);
    }
    async rawRequestByKey(key) {
        const req = JSON.stringify(require(getJsonFilePath(key)));
        return GoogleBusinessRequest_1.GoogleBusinessRequest.fromJSON(JSON.parse(req));
    }
}
exports.GoogleBusinessRequestBuilder = GoogleBusinessRequestBuilder;
const samples = {
    IntentRequest: 'IntentRequest.json',
};
function getJsonFilePath(key) {
    let folder = './../../../';
    if (process.env.NODE_ENV === 'UNIT_TEST') {
        folder = './../../';
    }
    const fileName = samples[key];
    if (!fileName) {
        throw new Error(`Can't find file.`);
    }
    return path.join(folder, 'sample-request-json', fileName);
}
const randomUserId = () => {
    return ('user-' +
        Math.random().toString(36).substring(5) +
        '-' +
        Math.random().toString(36).substring(2));
};
//# sourceMappingURL=GoogleBusinessRequestBuilder.js.map