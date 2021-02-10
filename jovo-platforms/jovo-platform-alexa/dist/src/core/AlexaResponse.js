"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _set = require("lodash.set");
/**
 * Thanks to @see http://choly.ca/post/typescript-json/
 */
class AlexaResponse {
    constructor() {
        this.version = '1.0';
        this.response = {
            shouldEndSession: true,
        };
        this.sessionAttributes = {};
    }
    getCard() {
        return _get(this, 'response.card');
    }
    getDirectives() {
        return _get(this, 'response.directives');
    }
    getDirective(directiveType) {
        const allDirectives = this.getDirectives();
        for (const directiveItem of allDirectives) {
            if (directiveItem.type && directiveItem.type.indexOf(directiveType) > -1) {
                return directiveItem;
            }
        }
    }
    getAplDirective() {
        const allDirectives = this.getDirectives();
        if (allDirectives) {
            for (const directiveItem of allDirectives) {
                if (directiveItem.document && directiveItem.document.type === 'APL') {
                    return directiveItem;
                }
            }
        }
        return;
    }
    hasAplDirective() {
        if (!this.getAplDirective()) {
            return false;
        }
        return true;
    }
    getApltDirective() {
        const allDirectives = this.getDirectives();
        if (allDirectives) {
            for (const directiveItem of allDirectives) {
                if (directiveItem.document && directiveItem.document.type === 'APLT') {
                    return directiveItem;
                }
            }
        }
        return;
    }
    hasApltDirective() {
        if (!this.getApltDirective()) {
            return false;
        }
        return true;
    }
    getDisplayDirective() {
        if (this.getDirectives()) {
            return this.getDirective('Display');
        }
        return;
    }
    hasDisplayDirective() {
        if (!this.getDisplayDirective()) {
            return false;
        }
        return true;
    }
    getAudioDirective() {
        if (this.getDirectives()) {
            return this.getDirective('AudioPlayer');
        }
        return;
    }
    hasAudioDirective() {
        if (!this.getAudioDirective()) {
            return false;
        }
        return true;
    }
    getVideoDirective() {
        if (this.getDirectives()) {
            return this.getDirective('VideoApp');
        }
        return;
    }
    hasVideoDirective() {
        if (!this.getVideoDirective()) {
            return false;
        }
        return true;
    }
    getSessionData(path) {
        if (path) {
            return this.getSessionAttribute(path);
        }
        else {
            return this.getSessionAttributes();
        }
    }
    // tslint:disable-next-line
    hasSessionData(name, value) {
        return this.hasSessionAttribute(name, value);
    }
    setSessionData(sessionData) {
        return this.setSessionAttributes(sessionData);
    }
    getSessionAttributes() {
        return _get(this, 'sessionAttributes');
    }
    setSessionAttributes(sessionData) {
        _set(this, 'sessionAttributes', sessionData);
        return this;
    }
    getSpeech() {
        if (!_get(this, 'response.outputSpeech.ssml')) {
            return;
        }
        return jovo_core_1.SpeechBuilder.removeSpeakTags(_get(this, 'response.outputSpeech.ssml'));
    }
    getReprompt() {
        if (!_get(this, 'response.reprompt.outputSpeech.ssml')) {
            return;
        }
        return jovo_core_1.SpeechBuilder.removeSpeakTags(_get(this, 'response.reprompt.outputSpeech.ssml'));
    }
    getSpeechPlain() {
        const speech = this.getSpeech();
        if (!speech) {
            return;
        }
        return jovo_core_1.SpeechBuilder.removeSSML(speech);
    }
    getRepromptPlain() {
        const reprompt = this.getReprompt();
        if (!reprompt) {
            return;
        }
        return jovo_core_1.SpeechBuilder.removeSSML(reprompt);
    }
    getSessionAttribute(name) {
        return _get(this, `sessionAttributes.${name}`);
    }
    /**
     *
     * @param {string} name
     * @param {any} value
     * @return {boolean}
     */
    // tslint:disable-next-line
    hasSessionAttribute(name, value) {
        if (!this.getSessionAttribute(name)) {
            return false;
        }
        if (typeof value !== 'undefined') {
            if (this.getSessionAttribute(name) !== value) {
                return false;
            }
        }
        return true;
    }
    hasState(state) {
        return this.hasSessionAttribute(jovo_core_1.SessionConstants.STATE, state);
    }
    hasSessionEnded() {
        return _get(this, 'response.shouldEndSession');
    }
    /**
     * Checks if response object contains a simple card.
     * @param {string} title
     * @param {string} text
     * @return {boolean}
     */
    hasSimpleCard(title, text) {
        const cardObject = this.getCard();
        if (!cardObject) {
            return false;
        }
        if (cardObject.type !== 'Simple') {
            return false;
        }
        if (title) {
            if (title !== cardObject.title) {
                return false;
            }
        }
        if (text) {
            if (text !== cardObject.text) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks if response object contains a standard card.
     * @param {string} title
     * @param {string} text
     * @param {string} smallImageUrl
     * @param {string} largeImageUrl
     * @return {boolean}
     */
    hasStandardCard(title, text, smallImageUrl, largeImageUrl) {
        const cardObject = this.getCard();
        if (!cardObject) {
            return false;
        }
        if (cardObject.type !== 'Standard') {
            return false;
        }
        if (title) {
            if (title !== cardObject.title) {
                return false;
            }
        }
        if (text) {
            if (text !== cardObject.text) {
                return false;
            }
        }
        if (smallImageUrl) {
            if (smallImageUrl !== cardObject.image.smallImageUrl) {
                return false;
            }
        }
        if (largeImageUrl) {
            if (largeImageUrl !== cardObject.image.largeImageUrl) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks if response object contains a LinkAccount card.
     * @return {boolean}
     */
    hasLinkAccountCard() {
        const cardObject = this.getCard();
        if (!cardObject) {
            return false;
        }
        if (cardObject.type !== 'LinkAccount') {
            return false;
        }
        return true;
    }
    /**
     * Checks if response object contains a ask for address card.
     * @return {boolean}
     */
    hasAskForAddressCard() {
        const cardObject = this.getCard();
        if (!cardObject) {
            return false;
        }
        if (cardObject.type !== 'AskForPermissionsConsent') {
            return false;
        }
        if (cardObject.permissions.length === 0) {
            return false;
        }
        if (cardObject.permissions[0] !== 'read::alexa:device:all:address') {
            return false;
        }
        return true;
    }
    /**
     * Checks if response object contains a ask for country and postal code card.
     * @return {boolean}
     */
    hasAskForCountryAndPostalCodeCard() {
        const cardObject = this.getCard();
        if (!cardObject) {
            return false;
        }
        if (cardObject.type !== 'AskForPermissionsConsent') {
            return false;
        }
        if (cardObject.permissions.length === 0) {
            return false;
        }
        if (cardObject.permissions[0] !== 'read::alexa:device:all:address:country_and_postal_code') {
            return false;
        }
        return true;
    }
    /**
     * Checks if response is a tell request
     * @param {string| string[]} speechText
     * @return {boolean}
     */
    isTell(speechText) {
        if (_get(this, 'response.shouldEndSession') === false) {
            return false;
        }
        if (speechText) {
            const ssml = _get(this, 'response.outputSpeech.ssml');
            if (Array.isArray(speechText)) {
                for (const speechTextElement of speechText) {
                    if (jovo_core_1.SpeechBuilder.toSSML(speechTextElement) === ssml) {
                        return true;
                    }
                }
                return false;
            }
            else {
                return ssml === jovo_core_1.SpeechBuilder.toSSML(speechText);
            }
        }
        return true;
    }
    isAsk(speechText, repromptText) {
        if (_get(this, 'response.shouldEndSession') === true) {
            return false;
        }
        if (speechText) {
            const ssml = _get(this, 'response.outputSpeech.ssml');
            if (Array.isArray(speechText)) {
                for (const speechTextElement of speechText) {
                    if (jovo_core_1.SpeechBuilder.toSSML(speechTextElement) === ssml) {
                        return true;
                    }
                }
                return false;
            }
            else {
                if (ssml !== jovo_core_1.SpeechBuilder.toSSML(speechText)) {
                    return false;
                }
            }
        }
        if (repromptText) {
            const ssml = _get(this, 'response.reprompt.outputSpeech.ssml');
            if (Array.isArray(repromptText)) {
                for (const speechTextElement of repromptText) {
                    if (jovo_core_1.SpeechBuilder.toSSML(speechTextElement) === ssml) {
                        return true;
                    }
                }
                return false;
            }
            else {
                if (ssml !== jovo_core_1.SpeechBuilder.toSSML(repromptText)) {
                    return false;
                }
            }
        }
        if (!_get(this, 'response.outputSpeech.ssml') || !_get(this, 'response.outputSpeech.type')) {
            return false;
        }
        if (!_get(this, 'response.reprompt.outputSpeech.ssml') ||
            !_get(this, 'response.reprompt.outputSpeech.type')) {
            return false;
        }
        return true;
    }
    /**
     * Checks if response is a dialog directive response.
     * @param {'Dialog.Delegate' | 'Dialog.ElicitSlot' |'Dialog.ConfirmIntent' | 'Dialog.ConfirmSlot'} type
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogDirective(type, updatedIntent) {
        if (this.response.shouldEndSession === true) {
            return false;
        }
        if (!this.response.directives) {
            return false;
        }
        if (type) {
            // every time first element?
            if (this.response.directives[0].type !== type) {
                return false;
            }
        }
        if (this.response.directives[0].type.substr(0, 6) !== 'Dialog') {
            return false;
        }
        if (updatedIntent) {
            if (JSON.stringify(this.response.directives[0].updatedIntent) === JSON.stringify(updatedIntent)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks if response is a dialog delegate response.
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogDelegate(updatedIntent) {
        return this.isDialogDirective('Dialog.Delegate', updatedIntent);
    }
    /**
     * Checks if response is a dialog elicit slot response.
     * @param {string} slotToElicit
     * @param {string} speechText
     * @param {string} repromptSpeech
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogElicitSlot(slotToElicit, speechText, repromptSpeech, updatedIntent) {
        if (slotToElicit) {
            if (_get(this, 'response.directives[0].slotToElicit') !== slotToElicit) {
                return false;
            }
        }
        if (speechText) {
            if (speechText !== this.getSpeechPlain()) {
                return false;
            }
        }
        if (repromptSpeech) {
            if (repromptSpeech !== this.getRepromptPlain()) {
                return false;
            }
        }
        return this.isDialogDirective('Dialog.ElicitSlot', updatedIntent);
    }
    /**
     * Checks if response is a dialog confirm slot response.
     * @param {string} slotToConfirm
     * @param {string} speechText
     * @param {string} repromptSpeech
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogConfirmSlot(slotToConfirm, speechText, repromptSpeech, updatedIntent) {
        if (slotToConfirm) {
            if (_get(this, 'response.directives[0].slotToConfirm') !== slotToConfirm) {
                return false;
            }
        }
        if (speechText) {
            if (speechText !== this.getSpeechPlain()) {
                return false;
            }
        }
        if (repromptSpeech) {
            if (repromptSpeech !== this.getRepromptPlain()) {
                return false;
            }
        }
        return this.isDialogDirective('Dialog.ConfirmSlot', updatedIntent);
    }
    /**
     * Checks if response is a dialog confirm intent response.
     * @param {string} speechText
     * @param {string} repromptSpeech
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogConfirmIntent(speechText, repromptSpeech, updatedIntent) {
        if (speechText) {
            if (speechText !== this.getSpeechPlain()) {
                return false;
            }
        }
        if (repromptSpeech) {
            if (repromptSpeech !== this.getRepromptPlain()) {
                return false;
            }
        }
        return this.isDialogDirective('Dialog.ConfirmIntent', updatedIntent);
    }
    toJSON() {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }
    // fromJSON is used to convert an serialized version
    // of the User to an instance of the class
    static fromJSON(json) {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, AlexaResponse.reviver);
        }
        else {
            // create an instance of the User class
            const alexaResponse = Object.create(AlexaResponse.prototype);
            // copy all the fields from the json object
            return Object.assign(alexaResponse, json);
        }
    }
    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    // tslint:disable-next-line
    static reviver(key, value) {
        return key === '' ? AlexaResponse.fromJSON(value) : value;
    }
}
exports.AlexaResponse = AlexaResponse;
//# sourceMappingURL=AlexaResponse.js.map