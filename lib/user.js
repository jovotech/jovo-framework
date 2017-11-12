'use strict';
const _ = require('lodash');


const DEFAULT_CONFIG = {
    lastUsedAt: true,
    sessionsCount: true,
    createdAt: true,
    requestHistorySize: 0,
    devices: false,
};
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
        this.data = {};
        this.isNew = false;
        if (config) {
            if (config.lastUsedAt) {
               this.config.lastUsedAt = config.lastUsedAt;
            }
            if (config.sessionsCount) {
                this.config.sessionsCount = config.sessionsCount;
            }
            if (config.createdAt) {
                this.config.createdAt = config.createdAt;
            }
            if (config.requestHistorySize) {
                this.config.requestHistorySize = config.requestHistorySize;
            }
            if (config.devices) {
                this.config.devices = config.devices;
            }
        }
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
    }

    /**
     * Returns full user data object
     * @return {{data: *, metaData: *}}
     */
    getData() {
        return {
            data: this.data,
            metaData: this.metaData,
        };
    }

    /**
     * Updates dynamic meta data
     */
    updateMetaData() {
        if (this.config.lastUsedAt) {
            this.metaData.lastUsedAt = new Date().toISOString();
        }

        if (this.config.sessionsCount) {
            if (this.platform.isNewSession()) {
                if (!this.metaData.sessionsCount) {
                    this.metaData.sessionsCount = 0;
                }
                this.metaData.sessionsCount += 1;
            }
        }

        if (this.config.requestHistorySize > 0) {
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

        if (this.config.devices) {
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
     * Creates initial user data object
     * @return {{metaData: {createdAt: string, sessionsCount: number}, data: {}}}
     */
    createUserData() {
        let obj = {
            metaData: {},
            data: {},
        };

        if (this.config.createdAt) {
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


module.exports.User = User;

