import {
  AxiosRequestConfig,
  EnumRequestType,
  ErrorCode,
  Extensible,
  HttpService,
  Inputs,
  Jovo,
  JovoError,
  Platform,
  Plugin,
  PluginConfig,
} from 'jovo-core';
import * as querystring from 'querystring';
import { LuisResponse } from './Interfaces';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  endpointKey?: string;
  endpointRegion?: string;
  appId?: string;
  verbose?: boolean;
  defaultIntent?: string;
  slot?: 'production' | 'staging';
}

export class LuisNlu implements Plugin {
  config: Config = {
    endpointKey: '',
    endpointRegion: '',
    appId: '',
    verbose: false,
    slot: 'staging',
  };

  constructor(config: Config) {
    this.config = _merge(this.config, config);
  }

  get name(): string {
    return this.constructor.name;
  }

  install(parent: Extensible) {
    if (!(parent instanceof Platform)) {
      throw new JovoError(
        `'${this.name}' has to be an immediate plugin of a platform!`,
        ErrorCode.ERR_PLUGIN,
        this.name,
      );
    }
    parent.middleware('$nlu')!.use(this.nlu.bind(this));
    parent.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  async nlu(jovo: Jovo) {
    const text = (jovo.$asr && jovo.$asr.text) || jovo.getRawText();

    let response: LuisResponse | null = null;
    if (text) {
      response = await this.naturalLanguageProcessing(text);
    } else if (jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No text input to process.', ErrorCode.ERR_PLUGIN, this.name);
    }

    let intentName = this.config.defaultIntent || 'None';
    if (jovo.$type.type === EnumRequestType.LAUNCH) {
      intentName = 'LAUNCH';
    } else if (jovo.$type.type === EnumRequestType.END) {
      intentName = 'END';
    } else if (response && response.prediction && response.prediction.topIntent) {
      intentName = response.prediction.topIntent;
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

    const response: LuisResponse = jovo.$nlu![this.name];

    const inputs: Inputs = {};
    const entities = response.prediction.entities;
    if (!entities) {
      return inputs;
    }

    for (const entityName in entities) {
      if (entities.hasOwnProperty(entityName)) {
        const entityData = entities[entityName];
        const value = typeof entityData === 'string' ? entityData : entityData.toString();
        inputs[entityName] = {
          key: value,
          name: entityName,
          value,
        };
      }
    }

    jovo.$inputs = inputs;
  }

  private async naturalLanguageProcessing(text: string): Promise<LuisResponse> {
    const queryParams = {
      'show-all-intents': true,
      'verbose': this.config.verbose || false,
      'query': text,
      'subscription-key': this.config.endpointKey,
    };

    const path = `/luis/prediction/v3.0/apps/${this.config.appId}/slots/${
      this.config.slot
    }/predict?${querystring.stringify(queryParams)}`;

    const url = `https://${this.config.endpointRegion}.api.cognitive.microsoft.com${path}`;
    const options: AxiosRequestConfig = {
      url,
      validateStatus: (status: number) => {
        return true;
      },
    };

    try {
      const response = await HttpService.request<LuisResponse>(options);
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
