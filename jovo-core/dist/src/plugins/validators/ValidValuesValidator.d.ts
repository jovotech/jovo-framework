import { Validator } from './Validator';
export declare class ValidValuesValidator extends Validator {
    validValues: Array<string | RegExp>;
    constructor(validValues?: Array<string | RegExp>);
    /**
     * Filters the current request input data for valid values.
     * @throws ValidationError if input data is not valid.
     * @throws JovoError if value type is not of type string|RegExp.
     */
    validate(): void;
}
