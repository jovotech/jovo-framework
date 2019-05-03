import {Input, JovoRequest, SessionData, Inputs, SessionConstants} from "jovo-core";
import _get = require('lodash.get');
import _set = require('lodash.set');

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
    Geolocation?: Geolocation;
}

export interface Geolocation {
    // Either "locationServices" or "coordinate" will be present
    locationServices?: LocationServices;
    timestamp: string; // ISO 8601
    coordinate?: Coordinate;
    altitude?: Altitude;
    heading?: Heading;
    speed?: Speed;
}

export type LocationServicesAccess = "ENABLED" | "DISABLED";
export type LocationServicesStatus = "RUNNING" | "STOPPED";

export interface LocationServices {
    access: LocationServicesAccess;
    status: LocationServicesStatus;
}

export interface Coordinate {
    latitudeInDegrees: number; // [-90.0, 90.0]
    longitudeInDegrees: number; // [-180.0, 190.0]
    accuracyInMeters: number; // [0, MAX_INTEGER]
}

export interface Altitude {
    altitudeInMeters?: number; // [-6350, 18000]
    accuracyInMeters?: number; // [0, MAX_INTEGER]
}

export interface Heading {
    directionInDegrees?: number; // (0, 360.0]
    accuracyInDegrees?: number; // [0, MAX_INTEGER]
}

export interface Speed {
    speedInMetersPerSecond?: number; // [0, 1900] not optional if automotive
    accuracyInMetersPerSecond?: number; // [0, MAX_INTEGER]
}

export type PermissionStatus = "GRANTED" | "DENIED";

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

export type ConfirmationStatus = 'NONE' | 'CONFIRMED' | 'DENIED';

export interface Slot {
    name: string;
    confirmationStatus?: ConfirmationStatus;
    value: string;
    source?: string;
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
    alexaSkill: {
        name?: string;
        value?: string;
        confirmationStatus?: string;
        source?: string;
    };
}


/**
 * Base class of a request from alexa
 */
export interface AlexaRequestJSON {
    version?: string;
    context?: Context;
    session?: Session;
    request?: Request;
    resolutions?: any; // tslint:disable-line
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

    getSessionId(): string | undefined {
        if (this.session) {
            return this.session.sessionId;
        }
    }

    getAccessToken() {
        return _get(this, 'context.System.user.accessToken');
    }

    getInputs(): Inputs {
        const inputs: Inputs = {};
        const slots = this.getSlots();
        if (!slots) {
            return inputs;
        }

        Object.keys(slots).forEach((slot) => {

            const input: AlexaInput = {
                name: slot,
                alexaSkill: slots[slot],
            };
            if (slots[slot].value) {
                input.value = slots[slot].value;
                input.key = slots[slot].value;
            }
            const resolutionsPerAuthority=_get(slots[slot], 'resolutions.resolutionsPerAuthority')
            if(resolutionsPerAuthority){
                resolutionsPerAuthority.forEach(function(item){
                    if (_get(item, 'values[0]')) {
                        input.key = _get(item, 'values[0]').value.name;
                        input.id = _get(item, 'values[0]').value.id;
                    }
                })
            }
            inputs[slot] = input;
        });

        return inputs;
    }

    setInputs(inputs: Inputs): this {
        Object.keys(inputs).forEach((key: string) => {
            const input: Input = inputs[key];
            const slot: Slot = {
                name: input.name!,
                value: input.value,
                confirmationStatus: 'NONE'
            };

            const alexaInput = input as AlexaInput;

            if (alexaInput.alexaSkill) {
                _set(this, `request.intent.slots[${input.name}]`, alexaInput.alexaSkill);
            } else {
                _set(this, `request.intent.slots[${input.name}]`, slot);

            }

        });

        return this;
    }

    getLocale() {
        return _get(this, 'request.locale');
    }

    getSessionData() {
        return this.getSessionAttributes();
    }

