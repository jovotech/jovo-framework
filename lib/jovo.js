'use strict';

const _ = require('lodash');
const EventEmitter = require('events');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// Platforms
const AlexaSkill = require('./platforms/alexa/alexaSkill').AlexaSkill;
const GoogleAction = require('./platforms/googleaction/googleAction').GoogleAction;

// Database implementation
const FilePersistence = require('./integrations/db/filePersistence').FilePersistence;
const DynamoDb = require('./integrations/db/dynamoDb').DynamoDb;

// Integrations
const Analytics = require('./integrations/analytics/analytics');
const Db = require('./integrations/db/db').Db;

const TYPE_ENUM = Object.freeze({
    WEBHOOK: 'webhook',
    LAMBDA: 'lambda',
});

const PLATFORM_ENUM = Object.freeze({
    ALEXA_SKILL: 'AlexaSkill',
    GOOGLE_ACTION: 'GoogleAction',
    ALL: 'All',
});

const REQUEST_TYPE_ENUM = Object.freeze({
    LAUNCH: 'LAUNCH',
    INTENT: 'INTENT',
    END: 'END',
});

const DIALOGSTATE_ENUM = Object.freeze({
    STARTED: 'STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
});

const HANDLER_LAUNCH = 'LAUNCH';
const HANDLER_END = 'END';

const STANDARD_INTENT_MAP = {
    'AMAZON.StopIntent': HANDLER_END,
};


/** Class Jovo */
class Jovo extends EventEmitter {

    /**
     * Constructor
     * @public
     */
    constructor() {
        super();

        // initialize file db as default database
        this.moduleDatabase = new Db('file', new FilePersistence('db'));
        this.moduleAnalytics = new Analytics.Analytics();
        this.logReq = false;
        this.logRes = false;
        this.inputMap = {};

        this.on('respond', function(app) {
            // set response object depending on type of request
            if (app.type === TYPE_ENUM.LAMBDA) {
                app.response(null, app.getPlatform().getResponseObject());
            } else if (app.type === TYPE_ENUM.WEBHOOK) {
                app.response.json(app.getPlatform().getResponseObject());
            }
            // log response object
            if (app.logRes) {
                console.log(JSON.stringify(app.getPlatform().getResponseObject(), null, '\t'));
            }

            // calls track function. by default no analytics provider is set
            app.analytics().track(app);
        });
    }

    /**
     *
     * Initializes jovo object
     *
     * @public
     * @throws Error
     * @param {object} request requestobject from the webhook or lamda
     * @param {object} response response object that is returned after execution
     * @param {object} handlers
     * @return {Jovo} this
     */
    handleRequest(request, response, handlers) {
        // throws error if structure of handlers is not valid
        Jovo.validateHandlers(handlers);

        this.response = response;
        this.handlers = handlers;

        this.setType(); // lambda or webhook
        if (this.type === TYPE_ENUM.LAMBDA) {
            this.request = request;
        } else if (this.type === TYPE_ENUM.WEBHOOK) {
            this.request = request.body;
        }

        this.setPlatform(); // alexa or googlehome

        // prints request object
        if (this.logReq) {
            console.log(JSON.stringify(this.request, null, '\t'));
        }

        return this;
    }

