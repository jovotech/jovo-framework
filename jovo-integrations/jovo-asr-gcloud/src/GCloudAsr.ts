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
import { auth, JWT } from 'google-auth-library';
import { promisify } from 'util';
import * as fs from 'fs';
import _merge = require('lodash.merge');
import { RecognitionRequest, RecognitionResult } from './Interfaces';

const readFile = promisify(fs.readFile);

export interface Config extends PluginConfig {
  credentialsFile?: string;
}

const TARGET_SAMPLE_RATE = 16000;

export class GCloudAsr implements Plugin {
  config: Config = {
    credentialsFile: './credentials.json',
  };

  jwtClient?: JWT;

  constructor(config?: Config) {
    this.config = _merge(this.config, config);
  }

  get name(): string {
    return this.constructor.name;
  }

  async install(parent: Extensible) {
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

    const jwtClient = await this.initializeJWT();
    if (jwtClient) {
      await jwtClient.authorize();
      this.jwtClient = jwtClient;
    }
  }

  async asr(jovo: Jovo) {
    const text = jovo.getRawText();

    type AudioData = { data?: Float32Array | string; sampleRate?: number };
    const audio: AudioData | undefined = (jovo.$request as any).audio; // tslint:disable-line:no-any
    const isValidAudio = audio && audio.data instanceof Float32Array && audio.sampleRate;

    if (isValidAudio) {
      const downSampled = AudioEncoder.sampleDown(
        audio!.data as Float32Array,
        audio!.sampleRate!,
        TARGET_SAMPLE_RATE,
      );
      const wavBuffer = AudioEncoder.encodeToWav(downSampled, TARGET_SAMPLE_RATE);

      const result = await this.speechToText(wavBuffer);

      jovo.$asr = {
        text: result.alternatives[0].transcript,
        [this.name]: result,
      };
    } else if (!text && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No audio input.', ErrorCode.ERR_PLUGIN, this.name);
    }
  }

  private async speechToText(speech: Buffer): Promise<RecognitionResult> {
    const url = `https://speech.googleapis.com/v1/speech:recognize`;

    const accessTokenObj = await this.jwtClient?.getAccessToken();
    const authToken = accessTokenObj ? accessTokenObj.token : '';

    const reqData: RecognitionRequest = {
      config: {
        languageCode: 'en-US',
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
      const response = await HttpService.request(config);
      console.log({ response });
      if (response.status === 200 && response.data) {
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
