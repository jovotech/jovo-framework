import {BaseApp, Output, EnumRequestType, HandleRequest, Inputs, Jovo, Plugin, PluginConfig, User, SessionConstants} from "jovo-core";
import _merge = require('lodash.merge');
import _get = require('lodash.get');
import _set = require('lodash.set');
export interface Config extends PluginConfig {
    columnName?: string;
    implicitSave?: boolean;
    metaData?: MetaDataConfig;
    context?: ContextConfig;
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
        speech?: string;
        reprompt?: string | string[];
        state?: string;
        output?: Output;
    };
}

export interface UserMetaData {
    lastUsedAt?: string;
    sessionsCount?: number;
    createdAt?: string;
    requests?: any; // tslint:disable-line
}

export class JovoUser implements Plugin {

    config: Config = {
        columnName: 'userData',
        implicitSave: true,
        metaData: {
            enabled: false,
            lastUsedAt: true,
            sessionsCount: true,
            createdAt: true,
            requestHistorySize: 4,
            devices: true,
        },
        context: {
            enabled: false,
            prev: {
                size: 1,
                request: {
                    intent: true,
                    state: true,
                    inputs: true,
                    timestamp: true,
                },
                response: {
                    speech: true,
                    reprompt: true,
                    state: true,
                    output: true,
                },
            },
        },
    };

    constructor(config?: Config) {

        if (config) {
            this.config = _merge(this.config, config);
        }
        this.loadDb = this.loadDb.bind(this);
        this.saveDb = this.saveDb.bind(this);
    }

