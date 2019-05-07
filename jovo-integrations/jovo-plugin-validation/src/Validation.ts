
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
        if (Object.keys(this.config.validation!).length > 0) {
            app.middleware('router')!.use(this.run.bind(this));
        }
    }

    uninstall(app: BaseApp) { }


    /**
     * TODO Current problems: 
     * - if one validator fails, the remaining validators are all called
     */
    run(handleRequest: HandleRequest) {
        const request = handleRequest.jovo!.$request!;
        const intent = request.getIntentName()!;
        const jovo = handleRequest.jovo;
        const inputs = jovo!.$inputs;
        const { validation } = this.config!;

        if (!validation || !validation[intent]) {
            return;
        }

        const intentToValidate = validation[intent];
        if(!intentToValidate) {
            return;
        }

        for (const key in inputs) {
            if (!inputs.hasOwnProperty(key)) {
                continue;
            }

            if (intentToValidate[key]) {
                console.log(intentToValidate[key]);
                switch (intentToValidate[key].constructor) {
                    case Array: {
                        for (const validator of intentToValidate[key]) {
                            switch (validator.constructor) {
                                case Function: {
                                    validator.call(jovo);
                                } break;
                                case Object: {
                                    validator.setInputToValidate(key);
                                    if(!validator.validate(jovo)) {
                                        return;
                                    }
                                }
                            }
                        }
                    } break;
                    case Function: {
                        intentToValidate[key].call(jovo);
                    }
                    default: {
                        intentToValidate[key].setInputToValidate(key);
                        if(!intentToValidate[key].validate(jovo)) {
                            return;
                        }
                    }
                }
            }
        }
    }
}