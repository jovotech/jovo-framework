
import {AlexaRequest} from "./AlexaRequest";
import {RequestBuilder} from "jovo-core";
const samples: {[key: string]: string} = {
    'LaunchRequest': './../../../sample-request-json/v1/LaunchRequest.json',
    'IntentRequest1': './../../../sample-request-json/v1/IntentRequest1.json',
    'Connections.Response': './../../../sample-request-json/v1/Connections.Response.json',
    'AudioPlayer.PlaybackStarted': './../../../sample-request-json/v1/AudioPlayer.PlaybackStarted.json',
    'SessionEndedRequest': './../../../sample-request-json/v1/SessionEndedRequest.json',

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
            // const request = await fsreadFile(samples['LAUNCH'], 'utf8');
            const request = JSON.stringify(require(samples['LaunchRequest']));
            return AlexaRequest.fromJSON(JSON.parse(request));
        }
    }
    async intentRequest(json?: any): Promise<AlexaRequest> { // tslint:disable-line
        if (json) {
            return AlexaRequest.fromJSON(json);
        } else {
            // const request = await fsreadFile(samples['LAUNCH'], 'utf8');
            const request = JSON.stringify(require(samples['IntentRequest1']));
            return AlexaRequest.fromJSON(JSON.parse(request));
        }
    }

    async rawRequest(json: any) { // tslint:disable-line
        return AlexaRequest.fromJSON(json);
    }

    async rawRequestByKey(key: string) {
        const request = JSON.stringify(require(samples[key]));
        return AlexaRequest.fromJSON(JSON.parse(request));
    }
    async audioPlayerRequest(json?: any) { // tslint:disable-line
        if (json) {
            return AlexaRequest.fromJSON(json);
        } else {
            const request = JSON.stringify(require(samples['AudioPlayer.PlaybackStarted']));
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
            const request = JSON.stringify(require(samples['SessionEndedRequest']));
            return AlexaRequest.fromJSON(JSON.parse(request));
        }
    }
}
