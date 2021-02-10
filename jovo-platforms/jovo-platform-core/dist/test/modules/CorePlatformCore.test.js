"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework"); // tslint:disable-line
const src_1 = require("../../src");
// tslint:disable-next-line
console.log = () => { };
process.env.NODE_ENV = 'UNIT_TEST';
let app;
let t;
jest.setTimeout(500);
beforeEach(() => {
    app = new jovo_framework_1.App();
    const assistant = new src_1.CorePlatform();
    app.use(assistant);
    t = assistant.makeTestSuite();
});
describe('test requests', () => {
    test('test SessionEndedRequest', async (done) => {
        app.setHandler({
            END() {
                done();
            },
        });
        const request = await t.requestBuilder.rawRequestByKey('SessionEndedRequest');
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
    });
    test('test empty response', async (done) => {
        app.setHandler({
            // tslint:disable-next-line
            END() { },
        });
        const request = await t.requestBuilder.end();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(request));
        app.on('response', (handleRequest) => {
            const response = handleRequest.jovo.$response;
            expect(response).toEqual({
                response: {},
                sessionData: {},
                userData: {},
                version: '1.0',
            });
            done();
        });
    });
});
//# sourceMappingURL=CorePlatformCore.test.js.map