'use strict';

const _ = require('lodash');
const EventEmitter = require('events');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// Platforms
const AlexaSkill = require('./platforms/alexa/alexaSkill').AlexaSkill;
const GoogleAction = require('./platforms/googleaction/googleAction').GoogleAction;

const SpeechBuilder = require('./platforms/speechBuilder').SpeechBuilder;
// Database implementation
const FilePersistence = require('./integrations/db/filePersistenceV2').FilePersistence;

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
    ON_ELEMENT_SELECTED: 'ON_ELEMENT_SELECTED',
    ON_SIGN_IN: 'ON_SIGN_IN',
    AUDIOPLAYER: 'AUDIOPLAYER',
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

const DEFAULT_CONFIG = Object.freeze({
    requestLogging: false,
    responseLogging: false,
    saveUserOnResponseEnabled: true,
    userDataCol: 'userData',
    inputMap: {},
    intentMap: {},
    requestLoggingObjects: [],
    responseLoggingObjects: [],
    saveBeforeResponseEnabled: false,
    allowedApplicationIds: [],
    localDbFilename: 'db',
    userMetaData: {
        lastUsedAt: true,
        sessionsCount: true,
        createdAt: true,
        requestHistorySize: 0,
        devices: false,
    },
    i18n: {
        overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
        load: 'all',
    },
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
/** Class Jovo */
class Jovo extends EventEmitter {

    /**
     * Constructor
     * @public
     */
    constructor() {
        super();
        this.setConfig(DEFAULT_CONFIG);
        // initialize file db as default database
        this.moduleAnalytics = new Analytics.Analytics();
        this.responseSent = false;
        this.handlers = {};

        this.on('respond', function(app) {
            app
                .saveUserDataOnResponse(app)
                .then(() => {
                    return app.saveDataBeforeResponse();
                })
                .then(() => {
                    if (app.responseSent) {
                        throw new Error('Error: Can\'t send more than one response per request.');
                    }

                    // set response object depending on type of request
                    if (app.type === TYPE_ENUM.LAMBDA) {
                        app.response(null, app.getPlatform().getResponseObject());
                    } else if (app.type === TYPE_ENUM.WEBHOOK) {
                        app.response.json(app.getPlatform().getResponseObject());
                    }


                    app.printResponseLog(app);

                    // calls track function. by default no analytics provider is set
                    app.analytics().track(app);
                    app.responseSent = true;
                })
                .catch((err) => {
                    console.log('Error on respond', err);
                });
        });
    }


    /**
     * Sets config for app
     * @param {*} config
     */
    setConfig(config) {
        if (!config) {
            throw new Error('config cannot be empty');
        }

        if (typeof config.requestLogging !== 'undefined') {
            this.requestLogging = config.requestLogging;
        }
        if (typeof config.responseLogging !== 'undefined') {
            this.responseLogging = config.responseLogging;
        }
        if (typeof config.saveUserOnResponseEnabled !== 'undefined') {
            this.saveUserOnResponseEnabled = config.saveUserOnResponseEnabled;
        }
        if (typeof config.userDataCol !== 'undefined') {
            this.userDataCol = config.userDataCol;
        }
        if (typeof config.inputMap !== 'undefined') {
            this.inputMap = config.inputMap;
        }
        if (typeof config.intentMap !== 'undefined') {
            this.intentMap = config.intentMap;
        }
        if (typeof config.requestLoggingObjects !== 'undefined') {
            this.requestLoggingObjects = config.requestLoggingObjects;
        }
        if (typeof config.responseLoggingObjects !== 'undefined') {
            this.responseLoggingObjects = config.responseLoggingObjects;
        }
        if (typeof config.saveBeforeResponseEnabled !== 'undefined') {
            this.saveBeforeResponseEnabled = config.saveBeforeResponseEnabled;
        }
        if (typeof config.allowedApplicationIds !== 'undefined') {
            this.allowedApplicationIds = config.allowedApplicationIds;
        }
        if (typeof config.localDbFilename !== 'undefined') {
            this.localDbFilename = config.localDbFilename;
        }
        if (typeof config.userMetaData !== 'undefined') {
            this.userMetaData = config.userMetaData;
        }
        // console.log(config.i18n);
        if (config.i18n) {
            this.i18nConfig = config.i18n;
            if (this.i18nConfig.resources) {
                this.setLanguageResources(this.i18nConfig.resources, this.i18nConfig);
            }
        }
        this.moduleDatabase = new Db('file', new FilePersistence(this.localDbFilename));
    }

    /**
     * Saves user specific data in db on response
     * @return {Promise}
     */
    saveUserDataOnResponse() {
        let that = this;
        return new Promise((resolve, reject) => {
            if (that.saveUserOnResponseEnabled) {
                this.user().updateMetaData();
                this.db().saveFullObject(
                    this.getUserDataCol(),
                    this.user().getData(), function(error, data) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                }, true);
            } else {
                resolve();
            }
        });
    }

    /**
     * Loads user specific data from db on request
     * @return {Promise}
     */
    loadUserDataOnRequest() {
        let that = this;
        return new Promise((resolve, reject) => {
            if (that.saveUserOnResponseEnabled) {
                that.db().loadObject(function(error, data) {
                    if (error && (error.code === 'ERR_MAIN_KEY_NOT_FOUND' ||
                            error.code === 'ERR_DATA_KEY_NOT_FOUND')) {
                        that.user().setIsNewUser(true);
                        data = that.user().createUserData();
                    } else if (!data[that.getUserDataCol()]) {
                        data = that.user().createUserData();
                    } else {
                        data = data[that.getUserDataCol()];
                    }
                    that.user().setData(data);

                    resolve();
                }, true);
            } else {
                resolve();
            }
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
        if (handlers) {
            this.handlers = handlers;
        }
        this.response = response;
        this.responseSent = false;
        this.setType(); // lambda or webhook
        if (this.type === TYPE_ENUM.LAMBDA) {
            this.request = request;

            if (this.moduleDatabase.databases.file) {
               this.saveUserOnResponse(false);
            }
        } else if (this.type === TYPE_ENUM.WEBHOOK) {
            this.request = request.body;
        }
        this.setPlatform(); // alexa or googlehome

        this.userObj = this.platform.makeUser(this.userMetaData);
        this.printRequestLog(this);
        this.speech = this.speechBuilder();
        return this;
    }

    /**
     * Sets alexa handlers
     * @param {*} handlers
     */
    setAlexaHandler(handlers) {
        Jovo.validateHandlers(handlers);
        this.alexaHandlers = handlers;
    }

    /**
     * Sets google action handlers
     * @param {*} handlers
     */
    setGoogleActionHandler(handlers) {
        Jovo.validateHandlers(handlers);
        this.googleActionHandlers = handlers;
    }

    /**
     * Aborts response if request's skillId doesn't match
     * configurated skillId
     * @return {boolean} requestAllowed
     */
    isRequestAllowed() {
        if (this.allowedApplicationIds.length > 0) {
            if (this.allowedApplicationIds.indexOf(
                this.getPlatform().getApplicationId()
                ) === -1 ) {
                return false;
            }
        }
        return true;
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

        if (this.isAlexaSkill() && this.alexaHandlers) {
           _.assign(this.handlers, this.alexaHandlers);
        } else if (this.isGoogleAction() && this.googleActionHandlers) {
           _.assign(this.handlers, this.googleActionHandlers);
        }

        // throws error if structure of handlers is not valid
        Jovo.validateHandlers(this.handlers);


        let that = this;
        return this.loadUserDataOnRequest()
            .then(() => {
                try {
                    if (that.isLaunchRequest()) {
                        that.handleLaunchRequest();
                    }

                    if (that.isIntentRequest()) {
                        that.handleIntentRequest();
                    }

                    if (that.isEndRequest()) {
                        that.handleEndRequest();
                    }

                    if (that.isElementSelectedRequest()) {
                        that.handleElementSelectedRequest();
                    }
                    if (that.isSignInRequest()) {
                        that.handleSignInRequest();
                    }
                    if (that.isAudioPlayerRequest()) {
                        that.handleAudioPlayerRequest();
                    }
                    Promise.resolve();
                } catch (err) {
                    return Promise.reject(err);
                }
            }).catch((error) => {
                console.log(error);
                return Promise.reject(error);
            });
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
        return this.getPlatform().getRequestType() === REQUEST_TYPE_ENUM.AUDIOPLAYER;
    }

    /**
     * Type of request is 'Element Selected" on visual interfaces
     * @return {boolean}
     */
    isElementSelectedRequest() {
        return this.getPlatform().getRequestType() === REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED;
    }

    /**
     * Type of request is 'Element Selected" on visual interfaces
     * @return {boolean}
     */
    isSignInRequest() {
        return this.getPlatform().getRequestType() === REQUEST_TYPE_ENUM.ON_SIGN_IN;
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
            if (!this.handlers['Unhandled']) {
                throw new Error('The intent name ' + this.getIntentName() + ' has not been defined in your handler.');
            }
            let args = this.getSortedArgumentsInput(
                this.handlers['Unhandled']
            );
            this.handlers['Unhandled'].apply(this, args);
            return;
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

            if (this.handlers[this.getState()]['Unhandled']) {
                args = this.getSortedArgumentsInput(
                    this.handlers[this.getState()]['Unhandled']
                );
                this.handlers[this.getState()]['Unhandled'].apply(
                    this, args);
            } else if (this.handlers[intentToRedirect]) {
                args = this.getSortedArgumentsInput(
                    this.handlers[intentToRedirect]
                );
                this.handlers[intentToRedirect].apply(this, args);
                return;
            } else { // go to global unhandled
                args = this.getSortedArgumentsInput(
                    this.handlers['Unhandled']
                );
                this.handlers['Unhandled'].apply(this, args);
            }
            return;
        } else {
            // handle STATE + Intent
            args = this.getSortedArgumentsInput(
                this.handlers[this.getState()][intentToRedirect]
            );
        }

        this.handlers[this.getState()][intentToRedirect].apply(this, args);
    }

    /**
     * Handles request with selected elements
     */
    handleElementSelectedRequest() {
        if (!this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED]) {
            throw new Error('Error: ' + REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED + ' has not been defined in the handler.');
        }

        if (typeof this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED] === 'function') {
            this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED].call(this);
            return;
        }
        let elementId = 'Unhandled';
        if (this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED][this.getSelectedElementId()]) {
            elementId = this.getSelectedElementId();
        }

        if (elementId === 'Unhandled' &&
            !this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED]['Unhandled']) {
                throw new Error('Error: ' + REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED + ' with elementId ' + this.getSelectedElementId() + ' has not been defined in the handler.');
        }

        this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED][elementId].call(this);
    }

    /**
     * Handles request with sign in infos
     */
    handleSignInRequest() {
        if (!this.handlers[REQUEST_TYPE_ENUM.ON_SIGN_IN]) {
            throw new Error('Error: ' + REQUEST_TYPE_ENUM.ON_SIGN_IN + ' has not been defined in the handler.');
        }
        this.handlers[REQUEST_TYPE_ENUM.ON_SIGN_IN].call(this);
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
        if (!this.handlers['AUDIOPLAYER']) {
            console.log('Error: No audio player handler defined.');
            return;
        }
        if (!this.handlers['AUDIOPLAYER'][this.getPlatform().audioPlayer().getType()]) {
            console.log('Warning: AUDIOPLAYER: '+ this.getPlatform().audioPlayer().getType() + ' not found in handler.');
        }

        if (this.handlers['AUDIOPLAYER'][this.getPlatform().audioPlayer().getType()]) {
            this.handlers['AUDIOPLAYER'][this.getPlatform().audioPlayer().getType()].call();
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
            let args = Array.prototype.slice.call(arguments, 1); // eslint-disable-line

            if (this.handlers[this.getState()][intent]) {
                this.handlers[this.getState()][intent].apply(this, args);
            } else if (this.handlers[intent]) {
                this.handlers[intent].apply(this, args);
            } else {
                throw Error(`${this.getState()}-${intent} could not be found in your handler`);
            }
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
        this.getPlatform().setState(state);
        let args = Array.prototype.slice.call(arguments, 2); // eslint-disable-line

        if (!state) {
            if (!this.handlers[intent]) {
                throw Error(`Intent ${intent} could not be found in your global handler`);
            }
            this.handlers[intent].apply(this, args);
        } else {
            if (!this.handlers[state]) {
                throw Error(`State ${state} could not be found in your handler`);
            }
            if (!this.handlers[state][intent]) {
                throw Error(`${state}-${intent} could not be found in your handler`);
            }
            this.handlers[state][intent].apply(this, args);
        }
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
     * Returns boolean if request is part of new session
     * @public
     * @return {boolean}
     */
    isNewSession() {
        return this.getPlatform().isNewSession();
    }

     /**
     * Returns timestamp of a user's request
     * @public
     * @return {string} timestamp
     */
    getTimestamp() {
        return this.getPlatform().getTimestamp();
    }

    /**
     * Returns audio capability of request device
     * @return {boolean}
     */
    hasAudioInterface() {
        return this.getPlatform().hasAudioInterface();
    }

    /**
     * Returns screen capability of request device
     * @return {boolean}
     */
    hasScreenInterface() {
        return this.getPlatform().hasScreenInterface();
    }


    /**
     * Sets session attributes
     * @public
     * @param {object} attributes
     * @return {Jovo} this
     */
    setSessionAttributes(attributes) {
        this.platform.setSessionAttributes(attributes);
        return this;
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

    /**
     * Shows ask for country and postal code card
     * @return {Jovo}
     */
    showAskForCountryAndPostalCodeCard() {
        this.getPlatform().showAskForCountryAndPostalCodeCard();
        return this;
    }

    /**
     * Shows ask for address card
     * @return {Jovo}
     */
    showAskForAddressCard() {
        this.getPlatform().showAskForAddressCard();
        return this;
    }

    /**
     * Shows ask for country and postal code card
     * @param {Array} types 'write' or 'read'
     * @return {Jovo}
     */
    showAskForListPermissionCard(types) {
        this.getPlatform().showAskForListPermissionCard(types);
        return this;
    }

    /**
     * Shows account linking card to response
     * @public
     * @return {Jovo}
     */
    showAccountLinkingCard() {
        this.getPlatform().showAccountLinkingCard();
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
     * @param {string} state null removes state
     * @return {Jovo}
     */
    followUpState(state) {
        if (state && !this.handlers[state]) {
            throw Error(`State ${state} could not be found in your handler`);
        }
        this.getPlatform().setState(state);
        return this;
    }

    /**
     * Removes STATE
     * @return {Jovo}
     */
    removeState() {
        this.followUpState(null);
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
        i18n.changeLanguage(this.getLocale());
        return i18n.t.apply(i18n, arguments); // eslint-disable-line
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
        if (this.platform.getRequestType() === REQUEST_TYPE_ENUM.END) {
            if (this.getEndReason()) {
                return REQUEST_TYPE_ENUM.END + ':' + this.getEndReason();
            }
            return REQUEST_TYPE_ENUM.END;
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
        return this.getPlatform().getSpeechBuilder();
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

    /** CONFIG SETTER */

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
     * Activates logging of request object
     * @public
     */
    enableRequestLogging() {
        this.requestLogging = true;
    }

    /**
     * Sets request logging objects
     * @param {string} path
     */
    setRequestLoggingObjects(path) {
        if (_.isString(path)) {
            path = [path];
        }
        this.requestLoggingObjects = path;
    }
    /**
     * Activates logging response object
     * @public
     */
    enableResponseLogging() {
        this.responseLogging = true;
    }

    /**
     * Sets response logging objects
     * @param {string} path
     */
    setResponseLoggingObjects(path) {
        if (_.isString(path)) {
            path = [path];
        }
        this.responseLoggingObjects = path;
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
     * Sets userData col name
     * @param {string} name
     */
    setUserDataCol(name) {
        this.userDataCol = name;
    }

    /**
     * enables saving attributes to database before response
     * @param {boolean} saveEnabled
     * @return {Jovo} this
     */
    enableSaveBeforeResponse(saveEnabled) {
        this.saveBeforeResponseEnabled = saveEnabled;
        return this;
    }

    /**
     *  Maps platform specific intent names to custom intent names
     * @public
     * @param {object} resources
     * @param {*} config custom i18next config
     */
    setLanguageResources(resources, config) {
        if (!_.isObject(resources) || _.keys(resources).length === 0) {
            throw Error('Invalid language resource.');
        }
        this.languageResourcesSet = true;

        this.i18nConfig.resources = resources;
        let initConfig = _.assignIn(this.i18nConfig, config);
        i18n
            .use(sprintf)
            .init(initConfig);
    }
    /** CONFIG SETTER END */


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
        if (this.type === TYPE_ENUM.LAMBDA && this.moduleDatabase.databases.file) {
           throw new Error('FilePersistence cannot be used in lambda');
        }
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
     * sets main key to save and get data from Dynamo DB
     * @param {string} dynamoDbKey
     */
    setDynamoDbKey(dynamoDbKey) {
        this.dynamoDbKey = dynamoDbKey;
    }

    /**
     * Returns userData col
     * @return {string|*}
     */
    getUserDataCol() {
        return this.userDataCol;
    }


    /**
     * saves all session attributes in database
     * @param {boolean} forceSave
     * @return {Promise} data
     */
    saveDataBeforeResponse(forceSave) {
        return new Promise((resolve, reject) => {
            if (this.saveBeforeResponseEnabled || forceSave) {
                this.saveBeforeResponseEnabled = false;

                this
                .db()
                .saveObject(this.dynamoDbKey, this.getSessionAttributes(), (err, data) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(data);
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Prints response if responseLogging is true
     * @private
     * @param {Jovo} app
     */
    printResponseLog(app) {
        // log response object
        if (app.responseLogging) {
            if (this.responseLoggingObjects.length > 0) {
                this.responseLoggingObjects.forEach((path) => {
                    console.log(JSON.stringify(_.get(app.getPlatform().getResponseObject(), path), null, '\t'));
                });
            } else {
                console.log(JSON.stringify(app.getPlatform().getResponseObject(), null, '\t'));
            }
        }
    }

    /**
     * Prints request if requestLogging is true
     * @param {Jovo} app
     */
    printRequestLog(app) {
        // prints request object
        if (app.requestLogging) {
            if (app.requestLoggingObjects.length > 0) {
                app.requestLoggingObjects.forEach((path) => {
                    console.log(JSON.stringify(_.get(app.request, path), null, '\t'));
                });
            } else {
                console.log(JSON.stringify(app.request, null, '\t'));
            }
        }
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

    /**
     * Returns alexa audio player instance
     * @return {AudioPlayer}
     */
    alexaAudioPlayer() {
        return this.alexaSkill().audioPlayer();
    }

    /**
     * Returns user object)
     * @return {User}
     */
    user() {
        return this.userObj;
    }

    /**
     * Enables user auto save
     * @param {boolean} saveOrNot
     */
    saveUserOnResponse(saveOrNot) {
        this.saveUserOnResponseEnabled = saveOrNot;
    }

    /**
     * Returs id of the touched/selected item
     * @return {*}
     */
    getSelectedElementId() {
        return this.platform.getSelectedElementId();
    }
    /**
     * Emits respond
     */
    respond() {
        this.emit('respond', this);
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
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
    str = str.replace(/[^a-zA-Z]/g, '');
    return str;
}

module.exports.Jovo = Jovo;

module.exports.TYPE_ENUM = TYPE_ENUM;

module.exports.REQUEST_TYPE_ENUM = REQUEST_TYPE_ENUM;
module.exports.PLATFORM_ENUM = PLATFORM_ENUM;
module.exports.DIALOGSTATE_ENUM = DIALOGSTATE_ENUM;

module.exports.HANDLER_LAUNCH = HANDLER_LAUNCH;
module.exports.HANDLER_END = HANDLER_END;

module.exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