    getState() {
        return _get(this.getSessionAttributes(), SessionConstants.STATE);
    }

    setSessionData(sessionData: SessionData): this {
        return this.setSessionAttributes(sessionData);
    }
    addSessionData(key: string, value: any): this { // tslint:disable-line
        return this.addSessionAttribute(key, value);
    }

    getSessionAttributes() {
        return _get(this, 'session.attributes');
    }

    getTimestamp() {
        return _get(this, 'request.timestamp');
    }

    getUserId() {
        return _get(this, 'session.user.userId') ||
            _get(this, 'context.System.user.userId');
    }

    /**
     * Returns audio capability of request device
     * @return {boolean}
     */
    hasAudioInterface() {
        return this.hasScreenInterface() ||
            typeof _get(this.getSupportedInterfaces(), 'AudioPlayer') !== 'undefined';
    }

    /**
     * Returns screen capability of request device
     * @return {boolean}
     */
    hasScreenInterface() {
        return this.hasDisplayInterface() || this.hasAPLInterface();
    }

    /**
     * Returns video capability of request device
     * @return {boolean}
     */
    hasVideoInterface() {
        return typeof _get(this.getSupportedInterfaces(), 'VideoApp') !== 'undefined';
    }

    isNewSession() {
        return _get(this, 'session.new', true);
    }

    // Jovo Request -- SETTER

    setLocale(locale: string) {
        if (_get(this, `request.locale`)) {
            _set(this, 'request.locale', locale);
        }
        return this;
    }

    setScreenInterface() {
        if (_get(this, 'context.System.device.supportedInterfaces')) {
            _set(this, 'context.System.device.supportedInterfaces', {
                'AudioPlayer': {},
                'Display': {
                    'templateVersion': '1.0',
                    'markupVersion': '1.0',
                },
                'VideoApp': {},
                'Alexa.Presentation.APL': {
                    'runtime': {
                        'maxVersion': '1.0'
                    }
                }
            });
        }
        return this;
    }

