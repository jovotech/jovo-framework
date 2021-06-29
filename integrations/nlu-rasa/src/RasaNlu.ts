import {
  axios,
  AxiosRequestConfig,
  AxiosResponse,
  DeepPartial,
  EntityMap,
  Extensible,
  HandleRequest,
  Jovo,
  JovoError,
  NluData,
  NluPlugin,
  PluginConfig,
} from '@jovotech/framework';
import { RasaEntity, RasaResponse } from './interfaces';

export interface RasaNluConfig extends PluginConfig {
  serverUrl?: string;
  serverPath?: string;
}

interface RasaNluData extends NluData {
  intent?: {
    name: string;
    confidence: number;
  };
  entities?: EntityMap;
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

  constructor(config?: RasaNluConfig) {
    super(config);
  }

  async process(handleRequest: HandleRequest, jovo: Jovo): Promise<RasaNluData | undefined> {
    const text = jovo.$request.getRawText();
    if (!text) return;
    try {
      const rasaResponse = await this.sendTextToRasaServer(text || '');

      const ents: EntityMap = {};
      rasaResponse.data.entities.map((entity: RasaEntity) => {
        let entityAlias = entity.entity;
        // roles can distinguish entities of the same type e.g. departure and destination in
        // a travel use case and should therefore be preferred as entity name
        if (entity.role) {
          entityAlias = entity.role;
        }
        ents[entityAlias] = {
          id: entityAlias,
          key: entityAlias,
          name: entity.entity,
          value: entity.value,
        };
      });

      return rasaResponse.data.intent.name
        ? {
            intent: {
              name: rasaResponse.data.intent.name,
              confidence: rasaResponse.data.intent.confidence,
            },
            entities: ents,
          }
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
