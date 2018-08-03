'use strict';
const _ = require('lodash');
const BaseApp = require('./app');

/**
 * User Class
 */
class User {

    /**
     * Constructor
     * @param {*} platform
     * @param {*=} config
     */
    constructor(platform, config) {
        this.platform = platform;
        this.config = {};
        this.config.intentMap = config.intentMap;
        this.config.userMetaData = config.userMetaData;
        this.config.userContext = config.userContext;
        // metaData && context are initialized at setData() | prevents saving an empty object
        this.metaData;
        this.context;
        this.data = {};
        this.isNew = false;
        this.isDeleted = false;
    }

    /**
     * Loads user data from database
     * @return {Promise<any>}
     */
    loadDataFromDb() {
        return new Promise((resolve, reject) => {
            this.platform.jovo.db().loadObject((error, data) => {
                if (error && (error.code === 'ERR_MAIN_KEY_NOT_FOUND' ||
                    error.code === 'ERR_DATA_KEY_NOT_FOUND')) {
                    this.setIsNewUser(true);
                    this.setData(this.createUserData());
                } else if (!data[this.platform.jovo.app.config.userDataCol]) {
                    this.setData(this.createUserData());
                } else {
                    this.setData(data[this.platform.jovo.app.config.userDataCol]);
                }
                resolve();
            });
        });
    }

