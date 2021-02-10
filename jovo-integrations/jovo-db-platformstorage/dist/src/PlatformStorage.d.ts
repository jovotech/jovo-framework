import { BaseApp, Db, Jovo, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
}
export declare class PlatformStorage implements Db {
    needsWriteFileAccess: boolean;
    config: Config;
    constructor(config?: Config);
    install(app: BaseApp): void;
    load(primaryKey: string, jovo?: Jovo): Promise<any>;
    save(primaryKey: string, key: string, data: any, // tslint:disable-line:no-any
    updatedAt?: string | undefined, jovo?: Jovo): Promise<void>;
    delete(primaryKey: string, jovo?: Jovo): Promise<void>;
}
