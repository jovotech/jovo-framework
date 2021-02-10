import { BaseApp, Db, Jovo, PluginConfig } from 'jovo-core';
import { MongoClient } from 'mongodb';
export interface Config extends PluginConfig {
    uri?: string;
    databaseName?: string;
    collectionName?: string;
    primaryKeyColumn?: string;
}
export declare class MongoDb implements Db {
    config: Config;
    needsWriteFileAccess: boolean;
    isCreating: boolean;
    client?: MongoClient;
    constructor(config?: Config);
    install(app: BaseApp): void;
    initClient(): Promise<void>;
    getConnectedMongoClient(uri: string): Promise<MongoClient>;
    errorHandling(): void;
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    load(primaryKey: string, jovo?: Jovo): Promise<any>;
    save(primaryKey: string, key: string, data: any, updatedAt?: string, jovo?: Jovo): Promise<void>;
    delete(primaryKey: string, jovo?: Jovo): Promise<void>;
}
