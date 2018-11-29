import * as _ from "lodash";
import {JovoRequest, SessionConstants} from "jovo-core";

interface Intent {
    name: string;
    displayName: string;
    isFallback: boolean;
}

interface QueryResult {
    queryText: string;
    parameters: any; // tslint:disable-line
    allRequiredParamsPresent: boolean;
    intent: Intent;
    intentDetectionConfidence: number;
    languageCode: string;
    outputContexts?: Context[];
}

export interface OriginalDetectIntentRequest {
    source: string;
    version: string;
    payload: JovoRequest;
}

export interface DialogflowRequestJSON {
    responseId?: string;
    queryResult?: QueryResult;
    originalDetectIntentRequest?: OriginalDetectIntentRequest;
    session?: string;
}
interface Context {
    name: string;
    lifespanCount?: number;
    parameters?: {[key: string]: any}; // tslint:disable-line
}


export class DialogflowRequest implements JovoRequest {

    responseId?: string;
    queryResult?: QueryResult;
    originalDetectIntentRequest?: OriginalDetectIntentRequest;
    session?: string;

    getAccessToken() {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.getAccessToken') === 'function') {
            return this.originalDetectIntentRequest.payload.getAccessToken();
        }
        return 'DIALOGFLOW-DEFAULT-ACCESS-TOKEN';
    }
    getLocale() {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.getLocale') === 'function') {
            return this.originalDetectIntentRequest.payload.getLocale();
        }
        return this.queryResult.languageCode;
    }

    getTimestamp() {
        return new Date().toISOString();
    }

    getUserId() {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.getUserId') === 'function') {
            return this.originalDetectIntentRequest.payload.getUserId();
        }
        return 'DIALOGFLOW-DEFAULT-USER-ID';
    }

    isNewSession() {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.isNewSession') === 'function') {
            return this.originalDetectIntentRequest.payload.isNewSession();
        }
        return true;
    }



    setUserId(userId: string) {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.setUserId') === 'function') {
            this.originalDetectIntentRequest.payload.setUserId(userId);
        }
        return this;
    }

    toJSON(): DialogflowRequestJSON {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }

    // fromJSON is used to convert an serialized version
    // of the User to an instance of the class
    static fromJSON(json: DialogflowRequestJSON|string): DialogflowRequest {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, DialogflowRequest.reviver);
        } else {
            // create an instance of the User class
            const request = Object.create(DialogflowRequest.prototype);
            // copy all the fields from the json object
            return Object.assign(request, json);
        }
    }

    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    static reviver(key: string, value: any): any { // tslint:disable-line
        return key === "" ? DialogflowRequest.fromJSON(value) : value;
    }

    // TODO:
    addInput(key: string, value: string): this {
        this.queryResult.parameters[key] = value;
        return this;
    }

    addSessionAttribute(key: string, value: any): this { // tslint:disable-line
        const sessionId = _.get(this, 'session');
        const sessionContext: Context =_.get(this, 'queryResult.outputContexts').find((context: Context) => {
            return context.name === `${sessionId}/contexts/session`;
        });

        if (sessionContext) {
            sessionContext.lifespanCount = 999;
            sessionContext.parameters[key] = value;
        } else {
            this.queryResult.outputContexts.push({
                lifespanCount: 999,
                name: `${sessionId}/contexts/session`,
                parameters: {
                    [key]: value
                },
            });
        }
        return this;
    }

    getInputs(): any { // tslint:disable-line
        const params = _.get(this, 'queryResult.parameters');
        return _.mapValues(params, (value, name) => {
            return {
                name,
                value,
                key: value, // Added for cross platform consistency
                id: value, // Added for cross platform consistency
            };
        });
    }

    getSessionAttributes(): any { // tslint:disable-line

        const sessionId = _.get(this, 'session');
        let sessionAttributes: any = {}; // tslint:disable-line
        const sessionContext =_.get(this, 'queryResult.outputContexts').find((context: Context) => {
            return context.name === `${sessionId}/contexts/session`;
        });

        if (sessionContext) {
            sessionAttributes = sessionContext.parameters;

            for (const parameter of Object.keys(_.get(this, 'queryResult.parameters'))) {
                delete sessionAttributes[parameter];
                delete sessionAttributes[parameter + '.original'];
            }
        }
        return sessionAttributes;
    }

    setSessionAttributes(attributes: any): this { // tslint:disable-line
        const sessionId = _.get(this, 'session');
        const sessionContext: Context =_.get(this, 'queryResult.outputContexts').find((context: Context) => {
            return context.name === `${sessionId}/contexts/session`;
        });

        if (sessionContext) {
            sessionContext.lifespanCount = 999;
            sessionContext.parameters = attributes;
        } else {
            this.queryResult.outputContexts.push({
                lifespanCount: 999,
                name: `${sessionId}/contexts/session`,
                parameters: attributes,
            });
        }
        return this;
    }


    hasAudioInterface(): boolean {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.hasAudioInterface') === 'function') {
            return this.originalDetectIntentRequest.payload.hasAudioInterface();
        }
        return true;
    }

    hasScreenInterface(): boolean {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.hasScreenInterface') === 'function') {
            return this.originalDetectIntentRequest.payload.hasScreenInterface();
        }
        return true;
    }

    hasVideoInterface(): boolean {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.hasScreenInterface') === 'function') {
            return this.originalDetectIntentRequest.payload.hasVideoInterface();
        }
        return false;
    }

    setAccessToken(accessToken: string): this {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.setAccessToken') === 'function') {
            this.originalDetectIntentRequest.payload.setAccessToken(accessToken);
        }
        return this;
    }

    setAudioInterface(): this {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.setAudioInterface') === 'function') {
            this.originalDetectIntentRequest.payload.setAudioInterface();
        }
        return this;
    }

    setLocale(locale: string): this {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.setLocale') === 'function') {
            this.originalDetectIntentRequest.payload.setLocale(locale);
        }
        _.set(this, 'queryResult.languageCode', locale);
        return this;
    }

    setNewSession(isNew: boolean): this {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.setNewSession') === 'function') {
            this.originalDetectIntentRequest.payload.setNewSession(isNew);
        }
        return this;
    }

    setScreenInterface(): this {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.setScreenInterface') === 'function') {
            this.originalDetectIntentRequest.payload.setScreenInterface();
        }
        return this;
    }
    setVideoInterface(): this {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.setVideoInterface') === 'function') {
            this.originalDetectIntentRequest.payload.setVideoInterface();
        }
        return this;
    }

    setState(state: string): this {
        const sessionId = _.get(this, 'session');
        const sessionContext: Context =_.get(this, 'queryResult.outputContexts').find((context: Context) => {
            return context.name === `${sessionId}/contexts/session`;
        });

        if (sessionContext) {
            sessionContext.lifespanCount = 999;
            sessionContext.parameters[SessionConstants.STATE] = sessionId;
        } else {
            this.queryResult.outputContexts.push({
                lifespanCount: 999,
                name: `${sessionId}/contexts/session`,
                parameters: {
                    [SessionConstants.STATE]: sessionId
                },
            });
        }
        return this;
    }

    setTimestamp(timestamp: string): this {
        if (typeof _.get(this.originalDetectIntentRequest, 'payload.setTimestamp') === 'function') {
            this.originalDetectIntentRequest.payload.setTimestamp(timestamp);
        }
        return this;
    }


    // DialogRequest Helper
    setParameter(key: string, value: string) {
        this.queryResult.parameters[key] = value;
        return this;
    }
}
