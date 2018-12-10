import {Db, BaseApp, PluginConfig} from 'jovo-core';
import _merge = require('lodash.merge');
import _set = require('lodash.set');
import Datastore = require("@google-cloud/datastore");

export interface Config extends PluginConfig {
    entity?: string;
    gCloudConfig?: {
        projectId?: string,
        apiEndpoint?: string,
    };
}

export class DatastoreDb implements Db {
    datastore?: Datastore;
    config: Config = {
        entity: 'JovoUser',
        gCloudConfig: {},
    };
    isCreating = false;
    needsWriteFileAccess = false;


    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    install(app: BaseApp) {
        this.datastore = new Datastore(this.config.gCloudConfig);
    }

    uninstall(app: BaseApp) {

    }

    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    async load(primaryKey: string): Promise<any> { // tslint:disable-line
        if (!this.datastore) {
            throw new Error(`Couldn't use Datastore. It has to be initialized.`);
        }

        if (!this.config.entity) {
            throw new Error(`Couldn't use Datastore. entity has to be set.`);
        }


        const entityKey = this.datastore.key([this.config.entity, primaryKey]);

        const entities: any[] = await this.datastore.get(entityKey); // tslint:disable-line
        if (!entities || entities.length === 0) {
            return Promise.reject(new Error('No entities found.'));
        }
        const entity = entities[0];
        if (entity === undefined) {
            throw new Error('No entities found.');
        }
        return (entity) ? entity.data : {};

    }

    async save(primaryKey: string, key: string, data: object) {
        if (!this.datastore) {
            throw new Error(`Couldn't use Datastore. It has to be initialized.`);
        }
        if (!this.config.entity) {
            throw new Error(`Couldn't use Datastore. entity has to be set.`);
        }


        const entityKey = this.datastore.key([this.config.entity, primaryKey]);

        const entities: any[] = await this.datastore.get(entityKey); // tslint:disable-line

        let entity = undefined;
        if (!entities || entities.length === 0 || entities[0] === undefined) {
            entity = {
                userId: primaryKey,
            };
        } else {
            entity = entities[0];
        }


        // Don't confuse with the "data" key form the "save" method, actually this is
        // the data node necessary for datastore, whereas in the "save" method we add a second data
        // node for storing our own data.
        _set(entity, 'data.' + key, data);

        const dataStoreDataObject = {
            key: entityKey,
            data: entity,
        };
        await this.datastore.save(dataStoreDataObject);

    }

    async delete(primaryKey: string) {
        if (!this.datastore) {
            throw new Error(`Couldn't use Datastore. It has to be initialized.`);
        }
        if (!this.config.entity) {
            throw new Error(`Couldn't use Datastore. entity has to be set.`);
        }
        const entityKey = this.datastore.key([this.config.entity, primaryKey]);

        return await this.datastore.delete(entityKey);
    }

}
