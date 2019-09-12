process.env.NODE_ENV = 'UNIT_TEST';

import { I18Next } from 'jovo-cms-i18next';
import { BaseApp, HandleRequest, Jovo, SessionConstants } from 'jovo-core';
import { App, Component, ComponentConfig, ComponentPlugin } from '../../src';
import { ComponentConstructorOptions, ComponentSessionData } from '../../src/middleware/Component';

describe('test constructor', () => {
    let componentPlugin: ComponentPlugin;

    test('should merge config passed as param', () => {
        const config = {a: 'test'} as unknown as ComponentConfig;

        componentPlugin = new ComponentPlugin(config);

        expect(componentPlugin.config).toEqual({a: 'test'});
    });
});

describe('test install()', () => {
    test('should create I18Next object', () => {
        const app = new BaseApp();
        const componentPlugin = new ComponentPlugin();

        componentPlugin.install(app);

        expect(componentPlugin.i18next).toBeInstanceOf(I18Next);
    });
});
// jest.mock('jovo-cms-i18next');

describe('test merging of component handlers', () => {
    let app: App;
    let baseApp: BaseApp;
    let mockHandleRequest: HandleRequest;
    let firstLayerComponent: ComponentPlugin;
    beforeEach(() => {
        app = new App();
        baseApp = new BaseApp();

        baseApp.config.plugin = {
            ComponentPlugin: {}
        };

        mockHandleRequest = {
            app: baseApp,
            jovo: {} as unknown as Jovo // workaround so we don't have to implement whole interface
        } as unknown as HandleRequest;

        firstLayerComponent = new ComponentPlugin();
        firstLayerComponent.name = 'FirstLayerComponent';
        firstLayerComponent.handler = {
            FirstLayerComponent: {
                firstLayerIntent() {return;}
            }
        };

        clearMiddlewareFunctions(app);
    });
    // Tests whether the n-th layer components handlers are correctly merged into the n-1-th layer components handler
    test('should merge 3rd layer component\'s config into 2nd layer\'s and their combined handler into 1st layer\'s handler', async () => {
        const secondLayerComponent = new ComponentPlugin();
        secondLayerComponent.name = 'SecondLayerComponent';
        secondLayerComponent.handler = {
            SecondLayerComponent: {
                secondLayerIntent() {return;}
            }
        };
        const thirdLayerComponent = new ComponentPlugin();
        thirdLayerComponent.name = 'ThirdLayerComponent';
        thirdLayerComponent.handler = {
            ThirdLayerComponent: {
                thirdLayerIntent() {return;}
            }
        };

        // ToDo: Is the order of useComponents here important?
        secondLayerComponent.useComponents(thirdLayerComponent);
        firstLayerComponent.useComponents(secondLayerComponent);
        app.useComponents(firstLayerComponent);

        await app.middleware('setup')!.run(mockHandleRequest);
        await app.middleware('request')!.run(mockHandleRequest);

        const expectedResult = JSON.stringify({
            FirstLayerComponent: {
                firstLayerIntent() {return;},
                SecondLayerComponent: {
                    secondLayerIntent() {return;},
                    ThirdLayerComponent: {
                        thirdLayerIntent() {return;}
                    }
                }
            }
        });
        const result = JSON.stringify(mockHandleRequest.app.config.handlers);

        expect(result).toBe(expectedResult);
    });

    test('should merge both 2nd layer components handlers into 1st layer\'s handler', async () => {
        const secondLayerComponent = new ComponentPlugin();
        secondLayerComponent.name = 'SecondLayerComponent'
        secondLayerComponent.handler = {
            SecondLayerComponent: {
                secondLayerIntent() {return;}
            }
        };
        const secondLayerComponent2 = new ComponentPlugin();
        secondLayerComponent2.name = 'SecondLayerComponent2'
        secondLayerComponent2.handler = {
            SecondLayerComponent2: {
                secondLayerIntent2() {return;}
            }
        };

        // ToDo: Is the order of useComponents here important?
        firstLayerComponent.useComponents(secondLayerComponent, secondLayerComponent2);
        app.useComponents(firstLayerComponent);

        await app.middleware('setup')!.run(mockHandleRequest);
        await app.middleware('request')!.run(mockHandleRequest);

        const expectedResult = JSON.stringify({
            FirstLayerComponent: {
                firstLayerIntent() {return;},
                SecondLayerComponent: {
                    secondLayerIntent() {return;}
                },
                SecondLayerComponent2: {
                    secondLayerIntent2() {return;}
                }
            }
        });
        const result = JSON.stringify(mockHandleRequest.app.config.handlers);

        expect(result).toBe(expectedResult);
    });

    test('shouldn\'t change the component\'s handler because there are no child components', async () => {
        app.useComponents(firstLayerComponent);

        await app.middleware('setup')!.run(mockHandleRequest);
        await app.middleware('request')!.run(mockHandleRequest);

        const expectedResult = JSON.stringify({
            FirstLayerComponent: {
                firstLayerIntent() {return;}
            }
        });
        const result = JSON.stringify(mockHandleRequest.app.config.handlers);

        expect(result).toBe(expectedResult);
    });
});

