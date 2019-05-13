
import { Plugin, BaseApp, PluginConfig, HandleRequest, JovoError, Jovo, ErrorCode } from 'jovo-core';
import _merge = require('lodash.merge');
import { Validator } from './Validators';

interface Config extends PluginConfig {
    validation?: {
        // [key: string]: {
        //     [key: string]: Validator | Function | any[]
        // } | Validator | Function;
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
            app.middleware('router')!.use(this.validate.bind(this));
        }
    }

    uninstall(app: BaseApp) { }

    async validate(handleRequest: HandleRequest) {
        const jovo = handleRequest.jovo!;
        const inputs = jovo.$inputs;
        const state = jovo.$request!.getState();
        const intent = jovo.$request!.getIntentName()!;
        const { validation } = this.config!;

        if (!validation || !intent) {
            return;
        }

        const route = `${(state ? `${state}.` : '')}${intent}`;

        for (const input in inputs) {
            if (!inputs.hasOwnProperty(input)) {
                continue;
            }

            for (const validator of [validation[input], validation[route] ? validation[route][input] : undefined]) {
                if (validator) {
                    if (validator.constructor === Array) {
                        for (const v of validator) {
                            await this.parseForValidator(v, input, jovo);
                        }
                    } else {
                        await this.parseForValidator(validator, input, jovo);
                    }
                }
            }
        }
    }

    private async parseForValidator(validator: Validator | Function, input: string, jovo: Jovo) {
        if (validator instanceof Validator) {
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