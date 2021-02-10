import { Validator } from './Validator';
export declare class InvalidValuesValidator extends Validator {
    invalidValues: Array<string | RegExp>;
    constructor(invalidValues?: Array<string | RegExp>);
    /**
     * Filters the current request input data for invalid values.
     * @throws ValidationError if input data is invalid.
     * @throws JovoError if value is not of type string|RegExp.
     */
    validate(): void;
}
