import {Jovo, Plugin, Inputs, EnumRequestType, HandleRequest} from "jovo-core";
import _get = require('lodash.get');
import {BaseApp} from 'jovo-core';
import {Route, Router} from "./Router";
import {Config as AppConfig} from './../App';

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
            if (params.length < 2) {
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
            return func.apply(jovo, [jovo, callback]);
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
        // return new Promise((resolve, reject) => {


        // resolve if toIntent was triggered before
        if (jovo && jovo.triggeredToIntent && !fromIntent) {
            return;
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
            return;
        }

        if (route.type === EnumRequestType.AUDIOPLAYER && !_get(config.handlers, route.path)) {
            // @deprecated
            // TODO: Test me
            const v1AudioPlayerPath = route.path.replace('AlexaSkill', 'AudioPlayer');
            if (_get(config.handlers, v1AudioPlayerPath)) {
                route.path = v1AudioPlayerPath;
                console.log('AudioPlayer.* is deprecated since v2. Please use AlexaSkill.*');
            } else {
                return;
            }
        }

        // // throw error if no handler and no UNHANDLED on same level
        if (
            !(
            _get(config.handlers, EnumRequestType.NEW_SESSION) ||
            _get(config.handlers, EnumRequestType.NEW_USER) ||
            _get(config.handlers, EnumRequestType.ON_REQUEST)
            ) &&

            !_get(config.handlers, route.path)) {
            throw new Error(`Could not find the route "${route.path}" in your handler function.`);
        }
        Object.assign(Jovo.prototype, _get(config, 'handlers'));

        if (_get(config.handlers, route.path)) {
            const func:Function = _get(config.handlers, route.path);
            const params = getParamNames(func);

            // no callback 'done' parameter
            if (params.length < 2) {
                const result = await func.apply(jovo, [jovo]);
                if (typeof result === 'undefined') {
                    return;
                }
                else if (result.constructor.name === 'Promise') {
                    return await result;
                }
                else {
                    return;
                }
            } else {
                return new Promise((resolve) => {
                    func.apply(jovo, [jovo, resolve]);
                });
            }
        }

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


        /**
         * Jumps to an intent in the order state > global > unhandled > error
         * @public
         * @param {string} intent name of intent
         */
        Jovo.prototype.toIntent = async function (intent: string): Promise<any> { // tslint:disable-line
            this.triggeredToIntent = true;

            const route = Router.intentRoute(
                this.$app!.config,
                this.getState(),
                intent
            );
            return await Handler.applyHandle(this, route, this.$app!.config, true);
        };


        /**
         * Jumps to state intent in the order state > unhandled > error
         * @public
         * @param {string} state name of state
         * @param {string} intent name of intent
         */
        Jovo.prototype.toStateIntent = async function(state: string | undefined, intent: string): Promise<any> { // tslint:disable-line
            this.triggeredToIntent = true;
            this.setState(state);
            const route = Router.intentRoute(
                this.$app!.config,
                state,
                intent
            );
            return await Handler.applyHandle(this, route, this.$app!.config, true);
        };


        /**
         * Jumps from the inside of a state to a global intent
         * @public
         * @param {string} intent name of intent
         */
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


        /**
         * Returns path to function inside the handler
         * Examples
         * LAUNCH = Launch function
         * State1:IntentA => IntentA in state 'State1'
         * @public
         * @return {string}
         */
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
