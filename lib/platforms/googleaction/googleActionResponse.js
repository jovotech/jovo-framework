'use strict';

const _ = require('lodash');

/**
 * AlexaResponse Class
 */
class GoogleActionResponse {
    /**
     * Constructor
     * @param {{}} responseObj
     */
    constructor(responseObj) {
        this.responseObj = {
            speech: '<speak></speak>',
            data: {
                google: {
                    expectUserResponse: true,
                    richResponse: {
                        items: [],
                    },
                },
            },
        };

        if (responseObj) {
            this.responseObj = responseObj;
        }
    }

    /**
     * Returns a contextOut object by the given name
     * @param {string} name
     * @return {*}
     */
    getContextOut(name) {
        for (let i = 0; i < this.responseObj.contextOut.length; i++) {
            if (this.responseObj.contextOut[i].name === name) {
                return this.responseObj.contextOut[i];
            }
        }
        return {};
    }

    /**
     * Sets context out object with an array of contexts
     * @param {array} contexts
     */
    setContextOut(contexts) {
        this.responseObj.contextOut = contexts;
    }

    /**
     * Adds context to contextOut array
     * @param {object} context
     */
    addContextOutObject(context) {
        this.responseObj.contextOut.push(context);
    }

    /**
     * Adds parameter to a given context object
     * @param {string} contextName
     * @param {string} parameterName
     * @param {*} value
     * @return {GoogleActionResponse}
     */
    addContextOutParameter(contextName, parameterName, value) {
        let context = this.getContextOut(contextName);
        _.set(context, `parameters.${parameterName}`, value);
        return this;
    }

    /**
     * Returns paramter for given context
     * @param {string} contextName
     * @param {string} parameterName
     * @return {*}
     */
    getContextOutParameter(contextName, parameterName) {
        let context = this.getContextOut(contextName);
        if (!context) {
            throw new Error('No context with name '+contextName+' found.');
        }
        return context.parameters[parameterName];
    }

    /**
     *
     * Speaks and closes session
     *
     * @param {string} speech
     * @return {GoogleActionResponse}
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
        return this;
    }

    /**
     * Creates object with reprompt.
     * Keeps session open
     * @param {string} speech
     * @param {string} repromptSpeech
     * @return {GoogleActionResponse}
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
        return this;
    }

    /**
     * Creates an audio tag within ssml
     *
     * Max 90 seconds
     * @param {string} audioUrl
     * @param {string} fallbackText
     * @return {GoogleActionResponse}
     */
    play(audioUrl, fallbackText) {
        let speech = '<speak><audio src="'+audioUrl+'">' + fallbackText + '</audio></speak>';
        return this.tell(speech);
    }

    /**
     * Returns speech text
     * @return {string}
     */
    getSpeechText() {
        if (this.responseObj.data.google.richResponse.items[0]
                .simpleResponse.ssml) {
            return removeSpeakTags(this.responseObj.data
                .google.richResponse.items[0]
                .simpleResponse.ssml);
        }
        return '';
    }


    /**
     * Implementation of generic withSimpleCard
     * Show a simple card to the response object
     * @param {string} title
     * @param {string} formattedText
     * @return {GoogleActionResponse} this
     */
    addBasicCard(title, formattedText) {
        this.responseObj.data.google.richResponse.items.push(
            new CardBuilder()
                .createBasicCard(title, formattedText)
                .build());
        return this;
    }

    /**
     * Implementation of generic withImageCard
     * Show a standard card with a card to the response object
     * @param {string} title
     * @param {string} formattedText
     * @param {string} imageUrl secure image url
     * @param {string} accessibilityText
     * @return {GoogleActionResponse} this
     */
    addImageCard(title, formattedText, imageUrl, accessibilityText) {
        this.responseObj.data.google.richResponse.items.push(
            new CardBuilder()
                .createImageCard(
                    title,
                    formattedText,
                    imageUrl,
                    accessibilityText)
                .build());
        return this;
    }

    /**
     * Returns response object
     * @return {object}
     */
    getResponseObject() {
        return this.responseObj;
    }

