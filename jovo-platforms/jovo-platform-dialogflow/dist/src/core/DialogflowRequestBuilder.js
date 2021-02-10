"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _set = require("lodash.set");
const DialogflowRequest_1 = require("./DialogflowRequest");
const path = require("path");
const samples = {
    google: {
        DefaultWelcomeIntent: 'DefaultWelcomeIntent.json',
        HelpIntent: 'HelpIntent.json',
        MediaFinished: 'MediaFinished.json',
        Cancel: 'Cancel.json',
        SignInCancelled: 'SignInCancelled.json',
        SignInOk: 'SignInOk.json',
        RegisterUpdateCancelled: 'RegisterUpdateCancelled.json',
        RegisterUpdateOk: 'RegisterUpdateOk.json',
        OnPermissionName: 'OnPermissionName.json',
        OnPermissionPreciseLocation: 'OnPermissionPreciseLocation.json',
        OnPermissionNotification: 'OnPermissionNotification.json',
        CompletePurchase: 'CompletePurchase.json',
        OnPlace: 'OnPlace.json',
    },
    dialogflow: {
        DefaultWelcomeIntent: 'DefaultWelcomeIntent.json',
        HelpIntent: 'HelpIntent.json',
    },
};
class DialogflowRequestBuilder {
    constructor(factory) {
        this.factory = factory;
        this.type = 'DialogflowAgent';
    }
    async launch(json) {
        // tslint:disable-line
        return await this.launchRequest(json);
    }
    // tslint:disable-next-line
    async intent(obj, inputs) {
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
        }
        else {
            return await this.intentRequest(obj);
        }
    }
    async launchRequest(json) {
        // tslint:disable-line
        if (json) {
            return this.factory.createRequest(json);
        }
        else {
            const reqObj = getJsonFilePath('DefaultWelcomeIntent', this.factory.type()); // tslint:disable-line
            const request = JSON.stringify(require(reqObj));
            return this.factory.createRequest(request);
        }
    }
    async intentRequest(json) {
        // tslint:disable-line
        if (json) {
            return this.factory.createRequest(json);
        }
        else {
            const reqObj = getJsonFilePath('HelpIntent', this.factory.type()); // tslint:disable-line
            const request = JSON.stringify(require(reqObj));
            return this.factory.createRequest(request);
        }
    }
    async rawRequest(json) {
        // tslint:disable-line
        return DialogflowRequest_1.DialogflowRequest.fromJSON(json);
    }
    async rawRequestByKey(key) {
        const reqObj = getJsonFilePath(key, this.factory.type()); // tslint:disable-line
        const request = JSON.stringify(require(reqObj));
        return this.factory.createRequest(request);
    }
    async audioPlayerRequest(json) {
        // tslint:disable-line
        if (json) {
            return this.factory.createRequest(json);
        }
        else {
            const reqObj = getJsonFilePath('MediaFinished', this.factory.type()); // tslint:disable-line
            const request = JSON.stringify(require(reqObj));
            return this.factory.createRequest(request);
        }
    }
    async end(json) {
        // tslint:disable-line
        if (json) {
            return this.factory.createRequest(json);
        }
        else {
            const reqObj = getJsonFilePath('Cancel', this.factory.type()); // tslint:disable-line
            const request = JSON.stringify(require(reqObj));
            return this.factory.createRequest(request);
        }
    }
    async getPlatformRequest(key, platform) {
        return JSON.parse(JSON.stringify(require(getJsonFilePath(key, platform))));
    }
}
exports.DialogflowRequestBuilder = DialogflowRequestBuilder;
function getJsonFilePath(key, platform = 'google') {
    let folder = './../../../';
    if (process.env.NODE_ENV === 'UNIT_TEST') {
        folder = './../../../';
    }
    // @ts-ignore
    const fileName = samples[platform][key];
    if (!fileName) {
        throw new Error(`Can't find file.`);
    }
    return path.join(folder, 'sample-request-json', 'v2', platform, fileName);
}
//# sourceMappingURL=DialogflowRequestBuilder.js.map