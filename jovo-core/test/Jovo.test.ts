import { BaseApp, Host, Jovo, SessionConstants, SpeechBuilder, EnumRequestType, Validator, ValidationError, IsRequiredValidator, ValidValuesValidator } from "../src";
process.env.NODE_ENV = 'UNIT_TEST';

class JovoImpl extends Jovo {
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
        return "platformType";
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
            'test': ''
        };
    }

    /**
     * Dummy getRequestObject implementation
     */
    getRequestObject(): any { // tslint:disable-line
        return {};
    }

    /**
     * Dummy setResponse implementation
     */
    setResponse(obj: any): Promise<any> { // tslint:disable-line
        return new Promise((resolve, reject) => { });
    }

    /**
     * Dummy fail implementation
     */
    fail(error: Error) {

    }

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
        }
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
        }
    };
    expect(jovo.getState()).toBe('STATE1');
    jovo.removeState();
    expect(jovo.getState()).toBeUndefined();
});

test('test getSessionData', () => {
    jovo.$session = {
        $data: {
            foo: 'bar',
            a: 'b'
        }
    };
    expect(jovo.getSessionData()).toEqual({
        foo: 'bar',
        a: 'b'
    });
    expect(jovo.getSessionData('foo')).toBe('bar');
});

test('test getSessionAttribute', () => {
    jovo.$session = {
        $data: {
            foo: 'bar',
        }
    };
    expect(jovo.getSessionAttribute('foo')).toBe('bar');
});

test('test getSessionAttributes', () => {
    jovo.$session = {
        $data: {
            foo: 'bar',
            a: 'b'
        }
    };
    expect(jovo.getSessionData()).toEqual({
        foo: 'bar',
        a: 'b'
    });
});


test('test setSessionData', () => {
    jovo.setSessionData({
        foo: 'bar',
        a: 'b'
    });
    expect(jovo.getSessionData()).toEqual({
        foo: 'bar',
        a: 'b'
    });

    jovo.setSessionData('foofoo', 'barbar');
    expect(jovo.getSessionData()).toEqual({
        foo: 'bar',
        a: 'b',
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
        foo: 'bar',
        a: 'b'
    });
    expect(jovo.getSessionData()).toEqual({
        foo: 'bar',
        a: 'b'
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
            reprompt: 'Hello World',
        },
    });
});

test('test ask with reprompt', () => {
    jovo.ask('Hello World', 'FooBar');
    expect(jovo.$output).toEqual({
        ask: {
            speech: 'Hello World',
            reprompt: 'FooBar',
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
            reprompt: 'FooBar',
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
            value: 'foobar'
        }
    };

    expect(jovo.$inputs).toEqual({
        inputA: {
            name: 'inputA',
            value: 'foobar'
        }
    });
    jovo.mapInputs(inputMap);
    expect(jovo.$inputs).toEqual({
        inputB: {
            name: 'inputA',
            value: 'foobar'
        }
    });
});
test('test getInput', () => {

    jovo.$inputs = {
        inputA: {
            name: 'inputA',
            value: 'foobar'
        }
    };

    expect(jovo.getInput('inputA')).toEqual({
        name: 'inputA',
        value: 'foobar'
    });
});

test('test setOutput', () => {

    jovo.setOutput({
        tell: {
            speech: 'HelloWorld',
        }
    });

    expect(jovo.$output).toEqual({
        tell: {
            speech: 'HelloWorld',
        }
    });
});


test('test setResponseObject', () => {

    jovo.setResponseObject({
        foo: 'bar'
    });

    expect(jovo.$rawResponseJson).toEqual({
        foo: 'bar'
    });
});


test('test showSimpleCard', () => {

    jovo.showSimpleCard('title', 'content');

    expect(jovo.$output).toEqual({
        card: {
            SimpleCard: {
                title: 'title',
                content: 'content'
            }
        }
    });
});


test('test showImageCard', () => {

    jovo.showImageCard('title', 'content', 'imageUrl');

    expect(jovo.$output).toEqual({
        card: {
            ImageCard: {
                title: 'title',
                content: 'content',
                imageUrl: 'imageUrl'
            }
        }
    });
});

test('test showAccountLinkingCard', () => {

    jovo.showAccountLinkingCard();

    expect(jovo.$output).toEqual({
        card: {
            AccountLinkingCard: {
            }
        }
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

describe('test validate()', () => {
    describe.skip('schema', () => {
        test('with array', () => {
            const schema = {
                name: [
                    new IsRequiredValidator(),
                    new ValidValuesValidator(['valid1', 'valid2'])
                ]
            };
            jovo.$inputs.name = { name: 'name', value: 'valid2' };
            jovo.validate(schema);
            expect(jovo['parseForValidator']).toHaveBeenCalledTimes(2);
        });

        test('normally', () => {
            const schema = {
                name: new IsRequiredValidator()
            };
            jovo.$inputs.name = { name: 'name', value: 'valid1' };
            jovo.validate(schema);
            expect(jovo['parseForValidator']).toHaveBeenCalledTimes(1);
        });
    });

    describe('test returned failed() function', () => {
        describe('for some failed', () => {

            test('should return true without parameters', () => {
                const schema = {
                    name1: new IsRequiredValidator(),
                    name2: new IsRequiredValidator()
                };
                jovo.$inputs = {
                    name1: {
                        name: 'name1',
                        value: ''
                    },
                    name2: {
                        name: 'name2', 
                        value: 'John'
                    }
                };
                const validation = jovo.validate(schema);
                expect(validation.failed()).toBeTruthy();
                expect(validation.failed('name1')).toBeTruthy();
            });
        });

        describe('for empty failedValidators', () => {

        });
    });
});

describe('test parseForValidator()', () => {
    class ValidatorImpl extends Validator {
        validate() {    // tslint:disable-line
            if (this.inputToValidate!.value === 'test') {
                throw new ValidationError('', 'Validator');
            }
        }
    }

    test('should succeed with validator of type Validator', () => {
        const parseForValidator = jovo['parseForValidator'];
        const v = new ValidatorImpl();
        const failedValidators: string[][] = [];
        parseForValidator(v, { value: 'value' }, failedValidators);
        expect(failedValidators).toHaveLength(0);
    });

    test('should push failed validator onto failedValidators', () => {
        const parseForValidator = jovo['parseForValidator'];
        const v = new ValidatorImpl();
        const failedValidators: string[][] = [];
        parseForValidator(v, { name: 'key', value: 'test' }, failedValidators);
        expect(failedValidators).toHaveLength(1);
        expect(failedValidators[0]).toStrictEqual(['Validator', 'key']);
    });
});