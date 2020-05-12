import {
  App,
  Component,
  ComponentPlugin,
  ExpressJS,
  HandleRequest,
  SessionConstants,
  TestSuite,
} from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';

jest.setTimeout(550);
process.env.NODE_ENV = 'UNIT_TEST';

let app: App;
let t: TestSuite;
let firstLayerComponent: ComponentPlugin;

for (const p of [new Alexa(), new GoogleAssistant()]) {
  beforeEach(() => {
    app = new App();
    app.use(p);
    t = p.makeTestSuite();

    app.setHandler({
      LAUNCH: jest.fn(),
    });

    firstLayerComponent = new ComponentPlugin();
    firstLayerComponent.name = 'FirstLayerComponent';
    firstLayerComponent.handler = {
      FirstLayerComponent: {
        START: jest.fn(),
      },
    };
  });

  describe('test initialization of $activeComponents', () => {
    test('should set $baseComponents as $activeComponents if there is no active component', async (done) => {
      app.useComponents(firstLayerComponent); // adds component to $baseComponents
      // no session data which marks the active component
      const request = await t.requestBuilder.launch();
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        const activeComponents = Object.values(handleRequest.jovo!.$activeComponents);
        const baseComponents = Object.values(handleRequest.app.$baseComponents);

        expect(activeComponents).toEqual(baseComponents);
        done();
      });
    });

    test('should set activeComponent (n=1) and its components as active components', async (done) => {
      const secondLayerComponent = new ComponentPlugin();
      secondLayerComponent.name = 'SecondLayerComponent';
      firstLayerComponent.useComponents(secondLayerComponent);
      app.useComponents(firstLayerComponent);
      const request = await t.requestBuilder.launch();
      request.setSessionData({
        [SessionConstants.COMPONENT]: [[firstLayerComponent.name, {}]],
      });
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        const activeComponents = Object.values(handleRequest.jovo!.$activeComponents);
        const correctActiveComponents = [firstLayerComponent, secondLayerComponent];

        expect(correctActiveComponents).toEqual(activeComponents);
        done();
      });
    });

    test('should set activeComponent (n=2) and its components as active components', async (done) => {
      const secondLayerComponent = new ComponentPlugin();
      secondLayerComponent.name = 'SecondLayerComponent';
      const thirdLayerComponent = new ComponentPlugin();
      thirdLayerComponent.name = 'ThirdLayerComponent';
      secondLayerComponent.useComponents(thirdLayerComponent);
      firstLayerComponent.useComponents(secondLayerComponent);
      app.useComponents(firstLayerComponent);
      const request = await t.requestBuilder.launch();
      request.setSessionData({
        [SessionConstants.COMPONENT]: [
          [firstLayerComponent.name, {}],
          [secondLayerComponent.name, {}],
        ],
      });
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        const activeComponents = Object.values(handleRequest.jovo!.$activeComponents);
        const correctActiveComponents = [secondLayerComponent, thirdLayerComponent];

        expect(correctActiveComponents).toEqual(activeComponents);
        done();
      });
    });
  });

  describe('test initialization of $components', () => {
    test('should create object in $components for every active component', async (done) => {
      app.useComponents(firstLayerComponent);

      const request = await t.requestBuilder.launch();
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        const activeComponents = Object.values(handleRequest.jovo!.$activeComponents);
        const components = Object.values(handleRequest.jovo!.$components);

        const result = compareComponentNames(activeComponents, components);

        expect(result).toBeTruthy();
        done();
      });
    });

    test('should load active components data from session data', async (done) => {
      app.useComponents(firstLayerComponent);

      const request = await t.requestBuilder.launch();
      request.setSessionData({
        [SessionConstants.COMPONENT]: [
          [
            firstLayerComponent.name,
            {
              data: {
                key: 'value',
              },
              onCompletedIntent: 'Test',
              stateBeforeDelegate: 'TestState',
            },
          ],
        ],
      });
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        const component = handleRequest.jovo!.$components[firstLayerComponent.name!];
        expect(component.onCompletedIntent).toBe('Test');
        expect(component.stateBeforeDelegate).toBe('TestState');
        expect(component.data).toEqual({ key: 'value' });
        done();
      });
    });
  });

  // TODO: Error: serializes to the same string
  describe.skip('test handler nesting', () => {
    /**
     * Test, whether the component's handler is added correctly to the project handler.
     * Also, test the nesting of n-th layer component's handlers
     */

    test(`should add component's handler to project's handler`, async (done) => {
      app.useComponents(firstLayerComponent);

      const request = await t.requestBuilder.launch();
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        // const expectedResult = JSON.stringify({
        //     LAUNCH() {return;},
        //     FirstLayerComponent: {
        //         START() {return;}
        //     }
        // });

        const expectedResult = {
          FirstLayerComponent: {
            START: jest.fn(),
          },
          LAUNCH: jest.fn(),
        };
        const result = handleRequest.jovo!.$handlers;

        expect(result).toMatchObject(expectedResult);
        done();
      });
    });

    // Tests whether the n-th layer components handlers are correctly merged into the n-1-th layer components handler
    test(`should merge 3rd layer component's config into 2nd layer's and their combined handler into 1st layer's handler`, async (done) => {
      const secondLayerComponent = new ComponentPlugin();
      secondLayerComponent.name = 'SecondLayerComponent';
      secondLayerComponent.handler = {
        SecondLayerComponent: {
          START: jest.fn(),
        },
      };
      const thirdLayerComponent = new ComponentPlugin();
      thirdLayerComponent.name = 'ThirdLayerComponent';
      thirdLayerComponent.handler = {
        ThirdLayerComponent: {
          START: jest.fn(),
        },
      };
      secondLayerComponent.useComponents(thirdLayerComponent);
      firstLayerComponent.useComponents(secondLayerComponent);
      app.useComponents(firstLayerComponent);

      const request = await t.requestBuilder.launch();
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        // const expectedResult = JSON.stringify({
        //     FirstLayerComponent: {
        //         START() {return;},
        //         SecondLayerComponent: {
        //             START() {return;},
        //             ThirdLayerComponent: {
        //                 START() {return;}
        //             }
        //         }
        //     }
        // });
        // const result = JSON.stringify(handleRequest.app.config.handlers);

        const expectedResult = {
          FirstLayerComponent: {
            START: jest.fn(),
            SecondLayerComponent: {
              START: jest.fn(),
              ThirdLayerComponent: {
                START: jest.fn(),
              },
            },
          },
          LAUNCH: jest.fn(),
        };

        const result = handleRequest.app.config.handlers;

        expect(result).toBe(expectedResult);
        done();
      });
    });

    // test.skip('should merge both 2nd layer components handlers into 1st layer\'s handler', async () => {
    //     const secondLayerComponent = new ComponentPlugin();
    //     secondLayerComponent.name = 'SecondLayerComponent'
    //     secondLayerComponent.handler = {
    //         SecondLayerComponent: {
    //             secondLayerIntent() {return;}
    //         }
    //     };
    //     const secondLayerComponent2 = new ComponentPlugin();
    //     secondLayerComponent2.name = 'SecondLayerComponent2'
    //     secondLayerComponent2.handler = {
    //         SecondLayerComponent2: {
    //             secondLayerIntent2() {return;}
    //         }
    //     };

    //     // ToDo: Is the order of useComponents here important?
    //     firstLayerComponent.useComponents(secondLayerComponent, secondLayerComponent2);
    //     app.useComponents(firstLayerComponent);

    //     await app.middleware('setup')!.run(mockHandleRequest);
    //     await app.middleware('request')!.run(mockHandleRequest);

    //     const expectedResult = JSON.stringify({
    //         FirstLayerComponent: {
    //             firstLayerIntent() {return;},
    //             SecondLayerComponent: {
    //                 secondLayerIntent() {return;}
    //             },
    //             SecondLayerComponent2: {
    //                 secondLayerIntent2() {return;}
    //             }
    //         }
    //     });
    //     const result = JSON.stringify(mockHandleRequest.app.config.handlers);

    //     expect(result).toBe(expectedResult);
    // });

    // test.skip('shouldn\'t change the component\'s handler because there are no child components', async () => {
    //     app.useComponents(firstLayerComponent);

    //     await app.middleware('setup')!.run(mockHandleRequest);
    //     await app.middleware('request')!.run(mockHandleRequest);

    //     const expectedResult = JSON.stringify({
    //         FirstLayerComponent: {
    //             firstLayerIntent() {return;}
    //         }
    //     });
    //     const result = JSON.stringify(mockHandleRequest.app.config.handlers);

    //     expect(result).toBe(expectedResult);
    // });
  });

  describe('test delegation', () => {
    test('should add the component to session data', async (done) => {
      app.setHandler({
        LAUNCH() {
          return this.delegate('FirstLayerComponent', { onCompletedIntent: 'test' });
        },
      });
      app.useComponents(firstLayerComponent);

      const request = await t.requestBuilder.launch();
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        const activeComponent = handleRequest.jovo!.$session.$data[
          SessionConstants.COMPONENT
        ].pop();

        expect(activeComponent).toEqual([
          'FirstLayerComponent',
          {
            data: {},
            onCompletedIntent: 'test',
            stateBeforeDelegate: undefined,
          },
        ]);
        done();
      });
    });

    test('parse stateBeforeDelegate', async (done) => {
      app.setHandler({
        LAUNCH() {
          return this.delegate('FirstLayerComponent', {
            onCompletedIntent: 'test',
            stateBeforeDelegate: 'TestState',
          });
        },
      });
      app.useComponents(firstLayerComponent);

      const request = await t.requestBuilder.launch();
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        const activeComponent = handleRequest.jovo!.$session.$data[
          SessionConstants.COMPONENT
        ].pop();

        expect(activeComponent).toEqual([
          'FirstLayerComponent',
          {
            data: {},
            onCompletedIntent: 'test',
            stateBeforeDelegate: 'TestState',
          },
        ]);
        done();
      });
    });

    test('should use current state as stateBeforeDelegate if not parsed', async (done) => {
      app.setHandler({
        TestState: {
          TestIntent() {
            return this.delegate('FirstLayerComponent', { onCompletedIntent: 'test' });
          },
        },
      });
      app.useComponents(firstLayerComponent);

      const request = await (await t.requestBuilder.intent('TestIntent')).setState('TestState');
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        const activeComponent = handleRequest.jovo!.$session.$data[
          SessionConstants.COMPONENT
        ].pop();

        expect(activeComponent).toEqual([
          'FirstLayerComponent',
          {
            data: {},
            onCompletedIntent: 'test',
            stateBeforeDelegate: 'TestState',
          },
        ]);
        done();
      });
    });

    describe('test delegation from within component', () => {
      test('should delegate from component to component', async (done) => {
        // Setup where LAUNCH delegates to FirstLayerComponent, which delegates to SecondLayerComponent.
        app.setHandler({
          LAUNCH() {
            return this.delegate('FirstLayerComponent', { onCompletedIntent: 'test' });
          },
        });
        firstLayerComponent.handler = {
          START() {
            this.delegate('SecondLayerComponent', { onCompletedIntent: 'TestIntent' });
          },
        };
        const secondLayerComponent = new ComponentPlugin();
        secondLayerComponent.name = 'SecondLayerComponent';
        secondLayerComponent.handler = {
          START: jest.fn(),
        };
        firstLayerComponent.useComponents(secondLayerComponent);
        app.useComponents(firstLayerComponent);

        const request = await t.requestBuilder.launch();
        app.handle(ExpressJS.dummyRequest(request));

        app.on('response', (handleRequest: HandleRequest) => {
          expect(secondLayerComponent.handler.START).toHaveBeenCalledTimes(1);
          done();
        });
      });
    });
  });

  describe('test sendComponentResponse', () => {
    beforeEach(() => {
      firstLayerComponent.handler = {
        FirstLayerComponent: {
          START() {
            this.sendComponentResponse({ status: 'SUCCESSFUL' });
          },
        },
      };
    });

    test('should route back to stateBeforeDelegate & onCompletedIntent', async (done) => {
      app.setHandler({
        TestState: {
          TestIntent: jest.fn(),
        },
      });
      app.useComponents(firstLayerComponent);

      const request = await t.requestBuilder.intent('FirstLayerComponent.START');
      request.setSessionData({
        [SessionConstants.COMPONENT]: [
          [
            'FirstLayerComponent',
            {
              onCompletedIntent: 'TestIntent',
              stateBeforeDelegate: 'TestState',
            },
          ],
        ],
      });
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$handlers.TestState.TestIntent).toHaveBeenCalledTimes(1);
        done();
      });
    });

    test('should initialize the $components objects for the active components', async (done) => {
      /**
       * After the SecondLayerComponent sent its response, the active components should be
       * FirstLayerComponent and its child the SecondLayerComponent
       */
      const secondLayerComponent = new ComponentPlugin();
      secondLayerComponent.name = 'SecondLayerComponent';
      secondLayerComponent.handler = {
        SecondLayerComponent: {
          START() {
            this.sendComponentResponse({ status: 'SUCCESSFUL' });
          },
        },
      };
      firstLayerComponent.handler = {
        FirstLayerComponent: {
          TestIntent: jest.fn(),
        },
      };
      firstLayerComponent.useComponents(secondLayerComponent);
      app.useComponents(firstLayerComponent);

      const request = await t.requestBuilder.intent(
        'FirstLayerComponent.SecondLayerComponent.START',
      );
      // session data contains the data for each component that was delegated to.
      request.setSessionData({
        [SessionConstants.COMPONENT]: [
          [
            'FirstLayerComponent',
            {
              onCompletedIntent: 'TestIntent',
            },
          ],
          [
            'SecondLayerComponent',
            {
              onCompletedIntent: 'TestIntent',
              stateBeforeDelegate: 'FirstLayerComponent',
            },
          ],
        ],
      });
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        const components = handleRequest.jovo!.$components;

        expect(components.FirstLayerComponent).toBeDefined();
        expect(components.SecondLayerComponent).toBeDefined();
        done();
      });
    });

    test('should remove the component that sends the response from the session stack', async (done) => {
      app.setHandler({
        TestIntent: jest.fn(),
      });
      app.useComponents(firstLayerComponent);

      const request = await t.requestBuilder.intent('FirstLayerComponent.START');
      request.setSessionData({
        [SessionConstants.COMPONENT]: [
          [
            'FirstLayerComponent',
            {
              onCompletedIntent: 'TestIntent',
            },
          ],
        ],
      });
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$session.$data[SessionConstants.COMPONENT]).toEqual([]);
        done();
      });
    });
  });

  describe('test config nesting for n-th layer components', () => {
    test('should merge project config into component', async (done) => {
      app.$config.components = {
        FirstLayerComponent: {
          key: 'newValue',
        },
      };
      firstLayerComponent.config = {
        key: 'oldValue',
        shouldKeepProperty: true,
      };
      app.useComponents(firstLayerComponent);

      const request = await t.requestBuilder.intent('FirstLayerComponent.START');
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$components.FirstLayerComponent.config).toEqual({
          key: 'newValue',
          shouldKeepProperty: true,
        });
        done();
      });
    });

    test(`should merge component's config into its child components default config`, async (done) => {
      firstLayerComponent.config = {
        SecondLayerComponent: {
          key: 'newValue',
        },
      };
      const secondLayerComponent = new ComponentPlugin();
      secondLayerComponent.name = 'SecondLayerComponent';
      secondLayerComponent.config = {
        key: 'oldValue',
        shouldKeepProperty: true,
      };
      firstLayerComponent.useComponents(secondLayerComponent);
      app.useComponents(firstLayerComponent);

      const request = await t.requestBuilder.intent('FirstLayerComponent.START');
      /**
       * FirstLayerComponent has to be set as active, so SecondLayerComponent is initialized
       */
      request.setSessionData({
        [SessionConstants.COMPONENT]: [
          [
            'FirstLayerComponent',
            {
              onCompletedIntent: 'TestIntent',
            },
          ],
        ],
      });
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$components.SecondLayerComponent.config).toEqual({
          key: 'newValue',
          shouldKeepProperty: true,
        });
        done();
      });
    });

    test('should merge the separate configuration from the bottom up', async (done) => {
      /**
       * Should merge in the order of n, n-1, ..., 0
       * where n is the component's default config and 0 is the project's configuration
       * i.e. the project's configuration is merged last (highest priority)
       */
      app.$config.components = {
        FirstLayerComponent: {
          SecondLayerComponent: {
            fromProjectConfig: 'value',
          },
        },
      };
      firstLayerComponent.config = {
        SecondLayerComponent: {
          fromFirstLayerComponent: 'value',
        },
      };
      const secondLayerComponent = new ComponentPlugin();
      secondLayerComponent.name = 'SecondLayerComponent';
      secondLayerComponent.config = {
        fromSecondLayerComponent: 'value',
        shouldKeepProperty: true,
      };
      firstLayerComponent.useComponents(secondLayerComponent);
      app.useComponents(firstLayerComponent);

      const request = await t.requestBuilder.intent('FirstLayerComponent.START');
      /**
       * FirstLayerComponent has to be set as active, so SecondLayerComponent is initialized
       */
      request.setSessionData({
        [SessionConstants.COMPONENT]: [
          [
            'FirstLayerComponent',
            {
              onCompletedIntent: 'TestIntent',
            },
          ],
        ],
      });
      app.handle(ExpressJS.dummyRequest(request));

      app.on('response', (handleRequest: HandleRequest) => {
        expect(handleRequest.jovo!.$components.SecondLayerComponent.config).toEqual({
          fromFirstLayerComponent: 'value',
          fromProjectConfig: 'value',
          fromSecondLayerComponent: 'value',
          shouldKeepProperty: true,
        });
        done();
      });
    });
  });

  describe('test routing inside a component', () => {
    // TODO
  });
}

/**
 * Runs through the names of all the ComponentPlugins inside `componentPlugins`
 * and checks whether there's a Component inside `components` with the same name.
 *
 * Returns true, if there is one for every ComponentPlugin.
 * @param {ComponentPlugin[]} componentPlugins array of ComponentPlugins
 * @param {Component[]} components array of Components
 */
function compareComponentNames(componentPlugins: ComponentPlugin[], components: Component[]) {
  const componentPluginNames: string[] = componentPlugins.map(
    (componentPlugin) => componentPlugin.name!,
  );
  const componentNames: string[] = components.map((component) => component.name);

  return componentPluginNames.every((componentPluginName) => {
    return componentNames.includes(componentPluginName);
  });
}
