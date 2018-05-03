'use strict';
const _ = require('lodash');
const BaseApp = require('./app');

const DEFAULT_CONFIG = {
    userMetaData: {
        lastUsedAt: true,
        sessionsCount: true,
        createdAt: true,
        requestHistorySize: 0,
        devices: false,
    },
    context: {
        prevLevel: 1,
        prev: {
            request: {
                intent: true,
                state: true,
                timestamp: true,
                inputs: true,
            },
            response: {
                speech: true,
                reprompt: true,
                state: true,
                timestamp: true,
            }
        }
    }
};

const basePrev = {
    request: {},
    response: {},
}

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
        this.config = DEFAULT_CONFIG;

        this.metaData = {};
        this.context = {};
        this.data = {};
        this.isNew = false;
        if (config) {
            if (config.userMetaData.lastUsedAt) {
                this.config.userMetaData.lastUsedAt = config.userMetaData.lastUsedAt;
             }
             if (config.userMetaData.sessionsCount) {
                 this.config.userMetaData.sessionsCount = config.userMetaData.sessionsCount;
             }
             if (config.userMetaData.createdAt) {
                 this.config.userMetaData.createdAt = config.userMetaData.createdAt;
             }
             if (config.userMetaData.requestHistorySize) {
                 this.config.userMetaData.requestHistorySize = config.userMetaData.requestHistorySize;
             }
             if (config.userMetaData.devices) {
                 this.config.userMetaData.devices = config.userMetaData.devices;
             }
             if (config.context.prevLevel) {
                this.config.context.prevLevel = config.context.prevLevel;
             }
             if (config.context.prev.response.speech) {
                 this.config.context.prev.response.speech = config.context.prev.response.speech;
             }
             if (config.context.prev.response.reprompt) {
                 this.config.context.prev.response.reprompt = config.context.prev.response.reprompt;
             }
             if (config.context.prev.response.timestamp) {
                 this.config.context.prev.response.timestamp = config.context.prev.response.timestamp;
             }
             if (config.context.prev.response.state) {
                 this.config.context.prev.response.state = config.context.prev.response.state;
             }
             if (config.context.prev.request.intent) {
                 this.config.context.prev.request.intent = config.context.prev.request.intent;
             }
             if (config.context.prev.request.state) {
                 this.config.context.prev.request.state= config.context.prev.request.state;
             }
             if (config.context.prev.request.timestamp) {
                 this.config.context.prev.request.timestamp = config.context.prev.request.timestamp;
             }
        }
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
        this.metaData = data.metaData;
        this.context = data.context;
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
        if (this.config.userMetaData.lastUsedAt) {
            this.metaData.lastUsedAt = new Date().toISOString();
        }

        if (this.config.userMetaData.sessionsCount) {
            if (this.platform.isNewSession()) {
                if (!this.metaData.sessionsCount) {
                    this.metaData.sessionsCount = 0;
                }
                this.metaData.sessionsCount += 1;
            }
        }

        if (this.config.userMetaData.requestHistorySize > 0) {
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

        if (this.config.userMetaData.devices) {
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
        // Checks, if there's an entry already
        this.moveContextPrev();
        this.updateContextPrevResponse();
        this.updateContextPrevRequest();
    }

    /**
     * Moves entries of context.prev
     * (0...n) where 0 is the most recent and n the oldest request/response pair
     */
    moveContextPrev() {
        for (let i = this.config.context.prevLevel - 1; i > 0; i--) {
            this.context.prev[i] = this.context.prev[i - 1];
        }
        this.context.prev[0] = basePrev;
    }
    /**
     * Updates user context.prev.response for both platforms
     */
    updateContextPrevResponse() {
        if (this.config.context.prev.response.speech) {
            try { // sometimes there is no output
                this.context.prev[0].response.speech = this.platform.getSpeechText();
            } catch (error) {

            }
        }
        if (this.config.context.prev.response.reprompt) {
            if (this.platform.getType() === BaseApp.PLATFORM_ENUM.ALEXA_SKILL) {
                if (this.platform.getResponse().responseObj.response.reprompt) {
                    this.context.prev[0].response.reprompt = this.platform.getRepromptText();
                } else {
                    this.context.prev[0].response.reprompt = null;
                }
            } else {
                // Store multiple reprompts of Google Assistant in array
                let response = this.platform.getResponse();
                if (response.responseObj.data.google.noInputPrompts) {
                    let repromptArray = new Array(response.responseObj.data.google.noInputPrompts.length);
                    for (let i = 0; i < repromptArray.length; i++) {
                        repromptArray[i] = removeSpeakTags(response.responseObj.data.google.noInputPrompts[i].ssml);
                    }
                    this.context.prev[0].response.reprompt = repromptArray;
                } else {
                    this.context.prev[0].response.reprompt = null;
                }
            }
        }
        if (this.config.context.prev.response.timestamp) {
            this.context.prev[0].response.timestamp = this.platform.getTimestamp();
        }
        if (this.config.context.prev.response.state) {
            let state = this.platform.getState();
            if (state) {
                this.context.prev[0].response.state = this.platform.getState();
            } else {
                this.context.prev[0].response.state = null;
            }
        }
    }

    /**
     * Updates user context.prev.request for both platforms
     */
    updateContextPrevRequest() {
        if (this.config.context.prev.request.intent) {
            if (this.platform.getRequestType() === BaseApp.REQUEST_TYPE_ENUM.INTENT) {
                this.context.prev[0].request.intent = this.platform.getIntentName();
            } else if (this.platform.getRequestType() === BaseApp.REQUEST_TYPE_ENUM.LAUNCH) {
                this.context.prev[0].request.intent = 'LaunchRequest';
            }
        }
        if (this.config.context.prev.request.timestamp) {
            this.context.prev[0].request.timestamp = this.platform.getTimestamp();
        }
        if (this.config.context.prev.request.state) {
            let state = this.platform.getState();
            if (state) {
                this.context.prev[0].request.state = this.platform.getState();
            } else {
                this.context.prev[0].request.state = null;
            }        }
        if (this.config.context.prev.request.inputs) {
            if (this.platform.getType() === BaseApp.PLATFORM_ENUM.ALEXA_SKILL) {
                if (this.platform.getRequestType() === BaseApp.REQUEST_TYPE_ENUM.INTENT) {
                    this.context.prev[0].request.inputs = this.platform.getInputsObj();
                }
            } else {
                this.context.prev[0].request.inputs = this.platform.getInputs();
            }
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
            context: {
                prev: [],
            },
        };

        for (let i = 0; i < this.config.context.prevLevel; i++) {
            obj.context.prev.push(basePrev);
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

