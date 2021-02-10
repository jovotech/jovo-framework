import { BaseApp, Db, Jovo, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    pathToFile?: string;
    primaryKeyColumn?: string;
}
export declare class FileDb implements Db {
    /**
     * Creates paths recursively
     * @param {string} targetDir
     * @param {boolean} isRelativeToScript
     */
    private static mkDirByPathSync;
    needsWriteFileAccess: boolean;
    config: Config;
    constructor(config?: Config);
    install(app: BaseApp): void;
    errorHandling(): void;
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    load(primaryKey: string, jovo?: Jovo): Promise<any>;
    save(primaryKey: string, key: string, data: any, updatedAt?: string, jovo?: Jovo): Promise<any>;
    delete(primaryKey: string, jovo?: Jovo): Promise<number>;
    private readFile;
    private saveFile;
    private static validatePathToFile;
}
