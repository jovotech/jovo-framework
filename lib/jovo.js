'use strict';

const _ = require('lodash');
const Platform = require('./platforms/plaform').Platform;
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// Platforms
const AlexaSkill = require('./platforms/alexa/alexaSkill').AlexaSkill;
const GoogleAction = require('./platforms/googleaction/googleAction').GoogleAction;
const util = require('./util');

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
    ON_PERMISSION: 'ON_PERMISSION',
    AUDIOPLAYER: 'AUDIOPLAYER',
    END: 'END',
    ERROR: 'ERROR',
});

const DIALOGSTATE_ENUM = Object.freeze({
    STARTED: 'STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
});

const HANDLER_LAUNCH = 'LAUNCH';
const HANDLER_END = 'END';
const HANDLER_NEW_USER = 'NEW_USER';
const HANDLER_NEW_SESSION = 'NEW_SESSION';
const UNHANDLED = 'Unhandled';

const STANDARD_INTENT_MAP = {
    'AMAZON.StopIntent': HANDLER_END,
};

const DEFAULT_CONFIG = Object.freeze({
    logging: false,
    requestLogging: false,
    responseLogging: false,
    requestLoggingObjects: [],
    responseLoggingObjects: [],
    saveUserOnResponseEnabled: true,
    userDataCol: 'userData',
    inputMap: {},
    intentMap: {},
    intentsToSkipUnhandled: [],
    saveBeforeResponseEnabled: false,
    allowedApplicationIds: [],
    db: {
        type: 'file',
        localDbFilename: 'db',
    },
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
    analytics: {
        intentsToSkip: [],
        usersToSkip: [],
        services: {},
    },
});

/** Class Jovo */
class Jovo extends Platform {

    /**
     * Constructor
     * @param {Object=} config
     * @public
     */
    constructor(config) {
        super();
        this.setConfig(DEFAULT_CONFIG);

        if (config) {
            this.setConfig(config);
        }

        this.responseSent = false;
        this.handlers = {};

        this.on('respond', () => {
            this
                .saveUserDataOnResponse()
                .then(this.saveDataBeforeResponse())
                .then(this.executeResponse())
                .catch((err) => {
                    console.log('Error on respond', err);
                });
        });
    }

    /**
     * ------------------------------------
     * ------------------------------------ JOVO public platform wrapper functions
     * ------------------------------------
     */

    /**
     * Returns type of platform ("AlexaSkill","GoogleAction")
     * @public
     * @return {string}
     */
    getType() {
        return this.getPlatform().getType();
    }

    /**
     * Returns UserID
     * @public
     * @return {string}
     */
    getUserId() {
        return this.getPlatform().getUserId();
    }

