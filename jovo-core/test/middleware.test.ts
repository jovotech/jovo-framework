import { ActionSet } from '../src';
import { Extensible } from './../src/core/Extensible';
import { Middleware } from './../src/core/Middleware';

class Parent extends Extensible {
  /**
   * Dummy install implementation
   */
  install() {
    // tslint:disable-line:no-empty
  }
}

test('test Middleware class initialization', () => {
  const middleware = new Middleware('name', new Parent());
  expect(middleware.fns.length).toBe(0);
});

test('test Middleware class use()', () => {
  const middleware = new Middleware('name', new Parent());

  const fn: Function = () => {
    // do stuff
  };

  middleware.use(fn);

  expect(middleware.fns.length).toBe(1);
  expect(middleware.fns[0]).toBe(fn);
  expect(middleware.use(fn)).toBe(middleware);
});

test('test multiple use() calls', () => {
  const middleware = new Middleware('name', new Parent());

  const fn: Function = () => {
    // do stuff
  };

  middleware.use(fn);
  middleware.use(fn);
  middleware.use(fn);
  middleware.use(fn);

  expect(middleware.fns.length).toBe(4);
});
test('test run with multiple functions', async () => {
  const parent = new Parent();
  const middleware = new Middleware('name', new Parent());

  const test = {
    // @ts-ignore
    fn1() {
      // @ts-ignore
      return this.test;
    },
    context1: {
      test: 'abc',
    },
  };

  const test2 = {
    // @ts-ignore
    fn1() {
      // @ts-ignore
      return this.test;
    },
    context1: {
      test: 'def',
    },
  };

  const spy = jest.spyOn(test, 'fn1');
  const spy2 = jest.spyOn(test2, 'fn1');

  middleware.use(test.fn1.bind(test.context1));
  middleware.use(test2.fn1.bind(test2.context1));
  // @ts-ignore
  await middleware.run(undefined);

  expect(spy).toBeCalled();
  expect(spy.mock.results[0].value).toBe('abc');

  expect(spy2).toBeCalled();
  expect(spy2.mock.results[0].value).toBe('def');
});

test('test middleware before/after and events', async () => {
  const parent = new Parent();
  parent.actionSet = new ActionSet(['middleware1'], parent);

  const test = {
    // @ts-ignore
    fn1() {
      // @ts-ignore
      return this.test;
    },
    context1: {
      test: 'abc',
    },
  };

  const beforeTest = {
    // @ts-ignore
    beforeFn1() {
      // @ts-ignore
      return this.test;
    },
    context1: {
      test: 'before',
    },
  };
  const afterTest = {
    // @ts-ignore
    afterFn1() {
      // @ts-ignore
      return this.test;
    },
    context1: {
      test: 'after',
    },
  };

  const spy = jest.spyOn(test, 'fn1');
  const spyBefore = jest.spyOn(beforeTest, 'beforeFn1');
  const spyAfter = jest.spyOn(afterTest, 'afterFn1');

  parent.middleware('middleware1')!.use(test.fn1.bind(test.context1));
  parent.middleware('before.middleware1')!.use(beforeTest.beforeFn1.bind(beforeTest.context1));
  parent.middleware('after.middleware1')!.use(afterTest.afterFn1.bind(afterTest.context1));

  const listener = {
    beforeListenerFunc() {
      // tslint:disable-line:no-empty
    },
    listenerFunc() {
      // tslint:disable-line:no-empty
    },
    afterListenerFunc() {
      // tslint:disable-line:no-empty
    },
  };
  const spyBeforeListener = jest.spyOn(listener, 'beforeListenerFunc');
  const spyListener = jest.spyOn(listener, 'listenerFunc');
  const spyAfterListener = jest.spyOn(listener, 'afterListenerFunc');

  parent.on('before.middleware1', listener.beforeListenerFunc);
  parent.on('middleware1', listener.listenerFunc);
  parent.on('after.middleware1', listener.afterListenerFunc);

  // @ts-ignore
  await parent.middleware('middleware1')!.run(undefined);

  expect(spy).toBeCalled();
  expect(spy.mock.results[0].value).toBe('abc');

  expect(spyBefore).toBeCalled();
  expect(spyBefore.mock.results[0].value).toBe('before');

  expect(spyAfter).toBeCalled();
  expect(spyAfter.mock.results[0].value).toBe('after');

  expect(spyBeforeListener).toBeCalled();
  expect(spyListener).toBeCalled();
  expect(spyAfterListener).toBeCalled();
});

