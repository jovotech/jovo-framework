'use strict';

const _ = require('lodash');

const jovo = require('../../jovo');
const AlexaResponse = require('./alexaResponse').AlexaResponse;
const RequestParser = require('./request/util/requestParser').RequestParser;
const CardBuilder = AlexaResponse.CardBuilder;
const AudioPlayer = require('./audioPlayer').AudioPlayer;
const Platform = require('./../plaform').Platform;
const request = require('request');
const AlexaSpeechBuilder = require('./alexaSpeechBuilder').AlexaSpeechBuilder;
const SpeechBuilder = require('./../speechBuilder').SpeechBuilder;

const AlexaUser = require('./alexaUser').AlexaUser;

const BUILTIN_INTENTS = Object.freeze({
    StopIntent: 'AMAZON.StopIntent',
});

const AlexaNLU = require('./alexaNLU').AlexaNLU;
/**
 * Alexa specific implementations
 * @class
 * @implements {Platform}
 */
class AlexaSkill extends Platform {

    /**
     * Constructor
     * @param {Jovo} jovo
     * @param {object} request
     */
    constructor(jovo, request) {
        super();
        this.jovo = jovo;
        this.request = RequestParser.createRequest(request);
        this.response = new AlexaResponse();

        if (!this.nlu) {
            this.nlu = new AlexaNLU(this.request);
        }
        if (_.get(this, 'request.session')) {
            this.response.setSessionAttributes(this.request.getSessionAttributes());
        }
    }
    /** **
     * NLU public functions
     */

    /**
     * Returns intent name
     * @public
     * @return {string}
     */
    getIntentName() {
        return this.nlu.getIntentName();
    }

    /**
     * Returns intent parameters filled by the user.
     * "My name is {John Doe} and I live in {New York}"
     * Returns object with name => value objects
     * {
     *   name : "John Doe",
     *   city : "New York"
     * }
     * @public
     * @return {*}
     */
    getInputs() {
        return this.nlu.getInputs();
    }

    /**
     * Get input object by name
     * @public
     * @param {string} name
     * @return {string}
     */
    getInput(name) {
        return this.getInputs()[name];
    }
    /**
     * Platform public functions
     */

    /**
     * DOES NOT WORK. WORK IN PROGRESS
     * @private
     * @param {*} nlu
     * @param {func} callback
     */
    nluExec(nlu, callback) {
        this.nlu = nlu;
        this.nlu.execute(this.getRawText(), callback);
    }
    /**
     * Returns unique user id sent by the platforms.
     * @public
     * @return {string} UserId
     */
    getUserId() {
        return this.request.getUserId();
    }

    /**
     * Returns platform's locale
     * @public
     * @return {string}
     */
    getLocale() {
        return this.request.getLocale();
    }

    /**
     * Returns access token
     * @public
     * @return {*}
     */
    getAccessToken() {
        return this.request.getAccessToken();
    }

    /**
     * isNewSession
     * @public
     * @return {boolean}
     */
    isNewSession() {
        try {
            return this.request.isNewSession();
        } catch (err) {
            return false;
        }
    }

    /**
     * Returns platform's timestamp
     * @public
     * @return {string}
     */
    getTimestamp() {
        return this.request.getTimestamp();
    }

    /**
     * Returns audio capibility of device
     * @public
     * @return {boolean}
     */
    hasAudioInterface() {
        return this.request.hasAudioInterface();
    }

    /**
     * Returns screen capibility of device
     * @public
     * @return {boolean}
     */
    hasScreenInterface() {
        return this.request.hasScreenInterface();
    }

    /**
     * Returns video capibility of device
     * @public
     * @return {boolean}
     */
    hasVideoInterface() {
        return this.request.hasVideoInterface();
    }

    /**
     * Returns device id
     * @public
     * @return {string} device id
     */
    getDeviceId() {
        return this.request.getDeviceId();
    }

    /**
     * Returns application ID (Skill ID) of the request
     * @public
     * @return {String} applicationId
     */
    getApplicationId() {
        return this.request.getApplicationId();
    }

    /**
     * Returns raw text.
     * Only available with catchAll slots
     * @return {String} rawText
     */
    getRawText() {
        if (!this.getInputs()['catchAll']) {
            throw new Error('Only available with catchAll slot');
        }
        return this.getInputs()['catchAll'];
    }


    /**
     * Returns token of the request
     * (Touched/Selected Element on Echo Show)
     * @public
     * @return {*}
     */
    getSelectedElementId() {
        return this.request.getRequestToken();
    }

