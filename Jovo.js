/**
 * Created by Alex on 29-May-17.
 */

'use strict';

const Alexa = require('./Alexa').Alexa;
const GoogleHome = require('./GoogleHome').GoogleHome;

const TYPE_WEBHOOK = "webhook";
const TYPE_LAMBDA = "lambda";
const TYPE_GCLOUD = "gcloud";

const PLATFORM_ALEXA = "Alexa";
const PLATFORM_GOOGLE_HOME = "GoogleHome";

const LAUNCH_REQUEST = "LaunchRequest";
const INTENT_REQUEST = "IntentRequest";
const SESSION_ENDED_REQUEST = "SessionEndedRequest";

const HANDLER_LAUNCH = "LAUNCH";
const HANDLER_END = "END";

const STANDARD_INTENT_MAP = {
    "AMAZON.StopIntent" : HANDLER_END,
    "AMAZON.HelpIntent" : "HelpIntent"
};


const SoftAccountLinking = require('./SoftAccountLinking').SoftAccountLinking;

const Jovo = class {

    constructor() {
    }

    /**
     * Initializes jovo object via webhook
     * @param request
     * @param response
     * @param handlers
     * @param slotMap
     */

    initWebhook(request, response, handlers) {

        this.type = TYPE_WEBHOOK;
        this.response = response;
        this.request = request.body;
        this.handlers = handlers;

        this.init_();

    }

    initLambda(request, response, handlers) {
        this.type = TYPE_LAMBDA;
        this.response = response;
        this.request = request;
        this.handlers = handlers;

        this.init_();
    }

    initGcloud(request, response, handlers) {
        //TODO: init gcloud
    }

    useSoftAccountLinking(jovoToken, skillId) {

    }

    /**
     * Maps platform specific slot names to custom slot names
     *
     * @param slotMap
     */
    setSlotMap(slotMap) {
        this.slotMap = slotMap;
    }

    /**
     *  Maps platform specific intent names to custom intent names
     * @param intentMap
     */

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
        this.responseObj = this.getPlatform().emptyResponse();

    }


    /**
     * Executes Handler
     */

    execute () {

        // Call "LAUNCH"

        if(this.requestType === LAUNCH_REQUEST) {
            this.handlers[HANDLER_LAUNCH].call();
        }

        if(this.requestType === INTENT_REQUEST) {

            // slots only make sense if request is an intent request
            let platformSlots = this.platform.getSlots();
            let slotsFromRequest = Object.keys(platformSlots);

            this.slots = {};

            // map slots with different slot names
            //TODO: refactor me, plz
            for (let i = 0; i < slotsFromRequest.length; i++) {
                let key = slotsFromRequest[i];
                if(typeof(this.slotMap) === "undefined" || typeof(this.slotMap[key]) === "undefined") {
                    this.slots[key] = platformSlots[key];
                } else {
                    this.slots[this.slotMap[key]] = platformSlots[key];
                }

            }

            // handle states, if state was set before
            if(this.getState()) {
                if(typeof(this.handlers[this.getState()]) === "undefined") {
                    console.log("Error: State '" + this.getState() + "' has not been defined in the handler.");
                }

                if(typeof(this.handlers[this.getState()][this.getIntentName()]) === "undefined") {
                    // intent not in state defined, try global

                    if(typeof(this.handlers[this.getIntentName()]) === "undefined") {
                        console.log("Error: The intent global " + this.getIntentName() + " has not been defined in the  handler");
                    } else {
                        // handle global intent
                        this.handlers[this.getIntentName()].call();
                    }

                }

                // handle STATE + Intent
                this.handlers[this.getState()][this.getIntentName()].call();
            } else {

                // TODO: try/catch or typeof !== undefined?
                try {
                    this.handlers[this.getIntentName()].call();
                } catch (e) {
                    console.log(e);
                    console.log("The intent name " + this.getIntentName() + " has not been defined in your handler.");
                }

            }

        }

        // handle end request types
        if(this.requestType === SESSION_ENDED_REQUEST) {
            // call specific "END" in state
            if(this.getState() !== null && typeof(handler[this.getState()][HANDLER_END]) !== "undefined") {
                this.handlers[this.getState()][HANDLER_END].call();
            } else { // call global "END"
                this.handlers[HANDLER_END].call();
            }
        }


        this.respond_(this.responseObj);

    }

    /**
     * Jump to state scoped or global intent
     * @param intent
     * @param state
     */

    goTo(intent, state) {
        if(typeof(state) === "undefined") {
            this.handlers[intent].call();
        } else {
            this.handlers[state][intent].call();
        }


    }

    /**
     * Returns UserID
     * @returns {*}
     */

    getUserId() {
        return this.getPlatform().getUserId();
    }

    /**
     * Returns End of reason. Use in "END"
     *
     * e.g. StopIntent or EXCEEDED_REPROMPTS
     * @returns {*}
     */
    getEndReason() {
        return this.getPlatform().getEndReason();
    }


    /**
     * Returns intent name after custom and standard intent mapping
     *
     * @returns {*}
     */

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

    /**
     * Responds with the given text and ends session
     * Transforms plaintext to SSML
     * @param speech
     */

    tell (speech) {
        this.responseObj = this.getPlatform().tell(toSSML(speech));
        return this;
    }

    /**
     * Plays audio file
     * @param audio_url
     * @param fallbackText (only works with google home)
     */

    play (audio_url, fallbackText) {
        this.responseObj = this.getPlatform().play(audio_url, fallbackText);
        return this;
    }

    /**
     * Says speech and waits for answer from user. Reprompt when user input fails.
     * Keeps session open.
     * @param speech
     * @param repromptSpeech
     */

    ask (speech, repromptSpeech) {

        if(typeof(repromptSpeech) === "undefined") {
            repromptSpeech = speech;
        }

        this.responseObj = this.getPlatform().ask(toSSML(speech), toSSML(repromptSpeech));
        return this;
    }

    withCard (title, subtitle, content) {
        this.responseObj = this.getPlatform().withCard(this.responseObj, title, subtitle, content);
    }

    addAlexaCard (title, subtitle, content) {
        if(this.getPlatform().getType() === PLATFORM_ALEXA) {
            this.responseObj = this.getPlatform().addSimpleCard(this.responseObj, title, subtitle, content);
        }
        return this;
    }

    addGoogleAssistantBasicCard() {
        if(this.getPlatform().getType() === PLATFORM_GOOGLE_HOME) {
            this.responseObj = this.getPlatform().addBasicCard();
        }
        console.log(this.responseObj);
        return this;
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
        if(this.type === TYPE_LAMBDA) {
            this.response(null, this.responseObj);
        } else if (this.type === TYPE_WEBHOOK) {
            this.response.json(this.responseObj);
        }
    }

};


module.exports.Jovo = Jovo;


function toSSML(text) {
    text = text.replace(/<speak>/g,'').replace(/<\/speak>/g,'');
    text = "<speak>"+text+"</speak>";

    return text;
}