
import { Plugin, BaseApp, PluginConfig, HandleRequest, Jovo } from 'jovo-core';
import _merge = require('lodash.merge');

interface Config extends PluginConfig {
    validation?: {
        [key: string]: {
            [key: string]: any  // tslint:disable-line
        }
    }
}

export class Validation implements Plugin {
    config: Config = {
        validation: {}
    };

    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    install(app: BaseApp) {
        if (this.config.validation) {
            app.middleware('nlu')!.use(this.run.bind(this));
        }
    }

    uninstall(app: BaseApp) { }

    run(handleRequest: HandleRequest) {
        const request = handleRequest.jovo!.$request!;
        const intent = request.getIntentName()!;
        const jovo = handleRequest.jovo;
        const inputs = jovo!.$inputs;
        const { validation } = this.config!;

        console.log('Got a request!!');
        console.log('Intent: ', intent);
        console.log('Inputs: ', inputs);

        if(!validation || !validation[intent]) {
            return;
        }

        const intentToValidate = validation[intent];

        for(const key in inputs) {
            if(!inputs.hasOwnProperty(key)) {
                continue;
            }

            if(intentToValidate[key]) {
                switch(intentToValidate[key].constructor) {
                    case Array: {
                        for(const validator of intentToValidate[key]) {
                            validator.validate.call(jovo);
                        }
                    } break;
                    default: {
                        intentToValidate[key].validate.call(jovo);
                    }
                } 
            }
        }
    }
}

interface IValidator {
    validate(): any;
}

export class Validator implements IValidator {
    constructor() {}
    validate() {}
}

export class IsRequiredValidator extends Validator {
    constructor() { 
        super();
    }

    validate(this: Jovo) {
        console.log('Validating...');
        console.log(this.$request!.getIntentName());
    }
}