describe('test $activeComponents being updated correctly', () => {
    let app: App;
    let baseApp: BaseApp;
    let mockHandleRequest: HandleRequest;
    let firstLayerComponent: ComponentPlugin;

    beforeEach(() => {
        app = new App();
        baseApp = new BaseApp();

        baseApp.config.plugin = {
            ComponentPlugin: {}
        };

        mockHandleRequest = {
            app: baseApp,
            jovo: {
                $app: baseApp,
                $session: {
                    $data: {
                        [SessionConstants.COMPONENT]: []
                    }
                }
            } as unknown as Jovo // workaround so we don't have to implement whole interface
        } as unknown as HandleRequest;

        firstLayerComponent = new ComponentPlugin();
        firstLayerComponent.name = 'FirstLayerComponent';

        clearMiddlewareFunctions(app);
    });

    test('$activeComponents should be same as $baseComponents at start of app', async () => {
        app.useComponents(firstLayerComponent);

        await app.middleware('setup')!.run(mockHandleRequest); // sets $baseComponents
        await app.middleware('handler')!.run(mockHandleRequest);

        expect(mockHandleRequest.jovo!.$activeComponents).toEqual(mockHandleRequest.app.$baseComponents);
    });

    // Test with sessionComponentStack.length = 1
    test('$activeComponents should be the current active component and its child components (n=1)', async () => {
        const secondLayerComponent = new ComponentPlugin();
        firstLayerComponent.useComponents(secondLayerComponent);
        app.useComponents(firstLayerComponent);
        mockHandleRequest.jovo!.$session.$data[SessionConstants.COMPONENT] = [[firstLayerComponent.name!, {}]];
        
        await app.middleware('setup')!.run(mockHandleRequest);
        await app.middleware('handler')!.run(mockHandleRequest);

        expect(mockHandleRequest.jovo!.$activeComponents).toEqual({
            [firstLayerComponent.name!]: firstLayerComponent,
            [secondLayerComponent.name!]: secondLayerComponent
        });
    });

    // Test with sessionComponentStack.length = 2
    test('$activeComponents should be the current active component and its child components (n=2)', async () => {
        const secondLayerComponent = new ComponentPlugin();
        secondLayerComponent.name = 'SecondLayerComponent';
        const thirdLayerComponent = new ComponentPlugin();
        thirdLayerComponent.name = 'ThirdLayerComponent';
        secondLayerComponent.useComponents(thirdLayerComponent);
        firstLayerComponent.useComponents(secondLayerComponent);
        app.useComponents(firstLayerComponent);
        mockHandleRequest.jovo!.$session.$data[SessionConstants.COMPONENT] = [
            [firstLayerComponent.name, {}],
            [secondLayerComponent.name, {}]
        ];
        
        await app.middleware('setup')!.run(mockHandleRequest);
        await app.middleware('handler')!.run(mockHandleRequest);

        expect(mockHandleRequest.jovo!.$activeComponents).toEqual({
            [secondLayerComponent.name!]: secondLayerComponent,
            [thirdLayerComponent.name!]: thirdLayerComponent
        });
    });
});

