import { AnyObject, OmitIndex } from '@jovotech/cli-core';
import {
  App,
  BasicLogging,
  BasicLoggingConfig,
  HandleRequest,
  Jovo,
  JovoRequest,
  JovoResponse,
  LoggingFormat,
  RequestResponseConfig,
  Server,
} from '../../src';
import * as Utilities from '../../src/utilities';

jest.mock('../../src/utilities');

jest
  .spyOn(Utilities, 'copy')
  .mockImplementation((request?: AnyObject, config?: AnyObject) =>
    JSON.parse(JSON.stringify(request)),
  );

const mockedLog: jest.SpyInstance = jest.spyOn(console, 'log').mockReturnThis();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('constructor', () => {
  test('should fill "enabled" properties if not set', () => {
    const logging: BasicLogging = new BasicLogging({ enabled: false });
    expect((logging.config.request as RequestResponseConfig).enabled).toBeFalsy();
    expect((logging.config.response as RequestResponseConfig).enabled).toBeFalsy();
  });

  test('should add default request/response config', () => {
    const logging: BasicLogging = new BasicLogging({
      request: { enabled: false },
      response: { enabled: false },
    });
    const defaultConfig: RequestResponseConfig = {
      enabled: false,
      excludedObjects: [],
      maskedObjects: [],
      objects: [],
    };
    expect(logging.config.request).toStrictEqual(defaultConfig);
    expect(logging.config.response).toStrictEqual(defaultConfig);
  });
});

describe('getDefaultConfig()', () => {
  test('should return default config', () => {
    const defaultConfig: BasicLoggingConfig = {
      skipTests: true,
      enabled: true,
      request: {
        enabled: true,
        excludedObjects: [],
        maskedObjects: [],
        objects: [],
      },
      response: {
        enabled: true,
        excludedObjects: [],
        maskedObjects: [],
        objects: [],
      },
      format: LoggingFormat.Pretty,
      styling: true,
      maskValue: '[ Hidden ]',
      indentation: 2,
      colorizeSettings: {
        colors: {
          STRING_KEY: 'white',
          STRING_LITERAL: 'green',
          NUMBER_LITERAL: 'yellow',
          BRACE: 'white.bold',
        },
      },
    };

    const logging: BasicLogging = new BasicLogging();
    expect(logging.config).toStrictEqual(defaultConfig);
  });
});

describe('mount()', () => {
  test('should not log if disabled', async () => {
    const mockedLogRequest: jest.SpyInstance = jest
      .spyOn<OmitIndex<BasicLogging>, 'logRequest'>(BasicLogging.prototype, 'logRequest')
      .mockReturnThis();
    const mockedLogResponse: jest.SpyInstance = jest
      .spyOn<OmitIndex<BasicLogging>, 'logResponse'>(BasicLogging.prototype, 'logResponse')
      .mockReturnThis();
    const logging: BasicLogging = new BasicLogging({
      request: { enabled: false },
      response: { enabled: false },
    });
    const handleRequest: HandleRequest = new HandleRequest(new App(), {} as Server);

    logging.mount(handleRequest);
    await handleRequest.middlewareCollection.run('request.start', {} as Jovo);
    await handleRequest.middlewareCollection.run('response.end', {} as Jovo);

    expect(mockedLogRequest).toBeCalledTimes(0);
    expect(mockedLogResponse).toBeCalledTimes(0);

    mockedLogRequest.mockRestore();
    mockedLogResponse.mockRestore();
  });

  test('should log if enabled', async () => {
    const mockedLogRequest: jest.SpyInstance = jest
      .spyOn<OmitIndex<BasicLogging>, 'logRequest'>(BasicLogging.prototype, 'logRequest')
      .mockReturnThis();
    const mockedLogResponse: jest.SpyInstance = jest
      .spyOn<OmitIndex<BasicLogging>, 'logResponse'>(BasicLogging.prototype, 'logResponse')
      .mockReturnThis();
    const logging: BasicLogging = new BasicLogging();
    const handleRequest: HandleRequest = new HandleRequest(new App(), {} as Server);

    logging.mount(handleRequest);
    await handleRequest.middlewareCollection.run('request.start', {} as Jovo);
    await handleRequest.middlewareCollection.run('response.end', {} as Jovo);

    expect(mockedLogRequest).toBeCalledTimes(1);
    expect(mockedLogResponse).toBeCalledTimes(1);

    mockedLogRequest.mockRestore();
    mockedLogResponse.mockRestore();
  });
});