    setVideoInterface() {
        if (_get(this, 'context.System.device.supportedInterfaces')) {
            _set(this, 'context.System.device.supportedInterfaces', {
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


    setSessionAttributes(attributes: SessionData): this {
        if (this.getSessionAttributes()) {
            _set(this, 'session.attributes', attributes);
        }
        return this;
    }


    addSessionAttribute(key: string, value: any) { // tslint:disable-line
        if (this.getSessionAttributes()) {
            _set(this, `session.attributes.${key}`, value);
        }
        return this;
    }


    setUserId(userId: string) {
        _set(this, 'session.user.userId', userId);
        _set(this, 'context.System.user.userId', userId);
        return this;
    }

    setAccessToken(accessToken: string) {
        _set(this, 'context.System.user.accessToken', accessToken);
        return this;
    }


    setNewSession(isNew: boolean) {
        if (typeof _get(this, 'session.new') !== 'undefined') {
            _set(this, 'session.new', isNew);
        }
        return this;
    }

    setTimestamp(timestamp: string) {
        if (_get(this, `request.timestamp`)) {
            _set(this, 'request.timestamp', timestamp);
        }
        return this;
    }


    setAudioInterface() {
        if (_get(this, 'context.System.device.supportedInterfaces')) {
            _set(this, 'context.System.device.supportedInterfaces', {
                'AudioPlayer': {},
            });
        }
        return this;
    }

    setState(state: string) {
        if (_get(this, 'session.attributes')) {
            _set(this, `session.attributes[${SessionConstants.STATE}]`, state);
        }
        return this;
    }

    addInput(key: string, value: string | object) {
        if ( typeof value === 'string') {
            _set(this, `request.intent.slots.${key}`, {
                name: key,
                value
            });
        } else {
            _set(this, `request.intent.slots.${key}`, value);
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
        return _get(this, 'context.System.apiEndpoint');
    }

    /**
     * Returns api access token
     * @return {String} endpoint url
     */
    getApiAccessToken() {
        return _get(this, 'context.System.apiAccessToken');
    }

    /**
     * Returns consent token
     * @return {string} constent token
     */
    getConsentToken() {
        return _get(this, 'context.System.user.permissions.consentToken');
    }


    /**
     * Returns device id
     * @return {string} device id
     */
    getDeviceId() {
        return _get(this, 'context.System.device.deviceId');
    }


    /**
     * Returns audio player token
     * @return {string}
     */
    getAudioPlayerToken() {
        return _get(this, 'context.AudioPlayer.token',
            _get(this, 'request.token'));
    }

    getRequestId() {
        return _get(this, 'request.requestId');
    }

    /**
     * Returns the amazon pay permission status
     * @public
     * @return {PermissionStatus | undefined}
     */
    getAmazonPayPermissionStatus(): PermissionStatus | undefined {
        return _get(this, 'context.System.user.permissions.scopes.payments:autopay_consent.status');
    }

    /**
     * Returns true if the amazon pay permission was granted
     * @return {boolean}
     */
    isAmazonPayPermissionGranted(): boolean {
        return this.getAmazonPayPermissionStatus() === 'GRANTED';
    }

    /**
     * Returns true if the amazon pay permission was denied
     * @return {boolean}
     */
    isAmazonPayPermissionDenied(): boolean {
        return this.getAmazonPayPermissionStatus() === 'DENIED';
    }

    /**
     * Returns the geolocation permission status
     * @return {PermissionStatus | undefined}
     */
    getGeoLocationPermissionStatus(): PermissionStatus | undefined {
        return _get(this, 'context.System.user.permissions.scopes.alexa::devices:all:geolocation:read.status');
    }

    /**
     * Returns true if geolocation permission was denied
     * @return {boolean}
     */
    isGeoLocationPermissionDenied(): boolean {
        return this.getGeoLocationPermissionStatus() === 'DENIED';
    }

    /**
     * Returns true if geolocation permission was granted
     * @return {boolean}
     */
    isGeoLocationPermissionGranted() {
        return this.getGeoLocationPermissionStatus() === 'GRANTED';
    }

    /**
     * Returns the whole geolocation object
     * @return {Geolocation | undefined}
     */
    getGeoLocationObject(): Geolocation | undefined {
        return _get(this, 'context.Geolocation');
    }

    /**
     * Returns geolocation timestamp
     * @return {string | undefined} ISO 8601
     */
    getGeoLocationTimestamp(): string | undefined {
        return _get(this.getGeoLocationObject(), 'timestamp');
    }

    /**
     * Returns geolocation location services object
     * @return {LocationServices | undefined}
     */
    getLocationServicesObject(): LocationServices | undefined {
        return _get(this.getGeoLocationObject(), 'locationServices');
    }

    /**
     * Returns geolocation location services access
     * @return {LocationServicesAccess | undefined}
     */
    getLocationServicesAccess(): LocationServicesAccess | undefined {
        return _get(this.getLocationServicesObject(), 'access');
    }

    /**
     * Returns geolocation location services status
     * @return {LocationServicesStatus | undefined}
     */
    getLocationServicesStatus(): LocationServicesStatus | undefined {
        return _get(this.getLocationServicesObject(), 'status');
    }

    /**
     * Returns geolocation coordinate object
     * @return {Coordinate | undefined}
     */
    getCoordinateObject(): Coordinate | undefined {
        return _get(this.getGeoLocationObject(), 'coordinate');
    }

    /**
     * Returns geolocation coordinate latitude in degrees
     * @return {number | undefined}	[-90.0, 90.0]
     */
    getCoordinateLatitude(): number | undefined {
        return _get(this.getCoordinateObject(), 'latitudeInDegrees');
    }

    /**
     * Returns geolocation coordinate longitude in degrees
     * @return {number | undefined} [-180.0, 180]
     */
    getCoordinateLongitude(): number | undefined {
        return _get(this.getCoordinateObject(), 'longitudeInDegrees');
    }

    /**
     * Returns geolocation coordinate accuracy in meters
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getCoordinateAccuracy(): number | undefined{
        return _get(this.getCoordinateObject(), 'accuracyInMeters');
    }

    /**
     * Returns geolocation altitude object
     * @return {Altitude | undefined}
     */
    getAltitudeObject(): Altitude | undefined {
        return _get(this.getGeoLocationObject(), 'altitude');
    }

    /**
     * Returns geolocation altitude in meters
     * @return {number | undefined} [-6350, 18000]
     */
    getAltitude(): number | undefined {
        return _get(this.getAltitudeObject(), 'altitudeInMeters');
    }

    /**
     * Returns geolocation altitude accuracy in meters
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getAltitudeAccuracy(): number | undefined {
        return _get(this.getAltitudeObject(), 'accuracyInMeters');
    }

    /**
     * Returns geolocation heading object
     * @return {Heading | undefined}
     */
    getHeadingObject(): Heading | undefined {
        return _get(this.getGeoLocationObject(), 'heading');
    }

    /**
     * Returns geolocation heading direction in degrees
     * @return {number | undefined} (0.0, 360.0]
     */
    getHeadingDirection(): number | undefined {
        return _get(this.getHeadingObject(), 'directionInDegrees');
    }

    /**
     * Returns geolocation heading accuracy in degrees
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getHeadingAccuracy(): number | undefined {
        return _get(this.getHeadingObject(), 'accuracyInDegrees');
    }

    /**
     * Returns geolocation speed object
     * @return {Speed}
     */
    getSpeedObject(): Speed | undefined {
        return _get(this.getGeoLocationObject(), 'speed');
    }

    /**
     * Returns geolocation speed in meters per second
     * @return {number | undefined} [0, 1900]
     */
    getSpeed(): number | undefined {
        return _get(this.getSpeedObject(), 'speedInMetersPerSecond');
    }

    /**
     * Returns geolocation speed accuracy in meters per second
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getSpeedAccuracy(): number | undefined {
        return _get(this.getSpeedObject(), 'accuracyInMetersPerSecond');
    }

    /**
     * Returns supported interfaces from device.
     * @public
     * @return {string} supportedInterfaces
     */
    getSupportedInterfaces() {
        return _get(this, 'context.System.device.supportedInterfaces');
    }

    /**
     * Returns audio capability of request device
     * @return {boolean}
     */
    hasAudioPlayerInterface() {
        return this.hasScreenInterface() ||
            typeof _get(this.getSupportedInterfaces(), 'AudioPlayer') !== 'undefined';
    }

    /**
     * Returns display capability of request device
     * @return {boolean}
     */
    hasDisplayInterface() {
        return typeof _get(this.getSupportedInterfaces(), 'Display') !== 'undefined';
    }

    hasAPLInterface() {
        return typeof _get(this.getSupportedInterfaces(), 'Alexa.Presentation.APL') !== 'undefined';
    }
    hasGeoLocationInterface() {
        return typeof _get(this.getSupportedInterfaces(), 'Geolocation') !== 'undefined';
    }
    getIntentName() {
        return _get(this, 'request.intent.name');
    }

    getSlots() {
        return _get(this, 'request.intent.slots');
    }

    getSlot(name: string): Slot {
        return _get(this, `request.intent.slots.${name}`);
    }

    setSlots(slots: any) { // tslint:disable-line
        _set(this, `request.intent.slots`, slots);
        return this;
    }

    setSlot(name: string, value: string) {
        _set(this, `request.intent.slots.${name}`, {
            name,
            value
        });
        return this;
    }

    setIntentName(intentName: string) {
        if (this.getIntentName()) {
            _set(this, 'request.intent.name', intentName);
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
