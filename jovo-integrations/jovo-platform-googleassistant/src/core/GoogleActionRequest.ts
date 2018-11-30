
/**
 * Base class of a request from alexa
 */
import {JovoRequest} from "jovo-core";
import * as _ from 'lodash';


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

    setUserId(userId: string) {
        _.set(this, 'user.userId', userId);
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

    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    //@ts-ignore
    static reviver(key: string, value: any): any { // tslint:disable-line
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
        return _.get(this, 'user.accessToken');
    }

    getInputs(): any { // tslint:disable-line
        return undefined;
    }

    getLocale(): string {
        return _.get(this, 'user.locale');
    }

    getSessionAttributes(): any { // tslint:disable-line
        return undefined;
    }

    getTimestamp(): string {
        return new Date().toISOString();
    }

    getUserId(): string {
        return _.get(this, 'user.userId');
    }

    hasAudioInterface(): boolean {
        const audioCapability = _.get(this, 'surface.capabilities')
            .capabilities.find((item: Capability) => item.name === 'AUDIO_OUTPUT');
        return typeof audioCapability !== 'undefined';
    }

    hasScreenInterface(): boolean {
        const screenCapability = _.get(this, 'surface.capabilities')
            .capabilities.find((item: Capability) => item.name === 'SCREEN_OUTPUT');
        return typeof screenCapability !== 'undefined';
    }

    hasVideoInterface(): boolean {
        return false;
    }

    isNewSession(): boolean {
        return _.get(this, 'conversation.type') !== 'ACTIVE';
    }

    setAccessToken(accessToken: string): this {
        _.set(this, `user.accessToken`, accessToken);
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
        _.set(this, `user.locale`, locale);
        return this;
    }

    setNewSession(isNew: boolean): this {
        const conversationType = isNew ? 'NEW': 'ACTIVE';
        _.set(this, `conversation.type`, conversationType);

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

    setState(state: string): this {
        return this;
    }

    setTimestamp(timestamp: string): this {
        return this;
    }

    setVideoInterface(): this {
        return this;
    }
}
