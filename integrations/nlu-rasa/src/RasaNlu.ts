import {
  axios,
  AxiosRequestConfig,
  AxiosResponse,
  EntityMap,
  Jovo,
  NluData,
  NluPlugin,
  NluPluginConfig,
} from '@jovotech/framework';
import { DeepPartial } from '@jovotech/framework';

import { RasaEntity, RasaIntent, RasaResponse } from './interfaces';

export interface RasaNluConfig extends NluPluginConfig {
  serverUrl: string;
  serverPath: string;
  //activate alternative intent classifications in $input.nlu
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
  getDefaultConfig(): RasaNluConfig {
    return {
      ...super.getDefaultConfig(),
      serverUrl: 'http://localhost:5005',
      serverPath: '/model/parse',
      alternativeIntents: { maxAlternatives: 15, confidenceCutoff: 0.0 },
    };
  }

  async process(jovo: Jovo, text: string): Promise<RasaNluData | undefined> {
    try {
      const rasaResponse = await this.sendTextToRasaServer(text);

      return {
        intent: {
          name: rasaResponse.data.intent.name,
          confidence: rasaResponse.data.intent.confidence,
        },
        alternativeIntents: this.mapAlternativeIntents(rasaResponse.data.intent_ranking),
        entities: rasaResponse.data.entities.reduce(this.mapEntities, {}),
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error while retrieving nlu-data from Rasa-server: ', e);
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

  private mapEntities(entityMap: EntityMap, rasaEntity: RasaEntity): EntityMap {
    let entityAlias = rasaEntity.entity;
    // roles can distinguish entities of the same type e.g. departure and destination in
    // a travel use case and should therefore be preferred as entity name
    if (rasaEntity.role) {
      entityAlias = rasaEntity.role;
    }
    entityMap[entityAlias] = {
      id: entityAlias,
      resolved: entityAlias,
      value: rasaEntity.value,
      native: rasaEntity,
    };

    return entityMap;
  }
}
