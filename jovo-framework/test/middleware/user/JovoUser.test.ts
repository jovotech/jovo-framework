import crypto = require('crypto');
import {
  BaseApp,
  EnumRequestType,
  HandleRequest,
  Host,
  Input,
  Jovo,
  JovoError,
  Middleware,
  SessionConstants,
} from 'jovo-core';
import _set = require('lodash.set');
import { JovoUser } from '../../../src';

describe('test install()', () => {
  let jovoUser: JovoUser;
  let app: BaseApp;

  beforeEach(() => {
    app = new BaseApp();
    jovoUser = new JovoUser();
  });

  test('should set loadDb function to be executed with user.load', () => {
    jovoUser.install(app);

    const middleware: Middleware | undefined = app.middleware('user.load');

    expect(middleware!.name).toBe('user.load');
    expect(middleware!.fns[0]).toBe(jovoUser.loadDb);
  });

  test('should set saveDb function to be executed with user.save', () => {
    jovoUser.install(app);

    const middleware: Middleware | undefined = app.middleware('user.save');

    expect(middleware!.name).toBe('user.save');
    expect(middleware!.fns[0]).toBe(jovoUser.saveDb);
  });
});

describe('test loadDb() and saveDb()', () => {
  let jovoUser: JovoUser;
  let mockHandleRequest: HandleRequest;

  beforeEach(() => {
    jovoUser = new JovoUser();
    const app = ({
      $db: {
        load: jest.fn(),
        needsWriteFileAccess: false,
        save: jest.fn(),
      },
    } as unknown) as BaseApp; // hack so we don't have to implement the full BaseApp class, but just the parts we need

    const host = ({
      hasWriteFileAccess: true,
    } as unknown) as Host;

    const jovo = ({
      $user: {
        $context: {},
        $data: {},
        $metaData: {},
        getId: jest.fn().mockReturnValue('testId'),
        isDeleted: false,
      },
    } as unknown) as Jovo;

    mockHandleRequest = new HandleRequest(app, host, jovo);
  });

  describe('test loadDb()', () => {
    test('should resolve promise because app.$db is undefined', async () => {
      _set(mockHandleRequest, 'app.$db', undefined);

      await expect(jovoUser.loadDb(mockHandleRequest)).resolves.toBeUndefined();
    });

    test(`should resolve promise because db needs write file access but the host doesn't provide it`, async () => {
      mockHandleRequest.app.$db.needsWriteFileAccess = true;
      mockHandleRequest.host.hasWriteFileAccess = false;

      await expect(jovoUser.loadDb(mockHandleRequest)).resolves.toBeUndefined();
    });

    test('should resolve promise because implicitSave & force are false', async () => {
      jovoUser.config.implicitSave = false;
      const force = false;

      await expect(jovoUser.loadDb(mockHandleRequest, force)).resolves.toBeUndefined();
    });

    test('should throw error because jovo object is undefined', async () => {
      expect.assertions(1); // ensures that if the assertions inside the catch don't run, we get a failure.

      mockHandleRequest.jovo = undefined;

      await jovoUser
        .loadDb(mockHandleRequest)
        .catch((e) => expect(e.message).toBe('jovo object is not initialized.'));
    });

    test('should throw error because $user object is undefined', async () => {
      expect.assertions(1);
      _set(mockHandleRequest, 'jovo.$user', undefined);

      await jovoUser
        .loadDb(mockHandleRequest)
        .catch((e) => expect(e.message).toBe('user object is not initialized'));
    });

    test('should throw error because userId for the request was undefined', async () => {
      expect.assertions(1);
      mockHandleRequest.jovo!.$user.getId = jest.fn().mockReturnValue(undefined);

      await jovoUser
        .loadDb(mockHandleRequest)
        .catch((e) => expect(e.message).toBe(`Can't load user with undefined userId`));
    });

    test('should load user data from db and parse it to $user.$data', async () => {
      const mockData = {
        [`${jovoUser.config.columnName}.data`]: {
          key: 'value',
        },
      };
      mockHandleRequest.jovo!.$user.getId = jest.fn().mockReturnValue('userId');
      mockHandleRequest.app.$db.load = jest.fn().mockResolvedValue(mockData);

      await jovoUser.loadDb(mockHandleRequest);

      const data = mockHandleRequest.jovo!.$user.$data;

      expect(data).toEqual(mockData[`${jovoUser.config.columnName}.data`]);
    });

    test('should load metaData and parse it to $user.$metaData', async () => {
      jovoUser.config.metaData!.enabled = true;
      const mockData = {
        [`${jovoUser.config.columnName}.metaData`]: {
          key: 'value',
        },
      };
      mockHandleRequest.jovo!.$user.getId = jest.fn().mockReturnValue('userId');
      mockHandleRequest.app.$db.load = jest.fn().mockResolvedValue(mockData);

      await jovoUser.loadDb(mockHandleRequest);

      const metaData = mockHandleRequest.jovo!.$user.$metaData;

      expect(metaData).toEqual(mockData[`${jovoUser.config.columnName}.metaData`]);
    });

    test('should load context and parse it to $user.context', async () => {
      jovoUser.config.context!.enabled = true;
      const mockData = {
        [`${jovoUser.config.columnName}.context`]: {
          key: 'value',
        },
      };
      mockHandleRequest.jovo!.$user.getId = jest.fn().mockReturnValue('userId');
      mockHandleRequest.app.$db.load = jest.fn().mockResolvedValue(mockData);

      await jovoUser.loadDb(mockHandleRequest);

      const context = mockHandleRequest.jovo!.$user.$context;

      expect(context).toEqual(mockData[`${jovoUser.config.columnName}.context`]);
    });

    test('should cache hashed db state', async () => {
      const mockData = {
        [`${jovoUser.config.columnName}.data`]: {
          key: 'value',
        },
      };
      mockHandleRequest.jovo!.$user.getId = jest.fn().mockReturnValue('userId');
      mockHandleRequest.app.$db.load = jest.fn().mockResolvedValue(mockData);

      await jovoUser.loadDb(mockHandleRequest);

      const cache = mockHandleRequest.jovo!.$user.db_cache_hash;

      expect(cache).toBeDefined();
    });

    test('should set user as not new because load() retrieved data', async () => {
      const mockData = {
        [`${jovoUser.config.columnName}.data`]: {
          key: 'value',
        },
      };
      mockHandleRequest.jovo!.$user.getId = jest.fn().mockReturnValue('userId');
      mockHandleRequest.app.$db.load = jest.fn().mockResolvedValue(mockData);

      await jovoUser.loadDb(mockHandleRequest);

      expect(mockHandleRequest.jovo!.$user.new).toBe(false);
    });

    test(`should set $user.isDeleted to false because load() didn't retrieve data`, async () => {
      mockHandleRequest.jovo!.$user.getId = jest.fn().mockReturnValue('userId');
      mockHandleRequest.app.$db.load = jest.fn().mockResolvedValue(undefined);

      await jovoUser.loadDb(mockHandleRequest);

      expect(mockHandleRequest.jovo!.$user.isDeleted).toBe(false);
    });
  });

  describe('test saveDb()', () => {
    test('should resolve promise because app.$db is undefined', async () => {
      _set(mockHandleRequest, 'app.$db', undefined);

      await expect(jovoUser.saveDb(mockHandleRequest)).resolves.toBeUndefined();
    });

    test(`should resolve promise because db needs write file access but the host doesn't provide it`, async () => {
      mockHandleRequest.app.$db.needsWriteFileAccess = true;
      mockHandleRequest.host.hasWriteFileAccess = false;

      await expect(jovoUser.saveDb(mockHandleRequest)).resolves.toBeUndefined();
    });

    test('should throw error because jovo object is undefined', async () => {
      expect.assertions(1);
      mockHandleRequest.jovo = undefined;

      await jovoUser
        .saveDb(mockHandleRequest)
        .catch((e) => expect(e.message).toBe('jovo object is not initialized.'));
    });

    test('should throw error because $user object is undefined', async () => {
      expect.assertions(1);
      _set(mockHandleRequest, 'jovo.$user', undefined);

      await jovoUser
        .saveDb(mockHandleRequest)
        .catch((e) => expect(e.message).toBe('user object is not initialized'));
    });

    test('should resolve promise because was user deleted', async () => {
      _set(mockHandleRequest, 'jovo.$user.isDeleted', true);

      await expect(jovoUser.saveDb(mockHandleRequest)).resolves.toBeUndefined();
    });

    test('should resolve promise because implicitSave & force are false', async () => {
      jovoUser.config.implicitSave = false;
      const force = false;

      await expect(jovoUser.saveDb(mockHandleRequest, force)).resolves.toBeUndefined();
    });

    test('should throw error because userId for the request was undefined', async () => {
      expect.assertions(1);
      mockHandleRequest.jovo!.$user.getId = jest.fn().mockReturnValue(undefined);

      await jovoUser
        .saveDb(mockHandleRequest)
        .catch((e) => expect(e.message).toBe(`Can't save user with undefined userId`));
    });

    test(`shouldn't save data because dataCaching is on and there were no changes made`, async () => {
      jovoUser.config.dataCaching = true;
      const oldState = JSON.stringify({ data: { key: 'value' } });
      mockHandleRequest.jovo!.$user.db_cache_hash = crypto
        .createHash('md5')
        .update(oldState)
        .digest('hex');
      mockHandleRequest.jovo!.$user.$data = { key: 'value' }; // will be added to data: {} inside saveDb()

      await jovoUser.saveDb(mockHandleRequest);

      expect(mockHandleRequest.app.$db.save).not.toHaveBeenCalled();
    });

    test('should save data because dataCaching is on and there were changes made', async () => {
      jovoUser.config.dataCaching = true;
      const oldState = JSON.stringify({ data: { key: 'value' } });
      mockHandleRequest.jovo!.$user.db_cache_hash = crypto
        .createHash('md5')
        .update(oldState)
        .digest('hex');
      mockHandleRequest.jovo!.$user.$data = { key: 'otherValue' }; // will be added to data: {} inside saveDb()

      await jovoUser.saveDb(mockHandleRequest);

      expect(mockHandleRequest.app.$db.save).toHaveBeenCalledTimes(1);
    });

    test('should save data because dataCaching is off', async () => {
      jovoUser.config.dataCaching = false;

      await jovoUser.saveDb(mockHandleRequest);

      expect(mockHandleRequest.app.$db.save).toHaveBeenCalledTimes(1);
    });

    test('should update metaData', async () => {
      jovoUser.config.metaData!.enabled = true;
      jovoUser['updateMetaData'] = jest.fn(); // tslint:disable-line:no-string-literal

      await jovoUser.saveDb(mockHandleRequest);

      expect(jovoUser['updateMetaData']).toHaveBeenCalledTimes(1); // tslint:disable-line:no-string-literal
    });

    test(`shouldn't  update metaData because it's disabled in the config`, async () => {
      jovoUser.config.metaData!.enabled = false;
      jovoUser['updateMetaData'] = jest.fn(); // tslint:disable-line:no-string-literal

      await jovoUser.saveDb(mockHandleRequest);

      expect(jovoUser['updateMetaData']).not.toHaveBeenCalled(); // tslint:disable-line:no-string-literal
    });

    test('should update context', async () => {
      jovoUser.config.context!.enabled = true;
      jovoUser['updateContextData'] = jest.fn(); // tslint:disable-line:no-string-literal

      await jovoUser.saveDb(mockHandleRequest);

      expect(jovoUser['updateContextData']).toHaveBeenCalledTimes(1); // tslint:disable-line:no-string-literal
    });

    test(`shouldn't  update context because it's disabled in the config`, async () => {
      jovoUser.config.context!.enabled = false;
      jovoUser['updateContextData'] = jest.fn(); // tslint:disable-line:no-string-literal

      await jovoUser.saveDb(mockHandleRequest);

      expect(jovoUser['updateContextData']).not.toHaveBeenCalled(); // tslint:disable-line:no-string-literal
    });
  });
});