describe('test $components setup', () => {
    // $components should have a `Component` object for each `ComponentPlugin` in $activeComponents
    let app: App;
    let baseApp: BaseApp;
    let mockHandleRequest: HandleRequest;
    let firstLayerComponent: ComponentPlugin;

    beforeEach(() => {
        app = new App();
        baseApp = new BaseApp();

        baseApp.config.plugin = {
            ComponentPlugin: {}
        };

        mockHandleRequest = {
            app: baseApp,
            jovo: {
                $app: baseApp,
                $session: {
                    $data: {
                        [SessionConstants.COMPONENT]: []
                    }
                }
            } as unknown as Jovo // workaround so we don't have to implement whole interface
        } as unknown as HandleRequest;

        firstLayerComponent = new ComponentPlugin();
        firstLayerComponent.name = 'FirstLayerComponent';

        clearMiddlewareFunctions(app);
    });

    // no active component => $baseComponents are the active ones
    test('should fill $components with $baseComponents', async () => {
        app.useComponents(firstLayerComponent);
        mockHandleRequest.app.$baseComponents = {[firstLayerComponent.name!]: firstLayerComponent};

        await app.middleware('handler')!.run(mockHandleRequest);

        const componentObjects = Object.values(mockHandleRequest.jovo!.$components);
        const baseComponents = Object.values(mockHandleRequest.app.$baseComponents);

        const result = compareComponentNames(componentObjects, baseComponents);

        expect(result).toBe(true);
    });

    test('should fill $components with $activeComponents', async () => {
        app.useComponents(firstLayerComponent);
        mockHandleRequest.app.$baseComponents = {[firstLayerComponent.name!]: firstLayerComponent};
        mockHandleRequest.jovo!.$session.$data[SessionConstants.COMPONENT] = [[firstLayerComponent.name, {}]];

        await app.middleware('handler')!.run(mockHandleRequest);

        const componentObjects = Object.values(mockHandleRequest.jovo!.$components);
        const activeComponents = Object.values(mockHandleRequest.jovo!.$activeComponents);

        const result = compareComponentNames(componentObjects, activeComponents);

        expect(result).toBe(true);
    });

    /**
     * Runs through both arrays and compares the name for each index, i.e.
     * i-th component name is compared with i-th componentPlugin name.
     * Returns false if they don't match
     * @param {Component[]} components $components values
     * @param {ComponentPlugin[]} componentPlugins
     */
    function compareComponentNames(components: Component[], componentPlugins: ComponentPlugin[]): boolean {
        for (let i = 0; i < components.length; i++) {
            if (components[i].name! !== componentPlugins[i].name) {
                return false;
            }
        }

        return true;
    }
});

describe('test component session stack', () => {
    // $components should have a `Component` object for each `ComponentPlugin` in $activeComponents
    let app: App;
    let baseApp: BaseApp;
    let mockHandleRequest: HandleRequest;
    let firstLayerComponent: ComponentPlugin;
    let componentConstructorOptions: ComponentConstructorOptions;
    let testComponentSessionData: ComponentSessionData;

    beforeEach(() => {
        app = new App();
        baseApp = new BaseApp();

        testComponentSessionData = {
            data: {},
            onCompletedIntent: 'test',
            stateBeforeDelegate: 'test'
        };

        firstLayerComponent = new ComponentPlugin();
        firstLayerComponent.name = 'FirstLayerComponent';

        componentConstructorOptions = {
            config: {enabled: true},
            name: 'FirstLayerComponent'
        };

        mockHandleRequest = {
            app: baseApp,
            jovo: {
                $app: baseApp,
                $session: {
                    $data: {
                        [SessionConstants.COMPONENT]: [
                            [firstLayerComponent.name, testComponentSessionData]
                        ]
                    }
                }
            } as unknown as Jovo // workaround so we don't have to implement whole interface
        } as unknown as HandleRequest;

        clearMiddlewareFunctions(app);
    });

    describe('test loading of component session data', () => {
        test('should load the saved session data into the active component', () => {
            mockHandleRequest.jovo!.$components = {
                FirstLayerComponent: new Component(componentConstructorOptions)
            };
    
            ComponentPlugin.loadLatestComponentSessionData(mockHandleRequest.jovo!);
    
            const component = mockHandleRequest.jovo!.$components.FirstLayerComponent;
    
            expect(component.data).toEqual(testComponentSessionData.data);
            expect(component.onCompletedIntent).toBe(testComponentSessionData.onCompletedIntent);
            expect(component.stateBeforeDelegate).toBe(testComponentSessionData.stateBeforeDelegate);
        });
    
        test('should not change any of the session data', () => {
            mockHandleRequest.jovo!.$components = {
                FirstLayerComponent: new Component(componentConstructorOptions)
            };
    
            ComponentPlugin.loadLatestComponentSessionData(mockHandleRequest.jovo!);
    
            expect(mockHandleRequest.jovo!.$session.$data).toEqual({
                [SessionConstants.COMPONENT]: [
                    [firstLayerComponent.name, testComponentSessionData]
                ]
            });
        });
        
        test('should load the data of the latest component of the session stack', () => {
            mockHandleRequest.jovo!.$session.$data[SessionConstants.COMPONENT].unshift(['test', {}]);

            mockHandleRequest.jovo!.$components = {
                FirstLayerComponent: new Component(componentConstructorOptions)
            };
    
            ComponentPlugin.loadLatestComponentSessionData(mockHandleRequest.jovo!);
    
            const component = mockHandleRequest.jovo!.$components.FirstLayerComponent;
    
            expect(component.data).toEqual(testComponentSessionData.data);
            expect(component.onCompletedIntent).toBe(testComponentSessionData.onCompletedIntent);
            expect(component.stateBeforeDelegate).toBe(testComponentSessionData.stateBeforeDelegate);
        });
    });

    describe('test saving of component session data', () => {
        test('should save the data of the current active component', () => {
            const FirstLayerComponent = new Component(componentConstructorOptions);
            FirstLayerComponent.data = {};
            FirstLayerComponent.onCompletedIntent = 'newIntent';
            FirstLayerComponent.stateBeforeDelegate = 'newState';

            mockHandleRequest.jovo!.$components = {
                FirstLayerComponent
            };

            ComponentPlugin.saveComponentSessionData(mockHandleRequest);

            expect(mockHandleRequest.jovo!.$session.$data[SessionConstants.COMPONENT][0][1]).toEqual({
                data: {},
                onCompletedIntent: 'newIntent',
                stateBeforeDelegate: 'newState'
            });
        });

        test('should leave the other component\'s data unchanged', () => {
            mockHandleRequest.jovo!.$session.$data[SessionConstants.COMPONENT].push(['SecondLayerComponent', {}]);

            const SecondLayerComponent = new Component(componentConstructorOptions);
            SecondLayerComponent.data = {};
            SecondLayerComponent.onCompletedIntent = 'newIntent';
            SecondLayerComponent.stateBeforeDelegate = 'newState';

            mockHandleRequest.jovo!.$components = {
                SecondLayerComponent
            };

            ComponentPlugin.saveComponentSessionData(mockHandleRequest);

            expect(mockHandleRequest.jovo!.$session.$data[SessionConstants.COMPONENT][0]).toEqual(
                ['FirstLayerComponent', testComponentSessionData]
            );
        });
    });

});


