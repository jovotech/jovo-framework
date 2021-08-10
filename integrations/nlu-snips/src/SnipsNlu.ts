import {
  axios,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  HandleRequest,
  Jovo,
  JovoError,
  NluData,
  NluPlugin,
} from '@jovotech/framework';
import { SnipsNluConfig, SnipsNluResponse } from './interfaces';

export class SnipsNlu extends NluPlugin<SnipsNluConfig> {
  getDefaultConfig(): SnipsNluConfig {
    return {
      serverUrl: 'http://localhost:5000/',
      serverPath: '/engine/parse',
    };
  }

  async process(handleRequest: HandleRequest, jovo: Jovo): Promise<NluData | undefined> {
    const text: string | undefined = jovo.$request.getRawText();

    if (!text) {
      return;
    }

    const snipsNluResponse: SnipsNluResponse = await this.sendToSnips(text);
    const nluData: NluData = {};
    if (snipsNluResponse.intent.intentName) {
      nluData.intent = { name: snipsNluResponse.intent.intentName };
    }

    for (const slot of snipsNluResponse.slots) {
      if (!nluData.entities) {
        nluData.entities = {};
      }

      // TODO: Why is this a map when we do have to provide the name in the object itself?
      nluData.entities[slot.slotName] = { name: slot.slotName, value: slot.value.value };
    }

    return nluData;
  }

  private async sendToSnips(text: string): Promise<SnipsNluResponse> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      baseURL: this.config.serverUrl,
      url: this.config.serverPath + '?locale=en&bot_id=ruben_de',
      data: { text },
    };

    try {
      const response: AxiosResponse<SnipsNluResponse> = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error.isAxiosError) {
        throw new JovoError({
          message: `SnipsNlu returned a server error (${error.response.status})`,
          details: error.response.data.description,
          name: error.response.data.name,
        });
      }
      throw new JovoError({ message: error.message });
    }
  }
}
