"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
class JovoUser {
    constructor(config) {
        this.config = {
            columnName: 'userData',
            context: {
                enabled: false,
                prev: {
                    request: {
                        inputs: true,
                        intent: true,
                        state: true,
                        timestamp: true,
                    },
                    response: {
                        output: true,
                        reprompt: true,
                        speech: true,
                        state: true,
                    },
                    size: 1,
                },
            },
            dataCaching: false,
            implicitSave: true,
            metaData: {
                createdAt: true,
                devices: true,
                enabled: false,
                lastUsedAt: true,
                requestHistorySize: 4,
                sessionsCount: true,
            },
            sessionData: {
                data: false,
                enabled: false,
                expireAfterSeconds: 300,
                id: false,
            },
            updatedAt: false,
        };
        this.loadDb = async (handleRequest, force = false) => {
            var _a;
            // no database
            if (!handleRequest.app.$db) {
                return Promise.resolve();
            }
            if (handleRequest.app.$db.needsWriteFileAccess && !handleRequest.host.hasWriteFileAccess) {
                return Promise.resolve();
            }
            if (this.config.implicitSave === false && !force) {
                return Promise.resolve();
            }
            if (!handleRequest.jovo) {
                throw new jovo_core_1.JovoError('jovo object is not initialized.', jovo_core_1.ErrorCode.ERR, 'jovo-framework');
            }
            if (!handleRequest.jovo.$user) {
                throw new jovo_core_1.JovoError('user object is not initialized', jovo_core_1.ErrorCode.ERR, 'jovo-framework');
            }
            const userId = handleRequest.jovo.$user.getId();
            if (typeof userId === 'undefined') {
                throw new jovo_core_1.JovoError(`Can't load user with undefined userId`, jovo_core_1.ErrorCode.ERR, 'jovo-framework');
            }
            const data = await handleRequest.app.$db.load(userId, handleRequest.jovo);
            jovo_core_1.Log.verbose(jovo_core_1.Log.header('Jovo user (load)', 'framework'));
            jovo_core_1.Log.yellow().verbose(`this.$user.getId(): ${userId}`);
            if (!data) {
                handleRequest.jovo.$user.isDeleted = false;
            }
            else {
                handleRequest.jovo.$user.new = false;
            }
            handleRequest.jovo.$user.$data = _get(data, `${this.config.columnName}.data`, {});
            if (this.config.metaData && this.config.metaData.enabled) {
                handleRequest.jovo.$user.$metaData = _get(data, `${this.config.columnName}.metaData`, {
                    createdAt: new Date().toISOString(),
                    sessionsCount: 0,
                });
            }
            if (this.config.context && this.config.context.enabled) {
                handleRequest.jovo.$user.$context = _get(data, `${this.config.columnName}.context`, {});
            }
            if (this.config.sessionData && this.config.sessionData.enabled) {
                const serializedSessionData = _get(data, `${this.config.columnName}.session`, {});
                if (this.config.sessionData.dataKey) {
                    serializedSessionData.$data = serializedSessionData[this.config.sessionData.dataKey];
                    delete serializedSessionData[this.config.sessionData.dataKey];
                }
                const expireAfter = (this.config.sessionData.expireAfterSeconds || 300) * 1000;
                let sessionData = {
                    isNew: true,
                };
                if (serializedSessionData.lastUpdatedAt) {
                    const expirationTime = new Date(serializedSessionData.lastUpdatedAt).getTime() + expireAfter;
                    const isExpired = new Date().getTime() >= expirationTime;
                    if (!isExpired) {
                        serializedSessionData.isNew = false;
                        sessionData = serializedSessionData;
                    }
                }
                handleRequest.jovo.$user.$session = sessionData;
                if (this.config.sessionData && this.config.sessionData.data) {
                    handleRequest.jovo.$session.$data = Object.assign({}, (((_a = handleRequest.jovo.$user.$session) === null || _a === void 0 ? void 0 : _a.$data) || {}));
                }
            }
            // can't parse $user, so we parse object containing its data
            const userData = {
                context: handleRequest.jovo.$user.$context,
                data: handleRequest.jovo.$user.$data,
                metaData: handleRequest.jovo.$user.$metaData,
                session: handleRequest.jovo.$user.$session,
            };
            this.updateDbLastState(handleRequest, userData);
            jovo_core_1.Log.yellow().verbose(`this.$user.new = ${handleRequest.jovo.$user.new}`);
            jovo_core_1.Log.verbose();
            jovo_core_1.Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$context, null, '\t'));
            jovo_core_1.Log.yellow().debug('this.$user.$data');
            jovo_core_1.Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$data, null, '\t'));
            jovo_core_1.Log.yellow().debug('this.$user.$metaData');
            jovo_core_1.Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$metaData, null, '\t'));
            jovo_core_1.Log.yellow().debug('this.$user.$session');
            jovo_core_1.Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$session, null, '\t'));
        };
        this.saveDb = async (handleRequest, force = false) => {
            var _a;
            // no database
            if (!handleRequest.app.$db) {
                return Promise.resolve();
            }
            if (handleRequest.app.$db.needsWriteFileAccess && !handleRequest.host.hasWriteFileAccess) {
                return Promise.resolve();
            }
            if (!handleRequest.jovo) {
                throw new jovo_core_1.JovoError('jovo object is not initialized.', jovo_core_1.ErrorCode.ERR, 'jovo-framework');
            }
            if (!handleRequest.jovo.$user) {
                throw new jovo_core_1.JovoError('user object is not initialized', jovo_core_1.ErrorCode.ERR, 'jovo-framework');
            }
            if (handleRequest.jovo.$user.isDeleted) {
                return Promise.resolve();
            }
            if (this.config.implicitSave === false && !force) {
                return Promise.resolve();
            }
            const userData = {
                // tslint:disable-line
                data: handleRequest.jovo.$user.$data,
            };
            if (this.config.context && this.config.context.enabled) {
                this.updateContextData(handleRequest);
                userData.context = handleRequest.jovo.$user.$context;
            }
            if (this.config.metaData && this.config.metaData.enabled) {
                this.updateMetaData(handleRequest);
                userData.metaData = handleRequest.jovo.$user.$metaData;
            }
            if (this.config.sessionData && this.config.sessionData.enabled) {
                userData.session = {};
                if (this.config.sessionData.data) {
                    this.updateSessionData(handleRequest);
                    const dataKey = this.config.sessionData.dataKey || '$data';
                    userData.session[dataKey] = handleRequest.jovo.$user.$session.$data;
                }
                const sessionId = (_a = handleRequest.jovo.$request) === null || _a === void 0 ? void 0 : _a.getSessionId();
                if (this.config.sessionData.id && sessionId) {
                    userData.session.id = sessionId;
                }
                if (handleRequest.jovo.$output.tell) {
                    delete userData.session.lastUpdatedAt;
                }
                else {
                    userData.session.lastUpdatedAt = new Date().toISOString();
                }
            }
            const userId = handleRequest.jovo.$user.getId();
            if (typeof userId === 'undefined') {
                throw new jovo_core_1.JovoError(`Can't save user with undefined userId`, jovo_core_1.ErrorCode.ERR, 'jovo-framework');
            }
            const updatedAt = this.config.updatedAt ? new Date().toISOString() : undefined;
            if (this.config.dataCaching) {
                // only save to db if there were changes made.
                if (!this.userDataIsEqualToLastState(handleRequest, userData)) {
                    await handleRequest.app.$db.save(userId, this.config.columnName || 'userData', userData, updatedAt, handleRequest.jovo);
                }
            }
            else {
                await handleRequest.app.$db.save(userId, this.config.columnName || 'userData', userData, updatedAt, handleRequest.jovo);
            }
            jovo_core_1.Log.verbose(jovo_core_1.Log.header('Jovo user: (save) ', 'framework'));
            jovo_core_1.Log.yellow().verbose(` Saved user: ${userId}`);
            jovo_core_1.Log.yellow().debug(' this.$user.$context');
            jovo_core_1.Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$context, null, '\t'));
            jovo_core_1.Log.yellow().debug(' this.$user.$data');
            jovo_core_1.Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$data, null, '\t'));
            jovo_core_1.Log.yellow().debug(' this.$user.$metaData');
            jovo_core_1.Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$metaData, null, '\t'));
            jovo_core_1.Log.yellow().debug(' this.$user.$session');
            jovo_core_1.Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$session, null, '\t'));
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        // tslint:disable
        this.loadDb = this.loadDb.bind(this);
        this.saveDb = this.saveDb.bind(this);
        // tslint:enable
    }
    install(app) {
        app.middleware('user.load').use(this.loadDb);
        app.middleware('user.save').use(this.saveDb);
        const loadDb = this.loadDb;
        const saveDb = this.saveDb;
        /**
         * Return the intent at the specified index
         * @deprecated use this.$user.context.prev[index].request.intent instead
         * @param {number} index
         * @return {String}
         */
        jovo_core_1.User.prototype.getPrevIntent = function (index) {
            return _get(this.$context, `prev[${index}].request.intent`);
        };
        /**
         * Returns request.state at the specified index
         * @deprecated use this.$user.context.prev[index].request.state instead
         * @param {number} index
         * @return {String}
         */
        jovo_core_1.User.prototype.getPrevRequestState = function (index) {
            return _get(this.$context, `prev[${index}].request.state`);
        };
        /**
         * Returns response.state at the specified index
         * @deprecated use this.$user.context.prev[index].response.state instead
         * @param {number} index
         * @return {String}
         */
        jovo_core_1.User.prototype.getPrevResponseState = function (index) {
            return _get(this.$context, `prev[${index}].response.state`);
        };
        /**
         * Returns the inputs at the specified index
         * @deprecated use this.$user.context.prev[index].request.inputs instead
         * @param {number} index
         * @return {*}
         */
        jovo_core_1.User.prototype.getPrevInputs = function (index) {
            return _get(this.$context, `prev[${index}].request.inputs`);
        };
        /**
         * Returns the timestamp at the specified index
         * @deprecated use this.$user.context.prev[index].request.timestamp instead
         * @param {number} index
         * @return {String|*}
         */
        jovo_core_1.User.prototype.getPrevTimestamp = function (index) {
            return _get(this.$context, `prev[${index}].request.timestamp`);
        };
        /**
         * Returns the speech at the specified index
         * @deprecated use this.$user.context.prev[index].response.speech instead
         * @param {number} index
         * @return {String}
         */
        jovo_core_1.User.prototype.getPrevSpeech = function (index) {
            return _get(this.$context, `prev[${index}].response.speech`);
        };
        /**
         * Returns the reprompt at the specified index
         * @deprecated use this.$user.context.prev[index].request.reprompt instead
         * @param {number} index
         * @return {String}
         */
        jovo_core_1.User.prototype.getPrevReprompt = function (index) {
            return _get(this.$context, `prev[${index}].response.reprompt`);
        };
        /**
         * Explicit user deletion
         * @returns {Promise<void>}
         */
        jovo_core_1.User.prototype.delete = async function () {
            const userId = this.getId();
            if (typeof userId === 'undefined') {
                throw new Error(`Can't delete user with undefined userId`);
            }
            if (this.jovo.$app.$db) {
                await this.jovo.$app.$db.delete(userId, this.jovo);
                this.isDeleted = true;
                jovo_core_1.Log.verbose(`User with id ${userId} has been deleted.`);
            }
            else {
                throw new Error('No database configurated.');
            }
        };
        /**
         * Load user from db
         * @returns {Promise<any>}
         */
        jovo_core_1.User.prototype.loadData = async function () {
            if (!this.jovo) {
                throw new Error('Jovo object is not initialized.');
            }
            return loadDb(new jovo_core_1.HandleRequest(this.jovo.$app, this.jovo.$host, this.jovo), true);
        };
        /**
         * Save user to db
         * @returns {Promise<any>}
         */
        jovo_core_1.User.prototype.saveData = async function () {
            if (!this.jovo) {
                throw new Error('Jovo object is not initialized.');
            }
            return saveDb(new jovo_core_1.HandleRequest(this.jovo.$app, this.jovo.$host, this.jovo), true);
        };
        /**
         * Repeats last speech & reprompt
         * Gets the info from the database.
         *
         * Context saving has to be set.
         * user: {
         *      context: true
         * }
         */
        jovo_core_1.Jovo.prototype.repeat = async function () {
            if (_get(this.$user, '$context.prev[0].response.output')) {
                this.setOutput(_get(this.$user, '$context.prev[0].response.output'));
            }
        };
    }
    /**
     * Caches the current state of the user data hashed inside the jovo object
     * @param {HandleRequest} handleRequest https://www.jovo.tech/docs/plugins#handlerequest
     * @param {object} data user data
     */
    updateDbLastState(handleRequest, data) {
        const stringifiedData = JSON.stringify(data);
        const hashedUserData = crypto.createHash('md5').update(stringifiedData).digest('hex');
        handleRequest.jovo.$user.db_cache_hash = hashedUserData;
    }
    /**
     *
     * @param {HandleRequest} handleRequest https://www.jovo.tech/docs/plugins#handlerequest
     * @param {object} data current user data
     */
    userDataIsEqualToLastState(handleRequest, data) {
        const stringifiedData = JSON.stringify(data);
        const hashedUserData = crypto.createHash('md5').update(stringifiedData).digest('hex'); // current user data
        const cachedHashedUserData = handleRequest.jovo.$user.db_cache_hash; // cached user data
        return hashedUserData === cachedHashedUserData;
    }
    updateMetaData(handleRequest) {
        if (!handleRequest.jovo) {
            throw new jovo_core_1.JovoError('jovo object is not initialized.', jovo_core_1.ErrorCode.ERR, 'jovo-framework');
        }
        if (this.config.metaData.createdAt) {
            this.updateCreatedAt(handleRequest);
        }
        if (this.config.metaData.lastUsedAt) {
            this.updateLastUsedAt(handleRequest);
        }
        if (this.config.metaData.sessionsCount) {
            this.updateSessionsCount(handleRequest);
        }
        if (this.config.metaData.requestHistorySize > 0) {
            this.updateRequestHistory(handleRequest);
        }
        if (this.config.metaData.devices) {
            this.updateDevices(handleRequest);
        }
    }
    /**
     * update $metaData.createdAt
     * @param {HandleRequest} handleRequest
     */
    updateCreatedAt(handleRequest) {
        // createdAt should only be set once for each user
        if (!handleRequest.jovo.$user.$metaData.createdAt) {
            handleRequest.jovo.$user.$metaData.createdAt = new Date().toISOString();
        }
    }
    /**
     * update $metaData.lastUsedAt
     * @param {HandleRequest} handleRequest
     */
    updateLastUsedAt(handleRequest) {
        handleRequest.jovo.$user.$metaData.lastUsedAt = new Date().toISOString();
    }
    /**
     * update $metaData.sessionsCount
     * @param {HandleRequest} handleRequest
     */
    updateSessionsCount(handleRequest) {
        let sessionsCount = handleRequest.jovo.$user.$metaData.sessionsCount || 0;
        if (handleRequest.jovo.isNewSession()) {
            sessionsCount += 1;
        }
        handleRequest.jovo.$user.$metaData.sessionsCount = sessionsCount;
    }
    /**
     * update $metaData.requests
     * @param {HandleRequest} handleRequest
     */
    updateRequestHistory(handleRequest) {
        if (!handleRequest.jovo.$user.$metaData.requests) {
            handleRequest.jovo.$user.$metaData.requests = {};
        }
        if (!handleRequest.jovo.$user.$metaData.requests[handleRequest.jovo.getHandlerPath()]) {
            handleRequest.jovo.$user.$metaData.requests[handleRequest.jovo.getHandlerPath()] = {
                count: 0,
                log: [],
            };
        }
        const requestItem = handleRequest.jovo.$user.$metaData.requests[handleRequest.jovo.getHandlerPath()];
        requestItem.count += 1;
        requestItem.log.push(new Date().toISOString());
        if (requestItem.log.length > this.config.metaData.requestHistorySize) {
            requestItem.log = requestItem.log.slice(1, requestItem.log.length);
        }
    }
    /**
     * update $metaData.devices
     * @param {HandleRequest} handleRequest
     */
    updateDevices(handleRequest) {
        if (!handleRequest.jovo.$user.$metaData.devices) {
            handleRequest.jovo.$user.$metaData.devices = {};
        }
        handleRequest.jovo.$user.$metaData.devices['' + handleRequest.jovo.getDeviceId() + ''] = {
            hasAudioInterface: handleRequest.jovo.hasAudioInterface(),
            hasScreenInterface: handleRequest.jovo.hasScreenInterface(),
            hasVideoInterface: handleRequest.jovo.hasVideoInterface(),
        };
    }
    /**
     * update $user.$context
     * @param {HandleRequest} handleRequest
     */
    updateContextData(handleRequest) {
        if (!handleRequest.jovo) {
            throw new jovo_core_1.JovoError('jovo object is not initialized.', jovo_core_1.ErrorCode.ERR, 'jovo-framework');
        }
        if (this.config.context.prev.size < 1) {
            return;
        }
        if (!handleRequest.jovo.$user.$context.prev) {
            handleRequest.jovo.$user.$context.prev = [];
        }
        const prevObject = {};
        // initialize response/request object if they will be needed (one of the config values is true)
        // If we don't initialize the other update functions will try to set the values of an undefined object
        // e.g. prevObject.response.speech --> will throw TypeError
        if (Object.values(this.config.context.prev.response).includes(true)) {
            prevObject.response = {};
        }
        if (Object.values(this.config.context.prev.request).includes(true)) {
            prevObject.request = {};
        }
        if (this.config.context.prev.response.speech) {
            this.updatePrevSpeech(handleRequest, prevObject);
        }
        if (this.config.context.prev.response.reprompt) {
            this.updatePrevReprompt(handleRequest, prevObject);
        }
        if (this.config.context.prev.response.state) {
            this.updatePrevResponseState(handleRequest, prevObject);
        }
        if (this.config.context.prev.request.timestamp) {
            this.updatePrevTimestamp(handleRequest, prevObject);
        }
        if (this.config.context.prev.request.state) {
            this.updatePrevRequestState(handleRequest, prevObject);
        }
        if (this.config.context.prev.request.inputs) {
            this.updatePrevInputs(handleRequest, prevObject);
        }
        if (this.config.context.prev.request.intent) {
            this.updatePrevIntent(handleRequest, prevObject);
        }
        if (this.config.context.prev.response.output) {
            this.updatePrevOutput(handleRequest, prevObject);
        }
        if (prevObject.request || prevObject.response) {
            if (handleRequest.jovo.$user.$context.prev) {
                // Prevents storing empty object
                handleRequest.jovo.$user.$context.prev.unshift(prevObject);
                handleRequest.jovo.$user.$context.prev = handleRequest.jovo.$user.$context.prev.slice(0, this.config.context.prev.size); // add new prevObject to the beginning
            }
        }
    }
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    updatePrevSpeech(handleRequest, prevObject) {
        if (handleRequest.jovo.$output.tell) {
            prevObject.response.speech = handleRequest.jovo.$output.tell.speech;
        }
        if (handleRequest.jovo.$output.ask) {
            prevObject.response.speech = handleRequest.jovo.$output.ask.speech;
        }
    }
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    updatePrevReprompt(handleRequest, prevObject) {
        if (handleRequest.jovo.$output.ask) {
            prevObject.response.reprompt = handleRequest.jovo.$output.ask.reprompt;
        }
    }
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    updatePrevResponseState(handleRequest, prevObject) {
        if (handleRequest.jovo.$session &&
            handleRequest.jovo.$session.$data &&
            handleRequest.jovo.$session.$data[jovo_core_1.SessionConstants.STATE]) {
            prevObject.response.state = handleRequest.jovo.$session.$data[jovo_core_1.SessionConstants.STATE];
        }
    }
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    updatePrevTimestamp(handleRequest, prevObject) {
        prevObject.request.timestamp = handleRequest.jovo.$request.getTimestamp();
    }
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    updatePrevRequestState(handleRequest, prevObject) {
        if (handleRequest.jovo.$requestSessionAttributes[jovo_core_1.SessionConstants.STATE]) {
            prevObject.request.state = handleRequest.jovo.$requestSessionAttributes[jovo_core_1.SessionConstants.STATE];
        }
    }
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    updatePrevInputs(handleRequest, prevObject) {
        if (handleRequest.jovo.$inputs) {
            prevObject.request.inputs = handleRequest.jovo.$inputs;
        }
    }
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    updatePrevIntent(handleRequest, prevObject) {
        prevObject.request.intent = handleRequest.jovo.$plugins.Router.route.path;
        if (handleRequest.jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            prevObject.request.intent = handleRequest.jovo.$plugins.Router.route.intent;
        }
    }
    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    updatePrevOutput(handleRequest, prevObject) {
        if (handleRequest.jovo.$output) {
            prevObject.response.output = handleRequest.jovo.$output;
        }
    }
    updateSessionData(handleRequest) {
        if (!handleRequest.jovo) {
            throw new jovo_core_1.JovoError('jovo object is not initialized.', jovo_core_1.ErrorCode.ERR, 'jovo-framework');
        }
        handleRequest.jovo.$user.$session.$data = handleRequest.jovo.$session.$data || {};
    }
}
exports.JovoUser = JovoUser;
//# sourceMappingURL=JovoUser.js.map