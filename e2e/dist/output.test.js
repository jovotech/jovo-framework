"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const jovo_platform_alexa_1 = require("jovo-platform-alexa");
const jovo_platform_googleassistant_1 = require("jovo-platform-googleassistant");
jest.setTimeout(550);
process.env.NODE_ENV = 'UNIT_TEST';
let app;
let t;
for (const p of [new jovo_platform_alexa_1.Alexa(), new jovo_platform_googleassistant_1.GoogleAssistant()]) {
    beforeEach(() => {
        app = new jovo_framework_1.App();
        app.use(p);
        t = p.makeTestSuite();
    });
    describe('test tell', () => {
        test('tell plain text', async (done) => {
            app.setHandler({
                LAUNCH() {
                    this.tell('Hello World!');
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell('Hello World!')).toBe(true);
                done();
            });
        });
        test('tell speechbuilder', async (done) => {
            app.setHandler({
                LAUNCH() {
                    this.$speech.addText('Hello World!');
                    this.tell(this.$speech);
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell('Hello World!')).toBe(true);
                done();
            });
        });
        test('tell ssml', async (done) => {
            app.setHandler({
                LAUNCH() {
                    this.tell('<speak>Hello <break time="100ms"/></speak>');
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isTell('Hello <break time="100ms"/>')).toBe(true);
                done();
            });
        });
    });
    describe('test ask', () => {
        test('ask plain text', async (done) => {
            app.setHandler({
                LAUNCH() {
                    this.ask('Hello World!', 'Reprompt');
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isAsk('Hello World!', 'Reprompt')).toBe(true);
                done();
            });
        });
        test('ask speechbuilder', async (done) => {
            app.setHandler({
                LAUNCH() {
                    this.$speech.addText('Hello World!');
                    this.$reprompt.addText('Reprompt!');
                    this.ask(this.$speech, this.$reprompt);
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isAsk('Hello World!', 'Reprompt!')).toBe(true);
                done();
            });
        });
        test('ask ssml', async (done) => {
            app.setHandler({
                LAUNCH() {
                    this.ask('<speak>Hello <break time="100ms"/></speak>', '<speak>Reprompt <break time="100ms"/></speak>');
                },
            });
            const launchRequest = await t.requestBuilder.launch();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                expect(handleRequest.jovo.$response.isAsk('Hello <break time="100ms"/>', 'Reprompt <break time="100ms"/>')).toBe(true);
                done();
            });
        });
    });
}
//# sourceMappingURL=output.test.js.map