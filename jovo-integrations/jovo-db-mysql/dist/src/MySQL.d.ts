import { BaseApp, Db, Jovo, PluginConfig } from 'jovo-core';
import { Pool, PoolConfig, PoolConnection } from 'mysql';
export interface Config extends PluginConfig {
    tableName?: string;
    primaryKeyColumn?: string;
    dataColumnName?: string;
    connection?: string | PoolConfig;
}
export declare class MySQL implements Db {
    config: Config;
    pool?: Pool;
    needsWriteFileAccess: boolean;
    constructor(config?: Config);
    install(app: BaseApp): void;
    uninstall(app: BaseApp): void;
    errorHandling(): void;
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    load(primaryKey: string, jovo?: Jovo): Promise<unknown>;
    save(primaryKey: string, key: string, data: any, updatedAt?: string, jovo?: Jovo): Promise<unknown>;
    delete(primaryKey: string, jovo?: Jovo): Promise<unknown>;
    createTable(): Promise<any>;
    select(primaryKey: string): Promise<unknown>;
    getConnection(): Promise<PoolConnection>;
}
