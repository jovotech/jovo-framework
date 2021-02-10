"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const __1 = require("..");
const AmazonProfileAPI_1 = require("../services/AmazonProfileAPI");
const alexa_enums_1 = require("./alexa-enums");
const AlexaResponse_1 = require("./AlexaResponse");
const AlexaSpeechBuilder_1 = require("./AlexaSpeechBuilder");
const _get = require("lodash.get");
const _set = require("lodash.set");
class AlexaSkill extends jovo_core_1.Jovo {
    constructor(app, host, handleRequest) {
        super(app, host, handleRequest);
        this.$alexaSkill = this;
        this.$response = new AlexaResponse_1.AlexaResponse();
        this.$speech = new AlexaSpeechBuilder_1.AlexaSpeechBuilder(this);
        this.$reprompt = new AlexaSpeechBuilder_1.AlexaSpeechBuilder(this);
    }
    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    speechBuilder() {
        return this.getSpeechBuilder();
    }
    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    getSpeechBuilder() {
        return new AlexaSpeechBuilder_1.AlexaSpeechBuilder(this);
    }
    /**
     * Returns boolean if request is part of new session
     * @public
     * @return {boolean}
     */
    isNewSession() {
        return this.$request.isNewSession();
    }
    /**
     * Returns timestamp of a user's request
     * @returns {string | undefined}
     */
    getTimestamp() {
        return this.$request.getTimestamp();
    }
    /**
     * Returns locale of the request
     * @deprecated use this.$request.getLocale() instead
     * @returns {string}
     */
    getLocale() {
        return this.$request.getLocale();
    }
    /**
     * Returns all entity resolutions for the slot name.
     * @param slotName
     */
    getEntityResolutions(slotName) {
        const alexaRequest = this.$request;
        return alexaRequest.getEntityResolutions(slotName);
    }
    /**
     * Returns true if there is a successful matched entity
     * @param slotName
     */
    hasEntityMatch(slotName) {
        const alexaRequest = this.$request;
        return alexaRequest.hasEntityMatch(slotName);
    }
    /**
     * Returns array of successfully matched entities
     * @param slotName
     */
    getEntityMatches(slotName) {
        const alexaRequest = this.$request;
        return alexaRequest.getEntityMatches(slotName);
    }
    /**
     * Returns array of successfully matched dynamic entities
     * @param slotName
     */
    getDynamicEntityMatches(slotName) {
        const alexaRequest = this.$request;
        return alexaRequest.getDynamicEntityMatches(slotName);
    }
    /**
     * Returns array of successfully matched static entities
     * @param slotName
     */
    getStaticEntityMatches(slotName) {
        const alexaRequest = this.$request;
        return alexaRequest.getStaticEntityMatches(slotName);
    }
    /**
     * Returns UserID
     * @deprecated Use this.$user.getId() instead.
     * @public
     * @return {string}
     */
    getUserId() {
        return this.$user.getId();
    }
    /**
     * Sends an asynchronous speak directive
     * @param {string | SpeechBuilder} speech
     * @param {Function} callback
     * @return {Promise}
     */
    progressiveResponse(speech, callback) {
        const alexaRequest = this.$request;
        if (this.isJovoDebuggerRequest()) {
            jovo_core_1.Log.warn(`progressiveResponse isn't supported by the JovoDebugger. The speech is ignored here.`);
            if (callback) {
                callback();
            }
            else {
                return Promise.resolve();
            }
        }
        if (callback) {
            __1.AlexaAPI.progressiveResponse(speech, alexaRequest.getRequestId(), alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken()).then(() => callback());
        }
        else {
            return __1.AlexaAPI.progressiveResponse(speech, alexaRequest.getRequestId(), alexaRequest.getApiEndpoint(), alexaRequest.getApiAccessToken());
        }
    }
    /**
     * Makes a request to the amazon profile api
     * @public
     * @param {func} callback
     */
    requestAmazonProfile(callback) {
        const alexaRequest = this.$request;
        if (callback) {
            AmazonProfileAPI_1.AmazonProfileAPI.requestAmazonProfile(alexaRequest.getAccessToken()).then(() => callback());
        }
        else {
            return AmazonProfileAPI_1.AmazonProfileAPI.requestAmazonProfile(alexaRequest.getAccessToken());
        }
    }
    /**
     * Returns device id
     * @returns {string | undefined}
     */
    getDeviceId() {
        return _get(this.$request, 'context.System.device.deviceId');
    }
    /**
     * Returns audio capability of request device
     * @public
     * @return {boolean}
     */
    hasAudioInterface() {
        return this.$request.hasAudioInterface();
    }
    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasScreenInterface() {
        return this.$request.hasScreenInterface();
    }
    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasVideoInterface() {
        return this.$request.hasVideoInterface();
    }
    /**
     * Returns APL capability of request device
     * @public
     * @return {boolean}
     */
    hasAPLInterface() {
        return this.$request.hasAPLInterface();
    }
    /**
     * Returns APLT capability of request device
     * @public
     * @return {boolean}
     */
    hasAPLTInterface() {
        return this.$request.hasAPLTInterface();
    }
    /**
     * Returns the amazon pay permission status
     * @public
     * @return {PermissionStatus | undefined}
     */
    getAmazonPayPermissionStatus() {
        return this.$request.getAmazonPayPermissionStatus();
    }
    /**
     * Returns true if the amazon pay permission was granted
     * @return {boolean}
     */
    isAmazonPayPermissionGranted() {
        return this.$request.isAmazonPayPermissionGranted();
    }
    /**
     * Returns true if the amazon pay permission was denied
     * @return {boolean}
     */
    isAmazonPayPermissionDenied() {
        return this.$request.isAmazonPayPermissionDenied();
    }
    /**
     * Returns geo location capability of request device
     * @public
     * @return {boolean}
     */
    hasGeoLocationInterface() {
        return this.$request.hasGeoLocationInterface();
    }
    /**
     * Returns the geolocation permission status
     * @return {PermissionStatus | undefined}
     */
    getGeoLocationPermissionStatus() {
        return this.$request.getGeoLocationPermissionStatus();
    }
    /**
     * Returns true if geolocation permission was denied
     * @return {boolean}
     */
    isGeoLocationPermissionDenied() {
        return this.$request.isGeoLocationPermissionDenied();
    }
    /**
     * Returns true if geolocation permission was granted
     * @return {boolean}
     */
    isGeoLocationPermissionGranted() {
        return this.$request.isGeoLocationPermissionGranted();
    }
    /**
     * Returns the whole geolocation object
     * @return {Geolocation | undefined}
     */
    getGeoLocationObject() {
        return this.$request.getGeoLocationObject();
    }
    /**
     * Returns geolocation timestamp
     * @return {string | undefined} ISO 8601
     */
    getGeoLocationTimestamp() {
        return this.$request.getGeoLocationTimestamp();
    }
    /**
     * Returns geolocation location services object
     * @return {LocationServices | undefined}
     */
    getLocationServicesObject() {
        return this.$request.getLocationServicesObject();
    }
    /**
     * Returns geolocation location services access
     * @return {LocationServicesAccess | undefined}
     */
    getLocationServicesAccess() {
        return this.$request.getLocationServicesAccess();
    }
    /**
     * Returns geolocation location services status
     * @return {LocationServicesStatus | undefined}
     */
    getLocationServicesStatus() {
        return this.$request.getLocationServicesStatus();
    }
    /**
     * Returns geolocation coordinate object
     * @return {Coordinate | undefined}
     */
    getCoordinateObject() {
        return this.$request.getCoordinateObject();
    }
    /**
     * Returns geolocation coordinate latitude in degrees
     * @return {number | undefined}	[-90.0, 90.0]
     */
    getCoordinateLatitude() {
        return this.$request.getCoordinateLatitude();
    }
    /**
     * Returns geolocation coordinate longitude in degrees
     * @return {number | undefined} [-180.0, 180]
     */
    getCoordinateLongitude() {
        return this.$request.getCoordinateLongitude();
    }
    /**
     * Returns geolocation coordinate accuracy in meters
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getCoordinateAccuracy() {
        return this.$request.getCoordinateAccuracy();
    }
    /**
     * Returns geolocation altitude object
     * @return {Altitude | undefined}
     */
    getAltitudeObject() {
        return this.$request.getAltitudeObject();
    }
    /**
     * Returns geolocation altitude in meters
     * @return {number | undefined} [-6350, 18000]
     */
    getAltitude() {
        return this.$request.getAltitude();
    }
    /**
     * Returns geolocation altitude accuracy in meters
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getAltitudeAccuracy() {
        return this.$request.getAltitudeAccuracy();
    }
    /**
     * Returns geolocation heading object
     * @return {Heading | undefined}
     */
    getHeadingObject() {
        return this.$request.getHeadingObject();
    }
    /**
     * Returns geolocation heading direction in degrees
     * @return {number | undefined} (0.0, 360.0]
     */
    getHeadingDirection() {
        return this.$request.getHeadingDirection();
    }
    /**
     * Returns geolocation heading accuracy in degrees
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getHeadingAccuracy() {
        return this.$request.getHeadingAccuracy();
    }
    /**
     * Returns geolocation speed object
     * @return {Speed}
     */
    getSpeedObject() {
        return this.$request.getSpeedObject();
    }
    /**
     * Returns geolocation speed in meters per second
     * @return {number | undefined} [0, 1900]
     */
    getSpeed() {
        return this.$request.getSpeed();
    }
    /**
     * Returns geolocation speed accuracy in meters per second
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getSpeedAccuracy() {
        return this.$request.getSpeedAccuracy();
    }
    /**
     * Returns type of platform jovo implementation
     * @public
     * @return {string}
     */
    getType() {
        return 'AlexaSkill';
    }
    /**
     * Returns type of platform type
     * @public
     * @return {string}
     */
    getPlatformType() {
        return 'Alexa';
    }
    /**
     * Adds raw json directive to output object
     * @param directive
     */
    // tslint:disable-next-line
    addDirective(directive) {
        const directives = _get(this.$output, 'Alexa.Directives', []);
        directives.push(directive);
        _set(this.$output, 'Alexa.Directives', directives);
        return this;
    }
    /**
     * Returns id of the touched/selected item
     * @public
     * @return {*}
     */
    getSelectedElementId() {
        return _get(this.$request, 'request.arguments') || _get(this.$request, 'request.token');
    }
    /**
     * Returns raw text.
     * Only available with catchAll slots
     * @return {String} rawText
     */
    getRawText() {
        if (!this.$inputs || this.$inputs.catchAll) {
            throw new Error('Only available with catchAll slot');
        }
        return _get(this, '$inputs.catchAll.value');
    }
    /**
     * Returns audio data of request.
     * Not supported by this platform.
     * @return {undefined}
     */
    getAudioData() {
        return undefined;
    }
    /**
     * Returns template builder by type
     * @public
     * @param {string} type
     * @return {*}
     */
    templateBuilder(type) {
        if (type === 'BodyTemplate1') {
            return new __1.BodyTemplate1();
        }
        if (type === 'BodyTemplate2') {
            return new __1.BodyTemplate2();
        }
        if (type === 'BodyTemplate3') {
            return new __1.BodyTemplate3();
        }
        if (type === 'BodyTemplate6') {
            return new __1.BodyTemplate6();
        }
        if (type === 'BodyTemplate7') {
            return new __1.BodyTemplate7();
        }
        if (type === 'ListTemplate1') {
            return new __1.ListTemplate1();
        }
        if (type === 'ListTemplate2') {
            return new __1.ListTemplate2();
        }
        if (type === 'ListTemplate3') {
            return new __1.ListTemplate3();
        }
    }
    /**
     * Returns reason code for an end of a session
     *
     * @public
     * @return {*}
     */
    getEndReason() {
        return _get(this.$request, 'request.reason');
    }
    /**
     * Returns error object
     *
     * @public
     * @return {*}
     */
    getError() {
        return _get(this.$request, 'request.error');
    }
    /**
     * Returns skill id
     * @returns {string | undefined}
     */
    getSkillId() {
        return (_get(this.$request, 'session.application.applicationId') ||
            _get(this.$request, 'context.System.application.applicationId'));
    }
    /**
     * Deletes shouldEndSession property
     * @public
     */
    deleteShouldEndSession(value = true) {
        _set(this.$output, 'Alexa.deleteShouldEndSession', value);
        return this;
    }
    /**
     * Sets value for shouldEndSession. Removes shouldEndSession when null
     * @public
     */
    shouldEndSession(value) {
        _set(this.$output, 'Alexa.shouldEndSession', value);
        return this;
    }
    /**
     * Returns true if the current request is of type ON_EVENT
     * @public
     * @return {boolean}
     */
    isEventRequest() {
        return this.$type.type === alexa_enums_1.EnumAlexaRequestType.ON_EVENT;
    }
    /**
     * Returns true if the current request is of type ON_PURCHASE
     * @public
     * @return {boolean}
     */
    isPurchaseRequest() {
        return this.$type.type === alexa_enums_1.EnumAlexaRequestType.ON_PURCHASE;
    }
    /**
     * Returns true if the current request is of type CAN_FULFILL_INTENT
     * @public
     * @return {boolean}
     */
    isCanFulfillIntentRequest() {
        return this.$type.type === alexa_enums_1.EnumAlexaRequestType.CAN_FULFILL_INTENT;
    }
    /**
     * Returns true if the current request is of type PLAYBACKCONTROLLER
     * @public
     * @return {boolean}
     */
    isPlaybackControllerRequest() {
        return this.$type.type === alexa_enums_1.EnumAlexaRequestType.PLAYBACKCONTROLLER;
    }
    /**
     * Returns true if the current request is of type ON_GAME_ENGINE_INPUT_HANDLER_EVENT
     * @public
     * @return {boolean}
     */
    isGameEngineInputHandlerEventRequest() {
        return this.$type.type === alexa_enums_1.EnumAlexaRequestType.ON_GAME_ENGINE_INPUT_HANDLER_EVENT;
    }
}
exports.AlexaSkill = AlexaSkill;
//# sourceMappingURL=AlexaSkill.js.map