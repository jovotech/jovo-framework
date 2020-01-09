import {
  EnumRequestType,
  Extensible,
  Inputs,
  Jovo,
  JovoError,
  Plugin,
  PluginConfig,
} from 'jovo-core';
import { AmazonCredentials } from './Interfaces';
import { LexRuntime } from 'aws-sdk/clients/all';
import {
  PostContentRequest,
  PostContentResponse,
  PostTextRequest,
  PostTextResponse,
} from 'aws-sdk/clients/lexruntime';
import { AWSError } from 'aws-sdk/lib/error';
import { AudioEncoder } from './AudioEncoder';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  botAlias?: string;
  botName?: string;
  credentials?: AmazonCredentials;
  defaultIntent?: string;
}

export class AmazonLexSLU implements Plugin {
  config: Config = {
    botAlias: process.env.LEX_BOT_ALIAS || '',
    botName: process.env.LEX_BOT_NAME || '',
    credentials: {
      region: process.env.AMAZON_REGION || 'us-east-1',
      accessKeyId: process.env.AMAZON_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY || '',
    },
    defaultIntent: 'DefaultFallbackIntent',
  };

  private $lex: LexRuntime;

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
    this.$lex = new LexRuntime({
      credentials: this.config.credentials,
      region: this.config.credentials!.region,
    });
  }

  install(parent: Extensible) {
    parent.middleware('$asr')!.use(this.asr.bind(this));
    parent.middleware('$nlu')!.use(this.nlu.bind(this));
    parent.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  async asr(jovo: Jovo) {
    const text = jovo.getRawText();
    // tslint:disable-next-line
    const audio: { data: any; sampleRate: number } = (jovo.$request as any).audio;

    if (audio && audio.data && audio.data instanceof Float32Array && audio.sampleRate) {
      const targetSampleRate = 16000;
      const downSampled = AudioEncoder.sampleDown(audio.data, audio.sampleRate, targetSampleRate);
      const wavBuffer = AudioEncoder.encodeToWav(downSampled, targetSampleRate);

      const result = await this.speechToText(jovo.$user.getId()!, wavBuffer);
      jovo.$asr = {
        text: result.inputTranscript || '',
        AmazonLex: result,
      };
    } else if (!text && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No audio or text input.');
    }
  }

  async nlu(jovo: Jovo) {
    const text = (jovo.$asr && jovo.$asr.text) ?? jovo.getRawText();

    let response: PostContentResponse | PostTextResponse | null = null;
    if (text) {
      response = await this.naturalLanguageProcessing(jovo.$user.getId()!, text);
    } else if (jovo.$asr && jovo.$asr.AmazonLex && !jovo.$asr.AmazonLex.error) {
      response = jovo.$asr.AmazonLex as PostContentResponse;
    } else if (jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No audio or text input to process.');
    }

    let intentName = 'DefaultFallbackIntent';
    if (jovo.$type.type === EnumRequestType.LAUNCH) {
      intentName = 'LAUNCH';
    } else if (jovo.$type.type === EnumRequestType.END) {
      intentName = 'END';
    } else if (response && response.intentName && response.dialogState) {
      intentName = response.intentName;
    }

    jovo.$nlu = {
      intent: {
        name: intentName,
      },
      AmazonLex: response,
    };
  }

  async inputs(jovo: Jovo) {
    if ((!jovo.$nlu || !jovo.$nlu.AmazonLex) && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No nlu data to get inputs off was given.');
    } else if (
      jovo.$type.type === EnumRequestType.LAUNCH ||
      jovo.$type.type === EnumRequestType.END
    ) {
      jovo.$inputs = {};
      return;
    }

    const response = jovo.$nlu!.AmazonLex as PostTextResponse;

    const inputs: Inputs = {};
    const slots = response.slots;
    if (!slots) {
      return inputs;
    }

    Object.keys(slots).forEach((slot: string) => {
      inputs[slot] = {
        key: slots[slot],
        name: slot,
        value: slots[slot],
      };
    });

    jovo.$inputs = inputs;
  }

  private speechToText(userId: string, speech: Buffer): Promise<PostContentResponse> {
    return new Promise((resolve, reject) => {
      const params: PostContentRequest = {
        botAlias: this.config.botAlias || '',
        botName: this.config.botName || '',
        contentType: 'audio/x-l16; sample-rate=16000; channel-count=1',
        inputStream: speech,
        userId,
        accept: 'text/plain; charset=utf-8',
      };

      this.$lex.postContent(params, (err: AWSError, data: PostContentResponse) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  private naturalLanguageProcessing(userId: string, text: string): Promise<PostTextResponse> {
    return new Promise((resolve, reject) => {
      const params: PostTextRequest = {
        botAlias: this.config.botAlias || '',
        botName: this.config.botName || '',
        userId,
        inputText: text,
      };

      this.$lex.postText(params, (err: AWSError, data: PostTextResponse) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }
}
