import * as querystring from 'querystring';
import {
  AudioEncoder,
  AxiosRequestConfig,
  EnumRequestType,
  Extensible,
  HttpService,
  Jovo,
  JovoError,
  Plugin,
  PluginConfig,
} from 'jovo-core';
import { SimpleAzureAsrResponse } from './Interfaces';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  endpointKey?: string;
  endpointHost?: string;
  language?: string;
}

export class AzureAsr implements Plugin {
  config: Config = {
    endpointKey: '',
    endpointHost: '',
    language: 'en-US',
  };

  constructor(config: Config) {
    this.config = _merge(this.config, config);
  }

  install(parent: Extensible) {
    parent.middleware('$asr')!.use(this.asr.bind(this));
  }

  async asr(jovo: Jovo) {
    const text = jovo.getRawText();

    // tslint:disable-next-line
    const audio: { data: Float32Array; sampleRate: number } = (jovo.$request as any).audio;
    if (audio && audio.data && audio.data instanceof Float32Array && audio.sampleRate) {
      const targetSampleRate = 16000;
      const downSampled = AudioEncoder.sampleDown(audio.data, audio.sampleRate, targetSampleRate);
      const wavBuffer = AudioEncoder.encodeToWav(downSampled, targetSampleRate);

      const result = await this.speechToText(
        wavBuffer,
        `audio/wav; codecs=audio/pcm; samplerate=${targetSampleRate}`,
      );
      jovo.$asr = {
        text: result.DisplayText || '',
        Azure: result,
      };
    } else if (!text && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No audio input.');
    }
  }

  private async speechToText(speech: Buffer, contentType: string): Promise<SimpleAzureAsrResponse> {
    const path = `/speech/recognition/conversation/cognitiveservices/v1?${querystring.stringify({
      language: this.config.language,
    })}`;

    const config: AxiosRequestConfig = {
      url: `${this.config.endpointKey}${path}`,
      data: speech,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.endpointKey,
        'Content-type': contentType,
      },
    };

    try {
      const response = await HttpService.request<SimpleAzureAsrResponse>(config);
      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        throw new Error(
          `Could not reach AzureASR. status: ${response.status}, data: ${
            response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'
          }`,
        );
      }
    } catch (e) {
      throw new JovoError(e);
    }
  }
}
