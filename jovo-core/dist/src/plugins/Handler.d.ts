import { BaseApp, HandleRequest, Plugin } from '..';
import { Jovo } from '../core/Jovo';
import { Route } from './Router';
export declare class Handler implements Plugin {
    /**
     * Calls 'NEW_USER' if the current user is not in the database
     * @param {Jovo} jovo
     * @return {any}
     */
    static handleOnNewUser(jovo: Jovo): Promise<void>;
    /**
     * Calls 'ON_REQUEST' on every request
     * @param {Jovo} jovo
     * @returns {Promise<any>}
     */
    static handleOnRequest(jovo: Jovo): Promise<void>;
    /**
     * Calls 'NEW_SESSION' if the session is new
     * @param {Jovo} jovo
     * @return {any}
     */
    static handleOnNewSession(jovo: Jovo): Promise<void>;
    /**
     * Allows execute logic synchronously and asynchronously
     * Returns Promise when the code inside of the handler is synchronous,
     * executed with a callback function or a promise.
     * @param {Jovo} jovo
     * @param {Function} func
     * @return {Promise<any>}
     */
    static handleOnPromise(jovo: Jovo, func: Function): Promise<any>;
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
    static applyHandle(jovo: Jovo, route: Route, fromIntent?: boolean): Promise<any>;
    install(app: BaseApp): void;
    handle(handleRequest: HandleRequest): Promise<void>;
    error(handleRequest: HandleRequest): Promise<void>;
    mixin(app: BaseApp): void;
}
