import {Jovo, Plugin, Inputs, EnumRequestType, HandleRequest, BaseApp, Log, JovoError, SessionConstants, ErrorCode} from "jovo-core";
import _get = require('lodash.get');
import {Route, Router} from "./Router";
import {Config as AppConfig} from './../App';

export class Handler implements Plugin {
    install(app: BaseApp) {
        app.middleware('before.router')!.use( (handleRequest: HandleRequest) => {
            if (!handleRequest.jovo) {
                return;
            }
            handleRequest.jovo.$handlers = Object.assign({}, (handleRequest.app.config as AppConfig).handlers);

            const platform = handleRequest.jovo.getPlatformType();
            if (handleRequest.app.config.plugin[platform] &&
                handleRequest.app.config.plugin[platform].handlers) {
                const platformHandlers = Object.assign({}, handleRequest.app.config.plugin[platform].handlers);
                Object.assign(handleRequest.jovo.$handlers, platformHandlers);
            }
        });
        app.middleware('handler')!.use(this.handle);
        app.middleware('fail')!.use(this.error);

        this.mixin(app);
    }
    uninstall(app: BaseApp) {

    }
    async handle(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            return;
        }

        Log.verbose(Log.header('Jovo handler ', 'framework'));

        handleRequest.jovo.mapInputs(handleRequest.app.config.inputMap || {});
        const route = handleRequest.jovo.$plugins.Router.route;



