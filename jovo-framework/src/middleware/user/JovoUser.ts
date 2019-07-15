import crypto = require('crypto');
import {
    BaseApp,
    EnumRequestType,
    ErrorCode,
    HandleRequest,
    Inputs,
    Jovo,
    JovoError,
    Log,
    Output,
    Plugin,
    PluginConfig,
    SessionConstants,
    SpeechBuilder,
    User,
} from 'jovo-core';
import _get = require('lodash.get');
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
    columnName?: string;
    implicitSave?: boolean;
    metaData?: MetaDataConfig;
    context?: ContextConfig;
    updatedAt?: boolean;
    dataCaching?: boolean;
}

export interface MetaDataConfig {
    enabled?: boolean;
    lastUsedAt?: boolean;
    sessionsCount?: boolean;
    createdAt?: boolean;
    requestHistorySize?: number;
    devices?: boolean;
}

export interface ContextConfig {
    enabled?: boolean;
    prev?: {
        size?: number;
        request?: {
            intent?: boolean;
            state?: boolean;
            inputs?: boolean;
            timestamp?: boolean;
        },
        response?: {
            speech?: boolean;
            reprompt?: boolean;
            state?: boolean;
            output?: boolean;
        },
    };
}

export interface UserContext {
    prev?: ContextPrevObject[];
}

export interface ContextPrevObject {
    request?: {
        timestamp?: string;
        state?: string;
        intent?: string;
        inputs?: Inputs;
    };
    response?: {
        speech?: string | SpeechBuilder;
        reprompt?: string | SpeechBuilder | string[];
        state?: string;
        output?: Output;
    };
}

export interface UserMetaData {
    lastUsedAt?: string;
    sessionsCount?: number;
    createdAt?: string;
    requests?: {
        [ key: string ]: {
            count: number;
            log: string[];
        };
    };
    devices?: {
        [ key: string ]: {
            hasAudioInterface: boolean;
            hasScreenInterface: boolean;
            hasVideoInterface: boolean;
        };
    };
}

export class JovoUser implements Plugin {

    config: Config = {
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
        updatedAt: false,
    };

    constructor(config?: Config) {

        if (config) {
            this.config = _merge(this.config, config);
        }
        // tslint:disable
        this.loadDb = this.loadDb.bind(this);
        this.saveDb = this.saveDb.bind(this);
        // tslint:enable
    }