    /**
     * Returns request object
     * @public
     * @return {*}
     */
    getRequest() {
        return this.request;
    }

    /**
     * Returns type of platform
     * @public
     * @return {string}
     */
    getType() {
        return jovo.PLATFORM_ENUM.ALEXA_SKILL;
    }

    /**
     * Returns session attribute value
     * from the response(!) object
     * @public
     * @param {string} name
     * @return {*}
     */
    getSessionAttribute(name) {
        return this.response.getSessionAttribute(name);
    }

    /**
     * Returns all session attributes
     * from the response(!) object.
     * @public
     * @return {*}
     */
    getSessionAttributes() {
        return this.response.getSessionAttributes();
    }

    /**
     * Returns state value stored in the request session
     * @public
     * @return {*}
     */
    getState() {
        if (this.response.getSessionAttribute('STATE')) {
            return this.response.getSessionAttribute('STATE');
        }
        try {
            if (this.request.getSessionAttribute('STATE')) {
                return this.request.getSessionAttribute('STATE');
            }
        } catch (err) {
        }
    }

    /**
     * Stores state in response object session
     * @public
     * @param {string} state
     */
    setState(state) {
        this.response.setSessionAttribute('STATE', state);
    }

    /**
     * Sets session attributes
     * @public
     * @param {object} attributes
     * @param {*} value
     */
    setSessionAttributes(attributes) {
        this.response.setSessionAttributes(attributes);
    }

    /**
     * Sets session attribute with value
     * @public
     * @param {string} name
     * @param {*} value
     */
    setSessionAttribute(name, value) {
        this.response.setSessionAttribute(name, value);
    }

    /**
     * Sets speech output with ShouldEndSession = true
     *
     * @public
     * @param {string} speech
     */
    tell(speech) {
        if (typeof speech === 'undefined' || speech.length === 0) {
            throw new Error('speech must not be empty');
        }

        if (speech instanceof SpeechBuilder) {
            speech = speech.build();
        }
        this.response.tell(SpeechBuilder.toSSML(speech));
        this.jovo.emit('respond', this.jovo);
    }


