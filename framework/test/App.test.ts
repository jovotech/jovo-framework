import { App, ComponentTreeNode } from '../src';
import { EmptyComponent } from './utilities';

describe('constructor config', () => {
  test('components passed and used', () => {
    const app = new App({
      components: [EmptyComponent],
    });
    expect(app.componentTree.getNodeAt(['EmptyComponent'])).toBeInstanceOf(ComponentTreeNode);
  });

  test('logging boolean passed and used', async () => {
    // reset env variables for this test, otherwise BasicLogging is never included
    const jestWorkerId = process.env.JEST_WORKER_ID;
    process.env.NODE_ENV = 'development';
    delete process.env.JEST_WORKER_ID;
    const app = new App({
      logging: true,
    });
    await app.initialize();
    expect(app.plugins.BasicLogging?.config?.request).toEqual({
      objects: [],
      maskedObjects: [],
      excludedObjects: [],
      enabled: true,
    });
    expect(app.plugins.BasicLogging?.config?.response).toEqual({
      objects: [],
      maskedObjects: [],
      excludedObjects: [],
      enabled: true,
    });
    process.env.NODE_ENV = 'test';
    process.env.JEST_WORKER_ID = jestWorkerId;
  });

  test('logging object passed and used', async () => {
    // reset env variables for this test, otherwise BasicLogging is never included
    const jestWorkerId = process.env.JEST_WORKER_ID;
    process.env.NODE_ENV = 'development';
    delete process.env.JEST_WORKER_ID;
    const app = new App({
      logging: {
        request: {
          objects: [],
        },
        response: {
          objects: [],
        },
      },
    });
    await app.initialize();
    expect(app.plugins.BasicLogging?.config?.request).toEqual({
      objects: [],
      maskedObjects: [],
      excludedObjects: [],
      enabled: true,
    });
    expect(app.plugins.BasicLogging?.config?.response).toEqual({
      objects: [],
      maskedObjects: [],
      excludedObjects: [],
      enabled: true,
    });
    process.env.NODE_ENV = 'test';
    process.env.JEST_WORKER_ID = jestWorkerId;
  });
});
