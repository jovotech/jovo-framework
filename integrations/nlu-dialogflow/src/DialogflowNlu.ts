import { Jovo, NluData, NluPlugin, NluPluginConfig } from '@jovotech/framework';
import { DeepPartial, JovoError } from '@jovotech/common';

import { JWT, JWTInput } from 'google-auth-library';
import { DIALOGFLOW_API_BASE_URL } from './constants';
import { DetectIntentRequest, DetectIntentResponse, TextInput } from './interfaces';

export interface DialogflowNluConfig extends NluPluginConfig {
  serviceAccount: JWTInput;
  defaultLocale: string;
}

export type DialogflowNluInitConfig = DeepPartial<DialogflowNluConfig> &
  Pick<DialogflowNluConfig, 'serviceAccount'>;

export class DialogflowNlu extends NluPlugin<DialogflowNluConfig> {
  jwtClient?: JWT;

  constructor(config: DialogflowNluInitConfig) {
    super(config);
  }

  get projectId(): string | undefined {
    return this.config.serviceAccount.project_id;
  }

  getDefaultConfig(): DialogflowNluConfig {
    return {
      ...super.getDefaultConfig(),
      serviceAccount: {},
      defaultLocale: 'en-US',
    };
  }

  async process(jovo: Jovo, text: string): Promise<NluData | undefined> {
    if (!jovo.$session.id) {
      throw new JovoError({
        message: `Can not send request to Dialogflow. Session-ID is missing.`,
      });
    }

    try {
      const dialogflowResponse = await this.sendTextToDialogflow(
        {
          text,
          languageCode: jovo.$request.getLocale() || this.config.defaultLocale,
        },
        jovo.$session.id,
      );
      return dialogflowResponse?.data?.queryResult?.intent?.displayName
        ? { intent: { name: dialogflowResponse.data.queryResult.intent.displayName } }
        : undefined;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error while retrieving nlu-data from Dialogflow.', e);
      return;
    }
  }

  private async sendTextToDialogflow(textInput: TextInput, sessionId: string) {
    this.jwtClient = new JWT({
      email: this.config.serviceAccount.client_email,
      key: this.config.serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/dialogflow'],
    });

    if (!this.projectId) {
      throw new JovoError({
        message: `Can not send request to Dialogflow. Project-ID is missing.`,
      });
    }

    const path = `/v2/projects/${this.projectId}/agent/sessions/${sessionId}:detectIntent`;
    const data: DetectIntentRequest = {
      queryInput: {
        text: textInput,
      },
    };
    return this.jwtClient.request<DetectIntentResponse>({
      url: `${DIALOGFLOW_API_BASE_URL}${path}`,
      method: 'POST',
      data,
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
