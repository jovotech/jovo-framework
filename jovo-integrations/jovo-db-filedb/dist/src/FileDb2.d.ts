import { BaseApp, Db, Jovo, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    path?: string;
}
export declare class FileDb2 implements Db {
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
    delete(primaryKey: string, jovo?: Jovo): Promise<any>;
    private readFile;
    private saveFile;
    private deleteFile;
}
