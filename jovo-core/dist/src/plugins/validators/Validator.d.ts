import { Jovo } from '../../core/Jovo';
export declare abstract class Validator {
    inputToValidate: {
        [key: string]: any;
    } | undefined;
    /**
     * Set current input to validate.
     * @param input
     */
    setInputToValidate(input: any): void;
    /**
     * Main function for validators.
     * @param jovo Optional jovo object for accessing more data.
     */
    abstract validate(jovo?: Jovo): void;
}
