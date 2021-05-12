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
import { RasaResponse } from './interfaces';

export interface RasaNluConfig extends PluginConfig {
  serverUrl: string;
  serverPath: string;
}

export type RasaNluInitConfig = DeepPartial<RasaNluConfig>;

export class RasaNlu extends NluPlugin<RasaNluConfig> {
  // TODO fully determine default config
  getDefaultConfig(): RasaNluConfig {
    return {
      serverUrl: 'http://localhost:5005',
      serverPath: '/model/parse',
    };
  }

  async initialize(parent: Extensible): Promise<void> {
    super.initialize(parent);

    // check if rasa-server is available
    // TODO determine whether this check if required/necessary
    try {
      await this.sendTextToRasaServer('');
    } catch (e) {
      throw new JovoError({
        message: 'Could not access Rasa-server.',
      });
    }
  }

  async process(handleRequest: HandleRequest, jovo: Jovo): Promise<NluData | undefined> {
    const text = jovo.$request.getRawText();
    if (!text) return;
    try {
      const rasaResponse = await this.sendTextToRasaServer(text || '');
      return rasaResponse?.data?.intent?.name
        ? { intent: { name: rasaResponse.data.intent.name } }
        : undefined;
    } catch (e) {
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
