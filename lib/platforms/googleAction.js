'use strict';
const jovo = require('../jovo');
/**
 * Class GoogleAction (GoogleHome + GoogleAssistant)
 */
class GoogleAction {

    /**
     * Constructor
     * @public
     * @param {Jovo} jovo
     * @param {object} request
     * @param {object} response
     */
    constructor(jovo, request, response) {
        this.request = request;
        this.response = response;
        this.jovo = jovo;
        // console.log(this.request);

        this.responseObj = {
            speech: '<speak></speak>',
            contextOut: this.request.result.contexts,
            data: {
                google: {
                    expectUserResponse: true,
                    richResponse: {
                        items: [],
                    },
                },
            },
        };
    }


    /** *****************************************************
     *
     * Platform specific functions
     *
     ************************************/

    /**
     * Returns request JSON sent by google
     * @public
     * @return {GoogleAction.request}
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
     * @public
     * @return {string} UserId
     */
    getUserId() {
        if (!this.request.originalRequest) {
            return 'API.AI Debugging';
        }
        return this.request.originalRequest.data.user.userId;
    }

    /**
     * Returns intent name
     * @public
     * @return {string}
     */
    getIntentName() {
        return this.request.result.metadata.intentName;
    }

    /**
     * Returns request type
     * Launch, Intent
     * @public
     * @return {string}
     */
    getRequestType() {
        if (this.request.result.resolvedQuery === 'GOOGLE_ASSISTANT_WELCOME') {
            return jovo.REQUEST_TYPE_ENUM.LAUNCH;
        }

        return jovo.REQUEST_TYPE_ENUM.INTENT;
    }


    /**
     * TODO: possible with GoogleAction?
     * @public
     * @return {*}
     */
    getEndReason() {
        return 'DUMMY';
    }

    /**
     * Returns object with name => value objects
     *
     * {
     *   inputame1 : value1,
     *   inputname2 : value2
     * }
     * @public
     * @return {*}
     */
    getInputs() {
        return this.request.result.parameters;
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
     * Returns state value stored in the request session
     * @public
     * @return {*}
     */
    getState() {
      return this.getSessionAttribute('state');
    }

    /** ***********************************************************
     *
     * RESPONSE BUILDER FUNCTIONS
     *
     */


    /**
     * Stores state in response object session
     * @public
     * @param {string} state
     */
    setState(state) {
        this.setSessionAttribute('state', state);
    }

    /**
     * Sets session attribute with value
     * @public
     * @param {string} name
     * @param {*} value
     */
    setSessionAttribute(name, value) {
        // iterate context objects
        let existingSessionContext = false;
        for (let i = 0; i < this.responseObj.contextOut.length; i++) {
            // find session context
            if (this.responseObj.contextOut[i].name === 'session') {
                this.responseObj.contextOut[i].parameters[name] = value;
                existingSessionContext = true;
            }
        }

        if (existingSessionContext === false) {
            let sessionContext = {};
            sessionContext['name'] = 'session';
            sessionContext['lifespan'] = 10000; // TODO: check max
            sessionContext['parameters'] = {};
            sessionContext['parameters'][name] = value;
            this.responseObj.contextOut.push(
                sessionContext
            );
        }
     }

    /**
     * Returns session attribute value
     * @public
     * @param {string} name
     * @return {*}
     */
    getSessionAttribute(name) {
        for (let i = 0; i < this.responseObj.contextOut.length; i++) {
            // find session context
            if (this.responseObj.contextOut[i].name === 'session') {
                return this.responseObj.contextOut[i].parameters[name];
            }
        }
    }

    /**
     * Returns all session attributes
     * @public
     * @return {*}
     */
    getSessionAttributes() {
        for (let i = 0; i < this.responseObj.contextOut.length; i++) {
            // find session context
            if (this.responseObj.contextOut[i].name === 'session') {
                return this.responseObj.contextOut[i].parameters;
            }
        }
        return {};
    }


    /**
     * Sets speech output
     * @public
     * @param {string} speech
     */
    tell(speech) {
        this.responseObj.speech = speech;
        this.responseObj.data.google.expectUserResponse = false;
        this.responseObj.data.google.richResponse.items.unshift(
            {
                simpleResponse: {
                    ssml: speech,
                },
            }
        );
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
        this.responseObj.speech = speech;
        this.responseObj.data.google.expectUserResponse = true;
        this.responseObj.data.google.richResponse.items.unshift(
            {
                simpleResponse: {
                    ssml: speech,
                },
            }
        );
        this.responseObj.data.google.noInputPrompts = [
                            {
                                ssml: repromptSpeech,
                            },
        ];
    }

    /**
     * Returns response object
     * @public
     * @return {object}
     */
    getResponseObject() {
        return this.responseObj;
    }

    /**
     * Returns speech text
     * @return {string}
     */
    getSpeechText() {
        if (this.responseObj.data.google.richResponse.items[0]
                .simpleResponse.ssml) {
            return this.responseObj.data.google.richResponse.items[0]
                .simpleResponse.ssml;
        }
        return '';
    }

    /**
     * Sets "raw" response object
     * @param {object} responseObj
     */
    setResponseObject(responseObj) {
        this.responseObj = responseObj;
    }

    /**
     * Implementation of generic withSimpleCard
     * Adds a simple card to the response object
     * @public
     * @param {string} title
     * @param {string} formattedText
     */
    addSimpleCard(title, formattedText ) {
        this.responseObj.data.google.richResponse.items.push(
            new CardBuilder()
                .createBasicCard(title, formattedText)
                .build());
    }
    /**
     * Implementation of generic withImageCard
     * Adds a standard card with a card to the response object
     * @public
     * @param {string} title
     * @param {string} formattedText
     * @param {string} imageUrl secured image url
     */
    addImageCard(title, formattedText, imageUrl ) {
        this.responseObj.data.google.richResponse.items.push(
            new CardBuilder()
                .createImageCard(title, formattedText, imageUrl, title)
                .build());
    }

    /**
     * Returns original request obj
     * @return {*}
     */
    getOriginalRequest() {
        return this.request.originalRequest;
    }
    /**
     * Returns Google Assistant CardBuilder instance
     * @public
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
     * @constructor
     * @public
     */
    constructor() {
        this.card = {};
    }

    /**
     * Creates basic card
     * @public
     * @param {string} title
     * @param {string} formattedText
     * @return {CardBuilder}
     */
    createBasicCard(title, formattedText) {
        this.card = {
            basicCard: {
                title: title,
                formattedText: formattedText,
            },
        };
        return this;
    }

    /**
     * Creates image card
     * @public
     * @param {string} title
     * @param {string} formattedText
     * @param {string} imageUrl
     * @param {string} accessibilityText
     * @return {CardBuilder}
     */
    createImageCard(title, formattedText, imageUrl, accessibilityText) {
        this.card = {
            basicCard: {
                title: title,
                formattedText: formattedText,
                image: {
                    url: imageUrl,
                    accessibilityText: accessibilityText,
                },
            },
        };

        return this;
    }

    /**
     * Returns card object
     * @public
     * @return {object}
     */
    build() {
        return this.card;
    }

}

module.exports.GoogleAction = GoogleAction;
module.exports.GoogleAction.CardBuilder = CardBuilder;
