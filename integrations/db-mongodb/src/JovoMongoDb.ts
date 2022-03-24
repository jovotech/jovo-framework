import { MongoDb, MongoDbConfig } from './MongoDb';
import { Collection, Db, Document, MongoClient } from 'mongodb';

export class JovoMongoDb {
  constructor(readonly mongoDb: MongoDb) {}

  get config(): MongoDbConfig {
    return this.mongoDb.config;
  }

  getClient(): Promise<MongoClient> {
    return this.mongoDb.client;
  }

  getDb(): Promise<Db> {
    return this.mongoDb.getDb();
  }

  getCollection(): Promise<Collection<Document>> {
    return this.mongoDb.getCollection();
  }
}
