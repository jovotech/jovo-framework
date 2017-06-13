const AlexaSkill = require('./platforms/alexaSkill').AlexaSkill;
const GoogleAction = require('./platforms/googleAction').GoogleAction;
const FilePersistence = require('../lib/filePersistence').FilePersistence;

const EventEmitter = require('events');
const TYPE_WEBHOOK = 'webhook';
const TYPE_LAMBDA = 'lambda';

const PLATFORM_ALEXA_SKILL = 'AlexaSkill';
const PLATFORM_GOOGLE_ACTION = 'GoogleAction';

const LAUNCH_REQUEST = 'LAUNCH';
const INTENT_REQUEST = 'INTENT';
const SESSION_ENDED_REQUEST = 'END';

const HANDLER_LAUNCH = 'LAUNCH';
const HANDLER_END = 'END';

const STANDARD_INTENT_MAP = {
    'AMAZON.StopIntent': HANDLER_END,
};

// const CircularJSON = require('circular-json');

/** Class Jovo */
class Jovo extends EventEmitter {

    /**
     * Constructor
     * @public
     */
    constructor() {
        super();

        this.on('respond', function(jovo) {
            if (jovo.type === TYPE_LAMBDA) {
                jovo.response(null, jovo.getPlatform().getResponseObject());
            } else if (jovo.type === TYPE_WEBHOOK) {
                jovo.response.json(jovo.getPlatform().getResponseObject());
            }
        });
    }
    /**
     *
     * Initializes jovo object
     *
     * @public
     * @param {object} request
     * @param {object} response
     * @param {object} handlers
     */
    handleRequest(request, response, handlers) {
        Jovo.validateHandlers(handlers);

        this.response = response;
        this.handlers = handlers;
        // console.log(CircularJSON.stringify(request.body, null, '\t'));
        // console.log(CircularJSON.stringify(request));

        this.standardIntentMap = STANDARD_INTENT_MAP;

        this.type = this.determineType(); // lambda or webhook

        if (this.type === TYPE_LAMBDA) {
            this.request = request;
        } else if (this.type === TYPE_WEBHOOK) {
            this.request = request.body;
        }

        this.platform = this.determinePlatformType();
        this.setPersistence(new FilePersistence());
    }

    /**
     * Maps platform specific input names to custom input names
     *
     * @public
     * @param {object} inputMap
     */
    setInputMap(inputMap) {
        this.inputMap = inputMap;
    }

    /**
     *  Maps platform specific intent names to custom intent names
     * @public
     * @param {object} intentMap
     */
    setIntentMap(intentMap) {
        this.intentMap = intentMap;
    }

    /**
     * Prints request object
     * @public
     */
    logRequest() {
        console.log(this.request);
    }

    /**
     * Prints response object
     * @public
     */
    logResponse() {
        console.log();
        console.log('LOG -------- Response');
        console.log(
            JSON.stringify(
                this.getPlatform().getResponseObject(),
                null,
                '\t'
            )
        );
    }

    /**
     * Prints intent name
     * @public
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
     * Executes Handler
     * @public
     */
    execute() {
        // Call 'LAUNCH'
        if (this.platform.getRequestType() === LAUNCH_REQUEST) {
            if (!this.handlers[HANDLER_LAUNCH]) {
                throw Error('There is no LAUNCH intent');
            }
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
                if (this.getIntentName() !== HANDLER_END &&
                    !this.handlers[this.getIntentName()]) {
                    throw new Error('The intent name ' + this.getIntentName() + ' has not been defined in your handler.');
                } else if (this.getIntentName() === HANDLER_END &&
                    !this.handlers[this.getIntentName()]) {
                    // StopIntent but no END Handler defined
                    this.emit('respond', this);
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
            } else {
                this.emit('respond', this);
            }
        }

        // TODO: not ready to use yet
        if (this.platform.getRequestType() === 'AUDIOPLAYER') {
            if (this.handlers['AUDIOPLAYER'][this.getPlatform().getAudioPlayer().getType()]) {
                this.handlers['AUDIOPLAYER'][this.getPlatform().getAudioPlayer().getType()].call();
            }
        }
    }

    /**
     * Jumps to an intent
     * @public
     * @param {string} intent name of intent
     * @param {*} arg passed arg
     */
    toIntent(intent, arg) {
        if (!this.handlers[intent]) {
            throw Error(intent + ' could not be found in your handler');
        }
        this.handlers[intent].call(this, arg);
    }

    /**
     * Jumps to state scoped intent
     * @public
     * @param {string} state name of state
     * @param {string} intent name of intent
     * @param {*} arg passed arg
     */
    toStateIntent(state, intent, arg) {
        if (!this.handlers[state]) {
            throw Error('State ' +state + ' could not be found in your handler');
        }
        if (!this.handlers[state][intent]) {
            throw Error(state + '-' + intent + ' could not be found in your handler');
        }
        this.handlers[state][intent].call(this, arg);
    }

