import {
  DeepPartial,
  Extensible,
  HandleRequest,
  Jovo,
  NluData,
  Platform,
  PluginConfig,
} from '@jovotech/framework';
import { NluPlugin } from '@jovotech/framework/dist/NluPlugin';
import { promises } from 'fs';
import { JovoModelNlpjs } from 'jovo-model-nlpjs';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Nlp } = require('@nlpjs/nlp');

export interface Nlp {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type SetupModelFunction = (parent: Platform, nlp: Nlp) => void | Promise<void>;

export interface NlpjsNluConfig extends PluginConfig {
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

  // TODO fully determine default config
  getDefaultConfig(): NlpjsNluConfig {
    return {
      languageMap: {},
      preTrainedModelFilePath: './model.nlp',
      useModel: false,
      modelsPath: './models',
    };
  }

  async initialize(parent: Extensible): Promise<void> {
    super.initialize(parent);
    this.nlpjs = new Nlp({
      languages: Object.keys(this.config.languageMap),
      autoLoad: this.config.useModel,
      // TODO: add condition to check if writing is even possible
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

  async process(handleRequest: HandleRequest, jovo: Jovo): Promise<NluData | undefined> {
    const text = jovo.$request.getRawText();
    if (!text) return;
    const language = jovo.$request.getLocale()?.substr(0, 2) || 'en';
    const nlpResult = await this.nlpjs?.process(language, text);
    return nlpResult?.intent
      ? {
          intent: {
            name: nlpResult.intent,
          },
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
        jovoModelData = await import(filePath);
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
