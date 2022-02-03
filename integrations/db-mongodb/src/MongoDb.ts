import { Collection, Db, Document, MongoClient } from 'mongodb';
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
  /** Specify username, password and clusterUrl. Additional parameters can also be added. See https://docs.mongodb.com/drivers/node/current/fundamentals/connection/#connection-uri for more details */
  connectionString: string;
  /** The name of the database we want to use. If not provided, use database name from connection string. A new database is created if doesn't exist yet. */
  databaseName?: string;
  /** A new collection is created with that name if doesn't exist yet. */
  collectionName?: string;
}

export type MongoDbInitConfig = RequiredOnlyWhere<MongoDbConfig, 'connectionString'>;

export interface MongoDbItem {
  id: string;
  user?: PersistableUserData;
  session?: PersistableSessionData;
  createdAt?: string;
  updatedAt?: string;
}

export class MongoDb extends DbPlugin<MongoDbConfig> {
  /** Default name for the collection */
  readonly DEFAULT_USERS_COLLECTION_NAME = 'users_all';

  /** A connection promise to be reused as MongoDB best practice: https://docs.atlas.mongodb.com/best-practices-connecting-from-aws-lambda/#connection-examples */
  connectionPromise: Promise<MongoClient> | undefined;

  constructor(config: MongoDbInitConfig) {
    super(config);
  }

  getDefaultConfig(): MongoDbConfig {
    return {
      ...super.getDefaultConfig(),
      connectionString: '<YOUR-MONGODB-URI>',
    };
  }

  mount(parent: HandleRequest): Promise<void> | void {
    super.mount(parent);
  }

  async initialize(): Promise<void> {
    this.connectionPromise = new MongoClient(this.config.connectionString).connect();
  }

  async loadData(userId: string, jovo: Jovo): Promise<void> {
    const users = await this.jovoManagedUsersCollection();
    const filter = { _id: userId };
    const dbItem = (await users.findOne(filter)) as DbItem;
    if (dbItem) {
      jovo.$user.isNew = false;
      jovo.setPersistableData(dbItem, this.config.storedElements);
    }
  }

  async saveData(userId: string, jovo: Jovo): Promise<void> {
    const users = await this.jovoManagedUsersCollection();
    const item: DbItem = { _id: userId };
    await this.applyPersistableData(jovo, item);
    const filter = { _id: userId };
    await users.updateOne(filter, { $set: item }, { upsert: true });
  }

  /** MongoDB creates the database if one does not already exist */
  async jovoManagedDataBase(): Promise<Db> {
    const connection = await this.connectionPromise;
    if (this.config.databaseName) {
      return connection!.db(this.config.databaseName);
    } else {
      //If not provided, use database name from connection string.
      return connection!.db();
    }
  }

  /** MongoDB creates the collection if one does not already exist  */
  async jovoManagedUsersCollection(): Promise<Collection<Document>> {
    const db = await this.jovoManagedDataBase();
    return db!.collection(this.config.collectionName || this.DEFAULT_USERS_COLLECTION_NAME);
  }

  /** Returns the collection passed as argument. MongoDB creates the collection if one does not already exist (in the database specified in MongoDbConfig).*/
  async collection(collectionName: string): Promise<Collection<Document>> {
    if (!collectionName) {
      throw new Error('collectionName must not be undefined');
    }
    const db = await this.jovoManagedDataBase();
    return db!.collection(collectionName);
  }
}