describe('test updateMetaData', () => {
  let jovoUser: JovoUser;
  let mockHandleRequest: HandleRequest;

  beforeEach(() => {
    const config = {
      metaData: {
        createdAt: false,
        devices: false,
        lastUsedAt: false,
        requestHistorySize: 0,
        sessionsCount: false,
      },
    };
    jovoUser = new JovoUser(config);
    const app = ({} as unknown) as BaseApp; // hack so we don't have to implement the full BaseApp class, but just the parts we need

    const host = ({} as unknown) as Host;

    const jovo = ({
      $request: {},
      $user: {
        $metaData: {},
        getId: jest.fn().mockReturnValue('testId'),
      },
      getDeviceId: jest.fn(),
      getHandlerPath: jest.fn(),
      hasAudioInterface: jest.fn(),
      hasScreenInterface: jest.fn(),
      hasVideoInterface: jest.fn(),
      isNewSession: jest.fn(),
    } as unknown) as Jovo;

    mockHandleRequest = new HandleRequest(app, host, jovo);
  });

  test('should throw JovoError because jovo object is undefined', () => {
    mockHandleRequest.jovo = undefined;

    expect(() => {
      jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal
    }).toThrowError(JovoError);
  });

  test('should set createdAt', () => {
    jovoUser.config.metaData!.createdAt = true;
    mockHandleRequest.jovo!.$user.$metaData.createdAt = undefined;

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.createdAt).toBeDefined();
  });

  test(`shouldn't set createdAt because it's turned off in the config`, () => {
    jovoUser.config.metaData!.createdAt = false;

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.createdAt).toBeUndefined();
  });

  test(`shouldn't set createdAt because it's already set`, () => {
    jovoUser.config.metaData!.createdAt = true;
    mockHandleRequest.jovo!.$user.$metaData.createdAt = 'xyz';

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.createdAt).toBe('xyz');
  });

  test('should update lastUsedAt', () => {
    jovoUser.config.metaData!.lastUsedAt = true;
    mockHandleRequest.jovo!.$user.$metaData.lastUsedAt = 'xyz';

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.createdAt).not.toBe('xyz');
  });

  test(`shouldn't update lastUsedAt because it's turned off in the config`, () => {
    jovoUser.config.metaData!.lastUsedAt = false;

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.lastUsedAt).toBeUndefined();
  });

  test(`shouldn't update sessionsCount because it's turned off in the config`, () => {
    jovoUser.config.metaData!.sessionsCount = false;

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.sessionsCount).toBeUndefined();
  });

  test(`should increment sessionsCount because it's a new session`, () => {
    jovoUser.config.metaData!.sessionsCount = true;
    mockHandleRequest.jovo!.isNewSession = jest.fn().mockReturnValue(true);

    mockHandleRequest.jovo!.$user.$metaData.sessionsCount = 1;

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.sessionsCount).toBe(2);
  });

  test(`should set sessionsCount to 1 as it's the first ever session`, () => {
    jovoUser.config.metaData!.sessionsCount = true;
    mockHandleRequest.jovo!.isNewSession = jest.fn().mockReturnValue(true);

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.sessionsCount).toBe(1);
  });

  test(`shouldn't increment sessionsCount because it's not a new session`, () => {
    jovoUser.config.metaData!.sessionsCount = true;
    mockHandleRequest.jovo!.isNewSession = jest.fn().mockReturnValue(false);

    mockHandleRequest.jovo!.$user.$metaData.sessionsCount = 1;

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.sessionsCount).toBe(1);
  });

  test(`shouldn't update requests because its size is set to 0 in the config`, () => {
    jovoUser.config.metaData!.requestHistorySize = 0;
    mockHandleRequest.jovo!.$user.$metaData.requests = {};

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.requests).toEqual({});
  });

  test('should create a new request object for a new handler path', () => {
    jovoUser.config.metaData!.requestHistorySize = 1;
    mockHandleRequest.jovo!.getHandlerPath = jest.fn().mockReturnValue('xyz');

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    // count set to 1 as it's the first time this handler path is used
    expect(mockHandleRequest.jovo!.$user.$metaData.requests!.xyz.count).toBe(1);
  });

  test('should not let request.log exceed the requestHistorySize', () => {
    jovoUser.config.metaData!.requestHistorySize = 2;
    mockHandleRequest.jovo!.$user.$metaData.requests = {
      xyz: {
        count: 2,
        log: ['one', 'two'],
      },
    };
    mockHandleRequest.jovo!.getHandlerPath = jest.fn().mockReturnValue('xyz');

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    // count was increased to 3, but the size of log is still only 2 (requestHistorySize limit)
    expect(mockHandleRequest.jovo!.$user.$metaData.requests!.xyz.count).toBe(3);
    expect(mockHandleRequest.jovo!.$user.$metaData.requests!.xyz.log.length).toBe(2);
  });

  test('should update the request object for an existing handler path', () => {
    jovoUser.config.metaData!.requestHistorySize = 2;
    mockHandleRequest.jovo!.getHandlerPath = jest.fn().mockReturnValue('xyz');
    mockHandleRequest.jovo!.$user.$metaData.requests! = {
      xyz: { count: 1, log: [] },
    };

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.requests!.xyz.count).toBe(2);
  });

  test(`shouldn't update devices as it's turned off in the config`, () => {
    jovoUser.config.metaData!.devices = false;

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.devices).toBeUndefined();
  });

  test('should add new object for new device id', () => {
    jovoUser.config.metaData!.devices = true;
    mockHandleRequest.jovo!.getDeviceId = jest.fn().mockReturnValue('xyz');
    mockHandleRequest.jovo!.hasAudioInterface = jest.fn().mockReturnValue(true);
    mockHandleRequest.jovo!.hasScreenInterface = jest.fn().mockReturnValue(false);
    mockHandleRequest.jovo!.hasVideoInterface = jest.fn().mockReturnValue(false);

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.devices!.xyz).toEqual({
      hasAudioInterface: true,
      hasScreenInterface: false,
      hasVideoInterface: false,
    });
  });

  test('should keep existing device objects', () => {
    jovoUser.config.metaData!.devices = true;
    mockHandleRequest.jovo!.$user.$metaData.devices = {
      test: {
        hasAudioInterface: true,
        hasScreenInterface: true,
        hasVideoInterface: true,
      },
    };

    jovoUser['updateMetaData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$metaData.devices!.test).toEqual({
      hasAudioInterface: true,
      hasScreenInterface: true,
      hasVideoInterface: true,
    });
  });
});

