"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const _cloneDeep = require("lodash.clonedeep");
const _get = require("lodash.get");
const _sample = require("lodash.sample");
const _set = require("lodash.set");
const __1 = require("..");
const AsrData_1 = require("./AsrData");
const NluData_1 = require("./NluData");
const User_1 = require("./User");
class Jovo extends events_1.EventEmitter {
    constructor(app, host, handleRequest) {
        super();
        this.$requestSessionAttributes = {};
        this.setMaxListeners(0);
        this.$jovo = this;
        this.$handleRequest = handleRequest;
        this.$host = host;
        this.$app = app;
        this.$data = {};
        this.$config = _cloneDeep(app.config);
        this.$session = {
            $data: {},
        };
        this.$type = {
            optional: true,
            type: __1.EnumRequestType.UNKNOWN_REQUEST,
        };
        this.$asr = new AsrData_1.AsrData();
        this.$nlu = new NluData_1.NluData();
        this.$inputs = {};
        this.$output = {};
        this.$request = undefined;
        this.$response = undefined;
        this.$plugins = {};
        this.$user = new User_1.User(this);
        this.$cms = new __1.Cms();
        this.$speech = this.speechBuilder();
        this.$reprompt = this.speechBuilder();
    }
    /**
     * Returns UserID
     * @deprecated Use this.$user.getId() instead.
     * @public
     * @return {string}
     */
    getUserId() {
        return this.$user.getId();
    }
    /**
     * Returns state value stored in the request session
     * @return {string}
     */
    getState() {
        return this.getSessionAttribute(__1.SessionConstants.STATE);
    }
    /**
     * Saves state to sessionAttributes
     * @param {String} state
     * @return {Jovo}
     */
    setState(state) {
        if (typeof state === 'undefined') {
            this.removeState();
        }
        else {
            this.setSessionAttribute(__1.SessionConstants.STATE, state);
        }
        return this;
    }
    /**
     * Removes state from session
     * @return {Jovo}
     */
    removeState() {
        if (this.$session && this.$session.$data[__1.SessionConstants.STATE]) {
            delete this.$session.$data[__1.SessionConstants.STATE];
        }
        return this;
    }
    /**
     * Returns session data value for given path
     * @param {string=} path
     * @return {any}
     */
    getSessionData(path) {
        if (path) {
            return this.getSessionAttribute(path);
        }
        else {
            return this.getSessionAttributes();
        }
    }
    /**
     * Returns session attribute value for given path
     * @param {string} path
     * @return {any}
     */
    getSessionAttribute(path) {
        // tslint:disable-line
        if (this.$session) {
            return _get(this.$session.$data, path);
        }
        return;
    }
    /**
     * Returns full session attributes obj
     * @return {any}
     */
    getSessionAttributes() {
        if (this.$session) {
            return this.$session.$data;
        }
        return;
    }
    setSessionData(objOrPath, value) {
        // tslint:disable-line
        if (typeof objOrPath === 'string') {
            return this.setSessionAttribute(objOrPath, value);
        }
        else {
            return this.setSessionAttributes(objOrPath);
        }
    }
    /**
     * Sets session attribute for given path
     * @param {string} path
     * @param {any} value
     * @return {Jovo} this
     */
    setSessionAttribute(path, value) {
        // tslint:disable-line
        if (this.$session) {
            _set(this.$session.$data, path, value);
        }
        return this;
    }
    /**
     * Adds session data object for given path
     * @param {string} path
     * @param {any} value
     * @return {Jovo} this
     */
    addSessionData(path, value) {
        // tslint:disable-line
        return this.setSessionAttribute(path, value);
    }
    /**
     * Adds session attribute for given path
     * @param {string} path
     * @param {any} value
     * @return {Jovo} this
     */
    addSessionAttribute(path, value) {
        // tslint:disable-line
        return this.setSessionAttribute(path, value);
    }
    /**
     * Sets full session attributes obj
     * @public
     * @param {any} sessionData
     * @return {Jovo} this
     */
    setSessionAttributes(sessionData) {
        if (this.$session) {
            this.$session.$data = sessionData;
        }
        return this;
    }
    /**
     * Returns access token
     * @deprecated use this.$request.getAccessToken() instead
     * @returns {string}
     */
    getAccessToken() {
        return this.$request.getAccessToken();
    }
    /**
     * Returns request intent name
     * @deprecated use this.$request.getIntentName() instead
     * @returns {string}
     */
    getIntentName() {
        return this.$request.getIntentName();
    }
    /**
     * Responds with the given text and ends session
     * Transforms plaintext to SSML
     * @public
     * @param {string|SpeechBuilder|string[]} speech Plaintext or SSML
     */
    tell(speech) {
        if (!speech) {
            throw new Error('Speech must not be undefined');
        }
        if (Array.isArray(speech)) {
            speech = _sample(speech);
        }
        delete this.$output.ask;
        _set(this.$output, 'tell.speech', speech.toString());
        return this;
    }
    /**
     * Says speech and waits for answer from user.
     * Reprompt when user input fails.
     * Keeps session open.
     * @public
     * @param {string|SpeechBuilder} speech
     * @param {string|SpeechBuilder|Array<SpeechBuilder>|Array<string>} reprompt
     */
    ask(speech, reprompt) {
        delete this.$output.tell;
        if (!speech) {
            throw new Error('Speech must not be undefined');
        }
        if (Array.isArray(speech)) {
            speech = _sample(speech);
        }
        if (Array.isArray(reprompt)) {
            reprompt = _sample(reprompt);
        }
        if (!reprompt) {
            reprompt = speech;
        }
        _set(this.$output, 'ask.speech', speech.toString());
        _set(this.$output, 'ask.reprompt', reprompt.toString());
        return this;
    }
    showQuickReplies(quickReplies) {
        _set(this.$output, 'quickReplies', quickReplies);
        return this;
    }
    /**
     * Maps incoming request input key names with
     * keys from the inputMap
     * @param {*} inputMap
     */
    mapInputs(inputMap) {
        const mappedInputs = {};
        Object.keys(this.$inputs).forEach((inputKey) => {
            if (inputMap[inputKey]) {
                __1.Log.verbose(`Mapping input key ${inputKey} to ${inputMap[inputKey]}.`);
                mappedInputs[inputMap[inputKey]] = this.$inputs[inputKey];
            }
            else {
                mappedInputs[inputKey] = this.$inputs[inputKey];
            }
        });
        this.$inputs = mappedInputs;
    }
    /**
     * Get input object by name
     * @public
     * @param {string} key
     * @return {*}
     */
    getInput(key) {
        return _get(this.$inputs, key);
    }
    /**
     * Sets output object
     * @public
     * @param {Output} obj
     * @return {Jovo}
     */
    setOutput(obj) {
        Object.assign(this.$output, obj);
        return this;
    }
    /**
     * Set raw json response.
     * @param obj
     */
    setResponseObject(obj) {
        // tslint:disable-line
        this.$rawResponseJson = obj;
    }
    /**
     * Shows simple card to response
     * @public
     * @param {string} title
     * @param {string} content
     * @return {Jovo}
     */
    showSimpleCard(title, content) {
        this.$output.card = {
            SimpleCard: {
                content,
                title,
            },
        };
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
        this.$output.card = {
            ImageCard: {
                content,
                imageUrl,
                title,
            },
        };
        return this;
    }
    /**
     * Shows account linking card to response
     * @public
     * @return {Jovo}
     */
    showAccountLinkingCard() {
        this.$output.card = {
            AccountLinkingCard: {},
        };
        return this;
    }
    /**
     * Fires respond event and ends session.
     * @deprecated
     * @public
     */
    endSession() {
        __1.Log.info('endSession() is obsolete in v2');
    }
    /**
     * Returns true if the current request is of type LAUNCH
     * @public
     * @return {boolean}
     */
    isLaunchRequest() {
        return this.$type.type === __1.EnumRequestType.LAUNCH;
    }
    /**
     * Returns true if the current request is of type INTENT
     * @public
     * @return {boolean}
     */
    isIntentRequest() {
        return this.$type.type === __1.EnumRequestType.INTENT;
    }
    /**
     * Returns true if the current request is of type END
     * @public
     * @return {boolean}
     */
    isEndRequest() {
        return this.$type.type === __1.EnumRequestType.END;
    }
    /**
     * Returns true if the current request is of type AUDIOPLAYER
     * @public
     * @return {boolean}
     */
    isAudioPlayerRequest() {
        return this.$type.type === __1.EnumRequestType.AUDIOPLAYER;
    }
    /**
     * Returns true if the current request is of type ON_ELEMENT_SELECTED
     * @public
     * @return {boolean}
     */
    isElementSelectedRequest() {
        return this.$type.type === __1.EnumRequestType.ON_ELEMENT_SELECTED;
    }
    /**
     * Validates incoming request input data for all registered validators asynchronous.
     * @param schema The object containing all validators of type Validator|Function.
     * @returns object Contains function failed() to filter for failed validators.
     */
    async validateAsync(schema) {
        // tslint:disable-line:no-any
        const failedValidators = []; // tslint:disable-line:no-any
        for (const input in schema) {
            if (!schema.hasOwnProperty(input)) {
                continue;
            }
            const validator = schema[input];
            if (validator.constructor === Array) {
                for (const v of validator) {
                    await this.parseForValidatorAsync(v, input, this.$inputs[input], failedValidators);
                }
            }
            else {
                await this.parseForValidatorAsync(validator, input, this.$inputs[input], failedValidators);
            }
        }
        return this.parseForFailedValidators(failedValidators);
    }
    /**
     * Validates incoming request input data for all registered validators.
     * @param schema The object containing all validators of type Validator|Function.
     * @returns object Contains function failed() to filter for failed validators.
     */
    validate(schema) {
        // tslint:disable-line:no-any
        const failedValidators = []; // tslint:disable-line:no-any
        for (const input in schema) {
            if (!schema.hasOwnProperty(input)) {
                continue;
            }
            const validator = schema[input];
            if (validator.constructor === Array) {
                for (const v of validator) {
                    this.parseForValidator(v, input, this.$inputs[input], failedValidators);
                }
            }
            else {
                this.parseForValidator(validator, input, this.$inputs[input], failedValidators);
            }
        }
        return this.parseForFailedValidators(failedValidators);
    }
    /**
     * Reduces all failed validators to a set applying to the filter in ...args.
     * @param failedValidators An array of all failed validators.
     * @returns object Contains a function to filter through all failed validators.
     */
    parseForFailedValidators(failedValidators) {
        return {
            failed(...args) {
                return (failedValidators.reduce((res, v) => {
                    for (const p of args) {
                        if (v.indexOf(p) === -1) {
                            return res;
                        }
                    }
                    res.push(v);
                    return res;
                }, []).length > 0);
            },
        };
    }
    /**
     * Helper function for this.validate().
     * @param validator The current Validator to call the current request input data on.
     * @param inputName The current input data name to validate.
     * @param input The current input data to validate.
     * @param failedValidators An array of already failed validators.
     * @throws JovoError if the validator has an unsupported type.
     */
    parseForValidator(validator, inputName, input, failedValidators) {
        // tslint:disable-line:no-any
        try {
            if (validator instanceof __1.Validator) {
                validator.setInputToValidate(input);
                validator.validate(this);
            }
            else if (typeof validator === 'function') {
                validator.call(this);
            }
            else {
                throw new __1.JovoError('This validation type is not supported.', __1.ErrorCode.ERR, 'jovo-core', undefined, 'Please make sure you only use supported types of validation such as a function or an extended Validator', '');
            }
        }
        catch (err) {
            if (err.constructor === __1.ValidationError) {
                failedValidators.push([err.validator, inputName, err.message]);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Asynchronous helper function for this.validateAsync().
     * @param validator The current Validator to call the current request input data on.
     * @param inputName The current input data name to validate.
     * @param input The current input data to validate.
     * @param failedValidators An array of already failed validators.
     * @throws JovoError if the validator has an unsupported type.
     */
    async parseForValidatorAsync(validator, inputName, input, failedValidators) {
        try {
            if (validator instanceof __1.Validator) {
                // @ts-ignore
                validator.setInputToValidate(input);
                // @ts-ignore
                await validator.validate(this);
            }
            else if (typeof validator === 'function') {
                await validator.call(this);
            }
            else {
                throw new __1.JovoError('This validation type is not supported.', __1.ErrorCode.ERR, 'jovo-core', undefined, 'Please make sure you only use supported types of validation such as a function or an extended Validator');
            }
        }
        catch (err) {
            if (err.constructor === __1.ValidationError) {
                failedValidators.push([err.validator, inputName, err.message]);
            }
            else {
                throw err;
            }
        }
    }
    isJovoDebuggerRequest() {
        return this.$host.headers && !!this.$host.headers['jovo-debugger'];
    }
}
exports.Jovo = Jovo;
//# sourceMappingURL=Jovo.js.map