import { BaseApp, EnumRequestType, Jovo } from '../src';
import { Handler } from '../src/plugins/Handler';

require('source-map-support').install(); // tslint:disable-line
process.env.NODE_ENV = 'UNIT_TEST';
let app: BaseApp;
jest.setTimeout(250);

test('test setHandler with single handler', () => {
  app = new BaseApp();
  app.setHandler({
    LAUNCH() {
      // tslint:disable-line:no-empty
    },
    State: {
      Intent() {
        //
      },
    },
  });
  expect(app.config.handlers.LAUNCH).toBeDefined();
  expect(app.config.handlers.State).toBeDefined();
});

test('test setHandler with multiple handlers', () => {
  app = new BaseApp();
  app.setHandler(
    {
      State: {
        Intent() {
          //
        },
      },
    },
    {
      State2: {
        Intent() {
          //
        },
      },
    },
  );
  expect(app.config.handlers.State).toBeDefined();
  expect(app.config.handlers.State2).toBeDefined();
});

test('test throw exception on non existing route', (done) => {
  const jovo = {
    $handlers: {
      IntentA() {
        // tslint:disable-line:no-empty
      },
      Unhandled() {
        // tslint:disable-line:no-empty
      },
    },
    $type: {
      type: EnumRequestType.INTENT,
    },
  };

  // @ts-ignore
  Handler.applyHandle(jovo, {
    path: 'NonExistingPath',
    type: EnumRequestType.INTENT,
  }).catch((e: Error) => {
    expect(e.message).toBe('Could not find the route "NonExistingPath" in your handler function.');
    done();
  });
});

test('test skip throwing exception on optional request types', async (done) => {
  const jovo = {
    $handlers: {},
    $type: {
      optional: true,
      type: 'OPTIONAL_TYPE',
    },
  };
  // @ts-ignore
  await Handler.applyHandle(jovo, {
    path: 'OPTIONAL_TYPE',
    type: 'OPTIONAL_TYPE',
  });
  done();
});

test('test skip exception on non existing route, because ON_REQUEST is there', async (done) => {
  const jovo = {
    $handlers: {
      ON_REQUEST() {
        // tslint:disable-line:no-empty
      },
      IntentA() {
        // tslint:disable-line:no-empty
      },
      Unhandled() {
        // tslint:disable-line:no-empty
      },
    },
  };

  // @ts-ignore
  await Handler.applyHandle(jovo, {
    path: 'NonExistingPath',
    type: EnumRequestType.INTENT,
  });

  done();
});

test('test applyHandle on route that returns rejected promise', async () => {
  const rejectionReason = 'rejection reason';

  expect.assertions(1);

  const jovo = {
    $handlers: {
      IntentA() {
        return Promise.reject(rejectionReason);
      },
    },
  };

  try {
    // @ts-ignore
    await Handler.applyHandle(jovo, {
      path: 'IntentA',
      type: EnumRequestType.INTENT,
    });
  } catch (e) {
    expect(e).toEqual(rejectionReason);
  }
});

test('test handleOnPromise on route that returns rejected promise', async () => {
  const rejectionReason = 'rejection reason';

  expect.assertions(1);

  try {
    const jovo = {
      $handlers: {
        ON_REQUEST() {
          return Promise.reject(rejectionReason);
        },
      },
    };
    // @ts-ignore
    await Handler.handleOnPromise(jovo, jovo.$handlers.ON_REQUEST);
  } catch (e) {
    expect(e).toEqual(rejectionReason);
  }
});

test('test applyHandle on route that immediately throws exception', async () => {
  const errorMessage = 'an error';

  expect.assertions(1);
  const jovo = {
    $handlers: {
      IntentA() {
        throw new Error(errorMessage);
      },
    },
  };

  try {
    // @ts-ignore
    await Handler.applyHandle(jovo, {
      path: 'IntentA',
      type: EnumRequestType.INTENT,
    });
  } catch (e) {
    expect(e).toEqual(new Error(errorMessage));
  }
});

test('test handleOnPromise on route that immediately throws exception', async () => {
  const errorMessage = 'an error';

  expect.assertions(1);

  try {
    const jovo = {
      $handlers: {
        ON_REQUEST() {
          throw new Error(errorMessage);
        },
      },
    };
    // @ts-ignore
    await Handler.handleOnPromise(jovo, jovo.$handlers.ON_REQUEST);
  } catch (e) {
    expect(e).toEqual(new Error(errorMessage));
  }
});

test('test applyHandle on route with callback', async () => {
  const jovoObj = {
    $handlers: {
      IntentA(jovo: Jovo, callback: () => void) {
        callback();
      },
    },
  };

  // @ts-ignore
  await Handler.applyHandle(jovoObj, {
    path: 'IntentA',
    type: EnumRequestType.INTENT,
  });
});

