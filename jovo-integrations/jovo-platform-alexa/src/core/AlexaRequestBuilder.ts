
import {AlexaRequest} from "./AlexaRequest";
import {RequestBuilder} from "jovo-core";
import * as path from 'path';
const samples: {[key: string]: string} = {
    'LaunchRequest': 'LaunchRequest.json',
    'IntentRequest1': 'IntentRequest1.json',
    'Connections.Response': 'Connections.Response.json',
    'AudioPlayer.PlaybackStarted': 'AudioPlayer.PlaybackStarted.json',
    'SessionEndedRequest': 'SessionEndedRequest.json',
};

export class AlexaRequestBuilder implements RequestBuilder {
     type = 'AlexaSkill';

    async launch(json?: any): Promise<AlexaRequest> { // tslint:disable-line
        return await this.launchRequest(json);
    }
    async intent(json: any): Promise<AlexaRequest>; // tslint:disable-line
    async intent(name: string, inputs?: any): Promise<AlexaRequest>; // tslint:disable-line
    async intent(obj: any, inputs?: any): Promise<AlexaRequest> { // tslint:disable-line
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
        } else {
            return await this.intentRequest(obj);
        }
    }

    async launchRequest(json?: any): Promise<AlexaRequest>  {  //tslint:disable-line
        if (json) {
            return AlexaRequest.fromJSON(json);
        } else {
            // const request = await fsreadFile(getJsonFilePath('LAUNCH'], 'utf8');
            const request = JSON.stringify(require(getJsonFilePath('LaunchRequest')));
            return AlexaRequest.fromJSON(JSON.parse(request));
        }
    }
    async intentRequest(json?: any): Promise<AlexaRequest> { // tslint:disable-line
        if (json) {
            return AlexaRequest.fromJSON(json);
        } else {
            // const request = await fsreadFile(getJsonFilePath('LAUNCH'], 'utf8');
            const request = JSON.stringify(require(getJsonFilePath('IntentRequest1')));
            return AlexaRequest.fromJSON(JSON.parse(request));
        }
    }

    async rawRequest(json: any) { // tslint:disable-line
        return AlexaRequest.fromJSON(json);
    }

    async rawRequestByKey(key: string) {
        const request = JSON.stringify(require(getJsonFilePath(key)));
        return AlexaRequest.fromJSON(JSON.parse(request));
    }
    async audioPlayerRequest(json?: any) { // tslint:disable-line
        if (json) {
            return AlexaRequest.fromJSON(json);
        } else {
            const request = JSON.stringify(require(getJsonFilePath('AudioPlayer.PlaybackStarted')));
            return AlexaRequest.fromJSON(JSON.parse(request));
        }
    }
    /**
     * End
     * @param {object|string} json
     * @return {SessionEndedRequest}
     */
    async end(json?: any) { // tslint:disable-line
        if (json) {
            return AlexaRequest.fromJSON(json);
        } else {
            const request = JSON.stringify(require(getJsonFilePath('SessionEndedRequest')));
            return AlexaRequest.fromJSON(JSON.parse(request));
        }
    }
}


function getJsonFilePath(key: string, version = 'v1'): string {
    const folder = './../../../';

    if (process.env.NODE_ENV === 'test') {
        // folder = './../../';
    }

    const fileName = samples[key];

    if (!fileName) {
        throw new Error(`Can't find file.`);
    }

    return path.join(
        folder,
        'sample-request-json',
        version,
        fileName);
}
