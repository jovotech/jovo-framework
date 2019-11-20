import { BaseApp, JovoError } from 'jovo-core';
import _set = require('lodash.set'); // tslint:disable-line:no-implicit-dependencies
import * as mysql from 'mysql';

import { MySQL } from '../src/MySQL';

describe('test install()', () => {
  test('should throw JovoError because config.connection is undefined', () => {
    // config.connection is undefined by default
    const mySQL = new MySQL();
    const app = new BaseApp();

    expect(() => {
      mySQL.install(app);
    }).toThrowError(JovoError);
  });

  test('should call createPool() and parse it config.connection', () => {
    const config = {
      connection: {},
    };
    jest.spyOn(mysql, 'createPool');
    const mySQL = new MySQL(config);
    const app = new BaseApp();

    mySQL.install(app);

    expect(mysql.createPool).toBeCalledTimes(1);
    expect(mysql.createPool).toBeCalledWith(config.connection);
  });

  describe('test install() setting app.$db', () => {
    const config = {
      connection: {},
    };
    test('test should set app.$db to be MySQL if no default db was set in config', () => {
      const mySQL = new MySQL(config);
      const app = new BaseApp();

      mySQL.install(app);

      expect(app.$db).toBeInstanceOf(MySQL);
    });

    test('test app.$db should not be an instance of MySQL if default db set in config is not MySQL', () => {
      const mySQL = new MySQL(config);
      const app = new BaseApp();
      _set(app.config, 'db.default', 'test');

      mySQL.install(app);

      expect(app.$db).not.toBeInstanceOf(MySQL);
    });

    test('test app.$db should be an instance MySQL if default db is set to MySQL', () => {
      const mySQL = new MySQL(config);
      const app = new BaseApp();
      _set(app.config, 'db.default', 'MySQL');

      mySQL.install(app);

      expect(app.$db).toBeInstanceOf(MySQL);
    });
  });
});

describe('test uninstall()', () => {
  test('should call pool.end() because pool is defined', () => {
    const mySQL = new MySQL();
    _set(mySQL, 'pool', { end: jest.fn() });
    const app = new BaseApp();

    mySQL.uninstall(app);

    expect(mySQL.pool!.end).toBeCalledTimes(1);
  });
});

describe('test errorHandling()', () => {
  let mySQL: MySQL;

  beforeEach(() => {
    mySQL = new MySQL();
  });

  test('should throw JovoError because dataColumnName is not defined', () => {
    _set(mySQL.config, 'dataColumnName', undefined);

    expect(() => {
      mySQL.errorHandling();
    }).toThrowError(JovoError);
  });

  test('should throw JovoError because primaryKeyColumn is not defined', () => {
    _set(mySQL.config, 'primaryKeyColumn', undefined);

    expect(() => {
      mySQL.errorHandling();
    }).toThrowError(JovoError);
  });

  test('should throw JovoError because tableName is not defined', () => {
    _set(mySQL.config, 'tableName', undefined);

    expect(() => {
      mySQL.errorHandling();
    }).toThrowError(JovoError);
  });
});

