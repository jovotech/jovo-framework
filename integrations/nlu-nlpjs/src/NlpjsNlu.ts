import {
  DeepPartial,
  EntityMap,
  InterpretationPluginConfig,
  Jovo,
  NluData,
  NluPlugin,
  Platform,
  UnknownObject,
} from '@jovotech/framework';

import { JovoModelNlpjs } from '@jovotech/model-nlpjs';
import { promises } from 'fs';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Nlp } = require('@nlpjs/nlp');

export interface Nlp {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface NlpJsEntity {
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

export interface NlpjsNluConfig extends InterpretationPluginConfig {
  languageMap: UnknownObject;
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

  getDefaultConfig(): NlpjsNluConfig {
    return {
      ...super.getDefaultConfig(),
      languageMap: {},
      preTrainedModelFilePath: './model.nlp',
      useModel: false,
      modelsPath: './models',
    };
  }

  async initialize(parent: Platform): Promise<void> {
    this.nlpjs = new Nlp({
      languages: Object.keys(this.config.languageMap),
      autoLoad: this.config.useModel,
      // TODO: add condition to check if writing is even possible => implement hasFileWriteAccess in Server
      autoSave: this.config.useModel,
      modelFileName: this.config.preTrainedModelFilePath,
      nlu: {
        log: false,
      },
    });

    Object.values(this.config.languageMap).forEach((languagePackage) => {
      this.nlpjs?.use(languagePackage);
    });

    // TODO: register fs if write-access is available

    if (this.config.setupModelCallback) {
      await this.config.setupModelCallback(parent as Platform, this.nlpjs!);
    } else if (this.config.useModel) {
      await this.nlpjs?.load(this.config.preTrainedModelFilePath);
    } else {
      await this.addCorpusFromModelsIn(this.config.modelsPath);
      await this.nlpjs?.train();
    }
  }

  async processText(jovo: Jovo, text: string): Promise<NluData | undefined> {
    const language = jovo.$request.getLocale()?.substr(0, 2) || 'en';
    const nlpResult = await this.nlpjs?.process(language, text);

    const entities = (nlpResult?.entities || []).reduce(
      (entityMap: EntityMap, entity: NlpJsEntity) => {
        entityMap[entity.entity] = {
          id: entity.option,
          resolved: entity.option,
          value: entity.utteranceText,
          native: entity,
        };
        return entityMap;
      },
      {},
    );

    return nlpResult?.intent
      ? {
          intent: {
            name: nlpResult.intent,
          },
          entities,
          raw: nlpResult, // TODO: temporary property => add "native" property to NluData
        }
      : undefined;
  }

  private async addCorpusFromModelsIn(dir: string) {
    const files = await promises.readdir(dir);
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
        const fileBuffer = await promises.readFile(filePath);
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
