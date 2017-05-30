'use strict';

const Alexa  = class  {

    constructor(request, response) {
        this.request = request;
        this.response = response
        this.sessionAttributes = request.session.attributes;
    }


    /**
     * Returns unique user id
     *
     * @returns {*}
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

    getEndReason() {
        if(this.getRequestType() === "SessionEndedRequest") {
            return this.request.request.reason;
        }

        if(this.getRequestType() === "IntentRequest" && this.getIntentName() === "AMAZON.StopIntent") {
            return "STOP_INTENT";
        }
    }


    getRequestType() {
        return this.request.request.type;
    }

    getSlots() {
        let slots = {};

        if(typeof(this.request.request.intent.slots) === "undefined") {
            return slots;
        }
        let slotNames = Object.keys(this.request.request.intent.slots);

        for(let i = 0; i < slotNames.length; i++) {
            let key = slotNames[i];
            slots[key] = this.request.request.intent.slots[key].value;
        }
        return slots;

    }

    getState () {
        if(typeof(this.request.session.attributes) === "undefined") {
            return null;
        }
        return this.request.session.attributes.STATE;
    }

    setState(state) {
        if(typeof (this.sessionAttributes) === "undefined") {
            this.sessionAttributes = {};
        }
        this.sessionAttributes["STATE"] = state;
    }

    getAttribute (name) {
        return this.sessionAttributes[name];
    }

    setAttribute (name, value) {
        if(typeof (this.sessionAttributes) === "undefined") {
            this.sessionAttributes = {};
        }
        this.sessionAttributes[name] = value;
    }

    getSlot (name) {
        return this.getSlots()[name];
    }

    getSlotValue (name) {
        return this.getSlot(name).value;
    }

    tell (speech) {

        return {
            version : "1.0",
            sessionAttributes : this.sessionAttributes,
            response : {
                outputSpeech : {
                    type : "SSML",
                    ssml : speech,
                },
                shouldEndSession : true,
            }

        };
    }

    play (audio_url) {
        let speech = '<speak> <audio src="'+audio_url+'"/></speak>';
        return this.tell(speech);
    }

    ask (speech, repromptSpeech) {

        return {
            version : "1.0",
            sessionAttributes : this.sessionAttributes,
            response : {
                outputSpeech : {
                    type : "SSML",
                    ssml : speech
                },
                reprompt : {
                    outputSpeech : {
                        type : "SSML",
                        ssml : repromptSpeech
                    }
                },
                shouldEndSession : false
            }
        };
    }

    sayNothingEndSession () {
        return {
            version : "1.0",
            sessionAttributes : this.sessionAttributes,
            response : {
                shouldEndSession : true
            }
        };
    }


};

module.exports.Alexa = Alexa;