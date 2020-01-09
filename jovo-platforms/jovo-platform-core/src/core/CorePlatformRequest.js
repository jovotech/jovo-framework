"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jovo_core_1 = require("jovo-core");
var _get = require("lodash.get");
var _set = require("lodash.set");
var CorePlatformRequest = /** @class */ (function () {
    function CorePlatformRequest() {
    }
    CorePlatformRequest.fromJSON = function (json) {
        if (typeof json === 'string') {
            return JSON.parse(json, CorePlatformRequest.reviver);
        }
        else {
            var webAssistantRequest = Object.create(CorePlatformRequest.prototype);
            // tslint:disable-next-line
            return Object.assign(webAssistantRequest, json);
        }
    };
    CorePlatformRequest.reviver = function (key, value) {
        return key === '' ? CorePlatformRequest.fromJSON(value) : value;
    };
    CorePlatformRequest.prototype.addInput = function (key, value) {
        if (typeof value === 'string') {
            _set(this, "inputs." + key, {
                name: key,
                value: value,
            });
        }
        else {
            _set(this, "inputs." + key, value);
        }
        return this;
    };
    CorePlatformRequest.prototype.addSessionAttribute = function (key, value) {
        if (this.getSessionAttributes()) {
            _set(this, "session.data." + key, value);
        }
        return this;
    };
    CorePlatformRequest.prototype.addSessionData = function (key, value) {
        return this.addSessionAttribute(key, value);
    };
    CorePlatformRequest.prototype.getAccessToken = function () {
        return _get(this, "user.accessToken");
    };
    CorePlatformRequest.prototype.getInputs = function () {
        return this.inputs || {};
    };
    CorePlatformRequest.prototype.getIntentName = function () {
        if (_get(this, 'nlu.intentName')) {
            return _get(this, 'nlu.intentName');
        }
        return;
    };
    CorePlatformRequest.prototype.getLocale = function () {
        return _get(this, "request.locale", '');
    };
    CorePlatformRequest.prototype.getSessionAttributes = function () {
        return _get(this, 'session.data', {});
    };
    CorePlatformRequest.prototype.getSessionData = function () {
        return this.getSessionAttributes();
    };
    CorePlatformRequest.prototype.getSessionId = function () {
        if (this.session) {
            return this.session.id;
        }
        return;
    };
    CorePlatformRequest.prototype.getState = function () {
        return _get(this.getSessionAttributes(), jovo_core_1.SessionConstants.STATE);
    };
    CorePlatformRequest.prototype.getSupportedInterfaces = function () {
        return _get(this, "request.supportedInterfaces", []);
    };
    CorePlatformRequest.prototype.getTimestamp = function () {
        return _get(this, "request.timestamp", '');
    };
    CorePlatformRequest.prototype.getUserId = function () {
        return _get(this, 'user.id');
    };
    CorePlatformRequest.prototype.hasAudioInterface = function () {
        return this.supportsInterface('AudioPlayer');
    };
    CorePlatformRequest.prototype.hasScreenInterface = function () {
        return this.supportsInterface('Display');
    };
    CorePlatformRequest.prototype.hasVideoInterface = function () {
        return this.supportsInterface('VideoApp');
    };
    CorePlatformRequest.prototype.isNewSession = function () {
        return _get(this, "session.new", true);
    };
    CorePlatformRequest.prototype.hasTextInput = function () {
        return !this.fromVoice || false;
    };
    CorePlatformRequest.prototype.setAccessToken = function (accessToken) {
        _set(this, "user.accessToken", accessToken);
        return this;
    };
    CorePlatformRequest.prototype.setAudioInterface = function () {
        if (_get(this, 'request.supportedInterfaces')) {
            _set(this, 'request.supportedInterfaces', {
                AudioPlayer: {},
            });
        }
        return this;
    };
    CorePlatformRequest.prototype.setInputs = function (inputs) {
        this.inputs = inputs;
        return this;
    };
    CorePlatformRequest.prototype.setIntentName = function (intentName) {
        _set(this, 'nlu.intentName', intentName);
        return this;
    };
    CorePlatformRequest.prototype.setLocale = function (locale) {
        if (_get(this, "request.locale")) {
            _set(this, 'request.locale', locale);
        }
        return this;
    };
    CorePlatformRequest.prototype.setNewSession = function (isNew) {
        if (_get(this, 'session.new')) {
            _set(this, 'session.new', isNew);
        }
        return this;
    };
    CorePlatformRequest.prototype.setScreenInterface = function () {
        if (_get(this, 'request.supportedInterfaces')) {
            _set(this, 'request.supportedInterfaces', {
                AudioPlayer: {},
                Display: {},
                VideoApp: {},
            });
        }
        return this;
    };
    CorePlatformRequest.prototype.setSessionAttributes = function (attributes) {
        if (this.getSessionAttributes()) {
            _set(this, 'session.data', attributes);
        }
        return this;
    };
    CorePlatformRequest.prototype.setSessionData = function (sessionData) {
        return this.setSessionAttributes(sessionData);
    };
    CorePlatformRequest.prototype.setState = function (state) {
        if (_get(this, 'session.data')) {
            _set(this, "session.data[" + jovo_core_1.SessionConstants.STATE + "]", state);
        }
        return this;
    };
    CorePlatformRequest.prototype.setTimestamp = function (timestamp) {
        if (_get(this, "request.timestamp")) {
            _set(this, 'request.timestamp', timestamp);
        }
        return this;
    };
    CorePlatformRequest.prototype.setUserId = function (userId) {
        _set(this, 'user.id', userId);
        return this;
    };
    CorePlatformRequest.prototype.setVideoInterface = function () {
        if (_get(this, 'request.supportedInterfaces')) {
            _set(this, 'request.supportedInterfaces', {
                AudioPlayer: {},
                Display: {},
                VideoApp: {},
            });
        }
        return this;
    };
    CorePlatformRequest.prototype.supportsInterface = function (identifier) {
        return this.getSupportedInterfaces()[identifier];
    };
    CorePlatformRequest.prototype.toJSON = function () {
        return Object.assign({}, this);
    };
    CorePlatformRequest.prototype.getDeviceName = function () {
        throw new Error("Method not implemented.");
    };
    CorePlatformRequest.prototype.isNewSessionTemporaryWorkaround = function () {
        throw new Error("Method not implemented.");
    };
    return CorePlatformRequest;
}());
exports.CorePlatformRequest = CorePlatformRequest;
