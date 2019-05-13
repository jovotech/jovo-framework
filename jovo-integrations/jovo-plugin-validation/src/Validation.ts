
import { Plugin, BaseApp, PluginConfig, HandleRequest, JovoError, ErrorCode } from 'jovo-core';
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
        const state = jovo.$request!.getState();
        const intent = jovo.$request!.getIntentName()!;
        const { validation } = this.config!;

        if (!validation || !intent) {
            return;
        }

        const route = (state ? `${state}.` : '') + intent;

        for (const input in inputs) {
            if (!inputs.hasOwnProperty(input)) {
                continue;
            }

            for (const validator of [validation[input], validation[route] ? validation[route][input] : undefined]) {
                if (validator) {
                    if (validator.constructor === Array) {
                        for (const v of validator) {
                            if (v instanceof Validator) {
                                v.setInputToValidate(input);
                                if (!v.validate(jovo)) {
                                    return;
                                }
                            } else if (v.constructor === Function) {
                                // TODO require to return false?
                                await v.call(jovo);
                            } else {
                                throw new JovoError(
                                    'This validation type is not supported.',
                                    ErrorCode.ERR_PLUGIN,
                                    'jovo-plugin-validation',
                                    undefined,
                                    'Please make sure you only use supported types of validation such as a function or a Validator',
                                    ''
                                );
                            }
                        }
                    } else if (validator instanceof Validator) {
                        validator.setInputToValidate(input);
                        if (!validator.validate(jovo)) {
                            return;
                        }
                    } else if (validator.constructor === Function) {
                        await validator.call(jovo);
                    } else {
                        throw new JovoError(
                            'This validation type is not supported.',
                            ErrorCode.ERR_PLUGIN,
                            'jovo-plugin-validation',
                            undefined,
                            'Please make sure you only use supported types of validation such as a function or a Validator',
                            ''
                        );
                    }
                }
            }
        }
    }
}