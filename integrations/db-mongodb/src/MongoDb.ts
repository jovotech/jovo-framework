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

/** This class is a Singleton and has to be instantiated using this.instance(config?) */
export class MongoDb extends DbPlugin<MongoDbConfig> {
  /** Default database name in MongoDB. if no name was specified, 'test' is used. See https://docs.mongodb.com/manual/tutorial/getting-started/#getting-started */
  readonly MONGODB_DEFAULT_DATABASE_NAME = 'test';

  private static _instance: MongoDb;

  /** A single client promise to be reused by Jovo or others components following MongoDB best practice: https://docs.atlas.mongodb.com/best-practices-connecting-from-aws-lambda/#connection-examples */
  readonly client: Promise<MongoClient> = new MongoClient(this.config.connectionString).connect();

  private constructor(config: MongoDbInitConfig) {
    super(config);
  }

  /** Attach config to instantiated the client with it, for example in your app.prod.ts. Pass no arguments if it's been already instantiated. */
  public static instance(config?: MongoDbInitConfig): MongoDb {
    if (!MongoDb._instance && !config) {
      throw new Error('Missing needed configuration for MongoDb plugin.');
    }
    MongoDb._instance = MongoDb._instance || new MongoDb(config!);
    // important to associate it with _instance before returning
    return MongoDb._instance;
  }

  getDefaultConfig(): MongoDbConfig {
    return {
      ...super.getDefaultConfig(),
      connectionString: '<YOUR-MONGODB-URI>',
      databaseName: 'jovo_db',
      collectionName: 'jovoUsers',
    };
  }

  mount(parent: HandleRequest): Promise<void> | void {
    super.mount(parent);
  }

  async initialize(): Promise<void> {
    if ((await this.jovoDb()).databaseName === this.MONGODB_DEFAULT_DATABASE_NAME) {
      // eslint-disable-next-line no-console
      console.warn(
        '[MongoDB] URI does not have the DB in it, and no databaseName provided to the instance. Using default name: test.',
      );
    }
  }

  async loadData(userId: string, jovo: Jovo): Promise<void> {
    const users = await MongoDb._instance.jovoUsers();
    const filter = { _id: userId };
    const dbItem = (await users.findOne(filter)) as DbItem;
    if (dbItem) {
      jovo.$user.isNew = false;
      jovo.setPersistableData(dbItem, this.config.storedElements);
    }
  }

  async saveData(userId: string, jovo: Jovo): Promise<void> {
    const users = await MongoDb._instance.jovoUsers();
    const item: DbItem = { _id: userId };
    await this.applyPersistableData(jovo, item);
    const filter = { _id: userId };
    await users.updateOne(filter, { $set: item }, { upsert: true });
  }

  /** MongoDB creates the database if one does not already exist */
  async jovoDb(): Promise<Db> {
    const connection = await MongoDb._instance.client;
    if (MongoDb._instance.config.databaseName) {
      return connection!.db(MongoDb._instance.config.databaseName);
    } else {
      //If not provided, use database name from connection string.
      return connection!.db();
    }
  }

  /** MongoDB creates the collection if one does not already exist  */
  async jovoUsers(): Promise<Collection<Document>> {
    const db = await MongoDb._instance.jovoDb();
    return db!.collection(MongoDb._instance.config.collectionName!);
  }
}
