import { join as joinPaths, resolve } from 'path';
import { v4 as uuidV4 } from 'uuid';
import {
  axios,
  AxiosRequestConfig,
  AxiosResponse,
  DynamicEntitiesMode,
  Extensible,
  HandleRequest,
  Jovo,
  JovoError,
  JovoRequest,
  NluData,
  NluPlugin,
  OutputTemplate,
} from '@jovotech/framework';
import { InputType, Intent, JovoModelData } from 'jovo-model';
import { SnipsNluConfig, SnipsNluResponse } from './interfaces';

export class SnipsNlu extends NluPlugin<SnipsNluConfig> {
  install(parent: Extensible): Promise<void> | void {
    super.install(parent);

    parent.middlewareCollection.use('$output', this.generateDynamicEntities.bind(this));
  }

  getDefaultConfig(): SnipsNluConfig {
    return {
      serverUrl: 'http://localhost:5000/',
      modelsDirectory: 'models',
      fallbackLanguage: 'en',
      serverPath: '',
      engineId: uuidV4(),
    };
  }

  async process(handleRequest: HandleRequest, jovo: Jovo): Promise<NluData | undefined> {
    const text: string | undefined = jovo.$request.getRawText();

    if (!text) {
      return;
    }

    const config: AxiosRequestConfig = {
      url: '/engine/parse',
      params: {
        locale: this.getLocale(jovo.$request).substring(0, 2),
        engine_id: this.config.engineId,
        session_id: jovo.$session.id!,
      },
      data: { text },
    };
    const snipsNluResponse: SnipsNluResponse = await this.sendToSnips(config);
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

  private async createDynamicEntitiesEngine(
    entity: string,
    locale: string,
    sessionId: string,
    data: JovoModelData,
  ) {
    const config: AxiosRequestConfig = {
      url: '/engine/train',
      params: {
        locale,
        entity,
        engine_id: this.config.engineId,
        session_id: sessionId,
      },
      data,
    };

    return await this.sendToSnips(config);
  }

  private async generateDynamicEntities(handleRequest: HandleRequest, jovo: Jovo): Promise<void> {
    const outputs: OutputTemplate[] = Array.isArray(jovo.$output) ? jovo.$output : [jovo.$output];
    const locale: string = this.getLocale(jovo.$request);

    for (const output of outputs) {
      const listen = output.platforms?.[jovo.$platform.constructor.name]?.listen ?? output.listen;

      if (typeof listen !== 'object' || !listen.entities) {
        return;
      }

      if (listen.entities.mode === DynamicEntitiesMode.Clear) {
        return;
      }

          // TODO: If input type does not exist, throw error?
          if (!model.inputTypes) {
            continue;
          }

          const originalInputType: InputType | undefined = model.inputTypes.find(
            (inputType) => inputType.name === entity.name,
          );

          // TODO: If input type does not exist, throw error?
          if (!originalInputType) {
            continue;
          }

          if (!originalInputType.values) {
            originalInputType.values = [];
          }

          // Merge values from original input type with dynamic ones
          originalInputType.values.push(...(entity.values || []));
          requestData.inputTypes!.push(originalInputType);

          // TODO: What to do here?
          if (!model.intents) {
            continue;
          }

          const intents: Intent[] = model.intents.filter((intent) => {
            if (!intent.inputs) {
              return;
            }

            return intent.inputs!.some((input) => {
              if (!input.type) {
                // TODO What to do here?
                return;
              }
              if (typeof input.type === 'object') {
                return input.type.snips === entity.name;
              } else {
                return input.type === entity.name;
              }
            });
          });

          requestData.intents!.push(...intents);

          // TODO: Async? In parallel?
          await this.createDynamicEntitiesEngine(
            entity.name,
            locale,
            jovo.$session.id!,
            requestData,
          );
        }
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
  private async sendToSnips(requestConfig: AxiosRequestConfig): Promise<SnipsNluResponse> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      baseURL: this.config.serverUrl,
      ...requestConfig,
    };
    console.log(config);
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
