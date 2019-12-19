import {
  BaseApp,
  Db,
  EnumRequestType,
  ErrorCode,
  HandleRequest,
  JovoError,
  Log,
  Plugin,
  PluginConfig,
} from 'jovo-core';

import _get = require('lodash.get');
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  startText: string;
}

export class LanguageModelTester implements Plugin {
  config: Config = {
    startText: 'Start',
  };

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  install(app: BaseApp) {
    if (process.argv.indexOf('--model-test') > -1) {
      app.middleware('after.router')!.use(this.testModel.bind(this));
      app.middleware('user.load')!.skip();
      app.middleware('handler')!.skip();
      app.middleware('user.save')!.skip();
    }
  }

  testModel(handleRequest: HandleRequest) {
    if (!handleRequest.jovo) {
      return Promise.resolve();
    }

    if (!handleRequest.jovo.$type) {
      return Promise.resolve();
    }

    if (handleRequest.jovo.$type.type === EnumRequestType.LAUNCH) {
      handleRequest.jovo.ask(this.config.startText, this.config.startText);
    } else if (handleRequest.jovo.$type.type === EnumRequestType.INTENT) {
      // skip END requests
      if (_get(handleRequest.jovo.$plugins, 'Router.route.path') === 'END') {
        return;
      }

      if (handleRequest.jovo.$nlu && handleRequest.jovo.$nlu.intent) {
        Log.info();
        Log.info('Intent:');
        Log.info('  ' + handleRequest.jovo.$nlu.intent.name);

        if (handleRequest.jovo.$inputs) {
          if (Object.keys(handleRequest.jovo.$inputs).length > 0) {
            Log.info();
            Log.info('Inputs:');
          }

          for (const key of Object.keys(handleRequest.jovo.$inputs)) {
            const input = handleRequest.jovo.getInput(key);
            if (input) {
              let out = `${key}: ${input.value ? input.value : ''}`;

              if (
                _get(input, 'alexaSkill.resolutions.resolutionsPerAuthority[0].status.code') &&
                _get(input, 'alexaSkill.resolutions.resolutionsPerAuthority[0].status.code') !==
                  'ER_SUCCESS_MATCH'
              ) {
                out += ` (${_get(
                  input,
                  'alexaSkill.resolutions.resolutionsPerAuthority[0].status.code',
                )})`;
              }

              Log.info('  ' + out);
            }
          }
        }

        Log.info();
        Log.info(' -----------------------------');

        handleRequest.jovo.ask(handleRequest.jovo.$nlu.intent.name, 'Say the next phrase');
      }
    }
  }
}
