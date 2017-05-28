

var request;
var response;
var sessionAttributes;
var contextOut;
var contexts;

module.exports =  {

    init : function(request, response ) {
        this.request = request;
        this.response = response
        this.contexts = request.result.contexts;

        // console.log(this.getState());
        //this.sessionAttributes = request.session.attributes;
    },

    getIntentName : function() {
        return this.request.result.metadata.intentName;
    },

    getRequestType : function() {
        if (this.request.result.resolvedQuery === "GOOGLE_ASSISTANT_WELCOME") {
            return "LaunchRequest";
        }

        return "IntentRequest";
    },

    getSlots : function() {
        return this.request.result.parameters;
    },

    getState : function() {
        if(typeof(this.contexts) === "undefined") {
            return null;
        }
        for (var i = 0; i < this.contexts.length; i++) {
            var context = this.contexts[i];

            if(typeof(context["name"]) !== "undefined" && context["name"] === 'state') {
                return context["parameters"]["state"];
            }

        }
        return null;
    },

    setState : function(state) {
        this.contextOut = [
            {
                'name' : "state",
                lifespan : 1,
                parameters : {
                    "state" : state,
                }
            }
        ]

    },

    getSlot : function(name) {
        return this.getSlots()[name];
    },


    getSlotValue  : function(name) {
        return this.getSlot(name).value;
    },

    tell : function (speech) {
        var responseObj = {
            speech : speech
        }
        if(typeof(this.contextOut) !== "undefined") {
            responseObj.contextOut = this.contextOut;
        }
        return responseObj;
    },

    ask : function (speech, repromptSpeech) {

        var responseObj = {
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
}