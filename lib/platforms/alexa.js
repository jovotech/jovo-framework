"use strict";

const Alexa = class {
    constructor(request, response) {
        this.request = request;
        this.response = response

        let sessionAttributes = {};




        if(typeof request.session.attributes !== "undefined") {
            sessionAttributes = request.session.attributes;
        }
        console.log("----------")
        console.log(sessionAttributes)
        console.log("----------")



        this.responseObj = {
            version : "1.0",
            sessionAttributes : sessionAttributes,
            response : {
                shouldEndSession : true
            }
        };

    }


    /*******************************************************
     *
     * Platform specific functions
     *
     ************************************/

    /**
     * Returns request JSON sent by alexa
     * @returns {Alexa.request}
     */

    request () {
        return this.request;
    }



    /*******************************************************
     *
     * JOVO wrapper functions
     *
     ************************************/

    /**
     * Returns unique user id
     *
     * @returns {string} UserId
     */

    getUserId () {
        return this.request.session.user.userId;
    }


    /**
     * Returns intent name
     */

    getIntentName() {
        return this.request.request.intent.name;
    }

    /**
     * Returns request type
     *
     * LaunchRequest, IntentRequest SessionEndedRequest
     *
     */
    getRequestType() {
        return this.request.request.type;
    }


    /**
     * Returns reason code for an end of a session
     *
     * STOP_INTENT = User says "Stop"
     * MAX_PROMPTS_EXCEEDED = No user input on reprompt
     * ERROR
     *
     * @returns {*}
     */

    getEndReason() {

        if(this.getRequestType() === "SessionEndedRequest") {
            return this.request.request.reason;
        }

        if(this.getRequestType() === "IntentRequest" && this.getIntentName() === "AMAZON.StopIntent") {
            return "STOP_INTENT";
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
     * @returns {{}}
     */


    getInputs() {
        let inputs = {};

        if(!this.request.request.intent.slots) {
            return inputs;
        }

        let slotNames = Object.keys(this.request.request.intent.slots);

        for(let i = 0; i < slotNames.length; i++) {
            let key = slotNames[i];
            inputs[key] = this.request.request.intent.slots[key].value;
        }
        return inputs;

    }


    /**
     * Get input object by name
     * @param name
     * @returns {*}
     */

    getInput (name) {
        return this.getInputs()[name];
    }


    /**
     * Returns type of platform
     * @returns {string}
     */

    getType () {
        return "Alexa";
    }


    /**
     * Returns state value stored in the request session
     *
     * @returns {*}
     */

    getState () {
        if(typeof(this.request.session.attributes) === "undefined") {
            return null;
        }
        return this.request.session.attributes.STATE;
    }

    /*************************************************************
     *
     * RESPONSE BUILDER FUNCTIONS
     *
     */



    /**
     * Stores state in response object session
     *
     * @param state
     */

    setState(state) {
        this.responseObj.sessionAttributes["STATE"] = state;
    }


    setSessionAttribute (name, value) {
        this.responseObj.sessionAttributes[name] = value;
    }

    getSessionAttribute (name) {
        return this.responseObj.sessionAttributes[name];
    }



    getSessionAttributes () {
        return this.responseObj.sessionAttributes;
    }


    /**
     *
     * Sets speech output with ShouldEndSession = true
     *
     * @param speech
     */

    tell (speech) {
        this.responseObj.response = {
            outputSpeech : {
                type : "SSML",
                ssml : speech,
            },
            shouldEndSession : true,
        };

        return this.responseObj;
    }


    /**
     * Creates an audio tag within ssml
     *
     * Max 90 seconds
     * @param audio_url
     * @returns {*}
     */

    play (audio_url) {
        let speech = '<speak> <audio src="'+audio_url+'"/></speak>';
            return this.tell(speech);
    }

    /**
     * Creates object with reprompt.
     * Keeps session open
     * @param speech
     * @param repromptSpeech
     */

    ask (speech, repromptSpeech) {

        this.responseObj.response = {
            outputSpeech : {
                type : "SSML",
                ssml : speech,
            },
            reprompt : {
                outputSpeech : {
                    type : "SSML",
                    ssml : repromptSpeech
                }
            },
            shouldEndSession : false,
        };
        return this.responseObj;
    }


    getResponseObject() {
        return this.responseObj;
    }


    /*************************************************************************************/

    withSimpleCard (title, content) {
        this.responseObj.response.card = new CardBuilder().createSimpleCard(title, null, content).build();
        return this.responseObj;
    }

    withImageCard (title, content, imageUrl) {
        this.responseObj.response.card = new CardBuilder().createStandardCard(title, content, imageUrl, imageUrl).build();
        return this.responseObj;
    }

    withStandardCard (title, content, imageUrl) {
        this.responseObj.response.card = new CardBuilder().createStandardCard(title, content, imageUrl, imageUrl).build();
        return this.responseObj;
    }

    getCardBuilder() {
        return new CardBuilder();
    }

};

module.exports.Alexa = Alexa;


const CardBuilder = class {

    constructor() {
        this.card = {};
    }

    createSimpleCard(title, subtitle, content) {
        this.card = {
            type : "Simple",
            title : title,
            content : content
        };

        if(subtitle) {
            this.card.subtitle = subtitle;
        }

        return this;
    }

    createStandardCard(title, text, smallImageUrl, largeImageUrl) {
        this.card = {
            type : "Standard",
            title : title,
            text : text,
            image : {
                smallImageUrl : "https://www.swetlow.de/pizzaSmall.jpg",
                largeImageUrl : "https://www.swetlow.de/pizzaLarge.jpg"
            }
        };

        return this;
    }

    createLinkAccountCard() {
        this.card = {
            type : "LinkAccount",
        };

        return this;
    }


    build() {
        return this.card;
    }

};