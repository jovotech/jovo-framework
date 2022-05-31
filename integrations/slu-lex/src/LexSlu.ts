import {
  Interpretation,
  LexRuntimeV2Client,
  RecognizeTextCommand,
  RecognizeTextCommandInput,
  RecognizeUtteranceCommand,
  RecognizeUtteranceCommandInput,
} from '@aws-sdk/client-lex-runtime-v2';
import type { Credentials } from '@aws-sdk/types';
import {
  AsrData,
  DeepPartial,
  EntityMap,
  InterpretationPluginConfig,
  Jovo,
  NluData,
  ParsedAudioInput,
  RequiredOnlyWhere,
  SluPlugin,
} from '@jovotech/framework';
import { gunzip, InputType as GunzipBuffer } from 'zlib';

function asyncGunzip(buffer: GunzipBuffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    gunzip(buffer, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

export interface LexSluConfig extends InterpretationPluginConfig {
  bot: {
    id: string;
    aliasId: string;
  };
  credentials: Credentials;
  region: string;
  locale?: string;
  localeMap?: Record<string, string>;
  fallbackLocale: string;
  asr: boolean;
  nlu: boolean;
}

export type LexSluInitConfig = DeepPartial<LexSluConfig> &
  Pick<LexSluConfig, 'bot' | 'credentials' | 'region'>;

export class LexSlu extends SluPlugin<LexSluConfig> {
  targetSampleRate = 16000;

  readonly supportedLocaleIds = [
    'ca_ES',
    'de_AT',
    'de_DE',
    'en_AU',
    'en_GB',
    'en_IN',
    'en_US',
    'en_ZA',
    'es_419',
    'es_ES',
    'es_US',
    'fr_CA',
    'fr_FR',
    'it_IT',
    'ja_JP',
    'ko_KR',
    'pt_BR',
    'pt_PT',
    'zh_CN',
  ];
  readonly client: LexRuntimeV2Client;

  constructor(config: LexSluInitConfig) {
    super(config);

    this.client = new LexRuntimeV2Client({
      credentials: this.config.credentials,
      region: this.config.region,
    });
  }

  getDefaultConfig(): LexSluConfig {
    return {
      ...super.getDefaultConfig(),
      bot: { id: '', aliasId: '' },
      region: '',
      credentials: {
        accessKeyId: '',
        secretAccessKey: '',
      },
      fallbackLocale: 'en_US',
      asr: true,
      nlu: true,
    };
  }

  getInitConfig(): RequiredOnlyWhere<LexSluConfig, 'credentials' | 'region' | 'bot'> {
    return {
      bot: { id: '', aliasId: '' },
      region: '',
      credentials: {
        accessKeyId: '',
        secretAccessKey: '',
      },
    };
  }

  async processAudio(jovo: Jovo, audio: ParsedAudioInput): Promise<AsrData | undefined> {
    if (!this.config.asr || !jovo.$session.id) {
      return;
    }
    const params: RecognizeUtteranceCommandInput = {
      botId: this.config.bot.id,
      botAliasId: this.config.bot.aliasId,
      requestContentType: `audio/x-l16; sample-rate=${audio.sampleRate}; channel-count=1`,
      inputStream: audio.toWav(),
      localeId: this.getLocale(jovo),
      sessionId: jovo.$session.id,
    };

    const command = new RecognizeUtteranceCommand(params);
    const response = await this.client.send(command);
    if (!response.inputTranscript) {
      return;
    }
    // The return inputTranscript ist a gzipped string that is encoded with base64
    // base64 -> gzip
    const transcriptBuffer = Buffer.from(response.inputTranscript, 'base64');
    // gzip -> string
    const textBuffer = await asyncGunzip(transcriptBuffer);
    // The string of textBuffer will always contain double quotes, therefore we can parse it with JSON to get rid of it.
    const parsedText = JSON.parse(textBuffer.toString());
    return {
      text: parsedText,
    };
  }

  async processText(jovo: Jovo, text: string): Promise<NluData | undefined> {
    if (!this.config.nlu || !jovo.$session.id) {
      return;
    }
    const params: RecognizeTextCommandInput = {
      botId: this.config.bot.id,
      botAliasId: this.config.bot.aliasId,
      text,
      localeId: this.getLocale(jovo),
      sessionId: jovo.$session.id,
    };
    const command = new RecognizeTextCommand(params);
    const response = await this.client.send(command);
    if (!response.interpretations) {
      return;
    }
    // Assuming the interpretations will be sorted by confidence,
    return this.getNluDataFromInterpretation(response.interpretations[0]);
  }

  private getNluDataFromInterpretation(interpretation: Interpretation): NluData | undefined {
    if (!interpretation.intent) {
      return;
    }

    const nluData: NluData = {
      intent: interpretation.intent.name,
    };
    if (interpretation.intent.slots) {
      nluData.entities = Object.entries(interpretation.intent.slots).reduce(
        (entities: EntityMap, [name, slot]) => {
          if (!slot.value) {
            return entities;
          }
          const resolved = slot.value.resolvedValues?.[0] || slot.value.interpretedValue;
          entities[name] = {
            id: resolved,
            resolved,
            value: slot.value.originalValue || slot.value.interpretedValue,
            native: slot,
          };
          return entities;
        },
        {},
      );
    }
    return nluData;
  }

  private getLocale(jovo: Jovo): string {
    const locale = this.config.locale || jovo.$request.getLocale() || '';
    return this.supportedLocaleIds.includes(locale)
      ? locale
      : this.config?.localeMap?.[locale] || this.config.fallbackLocale;
  }
}
