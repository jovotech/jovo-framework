import { HandleRequest, JovoRequest, TestSuite } from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import { GoogleAssistant } from '../src';
import { DialogflowResponse } from 'jovo-platform-dialogflow';
import { GoogleActionResponse } from '../src/core/GoogleActionResponse';
import _get = require('lodash.get');

// @ts-ignore
import { GoogleActionAPI } from '../src/services/GoogleActionAPI';
jest.mock('../src/services/GoogleActionAPI');

jest.mock('googleapis');
import { google } from 'googleapis';

// @ts-ignore
google.auth.getClient.mockReturnValue(
  Promise.resolve({
    authorize() {
      return Promise.resolve({
        access_token: 'token-abc-123',
      });
    },
  }),
);

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;

beforeEach(() => {
  app = new App();
  const ga = new GoogleAssistant({
    transactions: {
      androidPackageName: 'com.sampleapp',
    },
  });
  app.use(ga);
  t = ga.makeTestSuite();
});

describe.skip('test digital goods implementation', () => {
  it('should be possible get current subscriptions', async (done) => {
    // @ts-ignore
    GoogleActionAPI.apiCall.mockReturnValue(
      Promise.resolve({
        data: [
          {
            skuId: {
              skuType: 'SUBSCRIPTION',
              id: 'com.sampleapp',
              packageName: 'com.sampleapp',
            },
          },
        ],
      }),
    );

    app.setHandler({
      LAUNCH() {
        this.$googleAction!.$transaction!.getSubscriptions(['com.sampleapp'])
          // tslint:disable-next-line
          .then((subscriptions: any[]) => {
            expect(GoogleActionAPI.apiCall).toHaveBeenCalledTimes(1);
            expect(GoogleActionAPI.apiCall).toHaveBeenCalledWith({
              endpoint: 'https://actions.googleapis.com',
              path: `/v3/packages/com.sampleapp/skus:batchGet`,
              method: 'POST',
              permissionToken: 'token-abc-123',
              json: {
                conversationId: '1526414104011',
                skuType: 'SKU_TYPE_SUBSCRIPTION',
                ids: ['com.sampleapp'],
              },
            });
            expect(subscriptions).toHaveLength(1);
            expect(subscriptions).toEqual([
              {
                skuId: {
                  skuType: 'SUBSCRIPTION',
                  id: 'com.sampleapp',
                  packageName: 'com.sampleapp',
                },
              },
            ]);
            done();
          })
          .catch(done);
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));
  });

  it('should be possible get current consumables', async (done) => {
    // @ts-ignore
    GoogleActionAPI.apiCall.mockReset();
    // @ts-ignore
    GoogleActionAPI.apiCall.mockReturnValue(
      Promise.resolve({
        data: [
          {
            skuId: {
              skuType: 'APP',
              id: 'com.sampleapp.product1',
              packageName: 'com.sampleapp',
            },
          },
        ],
      }),
    );

    app.setHandler({
      LAUNCH() {
        this.$googleAction!.$transaction!.getConsumables(['com.sampleapp.product1'])
          // tslint:disable-next-line
          .then((consumable: any[]) => {
            expect(GoogleActionAPI.apiCall).toHaveBeenCalledTimes(1);
            expect(GoogleActionAPI.apiCall).toHaveBeenCalledWith({
              endpoint: 'https://actions.googleapis.com',
              path: `/v3/packages/com.sampleapp/skus:batchGet`,
              method: 'POST',
              permissionToken: 'token-abc-123',
              json: {
                conversationId: '1526414104011',
                skuType: 'SKU_TYPE_IN_APP',
                ids: ['com.sampleapp.product1'],
              },
            });
            expect(consumable).toHaveLength(1);
            expect(consumable).toEqual([
              {
                skuId: {
                  skuType: 'APP',
                  id: 'com.sampleapp.product1',
                  packageName: 'com.sampleapp',
                },
              },
            ]);
            done();
          })
          .catch(done);
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));
  });

  test('test completePurschase', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$googleAction!.$transaction!.completePurchase({
          packageName: 'com.sample.product',
          id: 'idXYZ',
          skuType: 'SKU_TYPE_IN_APP',
        });
        done();
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      const dialogflowResponse = handleRequest.jovo!.$response as DialogflowResponse;

      const googleActionResponse = dialogflowResponse.getPlatformResponse() as GoogleActionResponse;

      expect(_get(googleActionResponse, 'expectUserResponse')).toBe(true);
      expect(_get(googleActionResponse, 'systemIntent')).toEqual({
        intent: 'actions.intent.COMPLETE_PURCHASE',
        inputValueData: {
          '@type': 'type.googleapis.com/google.actions.transactions.v3.CompletePurchaseValueSpec',
          'skuId': {
            packageName: 'com.sample.product',
            id: 'idXYZ',
            skuType: 'SKU_TYPE_IN_APP',
          },
        },
      });

      expect(_get(googleActionResponse, 'inputPrompt')).toEqual({
        initialPrompts: [
          {
            textToSpeech: 'PLACEHOLDER',
          },
        ],
        noInputPrompts: [],
      });
      done();
    });
  }, 250);

  test('test correct type', async (done) => {
    app.setHandler({
      ON_COMPLETE_PURCHASE() {
        expect(this.$googleAction!.$transaction!.getPurchaseStatus() === 'PURCHASE_STATUS_OK');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.rawRequestByKey('CompletePurchase');
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('after.router', (handleRequest: HandleRequest) => {
      expect(handleRequest.jovo!.$type.type).toBe('ON_COMPLETE_PURCHASE');
      done();
    });
  }, 250);
});
