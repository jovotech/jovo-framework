"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const GoogleAssistant_1 = require("../src/GoogleAssistant");
process.env.NODE_ENV = 'UNIT_TEST';
let app;
let t;
jest.setTimeout(550);
const delay = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
};
beforeEach(() => {
    app = new jovo_framework_1.App();
    const ga = new GoogleAssistant_1.GoogleAssistant();
    app.use(ga);
    t = ga.makeTestSuite();
});
describe('test selection functionality', () => {
    test('add list to response object', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.tell('LAUNCH');
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            done();
        });
    });
});
//# sourceMappingURL=Selection.test.js.map