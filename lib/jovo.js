'use strict';

const _ = require('lodash');
const Platform = require('./platforms/plaform').Platform;
const i18n = require('i18next');

// Platforms
const AlexaSkill = require('./platforms/alexaSkill/alexaSkill');
const GoogleAction = require('./platforms/googleaction/googleAction');
const util = require('./util');
const BaseApp = require('./app');

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
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
        this.on('request', () => {
            this.app.emit('request', this);
        });
        this.on('beforeExecute', () => {
            this.app.emit('beforeExecute', this);
        });
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
     * Handles request. Detects type of request from request obj
     * @param {*} request
     * @param {*} response
     * @return {Jovo}
     */
    handleRequest(request, response) {
        this.emit('request', this);
        this.response = response;
        this.setType(); // lambda or webhook
        if (this.type === BaseApp.TYPE_ENUM.LAMBDA) {
            this.requestObj = request;
            // prevent from saving locally on lambda
            if (this.config.moduleDatabase.databases.file) {
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
        this.emit('request', this);
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
        this.emit('request', this);
        this.event = event;
        this.context = context;
        this.callback = callback;

        this.response = callback;

        if (event.body) {
            this.requestObj = JSON.parse(event.body);
            this.apiGateway = true;
        } else {
            this.requestObj = event;
        }

        // prevent from saving locally on lambda
        if (this.config.moduleDatabase.databases.file) {
            this.config.saveUserOnResponseEnabled = false;
        }
        this.type = BaseApp.TYPE_ENUM.LAMBDA;
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
        this.printRequestLog();
        this.userObj = this.getPlatform().makeUser(this.config.userMetaData);

        this.speech = this.speechBuilder();
        // TODO:
        if (this.isAlexaSkill() && this.config.alexaSkill.handlers) {
            _.assign(this.config.handlers, this.config.alexaSkill.handlers);
        } else if (this.isGoogleAction() && this.config.googleAction.handlers) {
            _.assign(this.config.handlers, this.config.googleAction.handlers);
        }
        // throws error if structure of handlers is not valid
        util.validateHandlers(this.config.handlers);


        return this.loadUserDataOnRequest()
            .then(() => {
                return this.handleRequestRequest();
            }).then(() => {
                if (this.triggeredToIntent) {
                    return Promise.resolve();
                }

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
                    return Promise.resolve(this);
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
            // set response object depending on type of request
            if (this.type === BaseApp.TYPE_ENUM.LAMBDA) {
                let response;
                if (this.apiGateway) {
                    response = {
                        statusCode: 200,
                        body: JSON.stringify(this.getPlatform().getResponseObject()),
                        isBase64Encoded: false,
                    };
                } else {
                    response = this.getPlatform().getResponseObject();
                }
                this.response(null, response );
            } else if (this.type === BaseApp.TYPE_ENUM.WEBHOOK) {
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
        if (this.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.LAUNCH) {
            return BaseApp.REQUEST_TYPE_ENUM.LAUNCH;
        }
        if (this.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.END) {
            if (this.getEndReason()) {
                return BaseApp.REQUEST_TYPE_ENUM.END + ':' + this.getEndReason();
            }
            return BaseApp.REQUEST_TYPE_ENUM.END;
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
        if (state && !this.config.handlers[state]) {
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
        this.triggeredToIntent = true;
        let args = Array.prototype.slice.call(arguments, 1); // eslint-disable-line

        if (this.getState() && this.config.handlers[this.getState()][intent]) {
            this.config.handlers[this.getState()][intent].apply(this, args);
        } else if (this.config.handlers[intent]) {
            this.config.handlers[intent].apply(this, args);
        } else if (this.config.handlers[BaseApp.UNHANDLED]) {
            this.config.handlers[BaseApp.UNHANDLED].apply(this, args);
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
        this.triggeredToIntent = true;
        this.getPlatform().setState(state);
        let args = Array.prototype.slice.call(arguments, 2); // eslint-disable-line

        if (!state) {
            if (!this.config.handlers[intent]) {
                throw Error(`Intent ${intent} could not be found in your global handler`);
            }
            this.config.handlers[intent].apply(this, args);
        } else {
            if (!this.config.handlers[state]) {
                throw Error(`State ${state} could not be found in your handler`);
            }
            if (!this.config.handlers[state][intent]) {
                if (this.config.handlers[state][BaseApp.UNHANDLED]) {
                    this.config.handlers[state][BaseApp.UNHANDLED].apply(this, args);
                } else {
                    throw Error(`${state}-${intent} could not be found in your handler`);
                }
            } else {
                this.config.handlers[state][intent].apply(this, args);
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

        if (this.config.handlers[intent]) {
            this.config.handlers[intent].apply(this, args);
        } else if (this.config.handlers[BaseApp.UNHANDLED]) {
            this.config.handlers[BaseApp.UNHANDLED].apply(this, args);
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
        if (!this.config.languageResourcesSet) {
            throw new Error('Language resources have not been set for translation.');
        }
        i18n.changeLanguage(this.getLocale());
        return i18n.t.apply(i18n, arguments); // eslint-disable-line
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
     * Type of request is intent request
     * @private
     * @return {boolean} isIntentRequest
     */
    isIntentRequest() {
        return this.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.INTENT;
    }

    /**
     * Type of request is audio player request
     * @return {boolean} isAudioPlayerRequest
     */
    isAudioPlayerRequest() {
        return this.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.AUDIOPLAYER;
    }

    /**
     * Type of request is 'Element Selected" on visual interfaces
     * @private
     * @return {boolean}
     */
    isElementSelectedRequest() {
        return this.getPlatform().getRequestType() ===
            BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED;
    }

    /**
     * Type of request is 'Element Selected" on visual interfaces
     * @private
     * @return {boolean}
     */
    isSignInRequest() {
        return this.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.ON_SIGN_IN;
    }

    /**
     * Retrieves true if request is a permission
     * @private
     * @return {boolean}
     */
    isPermissionRequest() {
        return this.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.ON_PERMISSION;
    }

    /**
     * Type of request is end request
     * @private
     * @return {boolean} isEndRequest
     */
    isEndRequest() {
        return this.getPlatform().getRequestType() === BaseApp.REQUEST_TYPE_ENUM.END;
    }

    /**
     * Handles all requests
     * @private
     * @return {Promise<any>}
     */
    handleRequestRequest() {
        return new Promise((resolve, reject) => {
            if (this.config.handlers[BaseApp.HANDLER_ON_REQUEST]) {
                let params = util.getParamNames(this.config.handlers[BaseApp.HANDLER_ON_REQUEST]);
                if (params.length === 0) {
                    this.config.handlers[BaseApp.HANDLER_ON_REQUEST].apply(this);
                    resolve();
                } else {
                    let callback = function() {
                        resolve();
                    };
                    this.config.handlers[BaseApp.HANDLER_ON_REQUEST].apply(this, [callback]);
                }
            } else {
                resolve();
            }
        });
    }

    /**
     * Handles all launch requests
     * Calls handler function for LAUNCH
     * @private
     */
    handleLaunchRequest() {
        if (this.user().isNewUser() && this.config.handlers[BaseApp.HANDLER_NEW_USER]) {
            // Go to 'NEW_USER' intent if defined in handler
            this.config.handlers[BaseApp.HANDLER_NEW_USER].call(this);
        } else if (this.isNewSession() && this.config.handlers[BaseApp.HANDLER_NEW_SESSION]) {
            // Go to 'NEW_SESSION' intent if defined in handler
            this.config.handlers[BaseApp.HANDLER_NEW_SESSION].call(this);
        } else {
            if (!this.config.handlers[BaseApp.HANDLER_LAUNCH]) {
                throw Error('There is no LAUNCH intent defined in the handler.');
            }
            this.config.handlers[BaseApp.HANDLER_LAUNCH].call(this);
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
            if (this.user().isNewUser() && this.config.handlers[BaseApp.HANDLER_NEW_USER]) {
                // Go to 'NEW_USER' intent if defined in handler
                this.config.handlers[BaseApp.HANDLER_NEW_USER].call(this);
            } else if (this.isNewSession() && this.config.handlers[BaseApp.HANDLER_NEW_SESSION]) {
                // Go to 'NEW_SESSION' intent if defined in handler
                this.config.handlers[BaseApp.HANDLER_NEW_SESSION].call(this);
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
        if (this.getIntentName() !== BaseApp.HANDLER_END &&
            !this.config.handlers[this.getIntentName()]) {
            if (!this.config.handlers[BaseApp.UNHANDLED]) {
                throw new Error('The intent name ' + this.getIntentName() + ' has not been defined in your handler.');
            }
            let args = this.getSortedArgumentsInput(
                this.config.handlers[BaseApp.UNHANDLED]
            );
            this.config.handlers[BaseApp.UNHANDLED].apply(this, args);
            return;
        } else if (this.getIntentName() === BaseApp.HANDLER_END &&
            !this.config.handlers[this.getIntentName()]) {
            // StopIntent but no END Handler defined
            this.emit('respond', this);
            return;
        }
        let args = this.getSortedArgumentsInput(
            this.config.handlers[this.getIntentName()]
        );

        this.config.handlers[this.getIntentName()].apply(this, args);
    }

    /**
     * Handles state intent requests
     * @private
     * @throws if given state has not been defined in the handler
     */
    handleStateIntentRequest() {
        if (!this.config.handlers[this.getState()]) {
            throw new Error('Error: State ' + this.getState() + ' has not been defined in the handler.');
        }

        let intentToRedirect = this.getIntentName();
        let args = [];

        // intent not in state defined; should return Unhandled or global intent
        if (!this.config.handlers[this.getState()][intentToRedirect]) {
            // fallback intent outside of the state

            if (this.config.handlers[this.getState()][BaseApp.UNHANDLED] &&
                this.config.intentsToSkipUnhandled.indexOf(intentToRedirect) === -1) {
                args = this.getSortedArgumentsInput(
                    this.config.handlers[this.getState()][BaseApp.UNHANDLED]
                );
                this.config.handlers[this.getState()][BaseApp.UNHANDLED].apply(
                    this, args);
            } else if (this.config.handlers[intentToRedirect]) {
                args = this.getSortedArgumentsInput(
                    this.config.handlers[intentToRedirect]
                );
                this.config.handlers[intentToRedirect].apply(this, args);
                return;
            } else if (this.config.handlers[BaseApp.UNHANDLED]) { // go to global unhandled
                args = this.getSortedArgumentsInput(
                    this.config.handlers[BaseApp.UNHANDLED]
                );
                this.config.handlers[BaseApp.UNHANDLED].apply(this, args);
            } else {
                throw new Error('Routing failed.');
            }
            return;
        } else {
            // handle STATE + Intent
            args = this.getSortedArgumentsInput(
                this.config.handlers[this.getState()][intentToRedirect]
            );
        }

        this.config.handlers[this.getState()][intentToRedirect].apply(this, args);
    }

    /**
     * Handles request with selected elements
     * @private
     */
    handleElementSelectedRequest() {
        if (!this.config.handlers[BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED]) {
            throw new Error('Error: ' + BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED + ' has not been defined in the handler.');
        }

        if (typeof this.config.handlers[BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED] === 'function') {
            this.config.handlers[BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED].call(this);
            return;
        }
        let elementId = BaseApp.UNHANDLED;
        if (this.config.handlers[
                BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED][this.getSelectedElementId()]) {
            elementId = this.getSelectedElementId();
        }

        if (elementId === BaseApp.UNHANDLED &&
            !this.config.handlers[
                BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED
                ][BaseApp.UNHANDLED]) {
            throw new Error('Error: ' + REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED + ' with elementId ' + this.getSelectedElementId() + ' has not been defined in the handler.');
        }

        this.config.handlers[BaseApp.REQUEST_TYPE_ENUM.ON_ELEMENT_SELECTED][elementId].call(this);
    }

    /**
     * Handles request with sign in infos
     * @private
     */
    handleSignInRequest() {
        if (!this.config.handlers[BaseApp.REQUEST_TYPE_ENUM.ON_SIGN_IN]) {
            throw new Error('Error: ' + BaseApp.REQUEST_TYPE_ENUM.ON_SIGN_IN + ' has not been defined in the handler.');
        }
        this.config.handlers[BaseApp.REQUEST_TYPE_ENUM.ON_SIGN_IN].call(this);
    }

    /**
     * Handles request with sign in infos
     * @private
     */
    handlePermissionRequest() {
        if (!this.config.handlers[BaseApp.REQUEST_TYPE_ENUM.ON_PERMISSION]) {
            throw new Error('Error: ' + BaseApp.REQUEST_TYPE_ENUM.ON_PERMISSION + ' has not been defined in the handler.');
        }
        this.config.handlers[BaseApp.REQUEST_TYPE_ENUM.ON_PERMISSION].apply(this);
    }

    /**
     * Handles end requests
     * @private
     */
    handleEndRequest() {
        // call specific 'END' in state
        if (this.getState() && this.config.handlers[this.getState()][BaseApp.HANDLER_END]) {
            this.config.handlers[this.getState()][BaseApp.HANDLER_END].call(this);
        } else if (this.config.handlers[BaseApp.HANDLER_END]) { // call global 'END'
            this.config.handlers[BaseApp.HANDLER_END].call(this);
        } else { // no END defined
            this.endSession();
        }
    }

    /**
     * Handles alexa audio player request
     * @private
     */
    handleAudioPlayerRequest() {
        if (!this.config.handlers['AUDIOPLAYER']) {
            console.log('Error: No audio player handler defined.');
            return;
        }
        if (!this.config.handlers['AUDIOPLAYER'][this.getPlatform().audioPlayer().getType()]) {
            console.log('Warning: AUDIOPLAYER: '+ this.getPlatform().audioPlayer().getType() + ' not found in handler.');
        }

        if (this.config.handlers['AUDIOPLAYER'][this.getPlatform().audioPlayer().getType()]) {
            this.config.handlers['AUDIOPLAYER'][this.getPlatform().audioPlayer().getType()].apply(this);
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
            this.type = BaseApp.TYPE_ENUM.LAMBDA;
        } else if (typeof this.response === 'object') {
            this.type = BaseApp.TYPE_ENUM.WEBHOOK;
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
            this.platform = new GoogleAction.GoogleAction(this);
        } else {
            this.platform = new AlexaSkill.AlexaSkill(this);
        }
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
                console.log(this.config.moduleDatabase);

                this
                    .db()
                    .saveObject(
                        this.config.dynamoDbKey,
                        this.getSessionAttributes(), (err, data) => {
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

    /**
     * Returns the default db (if no name)
     * Returns the db instance by given name.
     * @param {string} name
     * @return {*}
     */
    db(name) {
        if (this.type === BaseApp.TYPE_ENUM.LAMBDA && this.config.moduleDatabase.databases.file) {
            throw new Error('FilePersistence cannot be used in lambda');
        }
        return this.config.moduleDatabase.use(this.getUserId(), name);
    }

    /**
     * Analytics instance
     * @public
     * @return {Analytics.Analytics|Analytics}
     */
    analytics() {
        return this.config.moduleAnalytics;
    }
}

module.exports.Jovo = Jovo;