    install(app: BaseApp): void {

        app.middleware('user.load')!.use(this.loadDb);
        app.middleware('user.save')!.use(this.saveDb);

        const loadDb = this.loadDb;
        const saveDb = this.saveDb;
        User.prototype.$context = {};
        User.prototype.$data = {};
        User.prototype.$metaData = {};

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
        User.prototype.getPrevRequestState = function(index: number) {
            return _get(this.$context, `prev[${index}].request.state`);
        };

        /**
         * Returns response.state at the specified index
         * @deprecated use this.$user.context.prev[index].response.state instead
         * @param {number} index
         * @return {String}
         */
        User.prototype.getPrevResponseState = function(index: number) {
            return _get(this.$context, `prev[${index}].response.state`);
        };

        /**
         * Returns the inputs at the specified index
         * @deprecated use this.$user.context.prev[index].request.inputs instead
         * @param {number} index
         * @return {*}
         */
        User.prototype.getPrevInputs = function(index: number) {
            return _get(this.$context, `prev[${index}].request.inputs`);
        };

        /**
         * Returns the timestamp at the specified index
         * @deprecated use this.$user.context.prev[index].request.timestamp instead
         * @param {number} index
         * @return {String|*}
         */
        User.prototype.getPrevTimestamp = function(index: number) {
            return _get(this.$context, `prev[${index}].request.timestamp`);
        };

        /**
         * Returns the speech at the specified index
         * @deprecated use this.$user.context.prev[index].response.speech instead
         * @param {number} index
         * @return {String}
         */
        User.prototype.getPrevSpeech = function(index: number) {
            return _get(this.$context, `prev[${index}].response.speech`);
        };

        /**
         * Returns the reprompt at the specified index
         * @deprecated use this.$user.context.prev[index].request.reprompt instead
         * @param {number} index
         * @return {String}
         */
        User.prototype.getPrevReprompt = function(index: number) {
            return _get(this.$context, `prev[${index}].response.reprompt`);
        };


        User.prototype.delete = async function() {
            if (this.jovo.$app!.$db) {
                await this.jovo.$app!.$db.delete(this.getId());
                this.isDeleted = true;
            } else {
                throw new Error('No database configurated.');
            }
        };

        User.prototype.loadData = async function() {
            if (!this.jovo) {
                throw new Error('Jovo object is not initialized.');
            }
            return await loadDb({
                jovo: this.jovo,
                host: this.jovo.$host,
                app: this.jovo.$app
            }, true);

        };
        User.prototype.saveData = async function() {
            if (!this.jovo) {
                throw new Error('Jovo object is not initialized.');
            }
            return await saveDb({
                jovo: this.jovo,
                host: this.jovo.$host,
                app: this.jovo.$app
            }, true);

        };

        Jovo.prototype.repeat = async function() {
            if (_get(this.$user, '$context.prev[0].response.output')) {
                this.output(_get(this.$user, '$context.prev[0].response.output'));
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
            throw new Error('Jovo object is not initialized.');
        }

        if (!handleRequest.jovo.$user) {
            throw new Error('User object is not initialized');
        }

        const data = await handleRequest.app.$db.load(handleRequest.jovo.$user.getId());
        if (!data) {
            Object.assign(handleRequest.jovo.$user, {
                $context: {},
                $data: {},
                $metaData: {},
                isDeleted: false,
            });
        } else {
            handleRequest.jovo.$user.new = false;
            _set(handleRequest.jovo.$user, '$data',
                _get(data, `${this.config.columnName}.data`, {}));
            _set(handleRequest.jovo.$user, '$metaData',
                _get(data, `${this.config.columnName}.metaData`, {}));
            _set(handleRequest.jovo.$user, '$context',
                _get(data, `${this.config.columnName}.context`, {}));
        }
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
            throw new Error('Jovo object is not initialized.');
        }
        if (!handleRequest.jovo.$user) {
            throw new Error('User object is not initialized');
        }
        if(handleRequest.jovo.$user.isDeleted) {
            return Promise.resolve();
        }
        if (this.config.implicitSave === false && force === false) {
            return Promise.resolve();
        }
        const userData: {data?: any, context?: UserContext, metaData?: UserMetaData} =  { // tslint:disable-line
            data: _get(handleRequest.jovo.$user, '$data')
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

        await handleRequest.app.$db.save(
            handleRequest.jovo.$user.getId(),
            this.config.columnName || 'userData',
            userData);
    };

    private updateMetaData(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            throw new Error('Jovo object is not initialized.');
        }

        if (!handleRequest.jovo.$user) {
            throw new Error('User object is not initialized');
        }
        if (_get(this.config, 'metaData.createdAt')) {
            if (!_get(handleRequest.jovo.$user, '$metaData.createdAt')) {
                _set(handleRequest.jovo.$user, '$metaData.createdAt', new Date().toISOString());
            }
        }

        if (_get(this.config, 'metaData.lastUsedAt')) {
            _set(handleRequest.jovo.$user, '$metaData.lastUsedAt', new Date().toISOString());
        }

        if (_get(this.config, 'metaData.sessionsCount')) {
            let sessionsCount = _get(handleRequest.jovo.$user, '$metaData.sessionsCount') || 0;
            if (handleRequest.jovo.isNewSession()) {
                sessionsCount += 1;
            }
            _set(handleRequest.jovo.$user, '$metaData.sessionsCount', sessionsCount);
        }

        if (_get(this.config, 'metaData.requestHistorySize') > 0) {
            if (!handleRequest.jovo.$user.$metaData.requests) {
                handleRequest.jovo.$user.$metaData.requests = {};
            }

            if (!handleRequest.jovo.$user.$metaData.requests[handleRequest.jovo.getHandlerPath()]) {
                handleRequest.jovo.$user.$metaData.requests[handleRequest.jovo.getHandlerPath()] = {
                    count: 0,
                    log: [],
                };
            }

            // const requestItem = _get(handleRequest.jovo.$user,`metaData.requests.${handleRequest.jovo.getHandlerPath()}`);
            const requestItem = handleRequest.jovo.$user.$metaData.requests[handleRequest.jovo.getHandlerPath()];

            requestItem.count += 1;
            requestItem.log.push(new Date().toISOString());

            if (requestItem.log.length > _get(this.config, 'metaData.requestHistorySize')) {
                requestItem.log = requestItem.log.slice(1, requestItem.log.length);
            }
        }

        if (_get(this.config, 'metaData.devices')) {
            if (!_get(handleRequest.jovo.$user, '$metadata.devices["'+handleRequest.jovo.getDeviceId()+'"]')) {
                const device = {
                    hasAudioInterface: handleRequest.jovo.hasAudioInterface(),
                    hasScreenInterface: handleRequest.jovo.hasScreenInterface(),
                    hasVideoInterface: handleRequest.jovo.hasVideoInterface(),
                };
                _set(handleRequest.jovo.$user,
                    '$metaData.devices["'+handleRequest.jovo.getDeviceId()+'"]',
                    device);
            }
        }
    }