    install(app: BaseApp): void {

        app.middleware('user.load')!.use(this.loadDb);
        app.middleware('user.save')!.use(this.saveDb);
        const loadDb = this.loadDb;
        const saveDb = this.saveDb;

        /**
         * Return the intent at the specified index
         * @deprecated use this.$user.context.prev[index].request.intent instead
         * @param {number} index
         * @return {String}
         */
        User.prototype.getPrevIntent = function (index: number): string | undefined {
            return _get(this.$context, `prev[${index}].request.intent`);
        };

        /**
         * Returns request.state at the specified index
         * @deprecated use this.$user.context.prev[index].request.state instead
         * @param {number} index
         * @return {String}
         */
        User.prototype.getPrevRequestState = function (index: number) {
            return _get(this.$context, `prev[${index}].request.state`);
        };

        /**
         * Returns response.state at the specified index
         * @deprecated use this.$user.context.prev[index].response.state instead
         * @param {number} index
         * @return {String}
         */
        User.prototype.getPrevResponseState = function (index: number) {
            return _get(this.$context, `prev[${index}].response.state`);
        };

        /**
         * Returns the inputs at the specified index
         * @deprecated use this.$user.context.prev[index].request.inputs instead
         * @param {number} index
         * @return {*}
         */
        User.prototype.getPrevInputs = function (index: number) {
            return _get(this.$context, `prev[${index}].request.inputs`);
        };

        /**
         * Returns the timestamp at the specified index
         * @deprecated use this.$user.context.prev[index].request.timestamp instead
         * @param {number} index
         * @return {String|*}
         */
        User.prototype.getPrevTimestamp = function (index: number) {
            return _get(this.$context, `prev[${index}].request.timestamp`);
        };

        /**
         * Returns the speech at the specified index
         * @deprecated use this.$user.context.prev[index].response.speech instead
         * @param {number} index
         * @return {String}
         */
        User.prototype.getPrevSpeech = function (index: number) {
            return _get(this.$context, `prev[${index}].response.speech`);
        };

        /**
         * Returns the reprompt at the specified index
         * @deprecated use this.$user.context.prev[index].request.reprompt instead
         * @param {number} index
         * @return {String}
         */
        User.prototype.getPrevReprompt = function (index: number) {
            return _get(this.$context, `prev[${index}].response.reprompt`);
        };


        /**
         * Explicit user deletion
         * @returns {Promise<void>}
         */
        User.prototype.delete = async function () {
            const userId = this.getId();

            if (typeof userId === 'undefined') {
                throw new Error(`Can't delete user with undefined userId`);
            }

            if (this.jovo.$app!.$db) {
                await this.jovo.$app!.$db.delete(userId);
                this.isDeleted = true;
                Log.verbose(`User with id ${userId} has been deleted.`);
            } else {
                throw new Error('No database configurated.');
            }
        };


        /**
         * Load user from db
         * @returns {Promise<any>}
         */
        User.prototype.loadData = async function () {
            if (!this.jovo) {
                throw new Error('Jovo object is not initialized.');
            }
            return loadDb({
                app: this.jovo.$app,
                host: this.jovo.$host,
                jovo: this.jovo,
            }, true);

        };

        /**
         * Save user to db
         * @returns {Promise<any>}
         */
        User.prototype.saveData = async function () {
            if (!this.jovo) {
                throw new Error('Jovo object is not initialized.');
            }
            return saveDb({
                app: this.jovo.$app,
                host: this.jovo.$host,
                jovo: this.jovo,
            }, true);

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
        Jovo.prototype.repeat = async function () {
            if (_get(this.$user, '$context.prev[0].response.speech')) {
                this.setOutput({ask: _get(this.$user, '$context.prev[0].response')});
            }
        };
    }

    loadDb = async (handleRequest: HandleRequest, force = false) => {
        // no database
        if (!handleRequest.app.$db) {
            return Promise.resolve();
        }

        if (handleRequest.app.$db.needsWriteFileAccess === true && handleRequest.host.hasWriteFileAccess === false) {
            return Promise.resolve();
        }

        if (this.config.implicitSave === false && force === false) {
            return Promise.resolve();
        }
        if (!handleRequest.jovo) {
            throw new JovoError(
                'jovo object is not initialized.',
                ErrorCode.ERR,
                'jovo-framework',
            );
        }

        if (!handleRequest.jovo.$user) {
            throw new JovoError(
                'user object is not initialized',
                ErrorCode.ERR,
                'jovo-framework',
            );
        }
        const userId = handleRequest.jovo.$user.getId();

        if (typeof userId === 'undefined') {
            throw new JovoError(
                `Can't load user with undefined userId`,
                ErrorCode.ERR,
                'jovo-framework',
            );
        }

        const data = await handleRequest.app.$db.load(userId);

        Log.verbose(Log.header('Jovo user (load)', 'framework'));
        Log.yellow().verbose(`this.$user.getId(): ${userId}`);

        if (!data) {
            handleRequest.jovo.$user.isDeleted = false;
        } else {
            handleRequest.jovo.$user.new = false;
        }

        handleRequest.jovo.$user.$data = _get(data, `${this.config.columnName}.data`, {});

        if (this.config.metaData && this.config.metaData.enabled) {
            handleRequest.jovo.$user.$metaData = _get(data, `${this.config.columnName}.metaData`, {});
        }

        if (this.config.context && this.config.context.enabled) {
            handleRequest.jovo.$user.$context = _get(data, `${this.config.columnName}.context`, {});
        }

        // can't parse $user, so we parse object containing its data
        const userData = {
            context: handleRequest.jovo.$user.$context,
            data: handleRequest.jovo.$user.$data,
            metaData: handleRequest.jovo.$user.$metaData,
        };

        this.updateDbLastState(handleRequest, userData);

        Log.yellow().verbose(`this.$user.new = ${handleRequest.jovo.$user.new}`);
        Log.verbose();
        Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$context, null, '\t'));
        Log.yellow().debug('this.$user.$data');
        Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$data, null, '\t'));
        Log.yellow().debug('this.$user.$metaData');
        Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$metaData, null, '\t'));

    };


    saveDb = async (handleRequest: HandleRequest, force = false) => {
        // no database
        if (!handleRequest.app.$db) {
            return Promise.resolve();
        }
        if (handleRequest.app.$db.needsWriteFileAccess === true && handleRequest.host.hasWriteFileAccess === false) {
            return Promise.resolve();
        }
        if (!handleRequest.jovo) {
            throw new JovoError(
                'jovo object is not initialized.',
                ErrorCode.ERR,
                'jovo-framework',
            );
        }
        if (!handleRequest.jovo.$user) {
            throw new JovoError(
                'user object is not initialized',
                ErrorCode.ERR,
                'jovo-framework',
            );
        }
        if (handleRequest.jovo.$user.isDeleted) {
            return Promise.resolve();
        }
        if (this.config.implicitSave === false && force === false) {
            return Promise.resolve();
        }
        const userData: { data?: any, context?: UserContext, metaData?: UserMetaData } = { // tslint:disable-line
            data: _get(handleRequest.jovo.$user, '$data'),
        };

        if (this.config.context &&
            this.config.context.enabled) {
            this.updateContextData(handleRequest);
            userData.context = _get(handleRequest.jovo.$user, '$context');
        }

        if (this.config.metaData &&
            this.config.metaData.enabled) {
            this.updateMetaData(handleRequest);
            userData.metaData = _get(handleRequest.jovo.$user, '$metaData');
        }

        const userId = handleRequest.jovo.$user.getId();

        if (typeof userId === 'undefined') {
            throw new JovoError(
                `Can't save user with undefined userId`,
                ErrorCode.ERR,
                'jovo-framework',
            );
        }

        const updatedAt = this.config.updatedAt ? (new Date()).toISOString() : undefined;

        if (this.config.dataCaching) {
            // only save to db if there were changes made.
            if (!this.userDataIsEqualToLastState(handleRequest, userData)) {
                await handleRequest.app.$db.save(
                    userId,
                    this.config.columnName || 'userData',
                    userData,
                    updatedAt,
                );
            }
        } else {
            await handleRequest.app.$db.save(
                userId,
                this.config.columnName || 'userData',
                userData,
                updatedAt,
            );
        }

        Log.verbose(Log.header('Jovo user: (save) ', 'framework'));
        Log.yellow().verbose(` Saved user: ${userId}`);
        Log.yellow().debug(' this.$user.$context');
        Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$context, null, '\t'));
        Log.yellow().debug(' this.$user.$data');
        Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$data, null, '\t'));
        Log.yellow().debug(' this.$user.$metaData');
        Log.yellow().debug(JSON.stringify(handleRequest.jovo.$user.$metaData, null, '\t'));

    };

    /**
     * Caches the current state of the user data hashed inside the jovo object
     * @param {HandleRequest} handleRequest https://www.jovo.tech/docs/plugins#handlerequest
     * @param {object} data user data
     */
    private updateDbLastState(handleRequest: HandleRequest, data: object) {
        const stringifiedData = JSON.stringify(data);
        const hashedUserData = crypto.createHash('md5').update(stringifiedData).digest('hex');
        handleRequest.jovo!.$user.db_cache_hash = hashedUserData;
    }

    /**
     *
     * @param {HandleRequest} handleRequest https://www.jovo.tech/docs/plugins#handlerequest
     * @param {object} data current user data
     */
    private userDataIsEqualToLastState(handleRequest: HandleRequest, data: object): boolean {
        const stringifiedData = JSON.stringify(data);
        const hashedUserData = crypto.createHash('md5').update(stringifiedData).digest('hex'); // current user data
        const cachedHashedUserData = handleRequest.jovo!.$user.db_cache_hash; // cached user data

        return hashedUserData === cachedHashedUserData;
    }

    private updateMetaData(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            throw new JovoError(
                'jovo object is not initialized.',
                ErrorCode.ERR,
                'jovo-framework',
            );
        }

        if (this.config.metaData!.createdAt) {
            this.updateCreatedAt(handleRequest);
        }

        if (this.config.metaData!.lastUsedAt) {
            this.updateLastUsedAt(handleRequest);
        }

        if (this.config.metaData!.sessionsCount) {
            this.updateSessionsCount(handleRequest);
        }

        if (this.config.metaData!.requestHistorySize! > 0) {
            this.updateRequestHistory(handleRequest);
        }

        if (this.config.metaData!.devices) {
            this.updateDevices(handleRequest);
        }
    }

    /**
     * update $metaData.createdAt
     * @param {HandleRequest} handleRequest
     */
    private updateCreatedAt(handleRequest: HandleRequest) {
        // createdAt should only be set once for each user
        if (!handleRequest.jovo!.$user.$metaData.createdAt) {
            handleRequest.jovo!.$user.$metaData.createdAt = new Date().toISOString();
        }
    }

    /**
     * update $metaData.lastUsedAt
     * @param {HandleRequest} handleRequest
     */
    private updateLastUsedAt(handleRequest: HandleRequest) {
        handleRequest.jovo!.$user.$metaData.lastUsedAt = new Date().toISOString();
    }

    /**
     * update $metaData.sessionsCount
     * @param {HandleRequest} handleRequest
     */
    private updateSessionsCount(handleRequest: HandleRequest) {
        let sessionsCount = handleRequest.jovo!.$user.$metaData.sessionsCount || 0;
        if (handleRequest.jovo!.isNewSession()) {
            sessionsCount += 1;
        }
        handleRequest.jovo!.$user.$metaData.sessionsCount = sessionsCount;
    }

    /**
     * update $metaData.requests
     * @param {HandleRequest} handleRequest
     */
    private updateRequestHistory(handleRequest: HandleRequest) {
        if (!handleRequest.jovo!.$user.$metaData.requests) {
            handleRequest.jovo!.$user.$metaData.requests = {};
        }

        if (!handleRequest.jovo!.$user.$metaData.requests[ handleRequest.jovo!.getHandlerPath() ]) {
            handleRequest.jovo!.$user.$metaData.requests[ handleRequest.jovo!.getHandlerPath() ] = {
                count: 0,
                log: [],
            };
        }

        const requestItem = handleRequest.jovo!.$user.$metaData.requests[ handleRequest.jovo!.getHandlerPath() ];

        requestItem.count += 1;
        requestItem.log.push(new Date().toISOString());

        if (requestItem.log.length > this.config.metaData!.requestHistorySize!) {
            requestItem.log = requestItem.log.slice(1, requestItem.log.length);
        }
    }

    /**
     * update $metaData.devices
     * @param {HandleRequest} handleRequest
     */
    private updateDevices(handleRequest: HandleRequest) {
        if (!handleRequest.jovo!.$user.$metaData.devices) {
            handleRequest.jovo!.$user.$metaData.devices = {};
        }
        if (!handleRequest.jovo!.$user.$metaData.devices[ '' + handleRequest.jovo!.getDeviceId() + '' ]) {
            const device = {
                hasAudioInterface: handleRequest.jovo!.hasAudioInterface(),
                hasScreenInterface: handleRequest.jovo!.hasScreenInterface(),
                hasVideoInterface: handleRequest.jovo!.hasVideoInterface(),
            };
            handleRequest.jovo!.$user.$metaData.devices[ '' + handleRequest.jovo!.getDeviceId() + '' ] = device;
        }
    }

    /**
     * update $user.$context
     * @param {HandleRequest} handleRequest
     */
    private updateContextData(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            throw new JovoError(
                'jovo object is not initialized.',
                ErrorCode.ERR,
                'jovo-framework',
            );
        }

        if (this.config.context!.prev!.size! < 1) {
            return;
        }
        if (!handleRequest.jovo.$user.$context.prev) {
            handleRequest.jovo.$user.$context.prev = [];
        }

        const prevObject: ContextPrevObject = {};

        // initialize response/request object if they will be needed (one of the config values is true)
        // If we don't initialize the other update functions will try to set the values of an undefined object
        // e.g. prevObject.response.speech --> will throw TypeError
        if (Object.values(this.config.context!.prev!.response!).includes(true)) {
            prevObject.response = {};
        }
        if (Object.values(this.config.context!.prev!.request!).includes(true)) {
            prevObject.request = {};
        }

        if (this.config.context!.prev!.response!.speech) {
            this.updatePrevSpeech(handleRequest, prevObject);
        }
        if (this.config.context!.prev!.response!.reprompt) {
            this.updatePrevReprompt(handleRequest, prevObject);
        }
        if (this.config.context!.prev!.response!.state) {
            this.updatePrevResponseState(handleRequest, prevObject);
        }
        if (this.config.context!.prev!.request!.timestamp) {
            this.updatePrevTimestamp(handleRequest, prevObject);
        }
        if (this.config.context!.prev!.request!.state) {
            this.updatePrevRequestState(handleRequest, prevObject);
        }
        if (this.config.context!.prev!.request!.inputs) {
            this.updatePrevInputs(handleRequest, prevObject);
        }
        if (this.config.context!.prev!.request!.intent) {
            this.updatePrevIntent(handleRequest, prevObject);
        }
        if (this.config.context!.prev!.response!.output) {
            this.updatePrevOutput(handleRequest, prevObject);
        }

        if (prevObject.request || prevObject.response) {
            if (handleRequest.jovo.$user.$context.prev) {
                // Prevents storing empty object
                handleRequest.jovo.$user.$context.prev.unshift(prevObject);
                handleRequest.jovo.$user.$context.prev = handleRequest.jovo.$user.$context.prev.slice(0, this.config.context!.prev!.size); // add new prevObject to the beginning
            }
        }
    }

    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevSpeech(handleRequest: HandleRequest, prevObject: ContextPrevObject) {
        if (handleRequest.jovo!.$output.tell) {
            prevObject.response!.speech = handleRequest.jovo!.$output.tell.speech;
        }

        if (handleRequest.jovo!.$output.ask) {
            prevObject.response!.speech = handleRequest.jovo!.$output.ask.speech;
        }
    }

    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevReprompt(handleRequest: HandleRequest, prevObject: ContextPrevObject) {
        if (handleRequest.jovo!.$output.ask) {
            prevObject.response!.reprompt = handleRequest.jovo!.$output.ask.reprompt;
        }
    }

    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevResponseState(handleRequest: HandleRequest, prevObject: ContextPrevObject) {
        if (handleRequest.jovo!.$session &&
            handleRequest.jovo!.$session.$data &&
            handleRequest.jovo!.$session.$data[ SessionConstants.STATE ]) {

            prevObject.response!.state = handleRequest.jovo!.$session.$data[ SessionConstants.STATE ];

        }
    }

    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevTimestamp(handleRequest: HandleRequest, prevObject: ContextPrevObject) {
        prevObject.request!.timestamp = handleRequest.jovo!.$request!.getTimestamp();
    }

    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevRequestState(handleRequest: HandleRequest, prevObject: ContextPrevObject) {
        if (handleRequest.jovo!.$requestSessionAttributes[ SessionConstants.STATE ]) {
            prevObject.request!.state = handleRequest.jovo!.$requestSessionAttributes[ SessionConstants.STATE ];
        }
    }

    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevInputs(handleRequest: HandleRequest, prevObject: ContextPrevObject) {
        if (handleRequest.jovo!.$inputs) {
            prevObject.request!.inputs = handleRequest.jovo!.$inputs;
        }
    }

    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevIntent(handleRequest: HandleRequest, prevObject: ContextPrevObject) {
        prevObject.request!.intent = handleRequest.jovo!.$plugins.Router.route.path;
        if (handleRequest.jovo!.$type!.type === EnumRequestType.INTENT) {
            prevObject.request!.intent = handleRequest.jovo!.$plugins.Router.route.intent;
        }
    }

    /**
     * @param {HandleRequest} handleRequest
     * @param {ContextPrevObject} prevObject
     */
    private updatePrevOutput(handleRequest: HandleRequest, prevObject: ContextPrevObject) {
        if (handleRequest.jovo!.$output) {
            prevObject.response!.output = handleRequest.jovo!.$output;
        }
    }

}
