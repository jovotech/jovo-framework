import {
  axios,
  AxiosRequestConfig,
  AxiosResponse,
  DeepPartial,
  Jovo,
  NluData,
  NluPlugin,
  NluPluginConfig,
} from '@jovotech/framework';
import { RasaResponse } from './interfaces';

export interface RasaNluConfig extends NluPluginConfig {
  serverUrl: string;
  serverPath: string;
}

export type RasaNluInitConfig = DeepPartial<RasaNluConfig>;

export class RasaNlu extends NluPlugin<RasaNluConfig> {
  // TODO fully determine default config
  getDefaultConfig(): RasaNluConfig {
    return {
      ...super.getDefaultConfig(),
      serverUrl: 'http://localhost:5005',
      serverPath: '/model/parse',
    };
  }

  async process(jovo: Jovo, text: string): Promise<NluData | undefined> {
    try {
      const rasaResponse = await this.sendTextToRasaServer(text);
      return rasaResponse?.data?.intent?.name
        ? { intent: { name: rasaResponse.data.intent.name } }
        : undefined;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error while retrieving nlu-data from Rasa-server.', e);
      return;
    }
  }

  private sendTextToRasaServer(
    text: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<RasaResponse>> {
    return axios.post(`${this.config.serverUrl}${this.config.serverPath}`, { text }, config);
  }
}
