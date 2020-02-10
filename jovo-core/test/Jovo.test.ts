import {
  AudioData,
  BaseApp,
  EnumRequestType,
  Host,
  IsRequiredValidator,
  Jovo,
  SessionConstants,
  SpeechBuilder,
  ValidationError,
  Validator,
  ValidValuesValidator,
} from '../src';

process.env.NODE_ENV = 'UNIT_TEST';

class JovoImpl extends Jovo {
  getAudioData(): AudioData | undefined {
    return undefined;
  }

  /**
   * getDeviceId() dummy implementation
   */
  getDeviceId(): string | undefined {
    return 'deviceId';
  }

  /**
   * getLocale() dummy implementation
   */
  getLocale(): string | undefined {
    return 'locale';
  }

  /**
   * getPlatformType() dummy implementation
   */
  getPlatformType(): string {
    return 'platformType';
  }

  /**
   * getRawText() dummy implementation
   */
  getRawText(): string | undefined {
    return 'rawText';
  }

  /**
   * getSelectedElementId() dummy implementation
   */
  getSelectedElementId(): string | undefined {
    return 'selectedElementId';
  }

  /**
   * getSpeechBuilder() dummy implementation
   */
  getSpeechBuilder(): SpeechBuilder | undefined {
    return new SpeechBuilder(this);
  }

  /**
   * getTimestamp() dummy implementation
   */
  getTimestamp(): string | undefined {
    return new Date().toISOString();
  }

  /**
   * getType() dummy implementation
   */
  getType(): string | undefined {
    return 'JovoImpl';
  }

  /**
   * hasAudioInterface() dummy implementation
   */
  hasAudioInterface(): boolean {
    return true;
  }

  /**
   * hasScreenInterface() dummy implementation
   */
  hasScreenInterface(): boolean {
    return true;
  }

  /**
   * hasVideoInterface() dummy implementation
   */
  hasVideoInterface(): boolean {
    return true;
  }

  /**
   * isNewSession() dummy implementation
   */
  isNewSession(): boolean {
    return false;
  }

  /**
   * speechBuilder() dummy implementation
   */
  speechBuilder(): SpeechBuilder | undefined {
    return new SpeechBuilder(this);
  }
}

class DummyHost implements Host {
  $request: any; // tslint:disable-line
  hasWriteFileAccess: boolean;
  headers: { [p: string]: string };

  constructor() {
    this.$request = {};
    this.hasWriteFileAccess = true;
    this.headers = {
      test: '',
    };
  }

  /**
   * Dummy getRequestObject implementation
   */
  getRequestObject(): any {
    // tslint:disable-line
    return {};
  }

  /**
   * Dummy setResponse implementation
   */
  setResponse(obj: any): Promise<any> {
    // tslint:disable-line
    return new Promise((resolve, reject) => {}); // tslint:disable-line:no-empty
  }

  getQueryParams(): Record<string, string> {
    return {};
  }

  /**
   * Dummy fail implementation
   */
  fail(error: Error) {} // tslint:disable-line:no-empty
}

let baseApp: BaseApp;
let jovo: JovoImpl;

beforeEach(() => {
  baseApp = new BaseApp();
  jovo = new JovoImpl(baseApp, new DummyHost());
});

test('test getState', () => {
  jovo.$session = {
    $data: {
      [SessionConstants.STATE]: 'STATE1',
    },
  };
  expect(jovo.getState()).toBe('STATE1');
});

test('test setState', () => {
  jovo.setState('STATE1');
  expect(jovo.getState()).toBe('STATE1');
});

test('test removeState', () => {
  jovo.$session = {
    $data: {
      [SessionConstants.STATE]: 'STATE1',
    },
  };
  expect(jovo.getState()).toBe('STATE1');
  jovo.removeState();
  expect(jovo.getState()).toBeUndefined();
});

test('test getSessionData', () => {
  jovo.$session = {
    $data: {
      a: 'b',
      foo: 'bar',
    },
  };
  expect(jovo.getSessionData()).toEqual({
    a: 'b',
    foo: 'bar',
  });
  expect(jovo.getSessionData('foo')).toBe('bar');
});

test('test getSessionAttribute', () => {
  jovo.$session = {
    $data: {
      foo: 'bar',
    },
  };
  expect(jovo.getSessionAttribute('foo')).toBe('bar');
});

