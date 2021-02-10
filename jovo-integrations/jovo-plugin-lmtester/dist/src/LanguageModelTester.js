"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
class LanguageModelTester {
    constructor(config) {
        this.config = {
            startText: 'Start',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    install(app) {
        if (process.argv.indexOf('--model-test') > -1) {
            app.middleware('after.router').use(this.testModel.bind(this));
            app.middleware('user.load').skip();
            app.middleware('handler').skip();
            app.middleware('user.save').skip();
        }
    }
    testModel(handleRequest) {
        if (!handleRequest.jovo) {
            return Promise.resolve();
        }
        if (!handleRequest.jovo.$type) {
            return Promise.resolve();
        }
        if (handleRequest.jovo.$type.type === jovo_core_1.EnumRequestType.LAUNCH) {
            handleRequest.jovo.ask(this.config.startText, this.config.startText);
        }
        else if (handleRequest.jovo.$type.type === jovo_core_1.EnumRequestType.INTENT) {
            // skip END requests
            if (_get(handleRequest.jovo.$plugins, 'Router.route.path') === 'END') {
                return;
            }
            if (handleRequest.jovo.$nlu && handleRequest.jovo.$nlu.intent) {
                jovo_core_1.Log.info();
                jovo_core_1.Log.info('Intent:');
                jovo_core_1.Log.info('  ' + handleRequest.jovo.$nlu.intent.name);
                if (handleRequest.jovo.$inputs) {
                    if (Object.keys(handleRequest.jovo.$inputs).length > 0) {
                        jovo_core_1.Log.info();
                        jovo_core_1.Log.info('Inputs:');
                    }
                    for (const key of Object.keys(handleRequest.jovo.$inputs)) {
                        const input = handleRequest.jovo.getInput(key);
                        if (input) {
                            let out = `${key}: ${input.value ? input.value : ''}`;
                            if (_get(input, 'alexaSkill.resolutions.resolutionsPerAuthority[0].status.code') &&
                                _get(input, 'alexaSkill.resolutions.resolutionsPerAuthority[0].status.code') !==
                                    'ER_SUCCESS_MATCH') {
                                out += ` (${_get(input, 'alexaSkill.resolutions.resolutionsPerAuthority[0].status.code')})`;
                            }
                            jovo_core_1.Log.info('  ' + out);
                        }
                    }
                }
                jovo_core_1.Log.info();
                jovo_core_1.Log.info(' -----------------------------');
                handleRequest.jovo.ask(handleRequest.jovo.$nlu.intent.name, 'Say the next phrase');
            }
        }
    }
}
exports.LanguageModelTester = LanguageModelTester;
//# sourceMappingURL=LanguageModelTester.js.map