import {
  AnyObject,
  App,
  AsyncJovo,
  BaseOutput,
  HandleRequest,
  MiddlewareCollection,
  OutputTemplate,
} from '../src';
import {
  ExamplePlatform,
  ExamplePlatformDevice,
  ExamplePlatformJovo,
  ExamplePlatformRequest,
  ExamplePlatformResponse,
  ExamplePlatformUser,
  ExampleServer,
} from './utilities';

const app = {} as App;
const platform = new ExamplePlatform();
const server = new ExampleServer({
  input: {},
});
const middlewareCollection = new MiddlewareCollection();
const handleRequest = { app, platform, server, middlewareCollection } as unknown as HandleRequest;

describe('Jovo.$send', () => {
  const jovo = platform.createJovoInstance(app, handleRequest);

  beforeEach(() => {
    jovo.$output = [];
  });

  test('string passed', async () => {
    await jovo.$send('Hello');
    await jovo.$send('World');
    expect(jovo.$output).toEqual([{ message: 'Hello' }, { message: 'World' }]);
  });

  test('object passed', async () => {
    await jovo.$send({
      message: 'Hello',
    });
    await jovo.$send({
      message: 'world',
    });
    expect(jovo.$output).toEqual([{ message: 'Hello' }, { message: 'world' }]);
  });

  test('array passed', async () => {
    await jovo.$send([
      {
        message: 'Hello',
      },
    ]);
    await jovo.$send([
      {
        message: 'world',
      },
    ]);
    expect(jovo.$output).toEqual([
      {
        message: 'Hello',
      },
      {
        message: 'world',
      },
    ]);
  });

  test('Output class passed', async () => {
    class ExampleOutput extends BaseOutput {
      build(): OutputTemplate | OutputTemplate[] {
        return {
          message: 'Hello world',
        };
      }
    }
    await jovo.$send(ExampleOutput);
    expect(jovo.$output).toEqual([
      {
        message: 'Hello world',
      },
    ]);
  });

  test('Output class internal properties overwritten', async () => {
    class ExampleOutput extends BaseOutput {
      build(): OutputTemplate | OutputTemplate[] {
        return {
          message: 'Hello',
        };
      }
    }
    await jovo.$send(ExampleOutput);
    await jovo.$send(ExampleOutput, {
      message: 'world',
    });
    expect(jovo.$output).toEqual([
      {
        message: 'Hello',
      },
      {
        message: 'world',
      },
    ]);
  });

  test('Output class internal properties overwritten (boolean values)', async () => {
    class ExampleOutput extends BaseOutput {
      build(): OutputTemplate | OutputTemplate[] {
        return {
          message: 'Hello',
          listen: true,
        };
      }
    }
    await jovo.$send(ExampleOutput, {
      message: 'world',
      listen: false,
    });
    expect(jovo.$output).toEqual([
      {
        message: 'world',
        listen: false,
      },
    ]);
  });
});

test('AsyncJovo.$send', async () => {
  class ExamplePlatformAsyncJovo extends AsyncJovo<
    ExamplePlatformRequest,
    ExamplePlatformResponse,
    ExamplePlatformJovo,
    ExamplePlatformUser,
    ExamplePlatformDevice,
    ExamplePlatform
  > {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected sendResponse(response: ExamplePlatformResponse): Promise<unknown> {
      return Promise.resolve();
    }
  }
  const jovo = new ExamplePlatformAsyncJovo(app, handleRequest, platform);

  // wrap sendResponse with jest.fn to detect times the method has been called
  const sendResponseMethod = (jovo as AnyObject).sendResponse;
  (jovo as AnyObject).sendResponse = jest.fn(sendResponseMethod);

  await jovo.$send('Hello');
  await jovo.$send({ message: 'world' });

  expect((jovo as AnyObject).sendResponse).toHaveBeenCalledTimes(2);
  expect(jovo.$output).toEqual([{ message: 'Hello' }, { message: 'world' }]);
});

test('check generated jovo.$id ', async () => {
  const spy = jest
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore`
    .spyOn(ExamplePlatformRequest.prototype, 'getRequestId')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore`
    .mockImplementation(() => undefined);
  const jovo = platform.createJovoInstance(app, handleRequest);

  // @see https://melvingeorge.me/blog/check-if-string-valid-uuid-regex-javascript
  const checkIfValidUUID = (str: string) => {
    // Regular expression to check if string is a valid UUID
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(str);
  };
  expect(checkIfValidUUID(jovo.$id)).toBeTruthy();
  spy.mockRestore();
});

test('check jovo.$id from request', async () => {
  const jovo = platform.createJovoInstance(app, handleRequest);
  expect(jovo.$id).toEqual('requestId');
});
