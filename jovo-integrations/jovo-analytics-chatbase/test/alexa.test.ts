import { Inputs } from 'jovo-core';
import { ChatbaseAlexa } from '../src';

const CHATBASE_KEY = 'KEY';
const APP_VERSION = 'VERSION';
const USER_ID = 'USER';
const MESSAGE = 'MESSAGE';
const SESSION_ID = 'SESSION';
const INTENT_NAME = 'INTENT';

describe('ChatbaseAlexa', () => {
  let chatbase: ChatbaseAlexa;

  beforeEach(() => {
    chatbase = new ChatbaseAlexa({
      appVersion: APP_VERSION,
      key: CHATBASE_KEY,
    });
  });

  describe('buildAgentMessage', () => {
    test('agent message is properly built', () => {
      const result = chatbase.buildAgentMessage(USER_ID, MESSAGE, SESSION_ID);

      expect(result.api_key).toEqual(CHATBASE_KEY);
      expect(result.type).toEqual('agent');
      expect(result.user_id).toEqual(USER_ID);
      expect(result.time_stamp).toBeDefined();
      expect(result.platform).toEqual('Alexa');
      expect(result.message).toEqual(MESSAGE);
      expect(result.version).toEqual(APP_VERSION);
      expect(result.session_id).toEqual(SESSION_ID);
    });
  });

  describe('buildMessage', () => {
    test('No inputs are provided', () => {
      const result = chatbase.buildMessage(INTENT_NAME, {});

      expect(result).toEqual(INTENT_NAME);
    });

    test('Slot values are provided', () => {
      // const inputs: Inputs = {
      //     first: {
      //     	name: 'first',
      // 	value: 'A',
      // },
      //     second: {
      //     	name: 'second',
      // 	value: 2
      // }
      // };

      const result = chatbase.buildMessage(INTENT_NAME, {
        // tslint:disable-line:no-object-literal-type-assertion
        first: 'A',
        second: 2,
      } as Inputs);

      expect(result).toEqual(`${INTENT_NAME}\nfirst: A\nsecond: 2`);
    });
  });
});