test('test getSessionAttributes', () => {
  jovo.$session = {
    $data: {
      a: 'b',
      foo: 'bar',
    },
  };
  expect(jovo.getSessionData()).toEqual({
    a: 'b',
    foo: 'bar',
  });
});

test('test setSessionData', () => {
  jovo.setSessionData({
    a: 'b',
    foo: 'bar',
  });
  expect(jovo.getSessionData()).toEqual({
    a: 'b',
    foo: 'bar',
  });

  jovo.setSessionData('foofoo', 'barbar');
  expect(jovo.getSessionData()).toEqual({
    a: 'b',
    foo: 'bar',
    foofoo: 'barbar',
  });
});
test('test setSessionAttribute', () => {
  jovo.setSessionAttribute('foofoo', 'barbar');
  expect(jovo.getSessionData()).toEqual({
    foofoo: 'barbar',
  });
});

test('test addSessionAttribute', () => {
  jovo.addSessionAttribute('foofoo', 'barbar');
  expect(jovo.getSessionData()).toEqual({
    foofoo: 'barbar',
  });
});

test('test addSessionData', () => {
  jovo.addSessionData('foofoo', 'barbar');
  expect(jovo.getSessionData()).toEqual({
    foofoo: 'barbar',
  });
});
test('test setSessionAttributes', () => {
  jovo.setSessionAttributes({
    a: 'b',
    foo: 'bar',
  });
  expect(jovo.getSessionData()).toEqual({
    a: 'b',
    foo: 'bar',
  });
});

test('test tell', () => {
  jovo.tell('Hello World');
  expect(jovo.$output).toEqual({
    tell: {
      speech: 'Hello World',
    },
  });
});

test('test tell (with SpeechBuilder)', () => {
  jovo.$speech.addText('Hello World');
  jovo.tell('Hello World');
  expect(jovo.$output).toEqual({
    tell: {
      speech: 'Hello World',
    },
  });
});

test('test ask without reprompt', () => {
  jovo.ask('Hello World');
  expect(jovo.$output).toEqual({
    ask: {
      speech: 'Hello World',
      reprompt: 'Hello World', // tslint:disable-line:object-literal-sort-keys
    },
  });
});

test('test ask with reprompt', () => {
  jovo.ask('Hello World', 'FooBar');
  expect(jovo.$output).toEqual({
    ask: {
      speech: 'Hello World',
      reprompt: 'FooBar', // tslint:disable-line:object-literal-sort-keys
    },
  });
});

test('test ask with reprompt (speechbuilder)', () => {
  jovo.$speech.addText('Hello World');
  jovo.$reprompt.addText('FooBar');

  jovo.ask(jovo.$speech, jovo.$reprompt);
  expect(jovo.$output).toEqual({
    ask: {
      speech: 'Hello World',
      reprompt: 'FooBar', // tslint:disable-line:object-literal-sort-keys
    },
  });
});

test('test mapInputs', () => {
  const inputMap = {
    inputA: 'inputB',
  };

  jovo.$inputs = {
    inputA: {
      name: 'inputA',
      value: 'foobar',
    },
  };

  expect(jovo.$inputs).toEqual({
    inputA: {
      name: 'inputA',
      value: 'foobar',
    },
  });
  jovo.mapInputs(inputMap);
  expect(jovo.$inputs).toEqual({
    inputB: {
      name: 'inputA',
      value: 'foobar',
    },
  });
});
test('test getInput', () => {
  jovo.$inputs = {
    inputA: {
      name: 'inputA',
      value: 'foobar',
    },
  };

  expect(jovo.getInput('inputA')).toEqual({
    name: 'inputA',
    value: 'foobar',
  });
});

test('test setOutput', () => {
  jovo.setOutput({
    tell: {
      speech: 'HelloWorld',
    },
  });

  expect(jovo.$output).toEqual({
    tell: {
      speech: 'HelloWorld',
    },
  });
});

test('test setResponseObject', () => {
  jovo.setResponseObject({
    foo: 'bar',
  });

  expect(jovo.$rawResponseJson).toEqual({
    foo: 'bar',
  });
});

test('test showSimpleCard', () => {
  jovo.showSimpleCard('title', 'content');

  expect(jovo.$output).toEqual({
    card: {
      SimpleCard: {
        content: 'content',
        title: 'title',
      },
    },
  });
});

