import * as fs from 'fs';
import { JWT } from 'google-auth-library';
import {
  AxiosRequestConfig,
  EnumRequestType,
  ErrorCode,
  Extensible,
  HandleRequest,
  HttpService,
  Inputs,
  Jovo,
  JovoError,
  Platform,
  Plugin,
  PluginConfig,
} from 'jovo-core';
import { promisify } from 'util';
import { DialogflowRequest, DialogflowResponse, DialogflowTextInput } from './Interfaces';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');

const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);

const BASE_URL = 'https://dialogflow.googleapis.com';

export interface Config extends PluginConfig {
  defaultIntent?: string;
  defaultLocale?: string;
  minConfidence?: number;
  credentialsFile?: string;
  authToken?: string;
  projectId?: string;
  requireCredentialsFile?: boolean;
}

export class DialogflowNlu extends Extensible implements Plugin {
  config: Config = {
    defaultIntent: 'Default Fallback Intent',
    defaultLocale: 'en-US',
    minConfidence: 0,
    credentialsFile: './credentials.json',
    authToken: '',
    projectId: '',
    requireCredentialsFile: true,
  };

  constructor(config?: Config) {
    super(config);

    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  parentName?: string;
  jwtClient?: JWT;

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

    parent.middleware('setup')!.use(this.setup.bind(this));
    parent.middleware('after.$init')!.use(this.afterInit.bind(this));
    parent.middleware('$nlu')!.use(this.nlu.bind(this));
    parent.middleware('$inputs')!.use(this.inputs.bind(this));

    this.parentName = (parent as Plugin).name || parent.constructor.name;
  }

  async setup(handleRequest: HandleRequest) {
    const jwtClient = await this.initializeJWT();
    if (jwtClient) {
      await jwtClient.authorize();
      this.jwtClient = jwtClient;
    }
  }

  async afterInit(handleRequest: HandleRequest) {
    if (handleRequest.jovo) {
      let authToken = '';
      if (this.jwtClient) {
        const accessTokenObj = await this.jwtClient.getAccessToken();
        if (accessTokenObj.token) {
          authToken = accessTokenObj.token;
        }
      }
      const projectId = this.jwtClient ? this.jwtClient.projectId : '';
      _set(
        handleRequest.jovo.$config,
        `plugin.${this.parentName}.plugin.DialogflowNlu.authToken`,
        authToken,
      );
      _set(
        handleRequest.jovo.$config,
        `plugin.${this.parentName}.plugin.DialogflowNlu.projectId`,
        projectId,
      );
    }
  }

  async nlu(jovo: Jovo) {
    const text = (jovo.$asr && jovo.$asr.text) || jovo.getRawText();
    let response: DialogflowResponse | null = null;

    if (text) {
      // for now every session id will just be random
      const session = `${new Date().getTime()}-${jovo.$user.getId()}`;
      const languageCode =
        (jovo.$request && jovo.$request.getLocale()) || this.config.defaultLocale!;
      response = await this.naturalLanguageProcessing(jovo, session, {
        text,
        languageCode,
      });
    } else if (jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No text input to process.', ErrorCode.ERR_PLUGIN, this.name);
    }

    const minConfidence = this.config.minConfidence || 0;
    let intentName = this.config.defaultIntent || 'DefaultFallbackIntent';
    if (jovo.$type.type === EnumRequestType.LAUNCH) {
      intentName = 'LAUNCH';
    } else if (jovo.$type.type === EnumRequestType.END) {
      intentName = 'END';
    } else if (response && response.queryResult.intentDetectionConfidence >= minConfidence) {
      intentName = response.queryResult.intent.displayName;
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

    const response: DialogflowResponse = jovo.$nlu![this.name];

    const inputs: Inputs = {};
    const parameters = response.queryResult.parameters;
    if (!parameters) {
      return inputs;
    }

    Object.keys(parameters).forEach((entityName: string) => {
      const entityData = parameters[entityName];
      // TODO make sure this is intended
      const value = typeof entityData === 'string' ? entityData : entityData.toString();
      inputs[entityName] = {
        key: value,
        name: entityName,
        value,
      };
    });

    jovo.$inputs = inputs;
  }

  private async initializeJWT(): Promise<JWT | undefined> {
    if (!this.config.credentialsFile) {
      if (this.config.requireCredentialsFile === false) {
        return;
      } else {
        throw new JovoError('Credentials file is mandatory', ErrorCode.ERR_PLUGIN, this.name);
      }
    }

    const fileExists = await exists(this.config.credentialsFile);
    if (!fileExists) {
      if (this.config.requireCredentialsFile === false) {
        return;
      } else {
        throw new JovoError(
          `Credentials file doesn't exist in ${this.config.credentialsFile}`,
          ErrorCode.ERR_PLUGIN,
          this.name,
        );
      }
    }

    const results = await readFile(this.config.credentialsFile);
    const keyFileObject = JSON.parse(results.toString());

    const jwtClient = new JWT(
      keyFileObject.client_email,
      undefined,
      keyFileObject.private_key,
      ['https://www.googleapis.com/auth/dialogflow'],
      undefined,
    );
    jwtClient.projectId = keyFileObject.project_id;

    return jwtClient;
  }

  private async naturalLanguageProcessing(
    jovo: Jovo,
    session: string,
    textInput: DialogflowTextInput,
  ): Promise<DialogflowResponse> {
    const authToken = _get(
      jovo.$config,
      `plugin.${this.parentName}.plugin.DialogflowNlu.authToken`,
      '',
    );
    const projectId = _get(
      jovo.$config,
      `plugin.${this.parentName}.plugin.DialogflowNlu.projectId`,
      '',
    );

    const hasAuthToken = authToken && authToken.length > 0;
    const hasProjectId = projectId && projectId.length > 0;

    if (!hasAuthToken || !hasProjectId) {
      let reasons = '';
      if (!hasProjectId) {
        reasons += '\nNo valid project-id was given.';
      }
      if (!hasAuthToken) {
        reasons += '\nNo authentication-token was provided.';
      }

      throw new JovoError(
        `Can not access Dialogflow-API, because: ${reasons}`,
        ErrorCode.ERR_PLUGIN,
        this.name,
      );
    }

    const path = `/v2/projects/${projectId}/agent/sessions/${session}:detectIntent`;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    };

    const data: DialogflowRequest = {
      queryInput: {
        text: textInput,
      },
    };

    const config: AxiosRequestConfig = {
      baseURL: BASE_URL,
      url: path,
      data,
      method: 'POST',
      headers,
      validateStatus: (status: number) => {
        return true;
      },
    };

    try {
      const response = await HttpService.request<DialogflowResponse>(config);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new Error(
        `Could not retrieve NLU data. status: ${response.status}, data: ${
          response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'
        }`,
      );
    } catch (e) {
      throw new JovoError(e, ErrorCode.ERR_PLUGIN, this.name);
    }
  }
}
