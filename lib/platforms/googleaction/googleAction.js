'use strict';

const _ = require('lodash');

const jovo = require('../../jovo');
const GoogleActionRequest = require('./googleActionRequest').GoogleActionRequest;
const GoogleActionResponse= require('./googleActionResponse').GoogleActionResponse;
const BasicCard = require('./googleActionResponse').BasicCard;
const Carousel = require('./googleActionResponse').Carousel;
const List = require('./googleActionResponse').List;
const OptionItem = require('./googleActionResponse').OptionItem;
const GoogleActionSpeechBuilder = require('./googleActionSpeechBuilder').GoogleActionSpeechBuilder;
const GoogleActionUser = require('./googleActionUser').GoogleActionUser;


const CardBuilder = GoogleActionResponse.CardBuilder;

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
    constructor(jovo, request) {
        super();
        this.jovo = jovo;
        this.request = new GoogleActionRequest(request);
        this.response = new GoogleActionResponse();

        this.response.setContextOut(this.request.getContexts());
    }

    /** **
     * Request getter
     */

    /**
     * Returns application ID  of the request
     * NO APPLICATION ID FROM GOOGLE REQUESTS
     * @return {String} applicationId
     */
    getApplicationId() {
        return '';
    }

    /**
     * Returns original request object.
     * Does not work with API.AI testing.
     * @return {*}
     */
    getOriginalRequest() {
        return this.request.getOriginalRequest();
    }


    /** *****************************************************
     *
     * JOVO wrapper functions
     *
     ************************************/

    /**
     * Creates google action user instance
     * @param {*} config
     * @return {GoogleActionUser}
     */
    makeUser(config) {
        return new GoogleActionUser(this, config);
    }

    /**
     * Gets request type and maps to jovo request types
     * GOOGLE_ASSISTANT_WELCOME => LAUNCH
     * else => INTENT
     * TODO: any ideas how to get end request?
     * @public
     * @return {string}
     */
    getRequestType() {
        if (this.request.isOptionsIntent()) {
            return jovo.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED;
        }
        if (this.request.getResolvedQuery() === 'GOOGLE_ASSISTANT_WELCOME') {
            return jovo.REQUEST_TYPE_ENUM.LAUNCH;
        }
        return jovo.REQUEST_TYPE_ENUM.INTENT;
    }

    /**
     * TODO: possible with GoogleAction?
     * Returns reason when a session ended.
     * Does not work with GoogleAction?
     * @public
     * @return {*}
     */
    getEndReason() {
        return 'DUMMY';
    }

    /**
     * Ends session without saying anything
     */
    endSession() {
        this.response.tell('<break time="1ms"/>');
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
        return this.request.getParameters();
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
     * Returns type of platform
     * @public
     * @return {string}
     */
    getType() {
        return jovo.PLATFORM_ENUM.GOOGLE_ACTION;
    }

    /**
     * Returns token of the request
     * (Touched/Selected Element )
     * @return {*}
     */
    getSelectedElementId() {
        return this.request.getSelectedOptionItem();
    }

    /**
     * Returns state value stored in the request session
     * @public
     * @return {*}
     */
    getState() {
      return this.getSessionAttribute('STATE');
    }

    /** ***********************************************************
     *
     * RESPONSE BUILDER FUNCTIONS
     *
     */

    /**
     * Returns session attribute value
     * from the response(!) object
     * @public
     * @param {string} name
     * @return {*}
     */
    getSessionAttribute(name) {
        return _.get(this.getSessionAttributes(), name);
    }

    /**
     * Returns all session attributes
     * from the response(!) object.
     * @public
     * @return {*}
     */
    getSessionAttributes() {
        let context = this.response.getContextOut('session');
        if (Object.keys(context).length === 0) {
            return {};
        }
        return context.parameters;
    }

    /**
     * Stores state in response object session
     * @public
     * @param {string} state
     */
    setState(state) {
        this.setSessionAttribute('STATE', state);
    }

    /**
     * Sets session attribute with value
     * @public
     * @param {string} name
     * @param {*} value
     */
    setSessionAttribute(name, value) {
        let sessionAttributes = this.getSessionAttributes();

        if (Object.keys(sessionAttributes).length === 0) {
            this.response.addContextOutObject({
                name: 'session',
                lifespan: 10000,
                parameters: {},
            });
            this.response.addContextOutParameter('session', name, value);
        } else {
            this.response.addContextOutParameter('session', name, value);
        }
    }

    /**
     * Sets session attributes
     * @param {object} attributes
     * @param {*} value
     */
    setSessionAttributes(attributes) {
        _.map(attributes, (value, name) => {
            this.response.addContextOutParameter('session', name, value);
        });
    }

    /**
     * Sets speech output
     * @public
     * @param {string} speech
     */
    tell(speech) {
        this.response.tell(speech);
    }

    /**
     * Creates an audio tag within ssml
     *
     * Max 90 seconds
     * @public
     * @param {string} audioUrl
     * @param {string} fallbackText
     */
    play(audioUrl, fallbackText) {
        let speech = '<speak><audio src="'+audioUrl+'">' + fallbackText + '</audio></speak>';
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
        this.response.ask(speech, repromptSpeech);
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
     * Implementation of generic withAccountLinkingCard
     * Show an account linking card to the response object
     * @return {GoogleAction} this
     */
    showAccountLinkingCard() {
        this.response.addAccountLinkingCard();
        return this;
    }

    /**
     * Adds basic card to response
     * Works only with SCREEN_OUTPUT devices
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
     * Adds suggestion chips to response
     * Works only with SCREEN_OUTPUT devices
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
     * Adds list element to response
     * Works only with SCREEN_OUTPUT devices
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
     * Returns Google Assistant CardBuilder instance
     * @public
     * @return {CardBuilder}
     */
    getCardBuilder() {
        return new CardBuilder();
    }

    /**
     * Returns google action specific speechbuilder
     * @return {GoogleActionSpeechBuilder}
     */
    getSpeechBuilder() {
        return new GoogleActionSpeechBuilder();
    }
    /**
     * Returns state of dialog
     * @return {jovo.DIALOGSTATE_ENUM}
     */
    getDialogState() {
        if (this.request.result.actionIncomplete === true) {
            return jovo.DIALOGSTATE_ENUM.IN_PROGRESS;
        }
        if (this.request.result.actionIncomplete === false) {
            return jovo.DIALOGSTATE_ENUM.DONE;
        }
    }

    /**
     * Continues dialog.
     */
    continueDialog() {
        this.ask(this.request.result.fulfillment.speech,
            this.request.result.fulfillment.speech);
    }

    /**
     * Returns device id
     * TODO: possible with GoogleAction?
     * @return {string} device id
     */
    getDeviceId() {
        return 'id';
    }
}


module.exports.GoogleAction = GoogleAction;
module.exports.GoogleAction.BasicCard = BasicCard;
module.exports.GoogleAction.Carousel = Carousel;
module.exports.GoogleAction.List = List;

module.exports.GoogleAction.OptionItem = OptionItem;
module.exports.GoogleAction.GoogleActionSpeechBuilder = GoogleActionSpeechBuilder;
