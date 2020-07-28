import {
  AudioEncoder,
  AxiosRequestConfig,
  EnumRequestType,
  ErrorCode,
  Extensible,
  HttpService,
  Jovo,
  JovoError,
  Platform,
  Plugin,
  PluginConfig,
} from 'jovo-core';
import { stringify } from 'querystring';
import { SimpleAzureAsrResponse } from './Interfaces';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  endpointKey?: string;
  endpointRegion?: string;
  language?: string;
}

const TARGET_SAMPLE_RATE = 16000;

export class AzureAsr implements Plugin {
  config: Config = {
    endpointKey: '',
    endpointRegion: '',
    language: 'en-US',
  };

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
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
    if (!parent.supportsASR()) {
      throw new JovoError(
        `'${this.name}' can only be used by platforms that support ASR!`,
        ErrorCode.ERR_PLUGIN,
        this.name,
      );
    }
    parent.middleware('$asr')!.use(this.asr.bind(this));
  }

  async asr(jovo: Jovo) {
    const text = jovo.getRawText();
    const audio = jovo.getAudioData();

    if (audio) {
      const downSampled = AudioEncoder.sampleDown(audio.data, audio.sampleRate, TARGET_SAMPLE_RATE);
      const wavBuffer = AudioEncoder.encodeToWav(downSampled, TARGET_SAMPLE_RATE);

      const result = await this.speechToText(
        wavBuffer,
        `audio/wav; codecs=audio/pcm; samplerate=${TARGET_SAMPLE_RATE}`,
      );
      jovo.$asr = {
        text: result.DisplayText || '',
        [this.name]: result,
      };
    } else if (!text && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No audio input.', ErrorCode.ERR_PLUGIN, this.name);
    }
  }

  private async speechToText(speech: Buffer, contentType: string): Promise<SimpleAzureAsrResponse> {
    this.validateConfig();

    const path = `/speech/recognition/conversation/cognitiveservices/v1?${stringify({
      language: this.config.language,
    })}`;

    const url = `https://${this.config.endpointRegion}.sst.speech.microsoft.com${path}`;
    const config: AxiosRequestConfig = {
      url,
      data: speech,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.endpointKey,
        'Content-type': contentType,
      },
      validateStatus: (status: number) => {
        return true;
      },
    };

    try {
      const response = await HttpService.request<SimpleAzureAsrResponse>(config);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new JovoError(
        `Could not retrieve ASR data!`,
        ErrorCode.ERR_PLUGIN,
        this.name,
        `Response: ${response.status} ${
          response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'
        }`,
      );
    } catch (e) {
      const configText = `Current configuration: ${JSON.stringify(this.config, undefined, 2)}`;
      throw new JovoError(
        e.message || e,
        ErrorCode.ERR_PLUGIN,
        e.module || this.name,
        e.details ? `${e.details}\n${configText}` : configText,
        e.hint,
        e.seeMore,
      );
    }
  }

  private validateConfig() {
    if (!this.config.endpointRegion || !this.config.endpointKey || !this.config.language) {
      throw new JovoError(
        `Invalid configuration!`,
        ErrorCode.ERR_PLUGIN,
        this.name,
        `Current configuration: ${JSON.stringify(this.config, undefined, 2)}`,
        `Make sure 'endpointRegion', 'endpointKey' and 'language' are set and valid.`,
      );
    }
  }
}
