import { EnumRequestType, Inputs, Jovo, JovoError, Plugin } from 'jovo-core';
import { DialogflowRequest, DialogflowResponse, DialogflowTextInput } from '../Interfaces';
import { RequestOptions } from 'https';
import { HttpService } from '../HttpService';
import { Config, DialogflowNlu } from '..';

const HOST = 'dialogflow.googleapis.com';

export class DialogflowNluCore implements Plugin {
  config: Config = {
    enabled: true,
    defaultLocale: '',
    minConfidence: 0,
    defaultIntent: 'DefaultFallbackIntent',
    authToken: '',
    apiKey: '',
    projectId: '',
  };

  install(parent: DialogflowNlu): void {
    this.config = { ...parent.config };

    parent.middleware('$init')!.use(this.init.bind(this));
    parent.middleware('$nlu')!.use(this.nlu.bind(this));
    parent.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  async init(jovo: Jovo) {
    jovo.$data.DialogflowNlu = {
      apiKey: this.config.apiKey,
      authToken: this.config.authToken,
      projectId: this.config.projectId,
    };
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
    if (jovo.$type.type === EnumRequestType.LAUNCH || jovo.$type.type === EnumRequestType.END) {
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
    jovo: Jovo,
    session: string,
    textInput: DialogflowTextInput,
  ): Promise<DialogflowResponse> {
    const { authToken, apiKey, projectId } = jovo.$data.DialogflowNlu;
    const hasAuthToken = authToken && authToken.length > 0;
    const hasApiKey = apiKey && apiKey.length > 0;
    const hasProjectId = projectId && projectId.length > 0;
    const hasAuth = hasAuthToken || hasApiKey;

    if (!hasAuth || !hasProjectId) {
      let reasons = '';
      if (!hasProjectId) {
        reasons += '\nNo valid project-id was given.';
      }
      if (!hasAuth) {
        reasons += '\nNo authentication-data was given.';
      }

      throw new JovoError(`Can not access Dialogflow-API, because: ${reasons}`);
    }

    let path = `/v2/projects/${projectId}/agent/sessions/${session}:detectIntent`;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (hasApiKey && !hasAuthToken) {
      path += `?key=${apiKey}`;
    } else if (hasAuthToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

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
        throw new Error(`Could not reach Dialogflow!`);
      }
    } catch (e) {
      throw new JovoError(e);
    }
  }
}
