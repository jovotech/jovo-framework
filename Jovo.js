/**
 * Created by Alex on 29-May-17.
 */

'use strict';

const Alexa = require('./Alexa').Alexa;
const GoogleHome = require('./GoogleHome').GoogleHome;

const LAUNCH_REQUEST = "LaunchRequest";
const INTENT_REQUEST = "IntentRequest";
const SESSION_ENDED_REQUEST = "SessionEndedRequest";

const HANDLER_LAUNCH = "LAUNCH";
const HANDLER_END = "END";

const STANDARD_INTENT_MAP = {
    "AMAZON.StopIntent" : HANDLER_END
}



const Jovo = class {

    constructor(options) {
        this.test = options;
    }

    /**
     * Initializes jovo object via webhook
     * @param request
     * @param response
     * @param handlers
     * @param slotMap
     */

    initWebhook(request, response, handlers) {

        this.type = "webhook";
        this.response = response;
        this.request = request.body;
        this.handlers = handlers;

        this.init_();
    }

    setSlotMap(slotMap) {
        this.slotMap = slotMap;
    }

    setIntentMap(intentMap) {
        this.intentMap = intentMap;
    }


    /**
     * "private" init method called by initWebhook or initLambda
     * Determines platform
     */


    init_ () {
        if(typeof(this.request.result) !== "undefined") {
            this.platform = new GoogleHome(this.request, this.response);
        } else {
            this.platform = new Alexa(this.request, this.response);
        }
        this.requestType = this.platform.getRequestType();
        this.standardIntentMap = STANDARD_INTENT_MAP;


    }


    /**
     * Executes Handler
     */

    execute () {

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
                if(typeof(this.slotMap) === "undefined" || typeof(this.slotMap[key]) === "undefined") {
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


        // close session when nothing has been sent
        this.sayNothingEndSession();

    }

    goTo(intent, state) {
        if(typeof(state) === "undefined") {
            this.handlers[intent].call();
        } else {
            this.handlers[state][intent].call();
        }


    }


    getUserId() {
        return this.getPlatform().getUserId();
    }

    getEndReason() {
        return this.getPlatform().getEndReason();
    }

    getIntentName () {

        let platformIntentName = this.getPlatform().getIntentName();

        // use intent mapping if set
        if(typeof (this.intentMap) !== "undefined") {
            if(typeof(this.intentMap[platformIntentName]) !== "undefined") {
                return this.intentMap[platformIntentName];
            }
        }

        // user standard intent mapping
        if(typeof(this.standardIntentMap[platformIntentName]) !== "undefined") {
            return this.standardIntentMap[platformIntentName];
        }

        return platformIntentName;
    }

    getSlots () {
        return this.slots;
    }

    getState () {
        return this.getPlatform().getState();
    }

    setState (state) {
        this.getPlatform().setState(state);
    }

    getAttribute (name) {
        return this.getPlatform().getAttribute(name);
    }

    setAttribute (name, value) {
        this.platform.setAttribute(name, value)
    }

    getSlot (name) {
        return this.slots[name];
    }

    getSlotValue (name) {
        return this.getSlot(name);
    }

    tell (speech) {
        speech = speech.replace(/<speak>/g,'').replace(/<\/speak>/g,'');
        speech = "<speak>"+speech+"</speak>";

        let responseObj = this.getPlatform().tell(speech);
        this.respond_(responseObj);
    }

    play (audio_url, fallbackText) {
        let responseObj = this.getPlatform().play(audio_url, fallbackText);
        this.respond_(responseObj);
    }

    ask (speech, rempromptSpeech) {
        speech = speech.replace(/<speak>/g,'').replace(/<\/speak>/g,'');
        speech = "<speak>"+speech+"</speak>";

        rempromptSpeech = rempromptSpeech.replace(/<speak>/g,'').replace(/<\/speak>/g,'');
        rempromptSpeech = "<speak>"+rempromptSpeech+"</speak>";

        let responseObj = this.getPlatform().ask(speech, rempromptSpeech);
        this.respond_(responseObj);
    }


    sayNothingEndSession() {
        if(!this.response.finished) {
            this.respond_(this.getPlatform().sayNothingEndSession());
        }
    }

    toState (state) {
        this.setState(state);
        return this;
    }

    getPlatform () {
        return this.platform;
    }

    setSocketIO  (socketio) {
        this.socketIO = socketio;
    }

    getSocketIO () {
        return this.socketIO;
    }

    logRequest() {
        console.log(this.request);
    }

    respond_ (responseObj) {
        if(this.type === "lambda") {
            this.response(null, responseObj);
        } else if (this.type === "webhook") {
            this.response.json(responseObj);
        }
    }

};


module.exports.Jovo = Jovo;
