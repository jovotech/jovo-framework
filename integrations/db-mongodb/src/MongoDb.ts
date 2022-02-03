import { Db, MongoClient } from 'mongodb';
import {
  DbItem,
  DbPlugin,
  DbPluginConfig,
  HandleRequest,
  Jovo,
  PersistableSessionData,
  PersistableUserData,
  RequiredOnlyWhere,
} from '@jovotech/framework';

export interface MongoDbConfig extends DbPluginConfig {
  /** Specify username, password and clusterUrl. See https://docs.mongodb.com/drivers/node/current/fundamentals/connection/#connection-uri for more details */
  connectionString: string;
  /** The name of the database we want to use. If not provided, use database name from connection string. A new database is created if doesn't exist yet. */
  databaseName?: string;
  /** A new collection is created with that name if doesn't exist yet. */
  collectionName?: string;
}

export type MongoDbInitConfig = RequiredOnlyWhere<MongoDbConfig, 'table'>;

export interface MongoDbItem {
  id: string;
  user?: PersistableUserData;
  session?: PersistableSessionData;
  createdAt?: string;
  updatedAt?: string;
}

export class MongoDb extends DbPlugin<MongoDbConfig> {
  /** A connection promise to be reused as MongoDB best practice: https://docs.atlas.mongodb.com/best-practices-connecting-from-aws-lambda/#connection-examples */
  connectionPromise: Promise<MongoClient> | undefined;

  constructor(config: MongoDbInitConfig) {
    super(config);
  }

  getDefaultConfig(): MongoDbConfig {
    return {
      ...super.getDefaultConfig(),
      connectionString: '<YOUR-MONGODB-URI>',
      databaseName: 'jovo_sample_app_db',
      collectionName: 'users_all',
    };
  }

  mount(parent: HandleRequest): Promise<void> | void {
    super.mount(parent);
  }

  async initialize(): Promise<void> {
    try {
      this.config.databaseName = this.config.databaseName;
      this.config.collectionName = this.config.collectionName;
      this.connectionPromise = new MongoClient(this.config.connectionString).connect();
    } catch (error) {
      console.error('Error in MongoDb.initialize.', error);
      throw error;
    }
  }

  async loadData(userId: string, jovo: Jovo): Promise<void> {
    try {
      const users = await this.usersCollection();
      const filter = { _id: userId };
      const dbItem = (await users.findOne(filter)) as DbItem;
      if (dbItem) {
        jovo.$user.isNew = false;
        jovo.setPersistableData(dbItem, this.config.storedElements);
      }
    } catch (error) {
      console.error('Error in MongoDb.loadData.', error);
      throw error;
    }
  }

  async saveData(userId: string, jovo: Jovo): Promise<void> {
    try {
      const users = await this.usersCollection();
      const item: DbItem = { _id: userId };
      await this.applyPersistableData(jovo, item);
      const filter = { _id: userId };
      await users.updateOne(filter, { $set: item }, { upsert: true });
    } catch (error) {
      console.error('Error in MongoDb.saveData.', error);
      throw error;
    }
  }

  /** MongoDB creates the database if one does not already exist */
  async jovoManagedDataBase(): Promise<Db> {
    try {
      const connection = await this.connectionPromise;
      if (this.config.databaseName) {
        return connection!.db(this.config.databaseName);
      } else {
        //If not provided, use database name from connection string.
        return connection!.db();
      }
    } catch (error) {
      if (!this.config.connectionString) {
        throw new Error('this.config.connectionString must not be undefined');
      } else {
        console.error('Error establishing connection to MongoDb Database.', error);
        throw error;
      }
    }
  }

  /** MongoDB creates the collection if one does not already exist  */
  async usersCollection() {
    if (!this.config.collectionName) {
      throw new Error('this.config.collectionName must not be undefined');
    }
    const db = await this.jovoManagedDataBase();
    return db!.collection(this.config.collectionName);
  }
}
