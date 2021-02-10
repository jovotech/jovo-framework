"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Lindenbaum_1 = require("../Lindenbaum");
const LindenbaumRequest_1 = require("./LindenbaumRequest");
class LindenbaumRequestBuilder {
    constructor() {
        this.type = Lindenbaum_1.Lindenbaum.appType;
    }
    async launch(json) {
        return await this.launchRequest(json);
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
            return await this.intentRequest(obj);
        }
    }
    async launchRequest(json) {
        if (json) {
            return LindenbaumRequest_1.LindenbaumRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('LaunchRequest')));
            return LindenbaumRequest_1.LindenbaumRequest.fromJSON(JSON.parse(request))
                .setTimestamp(new Date().toISOString())
                .setUserId(randomUserId());
        }
    }
    async intentRequest(json) {
        if (json) {
            return LindenbaumRequest_1.LindenbaumRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('IntentRequest')));
            return LindenbaumRequest_1.LindenbaumRequest.fromJSON(JSON.parse(request))
                .setTimestamp(new Date().toISOString())
                .setUserId(randomUserId());
        }
    }
    async end(json) {
        if (json) {
            return LindenbaumRequest_1.LindenbaumRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('EndRequest')));
            return LindenbaumRequest_1.LindenbaumRequest.fromJSON(JSON.parse(request))
                .setTimestamp(new Date().toISOString())
                .setUserId(randomUserId());
        }
    }
    /**
     * Autopilot doesn't have audio player requests
     */
    async audioPlayerRequest(json) {
        return await this.intentRequest();
    }
    async rawRequest(json) {
        return LindenbaumRequest_1.LindenbaumRequest.fromJSON(json);
    }
    async rawRequestByKey(key) {
        const req = JSON.stringify(require(getJsonFilePath(key)));
        return LindenbaumRequest_1.LindenbaumRequest.fromJSON(JSON.parse(req));
    }
}
exports.LindenbaumRequestBuilder = LindenbaumRequestBuilder;
const samples = {
    LaunchRequest: 'LaunchRequest.json',
    IntentRequest: 'IntentRequest.json',
    EndRequest: 'EndRequest.json',
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
//# sourceMappingURL=LindenbaumRequestBuilder.js.map