import {
  AudioEncoder,
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
import { WitAiInput, WitAiIntent, WitAiResponse } from './Interfaces';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  token: string;
  minConfidence?: number;
}

const BASE_URL = `https://api.wit.ai`;
const TARGET_SAMPLE_RATE = 8000;

export class WitAiSlu implements Plugin {
  config: Config = {
    token: '',
    minConfidence: 0,
  };

  constructor(config: Config) {
    this.config = _merge(this.config, config);
  }

  get name(): string {
    return this.constructor.name;
  }

  install(parent: Extensible): void {
    if (!(parent instanceof Platform)) {
      throw new JovoError(
        `'${this.name}' has to be an immediate plugin of a platform!`,
        ErrorCode.ERR_PLUGIN,
        this.name,
      );
    }
    if (parent.supportsASR()) {
      parent.middleware('$asr')!.use(this.asr.bind(this));
    }
    parent.middleware('$nlu')!.use(this.nlu.bind(this));
    parent.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  async asr(jovo: Jovo) {
    const text = jovo.getRawText();
    const audio = jovo.getAudioData();

    if (audio) {
      const downSampled = AudioEncoder.sampleDown(audio.data, audio.sampleRate, TARGET_SAMPLE_RATE);
      const wavBuffer = AudioEncoder.encodeToWav(downSampled, TARGET_SAMPLE_RATE);

      const result = await this.speechToText(wavBuffer, 'audio/wav');
      jovo.$asr = {
        text: result._text || '',
        [this.name]: result,
      };
    } else if (!text && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No audio or text input.', ErrorCode.ERR_PLUGIN, this.name);
    }
  }

  async nlu(jovo: Jovo) {
    const text = (jovo.$asr && jovo.$asr.text) || jovo.getRawText();

    let response: WitAiResponse | null = null;
    if (text) {
      response = await this.naturalLanguageProcessing(text);
    } else if (jovo.$asr && jovo.$asr[this.name] && !jovo.$asr[this.name].error) {
      response = jovo.$asr[this.name] as WitAiResponse;
    } else if (jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No audio or text input to process.', ErrorCode.ERR_PLUGIN, this.name);
    }

    let intentName = 'DefaultFallbackIntent';
    response = response!;
    if (jovo.$type.type === EnumRequestType.LAUNCH) {
      intentName = 'LAUNCH';
    } else if (jovo.$type.type === EnumRequestType.END) {
      intentName = 'END';
    } else if (response.entities.intent && response.entities.intent.length >= 0) {
      let biggestIndex = 0;
      response.entities.intent.forEach((intent: WitAiIntent, index: number) => {
        if (intent.confidence > response!.entities.intent![biggestIndex].confidence) {
          biggestIndex = index;
        }
      });
      if (response.entities.intent[biggestIndex].confidence >= this.config.minConfidence!) {
        intentName = response.entities.intent[biggestIndex].value;
      }
    }

    jovo.$nlu = {
      intent: {
        name: intentName,
      },
      [this.name]: response,
    };
  }

  async inputs(jovo: Jovo) {
    console.log('[WitAiSLU] ( $inputs )');

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

    const response = jovo.$nlu![this.name] as WitAiResponse;

    const inputs: Inputs = {};
    for (const entityName in response.entities) {
      if (entityName !== 'intent' && Array.isArray(response.entities[entityName])) {
        (response.entities[entityName] as WitAiInput[]).forEach((foundEntity: WitAiInput) => {
          // TODO implement handling for arrays of the same entity.
          inputs[entityName] = {
            name: entityName,
            key: entityName,
            value: foundEntity.value,
          };
        });
      }
    }

    jovo.$inputs = inputs;
  }

  private async speechToText(speech: Buffer, contentType: string): Promise<WitAiResponse> {
    const url = `${BASE_URL}/speech`;
    const config: AxiosRequestConfig = {
      url,
      method: 'POST',
      data: speech,
      headers: {
        'Authorization': `Bearer ${this.config.token}`,
        'Content-Length': speech.byteLength,
        'Content-Type': contentType,
      },
      validateStatus: (status: number) => {
        return true;
      },
    };
    try {
      const response = await HttpService.request<WitAiResponse>(config);
      if (response.status === 200 && response.data && response.data.msg_id) {
        return response.data;
      }
      throw new Error(
        `Could not retrieve ASR data. status: ${response.status}, data: ${
          response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'
        }`,
      );
    } catch (e) {
      throw new JovoError(e, ErrorCode.ERR_PLUGIN, this.name);
    }
  }

  private async naturalLanguageProcessing(text: string): Promise<WitAiResponse> {
    const query = encodeURIComponent(text);
    const url = `${BASE_URL}/message?q=${query}`;
    const config: AxiosRequestConfig = {
      url,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.config.token}`,
      },
      validateStatus: (status: number) => {
        return true;
      },
    };

    try {
      const response = await HttpService.request<WitAiResponse>(config);
      if (response.status === 200 && response.data && response.data.msg_id) {
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
