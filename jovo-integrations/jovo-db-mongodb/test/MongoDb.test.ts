import { BaseApp, JovoError } from 'jovo-core';
import _set = require('lodash.set');
import { MongoClient } from 'mongodb';
import MongoMemoryServer from 'mongodb-memory-server'; // tslint:disable-line:no-implicit-dependencies

import { MongoDb } from '../src/MongoDb';

process.env.NODE_ENV = 'UNIT_TEST';

jest.setTimeout(600000);

describe('test install()', () => {
  describe('test install() setting app.$db', () => {
    const mockGetConnectedMongoClient = jest.fn().mockResolvedValue('mock');

    test('test should set app.$db to be MongoDb if no default db was set in config', async () => {
      const mongodb = new MongoDb();
      _set(mongodb, 'getConnectedMongoClient', mockGetConnectedMongoClient);
      _set(mongodb, 'errorHandling', jest.fn());
      const app = new BaseApp();

      await mongodb.install(app);

      expect(app.$db).toBeInstanceOf(MongoDb);
    });

    test('test app.$db should not be an instance of MongoDb if default db set in config is not MongoDb', async () => {
      const mongodb = new MongoDb();
      _set(mongodb, 'getConnectedMongoClient', mockGetConnectedMongoClient);
      _set(mongodb, 'errorHandling', jest.fn());
      const app = new BaseApp();
      _set(app.config, 'db.default', 'test');

      await mongodb.install(app);

      expect(app.$db).not.toBeInstanceOf(MongoDb);
    });

    test('test app.$db should be an instance MongoDb if default db is set to MongoDb', async () => {
      const mongodb = new MongoDb();
      _set(mongodb, 'getConnectedMongoClient', mockGetConnectedMongoClient);
      _set(mongodb, 'errorHandling', jest.fn());
      const app = new BaseApp();
      _set(app.config, 'db.default', 'MongoDb');

      await mongodb.install(app);

      expect(app.$db).toBeInstanceOf(MongoDb);
    });
  });
});

describe('test errorHandling() which checks config parameters', () => {
  test(`test should throw a JovoError if uri isn't set`, () => {
    const config = {
      collectionName: 'UserData',
      databaseName: 'test',
      primaryKeyColumn: 'userId',
      uri: '',
    };
    const mongodb = new MongoDb(config);

    expect(() => {
      mongodb.errorHandling();
    }).toThrow(JovoError);
  });

  test(`test should throw a JovoError if databaseName isn't set`, () => {
    const config = {
      collectionName: 'UserData',
      databaseName: '',
      primaryKeyColumn: 'userId',
      uri: 'test',
    };
    const mongodb = new MongoDb(config);

    expect(() => {
      mongodb.errorHandling();
    }).toThrow(JovoError);
  });

  test(`test should throw a JovoError if primaryKeyColumn isn't set`, () => {
    const config = {
      collectionName: 'UserData',
      databaseName: 'test',
      primaryKeyColumn: '',
      uri: 'test',
    };
    const mongodb = new MongoDb(config);

    expect(() => {
      mongodb.errorHandling();
    }).toThrow(JovoError);
  });

  test(`test should throw a JovoError if collectionName isn't set`, () => {
    const config = {
      collectionName: '',
      databaseName: 'test',
      primaryKeyColumn: 'userId',
      uri: 'test',
    };
    const mongodb = new MongoDb(config);

    expect(() => {
      mongodb.errorHandling();
    }).toThrow(JovoError);
  });

  test(`test shouldn't throw a JovoError if config is valid`, () => {
    const config = {
      collectionName: 'UserData',
      databaseName: 'test',
      primaryKeyColumn: 'userId',
      uri: 'test',
    };
    const mongodb = new MongoDb(config);

    expect(() => {
      mongodb.errorHandling();
    }).not.toThrow(JovoError);
  });
});

