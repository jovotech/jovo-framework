import {
  axios,
  AxiosRequestConfig,
  AxiosResponse,
  DeepPartial,
  EntityMap,
  HandleRequest,
  Jovo,
  NluData,
  NluPlugin,
  PluginConfig,
} from '@jovotech/framework';
import { RasaEntity, RasaIntent, RasaResponse } from './interfaces';

export interface RasaNluConfig extends PluginConfig {
  serverUrl?: string;
  serverPath?: string;
  //activate alternative intent classifications in $nlu
  //and constrain the number of alternatives by number and/or an confidence cutoff
  alternativeIntents: { maxAlternatives: number; confidenceCutoff: number };
}

export interface RasaNluData extends NluData {
  intent: {
    name: string;
    confidence: number;
  };
  alternativeIntents: RasaIntent[];
  entities: EntityMap;
}

export type RasaNluInitConfig = DeepPartial<RasaNluConfig>;

export class RasaNlu extends NluPlugin<RasaNluConfig> {
  // TODO fully determine default config
  getDefaultConfig(): RasaNluConfig {
    return {
      serverUrl: 'http://localhost:5005',
      serverPath: '/model/parse',
      alternativeIntents: { maxAlternatives: 15, confidenceCutoff: 0.0 },
    };
  }

  async process(handleRequest: HandleRequest, jovo: Jovo): Promise<NluData | undefined> {
    const text = jovo.$request.getRawText();
    if (!text) return;
    try {
      const rasaResponse = await this.sendTextToRasaServer(text || '');
      if (rasaResponse.data.intent.name) {
        const reducer = (entityMap: EntityMap, rasaEntity: RasaEntity): EntityMap => {
          let entityAlias = rasaEntity.entity;
          // roles can distinguish entities of the same type e.g. departure and destination in
          // a travel use case and should therefore be preferred as entity name
          if (rasaEntity.role) {
            entityAlias = rasaEntity.role;
          }
          entityMap.entityAlias = {
            id: entityAlias,
            key: entityAlias,
            name: rasaEntity.entity,
            value: rasaEntity.value,
          };

          return entityMap;
        };

        const jovoEntities: EntityMap = rasaResponse.data.entities.reduce(reducer, {});
        const nluResult: RasaNluData = {
          intent: {
            name: rasaResponse.data.intent.name,
            confidence: rasaResponse.data.intent.confidence,
          },
          alternativeIntents: [],
          entities: jovoEntities,
        };

        if (this.config.alternativeIntents) {
          nluResult.alternativeIntents = this.mapAlternativeIntents(
            rasaResponse.data.intent_ranking,
          );
        }

        return nluResult;
      } else {
        return undefined;
      }
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

  private mapAlternativeIntents(allIntents: RasaIntent[]): RasaIntent[] {
    // remove first element, because its the classified intent
    const alternativeIntents = allIntents.slice(1);

    return alternativeIntents
      .filter((a) => a.confidence > this.config.alternativeIntents.confidenceCutoff)
      .slice(0, this.config.alternativeIntents.maxAlternatives);
  }
}
