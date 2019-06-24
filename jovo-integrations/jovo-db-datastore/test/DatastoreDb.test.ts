import Datastore = require('@google-cloud/datastore');
import { BaseApp, JovoError } from 'jovo-core';
import _set = require('lodash.set'); // tslint:disable-line:no-implicit-dependencies

import { DatastoreDb } from '../src/DatastoreDb';

describe('test install()', () => {
    test('should assign new Datastore to datastore property', () => {
        const datastoreDb = new DatastoreDb();
        const app = new BaseApp();

        datastoreDb.install(app);

        expect(datastoreDb.datastore).toBeInstanceOf(Datastore);
    });

    describe('test install() setting app.$db', () => {
        test('test should set app.$db to be DatastoreDb if no default db was set in config', () => {
            const datastoreDb = new DatastoreDb();
            const app = new BaseApp();

            datastoreDb.install(app);

            expect(app.$db).toBeInstanceOf(DatastoreDb);
        });

        test('test app.$db should not be an instance of DatastoreDb if default db set in config is not DatastoreDb', () => {
            const datastoreDb = new DatastoreDb();
            const app = new BaseApp();
            _set(app.config, 'db.default', 'test');

            datastoreDb.install(app);

            expect(app.$db).not.toBeInstanceOf(DatastoreDb);
        });

        test('test app.$db should be an instance DatastoreDb if default db is set to DatastoreDb', () => {
            const datastoreDb = new DatastoreDb();
            const app = new BaseApp();
            _set(app.config, 'db.default', 'DatastoreDb');

            datastoreDb.install(app);

            expect(app.$db).toBeInstanceOf(DatastoreDb);
        });
    });
});

describe('test errorHandling()', () => {
    let datastoreDb: DatastoreDb;

    beforeEach(() => {
        datastoreDb = new DatastoreDb();
    });

    // entity & primaryKeyColumn have default values, which are truthy
    test('should throw JovoError because config.entity is undefined', () => {
        _set(datastoreDb.config, 'entity', undefined);
        _set(datastoreDb, 'datastore', true);

        expect(() => {
            datastoreDb.errorHandling();
        }).toThrowError(JovoError);
    });

    test('should throw JovoError because datastore is undefined', () => {
        _set(datastoreDb, 'datastore', undefined);

        expect(() => {
            datastoreDb.errorHandling();
        }).toThrowError(JovoError);
    });

    test('should throw JovoError because primaryKeyColumn is undefined', () => {
        _set(datastoreDb.config, 'primaryKeyColumn', undefined);
        _set(datastoreDb, 'datastore', true);

        expect(() => {
            datastoreDb.errorHandling();
        }).toThrowError(JovoError);
    });
});

describe('test database operations', () => {
    let datastoreDb: DatastoreDb;

    beforeEach(() => {
        datastoreDb = new DatastoreDb();
    });

    describe('test save()', () => {
        test('should call errorHandling()', async () => {
            const obj = {
                get: jest.fn().mockResolvedValue([]),
                key: jest.fn(),
                save: jest.fn(),
            };
            _set(datastoreDb, 'datastore', obj);
            jest.spyOn(datastoreDb, 'errorHandling');

            await datastoreDb.save('id', 'key', 'value');

            expect(datastoreDb.errorHandling).toHaveBeenCalledTimes(1);
        });

        test('should load the current user data using datastore.get()', async () => {
            const getMock = jest.fn().mockResolvedValue([]);
            const obj = {
                get: getMock,
                key: jest.fn(),
                save: jest.fn(),
            };
            _set(datastoreDb, 'datastore', obj);

            await datastoreDb.save('id', 'key', 'value');

            expect(getMock).toHaveBeenCalledTimes(1);
        });

        test('should keep prior data while saving', async () => {
            const obj = {
                get: jest.fn().mockResolvedValue([ {
                    [ datastoreDb.config.primaryKeyColumn! ]: 'id',
                    data: {
                        oldKey: 'oldValue',
                    },
                } ]),
                key: jest.fn().mockReturnValue('entityKey'),
                save: jest.fn(),
            };
            _set(datastoreDb, 'datastore', obj);

            await datastoreDb.save('id', 'key', 'value');

            // oldKey & oldValue as well as key & value should be present
            expect(datastoreDb.datastore!.save).toHaveBeenCalledWith({
                data: {
                    [ datastoreDb.config.primaryKeyColumn! ]: 'id',
                    data: {
                        key: 'value',
                        oldKey: 'oldValue',
                    },
                },
                key: 'entityKey',
            });
        });

        test('should create new object with "primaryKey" set as the value for "primaryKeyColumn"', async () => {
            const obj = {
                get: jest.fn().mockResolvedValue([]),
                key: jest.fn().mockReturnValue('entityKey'),
                save: jest.fn(),
            };
            _set(datastoreDb, 'datastore', obj);

            await datastoreDb.save('id', 'key', 'value');

            // oldKey & oldValue as well as key & value should be present
            expect(datastoreDb.datastore!.save).toHaveBeenCalledWith({
                data: {
                    [ datastoreDb.config.primaryKeyColumn! ]: 'id',
                    data: {
                        key: 'value',
                    },
                },
                key: 'entityKey',
            });
        });
    });

    describe('test load()', () => {
        test('should call errorHandling()', async () => {
            const mockDatastore = {
                get: jest.fn().mockResolvedValue([]),
                key: jest.fn(),
            };
            _set(datastoreDb, 'datastore', mockDatastore);
            jest.spyOn(datastoreDb, 'errorHandling');

            await datastoreDb.load('id');

            expect(datastoreDb.errorHandling).toHaveBeenCalledTimes(1);
        });

        test('should return empty object because there was no data for that user', async () => {
            const mockDatastore = {
                get: jest.fn().mockResolvedValue([]),
                key: jest.fn(),
            };
            _set(datastoreDb, 'datastore', mockDatastore);

            const result = await datastoreDb.load('id');

            expect(result).toEqual({});
        });

        test('should return user data', async () => {
            const mockDatastore = {
                get: jest.fn().mockResolvedValue([ {data: {key: 'value'}} ]),
                key: jest.fn(),
            };
            _set(datastoreDb, 'datastore', mockDatastore);

            const result = await datastoreDb.load('id');

            expect(result).toEqual({key: 'value'});
        });
    });

    describe('test delete()', () => {
        test('should call errorHandling()', async () => {
            const mockDatastore = {
                delete: jest.fn().mockResolvedValue('test'),
                key: jest.fn(),
            };
            _set(datastoreDb, 'datastore', mockDatastore);
            jest.spyOn(datastoreDb, 'errorHandling');

            await datastoreDb.delete('id');

            expect(datastoreDb.errorHandling).toHaveBeenCalledTimes(1);
        });

        test('should return the api response', async () => {
            const mockDatastore = {
                delete: jest.fn().mockResolvedValue('test'),
                key: jest.fn(),
            };
            _set(datastoreDb, 'datastore', mockDatastore);

            const result = await datastoreDb.delete('id');

            expect(result).toBe('test');
        });
    });
});
