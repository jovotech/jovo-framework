"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SapCaiRequest_1 = require("./SapCaiRequest");
const path = require("path");
const samples = {
    LaunchRequest: 'LaunchRequest.json',
    IntentRequest: 'IntentRequest1.json',
    IntentRequestWithSlot: 'IntentRequestWithSlot.json',
    IntentRequestWithSlotResolution: 'IntentRequestWithSlotResolution.json',
};
class SapCaiRequestBuilder {
    constructor() {
        this.type = 'SapCaiSkill';
    }
    async launch(json) {
        // tslint:disable-line
        return await this.launchRequest(json);
    }
    // tslint:disable-next-line:no-any
    async intent(obj, inputs) {
        // tslint:disable-line
        if (typeof obj === 'string') {
            const req = await this.intentRequest();
            req.setIntentName(obj);
            if (inputs) {
                for (const memoryInput in inputs) {
                    if (inputs.hasOwnProperty(memoryInput)) {
                        req.setMemoryInput(memoryInput, inputs[memoryInput]);
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
            return SapCaiRequest_1.SapCaiRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('LaunchRequest')));
            return SapCaiRequest_1.SapCaiRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }
    async intentRequest(json) {
        // tslint:disable-line
        if (json) {
            return SapCaiRequest_1.SapCaiRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('IntentRequest')));
            return SapCaiRequest_1.SapCaiRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }
    async rawRequest(json) {
        // tslint:disable-line
        return SapCaiRequest_1.SapCaiRequest.fromJSON(json);
    }
    async rawRequestByKey(key) {
        const request = JSON.stringify(require(getJsonFilePath(key)));
        return SapCaiRequest_1.SapCaiRequest.fromJSON(JSON.parse(request));
    }
    async audioPlayerRequest(json) {
        // tslint:disable-line
        if (json) {
            return SapCaiRequest_1.SapCaiRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('AudioPlayer.PlaybackStarted')));
            return SapCaiRequest_1.SapCaiRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }
    // tslint:disable-next-line:no-any
    async end(json) {
        // tslint:disable-line
        return this.intent('END', json);
    }
}
exports.SapCaiRequestBuilder = SapCaiRequestBuilder;
function getJsonFilePath(key, version = 'v1') {
    let folder = './../../../';
    if (process.env.NODE_ENV === 'UNIT_TEST') {
        folder = './../../';
    }
    const fileName = samples[key];
    if (!fileName) {
        throw new Error(`Can't find file.`);
    }
    return path.join(folder, 'sample-request-json', version, fileName);
}
//# sourceMappingURL=SapCaiRequestBuilder.js.map