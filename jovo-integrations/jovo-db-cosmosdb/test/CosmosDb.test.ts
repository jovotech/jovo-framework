import { BaseApp, JovoError } from "jovo-core";
import { CosmosDb } from "../src/CosmosDb";
import {MongoClient} from  "mongodb";
import MongoMemoryServer from 'mongodb-memory-server';
import _set = require('lodash.set');

jest.setTimeout(600000);

describe('test install()', () => {
    describe('test install() setting app.$db', () => {
        test('test should set app.$db to be CosmosDb if no default db was set in config', () => {
            const cosmosdb = new CosmosDb();
            const app = new BaseApp();

            cosmosdb.install(app);

            expect(app.$db).toBeInstanceOf(CosmosDb);
        });

        test('test app.$db should not be an instance of CosmosDb if default db set in config is not CosmosDb', () => {
            const cosmosdb = new CosmosDb();
            const app = new BaseApp();
            _set(app.config, 'db.default', 'test');

            cosmosdb.install(app);

            expect(app.$db).not.toBeInstanceOf(CosmosDb);
        });

        test('test app.$db should be an instance CosmosDb if default db is set to CosmosDb', () => {
            const cosmosdb = new CosmosDb();
            const app = new BaseApp();
            _set(app.config, 'db.default', 'CosmosDb');

            cosmosdb.install(app);

            expect(app.$db).toBeInstanceOf(CosmosDb);
        });
    });
});

describe('test errorHandling() which checks config parameters', () => {
    test('test should throw an error if uri isn\'t set', () => {
        const config = {
            databaseName: 'test',
            collectionName: 'UserData',
            primaryKeyColumn: 'userId'
        };
        const cosmosdb = new CosmosDb(config);

        expect(() => {
            cosmosdb.errorHandling();
        }).toThrow(Error);
    });

    test('test should throw an error if databaseName isn\'t set', () => {
        const config = {
            uri: 'test',
            collectionName: 'UserData',
            primaryKeyColumn: 'userId'
        };
        const cosmosdb = new CosmosDb(config);

        expect(() => {
            cosmosdb.errorHandling();
        }).toThrow(Error);
    });

    test('test should throw an error if primaryKeyColumn isn\'t set', () => {
        const config = {
            uri: 'test',
            databaseName: 'test',
            primaryKeyColumn: '',
            collectionName: 'UserData'
        };
        const cosmosdb = new CosmosDb(config);

        expect(() => {
            cosmosdb.errorHandling();
        }).toThrow(Error);
    });

    test('test should throw an error if collectionName isn\'t set', () => {
        const config = {
            uri: 'test',
            databaseName: 'test',
            primaryKeyColumn: 'userId',
            collectionName: ''
        };
        const cosmosdb = new CosmosDb(config);

        expect(() => {
            cosmosdb.errorHandling();
        }).toThrow(Error);
    });

    test('test shouldn\'t throw an error if config is valid', () => {
        const config = {
            uri: 'test',
            databaseName: 'test',
            primaryKeyColumn: 'userId',
            collectionName: 'UserData'
        };
        const cosmosdb = new CosmosDb(config);

        expect(() => {
            cosmosdb.errorHandling();
        }).not.toThrow(Error);
    });
});

