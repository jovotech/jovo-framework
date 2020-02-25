import { LexRuntime } from 'aws-sdk/clients/all';
import {
  PostContentRequest,
  PostContentResponse,
  PostTextRequest,
  PostTextResponse,
} from 'aws-sdk/clients/lexruntime';
import { AWSError } from 'aws-sdk/lib/error';
import {
  AudioEncoder,
  EnumRequestType,
  ErrorCode,
  Extensible,
  Inputs,
  Jovo,
  JovoError,
  Platform,
  Plugin,
  PluginConfig,
} from 'jovo-core';
import { AmazonCredentials } from './Interfaces';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {
  botAlias?: string;
  botName?: string;
  credentials?: AmazonCredentials;
  defaultIntent?: string;
}

const TARGET_SAMPLE_RATE = 16000;

export class LexSlu implements Plugin {
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
    if (parent.supportsASR()) {
      parent.middleware('$asr')!.use(this.asr.bind(this));
    }
    parent.middleware('$nlu')!.use(this.nlu.bind(this));
    parent.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  async asr(jovo: Jovo) {
    const text = jovo.getRawText();
    const audio = jovo.getAudioData();

    if (audio) {
      const downSampled = AudioEncoder.sampleDown(audio.data, audio.sampleRate, TARGET_SAMPLE_RATE);
      const wavBuffer = AudioEncoder.encodeToWav(downSampled, TARGET_SAMPLE_RATE);

      const result = await this.speechToText(jovo.$user.getId()!, wavBuffer);
      jovo.$asr = {
        text: result.inputTranscript || '',
        [this.name]: result,
      };
    } else if (!text && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No audio or text input.', ErrorCode.ERR_PLUGIN, this.name);
    }
  }

  async nlu(jovo: Jovo) {
    const text = (jovo.$asr && jovo.$asr.text) || jovo.getRawText();

    let response: PostContentResponse | PostTextResponse | null = null;
    if (text) {
      response = await this.naturalLanguageProcessing(jovo.$user.getId()!, text);
    } else if (jovo.$asr && jovo.$asr[this.name] && !jovo.$asr[this.name].error) {
      response = jovo.$asr[this.name] as PostContentResponse;
    } else if (jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No audio or text input to process.', ErrorCode.ERR_PLUGIN, this.name);
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
      [this.name]: response,
    };
  }

  async inputs(jovo: Jovo) {
    if ((!jovo.$nlu || !jovo.$nlu[this.name]) && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError(
        'No nlu data to get inputs off was given.',
        ErrorCode.ERR_PLUGIN,
        this.name,
      );
    } else if (
      jovo.$type.type === EnumRequestType.LAUNCH ||
      jovo.$type.type === EnumRequestType.END
    ) {
      jovo.$inputs = {};
      return;
    }

    const response = jovo.$nlu![this.name] as PostTextResponse;

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
