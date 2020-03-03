import * as fs from 'fs';
import { JWT } from 'google-auth-library';
import {
  AudioEncoder,
  AxiosRequestConfig,
  EnumRequestType,
  ErrorCode,
  Extensible,
  HandleRequest,
  HttpService,
  Jovo,
  JovoError,
  Platform,
  Plugin,
  PluginConfig,
} from 'jovo-core';
import { promisify } from 'util';
import { RecognitionRequest, RecognitionResponse } from './Interfaces';
import _merge = require('lodash.merge');

const readFile = promisify(fs.readFile);

export interface Config extends PluginConfig {
  credentialsFile?: string;
  locale?: string;
}

const TARGET_SAMPLE_RATE = 16000;

export class GCloudAsr implements Plugin {
  config: Config = {
    credentialsFile: './credentials.json',
    locale: 'en-US',
  };

  jwtClient?: JWT;

  constructor(config?: Config) {
    this.config = _merge(this.config, config);
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

    parent.middleware('setup')!.use(this.setup.bind(this));
    parent.middleware('$asr')!.use(this.asr.bind(this));
  }

  async setup(handleRequest: HandleRequest) {
    const jwtClient = await this.initializeJWT();
    if (jwtClient) {
      await jwtClient.authorize();
      this.jwtClient = jwtClient;
    }
  }

  async asr(jovo: Jovo) {
    const text = jovo.getRawText();
    const audio = jovo.getAudioData();

    if (audio) {
      const downSampled = AudioEncoder.sampleDown(audio.data, audio.sampleRate, TARGET_SAMPLE_RATE);
      const wavBuffer = AudioEncoder.encodeToWav(downSampled, TARGET_SAMPLE_RATE);

      const locale = jovo.$request!.getLocale() || this.config.locale!;
      const result = await this.speechToText(wavBuffer, locale);

      jovo.$asr = {
        text: result.results[0].alternatives[0].transcript,
        [this.name]: result,
      };
    } else if (!text && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No audio input.', ErrorCode.ERR_PLUGIN, this.name);
    }
  }

  private async speechToText(speech: Buffer, locale: string): Promise<RecognitionResponse> {
    const url = `https://speech.googleapis.com/v1/speech:recognize`;

    const accessTokenObj = await this.jwtClient?.getAccessToken();
    const authToken = accessTokenObj ? accessTokenObj.token : '';

    const reqData: RecognitionRequest = {
      config: {
        languageCode: locale,
      },
      audio: {
        content: speech.toString('base64'),
      },
    };

    const config: AxiosRequestConfig = {
      url,
      data: reqData,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    try {
      const response = await HttpService.request<RecognitionResponse>(config);
      if (response.status === 200 && response.data) {
        if (
          response.data.results.length === 0 ||
          (response.data.results.length > 0 && response.data.results[0].alternatives.length === 0)
        ) {
          throw new Error('ASR not successful. No text could be extracted.');
        }
        return response.data;
      }
      throw new Error(
        `Could not retrieve ASR data. status: ${response.status}, data: ${
          response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'
        }`,
      );
    } catch (e) {
      throw new JovoError(e, ErrorCode.ERR_PLUGIN, this.name);
    }
  }

  private async initializeJWT(): Promise<JWT> {
    if (!this.config.credentialsFile) {
      throw new JovoError('Credentials file is mandatory', ErrorCode.ERR_PLUGIN, this.name);
    }

    try {
      const keyData = await readFile(this.config.credentialsFile);
      const keyFileObject = JSON.parse(keyData.toString());

      const jwtClient = new JWT(keyFileObject.client_email, undefined, keyFileObject.private_key, [
        'https://www.googleapis.com/auth/cloud-platform',
      ]);
      jwtClient.projectId = keyFileObject.project_id;
      return jwtClient;
    } catch (e) {
      throw new JovoError(
        `Credentials file doesn't exist in ${this.config.credentialsFile}`,
        ErrorCode.ERR_PLUGIN,
        this.name,
      );
    }
  }
}
