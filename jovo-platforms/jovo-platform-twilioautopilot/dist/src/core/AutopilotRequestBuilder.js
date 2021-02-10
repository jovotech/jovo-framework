"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const AutopilotRequest_1 = require("./AutopilotRequest");
const samples = {
    LaunchRequest: 'LaunchRequest.json',
    IntentRequest: 'IntentRequest.json',
    EndRequest: 'EndRequest.json',
};
class AutopilotRequestBuilder {
    constructor() {
        this.type = 'AutopilotBot';
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
            return AutopilotRequest_1.AutopilotRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('LaunchRequest')));
            return AutopilotRequest_1.AutopilotRequest.fromJSON(JSON.parse(request))
                .setTimestamp(new Date().toISOString())
                .setSessionId(generateRandomString(12))
                .setUserId(getRandomUserId());
        }
    }
    async intentRequest(json) {
        if (json) {
            return AutopilotRequest_1.AutopilotRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('IntentRequest')));
            return AutopilotRequest_1.AutopilotRequest.fromJSON(JSON.parse(request))
                .setTimestamp(new Date().toISOString())
                .setSessionId(generateRandomString(12))
                .setUserId(getRandomUserId());
        }
    }
    /**
     * Autopilot doesn't have audio player requests
     */
    async audioPlayerRequest(json) {
        return await this.intentRequest();
    }
    async end(json) {
        if (json) {
            return AutopilotRequest_1.AutopilotRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('EndRequest')));
            return AutopilotRequest_1.AutopilotRequest.fromJSON(JSON.parse(request))
                .setTimestamp(new Date().toISOString())
                .setSessionId(generateRandomString(12))
                .setUserId(getRandomUserId());
        }
    }
    async rawRequest(json) {
        return AutopilotRequest_1.AutopilotRequest.fromJSON(json);
    }
    async rawRequestByKey(key) {
        const req = JSON.stringify(require(getJsonFilePath(key)));
        return AutopilotRequest_1.AutopilotRequest.fromJSON(JSON.parse(req));
    }
}
exports.AutopilotRequestBuilder = AutopilotRequestBuilder;
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
/**
 * Generates a random string [a-z][A-Z][0-9] with `length` number of characters.
 * @param {number} length
 */
function generateRandomString(length) {
    let randomString = '';
    const stringValues = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        randomString += stringValues.charAt(Math.floor(Math.random() * stringValues.length));
    }
    return randomString;
}
function getRandomUserId() {
    return ('user-' +
        Math.random().toString(36).substring(5) +
        '-' +
        Math.random().toString(36).substring(2));
}
//# sourceMappingURL=AutopilotRequestBuilder.js.map