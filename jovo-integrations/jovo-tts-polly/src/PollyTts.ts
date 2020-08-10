import { Polly } from 'aws-sdk/clients/all';
import {
  LanguageCode,
  OutputFormat,
  SpeechMarkTypeList,
  SynthesizeSpeechInput,
  SynthesizeSpeechOutput,
  VoiceId,
} from 'aws-sdk/clients/polly';
import { AWSError } from 'aws-sdk/lib/error';
import {
  ErrorCode,
  Extensible,
  Jovo,
  JovoError,
  Plugin,
  PluginConfig,
  SpeechBuilder,
} from 'jovo-core';
import './';
import { AmazonCredentials } from './Interfaces';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');

export interface Config extends PluginConfig {
  credentials?: Partial<AmazonCredentials>;
  lexiconNames?: string[];
  outputFormat?: OutputFormat;
  sampleRate?: number;
  speechMarkTypes?: SpeechMarkTypeList;
  voiceId?: VoiceId;
  languageCode?: LanguageCode;
}

export class PollyTts implements Plugin {
  config: Config = {
    credentials: {
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    languageCode: undefined,
    lexiconNames: undefined,
    outputFormat: 'mp3',
    sampleRate: 16000,
    speechMarkTypes: undefined,
    voiceId: 'Matthew',
  };

  private $polly!: Polly;

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  get name() {
    return this.constructor.name;
  }

  install(parent: Extensible): void {
    this.validateConfig();
    this.$polly = new Polly({
      credentials: this.config.credentials as AmazonCredentials,
      region: this.config.credentials!.region,
    });

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
          const pollyResult = await this.textToSpeech(SpeechBuilder.toSSML(part));
          if (pollyResult) {
            results.push(this.getAudioTagFromPollyResult(pollyResult));
          }
        }
      }
      results.forEach((result: string) => {
        output += result;
      });
    } else {
      const pollyResult = await this.textToSpeech(SpeechBuilder.toSSML(text));
      if (pollyResult) {
        output = this.getAudioTagFromPollyResult(pollyResult);
      }
    }
    output = SpeechBuilder.toSSML(output);
    _set(jovo.$output, path, output);
    _set(jovo.$output, path + 'Text', SpeechBuilder.removeSSML(text));
  }

  private getAudioTagFromPollyResult(pollyResult: SynthesizeSpeechOutput): string {
    if (pollyResult.AudioStream) {
      const value = pollyResult.AudioStream.toString('base64');
      return new SpeechBuilder().addAudio(value).toString();
    }
    return '';
  }

  private textToSpeech(ssml: string): Promise<SynthesizeSpeechOutput> {
    return new Promise((resolve, reject) => {
      const params: SynthesizeSpeechInput = {
        LexiconNames: this.config.lexiconNames || [],
        OutputFormat: this.config.outputFormat || 'mp3',
        SampleRate: String(this.config.sampleRate) || '16000',
        SpeechMarkTypes: this.config.speechMarkTypes || [],
        Text: ssml,
        TextType: 'ssml',
        VoiceId: this.config.voiceId || 'Matthew',
      };

      if (this.config.languageCode) {
        params.LanguageCode = this.config.languageCode;
      }

      this.$polly.synthesizeSpeech(params, (err: AWSError, data: SynthesizeSpeechOutput) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  private validateConfig() {
    if (
      !this.config.credentials?.region ||
      !this.config.credentials?.accessKeyId ||
      !this.config.credentials?.secretAccessKey
    ) {
      throw new JovoError(
        `Invalid configuration!`,
        ErrorCode.ERR_PLUGIN,
        this.name,
        `Current configuration: ${JSON.stringify(this.config, undefined, 2)}`,
        `Make sure 'credentials.region', 'credentials.accessKeyId' and 'credentials.secretAccessKey' are set and valid.`,
      );
    }
  }
}
