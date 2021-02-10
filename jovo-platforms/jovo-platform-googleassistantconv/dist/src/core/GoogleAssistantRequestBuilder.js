"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConversationalActionRequest_1 = require("./ConversationalActionRequest");
const path = require("path");
const samples = {
    LaunchRequest: './../../sample-request-json/LAUNCH.json',
    IntentRequest: './../../sample-request-json/IntentRequest.json',
    EndRequest: './../../sample-request-json/EndRequest.json',
};
class GoogleAssistantRequestBuilder {
    constructor() {
        this.type = 'GoogleAction';
    }
    async launch(json) {
        return await this.launchRequest(json);
    }
    async intent(obj, inputs) {
        if (typeof obj === 'string') {
            const req = await this.intentRequest();
            req.setIntentName(obj);
            const jovoInputs = {};
            if (inputs) {
                for (const [key, value] of Object.entries(inputs)) {
                    jovoInputs[key] = {
                        value,
                    };
                }
            }
            req.setInputs(jovoInputs);
            return req;
        }
        else {
            return await this.intentRequest(obj);
        }
    }
    async launchRequest(json) {
        if (json) {
            return ConversationalActionRequest_1.ConversationalActionRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('LaunchRequest')));
            return ConversationalActionRequest_1.ConversationalActionRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }
    async intentRequest(json) {
        if (json) {
            return ConversationalActionRequest_1.ConversationalActionRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('IntentRequest')));
            return ConversationalActionRequest_1.ConversationalActionRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }
    async rawRequest(json) {
        return ConversationalActionRequest_1.ConversationalActionRequest.fromJSON(json);
    }
    async rawRequestByKey(key) {
        const request = JSON.stringify(require(getJsonFilePath(key)));
        return ConversationalActionRequest_1.ConversationalActionRequest.fromJSON(JSON.parse(request));
    }
    async audioPlayerRequest(json) {
        if (json) {
            return ConversationalActionRequest_1.ConversationalActionRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('AudioPlayer.PlaybackStarted')));
            return ConversationalActionRequest_1.ConversationalActionRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }
    async end(json) {
        if (json) {
            return ConversationalActionRequest_1.ConversationalActionRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('EndRequest')));
            return ConversationalActionRequest_1.ConversationalActionRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }
}
exports.GoogleAssistantRequestBuilder = GoogleAssistantRequestBuilder;
function getJsonFilePath(key, version = 'v1') {
    let folder = './../../../';
    if (process.env.NODE_ENV === 'UNIT_TEST') {
        folder = './../../';
    }
    const fileName = samples[key];
    if (!fileName) {
        throw new Error(`${key} Can't find file.`);
    }
    return path.join(folder, 'sample-request-json', version, fileName);
}
//# sourceMappingURL=GoogleAssistantRequestBuilder.js.map