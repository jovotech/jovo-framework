import {
    Validator,
    IsRequiredValidator,
    ValidValuesValidator,
    InvalidValuesValidator
} from '../src/validators';

describe('Validator', () => {
    test('Validator.setInputToValidate()', () => {
        class ValidatorImpl extends Validator {
            validate() { }
        }
        const v = new ValidatorImpl();
        expect(v['inputToValidate']).toBeUndefined();
        v.setInputToValidate({
            key: 'name',
            value: 'test'
        });
        expect(v['inputToValidate']).toStrictEqual({
            key: 'name',
            value: 'test'
        });
    });
});

describe('IsRequiredValidator', () => {
    describe('IsRequiredValidator.validate()', () => {
        test('should throw ValidationError if validation fails', () => {
            const v = new IsRequiredValidator();
            v.setInputToValidate({
                key: 'name',
                value: ''
            });
            expect(() => v.validate()).toThrow('IsRequiredValidator failed.')
        });

        test('should succeed with value set', () => {
            const v = new IsRequiredValidator();
            v.setInputToValidate({
                key: 'name',
                value: 'test'
            });
            v.validate();
        });
    });
});

describe('ValidValuesValidator', () => {
    describe('ValidValuesValidator.validate()', () => {
        test('empty input value', () => {
            const v = new ValidValuesValidator(['valid1', 'valid2']);
            v.setInputToValidate({
                key: 'key',
                value: ''
            })
            v.validate();
        });

        test('regex input value', () => {
            const v = new ValidValuesValidator([RegExp('.*llo.*')]);
            v.setInputToValidate({
                key: 'key',
                value: 'hello'
            });
            v.validate();
        });

        test('normal string value', () => {
            const v = new ValidValuesValidator(['valid1']);
            v.setInputToValidate({
                key: 'key',
                value: 'valid1'
            })
            v.validate();
        });

        test('should throw error if input is not valid', () => {
            const v = new ValidValuesValidator(['valid1', 'valid2']);
            v.setInputToValidate({
                key: 'key',
                value: 'valid3'
            })
            expect(() => v.validate()).toThrow('ValidValuesValidator failed.');
        });
    });
});

describe('InvalidValuesValidator', () => {
    describe('InvalidValuesValidator.validate()', () => {
        test('empty input value', () => {
            const v = new InvalidValuesValidator(['invalid1']);
            v.setInputToValidate({
                key: 'key',
                value: ''
            })
            v.validate();
        });

        test('regex input value', () => {
            const v = new InvalidValuesValidator([RegExp('.*llo.*')]);
            v.setInputToValidate({
                key: 'key',
                value: 'hello'
            });
            expect(() => v.validate()).toThrow('InvalidValuesValidator failed.');
        });

        test('normal string value', () => {
            const v = new InvalidValuesValidator(['invalid1']);
            v.setInputToValidate({
                key: 'key',
                value: 'invalid1'
            })
            expect(() => v.validate()).toThrow('InvalidValuesValidator failed.');
        });

        test('should succeed if input value is not present in array', () => {
            const v = new InvalidValuesValidator(['invalid1', 'invalid2']);
            v.setInputToValidate({
                key: 'key',
                value: 'validValue'
            });
            v.validate();
        });
    });
});