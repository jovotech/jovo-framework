'use strict';

const _ = require('lodash');
const BodyTemplate1Builder = require('./renderTemplate/bodyTemplate1Builder').BodyTemplate1Builder;
const BodyTemplate2Builder = require('./renderTemplate/bodyTemplate2Builder').BodyTemplate2Builder;
const BodyTemplate3Builder = require('./renderTemplate/bodyTemplate3Builder').BodyTemplate3Builder;
const BodyTemplate6Builder = require('./renderTemplate/bodyTemplate6Builder').BodyTemplate6Builder;
const ListTemplate1Builder = require('./renderTemplate/listTemplate1Builder').ListTemplate1Builder;
const ListTemplate2Builder = require('./renderTemplate/listTemplate2Builder').ListTemplate2Builder;
const ListTemplate3Builder = require('./renderTemplate/listTemplate3Builder').ListTemplate3Builder;

/**
 * AlexaResponse Class
 */
class AlexaResponse {
    /**
     * Constructor
     * @param {{}} responseObj
     */
    constructor(responseObj) {
        this.responseObj = {
            version: '1.0',
            response: {
                shouldEndSession: true,
            },
            sessionAttributes: {},
        };

        if (responseObj) {
            this.responseObj = responseObj;
        }
    }


    /**
     *
     * Sets speech output with ShouldEndSession = true
     * Accepts calls without speech parameter
     * @param {string} speech
     * @return {AlexaResponse}
     */
    tell(speech) {
        if (speech && speech.length > 0) {
            this.responseObj.response.outputSpeech = {
                type: 'SSML',
                ssml: toSSML(speech),
            };
        }
        this.responseObj.response.shouldEndSession = true;
        return this;
    }

    /**
     * Creates object with reprompt.
     * Keeps session open
     * @param {string} speech
     * @param {string} repromptSpeech
     * @return {AlexaResponse}
     */
    ask(speech, repromptSpeech) {
        this.responseObj.response.outputSpeech = {
            type: 'SSML',
            ssml: toSSML(speech),
        };

        if (!repromptSpeech) {
            repromptSpeech = speech;
        }

        this.responseObj.response.reprompt = {
            outputSpeech: {
                type: 'SSML',
                ssml: toSSML(repromptSpeech),
            },
        };
        this.responseObj.response.shouldEndSession = false;
        return this;
    }

    /**
     * Creates an audio tag within ssml
     *
     * Max 90 seconds
     * @param {string} audioUrl
     * @return {AlexaResponse}
     */
    play(audioUrl) {
        if (audioUrl.substr(0, 5) !== 'https') {
            throw new Error('Url must be https');
        }
        let speech = '<speak><audio src="'+audioUrl+'"/></speak>';
        return this.tell(speech);
    }

    /**
     * Implementation of generic withSimpleCard
     * Show a simple card to the response object
     * @param {string} title
     * @param {string} content
     * @return {AlexaResponse} this
     */
    addSimpleCard(title, content) {
        this.responseObj.response.card = new CardBuilder()
            .createSimpleCard(title, content)
            .build();
        return this;
    }

    /**
     * Implementation of generic withImageCard
     * Show a standard card with a card to the response object
     * @param {string} title
     * @param {string} text
     * @param {string} smallImageUrl secure image url
     * @param {string} largeImageUrl secure image url
     * @return {AlexaResponse} this
     */
    addStandardCard(title, text, smallImageUrl, largeImageUrl) {
        this.responseObj.response.card = new CardBuilder()
            .createStandardCard(title, text, smallImageUrl, largeImageUrl)
            .build();
        return this;
    }

    /**
     * Creates ask for country and postal code card
     * @return {AlexaResponse}
     */
    addAskForCountryAndPostalCodeCard() {
        this.responseObj.response.card = new CardBuilder()
            .createAskForLocationPermissions('country_and_postal_code')
            .build();
        return this;
    }

    /**
     * Shows ask for list permission card
     * @param {Array} types 'write' or 'read'
     * @return {Jovo}
     */
    addAskForListPermissionCard(types) {
        this.responseObj.response.card = new CardBuilder()
            .createAskForListPermissions(types)
            .build();
        return this;
    }