describe('test database operations', () => {
  let mySQL: MySQL;

  beforeEach(() => {
    mySQL = new MySQL();
  });

  describe('test load()', () => {
    test('should throw error because select() throws error that is not "ER_NO_SUCH_TABLE"', async () => {
      const mockSelect = jest.fn().mockImplementation(() => {
        const error: Error = new Error();
        _set(error, 'code', 'test');
        throw error;
      });
      // hack to access private function
      mySQL.select = mockSelect;

      await mySQL.load('id').catch((e) => expect(e.code).toBe('test'));
    });

    test('should call createTable() because err.code is "ER_NO_SUCH_TABLE"', async () => {
      const mockSelect = jest.fn().mockImplementation(() => {
        const error: Error = new Error();
        _set(error, 'code', 'ER_NO_SUCH_TABLE');
        throw error;
      });
      mySQL.select = mockSelect;
      mySQL.createTable = jest.fn();

      await mySQL.load('id');

      expect(mySQL.createTable).toHaveBeenCalledTimes(1);
    });

    test('should return value returned by select()', async () => {
      const mockSelect = jest.fn().mockImplementation(() => {
        return 42;
      });
      mySQL.select = mockSelect;

      const result = await mySQL.load('id');

      expect(result).toBe(42);
    });
  });

  describe('test save()', () => {
    test('should call errorHandling()', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, values: any, cb: any) => {
            // tslint:disable-line
            cb(undefined, 'test');
          },
        });
      });
      jest.spyOn(mySQL, 'errorHandling');

      await mySQL.save('id', 'key', 'value');

      expect(mySQL.errorHandling).toHaveBeenCalledTimes(1);
    });

    test('connection.query() should reject the error parsed to the callback', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, values: any, cb: any) => {
            // tslint:disable-line
            cb(new Error('Callback Error'));
          },
        });
      });

      await mySQL.save('id', 'key', 'value').catch((e) => {
        expect(e.message).toBe('Callback Error');
      });
    });

    test('connection.query() should resolve the value parsed to the callback', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, values: any, cb: any) => {
            // tslint:disable-line
            cb(null, 'test');
          },
        });
      });

      const result = await mySQL.save('id', 'key', 'value');

      expect(result).toBe('test');
    });

    test('should catch and reject error thrown while trying to insert the data', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        throw new Error('getConnection threw an Error');
      });

      await mySQL.save('id', 'key', 'value').catch((e) => {
        expect(e.message).toBe('getConnection threw an Error');
      });
    });
  });

  describe('test delete()', () => {
    test('should call errorHandling()', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, values: any, cb: any) => {
            // tslint:disable-line
            cb(undefined, 'test');
          },
        });
      });
      jest.spyOn(mySQL, 'errorHandling');

      await mySQL.delete('id');

      expect(mySQL.errorHandling).toHaveBeenCalledTimes(1);
    });

    test('connection.query() should reject the error parsed to the callback', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, values: any, cb: any) => {
            // tslint:disable-line
            cb(new Error('Callback Error'));
          },
        });
      });

      await mySQL.delete('id').catch((e) => {
        expect(e.message).toBe('Callback Error');
      });
    });

    test('connection.query() should resolve the value parsed to the callback', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, values: any, cb: any) => {
            // tslint:disable-line
            cb(undefined, 'test');
          },
        });
      });

      const result = await mySQL.delete('id');

      expect(result).toBe('test');
    });

    test('should catch and reject error thrown while trying to insert the data', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        throw new Error('getConnection threw an Error');
      });

      await mySQL.delete('id').catch((e) => {
        expect(e.message).toBe('getConnection threw an Error');
      });
    });
  });

  describe('test createTable()', () => {
    test('should call errorHandling()', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, cb: any) => {
            // tslint:disable-line
            cb(undefined, 'test');
          },
        });
      });
      jest.spyOn(mySQL, 'errorHandling');

      // hack to access private
      await mySQL.createTable();

      expect(mySQL.errorHandling).toHaveBeenCalledTimes(1);
    });

    test('connection.query() should reject the error parsed to the callback', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, cb: any) => {
            // tslint:disable-line
            cb(new Error('Callback Error'));
          },
        });
      });

      await mySQL.createTable().catch((e) => {
        expect(e.message).toBe('Callback Error');
      });
    });

    test('connection.query() should resolve the value parsed to the callback', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, cb: any) => {
            // tslint:disable-line
            cb(undefined, 'test');
          },
        });
      });

      const result = await mySQL.createTable();

      expect(result).toBe('test');
    });

    test('should catch and reject error thrown while trying to create the table', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        throw new Error('getConnection threw an Error');
      });

      await mySQL.createTable().catch((e) => {
        expect(e.message).toBe('getConnection threw an Error');
      });
    });
  });

  describe('test select()', () => {
    test('should call errorHandling()', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, value: any, cb: any) => {
            // tslint:disable-line
            const result = [
              {
                userData: '{"key": "value"}',
              },
            ];
            cb(undefined, result);
          },
        });
      });
      jest.spyOn(mySQL, 'errorHandling');

      // hack to access private
      await mySQL.select('id');

      expect(mySQL.errorHandling).toHaveBeenCalledTimes(1);
    });

    test('connection.query() should reject the error parsed to the callback', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, value: any, cb: any) => {
            // tslint:disable-line
            cb(new Error('Callback Error'));
          },
        });
      });

      await mySQL.select('id').catch((e) => {
        expect(e.message).toBe('Callback Error');
      });
    });

    test('connection.query() should resolve the value parsed to the callback', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, value: any, cb: any) => {
            // tslint:disable-line
            const res = [
              {
                userData: '{"key": "value"}',
              },
            ];
            cb(undefined, res);
          },
        });
      });

      const result = await mySQL.select('id');

      expect(result).toEqual({
        userData: {
          key: 'value',
        },
      });
    });

    test('connection.query() should resolve undefined as the value parsed is an empty array (i.e. no data found)', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, value: any, cb: any) => {
            // tslint:disable-line
            const result: any[] = []; // tslint:disable-line
            cb(undefined, result);
          },
        });
      });

      const result = await mySQL.select('id');

      expect(result).toBe(undefined);
    });

    test('should catch and reject error thrown while trying to select the data', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        throw new Error('getConnection threw an Error');
      });

      await mySQL.select('id').catch((e) => {
        expect(e.message).toBe('getConnection threw an Error');
      });
    });

    test('should catch and reject error thrown while trying to JSON.parse() the queried', async () => {
      mySQL.getConnection = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          query: (options: string, value: any, cb: any) => {
            // tslint:disable-line
            const result = [
              {
                userData: '{key: "value"}', // invalid JSON
              },
            ];
            cb(undefined, result);
          },
        });
      });

      await mySQL.select('id').catch((e) => {
        expect(e).toBeInstanceOf(Error);
      });
    });
  });
});

describe('test getConnection()', () => {
  let mySQL: MySQL;

  test('should throw JovoError because pool is undefined', async () => {
    mySQL = new MySQL();
    _set(mySQL, 'pool', undefined);

    await mySQL.getConnection().catch((e) => expect(e).toBeInstanceOf(JovoError));
  });

  test('should reject JovoError because pool.getConnection parses one in the callback', async () => {
    mySQL = new MySQL();
    const getConnectionMock = jest.fn().mockImplementation((cb) => {
      const error = new Error('test');
      cb(error);
    });
    _set(mySQL, 'pool.getConnection', getConnectionMock);

    await mySQL.getConnection().catch((e) => {
      // to make sure that pool.getConnection is the one throwing the error,
      // we check whether the mock was called
      expect(getConnectionMock).toHaveBeenCalledTimes(1);
      expect(e).toBeInstanceOf(JovoError);
    });
  });

  test('should resolve the value pool.getConnection parses in the callback', async () => {
    mySQL = new MySQL();
    const getConnectionMock = jest.fn().mockImplementation((cb) => {
      cb(undefined, 'test');
    });
    _set(mySQL, 'pool.getConnection', getConnectionMock);

    await mySQL.getConnection().then((connection) => {
      expect(getConnectionMock).toHaveBeenCalledTimes(1);
      expect(connection).toBe('test');
    });
  });
});
