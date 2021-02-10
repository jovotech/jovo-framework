import type { Plugin, PluginConfig, BaseApp } from 'jovo-core';
import { HandleRequest } from 'jovo-core';
import { InboxLog, JovoInboxDb } from './interfaces';
import { InboxLogEntity } from './entity/InboxLog';
import { ConnectionOptions } from 'typeorm';
export interface JovoInboxConfig extends PluginConfig {
    db?: Partial<ConnectionOptions>;
    appId?: string;
    defaultLocale: string;
    skipPlatforms?: string[];
    skipLocales?: string[];
    skipUserIds?: string[];
    skipRequestObjects?: string[];
    skipResponseObjects?: string[];
    maskRequestObjects?: string[];
    maskResponseObjects?: string[];
    maskValue?: string | Function;
}
export declare class JovoInbox {
    private config;
    inboxDb: JovoInboxDb;
    constructor(config: JovoInboxConfig);
    add(inboxLog: InboxLog): Promise<void>;
    close(): Promise<void>;
}
export declare class JovoInboxPlugin implements Plugin {
    config: JovoInboxConfig;
    constructor(config: Partial<JovoInboxConfig>);
    install(app: BaseApp): void;
    /**
     * Builds initial InboxLog object with data that is used by every log type.
     * @param handleRequest
     */
    buildLog(handleRequest: HandleRequest): InboxLogEntity;
    /**
     * Skips objects provided in skipArray, masks objects provided in maskArray
     * @param obj
     * @param maskArray
     * @param skipArray
     */
    modifyObject(obj: any, maskArray?: string[], skipArray?: string[]): any;
}
