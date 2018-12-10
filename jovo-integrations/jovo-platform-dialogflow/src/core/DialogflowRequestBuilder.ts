import _set = require('lodash.set');
import {RequestBuilder, JovoRequest} from "jovo-core";
import {DialogflowRequest} from "./DialogflowRequest";

const samples: {[key: string]: {[key: string]: string} | string} = {
    'google': {
        'DefaultWelcomeIntent': './../../../sample-request-json/v2/google/DefaultWelcomeIntent.json',
        'HelpIntent': './../../../sample-request-json/v2/google/HelpIntent.json',
        'MediaFinished': './../../../sample-request-json/v2/google/MediaFinished.json',
        'Cancel': './../../../sample-request-json/v2/google/Cancel.json',
    }
};

export class DialogflowRequestBuilder implements RequestBuilder {
     type = 'DialogflowAgent';
     platform: string;
     platformRequestClazz: JovoRequest;

    async launch(json?: any): Promise<DialogflowRequest> { // tslint:disable-line
        return await this.launchRequest(json);
    }
    async intent(json: any): Promise<DialogflowRequest>; // tslint:disable-line
    async intent(name: string, inputs?: any): Promise<DialogflowRequest>; // tslint:disable-line
    async intent(obj: any, inputs?: any): Promise<DialogflowRequest> { // tslint:disable-line
        if (typeof obj === 'string') {
            const req = await this.intentRequest();
            _set(req, `queryResult.intent.displayName`, obj);
            if (inputs) {
                for (const parameter in inputs) {
                    if (inputs.hasOwnProperty(parameter)) {
                        req.setParameter(parameter, inputs[parameter]);
                    }
                }
            }
            return req;
        } else {
            return await this.intentRequest(obj);
        }
    }

    async launchRequest(json?: any): Promise<DialogflowRequest> { // tslint:disable-line
        if (json) {
            return DialogflowRequest.fromJSON(json);
        } else {
            // @ts-ignore
            const reqObj: any = this.platform ? samples[this.platform]['DefaultWelcomeIntent'] : samples['DefaultWelcomeIntent']; // tslint:disable-line
            const request = JSON.stringify(require(reqObj));

            const dialogflowRequest = DialogflowRequest.fromJSON(JSON.parse(request));
            // @ts-ignore
            dialogflowRequest.originalDetectIntentRequest.payload = this.platformRequestClazz.fromJSON(dialogflowRequest.originalDetectIntentRequest.payload);
            return dialogflowRequest;

        }
    }
    async intentRequest(json?: any): Promise<DialogflowRequest> { // tslint:disable-line
        if (json) {
            return DialogflowRequest.fromJSON(json);
        } else {
            // @ts-ignore
            const reqObj: string = this.platform ? samples[this.platform]['HelpIntent'] : samples['HelpIntent'];
            const request = JSON.stringify(require(reqObj));


            const dialogflowRequest = DialogflowRequest.fromJSON(JSON.parse(request));
// @ts-ignore
            dialogflowRequest.originalDetectIntentRequest.payload = this.platformRequestClazz.fromJSON(dialogflowRequest.originalDetectIntentRequest.payload);
            return dialogflowRequest;
        }
    }

    async rawRequest(json: any): Promise<DialogflowRequest> { // tslint:disable-line
        return DialogflowRequest.fromJSON(json);
    }

    async rawRequestByKey(key: string): Promise<DialogflowRequest> {
        // @ts-ignore
        const reqObj = this.platform ? samples[this.platform][key] : samples[key];
        const request = JSON.stringify(require(reqObj));

        const dialogflowRequest = DialogflowRequest.fromJSON(JSON.parse(request));
        // @ts-ignore
        dialogflowRequest.originalDetectIntentRequest.payload = this.platformRequestClazz.fromJSON(dialogflowRequest.originalDetectIntentRequest.payload);
        return dialogflowRequest;
    }
    async audioPlayerRequest(json?: any): Promise<DialogflowRequest> { // tslint:disable-line
        if (json) {
            return DialogflowRequest.fromJSON(json);
        } else {
            // @ts-ignore
            const reqObj = this.platform ? samples[this.platform]['MediaFinished'] : samples['MediaFinished'];
            const request = JSON.stringify(require(reqObj));

            const dialogflowRequest = DialogflowRequest.fromJSON(JSON.parse(request));
            // @ts-ignore
            dialogflowRequest.originalDetectIntentRequest.payload = this.platformRequestClazz.fromJSON(dialogflowRequest.originalDetectIntentRequest.payload);
            return dialogflowRequest;
        }
    }
    async end(json?: any): Promise<DialogflowRequest> { // tslint:disable-line
        if (json) {
            return DialogflowRequest.fromJSON(json);
        } else {
            // const request = await fsreadFile(samples['LAUNCH'], 'utf8');
            // @ts-ignore
            const request = JSON.stringify(require(samples['SessionEndedRequest']));
            return DialogflowRequest.fromJSON(JSON.parse(request));
        }
    }
}
