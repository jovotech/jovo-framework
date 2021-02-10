import { AppData, Db, Host } from '../Interfaces';
import { ComponentPlugin } from '../plugins/ComponentPlugin';
import { Extensible, ExtensibleConfig } from './Extensible';
import { Platform } from './Platform';
export declare type BaseAppMiddleware = 'setup' | 'request' | 'platform.init' | 'asr' | 'platform.nlu' | 'nlu' | 'user.load' | 'router' | 'handler' | 'user.save' | 'tts' | 'platform.output' | 'response' | 'fail' | string;
export interface BaseAppConfig extends ExtensibleConfig {
    inputMap?: {
        [key: string]: string;
    };
}
export declare class BaseApp extends Extensible {
    config: BaseAppConfig;
    $platform: Map<string, Platform>;
    $db: Db;
    $cms: any;
    $data: AppData;
    middlewares: BaseAppMiddleware[];
    private initialized;
    constructor(config?: BaseAppConfig);
    /**
     * Initialize setup middleware
     * @param {Function} callback
     */
    setUp(callback: Function): void;
    /**
     * Is called on exit
     * IMPORTANT: Must have synchronous code only
     * @param {Function} callback
     */
    tearDown(callback: Function): void;
    /**
     * Returns platform with given name.
     * @param {string} name
     * @returns {Platform | undefined}
     */
    getPlatformByName(name: string): Platform | undefined;
    /**
     * Returns platform type names
     * Example: ['Alexa', 'GoogleAssistant']
     */
    getPlatformTypes(): string[];
    /**
     * Returns platform app type names
     * Example: ['AlexaSkill', 'GoogleAction']
     */
    getAppTypes(): string[];
    /**
     * Emits webhook.init event.
     */
    initWebhook(): void;
    /**
     * Hooks for the middleware handling.
     * @param {BaseAppMiddleware} name
     * @param {Function} func
     */
    hook(name: BaseAppMiddleware, func: Function): void;
    /**
     * Main entry method which handles the request.
     * @param {Host} host
     * @returns {Promise<void>}
     */
    handle(host: Host): Promise<void>;
    /**
     *
     * @param {ComponentPlugin[]} components
     */
    useComponents(...components: ComponentPlugin[]): void;
    getProject(): import("../util/Project").Project;
    /**
     * On request listener
     * @param {Function} callback
     */
    onRequest(callback: Function): void;
    /**
     * On response listener
     * @param {Function} callback
     */
    onResponse(callback: Function): void;
    /**
     * On error listener. Same as the onFail listener
     * @param {Function} callback
     */
    onError(callback: Function): void;
    /**
     * On fail listener
     * @param {Function} callback
     */
    onFail(callback: Function): void;
    /**
     * BaseApp install method. Nothing to do here
     * @param extensible
     */
    install(extensible: Extensible): void;
    /**
     * BaseApp uninstall method. Nothing to do here
     * @param extensible
     */
    uninstall(extensible: Extensible): void;
}
