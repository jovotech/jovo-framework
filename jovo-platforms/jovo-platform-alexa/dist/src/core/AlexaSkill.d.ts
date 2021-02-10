import { AudioData, BaseApp, HandleRequest, Host, Jovo, SpeechBuilder } from 'jovo-core';
import { BodyTemplate1, ListTemplate1 } from '..';
import { Altitude, AuthorityResolution, Coordinate, Geolocation, Heading, LocationServices, LocationServicesAccess, LocationServicesStatus, PermissionStatus, Speed } from './AlexaRequest';
import { AlexaSpeechBuilder } from './AlexaSpeechBuilder';
import { AlexaUser } from './AlexaUser';
export declare class AlexaSkill extends Jovo {
    $alexaSkill: AlexaSkill;
    $user: AlexaUser;
    constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest);
    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    speechBuilder(): AlexaSpeechBuilder;
    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    getSpeechBuilder(): AlexaSpeechBuilder;
    /**
     * Returns boolean if request is part of new session
     * @public
     * @return {boolean}
     */
    isNewSession(): boolean;
    /**
     * Returns timestamp of a user's request
     * @returns {string | undefined}
     */
    getTimestamp(): string;
    /**
     * Returns locale of the request
     * @deprecated use this.$request.getLocale() instead
     * @returns {string}
     */
    getLocale(): string;
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
    /**
     * Returns UserID
     * @deprecated Use this.$user.getId() instead.
     * @public
     * @return {string}
     */
    getUserId(): string;
    /**
     * Sends an asynchronous speak directive
     * @param {string | SpeechBuilder} speech
     * @param {Function} callback
     * @return {Promise}
     */
    progressiveResponse(speech: string | SpeechBuilder, callback?: Function): Promise<void> | undefined;
    /**
     * Makes a request to the amazon profile api
     * @public
     * @param {func} callback
     */
    requestAmazonProfile(callback?: Function): Promise<any> | undefined;
    /**
     * Returns device id
     * @returns {string | undefined}
     */
    getDeviceId(): any;
    /**
     * Returns audio capability of request device
     * @public
     * @return {boolean}
     */
    hasAudioInterface(): boolean;
    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasScreenInterface(): boolean;
    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasVideoInterface(): boolean;
    /**
     * Returns APL capability of request device
     * @public
     * @return {boolean}
     */
    hasAPLInterface(): boolean;
    /**
     * Returns APLT capability of request device
     * @public
     * @return {boolean}
     */
    hasAPLTInterface(): boolean;
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
     * Returns geo location capability of request device
     * @public
     * @return {boolean}
     */
    hasGeoLocationInterface(): boolean;
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
     * Returns type of platform jovo implementation
     * @public
     * @return {string}
     */
    getType(): string;
    /**
     * Returns type of platform type
     * @public
     * @return {string}
     */
    getPlatformType(): string;
    /**
     * Adds raw json directive to output object
     * @param directive
     */
    addDirective(directive: any): this;
    /**
     * Returns id of the touched/selected item
     * @public
     * @return {*}
     */
    getSelectedElementId(): any;
    /**
     * Returns raw text.
     * Only available with catchAll slots
     * @return {String} rawText
     */
    getRawText(): any;
    /**
     * Returns audio data of request.
     * Not supported by this platform.
     * @return {undefined}
     */
    getAudioData(): AudioData | undefined;
    /**
     * Returns template builder by type
     * @public
     * @param {string} type
     * @return {*}
     */
    templateBuilder(type: string): BodyTemplate1 | ListTemplate1 | undefined;
    /**
     * Returns reason code for an end of a session
     *
     * @public
     * @return {*}
     */
    getEndReason(): any;
    /**
     * Returns error object
     *
     * @public
     * @return {*}
     */
    getError(): any;
    /**
     * Returns skill id
     * @returns {string | undefined}
     */
    getSkillId(): string | undefined;
    /**
     * Deletes shouldEndSession property
     * @public
     */
    deleteShouldEndSession(value?: boolean): this;
    /**
     * Sets value for shouldEndSession. Removes shouldEndSession when null
     * @public
     */
    shouldEndSession(value: boolean | null): this;
    /**
     * Returns true if the current request is of type ON_EVENT
     * @public
     * @return {boolean}
     */
    isEventRequest(): boolean;
    /**
     * Returns true if the current request is of type ON_PURCHASE
     * @public
     * @return {boolean}
     */
    isPurchaseRequest(): boolean;
    /**
     * Returns true if the current request is of type CAN_FULFILL_INTENT
     * @public
     * @return {boolean}
     */
    isCanFulfillIntentRequest(): boolean;
    /**
     * Returns true if the current request is of type PLAYBACKCONTROLLER
     * @public
     * @return {boolean}
     */
    isPlaybackControllerRequest(): boolean;
    /**
     * Returns true if the current request is of type ON_GAME_ENGINE_INPUT_HANDLER_EVENT
     * @public
     * @return {boolean}
     */
    isGameEngineInputHandlerEventRequest(): boolean;
}
