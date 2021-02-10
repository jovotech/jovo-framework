"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AlexaRequest_1 = require("./AlexaRequest");
const path = require("path");
const samples = {
    'LaunchRequest': 'LaunchRequest.json',
    'IntentRequest1': 'IntentRequest1.json',
    'IntentRequestWithSlot': 'IntentRequestWithSlot.json',
    'IntentRequestWithSlotResolution': 'IntentRequestWithSlotResolution.json',
    'IntentRequestWithSlotResolutionNoMatch': 'IntentRequestWithSlotResolutionNoMatch.json',
    'Connections.Response': 'Connections.Response.json',
    'AudioPlayer.PlaybackStarted': 'AudioPlayer.PlaybackStarted.json',
    'SessionEndedRequest': 'SessionEndedRequest.json',
    'System.ExceptionEncountered': 'System.ExceptionEncountered.json',
    'PlaybackController.PlayCommandIssued': 'PlaybackController.PlayCommandIssued.json',
    'AlexaSkillEvent.SkillDisabled': 'AlexaSkillEvent.SkillDisabled.json',
    'DialogDelegateRequest': 'DialogDelegateRequest.json',
    'Display.ElementSelected': 'Display.ElementSelected.json',
};
class AlexaRequestBuilder {
    constructor() {
        this.type = 'AlexaSkill';
    }
    async launch(json) {
        // tslint:disable-line
        return await this.launchRequest(json);
    }
    // tslint:disable-next-line
    async intent(obj, inputs) {
        if (typeof obj === 'string') {
            const req = await this.intentRequest();
            req.setIntentName(obj);
            if (inputs) {
                for (const slot in inputs) {
                    if (inputs.hasOwnProperty(slot)) {
                        req.setSlot(slot, inputs[slot]);
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
        //tslint:disable-line
        if (json) {
            return AlexaRequest_1.AlexaRequest.fromJSON(json);
        }
        else {
            // const request = await fsreadFile(getJsonFilePath('LAUNCH'], 'utf8');
            const request = JSON.stringify(require(getJsonFilePath('LaunchRequest')));
            return AlexaRequest_1.AlexaRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }
    async intentRequest(json) {
        // tslint:disable-line
        if (json) {
            return AlexaRequest_1.AlexaRequest.fromJSON(json);
        }
        else {
            // const request = await fsreadFile(getJsonFilePath('LAUNCH'], 'utf8');
            const request = JSON.stringify(require(getJsonFilePath('IntentRequest1')));
            return AlexaRequest_1.AlexaRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }
    async rawRequest(json) {
        // tslint:disable-line
        return AlexaRequest_1.AlexaRequest.fromJSON(json);
    }
    async rawRequestByKey(key) {
        const request = JSON.stringify(require(getJsonFilePath(key)));
        return AlexaRequest_1.AlexaRequest.fromJSON(JSON.parse(request));
    }
    async audioPlayerRequest(json) {
        // tslint:disable-line
        if (json) {
            return AlexaRequest_1.AlexaRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('AudioPlayer.PlaybackStarted')));
            return AlexaRequest_1.AlexaRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }
    /**
     * End
     * @param {object|string} json
     * @return {SessionEndedRequest}
     */
    // tslint:disable-next-line
    async end(json) {
        if (json) {
            return AlexaRequest_1.AlexaRequest.fromJSON(json);
        }
        else {
            const request = JSON.stringify(require(getJsonFilePath('SessionEndedRequest')));
            return AlexaRequest_1.AlexaRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }
}
exports.AlexaRequestBuilder = AlexaRequestBuilder;
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
//# sourceMappingURL=AlexaRequestBuilder.js.map