describe('test database operations', () => {
    let mongoServer: MongoMemoryServer;
    let cosmosdb: CosmosDb;
    let config: any = {
        databaseName: 'test',
        primaryKeyColumn: 'userId',
        collectionName: 'UserData'
    };

    beforeEach(async () => {
        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getConnectionString();
        config.uri = mongoUri;
        cosmosdb = new CosmosDb(config);
    });

    afterEach(async () => {
        if (mongoServer) {
            await mongoServer.stop();
        }
    });

    async function save(primaryKey: string, key: string, data: any) {
        const client = await MongoClient.connect(config.uri!, {useNewUrlParser: true});
        const collection = client.db(config.databaseName!).collection(config.collectionName!);
        const item = {
            $set: {
                [config.primaryKeyColumn!]: primaryKey,
                [key]: data
            }
        };
        await collection.updateOne({userId: primaryKey}, item, {upsert: true});
        await client.close();
    }
    
    async function load(primaryKey: string) {
        const client = await MongoClient.connect(config.uri!, {useNewUrlParser: true});
        const collection = client.db(config.databaseName!).collection(config.collectionName!);
        const doc = await collection.findOne({userId: primaryKey});
        await client.close();
        return doc;
    }

    describe('test save()', () => {
        test('test should save primaryKey as value of cosmosdb.config.primaryKeyColumn', async () => {
            const primaryKey = 'idTest';
            const object = {
                key: {
                    key: 'value'
                }
            };

            await cosmosdb.save(primaryKey, 'key', object.key);
            const result = await load(primaryKey);

            expect(result[cosmosdb.config.primaryKeyColumn!]).toEqual(primaryKey);
        });

        test('test should save key value pair for primaryKey', async () => {
            const primaryKey = 'idTest';
            const object = {
                key: {
                    key: 'value'
                }
            };

            await cosmosdb.save(primaryKey, 'key', object.key);
            const result = await load(primaryKey);

            expect(result.key).toEqual(object.key);
        });

        test('test should add new key-value pair to existing userData without removing anything', async () => {
            const primaryKey = 'idTest';
            const existingObject = {
                oldKey: {
                    key: 'value'
                }
            };
            const newObject = {
                newKey: {
                    key: 'value'
                }
            }

            await cosmosdb.save(primaryKey, 'oldKey', existingObject.oldKey);
            await cosmosdb.save(primaryKey, 'newKey', newObject.newKey);
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
                    key: 'value'
                }
            };

            await cosmosdb.save(primaryKeyOne, 'key', object.key);
            await cosmosdb.save(primaryKeyTwo, 'key', object.key);
            const userOneData = await load(primaryKeyOne);
            const userTwoData = await load(primaryKeyTwo);
            
            expect(userOneData.key).toEqual(object.key);
            expect(userTwoData.key).toEqual(object.key);
        });

        test('test save() should reject JovoError if saving process fails', async () => {
            // In this case the uri does not connect to an actual cosmosdb instance
            _set(cosmosdb.config, 'uri', 'xyz');
            
            await cosmosdb.save('userId', 'key', {key: 'value'})
                .catch(e => expect(e).toBeInstanceOf(JovoError));
        });
    });

    describe('test delete()', () => {
        test('test should delete previously saved data', async () => {
            const primaryKey = 'idTest';

            await save(primaryKey, 'key', {key: 'value'});
            const result = await load(primaryKey);

            expect(result).not.toBeNull();

            await cosmosdb.delete(primaryKey);
            const afterDelete = await load(primaryKey);

            expect(afterDelete).toBeNull();
        });

        test('test should not delete anything if primaryKey (user) doesn\'t exist', async () => {
            const primaryKey = 'idTest';
            await save(primaryKey, 'key', {key: 'value'});

            const result = await load(primaryKey);
            expect(result).not.toBeNull();

            await cosmosdb.delete('xyz');

            const afterDelete = await load(primaryKey);
            expect(afterDelete).not.toBeNull();
        });

        test('test delete() should reject JovoError if deleting process fails', async () => {
            // In this case the uri does not connect to an actual cosmosdb instance
            _set(cosmosdb.config, 'uri', 'xyz');
            
            await cosmosdb.delete('userId')
                .catch(e => expect(e).toBeInstanceOf(JovoError));
        });
    });

    describe('test load()', async () => {
        test('test should load data', async () => {
            const primaryKey = 'idTest';
            await save(primaryKey, 'key', {key: 'value'});

            const data = await cosmosdb.load(primaryKey);
            expect(data.key).toEqual({key: 'value'});
        });
    
        test('test should return undefined if there is no data for that user', async () => {
            const loadedObject = await cosmosdb.load('xyz');
    
            expect(loadedObject).toBeNull();
        });

        test('test load() should reject JovoError if loading process fails', async () => {
            // In this case the uri does not connect to an actual cosmosdb instance
            _set(cosmosdb.config, 'uri', 'xyz');
            
            await cosmosdb.load('userId')
                .catch(e => expect(e).toBeInstanceOf(JovoError));
        });
    });
});

