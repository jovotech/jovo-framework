
import { Plugin, BaseApp, PluginConfig, HandleRequest, Jovo } from 'jovo-core';
import _merge = require('lodash.merge');
import { Validator } from './Validators';

interface Config extends PluginConfig {
    validation?: {
        // [key: string]: {
        //     [key: string]: any  // tslint:disable-line
        // } | Validator | any[]
        [key: string]: any
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
        if (Object.keys(this.config.validation!).length > 0) {
            app.middleware('router')!.use(this.run.bind(this));
        }
    }

    uninstall(app: BaseApp) { }

    async run(handleRequest: HandleRequest) {
        const jovo = handleRequest.jovo!;
        const inputs = jovo.$inputs;
        const intent = jovo.$request!.getIntentName()!;
        const { validation } = this.config!;

        if (!validation) {
            return;
        }

        for (const input in inputs) {
            if (!inputs.hasOwnProperty(input)) {
                continue;
            }

            for (const intentToValidate of [validation[intent][input], validation[input]]) {
                if (intentToValidate) {
                    switch (intentToValidate.constructor) {
                        case Array: {
                            for (const validator of intentToValidate) {
                                if (validator instanceof Validator) {
                                    validator.setInputToValidate(input);
                                    if (!validator.validate(jovo)) {
                                        return;
                                    }
                                } else {
                                    await validator.call(jovo);
                                }
                            }
                        } break;
                        case Function: {
                            if (intentToValidate instanceof Validator) {
                                intentToValidate.setInputToValidate(input);
                                if (!intentToValidate.validate(jovo)) {
                                    return;
                                }
                            } else {
                                await intentToValidate.call(jovo);
                            }
                        } break;
                        default: {
                            throw new Error('Not supported.');
                        }
                    }
                }
            }
        }
    }
}