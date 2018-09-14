'use strict';

const _ = require('lodash');

const jovo = require('../../jovo');
const GoogleActionResponse = require('./googleActionResponse').GoogleActionResponse;
const GoogleActionResponseV2 = require('./googleActionResponseV2').GoogleActionResponseV2;
const BasicCard = require('./googleActionResponse').BasicCard;
const Table = require('./googleActionResponseV2').Table;
const Carousel = require('./googleActionResponse').Carousel;
const CarouselBrowse = require('./googleActionResponse').CarouselBrowse;

const List = require('./googleActionResponse').List;
const OptionItem = require('./googleActionResponse').OptionItem;
const CarouselItem = require('./googleActionResponse').CarouselItem;
const CarouselBrowseTile = require('./googleActionResponse').CarouselBrowseTile;

const GoogleActionSpeechBuilder = require('./googleActionSpeechBuilder').GoogleActionSpeechBuilder;
const SpeechBuilder = require('./../speechBuilder').SpeechBuilder;
const BaseApp = require('./../../app');
const MediaResponse = require('./mediaResponse').MediaResponse;

const GoogleActionUser = require('./googleActionUser').GoogleActionUser;


const CardBuilder = GoogleActionResponse.CardBuilder;
const util = require('./../../util');

const Platform = require('./../plaform').Platform;

/**
 * Class GoogleAction (GoogleHome + GoogleAssistant)
 */
class GoogleAction extends Platform {

