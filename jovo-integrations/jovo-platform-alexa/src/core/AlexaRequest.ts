import * as _ from 'lodash';
import {Input, JovoRequest} from "jovo-core";

export interface SessionAttributes {
    [key: string]: any; //tslint:disable-line
}

export interface Session {
    new: boolean;
    sessionId: string;
    application: Application;
    attributes: SessionAttributes; //tslint:disable-line
    user: User;
}

export interface Context {
    System: System;
    AudioPlayer: {
        token: string;
        offsetInMilliseconds: number;
        playerActivity: string;
    };
}

export interface System {
    application: Application;
    user: User;
    device: Device;
    apiEndpoint: string;
    apiAccessToken?: string;
}

export interface Device {
    deviceId: string;
}

export interface User {
    userId: string;
    accessToken: string;
    permissions: Permission;
}

export interface Permission {
    consentToken: string;
}

export interface Application {
    applicationId: string;
}

export enum ConfirmationStatus {
    NONE = "NONE",
    CONFIRMED = "CONFIRMED",
    DENIED = "DENIED",
}

export interface Slot {
    name: string;
    confirmationStatus: string;
    value: string;
}

export interface Intent {
    name: string;
    confirmationStatus: ConfirmationStatus;
    slots?: {[key: string]: Slot};
}

export interface Request {
    type: string;
    requestId: string;
    timestamp: string;
    locale: string;
    token?: string;
    offsetInMilliseconds?: number;
    intent?: Intent;
    status?: { // Connections.Response
        code: string;
        message: string;
    };
    name?: string; // Connections.Response
    payload?: { // Connections.Response
        purchaseResult?: string;
        productId?: string;
    };
    error?: { // System.ExceptionEncountered
        type: string;
        message: string;
    };
    cause?: { // System.ExceptionEncountered
        requestId: string;
    };
    originatingRequestId?: string; // GameEngine.InputHandlerEvent
    events: any[]; //tslint:disable-line
    reason?: string; // SessionEndedRequest
    eventCreationTime?: string; // AlexaSkillEvent.*
    eventPublishingTime?: string; // AlexaSkillEvent.*
    dialogState?: string;
}

export interface AlexaInput extends Input {
    alexaSkill?: any; //tslint:disable-line
}


/**
 * Base class of a request from alexa
 */
export interface AlexaRequestJSON {
    version?: string;
    context?: Context;
    session?: Session;
    request?: Request;
}



/**
 * Thanks to @see http://choly.ca/post/typescript-json/
 */

export class AlexaRequest implements JovoRequest {
    version?: string;
    context?: Context;
    session?: Session;
    request?: Request;

    // JovoRequest implementation

    getAccessToken() {
        return _.get(this, 'context.System.user.accessToken');
    }

    getInputs(): AlexaInput[] {
        const inputs: any = {}; //tslint:disable-line
        const slots = this.getSlots();
        if (!slots) {
            return inputs;
        }

        Object.keys(slots).forEach((slot) => {

            const input: AlexaInput = {
                alexaSkill: slots[slot],
            };
            if (slots[slot].value) {
                input.value = slots[slot].value;
                input.key = slots[slot].value;
            }
            if (_.get(slots[slot], 'resolutions.resolutionsPerAuthority[0].values[0]')) {
                input.key = _.get(slots[slot], 'resolutions.resolutionsPerAuthority[0].values[0]').value.name;
                input.id = _.get(slots[slot], 'resolutions.resolutionsPerAuthority[0].values[0]').value.id;
            }
            inputs[slot] = input;
        });

        return inputs;
    }

    getLocale() {
        return _.get(this, 'request.locale');
    }

    getSessionAttributes() {
        return _.get(this, 'session.attributes');
    }

    getTimestamp() {
        return _.get(this, 'request.timestamp');
    }

    getUserId() {
        return _.get(this, 'session.user.userId') ||
            _.get(this, 'context.System.user.userId');
    }

    /**
     * Returns audio capability of request device
     * @return {boolean}
     */
    hasAudioInterface() {
        return this.hasScreenInterface() ||
            typeof _.get(this.getSupportedInterfaces(), 'AudioPlayer') !== 'undefined';
    }

    /**
     * Returns screen capability of request device
     * @return {boolean}
     */
    hasScreenInterface() {
        return typeof _.get(this.getSupportedInterfaces(), 'Display') !== 'undefined';
    }

    /**
     * Returns video capability of request device
     * @return {boolean}
     */
    hasVideoInterface() {
        return typeof _.get(this.getSupportedInterfaces(), 'VideoApp') !== 'undefined';
    }

    isNewSession() {
        return _.get(this, 'session.new', true);
    }



    setLocale(locale: string) {
        if (_.get(this, `request.locale`)) {
            _.set(this, 'request.locale', locale);
        }
        return this;
    }

    // Jovo Request -- SETTER


    setScreenInterface() {
        if (_.get(this, 'context.System.device.supportedInterfaces')) {
            _.set(this, 'context.System.device.supportedInterfaces', {
                'AudioPlayer': {},
                'Display': {
                    'templateVersion': '1.0',
                    'markupVersion': '1.0',
                },
                'VideoApp': {},
            });
        }
        return this;
    }