        await Handler.handleOnNewUser(handleRequest.jovo);
        await Handler.handleOnNewSession(handleRequest.jovo);
        await Handler.handleOnRequest(handleRequest.jovo);
        Log.verbose(Log.header('Handle ', 'framework'));
        Log.yellow().verbose(route);
        await Handler.applyHandle(handleRequest.jovo, route);

    }

    /**
     * Calls 'NEW_USER' if the current user is not in the database
     * @param {Jovo} jovo
     * @return {any}
     */
    static async handleOnNewUser(jovo: Jovo) {
        if (!jovo.$user || !jovo.$user.isNew()) {
            return Promise.resolve();
        }
        Log.verbose(Log.subheader('NEW_USER'));

        Log.verboseStart(' NEW_USER');
        await Handler.handleOnPromise(jovo, _get(jovo.$handlers, EnumRequestType.NEW_USER));
        Log.verbose();
        Log.verboseEnd(' NEW_USER');
        Log.verbose();

    }

    /**
     * Calls 'ON_REQUEST' on every request
     * @param {Jovo} jovo
     * @returns {Promise<any>}
     */
    static async handleOnRequest(jovo: Jovo) {

        Log.verbose(Log.subheader('ON_REQUEST'));
        Log.verboseStart(' ON_REQUEST');
        await Handler.handleOnPromise(jovo, _get(jovo.$handlers, EnumRequestType.ON_REQUEST));
        Log.verbose();
        Log.verboseEnd(' ON_REQUEST');
        Log.verbose();

    }

    /**
     * Calls 'NEW_SESSION' if the session is new
     * @param {Jovo} jovo
     * @return {any}
     */
    static async handleOnNewSession(jovo: Jovo) {
        if (!jovo.isNewSession()) {
            return Promise.resolve();
        }

        Log.verbose(Log.subheader('NEW_SESSION'));
        Log.verboseStart(' NEW_SESSION');
        await Handler.handleOnPromise(jovo, _get(jovo.$handlers, EnumRequestType.NEW_SESSION));
        Log.verbose();
        Log.verboseEnd(' NEW_SESSION');
        Log.verbose();

    }

    /**
     * Allows execute logic synchronously and asynchronously
     * Returns Promise when the code inside of the handler is synchronous,
     * executed with a callback function or a promise.
     * @param {Jovo} jovo
     * @param {Function} func
     * @return {Promise<any>}
     */
    static async handleOnPromise(jovo: Jovo, func: Function) {

        // resolve if there is no ON_REQUEST in the handler
        if (!func) {
            return;
        }

        // resolve if toIntent was triggered before
        if (jovo && jovo.triggeredToIntent) {
            return;
        }

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
                jovo.triggeredToIntent = true;
                return;
            }
        } else {
            return new Promise((resolve) => {
                func.apply(jovo, [jovo, resolve]);
            });
        }
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
    static async applyHandle(jovo: Jovo, route: Route, fromIntent?: boolean) {

        // resolve, if toIntent was triggered before
        if (jovo && jovo.triggeredToIntent && !fromIntent) {
            return;
        }

        // set type and path to Unhandled, if no type was matched
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
            !_get(jovo.$handlers, route.path)) {
            Log.verbose('Skip END handler');
            return;
        }

        if (route.type === EnumRequestType.AUDIOPLAYER && !_get(jovo.$handlers, route.path)) {
            // @deprecated
            // TODO: Test me
            const v1AudioPlayerPath = route.path.replace('AlexaSkill', 'AudioPlayer');
            if (_get(jovo.$handlers, v1AudioPlayerPath)) {
                route.path = v1AudioPlayerPath;
                console.log('AudioPlayer.* is deprecated since v2. Please use AlexaSkill.*');
            } else {
                return;
            }
        }

        // // throw error if no handler and no UNHANDLED on same level
        if (
            !(
            _get(jovo.$handlers, EnumRequestType.NEW_SESSION) ||
            _get(jovo.$handlers, EnumRequestType.NEW_USER) ||
            _get(jovo.$handlers, EnumRequestType.ON_REQUEST)
            ) &&

            !_get(jovo.$handlers, route.path)) {

            throw new JovoError(
                `Could not find the route "${route.path}" in your handler function.`,
                'ERR_NO_ROUTE',
                'jovo-framework'
                );
        }

        // Object.assign(Jovo.prototype, _get(jovo, 'handlers'));

        if (_get(jovo.$handlers, route.path)) {
            const func:Function = _get(jovo.$handlers, route.path);
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
            Log.warn(`WARN: Jovo instance is not available. ON_ERROR doesn't work here`);
            return;
        }
        if (_get((handleRequest.app.config as AppConfig).handlers, EnumRequestType.ON_ERROR)) {
            const route = {
                type: EnumRequestType.ON_ERROR,
                path: EnumRequestType.ON_ERROR,
            };

            await Handler.applyHandle(handleRequest.jovo, route, true);
            await handleRequest.app.middleware('platform.output')!.run(handleRequest);
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
                this.$handlers,
                this.getState(),
                intent,
                (this.$app.config as AppConfig).intentsToSkipUnhandled
            );
            route.from = this.getRoute().from ? this.getRoute().from + '/' + this.getRoute().path : this.getRoute().path;
            this.$plugins.Router.route = route;
            Log.verbose(` toIntent: ${intent}`);

            return await Handler.applyHandle(this, route, true);
        };

        Jovo.prototype.$handlers = undefined;

        /**
         * Jumps to state intent in the order state > unhandled > error
         * @public
         * @param {string} state name of state
         * @param {string} intent name of intent
         */
        Jovo.prototype.toStateIntent = async function(state: string | undefined, intent: string): Promise<any> { // tslint:disable-line
            this.triggeredToIntent = true;
            this.setState(state);
            Log.verbose(` Changing state to: ${state}`);

            const route = Router.intentRoute(
                this.$handlers,
                state,
                intent,
                (this.$app.config as AppConfig).intentsToSkipUnhandled
            );
            route.from = this.getRoute().from ? this.getRoute().from + '/' + this.getRoute().path : this.getRoute().path;
            this.$plugins.Router.route = route;
            Log.verbose(` toStateIntent: ${state}.${intent}`);
            return await Handler.applyHandle(this, route, true);
        };

        /**
         * Delegates the requests & responses to the component defined with "componentName"
         * @param {string} componentName 
         * @param {string} onCompletedIntent intent to which the component will route to after it's done
         * @returns {Promise<void>}
         */
        Jovo.prototype.delegate = function(componentName: string, onCompletedIntent: string): Promise<void> {
            if (!this.$components[componentName]) {
                throw new JovoError(
                    `Couldn\'t find component named ${componentName}`,
                    ErrorCode.ERR,
                    'jovo-framework',
                    'The component to which you want to delegate to, doesn\'t exist',
                    'Components are initialized using app.useComponents(...components)',
                    'TODO jovodocs'
                );
            }

            this.setSessionAttribute(SessionConstants.COMPONENT, componentName);
            this.$components[componentName].stateBeforeDelegate = this.getState();
            this.$components[componentName].onCompletedIntent = onCompletedIntent;
            
            return this.toStateIntent(componentName, 'START');  
        };

        /**
         * Jumps from the inside of a state to a global intent
         * @public
         * @param {string} intent name of intent
         */
        Jovo.prototype.toStatelessIntent = async function (intent: string) {
            this.triggeredToIntent = true;
            this.removeState();
            Log.verbose(` Removing state.`);
            Log.verbose(` toStatelessIntent: ${intent}`);
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


        /**
         * Skips intent handling when called in NEW_USER, NEW_SESSION, ON_REQUEST
         * @public
         * @return {*}
         */
        Jovo.prototype.skipIntentHandling = async function (): Promise<void> {
            this.triggeredToIntent = true;
        };

        /**
         * Returns mapped intent name.
         * @public
         * @return {*}
         */
        Jovo.prototype.getMappedIntentName = function (): string {
            return this.$plugins.Router.route.intent;
        };

        /**
         * Returns route object.
         * @public
         * @return {*}
         */
        Jovo.prototype.getRoute = function (): Route {
            return this.$plugins.Router.route;
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
