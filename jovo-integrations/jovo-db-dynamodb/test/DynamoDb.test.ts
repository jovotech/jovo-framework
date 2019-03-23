import {DynamoDb} from "../src/DynamoDb";
import {BaseApp, JovoError} from "jovo-core";
import _set = require('lodash.set');
import _get = require('lodash.get');

import * as AWS from 'aws-sdk';

// const AWSMock = jest.genMockFromModule('aws-sdk');
jest.mock('aws-sdk');

describe('test install()', () => {
    describe('test install() setting app.$db', () => {
        test('test should set app.$db to be DynamoDb if no default db was set in config', () => {
            const dynamoDb = new DynamoDb();
            const app = new BaseApp();

            dynamoDb.install(app);

            expect(app.$db).toBeInstanceOf(DynamoDb);
        });

        test('test app.$db should not be an instance of DynamoDb if default db set in config is not DynamoDb', () => {
            const dynamoDb = new DynamoDb();
            const app = new BaseApp();
            _set(app.config, 'db.default', 'test');

            dynamoDb.install(app);

            expect(app.$db).not.toBeInstanceOf(DynamoDb);
        });

        test('test app.$db should be an instance DynamoDb if default db is set to DynamoDb', () => {
            const dynamoDb = new DynamoDb();
            const app = new BaseApp();
            _set(app.config, 'db.default', 'DynamoDb');

            dynamoDb.install(app);

            expect(app.$db).toBeInstanceOf(DynamoDb);
        });
    });

    describe('test install() merging awsConfig', () => {
        let dynamoDb: DynamoDb;
        let app: BaseApp;
        test('should merge dynamoDbConfig with awsConfig', () => {
            const config = {
                awsConfig: {
                    params: {
                        key: 'value'
                    }
                },
                dynamoDbConfig: {
                    endpoint: 'value'
                }
            };
            const mergedConfig = {
                params: {
                    key: 'value'
                },
                endpoint: 'value'
            }
            dynamoDb = new DynamoDb(config);
            app = new BaseApp();
            dynamoDb.install(app);

            const dynamoDbConfig = _get(dynamoDb.config, 'dynamoDbConfig');

            expect(dynamoDbConfig).toEqual(mergedConfig);
        });

        test('should merge documentClientConfig with awsConfig', () => {
            const config = {
                awsConfig: {
                    params: {
                        key: 'value'
                    }
                },
                documentClientConfig: {
                    convertEmptyValues: false
                }
            };
            const mergedConfig = {
                params: {
                    key: 'value'
                },
                convertEmptyValues: false
            }
            dynamoDb = new DynamoDb(config);
            app = new BaseApp();
            dynamoDb.install(app);

            const documentClientConfig = _get(dynamoDb.config, 'documentClientConfig');

            expect(documentClientConfig).toEqual(mergedConfig);
        });
    });

    describe('test install() setting up AWSXrax if included in config', () => {
        test('test should throw Error because aws-xray-sdk-core package isn\'t installed', () => {
            const config = {
                awsXray: true
            }
            const dynamoDb = new DynamoDb(config);
            const app = new BaseApp();
            
            expect(() => {
                dynamoDb.install(app)
            }).toThrowError(JovoError);
        });
    });

    describe('test install() setting up dax if included in config', () => {
        test('test should throw error because config.awsXray is true', () => {
            const config = {
                dax: {
                    endpoint: ['1', '2'],
                    region: 'one'
                },
                awsXray: true
            };
            const dynamoDb = new DynamoDb(config);
            const app = new BaseApp();

            expect(() => {
                dynamoDb.install(app)
            }).toThrowError(JovoError);
        });

        test('test should throw Error because amazon-dax-client package isn\'t installed', () => {
            const config = {
                dax: {
                    endpoint: ['1', '2'],
                    region: 'one'
                }
            }
            const dynamoDb = new DynamoDb(config);
            const app = new BaseApp();
            
            expect(() => {
                dynamoDb.install(app)
            }).toThrowError(JovoError);
        });
    });
});