test('test showImageCard', () => {
  jovo.showImageCard('title', 'content', 'imageUrl');

  expect(jovo.$output).toEqual({
    card: {
      ImageCard: {
        content: 'content',
        imageUrl: 'imageUrl',
        title: 'title',
      },
    },
  });
});

test('test showAccountLinkingCard', () => {
  jovo.showAccountLinkingCard();

  expect(jovo.$output).toEqual({
    card: {
      AccountLinkingCard: {},
    },
  });
});

describe('test isLaunchRequest()', () => {
  test('should return true', () => {
    jovo.$type.type = EnumRequestType.LAUNCH;

    const result = jovo.isLaunchRequest();

    expect(result).toBe(true);
  });

  test('should return false', () => {
    jovo.$type.type = 'test';

    const result = jovo.isLaunchRequest();

    expect(result).toBe(false);
  });
});

describe('test isIntentRequest()', () => {
  test('should return true', () => {
    jovo.$type.type = EnumRequestType.INTENT;

    const result = jovo.isIntentRequest();

    expect(result).toBe(true);
  });

  test('should return false', () => {
    jovo.$type.type = 'test';

    const result = jovo.isIntentRequest();

    expect(result).toBe(false);
  });
});

describe('test isEndRequest()', () => {
  test('should return true', () => {
    jovo.$type.type = EnumRequestType.END;

    const result = jovo.isEndRequest();

    expect(result).toBe(true);
  });

  test('should return false', () => {
    jovo.$type.type = 'test';

    const result = jovo.isEndRequest();

    expect(result).toBe(false);
  });
});

describe('test isAudioPlayerRequest()', () => {
  test('should return true', () => {
    jovo.$type.type = EnumRequestType.AUDIOPLAYER;

    const result = jovo.isAudioPlayerRequest();

    expect(result).toBe(true);
  });

  test('should return false', () => {
    jovo.$type.type = 'test';

    const result = jovo.isAudioPlayerRequest();

    expect(result).toBe(false);
  });
});

describe('test isElementSelectedRequest()', () => {
  test('should return true', () => {
    jovo.$type.type = EnumRequestType.ON_ELEMENT_SELECTED;

    const result = jovo.isElementSelectedRequest();

    expect(result).toBe(true);
  });

  test('should return false', () => {
    jovo.$type.type = 'test';

    const result = jovo.isElementSelectedRequest();

    expect(result).toBe(false);
  });
});

describe('test validateAsync()', () => {
  test('should succeed with valid input field', async () => {
    const schema = {
      async name(this: Jovo) {
        await jest.fn().mockResolvedValue(100);
        if (this.$inputs.name.value === 'test') {
          throw new ValidationError('Function');
        }
      },
    };
    jovo.$inputs.name = { name: 'name', value: 'valid' };
    const validation = await jovo.validateAsync(schema);
    expect(validation.failed()).toBeFalsy();
  });

  test('should fail with array of validators', async () => {
    const schema = {
      name: [
        new IsRequiredValidator(),
        async function(this: Jovo) {
          await jest.fn().mockResolvedValue(100);
          if (this.$inputs.name.value === 'test') {
            throw new ValidationError('Function');
          }
        },
      ],
    };
    jovo.$inputs.name = { name: 'name', value: 'test' };
    const validation = await jovo.validateAsync(schema);
    expect(validation.failed('name')).toBeTruthy();
    expect(validation.failed('Function')).toBeTruthy();
  });

  test('should fail with single validator', async () => {
    const schema = {
      async name(this: Jovo) {
        await jest.fn().mockResolvedValue(100);
        if (this.$inputs.name.value === 'test') {
          throw new ValidationError('Function');
        }
      },
    };
    jovo.$inputs.name = { name: 'name', value: 'test' };
    const validation = await jovo.validateAsync(schema);
    expect(validation.failed('name')).toBeTruthy();
    expect(validation.failed('Function')).toBeTruthy();
  });
});

