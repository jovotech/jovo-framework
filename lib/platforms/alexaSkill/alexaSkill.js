'use strict';

const _ = require('lodash');

const AlexaResponse = require('./alexaResponse').AlexaResponse;
const CardBuilder = AlexaResponse.CardBuilder;
const AudioPlayer = require('./audioPlayer').AudioPlayer;
const InSkillPurchase = require('./inSkillPurchase').InSkillPurchase;
const GadgetController = require('./gadgetController').GadgetController;
const GameEngine = require('./gameEngine').GameEngine;
const Platform = require('./../plaform').Platform;
const AlexaSpeechBuilder = require('./alexaSpeechBuilder').AlexaSpeechBuilder;
const SpeechBuilder = require('./../speechBuilder').SpeechBuilder;
const BaseApp = require('./../../app');
const AlexaUser = require('./alexaUser').AlexaUser;
const https = require('https');

const util = require('./../../util');


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
    constructor(jovo) {
        super();
        this.jovo = jovo;
        this.request = util.makeRequestInstance(jovo.requestObj);
        this.response = new AlexaResponse();
        if (!this.isRequestAllowed()) {
            throw new Error('Request application id is not allowed');
        }

        if (!this.nlu) {
            this.nlu = new AlexaNLU(this.request);
        }
        if (_.get(this, 'request.session') && this.request.getSessionAttributes()) {
            this.jovo.setSessionAttributes(_.cloneDeep(this.request.getSessionAttributes()));
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
        return this.getInputs()['catchAll'].value;
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
        return BaseApp.PLATFORM_ENUM.ALEXA_SKILL;
    }

    /**
     * Returns session attribute value
     * from the response(!) object
     * @public
     * @param {string} name
     * @return {*}
     */
    getSessionAttribute(name) {
        return this.jovo.getSessionAttribute(name);
    }

    /**
     * Returns all session attributes
     * from the response(!) object.
     * @public
     * @return {*}
     */
    getSessionAttributes() {
        return this.jovo.sessionAttributes;
    }

    /**
     * Returns state value stored in the request session
     * @public
     * @return {*}
     */
    getState() {
        if (this.jovo.getSessionAttribute('STATE')) {
            return this.jovo.getSessionAttribute('STATE');
        }
    }

    /**
     * Stores state in response object session
     * @public
     * @param {string} state
     */
    setState(state) {
        this.jovo.setSessionAttribute('STATE', state);
    }

    /**
     * Sets session attributes
     * @public
     * @param {object} attributes
     * @param {*} value
     */
    setSessionAttributes(attributes) {
        this.jovo.setSessionAttributes(attributes);
    }

    /**
     * Sets session attribute with value
     * @public
     * @param {string} name
     * @param {*} value
     */
    setSessionAttribute(name, value) {
        this.jovo.setSessionAttributes(name, value);
    }

    /**
     * Sets local session attributes to response object
     * @param {Object} sessionAttributes
     */
    setResponseSessionAttributes(sessionAttributes) {
        if (this.response.responseObj.sessionAttributes) {
            this.response.responseObj.sessionAttributes = sessionAttributes;
        }
    }

    /**
     * Sets speech output with ShouldEndSession = true
     *
     * @public
     * @param {string} speech
     */
    tell(speech) {
        if (speech && speech instanceof SpeechBuilder) {
            speech = speech.build();
        }
        if (!speech || speech.length === 0) {
            speech = '<break time="10ms"/>';
        }

        if (this.jovo.config.polly) {
            let polly = require('./../../integrations/polly')(this.jovo.config.polly);
            polly.url(SpeechBuilder.toSSML(speech)).then((url) => {
                this.response.tell(
                    SpeechBuilder.toSSML(
                        this.getSpeechBuilder().addAudio(url).build()
                    )
                );
                this.jovo.emit('respond', this.jovo);
            });
        } else {
            this.response.tell(SpeechBuilder.toSSML(speech));
            this.jovo.emit('respond', this.jovo);
        }
    }


    /**
     * Creates an audio tag within ssml
     *
     * Max 90 seconds
     * @deprecated
     * @public
     * @param {string} audioUrl
     */
    play(audioUrl) {
        this.response.play(audioUrl);
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Sets can fulfill request values.
     * @public
     * @param {string} canFulfillRequest
     */
    canFulfillRequest(canFulfillRequest) {
        if (canFulfillRequest !== 'YES' && canFulfillRequest !== 'NO' && canFulfillRequest !== 'MAYBE') {
            throw new Error('canFulfill must be one the following values: YES | NO | MAYBE');
        }

        this.response.setCanFulfillIntent(canFulfillRequest);
    }

    /**
     * Sets can fulfill request values.
     * @public
     * @param {string} slotName
     * @param {string} canUnderstandSlot
     * @param {string} canFulfillSlot
     */
    canFulfillSlot(slotName, canUnderstandSlot, canFulfillSlot) {
        if (canUnderstandSlot !== 'YES' && canUnderstandSlot !== 'NO' && canUnderstandSlot !== 'MAYBE') {
            throw new Error('canUnderstand must be one the following values: YES | NO | MAYBE');
        }

        if (canFulfillSlot !== 'YES' && canFulfillSlot !== 'NO') {
            throw new Error('canFulfill must be one the following values: YES | NO');
        }

        this.response.setCanFulfillSlot(slotName, canUnderstandSlot, canFulfillSlot);
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

        if (this.jovo.config.polly) {
            let polly = require('./../../integrations/polly')(this.jovo.config.polly);
            polly.url(SpeechBuilder.toSSML(speech)).then((url) => {
                speech = this.getSpeechBuilder().addAudio(url).build();
                return polly.url(SpeechBuilder.toSSML(repromptSpeech));
            }).then((url) => {
                repromptSpeech = this.getSpeechBuilder().addAudio(url).build();
                this.response.ask(SpeechBuilder.toSSML(speech),
                    SpeechBuilder.toSSML(repromptSpeech));
                this.jovo.emit('respond', this.jovo);
            });
        } else {
            this.response.ask(SpeechBuilder.toSSML(speech),
                SpeechBuilder.toSSML(repromptSpeech));
            this.jovo.emit('respond', this.jovo);
        }
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
     * Returns reprompt text
     * @public
     * @return {string}
     */
    getRepromptText() {
        return this.response.getRepromptText();
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
     * Returns skill event body element
     * @return {*}
     */
    getSkillEventBody() {
        return this.request.getBody();
    }

    /**
     * Returns platform's api endpoint
     * @public
     * @return {string}
     */
    getApiEndpoint() {
        let endpoint = this.request.getApiEndpoint();
        if (typeof endpoint === 'undefined') {
            endpoint = 'https://api.amazonalexa.com';
        }
        return endpoint;
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
     * @return {BaseApp.DIALOGSTATE_ENUM}
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
     * Shows ask for list permission card
     * @public
     * @param {Array} contactProperties name|given_name|email|mobile_number
     * @return {Jovo}
     */
    showAskForContactPermissionCard(contactProperties) {
        this.response.addAskForContactPermissionCard(contactProperties);
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
     * @param {string} preamble
     */
    showVideo(url, title, subtitle, preamble) {
        if (this.request.hasVideoInterface()) {
            this.response.addVideoDirective(url, title, subtitle, preamble);
            this.response.deleteShouldEndSession();
        }
        this.jovo.respond();
    }

    /**
     * Sends rollCall for Gadgets
     * @public
     * @param {string} speech
     */
    rollCallGadget(speech) {
        this.response.setOutputSpeech(speech);
        this.response.deleteShouldEndSession();

        this.jovo.respond();
    }

    /**
     * Adds directive to response object
     * @param {*} directive
     */
    addDirective(directive) {
        this.response.addDirective(directive);
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
        if (this.getRequestType() === BaseApp.REQUEST_TYPE_ENUM.END) {
            try {
                return this.request.getReason();
            } catch (err) {
                return;
            }
        }

        if (this.getRequestType() === BaseApp.REQUEST_TYPE_ENUM.INTENT &&
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
        if (type === 'BodyTemplate7') {
            return new AlexaResponse.BodyTemplate7();
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
     * Returns Alexa InSkillPurchase instance
     * @return {InSkillPurchase}
     */
    inSkillPurchase() {
        return new InSkillPurchase(this.jovo);
    }

    /**
     * Returns Alexa GadgetController instance
     * @return {GadgetController}
     */
    gadgetController() {
        return new GadgetController(this.jovo);
    }

    /**
     * Returns Alexa GameEngine instance
     * @return {GameEngine}
     */
    gameEngine() {
        return new GameEngine(this.jovo);
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
        if (this.request.getType().substring(0, 18) === 'PlaybackController' ) {
            return BaseApp.REQUEST_TYPE_ENUM.PLAYBACKCONTROLLER;
        }

        if (this.request.getType().substring(0, 11) === 'AudioPlayer') {
            return BaseApp.REQUEST_TYPE_ENUM.AUDIOPLAYER;
        }

        if (this.request.getType().substring(0, 18) === 'PlaybackController') {
            return BaseApp.REQUEST_TYPE_ENUM.PLAYBACKCONTROLLER;
        }

        if (this.request.getType().substring(0, 15) === 'AlexaSkillEvent') {
            return BaseApp.REQUEST_TYPE_ENUM.ON_EVENT;
        }

        if (this.request.getType().substring(0, 23) === 'AlexaHouseholdListEvent') {
            return BaseApp.REQUEST_TYPE_ENUM.ON_EVENT;
        }

        if (this.request.getType() === 'CanFulfillIntentRequest') {
            return BaseApp.REQUEST_TYPE_ENUM.CAN_FULFILL_INTENT;
        }

        if (this.request.getType() === 'GameEngine.InputHandlerEvent') {
            return BaseApp.REQUEST_TYPE_ENUM.ON_GAME_ENGINE_INPUT_HANDLER_EVENT;
        }

        if (this.request.getType() === 'LaunchRequest') {
            return BaseApp.REQUEST_TYPE_ENUM.LAUNCH;
        }

        if (this.request.getType() === 'Display.ElementSelected') {
            return BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED;
        }

        if (this.request.getType() === 'IntentRequest') {
            return BaseApp.REQUEST_TYPE_ENUM.INTENT;
        }

        if (this.request.getType() === 'SessionEndedRequest') {
            return BaseApp.REQUEST_TYPE_ENUM.END;
        }

        if (this.request.getType() === 'System.ExceptionEncountered') {
            return BaseApp.REQUEST_TYPE_ENUM.END;
        }

        if (this.request.getType() === 'Connections.Response') {
            return BaseApp.REQUEST_TYPE_ENUM.ON_PURCHASE;
        }

        return BaseApp.REQUEST_TYPE_ENUM.UNDEFINED;
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

        https.get(url, (res) => {
            const contentType = res.headers['content-type'];

            let error;
            if (res.statusCode !== 200) {
                error = new Error('Something went wrong');
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Wrong content type');
            }
            if (error) {
                res.resume();
                callback(error);
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    callback(null, parsedData);
                } catch (e) {
                    callback(new Error('Something went wrong'));
                }
            });
        }).on('error', (e) => {
            callback(new Error('Something went wrong'));
        });
    }

    /**
     * Aborts response if request's skillId doesn't match
     * configurated skillId
     * @return {boolean} requestAllowed
     */
    isRequestAllowed() {
        if (_.get(this.jovo, 'config.alexaSkill.allowedApplicationIds')) {
            if (this.jovo.config.alexaSkill.allowedApplicationIds.length > 0) {
                if (this.jovo.config.alexaSkill.allowedApplicationIds.indexOf(
                        this.getApplicationId()
                    ) === -1 ) {
                    return false;
                }
            }
        }
        return true;
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

        let json = {
            header: {
                requestId: this.request.getRequestId(),
            },
            directive: {
                type: 'VoicePlayer.Speak',
                speech: SpeechBuilder.toSSML(speech),
            },
        };

        let options = {
            hostname: this.getApiEndpoint().substr(8), // remove https://
            port: 443,
            path: '/v1/directives',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.request.getApiAccessToken(),
            },
        };
        let req = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(body) {
            });
            res.on('end', () => {
                if (callback) {
                    callback();
                }
            });
        });
        req.on('error', function(e) {
            if (callback) {
                callback(e);
            }
        });
        req.write(JSON.stringify(json));
        req.end();
    }
}

module.exports.AlexaSkill = AlexaSkill;
module.exports.AlexaSkill.SimpleCard = require('./response/alexaCards').SimpleCard;
module.exports.AlexaSkill.StandardCard = require('./response/alexaCards').StandardCard;
module.exports.AlexaSkill.LinkAccountCard = require('./response/alexaCards').LinkAccountCard;
module.exports.AlexaSkill.AskForListPermissionsCard = require('./response/alexaCards').AskForListPermissionsCard;
module.exports.AlexaSkill.AskForLocationPermissionsCard = require('./response/alexaCards').AskForLocationPermissionsCard;
module.exports.AlexaSkill.AskForContactPermissionsCard = require('./response/alexaCards').AskForContactPermissionsCard;

module.exports.AlexaSkill.BodyTemplate1 = AlexaResponse.BodyTemplate1;
module.exports.AlexaSkill.BodyTemplate2 = AlexaResponse.BodyTemplate2;
module.exports.AlexaSkill.BodyTemplate3 = AlexaResponse.BodyTemplate3;
module.exports.AlexaSkill.BodyTemplate6 = AlexaResponse.BodyTemplate6;
module.exports.AlexaSkill.BodyTemplate7 = AlexaResponse.BodyTemplate7;
module.exports.AlexaSkill.ListTemplate1 = AlexaResponse.ListTemplate1;
module.exports.AlexaSkill.ListTemplate2 = AlexaResponse.BodyTemplate2;
module.exports.AlexaSkill.ListTemplate3 = AlexaResponse.ListTemplate3;

module.exports.AlexaSkill.AlexaSpeechBuilder = AlexaSpeechBuilder;
