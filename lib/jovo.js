'use strict';

const _ = require('lodash');
const Platform = require('./platforms/plaform').Platform;
const i18n = require('i18next');

// Platforms
const AlexaSkill = require('./platforms/alexaSkill/alexaSkill');
const GoogleAction = require('./platforms/googleaction/googleAction');
const util = require('./util');
const BaseApp = require('./app');
const Routing = require('./routing').Routing;
const Handler = require('./handler').Handler;

process.on('unhandledRejection', (reason, p) => {
    // Stack Trace
    console.log(reason.stack);
});

/** Class Jovo */
class Jovo extends Platform {

    /**
     * Initializes config and listener
     * @param {BaseApp} app
     */
    constructor(app) {
        super();
        this.app = app;

        this.config = app.config;
        this.responseSent = false;
        this.routing = new Routing(this);
        this.handler = new Handler(this);
        this.sessionAttributes = {};

        this.on('request', () => {
            this.app.emit('request', this);
        });
        this.on('beforeExecute', () => {
            this.app.emit('beforeExecute', this);
        });
        this.on('respond', () => {
            this.getPlatform().setResponseSessionAttributes(this.sessionAttributes);
            this
                .saveUserDataOnResponse()
                .then(this.saveDataBeforeResponse())
                .then(this.executeResponse())
                .catch((err) => {
                    this.app.emit('responseError', this, err);
                    console.log('Error on respond', err);
                });
        });
    }

    /**
     * Handles request. Detects type of request from request obj
     * @param {*} request
     * @param {*} response
     * @return {Jovo}
     */
    handleRequest(request, response) {
        this.response = response;
        this.setType(); // lambda or webhook
        if (this.type === BaseApp.TYPE_ENUM.LAMBDA) {
            this.requestObj = request;
            // prevent from saving locally on lambda
            if (this.app.moduleDatabase.databases.file) {
                this.config.saveUserOnResponseEnabled = false;
            }
        } else if (this.type === BaseApp.TYPE_ENUM.WEBHOOK) {
            this.requestObj = request.body;
        }
        return this;
    }

    /**
     * Handles request from webhook
     * @param {*} request
     * @param {*} response
     * @return {Jovo}
     */
    handleWebhook(request, response) {
        this.requestObj = request.body;
        this.response = response;

        this.type = BaseApp.TYPE_ENUM.WEBHOOK;
        return this;
    }

    /**
     * Handles request from lambda
     * @param {*} event
     * @param {*} context
     * @param {*} callback
     * @return {Jovo}
     */
    handleLambda(event, context, callback) {
        this.event = event;
        this.context = context;
        this.callback = callback;

        this.response = callback;

        if (event.body) {
            this.requestObj = (typeof event.body === 'string') ? JSON.parse(event.body) : event.body;
            this.apiGateway = true;
        } else {
            this.requestObj = event;
        }

        // prevent from saving locally on lambda
        if (this.app.moduleDatabase.databaseInstances.file) {
            this.config.saveUserOnResponseEnabled = false;
        }
        this.type = BaseApp.TYPE_ENUM.LAMBDA;

        return this;
    }


    /**
     * Handles request from functions
     * @param {*} context
     * @param {*} request
     * @return {Jovo}
     */
    handleFunction(context, request) {
        this.requestObj = request.body;
        this.context = context;
        this.response = undefined;

        this.type = BaseApp.TYPE_ENUM.FUNCTION;

        // workaround if you use Azure functios with local file db and no
        // specific file name
        // DO NOT USE Local file db in production
        if (this.app.moduleDatabase.databaseInstances.file) {
            if (this.config.saveUserOnResponseEnabled) {
                context.log.warn('You are using a local file database in an Azure Function, '
                    + 'which is strongly discouraged (and will fail if you use Run From Package). '
                    + 'Please set saveUserOnResponseEnabled to false or switch to a different database provider.');
            }

            if (_.get(
                this,
                'app.moduleDatabase.databaseInstances.file.filename'
            ).substr(0, 1) === '.') {
                let azureLocalDbfilename = __dirname + '/../../../db/db.json';
                _.set(this, 'app.moduleDatabase.databaseInstances.file.filename', azureLocalDbfilename);
            }
        }

        return this;
    }

