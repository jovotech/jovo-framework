import {
  AxiosRequestConfig,
  EnumRequestType,
  ErrorCode,
  Extensible,
  HttpService,
  Inputs,
  Jovo,
  JovoError,
  Plugin,
  PluginConfig,
} from 'jovo-core';
import { RasaEntity, RasaResponse } from './Interfaces';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  endpoint?: string;
}

export class RasaNlu implements Plugin {
  config: Config = {
    endpoint: 'http://localhost:5000/parse',
  };

  constructor(config: Config) {
    this.config = _merge(this.config, config);
  }

  get name(): string {
    return this.constructor.name;
  }

  install(parent: Extensible) {
    console.log('installing rasa nlu');
    parent.middleware('$nlu')!.use(this.nlu.bind(this));
    parent.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  async nlu(jovo: Jovo) {
    const text = (jovo.$asr && jovo.$asr.text) || jovo.getRawText();

    console.log(text);
    let response: RasaResponse | null = null;
    if (text) {
      response = await this.naturalLanguageProcessing(text);
    } else if (jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No text input to process.', ErrorCode.ERR_PLUGIN, this.name);
    }
    let intentName = '';
    if (jovo.$type.type === EnumRequestType.LAUNCH) {
      intentName = 'LAUNCH';
    } else if (jovo.$type.type === EnumRequestType.END) {
      intentName = 'END';
    } else if (response && response.intent) {
      intentName = response.intent.name;
    }

    jovo.$nlu = {
      intent: {
        name: intentName,
      },
      [this.name]: response,
    };
  }

  async inputs(jovo: Jovo) {
    if ((!jovo.$nlu || !jovo.$nlu[this.name]) && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError(
        'No nlu data to get inputs off was given.',
        ErrorCode.ERR_PLUGIN,
        this.name,
      );
    } else if (
      jovo.$type.type === EnumRequestType.LAUNCH ||
      jovo.$type.type === EnumRequestType.END
    ) {
      jovo.$inputs = {};
      return;
    }

    const response: RasaResponse = jovo.$nlu![this.name];

    const inputs: Inputs = {};
    const entities = response.entities;
    if (!entities) {
      return inputs;
    }

    entities.forEach((entity: RasaEntity) => {
      inputs[entity.entity] = {
        key: entity.value,
        name: entity.entity,
        value: entity.value,
      };
    });

    jovo.$inputs = inputs;
  }

  private async naturalLanguageProcessing(text: string): Promise<RasaResponse> {
    const url = `${this.config.endpoint}/model/parse`;
    const options: AxiosRequestConfig = {
      url,
      method: 'post',
      validateStatus: (status: number) => {
        return true;
      },
      data: {
        text,
      },
    };

    try {
      const response = await HttpService.request<RasaResponse>(options);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new Error(
        `Could not retrieve NLU data. status: ${response.status}, data: ${
          response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'
        }`,
      );
    } catch (e) {
      throw new JovoError(e, ErrorCode.ERR_PLUGIN, this.name);
    }
  }
}
