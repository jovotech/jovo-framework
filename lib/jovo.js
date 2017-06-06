const Alexa = require('./platforms/alexa').Alexa;

const GoogleHome = require('./platforms/googleHome').GoogleHome;

const TYPE_WEBHOOK = 'webhook';
const TYPE_LAMBDA = 'lambda';

const PLATFORM_ALEXA = 'Alexa';
const PLATFORM_GOOGLE_HOME = 'GoogleHome';

const LAUNCH_REQUEST = 'LAUNCH';
const INTENT_REQUEST = 'INTENT';
const SESSION_ENDED_REQUEST = 'END';

const HANDLER_LAUNCH = 'LAUNCH';
const HANDLER_END = 'END';

const STANDARD_INTENT_MAP = {
    'AMAZON.StopIntent': HANDLER_END,
};

// var CircularJSON = require('circular-json');

/** Class Jovo */
class Jovo {

    /**
     *
     * Initializes jovo object
     *
     * @param {object} request
     * @param {object} response
     * @param {object} handlers
     */
    init(request, response, handlers) {
        Jovo.validateHandlers(handlers);

        this.response = response;
        this.handlers = handlers;

        this.standardIntentMap = STANDARD_INTENT_MAP;

        this.type = this.determineType(); // lambda or webhook

        if (this.type === TYPE_LAMBDA) {
            this.request = request;
        } else if (this.type === TYPE_WEBHOOK) {
            this.request = request.body;
        }

        this.platform = this.determinePlatformType();
    }

    /**
     * Checks handlers for valid structure/values/types.
     *
     * @param {object} handlers  Handler object with app logic
     */
    static validateHandlers(handlers) {
        let firstLevelKeys = Object.keys(handlers);

        if (firstLevelKeys.length === 0) {
            throw new Error('There should be at least one intent in the handler.');
        }


        // iterate through first level objects/functions
        for (let i = 0; i < firstLevelKeys.length; i++) {
            let firstLevelObj = handlers[firstLevelKeys[i]];

            // object + function allowed, otherwise throw error
            if (typeof firstLevelObj !== 'object' && typeof firstLevelObj !== 'function') {
                throw new Error('Wrong handler types. Should be object for a state or a function for an intent.');
            }

            // state object
            if (typeof firstLevelObj === 'object') {
                let secondLevelKeys = Object.keys(firstLevelObj);

                if (secondLevelKeys.length === 0) {
                    throw new Error('There should be at least one intent in the state.');
                }

                // iterate through second level and check for function
                for (let j = 0; j < secondLevelKeys.length; j++) {
                    let secondLevelObj = firstLevelObj[secondLevelKeys[j]];

                    if (typeof secondLevelObj !== 'function') {
                        throw new Error('IntentHandler inside of a state should be a function');
                    }
                }
            }
        }
    }

    /**
     * Returns type
     *
     * @return {string} type - 'lambda' or 'webhook'
     */
    determineType() {
        if (typeof this.response === 'function') {
            return TYPE_LAMBDA;
        } else if (typeof this.response === 'object') {
            return TYPE_WEBHOOK;
        }
    }

    /**
     * Determines platform type.
     * @return {GoogleHome|Alexa} - Platform object
     */
    determinePlatformType() {
        if (this.request.result) {
            return new GoogleHome(this.request, this.response);
        } else {
            return new Alexa(this.request, this.response);
        }
    }


    /**
     * Maps platform specific input names to custom input names
     *
     * @param {object} inputMap
     */
    setInputMap(inputMap) {
        this.inputMap = inputMap;
    }

    /**
     *  Maps platform specific intent names to custom intent names
     * @param {object} intentMap
     */
    setIntentMap(intentMap) {
        this.intentMap = intentMap;
    }


