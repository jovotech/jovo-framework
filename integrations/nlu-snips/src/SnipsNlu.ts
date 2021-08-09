import {
  axios,
  AxiosRequestConfig,
  AxiosResponse,
  DeepPartial,
  Extensible,
  HandleRequest,
  Jovo,
  JovoError,
  NluData,
  NluPlugin,
  PluginConfig,
} from '@jovotech/framework';
import { SnipsNluConfig, SnipsNluResponse } from './interfaces';

export class SnipsNlu extends NluPlugin<SnipsNluConfig> {
  getDefaultConfig(): SnipsNluConfig {
    return {
      serverUrl: 'http://localhost:5000',
      serverPath: '/engine/train',
    };
  }

  async process(handleRequest: HandleRequest, jovo: Jovo): Promise<NluData | undefined> {
    const text: string | undefined = jovo.$request.getRawText();

    if (!text) {
      return;
    }

    try {
      const snipsNluResponse: SnipsNluResponse = await this.sendToSnips(text);
      const nluData: NluData = {};
      if (snipsNluResponse.result.intent.intentName) {
        nluData.intent = { name: snipsNluResponse.result.intent.intentName };
      }

      for (const slot of snipsNluResponse.result.slots) {
        if (!nluData.entities) {
          nluData.entities = {};
        }

        nluData.entities[slot.slotName] = { name: slot.slotName, value: slot.value.value };
      }

      return nluData;
    } catch (error) {
      console.error('Error while retrieving nlu-data from Rasa-server.', e);
      return;
    }
  }

  private async sendToSnips(text: string): Promise<SnipsNluResponse> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      baseURL: this.config.serverUrl,
      url: this.config.serverPath,
      data: { text },
    };
    const response: AxiosResponse<SnipsNluResponse> = await axios(config);
    return response.data;
  }
}
