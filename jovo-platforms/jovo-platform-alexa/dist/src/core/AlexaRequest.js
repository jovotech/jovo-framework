"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const Interfaces_1 = require("./Interfaces");
const _get = require("lodash.get");
const _set = require("lodash.set");
/**
 * Thanks to @see http://choly.ca/post/typescript-json/
 */
class AlexaRequest {
    // JovoRequest implementation
    /**
     * @deprecated use the getDeviceName method which is platform independent
     */
    getAlexaDevice() {
        let device = 'Echo - voice only';
        if (this.context && this.context.Viewport) {
            device =
                'Unknown Device with Screen ' +
                    this.context.Viewport.pixelWidth +
                    'x' +
                    this.context.Viewport.pixelHeight;
            if (this.context.Viewport.pixelWidth === 480 &&
                this.context.Viewport.pixelHeight === 480 &&
                this.context.Viewport.dpi === 160 &&
                this.context.Viewport.shape === 'ROUND') {
                device = 'Alexa Small Hub'; //'Echo Spot';
            }
            if (this.context.Viewport.pixelWidth === 960 &&
                this.context.Viewport.pixelHeight === 480 &&
                this.context.Viewport.dpi === 160 &&
                this.context.Viewport.shape === 'RECTANGLE') {
                device = 'Alexa Small Hub Rectangular'; //'Echo Show 5';
            }
            if (this.context.Viewport.pixelWidth === 1280 &&
                this.context.Viewport.pixelHeight === 720 &&
                this.context.Viewport.shape === 'RECTANGLE') {
                device = 'Alexa HD Ready TV';
            }
            if (this.context.Viewport.pixelWidth === 1920 &&
                this.context.Viewport.pixelHeight === 1080 &&
                this.context.Viewport.dpi === 320 &&
                this.context.Viewport.shape === 'RECTANGLE') {
                device = 'Alexa Extra Large TV'; //'Full HD TV';
            }
            if (this.context.Viewport.pixelWidth === 1024 &&
                this.context.Viewport.pixelHeight === 600 &&
                this.context.Viewport.dpi === 160 &&
                this.context.Viewport.shape === 'RECTANGLE') {
                device = 'Alexa Medium Hub'; //'Echo Show 1st gen';
            }
            if (this.context.Viewport.pixelWidth === 1280 &&
                this.context.Viewport.pixelHeight === 800 &&
                this.context.Viewport.dpi === 160 &&
                this.context.Viewport.shape === 'RECTANGLE') {
                device = 'Alexa Large Hub'; //'Echo Show 2nd gen';
            }
        }
        return device;
    }
    getDeviceName() {
        let device = Interfaces_1.AlexaDeviceName.ALEXA_AUDIO_ONLY;
        if (this.context && this.context.Viewport) {
            device = Interfaces_1.AlexaDeviceName.ALEXA_UNSPECIFIED_SCREEN;
            if (this.context.Viewport.pixelWidth === 480 &&
                this.context.Viewport.pixelHeight === 480 &&
                this.context.Viewport.dpi === 160 &&
                this.context.Viewport.shape === 'ROUND') {
                device = Interfaces_1.AlexaDeviceName.ALEXA_HUB_SMALL_ROUND; //'Echo Spot';
            }
            if (this.context.Viewport.pixelWidth === 960 &&
                this.context.Viewport.pixelHeight === 480 &&
                this.context.Viewport.dpi === 160 &&
                this.context.Viewport.shape === 'RECTANGLE') {
                device = Interfaces_1.AlexaDeviceName.ALEXA_HUB_SMALL_RECTANGLE; //'Echo Show 5';
            }
            if (this.context.Viewport.pixelWidth === 1920 &&
                this.context.Viewport.pixelHeight === 1080 &&
                this.context.Viewport.shape === 'RECTANGLE') {
                device = Interfaces_1.AlexaDeviceName.ALEXA_TV_XLARGE_RECTANGLE; //'Full HD TV';
            }
            if (this.context.Viewport.pixelWidth === 1024 &&
                this.context.Viewport.pixelHeight === 600 &&
                this.context.Viewport.dpi === 160 &&
                this.context.Viewport.shape === 'RECTANGLE') {
                device = Interfaces_1.AlexaDeviceName.ALEXA_HUB_MEDIUM_RECTANGLE; //'Echo Show 1st gen';
            }
            if (this.context.Viewport.pixelWidth === 1280 &&
                this.context.Viewport.pixelHeight === 800 &&
                this.context.Viewport.dpi === 160 &&
                this.context.Viewport.shape === 'RECTANGLE') {
                device = Interfaces_1.AlexaDeviceName.ALEXA_HUB_LARGE_RECTANGLE; //'Echo Show 2nd gen';
            }
        }
        return device;
    }
    getScreenResolution() {
        let resolution;
        if (this.context && this.context.Viewport) {
            resolution = this.context.Viewport.pixelWidth + 'x' + this.context.Viewport.pixelHeight;
        }
        return resolution;
    }
    getSessionId() {
        if (this.session) {
            return this.session.sessionId;
        }
    }
    getAccessToken() {
        return _get(this, 'context.System.user.accessToken');
    }
    getInputs() {
        const inputs = {};
        const slots = this.getSlots();
        if (!slots) {
            return inputs;
        }
        Object.keys(slots).forEach((slot) => {
            const input = {
                name: slot,
                alexaSkill: slots[slot],
            };
            if (slots[slot].value) {
                input.value = slots[slot].value;
                input.key = slots[slot].value;
            }
            // check static entities first
            this.getStaticEntityMatches(slot).forEach((authorityResolution) => {
                input.key = authorityResolution.values[0].value.name;
                input.id = authorityResolution.values[0].value.id;
            });
            // dynamic entities have higher priority
            this.getDynamicEntityMatches(slot).forEach((authorityResolution) => {
                input.key = authorityResolution.values[0].value.name;
                input.id = authorityResolution.values[0].value.id;
            });
            inputs[slot] = input;
        });
        return inputs;
    }
    /**
     * Returns all entity resolutions for the slot name.
     * @param slotName
     */
    getEntityResolutions(slotName) {
        if (this.request &&
            this.request.intent &&
            this.request.intent.slots &&
            this.request.intent.slots[slotName]) {
            const slot = this.request.intent.slots[slotName];
            if (slot.resolutions && slot.resolutions.resolutionsPerAuthority) {
                return slot.resolutions.resolutionsPerAuthority;
            }
        }
        return [];
    }
    /**
     * Returns true if there is a successful matched entity
     * @param slotName
     */
    hasEntityMatch(slotName) {
        return (typeof this.getEntityResolutions(slotName).find((authorityResolution) => {
            return authorityResolution.status.code === 'ER_SUCCESS_MATCH';
        }) !== 'undefined');
    }
    /**
     * Returns array of successfully matched entities
     * @param slotName
     */
    getEntityMatches(slotName) {
        return this.getEntityResolutions(slotName).filter((authorityResolution) => {
            return authorityResolution.status.code === 'ER_SUCCESS_MATCH';
        });
    }
    /**
     * Returns array of successfully matched dynamic entities
     * @param slotName
     */
    getDynamicEntityMatches(slotName) {
        return this.getEntityResolutions(slotName).filter((authorityResolution) => {
            return (authorityResolution.status.code === 'ER_SUCCESS_MATCH' &&
                authorityResolution.authority.startsWith('amzn1.er-authority.echo-sdk.dynamic'));
        });
    }
    /**
     * Returns array of successfully matched static entities
     * @param slotName
     */
    getStaticEntityMatches(slotName) {
        return this.getEntityResolutions(slotName).filter((authorityResolution) => {
            return (authorityResolution.status.code === 'ER_SUCCESS_MATCH' &&
                authorityResolution.authority.startsWith('amzn1.er-authority.echo-sdk.amzn1'));
        });
    }
    setInputs(inputs) {
        Object.keys(inputs).forEach((key) => {
            const input = inputs[key];
            const slot = {
                name: input.name,
                value: input.value,
                confirmationStatus: 'NONE',
            };
            const alexaInput = input;
            if (alexaInput.alexaSkill) {
                _set(this, `request.intent.slots[${input.name}]`, alexaInput.alexaSkill);
            }
            else {
                _set(this, `request.intent.slots[${input.name}]`, slot);
            }
        });
        return this;
    }
    getLocale() {
        return this.request.locale;
    }
    getLanguage() {
        return this.getLocale().substring(0, 2);
    }
    getSessionData() {
        return this.getSessionAttributes();
    }
    getState() {
        return _get(this.getSessionAttributes(), jovo_core_1.SessionConstants.STATE);
    }
    setSessionData(sessionData) {
        return this.setSessionAttributes(sessionData);
    }
    // tslint:disable-next-line
    addSessionData(key, value) {
        return this.addSessionAttribute(key, value);
    }
    getSessionAttributes() {
        return _get(this, 'session.attributes');
    }
    getTimestamp() {
        return _get(this, 'request.timestamp');
    }
    getUserId() {
        return _get(this, 'session.user.userId') || _get(this, 'context.System.user.userId');
    }
    /**
     * Returns a personId associated with a voice profile.
     * @returns {string}
     */
    getPersonId() {
        return _get(this, 'session.person.personId') || _get(this, 'context.System.person.personId');
    }
    /**
     * Returns audio capability of request device
     * @return {boolean}
     */
    hasAudioInterface() {
        return (this.hasScreenInterface() ||
            typeof _get(this.getSupportedInterfaces(), 'AudioPlayer') !== 'undefined');
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
    setLocale(locale) {
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
                    templateVersion: '1.0',
                    markupVersion: '1.0',
                },
                'VideoApp': {},
                'Alexa.Presentation.APL': {
                    runtime: {
                        maxVersion: '1.0',
                    },
                },
            });
        }
        return this;
    }
    setVideoInterface() {
        if (_get(this, 'context.System.device.supportedInterfaces')) {
            _set(this, 'context.System.device.supportedInterfaces', {
                AudioPlayer: {},
                Display: {
                    templateVersion: '1.0',
                    markupVersion: '1.0',
                },
                VideoApp: {},
            });
        }
        return this;
    }
    setSessionAttributes(attributes) {
        if (this.getSessionAttributes()) {
            _set(this, 'session.attributes', attributes);
        }
        return this;
    }
    // tslint:disable-next-line
    addSessionAttribute(key, value) {
        if (this.getSessionAttributes()) {
            _set(this, `session.attributes.${key}`, value);
        }
        return this;
    }
    setUserId(userId) {
        _set(this, 'session.user.userId', userId);
        _set(this, 'context.System.user.userId', userId);
        return this;
    }
    setAccessToken(accessToken) {
        _set(this, 'context.System.user.accessToken', accessToken);
        return this;
    }
    setNewSession(isNew) {
        if (typeof _get(this, 'session.new') !== 'undefined') {
            _set(this, 'session.new', isNew);
        }
        return this;
    }
    setTimestamp(timestamp) {
        if (_get(this, `request.timestamp`)) {
            _set(this, 'request.timestamp', timestamp);
        }
        return this;
    }
    /**
     * Sets sessionId for the request
     * @param sessionId
     */
    setSessionId(sessionId) {
        if (this.session) {
            this.session.sessionId = sessionId;
        }
        return this;
    }
    setAudioInterface() {
        if (_get(this, 'context.System.device.supportedInterfaces')) {
            _set(this, 'context.System.device.supportedInterfaces', {
                AudioPlayer: {},
            });
        }
        return this;
    }
    setState(state) {
        if (_get(this, 'session.attributes')) {
            _set(this, `session.attributes[${jovo_core_1.SessionConstants.STATE}]`, state);
        }
        return this;
    }
    addInput(key, value) {
        if (typeof value === 'string') {
            _set(this, `request.intent.slots.${key}`, {
                name: key,
                value,
            });
        }
        else {
            _set(this, `request.intent.slots.${key}`, value);
        }
        return this;
    }
    toJSON() {
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
        return _get(this, 'context.AudioPlayer.token', _get(this, 'request.token'));
    }
    getRequestId() {
        return _get(this, 'request.requestId');
    }
    /**
     * Returns the amazon pay permission status
     * @public
     * @return {PermissionStatus | undefined}
     */
    getAmazonPayPermissionStatus() {
        return _get(this, 'context.System.user.permissions.scopes.payments:autopay_consent.status');
    }
    /**
     * Returns true if the amazon pay permission was granted
     * @return {boolean}
     */
    isAmazonPayPermissionGranted() {
        return this.getAmazonPayPermissionStatus() === 'GRANTED';
    }
    /**
     * Returns true if the amazon pay permission was denied
     * @return {boolean}
     */
    isAmazonPayPermissionDenied() {
        return this.getAmazonPayPermissionStatus() === 'DENIED';
    }
    /**
     * Returns the geolocation permission status
     * @return {PermissionStatus | undefined}
     */
    getGeoLocationPermissionStatus() {
        return _get(this, 'context.System.user.permissions.scopes.alexa::devices:all:geolocation:read.status');
    }
    /**
     * Returns true if geolocation permission was denied
     * @return {boolean}
     */
    isGeoLocationPermissionDenied() {
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
    getGeoLocationObject() {
        return _get(this, 'context.Geolocation');
    }
    /**
     * Returns geolocation timestamp
     * @return {string | undefined} ISO 8601
     */
    getGeoLocationTimestamp() {
        return _get(this.getGeoLocationObject(), 'timestamp');
    }
    /**
     * Returns geolocation location services object
     * @return {LocationServices | undefined}
     */
    getLocationServicesObject() {
        return _get(this.getGeoLocationObject(), 'locationServices');
    }
    /**
     * Returns geolocation location services access
     * @return {LocationServicesAccess | undefined}
     */
    getLocationServicesAccess() {
        return _get(this.getLocationServicesObject(), 'access');
    }
    /**
     * Returns geolocation location services status
     * @return {LocationServicesStatus | undefined}
     */
    getLocationServicesStatus() {
        return _get(this.getLocationServicesObject(), 'status');
    }
    /**
     * Returns geolocation coordinate object
     * @return {Coordinate | undefined}
     */
    getCoordinateObject() {
        return _get(this.getGeoLocationObject(), 'coordinate');
    }
    /**
     * Returns geolocation coordinate latitude in degrees
     * @return {number | undefined}	[-90.0, 90.0]
     */
    getCoordinateLatitude() {
        return _get(this.getCoordinateObject(), 'latitudeInDegrees');
    }
    /**
     * Returns geolocation coordinate longitude in degrees
     * @return {number | undefined} [-180.0, 180]
     */
    getCoordinateLongitude() {
        return _get(this.getCoordinateObject(), 'longitudeInDegrees');
    }
    /**
     * Returns geolocation coordinate accuracy in meters
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getCoordinateAccuracy() {
        return _get(this.getCoordinateObject(), 'accuracyInMeters');
    }
    /**
     * Returns geolocation altitude object
     * @return {Altitude | undefined}
     */
    getAltitudeObject() {
        return _get(this.getGeoLocationObject(), 'altitude');
    }
    /**
     * Returns geolocation altitude in meters
     * @return {number | undefined} [-6350, 18000]
     */
    getAltitude() {
        return _get(this.getAltitudeObject(), 'altitudeInMeters');
    }
    /**
     * Returns geolocation altitude accuracy in meters
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getAltitudeAccuracy() {
        return _get(this.getAltitudeObject(), 'accuracyInMeters');
    }
    /**
     * Returns geolocation heading object
     * @return {Heading | undefined}
     */
    getHeadingObject() {
        return _get(this.getGeoLocationObject(), 'heading');
    }
    /**
     * Returns geolocation heading direction in degrees
     * @return {number | undefined} (0.0, 360.0]
     */
    getHeadingDirection() {
        return _get(this.getHeadingObject(), 'directionInDegrees');
    }
    /**
     * Returns geolocation heading accuracy in degrees
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getHeadingAccuracy() {
        return _get(this.getHeadingObject(), 'accuracyInDegrees');
    }
    /**
     * Returns geolocation speed object
     * @return {Speed}
     */
    getSpeedObject() {
        return _get(this.getGeoLocationObject(), 'speed');
    }
    /**
     * Returns geolocation speed in meters per second
     * @return {number | undefined} [0, 1900]
     */
    getSpeed() {
        return _get(this.getSpeedObject(), 'speedInMetersPerSecond');
    }
    /**
     * Returns geolocation speed accuracy in meters per second
     * @return {number | undefined} [0, MAX_INTEGER]
     */
    getSpeedAccuracy() {
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
        return (this.hasScreenInterface() ||
            typeof _get(this.getSupportedInterfaces(), 'AudioPlayer') !== 'undefined');
    }
    /**
     * checks if request has automotive context property
     * @return {boolean}
     */
    hasAutomotive() {
        return typeof _get(this, 'context.Automotive') !== 'undefined';
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
    hasAPLTInterface() {
        return typeof _get(this.getSupportedInterfaces(), 'Alexa.Presentation.APLT') !== 'undefined';
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
    getSlot(name) {
        return _get(this, `request.intent.slots.${name}`);
    }
    // tslint:disable-next-line
    setSlots(slots) {
        _set(this, `request.intent.slots`, slots);
        return this;
    }
    setSlot(name, value, resolutions, confirmationStatus, source) {
        _set(this, `request.intent.slots.${name}`, {
            name,
            value,
        });
        if (resolutions) {
            _set(this, `request.intent.slots.${name}.resolutions`, resolutions);
        }
        if (confirmationStatus) {
            _set(this, `request.intent.slots.${name}.confirmationStatus`, confirmationStatus);
        }
        if (source) {
            _set(this, `request.intent.slots.${name}.source`, source);
        }
        return this;
    }
    setIntentName(intentName) {
        if (this.getIntentName()) {
            _set(this, 'request.intent.name', intentName);
        }
        return this;
    }
    // fromJSON is used to convert an serialized version
    // of the User to an instance of the class
    static fromJSON(json) {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, AlexaRequest.reviver);
        }
        else {
            // create an instance of the User class
            const alexaRequest = Object.create(AlexaRequest.prototype);
            // copy all the fields from the json object
            return Object.assign(alexaRequest, json);
        }
    }
    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    // tslint:disable-next-line
    static reviver(key, value) {
        return key === '' ? AlexaRequest.fromJSON(value) : value;
    }
}
exports.AlexaRequest = AlexaRequest;
//# sourceMappingURL=AlexaRequest.js.map