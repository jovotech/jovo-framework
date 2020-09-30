import {
  HandleRequest,
  JovoRequest,
  TestSuite,
  SessionConstants,
  Jovo,
  EnumRequestType,
  LogLevel,
} from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import _set = require('lodash.set');
import { GoogleAssistant } from '../src/GoogleAssistant';
import { ConversationalActionResponse } from '../src/core/ConversationalActionResponse';

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;
jest.setTimeout(550);
const delay = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

beforeEach(() => {
  app = new App();
  const ga = new GoogleAssistant();
  app.use(ga);
  t = ga.makeTestSuite();
});

describe('test different prompts', () => {
  test('add first simple to response', async (done) => {
    app.setHandler({
      LAUNCH() {
        // skip this
        this.$googleAction!.addFirstSimple({
          text: 'Hello World text',
          speech: 'Hello World speech',
        });
      },
    });
    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response! as ConversationalActionResponse;
      expect(response.isFirstSimple('Hello World speech', 'Hello World text')).toBeTruthy();
      done();
    });
  });

  test('add last simple to response', async (done) => {
    app.setHandler({
      LAUNCH() {
        // skip this
        this.$googleAction!.addLastSimple({
          text: 'Hello World text',
          speech: 'Hello World speech',
        });
      },
    });
    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response! as ConversationalActionResponse;
      expect(response.isLastSimple('Hello World speech', 'Hello World text')).toBeTruthy();
      done();
    });
  });

  test('add basic card', async (done) => {
    app.setHandler({
      LAUNCH() {
        // skip this
        this.$googleAction!.addBasicCard({
          title: 'Title',
          subtitle: 'Subtitle',
          text: 'Text',
        });
      },
    });
    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response! as ConversationalActionResponse;
      expect(response.prompt?.content?.card).toEqual({
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
        // skip this
        this.$googleAction!.addImageCard({
          url: 'https://via.placeholder.com/450x350?text=Basic+Card',
          alt: 'Image text',
        });
      },
    });
    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response! as ConversationalActionResponse;
      expect(response.prompt?.content?.image).toEqual({
        url: 'https://via.placeholder.com/450x350?text=Basic+Card',
        alt: 'Image text',
      });
      done();
    });
  });

  test('add table', async (done) => {
    app.setHandler({
      LAUNCH() {
        // skip this
        this.$googleAction!.addTable({
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
    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response! as ConversationalActionResponse;
      expect(response.prompt?.content?.table).toEqual({
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
