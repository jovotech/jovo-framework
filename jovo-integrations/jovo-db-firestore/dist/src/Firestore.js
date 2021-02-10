"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
class Firestore {
    constructor(config, firestore) {
        this.config = {
            collectionName: 'UserData',
            credential: undefined,
            databaseURL: undefined,
        };
        this.needsWriteFileAccess = false;
        this.isCreating = false;
        if (firestore) {
            this.firestore = firestore;
        }
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    install(app) {
        if (_get(app.config, 'db.default')) {
            if (_get(app.config, 'db.default') === 'Firestore') {
                app.$db = this;
            }
        }
        else {
            app.$db = this;
        }
        if (!this.firestore) {
            this.initializeFirebaseAdmin();
            this.initializeFirestore(this.firebaseAdmin);
        }
    }
    initializeFirebaseAdmin() {
        this.firebaseAdmin = require('firebase-admin');
        if (!this.firebaseAdmin) {
            throw new jovo_core_1.JovoError('Failed to import the firebase-admin package', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-firestore', 'The Jovo Firestore integration depends on the firebase-admin package, which could not be imported.');
        }
        this.firebaseAdmin.initializeApp({
            credential: this.firebaseAdmin.credential.cert(this.config.credential),
            databaseURL: this.config.databaseURL,
        });
    }
    initializeFirestore(firebaseAdmin) {
        // tslint:disable-line
        this.firestore = firebaseAdmin.firestore();
        if (!this.firestore) {
            throw new jovo_core_1.JovoError('Failed to initialize the firestore object', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-firestore');
        }
        this.firestore.settings({
            timestampsInSnapshots: true,
        });
    }
    /**
     * Throws JovoError if collectionName, credential or databaseURL was not set inside config.js
     */
    errorHandling() {
        if (!this.config.collectionName) {
            throw new jovo_core_1.JovoError(`collectionName has to be set`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-firestore', undefined, 'Add the collectionName to the Firestore object inside your config.js', 'https://www.jovo.tech/docs/databases/firestore');
        }
        if (!this.firestore && !this.config.credential) {
            throw new jovo_core_1.JovoError('Service account credential has to be set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-firestore', undefined, 'Add the service account credential object to the Firestore object inside your config.js', 'https://www.jovo.tech/docs/databases/firestore');
        }
        if (!this.firestore && !this.config.databaseURL) {
            throw new jovo_core_1.JovoError('databaseURL has to be set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-firestore', undefined, 'Add the databaseURL to the Firestore object inside your config.js', 'https://www.jovo.tech/docs/databases/firestore');
        }
    }
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<object>}
     */
    async load(primaryKey, jovo) {
        this.errorHandling();
        const docRef = this.firestore.collection(this.config.collectionName).doc(primaryKey);
        const doc = await docRef.get();
        return doc.data();
    }
    /**
     * Saves data as value for key (default: "userData") inside document (primary key)
     * @param {string} primaryKey
     * @param {string} key
     * @param {any} data
     */
    async save(primaryKey, key, data, updatedAt, jovo) {
        // tslint:disable-line
        this.errorHandling();
        const userData = {
            [key]: data,
        };
        if (updatedAt) {
            userData.updatedAt = updatedAt;
        }
        const docRef = this.firestore.collection(this.config.collectionName).doc(primaryKey);
        // remove custom prototypes
        await docRef.set(JSON.parse(JSON.stringify(userData)), { merge: true });
    }
    /**
     * Deletes document referred to by primaryKey
     * @param {string} primaryKey
     */
    async delete(primaryKey, jovo) {
        this.errorHandling();
        const docRef = this.firestore.collection(this.config.collectionName).doc(primaryKey);
        await docRef.delete();
    }
}
exports.Firestore = Firestore;
//# sourceMappingURL=Firestore.js.map