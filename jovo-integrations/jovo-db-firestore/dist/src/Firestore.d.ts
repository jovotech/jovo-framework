import firebase = require('firebase-admin');
import { BaseApp, Db, Jovo, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    databaseURL?: string;
    collectionName: string;
    credential?: string;
}
export declare class Firestore implements Db {
    config: Config;
    needsWriteFileAccess: boolean;
    isCreating: boolean;
    firebaseAdmin?: any;
    firestore?: firebase.firestore.Firestore;
    constructor(config?: Config, firestore?: firebase.firestore.Firestore);
    install(app: BaseApp): void;
    initializeFirebaseAdmin(): void;
    initializeFirestore(firebaseAdmin: any): void;
    /**
     * Throws JovoError if collectionName, credential or databaseURL was not set inside config.js
     */
    errorHandling(): void;
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<object>}
     */
    load(primaryKey: string, jovo?: Jovo): Promise<firebase.firestore.DocumentData | undefined>;
    /**
     * Saves data as value for key (default: "userData") inside document (primary key)
     * @param {string} primaryKey
     * @param {string} key
     * @param {any} data
     */
    save(primaryKey: string, key: string, data: any, updatedAt?: string, jovo?: Jovo): Promise<void>;
    /**
     * Deletes document referred to by primaryKey
     * @param {string} primaryKey
     */
    delete(primaryKey: string, jovo?: Jovo): Promise<void>;
}
