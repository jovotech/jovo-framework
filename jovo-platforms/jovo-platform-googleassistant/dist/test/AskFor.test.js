"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const src_1 = require("../src");
const google_assistant_enums_1 = require("../src/core/google-assistant-enums");
const _get = require("lodash.get");
process.env.NODE_ENV = 'UNIT_TEST';
let app;
let t;
beforeEach(() => {
    app = new jovo_framework_1.App();
    const ga = new src_1.GoogleAssistant();
    app.use(ga);
    t = ga.makeTestSuite();
});
describe('test ON_SIGN_IN', () => {
    test('test askForSignIn', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.askForSignIn('SignInContext');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            const dialogflowResponse = handleRequest.jovo.$response;
            const googleActionResponse = dialogflowResponse.getPlatformResponse();
            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual({
                intent: 'actions.intent.SIGN_IN',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.SignInValueSpec',
                    'optContext': 'SignInContext',
                },
            });
            expect(_get(googleActionResponse, 'inputPrompt')).toEqual({
                initialPrompts: [
                    {
                        textToSpeech: 'PLACEHOLDER_FOR_SIGN_IN',
                    },
                ],
                noInputPrompts: [],
            });
            done();
        });
    }, 250);
    test('test correct type', async (done) => {
        app.setHandler({
            ON_SIGN_IN() { },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('SignInCancelled');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('after.router', (handleRequest) => {
            expect(handleRequest.jovo.$type.type).toBe(google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_SIGN_IN);
            done();
        });
    }, 250);
    test('test correct isSignInCancelled', async (done) => {
        app.setHandler({
            ON_SIGN_IN() {
                expect(this.$googleAction.isSignInCancelled()).toBe(true);
                expect(this.$googleAction.getSignInStatus()).toBe('CANCELLED');
                done();
            },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('SignInCancelled');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    }, 250);
    test('test correct isSignInOk', async (done) => {
        app.setHandler({
            ON_SIGN_IN() {
                expect(this.$googleAction.isSignInOk()).toBe(true);
                expect(this.$googleAction.getSignInStatus()).toBe('OK');
                done();
            },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('SignInOk');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    }, 250);
});
describe('test ON_PERMISSION', () => {
    test('test askForName', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.askForName('AskForNameContext');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            const dialogflowResponse = handleRequest.jovo.$response;
            const googleActionResponse = dialogflowResponse.getPlatformResponse();
            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual({
                intent: 'actions.intent.PERMISSION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                    'optContext': 'AskForNameContext',
                    'permissions': ['NAME'],
                },
            });
            done();
        });
    }, 250);
    test('test askForName correct type ', async (done) => {
        app.setHandler({
            ON_PERMISSION() { },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('OnPermissionName');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('after.router', (handleRequest) => {
            expect(handleRequest.jovo.$type.type).toBe(google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_PERMISSION);
            done();
        });
    }, 250);
    test('test askForPreciseLocation()', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.askForPreciseLocation('AskForPreciseLocationContext');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            const dialogflowResponse = handleRequest.jovo.$response;
            const googleActionResponse = dialogflowResponse.getPlatformResponse();
            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual({
                intent: 'actions.intent.PERMISSION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                    'optContext': 'AskForPreciseLocationContext',
                    'permissions': ['DEVICE_PRECISE_LOCATION'],
                },
            });
            done();
        });
    }, 250);
    test('test askForZipCodeAndCity()', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.askForZipCodeAndCity('AskForZipCodeAndCityContext');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            const dialogflowResponse = handleRequest.jovo.$response;
            const googleActionResponse = dialogflowResponse.getPlatformResponse();
            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual({
                intent: 'actions.intent.PERMISSION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                    'optContext': 'AskForZipCodeAndCityContext',
                    'permissions': ['DEVICE_COARSE_LOCATION'],
                },
            });
            done();
        });
    }, 250);
    test('test askForPermission()', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.askForPermission(['NAME', 'DEVICE_COARSE_LOCATION'], 'AskForPermissionContext');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            const dialogflowResponse = handleRequest.jovo.$response;
            const googleActionResponse = dialogflowResponse.getPlatformResponse();
            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual({
                intent: 'actions.intent.PERMISSION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                    'optContext': 'AskForPermissionContext',
                    'permissions': ['NAME', 'DEVICE_COARSE_LOCATION'],
                },
            });
            done();
        });
    }, 250);
    test('test askForPermission() without optContext', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.askForPermission(['NAME', 'DEVICE_COARSE_LOCATION']);
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            const dialogflowResponse = handleRequest.jovo.$response;
            const googleActionResponse = dialogflowResponse.getPlatformResponse();
            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual({
                intent: 'actions.intent.PERMISSION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                    'optContext': '',
                    'permissions': ['NAME', 'DEVICE_COARSE_LOCATION'],
                },
            });
            done();
        });
    }, 250);
    test('test askForName correct type ', async (done) => {
        app.setHandler({
            ON_PERMISSION() { },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('OnPermissionName');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('after.router', (handleRequest) => {
            expect(handleRequest.jovo.$type.type).toBe(google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_PERMISSION);
            done();
        });
    }, 250);
    test('test askForPreciseLocation correct type ', async (done) => {
        app.setHandler({
            ON_PERMISSION() { },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('OnPermissionPreciseLocation');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('after.router', (handleRequest) => {
            expect(handleRequest.jovo.$type.type).toBe(google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_PERMISSION);
            done();
        });
    }, 250);
    test('test askForName for profile ', async (done) => {
        app.setHandler({
            ON_PERMISSION() {
                expect(this.$googleAction.$user.hasNamePermission()).toBe(true);
                expect(this.$googleAction.$user.getProfile()).toEqual({
                    displayName: 'John Doe',
                    givenName: 'John',
                    familyName: 'Doe',
                });
                done();
            },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('OnPermissionName');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    }, 250);
    test('test askForPreciseLocation for precise location ', async (done) => {
        app.setHandler({
            ON_PERMISSION() {
                expect(this.$googleAction.$user.hasPreciseLocationPermission()).toBe(true);
                expect(this.$googleAction.getDevice()).toEqual({
                    location: {
                        coordinates: {
                            latitude: 37.4219806,
                            longitude: -122.0841979,
                        },
                    },
                });
                done();
            },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('OnPermissionPreciseLocation');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    }, 250);
    test('test askForNotification()', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.askForNotification('TestIntent');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            const dialogflowResponse = handleRequest.jovo.$response;
            const googleActionResponse = dialogflowResponse.getPlatformResponse();
            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual({
                intent: 'actions.intent.PERMISSION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                    'optContext': '',
                    'permissions': ['UPDATE'],
                    'updatePermissionValueSpec': {
                        intent: 'TestIntent',
                    },
                },
            });
            done();
        });
    }, 250);
    test('test askForNotification() without name and text', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.askForNotification('TestIntent');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            const dialogflowResponse = handleRequest.jovo.$response;
            const googleActionResponse = dialogflowResponse.getPlatformResponse();
            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual({
                intent: 'actions.intent.PERMISSION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                    'optContext': '',
                    'permissions': ['UPDATE'],
                    'updatePermissionValueSpec': {
                        intent: 'TestIntent',
                    },
                },
            });
            done();
        });
    }, 250);
    test('test askForNotification() correct type', async (done) => {
        app.setHandler({
            ON_PERMISSION() { },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('OnPermissionNotification');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('after.router', (handleRequest) => {
            expect(handleRequest.jovo.$type.type).toBe(google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_PERMISSION);
            done();
        });
    }, 250);
    test('test askForPlace()', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.askForPlace('requestPrompt', 'permissionContext');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            const dialogflowResponse = handleRequest.jovo.$response;
            const googleActionResponse = dialogflowResponse.getPlatformResponse();
            expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
            expect(_get(googleActionResponse, 'systemIntent')).toEqual({
                intent: 'actions.intent.PLACE',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.PlaceValueSpec',
                    'dialog_spec': {
                        extension: {
                            '@type': 'type.googleapis.com/google.actions.v2.PlaceValueSpec.PlaceDialogSpec',
                            'requestPrompt': 'requestPrompt',
                            'permissionContext': 'permissionContext',
                        },
                    },
                },
            });
            done();
        });
    }, 250);
    test('test askForPlace() correct type', async (done) => {
        app.setHandler({
            ON_PLACE() { },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('OnPlace');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('after.router', (handleRequest) => {
            expect(handleRequest.jovo.$type.type).toBe(google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_PLACE);
            done();
        });
    }, 250);
    test('test getPlace() ', async (done) => {
        app.setHandler({
            ON_PLACE() {
                expect(this.$googleAction.getPlace()).toEqual({
                    formattedAddress: '123 Main Street, Springfield, OR 97477-5319, USA',
                    coordinates: {
                        latitude: 44.0461033,
                        longitude: -123.024248,
                    },
                    name: '123 Main St',
                });
                done();
            },
        });
        const launchRequest = await t.requestBuilder.rawRequestByKey('OnPlace');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    }, 250);
});
//# sourceMappingURL=AskFor.test.js.map