import { Validator } from './Validator';
export declare class IsRequiredValidator extends Validator {
    /**
     * Checks if the current request input data is required or not.
     * @throws ValidationError if input is not present.
     */
    validate(): void;
}