    setVideoInterface() {
        if (_.get(this, 'context.System.device.supportedInterfaces')) {
            _.set(this, 'context.System.device.supportedInterfaces', {
                'AudioPlayer': {},
                'Display': {
                    'templateVersion': '1.0',
                    'markupVersion': '1.0',
                },
                'VideoApp': {},
            });
        }
        return this;
    }
    setSessionAttributes(attributes: SessionAttributes): this {
        if (this.getSessionAttributes()) {
            _.set(this, 'session.attributes', attributes);
        }
        return this;
    }

    addSessionAttribute(key: string, value: any) { // tslint:disable-line
        if (this.getSessionAttributes()) {
            _.set(this, `session.attributes.${key}`, value);
        }
        return this;
    }


    setUserId(userId: string) {
        _.set(this, 'session.user.userId', userId);
        _.set(this, 'context.System.user.userId', userId);
        return this;
    }

    setAccessToken(accessToken: string) {
        _.set(this, 'context.System.user.accessToken', accessToken);
        return this;
    }


    setNewSession(isNew: boolean) {
        if (typeof _.get(this, 'session.new') !== 'undefined') {
            _.set(this, 'session.new', isNew);
        }
        return this;
    }

    setTimestamp(timestamp: string) {
        if (_.get(this, `request.timestamp`)) {
            _.set(this, 'request.timestamp', timestamp);
        }
        return this;
    }


    setAudioInterface() {
        if (_.get(this, 'context.System.device.supportedInterfaces')) {
            _.set(this, 'context.System.device.supportedInterfaces', {
                'AudioPlayer': {},
            });
        }
        return this;
    }

    setState(state: string) {
        if (_.get(this, 'session.attributes')) {
            _.set(this, 'session.attributes._JOVO_STATE_', state);
        }
        return this;
    }

    addInput(key: string, value: string | object) {
        if ( typeof value === 'string') {
            _.set(this, `request.intent.slots.${key}`, {
                name: key,
                value
            });
        } else {
            _.set(this, `request.intent.slots.${key}`, value);
        }

        return this;
    }

    toJSON(): AlexaRequestJSON {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }

    // Alexa Request HELPER

    /**
     * Returns api endpoint based on user's locale settings
     * @return {String} endpoint url
     */
    getApiEndpoint() {
        return _.get(this, 'context.System.apiEndpoint');
    }

    /**
     * Returns api access token
     * @return {String} endpoint url
     */
    getApiAccessToken() {
        return _.get(this, 'context.System.apiAccessToken');
    }

    /**
     * Returns consent token
     * @return {string} constent token
     */
    getConsentToken() {
        return _.get(this, 'context.System.user.permissions.consentToken');
    }


    /**
     * Returns device id
     * @return {string} device id
     */
    getDeviceId() {
        return _.get(this, 'context.System.device.deviceId');
    }


    /**
     * Returns audio player token
     * @return {string}
     */
    getAudioPlayerToken() {
        return _.get(this, 'context.AudioPlayer.token',
            _.get(this, 'request.token'));
    }

    getRequestId() {
        return _.get(this, 'request.requestId');
    }

    /**
     * Returns supported interfaces from device.
     * @public
     * @return {string} supportedInterfaces
     */
    getSupportedInterfaces() {
        return _.get(this, 'context.System.device.supportedInterfaces');
    }

    /**
     * Returns audio capability of request device
     * @return {boolean}
     */
    hasAudioPlayerInterface() {
        return this.hasScreenInterface() ||
            typeof _.get(this.getSupportedInterfaces(), 'AudioPlayer') !== 'undefined';
    }

    /**
     * Returns display capability of request device
     * @return {boolean}
     */
    hasDisplayInterface() {
        return typeof _.get(this.getSupportedInterfaces(), 'Display') !== 'undefined';
    }

    getIntentName() {
        return _.get(this, 'request.intent.name');
    }

    getSlots() {
        return _.get(this, 'request.intent.slots');
    }

    getSlot(name: string): Slot {
        return _.get(this, `request.intent.slots.${name}`);
    }

    setSlots(slots: any) { // tslint:disable-line
        _.set(this, `request.intent.slots`, slots);
        return this;
    }

    setSlot(name: string, value: string) {
        _.set(this, `request.intent.slots.${name}`, {
            name,
            value
        });
        return this;
    }

    setIntentName(intentName: string) {
        if (this.getIntentName()) {
            _.set(this, 'request.intent.name', intentName);
        }
        return this;
    }

    // fromJSON is used to convert an serialized version
    // of the User to an instance of the class
    static fromJSON(json: AlexaRequestJSON|string): AlexaRequest {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, AlexaRequest.reviver);
        } else {
            // create an instance of the User class
            const alexaRequest = Object.create(AlexaRequest.prototype);
            // copy all the fields from the json object
            return Object.assign(alexaRequest, json);
        }
    }

    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    static reviver(key: string, value: any): any { //tslint:disable-line
        return key === "" ? AlexaRequest.fromJSON(value) : value;
    }

}