test('test applyHandle on route with callback that immediately throws exception', async () => {
  const errorMessage = 'an error';

  expect.assertions(1);

  const jovo = {
    $handlers: {
      IntentA(callback: () => {}) {
        throw new Error(errorMessage);
      },
    },
  };

  try {
    // @ts-ignore
    await Handler.applyHandle(jovo, {
      path: 'IntentA',
      type: EnumRequestType.INTENT,
    });
  } catch (e) {
    expect(e).toEqual(new Error(errorMessage));
  }
});

test('test handleOnPromise on route with callback that immediately throws exception', async () => {
  const errorMessage = 'an error';

  expect.assertions(1);

  try {
    const jovoObj = {
      $handlers: {
        ON_REQUEST(jovo: Jovo, callback: () => {}) {
          throw new Error(errorMessage);
        },
      },
    };
    // @ts-ignore
    await Handler.handleOnPromise(jovoObj, jovoObj.$handlers.ON_REQUEST);
  } catch (e) {
    expect(e).toEqual(new Error(errorMessage));
  }
});

test('test applyHandle on route that returns a promise wrapped in a promise', async () => {
  let executed = false;

  const jovo = {
    $handlers: {
      async IntentA() {
        return new Promise((resolve) => {
          executed = true;
          resolve();
        });
      },
    },
  };

  // @ts-ignore
  await Handler.applyHandle(jovo, {
    path: 'IntentA',
    type: EnumRequestType.INTENT,
  });

  expect(executed).toBeTruthy();
});

test('test handleOnPromise on route that returns a promise wrapped in a promise', async () => {
  let executed = false;

  const jovo = {
    $handlers: {
      async ON_REQUEST() {
        return new Promise((resolve) => {
          executed = true;
          resolve();
        });
      },
    },
  };

  // @ts-ignore
  await Handler.handleOnPromise(jovo, jovo.$handlers.ON_REQUEST);

  expect(executed).toBeTruthy();
});

test('test handleOnRequest', () => {
  const jovo = {
    $handlers: {
      ON_REQUEST() {
        // tslint:disable-line:no-empty
      },
    },
  };
  const spy = jest.spyOn(jovo.$handlers, 'ON_REQUEST');
  // @ts-ignore
  Handler.handleOnRequest(jovo);
  expect(spy).toBeCalled();
});

test('test handleOnNewSession (NEW_SESSION=true)', async () => {
  let newSessionVariable = false;
  const jovo = {
    $handlers: {
      NEW_SESSION() {
        newSessionVariable = true;
      },
    },
    isNewSession: () => true,
  };

  const spy = jest.spyOn(jovo.$handlers, 'NEW_SESSION');
  // @ts-ignore
  await Handler.handleOnNewSession(jovo);
  expect(spy).toBeCalled();
  expect(newSessionVariable).toBe(true);
});

test('test handleOnNewSession (NEW_SESSION=false)', () => {
  let newSessionVariable = false;

  const jovo = {
    $handlers: {
      NEW_SESSION() {
        newSessionVariable = true;
      },
    },
    isNewSession: () => false,
  };

  const spy = jest.spyOn(jovo.$handlers, 'NEW_SESSION');
  // @ts-ignore
  Handler.handleOnNewSession(jovo);
  expect(newSessionVariable).toBe(false);
});

test('test handleOnNewUser (NEW_USER=true)', async () => {
  let newUserVariable = false;

  const jovo = {
    $handlers: {
      NEW_USER() {
        newUserVariable = true;
      },
    },
    $user: {
      isNew: () => true,
    },
  };

  const spy = jest.spyOn(jovo.$handlers, 'NEW_USER');
  // @ts-ignore
  await Handler.handleOnNewUser(jovo);
  expect(spy).toBeCalled();
  expect(newUserVariable).toBe(true);
});

test('test handleOnNewUser (NEW_USER=false)', async () => {
  let newUserVariable = false;

  const jovo = {
    $handlers: {
      NEW_USER() {
        newUserVariable = true;
      },
    },
    $user: {
      isNew: () => false,
    },
  };

  const spy = jest.spyOn(jovo.$handlers, 'NEW_USER');
  // @ts-ignore
  await Handler.handleOnNewUser(jovo);
  expect(newUserVariable).toBe(false);
});

test('test handleOnPromise with triggeredToIntent = true', async () => {
  let executed = false;
  const jovo = {
    $handlers: {
      async ON_REQUEST() {
        executed = true;
      },
    },
    triggeredToIntent: true,
  };
  // @ts-ignore
  await Handler.handleOnPromise(jovo, jovo.$handlers.ON_REQUEST);

  expect(executed).toBeFalsy();
});