describe('test database operations', () => {
  let mongoServer: MongoMemoryServer;
  let mongodb: MongoDb;
  const app = new BaseApp();
  const config: any = {
    collectionName: 'UserData',
    // tslint:disable-line
    databaseName: 'test',
    primaryKeyColumn: 'userId',
  };

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    config.uri = mongoUri;
    mongodb = new MongoDb(config);
    await mongodb.install(app);
  });

  afterEach(async () => {
    await mongoServer.stop();
  });

  async function save(primaryKey: string, key: string, data: any) {
    // tslint:disable-line
    const client = await MongoClient.connect(config.uri!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const collection = client.db(config.databaseName!).collection(config.collectionName!);
    const item = {
      $set: {
        [config.primaryKeyColumn!]: primaryKey,
        [key]: data,
      },
    };

    await collection.updateOne({ userId: primaryKey }, item, { upsert: true });
  }

  async function load(primaryKey: string) {
    const client = await MongoClient.connect(config.uri!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const collection = client.db(config.databaseName!).collection(config.collectionName!);
    const doc = await collection.findOne({ userId: primaryKey });

    return doc;
  }

  describe('test save()', () => {
    test('test should save primaryKey as value of mongodb.config.primaryKeyColumn', async () => {
      const primaryKey = 'idTest';
      const object = {
        key: {
          key: 'value',
        },
      };

      await mongodb.save(primaryKey, 'key', object.key);
      const result = await load(primaryKey);

      expect(result[mongodb.config.primaryKeyColumn!]).toEqual(primaryKey);
    });

    test('test should save key value pair for primaryKey', async () => {
      const primaryKey = 'idTest';
      const object = {
        key: {
          key: 'value',
        },
      };

      await mongodb.save(primaryKey, 'key', object.key);
      const result = await load(primaryKey);

      expect(result.key).toEqual(object.key);
    });

    test('test should add new key-value pair to existing userData without removing anything', async () => {
      const primaryKey = 'idTest';
      const existingObject = {
        oldKey: {
          key: 'value',
        },
      };
      const newObject = {
        newKey: {
          key: 'value',
        },
      };

      await mongodb.save(primaryKey, 'oldKey', existingObject.oldKey);
      await mongodb.save(primaryKey, 'newKey', newObject.newKey);
      const result = await load(primaryKey);

      // old user data still exists
      expect(result.oldKey).toEqual(existingObject.oldKey);
      // new user data also exists
      expect(result.newKey).toEqual(newObject.newKey);
    });

    test('test should add new object for new primaryKey (new user) and keep the existing data', async () => {
      const primaryKeyOne = 'userOne';
      const primaryKeyTwo = 'userTwo';
      const object = {
        key: {
          key: 'value',
        },
      };

      await mongodb.save(primaryKeyOne, 'key', object.key);
      await mongodb.save(primaryKeyTwo, 'key', object.key);
      const userOneData = await load(primaryKeyOne);
      const userTwoData = await load(primaryKeyTwo);

      expect(userOneData.key).toEqual(object.key);
      expect(userTwoData.key).toEqual(object.key);
    });

    test('test save() should reject JovoError if saving process fails', async () => {
      // In this case the uri does not connect to an actual mongodb instance
      _set(mongodb.config, 'uri', 'xyz');

      await mongodb
        .save('userId', 'key', { key: 'value' })
        .catch((e) => expect(e).toBeInstanceOf(JovoError));
    });
  });

  describe('test delete()', () => {
    test('test should delete previously saved data', async () => {
      const primaryKey = 'idTest';

      await save(primaryKey, 'key', { key: 'value' });
      const result = await load(primaryKey);

      expect(result).not.toBeNull();

      await mongodb.delete(primaryKey);
      const afterDelete = await load(primaryKey);

      expect(afterDelete).toBeNull();
    });

    test(`test should not delete anything if primaryKey (user) doesn't exist`, async () => {
      const primaryKey = 'idTest';
      await save(primaryKey, 'key', { key: 'value' });

      const result = await load(primaryKey);
      expect(result).not.toBeNull();

      await mongodb.delete('xyz');

      const afterDelete = await load(primaryKey);
      expect(afterDelete).not.toBeNull();
    });

    test('test delete() should reject JovoError if deleting process fails', async () => {
      // In this case the uri does not connect to an actual mongodb instance
      _set(mongodb.config, 'uri', 'xyz');

      await mongodb.delete('userId').catch((e) => expect(e).toBeInstanceOf(JovoError));
    });
  });

  describe('test load()', () => {
    test('test should load data', async () => {
      const primaryKey = 'idTest';
      await save(primaryKey, 'key', { key: 'value' });

      const data = await mongodb.load(primaryKey);
      expect(data.key).toEqual({ key: 'value' });
    });

    test('test should return undefined if there is no data for that user', async () => {
      const loadedObject = await mongodb.load('xyz');

      expect(loadedObject).toBeNull();
    });

    test('test load() should reject JovoError if loading process fails', async () => {
      // In this case the uri does not connect to an actual mongodb instance
      _set(mongodb.config, 'uri', 'xyz');

      await mongodb.load('userId').catch((e) => expect(e).toBeInstanceOf(JovoError));
    });
  });
});
