'use strict';

const jovo = require('../jovo');

/**
 * Alexa specific implementations
 */
class AlexaSkill {

    /**
     * Constructor
     * @param {Jovo} jovo
     * @param {object} request
     * @param {object} response
     */
    constructor(jovo, request, response) {
        this.jovo = jovo;
        this.request = request;
        this.response = response;
        this.responseObj = {
            version: '1.0',
            response: {
                shouldEndSession: true,
            },
        };

        if (this.getRequestType() !== 'AUDIOPLAYER') {
            this.responseObj.sessionAttributes = {};
            if (request.session.attributes) {
                this.responseObj.sessionAttributes = request.session.attributes;
            }
        } else {
            this.audioPlayer = new AudioPlayer(jovo, this.responseObj, request);
        }
    }

    /** *****************************************************
     *
     * Platform specific functions
     *
     ************************************/

    /**
     * Returns request JSON sent by alexa
     * @return {AlexaSkill.request}
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
        if (this.request.session) {
            return this.request.session.user.userId;
        } else if (this.request.context.System) {
            return this.request.context.System.user.userId;
        }
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
        if (this.request.request.type.substring(0, 11) === 'AudioPlayer') {
            return 'AUDIOPLAYER';
        }

        if (this.request.request.type === 'LaunchRequest') {
            return jovo.REQUEST_TYPE_ENUM.LAUNCH;
        }

        if (this.request.request.type === 'IntentRequest') {
            return jovo.REQUEST_TYPE_ENUM.INTENT;
        }

        if (this.request.request.type === 'SessionEndedRequest') {
            return jovo.REQUEST_TYPE_ENUM.END;
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
        return jovo.PLATFORM_ENUM.ALEXA_SKILL;
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
     * Returns alexa request session
     * @return {RequestBuilderAlexaSkill.session}
     */
    getSession() {
        return this.request.session;
    }

    getApplicationId() {
        this.request.session.application.applicationId;
    }

    /**
     *
     * Sets speech output with ShouldEndSession = true
     *
     * @param {string} speech
     */
    tell(speech) {
        this.responseObj.response.outputSpeech = {
            type: 'SSML',
            ssml: speech,
        };
        this.responseObj.response.shouldEndSession = true;
    }


    /**
     * Creates an audio tag within ssml
     *
     * Max 90 seconds
     * @param {string} audioUrl
     */
    play(audioUrl) {
        let speech = '<speak><audio src="'+audioUrl+'"/></speak>';
        this.tell(speech);
    }

    /**
     * Creates object with reprompt.
     * Keeps session open
     * @param {string} speech
     * @param {string} repromptSpeech
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
    }

    /**
     * Returns speech text
     * @return {string}
     */
    getSpeechText() {
      if (this.responseObj.response.outputSpeech.ssml) {
          return this.responseObj.response.outputSpeech.ssml;
      }
      return '';
    }

    /**
     * Returns slots
     * @return {*}
     */
    getSlots() {
        return this.request.request.intent.slots;
    }

    /**
     * Returns response object
     * @return {object}
     */
    getResponseObject() {
        return this.responseObj;
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
     * @param {string} title
     * @param {string} content
     */
    addSimpleCard(title, content) {
        this.responseObj.response.card = new CardBuilder()
            .createSimpleCard(title, null, content)
            .build();
    }

    /**
     * Implementation of generic withImageCard
     * Adds a standard card with a card to the response object
     * @param {string} title
     * @param {string} content
     * @param {string} imageUrl secured image url
     */
    addImageCard(title, content, imageUrl) {
        this.responseObj.response.card = new CardBuilder()
            .createStandardCard(title, content, imageUrl, imageUrl)
            .build();
    }

    /**
     * Returns AlexaSkill CardBuilder instance
     * @return {CardBuilder}
     */
    getCardBuilder() {
        return new CardBuilder();
    }

    /**
     * Returns AudioPlayer instance
     * @return {AudioPlayer}
     * @constructor
     */
    getAudioPlayer() {
        if (this.audioPlayer) {
            return this.audioPlayer;
        }
        return new AudioPlayer(this.jovo, this.responseObj, this.request);
    }

    /**
     * Deletes audioPlayer instance
     */
    resetAudioPlayer() {
        delete this.audioPlayer;
    }
}

/**
 * Class AudioPlayer
 */
class AudioPlayer {

