import { Jovo } from 'jovo-core';

interface IValidator {
    validate(jovo: Jovo): boolean;
}

export class Validator implements IValidator {
    protected inputToValidate: string = '';

    constructor() { }

    setInputToValidate(input: string) {
        this.inputToValidate = input;
    }

    validate(jovo: Jovo) { 
        return true;
    }
}

export class IsRequiredValidator extends Validator {
    constructor(private handler: string = 'Unhandled') {
        super();
    }

    validate(jovo: Jovo) {
        const input = jovo.$inputs[this.inputToValidate];
        if (!input || !input.value) {
            // @ts-ignore
            jovo.toIntent(this.handler);
            return false;
        }
        return true;
    }
}

export class ValidValuesValidator extends Validator {
    constructor(
        private validValues: string[],
        private handler: string = 'Unhandled'
    ) {
        super();
    }

    validate(jovo: Jovo) {
        const input = jovo.$inputs[this.inputToValidate];

        if (!input || !input.value) {
            // TODO return to handler? -> would replace isrequiredvalidator, maybe extend IsRequired?
            return;
        }

        for (const value of this.validValues) {
            if (input.value !== value) {
                // @ts-ignore
                jovo.toIntent(this.handler);
                return false;
            }
        }
        return true;
    }
}

export class InvalidValuesValidator extends Validator {
    constructor(
        private invalidValues: string[],
        private handler: string = 'Unhandled'
    ) {
        super();
    }

    validate(jovo: Jovo) {
        const input = jovo.$inputs[this.inputToValidate];

        if (!input || !input.value) {
            return;
        }

        for (const value of this.invalidValues) {
            if (input.value === value) {
                // @ts-ignore
                jovo.toIntent(this.handler);
                return false;
            }
        }
        return true;
    }
}

// export class ReplaceValuesValidator extends Validator {
//     constructor(
        
//     )
// }