    /**
     * Aborts response if request's skillId doesn't match
     * configurated skillId
     * @return {boolean} requestAllowed
     */
    isRequestAllowed() {
        if (this.allowedApplicationIds) {
            if (this.allowedApplicationIds.indexOf(
                this.getPlatform().getApplicationId()
                ) === -1 ) {
                return false;
            }
        }
        return true;
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
     *  Maps platform specific intent names to custom intent names
     * @public
     * @param {object} intentMap
     */
    setLanguageResources(resources) {
        if (!_.isObject(resources) || _.keys(resources).length === 0) {
            throw Error('Invalid language resource.');
        }

        this.languageResourcesSet = true;

        i18n
        .use(sprintf)
        .init({
            lng: this.getLocale(),
            resources: resources,
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            load: 'all',
        });
    }

    /**
     * Activates logging of request object
     * @public
     */
    enableRequestLogging() {
        this.logReq = true;
    }

    /**
     * Activates logging response object
     * @public
     */
    enableResponseLogging() {
        this.logRes = true;
    }

    /**
     * Fires respond event and ends session.
     */
    endSession() {
        this.getPlatform().endSession();
        this.emit('respond', this);
    }

    /**
     * Executes Handler
     * @public
     */
    execute() {
        if (!this.isRequestAllowed()) {
            console.log('Request Application Id does not match the defined alexa skill id.');
            this.emit('respond', this);
            return;
        }

        if (this.isLaunchRequest()) {
           this.handleLaunchRequest();
        }

        if (this.isIntentRequest()) {
            this.handleIntentRequest();
        }

        if (this.isEndRequest()) {
            this.handleEndRequest();
        }

        // TODO: In development. not ready to use yet
        if (this.isAudioPlayerRequest()) {
           this.handleAudioPlayerRequest();
        }
    }

    /**
     * Handles all launch requests
     * Calls handler function for LAUNCH
     * @private
     */
    handleLaunchRequest() {
        if (!this.handlers[HANDLER_LAUNCH]) {
            throw Error('There is no LAUNCH intent defined in the handler.');
        }
        this.handlers[HANDLER_LAUNCH].call(this);
    }


    /**
     * Type of request is launch request
     * @return {boolean} isLaunchRequest
     */
    isLaunchRequest() {
        return this.getPlatform().getRequestType() === REQUEST_TYPE_ENUM.LAUNCH;
    }

    /**
     * Type of request is intent request
     * @return {boolean} isIntentRequest
     */
    isIntentRequest() {
        return this.getPlatform().getRequestType() === REQUEST_TYPE_ENUM.INTENT;
    }

    /**
     * Type of request is audio player request
     * @return {boolean} isAudioPlayerRequest
     */
    isAudioPlayerRequest() {
        return this.getPlatform().getRequestType() === 'AUDIOPLAYER';
    }

    /**
     * Type of request is end request
     * @return {boolean} isEndRequest
     */
    isEndRequest() {
        return this.getPlatform().getRequestType() === REQUEST_TYPE_ENUM.END;
    }

    /**
     * Type of platform is Alexa Skill
     * @return {boolean} isAlexaSkill
     */
    isAlexaSkill() {
        return this.getPlatform().getType() === PLATFORM_ENUM.ALEXA_SKILL;
    }

    /**
     * Type of platform is Google Action
     * @return {boolean} isGoogleAction
     */
    isGoogleAction() {
        return this.getPlatform().getType() === PLATFORM_ENUM.GOOGLE_ACTION;
    }
    /**
     * Handles intent requests.
     * Maps inputMap with incoming request inputs
     */
    handleIntentRequest() {
        this.mapInputs();
        if (this.getState()) {
            this.handleStateIntentRequest();
        } else {
            this.handleStatelessIntentRequest();
        }
    }

    /**
     * Calls handler function
     * @throws Error if intent logic has not been defined
     */
    handleStatelessIntentRequest() {
        if (this.getIntentName() !== HANDLER_END &&
            !this.handlers[this.getIntentName()]) {
            throw new Error('The intent name ' + this.getIntentName() + ' has not been defined in your handler.');
        } else if (this.getIntentName() === HANDLER_END &&
            !this.handlers[this.getIntentName()]) {
            // StopIntent but no END Handler defined
            this.emit('respond', this);
            return;
        }
        let args = this.getSortedArgumentsInput(
            this.handlers[this.getIntentName()]
        );

        this.handlers[this.getIntentName()].apply(this, args);
    }

    /**
     * Handles state intent requests
     *
     * @throws if given state has not been defined in the handler
     */
    handleStateIntentRequest() {
        if (!this.handlers[this.getState()]) {
            throw new Error('Error: State ' + this.getState() + ' has not been defined in the handler.');
        }

        let intentToRedirect = this.getIntentName();
        let args = [];

        // intent not in state defined; should return Unhandled or global intent
        if (!this.handlers[this.getState()][intentToRedirect]) {
            // fallback intent outside of the state
            if (this.handlers[intentToRedirect]) {
                args = this.getSortedArgumentsInput(
                    this.handlers[intentToRedirect]
                );
                this.handlers[intentToRedirect].apply(this, args);
                return;
            } else { // intent not in state and not in global
                intentToRedirect = 'Unhandled';
                // try Unhandled in state first
                if (this.handlers[this.getState()][intentToRedirect]) {
                    args = this.getSortedArgumentsInput(
                        this.handlers[this.getState()][intentToRedirect]
                    );
                    this.handlers[this.getState()][intentToRedirect].apply(
                        this, args);
                } else { // go to global unhandled
                    args = this.getSortedArgumentsInput(
                        this.handlers[intentToRedirect]
                    );
                    this.handlers[intentToRedirect].apply(this, args);
                }
                return;
            }
        } else {
            // handle STATE + Intent
            args = this.getSortedArgumentsInput(
                this.handlers[this.getState()][intentToRedirect]
            );
        }

        this.handlers[this.getState()][intentToRedirect].apply(this, args);
    }

    /**
     * Handles end requests
     */
    handleEndRequest() {
        // call specific 'END' in state
        if (this.getState() && this.handlers[this.getState()][HANDLER_END]) {
            this.handlers[this.getState()][HANDLER_END].call(this);
        } else if (this.handlers[HANDLER_END]) { // call global 'END'
            this.handlers[HANDLER_END].call(this);
        } else { // no END defined
            this.emit('respond', this);
        }
    }

    /**
     * In development
     * DO NOT USE
     */
    handleAudioPlayerRequest() {
        if (this.handlers['AUDIOPLAYER'][this.getPlatform().getAudioPlayer().getType()]) {
            this.handlers['AUDIOPLAYER'][this.getPlatform().getAudioPlayer().getType()].call();
        }
    }

    /**
     * Maps incoming request input key names with
     * keys from the inputMap
     * @private
     */
    mapInputs() {
        this.inputs = {};
        let requestInputs = this.getPlatform().getInputs();

        // set request inputs if no input map was set
        if (Object.keys(this.inputMap).length === 0 &&
            this.inputMap.constructor === Object) {
            this.inputs = requestInputs;
            return;
        }
        // map keys from inputMap
        Object.keys(requestInputs).forEach((inputKey) => {
            let mappedInputKey = this.inputMap[inputKey] ?
                                    this.inputMap[inputKey] : inputKey;
            this.inputs[mappedInputKey] = requestInputs[inputKey];
        });
    }

    /**
     * Matches inputs with parameter from handlers
     * @private
     * @param {function} func
     * @return {Array}
     */
    getSortedArgumentsInput(func) {
        let paramNames = getParamNames(func);
        let sortedArguments = [];
        let inputObjectKeys = Object.keys(this.inputs);

        // camilze input keys
        let tempInputs = {};
        for (let i = 0; i < inputObjectKeys.length; i++) {
            tempInputs[camelize(inputObjectKeys[i])] =
                this.inputs[inputObjectKeys[i]];
        }

        for (let i = 0; i < paramNames.length; i++) {
            sortedArguments[i] = tempInputs[paramNames[i]];
        }
        return sortedArguments;
    }

    /**
     * Jumps to an intent
     * @public
     * @param {string} intent name of intent
     * @param {array} args passed argument
     */
    toIntent(intent) {
        if (this.getState()) {
            if (!this.handlers[this.getState()][intent]) {
                throw Error(`${this.getState()}-${intent} could not be found in your handler`);
            }
            let args = Array.prototype.slice.call(arguments, 1); // eslint-disable-line

            this.handlers[this.getState()][intent].apply(this, args);
        } else {
            if (!this.handlers[intent]) {
                throw Error(intent + ' could not be found in your handler');
            }
            let args = Array.prototype.slice.call(arguments, 1); // eslint-disable-line

            this.handlers[intent].apply(this, args);
        }
    }

    /**
     * Jumps to state scoped intent
     * @public
     * @param {string} state name of state
     * @param {string} intent name of intent
     * @param {array} args passed arg
     */
    toStateIntent(state, intent) {
        if (!this.handlers[state]) {
            throw Error(`State ${state} could not be found in your handler`);
        }
        if (!this.handlers[state][intent]) {
            throw Error(`${state}-${intent} could not be found in your handler`);
        }

        this.getPlatform().setState(state);

        let args = Array.prototype.slice.call(arguments, 2); // eslint-disable-line
        this.handlers[state][intent].apply(this, args);
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
        if (STANDARD_INTENT_MAP[platformIntentName]) {
            return STANDARD_INTENT_MAP[platformIntentName];
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
     * Returns locale of platform
     * @public
     * @return {string} locale
     */
    getLocale() {
        return this.getPlatform().getLocale();
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
        return this.getPlatform().getSessionAttribute(name);
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
        if (speech instanceof SpeechBuilder) {
            speech = speech.build();
        }

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
        if (speech instanceof SpeechBuilder) {
            speech = speech.build();
        }

        if (!repromptSpeech) {
            repromptSpeech = speech;
        }

        if (repromptSpeech instanceof SpeechBuilder) {
            repromptSpeech = repromptSpeech.build();
        }

        this.getPlatform().ask(
            SpeechBuilder.toSSML(speech),
            SpeechBuilder.toSSML(repromptSpeech));
        this.emit('respond', this);
    }

    /**
     * Shows simple card to response
     * @public
     * @param {string} title
     * @param {string} content
     * @return {Jovo}
     */
    showSimpleCard(title, content) {
        this.getPlatform().showSimpleCard(title, content);
        return this;
    }

    /**
     * Shows image card to response
     * @public
     * @param {string} title
     * @param {string} content
     * @param {string} imageUrl secure url
     * @return {Jovo}
     */
    showImageCard(title, content, imageUrl) {
        this.getPlatform().showImageCard(title, content, imageUrl);
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
            throw Error(`State ${state} could not be found in your handler`);
        }
        this.getPlatform().setState(state);
        return this;
    }
    /**
     * Translates a path with values provided
     * @public
     * @param {string} path to the resource to translate
     * @param {*} values to replace inside the path
     * @return {string}
     */
    t() {
        if (!this.languageResourcesSet) {
            throw new Error('Language resources have not been set for translation.');
        }

        return i18n.t.apply(i18n, arguments);
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
     * Returns path to function inside the handler
     * Examples
     * LAUNCH = Launch function
     * State1:IntentA => IntentA in state 'State1'
     * @return {*}
     */
    getHandlerPath() {
        if (this.platform.getRequestType() === REQUEST_TYPE_ENUM.LAUNCH) {
            return REQUEST_TYPE_ENUM.LAUNCH;
        }
        if (this.getState()) {
            return `${this.getState()}: ${this.getIntentName()}`;
        }
        return this.getIntentName();
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
     * Returns AlexaSkill object
     * @public
     * @return {AlexaSkill}
     */
    alexaSkill() {
        if (this.isAlexaSkill()) {
            return this.getPlatform();
        }
        return null;
    }

    /**
     * Sets applicationId id
     * Prevents request from not permitted applications
     * TODO any idea for google actions?
     * @param {array} applicationIds
     */
    setAllowedApplicationIds(applicationIds) {
        this.allowedApplicationIds = applicationIds;
    }

    /**
     * Returns GoogleAction object
     * @public
     * @return {GoogleAction}
     */
    googleAction() {
        if (this.isGoogleAction()) {
            return this.getPlatform();
        }
        return null;
    }


    /**
     * Checks handlers for valid structure/values/types.
     *
     * @private
     * @throws Error
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
     * Determines and sets type of the request
     * LAMBDA or WEBHOOK
     * @private
     */
    setType() {
        if (typeof this.response === 'function') {
            this.type = TYPE_ENUM.LAMBDA;
        } else if (typeof this.response === 'object') {
            this.type = TYPE_ENUM.WEBHOOK;
        }
    }

    /**
     * Determines and initiates platform.
     * GoogleAction or AlexaSkill
     *
     */
    setPlatform() {
        if (this.request.result) {
            this.platform = new GoogleAction(this, this.request);
        } else {
            this.platform = new AlexaSkill(this, this.request);
        }
    }

    /**
     * Returns the default db (if no name)
     * Returns the db instance by given name.
     * @param {string} name
     * @return {*}
     */
    db(name) {
        return this.moduleDatabase.use(this.getUserId(), name);
    }

    /**
     * Adds further database implementations
     * @param {string} name
     * @param {*} implementation
     */
    addDb(name, implementation) {
        this.moduleDatabase.addDb(name, implementation);
    }

    /**
     * Adds default database implementation
     * @param {string} name
     * @param {*} implementation
     */
    setDb(name, implementation) {
        this.moduleDatabase = new Db(name, implementation);
    }

    /**
     * sets Dynamo DB as default db
     * @param {string} tableName
     * @param {*} awsConfig
     */
    setDynamoDb(tableName, awsConfig) {
        this.moduleDatabase = new Db('dynamodb', new DynamoDb(tableName, awsConfig));
    }

    /**
     * Analytics instance
     * @return {Analytics.Analytics|Analytics}
     */
    analytics() {
        return this.moduleAnalytics;
    }

    /**
     * Adds analytics implementation
     * @param {string} name
     * @param {*} implementation
     */
    addAnalytics(name, implementation) {
        this.moduleAnalytics.addAnalytics(name, implementation);
    }

    /**
     * Adds voicelabs analytics for alexa
     * @param {string} token
     */
    addVoiceLabsAlexa(token) {
        this.addAnalytics('voicelabs_alexa', new Analytics.VoiceLabsAlexaAnalytics(token));
    }

    /**
     * Adds voicelabs analytics for google action
     * @param {string} token
     */
    addVoiceLabsGoogleAction(token) {
        this.addAnalytics('voicelabs_googleaction', new Analytics.VoiceLabsGoogleActionAnalytics(token));
    }

    /**
     * Adds dashbot analytics for google action
     * @param {string} apiKey
     */
    addDashbotGoogleAction(apiKey) {
        this.addAnalytics('dashbotio_googleaction', new Analytics.DashbotGoogleActionAnalytics(apiKey));
    }

    /**
     * Adds dashbot analytics for alexa
     * @param {string} apiKey
     */
    addDashbotAlexa(apiKey) {
        this.addAnalytics('dashbotio_alexa', new Analytics.DashbotAlexaAnalytics(apiKey));
    }

    /**
     * Returns state of dialog
     * @return {DIALOGSTATE_ENUM}
     */
    getDialogState() {
        return this.getPlatform().getDialogState();
    }

    /**
     * Sets responseObject to continue the dialog
     */
    continueDialog() {
        this.getPlatform().continueDialog();
        this.emit('respond', this);
    }

    respond() {
        this.emit('respond', this);
    }
}


/** Class SpeechBuilder */
class SpeechBuilder {

    /**
     * Constructor
     * @public
     * @param {AlexaSkill|GoogleAction|*} platformType
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
        if (this.platformType === PLATFORM_ENUM.ALEXA_SKILL) {
            this.speech += '<audio src="' + url + '"/>';
        } else if (this.platformType === PLATFORM_ENUM.GOOGLE_ACTION) {
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
        text = text.replace(/&/g, 'and');

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

/**
 * Returns parameter names of a method
 * https://stackoverflow.com/a/9924463
 * @param {function} func
 * @return {Array|{index: number, input: string}}
 */
function getParamNames(func) {
    let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    let ARGUMENT_NAMES = /([^\s,]+)/g;
    let fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) {
        result = [];
    }
    return result;
}

/**
 * Helper function
 * camelizes a string
 * @param {string} str
 * @return {string}
 */
function camelize(str) {
    str = str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
    str = str.replace(/[^a-zA-Z]/g, '');
    return str;
}

module.exports.Jovo = Jovo;
module.exports.SpeechBuilder = SpeechBuilder;


module.exports.TYPE_ENUM = TYPE_ENUM;

module.exports.REQUEST_TYPE_ENUM = REQUEST_TYPE_ENUM;
module.exports.PLATFORM_ENUM = PLATFORM_ENUM;
module.exports.DIALOGSTATE_ENUM = DIALOGSTATE_ENUM;

module.exports.HANDLER_LAUNCH = HANDLER_LAUNCH;
module.exports.HANDLER_END = HANDLER_END;
