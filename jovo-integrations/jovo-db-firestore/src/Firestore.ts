import {Db, BaseApp, PluginConfig, JovoError} from 'jovo-core';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import firebase = require('firebase-admin');

export interface Config extends PluginConfig {
    databaseURL?: string;
    collectionName: string;
    credential?: string;
}

export class Firestore implements Db {
    config: Config = {
        databaseURL: undefined,
        collectionName: 'UserData',
        credential: undefined
    };
    needsWriteFileAccess = false;
    isCreating = false;
    firebaseAdmin?: any; // tslint:disable-line
    firestore?: firebase.firestore.Firestore;

    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    install(app: BaseApp) {
        if (_get(app.config, 'db.default')) {
            if (_get(app.config, 'db.default') === 'MongoDb') {
                app.$db = this;
            }
        } else {
            app.$db = this;
        }

        this.errorHandling();

        this.firebaseAdmin = require('firebase-admin');
        this.firebaseAdmin!.initializeApp({
            credential: this.firebaseAdmin.credential.cert(this.config.credential),
            databaseURL: this.config.databaseURL
        });
        this.firestore = this.firebaseAdmin.firestore();
        this.firestore!.settings({
            timestampsInSnapshots: true
        });
    }

    uninstall(app: BaseApp) {
    }


    /**
     * Throws JovoError if collectionName, credential or databaseURL was not set inside config.js
     */
    errorHandling() {
        if (!this.config.collectionName) {
            throw new JovoError(
                `collectionName has to be set`,
                undefined,
                'jovo-db-firestore',
                ' - ',
                'Add the collectionName to the Firestore object inside your config.js',
                'https://www.jovo.tech/docs/databases/firestore'
            );
        }

        if (!this.config.credential) {
            throw new JovoError(
                'Service account credential has to be set',
                undefined,
                'jovo-db-firestore',
                ' - ',
                'Add the service account credential object to the Firestore object inside your config.js',
                'https://www.jovo.tech/docs/databases/firestore'
            );
        }

        if (!this.config.databaseURL) {
            throw new JovoError(
                'databaseURL has to be set',
                undefined,
                'jovo-db-firestore',
                ' - ',
                'Add the databaseURL to the Firestore object inside your config.js',
                'https://www.jovo.tech/docs/databases/firestore'
            );
        }
    }


    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<object>}
     */
    async load(primaryKey: string): Promise<firebase.firestore.DocumentData | undefined> {
        const docRef = this.firestore!.collection(this.config.collectionName).doc(primaryKey);
        const doc = await docRef.get();
        return doc.data();

    }


    /**
     * Saves object as value for key (default: "userData") inside document (primary key)
     * @param {string} primaryKey
     * @param {string} key
     * @param {object} data
     */
    async save(primaryKey: string, key: string, data: object): Promise<void> {
        const docRef = this.firestore!.collection(this.config.collectionName).doc(primaryKey);
        await docRef.set({ [key]: data }, {merge: true});
    }


    /**
     * Deletes document referred to by primaryKey
     * @param {string} primaryKey
     */
    async delete(primaryKey: string): Promise<void> {
        const docRef = this.firestore!.collection(this.config.collectionName).doc(primaryKey);
        await docRef.delete();
    }
}