    private updateContextData(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            throw new Error('Jovo object is not initialized.');
        }
        if (!handleRequest.jovo.$user) {
            throw new Error('User object is not initialized');
        }
        if (_get(this.config, 'context.prev.size') < 1) {
            return;
        }
        if (!_get(handleRequest.jovo.$user, '$context.prev')) {
            _set(handleRequest.jovo.$user, '$context.prev', []);
        }


        if (_get(this.config, 'metaData.createdAt')) {
            if (!_get(handleRequest.jovo.$user, '$metaData.createdAt')) {
                _set(handleRequest.jovo.$user, '$metaData.createdAt', new Date().toISOString());
            }
        }
        const prevObject: ContextPrevObject = {};

        if (_get(this.config, 'context.prev.response.speech')) {
            if (handleRequest.jovo.getSpeechText()) {
                _set(prevObject, 'response.speech', handleRequest.jovo.getSpeechText());
            }
        }
        if (_get(this.config, 'context.prev.response.reprompt')) {
            if (handleRequest.jovo.getRepromptText()) {
                _set(prevObject, 'response.reprompt', handleRequest.jovo.getRepromptText());
            }
        }

        if (_get(this.config, 'context.prev.response.state')) {
                // prevObject.response.state = handleRequest.jovo.getState();
            if (handleRequest.jovo.$session &&
                handleRequest.jovo.$session.$data &&
                handleRequest.jovo.$session.$data[SessionConstants.STATE]) {
                _set(prevObject, 'response.state', handleRequest.jovo.$session.$data[SessionConstants.STATE]);

            }
        }

        if (_get(this.config, 'context.prev.request.timestamp')) {
            _set(prevObject, 'request.timestamp', handleRequest.jovo.$request!.getTimestamp());
        }
        if (_get(this.config, 'context.prev.request.state')) {
            if (_get(handleRequest.jovo.$requestSessionAttributes, SessionConstants.STATE)) {
                _set(prevObject, 'request.state', handleRequest.jovo.$requestSessionAttributes[SessionConstants.STATE]);
            }
        }

        if (_get(this.config, 'context.prev.request.inputs')) {
            if (handleRequest.jovo.$inputs) {
                _set(prevObject, 'request.inputs', handleRequest.jovo.$inputs);
            }
        }

        if (_get(this.config, 'context.prev.request.intent')) {
            if (handleRequest.jovo.$type!.type === EnumRequestType.INTENT) {
                _set(prevObject, 'request.intent', handleRequest.jovo.$plugins.Router.route.intent);
            } else {
                _set(prevObject, 'request.intent', handleRequest.jovo.$plugins.Router.route.path);
            }
        }
        if (_get(this.config, 'context.prev.response.output')) {
            if (handleRequest.jovo.$output) {
                _set(prevObject, 'response.output', handleRequest.jovo.$output);
            }
        }
        if (_get(prevObject, 'request') || _get(prevObject, 'response')) {
            if (handleRequest.jovo.$user.$context.prev) {
                // Prevents storing empty object
                handleRequest.jovo.$user.$context.prev.unshift(prevObject);
                handleRequest.jovo.$user.$context.prev = handleRequest.jovo.$user.$context.prev.slice(0, _get(this.config, 'context.prev.size')); // add new prevObject to the beginning
            }
        }
    }
    uninstall(app: BaseApp) {

    }
}