    /**
     * Creates ask for address card
     * @return {AlexaResponse}
     */
    addAskForAddressCard() {
        this.responseObj.response.card = new CardBuilder()
            .createAskForLocationPermissions('address')
            .build();
        return this;
    }

    /**
     * Creates account link card
     * @return {AlexaResponse}
     */
    addLinkAccountCard() {
        this.responseObj.response.card = new CardBuilder()
            .createLinkAccountCard()
            .build();
        return this;
    }

    /**
     * Responds with a dialog directive.
     * @param {object} directive
     * @param {object} updatedIntent
     */
    dialogDirective(directive, updatedIntent) {
        if (updatedIntent) {
            directive.updatedIntent = updatedIntent;
        }
        this.responseObj = {
            version: '1.0',
            response: {
                shouldEndSession: false,
                directives: [directive],
            },
        };
    }

    /**
     * Creates delegate directive. Alexa handles next dialog
     * step by her(?)self.
     * @param {object} updatedIntent
     * @return {AlexaResponse}
     */
    dialogDelegate(updatedIntent) {
        this.dialogDirective({type: 'Dialog.Delegate'}, updatedIntent);
        return this;
    }

    /**
     * Let alexa ask user for the value of a specific slot
     * @param {string} slotToElicit name of the slot
     * @param {string} speechText
     * @param {string} repromptSpeech
     * @param {object} updatedIntent
     * @return {AlexaResponse}
     */
    dialogElicitSlot(slotToElicit, speechText, repromptSpeech, updatedIntent) {
        this.dialogDirective({
            type: 'Dialog.ElicitSlot',
            slotToElicit: slotToElicit,
        }, updatedIntent);

        this.setOutputSpeech(speechText);
        if (repromptSpeech) {
            this.setRepromptOutputSpeech(repromptSpeech);
        } else {
            this.setRepromptOutputSpeech(speechText);
        }
        return this;
    }

    /**
     * Let alexa ask user to confirm slot with yes or no
     * @param {string} slotToConfirm name of the slot
     * @param {string} speechText
     * @param {string} repromptSpeech
     * @param {object} updatedIntent
     * @return {AlexaResponse}
     */
    dialogConfirmSlot(slotToConfirm, speechText, repromptSpeech, updatedIntent) {
        // set directive
        this.dialogDirective({
            type: 'Dialog.ConfirmSlot',
            slotToConfirm: slotToConfirm,
        }, updatedIntent);

        this.setOutputSpeech(speechText);
        if (repromptSpeech) {
            this.setRepromptOutputSpeech(repromptSpeech);
        } else {
            this.setRepromptOutputSpeech(speechText);
        }
        return this;
    }
    /**
     * Let alexa ask user to confirm intent with yes or no
     * @param {string} speechText
     * @param {string} repromptSpeech
     * @param {object} updatedIntent
     * @return {AlexaResponse}
     */
    dialogConfirmIntent(speechText, repromptSpeech, updatedIntent) {
        // set directive
        this.dialogDirective({
            type: 'Dialog.ConfirmIntent',
        }, updatedIntent);

        this.setOutputSpeech(speechText);
        if (repromptSpeech) {
            this.setRepromptOutputSpeech(repromptSpeech);
        } else {
            this.setRepromptOutputSpeech(speechText);
        }
        return this;
    }
    /**
     * Adds Display.RenderTemplate directive to response object
     * @param {*} template
     * @return {AlexaResponse}
     */
    addDisplayRenderTemplateDirective(template) {
        let directive = {
            type: 'Display.RenderTemplate',
            template: template,
        };

        if (!_.get(this.responseObj, 'response.directives')) {
            this.responseObj.response.directives = [];
        }
        this.responseObj.response.directives.push(directive);
        return this;
    }

    /**
     * Adds Hint directive to response object
     * @param {string} text
     * @return {AlexaResponse}
     */
    addHintDirective(text) {
        let directive = {
            type: 'Hint',
            hint: {
                type: 'PlainText',
                text: text,
            },
        };

        if (!_.get(this.responseObj, 'response.directives')) {
            this.responseObj.response.directives = [];
        }
        this.responseObj.response.directives.push(directive);
        return this;
    }

