import {
  axios,
  AxiosRequestConfig,
  AxiosResponse,
  DynamicEntitiesMode,
  Extensible,
  Jovo,
  JovoError,
  JovoRequest,
  NluData,
  NluPlugin,
} from '@jovotech/framework';
import { InterpretationPluginConfig } from '@jovotech/framework/src';

import { EntityType, IntentEntityType, JovoModelData } from '@jovotech/model';
import { join as joinPaths, resolve } from 'path';
import { v4 as uuidV4 } from 'uuid';
import { SnipsNluResponse } from './interfaces';

export interface SnipsNluConfig extends InterpretationPluginConfig {
  serverUrl: string;
  serverPath: string;
  engineId: string;
  fallbackLanguage: string;
  dynamicEntities?: {
    enabled: boolean;
    serverPath: string;
    modelsDirectory?: string;
    models?: Record<string, JovoModelData>;
    passModels?: boolean;
  };
}

export class SnipsNlu extends NluPlugin<SnipsNluConfig> {
  mount(parent: Extensible): Promise<void> | void {
    super.mount(parent);

    parent.middlewareCollection.use('response.output', (jovo) => {
      return this.trainDynamicEntities(jovo);
    });
  }

  getDefaultConfig(): SnipsNluConfig {
    return {
      ...super.getDefaultConfig(),
      serverUrl: 'http://localhost:5000/',
      fallbackLanguage: 'en',
      serverPath: '/engine/parse',
      engineId: uuidV4(),
      dynamicEntities: {
        enabled: false,
        passModels: true,
        modelsDirectory: 'models',
        serverPath: '/engine/train/dynamic-entities',
      },
    };
  }

  async processText(jovo: Jovo, text: string): Promise<NluData | undefined> {
    if (!jovo.$session.id) {
      throw new JovoError({
        message: `Can not send request to Snips-NLU. Session-ID is missing.`,
      });
    }

    const config: AxiosRequestConfig = {
      url: this.config.serverPath,
      params: {
        locale: this.getLocale(jovo.$request).substring(0, 2),
        engine_id: this.config.engineId,
        session_id: jovo.$session.id,
      },
      data: { text },
    };

    const snipsNluResponse: SnipsNluResponse = await this.sendRequestToSnips(config);
    const nluData: NluData = {};
    if (snipsNluResponse.intent.intentName) {
      nluData.intent = { name: snipsNluResponse.intent.intentName };
    }

    for (const slot of snipsNluResponse.slots) {
      if (!nluData.entities) {
        nluData.entities = {};
      }

      nluData.entities[slot.slotName] = {
        id: slot.value.value,
        resolved: slot.value.value,
        value: slot.rawValue,
        native: slot,
      };
    }

    return nluData;
  }

  /**
   * Asynchronously trains dynamic entities. Sends the relevant portion of the Jovo langauge model to
   * the Snips NLU server.
   * @param jovo - Current Jovo object
   */
  private async trainDynamicEntities(jovo: Jovo): Promise<void> {
    if (!this.config.dynamicEntities?.enabled) {
      return;
    }
    const locale: string = this.getLocale(jovo.$request);

    for (const output of jovo.$output) {
      const listen = output.platforms?.[jovo.$platform.name]?.listen ?? output.listen;

      if (
        typeof listen !== 'object' ||
        !listen.entities ||
        listen.entities.mode === DynamicEntitiesMode.Clear
      ) {
        continue;
      }

      for (const [entityKey, entityData] of Object.entries(listen.entities.types || {})) {
        const buildRequestData = (): JovoModelData | undefined => {
          let model: JovoModelData | undefined;

          try {
            model =
              this.config.dynamicEntities?.models?.[locale] ||
              (this.config.dynamicEntities?.modelsDirectory
                ? require(resolve(joinPaths(this.config.dynamicEntities.modelsDirectory, locale)))
                : null);
          } catch (error) {
            throw new JovoError({ message: error.message });
          }

          if (!model) {
            throw new JovoError({
              message: `Please provide a language model for locale ${locale}.`,
            });
          }

          const originalInputType: EntityType | undefined = model!.entityTypes?.[entityKey];
          if (!originalInputType) {
            return;
          }

          if (!originalInputType.values) {
            originalInputType.values = [];
          }

          // Merge values from original input type with dynamic ones
          originalInputType.values.push(...(entityData.values || []));

          const requestData: JovoModelData = {
            version: '4.0',
            invocation: '',
            intents: {},
            entityTypes: {
              [entityKey]: originalInputType,
            },
          };

          // Find all intents the entity type is used in and provide them in the request to the Snips NLU server
          for (const [intentKey, intentData] of Object.entries(model!.intents || {})) {
            if (!intentData.entities) {
              continue;
            }

            for (const [entityKey, entityData] of Object.entries(intentData.entities || {})) {
              if (!entityData.type) {
                continue;
              }

              const isEqualEntityType = (entityType: IntentEntityType | string): boolean => {
                if (typeof entityType === 'object') {
                  return entityType.snips === entityKey;
                } else {
                  return entityType === entityKey;
                }
              };

              if (isEqualEntityType(entityData.type)) {
                requestData.intents![intentKey] = intentData;
              }
            }
          }

          return requestData;
        };

        let requestData: JovoModelData | Record<string, unknown> | undefined = {};

        if (this.config.dynamicEntities?.passModels) {
          requestData = buildRequestData();

          if (!requestData) {
            return;
          }
        }

        const config: AxiosRequestConfig = {
          url: this.config.dynamicEntities.serverPath,
          params: {
            locale: locale.substring(0, 2),
            entity: entityKey,
            engine_id: this.config.engineId,
            session_id: jovo.$session.id!,
          },
          data: requestData,
        };

        // run in background
        this.sendRequestToSnips(config)
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          .then(() => {})
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.error(e);
          });
      }
    }
  }

  private getLocale(request: JovoRequest): string {
    return request.getLocale() || this.config.fallbackLanguage;
  }

  /**
   * Sends a request to a configured Snips NLU Server
   * @param requestConfig - Request configuration
   */
  private async sendRequestToSnips(requestConfig: AxiosRequestConfig): Promise<SnipsNluResponse> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      baseURL: this.config.serverUrl,
      ...requestConfig,
    };
    try {
      const response: AxiosResponse<SnipsNluResponse> = await axios.request(config);
      return response.data;
    } catch (error) {
      if (error.isAxiosError) {
        const errorDescription = error.response?.data?.description;
        throw new JovoError({
          message: `Request to SnipsNlu failed${
            errorDescription ? `: ${errorDescription}` : '.'
          }  `,
          name: error.response?.data?.name,
        });
      }
      throw new JovoError({ message: error.message });
    }
  }
}
