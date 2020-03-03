import * as fs from 'fs';
import { JWT } from 'google-auth-library';
import {
  AxiosRequestConfig,
  ErrorCode,
  Extensible,
  HandleRequest,
  HttpService,
  Jovo,
  JovoError,
  Platform,
  Plugin,
  PluginConfig,
  SpeechBuilder,
} from 'jovo-core';
import { promisify } from 'util';
import { SynthesisRequest, SynthesisResponse } from './Interfaces';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');

const readFile = promisify(fs.readFile);

export interface Config extends PluginConfig {
  credentialsFile?: string;
}

export class GCloudTts implements Plugin {
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

  install(parent: Extensible) {
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

    parent.middleware('setup')!.use(this.setup.bind(this));
    parent.middleware('$tts')!.use(this.tts.bind(this));
  }

  async setup(handleRequest: HandleRequest) {
    const jwtClient = await this.initializeJWT();
    if (jwtClient) {
      await jwtClient.authorize();
      this.jwtClient = jwtClient;
    }
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

  private getAudioTagFromResult(result: SynthesisResponse) {
    return result.audioContent ? new SpeechBuilder().addAudio(result.audioContent).toString() : '';
  }

  private async textToSpeech(ssml: string): Promise<SynthesisResponse> {
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize`;

    const accessTokenObj = await this.jwtClient?.getAccessToken();
    const authToken = accessTokenObj ? accessTokenObj.token : '';

    const reqData: SynthesisRequest = {
      input: { ssml },
      voice: {
        languageCode: 'en-US',
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    };

    const config: AxiosRequestConfig = {
      url,
      data: reqData,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
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
        `Could not retrieve TTS data. status: ${response.status}, data: ${
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