    /**
     * Executes Handler
     */
    execute() {
        // Call 'LAUNCH'
        if (this.platform.getRequestType() === LAUNCH_REQUEST) {
            this.handlers[HANDLER_LAUNCH].call();
        }

        if (this.platform.getRequestType() === INTENT_REQUEST) {
            // inputs only make sense if request is an intent request
            let platformInputs = this.platform.getInputs();
            let inputsFromRequest = Object.keys(platformInputs);

            this.inputs = {};

            // map inputs with different input names
            // TODO: refactor me, plz
            for (let i = 0; i < inputsFromRequest.length; i++) {
                let key = inputsFromRequest[i];
                if (typeof(this.inputMap) === 'undefined' || typeof(this.inputMap[key]) === 'undefined') {
                    this.inputs[key] = platformInputs[key];
                } else {
                    this.inputs[this.inputMap[key]] = platformInputs[key];
                }
            }

            // handle states, if state was set before
            if (this.getState()) {
                if (typeof(this.handlers[this.getState()]) === 'undefined') {
                    throw new Error('Error: State ' + this.getState() + ' has not been defined in the handler.');
                }

                if (typeof(this.handlers[this.getState()][this.getIntentName()]) === 'undefined') {
                    // intent not in state defined, try global

                    if (typeof(this.handlers[this.getIntentName()]) === 'undefined') {
                        throw new Error('Error: The intent global ' + this.getIntentName() + ' has not been defined in the  handler');
                    } else {
                        // handle global intent
                        this.handlers[this.getIntentName()].call();
                    }
                }

                // handle STATE + Intent
                this.handlers[this.getState()][this.getIntentName()].call();
            } else {
                if (!this.handlers[this.getIntentName()]) {
                    throw new Error('The intent name ' + this.getIntentName() + ' has not been defined in your handler.');
                } else {
                    this.handlers[this.getIntentName()].call();
                }
            }
        }

        // handle end request types
        if (this.platform.getRequestType() === SESSION_ENDED_REQUEST) {
            // call specific 'END' in state
            if (this.getState() !== null && typeof(handler[this.getState()][HANDLER_END]) !== 'undefined') {
                this.handlers[this.getState()][HANDLER_END].call();
            } else if (this.handlers[HANDLER_END]) { // call global 'END'
                this.handlers[HANDLER_END].call();
            }
        }

        this.respond();
    }

    /**
     * Jump to state scoped or global intent
     * @param {string} intent name of intent
     * @param {string} state name of state
     * @param {*} arg passed arg
     */
    goTo(intent, state, arg) {
        if (!state) {
            this.handlers[intent].call(this, arg);
        } else {
            this.handlers[state][intent].call(this, arg);
        }
    }


    /** ************************************************************************
     *
     *      Jovo/Platform wrapper
     *
     *****************************/

    /**
     * Returns UserID
     * @return {string}
     */
    getUserId() {
        return this.getPlatform().getUserId();
    }

    /**
     * Returns intent name after custom and standard intent mapping
     *
     * @return {string} name of intent
     */
    getIntentName() {
        let platformIntentName = this.getPlatform().getIntentName();

        // use intent mapping if set
        if (this.intentMap && this.intentMap[platformIntentName]) {
            return this.intentMap[platformIntentName];
        }

        // user standard intent mapping
        if (this.standardIntentMap[platformIntentName]) {
            return this.standardIntentMap[platformIntentName];
        }

        return platformIntentName;
    }


    /**
     * Returns End of reason. Use in 'END'
     *
     * e.g. StopIntent or EXCEEDED_REPROMPTS
     * @return {*}
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
     * @return {object}
     */
    getInputs() {
        return this.inputs;
    }

    /**
     * Get input object by name
     * @param {string} name
     * @return {*}
     */
    getInput(name) {
        return this.inputs[name];
    }

    /**
     * Returns type of platform ("Alexa","GoogleHome")
     * @return {string}
     */
    getType() {
        return this.getPlatform().getType();
    }

    /**
     * Returns state value stored in the request session
     *
     * @return {*}
     */
    getState() {
        return this.getPlatform().getState();
    }

