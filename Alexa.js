

var request;
var response;
var sessionAttributes;

module.exports =  {

    init : function(request, response ) {
        this.request = request;
        this.response = response
        this.sessionAttributes = request.session.attributes;
    },

    getIntentName : function() {
        return this.request.request.intent.name;
    },

    getRequestType : function() {
        return this.request.request.type;
    },

    getSlots : function() {
        var slots = {};

        if(typeof(this.request.request.intent.slots) === "undefined") {
            return slots;
        }
        var slotNames = Object.keys(this.request.request.intent.slots);

        for(var i = 0; i < slotNames.length; i++) {
            var key = slotNames[i];
            slots[key] = this.request.request.intent.slots[key].value;
        }
        return slots;

    },

    getState : function() {
        if(typeof(this.request.session.attributes) === "undefined") {
            return null;
        }
        return this.request.session.attributes.STATE;
    },

    setState : function(state) {
        if(typeof (this.sessionAttributes) === "undefined") {
            this.sessionAttributes = {};
        }
        this.sessionAttributes["STATE"] = state;
    },

    getAttribute : function (name) {
        return this.sessionAttributes[name];
    },

    setAttribute : function (name, value) {
        if(typeof (this.sessionAttributes) === "undefined") {
            this.sessionAttributes = {};
        }
        this.sessionAttributes[name] = value;
    },

    getSlot : function(name) {
        return this.getSlots()[name];
    },

    getSlotValue  : function(name) {
        return this.getSlot(name).value;
    },

    tell : function (speech) {
        return {
            version : "1.0",
            sessionAttributes : this.sessionAttributes,
            response : {
                outputSpeech : {
                    type : "PlainText",
                    text : speech,
                },
                shouldEndSession : true,
            }

        };
    },

    ask : function (speech, repromptSpeech) {
        return {
            version : "1.0",
            sessionAttributes : this.sessionAttributes,
            response : {
                outputSpeech : {
                    type : "PlainText",
                    text : speech
                },
                reprompt : {
                    outputSpeech : {
                        type : "PlainText",
                        text : repromptSpeech
                    }
                },
                shouldEndSession : false
            }
        };
    }


}