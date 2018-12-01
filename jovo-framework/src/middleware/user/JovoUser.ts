import {BaseApp, Output, EnumRequestType, HandleRequest, Inputs, Jovo, Plugin, PluginConfig, User, SessionConstants} from "jovo-core";
import * as _ from "lodash";
export interface Config extends PluginConfig {
    columnName?: string;
    implicitSave?: boolean;
    userMetaData?: {
        enabled?: boolean;
        lastUsedAt?: boolean,
        sessionsCount?: boolean,
        createdAt?: boolean,
        requestHistorySize?: number,
        devices?: boolean,
    };
    userContext?: {
        enabled?: boolean;
        prev?: {
            size?: number,
            request?: {
                intent?: boolean,
                state?: boolean,
                inputs?: boolean,
                timestamp?: boolean,
            },
            response?: {
                speech?: boolean,
                reprompt?: boolean,
                state?: boolean,
                output?: boolean,
            },
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
        userMetaData: {
            enabled: true,
            lastUsedAt: true,
            sessionsCount: true,
            createdAt: true,
            requestHistorySize: 4,
            devices: true,
        },
        userContext: {
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
            this.config = _.merge(this.config, config);
        }
    }

    install(app: BaseApp): void {
        app.middleware('initialize.user')!.use(this.loadDb.bind(this));
        app.middleware('finalize.user')!.use(this.saveDb.bind(this));

        const loadDb = this.loadDb.bind(this);
        const saveDb = this.saveDb.bind(this);
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
            return _.get(this.$context, `prev[${index}].request.intent`);
        };

        /**
         * Returns request.state at the specified index
         * @deprecated use this.$user.context.prev[index].request.state instead
         * @param {number} index
         * @return {String}
         */
        User.prototype.getPrevRequestState = function(index: number) {
            return _.get(this.$context, `prev[${index}].request.state`);
        };

        /**
         * Returns response.state at the specified index
         * @deprecated use this.$user.context.prev[index].response.state instead
         * @param {number} index
         * @return {String}
         */
        User.prototype.getPrevResponseState = function(index: number) {
            return _.get(this.$context, `prev[${index}].response.state`);
        };

        /**
         * Returns the inputs at the specified index
         * @deprecated use this.$user.context.prev[index].request.inputs instead
         * @param {number} index
         * @return {*}
         */
        User.prototype.getPrevInputs = function(index: number) {
            return _.get(this.$context, `prev[${index}].request.inputs`);
        };

        /**
         * Returns the timestamp at the specified index
         * @deprecated use this.$user.context.prev[index].request.timestamp instead
         * @param {number} index
         * @return {String|*}
         */
        User.prototype.getPrevTimestamp = function(index: number) {
            return _.get(this.$context, `prev[${index}].request.timestamp`);
        };

        /**
         * Returns the speech at the specified index
         * @deprecated use this.$user.context.prev[index].response.speech instead
         * @param {number} index
         * @return {String}
         */
        User.prototype.getPrevSpeech = function(index: number) {
            return _.get(this.$context, `prev[${index}].response.speech`);
        };

        /**
         * Returns the reprompt at the specified index
         * @deprecated use this.$user.context.prev[index].request.reprompt instead
         * @param {number} index
         * @return {String}
         */
        User.prototype.getPrevReprompt = function(index: number) {
            return _.get(this.$context, `prev[${index}].response.reprompt`);
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
            if (_.get(this.$user, 'context.prev[0].response.output')) {
                this.output(_.get(this.$user, 'context.prev[0].response.output'));
            }
        };
    }
    uninstall(app: BaseApp) {

    }
    async loadDb(handleRequest: HandleRequest, force = false) {
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
            _.set(handleRequest.jovo.$user, '$data',
                _.get(data, `${this.config.columnName}.data`, {}));
            _.set(handleRequest.jovo.$user, '$metaData',
                _.get(data, `${this.config.columnName}.metaData`, {}));
            _.set(handleRequest.jovo.$user, '$context',
                _.get(data, `${this.config.columnName}.context`, {}));
        }
    }

    async saveDb(handleRequest: HandleRequest, force = false) {
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
            data: _.get(handleRequest.jovo.$user, '$data')
        };

        if (this.config.userMetaData && this.config.userMetaData.enabled) {
            this.updateMetaData(handleRequest);
            userData.metaData = _.get(handleRequest.jovo.$user, '$metaData');
        }

        if (this.config.userContext && this.config.userContext.enabled) {
            this.updateContextData(handleRequest);
            userData.context = _.get(handleRequest.jovo.$user, '$context');
        }

        await handleRequest.app.$db.save(
            handleRequest.jovo.$user.getId(),
            this.config.columnName || 'userData',
            userData);
    }

    private updateMetaData(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            throw new Error('Jovo object is not initialized.');
        }

        if (!handleRequest.jovo.$user) {
            throw new Error('User object is not initialized');
        }
        if (_.get(this.config, 'userMetaData.createdAt')) {
            if (!_.get(handleRequest.jovo.$user, '$metaData.createdAt')) {
                _.set(handleRequest.jovo.$user, '$metaData.createdAt', new Date().toISOString());
            }
        }

        if (_.get(this.config, 'userMetaData.lastUsedAt')) {
            _.set(handleRequest.jovo.$user, '$metaData.lastUsedAt', new Date().toISOString());
        }

        if (_.get(this.config, 'userMetaData.sessionsCount')) {
            let sessionsCount = _.get(handleRequest.jovo.$user, '$metaData.sessionsCount') || 0;
            if (handleRequest.jovo.isNewSession()) {
                sessionsCount += 1;
            }
            _.set(handleRequest.jovo.$user, '$metaData.sessionsCount', sessionsCount);
        }

        if (_.get(this.config, 'userMetaData.requestHistorySize') > 0) {
            if (!handleRequest.jovo.$user.$metaData.requests) {
                handleRequest.jovo.$user.$metaData.requests = {};
            }

            if (!handleRequest.jovo.$user.$metaData.requests[handleRequest.jovo.getHandlerPath()]) {
                handleRequest.jovo.$user.$metaData.requests[handleRequest.jovo.getHandlerPath()] = {
                    count: 0,
                    log: [],
                };
            }

            // const requestItem = _.get(handleRequest.jovo.$user,`metaData.requests.${handleRequest.jovo.getHandlerPath()}`);
            const requestItem = handleRequest.jovo.$user.$metaData.requests[handleRequest.jovo.getHandlerPath()];

            requestItem.count += 1;
            requestItem.log.push(new Date().toISOString());

            if (requestItem.log.length > _.get(this.config, 'userMetaData.requestHistorySize')) {
                requestItem.log = requestItem.log.slice(1, requestItem.log.length);
            }
        }

        if (_.get(this.config, 'userMetaData.devices')) {
            if (!_.get(handleRequest.jovo.$user, '$metadata.devices["'+handleRequest.jovo.getDeviceId()+'"]')) {
                const device = {
                    hasAudioInterface: handleRequest.jovo.hasAudioInterface(),
                    hasScreenInterface: handleRequest.jovo.hasScreenInterface(),
                    hasVideoInterface: handleRequest.jovo.hasVideoInterface(),
                };
                _.set(handleRequest.jovo.$user,
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
        if (_.get(this.config, 'userContext.prev.size') < 1) {
            return;
        }
        if (!_.get(handleRequest.jovo.$user, '$context.prev')) {
            _.set(handleRequest.jovo.$user, '$context.prev', []);
        }


        if (_.get(this.config, 'userMetaData.createdAt')) {
            if (!_.get(handleRequest.jovo.$user, '$metaData.createdAt')) {
                _.set(handleRequest.jovo.$user, '$metaData.createdAt', new Date().toISOString());
            }
        }
        const prevObject: ContextPrevObject = {};

        if (_.get(this.config, 'userContext.prev.response.speech')) {
            if (handleRequest.jovo.getSpeechText()) {
                _.set(prevObject, 'response.speech', handleRequest.jovo.getSpeechText());
            }
        }
        if (_.get(this.config, 'userContext.prev.response.reprompt')) {
            if (handleRequest.jovo.getRepromptText()) {
                _.set(prevObject, 'response.reprompt', handleRequest.jovo.getRepromptText());
            }
        }

        if (_.get(this.config, 'userContext.prev.response.state')) {
                // prevObject.response.state = handleRequest.jovo.getState();
            if (handleRequest.jovo.$session &&
                handleRequest.jovo.$session.$data &&
                handleRequest.jovo.$session.$data[SessionConstants.STATE]) {
                _.set(prevObject, 'response.state', handleRequest.jovo.$session.$data[SessionConstants.STATE]);

            }
        }

        if (_.get(this.config, 'userContext.prev.request.timestamp')) {
            _.set(prevObject, 'request.timestamp', handleRequest.jovo.$request!.getTimestamp());
        }
        if (_.get(this.config, 'userContext.prev.request.state')) {
            if (_.get(handleRequest.jovo.$requestSessionAttributes, SessionConstants.STATE)) {
                _.set(prevObject, 'request.state', handleRequest.jovo.$requestSessionAttributes[SessionConstants.STATE]);
            }
        }

        if (_.get(this.config, 'userContext.prev.request.inputs')) {
            if (handleRequest.jovo.$inputs) {
                _.set(prevObject, 'request.inputs', handleRequest.jovo.$inputs);
            }
        }

        if (_.get(this.config, 'userContext.prev.request.intent')) {
            if (handleRequest.jovo.$type!.type === EnumRequestType.INTENT) {
                _.set(prevObject, 'request.intent', handleRequest.jovo.$plugins.Router.route.intent);
            } else {
                _.set(prevObject, 'request.intent', handleRequest.jovo.$plugins.Router.route.path);
            }
        }
        if (_.get(this.config, 'userContext.prev.response.output')) {
            if (handleRequest.jovo.$output) {
                _.set(prevObject, 'request.output', handleRequest.jovo.$output);
            }
        }
        if (_.get(prevObject, 'request') || _.get(prevObject, 'response')) {
            if (handleRequest.jovo.$user.$context.prev) {
                // Prevents storing empty object
                handleRequest.jovo.$user.$context.prev.unshift(prevObject);
                handleRequest.jovo.$user.$context.prev = handleRequest.jovo.$user.$context.prev.slice(0, _.get(this.config, 'userContext.prev.size')); // add new prevObject to the beginning
            }
        }
    }

}
