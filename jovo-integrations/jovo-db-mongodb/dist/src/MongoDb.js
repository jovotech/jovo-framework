"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const mongodb_1 = require("mongodb");
class MongoDb {
    constructor(config) {
        this.config = {
            collectionName: 'UserData',
            databaseName: undefined,
            primaryKeyColumn: 'userId',
            uri: undefined,
        };
        this.needsWriteFileAccess = false;
        this.isCreating = false;
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    install(app) {
        this.errorHandling();
        if (_get(app.config, 'db.default')) {
            if (_get(app.config, 'db.default') === 'MongoDb') {
                app.$db = this;
            }
        }
        else {
            app.$db = this;
        }
    }
    async initClient() {
        if (!this.client && this.config.uri) {
            this.client = await this.getConnectedMongoClient(this.config.uri);
        }
    }
    async getConnectedMongoClient(uri) {
        return mongodb_1.MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    errorHandling() {
        if (!this.config.uri) {
            throw new jovo_core_1.JovoError('uri has to be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-mongodb', undefined, undefined, 'https://www.jovo.tech/docs/databases/mongodb');
        }
        if (!this.config.primaryKeyColumn) {
            throw new jovo_core_1.JovoError('primaryKeyColumn has to be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-mongodb', undefined, undefined, 'https://www.jovo.tech/docs/databases/mongodb');
        }
        if (!this.config.databaseName) {
            throw new jovo_core_1.JovoError('databaseName has to be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-mongodb', undefined, undefined, 'https://www.jovo.tech/docs/databases/mongodb');
        }
        if (!this.config.collectionName) {
            throw new jovo_core_1.JovoError('collectionName has to be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-mongodb', undefined, undefined, 'https://www.jovo.tech/docs/databases/mongodb');
        }
    }
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    async load(primaryKey, jovo) {
        // tslint:disable-line
        try {
            await this.initClient();
            const collection = this.client.db(this.config.databaseName).collection(this.config.collectionName);
            const doc = await collection.findOne({ userId: primaryKey });
            return doc;
        }
        catch (e) {
            throw new jovo_core_1.JovoError(e.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-mongodb', undefined, 'Make sure the configuration you provided is valid.', 'https://www.jovo.tech/docs/databases/mongodb');
        }
    }
    async save(primaryKey, key, data, updatedAt, jovo) {
        // tslint:disable-line
        this.errorHandling();
        try {
            await this.initClient();
            const collection = this.client.db(this.config.databaseName).collection(this.config.collectionName);
            const item = {
                $set: {
                    [this.config.primaryKeyColumn]: primaryKey,
                    [key]: data,
                },
            };
            if (updatedAt) {
                item.$set.updatedAt = updatedAt;
            }
            await collection.updateOne({ userId: primaryKey }, item, { upsert: true });
        }
        catch (e) {
            throw new jovo_core_1.JovoError(e.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-mongodb', undefined, 'Make sure the configuration you provided is valid.', 'https://www.jovo.tech/docs/databases/mongodb');
        }
    }
    async delete(primaryKey, jovo) {
        try {
            await this.initClient();
            const collection = this.client.db(this.config.databaseName).collection(this.config.collectionName);
            await collection.deleteOne({ userId: primaryKey });
        }
        catch (e) {
            throw new jovo_core_1.JovoError(e.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-mongodb', undefined, 'Make sure the configuration you provided is valid.', 'https://www.jovo.tech/docs/databases/mongodb');
        }
    }
}
exports.MongoDb = MongoDb;
//# sourceMappingURL=MongoDb.js.map