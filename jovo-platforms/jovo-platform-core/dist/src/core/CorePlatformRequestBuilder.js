"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const CorePlatformRequest_1 = require("./CorePlatformRequest");
class CorePlatformRequestBuilder {
    constructor() {
        this.type = 'CorePlatformApp';
        this.requestClass = CorePlatformRequest_1.CorePlatformRequest;
    }
    async launch(json) {
        return this.launchRequest(json);
    }
    async launchRequest(json) {
        if (json) {
            return this.requestClass.fromJSON(json);
        }
        else {
            const req = JSON.stringify(this.loadJson('LaunchRequest'));
            return this.requestClass.fromJSON(JSON.parse(req)).setTimestamp(new Date().toISOString());
        }
    }
    // tslint:disable-next-line:no-any
    async intent(obj, inputs) {
        if (typeof obj === 'string') {
            const req = await this.intentRequest();
            req.setIntentName(obj);
            if (inputs) {
                for (const input in inputs) {
                    if (inputs.hasOwnProperty(input)) {
                        req.addInput(input, inputs[input]);
                    }
                }
            }
            return req;
        }
        else {
            return this.intentRequest(obj);
        }
    }
    async intentRequest(json) {
        if (json) {
            return this.requestClass.fromJSON(json);
        }
        else {
            const req = JSON.stringify(this.loadJson('IntentRequest'));
            return this.requestClass.fromJSON(JSON.parse(req)).setTimestamp(new Date().toISOString());
        }
    }
    async rawRequest(json) {
        return this.requestClass.fromJSON(json);
    }
    async rawRequestByKey(key) {
        const req = JSON.stringify(this.loadJson(key));
        return this.requestClass.fromJSON(JSON.parse(req));
    }
    async audioPlayerRequest(json) {
        if (json) {
            return this.requestClass.fromJSON(json);
        }
        else {
            const req = JSON.stringify(this.loadJson('AudioPlayerRequest'));
            return this.requestClass.fromJSON(JSON.parse(req)).setTimestamp(new Date().toISOString());
        }
    }
    async end(json) {
        if (json) {
            return this.requestClass.fromJSON(json);
        }
        else {
            const request = JSON.stringify(this.loadJson('SessionEndedRequest'));
            return this.requestClass.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }
    getJsonPath(key, version) {
        let folder = './../../../';
        if (process.env.NODE_ENV === 'UNIT_TEST') {
            folder = './../../';
        }
        const fileName = `${key}.json`;
        if (!fileName) {
            throw new Error(`Can't find file.`);
        }
        return path.join(folder, 'sample-request-json', version, fileName);
    }
    // tslint:disable-next-line:no-any
    loadJson(key, version = 'v1') {
        return require(this.getJsonPath(key, version));
    }
}
exports.CorePlatformRequestBuilder = CorePlatformRequestBuilder;
//# sourceMappingURL=CorePlatformRequestBuilder.js.map