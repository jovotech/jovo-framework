import {
  AxiosRequestConfig,
  ErrorCode,
  Extensible,
  HttpService,
  Jovo,
  JovoError,
  Platform,
  Plugin,
  PluginConfig,
  SpeechBuilder,
} from 'jovo-core';
import _merge = require('lodash.merge');
import _get = require('lodash.get');
import _set = require('lodash.set');

export interface Config extends PluginConfig {
  endpointKey: string;
  endpointRegion: string;
  locale?: string;
}

const TOKEN_EXPIRES_AFTER_IN_MINUTES = 9;

export class AzureTts implements Plugin {
  config: Config = {
    endpointKey: '',
    endpointRegion: '',
    locale: 'en-US',
  };

  currentToken?: { value: string; expiresAt: Date };

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

    let output = '';

    if (text.includes('<audio')) {
      const results = [];
      const splitParts = text.trim().split(/(<\s*audio[^>]*>(.*?)<\s*[/]\s*audio>)/);
      const parts: string[] = [];
      splitParts.forEach((splitPart: string) => {
        if (splitPart.length > 0) {
          parts.push(splitPart);
        }
      });

      for (const part of parts) {
        if (part.startsWith('<audio')) {
          results.push(part);
        } else {
          const result = await this.textToSpeech(SpeechBuilder.toSSML(part));
          results.push(this.getAudioTagFromResult(result));
        }
      }
      results.forEach((result: string) => {
        output += result;
      });
    } else {
      const result = await this.textToSpeech(SpeechBuilder.toSSML(text));
      output = this.getAudioTagFromResult(result);
    }
    output = SpeechBuilder.toSSML(output);
    _set(jovo.$output, path, output);
    _set(jovo.$output, path + 'Text', SpeechBuilder.removeSSML(text));
  }

  private getAudioTagFromResult(buffer?: Buffer): string {
    return buffer ? new SpeechBuilder().addAudio(buffer.toString('base64')).toString() : '';
  }

  private async textToSpeech(ssml: string): Promise<Buffer> {
    await this.updateTokenIfNecessary();

    const ssmlContent = SpeechBuilder.removeSpeakTags(ssml);
    ssml = `<speak version="1.0" xml:lang="${this.config.locale}"><voice xml:lang="${this.config.locale}" xml:gender="Female" name="en-US-JessaRUS">${ssmlContent}</voice></speak>`;

    const url = `https://${this.config.endpointRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const config: AxiosRequestConfig = {
      url,
      data: ssml,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.currentToken ? this.currentToken.value : ''}`,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
      responseType: 'arraybuffer',
      validateStatus: (status: number) => {
        return true;
      },
    };

    try {
      const response = await HttpService.request(config);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new Error(
        `Could not retrieve TTS data. status: ${response.status}, data: ${
          response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'
        }`,
      );
    } catch (e) {
      throw new JovoError(e, ErrorCode.ERR_PLUGIN, this.name);
    }
  }

  private async updateTokenIfNecessary(): Promise<void> {
    if (this.isTokenExpired()) {
      const token = await this.updateToken();
      this.currentToken = {
        value: token,
        expiresAt: new Date(Date.now() + TOKEN_EXPIRES_AFTER_IN_MINUTES * 60000),
      };
    }
  }

  private isTokenExpired(): boolean {
    return this.currentToken ? Date.now() > this.currentToken.expiresAt.getTime() : true;
  }

  private async updateToken(): Promise<string> {
    const url = `https://${this.config.endpointRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
    const config: AxiosRequestConfig = {
      url,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.endpointKey,
      },
      validateStatus: (status: number) => {
        return true;
      },
    };

    try {
      const response = await HttpService.request(config);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new Error(
        `Could not retrieve token. status: ${response.status}, data: ${
          response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'
        }`,
      );
    } catch (e) {
      throw new JovoError(e, ErrorCode.ERR_PLUGIN, this.name);
    }
  }
}
