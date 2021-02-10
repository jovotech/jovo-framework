"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@google-cloud/datastore");
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
class DatastoreDb {
    constructor(config) {
        this.config = {
            entity: 'JovoUser',
            gCloudConfig: {},
            primaryKeyColumn: 'userId',
        };
        this.isCreating = false;
        this.needsWriteFileAccess = false;
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    install(app) {
        this.datastore = new datastore_1.Datastore(this.config.gCloudConfig);
        if (_get(app.config, 'db.default')) {
            if (_get(app.config, 'db.default') === 'DatastoreDb') {
                app.$db = this;
            }
        }
        else {
            app.$db = this;
        }
    }
    errorHandling() {
        if (!this.datastore) {
            throw new jovo_core_1.JovoError('datastore was not initialized at runtime', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-datastore', undefined, undefined, 'https://www.jovo.tech/docs/databases/google-datastore');
        }
        if (!this.config.entity) {
            throw new jovo_core_1.JovoError(`Couldn't use Datastore. entity has to be set.`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-datastore', undefined, undefined, 'https://www.jovo.tech/docs/databases/google-datastore');
        }
        if (!this.config.primaryKeyColumn) {
            throw new jovo_core_1.JovoError(`Couldn't use Datastore. primaryKeyColumn has to be set.`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-datastore', undefined, undefined, 'https://www.jovo.tech/docs/databases/google-datastore');
        }
    }
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    async load(primaryKey, jovo) {
        // tslint:disable-line
        this.errorHandling();
        const entityKey = this.datastore.key([this.config.entity, primaryKey]);
        const entities = await this.datastore.get(entityKey); // tslint:disable-line
        const entity = entities[0];
        return entity ? entity.data : {};
    }
    async save(primaryKey, key, data, updatedAt, jovo) {
        // tslint:disable-line
        this.errorHandling();
        const entityKey = this.datastore.key([this.config.entity, primaryKey]);
        const entities = await this.datastore.get(entityKey); // tslint:disable-line
        let entity;
        if (entities[0] === undefined) {
            entity = {
                [this.config.primaryKeyColumn]: primaryKey,
            };
        }
        else {
            entity = entities[0];
        }
        if (updatedAt) {
            entity.updatedAt = updatedAt;
        }
        // Don't confuse with the "data" key form the "save" method, actually this is
        // the data node necessary for datastore, whereas in the "save" method we add a second data
        // node for storing our own data.
        _set(entity, 'data.' + key, data);
        const dataStoreDataObject = {
            data: entity,
            key: entityKey,
        };
        await this.datastore.save(dataStoreDataObject);
    }
    async delete(primaryKey, jovo) {
        this.errorHandling();
        const entityKey = this.datastore.key([this.config.entity, primaryKey]);
        return this.datastore.delete(entityKey);
    }
}
exports.DatastoreDb = DatastoreDb;
//# sourceMappingURL=DatastoreDb.js.map