    /**
     * Creates an audio tag within ssml
     *
     * Max 90 seconds
     * @public
     * @param {string} audioUrl
     */
    play(audioUrl) {
        this.response.play(audioUrl);
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Creates object with reprompt.
     * Keeps session open
     * @public
     * @param {string} speech
     * @param {string} repromptSpeech
     */
    ask(speech, repromptSpeech) {
        if (typeof speech === 'undefined' || speech.length === 0) {
            throw new Error('speech must not be empty');
        }
        if (_.isArray(repromptSpeech) && repromptSpeech.length > 0) {
            repromptSpeech = repromptSpeech[0];
        }

        if (speech instanceof SpeechBuilder) {
            speech = speech.build();
        }

        if (!repromptSpeech) {
            repromptSpeech = speech;
        }

        if (repromptSpeech instanceof SpeechBuilder) {
            repromptSpeech = repromptSpeech.build();
        }

        this.response.ask(SpeechBuilder.toSSML(speech),
            SpeechBuilder.toSSML(repromptSpeech));
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Returns speech text
     * @public
     * @return {string}
     */
    getSpeechText() {
        return this.response.getSpeechText();
    }

    /**
     * Ends session without saying anything
     * @public
     */
    endSession() {
        this.jovo.respond();
    }

    /**
     * Creates alexa user instance
     * @param {*} config
     * @return {AlexaUser}
     */
    makeUser(config) {
        return new AlexaUser(this, config);
    }

    /**
     * Returns alexa specific speechbuilder
     * @public
     * @return {AlexaSpeechBuilder}
     */
    getSpeechBuilder() {
        return new AlexaSpeechBuilder(this.jovo);
    }

    /**
     * Returns AlexaResponse object.
     * @public
     * @return {AlexaRequest|GoogleActionRequest}
     */
    getResponse() {
        return this.response;
    }

    /**
     * Returns response object
     * @public
     * @return {object}
     */
    getResponseObject() {
        return this.response.getResponseObject();
    }

    /**
     * Sets "raw" response object
     * @public
     * @param {object} responseObj
     */
    setResponseObject(responseObj) {
        this.response.responseObj = responseObj;
        this.jovo.respond();
    }

    /**
     * Alexa public functions
     */

    /**
     * Returns supported interfaces from device.
     * @public
     * @return {string} supportedInterfaces
     */
    getSupportedInterfaces() {
        return this.request.getSupportedInterfaces();
    }

    /**
     * Returns if audio player is supported
     * @return {boolean}
     */
    hasAudioPlayerInterface() {
        return this.request.hasAudioPlayerInterface();
    }

    /**
     * Returns consent token
     * @public
     * @return {string} constent token
     */
    getConsentToken() {
        return this.request.getConsentToken();
    }

    /**
     * Returns platform's api endpoint
     * @public
     * @return {string}
     */
    getApiEndpoint() {
        return this.request.getApiEndpoint();
    }
    /**
     * Returns alexa request session object
     * @public
     * @return {*}
     */
    getSession() {
        return this.request.getSession();
    }

    /**
     * Returns Intent Confirmation status
     * @public
     * @return {String}
     */
    getIntentConfirmationStatus() {
        return this.request.getIntentConfirmationStatus();
    }

    /**
     * Returns state of dialog
     * @public
     * @return {jovo.DIALOGSTATE_ENUM}
     */
    getDialogState() {
        try {
            return this.request.getDialogState();
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Returns true if dialog is in state COMPLETED
     * @public
     * @return {boolean}
     */
    isDialogCompleted() {
        return this.getDialogState() === 'COMPLETED';
    }

    /**
     * Returns true if dialog is in state IN_PROGRESS
     * @public
     * @return {boolean}
     */
    isDialogInProgress() {
        return this.getDialogState() === 'IN_PROGRESS';
    }

    /**
     * Returns true if dialog is in state STARTED
     * @public
     * @return {boolean}
     */
    isDialogStarted() {
        return this.getDialogState() === 'STARTED';
    }

    /**
     * Returns if slot is confirmed
     * @public
     * @param {string} slotName
     * @return {boolean}
     */
    isSlotConfirmed(slotName) {
        if (!slotName) {
            throw new Error('slotName is required');
        }
        return this.request.getSlotConfirmationStatus(slotName) === 'CONFIRMED';
    }

    /**
     * Returns slot confirmation status
     * @public
     * @param {string} slotName
     * @return {*}
     */
    getSlotConfirmationStatus(slotName) {
        return this.request.getSlotConfirmationStatus(slotName);
    }

    /**
     * Checks if slot has value
     * @public
     * @param {string} slotName
     * @return {boolean}
     */
    hasSlotValue(slotName) {
        if (typeof this.request.getSlot === 'undefined') {
            return false;
        }
        return typeof this.request.getSlot(slotName).value !== 'undefined';
    }

    /**
     * Returns slot data
     * @param {string} slotName
     * @return {*}
     */
    getSlot(slotName) {
        return this.request.getSlot(slotName);
    }

    /**
     * Creates delegate directive. Alexa handles next dialog
     * step by her(?)self.
     * @public
     * @param {object} updatedIntent
     */
    dialogDelegate(updatedIntent) {
        this.response.dialogDelegate(updatedIntent);
        this.jovo.respond();
    }

    /**
     * Let alexa ask user for the value of a specific slot
     * @public
     * @param {string} slotToElicit name of the slot
     * @param {string} speechText
     * @param {string} repromptText
     * @param {object} updatedIntent
     */
    dialogElicitSlot(slotToElicit, speechText, repromptText, updatedIntent) {
        this.response.dialogElicitSlot(slotToElicit, speechText, repromptText, updatedIntent);
        this.jovo.respond();
    }

    /**
     * Let alexa ask user to confirm slot with yes or no
     * @public
     * @param {string} slotToConfirm name of the slot
     * @param {string} speechText
     * @param {string} repromptText
     * @param {object} updatedIntent
     */
    dialogConfirmSlot(slotToConfirm, speechText, repromptText, updatedIntent) {
        this.response.dialogConfirmSlot(slotToConfirm, speechText, repromptText, updatedIntent);
        this.jovo.respond();
    }

    /**
     * Asks for intent confirmation
     * @public
     * @param {string} speechText
     * @param {string} repromtText
     * @param {object} updatedIntent
     */
    dialogConfirmIntent(speechText, repromtText, updatedIntent) {
        this.response.dialogConfirmIntent(speechText, repromtText, updatedIntent);
        this.jovo.respond();
    }


    /**
     * Adds card to response object
     * @public
     * @param {Card} card
     */
    showCard(card) {
        this.response.addCard(card);
    }
    /**
     * Implementation of generic withSimpleCard
     * Show a simple card to the response object
     * @public
     * @param {string} title
     * @param {string} content
     * @return {AlexaSkill} this
     */
    showSimpleCard(title, content) {
        this.response.addSimpleCard(title, content);
        return this;
    }

    /**
     * Implementation of generic withImageCard
     * Show a standard card with a card to the response object
     * @public
     * @param {string} title
     * @param {string} content
     * @param {string} imageObject object with secured image url
     * @return {AlexaSkill} this
     */
    showImageCard(title, content, imageObject) {
        return this.showStandardCard(title, content, imageObject);
    }

    /**
     * Implementation of standard card
     * Show a standard card with a card to the response object
     * @public
     * @param {string} title
     * @param {string} content
     * @param {string} imageObject object with secured image url
     * @return {AlexaSkill} this
     */
    showStandardCard(title, content, imageObject) {
        const smallImageUrl = _.isString(imageObject) ? imageObject : imageObject.smallImageUrl;
        const largeImageUrl = _.isString(imageObject) ? imageObject : imageObject.largeImageUrl;

        this.response.addStandardCard(title, content, smallImageUrl, largeImageUrl);
        return this;
    }

    /**
     * Shows ask for country and postal code card
     * @public
     * @return {Jovo}
     */
    showAskForCountryAndPostalCodeCard() {
        this.response.addAskForCountryAndPostalCodeCard();
        return this;
    }

    /**
     * Shows ask for address card
     * @public
     * @return {Jovo}
     */
    showAskForAddressCard() {
        this.response.addAskForAddressCard();
        return this;
    }

    /**
     * Shows ask for list permission card
     * @public
     * @param {Array} types 'write' or 'read'
     * @return {Jovo}
     */
    showAskForListPermissionCard(types) {
        this.response.addAskForListPermissionCard(types);
        return this;
    }

    /**
     * Implementation of generic withAccountLinkingCard
     * Show an account linking card to the response object
     * @public
     * @return {AlexaSkill} this
     */
    showAccountLinkingCard() {
        this.response.addLinkAccountCard();
        return this;
    }

    /**
     * Shows template on Echo Show
     * @public
     * @param {*} template
     * @return {AlexaSkill}
     */
    showDisplayTemplate(template) {
        if (this.request.hasDisplayInterface()) {
            this.response.addDisplayRenderTemplateDirective(template);
        }
        return this;
    }


    /**
     * Shows hint on Echo Show
     * @public
     * @param {*} text
     * @return {AlexaSkill}
     */
    showDisplayHint(text) {
        if (this.request.hasDisplayInterface()) {
            this.response.addHintDirective(text);
        }
        return this;
    }

    /**
     * Shows video on Echo Show
     * @public
     * @param {string} url
     * @param {string} title
     * @param {string} subtitle
     */
    showVideo(url, title, subtitle) {
        if (this.request.hasVideoInterface()) {
            this.response.addVideoDirective(url, title, subtitle);
            this.response.deleteShouldEndSession();
        }
        this.jovo.respond();
    }
    /**
     * Returns reason code for an end of a session
     *
     * STOP_INTENT = User says 'Stop'
     * MAX_PROMPTS_EXCEEDED = No user input on reprompt
     * ERROR
     *
     * @public
     * @return {*}
     */
    getEndReason() {
        if (this.getRequestType() === jovo.REQUEST_TYPE_ENUM.END) {
            return this.request.getReason();
        }

        if (this.getRequestType() === jovo.REQUEST_TYPE_ENUM.INTENT &&
            this.getIntentName() === BUILTIN_INTENTS.StopIntent) {
            return 'STOP_INTENT';
        }
    }

    /**
     * Returns template builder by type
     * @public
     * @param {string} type
     * @return {*}
     */
    templateBuilder(type) {
        if (type === 'BodyTemplate1') {
            return new AlexaResponse.BodyTemplate1();
        }
        if (type === 'BodyTemplate2') {
            return new AlexaResponse.BodyTemplate2();
        }
        if (type === 'BodyTemplate3') {
            return new AlexaResponse.BodyTemplate3();
        }
        if (type === 'BodyTemplate6') {
            return new AlexaResponse.BodyTemplate6();
        }
        if (type === 'ListTemplate1') {
            return new AlexaResponse.ListTemplate1();
        }
        if (type === 'ListTemplate2') {
            return new AlexaResponse.ListTemplate2();
        }
        if (type === 'ListTemplate3') {
            return new AlexaResponse.ListTemplate3();
        }
    }


    /**
     * Returns AlexaSkill CardBuilder instance
     * @public
     * @return {CardBuilder}
     */
    getCardBuilder() {
        return new CardBuilder();
    }


    /**
     * Returns Alexa audio player instance
     * @public
     * @return {AudioPlayer}
     */
    audioPlayer() {
        return new AudioPlayer(this.jovo);
    }
    /** *****************************************************
     *
     * JOVO wrapper functions
     *
     ************************************/

    /**
     * Returns request type
     * LaunchRequest, IntentRequest, OnElementSelected SessionEndedRequest
     * @return {string}
     */
    getRequestType() {
        if (this.request.getType().substring(0, 11) === 'AudioPlayer') {
            return 'AUDIOPLAYER';
        }

        if (this.request.getType() === 'LaunchRequest') {
            return jovo.REQUEST_TYPE_ENUM.LAUNCH;
        }

        if (this.request.getType() === 'Display.ElementSelected') {
            return jovo.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED;
        }

        if (this.request.getType() === 'IntentRequest') {
            return jovo.REQUEST_TYPE_ENUM.INTENT;
        }

        if (this.request.getType() === 'SessionEndedRequest') {
            return jovo.REQUEST_TYPE_ENUM.END;
        }

        if (this.request.getType() === 'System.ExceptionEncountered') {
            return jovo.REQUEST_TYPE_ENUM.END;
        }
    }

    /**
     * Sets Nlu
     * @param {NLUBase} nlu
     */
    setNlu(nlu) {
        this.nlu = nlu;
    }

    /**
     * Input object with name, value and confirmationStatus
     * @public
     * @deprecated
     * @return {{}}
     */
    getInputsObj() {
        let inputs = {};

        if (!this.request.getSlots()) {
            return inputs;
        }

        let slotNames = Object.keys(this.request.getSlots());

        for (let i = 0; i < slotNames.length; i++) {
            let key = slotNames[i];
            inputs[key] = {
                name:
                this.request.getSlots()[key].name,
                value:
                this.request.getSlots()[key].value,
                confirmationStatus:
                this.request.getSlots()[key].confirmationStatus,
            };
        }
        return inputs;
    }

    /**
     * Makes a request to the amazon profile api
     * @public
     * @param {func} callback
     */
    requestAmazonProfile(callback) {
        let url = 'https://api.amazon.com/user/profile?access_token=';
        url += this.getAccessToken();
        request(url, function(error, response, body) {
            if (response.statusCode === 200) {
                callback(error, JSON.parse(body));
            } else {
                callback(error);
            }
        });
    }

    /**
     * Sends an asynchronous speak directive
     * @param {string|SpeechBuilder} speech
     * @param {func=} callback
     */
    progressiveResponse(speech, callback) {
        if (typeof speech === 'undefined' || speech.length === 0) {
            throw new Error('speech must not be empty');
        }

        if (speech instanceof SpeechBuilder) {
            speech = speech.build();
        }
        let options = {
            url: this.request.getApiEndpoint() + '/v1/directives',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.request.getApiAccessToken(),
            },
            method: 'POST',
            json: {
                header: {
                    requestId: this.request.getRequestId(),
                },
                directive: {
                    type: 'VoicePlayer.Speak',
                    speech: SpeechBuilder.toSSML(speech),
                },
            },
        };
        request(options, callback);
    }
}

module.exports.AlexaSkill = AlexaSkill;
module.exports.AlexaSkill.SimpleCard = require('./response/alexaCards').SimpleCard;
module.exports.AlexaSkill.StandardCard = require('./response/alexaCards').StandardCard;
module.exports.AlexaSkill.LinkAccountCard = require('./response/alexaCards').LinkAccountCard;
module.exports.AlexaSkill.AskForListPermissionsCard = require('./response/alexaCards').AskForListPermissionsCard;
module.exports.AlexaSkill.AskForLocationPermissionsCard = require('./response/alexaCards').AskForLocationPermissionsCard;

module.exports.AlexaSkill.BodyTemplate1 = AlexaResponse.BodyTemplate1;
module.exports.AlexaSkill.BodyTemplate2 = AlexaResponse.BodyTemplate2;
module.exports.AlexaSkill.BodyTemplate3 = AlexaResponse.BodyTemplate3;
module.exports.AlexaSkill.BodyTemplate6 = AlexaResponse.BodyTemplate6;
module.exports.AlexaSkill.ListTemplate1 = AlexaResponse.ListTemplate1;
module.exports.AlexaSkill.ListTemplate2 = AlexaResponse.BodyTemplate2;
module.exports.AlexaSkill.ListTemplate3 = AlexaResponse.ListTemplate3;

module.exports.AlexaSkill.AlexaSpeechBuilder = AlexaSpeechBuilder;
