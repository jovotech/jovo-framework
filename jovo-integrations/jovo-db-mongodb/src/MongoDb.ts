import {Db, BaseApp, PluginConfig, JovoError, ErrorCode} from 'jovo-core';
import _merge = require('lodash.merge');
import _get = require('lodash.get');
import {MongoClient} from 'mongodb';

export interface Config extends PluginConfig {
    uri?: string;
    databaseName?: string;
    collectionName?: string;
    primaryKeyColumn?: string;
}

export class MongoDb implements Db {
    config: Config = {
        uri: undefined,
        databaseName: undefined,
        collectionName: 'UserData',
        primaryKeyColumn: 'userId',
    };
    needsWriteFileAccess = false;
    isCreating = false;

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
    }

    uninstall(app: BaseApp) {
    }

    errorHandling() {
        if (!this.config.uri) {
            throw new JovoError(
                'uri has to be set.',
                ErrorCode.ERR_PLUGIN,
                'jovo-db-mongodb',
                undefined,
                undefined,
                'https://www.jovo.tech/docs/databases/mongodb'
            );
        }

        if (!this.config.primaryKeyColumn) {
            throw new JovoError(
                'primaryKeyColumn has to be set.',
                ErrorCode.ERR_PLUGIN,
                'jovo-db-mongodb',
                undefined,
                undefined,
                'https://www.jovo.tech/docs/databases/mongodb'
            );
        }

        if (!this.config.databaseName) {
            throw new JovoError(
                'databaseName has to be set.',
                ErrorCode.ERR_PLUGIN,
                'jovo-db-mongodb',
                undefined,
                undefined,
                'https://www.jovo.tech/docs/databases/mongodb'
            );
        }

        if (!this.config.collectionName) {
            throw new JovoError(
                'collectionName has to be set.',
                ErrorCode.ERR_PLUGIN,
                'jovo-db-mongodb',
                undefined,
                undefined,
                'https://www.jovo.tech/docs/databases/mongodb'
            );
        }
    }

    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    async load(primaryKey: string): Promise<any> { // tslint:disable-line
        this.errorHandling();

        try {
            const client = await MongoClient.connect(this.config.uri!, {useNewUrlParser: true});
            const collection = client.db(this.config.databaseName!).collection(this.config.collectionName!);
            const doc = await collection.findOne({userId: primaryKey});
            await client.close();
            return doc;
        } catch (e) {
            throw new JovoError(
                e.message,
                ErrorCode.ERR_PLUGIN,
                'jovo-db-mongodb',
                undefined,
                'Make sure the configuration you provided is valid.',
                'https://www.jovo.tech/docs/databases/mongodb'
            );
        }
    }

    async save(primaryKey: string, key: string, data: any) { // tslint:disable-line
        this.errorHandling();

        try {
            const client = await MongoClient.connect(this.config.uri!, {useNewUrlParser: true});
            const collection = client.db(this.config.databaseName!).collection(this.config.collectionName!);
            const item = {
                $set: {
                    [this.config.primaryKeyColumn!]: primaryKey,
                    [key]: data
                }
            };
            await collection.updateOne({userId: primaryKey}, item, {upsert: true});
            await client.close();
        } catch (e) {
            throw new JovoError(
                e.message,
                ErrorCode.ERR_PLUGIN,
                'jovo-db-mongodb',
                undefined,
                'Make sure the configuration you provided is valid.',
                'https://www.jovo.tech/docs/databases/mongodb'
            );
        }
    }

    async delete(primaryKey: string) {
        this.errorHandling();

        try {
            const client = await MongoClient.connect(this.config.uri!, {useNewUrlParser: true});
            const collection = client.db(this.config.databaseName!).collection(this.config.collectionName!);
            await collection.deleteOne({userId: primaryKey});
            await client.close();
        } catch (e) {
            throw new JovoError(
                e.message,
                ErrorCode.ERR_PLUGIN,
                'jovo-db-mongodb',
                undefined,
                'Make sure the configuration you provided is valid.',
                'https://www.jovo.tech/docs/databases/mongodb'
            );
        }
    }
}
