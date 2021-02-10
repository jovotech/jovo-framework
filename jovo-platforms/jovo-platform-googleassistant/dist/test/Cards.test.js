"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const _get = require("lodash.get");
const src_1 = require("../src");
process.env.NODE_ENV = 'UNIT_TEST';
let app;
let t;
jest.setTimeout(550);
beforeEach(() => {
    app = new jovo_framework_1.App();
    const ga = new src_1.GoogleAssistant();
    app.use(ga);
    t = ga.makeTestSuite();
});
describe('test Cards', () => {
    describe('test Table Card', () => {
        test('test adding individual columns and rows', async (done) => {
            app.setHandler({
                TableIntent() {
                    const tableCard = new src_1.Table()
                        .setTitle('Table Title')
                        .setSubtitle('Table Subtitle')
                        .addColumn('Header 1', 'LEADING')
                        .addColumn('Header 2', 'LEADING')
                        .addRow(['Row 1 Item 1', 'Row 1 Item 2'], false)
                        .addRow(['Row 2 Item 1', 'Row 2 Item 2'], false);
                    this.$googleAction.showTable(tableCard);
                    this.$googleAction.tell('Hello Table!');
                    const table = this.$googleAction.$output.GoogleAssistant.Table;
                    expect(_get(table, 'title')).toBe('Table Title');
                    expect(_get(table, 'subtitle')).toBe('Table Subtitle');
                    expect(_get(table, 'columnProperties[0].header')).toBe('Header 1');
                    expect(_get(table, 'columnProperties[1].header')).toBe('Header 2');
                    expect(_get(table, 'rows[0].cells[0].text')).toBe('Row 1 Item 1');
                    expect(_get(table, 'rows[0].cells[1].text')).toBe('Row 1 Item 2');
                    expect(_get(table, 'rows[1].cells[0].text')).toBe('Row 2 Item 1');
                    expect(_get(table, 'rows[1].cells[1].text')).toBe('Row 2 Item 2');
                    done();
                },
            });
            const launchRequest = await t.requestBuilder.intent('TableIntent');
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('test adding multiple columns and rows', async (done) => {
            app.setHandler({
                TableIntent() {
                    const tableCard = new src_1.Table()
                        .setTitle('Table Title')
                        .setSubtitle('Table Subtitle')
                        .addColumns(['Header 1', 'Header 2'])
                        .addRows([
                        ['Row 1 Item 1', 'Row 1 Item 2'],
                        ['Row 2 Item 1', 'Row 2 Item 2'],
                    ]);
                    this.$googleAction.showTable(tableCard);
                    this.$googleAction.tell('Hello Table!');
                    const table = this.$googleAction.$output.GoogleAssistant.Table;
                    expect(_get(table, 'title')).toBe('Table Title');
                    expect(_get(table, 'subtitle')).toBe('Table Subtitle');
                    expect(_get(table, 'columnProperties[0].header')).toBe('Header 1');
                    expect(_get(table, 'columnProperties[1].header')).toBe('Header 2');
                    expect(_get(table, 'rows[0].cells[0].text')).toBe('Row 1 Item 1');
                    expect(_get(table, 'rows[0].cells[1].text')).toBe('Row 1 Item 2');
                    expect(_get(table, 'rows[1].cells[0].text')).toBe('Row 2 Item 1');
                    expect(_get(table, 'rows[1].cells[1].text')).toBe('Row 2 Item 2');
                    done();
                },
            });
            const launchRequest = await t.requestBuilder.intent('TableIntent');
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('test showSimpleTable', async (done) => {
            app.setHandler({
                TableIntent() {
                    this.$googleAction.showSimpleTable('Table Title', 'Table Subtitle', ['Header 1', 'Header 2'], [
                        ['Row 1 Item 1', 'Row 1 Item 2'],
                        ['Row 2 Item 1', 'Row 2 Item 2'],
                    ]);
                    this.$googleAction.tell('Hello Table!');
                    const table = this.$googleAction.$output.GoogleAssistant.Table;
                    expect(_get(table, 'title')).toBe('Table Title');
                    expect(_get(table, 'subtitle')).toBe('Table Subtitle');
                    expect(_get(table, 'columnProperties[0].header')).toBe('Header 1');
                    expect(_get(table, 'columnProperties[1].header')).toBe('Header 2');
                    expect(_get(table, 'rows[0].cells[0].text')).toBe('Row 1 Item 1');
                    expect(_get(table, 'rows[0].cells[1].text')).toBe('Row 1 Item 2');
                    expect(_get(table, 'rows[1].cells[0].text')).toBe('Row 2 Item 1');
                    expect(_get(table, 'rows[1].cells[1].text')).toBe('Row 2 Item 2');
                    done();
                },
            });
            const launchRequest = await t.requestBuilder.intent('TableIntent');
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
        });
        test('test response', async (done) => {
            app.setHandler({
                TableIntent() {
                    this.$googleAction.showSimpleTable('Table Title', 'Table Subtitle', ['Header 1', 'Header 2'], [
                        ['Row 1 Item 1', 'Row 1 Item 2'],
                        ['Row 2 Item 1', 'Row 2 Item 2'],
                    ]);
                    this.tell('Hello Table!');
                },
            });
            const launchRequest = await t.requestBuilder.intent('TableIntent');
            launchRequest.setScreenInterface();
            app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
            app.on('response', (handleRequest) => {
                const dialogflowResponse = handleRequest.jovo.$response;
                const response = dialogflowResponse.getPlatformResponse();
                const richResponseItems = response.richResponse.items;
                expect(richResponseItems).toContainEqual({
                    tableCard: {
                        title: 'Table Title',
                        subtitle: 'Table Subtitle',
                        columnProperties: [
                            { header: 'Header 1', horizontalAlignment: 'LEADING' },
                            { header: 'Header 2', horizontalAlignment: 'LEADING' },
                        ],
                        rows: [
                            { cells: [{ text: 'Row 1 Item 1' }, { text: 'Row 1 Item 2' }], dividerAfter: false },
                            { cells: [{ text: 'Row 2 Item 1' }, { text: 'Row 2 Item 2' }], dividerAfter: false },
                        ],
                    },
                });
                done();
            });
        });
    });
});
//# sourceMappingURL=Cards.test.js.map