    /**
     * Executes Handler
     * @public
     * @return {Promise} promise
     */
    execute() {
        this.emit('beforeExecute', this);
        this.setPlatform();
        this.emit('request', this);
        this.userObj = this.getPlatform().makeUser(this.config);

        this.speech = this.speechBuilder();
        this.reprompt = this.speechBuilder();

        if (this.isAlexaSkill() && this.config.alexaSkill.handlers) {
            _.assign(this.config.handlers, this.config.alexaSkill.handlers);
        } else if (this.isGoogleAction() && this.config.googleAction.handlers) {
            _.assign(this.config.handlers, this.config.googleAction.handlers);
        }
        // throws error if structure of handlers is not valid
        util.validateHandlers(this.config.handlers);
        try {
            this.mapInputs();
        } catch (e) {
        }
        return this.loadUserDataOnRequest()
            .then(() => this.handler.handleNewUser())
            .then(() => this.handler.handleNewSession())
            .then(() => this.handler.handleOnRequest())
            .then(() => this.routing.route())
            .then((route) => {
                this.app.emit('afterRouting', this, route);
                return Promise.resolve(route);
            })
            .then((route) => this.handler.handle(route))
            .catch((error) => {
                this.app.emit('handlerError', this, error);

                if (this.type === BaseApp.TYPE_ENUM.WEBHOOK) {
                    if (!this.responseSent) {
                        try {
                            this.response.status(400);
                            this.response.json({
                                msg: error.toString(),
                            });
                            this.responseSent = true;
                        } catch (e) {

                        }
                    }
                }
                return Promise.reject(error);
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
            this.app.emit('respond', this);
            this.app.emit('response', this);
            // set response object depending on type of request
            if (this.type === BaseApp.TYPE_ENUM.LAMBDA) {
                let response;
                if (this.apiGateway) {
                    response = {
                        statusCode: 200,
                        body: JSON.stringify(this.getPlatform().getResponseObject()),
                        isBase64Encoded: false,
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                        },
                    };
                } else {
                    response = this.getPlatform().getResponseObject();
                }
                this.response(null, response );
            } else if (this.type === BaseApp.TYPE_ENUM.WEBHOOK) {
                this.response.json(this.getPlatform().getResponseObject());
            } else if (this.type === BaseApp.TYPE_ENUM.FUNCTION) {
                this.context.res = {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    statusCode: 200,
                    body: this.getPlatform().getResponseObject(),
                };
                this.context.done();
            }

            // calls track function. by default no analytics provider is set
            this.analytics().handleTracking(this);
            this.responseSent = true;
            this.emit('complete', this);
        });
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
            return BaseApp.HANDLER_LAUNCH;
        } else {
            let platformIntentName = this.getPlatform().getIntentName();

            // use intent mapping if set
            if (this.config.intentMap && this.config.intentMap[platformIntentName]) {
                return this.config.intentMap[platformIntentName];
            }

            // user standard intent mapping
            if (BaseApp.STANDARD_INTENT_MAP[platformIntentName]) {
                return BaseApp.STANDARD_INTENT_MAP[platformIntentName];
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
        return this.getPlatform().getType() === BaseApp.PLATFORM_ENUM.ALEXA_SKILL;
    }

    /**
     * Type of platform is Google Action
     * @public
     * @return {boolean} isGoogleAction
     */
    isGoogleAction() {
        return this.getPlatform().getType() === BaseApp.PLATFORM_ENUM.GOOGLE_ACTION;
    }

    /**
     * Returns AlexaSkill object
     * @public
     * @return {AlexaSkill}
     */
    alexaSkill() {
        if (this.isAlexaSkill()) {
            return this.getPlatform();
        } else {
            return new AlexaSkill.AlexaSkill(this);
        }
    }

    /**
     * Returns GoogleAction object
     * @public
     * @return {GoogleAction}
     */
    googleAction() {
        if (this.isGoogleAction()) {
            return this.getPlatform();
        } else {
            return new GoogleAction.GoogleAction(this);
        }
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
     * Returns request object
     * @return {*}
     */
    getRequestObject() {
        return this.getPlatform().getRequest();
    }
    /**
     * Returns response object
     * @return {*}
     */
    getResponseObject() {
        return this.getPlatform().getResponseObject();
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
        if (this.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.LAUNCH) {
            return BaseApp.REQUEST_TYPE_ENUM.LAUNCH;
        }

        if (this.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.CAN_FULFILL_INTENT) {
            return `${BaseApp.REQUEST_TYPE_ENUM.CAN_FULFILL_INTENT}: ${this.getIntentName()}`;
        }

        if (this.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.END) {
            if (this.getEndReason()) {
                return `${BaseApp.REQUEST_TYPE_ENUM.END}: ${this.getEndReason()}`;
            }
            return BaseApp.REQUEST_TYPE_ENUM.END;
        }

        const inputHandlerEvent = BaseApp.REQUEST_TYPE_ENUM.ON_GAME_ENGINE_INPUT_HANDLER_EVENT;

        if (this.getPlatform().getRequestType() === inputHandlerEvent) {
            if (this.getState()) {
                return `${this.getState()}: ${inputHandlerEvent}`;
            }
            return inputHandlerEvent;
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
        return this.getSessionAttribute('STATE');
    }
    /**
     * Returns session attribute value
     * @public
     * @param {string} name
     * @return {*}
     */
    getSessionAttribute(name) {
        return _.get(this.sessionAttributes, name);
    }

    /**
     * Returns session attributes
     * @public
     * @return {*|{}}
     */
    getSessionAttributes() {
        return this.sessionAttributes;
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
        this.sessionAttributes = attributes;
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
        if (!this.sessionAttributes) {
            this.sessionAttributes = {};
        }
        _.set(this.sessionAttributes, name, value);

        return this;
    }

    /**
     * Sets session attribute
     * @public
     * @param {string} name
     * @param {*} value
     * @return {Jovo} this
     */
    addSessionAttribute(name, value) {
        this.setSessionAttribute(name, value);
        return this;
    }

    /**
     * Responds with the given text and ends session
     * Transforms plaintext to SSML
     * @public
     * @param {string|SpeechBuilder} speech Plaintext or SSML
     */
    tell(speech) {
        this.app.emit('tell', this, speech);
        this.getPlatform().tell(speech);
    }

    /**
     * Plays audio file
     * @deprecated
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
        this.app.emit('ask', this, speech, repromptSpeech);
        this.getPlatform().ask(speech, repromptSpeech);
    }

    /**
     * Repeats last speech & reprompt
     */
    repeat() {
        if (!this.config.saveUserOnResponseEnabled) {
            throw new Error('To be able to use Jovo.repeat, please enable DynamoDB');
        }
        if (this.config.userContext.prev.size <= 0) {
            throw new Error('To be able to use Jovo.repeat, '
                + 'please set userContext.prev.size to an integer higher than 0 '
                + 'in your config (default value: 1)');
        } else if (!this.user().getPrevSpeech(0)) {
            throw new Error('To be able to use Jovo.repeat, '
                + 'please set userContext.prev.response.speech to true');
        }
        let speech = this.user().getPrevSpeech(0);
        if (this.user().getPrevReprompt(0)) {
            let reprompt = this.user().getPrevReprompt(0);
            this.ask(speech, reprompt);
        } else {
            this.ask(speech);
        }
    }

    /**
     * Shows simple card to response
     * @public
     * @param {string} title
     * @param {string} content
     * @return {Jovo}
     */
    showSimpleCard(title, content) {
        this.app.emit('showSimpleCard', this, title, content);
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
        this.app.emit('showImageCard', this, title, content, imageUrl);
        this.getPlatform().showImageCard(title, content, imageUrl);
        return this;
    }

    /**
     * Shows account linking card to response
     * @public
     * @return {Jovo}
     */
    showAccountLinkingCard() {
        this.app.emit('showAccountLinkingCard', this);
        this.getPlatform().showAccountLinkingCard();
        return this;
    }

    /**
     * Fires respond event and ends session.
     * @public
     */
    endSession() {
        this.sessionAttributes = {};
        this.app.emit('endSession', this);
        this.getPlatform().endSession();
    }
    /**
     * Sets 'state' session attributes
     * @public
     * @param {string} state null removes state
     * @return {Jovo}
     */
    followUpState(state) {
        this.app.emit('followUpState', this, state);
        this.handler.followUpState(state);
        return this;
    }

    /**
     * Removes STATE from session
     * @public
     * @return {Jovo}
     */
    removeState() {
        this.app.emit('removeState', this);
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
        this.app.emit('toIntent', this, intent);
        this.handler.toIntent(intent, arguments); // eslint-disable-line
    }

    /**
     * Jumps to state intent in the order state > unhandled > error
     * @public
     * @param {string} state name of state
     * @param {string} intent name of intent
     * @param {array} args passed arg
     */
    toStateIntent(state, intent) {
        this.app.emit('toStateIntent', this, state, intent);
        this.handler.toStateIntent(state, intent, arguments); // eslint-disable-line
    }

    /**
     * Jumps from the inside of a state to a global intent
     * @public
     * @param {string} intent name of intent
     * @param {array} args passed argument
     */
    toStatelessIntent(intent) {
        this.app.emit('toStatelessIntent', this, intent);
        this.handler.toStatelessIntent(intent, arguments); // eslint-disable-line
    }

    /**
     * Jumps to global intent
     * @public
     * @param {string} intent - intent name
     */
    toGlobalIntent(intent) {
        this.app.emit('toGlobalIntent', this, intent);
        this.handler.toStatelessIntent(intent, arguments); // eslint-disable-line
    }

    /**
     * Translates a path with values provided
     * @public
     * @param {string} path to the resource to translate
     * @param {*} values to replace inside the path
     * @return {string}
     */
    t() {
        if (!_.get(this, 'config.i18n.resources')) {
            throw new Error('Language resources have not been set for translation.');
        }
        this.app.i18n.changeLanguage(this.getLocale());
        return this.app.i18n.t.apply(i18n, arguments); // eslint-disable-line
    }

    /**
     * Sets positive can fulfill request values.
     * @public
     */
    canFulfillRequest() {
        this.getPlatform().canFulfillRequest('YES');
        this.respond();
    }

    /**
     * Sets negative can fulfill request values.
     * @public
     */
    cannotFulfillRequest() {
        this.getPlatform().canFulfillRequest('NO');
        this.respond();
    }

    /**
     * Sets possible can fulfill request values.
     * @public
     */
    mayFulfillRequest() {
        this.getPlatform().canFulfillRequest('MAYBE');
        this.respond();
    }

    /**
     * Sets possible can fulfill request values.
     * @public
     * @param {string} slotName to fulfill
     * @param {string} canUnderstandSlot, possible values: YES | NO | MAYBE
     * @param {string} canFulfillSlot, possible values: YES | NO
     * @return {Jovo} this
     */
    canFulfillSlot(slotName, canUnderstandSlot, canFulfillSlot) {
        this.getPlatform().canFulfillSlot(slotName, canUnderstandSlot, canFulfillSlot);
        return this;
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
        return this.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.LAUNCH;
    }


    /**
     * Type of request is audio player request
     * @return {boolean} isAudioPlayerRequest
     */
    isAudioPlayerRequest() {
        return this.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.AUDIOPLAYER;
    }

    /**
     * Type of request is playback controller request
     * @return {boolean} isPlaybackControllerRequest
     */
    isPlaybackControllerRequest() {
        return this.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.PLAYBACKCONTROLLER;
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
            this.type = BaseApp.TYPE_ENUM.LAMBDA;
        } else if (typeof this.response === 'object') {
            this.type = BaseApp.TYPE_ENUM.WEBHOOK;
        } else if (typeof this.response === 'undefined') {
            this.type = BaseApp.TYPE_ENUM.FUNCTION;
        }
    }

    /**
     * Determines and initiates platform.
     * GoogleAction or AlexaSkill
     * @private
     */
    setPlatform() {
        if (util.getPlatformType(this.requestObj) === BaseApp.PLATFORM_ENUM.GOOGLE_ACTION) {
            this.platform = new GoogleAction.GoogleAction(this);
        } else if (util.getPlatformType(this.requestObj) === BaseApp.PLATFORM_ENUM.ALEXA_SKILL) {
            this.platform = new AlexaSkill.AlexaSkill(this);
        }
    }

    /**
     * Saves state to sessionAttributes
     * @public
     * @param {String} state
     */
    setState(state) {
        this.setSessionAttribute('STATE', state);
    }


    /**
     * Loads user specific data from db on request
     * @private
     * @return {Promise}
     */
    loadUserDataOnRequest() {
        if (!this.config.saveUserOnResponseEnabled) {
            return Promise.resolve();
        }
        return this.user().loadDataFromDb();
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
        if (!this.config.saveUserOnResponseEnabled) {
            return Promise.resolve();
        }
        return this.user().saveDataToDb();
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
                    .saveObject(
                        this.config.dynamoDbKey,
                        this.getSessionAttributes(), (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        });
            } else {
                resolve();
            }
        });
    }


    /**
     * Returns the default db (if no name)
     * Returns the db instance by given name.
     * @param {string} name
     * @return {*}
     */
    db(name) {
        if (this.type === BaseApp.TYPE_ENUM.LAMBDA &&
            this.app.moduleDatabase.databaseInstances.file) {
            throw new Error('FilePersistence cannot be used in lambda');
        }
        return this.app.moduleDatabase.use(this.getUserId(), name);
    }

    /**
     * Analytics instance
     * @public
     * @return {Analytics.Analytics|Analytics}
     */
    analytics() {
        return this.app.moduleAnalytics;
    }
}

module.exports.Jovo = Jovo;