    /**
     * Constructor
     * @public
     * @param {Jovo} jovo
     * @param {object} request
     */
    constructor(jovo) {
        super();
        this.jovo = jovo;
        this.request = util.makeRequestInstance(jovo.requestObj);
        if (util.getRequestType(this.request) === 'GoogleActionDialogFlowV2Request' ||
            util.getRequestType(this.request) === 'DialogFlowV2Request') {
            this.response = new GoogleActionResponseV2(null, this.request.getSession());
        } else {
            this.response = new GoogleActionResponse();
        }
        this.nlu = util.makeRequestInstance(jovo.requestObj);
        try {
            if (typeof this.request.getContexts() !== 'undefined') {
                this.response.setContextOutArray(_.cloneDeep(this.request.getContexts()));
                this.cleanUpSessionContext();
                this.jovo.setSessionAttributes(_.cloneDeep(this.request.getSessionAttributes()));
            }
        } catch (err) {

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
     * @return {*}
     */
    getInput(name) {
        return this.getInputs()[name];
    }

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
        return this.request.isNewSession();
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
     * Returns device id
     * TODO: detect different devices (diffs in interface data)
     * @public
     * @return {string} device id
     */
    getDeviceId() {
        return 'DEVICE-' + this.getUserId(); // TODO: check with google home, assistant
    }

    /**
     * Returns application ID (Skill ID) of the request
     * @public
     * @return {String} applicationId
     */
    getApplicationId() {
        return '';
    }

    /**
     * Returns raw text
     * @abstract
     * @return {String} rawText
     */
    getRawText() {
        return this.request.getRawText();
    }

    /**
     * Returns token of the request
     * (Touched/Selected Element )
     * @public
     * @return {*}
     */
    getSelectedElementId() {
        return this.request.getGoogleActionRequest().getSelectedOptionItem();
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
        return BaseApp.PLATFORM_ENUM.GOOGLE_ACTION;
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
        return this.jovo.getSessionAttributes();
    }

    /**
     * Returns state value stored in the request session
     * @public
     * @return {*}
     */
    getState() {
        return this.jovo.getSessionAttribute('STATE');
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
     * Sets local session attributes to response object
     * @param {Object} sessionAttributes
     */
    setResponseSessionAttributes(sessionAttributes) {
        if (Object.keys(sessionAttributes).length === 0) {
            return;
        }

        this.response.setContextOutParametersCreateOrUpdate('session', sessionAttributes);
    }

    /**
     * Sets session attribute with value
     * @public
     * @param {string} name
     * @param {*} value
     */
    setSessionAttribute(name, value) {
        this.jovo.setSessionAttribute(name, value);
    }


    /**
     * Sets speech output
     * @public
     * @param {string} speech
     */
    tell(speech) {
        // if (typeof speech === 'undefined' || speech.length === 0) {
        //     throw new Error('speech must not be empty');
        // }

        if (speech && speech instanceof SpeechBuilder) {
            speech = speech.build();
        }

        if (!speech || speech.length === 0) {
            speech = '<break time="1ms"/>';
            this.displayText(' ');
        }

        this.response.tell(SpeechBuilder.toSSML(speech));
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Creates an audio tag within ssml
     *
     * Max 90 seconds
     * @deprecated
     * @public
     * @param {string} audioUrl
     * @param {string} fallbackText
     */
    play(audioUrl, fallbackText) {
        let speech = '<speak><audio src="' + audioUrl + '">' + fallbackText + '</audio></speak>';
        this.tell(speech);
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

        if (speech instanceof SpeechBuilder) {
            speech = speech.build();
        }

        if (!repromptSpeech) {
            repromptSpeech = speech;
        }

        if (repromptSpeech instanceof SpeechBuilder) {
            repromptSpeech = repromptSpeech.build();
        }

        let repromptArray = [];

        if (_.isArray(repromptSpeech)) {
            const MAX_REPROMPTS = 3;
            if (repromptSpeech.length > MAX_REPROMPTS) {
                console.log('Warning: Only 3 reprompts allowed. Skipped the rest.');
            }
            for (let i = 0; i <= repromptSpeech.length - 1; i++) {
                if (i > MAX_REPROMPTS - 1) {
                    continue;
                }
                let item = repromptSpeech[i];
                if (item instanceof SpeechBuilder) {
                    item = item.build();
                }
                repromptArray.push(SpeechBuilder.toSSML(item));
            }
        } else {
            repromptArray = [SpeechBuilder.toSSML(repromptSpeech)];
        }

        this.response.ask(SpeechBuilder.toSSML(speech), repromptArray);
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
     * displayText is required in Google Assistant app.
     * @param {string=} displayText
     */
    endSession(displayText) {
        let defaultDisplayText = '-';
        if (displayText) {
            defaultDisplayText = displayText;
        }
        this.displayText(defaultDisplayText).tell('<break time="1ms"/>');
    }

    /**
     * Creates google action user instance
     * @param {*} config
     * @return {GoogleActionUser}
     */
    makeUser(config) {
        return new GoogleActionUser(this, config);
    }

    /**
     * Returns google action specific speechbuilder
     * @return {GoogleActionSpeechBuilder}
     */
    getSpeechBuilder() {
        return new GoogleActionSpeechBuilder(this.jovo);
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
     * Google Assistant public functions
     */

    /**
     * Returns original request object.
     * Does not work with API.AI testing.
     * @public
     * @return {*}
     */
    getOriginalRequest() {
        return this.request.getOriginalRequest();
    }

    /**
     * Returns sign in status after sign in
     * @public
     * @return {null|string}
     */
    getSignInStatus() {
        return this.request.getGoogleActionRequest().getSignInStatus();
    }

    /**
     * Returns true if permission granted
     * @return {*}
     */
    isPermissionGranted() {
        return this.request.getGoogleActionRequest().isPermissionGranted();
    }

    /**
     * Sets context out object with an array of contexts
     * @public
     * @param {array} contexts
     */
    setContextOutArray(contexts) {
        this.response.setContextOutArray(contexts);
    }

    /**
     * Adds context to contextOut array
     * @public
     * @param {object} context
     */
    addContextOutObject(context) {
        this.response.addContextOutObject(context);
    }

    /**
     * Sets context out object. Overwrites existing objects with same name
     * @public
     * @param {*} contextObj
     */
    setContextOut(contextObj) {
        this.response.setContextOut(contextObj);
    }

    /**
     * Adds parameter to a given context object
     * @public
     * @param {string} contextName
     * @param {string} parameterName
     * @param {*} value
     */
    addContextOutParameter(contextName, parameterName, value) {
        this.response.addContextOutParameter(contextName, parameterName, value);
    }

    /**
     * Returns parameter for given context
     * @public
     * @param {string} contextName
     * @param {string} parameterName
     * @return {*}
     */
    getContextOutParameter(contextName, parameterName) {
        return this.response.getContextOutParameter(contextName, parameterName);
    }


    /**
     * Implementation of generic withSimpleCard
     * Shows a simple card to the response object
     * @public
     * @param {string} title
     * @param {string} formattedText
     * @return {GoogleAction} this
     */
    showSimpleCard(title, formattedText) {
        this.response.addBasicCard(title, formattedText);
        return this;
    }

    /**
     * Implementation of generic withImageCard
     * Shows a standard card with a card to the response object
     * @public
     * @param {string} title
     * @param {string} formattedText
     * @param {string} imageObject object with secured image url
     * @return {GoogleAction} this
     */
    showImageCard(title, formattedText, imageObject) {
        const imageUrl = _.isString(imageObject) ? imageObject : imageObject.largeImageUrl;

        this.response.addImageCard(title, formattedText, imageUrl, title);
        return this;
    }

    /**
     * Implementation of generic withSimpleTable
     * Shows a simple table card to the response object
     * @public
     * @param {string} title
     * @param {string} subtitle
     * @param {array} columnHeaders
     * @param {array} rowsText
     * @return {GoogleAction} this
     */
    showSimpleTable(title, subtitle, columnHeaders, rowsText) {
        this.response.addTable(title, subtitle, columnHeaders, rowsText);
        return this;
    }

    /**
     * Implementation of generic withAccountLinkingCard
     * Show an account linking card to the response object
     * @public
     * @param {string} context The optional context why the app
     *     needs to ask the user to sign in, as a  prefix of a prompt
     *     for user consent, e.g. "To track your exercise", or
     *     "To check your account balance".
     */
    showAccountLinkingCard(context) {
        this.askForSignIn(context);
    }

    /**
     * Adds basic card to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {BasicCard} basicCard
     * @return {GoogleAction}
     */
    showBasicCard(basicCard) {
        if (this.hasScreenInterface()) {
            this.response.addRichResponseItem(
                {
                    basicCard: basicCard,
                }
            );
        }
        return this;
    }

    /**
     * Adds table to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {Table} table
     * @return {GoogleAction}
     */
    showTable(table) {
        if (this.hasScreenInterface()) {
            this.response.addRichResponseItem(
                {
                    tableCard: table,
                }
            );
        }
        return this;
    }

    /**
     * Adds suggestion chips to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {Array<String>} chips
     * @return {GoogleAction}
     */
    showSuggestionChips(chips) {
        if (this.hasScreenInterface()) {
            this.response.addSuggestionChips(chips);
        }
        return this;
    }

    /**
     * Adds link out suggestion chip to response
     * @public
     * @param {string} destinationName
     * @param {string} url
     * @return {GoogleAction}
     */
    showLinkOutSuggestion(destinationName, url) {
        if (this.hasScreenInterface()) {
            this.response.addLinkOutSuggestion(destinationName, url);
        }
        return this;
    }

    /**
     * Adds carousel element to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {Carousel} carousel
     * @return {GoogleAction}
     */
    showCarousel(carousel) {
        if (this.hasScreenInterface()) {
            this.response.addCarousel(carousel);
        }
        return this;
    }

    /**
     * Adds carousel browse element to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {Carousel} carouselBrowse
     * @return {GoogleAction}
     */
    showCarouselBrowse(carouselBrowse) {
        if (this.hasScreenInterface()) {
            this.response.addCarouselBrowse(carouselBrowse);
        }
        return this;
    }

    /**
     * Adds list element to response
     * Works only with SCREEN_OUTPUT devices
     * @public
     * @param {List} list
     * @return {GoogleAction}
     */
    showList(list) {
        if (this.hasScreenInterface()) {
            this.response.addList(list);
        }
        return this;
    }

    /**
     * Adds display text to response
     * @public
     * @param {string} displayText
     * @return {GoogleAction}
     */
    displayText(displayText) {
        if (this.hasScreenInterface()) {
            this.response.addDisplayText(displayText);
        }
        return this;
    }

    /**
     * Ask for zipcode and city
     * @public
     * @param {string} speech
     */
    askForZipCodeAndCity(speech) {
        this.response.addAskForCoarseLocation(speech);
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Ask for precise location
     * @public
     * @param {string} speech
     */
    askForPreciseLocation(speech) {
        this.response.addAskForPreciseLocation(speech);
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Ask for name
     * @public
     * @param {string} speech
     */
    askForName(speech) {
        this.response.addAskForNamePermission(speech);
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Ask for permissions
     * @public
     * @param {'NAME'|'DEVICE_COARSE_LOCATION'|'DEVICE_PRECISE_LOCATION'} permissions
     * @param {string} speech
     */
    askForPermissions(permissions, speech) {
        this.response.addAskForPermission(permissions, speech);
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Ask form sign in
     * @public
     * @param {string} context
     */
    askForSignIn(context) {
        this.response.addAskForSignIn(context);
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Returns Google Assistant CardBuilder instance
     * @public
     * @return {CardBuilder}
     */
    getCardBuilder() {
        return new CardBuilder();
    }

    /**
     * Returns state of dialog
     * @deprecated
     * @return {jovo.DIALOGSTATE_ENUM}
     */
    getDialogState() {
        if (this.request.isActionIncomplete()) {
            return jovo.DIALOGSTATE_ENUM.IN_PROGRESS;
        }
        if (!this.request.getActionIncomplete()) {
            return jovo.DIALOGSTATE_ENUM.DONE;
        }
    }

    /**
     * Continues dialog.
     * @deprecated
     */
    continueDialog() {
        this.ask(this.request.result.fulfillment.speech,
            this.request.result.fulfillment.speech);
    }

    /**
     * Returns true if user is voice matched
     * @return {string}
     */
    isVoiceMatchedUser() {
        return this.request.isVoiceMatchedUser();
    }


    /**
     * Gets request type and maps to jovo request types
     * @public
     * @return {string}
     */
    getRequestType() {
        return this.request.getRequestType();
    }

    /**
     * TODO: possible with GoogleAction?
     * Returns reason when a session ended.
     * Does not work with GoogleAction?
     * @public
     * @return {*}
     */
    getEndReason() {
        return '';
    }

    /**
     * Returns Alexa audio player instance
     * @public
     * @return {MediaResponse}
     */
    audioPlayer() {
        return this.mediaResponse();
    }

    /**
     * Returns Alexa media response instance
     * @public
     * @return {MediaResponse}
     */
    mediaResponse() {
        return new MediaResponse(this.jovo);
    }

    /**
     * Removes parameter from session context object
     */
    cleanUpSessionContext() {
        let context = this.request.getContext('session');

        if (!context) {
            return;
        }

        if (this.request.getParameters()) {
            for (let param of Object.keys(this.request.getParameters())) {
                delete context.parameters[param];
                delete context.parameters[param + '.original'];
            }
        }
    }

}


module.exports.GoogleAction = GoogleAction;
module.exports.GoogleAction.BasicCard = BasicCard;
module.exports.GoogleAction.Table = Table;
module.exports.GoogleAction.Carousel = Carousel;
module.exports.GoogleAction.CarouselBrowse = CarouselBrowse;

module.exports.GoogleAction.List = List;

module.exports.GoogleAction.OptionItem = OptionItem;
module.exports.GoogleAction.CarouselItem = CarouselItem;
module.exports.GoogleAction.CarouselBrowseTile = CarouselBrowseTile;


module.exports.GoogleAction.GoogleActionSpeechBuilder = GoogleActionSpeechBuilder;
