/**
 * Created by Alex on 29-May-17.
 */

'use strict';

const Alexa = require('./platforms/alexa').Alexa;
const GoogleHome = require('./platforms/googleHome').GoogleHome;

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


const SoftAccountLinking = require('./softAccountLinking').SoftAccountLinking;

const Jovo = class {

    constructor() {
    }

    /**
     * Initializes jovo object via webhook
     * @param request
     * @param response
     * @param handlers
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
     * Maps platform specific input names to custom input names
     *
     * @param inputMap
     */
    setInputMap(inputMap) {
        this.inputMap = inputMap;
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

            // inputs only make sense if request is an intent request
            let platformInputs = this.platform.getInputs();
            let inputsFromRequest = Object.keys(platformInputs);

            this.inputs = {};

            // map inputs with different input names
            //TODO: refactor me, plz
            for (let i = 0; i < inputsFromRequest.length; i++) {
                let key = inputsFromRequest[i];
                if(typeof(this.inputMap) === "undefined" || typeof(this.inputMap[key]) === "undefined") {
                    this.inputs[key] = platformInputs[key];
                } else {
                    this.inputs[this.inputMap[key]] = platformInputs[key];
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
            } else if(this.handlers[HANDLER_END]) { // call global "END"
                this.handlers[HANDLER_END].call();
            }
        }

        console.log(JSON.stringify(this.getPlatform().getResponseObject()));
        this.respond_(this.getPlatform().getResponseObject());

    }

    /**
     * Jump to state scoped or global intent
     * @param intent
     * @param state
     */

    goTo(intent, state, arg) {
        if(!state) {
            this.handlers[intent].call(this, arg);
        } else {
            this.handlers[state][intent].call(this, arg);
        }


    }


    /**************************************************************************
     *
     *      Jovo/Platform wrapper
     *
     *****************************/

    /**
     * Returns UserID
     * @returns {*}
     */

    getUserId() {
        return this.getPlatform().getUserId();
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
     * Returns inputs
     *
     * {
     *   inputname1 : value1,
     *   inputname2 : value2
     * }
     *
     * @returns {{}|*}
     */

    getInputs () {
        return this.inputs;
    }

    /**
     * Get input object by name
     * @param name
     * @returns {*}
     */


    getInput (name) {
        return this.inputs[name];
    }


    /**
     * Returns type of platform
     * @returns {string}
     */

    getType () {
        return this.getPlatform().getType();
    }


    /**
     * Returns state value stored in the request session
     *
     * @returns {*}
     */

    getState () {
        return this.getPlatform().getState();
    }


    /**
     * Stores state in response object session
     *
     * @param state
     */


    setState (state) {
        this.getPlatform().setState(state);
    }

    /**
     * Sets session attribute
     * @param name
     * @param value
     */

    setSessionAttribute (name, value) {
        this.platform.setSessionAttribute(name, value)
        return this;
    }


    /**
     * Sets session attribute
     * @param name
     * @param value
     */
    addSessionAttribute(name, value) {
        this.setSessionAttribute(name, value);
        return this;
    }


    getSessionAttributes() {
        return this.platform.getSessionAttributes();
    }

    getSessionAttribute(name) {
        return this.platform.getSessionAttribute(name);
    }


    /**
     * Sets local variable
     * @param name
     * @param value
     */

    setVar (name, value) {
        if(!this.variables) {
            this.variables = {};
        }

        this.variables[name] = value;
    }


    /**
     * Gets local variable by name
     * @param name
     * @returns {*}
     */
    getVar (name) {
        return this.variables[name];
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

    speechBuilder () {
        return new SpeechBuilder(this.platform);
    }


    withCard (title, subtitle, content) {
        this.responseObj = this.getPlatform().withCard(this.responseObj, title, subtitle, content);
    }


    withSimpleCard(title, content) {
        this.responseObj = this.getPlatform().withSimpleCard(title, content);
    }

    withImageCard(title, content, imageUrl) {
        this.responseObj = this.getPlatform().withImageCard(title, content, imageUrl);
    }


    setAlexaResponseJson(responseObj) {
        if(this.getPlatform().getType() === PLATFORM_ALEXA) {
            this.responseObj = responseObj;
        }
        return this;
    }

    setGoogleHomeResponseJson(responseObj) {
        if(this.getPlatform().getType() === PLATFORM_GOOGLE_HOME) {
            this.responseObj = responseObj;
        }
        return this;
    }

    addAlexaCard (title, subtitle, content) {
        if(this.getPlatform().getType() === PLATFORM_ALEXA) {
            this.responseObj = this.getPlatform().addSimpleCard(this.responseObj, title, subtitle, content);
        }
        return this;
    }

    addAssistantBasicCard(title, formattedText) {
        if(this.getPlatform().getType() === PLATFORM_GOOGLE_HOME) {
            this.responseObj = this.getPlatform().addBasicCard(title, formattedText,  this.responseObj);
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

    setResponseJson(responseObj) {
        this.responseObj = responseObj;
    }

    alexa() {
        if(this.getPlatform().getType() === PLATFORM_ALEXA) {
            return this.getPlatform();
        }
        return null;
    }

    google() {
        if(this.getPlatform().getType() === PLATFORM_GOOGLE_HOME) {
            return this.getPlatform();
        }
        return null;
    }


    respond_ (responseObj) {
        if(this.type === TYPE_LAMBDA) {
            this.response(null, this.responseObj);
        } else if (this.type === TYPE_WEBHOOK) {
            this.response.json(this.responseObj);
        }
    }

};

const SpeechBuilder = class {

    constructor(platform) {
        this.platform = platform;
        this.speech = "";
    }

    addAudio(url, text) {
        if(this.platform.getType() === PLATFORM_ALEXA) {
            this.speech += '<audio src="'+url+'"/>';
        } else if(this.platform.getType() === PLATFORM_GOOGLE_HOME) {
            this.speech += '<audio src="'+url+'">'+text+'</audio>';
        }
        return this;
    }

    addText(text) {
        this.speech += text;
        return this;
    }

    addSentence(text) {
        this.speech += "<s>text</s>";
        return this;
    }

    addBreak(time) {
        this.speech += '<break time="'+time+'"/>';
        return this;
    }

    build() {
        return this.speech;
    }
}



module.exports.Jovo = Jovo;


function toSSML(text) {
    text = text.replace(/<speak>/g,'').replace(/<\/speak>/g,'');
    text = "<speak>"+text+"</speak>";

    return text;
}