test('test middleware sequential', async (done) => {
  const parent = new Parent();
  let testValue = '';

  parent.actionSet = new ActionSet(['middleware1'], parent);
  parent.middleware('middleware1')!.use(() => {
    testValue += 'a';
  });
  parent.middleware('middleware1')!.use(() => {
    testValue += 'b';
  });
  parent.middleware('middleware1')!.use(() => {
    testValue += 'c';
  });

  parent.on('after.middleware1', () => {
    expect(testValue).toBe('abc');
    done();
  });
  // @ts-ignore
  await parent.middleware('middleware1')!.run(undefined);
});

test('test middleware parallel', async (done) => {
  const parent = new Parent();

  parent.actionSet = new ActionSet(['middleware1'], parent);
  parent.middleware('middleware1')!.use(async () => {
    await delay();
  });
  parent.middleware('middleware1')!.use(async () => {
    await delay();
  });
  parent.middleware('middleware1')!.use(async () => {
    await delay();
  });

  parent.on('after.middleware1', () => {
    done();
  });
  // @ts-ignore
  await parent.middleware('middleware1')!.run(undefined, true);
}, 350);

test('test remove middleware', async () => {
  const parent = new Parent();

  parent.actionSet = new ActionSet(['middleware1'], parent);

  const f1 = () => {}; // tslint:disable-line:no-empty
  const f2 = () => {}; // tslint:disable-line:no-empty
  const f3 = () => {}; // tslint:disable-line:no-empty
  const f4 = () => {}; // tslint:disable-line:no-empty

  parent.middleware('middleware1')!.use(f1, f2, f3, f4);
  expect(parent.middleware('middleware1')!.fns.length).toBe(4);
  parent.middleware('middleware1')!.remove(f3);
  expect(parent.middleware('middleware1')!.fns.length).toBe(3);

  parent.middleware('middleware1')!.fns.forEach((f) => {
    if (f === f3) {
      expect(false).toBeTruthy();
    }
  });
});

test('test skip middleware', async () => {
  const parent = new Parent();
  let testValue = '';
  parent.actionSet = new ActionSet(['middleware1'], parent);

  parent.middleware('middleware1')!.use(() => {
    testValue = 'test';
  });

  parent.middleware('middleware1')!.skip();
  // @ts-ignore
  await parent.middleware('middleware1')!.run(undefined, true);

  expect(testValue).toBe('');
});

test('test disable middleware', async () => {
  const parent = new Parent();
  let testValue = '';
  parent.actionSet = new ActionSet(['middleware1'], parent);

  parent.middleware('middleware1')!.use(() => {
    testValue = 'test';
  });

  parent.middleware('middleware1')!.disable();
  // @ts-ignore
  await parent.middleware('middleware1')!.run(undefined, true);

  expect(testValue).toBe('');
});

test('test try/catch in sequential', async (done) => {
  const parent = new Parent();
  parent.actionSet = new ActionSet(['middleware1'], parent);
  expect.assertions(1);

  const f1 = () => {
    throw new Error('Middleware Error');
  };

  parent.middleware('middleware1')!.use(f1);

  try {
    // @ts-ignore
    await parent.middleware('middleware1')!.run(undefined);
  } catch (e) {
    expect(e).toEqual(new Error('Middleware Error'));
    done();
  }
});
test('test try/catch in parallel', async (done) => {
  const parent = new Parent();
  parent.actionSet = new ActionSet(['middleware1'], parent);
  expect.assertions(1);

  const f1 = () => {
    throw new Error('Middleware Error');
  };

  parent.middleware('middleware1')!.use(f1);

  try {
    // @ts-ignore
    await parent.middleware('middleware1')!.run(undefined, true);
  } catch (e) {
    expect(e).toEqual(new Error('Middleware Error'));
    done();
  }
});

/**
 * Helper method
 * Transforms setTimeout to a Promise object.
 * @returns {Promise}
 */
function delay() {
  return new Promise((resolve) => setTimeout(resolve, 250));
}