    /** ************************************************************************
     *
     *      Jovo/Platform wrapper
     *
     *****************************/

    /**
     * Returns UserID
     * @public
     * @return {string}
     */
    getUserId() {
        return this.getPlatform().getUserId();
    }

    /**
     * Returns intent name after custom and standard intent mapping
     * @public
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
     * (only works with Alexa)
     * @public
     * @return {*}
     */
    getEndReason() {
        return this.getPlatform().getEndReason();
    }

    /**
     * Returns inputs  (Alexa: slots / GoogleActions: parameters)
     *
     * {
     *   inputname1 : value1,
     *   inputname2 : value2
     * }
     * @public
     * @return {object}
     */
    getInputs() {
        return this.inputs;
    }

    /**
     * Get input object by name
     * @public
     * @param {string} name
     * @return {*}
     */
    getInput(name) {
        return this.inputs[name];
    }

    /**
     * Returns type of platform ("AlexaSkill","GoogleAction")
     * @public
     * @return {string}
     */
    getType() {
        return this.getPlatform().getType();
    }

    /**
     * Sets session attribute
     * @public
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
     * @public
     * @param {string} key
     * @param {*} value
     * @return {Jovo} this
     */
    addSessionAttribute(key, value) {
        this.setSessionAttribute(key, value);
        return this;
    }

    /**
     * Returns session attribute value
     * @public
     * @param {string} name
     * @return {*}
     */
    getSessionAttribute(name) {
        if (!this.platform.getSessionAttribute(name)) {
            throw Error('Session attribute '+name+' not found');
        }
        return this.platform.getSessionAttribute(name);
    }

    /**
     * Returns session attributes
     * @public
     * @return {*|{}}
     */
    getSessionAttributes() {
        return this.platform.getSessionAttributes();
    }

    /**
     * Responds with the given text and ends session
     * Transforms plaintext to SSML
     * @public
     * @param {string} speech Plaintext or SSML
     */
    tell(speech) {
        this.getPlatform().tell(
            SpeechBuilder.toSSML(speech)
        );

        this.emit('respond', this);
    }

    /**
     * Plays audio file
     * @public
     * @param {string} audioUrl secure url to audio file
     * @param {string} fallbackText (only works with google action)
     */
    play(audioUrl, fallbackText) {
        this.getPlatform().play(audioUrl, fallbackText);
        this.emit('respond', this);
    }

    /**
     * Says speech and waits for answer from user.
     * Reprompt when user input fails.
     * Keeps session open.
     * @public
     * @param {string} speech
     * @param {string} repromptSpeech
     */
    ask(speech, repromptSpeech) {
        if (!repromptSpeech) {
            repromptSpeech = speech;
        }

        this.responseObj = this.getPlatform().ask(
            SpeechBuilder.toSSML(speech),
            SpeechBuilder.toSSML(repromptSpeech));
        this.emit('respond', this);
    }

    /**
     * Adds simple card to response
     * @public
     * @param {string} title
     * @param {string} content
     * @return {Jovo}
     */
    addSimpleCard(title, content) {
        this.getPlatform().addSimpleCard(title, content);
        return this;
    }

    /**
     * Adds image card to response
     * @public
     * @param {string} title
     * @param {string} content
     * @param {string} imageUrl secure url
     * @return {Jovo}
     */
    addImageCard(title, content, imageUrl) {
        this.getPlatform().addImageCard(title, content, imageUrl);
        return this;
    }

    /** ************************************************************************
     *
     *      Jovo functions
     *
     *****************************/

    /**
     * Sets 'state' session attributes
     * @public
     * @param {string} state
     * @return {Jovo}
     */
    followUpState(state) {
        if (!this.handlers[state]) {
            throw Error('State '+state+' could not be found in your handler');
        }
        this.getPlatform().setState(state);
        return this;
    }

    /**
     * Returns state value stored in the request session
     * @public
     * @return {*}
     */
    getState() {
        return this.getPlatform().getState();
    }

    /**
     * Returns platform object
     * @public
     * @return {GoogleAction|AlexaSkill|*}
     */
    getPlatform() {
        return this.platform;
    }

    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    speechBuilder() {
        return new SpeechBuilder(this.getPlatform().getType());
    }

    /**
     * Sets object as response object for alexa
     * @public
     * @param {object} responseObj
     * @return {Jovo}
     */
    setAlexaSkillResponse(responseObj) {
        if (this.getPlatform().getType() === PLATFORM_ALEXA_SKILL) {
            this.getPlatform().setResponseObject(responseObj);
        }
        return this;
    }

