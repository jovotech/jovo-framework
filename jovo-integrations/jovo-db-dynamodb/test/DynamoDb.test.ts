import { BaseApp, JovoError } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');

import { DynamoDb } from '../src/DynamoDb';

process.env.NODE_ENV = 'UNIT_TEST';

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
            key: 'value',
          },
        },
        dynamoDbConfig: {
          endpoint: 'value',
        },
      };
      const mergedConfig = {
        endpoint: 'value',
        params: {
          key: 'value',
        },
      };
      dynamoDb = new DynamoDb(config);
      app = new BaseApp();
      dynamoDb.install(app);

      const dynamoDbConfig = _get(dynamoDb.config, 'dynamoDbConfig');

      expect(dynamoDbConfig).toEqual(mergedConfig);
    });

    // test('should merge documentClientConfig with awsConfig', () => {
    //   const config = {
    //     awsConfig: {
    //       params: {
    //         key: 'value',
    //       },
    //     },
    //     documentClientConfig: {
    //       attrValue: 'S8',
    //       convertEmptyValues: false,
    //     },
    //   };
    //   const mergedConfig = {
    //     attrValue: 'S8',
    //     convertEmptyValues: false,
    //     params: {
    //       key: 'value',
    //     },
    //   };
    //   dynamoDb = new DynamoDb(config);
    //   app = new BaseApp();
    //   dynamoDb.install(app);
    //
    //   const documentClientConfig = _get(dynamoDb.config, 'documentClientConfig');
    //
    //   expect(documentClientConfig).toEqual(mergedConfig);
    // });
  });

  describe('test install() setting up AWSXray if included in config', () => {
    test(`test should throw Error because aws-xray-sdk-core package isn't installed`, () => {
      const config = {
        awsXray: true,
      };
      const dynamoDb = new DynamoDb(config);
      const app = new BaseApp();

      expect(() => {
        dynamoDb.install(app);
      }).toThrowError(JovoError);
    });
  });

  describe('test install() setting up dax if included in config', () => {
    test('test should throw error because config.awsXray is true', () => {
      const config = {
        awsXray: true,
        dax: {
          endpoint: ['1', '2'],
          region: 'one',
        },
      };
      const dynamoDb = new DynamoDb(config);
      const app = new BaseApp();

      expect(() => {
        dynamoDb.install(app);
      }).toThrowError(JovoError);
    });

    test(`test should throw Error because amazon-dax-client package isn't installed`, () => {
      const config = {
        dax: {
          endpoint: ['1', '2'],
          region: 'one',
        },
      };
      const dynamoDb = new DynamoDb(config);
      const app = new BaseApp();

      expect(() => {
        dynamoDb.install(app);
      }).toThrowError(JovoError);
    });
  });
});

describe('test errorHandling()', () => {
  let dynamoDb: DynamoDb;
  let app: BaseApp;
  const config = {
    tableName: 'test',
  };

  test('test should throw JovoError if tableName is missing in config', async () => {
    dynamoDb = new DynamoDb();
    app = new BaseApp();
    dynamoDb.install(app);

    await dynamoDb
      .save('id', 'key', { key: 'value' })
      .catch((e) => expect(e).toBeInstanceOf(JovoError));
  });

  test('test should throw JovoError if docClient is not initialized', async () => {
    dynamoDb = new DynamoDb(config);
    app = new BaseApp();
    dynamoDb.install(app);

    _set(dynamoDb, 'docClient', undefined);

    await dynamoDb
      .save('id', 'key', { key: 'value' })
      .catch((e) => expect(e).toBeInstanceOf(JovoError));
  });

  test('test should throw JovoError if primaryKeyColumn is undefined', async () => {
    dynamoDb = new DynamoDb(config);
    app = new BaseApp();
    dynamoDb.install(app);

    _set(dynamoDb.config, 'primaryKeyColumn', undefined);

    await dynamoDb
      .save('id', 'key', { key: 'value' })
      .catch((e) => expect(e).toBeInstanceOf(JovoError));
  });
});

