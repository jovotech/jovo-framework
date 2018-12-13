import {AppConfig, Jovo, Plugin, Inputs, EnumRequestType, HandleRequest} from "jovo-core";
import _get = require('lodash.get');
import {BaseApp} from 'jovo-core';
import {Route, Router} from "./Router";

export class Handler implements Plugin {
    install(app: BaseApp) {
        app.middleware('handler')!.use(this.handle);
        app.middleware('fail')!.use(this.error);

        this.mixin(app);
    }
    uninstall(app: BaseApp) {

    }
    async handle(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            throw new Error(`Couldn't access jovo object`);
        }
        handleRequest.jovo.mapInputs(handleRequest.app.config.inputMap || {});
        const route = handleRequest.jovo.$plugins.Router.route;
        await Handler.handleOnNewUser(handleRequest.jovo, handleRequest.app.config as AppConfig);
        await Handler.handleOnNewSession(handleRequest.jovo, handleRequest.app.config as AppConfig);
        await Handler.handleOnRequest(handleRequest.jovo, handleRequest.app.config as AppConfig);
        await Handler.applyHandle(handleRequest.jovo, route, handleRequest.app.config as AppConfig);
    }

    /**
     * Calls 'NEW_USER' if the current user is not in the database
     * @param {Jovo} jovo
     * @param {Config} config
     * @return {any}
     */
    static handleOnNewUser(jovo: Jovo, config: AppConfig) {
        if (!jovo.$user || !jovo.$user.isNew()) {
            return Promise.resolve();
        }
        return Handler.handleOnPromise(jovo, _get(config.handlers, EnumRequestType.NEW_USER));
    }

    /**
     * Calls 'ON_REQUEST' on every request
     * @param {Jovo} jovo
     * @param {Config} config
     * @returns {Promise<any>}
     */
    static handleOnRequest(jovo: Jovo, config: AppConfig) {
        return Handler.handleOnPromise(jovo, _get(config.handlers, EnumRequestType.ON_REQUEST));
    }

    /**
     * Calls 'NEW_SESSION' if the session is new
     * @param {Jovo} jovo
     * @param {Config} config
     * @return {any}
     */
    static handleOnNewSession(jovo: Jovo, config: AppConfig) {
        if (!jovo.isNewSession()) {
            return Promise.resolve();
        }
        return Handler.handleOnPromise(jovo, _get(config.handlers, EnumRequestType.NEW_SESSION));
    }

    /**
     * Allows execute logic synchronously and asynchronously
     * Returns Promise when the code inside of the handler is synchronous,
     * executed with a callback function or a promise.
     * @param {Jovo} jovo
     * @param {Function} func
     * @return {Promise<any>}
     */
    static handleOnPromise(jovo: Jovo, func: Function) {
        return new Promise ((resolve) => {

            // resolve if toIntent was triggered before
            if (jovo && jovo.triggeredToIntent) {
                return resolve();
            }

            // resolve if there is no ON_REQUEST in the handler
            if (!func) {
                return resolve();
            }
            const params = getParamNames(func);

            // no callback 'done' parameter
            if (params.length === 0) {
                const result = func.apply(jovo);

                if (!result) {
                    return resolve();
                } else {
                    return result.then(resolve);
                }
            }

            const callback = () => {
                resolve();
            };
            return func.apply(jovo, [callback]);
        });
    }

    /**
     * Calls the function given in the path.
     * Skips execution when toIntent or toStateIntent are called before.
     *
     * @param {Jovo} jovo
     * @param route
     * @param {Config} config
     * @param {boolean} fromIntent
     * @return {Promise<any>}
     */
    static async applyHandle(jovo: Jovo, route: Route, config: AppConfig, fromIntent?: boolean) {

        // resolve if toIntent was triggered before
        if (jovo && jovo.triggeredToIntent && !fromIntent) {
            return Promise.resolve();
        }
        if (!route || typeof route.type === 'undefined') {
            route = {
                type: EnumRequestType.UNHANDLED,
                path: EnumRequestType.UNHANDLED,
            };
        }

        // end session when type === END and no END handler defined
        if ((route.type === EnumRequestType.END || // RequestType is END
            route.type === EnumRequestType.INTENT && // Mapped Intent to END
            route.intent === EnumRequestType.END) &&
            !_get(config.handlers, route.path)) {
            return Promise.resolve();
        }

        if (route.type === EnumRequestType.AUDIOPLAYER && !_get(config.handlers, route.path)) {
            // @deprecated
            // TODO: Test me
            const v1AudioPlayerPath = route.path.replace('AlexaSkill', 'AudioPlayer');
            if (_get(config.handlers, v1AudioPlayerPath)) {
                route.path = v1AudioPlayerPath;
                console.log('AudioPlayer.* is deprecated since v2. Please use AlexaSkill.*');
            } else {
                return Promise.resolve();
            }
        }

        // // throw error if no handler and no UNHANDLED on same level
        if (!_get(config.handlers, route.path)) {
            return Promise.reject(
                new Error(`Could not find the route "${route.path}" in your handler function.`)); // eslint-disable-line
        }
        Object.assign(Jovo.prototype, _get(config, 'handlers'));
        return await _get(config.handlers, route.path).apply(jovo, [jovo]);
    }

    async error(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            throw new Error(`Could't access jovo object`);
        }
        if (_get((handleRequest.app.config as AppConfig).handlers, EnumRequestType.ON_ERROR)) {
            const route = {
                type: EnumRequestType.ON_ERROR,
                path: EnumRequestType.ON_ERROR,
            };

            await Handler.applyHandle(handleRequest.jovo, route, handleRequest.app.config as AppConfig, true);
            await handleRequest.app.middleware('output')!.run(handleRequest);
            await handleRequest.app.middleware('response')!.run(handleRequest);
        }
    }

    mixin(app: BaseApp) {

        BaseApp.prototype.setHandler = function (...handlers: any[]): BaseApp { // tslint:disable-line
            for (const obj of handlers) { // eslint-disable-line
                if (typeof obj !== 'object') {
                    throw new Error('Handler must be of type object.');
                }
                (this.config as AppConfig).handlers = Object.assign((this.config as AppConfig).handlers || {}, obj);
            }
            return this;
        };

        Jovo.prototype.triggeredToIntent = false;

        Jovo.prototype.toIntent = async function (intent: string) {
            this.triggeredToIntent = true;

            const route = Router.intentRoute(
                this.$app!.config,
                this.getState(),
                intent
            );
            return await Handler.applyHandle(this, route, this.$app!.config, true);
        };


        Jovo.prototype.toStateIntent = async function(state: string | undefined, intent: string) {
            this.triggeredToIntent = true;
            this.setState(state);
            const route = Router.intentRoute(
                this.$app!.config,
                state,
                intent
            );
            return await Handler.applyHandle(this, route, this.$app!.config, true);
        };

        Jovo.prototype.toStatelessIntent = async function (intent: string) {
            this.triggeredToIntent = true;
            this.removeState();
            return this.toStateIntent(undefined, intent);
        };

        /**
         * Adds state to session attributes
         * @param {string} state
         * @return {Jovo}
         */
        Jovo.prototype.followUpState = function (state: string) {
            return this.setState(state);
        };

        Jovo.prototype.getHandlerPath = function (): string {
            if (!this.$type || !this.$type.type) {
                return 'No type';
            }

            let path: string = this.$type.type;
            const route = this.$plugins.Router.route;

            if (this.$type.type === EnumRequestType.END &&
                this.$type.subType) {
                path += `: ${this.$type.subType}`;
            }

            if (this.$type.type === EnumRequestType.INTENT) {
                path = route.intent;
            }

            if (route.state) {
                path = `${route.state}: ${path}`;
            }
            return path;
        };

    }


}

function getParamNames(func: Function) {
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    const ARGUMENT_NAMES = /([^\s,]+)/g;
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) {
        result = [];
    }
    return result;
}
