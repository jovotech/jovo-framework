import { JovoRequest, TestSuite, HandleRequest } from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import _get = require('lodash.get');
import { GoogleAssistant, Table, GoogleActionResponse } from '../src';
import { DialogflowResponse } from 'jovo-platform-dialogflow';

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;
jest.setTimeout(550);

beforeEach(() => {
  app = new App();
  const ga = new GoogleAssistant();
  app.use(ga);
  t = ga.makeTestSuite();
});

describe('test Cards', () => {
  describe('test Table Card', () => {
    test('test adding individual columns and rows', async (done) => {
      app.setHandler({
        TableIntent() {
          const tableCard = new Table()
            .setTitle('Table Title')
            .setSubtitle('Table Subtitle')
            .addColumn('Header 1', 'LEADING')
            .addColumn('Header 2', 'LEADING')
            .addRow(['Row 1 Item 1', 'Row 1 Item 2'], false)
            .addRow(['Row 2 Item 1', 'Row 2 Item 2'], false);

          this.$googleAction!.showTable(tableCard);
          this.$googleAction!.tell('Hello Table!');

          const table = this.$googleAction!.$output.GoogleAssistant.Table;
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

      const launchRequest: JovoRequest = await t.requestBuilder.intent('TableIntent');
      app.handle(ExpressJS.dummyRequest(launchRequest));
    });

    test('test adding multiple columns and rows', async (done) => {
      app.setHandler({
        TableIntent() {
          const tableCard = new Table()
            .setTitle('Table Title')
            .setSubtitle('Table Subtitle')
            .addColumns(['Header 1', 'Header 2'])
            .addRows([
              ['Row 1 Item 1', 'Row 1 Item 2'],
              ['Row 2 Item 1', 'Row 2 Item 2'],
            ]);

          this.$googleAction!.showTable(tableCard);
          this.$googleAction!.tell('Hello Table!');

          const table = this.$googleAction!.$output.GoogleAssistant.Table;
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

      const launchRequest: JovoRequest = await t.requestBuilder.intent('TableIntent');
      app.handle(ExpressJS.dummyRequest(launchRequest));
    });

    test('test showSimpleTable', async (done) => {
      app.setHandler({
        TableIntent() {
          this.$googleAction!.showSimpleTable(
            'Table Title',
            'Table Subtitle',
            ['Header 1', 'Header 2'],
            [
              ['Row 1 Item 1', 'Row 1 Item 2'],
              ['Row 2 Item 1', 'Row 2 Item 2'],
            ],
          );
          this.$googleAction!.tell('Hello Table!');

          const table = this.$googleAction!.$output.GoogleAssistant.Table;
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

      const launchRequest: JovoRequest = await t.requestBuilder.intent('TableIntent');
      app.handle(ExpressJS.dummyRequest(launchRequest));
    });

    test('test response', async (done) => {
      app.setHandler({
        TableIntent() {
          this.$googleAction!.showSimpleTable(
            'Table Title',
            'Table Subtitle',
            ['Header 1', 'Header 2'],
            [
              ['Row 1 Item 1', 'Row 1 Item 2'],
              ['Row 2 Item 1', 'Row 2 Item 2'],
            ],
          );
          this.tell('Hello Table!');
        },
      });

      const launchRequest: JovoRequest = await t.requestBuilder.intent('TableIntent');
      launchRequest.setScreenInterface();
      app.handle(ExpressJS.dummyRequest(launchRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        const dialogflowResponse = handleRequest.jovo!.$response as DialogflowResponse;
        const response = dialogflowResponse.getPlatformResponse() as GoogleActionResponse;
        const richResponseItems = response!.richResponse!.items;

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
