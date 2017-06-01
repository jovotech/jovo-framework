'use strict';

const Alexa  = class  {

    constructor(request, response) {
        this.request = request;
        this.response = response
        this.sessionAttributes = request.session.attributes;

        this.responseObj = {
            version : "1.0",
            sessionAttributes : {},
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

    request() {
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
        this.tell(speech);
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
    }


    getResponseObject() {
        return this.responseObj;
    }





    /*************************************************************************************/

    addSimpleCard (responseObj, title, subtitle, content) {
        responseObj.response.card = {
            type : "Simple",
            title : title,
            content : content
        }

        if(subtitle) {
            responseObj.response.card.subtitle = subtitle;
        }


        return responseObj;
    }

    addImageCard (responseObj, title, content, image_url) {
        return this.addStandardCard(responseObj, title, content, image_url);
    }

    addStandardCard (responseObj, title, content, image_url) {
        responseObj.response.card = {
            type : "Standard",
            title : title,
            text : content,
            image : {
                smallImageUrl : image_url,
                largeImageUrl : image_url
            }
        }
        return responseObj;
    }


};

module.exports.Alexa = Alexa;