describe('test updateContextData', () => {
  let jovoUser: JovoUser;
  let mockHandleRequest: HandleRequest;

  const config = {
    context: {
      prev: {
        request: {
          inputs: false,
          intent: false,
          sessionId: false,
          state: false,
          timestamp: false,
        },
        response: {
          output: false,
          reprompt: false,
          speech: false,
          state: false,
        },
        size: 1,
      },
    },
  };

  beforeEach(() => {
    jovoUser = new JovoUser(config);
    const app = ({} as unknown) as BaseApp; // hack so we don't have to implement the full BaseApp class, but just the parts we need

    const host = ({} as unknown) as Host;

    const jovo = ({
      $output: {},
      $request: {},
      $requestSessionAttributes: {}, // needed for request.state
      $session: {
        $data: {},
      },
      $type: {}, // needed for request.intent,
      $user: {
        $context: {},
      },
    } as unknown) as Jovo;

    mockHandleRequest = new HandleRequest(app, host, jovo);
  });

  test('should throw JovoError because jovo object is undefined', () => {
    mockHandleRequest.jovo = undefined;

    expect(() => {
      jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal
    }).toThrowError(JovoError);
  });

  test('$context.prev should be undefined because size is 0', () => {
    jovoUser.config.context!.prev!.size = 0;

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev).toBeUndefined();
  });

  test(`shouldn't save empty object`, () => {
    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0]).toBeUndefined();
  });

  test('response should be undefined as all of its options are set to false', () => {
    // set one of request's options to true so something gets saved to the array
    jovoUser.config.context!.prev!.request!.timestamp = true;
    // mock the function called to update timestamp so we don't get any errors
    jovoUser['updatePrevTimestamp'] = jest.fn(); // tslint:disable-line:no-string-literal

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].response).toBeUndefined();
  });

  test('should set response speech to $output.tell', () => {
    jovoUser.config.context!.prev!.response!.speech = true;
    mockHandleRequest.jovo!.$output.tell = {
      speech: 'xyz',
    };

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].response!.speech).toBe('xyz');
  });

  test('should set response.speech to $output.ask', () => {
    jovoUser.config.context!.prev!.response!.speech = true;
    mockHandleRequest.jovo!.$output.ask = {
      reprompt: 'reprompt',
      speech: 'xyz',
    };

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].response!.speech).toBe('xyz');
  });

  test(`shouldn't set response.speech because it's disabled in the config`, () => {
    // enable and mock response.state, so the response object is created and saved to the prev array
    // otherwise we would have an error when trying to access prev[0].response inside expect()
    jovoUser.config.context!.prev!.response!.state = true;
    jovoUser['updatePrevResponseState'] = jest.fn(); // tslint:disable-line:no-string-literal
    jovoUser.config.context!.prev!.response!.speech = false;

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].response!.speech).toBeUndefined();
  });

  test('should set response.reprompt', () => {
    jovoUser.config.context!.prev!.response!.reprompt = true;
    mockHandleRequest.jovo!.$output.ask = {
      reprompt: 'reprompt',
      speech: 'speech',
    };

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].response!.reprompt).toBe('reprompt');
  });

  test(`shouldn't set response.reprompt as it's disabled in the config`, () => {
    // enable and mock response.state, so the response object is created and saved to the prev array
    // otherwise we would have an error when trying to access prev[0].response inside expect()
    jovoUser.config.context!.prev!.response!.state = true;
    jovoUser['updatePrevResponseState'] = jest.fn(); // tslint:disable-line:no-string-literal
    jovoUser.config.context!.prev!.response!.reprompt = false;

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].response!.reprompt).toBeUndefined();
  });

  test('should set response.state', () => {
    jovoUser.config.context!.prev!.response!.state = true;
    mockHandleRequest.jovo!.$session.$data[SessionConstants.STATE] = 'test';

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].response!.state).toBe('test');
  });

  test(`shouldn't set response.state as it's turned off in the config`, () => {
    // enable and mock response.reprompt, so the response object is created and saved to the prev array
    // otherwise we would have an error when trying to access prev[0].response inside expect()
    jovoUser.config.context!.prev!.response!.reprompt = true;
    jovoUser['updatePrevReprompt'] = jest.fn(); // tslint:disable-line:no-string-literal
    jovoUser.config.context!.prev!.response!.state = false;

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].response!.state).toBeUndefined();
  });

  test('should set response.output', () => {
    jovoUser.config.context!.prev!.response!.output = true;
    _set(mockHandleRequest.jovo!, '$output', 'test'); // workaround for readonly property

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].response!.output).toBe('test');
  });

  test(`shouldn't set response.output as it's turned off in the config`, () => {
    // enable and mock response.reprompt, so the response object is created and saved to the prev array
    // otherwise we would have an error when trying to access prev[0].response inside expect()
    jovoUser.config.context!.prev!.response!.reprompt = true;
    jovoUser['updatePrevReprompt'] = jest.fn(); // tslint:disable-line:no-string-literal
    jovoUser.config.context!.prev!.response!.output = false;

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].response!.output).toBeUndefined();
  });

  test('should set request.timestamp', () => {
    jovoUser.config.context!.prev!.request!.timestamp = true;
    mockHandleRequest.jovo!.$request!.getTimestamp = jest.fn().mockReturnValue('test');

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].request!.timestamp).toBe('test');
  });

  test(`shouldn't set request.timestamp`, () => {
    // enable and mock request.inputs, so the request object is created and saved to the prev array
    // otherwise we would have an error when trying to access prev[0].request inside expect()
    jovoUser.config.context!.prev!.request!.inputs = true;
    mockHandleRequest.jovo!.$inputs = {};
    jovoUser.config.context!.prev!.request!.timestamp = false;

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].request!.timestamp).toBeUndefined();
  });

  test('should set request.sessionId', () => {
    jovoUser.config.context!.prev!.request!.sessionId = true;
    mockHandleRequest.jovo!.$request!.getSessionId = jest.fn().mockReturnValue('test');

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].request!.sessionId).toBe('test');
  });

  test(`shouldn't set request.sessionId`, () => {
    // enable and mock request.inputs, so the request object is created and saved to the prev array
    // otherwise we would have an error when trying to access prev[0].request inside expect()
    jovoUser.config.context!.prev!.request!.inputs = true;
    mockHandleRequest.jovo!.$inputs = {};
    jovoUser.config.context!.prev!.request!.sessionId = false;

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].request!.sessionId).toBeUndefined();
  });

  test('should set request.state', () => {
    jovoUser.config.context!.prev!.request!.state = true;
    mockHandleRequest.jovo!.$requestSessionAttributes[SessionConstants.STATE] = 'test';

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].request!.state).toBe('test');
  });

  test(`shouldn't set request.state as it's turned off in the config`, () => {
    // enable and mock request.inputs, so the request object is created and saved to the prev array
    // otherwise we would have an error when trying to access prev[0].request inside expect()
    jovoUser.config.context!.prev!.request!.inputs = true;
    mockHandleRequest.jovo!.$inputs = {};
    jovoUser.config.context!.prev!.request!.state = false;

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].request!.state).toBeUndefined();
  });

  test('should set request.inputs', () => {
    jovoUser.config.context!.prev!.request!.inputs = true;
    mockHandleRequest.jovo!.$inputs = {
      key: ('value' as unknown) as Input, // workaround so we don't have to implement the interface
    };

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].request!.inputs).toEqual({
      key: 'value',
    });
  });

  test(`shouldn't set request.inputs as it's turned off in the config`, () => {
    // enable and mock request.timestamp, so the request object is created and saved to the prev array
    // otherwise we would have an error when trying to access prev[0].request inside expect()
    jovoUser.config.context!.prev!.request!.timestamp = true;
    mockHandleRequest.jovo!.$request!.getTimestamp = jest.fn().mockReturnValue('test');
    jovoUser.config.context!.prev!.request!.inputs = false;

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].request!.inputs).toBeUndefined();
  });

  test(`should set request.intent to intent because it's an IntentRequest`, () => {
    jovoUser.config.context!.prev!.request!.intent = true;
    mockHandleRequest.jovo!.$type.type = EnumRequestType.INTENT;
    _set(mockHandleRequest.jovo!, '$plugins.Router.route.intent', 'test');

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].request!.intent).toBe('test');
  });

  test(`should set request.intent to path because it's not an IntentRequest`, () => {
    jovoUser.config.context!.prev!.request!.intent = true;
    mockHandleRequest.jovo!.$type.type = 'xyz';
    _set(mockHandleRequest.jovo!, '$plugins.Router.route.path', 'test');

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].request!.intent).toBe('test');
  });

  test(`shouldn't set request.intent as it's turned off in the config`, () => {
    // enable and mock request.timestamp, so the request object is created and saved to the prev array
    // otherwise we would have an error when trying to access prev[0].request inside expect()
    jovoUser.config.context!.prev!.request!.timestamp = true;
    mockHandleRequest.jovo!.$request!.getTimestamp = jest.fn().mockReturnValue('test');
    jovoUser.config.context!.prev!.request!.intent = false;

    jovoUser['updateContextData'](mockHandleRequest); // tslint:disable-line:no-string-literal

    expect(mockHandleRequest.jovo!.$user.$context.prev![0].request!.intent).toBeUndefined();
  });
});
