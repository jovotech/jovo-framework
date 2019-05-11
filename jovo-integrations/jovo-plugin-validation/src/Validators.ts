import { Jovo } from 'jovo-core';

export interface Config {
    onFail?: string;
    values?: string[];
    replace?: { values: string[], mapTo: string }[];
}

export abstract class Validator {
    protected inputToValidate: string = '';
    protected onFail: string = 'Unhandled';

    constructor(config?: Config) {
        if (config && config.onFail) {
            this.onFail = config.onFail;
        }
    }

    setInputToValidate(input: string) {
        this.inputToValidate = input;
    }

    abstract validate(jovo: Jovo): boolean;
}

export class IsRequiredValidator extends Validator {
    constructor(config?: Config) {
        super(config);
    }

    validate(jovo: Jovo) {
        const input = jovo.$inputs[this.inputToValidate];
        if (!input || !input.value) {
            // @ts-ignore
            jovo.toIntent(this.onFail);
            return false;
        }
        return true;
    }
}

export class ValidValuesValidator extends Validator {
    validValues: string[] = [];

    constructor(config?: Config) {
        super(config);

        if (config && config.values) {
            this.validValues = config.values;
        }
    }

    validate(jovo: Jovo) {
        const input = jovo.$inputs[this.inputToValidate];

        if (!input || !input.value) {
            // TODO return to onFail? return true? -> would replace isrequiredvalidator, maybe extend IsRequired?
            return false;
        }

        for (const value of this.validValues) {
            if (input.value !== value) {
                // @ts-ignore
                jovo.toIntent(this.onFail);
                return false;
            }
        }
        return true;
    }
}

export class InvalidValuesValidator extends Validator {
    invalidValues: string[] = [];

    constructor(config?: Config) {
        super(config);

        if (config && config.values) {
            this.invalidValues = config.values;
        }
    }

    validate(jovo: Jovo) {
        const input = jovo.$inputs[this.inputToValidate];

        if (!input || !input.value) {
            return false;
        }

        for (const value of this.invalidValues) {
            if (input.value === value) {
                // @ts-ignore
                jovo.toIntent(this.onFail);
                return false;
            }
        }
        return true;
    }
}

export class ReplaceValuesValidator extends Validator {
    maps: { values: string[], mapTo: string }[] = [];
    constructor(...args: any[]) {
        super();
        this.maps = args;
    }

    validate(jovo: Jovo) {
        const input = jovo.$inputs[this.inputToValidate];

        if (!input || !input.value) {
            return false;
        }

        for (const r of this.maps) {
            console.log(r);
            if (r.values.indexOf(input.value) > -1) {
                // TODO replace key as well? 
                input.value = r.mapTo;
                return true;
            }
        }
        return true;
    }
}