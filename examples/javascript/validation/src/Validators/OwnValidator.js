const { Validator, ValidationError } = require('jovo-core');

class OwnValidator extends Validator {
    validate(jovo) {
        if (['invalidName1', 'invalidName2'].includes(jovo.$inputs.name.value)) {
            throw new ValidationError(
                this.constructor.name,
                `My own validator failed for ${jovo.$inputs.name.value}.`
            );
        }
    }
};

module.exports = { OwnValidator };