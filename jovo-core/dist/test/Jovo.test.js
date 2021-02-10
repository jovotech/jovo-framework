"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
process.env.NODE_ENV = 'UNIT_TEST';
class JovoImpl extends src_1.Jovo {
    getAudioData() {
        return undefined;
    }
    /**
     * getDeviceId() dummy implementation
     */
    getDeviceId() {
        return 'deviceId';
    }
    /**
     * getLocale() dummy implementation
     */
    getLocale() {
        return 'locale';
    }
    /**
     * getPlatformType() dummy implementation
     */
    getPlatformType() {
        return 'platformType';
    }
    /**
     * getRawText() dummy implementation
     */
    getRawText() {
        return 'rawText';
    }
    /**
     * getSelectedElementId() dummy implementation
     */
    getSelectedElementId() {
        return 'selectedElementId';
    }
    /**
     * getSpeechBuilder() dummy implementation
     */
    getSpeechBuilder() {
        return new src_1.SpeechBuilder(this);
    }
    /**
     * getTimestamp() dummy implementation
     */
    getTimestamp() {
        return new Date().toISOString();
    }
    /**
     * getType() dummy implementation
     */
    getType() {
        return 'JovoImpl';
    }
    /**
     * hasAudioInterface() dummy implementation
     */
    hasAudioInterface() {
        return true;
    }
    /**
     * hasScreenInterface() dummy implementation
     */
    hasScreenInterface() {
        return true;
    }
    /**
     * hasVideoInterface() dummy implementation
     */
    hasVideoInterface() {
        return true;
    }
    /**
     * isNewSession() dummy implementation
     */
    isNewSession() {
        return false;
    }
    /**
     * speechBuilder() dummy implementation
     */
    speechBuilder() {
        return new src_1.SpeechBuilder(this);
    }
}
class DummyHost {
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
    getRequestObject() {
        // tslint:disable-line
        return {};
    }
    /**
     * Dummy setResponse implementation
     */
    setResponse(obj) {
        // tslint:disable-line
        return new Promise((resolve, reject) => { }); // tslint:disable-line:no-empty
    }
    getQueryParams() {
        return {};
    }
    /**
     * Dummy fail implementation
     */
    fail(error) { } // tslint:disable-line:no-empty
}
let baseApp;
let jovo;
beforeEach(() => {
    baseApp = new src_1.BaseApp();
    jovo = new JovoImpl(baseApp, new DummyHost());
});
test('test getState', () => {
    jovo.$session = {
        $data: {
            [src_1.SessionConstants.STATE]: 'STATE1',
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
            [src_1.SessionConstants.STATE]: 'STATE1',
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
        jovo.$type.type = src_1.EnumRequestType.LAUNCH;
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
        jovo.$type.type = src_1.EnumRequestType.INTENT;
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
        jovo.$type.type = src_1.EnumRequestType.END;
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
        jovo.$type.type = src_1.EnumRequestType.AUDIOPLAYER;
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
        jovo.$type.type = src_1.EnumRequestType.ON_ELEMENT_SELECTED;
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
            async name() {
                await jest.fn().mockResolvedValue(100);
                if (this.$inputs.name.value === 'test') {
                    throw new src_1.ValidationError('Function');
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
                new src_1.IsRequiredValidator(),
                async function () {
                    await jest.fn().mockResolvedValue(100);
                    if (this.$inputs.name.value === 'test') {
                        throw new src_1.ValidationError('Function');
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
            async name() {
                await jest.fn().mockResolvedValue(100);
                if (this.$inputs.name.value === 'test') {
                    throw new src_1.ValidationError('Function');
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
            name: new src_1.IsRequiredValidator(),
        };
        jovo.$inputs.name = { name: 'name', value: 'valid' };
        const validation = jovo.validate(schema);
        expect(validation.failed()).toBeFalsy();
    });
    test('should fail with array of validators', () => {
        const schema = {
            name: [new src_1.IsRequiredValidator(), new src_1.ValidValuesValidator(['valid1', 'valid2'])],
        };
        jovo.$inputs.name = { name: 'name', value: 'invalid' };
        const validation = jovo.validate(schema);
        expect(validation.failed('name')).toBeTruthy();
        expect(validation.failed('ValidValuesValidator')).toBeTruthy();
    });
    test('should fail with single validator', () => {
        const schema = {
            name: new src_1.IsRequiredValidator(),
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
            const failedValidators = [['Validator', 'name', 'Name cannot be null.']];
            const obj = func(failedValidators);
            expect(obj.failed()).toBeTruthy();
        });
        test('should return true for one argument', () => {
            const func = jovo.parseForFailedValidators;
            const failedValidators = [['Validator', 'name', 'Name cannot be null.']];
            const obj = func(failedValidators);
            expect(obj.failed('Validator')).toBeTruthy();
        });
        test('should return true for two arguments', () => {
            const func = jovo.parseForFailedValidators;
            const failedValidators = [['Validator', 'name', 'Name cannot be null.']];
            const obj = func(failedValidators);
            expect(obj.failed('Validator', 'name')).toBeTruthy();
        });
        test('should return true for three arguments', () => {
            const func = jovo.parseForFailedValidators;
            const failedValidators = [['Validator', 'name', 'Name cannot be null.']];
            const obj = func(failedValidators);
            expect(obj.failed('Validator', 'name', 'Name cannot be null.')).toBeTruthy();
        });
        test('should return false for no failed validators', () => {
            const func = jovo.parseForFailedValidators;
            const failedValidators = [];
            const obj = func(failedValidators);
            expect(obj.failed('Validator')).toBeFalsy();
        });
        test('should return false if no argument matches', () => {
            const func = jovo.parseForFailedValidators;
            const failedValidators = [['Validator', 'name', 'Name cannot be null.']];
            const obj = func(failedValidators);
            expect(obj.failed('Function')).toBeFalsy();
        });
    });
});
describe('test parseForValidator()', () => {
    class ValidatorImpl extends src_1.Validator {
        validate() {
            // tslint:disable-line
            if (this.inputToValidate.value === 'test') {
                throw new src_1.ValidationError('Validator');
            }
        }
    }
    test('should succeed with validator of type Validator', () => {
        const func = jovo.parseForValidator;
        const v = new ValidatorImpl();
        const failedValidators = [];
        // @ts-ignore
        func(v, 'key', { value: 'value' }, failedValidators);
        expect(failedValidators).toHaveLength(0);
    });
    test('should push failed validator onto failedValidators', () => {
        const func = jovo.parseForValidator;
        const v = new ValidatorImpl();
        const failedValidators = [];
        // @ts-ignore
        func(v, 'key', { name: 'key', value: 'test' }, failedValidators);
        expect(failedValidators).toHaveLength(1);
        expect(failedValidators[0]).toStrictEqual(['Validator', 'key', '']);
    });
});
describe('test parseForValidatorAsync()', () => {
    class ValidatorImpl extends src_1.Validator {
        async validate() {
            // tslint:disable-line
            await jest.fn().mockResolvedValue(100);
            if (this.inputToValidate.value === 'test') {
                throw new src_1.ValidationError('Validator');
            }
        }
    }
    test('should succeed with validator of type Validator', async () => {
        const func = jovo.parseForValidatorAsync;
        const v = new ValidatorImpl();
        const failedValidators = [];
        // @ts-ignore
        await func(v, 'key', { value: 'value' }, failedValidators);
        expect(failedValidators).toHaveLength(0);
    });
    test('should push failed validator onto failedValidators', async () => {
        const func = jovo.parseForValidatorAsync;
        const v = new ValidatorImpl();
        const failedValidators = [];
        // @ts-ignore
        await func(v, 'key', { name: 'key', value: 'test' }, failedValidators);
        expect(failedValidators).toHaveLength(1);
        expect(failedValidators[0]).toStrictEqual(['Validator', 'key', '']);
    });
});
describe('test getActiveComponentsRootState', () => {
    beforeEach(() => {
        jovo.$session = {
            $data: {},
        };
        jovo.$components = {
            'jovo-component-test': {
                config: {},
                data: {},
                name: 'jovo-component-test',
            },
        };
    });
    test('state only has component state', () => {
        jovo.$session.$data[src_1.SessionConstants.STATE] = 'jovo-component-test';
        expect(jovo.getActiveComponentsRootState()).toBe('jovo-component-test');
    });
    test('component name is last one with depth = 3', () => {
        jovo.$session.$data[src_1.SessionConstants.STATE] = 'state1.state2.jovo-component-test';
        expect(jovo.getActiveComponentsRootState()).toBe('state1.state2.jovo-component-test');
    });
    test('component name is middle one with depth = 3', () => {
        jovo.$session.$data[src_1.SessionConstants.STATE] = 'state1.jovo-component-test.state2';
        expect(jovo.getActiveComponentsRootState()).toBe('state1.jovo-component-test');
    });
    test('component name is first one with depth = 3', () => {
        jovo.$session.$data[src_1.SessionConstants.STATE] = 'jovo-component-test.state1.state2';
        expect(jovo.getActiveComponentsRootState()).toBe('jovo-component-test');
    });
    test('there is no component name in state', () => {
        jovo.$session.$data[src_1.SessionConstants.STATE] = 'state1.state2';
        expect(jovo.getActiveComponentsRootState()).toBeUndefined();
    });
});
//# sourceMappingURL=Jovo.test.js.map