describe('test database operations', () => {
  let dynamoDb: DynamoDb;

  const config = {
    tableName: 'test',
  };

  describe('test save()', () => {
    test('should call errorHandling() once', async () => {
      // mock implementation to not throw error while going through save()
      const mockDocClient = {
        put: jest.fn().mockImplementation((params) => {
          return {
            promise: jest.fn(),
          };
        }),
      };
      dynamoDb = new DynamoDb(config);
      _set(dynamoDb, 'docClient', mockDocClient);
      jest.spyOn(dynamoDb, 'errorHandling');

      await dynamoDb.save('id', 'key', 'value');

      expect(dynamoDb.errorHandling).toBeCalledTimes(1);
    });

    test('should return value returned by put', async () => {
      const mockDocClient = {
        put: jest.fn().mockImplementation((params) => {
          return {
            promise: () => {
              return Promise.resolve({ Attributes: params.Item });
            },
          };
        }),
      };
      dynamoDb = new DynamoDb(config);
      _set(dynamoDb, 'docClient', mockDocClient);

      const result = await dynamoDb.save('id', 'key', 'value');

      expect(result!.Attributes).toEqual({
        [dynamoDb.config.primaryKeyColumn!]: 'id',
        key: 'value',
      });
    });

    test('should not save anything to database because isCreating is true', async () => {
      const mockDocClient = {
        put: jest.fn(),
      };
      dynamoDb = new DynamoDb(config);
      _set(dynamoDb, 'docClient', mockDocClient);
      _set(dynamoDb, 'isCreating', true);

      await dynamoDb.save('id', 'key', 'value');

      expect(dynamoDb.docClient!.put).not.toBeCalled();
    });

    test('should project key and value specified in global secondary index configuration to the root level of the dynamodb put request', async () => {
      const mockPut = jest.fn();
      const mockDocClient = {
        put: mockPut.mockImplementation((params) => {
          return {
            promise: () => {
              return Promise.resolve({ Attributes: params.Item });
            },
          };
        }),
      };
      dynamoDb = new DynamoDb({
        ...config,
        globalSecondaryIndexes: [
          {
            IndexName: 'TestIndex',
            KeySchema: [
              {
                AttributeName: 'testAttrGSI',
                AttributeType: 'S',
                Path: 'data.testKey',
                KeyType: 'S',
              },
            ],
            Projection: {
              ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {
              WriteCapacityUnits: 1,
              ReadCapacityUnits: 2,
            },
          },
        ],
      });
      _set(dynamoDb, 'docClient', mockDocClient);

      const dummyData = {
        data: {
          testKey: 'test-value',
        },
      };

      const key = 'key';
      await dynamoDb.save('id', key, dummyData);

      expect(mockPut).toHaveBeenCalledTimes(1);
      expect(mockPut).toHaveBeenCalledWith({
        TableName: 'test',
        Item: {
          [key]: dummyData,
          [dynamoDb.config.globalSecondaryIndexes![0].KeySchema[0].AttributeName]: 'test-value',
          userId: 'id',
        },
      });
    });
  });

  describe('test delete()', () => {
    test('should call errorHandling() once', async () => {
      // mock implementation to not throw error while going through delete()
      const mockDocClient = {
        delete: jest.fn().mockImplementation((params) => {
          return {
            promise: jest.fn(),
          };
        }),
      };
      dynamoDb = new DynamoDb(config);
      _set(dynamoDb, 'docClient', mockDocClient);
      jest.spyOn(dynamoDb, 'errorHandling');

      await dynamoDb.delete('id');

      expect(dynamoDb.errorHandling).toBeCalledTimes(1);
    });

    test('should return the object docClient.delete() returns', async () => {
      const mockDocClient = {
        delete: jest.fn().mockImplementation((params) => {
          return {
            promise: () => {
              return Promise.resolve({ test: 'test' });
            },
          };
        }),
      };
      dynamoDb = new DynamoDb(config);
      _set(dynamoDb, 'docClient', mockDocClient);

      const result = await dynamoDb.delete('id');

      expect(result).toEqual({ test: 'test' });
    });
  });

  describe('test load()', () => {
    test('should call errorHandling() once', async () => {
      // mock implementation to not throw error while going through load()
      const mockDocClient = {
        get: jest.fn().mockImplementation((params) => {
          return {
            promise: () => {
              return {
                ConsumedCapacity: 1,
                Item: { userId: 'id', key: 'value' },
              };
            },
          };
        }),
      };
      dynamoDb = new DynamoDb(config);
      _set(dynamoDb, 'docClient', mockDocClient);
      jest.spyOn(dynamoDb, 'errorHandling');

      await dynamoDb.load('id');

      expect(dynamoDb.errorHandling).toBeCalledTimes(1);
    });

    test('test should throw error because loading process throws error that is not ResourceNotFoundException', async () => {
      const mockDocClient = {
        get: jest.fn().mockImplementation((params) => {
          const error = new Error();
          _set(error, 'code', 'xyz');

          throw error;
        }),
      };
      dynamoDb = new DynamoDb(config);
      _set(dynamoDb, 'docClient', mockDocClient);

      await dynamoDb.load('id').catch((e) => expect(e.code).toBe('xyz'));
    });

    test('should return user data returned by loading process', async () => {
      const mockDocClient = {
        get: jest.fn().mockImplementation((params) => {
          return {
            promise: () => {
              return {
                ConsumedCapacity: 1,
                Item: { userId: 'id', key: 'value' },
              };
            },
          };
        }),
      };
      dynamoDb = new DynamoDb(config);
      _set(dynamoDb, 'docClient', mockDocClient);

      const result = await dynamoDb.load('id');

      expect(result).toEqual({
        key: 'value',
        userId: 'id',
      });
    });

    test('test call createTable() & return empty object because load threw ResourceNotFoundException error & config.createTableOnInit is true', async () => {
      // config.createTableOnInit is true by default
      const mockDocClient = {
        get: jest.fn().mockImplementation((params) => {
          const error = new Error();
          _set(error, 'code', 'ResourceNotFoundException');

          throw error;
        }),
      };
      dynamoDb = new DynamoDb(config);
      _set(dynamoDb, 'docClient', mockDocClient);
      const mockCreateTable = jest.fn();
      _set(dynamoDb, 'createTable', mockCreateTable);

      const result = await dynamoDb.load('id');

      expect(mockCreateTable).toHaveBeenCalledTimes(1);
      expect(result).toEqual({});
    });

    test('test should return undefined because there is no data for that user', async () => {
      // If there is not data for the user, get() won't return the Item property
      const mockDocClient = {
        get: jest.fn().mockImplementation((params) => {
          return {
            promise: () => {
              return { ConsumedCapacity: 1 };
            },
          };
        }),
      };
      dynamoDb = new DynamoDb(config);
      _set(dynamoDb, 'docClient', mockDocClient);

      const result = await dynamoDb.load('id');

      expect(result).toBeUndefined();
    });
  });

  describe('test createTable()', () => {
    test('should throw JovoError because dynamoClient is undefined', async () => {
      dynamoDb = new DynamoDb();
      _set(dynamoDb, 'dynamoClient', undefined);

      await dynamoDb.createTable().catch((e) => expect(e).toBeInstanceOf(JovoError));
    });

    test('should call dynamoClient.createTable()', async () => {
      const mockCreateTable = jest.fn();
      const mockDynamoClient = {
        createTable: mockCreateTable.mockImplementation(() => {
          return {
            promise: jest.fn(),
          };
        }),
      };
      dynamoDb = new DynamoDb();
      _set(dynamoDb, 'dynamoClient', mockDynamoClient);

      await dynamoDb.createTable();

      expect(mockCreateTable).toHaveBeenCalledTimes(1);
    });

    test('should throw JovoError if table creation throws an error', async () => {
      const mockDynamoClient = {
        createTable: jest.fn().mockImplementation(() => {
          throw new Error();
        }),
      };
      dynamoDb = new DynamoDb();
      _set(dynamoDb, 'dynamoClient', mockDynamoClient);

      await dynamoDb.createTable().catch((e) => expect(e).toBeInstanceOf(JovoError));
    });

    test('should set isCreating to true if the returned TableStatus is "CREATING"', async () => {
      const mockDynamoClient = {
        createTable: jest.fn().mockImplementation(() => {
          return {
            promise: jest.fn().mockResolvedValue({
              TableDescription: {
                TableStatus: 'CREATING',
              },
            }),
          };
        }),
      };
      dynamoDb = new DynamoDb();
      _set(dynamoDb, 'dynamoClient', mockDynamoClient);

      await dynamoDb.createTable();
      expect(dynamoDb.isCreating).toBe(true);
    });

    test('should handle global secondary indexes', async () => {
      const mockCreateTable = jest.fn();
      const mockDynamoClient = {
        createTable: mockCreateTable.mockImplementation(() => {
          return {
            promise: jest.fn(),
          };
        }),
      };

      const ddbConfigWithGSI = {
        tableName: 'TestTable',
        globalSecondaryIndexes: [
          {
            IndexName: 'TestIndex',
            KeySchema: [
              {
                AttributeName: 'test',
                AttributeType: 'S',
                Path: 'data.testKey',
                KeyType: 'S',
              },
            ],
            Projection: {
              ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {
              WriteCapacityUnits: 1,
              ReadCapacityUnits: 2,
            },
          },
        ],
      };

      dynamoDb = new DynamoDb(ddbConfigWithGSI);
      _set(dynamoDb, 'dynamoClient', mockDynamoClient);

      await dynamoDb.createTable();

      const defaultCreateTableRequests = {
        KeySchema: [
          {
            AttributeName: 'userId',
            KeyType: 'HASH',
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
        TableName: 'TestTable',
      };

      const attributeDefinitions = [
        {
          AttributeName: 'userId',
          AttributeType: 'S',
        },
        // Should add an extra attribute definitions based on GSI.
        {
          AttributeName: 'test',
          AttributeType: 'S',
        },
      ];

      expect(mockCreateTable).toHaveBeenCalledTimes(1);

      // PATH and AtributeType from KeySchema should not be a part of gsi configuration.
      const gsiRequest = JSON.parse(JSON.stringify(ddbConfigWithGSI.globalSecondaryIndexes));
      delete gsiRequest[0].KeySchema[0].AttributeType;
      delete gsiRequest[0].KeySchema[0].Path;

      expect(mockCreateTable).toHaveBeenCalledWith({
        ...defaultCreateTableRequests,
        GlobalSecondaryIndexes: gsiRequest,
        AttributeDefinitions: attributeDefinitions,
      });
    });
  });
});
