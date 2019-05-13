import { Jovo } from 'jovo-core';

export interface Config {
    onFail?: string;
    values?: string[];
    replace?: { values: string[], mapTo: string }[];
}

export abstract class Validator {
    protected inputToValidate: string = '';
    protected onFail: {
        state?: string;
        intent: string;
    } = { intent: 'Unhandled' };

    constructor(config?: Config) {
        if (config && config.onFail) {
            const onFail = config.onFail.split('.');
            const intent = onFail.pop() || 'Unhandled';
            const state = onFail.join('.');
            this.onFail = { state, intent };
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
            const { state, intent } = this.onFail;
            // @ts-ignore
            jovo.toStateIntent(state, intent);
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

        if (this.validValues.indexOf(input.value) === -1) {
            const { state, intent } = this.onFail;
            // @ts-ignore
            jovo.toStateIntent(state, intent);
            return false;
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

        if (this.invalidValues.indexOf(input.value) > -1) {
            const { state, intent } = this.onFail;
            // @ts-ignore
            jovo.toStateIntent(state, intent);
            return false;
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
            if (r.values.indexOf(input.value) > -1) {
                // TODO replace key as well? 
                input.value = r.mapTo;
                return true;
            }
        }
        return true;
    }
}