describe('logRequest()', () => {
  test('should set _BASIC_LOGGING_START to now', async () => {
    const now = 123;
    jest.spyOn(Date.prototype, 'getTime').mockReturnValue(now);
    const logging: BasicLogging = new BasicLogging();
    const jovo: Jovo = { $request: { foo: 'bar' } as unknown as JovoRequest, $data: {} } as Jovo;
    await logging.logRequest(jovo);

    expect(jovo.$data._BASIC_LOGGING_START).toEqual(now);
  });

  test('should call mask() if configured', async () => {
    const maskedObjects: string[] = ['foo'];
    const maskValue = 'MASK';
    const logging: BasicLogging = new BasicLogging({
      maskValue,
      request: {
        enabled: true,
        maskedObjects,
      },
    });
    const request: AnyObject = { foo: 'bar' };
    const jovo: Jovo = { $request: request as JovoRequest, $data: {} } as Jovo;
    await logging.logRequest(jovo);
    expect(Utilities.copy).toBeCalledTimes(1);
    expect(Utilities.mask).toBeCalledTimes(1);
    expect(Utilities.mask).toBeCalledWith(request, maskedObjects, maskValue);
  });

  test('should log in pretty format', async () => {
    const logging: BasicLogging = new BasicLogging({
      format: LoggingFormat.Pretty,
    });
    const request: AnyObject = { foo: 'bar' };
    const jovo: Jovo = { $request: request as JovoRequest, $data: {} } as Jovo;
    await logging.logRequest(jovo);

    expect(mockedLog).toBeCalledTimes(2);
  });

  test('should log in json format', async () => {
    const logging: BasicLogging = new BasicLogging({
      format: LoggingFormat.Json,
    });
    const request: AnyObject = { foo: 'bar' };
    const jovo: Jovo = { $request: request as JovoRequest, $data: {} } as Jovo;
    await logging.logRequest(jovo);

    expect(mockedLog).toBeCalledTimes(1);
  });
});

describe('logResponse()', () => {
  test('should call mask() if configured', async () => {
    const maskedObjects: string[] = ['foo'];
    const maskValue = 'MASK';
    const logging: BasicLogging = new BasicLogging({
      maskValue,
      response: {
        enabled: true,
        maskedObjects,
      },
    });
    const response: AnyObject = { foo: 'bar' };
    const jovo: Jovo = { $response: response as JovoResponse, $data: {} } as Jovo;
    await logging.logResponse(jovo);
    expect(Utilities.copy).toBeCalledTimes(1);
    expect(Utilities.mask).toBeCalledTimes(1);
    expect(Utilities.mask).toBeCalledWith(response, maskedObjects, maskValue);
  });

  test('should log in pretty format', async () => {
    const logging: BasicLogging = new BasicLogging({
      format: LoggingFormat.Pretty,
    });
    const response: AnyObject = { foo: 'bar' };
    const jovo: Jovo = { $response: response as JovoResponse, $data: {} } as Jovo;
    await logging.logResponse(jovo);

    expect(mockedLog).toBeCalledTimes(2);
  });

  test('should log in json format', async () => {
    const logging: BasicLogging = new BasicLogging({
      format: LoggingFormat.Json,
    });
    const response: AnyObject = { foo: 'bar' };
    const jovo: Jovo = { $response: response as JovoResponse, $data: {} } as Jovo;
    await logging.logResponse(jovo);

    expect(mockedLog).toBeCalledTimes(1);
  });
});