    /**
     * Stores state in response object session
     *
     * @param {string} state
     */
    setState(state) {
        this.getPlatform().setState(state);
    }

    /**
     * Sets session attribute
     * @param {string} name
     * @param {*} value
     * @return {Jovo} this
     */
    setSessionAttribute(name, value) {
        this.platform.setSessionAttribute(name, value);
        return this;
    }

    /**
     * Sets session attribute
     * @param {string} key
     * @param {*} value
     * @return {Jovo} this
     */
    addSessionAttribute(key, value) {
        this.setSessionAttribute(key, value);
        return this;
    }

    /**
     * Returns session attributes
     * @return {*|{}}
     */
    getSessionAttributes() {
        return this.platform.getSessionAttributes();
    }

    /**
     * Returns session attribute value
     * @param {string} name
     * @return {*}
     */
    getSessionAttribute(name) {
        return this.platform.getSessionAttribute(name);
    }


    /**
     * Sets local variable
     * @param {string} name
     * @param {*} value
     */
    setVar(name, value) {
        if (!this.variables) {
            this.variables = {};
        }

        this.variables[name] = value;
    }


    /**
     * Gets local variable by name
     * @param {string} name
     * @return {*}
     */
    getVar(name) {
        return this.variables[name];
    }


    /**
     * Responds with the given text and ends session
     * Transforms plaintext to SSML
     * @param {string} speech Plaintext or SSML
     * @return {Jovo} this
     */
    tell(speech) {
        this.responseObj = this.getPlatform().tell(toSSML(speech));
        return this;
    }

    /**
     * Plays audio file
     * @param {string} audioUrl secure url to audio file
     * @param {string} fallbackText (only works with google home)
     * @return {Jovo} this
     */
    play(audioUrl, fallbackText) {
        this.responseObj = this.getPlatform().play(audioUrl, fallbackText);
        return this;
    }

    /**
     * Says speech and waits for answer from user.
     * Reprompt when user input fails.
     * Keeps session open.
     * @param {string} speech
     * @param {string} repromptSpeech
     * @return {Jovo} this
     */
    ask(speech, repromptSpeech) {
        if (repromptSpeech) {
            repromptSpeech = speech;
        }

        this.responseObj = this.getPlatform().ask(
            toSSML(speech),
            toSSML(repromptSpeech));
        return this;
    }

    /**
     * Sets 'state' session attributes
     * @param {string} state
     * @return {Jovo}
     */
    nextState(state) {
        this.setState(state);
        return this;
    }

    /**
     * Returns platform object
     * @return {GoogleHome|Alexa|*}
     */
    getPlatform() {
        return this.platform;
    }

    /**
     * Returns Speechbuilder object initialized for the platform
     * @return {SpeechBuilder}
     */
    speechBuilder() {
        return new SpeechBuilder(this.platform);
    }

    /**
     * Adds simple card to response
     * @param {string} title
     * @param {string} content
     * @return {Jovo}
     */
    withSimpleCard(title, content) {
        this.getPlatform().withSimpleCard(title, content);
        return this;
    }

    /**
     * Adds image card to response
     * @param {string} title
     * @param {string} content
     * @param {string} imageUrl secure url
     * @return {Jovo}
     */
    withImageCard(title, content, imageUrl) {
        this.getPlatform().withImageCard(title, content, imageUrl);
        return this;
    }

    /**
     * Sets object as response object for alexa
     * @param {object} responseObj
     * @return {Jovo}
     */
    setAlexaResponse(responseObj) {
        if (this.getPlatform().getType() === PLATFORM_ALEXA) {
            this.responseObj = responseObj;
        }
        return this;
    }
    /**
     * Sets object as response object for google home
     * @param {object} responseObj
     * @return {Jovo}
     */
    setGoogleHomeResponse(responseObj) {
        if (this.getPlatform().getType() === PLATFORM_GOOGLE_HOME) {
            this.responseObj = responseObj;
        }
        return this;
    }

