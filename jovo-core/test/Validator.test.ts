import {
    Validator,
    ValidationError,
    IsRequiredValidator,
    ValidValuesValidator,
    InvalidValuesValidator
} from '../src/validators';
import { Jovo } from '../src';

describe('Validator', () => {
    test('Validator.setInputToValidate()', () => {
        class ValidatorImpl extends Validator {
            validate(jovo: Jovo) { }
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
                key: 'name',
                value: ''
            })
            v.validate();
        });
        test('regex input value', () => {

        });
        test('normal string value', () => {
            const v = new ValidValuesValidator(['valid1', 'valid2']);
            v.setInputToValidate({
                key: 'name',
                value: 'valid1'
            })
            v.validate();
        });
        test('should throw error if input is not valid', () => {
            const v = new ValidValuesValidator(['valid1', 'valid2']);
            v.setInputToValidate({
                key: 'name',
                value: 'valid3'
            })
            expect(() => v.validate()).toThrow('ValidValuesValidator failed.');
        });
    });
});

describe('InvalidValuesValidator', () => {
    describe('InvalidValuesValidator.validate()', () => {
        test('empty input value');
        test('regex input value');
        test('normal string value');
        test('should throw error if input is not valid');
    });
});