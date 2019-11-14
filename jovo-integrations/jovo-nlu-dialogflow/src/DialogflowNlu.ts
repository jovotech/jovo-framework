import {
  BaseApp,
  EnumRequestType,
  Extensible,
  HandleRequest,
  Inputs,
  Jovo,
  JovoError,
  Plugin,
  PluginConfig,
} from 'jovo-core';
import { DialogflowRequest, DialogflowResponse, DialogflowTextInput } from './Interfaces';
import { RequestOptions } from 'https';
import { HttpService } from './HttpService';
import * as fs from 'fs';
import * as util from 'util';
import { JWT } from 'google-auth-library';
import _merge = require('lodash.merge');
import _get = require('lodash.get');
import _set = require('lodash.set');

const readFile = util.promisify(fs.readFile);
const exists = util.promisify(fs.exists);

const HOST = 'dialogflow.googleapis.com';

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

  async install(parent: Extensible) {
    if (parent instanceof BaseApp) {
      throw new JovoError(`'DialogflowNlu' has to be an immediate plugin of a platform!`);
    }
    parent.middleware('after.$init')!.use(this.afterInit.bind(this));
    parent.middleware('$nlu')!.use(this.nlu.bind(this));
    parent.middleware('$inputs')!.use(this.inputs.bind(this));

    // tslint:disable-next-line
    this.parentName = (parent as any).name || parent.constructor.name;

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
      _set(handleRequest.jovo.$config, `plugin[${this.parentName}].DialogflowNlu`, {
        authToken,
        projectId,
      });
    }
  }

  async nlu(jovo: Jovo) {
    const text = jovo.getRawText();
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
      throw new JovoError('No text input to process.');
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
      Dialogflow: response,
    };
  }

  async inputs(jovo: Jovo) {
    if ((!jovo.$nlu || !jovo.$nlu.Dialogflow) && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No nlu data to get inputs off was given.');
    } else if (
      jovo.$type.type === EnumRequestType.LAUNCH ||
      jovo.$type.type === EnumRequestType.END
    ) {
      jovo.$inputs = {};
      return;
    }

    const response: DialogflowResponse = jovo.$nlu!.Dialogflow;

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
        throw new Error('Credentials file is mandatory');
      }
    }

    const fileExists = await exists(this.config.credentialsFile);
    if (!fileExists) {
      if (this.config.requireCredentialsFile === false) {
        return;
      } else {
        throw new Error(`Credentials file doesn't exist in ${this.config.credentialsFile}`);
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
    const { authToken, projectId } = _get(
      jovo.$config,
      `plugin[${this.parentName}].DialogflowNlu`,
      { authToken: '', projectId: '' },
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

      throw new JovoError(`Can not access Dialogflow-API, because: ${reasons}`);
    }

    const path = `/v2/projects/${projectId}/agent/sessions/${session}:detectIntent`;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    };

    const options: RequestOptions = {
      host: HOST,
      path,
      method: 'POST',
      headers,
    };
    const data: DialogflowRequest = {
      queryInput: {
        text: textInput,
      },
    };
    const stringData = JSON.stringify(data);
    try {
      const response = await HttpService.makeRequest<DialogflowResponse>(
        options,
        Buffer.from(stringData),
      );

      if (response.status === 200 && response.data && response.data.responseId) {
        return response.data;
      } else {
        throw new Error(
          `Could not reach Dialogflow. status: ${response.status}, data: ${
            response.data ? JSON.stringify(response.data, undefined, 2) : 'undefined'
          }`,
        );
      }
    } catch (e) {
      throw new JovoError(e);
    }
  }
}
