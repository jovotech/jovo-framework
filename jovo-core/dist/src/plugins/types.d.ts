import { Handler } from '../Interfaces';
import { Component, ComponentDelegationOptions, ComponentResponse } from './Component';
import { ComponentPlugin } from './ComponentPlugin';
import { Config as RouterConfig, Route } from './Router';
declare module './../core/Jovo' {
    interface Jovo {
        $handlers: any;
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
         * @param {boolean} [validate=true] state validation toggle
         */
        toStateIntent(state: string | undefined, intent: string, validate?: boolean): Promise<void>;
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
        /**
         * Delegates the requests & responses to the component defined with "componentName"
         * @param {string} componentName
         * @param {ComponentDelegationOptions} options
         * @returns {Promise<void>}
         */
        delegate(componentName: string, options: ComponentDelegationOptions): Promise<void>;
    }
}
declare module './../core/BaseApp' {
    interface BaseApp {
        /**
         * 1st layer components.
         * These were initialized by the developer using `app.useComponents`
         */
        $baseComponents: {
            [key: string]: ComponentPlugin;
        };
        /**
         * Sets handlers
         * @param {...Object} handlers Handler-objects
         */
        setHandler(...handlers: Handler[]): this;
        /**
         * Sets platform-specific handlers
         * @param {string} platformName Name of a platform that is installed.
         * @param {...Object} handlers Handler-objects
         */
        setPlatformHandler(platformName: string, ...handlers: Handler[]): this;
    }
}
declare module './../core/Jovo' {
    interface Jovo {
        $components: {
            [key: string]: Component;
        };
        $activeComponents: {
            [key: string]: ComponentPlugin;
        };
        /**
         * Checks if the given state contains the name of a initialized component.
         * @private
         * @param {string | undefined} state
         * @return {void}
         * @throws {JovoError}
         */
        checkStateForInitializedComponentName(state: string | undefined): void;
        /**
         * Returns the active components root state value.
         * @return {string | undefined}
         */
        getActiveComponentsRootState(): string | undefined;
        /**
         * Returns the active component.
         * @return {string | undefined}
         */
        getActiveComponent(): Component | undefined;
        sendComponentResponse(response: ComponentResponse): Promise<void>;
    }
}
declare module './../util/Cms' {
    interface Cms {
        t(key: string, obj?: any): string | string[];
    }
}
declare module './../core/Jovo' {
    interface Jovo {
        t(key: string, obj?: any): string | string[];
    }
}
declare module './../util/SpeechBuilder' {
    interface SpeechBuilder {
        t(key: string, obj?: any): this;
        addT(key: string, obj?: any): this;
    }
}
declare module './../Interfaces' {
    interface ExtensiblePluginConfigs {
        Router?: RouterConfig;
    }
}
