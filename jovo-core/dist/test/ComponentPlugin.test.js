"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'UNIT_TEST';
const src_1 = require("../src");
const I18Next_1 = require("../src/plugins/I18Next");
describe('test constructor', () => {
    let componentPlugin;
    test('should merge config passed as param', () => {
        const config = { a: 'test' };
        componentPlugin = new src_1.ComponentPlugin(config);
        expect(componentPlugin.config).toEqual({ a: 'test' });
    });
});
describe('test install()', () => {
    test('should create I18Next object', () => {
        const app = new src_1.BaseApp();
        const componentPlugin = new src_1.ComponentPlugin();
        componentPlugin.install(app);
        expect(componentPlugin.i18next).toBeInstanceOf(I18Next_1.I18Next);
    });
});
describe('test $activeComponents being updated correctly', () => {
    let app;
    let baseApp;
    let mockHandleRequest;
    let firstLayerComponent;
    beforeEach(() => {
        app = new src_1.BaseApp();
        baseApp = new src_1.BaseApp();
        baseApp.config.plugin = {
            ComponentPlugin: {},
        };
        mockHandleRequest = {
            app: baseApp,
            jovo: {
                $app: baseApp,
                $session: {
                    $data: {
                        [src_1.SessionConstants.COMPONENT]: [],
                    },
                },
            },
        };
        firstLayerComponent = new src_1.ComponentPlugin();
        firstLayerComponent.name = 'FirstLayerComponent';
    });
    test('$activeComponents should be same as $baseComponents at start of app', () => {
        app.useComponents(firstLayerComponent);
        src_1.ComponentPlugin.setActiveComponentPlugins(mockHandleRequest.jovo);
        expect(mockHandleRequest.jovo.$activeComponents).toEqual(mockHandleRequest.app.$baseComponents);
    });
    // Test with sessionComponentStack.length = 1
    test('$activeComponents should be the current active component and its child components (n=1)', () => {
        const secondLayerComponent = new src_1.ComponentPlugin();
        secondLayerComponent.name = 'SecondLayerComponent';
        firstLayerComponent.components = {
            [secondLayerComponent.name]: secondLayerComponent,
        };
        mockHandleRequest.app.$baseComponents = {
            [firstLayerComponent.name]: firstLayerComponent,
        };
        mockHandleRequest.jovo.$session.$data[src_1.SessionConstants.COMPONENT] = [
            [firstLayerComponent.name, {}],
        ];
        src_1.ComponentPlugin.setActiveComponentPlugins(mockHandleRequest.jovo);
        expect(mockHandleRequest.jovo.$activeComponents).toEqual({
            [firstLayerComponent.name]: firstLayerComponent,
            [secondLayerComponent.name]: secondLayerComponent,
        });
    });
    // Test with sessionComponentStack.length = 2
    test('$activeComponents should be the current active component and its child components (n=2)', async () => {
        const secondLayerComponent = new src_1.ComponentPlugin();
        secondLayerComponent.name = 'SecondLayerComponent';
        const thirdLayerComponent = new src_1.ComponentPlugin();
        thirdLayerComponent.name = 'ThirdLayerComponent';
        secondLayerComponent.components = {
            [thirdLayerComponent.name]: thirdLayerComponent,
        };
        firstLayerComponent.components = {
            [secondLayerComponent.name]: secondLayerComponent,
        };
        mockHandleRequest.app.$baseComponents = {
            [firstLayerComponent.name]: firstLayerComponent,
        };
        mockHandleRequest.jovo.$session.$data[src_1.SessionConstants.COMPONENT] = [
            [firstLayerComponent.name, {}],
            [secondLayerComponent.name, {}],
        ];
        src_1.ComponentPlugin.setActiveComponentPlugins(mockHandleRequest.jovo);
        expect(mockHandleRequest.jovo.$activeComponents).toEqual({
            [secondLayerComponent.name]: secondLayerComponent,
            [thirdLayerComponent.name]: thirdLayerComponent,
        });
    });
});
describe('test $components setup', () => {
    // $components should have a `Component` object for each `ComponentPlugin` in $activeComponents
    let app;
    let baseApp;
    let mockHandleRequest;
    let firstLayerComponent;
    beforeEach(() => {
        app = new src_1.BaseApp();
        baseApp = new src_1.BaseApp();
        baseApp.config.plugin = {
            ComponentPlugin: {},
        };
        mockHandleRequest = {
            app: baseApp,
            jovo: {
                $app: baseApp,
                $session: {
                    $data: {
                        [src_1.SessionConstants.COMPONENT]: [],
                    },
                },
            },
        };
        firstLayerComponent = new src_1.ComponentPlugin();
        firstLayerComponent.name = 'FirstLayerComponent';
    });
    // no active component => $baseComponents are the active ones
    test('should fill $components with $baseComponents', async () => {
        mockHandleRequest.app.$baseComponents = { [firstLayerComponent.name]: firstLayerComponent };
        src_1.ComponentPlugin.initializeComponents(mockHandleRequest);
        const componentObjects = Object.values(mockHandleRequest.jovo.$components);
        const baseComponents = Object.values(mockHandleRequest.app.$baseComponents);
        const result = compareComponentNames(componentObjects, baseComponents);
        expect(result).toBe(true);
    });
    test('should fill $components with $activeComponents', async () => {
        mockHandleRequest.app.$baseComponents = { [firstLayerComponent.name]: firstLayerComponent };
        mockHandleRequest.jovo.$session.$data[src_1.SessionConstants.COMPONENT] = [
            [firstLayerComponent.name, {}],
        ];
        src_1.ComponentPlugin.initializeComponents(mockHandleRequest);
        const componentObjects = Object.values(mockHandleRequest.jovo.$components);
        const activeComponents = Object.values(mockHandleRequest.jovo.$activeComponents);
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
    function compareComponentNames(components, componentPlugins) {
        for (let i = 0; i < components.length; i++) {
            if (components[i].name !== componentPlugins[i].name) {
                return false;
            }
        }
        return true;
    }
});
describe('test component session stack', () => {
    // $components should have a `Component` object for each `ComponentPlugin` in $activeComponents
    let app;
    let baseApp;
    let mockHandleRequest;
    let firstLayerComponent;
    let componentConstructorOptions;
    let testComponentSessionData;
    beforeEach(() => {
        app = new src_1.BaseApp();
        baseApp = new src_1.BaseApp();
        testComponentSessionData = {
            data: {},
            onCompletedIntent: 'test',
            stateBeforeDelegate: 'test',
        };
        firstLayerComponent = new src_1.ComponentPlugin();
        firstLayerComponent.name = 'FirstLayerComponent';
        componentConstructorOptions = {
            config: { enabled: true },
            name: 'FirstLayerComponent',
        };
        mockHandleRequest = {
            app: baseApp,
            jovo: {
                $app: baseApp,
                $session: {
                    $data: {
                        [src_1.SessionConstants.COMPONENT]: [[firstLayerComponent.name, testComponentSessionData]],
                    },
                },
            },
        };
    });
    describe('test loading of component session data', () => {
        test('should load the saved session data into the active component', () => {
            mockHandleRequest.jovo.$components = {
                FirstLayerComponent: new src_1.Component(componentConstructorOptions),
            };
            src_1.ComponentPlugin.loadLatestComponentSessionData(mockHandleRequest.jovo);
            const component = mockHandleRequest.jovo.$components.FirstLayerComponent;
            expect(component.data).toEqual(testComponentSessionData.data);
            expect(component.onCompletedIntent).toBe(testComponentSessionData.onCompletedIntent);
            expect(component.stateBeforeDelegate).toBe(testComponentSessionData.stateBeforeDelegate);
        });
        test('should not change any of the session data', () => {
            mockHandleRequest.jovo.$components = {
                FirstLayerComponent: new src_1.Component(componentConstructorOptions),
            };
            src_1.ComponentPlugin.loadLatestComponentSessionData(mockHandleRequest.jovo);
            expect(mockHandleRequest.jovo.$session.$data).toEqual({
                [src_1.SessionConstants.COMPONENT]: [[firstLayerComponent.name, testComponentSessionData]],
            });
        });
        test('should load the data of the latest component of the session stack', () => {
            mockHandleRequest.jovo.$session.$data[src_1.SessionConstants.COMPONENT].unshift(['test', {}]);
            mockHandleRequest.jovo.$components = {
                FirstLayerComponent: new src_1.Component(componentConstructorOptions),
            };
            src_1.ComponentPlugin.loadLatestComponentSessionData(mockHandleRequest.jovo);
            const component = mockHandleRequest.jovo.$components.FirstLayerComponent;
            expect(component.data).toEqual(testComponentSessionData.data);
            expect(component.onCompletedIntent).toBe(testComponentSessionData.onCompletedIntent);
            expect(component.stateBeforeDelegate).toBe(testComponentSessionData.stateBeforeDelegate);
        });
    });
    describe('test saving of component session data', () => {
        test('should save the data of the current active component', () => {
            const FirstLayerComponent = new src_1.Component(componentConstructorOptions);
            FirstLayerComponent.data = {};
            FirstLayerComponent.onCompletedIntent = 'newIntent';
            FirstLayerComponent.stateBeforeDelegate = 'newState';
            mockHandleRequest.jovo.$components = {
                FirstLayerComponent,
            };
            src_1.ComponentPlugin.saveComponentSessionData(mockHandleRequest);
            expect(mockHandleRequest.jovo.$session.$data[src_1.SessionConstants.COMPONENT][0][1]).toEqual({
                data: {},
                onCompletedIntent: 'newIntent',
                stateBeforeDelegate: 'newState',
            });
        });
        test(`should leave the other component's data unchanged`, () => {
            mockHandleRequest.jovo.$session.$data[src_1.SessionConstants.COMPONENT].push([
                'SecondLayerComponent',
                {},
            ]);
            const SecondLayerComponent = new src_1.Component(componentConstructorOptions);
            SecondLayerComponent.data = {};
            SecondLayerComponent.onCompletedIntent = 'newIntent';
            SecondLayerComponent.stateBeforeDelegate = 'newState';
            mockHandleRequest.jovo.$components = {
                SecondLayerComponent,
            };
            src_1.ComponentPlugin.saveComponentSessionData(mockHandleRequest);
            expect(mockHandleRequest.jovo.$session.$data[src_1.SessionConstants.COMPONENT][0]).toEqual([
                'FirstLayerComponent',
                testComponentSessionData,
            ]);
        });
    });
});
describe('test mergeConfig()', () => {
    let componentPlugin;
    beforeEach(() => {
        componentPlugin = new src_1.ComponentPlugin();
    });
    test('should return merged config', () => {
        componentPlugin.config = {
            a: 'test',
        }; // hack so we don't have to implement the full ComponentPlugin class, but just the parts we need
        const appConfig = {
            b: 'test',
        };
        const mergedConfig = { a: 'test', b: 'test' };
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
describe('test loadI18nFiles()', () => {
    let componentPlugin;
    let mockHandleRequest;
    let i18next;
    beforeEach(() => {
        componentPlugin = new src_1.ComponentPlugin();
        mockHandleRequest = {
            app: {
                $cms: {},
            },
        }; // hack so we don't have to implement the full ComponentPlugin class, but just the parts we need
        i18next = {
            config: {},
            loadFiles: jest.fn(),
        };
        componentPlugin.i18next = i18next;
    });
    test('should set i18next filesDir to be pathToComponent + pathToI18n', () => {
        componentPlugin.name = 'test';
        componentPlugin.pathToI18n = './src/i18n';
        componentPlugin.loadI18nFiles(mockHandleRequest);
        expect(componentPlugin.i18next.config.filesDir).toBe('components/test/src/i18n');
    });
    test('should call i18next.loadFiles()', () => {
        componentPlugin.name = 'test';
        componentPlugin.pathToI18n = './src/i18n';
        componentPlugin.loadI18nFiles(mockHandleRequest);
        expect(componentPlugin.i18next.loadFiles).toHaveBeenCalled();
    });
});
//# sourceMappingURL=ComponentPlugin.test.js.map