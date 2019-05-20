import { Jovo } from '../Jovo';

export abstract class Validator {
    protected inputToValidate: { [key: string]: any } | undefined;

    setInputToValidate(input: any) {
        this.inputToValidate = input;
    }

    abstract validate(jovo?: Jovo): void;
}

export class ValidationError extends Error {
    constructor(
        public message: string,
        public validator: string
    ) {
        super(message);
    }
}