"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
describe('ValidationError', () => {
    describe('ValidationError.constructor', () => {
        test('should accept only one parameter', () => {
            const err = new src_1.ValidationError('Validator');
            expect(err.message).toMatch('');
            expect(err.validator).toMatch('Validator');
        });
        test('should accept two parameters', () => {
            const err = new src_1.ValidationError('Validator', 'Validator failed');
            expect(err.message).toMatch('Validator failed');
            expect(err.validator).toMatch('Validator');
        });
    });
});
describe('Validator', () => {
    test('Validator.setInputToValidate()', () => {
        class ValidatorImpl extends src_1.Validator {
            validate() { } // tslint:disable-line
        }
        const v = new ValidatorImpl();
        expect(v.inputToValidate).toBeUndefined();
        v.setInputToValidate({
            name: 'name',
            value: 'test',
        });
        expect(v.inputToValidate).toStrictEqual({
            name: 'name',
            value: 'test',
        });
    });
});
describe('IsRequiredValidator', () => {
    describe('IsRequiredValidator.validate()', () => {
        test('should throw ValidationError if validation fails', () => {
            const v = new src_1.IsRequiredValidator();
            v.setInputToValidate({
                name: 'name',
                value: '',
            });
            expect(() => v.validate()).toThrow('IsRequiredValidator failed.');
        });
        test('should succeed with value set', () => {
            const v = new src_1.IsRequiredValidator();
            v.setInputToValidate({
                name: 'name',
                value: 'test',
            });
            v.validate();
        });
    });
});
describe('ValidValuesValidator', () => {
    describe('ValidValuesValidator.validate()', () => {
        test('empty input value', () => {
            const v = new src_1.ValidValuesValidator(['valid1', 'valid2']);
            v.setInputToValidate({
                name: 'name',
                value: '',
            });
            expect(() => v.validate()).toThrow('ValidValuesValidator failed.');
        });
        test('regex input value', () => {
            const v = new src_1.ValidValuesValidator([RegExp('.*llo.*')]);
            v.setInputToValidate({
                name: 'name',
                value: 'hello',
            });
            v.validate();
        });
        test('normal string value', () => {
            const v = new src_1.ValidValuesValidator(['valid1']);
            v.setInputToValidate({
                name: 'name',
                value: 'valid1',
            });
            v.validate();
        });
        test('should throw error if input is not valid', () => {
            const v = new src_1.ValidValuesValidator(['valid1', 'valid2']);
            v.setInputToValidate({
                name: 'name',
                value: 'valid3',
            });
            expect(() => v.validate()).toThrow('ValidValuesValidator failed.');
        });
    });
});
describe('InvalidValuesValidator', () => {
    describe('InvalidValuesValidator.validate()', () => {
        test('empty input value', () => {
            const v = new src_1.InvalidValuesValidator(['invalid1']);
            v.setInputToValidate({
                name: 'name',
                value: '',
            });
            expect(() => v.validate()).toThrow('InvalidValuesValidator failed.');
        });
        test('regex input value', () => {
            const v = new src_1.InvalidValuesValidator([RegExp('.*llo.*')]);
            v.setInputToValidate({
                name: 'name',
                value: 'hello',
            });
            expect(() => v.validate()).toThrow('InvalidValuesValidator failed.');
        });
        test('normal string value', () => {
            const v = new src_1.InvalidValuesValidator(['invalid1']);
            v.setInputToValidate({
                name: 'name',
                value: 'invalid1',
            });
            expect(() => v.validate()).toThrow('InvalidValuesValidator failed.');
        });
        test('should succeed if input value is not present in array', () => {
            const v = new src_1.InvalidValuesValidator(['invalid1', 'invalid2']);
            v.setInputToValidate({
                name: 'name',
                value: 'validValue',
            });
            v.validate();
        });
    });
});
//# sourceMappingURL=Validator.test.js.map