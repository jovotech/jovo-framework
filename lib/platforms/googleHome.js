'use strict';

/**
 * Class GoogleHome / GoogleAssistant
 */
class GoogleHome {

    /**
     * Constructor
     * @param {object} request
     * @param {object} response
     */
    constructor(request, response) {
        this.request = request;
        this.response = response;

        console.log('----- GOOGLE HOME ------');
        console.log(request.originalRequest.data.surface);
        console.log(request.originalRequest.data.inputs);
        console.log(request.originalRequest.data.inputs[0]['rawInputs']);
        console.log('-----------');

        this.responseObj = {
            speech: '<speak></speak>',
            contextOut: this.request.result.contexts
        };
    }


    /** *****************************************************
     *
     * Platform specific functions
     *
     ************************************/

    /**
     * Returns request JSON sent by google
     * @return {GoogleHome.request}
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
     * @return {string} UserId
     */
    getUserId() {
        return this.request.originalRequest.data.user.userId;
    }

    /**
     * Returns intent name
     * @return {string}
     */
    getIntentName() {
        return this.request.result.metadata.intentName;
    }

    /**
     * Returns request type
     * Launch, Intent
     * @return {string}
     */
    getRequestType() {
        if (this.request.result.resolvedQuery === 'GOOGLE_ASSISTANT_WELCOME') {
            return 'LAUNCH';
        }

        return 'INTENT';
    }


    /**
     * TODO: possible with GoogleHome?
     *
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
     *
     * @return {*}
     */
    getInputs() {
        return this.request.result.parameters;
    }
    /**
     * Get input object by name
     * @param {string} name
     * @return {*}
     */
    getInput(name) {
        return this.getInputs()[name];
    }

    /**
     * Returns type of platform
     * @return {string}
     */
    getType() {
        return 'GoogleHome';
    }
    /**
     * Returns state value stored in the request session
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
     *
     * @param {string} state
     */
    setState(state) {
        this.setSessionAttribute('state', state);
    }

    /**
     * Sets session attribute with value
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
     *
     * Sets speech output
     * @param {string} speech
     * @return {object}
     */
    tell(speech) {
        this.responseObj.speech = speech;
        this.responseObj.data = {
            google: {
                expect_user_response: false,
                rich_response: {
                    items: [
                        {
                            simpleResponse: {
                                ssml: speech,
                            },
                        },
                    ],
                },
            },
        };

        return this.responseObj;
    }

    /**
     * Creates an audio tag within ssml
     *
     * Max 90 seconds
     * @param {string} audioUrl
     * @param {string} fallbackText
     * @return {*}
     */
    play(audioUrl, fallbackText) {
        let speech = '<speak> <audio src="'+audioUrl+'">' + fallbackText + '</audio></speak>';
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
        this.responseObj.speech = speech;

        this.responseObj.data = {
                google: {
                    expectUserResponse: true,
                    rich_response: {
                        items: [
                            {
                                simpleResponse: {
                                    ssml: speech,
                                },
                            },
                        ],
                    },
                    noInputPrompts: [
                        {
                            ssml: repromptSpeech,
                        },
                    ],
                },

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
     * @param {string} formattedText
     * @return {object}
     */
    withSimpleCard(title, formattedText ) {
        this.responseObj.data.google.rich_response.items.push(
            new CardBuilder()
                .createBasicCard(title, formattedText)
                .build());
        return this.responseObj;
    }
    /**
     * Implementation of generic withImageCard
     * Adds a standard card with a card to the response object
     * @param {string} title
     * @param {string} formattedText
     * @param {string} imageUrl secured image url
     * @return {*}
     */
    withImageCard(title, formattedText, imageUrl ) {
        this.responseObj.data.google.rich_response.items.push(
            new CardBuilder()
                .createImageCard(title, formattedText, imageUrl, title)
                .build());
        return this.responseObj;
    }

    /**
     * Returns Google Assistant CardBuilder instance
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
     * Creates basic card
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
     * @return {object}
     */
    build() {
        return this.card;
    }

}

module.exports.GoogleHome = GoogleHome;
module.exports.GoogleHome.CardBuilder = CardBuilder;
