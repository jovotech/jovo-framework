import { AnyObject, App, APP_MIDDLEWARES, DbPlugin, InvalidParentError, Jovo } from '../src';
import { EmptyPlatform, ExampleExtensible, ExamplePlatform, ExampleServer } from './utilities';

test('Invalid parent: HandleRequest expected', () => {
  const extensible = new ExampleExtensible();
  const platform = new ExamplePlatform();
  expect(() => {
    platform.mount(extensible);
  }).toThrowError(InvalidParentError);
});

describe('middlewareCollection', () => {
  test('no middlewareCollection was specified: default set used', () => {
    const platform = new ExamplePlatform();
    expect(Object.keys(platform.middlewareCollection.middlewares)).toEqual(APP_MIDDLEWARES);
  });

  test('middlewareCollection was specified: default overwritten', () => {
    const platform = new EmptyPlatform();
    expect(Object.keys(platform.middlewareCollection.middlewares)).toHaveLength(0);
  });
});

describe('enableDatabaseSessionStorage', () => {
  test('no DbPlugin installed', async () => {
    const platform = new ExamplePlatform();
    const enableDatabaseSessionStorageMethod = (platform as AnyObject).enableDatabaseSessionStorage;
    (platform as AnyObject).enableDatabaseSessionStorage = jest.fn(
      enableDatabaseSessionStorageMethod,
    );
    const app = new App({
      plugins: [platform],
    });
    await app.initialize();
    const server = new ExampleServer({
      input: {},
    });
    await app.handle(server);
    expect((platform as AnyObject).enableDatabaseSessionStorage).toHaveBeenCalled();
  });

  test('DbPlugin installed', async () => {
    class ExampleDbPlugin extends DbPlugin {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      loadData(userId: string, jovo: Jovo): Promise<void> {
        return Promise.resolve(undefined);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      saveData(userId: string, jovo: Jovo): Promise<void> {
        return Promise.resolve(undefined);
      }
    }

    const app = new App({
      plugins: [new ExamplePlatform(), new ExampleDbPlugin()],
    });
    app.hook('after.request.end', (jovo) => {
      expect((jovo.$config.plugin?.ExampleDbPlugin as AnyObject)?.storedElements?.session).toBe(
        true,
      );
    });
    await app.initialize();
    const server = new ExampleServer({
      input: {},
    });
    await app.handle(server);
  });
});
