'use strict';

const ALEXA = "alexa";
const GOOGLE_HOME = "google_home";

const HANDLER_LAUNCH = "LAUNCH";
const HANDLER_END = "END";

const LAUNCH_REQUEST = "LaunchRequest";
const INTENT_REQUEST = "IntentRequest";
const SESSION_ENDED_REQUEST = "SessionEndedRequest";

const JOVO_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc1MjFhODA1NzRjNjEwMThhMWE1ZjNmNDc5ZWFlNGNhZDk0ZTgyYmU0ZjNjM2JmYjQ1NTg3ZThhZTg1MDUwM2JjOWU3YmU3ZWMyM2NlNjllIn0.eyJhdWQiOiI0IiwianRpIjoiNzUyMWE4MDU3NGM2MTAxOGExYTVmM2Y0NzllYWU0Y2FkOTRlODJiZTRmM2MzYmZiNDU1ODdlOGFlODUwNTAzYmM5ZTdiZTdlYzIzY2U2OWUiLCJpYXQiOjE0OTUxNDIwNjcsIm5iZiI6MTQ5NTE0MjA2NywiZXhwIjoxNTI2Njc4MDY3LCJzdWIiOiI1Iiwic2NvcGVzIjpbXX0.khWk2vJlC0aVNUIMV2608IEMdJOVSWD_P4gCiw8VLN2xVLFKNDRGe6Mph7ZBRCYB9lYckqQax-QH0jdYtHjw3T9jQXVTCWXWof30rBbhD-S12eVeMwAznLgpynnxZZo4P2pRuB4ZsPdcI0xr1qIrrghTFceK1SGaJr3BKxuTwqLTmtTNqbukQl7a8GQhgN7jKPXvt6S_vQz0jf8WG_JXKp7WDpV5nTghX_4fOUmSJ9iVmgxd5KMZtLdntRghRlFu8oH2Y-n82sWhxgS67yBhHpl8NhV4TR0qUpFF1EINvLGo8j5EoHWQNmek0F_4W9vbjSB3W_EJ8NDNN11wphVUmRTbQIW8QtNJ4ckE6YVji-Onm2KcCOhoixo5Ez6YvlXprN6ZAK_SK9SwVLhH1N2alakJpXuQUBM5HHwQYfC29aOyNaoXj9RtEcX5wi6BAoNKFhHdpppLfVs0gVpkQGPXFKa_OlNJVeXoM2KHtvUyKzWFDT9Bxz9BOyvVwTt7xObKPG_SFPBzTmh9uvUfpt6LMBFz8PKqL3QHeCQ2HGgozbOCeACJs0d1SRe1VjNFV2AYO3CeGhSvXWxsMcEl4JBxjrpfVL3XC_7OJTdeVQRY_sBa4RBqr8wWi91mEBho3GbJT09kmg4FSB9LXDGSmxxsHNlmi_sOGvMRqZ5epgZDYW0";

var alexa = require('./Alexa');
var home = require('./GoogleHome');
const SoftAccountLinking = require('./SoftAccountLinking').SoftAccountLinking;




const linking = new SoftAccountLinking({token : JOVO_TOKEN, skillId : "skillId" });



const STOP_INTENTS = ["AMAZON.StopIntent","GOOGLE?"];

var json;
var response;
var type;
var request;
var state;
var sessionAttributes;
var platform;
var slots;
var endReason;