    /**
     * Sets object as response object for google action
     * @public
     * @param {object} responseObj
     * @return {Jovo}
     */
    setGoogleActionResponse(responseObj) {
        if (this.getPlatform().getType() === PLATFORM_GOOGLE_ACTION) {
            this.getPlatform().setResponseObject(responseObj);
        }
        return this;
    }

    /**
     * Returns AlexaSkill object
     * @public
     * @return {AlexaSkill}
     */
    alexaSkill() {
        if (this.getPlatform().getType() === PLATFORM_ALEXA_SKILL) {
            return this.getPlatform();
        }
        return null;
    }

    /**
     * Returns GoogleAction object
     * @public
     * @return {GoogleAction}
     */
    googleAction() {
        if (this.getPlatform().getType() === PLATFORM_GOOGLE_ACTION) {
            return this.getPlatform();
        }
        return null;
    }

    /**
     * Sets persistence class
     * @public
     * @param {object} persistence
     */
    setPersistence(persistence) {
        this.persistence = persistence;
        this.persistence.setMainKey(this.getUserId());
    }


    /**
     * Returns AudioPlayer instance
     * IMPORTANT: works only with Alexa
     * @public
     * @return {AudioPlayer}
     * @constructor
     */
    audioPlayer() {
        return this.alexaSkill().getAudioPlayer();
    }

    /**
     * Saves data in db
     * @public
     * @param {string} key
     * @param {string} value
     * @param {function} callback
     */
    dbSave(key, value, callback) {
        this.persistence.dbSave(key, value, callback);
    }

    /**
     * load
     * @public
     * @param {string} key
     * @param {function} callback
     */
    dbLoad(key, callback) {
        this.persistence.dbLoad(key, callback);
    }

    /**
     * Deletes all user data from db
     * @public
     * @param {function} callback
     */
    dbDeleteUser(callback) {
        this.persistence.dbDeleteUser(callback);
    }

    /**
     * Deletes user data with given key
     * @public
     * @param {string} key
     * @param {function} callback
     */
    dbDeleteData(key, callback) {
        this.persistence.dbDeleteData(key, callback);
    }


    /**
     * Checks handlers for valid structure/values/types.
     *
     * @private
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
            return new GoogleAction(this, this.request, this.response);
        } else {
            return new AlexaSkill(this, this.request, this.response);
        }
    }

}


/** Class SpeechBuilder */
class SpeechBuilder {

    /**
     * Constructor
     * @public
     * @param {AlexaSkill|GoogleAction|*} platform
     */
    constructor(platformType) {
        this.platformType = platformType;
        this.speech = '';
    }

    /**
     * Adds audio tag to speech
     * @public
     * @param {string} url secure url to audio
     * @param {string} text
     * @return {SpeechBuilder}
     */
    addAudio(url, text) {
        if (this.platformType === PLATFORM_ALEXA_SKILL) {
            this.speech += '<audio src="' + url + '"/>';
        } else if (this.platformType === PLATFORM_GOOGLE_ACTION) {
            this.speech += '<audio src="' + url + '">' + text + '</audio>';
        }
        return this;
    }

    /**
     * Adds text to speech
     * @public
     * @param {string} text
     * @return {SpeechBuilder}
     */
    addText(text) {
        if (this.speech.length > 0) {
            this.speech += ' ';
        }
        this.speech += text;
        return this;
    }

    /**
     * Adds break tag to speech obj
     * @public
     * @param {string} time timespan like 3s, 500ms etc
     * @return {SpeechBuilder}
     */
    addBreak(time) {
        this.speech += '<break time="' + time + '"/>';
        return this;
    }

    /**
     * Generates ssml from text. Removes existing <speak> tags
     * @public
     * @static
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
     * @public
     * @return {string}
     */
    build() {
        return this.speech;
    }
}

module.exports.Jovo = Jovo;
module.exports.SpeechBuilder = SpeechBuilder;


module.exports.TYPE_WEBHOOK = TYPE_WEBHOOK;
module.exports.TYPE_LAMBDA = TYPE_LAMBDA;


module.exports.PLATFORM_ALEXA_SKILL = PLATFORM_ALEXA_SKILL;
module.exports.PLATFORM_GOOGLE_ACTION = PLATFORM_GOOGLE_ACTION;


module.exports.LAUNCH_REQUEST = LAUNCH_REQUEST;
module.exports.INTENT_REQUEST = INTENT_REQUEST;
module.exports.SESSION_ENDED_REQUEST = SESSION_ENDED_REQUEST;

module.exports.HANDLER_LAUNCH = HANDLER_LAUNCH;
module.exports.HANDLER_END = HANDLER_END;
