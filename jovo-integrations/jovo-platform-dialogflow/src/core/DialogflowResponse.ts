import * as _ from 'lodash';
import {JovoResponse, SessionConstants} from "jovo-core";

export interface Payload {
    [key: string]: JovoResponse;
}
interface Context {
    name: string;
    lifespanCount?: number;
    parameters?: {[key: string]: any}; // tslint:disable-line
}

export interface DialogflowResponseJSON {
    fulfillmentText: string;
    outputContexts?: Context[];
    payload: Payload;
}

/**
 * Thanks to @see http://choly.ca/post/typescript-json/
 */


export class DialogflowResponse implements JovoResponse {
    fulfillmentText: string;
    payload: Payload;

    getPlatformId() {
        const keys = Object.keys(this.payload);
        if (keys.length > 0) {
            return keys[0];
        }
    }

    getSessionAttributes() {
        const sessionContext =_.get(this, 'outputContexts').find((context: Context) => {
            return context.name.indexOf('/contexts/session') > -1;
        });

        if (sessionContext) {
            return sessionContext.parameters;
        }
        return {};
    }

    // TODO:
    setSessionAttributes() {
        return this;
    }

    hasSessionEnded() {
        if (typeof _.get(this.payload, `${this.getPlatformId()}.hasSessionEnded`) === 'function') {
            return this.payload[this.getPlatformId()].hasSessionEnded();
        }
        return false;
    }

    getOutputSpeech() {
        if (typeof _.get(this.payload, `${this.getPlatformId()}.getOutputSpeech`) === 'function') {
            return this.payload[this.getPlatformId()].getOutputSpeech();
        }
        return this.fulfillmentText;
    }

    getRepromptSpeech() {
        if (typeof _.get(this.payload, `${this.getPlatformId()}.getRepromptSpeech`) === 'function') {
            return this.payload[this.getPlatformId()].getRepromptSpeech();
        }
        return undefined;
    }

    isTell(speech?: string | string[]) {
        if (typeof _.get(this.payload, `${this.getPlatformId()}.isTell`) === 'function') {
            return this.payload[this.getPlatformId()].isTell(speech);
        }

        return true;
    }

    isAsk(speech?: string | string[], reprompt?: string | string[]) {
        if (typeof _.get(this.payload, `${this.getPlatformId()}.isAsk`) === 'function') {
            return this.payload[this.getPlatformId()].isAsk(speech, reprompt);
        }
        return false;
    }

    hasState(state: string) {
        const sessionContext =_.get(this, 'outputContexts').find((context: Context) => {
            return context.name.indexOf('/contexts/session') > -1;
        });

        if (sessionContext) {
            return _.get(sessionContext, `parameters.${SessionConstants.STATE}`) === state ;
        }

        return false;
    }

    hasSessionAttribute(name: string, value?: any) { // tslint:disable-line
        const sessionContext =_.get(this, 'outputContexts').find((context: Context) => {
            return context.name.indexOf('/contexts/session') > -1;
        });

        if (sessionContext) {
            return typeof _.get(sessionContext, `parameters.${name}`) !== 'undefined' ;
        }

        return false;
    }

    toJSON(): DialogflowResponseJSON {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }

    // fromJSON is used to convert an serialized version
    // of the User to an instance of the class
    static fromJSON(json: DialogflowResponseJSON|string) {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, DialogflowResponse.reviver);
        } else {
            // create an instance of the User class
            const response = Object.create(DialogflowResponse.prototype);
            // copy all the fields from the json object
            return Object.assign(response, json);
        }
    }

    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    static reviver(key: string, value: any): any { // tslint:disable-line
        return key === "" ? DialogflowResponse.fromJSON(value) : value;
    }
}