    /**
     * Adds VideoApp.Launch directive to response object
     * @param {string} url
     * @param {string} title
     * @param {string} subtitle
     */
    addVideoDirective(url, title, subtitle) {
        if (url.substr(0, 5) !== 'https') {
            throw new Error('Url must be https');
        }
        let directive = {
            type: 'VideoApp.Launch',
            videoItem: {
                source: url,
            },
        };

        if (title) {
            let metaData = {
                title: title,
            };

            if (subtitle) {
                metaData.subtitle = subtitle;
            }
            directive.videoItem.metadata = metaData;
        }

        if (!_.get(this.responseObj, 'response.directives')) {
            this.responseObj.response.directives = [];
        }
        this.responseObj.response.directives.push(directive);
    }

    /**
     * Audio player directive. Ends session
     * @param {*} directive
     */
    audioPlayerDirective(directive) {
        this.responseObj = {
            version: '1.0',
            response: {
                shouldEndSession: true,
                directives: [directive],
            },
        };
    }

    /**
     * 'Play' directive
     * @param {'REPLACE_ALL'|'ENQUEUE'|'REPLACE_ENQUEUED'} playBehavior
     * @param {*} audioItem
     * @return {AlexaResponse}
     */
    audioPlayerPlay(playBehavior, audioItem) {
        let validPlayBahaviorTypes = ['REPLACE_ALL', 'ENQUEUE', 'REPLACE_ENQUEUED'];
        if (validPlayBahaviorTypes.indexOf(playBehavior) === -1) {
            throw new Error('Invalid play behaviour type');
        }

        let directive = {
            type: 'AudioPlayer.Play',
            playBehavior: playBehavior,
            audioItem: audioItem,
        };
        this.audioPlayerDirective(directive);
        return this;
    }

    /**
     * 'ClearQueue' directive
     * @param {'CLEAR_ALL'|'CLEAR_QUEUE'} clearBehavior
     * @return {AlexaResponse}
     */
    audioPlayerClearQueue(clearBehavior) {
        let directive = {
            type: 'AudioPlayer.ClearQueue',
            clearBehavior: clearBehavior,
        };
        this.audioPlayerDirective(directive);
        return this;
    }

    /**
     * 'Stop' directive
     * @return {AlexaResponse}
     */
    audioPlayerStop() {
        let directive = {
            type: 'AudioPlayer.Stop',
        };
        this.audioPlayerDirective(directive);
        return this;
    }
    /**
     * Sets output speech
     * @param {string} speechText
     */
    setOutputSpeech(speechText) {
        this.responseObj.response.outputSpeech = {
            type: 'SSML',
            ssml: toSSML(speechText),
        };
    }

    /**
     * sets reprompt output speech
     * @param {string} repromptSpeechText
     */
    setRepromptOutputSpeech(repromptSpeechText) {
        if (!this.responseObj.response.reprompt) {
            this.responseObj.response.reprompt = {};
        }
        this.responseObj.response.reprompt.outputSpeech = {
            type: 'SSML',
            ssml: toSSML(repromptSpeechText),
        };
    }

    /**
     * Sets shouldEndSession
     * @param {boolean} endSession
     * @return {AlexaResponse}
     */
    shouldEndSession(endSession) {
        this.responseObj.response.shouldEndSession = endSession;
        return this;
    }

    /**
     * Deletes shouldEndSession from response object.
     */
    deleteShouldEndSession() {
        delete this.responseObj.response.shouldEndSession;
    }

    /**
     * Sets session attribute with value
     * @param {string} name
     * @param {*} value
     */
    setSessionAttribute(name, value) {
        _.set(this, `responseObj.sessionAttributes.${name}`, value);
    }

    /**
     * Sets session attributes
     * @param {{}} sessionAttributes
     */
    setSessionAttributes(sessionAttributes) {
        if (sessionAttributes) {
            this.responseObj.sessionAttributes = sessionAttributes;
        }
    }
    /* GETTER **/

    /**
     * Returns directives Array of response object.
     * @return {Array}
     */
    getDirectives() {
        return this.responseObj.response.directives;
    }

