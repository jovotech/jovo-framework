
/**
 * Base class of a request from alexa
 */
import {Inputs, JovoRequest, SessionData} from "jovo-core";
import _set = require('lodash.set');
import _get = require('lodash.get');


interface User {
    userId: string;
    locale: string;
    lastSeen?: string;
    permissions?: string[];
    accessToken?: string;
    profile: {
        displayName: string;
        givenName: string;
        familyName: string;
    };
    userStorage?: any; // tslint:disable-line
}
interface Conversation {
    conversationId: string;
    type: string;
    conversationToken?: string;
}

interface RawInput {
    inputType: string;
    query?: string;
}

interface Extension {
    '@type': string;
    status: string;
}

interface InputArgument {
    name: string;
    rawText?: string;
    textValue?: string;
    extension?: Extension;
}

interface Input {
    intent?: string;
    rawInputs: RawInput[];
    arguments?: InputArgument[];
}

interface Capability {
    name: string;
}

interface Surface {
    capabilities: Capability[];
}

export interface GoogleActionRequestJSON {
    user?: User;
    conversation?: Conversation;
    inputs?: Input[];
    surface?: Surface;
    isInSandbox?: boolean;
    availableSurfaces?: Surface;
}

export class GoogleActionRequest implements JovoRequest {
    user?: User;
    conversation?: Conversation;
    inputs?: Input[];
    surface?: Surface;
    isInSandbox?: boolean;
    availableSurfaces?: Surface;


    getSessionId(): string | undefined {
        if (this.conversation) {
            return this.conversation.conversationId;
        }
    }

    getIntentName(): string | undefined {
        return undefined;
    }
    getSessionData() {
        return this.getSessionAttributes();
    }
    setSessionData(sessionData: SessionData): this {
        return this.setSessionAttributes(sessionData);
    }
    addSessionData(key: string, value: any): this { // tslint:disable-line
        return this.addSessionAttribute(key, value);
    }

    setUserId(userId: string) {
        _set(this, 'user.userId', userId);
        return this;
    }

    toJSON(): GoogleActionRequestJSON {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }

    // fromJSON is used to convert an serialized version
    // of the User to an instance of the class
    static fromJSON(json: GoogleActionRequestJSON|string): GoogleActionRequest {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, GoogleActionRequest.reviver);
        } else {
            // create an instance of the User class
            const request = Object.create(GoogleActionRequest.prototype);
            // copy all the fields from the json object
            return Object.assign(request, json);
        }
    }
    static reviver( key: string, value: any): any { // tslint:disable-line
        return key === "" ? GoogleActionRequest.fromJSON(value) : value;
    }

    // not available
    addInput(key: string, value: string): this {
       return this;
    }

    // not available
    addSessionAttribute(key: string, value: any): this { // tslint:disable-line
        return this;
    }

    getAccessToken(): string {
        return _get(this, 'user.accessToken');
    }

    getInputs(): any { // tslint:disable-line
        return undefined;
    }

    getLocale(): string {
        return _get(this, 'user.locale');
    }

    getSessionAttributes(): any { // tslint:disable-line
        return undefined;
    }

    getTimestamp(): string {
        return new Date().toISOString();
    }

    getUserId(): string {
        return _get(this, 'user.userId');
    }

    getUserStorage(): string {
        return _get(this, 'user.userStorage');
    }

    hasAudioInterface(): boolean {
        const audioCapability = _get(this, 'surface.capabilities')
            .find((item: Capability) => item.name === 'actions.capability.MEDIA_RESPONSE_AUDIO');
        return typeof audioCapability !== 'undefined';
    }

    hasScreenInterface(): boolean {
        const screenCapability = _get(this, 'surface.capabilities')
            .find((item: Capability) => item.name === 'actions.capability.SCREEN_OUTPUT');
        return typeof screenCapability !== 'undefined';
    }

    hasVideoInterface(): boolean {
        return false;
    }

    isNewSession(): boolean {
        return _get(this, 'conversation.type') !== 'ACTIVE';
    }

    setAccessToken(accessToken: string): this {
        _set(this, `user.accessToken`, accessToken);
        return this;
    }

    setAudioInterface(): this {
        this.surface = {
            'capabilities': [
                {
                    'name': 'actions.capability.MEDIA_RESPONSE_AUDIO',
                },
                {
                    'name': 'actions.capability.AUDIO_OUTPUT',
                },
            ],
        };
        return this;
    }

    setLocale(locale: string): this {
        _set(this, `user.locale`, locale);
        return this;
    }

    setNewSession(isNew: boolean): this {
        const conversationType = isNew ? 'NEW' : 'ACTIVE';
        _set(this, `conversation.type`, conversationType);
        return this;
    }

    setScreenInterface(): this {
        this.surface = {
            'capabilities': [
                {
                    'name': 'actions.capability.MEDIA_RESPONSE_AUDIO',
                },
                {
                    'name': 'actions.capability.SCREEN_OUTPUT',
                },
                {
                    'name': 'actions.capability.AUDIO_OUTPUT',
                },
                {
                    'name': 'actions.capability.WEB_BROWSER',
                },
            ],
        };
        return this;
    }

    setSessionAttributes(attributes: any): this { // tslint:disable-line
        return this;
    }

    // GoogleActionRequest can't handle states
    setState(state: string): this {
        return this;
    }

    // GoogleActionRequest can't handle states
    getState() {
        return undefined;
    }

    // GoogleActionRequest can't handle inputs
    setInputs(inputs: Inputs): this {
        return this;
    }

    // GoogleActionRequest can't handle timestamps
    setTimestamp(timestamp: string): this {
        return this;
    }

    // GoogleActionRequest can't handle intents
    setIntentName(intentName: string): this {
        return this;
    }

    // GoogleActionRequest can't handle video interfaces
    setVideoInterface(): this {
        return this;
    }
}
