import {
  ErrorCode,
  Extensible,
  Jovo,
  JovoError,
  Platform,
  Plugin,
  PluginConfig,
  AxiosRequestConfig,
} from 'jovo-core';
import _merge = require('lodash.merge');
import _get = require('lodash.get');
import _set = require('lodash.set');

export interface Config extends PluginConfig {
  endpointKey?: string;
  endpointRegion?: string;
}

export class AzureTts implements Plugin {
  config: Config = {
    endpointKey: '',
    endpointRegion: '',
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
    if (!parent.supportsTTS()) {
      throw new JovoError(
        `'${this.name}' can only be used by platforms that support TTS!`,
        ErrorCode.ERR_PLUGIN,
        this.name,
      );
    }
    parent.middleware('$tts')!.use(this.tts.bind(this));
  }

  async tts(jovo: Jovo) {
    await this.applyTTS(jovo, 'tell.speech');
    await this.applyTTS(jovo, 'ask.speech');
    await this.applyTTS(jovo, 'ask.reprompt');
  }

  private async applyTTS(jovo: Jovo, path: string) {
    const text = _get(jovo.$output, path);
    if (!text) {
      return;
    }
  }

  // TODO finish implementing
  private async textToSpeech(ssml: string): Promise<any> {
    const url = `https://${this.config.endpointRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const config: AxiosRequestConfig = {
      url,
      data: ssml,
      method: 'POST',
      headers: {},
      validateStatus: (status: number) => {
        return true;
      },
    };
  }

  private async updateTokenIfNecessary(): Promise<void> {}

  private async updateToken(): Promise<void> {
    const url = `https://${this.config.endpointRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
    const config: AxiosRequestConfig = {
      url,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.endpointKey,
      },
    };
  }
}
