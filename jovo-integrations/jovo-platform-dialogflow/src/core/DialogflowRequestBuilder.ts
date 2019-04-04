import _set = require('lodash.set');
import {RequestBuilder, JovoRequest} from "jovo-core";
import {DialogflowRequest} from "./DialogflowRequest";
import * as path from "path";

const samples: {[key: string]: {[key: string]: string} | string} = {
    'google': {
        'DefaultWelcomeIntent': 'DefaultWelcomeIntent.json',
        'HelpIntent': 'HelpIntent.json',
        'MediaFinished': 'MediaFinished.json',
        'Cancel': 'Cancel.json',
        'SignInCancelled': 'SignInCancelled.json',
        'SignInOk': 'SignInOk.json',
        'RegisterUpdateCancelled': 'RegisterUpdateCancelled.json',
        'RegisterUpdateOk': 'RegisterUpdateOk.json',
        'OnPermissionName': 'OnPermissionName.json',
        'OnPermissionPreciseLocation': 'OnPermissionPreciseLocation.json',
        'OnPermissionNotification': 'OnPermissionNotification.json',
        'CompletePurchase': 'CompletePurchase.json',
        'OnPlace': 'OnPlace.json'
    }
};

export class DialogflowRequestBuilder implements RequestBuilder<DialogflowRequest> {
     type = 'DialogflowAgent';
     platform: string;
     platformRequestClazz: JovoRequest;

    async launch(json?: object): Promise<DialogflowRequest> { // tslint:disable-line
        return await this.launchRequest(json);
    }
    async intent(json?: object): Promise<DialogflowRequest>; // tslint:disable-line
    async intent(name?: string, inputs?: any): Promise<DialogflowRequest>; // tslint:disable-line
    async intent(obj?: any, inputs?: any): Promise<DialogflowRequest> { // tslint:disable-line
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

    async launchRequest(json?: object): Promise<DialogflowRequest> { // tslint:disable-line
        if (json) {
            return DialogflowRequest.fromJSON(json);
        } else {
            // @ts-ignore
            const reqObj: any = this.platform ? getJsonFilePath('DefaultWelcomeIntent', this.platform) : getJsonFilePath('DefaultWelcomeIntent'); // tslint:disable-line
            const request = JSON.stringify(require(reqObj));

            const dialogflowRequest = DialogflowRequest.fromJSON(JSON.parse(request));
            // @ts-ignore
            dialogflowRequest.originalDetectIntentRequest.payload = this.platformRequestClazz.fromJSON(dialogflowRequest.originalDetectIntentRequest.payload);
            return dialogflowRequest;

        }
    }
    async intentRequest(json?: object): Promise<DialogflowRequest> { // tslint:disable-line
        if (json) {
            return DialogflowRequest.fromJSON(json);
        } else {
            // @ts-ignore
            const reqObj: any = this.platform ? getJsonFilePath('HelpIntent', this.platform) : getJsonFilePath('HelpIntent'); // tslint:disable-line

            const request = JSON.stringify(require(reqObj));


            const dialogflowRequest = DialogflowRequest.fromJSON(JSON.parse(request));
// @ts-ignore
            dialogflowRequest.originalDetectIntentRequest.payload = this.platformRequestClazz.fromJSON(dialogflowRequest.originalDetectIntentRequest.payload);
            return dialogflowRequest;
        }
    }

    async rawRequest(json: object): Promise<DialogflowRequest> { // tslint:disable-line
        return DialogflowRequest.fromJSON(json);
    }

    async rawRequestByKey(key: string): Promise<DialogflowRequest> {
        // @ts-ignore
        const reqObj: any = this.platform ? getJsonFilePath(key, this.platform) : getJsonFilePath(key); // tslint:disable-line
        const request = JSON.stringify(require(reqObj));

        const dialogflowRequest = DialogflowRequest.fromJSON(JSON.parse(request));
        // @ts-ignore
        dialogflowRequest.originalDetectIntentRequest.payload = this.platformRequestClazz.fromJSON(dialogflowRequest.originalDetectIntentRequest.payload);
        return dialogflowRequest;
    }
    async audioPlayerRequest(json?: object): Promise<DialogflowRequest> { // tslint:disable-line
        if (json) {
            return DialogflowRequest.fromJSON(json);
        } else {
            // @ts-ignore
            const reqObj: any = this.platform ? getJsonFilePath('MediaFinished', this.platform) : getJsonFilePath('MediaFinished'); // tslint:disable-line
            const request = JSON.stringify(require(reqObj));

            const dialogflowRequest = DialogflowRequest.fromJSON(JSON.parse(request));
            // @ts-ignore
            dialogflowRequest.originalDetectIntentRequest.payload = this.platformRequestClazz.fromJSON(dialogflowRequest.originalDetectIntentRequest.payload);
            return dialogflowRequest;
        }
    }
    async end(json?: object): Promise<DialogflowRequest> { // tslint:disable-line
        if (json) {
            return DialogflowRequest.fromJSON(json);
        } else {
            // @ts-ignore
            const request = JSON.stringify(require(getJsonFilePath('Cancel')));
            return DialogflowRequest.fromJSON(JSON.parse(request));
        }
    }
}
function getJsonFilePath(key: string, platform = 'google'): string {
    let folder = './../../../';

    if (process.env.NODE_ENV === 'UNIT_TEST') {
        folder = './../../../';
    }

    // @ts-ignore
    const fileName = samples[platform][key];

    if (!fileName) {
        throw new Error(`Can't find file.`);
    }

    return path.join(
        folder,
        'sample-request-json',
        'v2',
        platform,
        fileName);
}