    /**
     * Checks if response is a tell request
     * @param {string} speechText
     * @return {boolean}
     */
    isTell(speechText) {
        try {
            if (this.responseObj.data.google.expectUserResponse !== false) {
                return false;
            }

            if (speechText) {
                if ( this.responseObj.speech !== toSSML(speechText)) {
                    return false;
                }
                if (this.responseObj.data.google.richResponse
                        .items[0].simpleResponse.ssml !== toSSML(speechText)) {
                    return false;
                }
            }
        } catch (err) {
            return false;
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
        try {
            if (this.responseObj.data.google.expectUserResponse !== true) {
                return false;
            }

            if (speechText) {
                if ( this.responseObj.speech !== toSSML(speechText) ) {
                    return false;
                }
                if (this.responseObj.data.google.richResponse
                        .items[0].simpleResponse.ssml !==
                    toSSML(speechText)) {
                    return false;
                }
            }
            if (repromptText) {
                if (this.responseObj.data.google.noInputPrompts[0]
                        .ssml !== toSSML(repromptText)) {
                    return false;
                }
            }
        } catch (err) {
            return false;
        }
        return true;
    }

    /**
     * Checks if response is a play response.
     * @param {string} audioUrl
     * @param {string} fallbackText
     * @return {boolean}
     */
    isPlay(audioUrl, fallbackText) {
        let speech = '<speak><audio src="'+audioUrl+'">' + fallbackText + '</audio></speak>';
        return this.isTell(speech);
    }

    /**
     * Checks if response is an empty response.
     * @return {boolean}
     */
    isEmptyResponse() {
        return this.isTell('<break time="1ms"/>');
    }

    /**
     * Checks if response object contains a basic card.
     * @param {string} title
     * @param {string} formattedText
     * @return {boolean}
     */
    hasBasicCard(title, formattedText) {
        try {
            let items = this.responseObj.data.google.richResponse.items;

            let basicCards = items.filter(function(item) {
                return item.basicCard;
            });

            if (basicCards.length === 0) {
                return false;
            }
            if (title) {
                if (basicCards[0].basicCard.title !== title) {
                    return false;
                }
            }

            if (formattedText) {
                if (basicCards[0].basicCard.formattedText !== formattedText) {
                    return false;
                }
            }
        } catch (err) {
            return false;
        }

        return true;
    }

    /**
     * Checks if response object contains a basic card with image.
     * @param {string} title
     * @param {string} formattedText
     * @param {string} imageUrl
     * @param {string} accessibilityText
     * @return {boolean}
     */
    hasImageCard(title, formattedText, imageUrl, accessibilityText) {
        if (!this.hasBasicCard(title, formattedText)) {
            return false;
        }
        try {
            let items = this.responseObj.data.google.richResponse.items;

            let basicCards = items.filter(function(item) {
                return item.basicCard;
            });

            if (basicCards.length === 0) {
                return false;
            }

            if (imageUrl) {
                if (basicCards[0].basicCard.image.url !== imageUrl) {
                    return false;
                }
            }
            if (accessibilityText) {
                if (basicCards[0].basicCard.image.accessibilityText !==
                    accessibilityText) {
                    return false;
                }
            }
        } catch (err) {
            return false;
        }
        return true;
    }

    /**
     * Checks if given context is in the response object.
     * @param {string} contextName
     * @param {string} parameterName
     * @param {string} value
     * @return {boolean}
     */
    hasContextOutParameter(contextName, parameterName, value) {
        let context = this.getContextOut(contextName);
        if (!context || Object.keys(context).length === 0) {
            return false;
        }
        if (parameterName) {
            let parameterValue = context.parameters[parameterName];
            if (parameterValue !== value) {
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
        return this.hasContextOutParameter('session', 'STATE', state);
    }
    /**
     * Checks if given string contains in speech text.
     * @param {string|array} str
     * @return {boolean}
     */
    speechTextContains(str) {
        let speechText = this.getSpeechText();
        if (str instanceof Array) {
           str.forEach(function(s) {
               return speechText.indexOf(str) > -1;
           });
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

module.exports.GoogleActionResponse = GoogleActionResponse;
module.exports.GoogleActionResponse.CardBuilder = CardBuilder;
