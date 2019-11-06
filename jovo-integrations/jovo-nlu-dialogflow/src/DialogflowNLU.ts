import { RequestOptions } from 'https';
import {
  EnumRequestType,
  Extensible,
  Inputs,
  Jovo,
  JovoError,
  Plugin,
  PluginConfig,
} from 'jovo-core';
import _merge = require('lodash.merge');
import { HttpService } from './HttpService';
import { DialogflowRequest, DialogflowResponse, DialogflowTextInput } from './Interfaces';

export interface Config extends PluginConfig {
  defaultIntent?: string;
  defaultLocale?: string;
  minConfidence?: number;
  projectId?: string;
  authToken?: string;
}

const HOST = 'dialogflow.googleapis.com';

export class DialogflowNLU implements Plugin {
  config: Config = {
    defaultIntent: 'DefaultFallbackIntent',
    defaultLocale: 'en-US',
    minConfidence: 0,
    projectId: process.env.DIALOGFLOW_PROJECT_ID || '',
    authToken: process.env.DIALOGFLOW_AUTH_TOKEN || '',
  };

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  install(parent: Extensible) {
    parent.middleware('$nlu')!.use(this.nlu.bind(this));
    parent.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  async nlu(jovo: Jovo) {
    const text = jovo.getRawText();
    let response: DialogflowResponse | null = null;

    if (text) {
      // for now every session id will just be random
      const session = `${new Date().getTime()}-${jovo.$user.getId()}`;
      const languageCode =
        (jovo.$request && jovo.$request.getLocale()) || this.config.defaultLocale!;
      response = await this.naturalLanguageProcessing(session, {
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

  private async naturalLanguageProcessing(
    session: string,
    textInput: DialogflowTextInput,
  ): Promise<DialogflowResponse> {
    if (
      !this.config.authToken ||
      this.config.authToken.length === 0 ||
      !this.config.projectId ||
      this.config.projectId.length === 0
    ) {
      throw new JovoError('Invalid auth token or invalid project id.');
    }
    const path = `/v2/projects/${this.config.projectId}/agent/sessions/${session}:detectIntent`;
    const options: RequestOptions = {
      host: HOST,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.authToken}`,
      },
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
        throw new Error(`Could not reach Dialogflow.`);
      }
    } catch (e) {
      throw new JovoError(e);
    }
  }
}