describe('test validate()', () => {
  test('should succeed with valid input field', () => {
    const schema = {
      name: new IsRequiredValidator(),
    };
    jovo.$inputs.name = { name: 'name', value: 'valid' };
    const validation = jovo.validate(schema);
    expect(validation.failed()).toBeFalsy();
  });

  test('should fail with array of validators', () => {
    const schema = {
      name: [new IsRequiredValidator(), new ValidValuesValidator(['valid1', 'valid2'])],
    };
    jovo.$inputs.name = { name: 'name', value: 'invalid' };
    const validation = jovo.validate(schema);
    expect(validation.failed('name')).toBeTruthy();
    expect(validation.failed('ValidValuesValidator')).toBeTruthy();
  });

  test('should fail with single validator', () => {
    const schema = {
      name: new IsRequiredValidator(),
    };
    jovo.$inputs.name = { name: 'name', value: '' };
    const validation = jovo.validate(schema);
    expect(validation.failed('name')).toBeTruthy();
    expect(validation.failed('IsRequiredValidator')).toBeTruthy();
  });
});

describe('test parseForFailedValidators()', () => {
  describe('failed()', () => {
    test('should return true for zero arguments', () => {
      const func = jovo.parseForFailedValidators;
      const failedValidators: string[][] = [['Validator', 'name', 'Name cannot be null.']];
      const obj = func(failedValidators);
      expect(obj.failed()).toBeTruthy();
    });

    test('should return true for one argument', () => {
      const func = jovo.parseForFailedValidators;
      const failedValidators: string[][] = [['Validator', 'name', 'Name cannot be null.']];
      const obj = func(failedValidators);
      expect(obj.failed('Validator')).toBeTruthy();
    });

    test('should return true for two arguments', () => {
      const func = jovo.parseForFailedValidators;
      const failedValidators: string[][] = [['Validator', 'name', 'Name cannot be null.']];
      const obj = func(failedValidators);
      expect(obj.failed('Validator', 'name')).toBeTruthy();
    });

    test('should return true for three arguments', () => {
      const func = jovo.parseForFailedValidators;
      const failedValidators: string[][] = [['Validator', 'name', 'Name cannot be null.']];
      const obj = func(failedValidators);
      expect(obj.failed('Validator', 'name', 'Name cannot be null.')).toBeTruthy();
    });

    test('should return false for no failed validators', () => {
      const func = jovo.parseForFailedValidators;
      const failedValidators: string[][] = [];
      const obj = func(failedValidators);
      expect(obj.failed('Validator')).toBeFalsy();
    });

    test('should return false if no argument matches', () => {
      const func = jovo.parseForFailedValidators;
      const failedValidators: string[][] = [['Validator', 'name', 'Name cannot be null.']];
      const obj = func(failedValidators);
      expect(obj.failed('Function')).toBeFalsy();
    });
  });
});

describe('test parseForValidator()', () => {
  class ValidatorImpl extends Validator {
    validate() {
      // tslint:disable-line
      if (this.inputToValidate!.value === 'test') {
        throw new ValidationError('Validator');
      }
    }
  }

  test('should succeed with validator of type Validator', () => {
    const func = jovo.parseForValidator;
    const v = new ValidatorImpl();
    const failedValidators: string[][] = [];
    // @ts-ignore
    func(v, 'key', { value: 'value' }, failedValidators);
    expect(failedValidators).toHaveLength(0);
  });

  test('should push failed validator onto failedValidators', () => {
    const func = jovo.parseForValidator;
    const v = new ValidatorImpl();
    const failedValidators: string[][] = [];
    // @ts-ignore
    func(v, 'key', { name: 'key', value: 'test' }, failedValidators);
    expect(failedValidators).toHaveLength(1);
    expect(failedValidators[0]).toStrictEqual(['Validator', 'key', '']);
  });
});

describe('test parseForValidatorAsync()', () => {
  class ValidatorImpl extends Validator {
    async validate() {
      // tslint:disable-line
      await jest.fn().mockResolvedValue(100);
      if (this.inputToValidate!.value === 'test') {
        throw new ValidationError('Validator');
      }
    }
  }

  test('should succeed with validator of type Validator', async () => {
    const func = jovo.parseForValidatorAsync;
    const v = new ValidatorImpl();
    const failedValidators: string[][] = [];
    // @ts-ignore
    await func(v, 'key', { value: 'value' }, failedValidators);
    expect(failedValidators).toHaveLength(0);
  });

  test('should push failed validator onto failedValidators', async () => {
    const func = jovo.parseForValidatorAsync;
    const v = new ValidatorImpl();
    const failedValidators: string[][] = [];
    // @ts-ignore
    await func(v, 'key', { name: 'key', value: 'test' }, failedValidators);
    expect(failedValidators).toHaveLength(1);
    expect(failedValidators[0]).toStrictEqual(['Validator', 'key', '']);
  });
});
