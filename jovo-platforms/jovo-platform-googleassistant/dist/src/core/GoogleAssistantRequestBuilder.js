"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleActionRequest_1 = require("./GoogleActionRequest");
const samples = {
    'LaunchRequest': './../../sample-request-json/v1/LaunchRequest.json',
    'IntentRequest1': './../../sample-request-json/v1/IntentRequest1.json',
    'Connections.Response': './../../sample-request-json/v1/Connections.Response.json',
    'AudioPlayer.PlaybackStarted': './../../sample-request-json/v1/AudioPlayer.PlaybackStarted.json',
};
class GoogleAssistantRequestBuilder {
    constructor() {
        this.type = 'GoogleAction';
    }
    launch(json) {
        return this.launchRequest(json);
    }
    async intent(obj, inputs) {
        if (typeof obj === 'string') {
            const req = await this.intentRequest();
            return req;
        }
        else {
            return await this.intentRequest(obj);
        }
    }
    async launchRequest(json) {
        if (json) {
            return GoogleActionRequest_1.GoogleActionRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(samples['LaunchRequest']));
            return GoogleActionRequest_1.GoogleActionRequest.fromJSON(JSON.parse(request));
        }
    }
    async intentRequest(json) {
        if (json) {
            return GoogleActionRequest_1.GoogleActionRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(samples['IntentRequest1']));
            return GoogleActionRequest_1.GoogleActionRequest.fromJSON(JSON.parse(request));
        }
    }
    async rawRequest(json) {
        return GoogleActionRequest_1.GoogleActionRequest.fromJSON(json);
    }
    async rawRequestByKey(key) {
        const request = JSON.stringify(require(samples[key]));
        return GoogleActionRequest_1.GoogleActionRequest.fromJSON(JSON.parse(request));
    }
    async audioPlayerRequest(json) {
        if (json) {
            return GoogleActionRequest_1.GoogleActionRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(samples['IntentRequest1']));
            return GoogleActionRequest_1.GoogleActionRequest.fromJSON(JSON.parse(request));
        }
    }
    async end(json) {
        if (json) {
            return GoogleActionRequest_1.GoogleActionRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(samples['IntentRequest1']));
            return GoogleActionRequest_1.GoogleActionRequest.fromJSON(JSON.parse(request));
        }
    }
}
exports.GoogleAssistantRequestBuilder = GoogleAssistantRequestBuilder;
//# sourceMappingURL=GoogleAssistantRequestBuilder.js.map