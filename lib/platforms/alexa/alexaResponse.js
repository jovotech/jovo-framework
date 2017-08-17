'use strict';

const _ = require('lodash');

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
        };

        if (responseObj) {
            this.responseObj = responseObj;
        }
    }


    /**
     *
     * Sets speech output with ShouldEndSession = true
     *
     * @param {string} speech
     * @return {AlexaResponse}
     */
    tell(speech) {
        this.responseObj.response.outputSpeech = {
            type: 'SSML',
            ssml: speech,
        };
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
            ssml: speech,
        };
        this.responseObj.response.reprompt = {
            outputSpeech: {
                type: 'SSML',
                ssml: repromptSpeech,
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
        let speech = '<speak><audio src="'+audioUrl+'"/></speak>';
        return this.tell(speech);
    }

    /**
     * Implementation of generic withSimpleCard
     * Show a simple card to the response object
     * @param {string} title
     * @param {string} subtitle
     * @param {string} content
     * @return {AlexaResponse} this
     */
    addSimpleCard(title, subtitle, content) {
        this.responseObj.response.card = new CardBuilder()
            .createSimpleCard(title, subtitle, content)
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
     * @param {object} updatedIntent
     * @return {AlexaResponse}
     */
    dialogElicitSlot(slotToElicit, speechText, updatedIntent) {
        if (!slotToElicit) {
            throw new Error('slotToElicit must be set');
        }
        if (!speechText) {
            throw new Error('speechText must be set');
        }
        // set directive
        this.dialogDirective({
            type: 'Dialog.ElicitSlot',
            slotToElicit: slotToElicit,
        }, updatedIntent);

        this.setOutputSpeech(speechText);
        this.setRepromptOutputSpeech(speechText);
        return this;
    }

    /**
     * Let alexa ask user to confirm slot with yes or no
     * @param {string} slotToConfirm name of the slot
     * @param {string} speechText
     * @param {object} updatedIntent
     * @return {AlexaResponse}
     */
    dialogConfirmSlot(slotToConfirm, speechText, updatedIntent) {
        if (!slotToConfirm) {
            throw new Error('slotToElicit must be set');
        }
        if (!speechText) {
            throw new Error('speechText must be set');
        }
        // set directive
        this.dialogDirective({
            type: 'Dialog.ConfirmSlot',
            slotToConfirm: slotToConfirm,
        }, updatedIntent);

        this.setOutputSpeech(speechText);
        return this;
    }
    /**
     * Let alexa ask user to confirm intent with yes or no
     * @param {string} speechText
     * @param {object} updatedIntent
     * @return {AlexaResponse}
     */
    dialogConfirmIntent(speechText, updatedIntent) {
        if (!speechText) {
            throw new Error('speechText must be set');
        }
        // set directive
        this.dialogDirective({
            type: 'Dialog.ConfirmIntent',
        }, updatedIntent);

        this.setOutputSpeech(speechText);
        return this;
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
        return removeSpeakTags(this.responseObj.response.outputSpeech.ssml);
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
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogElicitSlot(updatedIntent) {
        return this.isDialogDirective('Dialog.ElicitSlot', updatedIntent);
    }

    /**
     * Checks if response is a dialog confirm slot response.
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogConfirmSlot(updatedIntent) {
        return this.isDialogDirective('Dialog.ConfirmSlot', updatedIntent);
    }

    /**
     * Checks if response is a dialog confirm intent response.
     * @param {object} updatedIntent
     * @return {boolean}
     */
    isDialogConfirmIntent(updatedIntent) {
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
