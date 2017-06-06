'use strict';

/**
 * Alexa specific implementations
 */
class Alexa {

    /**
     * Constructor
     * @param {object} request
     * @param {object} response
     */
    constructor(request, response) {
        this.request = request;
        this.response = response;

        let sessionAttributes = {};

        if (typeof request.session.attributes !== 'undefined') {
            sessionAttributes = request.session.attributes;
        }

        // console.log('----- Alexa ------');
        // console.log(request.context.System.device);
        // console.log('-----------');


        this.responseObj = {
            version: '1.0',
            sessionAttributes: sessionAttributes,
            response: {
                shouldEndSession: true,
            },
        };
    }


    /** *****************************************************
     *
     * Platform specific functions
     *
     ************************************/

    /**
     * Returns request JSON sent by alexa
     * @return {Alexa.request}
     */
    request() {
        return this.request;
    }

    /** *****************************************************
     *
     * JOVO wrapper functions
     *
     ************************************/

    /**
     * Returns unique user id
     *
     * @return {string} UserId
     */
    getUserId() {
        return this.request.session.user.userId;
    }

    /**
     * Returns intent name
     * @return {string}
     */
    getIntentName() {
        return this.request.request.intent.name;
    }

    /**
     * Returns request type for
     * LaunchRequest, IntentRequest SessionEndedRequest
     * @return {string}
     */
    getRequestType() {
        if (this.request.request.type === 'LaunchRequest') {
            return 'LAUNCH';
        }

        if (this.request.request.type === 'IntentRequest') {
            return 'INTENT';
        }

        if (this.request.request.type === 'SessionEndedRequest') {
            return 'END';
        }
    }


    /**
     * Returns reason code for an end of a session
     *
     * STOP_INTENT = User says 'Stop'
     * MAX_PROMPTS_EXCEEDED = No user input on reprompt
     * ERROR
     *
     * @return {*}
     */
    getEndReason() {
        if (this.getRequestType() === 'SessionEndedRequest') {
            return this.request.request.reason;
        }

        if (this.getRequestType() === 'IntentRequest' && this.getIntentName() === 'AMAZON.StopIntent') {
            return 'STOP_INTENT';
        }
    }


    /**
     * Returns object with inputname => inputvalue objects
     *
     * {
     *   name1 : value1,
     *   name2 : value2
     * }
     *
     * @return {object|{}}
     */
    getInputs() {
        let inputs = {};

        if (!this.request.request.intent.slots) {
            return inputs;
        }

        let slotNames = Object.keys(this.request.request.intent.slots);

        for (let i = 0; i < slotNames.length; i++) {
            let key = slotNames[i];
            inputs[key] = this.request.request.intent.slots[key].value;
        }
        return inputs;
    }


    /**
     * Get input object by name
     * @param {string} name
     * @return {string}
     */
    getInput(name) {
        return this.getInputs()[name];
    }

    /**
     * Returns type of platform
     * @return {string}
     */
    getType() {
        return 'Alexa';
    }

    /**
     * Returns state value stored in the request session
     *
     * @return {*}
     */
    getState() {
        if (typeof(this.request.session.attributes) === 'undefined') {
            return null;
        }
        return this.request.session.attributes.STATE;
    }

    /** ***********************************************************
     *
     * RESPONSE BUILDER FUNCTIONS
     *
     */

    /**
     * Stores state in response object session
     *
     * @param {string} state
     */
    setState(state) {
        this.setSessionAttribute('STATE', state);
    }

    /**
     * Sets session attribute with value
     * @param {string} name
     * @param {*} value
     */
    setSessionAttribute(name, value) {
        this.responseObj.sessionAttributes[name] = value;
    }

    /**
     * Returns session attribute value
     * @param {string} name
     * @return {*}
     */
    getSessionAttribute(name) {
        return this.responseObj.sessionAttributes[name];
    }

    /**
     * Returns all session attributes
     * @return {*}
     */
    getSessionAttributes() {
        return this.responseObj.sessionAttributes;
    }


    /**
     *
     * Sets speech output with ShouldEndSession = true
     *
     * @param {string} speech
     * @return {object}
     */
    tell(speech) {
        this.responseObj.response = {
            outputSpeech: {
                type: 'SSML',
                ssml: speech,
            },
            shouldEndSession: true,
        };

        return this.responseObj;
    }


    /**
     * Creates an audio tag within ssml
     *
     * Max 90 seconds
     * @param {string} audioUrl
     * @return {*}
     */
    play(audioUrl) {
        let speech = '<speak> <audio src="'+audioUrl+'"/></speak>';
        return this.tell(speech);
    }

    /**
     * Creates object with reprompt.
     * Keeps session open
     * @param {string} speech
     * @param {string} repromptSpeech
     * @return {*}
     */
    ask(speech, repromptSpeech) {
        this.responseObj.response = {
            outputSpeech: {
                type: 'SSML',
                ssml: speech,
            },
            reprompt: {
                outputSpeech: {
                    type: 'SSML',
                    ssml: repromptSpeech,
                },
            },
            shouldEndSession: false,
        };
        return this.responseObj;
    }


    /**
     * Returns response object
     * @return {object}
     */
    getResponseObject() {
        return this.responseObj;
    }

    /**
     * Implementation of generic withSimpleCard
     * Adds a simple card to the response object
     * @param {string} title
     * @param {string} content
     * @return {object}
     */
    withSimpleCard(title, content) {
        this.responseObj.response.card = new CardBuilder()
            .createSimpleCard(title, null, content)
            .build();
        return this.responseObj;
    }

    /**
     * Implementation of generic withImageCard
     * Adds a standard card with a card to the response object
     * @param {string} title
     * @param {string} content
     * @param {string} imageUrl secured image url
     * @return {*}
     */
    withImageCard(title, content, imageUrl) {
        this.responseObj.response.card = new CardBuilder()
            .createStandardCard(title, content, imageUrl, imageUrl)
            .build();
        return this.responseObj;
    }

    /**
     * Returns Alexa CardBuilder instance
     * @return {CardBuilder}
     */
    getCardBuilder() {
        return new CardBuilder();
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
     * @param {string} subtitle
     * @param {string} content
     * @return {CardBuilder}
     */
    createSimpleCard(title, subtitle, content) {
        this.card = {
            type: 'Simple',
            title: title,
            content: content,
        };

        if (subtitle) {
            this.card.subtitle = subtitle;
        }

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
     * Returns card object
     * @return {object}
     */
    build() {
        return this.card;
    }

}

module.exports.Alexa = Alexa;
module.exports.Alexa.CardBuilder = CardBuilder;
