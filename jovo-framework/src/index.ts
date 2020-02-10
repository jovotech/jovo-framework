import { Data, Log, LogLevel, Project, Util } from 'jovo-core';
import { App } from './App';

import {
  ContextPrevObject,
  UserContext,
  UserMetaData,
  UserSessionData,
} from './middleware/user/JovoUser';

import { Config as BasicLoggingConfig } from './middleware/logging/BasicLogging';

export { App } from './App';
export { server as Webhook } from './server';
export { verifiedServer as WebhookVerified } from './server';

export { ExpressJS } from './hosts/ExpressJS';
export { Lambda } from './hosts/Lambda';
export { AzureFunction } from './hosts/AzureFunction';
export { GoogleCloudFunction } from './hosts/GoogleCloudFunction';

export { BasicLogging } from './middleware/logging/BasicLogging';
export { JovoUser, UserMetaData, ContextPrevObject } from './middleware/user/JovoUser';
export { Util, LogLevel, Log, Project };
export * from 'jovo-core';

declare module 'express' {
  interface Application {
    jovoApp?: App;
    ssl?: { key: Buffer; cert: Buffer };
  }
}

declare module 'jovo-core/dist/src/core/Jovo' {
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

declare module 'jovo-core/dist/src/Interfaces' {
  export interface ExtensiblePluginConfigs {
    BasicLogging?: BasicLoggingConfig;
  }
}

declare module 'jovo-core/dist/src/core/User' {
  interface User {
    $metaData: UserMetaData;
    $data: Data;
    $context: UserContext;
    $session: UserSessionData;
    isDeleted: boolean;
    db_cache_hash?: string;

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
