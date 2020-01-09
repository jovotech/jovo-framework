import {
  AudioEncoder,
  AxiosRequestConfig,
  EnumRequestType,
  Extensible,
  HttpService,
  Inputs,
  Jovo,
  JovoError,
  Plugin,
  PluginConfig
} from 'jovo-core';
import { WitAiInput, WitAiIntent, WitAiResponse } from './Interfaces';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  token: string;
  minConfidence?: number;
}

const BASE_URL = `https://api.wit.ai`;

export class WitAiSLU implements Plugin {
  config: Config = {
    token: '',
    minConfidence: 0,
  };

  constructor(config: Config) {
    this.config = _merge(this.config, config);
  }

  install(parent: Extensible): void {
    parent.middleware('$asr')!.use(this.asr.bind(this));
    parent.middleware('$nlu')!.use(this.nlu.bind(this));
    parent.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  async asr(jovo: Jovo) {
    const text = jovo.getRawText();
    //tslint:disable-next-line
    const audio: { data: any; sampleRate: number } = (jovo.$request as any).audio;

    if (audio && audio.data && audio.data instanceof Float32Array && audio.sampleRate) {
      const targetSampleRate = 8000;
      const downSampled = AudioEncoder.sampleDown(audio.data, audio.sampleRate, targetSampleRate);
      const wavBuffer = AudioEncoder.encodeToWav(downSampled, targetSampleRate);

      const result = await this.speechToText(wavBuffer, 'audio/wav');
      jovo.$asr = {
        text: result._text || '',
        WitAi: result,
      };
    } else if (!text && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No audio or text input.');
    }
  }

  async nlu(jovo: Jovo) {
    const text = (jovo.$asr && jovo.$asr.text) ?? jovo.getRawText();

    let response: WitAiResponse | null = null;
    if (text) {
      response = await this.naturalLanguageProcessing(text);
    } else if (jovo.$asr && jovo.$asr.WitAi && !jovo.$asr.WitAi.error) {
      response = jovo.$asr.WitAi as WitAiResponse;
    } else if (jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No audio or text input to process.');
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
      WitAi: response,
    };
  }

  async inputs(jovo: Jovo) {
    console.log('[WitAiSLU] ( $inputs )');

    if ((!jovo.$nlu || !jovo.$nlu.WitAi) && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No nlu data to get inputs off was given.');
    } else if (
      jovo.$type.type === EnumRequestType.LAUNCH ||
      jovo.$type.type === EnumRequestType.END
    ) {
      jovo.$inputs = {};
      return;
    }

    const response = jovo.$nlu!.WitAi as WitAiResponse;

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
    };

    const response = await HttpService.request<WitAiResponse>(config);
    if (response.status === 200 && response.data && response.data.msg_id) {
      return response.data;
    } else {
      throw new JovoError(`Could not reach Wit.Ai`);
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
    };

    const response = await HttpService.request<WitAiResponse>(config);
    if (response.status === 200 && response.data && response.data.msg_id) {
      return response.data;
    } else {
      throw new JovoError(`Could not reach Wit.Ai`);
    }
  }
}
