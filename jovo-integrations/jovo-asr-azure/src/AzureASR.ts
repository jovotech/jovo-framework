import * as https from 'https';
import * as querystring from 'querystring';
import _merge = require('lodash.merge');
import {
  EnumRequestType,
  Extensible,
  Inputs,
  Jovo,
  JovoError,
  Plugin,
  PluginConfig,
} from 'jovo-core';
import { HttpService } from './HttpService';
import { AudioEncoder } from './AudioEncoder';

export interface Config extends PluginConfig {
  endpointKey?: string;
  endpointHost?: string;
  language?: string;
}

export class AzureASR implements Plugin {
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
    parent.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  async asr(jovo: Jovo) {
    const text = jovo.getRawText();

    const audio: { data: any; sampleRate: number } = (jovo.$request as any).audio;
    if (audio && audio.data && audio.data instanceof Float32Array && audio.sampleRate) {
      const targetSampleRate = 16000;
      const downSampled = AudioEncoder.sampleDown(audio.data, audio.sampleRate, targetSampleRate);
      const wavBuffer = AudioEncoder.encodeToWav(downSampled, audio.sampleRate);

      const result = await this.speechToText(
        wavBuffer,
        `audio/wav; codecs=audio/pcm; samplerate=${targetSampleRate}`,
      );

      console.log(JSON.stringify(result, undefined, 2));

      jovo.$asr = {};
    } else if (!text && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No audio input.');
    }
  }

  async inputs(jovo: Jovo) {}

  private async speechToText(speech: Buffer, contentType: string): Promise<any> {
    const path = `/speech/recognition/conversation/cognitiveservices/v1?${querystring.stringify({
      language: this.config.language,
    })}`;

    const options: https.RequestOptions = {
      host: this.config.endpointHost,
      method: 'POST',
      path,
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.endpointKey,
        'Content-type': contentType,
      },
    };

    console.log(options);

    try {
      const response = await HttpService.makeRequest<any>(options, speech);
      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        console.log(response.data);
        throw new Error(
          `Could not reach Luis. status: ${response.status}, data: ${
            response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'
          }`,
        );
      }
    } catch (e) {
      console.log(e);
      throw new JovoError(e);
    }
  }
}
