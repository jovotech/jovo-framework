import { BaseApp } from 'jovo-core';
import { Config, MongoDb } from 'jovo-db-mongodb';
export declare class CosmosDb extends MongoDb {
    constructor(config?: Config);
    install(app: BaseApp): void;
}
