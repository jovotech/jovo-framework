import { ConnectionConfig, Pool } from 'pg';
import { BaseApp, Db, Jovo, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    tableName?: string;
    primaryKeyColumn?: string;
    dataColumnName?: string;
    connection?: ConnectionConfig;
}
export declare class PostgreSQL implements Db {
    config: Config;
    /**
     * We use single queries using the pool object as it's the recommended way of doing things
     * when you only need a small number of queries. In our case that's two queries
     * per request-response cycle.
     * @see https://node-postgres.com/features/pooling#single-query
     */
    pool: Pool;
    needsWriteFileAccess: boolean;
    constructor(config?: Config);
    install(app: BaseApp): void;
    uninstall(app: BaseApp): Promise<void>;
    /**
     * Returns object for given `primaryKey`
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    load(primaryKey: string, jovo?: Jovo): Promise<any>;
    save(primaryKey: string, key: string, data: any, updatedAt?: string, jovo?: Jovo): Promise<void>;
    delete(primaryKey: string, jovo?: Jovo): Promise<void>;
    /**
     * Sets PostgreSQL as the active db integration if there is no default db
     * or the default db is set to be `PostgreSQL`.
     * @param app
     */
    private setAsActiveDbIntegration;
    private errorHandling;
    private createTable;
}
