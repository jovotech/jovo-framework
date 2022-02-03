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
  /** Default database name in MongoDB. See https://docs.mongodb.com/manual/tutorial/getting-started/#getting-started */
  readonly MONGODB_DEFAULT_DATABASE_NAME = 'test';
  /** Default name for the collection */
  readonly USERS_COLLECTION_NAME_DEFAULT = 'users';

  private static instance: MongoDb;

  /** A client promise to be reused in any component following MongoDB best practice: https://docs.atlas.mongodb.com/best-practices-connecting-from-aws-lambda/#connection-examples */
  client: Promise<MongoClient> = new MongoClient(this.config.connectionString).connect();

  private constructor(config: MongoDbInitConfig) {
    super(config);
  }

  public static newInstance(config?: MongoDbInitConfig): MongoDb {
    if (config) {
      MongoDb.instance = new MongoDb(config);
      return MongoDb.instance;
    } else throw new Error('Missing needed configuration for MongoDb plugin.');
  }

  public static getInstance(): MongoDb {
    return MongoDb.instance;
  }

  getDefaultConfig(): MongoDbConfig {
    return {
      ...super.getDefaultConfig(),
      connectionString: '<YOUR-MONGODB-URI>',
      databaseName: 'jovo_db',
    };
  }

  mount(parent: HandleRequest): Promise<void> | void {
    super.mount(parent);
  }

  async initialize(): Promise<void> {
    // if no name was specified, 'test' is used.
    if ((await this.getJovoManagedDatabase()).databaseName === this.MONGODB_DEFAULT_DATABASE_NAME) {
      // eslint-disable-next-line no-console
      console.warn("Connected to default database 'test'.");
    }
  }

  async loadData(userId: string, jovo: Jovo): Promise<void> {
    const users = await MongoDb.instance.getJovoUsersCollection();
    const filter = { _id: userId };
    const dbItem = (await users.findOne(filter)) as DbItem;
    if (dbItem) {
      jovo.$user.isNew = false;
      jovo.setPersistableData(dbItem, this.config.storedElements);
    }
  }

  async saveData(userId: string, jovo: Jovo): Promise<void> {
    const users = await MongoDb.instance.getJovoUsersCollection();
    const item: DbItem = { _id: userId };
    await this.applyPersistableData(jovo, item);
    const filter = { _id: userId };
    await users.updateOne(filter, { $set: item }, { upsert: true });
  }

  /** MongoDB creates the database if one does not already exist */
  async getJovoManagedDatabase(): Promise<Db> {
    const connection = await MongoDb.instance.client;
    if (MongoDb.instance.config.databaseName) {
      return connection!.db(MongoDb.instance.config.databaseName);
    } else {
      //If not provided, use database name from connection string.
      return connection!.db();
    }
  }

  /** MongoDB creates the collection if one does not already exist  */
  async getJovoUsersCollection(): Promise<Collection<Document>> {
    const db = await MongoDb.instance.getJovoManagedDatabase();
    return db!.collection(
      MongoDb.instance.config.collectionName || this.USERS_COLLECTION_NAME_DEFAULT,
    );
  }
}
