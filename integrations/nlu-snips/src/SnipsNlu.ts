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
  OutputTemplate,
} from '@jovotech/framework';
import { EntityType, Intent, IntentEntityType, JovoModelData } from '@jovotech/model';
import { join as joinPaths, resolve } from 'path';
import { v4 as uuidV4 } from 'uuid';
import { SnipsNluConfig, SnipsNluResponse } from './interfaces';

export class SnipsNlu extends NluPlugin<SnipsNluConfig> {
  install(parent: Extensible): Promise<void> | void {
    super.install(parent);

    parent.middlewareCollection.use('$output', this.trainDynamicEntities.bind(this));
  }

  getDefaultConfig(): SnipsNluConfig {
    return {
      input: {
        supportedTypes: [],
      },
      serverUrl: 'http://localhost:5000/',
      modelsDirectory: 'models',
      fallbackLanguage: 'en',
      serverPath: '/engine/parse',
      engineId: uuidV4(),
      dynamicEntities: {
        enabled: false,
        serverPath: '/engine/train/dynamic-entities',
      },
    };
  }

  async process(jovo: Jovo, text: string): Promise<NluData | undefined> {
    const config: AxiosRequestConfig = {
      url: this.config.serverPath,
      params: {
        locale: this.getLocale(jovo.$request).substring(0, 2),
        engine_id: this.config.engineId,
        session_id: jovo.$session.id!,
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

      // TODO: Why is this a map when we do have to provide the name in the object itself?
      nluData.entities[slot.slotName] = { name: slot.slotName, value: slot.value.value };
    }

    return nluData;
  }

  /**
   * Asynchronously trains dynamic entities. Sends the relevant portion of the Jovo langauge model to
   * the Snips NLU server.
   * @param handleRequest - Current HandleRequest object
   * @param jovo - Current Jovo object
   */
  private async trainDynamicEntities(jovo: Jovo): Promise<void> {
    const outputs: OutputTemplate[] = Array.isArray(jovo.$output) ? jovo.$output : [jovo.$output];
    const locale: string = this.getLocale(jovo.$request);

    const model: JovoModelData =
      this.config.dynamicEntities?.models?.[locale] ||
      (this.config.dynamicEntities?.modelsDirectory
        ? require(resolve(joinPaths(this.config.dynamicEntities.modelsDirectory, locale)))
        : {});

    if (!model.entityTypes) {
      throw new JovoError({
        message: `No entity types found for language model for locale ${locale}`,
      });
    }

    if (!model.intents) {
      throw new JovoError({
        message: `No intents found for language model for locale ${locale}`,
      });
    }

    for (const output of outputs) {
      const listen = output.platforms?.[jovo.$platform.constructor.name]?.listen ?? output.listen;

      if (
        typeof listen !== 'object' ||
        !listen.entities ||
        listen.entities.mode === DynamicEntitiesMode.Clear
      ) {
        return;
      }

      for (const [entityKey, entityData] of Object.entries(listen.entities.types || {})) {
        const requestData: JovoModelData = {
          version: '4.0',
          invocation: '',
          intents: {},
          entityTypes: {},
        };

        const originalInputType: EntityType | undefined = model.entityTypes?.[entityKey];
        if (!originalInputType) {
          continue;
        }

        if (!originalInputType.values) {
          originalInputType.values = [];
        }

        // Merge values from original input type with dynamic ones
        originalInputType.values.push(...(entityData.values || []));
        requestData.entityTypes![entityKey] = originalInputType;

        // Find all intents the entity type is used in and provide them in the request to the Snips NLU server
        for (const [intentKey, intentData] of Object.entries(model.intents || [])) {
          if (!intentData.entities) {
            continue;
          }

          for (const [entityKey, entityData] of Object.entries(intentData.entities)) {
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

        const config: AxiosRequestConfig = {
          url: '/engine/train/dynamic-entities',
          params: {
            locale: locale.substring(0, 2),
            entity: entityKey,
            engine_id: this.config.engineId,
            session_id: jovo.$session.id!,
          },
          data: requestData,
        };

        this.sendRequestToSnips(config);
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
        throw new JovoError({
          message: `SnipsNlu returned a server error (${error.response?.status || error.code})`,
          details: error.response?.data?.description,
          name: error.response?.data?.name,
        });
      }
      throw new JovoError({ message: error.message });
    }
  }
}
