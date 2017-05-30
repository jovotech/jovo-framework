'use strict';

const GoogleHome = class {

    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    getIntentName () {
        return this.request.result.metadata.intentName;
    }

    getRequestType() {
        if (this.request.result.resolvedQuery === "GOOGLE_ASSISTANT_WELCOME") {
            return "LaunchRequest";
        }

        return "IntentRequest";
    }

    getSlots () {
        return this.request.result.parameters;
    }

    getState () {
        if(typeof(this.contexts) === "undefined") {
            return null;
        }
        for (let i = 0; i < this.contexts.length; i++) {
            let context = this.contexts[i];

            if(typeof(context["name"]) !== "undefined" && context["name"] === 'state') {
                return context["parameters"]["state"];
            }

        }
        return null;
    }

    setState (state) {
        this.contextOut = [
            {
                'name' : "state",
                lifespan : 1,
                parameters : {
                    "state" : state,
                }
            }
        ]

    }

    getSlot (name) {
        return this.getSlots()[name];
    }


    getSlotValue (name) {
        return this.getSlot(name).value;
    }

    tell  (speech) {

        let responseObj = {
            speech : speech
        };
        if(typeof(this.contextOut) !== "undefined") {
            responseObj.contextOut = this.contextOut;
        }
        return responseObj;
    }

    play (audio_url, fallbackText) {
        let speech = '<speak> <audio src="'+audio_url+'">' + fallbackText + '</audio></speak>';
        return this.tell(speech);
    }

    ask (speech, repromptSpeech) {


        let responseObj = {
            speech : speech,
            data : {
                google : {
                    expectUserResponse: true,
                    noInputPrompts: [ {
                        textToSpeech : repromptSpeech
                    }
                    ]
                }

            }

        };
        if(typeof(this.contextOut) !== "undefined") {
            responseObj.contextOut = this.contextOut;
        }
        return responseObj;
    }

    sayNothingEndSession () {
        return {
            speech : "<speak></speak>",
        };
    }

};


module.exports.GoogleHome = GoogleHome;