    /**
     * Saves user data to database
     * @return {Promise<any>}
     */
    saveDataToDb() {
        return new Promise((resolve, reject) => {
            if (this.isDeleted) {
                resolve();
                return;
            }

            this.updateMetaData();
            this.updateContext();
            this.platform.jovo.db().saveFullObject(
                this.platform.jovo.app.config.userDataCol,
                this.getData(), function(error, data) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
        });
    }

    /**
     * Deletes current user from db
     * @return {Promise<any>}
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.isDeleted = true;
            this.platform.jovo.db().deleteUser((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /**
     * Sets isNew flag for user
     * @param {boolean} isNew
     */
    setIsNewUser(isNew) {
        this.isNew = isNew;
    }

    /**
     * Returns isNew flag
     * @return {boolean|*}
     */
    isNewUser() {
        return this.isNew;
    }

    /**
     * Sets data
     * @param {*} data
     */
    setData(data) {
        if (!data) {
            data = {};
        }
        this.data = data.data;
        // Prevents saving an empty object
        _.values(this.config.userMetaData).forEach((element) => {
            if (element || element > 0) {
                this.metaData = data.metaData || {};
            }
        });
        // Prevents saving an empty object
        if (_.get(this, 'config.userContext.prev.size') > 0) {
            this.context = data.context || {};

            if (_.isEmpty(this.context)) {
                this.context.prev = [];
            }
        }
    }

    /**
     * Returns full user data object
     * @return {{data: *, metaData: *}}
     */
    getData() {
        return {
            data: this.data,
            metaData: this.metaData,
            context: this.context,
        };
    }

    /**
     * Updates dynamic meta data
     */
    updateMetaData() {
        if (_.get(this, 'config.userMetaData.lastUsedAt')) {
            this.metaData.lastUsedAt = new Date().toISOString();
        }

        if (_.get(this, 'config.userMetaData.sessionsCount')) {
            if (this.platform.isNewSession()) {
                if (!this.metaData.sessionsCount) {
                    this.metaData.sessionsCount = 0;
                }
                this.metaData.sessionsCount += 1;
            }
        }

        if (_.get(this, 'config.userMetaData.requestHistorySize') > 0) {
            if (!_.get(this.metaData, `requests.${this.platform.jovo.getHandlerPath()}`)) {
                let requests = {
                    count: 0,
                    log: [],
                };
                _.set(this.metaData,
                    `requests.${this.platform.jovo.getHandlerPath()}`,
                    requests);
            }
            let requestItem = this.metaData.requests[this.platform.jovo.getHandlerPath()];
            requestItem.count += 1;
            requestItem.log.push(new Date().toISOString());

            if (requestItem.log.length > this.config.requestHistorySize) {
                requestItem.log = requestItem.log.slice(1, requestItem.log.length);
            }
        }

        if (_.get(this, 'config.userMetaData.devices')) {
            if (!_.get(this.metaData, 'devices["'+this.platform.getDeviceId()+'"]')) {
                let device = {
                    hasAudioInterface: this.platform.hasAudioInterface(),
                    hasScreenInterface: this.platform.hasScreenInterface(),
                };
                _.set(this.metaData,
                    'devices["'+this.platform.getDeviceId()+'"]',
                    device);
            }
        }
    }

    /**
     * Updats the user context
     */
    updateContext() {
        if (_.get(this, 'config.userContext.prev.size') > 0) {
            this.updateContextPrev();
        }
    }

    /**
     * Updates context's prev array
     */
    updateContextPrev() {
        let prevObject = {
            request: {},
            response: {},
        };
        if (_.get(this, 'config.userContext.prev.response.speech')) {
            try { // sometimes there is no output
                prevObject.response.speech = this.platform.getSpeechText();
            } catch (error) {

            }
        }
        if (_.get(this, 'config.userContext.prev.response.reprompt')) {
            if (this.platform.getType() === BaseApp.PLATFORM_ENUM.ALEXA_SKILL) {
                try { // sometimes there is no reprompt
                    prevObject.response.reprompt = this.platform.getRepromptText();
                } catch (error) {

                }
            } else {
                try { // sometimes there is no reprompt
                    let response = this.platform.getResponse();
                    // Array length = amount of reprompts
                    let repromptCount = _.get(response, 'responseObj.data.google.noInputPrompts').length;
                    let repromptArray = new Array(repromptCount);
                    for (let i = 0; i < repromptArray.length; i++) {
                        let repromptStr = _.get(response, 'responseObj.data.google.noInputPrompts')[i].ssml;
                        repromptArray[i] = removeSpeakTags(repromptStr);
                    }
                    prevObject.response.reprompt = repromptArray;
                } catch (error) {

                }
            }
        }
        if (_.get(this, 'config.userContext.prev.response.state')) {
            if (this.platform.getType() === BaseApp.PLATFORM_ENUM.GOOGLE_ACTION) {
                prevObject.response.state = this.platform.getState();
            } else if (this.platform.getType() === BaseApp.PLATFORM_ENUM.ALEXA_SKILL) {
                prevObject.response.state = this.platform.getState();
            }
        }
        if (_.get(this, 'config.userContext.prev.request.intent')) {
            // Not platform specific
            if (this.platform.getRequestType() === BaseApp.REQUEST_TYPE_ENUM.INTENT) {
                /**
                 * Saves platform specific intent name first,
                 * but switches to intentMap value if defined
                 */
                let intentName = this.platform.getIntentName();
                prevObject.request.intent = intentName;
                _.keys(_.get(this, 'config.intentMap')).forEach((key) => {
                    if (intentName === key) {
                        prevObject.request.intent = this.config.intentMap[key];
                    }
                });
            } else if (this.platform.getType() === BaseApp.PLATFORM_ENUM.ALEXA_SKILL) {
                let request = this.platform.getRequest();
                let requestType = this.platform.getRequestType();
                switch (requestType) {
                    // Special cases: save specific request type, e.g.'AudioPlayer.PlaybackStarted'
                    case BaseApp.REQUEST_TYPE_ENUM.ON_EVENT:
                        prevObject.request.intent = _.get(request, 'request.type');
                        break;
                    case BaseApp.REQUEST_TYPE_ENUM.AUDIOPLAYER:
                        prevObject.request.intent = _.get(request, 'request.type');
                        break;
                    default:
                        // Save enum
                        prevObject.request.intent = requestType;
                }
            } else if (this.platform.getType() === BaseApp.PLATFORM_ENUM.GOOGLE_ACTION) {
                prevObject.request.intent = this.platform.getRequestType();
            }
        }
        if (_.get(this, 'config.userContext.prev.request.timestamp')) {
            prevObject.request.timestamp = this.platform.getTimestamp();
        }
        if (_.get(this, 'config.userContext.prev.request.state')) {
            if (this.platform.getType() === BaseApp.PLATFORM_ENUM.GOOGLE_ACTION) {
                let request = this.platform.getRequest();
                let contextSession = request.getContext('session');
                prevObject.request.state = _.get(contextSession, 'parameters.STATE');
            } else if (this.platform.getType() === BaseApp.PLATFORM_ENUM.ALEXA_SKILL) {
                try {
                    if (this.platform.request.getSessionAttribute('STATE')) {
                        prevObject.request.state = this.platform.request.getSessionAttribute('STATE');
                    }
                } catch (err) {
                    // Some requests don't have a state
                }
            }
        }
        if (_.get(this, 'config.userContext.prev.request.inputs')) {
            if (this.platform.getType() === BaseApp.PLATFORM_ENUM.ALEXA_SKILL) {
                if (this.platform.getRequestType() === BaseApp.REQUEST_TYPE_ENUM.INTENT) {
                    let inputsObject = this.platform.getInputsObj();
                    if (!_.isEmpty(inputsObject)) {
                        prevObject.request.inputs = inputsObject;
                    }
                }
            } else {
                let inputsObject = this.platform.getInputs();
                if (!_.isEmpty(inputsObject)) {
                    prevObject.request.inputs = inputsObject;
                }
            }
        }

        // Deletes request/response, if nothing was saved there
        if (Object.keys(prevObject.request).length === 0) {
            delete prevObject.request;
        }
        if (Object.keys(prevObject.response).length === 0) {
            delete prevObject.response;
        }
        if (this.context.prev.length === _.get(this, 'config.userContext.prev.size')) {
            this.context.prev.pop(); // remove last element
        }
        if (_.get(prevObject, 'request') || _.get(prevObject, 'response')) {
            // Prevents storing empty object
            this.context.prev.unshift(prevObject); // add new prevObject to the beginning
        }
    }

    /**
     * Creates initial user data object
     * @return {{metaData: {createdAt: string, sessionsCount: number}, data: {}}}
     */
    createUserData() {
        let obj = {
            metaData: {},
            data: {},
            context: {},
        };

        if (_.get(this, 'config.userContext.prev.size') > 0) {
            obj.context.prev = [];
        }

        if (this.config.userMetaData.createdAt) {
            obj.metaData['createdAt'] = new Date().toISOString();
        }

        return obj;
    }
    /**
     * Returns user id
     * @return {string}
     */
    getId() {
        return this.platform.getUserId();
    }

    /**
     * Returns locale
     * @return {string}
     */
    getLocale() {
        return this.platform.getLocale();
    }


    /**
     * Returns device id
     * @return {string}
     */
    getDeviceId() {
        return this.platform.getDeviceId();
    }


    /** META DATA HELPER */

    /**
     * Seconds since last session
     * @return {number} time in seconds
     */
    getSecondsSinceLastSession() {
        let now = new Date();
        let lastUsedAt = new Date(this.metaData.lastUsedAt);
        return Math.ceil((now - lastUsedAt)/1000);
    }

    /**
     * Returns number of sessions
     * @return {number}
     */
    getSessionsCount() {
        return this.metaData.sessionsCount;
    }

    /**
     * Returns last used at iso timestamp
     * @return {string|*}
     */
    getLastUsedAt() {
        return this.metaData.lastUsedAt;
    }

    /**
     * Returns created at iso timestamp
     * @return {string|*}
     */
    getCreatedAt() {
        return this.metaData.lastUsedAt;
    }

    /**
     * Return the intent at the specified index
     * @param {number} index
     * @return {String}
     */
    getPrevIntent(index) {
        this.errorIfIndexNotInteger(index);
        this.errorIfIndexBiggerPrevSize(index);
        return this.context.prev[index].request.intent;
    }

    /**
     * Returns request.state at the specified index
     * @param {number} index
     * @return {String}
     */
    getPrevRequestState(index) {
        this.errorIfIndexNotInteger(index);
        this.errorIfIndexBiggerPrevSize(index);
        return this.context.prev[index].request.state;
    }

    /**
     * Returns response.state at the specified index
     * @param {number} index
     * @return {String}
     */
    getPrevResponseState(index) {
        this.errorIfIndexNotInteger(index);
        this.errorIfIndexBiggerPrevSize(index);
        return this.context.prev[index].response.state;
    }

    /**
     * Returns the inputs at the specified index
     * @param {number} index
     * @return {*}
     */
    getPrevInputs(index) {
        this.errorIfIndexNotInteger(index);
        this.errorIfIndexBiggerPrevSize(index);
        return this.context.prev[index].request.inputs;
    }

    /**
     * Returns the timestamp at the specified index
     * @param {number} index
     * @return {String|*}
     */
    getPrevTimestamp(index) {
        this.errorIfIndexNotInteger(index);
        this.errorIfIndexBiggerPrevSize(index);
        return this.context.prev[index].request.timestamp;
    }

    /**
     * Returns the speech at the specified index
     * @param {number} index
     * @return {String}
     */
    getPrevSpeech(index) {
        this.errorIfIndexNotInteger(index);
        this.errorIfIndexBiggerPrevSize(index);
        return this.context.prev[index].response.speech;
    }

    /**
     * Returns the reprompt at the specified index
     * @param {number} index
     * @return {String}
     */
    getPrevReprompt(index) {
        this.errorIfIndexNotInteger(index);
        this.errorIfIndexBiggerPrevSize(index);
        return this.context.prev[index].response.reprompt;
    }

    /**
     * Error if index is bigger than userContext.prev.size
     * @param {number} index Must be an integer
     */
    errorIfIndexBiggerPrevSize(index) {
        if (index >= _.get(this, 'config.userContext.prev.size')) {
            throw new Error('index has to be an integer smaller than prev.size (default value: 1)');
        }
    }

    /**
     * Error if index is not an integer
     * @param {number} index
     */
    errorIfIndexNotInteger(index) {
        if (!_.isInteger(index)) {
            throw new Error('index has to be an integer');
        }
    }
}

/**
 * Removes speak tags
 * @param {string} text
 * @return {XML|string}
 */
function removeSpeakTags(text) {
    return text.replace(/<speak>/g, '').replace(/<\/speak>/g, '');
}

module.exports.User = User;