describe('test errorHandling()', () => {
    let dynamoDb: DynamoDb;
    let app: BaseApp;
    const config = {
        tableName: 'test'
    }

    test('test should throw JovoError if tableName is missing in config', async () => {
        dynamoDb = new DynamoDb();
        app = new BaseApp();
        dynamoDb.install(app);

        await dynamoDb.save('id', 'key', {key: 'value'})
            .catch(e => expect(e).toBeInstanceOf(JovoError));
    });

    test('test should throw JovoError if docClient is not initialized', async () => {
        dynamoDb = new DynamoDb(config);
        app = new BaseApp();
        dynamoDb.install(app);

        _set(dynamoDb, 'docClient', undefined);

        await dynamoDb.save('id', 'key', {key: 'value'})
            .catch(e => expect(e).toBeInstanceOf(JovoError))
    });

    test('test should throw JovoError if primaryKeyColumn is undefined', async () => {
        dynamoDb = new DynamoDb(config);
        app = new BaseApp();
        dynamoDb.install(app);

        _set(dynamoDb.config, 'primaryKeyColumn', undefined);

        await dynamoDb.save('id', 'key', {key: 'value'})
            .catch(e => expect(e).toBeInstanceOf(JovoError))
    });
});

describe('test database operations', () => {

    let dynamoDb: DynamoDb;
    let app: BaseApp;

    const config = {
        tableName: 'test'
    }

    describe('test save()', () => {
        test('should call errorHandling() once', async () => {
            // mock implementation to not throw error while going through save()
            AWS.DynamoDB.DocumentClient.prototype.put = jest.fn().mockImplementation((params) => {
                return {
                    promise: jest.fn()
                }
            });
            dynamoDb = new DynamoDb(config);
            dynamoDb.errorHandling = jest.fn();
            app = new BaseApp();
            dynamoDb.install(app);

            await dynamoDb.save('id', 'key', 'value');

            expect(dynamoDb.errorHandling).toBeCalledTimes(1);
        });

        test('test should save key value pair for primaryKey', async () => {
            AWS.DynamoDB.DocumentClient.prototype.put = jest.fn().mockImplementation((params) => {
                return {
                    promise: () => {
                        return Promise.resolve({Attributes: params.Item});
                    }
                }
            });
            dynamoDb = new DynamoDb(config);
            app = new BaseApp();
            dynamoDb.install(app);

            const result = await dynamoDb.save('id', 'key', 'value');

            expect(AWS.DynamoDB.DocumentClient.prototype.put).toBeCalled();
            expect(result!.Attributes).toEqual({
                [dynamoDb.config.primaryKeyColumn!]: 'id',
                key: 'value'
            });
        });

        test('should not save anything to database because isCreating is true', async () => {
            AWS.DynamoDB.DocumentClient.prototype.put = jest.fn();
            dynamoDb = new DynamoDb(config);
            app = new BaseApp();
            dynamoDb.install(app);
            _set(dynamoDb, 'isCreating', true);

            await dynamoDb.save('id', 'key', 'value');

            expect(AWS.DynamoDB.DocumentClient.prototype.put).not.toBeCalled();
        });
    });

    describe('test delete()', () => {
        test('should call errorHandling() once', async () => {
            // mock implementation to not throw error while going through delete()
            AWS.DynamoDB.DocumentClient.prototype.delete = jest.fn().mockImplementation((params) => {
                return {
                    promise: jest.fn()
                }
            });
            dynamoDb = new DynamoDb(config);
            dynamoDb.errorHandling = jest.fn();
            app = new BaseApp();
            dynamoDb.install(app);

            await dynamoDb.delete('id');

            expect(dynamoDb.errorHandling).toBeCalledTimes(1);
        });

        test('should return the object docClient.delete() returns', async () => {
            AWS.DynamoDB.DocumentClient.prototype.delete = jest.fn().mockImplementation((params) => {
                return {
                    promise: () => {
                        return Promise.resolve({test: 'test'});
                    }
                }
            })

            dynamoDb = new DynamoDb(config);
            app = new BaseApp();
            dynamoDb.install(app);

            const result = await dynamoDb.delete('id');
            
            expect(result).toEqual({test: 'test'});
        });

    });

    describe('test load()', () => {
        test('should call errorHandling() once', async () => {
            // mock implementation to not throw error while going through load()
            AWS.DynamoDB.DocumentClient.prototype.get = jest.fn().mockImplementation((params) => {
                return {
                    promise: () => {
                        return {
                            Item: {userId: 'id', key: 'value'},
                            ConsumedCapacity: 1
                        }
                    }
                }
            });
            dynamoDb = new DynamoDb(config);
            dynamoDb.errorHandling = jest.fn();
            app = new BaseApp();
            dynamoDb.install(app);

            await dynamoDb.load('id');

            expect(dynamoDb.errorHandling).toBeCalledTimes(1);
        });

        test('test should throw error because get() throws error that is not ResourceNotFoundException', async () => {
            AWS.DynamoDB.DocumentClient.prototype.get = jest.fn().mockImplementation((params) => {
                const error = new Error();
                _set(error, 'code', 'xyz');

                throw error;
            });
            dynamoDb = new DynamoDb(config);
            app = new BaseApp();
            dynamoDb.install(app);

            await dynamoDb.load('id')
                .catch(e => expect(e.code).toBe('xyz'));
        });

        test('test should load user data', async () => {
            AWS.DynamoDB.DocumentClient.prototype.get = jest.fn().mockImplementation((params) => {
                return {
                    promise: () => {
                        return {
                            Item: {userId: 'id', key: 'value'},
                            ConsumedCapacity: 1
                        }
                    }
                }
            });
            dynamoDb = new DynamoDb(config);
            app = new BaseApp();
            dynamoDb.install(app);

            const result = await dynamoDb.load('id');
        
            expect(result).toEqual({
                userId: 'id',
                key: 'value'
            });
        });

        test('test should create DynamoDB Table & return empty object if ResourceNotFoundException error & config.createTableOnInit is true', async () => {
            // config.createTableOnInit is true by default
            AWS.DynamoDB.DocumentClient.prototype.get = jest.fn().mockImplementation((params) => {
                const error = new Error();
                _set(error, 'code', 'ResourceNotFoundException');
                throw error;
            });

            AWS.DynamoDB.prototype.createTable = jest.fn().mockImplementation((params) => {
                return {
                    promise: () => {
                        return Promise.resolve({
                            TableDescription: {
                                TableStatus: 'XYZ'
                            }
                        });
                    }
                }
            });
            dynamoDb = new DynamoDb(config);
            app = new BaseApp();
            dynamoDb.install(app);

            const result = await dynamoDb.load('id');

            expect(result).toEqual({});
        });

        test('should create DynamoDB table and log table configuration data', async () => {
            AWS.DynamoDB.DocumentClient.prototype.get = jest.fn().mockImplementation((params) => {
                const error = new Error();
                _set(error, 'code', 'ResourceNotFoundException');
                throw error;
            });

            AWS.DynamoDB.prototype.createTable = jest.fn().mockImplementation((params) => {
                return {
                    promise: () => {
                        return Promise.resolve({
                            TableDescription: {
                                TableStatus: 'CREATING'
                            }
                        });
                    }
                }
            });

            dynamoDb = new DynamoDb(config);
            app = new BaseApp();
            dynamoDb.install(app);

            await dynamoDb.load('id');

            expect(dynamoDb.isCreating).toEqual(true);
        });

        test('should throw JovoError because AWS.DynamoDB.createTable() throws error', async () => {
            AWS.DynamoDB.DocumentClient.prototype.get = jest.fn().mockImplementation((params) => {
                const error = new Error();
                _set(error, 'code', 'ResourceNotFoundException');
                throw error;
            });

            AWS.DynamoDB.prototype.createTable = jest.fn().mockImplementation((params) => {
                throw new Error();
            });

            dynamoDb = new DynamoDb(config);
            app = new BaseApp();
            dynamoDb.install(app);

            await dynamoDb.load('id')
                .catch(e => expect(e).toBeInstanceOf(JovoError));
        });

        test('should throw JovoError because dynamoClient is undefined while we call createTable()', async () => {
            AWS.DynamoDB.DocumentClient.prototype.get = jest.fn().mockImplementation((params) => {
                const error = new Error();
                _set(error, 'code', 'ResourceNotFoundException');
                throw error;
            });

            dynamoDb = new DynamoDb(config);
            app = new BaseApp();
            dynamoDb.install(app);

            _set(dynamoDb, 'dynamoClient', undefined);

            await dynamoDb.load('id')
                .catch(e => expect(e).toBeInstanceOf(JovoError));
        })

        test('test should return undefined if there is no data for that user', async() => {
            // If there is not data for the user, get() won't return the Item property
            AWS.DynamoDB.DocumentClient.prototype.get = jest.fn().mockImplementation((params) => {
                return {
                    promise: () => {
                        return {ConsumedCapacity: 1};
                    }
                };                    
            });
            dynamoDb = new DynamoDb(config);
            app = new BaseApp();
            dynamoDb.install(app);

            const result = await dynamoDb.load('id');
        
            expect(result).toBeUndefined();
        });
    })
});
