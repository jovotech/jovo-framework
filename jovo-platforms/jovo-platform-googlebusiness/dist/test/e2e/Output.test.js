"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_db_filedb_1 = require("jovo-db-filedb");
const jovo_framework_1 = require("jovo-framework");
const src_1 = require("../../src");
const GoogleBusinessMockNlu_1 = require("./helper/GoogleBusinessMockNlu");
const Utils_1 = require("./helper/Utils");
// GoogleBusinessRequest can be used to add NLU data only if the NODE_ENV is set to "UNIT_TEST"
process.env.NODE_ENV = 'UNIT_TEST';
let app;
let t;
jest.setTimeout(550);
/**
 * NLU:
 * We use a mock NLU to process the NLU data added to the requests. That's only done for the integration's own tests.
 * When the integration is used in production, one can use the project's NLU.
 *
 * DB:
 * Since Google Business Messages doesn't allow session attributes in the request/response, we use a DB.
 */
beforeEach(() => {
    app = new jovo_framework_1.App();
    const googleBusiness = new src_1.GoogleBusiness();
    googleBusiness.response = jest.fn(); // mock function so no actual API calls are made
    googleBusiness.use(new GoogleBusinessMockNlu_1.GoogleBusinessMockNlu());
    app.use(googleBusiness, new jovo_db_filedb_1.FileDb2({
        path: Utils_1.PATH_TO_DB_DIR,
    }));
    t = googleBusiness.makeTestSuite();
});
afterAll(() => {
    Utils_1.clearDbFolder();
});
describe('test tell', () => {
    test('tell plain text', async (done) => {
        app.setHandler({
            TestIntent() {
                this.tell('Hello World!');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello World!')).toBe(true);
            done();
        });
    });
    test('tell speechbuilder', async (done) => {
        app.setHandler({
            TestIntent() {
                this.$speech.addText('Hello World!');
                this.tell(this.$speech);
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello World!')).toBe(true);
            done();
        });
    });
    test('tell ssml', async (done) => {
        app.setHandler({
            TestIntent() {
                this.tell('<speak>Hello <break time="100ms"/></speak>');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isTell('Hello <break time="100ms"/>')).toBe(true);
            done();
        });
    });
});
describe('test ask', () => {
    test('ask plain text', async (done) => {
        app.setHandler({
            TestIntent() {
                this.ask('Hello World!', 'Reprompt');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isAsk('Hello World!', 'Reprompt')).toBe(true);
            done();
        });
    });
    test('ask speechbuilder', async (done) => {
        app.setHandler({
            TestIntent() {
                this.$speech.addText('Hello World!');
                this.$reprompt.addText('Reprompt!');
                this.ask(this.$speech, this.$reprompt);
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isAsk('Hello World!')).toBe(true);
            done();
        });
    });
    test('ask ssml', async (done) => {
        app.setHandler({
            TestIntent() {
                this.ask('<speak>Hello <break time="100ms"/></speak>', '<speak>Reprompt <break time="100ms"/></speak>');
            },
        });
        const intentRequest = await t.requestBuilder.intent('TestIntent', {});
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(intentRequest));
        app.on('response', (handleRequest) => {
            expect(handleRequest.jovo.$response.isAsk('Hello <break time="100ms"/>')).toBe(true);
            done();
        });
    });
});
//# sourceMappingURL=Output.test.js.map