    /**
     * Returns session attribute value
     * @param {string} name
     * @return {*}
     */
    getSessionAttribute(name) {
        return _.get(this, `responseObj.sessionAttributes.${name}`);
    }

    /**
     * Returns all session attributes from the response
     * object
     * @return {*}
     */
    getSessionAttributes() {
        return this.responseObj.sessionAttributes;
    }

    /**
     * Returns response object
     * @return {object}
     */
    getResponseObject() {
        return this.responseObj;
    }

    /**
     * Returns speech text without <speak> tags
     * @return {XML|string}
     */
    getSpeechText() {
        return removeSpeakTags(_.get(this, 'responseObj.response.outputSpeech.ssml'));
    }

    /**
     * Returns reprompt speech text without <speak> tags
     * @return {XML|string}
     */
    getRepromptText() {
        return removeSpeakTags(_.get(this, 'responseObj.response.reprompt.outputSpeech.ssml'));
    }

    /**
     * Checks if response is a tell request
     * @param {string} speechText
     * @return {boolean}
     */
    isTell(speechText) {
        if (this.responseObj.response.shouldEndSession === false) {
            return false;
        }
        if (speechText) {
            let ssml = this.responseObj.response.outputSpeech.ssml;

            if (ssml !== toSSML(speechText)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if response is an ask response.
     * @param {string} speechText
     * @param {string} repromptText
     * @return {boolean}
     */
    isAsk(speechText, repromptText) {
        if (this.responseObj.response.shouldEndSession === true) {
            return false;
        }
        if (speechText) {
            let ssml = this.responseObj.response.outputSpeech.ssml;
            if (ssml !== toSSML(speechText)) {
                return false;
            }
        }

        if (repromptText) {
            let ssml = this.responseObj.response.reprompt.outputSpeech.ssml;

            if (ssml !== toSSML(repromptText)) {
                return false;
            }
        }
        if (!_.get(this, 'responseObj.response.outputSpeech.ssml') ||
                !_.get(this, 'responseObj.response.outputSpeech.type')) {
            return false;
        }
        if (!_.get(this, 'responseObj.response.reprompt.outputSpeech.ssml') ||
            !_.get(this, 'responseObj.response.reprompt.outputSpeech.type')) {
            return false;
        }

        return true;
    }

    /**
     * Checks if response is a play response.
     * @param {string} audioUrl
     * @return {boolean}
     */
    isPlay(audioUrl) {
        return this.isTell('<audio src="'+audioUrl+'"/>');
    }

    /**
     * Checks if response is an empty response.
     * @return {boolean}
     */
    isEmptyResponse() {
        if (this.responseObj.response.shouldEndSession === false) {
            return false;
        }
        if (this.responseObj.response.outputSpeech) {
            return false;
        }

        if (Object.keys(this.responseObj).length !== 3) {
            return false;
        }
        return true;
    }

    /**
     * Checks if response object contains a simple card.
     * @param {string} title
     * @param {string} content
     * @return {boolean}
     */
    hasSimpleCard(title, content) {
        if (!this.responseObj.response.card) {
            return false;
        }

        if (this.responseObj.response.card.type !== 'Simple') {
            return false;
        }

        if (title) {
            if (title !== this.responseObj.response.card.title) {
                return false;
            }
        }
        if (content) {
            if (content !== this.responseObj.response.card.content) {
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
        if (!this.responseObj.response.card) {
            return false;
        }

        if (this.responseObj.response.card.type !== 'Standard') {
            return false;
        }

        if (title) {
            if (title !== this.responseObj.response.card.title) {
                return false;
            }
        }
        if (text) {
            if (text !== this.responseObj.response.card.text) {
                return false;
            }
        }
        if (smallImageUrl) {
            if (smallImageUrl !==
                this.responseObj.response.card.image.smallImageUrl) {
                return false;
            }
        }
        if (largeImageUrl) {
            if (largeImageUrl !==
                this.responseObj.response.card.image.largeImageUrl) {
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
        if (!this.responseObj.response.card) {
            return false;
        }

        if (this.responseObj.response.card.type !== 'LinkAccount') {
            return false;
        }

        return true;
    }

    /**
     * Checks if response object contains a ask for address card.
     * @return {boolean}
     */
    hasAskForAddressCard() {
        if (!this.responseObj.response.card) {
            return false;
        }
        if (this.responseObj.response.card.type !== 'AskForPermissionsConsent') {
            return false;
        }

        let permissions = this.responseObj.response.card.permissions;
        if (permissions.length === 0) {
            return false;
        }
        if (permissions[0] !== 'read::alexa:device:all:address') {
            return false;
        }
        return true;
    }

    /**
     * Checks if response object contains a ask for country and postal code card.
     * @return {boolean}
     */
    hasAskForCountryAndPostalCodeCard() {
        if (!this.responseObj.response.card) {
            return false;
        }
        if (this.responseObj.response.card.type !== 'AskForPermissionsConsent') {
            return false;
        }

        let permissions = this.responseObj.response.card.permissions;
        if (permissions.length === 0) {
            return false;
        }

        if (permissions[0] !== 'read::alexa:device:all:address:country_and_postal_code') {
            return false;
        }
        return true;
    }

    /**
     * Checks if response object contains a ask for country and postal code card.
     * @param {array} types (read, write)
     * @return {boolean}
     */
    hasAskForListPermissionCard(types) {
        if (!this.responseObj.response.card) {
            return false;
        }
        if (this.responseObj.response.card.type !== 'AskForPermissionsConsent') {
            return false;
        }

        let permissions = this.responseObj.response.card.permissions;
        if (permissions.length === 0) {
            return false;
        }

        if (permissions[0].substr(-4, 4) !== 'list') {
            return false;
        }

        if (types && types.length === 1) {
            if (types[0] === 'read' && permissions[0] !== 'read::alexa:household:list') {
                return false;
            }
            if (types[0] === 'write' && permissions[0] !== 'write::alexa:household:list') {
                return false;
            }
        }

        if (types && types.length === 2) {
            if (permissions.indexOf('read::alexa:household:list') === -1 &&
                permissions.indexOf('write::alexa:household:list') === -1) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checks if response is a dialog directive response.
     * @param {string} type
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogDirective(type, updatedIntent) {
        if (this.responseObj.response.shouldEndSession === true) {
            return false;
        }
        if (!this.responseObj.response.directives) {
            return false;
        }

        if (type) { // every time first element?
            if (this.responseObj.response.directives[0].type !== type) {
                return false;
            }
        }
        if (this.responseObj.response.directives[0].type.substr(0, 6) !== 'Dialog') {
            return false;
        }

        if (updatedIntent) {
            // TODO:better object comparison https://stackoverflow.com/a/6713782
            if (JSON.stringify(this.getDirectives()[0].updatedIntent) ===
                JSON.stringify(updatedIntent)) {
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
            if (_.get(this, 'responseObj.response.directives[0].slotToElicit') !== slotToElicit) {
                return false;
            }
        }
        if (speechText) {
            if (speechText !== this.getSpeechText()) {
                return false;
            }
        }
        if (repromptSpeech) {
            if (repromptSpeech !== this.getRepromptText()) {
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
            if (_.get(this, 'responseObj.response.directives[0].slotToConfirm') !== slotToConfirm) {
                return false;
            }
        }
        if (speechText) {
            if (speechText !== this.getSpeechText()) {
                return false;
            }
        }
        if (repromptSpeech) {
            if (repromptSpeech !== this.getRepromptText()) {
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
            if (speechText !== this.getSpeechText()) {
                return false;
            }
        }
        if (repromptSpeech) {
            if (repromptSpeech !== this.getRepromptText()) {
                return false;
            }
        }
        return this.isDialogDirective('Dialog.ConfirmIntent', updatedIntent);
    }


    /**
     * Checks if given session is in the response object.
     * @param {string} name
     * @param {string} value
     * @return {boolean}
     */
    hasSessionAttribute(name, value) {
        if (!this.getSessionAttribute(name)) {
            return false;
        }

        if (value) {
            if (this.getSessionAttribute(name) !== value) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if response has state
     * @param {string} state
     * @return {boolean}
     */
    hasState(state) {
        return this.hasSessionAttribute('STATE', state);
    }


    /**
     * Checks if given string contains in speech text.
     * @param {string|array} str
     * @return {boolean}
     */
    speechTextContains(str) {
        if (typeof str === 'undefined') {
            return false;
        }
        let speechText = this.getSpeechText();
        if (str instanceof Array) {
           let findings = str.filter(function(s) {
               return speechText.indexOf(s) > -1;
           });
           return findings.length > 0;
        }

        return speechText.indexOf(str) > -1;
    }
}

/**
 * Cardbuilder class
 */
class CardBuilder {

    /**
     * Constructor
     */
    constructor() {
        this.card = {};
    }

    /**
     * Creates simple card
     * @param {string} title
     * @param {string} content
     * @return {CardBuilder}
     */
    createSimpleCard(title, content) {
        this.card = {
            type: 'Simple',
            title: title,
            content: content,
        };

        return this;
    }

    /**
     * Creates standard card
     * @param {string} title
     * @param {string} text
     * @param {string} smallImageUrl
     * @param {string} largeImageUrl
     * @return {CardBuilder}
     */
    createStandardCard(title, text, smallImageUrl, largeImageUrl) {
        if (smallImageUrl.substr(0, 5) !== 'https' ||
            largeImageUrl.substr(0, 5) !== 'https') {
            throw new Error('Url must be https');
        }
        this.card = {
            type: 'Standard',
            title: title,
            text: text,
            image: {
                smallImageUrl: smallImageUrl,
                largeImageUrl: largeImageUrl,
            },
        };

        return this;
    }

    /**
     * Creates accountlinking card
     * @return {CardBuilder}
     */
    createLinkAccountCard() {
        this.card = {
            type: 'LinkAccount',
        };

        return this;
    }

    /**
     * Creates ask for permissions card
     * Valid permissions:
     * read::alexa:household:list
     * write::alexa:household:list
     * read::alexa:device:all:address
     * read::alexa:device:all:address:country_and_postal_code
     * @param {Array} permissions
     * @return {CardBuilder} Cardbuilder
     */
    createAskFromPermissionConsent(permissions) {
        this.card = {
            type: 'AskForPermissionsConsent',
            permissions: permissions,
        };
        return this;
    }


    /**
     * Creates ask for list permissions card
     * @param {Array} types 'read', 'write'
     * @return {CardBuilder}
     */
    createAskForListPermissions(types) {
        let permissions = [];
        for (let obj of types) {
            if (obj !== 'read' && obj !== 'write') {
                throw new Error('Invalid permission type');
            }
            permissions.push(obj+'::alexa:household:list');
        }
        return this.createAskFromPermissionConsent(
            permissions
        );
    }

    /**
     * Creates ask for location permission cards
     * @param {'address'|'country_and_postal_code'} type
     * @return {CardBuilder}
     */
    createAskForLocationPermissions(type) {
        if (type !== 'address' && type !== 'country_and_postal_code') {
            throw new Error('Invalid permission type');
        }
        let permission = type === 'address' ?
            'address' : 'address:country_and_postal_code';
        return this.createAskFromPermissionConsent(
            ['read::alexa:device:all:'+permission]
        );
    }

    /**
     * Returns card object
     * @return {object}
     */
    build() {
        return this.card;
    }

}


/**
 * TODO make remove ssml
 * @param {string} text
 * @return {XML|string}
 */
function removeSpeakTags(text) {
    return text.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
}

/**
 * Surrounds text with <speak> tags
 * @param {string} text
 * @return {string|*}
 */
function toSSML(text) {
    text = text.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
    text = '<speak>' + text + '</speak>';
    return text;
}

module.exports.AlexaResponse = AlexaResponse;
module.exports.AlexaResponse.BodyTemplate1Builder = BodyTemplate1Builder;
module.exports.AlexaResponse.BodyTemplate2Builder = BodyTemplate2Builder;
module.exports.AlexaResponse.BodyTemplate3Builder = BodyTemplate3Builder;
module.exports.AlexaResponse.BodyTemplate6Builder = BodyTemplate6Builder;
module.exports.AlexaResponse.ListTemplate1Builder = ListTemplate1Builder;
module.exports.AlexaResponse.ListTemplate2Builder = ListTemplate2Builder;
module.exports.AlexaResponse.ListTemplate3Builder = ListTemplate3Builder;