module.exports =  {
    initWebhook : function(request, response, handlers, slotMap) {

        this.type = "webhook";
        this.response = response;
        this.request = request;
		console.log(request);
        this.slotMap = slotMap;

		this.init(handlers, slotMap)

	},

    linking : function(callback) {
        linking.activate(1123,"skill_id", callback);
    },

    execute : function() {
        if(this.requestType === LAUNCH_REQUEST) {
            this.handlers[HANDLER_LAUNCH].call();
        }

        if(this.requestType === INTENT_REQUEST) {

            // slots only make sense if request is an intentrequest
            var platformSlots = this.platform.getSlots();
            var slotsFromRequest = Object.keys(platformSlots);

            this.slots = {};

            // map slots with different slot names
            for (var i = 0; i < slotsFromRequest.length; i++) {
                var key = slotsFromRequest[i];
                if(typeof(this.slotMap[key]) === "undefined") {
                    this.slots[key] = platformSlots[key];
                } else {
                    this.slots[this.slotMap[key]] = platformSlots[key];
                }

            }

            if(this.getState()) {
                if(typeof(this.handlers[this.getState()]) === "undefined") {
                    console.log("Error: State '" + this.getState() + "' has not been defined in the handler.");
                    return; // TODO: session ended response?
                }

                if(typeof(this.handlers[this.getState()][this.getIntentName()]) === "undefined") {
                    // intent not in state defined, try global

                    if(typeof(this.handlers[this.getIntentName()]) === "undefined") {
                        console.log("Error: The intent has not been defined in the handler");
                        return; // TODO: session ended response?
                    }
                    // handle global intent
                    this.handlers[this.getIntentName()].call();

                }

                // handle STATE + Intent
                this.handlers[this.getState()][this.getIntentName()].call();
            } else {
                try {
                    this.handlers[this.getIntentName()].call();
                } catch (e) {
                    console.log(e);
                    console.log("The intent name " + this.getIntentName() + " has not been defined in your handler.");
                }

            }

        }

        if(this.requestType === SESSION_ENDED_REQUEST) {
            if(this.getState() !== null && typeof(handler[this.getState()][HANDLER_END]) !== "undefined") {
                this.handlers[this.getState()][HANDLER_END].call();
            } else {
                this.handlers[HANDLER_END].call();
            }
        }
    },

	initLambda : function(event, callback, handlers,slotMap) {
        this.response = callback;
        this.request = event;
        this.type = "lambda";

        this.init(handlers, slotMap)
	},


	init : function(handlers, slotMap) {
        if(typeof(this.request.result) !== "undefined") {
            home.init(this.request, this.response);
            this.platform = home;
        } else {
            alexa.init(this.request,  this.response);
            this.platform = alexa;
        }
        this.requestType = this.platform.getRequestType();
        this.handlers = handlers;

        // check if stop intent




        // does nothing yet

        // var statesOrIntents = Object.keys(handlers);
        // for(var i = 0; i < statesOrIntents.length; i++) {
        //
        //     var obj = handlers[statesOrIntents[i]];
        //
        //     if(typeof(obj) === 'object') {
        //         var intents = Object.keys(obj);
        //
        //         for(var j = 0; j < intents.length; j++) {
        //             var intentHandler = obj[intents[j]];
        //
        //             // handlers[this.getIntentName()].bind(context);
        //         }
        //     }
        // }
	},

	getIntentName : function() {
    	return this.getPlatform().getIntentName();
	},

	getSlots : function() {
        return this.slots;
    },

	getState : function() {
        return this.getPlatform().getState();
	},

	setState : function(state) {
    	this.getPlatform().setState(state);
	},

	getAttribute : function(name) {
    	return this.getPlatform().getAttribute(name);
	},

	setAttribute : function(name, value) {
    	this.platform.setAttribute(name, value)
	},

	getSlot : function(name) {
    	return this.slots[name];
	},

	getSlotValue  : function(name) {
    	return this.getSlot(name);
	},

	tell : function (speech) {
		var responseObj = this.getPlatform().tell(speech);
		this.respond(responseObj);
	},

    ask : function (speech, rempromptSpeech) {
        var responseObj = this.getPlatform().ask(speech, rempromptSpeech);
        this.respond(responseObj);
    },

	toState : function(state) {
    	this.setState(state);
    	return this;
	},

	getPlatform : function () {
		return this.platform;
	},

    setSocketIO : function (socketio) {
        this.socketIO = socketio;
    },

    getSocketIO : function () {
        return this.socketIO;
    },

	respond : function(responseObj) {
    	if(this.type === "lambda") {
            this.response(null, responseObj);
		} else if (this.type === "webhook") {
            this.response.json(responseObj);
		}
	}



	

};


if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function(elt /*, from*/)
    {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++)
        {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}