    /**
     * Prints request object
     */
    logRequest() {
        console.log(this.request);
    }

    /**
     * Prints response object
     * @param {boolean} asString - print as string
     */
    logResponse(asString) {
        console.log();
        console.log('LOG -------- Response');
        if (asString) {
            console.log(JSON.stringify(this.getPlatform().getResponseObject()));
        } else {
            console.log(this.getPlatform().getResponseObject());
        }
    }

    /**
     * Prints intent name
     */
    logIntent() {
        if (this.platform.getRequestType() === INTENT_REQUEST) {
            console.log();
            console.log('LOG -------- Intent');

            let intent = '';

            if (this.getState()) {
                intent += 'State: ' + this.getState() + ' ';
            }

            intent += this.getIntentName();

            if (this.getIntentName() !== this.getPlatform().getIntentName()) {
                intent += ' (original intent: ' + this.getPlatform().getIntentName() + ')';
            }

            console.log(intent);
        }
    }

    /**
     * Returns Alexa object
     * @return {Alexa}
     */
    alexa() {
        if (this.getPlatform().getType() === PLATFORM_ALEXA) {
            return this.getPlatform();
        }
        return null;
    }

    /**
     * Returns GoogleHome object
     * @return {GoogleHome}
     */
    google() {
        if (this.getPlatform().getType() === PLATFORM_GOOGLE_HOME) {
            return this.getPlatform();
        }
        return null;
    }

    /**
     * Responds with response object based on type
     */
    respond() {
        if (this.type === TYPE_LAMBDA) {
            this.response(null, this.getPlatform().getResponseObject());
        } else if (this.type === TYPE_WEBHOOK) {
            this.response.json(this.getPlatform().getResponseObject());
        }
    }
}


/** Class SpeechBuilder */
class SpeechBuilder {

    /**
     * Constructor
     * @param {Alexa|GoogleHome|*} platform
     */
    constructor(platform) {
        this.platform = platform;
        this.speech = '';
    }

    /**
     * Adds audio tag to speech
     * @param {string} url secure url to audio
     * @param {string} text
     * @return {SpeechBuilder}
     */
    addAudio(url, text) {
        if (this.platform.getType() === PLATFORM_ALEXA) {
            this.speech += '<audio src="' + url + '"/>';
        } else if (this.platform.getType() === PLATFORM_GOOGLE_HOME) {
            this.speech += '<audio src="' + url + '">' + text + '</audio>';
        }
        return this;
    }

    /**
     * Adds text to speech
     * @param {string} text
     * @return {SpeechBuilder}
     */
    addText(text) {
        this.speech += text;
        return this;
    }

    /**
     * Adds break tag to speech obj
     * @param {string} time timespan like 3s, 500ms etc
     * @return {SpeechBuilder}
     */
    addBreak(time) {
        this.speech += '<break time="' + time + '"/>';
        return this;
    }

    /**
     * Generates ssml from text. Removes existing <speak> tags
     * @param {string} text
     * @return {string} ssml
     */
    static toSSML(text) {
        text = text.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
        text = '<speak>' + text + '</speak>';
        return text;
    }

    /**
     * Returns speech object string
     * @return {string}
     */
    build() {
        return this.speech;
    }
}

module.exports.Jovo = Jovo;
module.exports.TYPE_WEBHOOK = TYPE_WEBHOOK;
module.exports.TYPE_LAMBDA = TYPE_LAMBDA;


module.exports.PLATFORM_ALEXA = PLATFORM_ALEXA;
module.exports.PLATFORM_GOOGLE_HOME = PLATFORM_GOOGLE_HOME;


module.exports.LAUNCH_REQUEST = LAUNCH_REQUEST;
module.exports.INTENT_REQUEST = INTENT_REQUEST;
module.exports.SESSION_ENDED_REQUEST = SESSION_ENDED_REQUEST;

module.exports.HANDLER_LAUNCH = HANDLER_LAUNCH;
module.exports.HANDLER_END = HANDLER_END;
