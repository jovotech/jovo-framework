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

      for (const entity of listen.entities.types || []) {
        const requestData: JovoModelData = { invocation: '', intents: [], inputTypes: [] };

        // Get intent and values from Jovo model
        // TODO: Read model location from project configuration instead of passing it to config again?
        const modelPath = resolve(joinPaths(this.config.modelsDirectory, locale));
        let model: JovoModelData | undefined;
        try {
          model = require(modelPath);
        } finally {
          if (!model) {
            throw new JovoError({
              message: `Couldn't find a language model for locale ${locale}.`,
            });
          }
        }

        if (!model.inputTypes) {
          continue;
        }

        const originalInputType: InputType | undefined = model.inputTypes.find(
          (inputType) => inputType.name === entity.name,
        );

        if (!originalInputType) {
          continue;
        }

        if (!originalInputType.values) {
          originalInputType.values = [];
        }

        // Merge values from original input type with dynamic ones
        originalInputType.values.push(...(entity.values || []));
        requestData.inputTypes!.push(originalInputType);

        if (!model.intents) {
          continue;
        }

        // Find all intents the input type is used in and provide them in the request to the Snips NLU server
        const intents: Intent[] = model.intents.filter((intent) => {
          if (!intent.inputs) {
            return;
          }

          return intent.inputs.some((input) => {
            if (!input.type) {
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

        const config: AxiosRequestConfig = {
          url: '/engine/train/dynamic-entities',
          params: {
            locale: locale.substring(0, 2),
            entity: entity.name,
            engine_id: this.config.engineId,
            session_id: jovo.$session.id!,
          },
          data: requestData,
        };

        this.sendToSnips(config);
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
