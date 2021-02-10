import { Datastore } from '@google-cloud/datastore';
import { BaseApp, Db, Jovo, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    entity?: string;
    primaryKeyColumn?: string;
    gCloudConfig?: {
        apiEndpoint?: string;
        namespace?: string;
        projectId?: string;
        keyFilename?: string;
        credentials?: object;
    };
}
export declare class DatastoreDb implements Db {
    datastore?: Datastore;
    config: Config;
    isCreating: boolean;
    needsWriteFileAccess: boolean;
    constructor(config?: Config);
    install(app: BaseApp): void;
    errorHandling(): void;
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    load(primaryKey: string, jovo?: Jovo): Promise<any>;
    save(primaryKey: string, key: string, data: any, updatedAt?: string, jovo?: Jovo): Promise<void>;
    delete(primaryKey: string, jovo?: Jovo): Promise<import("@google-cloud/datastore/build/src/request").CommitResponse>;
}
