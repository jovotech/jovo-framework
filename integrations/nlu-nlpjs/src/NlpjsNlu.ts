import {
  DeepPartial,
  DynamicEntitiesMode,
  EntityMap,
  Extensible,
  HandleRequest,
  Jovo,
  NluData,
  NluPlugin,
  Platform,
  PluginConfig,
} from '@jovotech/framework';
import { promises as fsPromise } from 'fs';
import { JovoModelNlpjs } from 'jovo-model-nlpjs';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Nlp } = require('@nlpjs/nlp');

export interface Nlp {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type NlpjsEnumEntityOptionsMap = Record<string, string[]>;
export interface NlpjsEnumEntity {
  options: NlpjsEnumEntityOptionsMap;
}
export type NlpjsEntityMap = Record<string, NlpjsEnumEntity>;

export interface NlpjsEntity {
  start: number;
  end: number;
  len: number;
  levenshtein: number;
  accuracy: number;
  entity: string;
  type: 'enum' | string;
  option: string;
  sourceText: string;
  utteranceText: string;
}

export type SetupModelFunction = (parent: Platform, nlp: Nlp) => void | Promise<void>;

export interface NlpjsNluConfig extends PluginConfig {
  fallbackLanguage: string;
  languageMap: Record<string, unknown>;
  preTrainedModelFilePath: string;
  useModel: boolean;
  modelsPath: string;
  setupModelCallback?: SetupModelFunction;
}

export type NlpjsNluInitConfig = DeepPartial<NlpjsNluConfig> & Pick<NlpjsNluConfig, 'languageMap'>;

export class NlpjsNlu extends NluPlugin<NlpjsNluConfig> {
  nlpjs?: Nlp;

  constructor(config: NlpjsNluInitConfig) {
    super(config);
  }

  install(parent: Platform): void {
    super.install(parent);

    parent.middlewareCollection.use('$output', this.output);
  }

  // TODO fully determine default config
  getDefaultConfig(): NlpjsNluConfig {
    return {
      fallbackLanguage: 'en',
      languageMap: {},
      preTrainedModelFilePath: './model.nlp',
      useModel: false,
      modelsPath: './models',
    };
  }

  protected output = async (handleRequest: HandleRequest, jovo: Jovo): Promise<void> => {
    const lastOutputTemplate = Array.isArray(jovo.$output)
      ? jovo.$output[jovo.$output.length - 1]
      : jovo.$output;

    const listen =
      lastOutputTemplate.platforms?.[handleRequest.$platform.constructor.name]?.listen ??
      lastOutputTemplate.listen;

    if (typeof listen === 'object' && listen.entities) {
      const language = this.getLanguage(jovo);
      if (listen.entities.mode === DynamicEntitiesMode.Clear) {
        // TODO check if entities can be easily cleared
        return;
      }
      if (listen.entities.types?.length) {
        // TODO check if entities can be easily replaced instead of merged
        const entityMap = listen.entities.types.reduce((entityMap: NlpjsEntityMap, entity) => {
          // Currently this will add values to the wrong entity, this is due to passing the InputType's name here instead of the Input's name.
          // TODO: Figure something out for the issue above
          entityMap[entity.name] = {
            options: (entity.values || []).reduce(
              (optionsMap: NlpjsEnumEntityOptionsMap, entityValue) => {
                optionsMap[entityValue.id || entityValue.value] = [
                  entityValue.value,
                  ...(entityValue.synonyms || []),
                ];
                return optionsMap;
              },
              {},
            ),
          };
          return entityMap;
        }, {});
        this.nlpjs?.addEntities(entityMap, language);
        await this.nlpjs?.train();
      }
    }
  };

  async initialize(parent: Extensible): Promise<void> {
    const hasWritePermissions = await this.hasWritePermissions();

    this.nlpjs = new Nlp({
      languages: Object.keys(this.config.languageMap),
      autoLoad: this.config.useModel,
      autoSave: hasWritePermissions && this.config.useModel,
      modelFileName: this.config.preTrainedModelFilePath,
      nlu: {
        log: false,
      },
    });

    Object.values(this.config.languageMap).forEach((languagePackage) => {
      this.nlpjs?.use(languagePackage);
    });

    if (hasWritePermissions) {
      this.nlpjs?.container.register('fs', fsPromise);
    }

    if (this.config.setupModelCallback) {
      await this.config.setupModelCallback(parent as Platform, this.nlpjs!);
    } else if (this.config.useModel) {
      await this.nlpjs?.load(this.config.preTrainedModelFilePath);
    } else {
      await this.addCorpusFromModelsIn(this.config.modelsPath);
      await this.nlpjs?.train();
    }
  }

  async process(handleRequest: HandleRequest, jovo: Jovo): Promise<NluData | undefined> {
    const text = jovo.$request.getRawText();
    if (!text) return;
    const nlpResult = await this.nlpjs?.process(this.getLanguage(jovo), text);

    const entityMap = nlpResult?.entities?.reduce((entityMap: EntityMap, entity: NlpjsEntity) => {
      entityMap[entity.entity] = {
        id: entity.option,
        key: entity.option,
        name: entity.entity,
        value: entity.utteranceText,
      };
      return entityMap;
    }, {});

    return nlpResult?.intent
      ? {
          intent: {
            name: nlpResult.intent,
          },
          entities: entityMap,
          raw: nlpResult, // TODO: temporary property
        }
      : undefined;
  }

  private getLanguage(jovo: Jovo): string {
    return jovo.$request.getLocale()?.substr(0, 2) || this.config.fallbackLanguage;
  }

  private async hasWritePermissions(): Promise<boolean> {
    try {
      const tmpFilePath = 'tmp_write-test.tmp';
      await fsPromise.writeFile(tmpFilePath, Buffer.from(''));
      await fsPromise.unlink(tmpFilePath);
      return true;
    } catch (e) {
      return false;
    }
  }

  private async addCorpusFromModelsIn(dir: string) {
    const files = await fsPromise.readdir(dir);
    const jovoNlpjsConverter = new JovoModelNlpjs();

    for (let i = 0, len = files.length; i < len; i++) {
      const lastDotIndex = files[i].lastIndexOf('.');
      const extension = files[i].substr(lastDotIndex + 1);
      const locale = files[i].substr(0, lastDotIndex);
      const filePath = join(dir, files[i]);

      let jovoModelData;
      if (extension === 'js') {
        jovoModelData = require(filePath);
      } else if (extension === 'json') {
        const fileBuffer = await fsPromise.readFile(filePath);
        jovoModelData = JSON.parse(fileBuffer.toString());
      }
      jovoNlpjsConverter.importJovoModel(jovoModelData, locale);

      const nlpJsModeFiles = jovoNlpjsConverter.exportNative() || [];
      nlpJsModeFiles.forEach((model) => {
        this.nlpjs?.addCorpus(model.content);
      });
    }
  }
}