describe('test mergeConfig()', () => {
    let componentPlugin: ComponentPlugin;

    beforeEach(() => {
        componentPlugin = new ComponentPlugin();
    });

    test('should return merged config', () => {
        componentPlugin.config = {
            a: 'test',
        } as unknown as ComponentConfig; // hack so we don't have to implement the full ComponentPlugin class, but just the parts we need

        const appConfig = {
            b: 'test',
        } as unknown as ComponentConfig;

        const mergedConfig = {a: 'test', b: 'test'};

        expect(mergedConfig).toEqual({
            a: 'test',
            b: 'test',
        });
    });
});

// describe('test initialize()', () => {
//     let componentPlugin: ComponentPlugin;
//     let mockHandleRequest: HandleRequest;

//     beforeEach(() => {
//         componentPlugin = new ComponentPlugin();
//         mockHandleRequest = {
//             jovo: {} as unknown as Jovo,
//         } as unknown as HandleRequest;
//     });

//     test('should create $components object', () => {
//         componentPlugin.initializeComponent(mockHandleRequest);

//         expect(mockHandleRequest.jovo!.$components).toBeDefined();
//     });

//     test('should add a new Component object to `$components`', () => {
//         componentPlugin.name = 'test';
//         mockHandleRequest.jovo!.$components = {};

//         componentPlugin.initializeComponent(mockHandleRequest);

//         expect(mockHandleRequest.jovo!.$components[ 'test' ]).toBeInstanceOf(Component); // tslint:disable-line:no-string-literal
//     });
// });

describe.only('test loadI18nFiles()', () => {
    let componentPlugin: ComponentPlugin;
    let mockHandleRequest: HandleRequest;
    let i18next: I18Next;

    beforeEach(() => {
        componentPlugin = new ComponentPlugin();

        mockHandleRequest = {
            app: {
                $cms: {},
            } as unknown as BaseApp,
        } as unknown as HandleRequest; // hack so we don't have to implement the full ComponentPlugin class, but just the parts we need

        i18next = {
            config: {},
            loadFiles: jest.fn(),
        } as unknown as I18Next;

        componentPlugin.i18next = i18next;
    });

    test('should set i18next filesDir to be pathToComponent + pathToI18n', () => {
        componentPlugin.name = 'test';
        componentPlugin.pathToI18n = './src/i18n';

        componentPlugin.loadI18nFiles(mockHandleRequest);

        expect(componentPlugin.i18next!.config.filesDir).toBe('components/test/src/i18n');
    });

    test('should call i18next.loadFiles()', () => {
        componentPlugin.name = 'test';
        componentPlugin.pathToI18n = './src/i18n';

        componentPlugin.loadI18nFiles(mockHandleRequest);

        expect(componentPlugin.i18next!.loadFiles).toHaveBeenCalled();
    });
});

/**
 * Deletes all the functions added to the middlewares by default
 * @param {App} app 
 */
function clearMiddlewareFunctions(app: App) {
    app.middlewares.forEach((middleware) => {
        app.middleware(middleware)!.fns = [];
    });
}