    /**
     * Returns user's access token
     * @public
     * @return {string}
     */
    getAccessToken() {
        return this.getPlatform().getAccessToken();
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
     * Returns intent name after custom and standard intent mapping
     * @public
     * @return {string} name of intent
     */
    getIntentName() {
        if (this.isLaunchRequest()) {
            return HANDLER_LAUNCH;
        } else {
            let platformIntentName = this.getPlatform().getIntentName();

            // use intent mapping if set
            if (this.config.intentMap && this.config.intentMap[platformIntentName]) {
                return this.config.intentMap[platformIntentName];
            }

            // user standard intent mapping
            if (STANDARD_INTENT_MAP[platformIntentName]) {
                return STANDARD_INTENT_MAP[platformIntentName];
            }

            return platformIntentName;
        }
    }

    /**
     * Returns End of reason. Use in 'END'
     *
     * e.g. StopIntent or EXCEEDED_REPROMPTS
     * (not available on google action)
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
     * Returns audio capability of request device
     * @public
     * @return {boolean}
     */
    hasAudioInterface() {
        return this.getPlatform().hasAudioInterface();
    }

    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasScreenInterface() {
        return this.getPlatform().hasScreenInterface();
    }

    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasVideoInterface() {
        return this.getPlatform().hasVideoInterface();
    }

    /**
     * Type of platform is Alexa Skill
     * @public
     * @return {boolean} isAlexaSkill
     */
    isAlexaSkill() {
        return this.getPlatform().getType() === PLATFORM_ENUM.ALEXA_SKILL;
    }

    /**
     * Type of platform is Google Action
     * @public
     * @return {boolean} isGoogleAction
     */
    isGoogleAction() {
        return this.getPlatform().getType() === PLATFORM_ENUM.GOOGLE_ACTION;
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

    /**
     * Returns platform object
     * @public
     * @return {GoogleAction|AlexaSkill|*}
     */
    getPlatform() {
        return this.platform;
    }

    /**
     * Returns request instance
     * @return {*}
     */
    request() {
        return this.getPlatform().getRequest();
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
     * Returns user object)
     * @public
     * @return {User}
     */
    user() {
        return this.userObj;
    }
    /**
     * Returns path to function inside the handler
     * Examples
     * LAUNCH = Launch function
     * State1:IntentA => IntentA in state 'State1'
     * @public
     * @return {*}
     */
    getHandlerPath() {
        if (this.getPlatform().getRequestType() === REQUEST_TYPE_ENUM.LAUNCH) {
            return REQUEST_TYPE_ENUM.LAUNCH;
        }
        if (this.getPlatform().getRequestType() === REQUEST_TYPE_ENUM.END) {
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
     * Returns state value stored in the request session
     * @public
     * @return {*}
     */
    getState() {
        return this.getPlatform().getState();
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
        return this.getPlatform().getSessionAttributes();
    }

    /**
     * Returs id of the touched/selected item
     * @public
     * @return {*}
     */
    getSelectedElementId() {
        return this.getPlatform().getSelectedElementId();
    }

    /**
     * Sets session attributes
     * @public
     * @param {object} attributes
     * @return {Jovo} this
     */
    setSessionAttributes(attributes) {
        this.getPlatform().setSessionAttributes(attributes);
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
        this.getPlatform().setSessionAttribute(name, value);
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
     * Responds with the given text and ends session
     * Transforms plaintext to SSML
     * @public
     * @param {string|SpeechBuilder} speech Plaintext or SSML
     */
    tell(speech) {
        this.getPlatform().tell(speech);
    }

    /**
     * Plays audio file
     * @public
     * @param {string} audioUrl secure url to audio file
     * @param {string} fallbackText (only works with google action)
     */
    play(audioUrl, fallbackText) {
        this.getPlatform().play(audioUrl, fallbackText);
    }

    /**
     * Says speech and waits for answer from user.
     * Reprompt when user input fails.
     * Keeps session open.
     * @public
     * @param {string|SpeechBuilder} speech
     * @param {string|SpeechBuilder|Array<SpeechBuilder>|Array<string>} repromptSpeech
     */
    ask(speech, repromptSpeech) {
        this.getPlatform().ask(speech, repromptSpeech);
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
     * Shows account linking card to response
     * @public
     * @return {Jovo}
     */
    showAccountLinkingCard() {
        this.getPlatform().showAccountLinkingCard();
        return this;
    }

    /**
     * Fires respond event and ends session.
     * @public
     */
    endSession() {
        this.getPlatform().endSession();
    }
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
     * Removes STATE from session
     * @public
     * @return {Jovo}
     */
    removeState() {
        this.followUpState(null);
        return this;
    }

    /**
     * Jumps to an intent in the order state > global > unhandled > error
     * @public
     * @param {string} intent name of intent
     * @param {array} args passed argument
     */
    toIntent(intent) {
        let args = Array.prototype.slice.call(arguments, 1); // eslint-disable-line

        if (this.getState() && this.handlers[this.getState()][intent]) {
            this.handlers[this.getState()][intent].apply(this, args);
        } else if (this.handlers[intent]) {
            this.handlers[intent].apply(this, args);
        } else if (this.handlers[UNHANDLED]) {
            this.handlers[UNHANDLED].apply(this, args);
        } else {
            throw Error(intent + ' could not be found in your handler');
        }
    }

    /**
     * Jumps to state intent in the order state > unhandled > error
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
                if (this.handlers[state][UNHANDLED]) {
                    this.handlers[state][UNHANDLED].apply(this, args);
                } else {
                    throw Error(`${state}-${intent} could not be found in your handler`);
                }
            } else {
                this.handlers[state][intent].apply(this, args);
            }
        }
    }

    /**
     * Jumps from the inside of a state to a global intent
     * @public
     * @param {string} intent name of intent
     * @param {array} args passed argument
     */
    toStatelessIntent(intent) {
        this.getPlatform().setState(null);
        let args = Array.prototype.slice.call(arguments, 1); // eslint-disable-line

        if (this.handlers[intent]) {
            this.handlers[intent].apply(this, args);
        } else if (this.handlers[UNHANDLED]) {
            this.handlers[UNHANDLED].apply(this, args);
        } else {
            throw Error(intent + ' could not be found in your global handler');
        }
    }

    /**
     * Jumps to global intent
     * @public
     * @param {string} intent - intent name
     */
    toGlobalIntent(intent) {
        this.toStatelessIntent.apply(this, arguments); // eslint-disable-line
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
        this.emit('handleRequest', request, response, handlers); // eslint-disable-line
        if (handlers) {
            this.handlers = handlers;
        }
        this.response = response;
        this.responseSent = false;
        this.setType(); // lambda or webhook
        if (this.type === TYPE_ENUM.LAMBDA) {
            this.requestObj = request;

            // prevent from saving locally on lambda
            if (this.moduleDatabase.databases.file) {
               this.setSaveUserOnResponseEnabled(false);
            }
        } else if (this.type === TYPE_ENUM.WEBHOOK) {
            this.requestObj = request.body;
        }

        this.setPlatform();
        this.printRequestLog();
        this.userObj = this.getPlatform().makeUser(this.config.userMetaData);

        this.speech = this.speechBuilder();
        return this;
    }

    /**
     * Handles request from webhook
     * @param {*} req
     * @param {*} res
     */
    handleWebhook(req, res) {
        this.handleRequest(req, res, this.handlers).execute();
    }

    /**
     * Handles request from lambda
     * @param {*} event
     * @param {*} context
     * @param {*} callback
     */
    handleLambda(event, context, callback) {
        this.handleRequest(event, callback, this.handlers).execute();
    }

    /**
     * Executes Handler
     * @public
     * @return {Promise} promise
     */
    execute() {
        this.emit('beforeExecute', this);

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
        util.validateHandlers(this.handlers);


        return this.loadUserDataOnRequest()
            .then(() => {
                try {
                    if (this.isLaunchRequest()) {
                        this.handleLaunchRequest();
                    } else if (this.isIntentRequest()) {
                        this.handleIntentRequest();
                    } else if (this.isEndRequest()) {
                        this.handleEndRequest();
                    } else if (this.isElementSelectedRequest()) {
                        this.handleElementSelectedRequest();
                    } else if (this.isSignInRequest()) {
                        this.handleSignInRequest();
                    } else if (this.isPermissionRequest()) {
                        this.handlePermissionRequest();
                    } else if (this.isAudioPlayerRequest()) {
                        this.handleAudioPlayerRequest();
                    }
                    this.emit('afterExecute', this);
                    Promise.resolve();
                } catch (err) {
                    return Promise.reject(err);
                }
            }).catch((error) => {
                console.log(error);
                this.emit('error', error);
                return Promise.reject(error);
            });
    }

    /**
     * ------------------------------------
     * ------------------------------------ Private JOVO methods
     * ------------------------------------
     */

    /**
     * Type of request is launch request
     * @private
     * @return {boolean} isLaunchRequest
     */
    isLaunchRequest() {
        return this.getPlatform().getRequestType() === REQUEST_TYPE_ENUM.LAUNCH;
    }

    /**
     * Type of request is intent request
     * @private
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
     * @private
     * @return {boolean}
     */
    isElementSelectedRequest() {
        return this.getPlatform().getRequestType() === REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED;
    }

    /**
     * Type of request is 'Element Selected" on visual interfaces
     * @private
     * @return {boolean}
     */
    isSignInRequest() {
        return this.getPlatform().getRequestType() === REQUEST_TYPE_ENUM.ON_SIGN_IN;
    }

    /**
     * Retrieves true if request is a permission
     * @private
     * @return {boolean}
     */
    isPermissionRequest() {
        return this.getPlatform().getRequestType() === REQUEST_TYPE_ENUM.ON_PERMISSION;
    }

    /**
     * Type of request is end request
     * @private
     * @return {boolean} isEndRequest
     */
    isEndRequest() {
        return this.getPlatform().getRequestType() === REQUEST_TYPE_ENUM.END;
    }

    /**
     * Handles all launch requests
     * Calls handler function for LAUNCH
     * @private
     */
    handleLaunchRequest() {
        if (this.user().isNewUser() && this.handlers[HANDLER_NEW_USER]) {
            // Go to 'NEW_USER' intent if defined in handler
            this.handlers[HANDLER_NEW_USER].call(this);
        } else if (this.isNewSession() && this.handlers[HANDLER_NEW_SESSION]) {
            // Go to 'NEW_SESSION' intent if defined in handler
            this.handlers[HANDLER_NEW_SESSION].call(this);
        } else {
            if (!this.handlers[HANDLER_LAUNCH]) {
                throw Error('There is no LAUNCH intent defined in the handler.');
            }
            this.handlers[HANDLER_LAUNCH].call(this);
        }
    }

    /**
     * Handles intent requests.
     * Maps inputMap with incoming request inputs
     * @private
     */
    handleIntentRequest() {
        this.mapInputs();

        if (this.getState()) {
            this.handleStateIntentRequest();
        } else {
            if (this.user().isNewUser() && this.handlers[HANDLER_NEW_USER]) {
                // Go to 'NEW_USER' intent if defined in handler
                this.handlers[HANDLER_NEW_USER].call(this);
            } else if (this.isNewSession() && this.handlers[HANDLER_NEW_SESSION]) {
                // Go to 'NEW_SESSION' intent if defined in handler
                this.handlers[HANDLER_NEW_SESSION].call(this);
            } else {
               this.handleStatelessIntentRequest();
            }
        }
    }

    /**
     * Calls handler function
     * @private
     * @throws Error if intent logic has not been defined
     */
    handleStatelessIntentRequest() {
        if (this.getIntentName() !== HANDLER_END &&
            !this.handlers[this.getIntentName()]) {
            if (!this.handlers[UNHANDLED]) {
                throw new Error('The intent name ' + this.getIntentName() + ' has not been defined in your handler.');
            }
            let args = this.getSortedArgumentsInput(
                this.handlers[UNHANDLED]
            );
            this.handlers[UNHANDLED].apply(this, args);
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
     * @private
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

            if (this.handlers[this.getState()][UNHANDLED] &&
                this.config.intentsToSkipUnhandled.indexOf(intentToRedirect) === -1) {
                args = this.getSortedArgumentsInput(
                    this.handlers[this.getState()][UNHANDLED]
                );
                this.handlers[this.getState()][UNHANDLED].apply(
                    this, args);
            } else if (this.handlers[intentToRedirect]) {
                args = this.getSortedArgumentsInput(
                    this.handlers[intentToRedirect]
                );
                this.handlers[intentToRedirect].apply(this, args);
                return;
            } else if (this.handlers[UNHANDLED]) { // go to global unhandled
                args = this.getSortedArgumentsInput(
                    this.handlers[UNHANDLED]
                );
                this.handlers[UNHANDLED].apply(this, args);
            } else {
                throw new Error('Routing failed.');
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
     * @private
     */
    handleElementSelectedRequest() {
        if (!this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED]) {
            throw new Error('Error: ' + REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED + ' has not been defined in the handler.');
        }

        if (typeof this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED] === 'function') {
            this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED].call(this);
            return;
        }
        let elementId = UNHANDLED;
        if (this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED][this.getSelectedElementId()]) {
            elementId = this.getSelectedElementId();
        }

        if (elementId === UNHANDLED &&
            !this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED][UNHANDLED]) {
                throw new Error('Error: ' + REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED + ' with elementId ' + this.getSelectedElementId() + ' has not been defined in the handler.');
        }

        this.handlers[REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED][elementId].call(this);
    }

    /**
     * Handles request with sign in infos
     * @private
     */
    handleSignInRequest() {
        if (!this.handlers[REQUEST_TYPE_ENUM.ON_SIGN_IN]) {
            throw new Error('Error: ' + REQUEST_TYPE_ENUM.ON_SIGN_IN + ' has not been defined in the handler.');
        }
        this.handlers[REQUEST_TYPE_ENUM.ON_SIGN_IN].call(this);
    }

    /**
     * Handles request with sign in infos
     * @private
     */
    handlePermissionRequest() {
        if (!this.handlers[REQUEST_TYPE_ENUM.ON_PERMISSION]) {
            throw new Error('Error: ' + REQUEST_TYPE_ENUM.ON_PERMISSION + ' has not been defined in the handler.');
        }
        this.handlers[REQUEST_TYPE_ENUM.ON_PERMISSION].apply(this);
    }

    /**
     * Handles end requests
     * @private
     */
    handleEndRequest() {
        // call specific 'END' in state
        if (this.getState() && this.handlers[this.getState()][HANDLER_END]) {
            this.handlers[this.getState()][HANDLER_END].call(this);
        } else if (this.handlers[HANDLER_END]) { // call global 'END'
            this.handlers[HANDLER_END].call(this);
        } else { // no END defined
            this.endSession();
        }
    }

    /**
     * Handles alexa audio player request
     * @private
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
        if (Object.keys(this.config.inputMap).length === 0 &&
            this.config.inputMap.constructor === Object) {
            this.inputs = requestInputs;
            return;
        }
        // map keys from inputMap
        Object.keys(requestInputs).forEach((inputKey) => {
            let mappedInputKey = this.config.inputMap[inputKey] ?
                                    this.config.inputMap[inputKey] : inputKey;
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
        let paramNames = util.getParamNames(func);
        let sortedArguments = [];
        let inputObjectKeys = Object.keys(this.inputs);

        // camilze input keys
        let tempInputs = {};
        for (let i = 0; i < inputObjectKeys.length; i++) {
            tempInputs[util.camelize(inputObjectKeys[i])] =
                this.inputs[inputObjectKeys[i]];
        }

        for (let i = 0; i < paramNames.length; i++) {
            sortedArguments[i] = tempInputs[paramNames[i]];
        }
        return sortedArguments;
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
     * TODO: check with google action without dialogflow
     * @private
     */
    setPlatform() {
        if (this.requestObj.result || (this.requestObj.user && this.requestObj.conversation)) {
            this.platform = new GoogleAction(this, this.requestObj);
        } else {
            this.platform = new AlexaSkill(this, this.requestObj);
        }
    }

    /**
     * ------------------------------------
     * ------------------------------------ End private JOVO methods
     * ------------------------------------
     */

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
     * ------------------------------------
     * ------------------------------------ CONFIG
     * ------------------------------------
     */

    /**
     * Sets config for app
     * @public
     * @param {*} config
     */
    setConfig(config) {
        if (!config) {
            throw new Error('config cannot be empty');
        }
        if (!this.config) {
            this.config = {};
        }
        if (typeof config.logging !== 'undefined') {
            this.enableLogging(config.logging);
        }

        if (typeof config.requestLogging !== 'undefined') {
            this.enableRequestLogging(config.requestLogging);
        }
        if (typeof config.responseLogging !== 'undefined') {
            this.enableResponseLogging(config.responseLogging);
        }
        if (typeof config.requestLoggingObjects !== 'undefined') {
            this.setRequestLoggingObjects(config.requestLoggingObjects);
        }
        if (typeof config.responseLoggingObjects !== 'undefined') {
            this.setResponseLoggingObjects(config.responseLoggingObjects);
        }
        if (typeof config.saveUserOnResponseEnabled !== 'undefined') {
            this.setSaveUserOnResponseEnabled(config.saveUserOnResponseEnabled);
        }
        if (typeof config.userDataCol !== 'undefined') {
            this.setUserDataCol(config.userDataCol);
        }
        if (typeof config.inputMap !== 'undefined') {
            this.setInputMap(config.inputMap);
        }
        if (typeof config.intentMap !== 'undefined') {
            this.setIntentMap(config.intentMap);
        }
        if (typeof config.intentsToSkipUnhandled !== 'undefined') {
            this.setIntentsToSkipUnhandled(config.intentsToSkipUnhandled);
        }
        if (typeof config.saveBeforeResponseEnabled !== 'undefined') {
            this.setSaveBeforeResponseEnabled(config.saveBeforeResponseEnabled);
        }
        if (typeof config.allowedApplicationIds !== 'undefined') {
            this.setAllowedApplicationIds(config.allowedApplicationIds);
        }
        if (typeof config.db !== 'undefined') {
            this.setDb(config.db);
        }
        if (typeof config.userMetaData !== 'undefined') {
            this.setUserMetaData(config.userMetaData);
        }
        if (typeof config.i18n !== 'undefined') {
            this.setI18n(config.i18n);
        }
        if (typeof config.analytics !== 'undefined') {
            this.setAnalytics(config.analytics);
        }
    }

    /**
     * Enable or disables request AND response logging
     * @param {boolean=} val
     */
    enableLogging(val) {
        if (typeof val === 'undefined') {
            val = true;
        }
        if (!_.isBoolean(val)) {
            throw new Error('Value must be of type boolean.');
        }
        this.config.logging = val;
        this.enableRequestLogging(val);
        this.enableResponseLogging(val);
    }

    /**
     * Activates logging of request object
     * @param {boolean=} val enables or disables request logging
     * @public
     */
    enableRequestLogging(val) {
        if (typeof val === 'undefined') {
            val = true;
        }
        if (!_.isBoolean(val)) {
            throw new Error('Value must be of type boolean.');
        }
        this.config.requestLogging = val;
    }

    /**
     * Activates logging response object
     * @param {boolean=} val enables or disables request logging
     * @public
     */
    enableResponseLogging(val) {
        if (typeof val === 'undefined') {
            val = true;
        }
        if (!_.isBoolean(val)) {
            throw new Error('Value must be of type boolean.');
        }
        this.config.responseLogging = val;
    }

    /**
     * Sets request logging objects
     * @public
     * @param {string} path
     */
    setRequestLoggingObjects(path) {
        if (_.isString(path)) {
            path = [path];
        }
        this.config.requestLoggingObjects = path;
    }


    /**
     * Sets response logging objects
     * @public
     * @param {string} path
     */
    setResponseLoggingObjects(path) {
        if (_.isString(path)) {
            path = [path];
        }
        this.config.responseLoggingObjects = path;
    }

    /**
     * Sets saveUserOnResponseEnabled
     * @public
     * @param {boolean} val
     */
    setSaveUserOnResponseEnabled(val) {
        if (typeof val === 'undefined') {
            val = true;
        }
        if (!_.isBoolean(val)) {
            throw new Error('Value must be of type boolean.');
        }
        this.config.saveUserOnResponseEnabled = val;
    }

    /**
     * Sets userData col name
     * @public
     * @param {string} name
     */
    setUserDataCol(name) {
        if (!_.isString(name)) {
            throw new Error('Value must be of type string.');
        }
        this.config.userDataCol = name;
    }

    /**
     * Maps platform specific input names to custom input names
     *
     * @public
     * @param {object} inputMap
     */
    setInputMap(inputMap) {
        if (!_.isObject(inputMap)) {
            throw new Error('Input map variable must be an object');
        }
        this.config.inputMap = inputMap;
    }

    /**
     *  Maps platform specific intent names to custom intent names
     * @public
     * @param {object} intentMap
     */
    setIntentMap(intentMap) {
        if (!_.isObject(intentMap)) {
            throw new Error('Intent map variable must be an object');
        }
        this.config.intentMap = intentMap;
    }

    /**
     * Defines intents that should not be routed to Unhandled
     * @public
     * @param {Array} intents
     */
    setIntentsToSkipUnhandled(intents) {
        if (!_.isArray(intents)) {
            throw new Error('Intents variable must be an array');
        }
        this.config.intentsToSkipUnhandled = intents;
    }

    /**
     * Sets saveUserOnResponseEnabled
     * @public
     * @param {boolean} val
     */
    setSaveBeforeResponseEnabled(val) {
        if (typeof val === 'undefined') {
            val = true;
        }
        if (!_.isBoolean(val)) {
            throw new Error('Value must be of type boolean.');
        }
        this.config.saveBeforeResponseEnabled = val;
    }

    /**
     * enables saving attributes to database before response
     * @public
     * @deprecated Please use setSaveBeforeResponseEnabled(boolean)
     * @param {boolean} saveEnabled
     * @return {Jovo} this
     */
    enableSaveBeforeResponse(saveEnabled) {
        this.setSaveBeforeResponseEnabled(saveEnabled);
        return this;
    }

    /**
     * Sets applicationId id
     * Prevents request from not permitted applications
     * TODO any idea for google actions?
     * @public
     * @param {array} applicationIds
     */
    setAllowedApplicationIds(applicationIds) {
        if (_.isString(applicationIds)) {
            applicationIds = [applicationIds];
        }
        this.config.allowedApplicationIds = applicationIds;
    }

    /**
     * Sets configuration for the default database
     *
     * FileDB: {
     *      type: 'file',
     *      localDbFilename: 'db',
     * }
     *
     * DynamoDB: {
     *      type: 'dynamodb',
     *      tableName: 'any-table-name',
     *      awsConfig: {
     *           region: 'us-east-1',
     *           accessKeyId: 'ACCESS_KEY_ID',
     *           secretAccessKey: 'SECRET_ACCESS_KEY',
     *      }
     * }
     * @public
     * @param {*} config
     */
    setDb(config) {
        if (!_.isObject(config)) {
            throw new Error('db config must be an object');
        }

        if (!config.type) {
            throw new Error('db type is not defined');
        }

        if (config.type === 'file') {
            if (!config.localDbFilename || !_.isString(config.localDbFilename)) {
                throw new Error('localDbFile variable is not defined');
            }
            this.moduleDatabase = new Db('file', new FilePersistence(config.localDbFilename));
        } else if (config.type === 'dynamodb') {
            if (!config.tableName || !_.isString(config.tableName)) {
                throw new Error('tableName variable is not defined');
            }
            this.moduleDatabase = new Db('dynamodb',
                new DynamoDb(config.tableName, _.get(config, 'awsConfig', {})));
        }
        this.config.db = config;
    }

    /**
     * sets Dynamo DB as default db
     * @public
     * @param {string} tableName
     * @param {*} awsConfig
     */
    setDynamoDb(tableName, awsConfig) {
        this.setDb({
            type: 'dynamodb',
            tableName: tableName,
            awsConfig: awsConfig,
        });
    }

    /**
     * sets main key to save and get data from Dynamo DB
     * @public
     * @param {string} dynamoDbKey
     */
    setDynamoDbKey(dynamoDbKey) {
        this.dynamoDbKey = dynamoDbKey;
    }
    /**
     * @deprecated please use setDb
     * Sets local db filename
     * @public
     * @param {string} filename
     */
    setLocalDbFilename(filename) {
        this.setDb({
            type: 'file',
            localDbFilename: filename,
        });
    }

    /**
     * Sets user meta data config
     * @public
     * @param {*} userMetaData
     */
    setUserMetaData(userMetaData) {
        const validProps = [
            'lastUsedAt',
            'sessionsCount',
            'createdAt',
            'requestHistorySize',
            'devices'];

        Object.keys(userMetaData).forEach(function(item) {
            if (validProps.indexOf(item) === -1) {
                throw new Error(item + ' is not a valid userMetaData property.');
            }
        });
        this.config.userMetaData = _.assignIn(this.config.userMetaData, userMetaData);
    }

    /**
     * Sets i18n config
     * Example
     * {
                returnObjects: true,
                resources: {
                    'en-US': {
                        translation: {
                            WELCOME: 'Welcome',
                        },
                    },
                    'de-DE': {
                        translation: {
                            WELCOME: 'Willkommen',
                        },
                    },
                },
            }
       @public
     * @param {*} i18nConfig
     */
    setI18n(i18nConfig) {
        this.config.i18n = _.extend(this.config.i18n, i18nConfig);
        if (this.config.i18n.resources) {
            this.setLanguageResources(this.config.i18n.resources, this.config.i18n);
        }
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

        this.config.i18n.resources = resources;

        let initConfig = _.assignIn(this.config.i18n, config);
        i18n
            .use(sprintf)
            .init(initConfig);
    }

    /**
     * Sets analytics
     * Example:
     *
     * @public
     * @param {*} analyticsConfig
     */
    setAnalytics(analyticsConfig) {
        if (!_.isObject(analyticsConfig)) {
            throw new Error('Value must be of type object.');
        }
        this.config.analytics = analyticsConfig;
        this.moduleAnalytics = new Analytics.Analytics(analyticsConfig);
    }

    /**
     * Adds analytics implementation
     * @public
     * @param {string} name
     * @param {*} serviceConf
     */
    addAnalytics(name, serviceConf) {
        this.moduleAnalytics.addAnalytics(name, serviceConf);
    }

    /**
     * Adds voicelabs analytics for alexa
     * @public
     * @param {string} token
     */
    addVoiceLabsAlexa(token) {
        this.addAnalytics('VoiceLabsAlexa', {
            key: token,
        });
    }

    /**
     * Adds voicelabs analytics for google action
     * @public
     * @param {string} token
     */
    addVoiceLabsGoogleAction(token) {
        this.addAnalytics('VoiceLabsGoogleAction', {
            key: token,
        });
    }

    /**
     * Adds dashbot analytics for google action
     * @public
     * @param {string} apiKey
     */
    addDashbotGoogleAction(apiKey) {
        this.addAnalytics('DashbotGoogleAction', {
            key: apiKey,
        });
    }

    /**
     * Adds dashbot analytics for alexa
     * @public
     * @param {string} apiKey
     */
    addDashbotAlexa(apiKey) {
        this.addAnalytics('DashbotAlexa', {
            key: apiKey,
        });
    }

    /**
     * Adds Bespoken analytics
     * @public
     * @param {string} apiKey
     */
    addBespokenAnalytics(apiKey) {
        this.addAnalytics('BespokenAlexa', {
            key: apiKey,
        });
        this.addAnalytics('BespokenGoogleAction', {
            key: apiKey,
        });
    }

    /**
     * Sets handler object
     * @param {Object} handlers
     */
    setHandler(handlers) {
        util.validateHandlers(handlers);
        this.handlers = handlers;
    }

    /**
     * Sets alexa handlers
     * @public
     * @param {*} handlers
     */
    setAlexaHandler(handlers) {
        util.validateHandlers(handlers);
        this.alexaHandlers = handlers;
    }

    /**
     * Sets google action handlers
     * @public
     * @param {*} handlers
     */
    setGoogleActionHandler(handlers) {
        util.validateHandlers(handlers);
        this.googleActionHandlers = handlers;
    }

    /**
     * ------------------------------------
     * ------------------------------------ GETTER objects
     * ------------------------------------
     */

    /**
     * Analytics instance
     * @public
     * @return {Analytics.Analytics|Analytics}
     */
    analytics() {
        return this.moduleAnalytics;
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
     * -------- ON REQUEST
     */

    /**
     * Aborts response if request's skillId doesn't match
     * configurated skillId
     * @return {boolean} requestAllowed
     */
    isRequestAllowed() {
        if (this.config.allowedApplicationIds.length > 0) {
            if (this.config.allowedApplicationIds.indexOf(
                    this.getPlatform().getApplicationId()
                ) === -1 ) {
                return false;
            }
        }
        return true;
    }

    /**
     * Loads user specific data from db on request
     * @private
     * @return {Promise}
     */
    loadUserDataOnRequest() {
        let that = this;
        return new Promise((resolve, reject) => {
            if (that.config.saveUserOnResponseEnabled) {
                that.db().loadObject(function(error, data) {
                    if (error && (error.code === 'ERR_MAIN_KEY_NOT_FOUND' ||
                            error.code === 'ERR_DATA_KEY_NOT_FOUND')) {
                        that.user().setIsNewUser(true);
                        data = that.user().createUserData();
                    } else if (!data[that.config.userDataCol]) {
                        data = that.user().createUserData();
                    } else {
                        data = data[that.config.userDataCol];
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
     * Prints request if requestLogging is true
     * @private
     * @param {Jovo} app
     */
    printRequestLog() {
        // prints request object
        if (this.config.requestLogging) {
            if (this.config.requestLoggingObjects.length > 0) {
                this.config.requestLoggingObjects.forEach((path) => {
                    console.log(JSON.stringify(_.get(this.requestObj, path), null, '\t'));
                });
            } else {
                console.log(JSON.stringify(this.requestObj, null, '\t'));
            }
        }
    }

    /**
     * ------------------------------------
     * ------------------------------------ ON RESPONSE
     * ------------------------------------
     */

    /**
     * Emits respond
     */
    respond() {
        this.emit('respond', this);
    }

    /**
     * Saves user specific data in db on response
     * @private
     * @return {Promise}
     */
    saveUserDataOnResponse() {
        return new Promise((resolve, reject) => {
            if (this.config.saveUserOnResponseEnabled) {
                this.user().updateMetaData();
                this.db().saveFullObject(
                    this.config.userDataCol,
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
     * saves all session attributes in database
     * @private
     * @param {boolean} forceSave
     * @return {Promise} data
     */
    saveDataBeforeResponse(forceSave) {
        return new Promise((resolve, reject) => {
            if (this.config.saveBeforeResponseEnabled || forceSave) {
                this.config.saveBeforeResponseEnabled = false;

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
     * Executes response
     * @private
     * @return {Promise}
     */
    executeResponse() {
        return new Promise((resolve, reject) => {
            this.emit('executeResponse', this);
            if (this.responseSent) {
                throw new Error('Error: Can\'t send more than one response per request.');
            }

            // set response object depending on type of request
            if (this.type === TYPE_ENUM.LAMBDA) {
                this.response(null, this.getPlatform().getResponseObject());
            } else if (this.type === TYPE_ENUM.WEBHOOK) {
                this.response.json(this.getPlatform().getResponseObject());
            }
            this.printResponseLog(this);

            // calls track function. by default no analytics provider is set
            this.analytics().handleTracking(this);
            this.responseSent = true;
            this.emit('complete', this);
        });
    }

    /**
     * Prints response if responseLogging is true
     * @private
     * @param {Jovo} app
     */
    printResponseLog() {
        // log response object
        if (this.config.responseLogging) {
            if (this.config.responseLoggingObjects.length > 0) {
                this.config.responseLoggingObjects.forEach((path) => {
                    console.log(JSON.stringify(_.get(this.getPlatform().getResponseObject(), path), null, '\t'));
                });
            } else {
                console.log(JSON.stringify(this.getPlatform().getResponseObject(), null, '\t'));
            }
        }
    }
}


module.exports.Jovo = Jovo;

module.exports.TYPE_ENUM = TYPE_ENUM;

module.exports.REQUEST_TYPE_ENUM = REQUEST_TYPE_ENUM;
module.exports.PLATFORM_ENUM = PLATFORM_ENUM;
module.exports.DIALOGSTATE_ENUM = DIALOGSTATE_ENUM;

module.exports.HANDLER_LAUNCH = HANDLER_LAUNCH;
module.exports.HANDLER_END = HANDLER_END;

module.exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
