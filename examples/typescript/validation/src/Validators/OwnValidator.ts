import { Validator, Jovo, ValidationError } from 'jovo-core';

export class OwnValidator extends Validator {
    validate(jovo: Jovo) {
        if (['invalidName1', 'invalidName2'].includes(jovo.$inputs.name.value)) {
            throw new ValidationError(
                this.constructor.name,
                `My own validator failed for ${jovo.$inputs.name.value}.`
            );
        }
    }
};