    /**
     * constructor
     * @param {Jovo} jovo
     * @param {object} responseObj
     * @param {object} request
     */
    constructor(jovo, responseObj, request) {
        this.jovo = jovo;
        this.playerActivity = request.context.AudioPlayer.playerActivity;
        if (request.context.AudioPlayer.token) {
            this.token = request.context.AudioPlayer.token;
        } else {
            this.token = request.request.token;
        }

        if (request.context.AudioPlayer.offsetInMilliseconds) {
            this.offsetInMilliseconds = request.context
                                        .AudioPlayer.offsetInMilliseconds;
        } else {
            this.offsetInMilliseconds = request.request.offsetInMilliseconds;
        }

        this.type = request.request.type;

        this.responseObj = responseObj;
        this.responseObj.response.directives = [];
    }

    /**
     * Returns type of audioplayer request
     * @return {string}
     */
    getType() {
        return this.type;
    }

    /**
     * Returns token
     * @return {string}
     */
    getToken() {
        return this.token;
    }

    /**
     * Return offsetInMilliseconds
     * @return {number}
     */
    getOffsetInMilliseconds() {
        return this.offsetInMilliseconds;
    }

    /**
     * Plays audio file
     * @param {string} url
     * @param {string} token
     * @param {'ENQUEUE'|'REPLACE_ALL'|'REPLACE_ENQUEUED'} playBehavior
     */
    play(url, token, playBehavior) {
        if (!playBehavior) {
            playBehavior = 'REPLACE_ALL';
        }

        let directive = {
            type: 'AudioPlayer.Play',
            playBehavior: playBehavior,
            audioItem: this.createAudioItem(url, token),
        };
        this.responseObj.response.directives.push(directive);
        console.log('++++++++++++++++++++++++++++++++');
        console.log(JSON.stringify(this.responseObj, null, '\t'));
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Stops audio stream
     */
    stop() {
        let directive = {
            type: 'AudioPlayer.Stop',
        };
        this.responseObj.response.directives.push(directive);
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Clear
     * @param {'CLEAR_ENQUEUED'|'CLEAR_ALL'} clearBehavior
     */
    clearQueue(clearBehavior) {
        if (!clearBehavior) {
            clearBehavior = 'CLEAR_ALL';
        }

        let directive = {
            type: 'AudioPlayer.ClearQueue',
            clearBehavior: clearBehavior,
        };
        this.responseObj.response.directives.push(directive);
        this.jovo.emit('respond', this.jovo);
    }

    /**
     * Creates Audio item
     * @param {string} url
     * @param {string} token
     * @return {*}
     */
    createAudioItem(url, token) {
        let stream = {
            stream: {
                token: token,
                url: url,
                offsetInMilliseconds: 10000, //this.offsetInMilliseconds,
            },
        };

        if (this.expectedPreviousToken) {
            stream.stream.expectedPreviousToken = this.expectedPreviousToken;
        }

        return stream;
    }


    /**
     * Adds offset in ms to audio item
     * @param {number} offsetInMilliseconds
     * @return {AudioPlayer}
     */
    setOffsetInMilliseconds(offsetInMilliseconds) {
        this.offsetInMilliseconds = offsetInMilliseconds;

        return this;
    }

    /*eslint-disable */
    /**
     * Adds expectedPreviousToken to audio item
     * @link https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-audioplayer-interface-reference#play // eslint-disable-line no-use-before-define
     * @param {string} expectedPreviousToken
     * @return {AudioPlayer}
     */
    setExpectedPreviousToken(expectedPreviousToken) {
        this.expectedPreviousToken = expectedPreviousToken;
        return this;
    }
    /*eslint-enable */
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

module.exports.AlexaSkill = AlexaSkill;
module.exports.AlexaSkill.CardBuilder = CardBuilder;
module.exports.AlexaSkill.AudioPlayer = AudioPlayer;
