import { HandleRequest, JovoRequest, TestSuite, SessionConstants } from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import { Alexa } from '../../src';
import _get = require('lodash.get');
import _set = require('lodash.set');

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;
jest.setTimeout(550);

beforeEach(() => {
  app = new App();
  const alexa = new Alexa();
  app.use(alexa);
  t = alexa.makeTestSuite();
});

describe('test DialogDelegate functions', () => {
  describe('test getState', () => {
    test('to be STARTED', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (this.$alexaSkill!.$dialog!.getState() === 'STARTED') {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });

    test('to be IN_PROGRESS', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (this.$alexaSkill!.$dialog!.getState() === 'IN_PROGRESS') {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      _set(delegateRequest, 'request.dialogState', 'IN_PROGRESS');
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });

    test('to be COMPLETED', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (this.$alexaSkill!.$dialog!.getState() === 'COMPLETED') {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      _set(delegateRequest, 'request.dialogState', 'COMPLETED');
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });
  });

  describe('test isCompleted', () => {
    test('to be false', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (!this.$alexaSkill!.$dialog!.isCompleted()) {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });

    test('to be true', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (this.$alexaSkill!.$dialog!.isCompleted()) {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      _set(delegateRequest, 'request.dialogState', 'COMPLETED');
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });
  });

  describe('test isInProgress', () => {
    test('to be false', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (!this.$alexaSkill!.$dialog!.isInProgress()) {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });

    test('to be true', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (this.$alexaSkill!.$dialog!.isInProgress()) {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      _set(delegateRequest, 'request.dialogState', 'IN_PROGRESS');
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });
  });

  describe('test isStarted', () => {
    test('to be false', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (!this.$alexaSkill!.$dialog!.isStarted()) {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      _set(delegateRequest, 'request.dialogState', 'COMPLETED');
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });

    test('to be true', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (this.$alexaSkill!.$dialog!.isStarted()) {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });
  });

  describe('test hasStarted', () => {
    test('to be false', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (!this.$alexaSkill!.$dialog!.hasStarted()) {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      _set(delegateRequest, 'request.dialogState', 'COMPLETED');
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });

    test('to be true', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (this.$alexaSkill!.$dialog!.hasStarted()) {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });
  });

  describe('test delegate', () => {
    test('with param updatedIntent', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          this.$alexaSkill!.$dialog!.delegate({
            name: 'TestIntent',
            confirmationStatus: 'NONE',
            slots: {
              key: {
                name: 'key',
                confirmationStatus: 'NONE',
                value: '',
              },
            },
          });
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        const response = handleRequest.jovo!.$response;
        expect(_get(response, 'response.directives[0].type')).toEqual('Dialog.Delegate');
        expect(_get(response, 'response.directives[0].updatedIntent')).toStrictEqual({
          name: 'TestIntent',
          confirmationStatus: 'NONE',
          slots: {
            key: {
              name: 'key',
              confirmationStatus: 'NONE',
              value: '',
            },
          },
        });
        expect(_get(response, 'response.shouldEndSession')).toBeFalsy();
        done();
      });
    });

    test('without param updatedIntent', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          this.$alexaSkill!.$dialog!.delegate();
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        const response = handleRequest.jovo!.$response;
        expect(_get(response, 'response.directives[0].type')).toEqual('Dialog.Delegate');
        expect(_get(response, 'response.shouldEndSession')).toBeFalsy();
        done();
      });
    });
  });

  describe('test elicitSlot', () => {
    test('with param updatedIntent', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          this.$alexaSkill!.$dialog!.elicitSlot(
            'key',
            'What is the value to this key?',
            'What is the value?',
            {
              name: 'TestIntent',
              confirmationStatus: 'NONE',
              slots: {
                key: {
                  name: 'key',
                  confirmationStatus: 'NONE',
                  value: '',
                },
              },
            },
          );
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        const response = handleRequest.jovo!.$response;
        expect(_get(response, 'response.directives[0].type')).toEqual('Dialog.ElicitSlot');
        expect(_get(response, 'response.directives[0].slotToElicit')).toEqual('key');
        expect(_get(response, 'response.directives[0].updatedIntent')).toStrictEqual({
          name: 'TestIntent',
          confirmationStatus: 'NONE',
          slots: {
            key: {
              name: 'key',
              confirmationStatus: 'NONE',
              value: '',
            },
          },
        });
        expect(
          response!.isAsk('What is the value to this key?', 'What is the value?'),
        ).toBeTruthy();
        done();
      });
    });

    test('without param updatedIntent', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          this.$alexaSkill!.$dialog!.elicitSlot(
            'key',
            'What is the value to this key?',
            'What is the value?',
          );
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        const response = handleRequest.jovo!.$response;
        expect(_get(response, 'response.directives[0].type')).toEqual('Dialog.ElicitSlot');
        expect(_get(response, 'response.directives[0].slotToElicit')).toEqual('key');
        expect(
          response!.isAsk('What is the value to this key?', 'What is the value?'),
        ).toBeTruthy();
        done();
      });
    });
  });

  describe('test confirmSlot', () => {
    test('with param updateIntent', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          this.$alexaSkill!.$dialog!.confirmSlot('key', 'So key is value?', 'Key is value?', {
            name: 'TestIntent',
            confirmationStatus: 'NONE',
            slots: {
              key: {
                name: 'key',
                confirmationStatus: 'NONE',
                value: '',
              },
            },
          });
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        const response = handleRequest.jovo!.$response;
        expect(_get(response, 'response.directives[0].type')).toEqual('Dialog.ConfirmSlot');
        expect(_get(response, 'response.directives[0].slotToConfirm')).toEqual('key');
        expect(_get(response, 'response.directives[0].updatedIntent')).toStrictEqual({
          name: 'TestIntent',
          confirmationStatus: 'NONE',
          slots: {
            key: {
              name: 'key',
              confirmationStatus: 'NONE',
              value: '',
            },
          },
        });
        expect(response!.isAsk('So key is value?', 'Key is value?')).toBeTruthy();
        done();
      });
    });

    test('without param updateIntent', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          this.$alexaSkill!.$dialog!.confirmSlot('key', 'So key is value?', 'Key is value?');
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        const response = handleRequest.jovo!.$response;
        expect(_get(response, 'response.directives[0].type')).toEqual('Dialog.ConfirmSlot');
        expect(_get(response, 'response.directives[0].slotToConfirm')).toEqual('key');
        expect(response!.isAsk('So key is value?', 'Key is value?')).toBeTruthy();
        done();
      });
    });
  });

  describe('test confirmIntent', () => {
    test('without param updatedIntent', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          this.$alexaSkill!.$dialog!.confirmIntent('So key is value?', 'Key is value?');
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        const response = handleRequest.jovo!.$response;
        expect(_get(response, 'response.directives[0].type')).toEqual('Dialog.ConfirmIntent');
        expect(response!.isAsk('So key is value?', 'Key is value?')).toBeTruthy();
        done();
      });
    });

    test('with param updatedIntent', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          this.$alexaSkill!.$dialog!.confirmIntent('So key is value?', 'Key is value?', {
            name: 'TestIntent',
            confirmationStatus: 'NONE',
            slots: {
              key: {
                name: 'key',
                confirmationStatus: 'NONE',
                value: '',
              },
            },
          });
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));

      app.on('response', (handleRequest: HandleRequest) => {
        const response = handleRequest.jovo!.$response;
        expect(_get(response, 'response.directives[0].type')).toEqual('Dialog.ConfirmIntent');
        expect(response!.isAsk('So key is value?', 'Key is value?')).toBeTruthy();
        expect(_get(response, 'response.directives[0].updatedIntent')).toStrictEqual({
          name: 'TestIntent',
          confirmationStatus: 'NONE',
          slots: {
            key: {
              name: 'key',
              confirmationStatus: 'NONE',
              value: '',
            },
          },
        });
        done();
      });
    });
  });

  describe('test getSlotConfirmationStatus', () => {
    test('to be NONE', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (this.$alexaSkill!.$dialog!.getSlotConfirmationStatus('key') === 'NONE') {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });

    test('to be CONFIRMED', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (this.$alexaSkill!.$dialog!.getSlotConfirmationStatus('key') === 'CONFIRMED') {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      _set(delegateRequest, 'request.intent.slots.key.confirmationStatus', 'CONFIRMED');
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });
  });

  describe('test isSlotConfirmed', () => {
    test('to be false', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (!this.$alexaSkill!.$dialog!.isSlotConfirmed('key')) {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });

    test('to be true', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (this.$alexaSkill!.$dialog!.isSlotConfirmed('key')) {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      _set(delegateRequest, 'request.intent.slots.key.confirmationStatus', 'CONFIRMED');
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });
  });

  describe('test getIntentConfirmationStatus', () => {
    test('test getIntentConfirmationStatus to be NONE', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (this.$alexaSkill!.$dialog!.getIntentConfirmationStatus() === 'NONE') {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });

    test('test getIntentConfirmationStatus to be CONFIRMED', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (this.$alexaSkill!.$dialog!.getIntentConfirmationStatus() === 'CONFIRMED') {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      _set(delegateRequest, 'request.intent.confirmationStatus', 'CONFIRMED');
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });
  });

  describe('test hasSlotValue', () => {
    test('to be false', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (!this.$alexaSkill!.$dialog!.hasSlotValue('key')) {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });

    test('to be true', async (done) => {
      app.setHandler({
        TestDelegateIntent() {
          if (this.$alexaSkill!.$dialog!.hasSlotValue('key')) {
            done();
          }
        },
      });

      const delegateRequest: JovoRequest = await t.requestBuilder.rawRequestByKey(
        'DialogDelegateRequest',
      );
      _set(delegateRequest, 'request.intent.slots.key.value', 'value');
      app.handle(ExpressJS.dummyRequest(delegateRequest));
    });
  });
});
