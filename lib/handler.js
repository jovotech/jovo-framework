'use strict';

const BaseApp = require('./app');
const util = require('./util');
const _ = require('lodash');

/**
 * Handler
 */
class Handler {
    /**
     * Constructor
     * @param {Jovo} jovo
     */
    constructor(jovo) {
        this.jovo = jovo;
        this.route = undefined;
    }

    /**
     * Executes routed method in handlers
     * @param {*} route
     * @return {Promise<any>}
     */
    handle(route) {
        return new Promise((resolve, reject) => {
            this.route = route;

            if (this.triggeredToIntent) {
                return Promise.resolve();
            }

            if (this.jovo.responseSent) {
                return Promise.resolve();
            }

            if (!this.route) {
                this.route = {
                    type: BaseApp.REQUEST_TYPE_ENUM.UNHANDLED,
                    path: BaseApp.UNHANDLED,
                };
            }
            // end session when type === END and no END handler defined
            if (this.route.type === BaseApp.REQUEST_TYPE_ENUM.END &&
                !_.get(this.jovo.config.handlers, this.route.path)) {
                this.jovo.endSession();
                resolve();
                return;
            }

            // // throw error if no handler and no UNHANDLED on same level
            if (!_.get(this.jovo.config.handlers, this.route.path)) {
                return reject(
                    new Error(`Could not find the route "${this.route.path}" in your handler function.`)); // eslint-disable-line
            }

            let args = this.jovo.getSortedArgumentsInput(
                _.get(this.jovo.config.handlers, this.route.path)
            );

            const handler = _.get(this.jovo.config.handlers, this.route.path);
            const result = handler.apply(this.jovo, args);
            Promise.resolve(result).then(resolve, reject);
        });
    }

    /**
     * Handles all requests
     * @return {Promise<any>}
     */
    handleNewUser() {
        return new Promise((resolve, reject) => {
            if (this.jovo.user().isNewUser() &&
                this.jovo.config.handlers[BaseApp.HANDLER_NEW_USER]) {
                let params = util.getParamNames(
                    this.jovo.config.handlers[BaseApp.HANDLER_NEW_USER]);
                if (params.length === 0) {
                    this.jovo.config.handlers[BaseApp.HANDLER_NEW_USER].apply(this.jovo);
                    resolve();
                } else {
                    let callback = function() {
                        resolve();
                    };
                    this.jovo.config.handlers[BaseApp.HANDLER_NEW_USER].apply(
                        this.jovo, [callback]);
                }
            } else {
                resolve();
            }
        });
    }

    /**
     * Handles all requests
     * @return {Promise<any>}
     */
    handleNewSession() {
        return new Promise((resolve, reject) => {
            if (this.jovo.isNewSession() &&
                this.jovo.config.handlers[BaseApp.HANDLER_NEW_SESSION]) {
                let params = util.getParamNames(
                    this.jovo.config.handlers[BaseApp.HANDLER_NEW_SESSION]);
                if (params.length === 0) {
                    this.jovo.config.handlers[BaseApp.HANDLER_NEW_SESSION].apply(this.jovo);
                    resolve();
                } else {
                    let callback = function() {
                        resolve();
                    };
                    this.jovo.config.handlers[BaseApp.HANDLER_NEW_SESSION].apply(
                        this.jovo, [callback]);
                }
            } else {
                resolve();
            }
        });
    }

    /**
     * Handles all requests
     * @return {Promise<any>}
     */
    handleOnRequest() {
        return new Promise((resolve, reject) => {
            if (this.jovo.config.handlers[BaseApp.HANDLER_ON_REQUEST]) {
                let params = util.getParamNames(
                    this.jovo.config.handlers[BaseApp.HANDLER_ON_REQUEST]);
                if (params.length === 0) {
                    this.jovo.config.handlers[BaseApp.HANDLER_ON_REQUEST].apply(
                        this.jovo);
                    resolve();
                } else {
                    let callback = function() {
                        resolve();
                    };
                    this.jovo.config.handlers[BaseApp.HANDLER_ON_REQUEST].apply(
                        this.jovo, [callback]);
                }
            } else {
                resolve();
            }
        });
    }

    /**
     * Jumps to an intent in the order state > global > unhandled > error
     * @public
     * @param {string} intent name of intent
     * @param {array} args passed argument
     */
    toIntent(intent) {
        let args = Array.prototype.slice.call(
            Array.prototype.slice.call(arguments, 1)[0], 1); // eslint-disable-line
        this.triggeredToIntent = true;

        let route = this.jovo.routing.routeIntentRequest(
            this.jovo.getState(),
            intent
        );

        if (!_.get(this.jovo.config.handlers, route.path)) {
            throw new Error(`Route ${route.path} could not be found in your handler`);
        }
        _.get(this.jovo.config.handlers, route.path).apply(this.jovo, args);
    }

    /**
     * Jumps to state intent in the order state > unhandled > error
     * @public
     * @param {string} state name of state
     * @param {string} intent name of intent
     * @param {array} args passed arg
     */
    toStateIntent(state, intent) {
        this.jovo.setState(state);
        let args = Array.prototype.slice.call(
            Array.prototype.slice.call(arguments, 2)[0], 2); // eslint-disable-line
        this.triggeredToIntent = true;
        let route = this.jovo.routing.routeIntentRequest(state, intent);

        if (!_.get(this.jovo.config.handlers, route.path)) {
            throw new Error(`Route ${route.path} could not be found in your handler`);
        }
        _.get(this.jovo.config.handlers, route.path).apply(this.jovo, args);
    }

    /**
     * Jumps to state intent in the order state > unhandled > error
     * @public
     * @param {string} intent name of intent
     * @param {array} args passed arg
     */
    toStatelessIntent(intent) {
        this.jovo.setState(null);
        let args = Array.prototype.slice.call(
            Array.prototype.slice.call(arguments, 1)[0], 1); // eslint-disable-line
        this.triggeredToIntent = true;
        let route = this.jovo.routing.routeIntentRequest(null, intent);

        if (!_.get(this.jovo.config.handlers, route.path)) {
            throw new Error(`Route ${route.path} could not be found in your handler`);
        }
        _.get(this.jovo.config.handlers, route.path).apply(this.jovo, args);
    }

    /**
     * Sets 'state' session attributes
     * @public
     * @param {string} state null removes state
     */
    followUpState(state) {
        if (state && !_.get(this.jovo.config.handlers, state)) {
            throw Error(`State ${state} could not be found in your handler`);
        }
        this.jovo.setState(state);
    }

}

module.exports.Handler = Handler;
