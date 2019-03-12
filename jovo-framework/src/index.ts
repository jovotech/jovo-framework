import {App} from "./App";

import {UserMetaData, UserContext, ContextPrevObject} from "./middleware/user/JovoUser";
import {Jovo, Data, Handler, Util, Log, LogLevel} from 'jovo-core';
import {Route} from "./middleware/Router";
export { App } from './App';
export { server as Webhook } from './server';
export { verifiedServer as WebhookVerified } from './server';

export { ExpressJS } from './hosts/ExpressJS';
export { Lambda } from './hosts/Lambda';
export { AzureFunction } from './hosts/AzureFunction';
export { GoogleCloudFunction } from './hosts/GoogleCloudFunction';

export { BasicLogging } from './middleware/logging/BasicLogging';
export { Router, Route } from './middleware/Router';
export { JovoUser, UserMetaData, ContextPrevObject } from './middleware/user/JovoUser';
export { Util, LogLevel, Log };


declare module 'express' {
    interface Application {
        jovoApp?: App;
    }
}


declare module 'jovo-core/dist/src/BaseApp' {

    /**
     * Sets handler object
     * @param {Object} handlers
     */
    export interface BaseApp {
        setHandler(...handler: Handler[]): this;
    }
}


declare module 'jovo-core/dist/src/Jovo' {
    export interface Jovo {
        $handlers: any; // tslint:disable-line
        triggeredToIntent: boolean;

        /**
         * Returns path to function inside the handler
         * Examples
         * LAUNCH = Launch function
         * State1:IntentA => IntentA in state 'State1'
         * @public
         * @return {string}
         */
        getHandlerPath(): string;


        /**
         * Jumps to an intent in the order state > global > unhandled > error
         * @public
         * @param {string} intent name of intent
         */
        toIntent(intent: string): Promise<void>;


        /**
         * Jumps to state intent in the order state > unhandled > error
         * @public
         * @param {string} state name of state
         * @param {string} intent name of intent
         */
        toStateIntent(state: string | undefined, intent: string): Promise<void>;


        /**
         * Jumps from the inside of a state to a global intent
         * @public
         * @param {string} intent name of intent
         */
        toStatelessIntent(intent: string): Promise<void>;


        /**
         * Adds state to session attributes
         * @param {string} state
         * @return {Jovo}
         */
        followUpState(state: string): this;


        /**
         * Returns path to function inside the handler
         * Examples
         * LAUNCH = Launch function
         * State1:IntentA => IntentA in state 'State1'
         * @public
         * @return {*}
         */
        getHandlerPath(): string;


        /**
         * Skips intent handling when called in NEW_USER, NEW_SESSION, ON_REQUEST
         * @public
         * @return {*}
         */
        skipIntentHandling(): Promise<void>;

        /**
         * Returns mapped intent name.
         * @public
         * @return {*}
         */
        getMappedIntentName(): string;


        /**
         * Returns route object.
         * @public
         * @return {*}
         */
        getRoute(): Route;
    }
}

declare module 'jovo-core/dist/src/Jovo' {
    export interface Jovo {

        /**
         * Repeats last speech & reprompt
         * Gets the info from the database.
         *
         * Context saving has to be set.
         * user: {
         *      context: true
         * }
         */
        repeat(): void;
    }
}

declare module 'jovo-core/dist/src/User' {
    interface User {
        $metaData: UserMetaData;
        $data: Data;
        $context: UserContext;
        isDeleted: boolean;

        /**
         * Return the intent at the specified index
         * @deprecated use this.$user.context.prev[index].request.intent instead
         * @param {number} index
         * @return {String}
         */
        getPrevIntent(index: number): string | undefined;


        /**
         * Returns request.state at the specified index
         * @deprecated use this.$user.context.prev[index].request.state instead
         * @param {number} index
         * @return {String}
         */
        getPrevRequestState(index: number): string | undefined;


        /**
         * Returns response.state at the specified index
         * @deprecated use this.$user.context.prev[index].response.state instead
         * @param {number} index
         * @return {String}
         */
        getPrevResponseState(index: number): string | undefined;


        /**
         * Returns the inputs at the specified index
         * @deprecated use this.$user.context.prev[index].request.inputs instead
         * @param {number} index
         * @return {*}
         */
        getPrevInputs(index: number): object | undefined;


        /**
         * Returns the timestamp at the specified index
         * @deprecated use this.$user.context.prev[index].request.timestamp instead
         * @param {number} index
         * @return {String|*}
         */
        getPrevTimestamp(index: number): string | undefined;


        /**
         * Returns the speech at the specified index
         * @deprecated use this.$user.context.prev[index].response.speech instead
         * @param {number} index
         * @return {String}
         */
        getPrevSpeech(index: number): string | undefined;


        /**
         * Returns the reprompt at the specified index
         * @deprecated use this.$user.context.prev[index].request.reprompt instead
         * @param {number} index
         * @return {String}
         */
        getPrevReprompt(index: number): string | undefined;

        /**
         * Explicit user deletion
         * @returns {Promise<void>}
         */
        delete(): void;

        /**
         * Load user from db
         * @returns {Promise<any>}
         */
        loadData(): Promise<any>; // tslint:disable-line

        /**
         * Save user to db
         * @returns {Promise<any>}
         */
        saveData(): Promise<void>;

    }
}




