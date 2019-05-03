
import { Plugin, BaseApp, PluginConfig, HandleRequest } from 'jovo-core';
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
        const inputs = handleRequest.jovo!.$inputs;
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
                            validator.validate(inputs[key]);
                        }
                    } break;
                    default: {
                        intentToValidate[key].validate(inputs[key]);
                    }
                } 
            }
        }
    }
}

interface IValidator {
    validate(): any;
}

export class IsRequiredValidator implements IValidator {
    constructor() { }

    validate() {
        console.log('Validating...');
    }
}
