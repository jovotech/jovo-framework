import {
  PollyClient,
  PollyClientConfig,
  SynthesizeSpeechCommand,
  SynthesizeSpeechCommandInput,
} from '@aws-sdk/client-polly';

import { Readable } from 'stream';

import {
  TtsPluginConfig,
  TtsPlugin,
  Jovo,
  AudioUtilities,
  TtsTextType,
  TtsData,
} from '@jovotech/framework';

export interface PollyTtsConfig extends TtsPluginConfig {
  lexiconNames?: string[];
  voiceId: string;
  sampleRate: string;
  languageCode?: string;
  speechMarkTypes?: string[];
  engine: string;
  libraryConfig?: PollyClientConfig; // @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/pollyclientconfig.html
}

export type PollyTtsInitConfig = PollyTtsConfig;

export class PollyTts extends TtsPlugin<PollyTtsConfig> {
  readonly client: PollyClient;
  supportedSsmlTags: string[] = [
    'break',
    'emphasis',
    'lang',
    'mark',
    'p',
    'phoneme',
    'prosody',
    's',
    'say-as',
    'speak',
    'sub',
    'w',
    'amazon:breath',
    'amazon:domain',
    'amazon:effect',
  ];

  constructor(config: PollyTtsInitConfig) {
    super(config);

    this.client = new PollyClient({
      ...this.config.libraryConfig
    });
  }

  getDefaultConfig(): PollyTtsConfig {
    return {
      outputFormat: 'mp3',
      voiceId: 'Matthew',
      sampleRate: '16000',
      engine: 'standard',
      fallbackLocale: 'en-US',
    };
  }

  getKeyPrefix(): string | undefined {
    return `polly-${this.config.voiceId.toLowerCase()}`;
  }

  async processTts(jovo: Jovo, text: string, textType: TtsTextType): Promise<TtsData | undefined> {
    const params: SynthesizeSpeechCommandInput = {
      Text: text,
      TextType: textType,
      OutputFormat: this.config.outputFormat,
      VoiceId: this.config.voiceId,
      SampleRate: this.config.sampleRate,
      LanguageCode: this.config.languageCode,
      SpeechMarkTypes: this.config.speechMarkTypes,
      Engine: this.config.engine,
      LexiconNames: this.config.lexiconNames,
    };

    const command = new SynthesizeSpeechCommand(params);

    try {
      const response = await this.client.send(command);
      if (!response.AudioStream) {
        return;
      }

      const result: TtsData = {
        contentType: response.ContentType,
        text,
        fileExtension: this.config.outputFormat,
        encodedAudio: await AudioUtilities.getBase64Audio(response.AudioStream as Readable),
      };
      return result;
    } catch (error) {
      console.log((error as Error).message);
    }
    return;
  }
}
