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
  /** Default database name in MongoDB. if no name was specified, 'test' is used. See https://docs.mongodb.com/manual/tutorial/getting-started/#getting-started */
  public static readonly MONGODB_DEFAULT_DATABASE_NAME = 'test';
  public static readonly JOVO_DEFAULT_DATABASE_NAME = 'jovo_db';
  public static readonly JOVO_DEFAULT_COLLECTION_NAME = 'jovoUsers';

  /** A single client promise to be shared by Jovo and others components following MongoDB best practice: https://docs.atlas.mongodb.com/best-practices-connecting-from-aws-lambda/#connection-examples */
  readonly client: Promise<MongoClient> = new MongoClient(this.config.connectionString).connect();

  constructor(config: MongoDbInitConfig) {
    super(config);
  }

  getDefaultConfig(): MongoDbConfig {
    return {
      ...super.getDefaultConfig(),
      connectionString: '<YOUR-MONGODB-URI>',
      databaseName: MongoDb.JOVO_DEFAULT_DATABASE_NAME,
      collectionName: MongoDb.JOVO_DEFAULT_COLLECTION_NAME,
    };
  }

  mount(parent: HandleRequest): Promise<void> | void {
    super.mount(parent);
  }

  async initialize(): Promise<void> {
    if ((await this.jovoDb()).databaseName === this.MONGODB_DEFAULT_DATABASE_NAME) {
      // eslint-disable-next-line no-console
      console.warn('[MongoDB] Warning: The "test" database is being used.');
    }
  }

  async loadData(userId: string, jovo: Jovo): Promise<void> {
    const users = await this.jovoUsers();
    const filter = { _id: userId };
    const dbItem = (await users.findOne(filter)) as DbItem;
    if (dbItem) {
      jovo.$user.isNew = false;
      jovo.setPersistableData(dbItem, this.config.storedElements);
    }
  }

  async saveData(userId: string, jovo: Jovo): Promise<void> {
    const users = await this.jovoUsers();
    const item: DbItem = { _id: userId };
    await this.applyPersistableData(jovo, item);
    const filter = { _id: userId };
    await users.updateOne(filter, { $set: item }, { upsert: true });
  }

  /** MongoDB creates the database if doesn't exist yet */
  async jovoDb(): Promise<Db> {
    const connection = await this.client;
    if (this.config.databaseName) {
      return connection!.db(this.config.databaseName);
    } else {
      //If not provided, use database name from connection string.
      return connection!.db();
    }
  }

  /** MongoDB creates the collection if doesn't exist yet  */
  async jovoUsers(): Promise<Collection<Document>> {
    const db = await this.jovoDb();
    return db!.collection(this.config.collectionName!);
  }
}
