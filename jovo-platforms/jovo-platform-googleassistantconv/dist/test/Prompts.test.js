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
describe('test different prompts', () => {
    test('add first simple to response', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.addFirstSimple({
                    text: 'Hello World text',
                    speech: 'Hello World speech',
                });
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            const response = handleRequest.jovo.$response;
            expect(response.isFirstSimple('Hello World speech', 'Hello World text')).toBeTruthy();
            done();
        });
    });
    test('add last simple to response', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.addLastSimple({
                    text: 'Hello World text',
                    speech: 'Hello World speech',
                });
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            const response = handleRequest.jovo.$response;
            expect(response.isLastSimple('Hello World speech', 'Hello World text')).toBeTruthy();
            done();
        });
    });
    test('add basic card', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.addBasicCard({
                    title: 'Title',
                    subtitle: 'Subtitle',
                    text: 'Text',
                });
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            var _a, _b;
            const response = handleRequest.jovo.$response;
            expect((_b = (_a = response.prompt) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.card).toEqual({
                title: 'Title',
                subtitle: 'Subtitle',
                text: 'Text',
            });
            done();
        });
    });
    test('add image card', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.addImageCard({
                    url: 'https://via.placeholder.com/450x350?text=Basic+Card',
                    alt: 'Image text',
                });
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            var _a, _b;
            const response = handleRequest.jovo.$response;
            expect((_b = (_a = response.prompt) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.image).toEqual({
                url: 'https://via.placeholder.com/450x350?text=Basic+Card',
                alt: 'Image text',
            });
            done();
        });
    });
    test('add table', async (done) => {
        app.setHandler({
            LAUNCH() {
                this.$googleAction.addTable({
                    columns: [
                        {
                            header: 'Column A',
                        },
                        {
                            header: 'Column B',
                        },
                        {
                            header: 'Column C',
                        },
                    ],
                    image: {
                        alt: 'Google Assistant logo',
                        height: 0,
                        url: 'https://developers.google.com/assistant/assistant_96.png',
                        width: 0,
                    },
                    rows: [
                        {
                            cells: [
                                {
                                    text: 'A1',
                                },
                                {
                                    text: 'B1',
                                },
                                {
                                    text: 'C1',
                                },
                            ],
                        },
                        {
                            cells: [
                                {
                                    text: 'A2',
                                },
                                {
                                    text: 'B2',
                                },
                                {
                                    text: 'C2',
                                },
                            ],
                        },
                        {
                            cells: [
                                {
                                    text: 'A3',
                                },
                                {
                                    text: 'B3',
                                },
                                {
                                    text: 'C3',
                                },
                            ],
                        },
                    ],
                    subtitle: 'Table Subtitle',
                    title: 'Table Title',
                });
            },
        });
        const launchRequest = await t.requestBuilder.launch();
        app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        app.on('response', (handleRequest) => {
            var _a, _b;
            const response = handleRequest.jovo.$response;
            expect((_b = (_a = response.prompt) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.table).toEqual({
                columns: [
                    {
                        header: 'Column A',
                    },
                    {
                        header: 'Column B',
                    },
                    {
                        header: 'Column C',
                    },
                ],
                image: {
                    alt: 'Google Assistant logo',
                    height: 0,
                    url: 'https://developers.google.com/assistant/assistant_96.png',
                    width: 0,
                },
                rows: [
                    {
                        cells: [
                            {
                                text: 'A1',
                            },
                            {
                                text: 'B1',
                            },
                            {
                                text: 'C1',
                            },
                        ],
                    },
                    {
                        cells: [
                            {
                                text: 'A2',
                            },
                            {
                                text: 'B2',
                            },
                            {
                                text: 'C2',
                            },
                        ],
                    },
                    {
                        cells: [
                            {
                                text: 'A3',
                            },
                            {
                                text: 'B3',
                            },
                            {
                                text: 'C3',
                            },
                        ],
                    },
                ],
                subtitle: 'Table Subtitle',
                title: 'Table Title',
            });
            done();
        });
    });
});
//# sourceMappingURL=Prompts.test.js.map