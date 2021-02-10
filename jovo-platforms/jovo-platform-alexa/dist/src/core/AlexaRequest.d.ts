import { Input, Inputs, JovoRequest, SessionData } from 'jovo-core';
import { AlexaDeviceName } from './Interfaces';
export interface SessionAttributes {
    [key: string]: any;
}
export interface Session {
    new: boolean;
    sessionId: string;
    application: Application;
    attributes: SessionAttributes;
    user: User;
    person: Person;
}
export interface Context {
    System: System;
    Viewport?: Viewport;
    AudioPlayer: {
        token: string;
        offsetInMilliseconds: number;
        playerActivity: string;
    };
    Geolocation?: Geolocation;
}
export interface Geolocation {
    locationServices?: LocationServices;
    timestamp: string;
    coordinate?: Coordinate;
    altitude?: Altitude;
    heading?: Heading;
    speed?: Speed;
}
export declare type LocationServicesAccess = 'ENABLED' | 'DISABLED';
export declare type LocationServicesStatus = 'RUNNING' | 'STOPPED';
export interface LocationServices {
    access: LocationServicesAccess;
    status: LocationServicesStatus;
}
export interface Coordinate {
    latitudeInDegrees: number;
    longitudeInDegrees: number;
    accuracyInMeters: number;
}
export interface Altitude {
    altitudeInMeters?: number;
    accuracyInMeters?: number;
}
export interface Heading {
    directionInDegrees?: number;
    accuracyInDegrees?: number;
}
export interface Speed {
    speedInMetersPerSecond?: number;
    accuracyInMetersPerSecond?: number;
}
export declare type PermissionStatus = 'GRANTED' | 'DENIED';
export interface System {
    application: Application;
    user: User;
    person: Person;
    device: Device;
    apiEndpoint: string;
    apiAccessToken?: string;
}
export interface Viewport {
    experiences: Experience[];
    shape: 'RECTANGLE' | 'ROUND';
    pixelWidth: number;
    pixelHeight: number;
    dpi: number;
    currentPixelWidth: number;
    currentPixelHeight: number;
    touch?: TouchMethod[];
    keyboard?: InputMechanism[];
    video?: {
        codecs: string[];
    };
}
export interface Experience {
    arcMinuteWidth: number;
    arcMinuteHeight: number;
    canRotate: boolean;
    canResize: boolean;
}
export declare type TouchMethod = 'SINGLE';
export declare type InputMechanism = 'DIRECTION';
export interface Device {
    deviceId: string;
}
export interface User {
    userId: string;
    accessToken: string;
    permissions: Permission;
}
export interface Person {
    personId: string;
    accessToken: string;
}
export interface Permission {
    consentToken: string;
}
export interface Application {
    applicationId: string;
}
export declare type ConfirmationStatus = 'NONE' | 'CONFIRMED' | 'DENIED';
export interface Slot {
    name: string;
    confirmationStatus?: ConfirmationStatus;
    value: string;
    source?: string;
    resolutions?: Resolutions;
}
export interface Resolutions {
    resolutionsPerAuthority: AuthorityResolution[];
}
export declare type AuthorityResolutionStatusCode = 'ER_SUCCESS_MATCH' | 'ER_SUCCESS_NO_MATCH' | 'ER_ERROR_TIMEOUT' | 'ER_ERROR_EXCEPTION';
export interface AuthorityResolution {
    authority: string;
    status: {
        code: AuthorityResolutionStatusCode;
    };
    values: Array<{
        value: {
            name: string;
            id: string;
        };
    }>;
}
export interface Intent {
    name: string;
    confirmationStatus: ConfirmationStatus;
    slots?: {
        [key: string]: Slot;
    };
}
export interface Request {
    type: string;
    requestId: string;
    timestamp: string;
    locale: string;
    token?: string;
    offsetInMilliseconds?: number;
    intent?: Intent;
    status?: {
        code: string;
        message: string;
    };
    name?: string;
    payload?: {
        purchaseResult?: string;
        productId?: string;
    };
    error?: {
        type: string;
        message: string;
    };
    cause?: {
        requestId: string;
    };
    originatingRequestId?: string;
    events: any[];
    reason?: string;
    eventCreationTime?: string;
    eventPublishingTime?: string;
    dialogState?: string;
}
export interface AlexaInput extends Input {
    alexaSkill: {
        name?: string;
        value?: string;
        confirmationStatus?: string;
        source?: string;
        resolutions?: Resolutions;
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
}
/**
 * Thanks to @see http://choly.ca/post/typescript-json/
 */
export declare class AlexaRequest implements JovoRequest {
    version?: string;
    context?: Context;
    session?: Session;
    request?: Request;
    /**
     * @deprecated use the getDeviceName method which is platform independent
     */
    getAlexaDevice(): string;
    getDeviceName(): AlexaDeviceName;
    getScreenResolution(): string | undefined;
    getSessionId(): string | undefined;
    getAccessToken(): any;
    getInputs(): Inputs;
    /**
     * Returns all entity resolutions for the slot name.
     * @param slotName
     */
    getEntityResolutions(slotName: string): AuthorityResolution[];
    /**
     * Returns true if there is a successful matched entity
     * @param slotName
     */
    hasEntityMatch(slotName: string): boolean;
    /**
     * Returns array of successfully matched entities
     * @param slotName
     */
    getEntityMatches(slotName: string): AuthorityResolution[];
    /**
     * Returns array of successfully matched dynamic entities
     * @param slotName
     */
    getDynamicEntityMatches(slotName: string): AuthorityResolution[];
    /**
     * Returns array of successfully matched static entities
     * @param slotName
     */
    getStaticEntityMatches(slotName: string): AuthorityResolution[];
    setInputs(inputs: Inputs): this;
    getLocale(): string;
    getLanguage(): string;
    getSessionData(): any;
    getState(): any;
    setSessionData(sessionData: SessionData): this;
    addSessionData(key: string, value: any): this;
    getSessionAttributes(): any;
    getTimestamp(): any;
    getUserId(): any;
    /**
     * Returns a personId associated with a voice profile.
     * @returns {string}
     */
    getPersonId(): any;
    /**
     * Returns audio capability of request device
     * @return {boolean}
     */
    hasAudioInterface(): boolean;
    /**
     * Returns screen capability of request device
     * @return {boolean}
     */
    hasScreenInterface(): boolean;
    /**
     * Returns video capability of request device
     * @return {boolean}
     */
    hasVideoInterface(): boolean;
    isNewSession(): any;
    setLocale(locale: string): this;
    setScreenInterface(): this;
    setVideoInterface(): this;
    setSessionAttributes(attributes: SessionData): this;
    addSessionAttribute(key: string, value: any): this;
    setUserId(userId: string): this;
    setAccessToken(accessToken: string): this;
    setNewSession(isNew: boolean): this;
    setTimestamp(timestamp: string): this;
    /**
     * Sets sessionId for the request
     * @param sessionId
     */
    setSessionId(sessionId: string): this;
    setAudioInterface(): this;
    setState(state: string): this;
    addInput(key: string, value: string | object): this;
    toJSON(): AlexaRequestJSON;
    /**
     * Returns api endpoint based on user's locale settings
     * @return {String} endpoint url
     */
    getApiEndpoint(): any;
    /**
     * Returns api access token
     * @return {String} endpoint url
     */
    getApiAccessToken(): any;
    /**
     * Returns consent token
     * @return {string} constent token
     */
    getConsentToken(): any;
    /**
     * Returns device id
     * @return {string} device id
     */
    getDeviceId(): any;
    /**
     * Returns audio player token
     * @return {string}
     */
    getAudioPlayerToken(): any;
    getRequestId(): any;
    /**
     * Returns the amazon pay permission status
     * @public
     * @return {PermissionStatus | undefined}
     */
    getAmazonPayPermissionStatus(): PermissionStatus | undefined;
    /**
     * Returns true if the amazon pay permission was granted
     * @return {boolean}
     */
    isAmazonPayPermissionGranted(): boolean;
    /**
     * Returns true if the amazon pay permission was denied
     * @return {boolean}
     */
    isAmazonPayPermissionDenied(): boolean;
    /**
     * Returns the geolocation permission status
     * @return {PermissionStatus | undefined}
     */
    getGeoLocationPermissionStatus(): PermissionStatus | undefined;
    /**
     * Returns true if geolocation permission was denied
     * @return {boolean}
     */
    isGeoLocationPermissionDenied(): boolean;
    /**
     * Returns true if geolocation permission was granted
     * @return {boolean}
     */
    isGeoLocationPermissionGranted(): boolean;
    /**
     * Returns the whole geolocation object
     * @return {Geolocation | undefined}
     */
    getGeoLocationObject(): Geolocation | undefined;
    /**
     * Returns geolocation timestamp
     * @return {string | undefined} ISO 8601
     */
    getGeoLocationTimestamp(): string | undefined;
    /**
     * Returns geolocation location services object
     * @return {LocationServices | undefined}
     */
    getLocationServicesObject(): LocationServices | undefined;
    /**
     * Returns geolocation location services access
     * @return {LocationServicesAccess | undefined}
     */
    getLocationServicesAccess(): LocationServicesAccess | undefined;
    /**
     * Returns geolocation location services status
     * @return {LocationServicesStatus | undefined}
     */
    getLocationServicesStatus(): LocationServicesStatus | undefined;
    /**
     * Returns geolocation coordinate object
     * @return {Coordinate | undefined}
     */
    getCoordinateObject(): Coordinate | undefined;
    /**
     * Returns geolocation coordinate latitude in degrees
     * @return {number | undefined}	[-90.0, 90.0]
     */
    getCoordinateLatitude(): number | undefined;
    /**
     * Returns geolocation coordinate longitude in degrees
     * @return {number | undefined} [-180.0, 180]
     */
    getCoordinateLongitude(): number | undefined;
    /**
     * Returns geolocation coordinate accuracy in meters
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getCoordinateAccuracy(): number | undefined;
    /**
     * Returns geolocation altitude object
     * @return {Altitude | undefined}
     */
    getAltitudeObject(): Altitude | undefined;
    /**
     * Returns geolocation altitude in meters
     * @return {number | undefined} [-6350, 18000]
     */
    getAltitude(): number | undefined;
    /**
     * Returns geolocation altitude accuracy in meters
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getAltitudeAccuracy(): number | undefined;
    /**
     * Returns geolocation heading object
     * @return {Heading | undefined}
     */
    getHeadingObject(): Heading | undefined;
    /**
     * Returns geolocation heading direction in degrees
     * @return {number | undefined} (0.0, 360.0]
     */
    getHeadingDirection(): number | undefined;
    /**
     * Returns geolocation heading accuracy in degrees
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getHeadingAccuracy(): number | undefined;
    /**
     * Returns geolocation speed object
     * @return {Speed}
     */
    getSpeedObject(): Speed | undefined;
    /**
     * Returns geolocation speed in meters per second
     * @return {number | undefined} [0, 1900]
     */
    getSpeed(): number | undefined;
    /**
     * Returns geolocation speed accuracy in meters per second
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getSpeedAccuracy(): number | undefined;
    /**
     * Returns supported interfaces from device.
     * @public
     * @return {string} supportedInterfaces
     */
    getSupportedInterfaces(): any;
    /**
     * Returns audio capability of request device
     * @return {boolean}
     */
    hasAudioPlayerInterface(): boolean;
    /**
     * checks if request has automotive context property
     * @return {boolean}
     */
    hasAutomotive(): boolean;
    /**
     * Returns display capability of request device
     * @return {boolean}
     */
    hasDisplayInterface(): boolean;
    hasAPLInterface(): boolean;
    hasAPLTInterface(): boolean;
    hasGeoLocationInterface(): boolean;
    getIntentName(): any;
    getSlots(): any;
    getSlot(name: string): Slot;
    setSlots(slots: any): this;
    setSlot(name: string, value: string, resolutions?: Resolutions, confirmationStatus?: ConfirmationStatus, source?: string): this;
    setIntentName(intentName: string): this;
    static fromJSON(json: AlexaRequestJSON | string): AlexaRequest;
    static reviver(key: string, value: any): any;
}
