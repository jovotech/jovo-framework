
import {SAPCAIRequest} from "./SAPCAIRequest";
import {RequestBuilder} from "jovo-core";
import * as path from 'path';
const samples: {[key: string]: string} = {
    'LaunchRequest': 'LaunchRequest.json',
    'IntentRequest1': 'IntentRequest1.json',
    'IntentRequestWithSlot': 'IntentRequestWithSlot.json',
    'IntentRequestWithSlotResolution': 'IntentRequestWithSlotResolution.json'
};

export class SAPCAIRequestBuilder implements RequestBuilder<SAPCAIRequest> {
     type = 'SAPCAISkill';

    async launch(json?: object): Promise<SAPCAIRequest> { // tslint:disable-line
        return await this.launchRequest(json);
    }
    async intent(json?: object): Promise<SAPCAIRequest>; // tslint:disable-line
    async intent(name?: string, inputs?: any): Promise<SAPCAIRequest>; // tslint:disable-line
    async intent(obj?: any, inputs?: any): Promise<SAPCAIRequest> { // tslint:disable-line
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
        } else {
            return await this.intentRequest(obj);
        }
    }

    async launchRequest(json?: object): Promise<SAPCAIRequest>  {  //tslint:disable-line
        return this.intent('LAUNCH', json);
    }
    async intentRequest(json?: object): Promise<SAPCAIRequest> { // tslint:disable-line
        if (json) {
            return SAPCAIRequest.fromJSON(json);
        } else {
            // const request = await fsreadFile(getJsonFilePath('LAUNCH'], 'utf8');
            const request = JSON.stringify(require(getJsonFilePath('IntentRequest1')));
            return SAPCAIRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }

    async rawRequest(json: object) { // tslint:disable-line
        return SAPCAIRequest.fromJSON(json);
    }

    async rawRequestByKey(key: string) {
        const request = JSON.stringify(require(getJsonFilePath(key)));
        return SAPCAIRequest.fromJSON(JSON.parse(request));
    }

    async audioPlayerRequest(json?: object) { // tslint:disable-line
        if (json) {
            return SAPCAIRequest.fromJSON(json);
        } else {
            const request = JSON.stringify(require(getJsonFilePath('AudioPlayer.PlaybackStarted')));
            return SAPCAIRequest.fromJSON(JSON.parse(request)).setTimestamp(new Date().toISOString());
        }
    }

    async end(json?: any) { // tslint:disable-line
        return this.intent('END', json);
    }

}


function getJsonFilePath(key: string, version = 'v1'): string {
    let folder = './../../../';

    if (process.env.NODE_ENV === 'UNIT_TEST') {
        folder = './../../';
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
