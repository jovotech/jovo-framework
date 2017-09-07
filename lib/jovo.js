'use strict';

const _ = require('lodash');
const EventEmitter = require('events');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const User = require('./user').User;

// Platforms
const AlexaSkill = require('./platforms/alexa/alexaSkill').AlexaSkill;
const GoogleAction = require('./platforms/googleaction/googleAction').GoogleAction;

// Database implementation
// const FilePersistence = require('./integrations/db/filePersistence').FilePersistence;
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
        this.userSave = true;
        this.userDataCol = 'userData';
        this.responseSent = false;
        this.saveBeforeResponseEnabled = false;

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
                app.responseSent = true;
                // log response object
                if (app.logRes) {
                    if (this.responseLoggingObjects) {
                       this.responseLoggingObjects.forEach((path) => {
                           console.log(JSON.stringify(_.get(app.getPlatform().getResponseObject(), path), null, '\t'));
                       });
                    } else {
                        console.log(JSON.stringify(app.getPlatform().getResponseObject(), null, '\t'));
                    }
                }

                // calls track function. by default no analytics provider is set
                app.analytics().track(app);
            })
            .catch((err) => {
                console.log('Error on respond', err);
            });
        });
    }

    /**
     * Saves user specific data in db on response
     * @return {Promise}
     */
    saveUserDataOnResponse() {
        let that = this;
        return new Promise((resolve, reject) => {
            if (that.userSave) {
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
            if (that.userSave) {
                that.db().loadObject(function(error, data) {
                    if (error && (error.code === 'ERR_MAIN_KEY_NOT_FOUND' ||
                            error.code === 'ERR_DATA_KEY_NOT_FOUND')) {
                        that.user().setIsNewUser(true);
                        data = User.createUserData();
                    } else if (!data[that.getUserDataCol()]) {
                        data = User.createUserData();
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
        Jovo.validateHandlers(handlers);
        this.response = response;
        this.handlers = handlers;
        this.responseSent = false;
        this.setType(); // lambda or webhook
        if (this.type === TYPE_ENUM.LAMBDA) {
            this.request = request;
        } else if (this.type === TYPE_ENUM.WEBHOOK) {
            this.request = request.body;
        }
        this.setPlatform(); // alexa or googlehome

        this.userObj = new User(this.platform);
        // prints request object
        if (this.logReq) {
            if (this.requestLoggingObjects) {
                this.requestLoggingObjects.forEach((path) => {
                    console.log(JSON.stringify(_.get(this.request, path), null, '\t'));
                });
            } else {
                console.log(JSON.stringify(this.request, null, '\t'));
            }
        }
        this.speech = this.speechBuilder();

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
     * @param {object} resources
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
        this.logRes = true;
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
        let that = this;
        this.loadUserDataOnRequest()
            .then(() => {
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
                if (that.isAudioPlayerRequest()) {
                    that.handleAudioPlayerRequest();
                }
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
        if (this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED][this.getElementId()]) {
            elementId = this.getElementId();
        }

        if (elementId === 'Unhandled' &&
            !this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED]['Unhandled']) {
                throw new Error('Error: ' + REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED + ' with elementId ' + this.getElementId() + ' has not been defined in the handler.');
        }

        this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED][elementId].call(this);
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
    enableUserSave(saveOrNot) {
        this.userSave = saveOrNot;
    }

    /**
     * Returs id of the touched/selected item
     * @return {*}
     */
    getElementId() {
        return this.platform.getElementId();
    }
    /**
     * Emits respond
     */
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
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addAudio(url, text, condition, probability) {
        // gets random element from array if url
        // is of type array
        if (_.isArray(url)) {
            let rand = Math.floor(Math.random() * url.length);
            url = url[rand];
            // takes the same index from the text array
            if (this.platformType === PLATFORM_ENUM.GOOGLE_ACTION) {
                text = text[rand];
            }
        }
        let speech = '';
        if (this.platformType === PLATFORM_ENUM.ALEXA_SKILL) {
            speech += '<audio src="' + url + '"/>';
        } else if (this.platformType === PLATFORM_ENUM.GOOGLE_ACTION) {
            speech += '<audio src="' + url + '">' + text + '</audio>';
        }
        return this.addText(speech, condition, probability);
    }

    /**
     * Adds text surrounded by <s> tags
     * @param {string} text
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addSentence(text, condition, probability) {
        if (_.isArray(text)) {
            text = _.sample(text);
        }
        return this.addText('<s>' + text + '</s>', condition, probability);
    }

    /**
     * Adds <say-as> tags with interpret-as cardinal
     * @param {string} number
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addSayAsCardinal(number, condition, probability) {
        if (_.isArray(number)) {
            number = _.sample(number);
        }
        return this.addText('<say-as interpret-as="cardinal">'+number+'</say-as>', condition, probability);
    }

    /**
     * Adds <say-as> tags with interpret-as ordinal
     * @param {string} number
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addSayAsOrdinal(number, condition, probability) {
        if (_.isArray(number)) {
            number = _.sample(number);
        }
        return this.addText('<say-as interpret-as="ordinal">'+number+'</say-as>', condition, probability);
    }

    /**
     * Adds <say-as> tags with interpret-as characters
     * @param {string} characters
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addSayAsCharacters(characters, condition, probability) {
        if (_.isArray(characters)) {
            characters = _.sample(characters);
        }
        return this.addText('<say-as interpret-as="characters">'+characters+'</say-as>', condition, probability);
    }

    /**
     * Adds break tag to speech obj
     * @public
     * @param {string} time timespan like 3s, 500ms etc
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addBreak(time, condition, probability) {
        if (_.isArray(time)) {
            time = _.sample(time);
        }
        return this.addText('<break time="' + time + '"/>', condition, probability);
    }
    /**
     * Adds text to speech
     * @public
     * @param {string} text
     * @param {boolean} condition
     * @param {float} probability
     * @return {SpeechBuilder}
     */
    addText(text, condition, probability) {
        if (_.isBoolean(condition) && condition === false) {
            return this;
        }
        if (_.isNumber(probability)) {
            if (Math.random() >= probability) {
                return this;
            }
        }
        if (this.speech.length > 0) {
            this.speech += ' ';
        }

        // gets random element from array if text
        // is of type array
        if (_.isArray(text)) {
            text = _.sample(text);
        }

        this.speech += text;
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
        if (!text) {
           throw Error('Invalid output text: ' + text);
        }
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
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
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
