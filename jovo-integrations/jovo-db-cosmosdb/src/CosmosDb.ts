import {Db, BaseApp, PluginConfig} from 'jovo-core';
import {MongoDb} from 'jovo-db-mongodb';

export class CosmosDb extends MongoDb {
    constructor() {
        super();
    }
}
