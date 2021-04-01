import { Extensible, InvalidParentError, Platform, Plugin, PluginConfig } from '@jovotech/core';
import { readdir, readFileSync } from 'fs';
import { NativeFileInformation } from 'jovo-model';
import { JovoModelNlpjs } from 'jovo-model-nlpjs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Nlp } = require('@nlpjs/nlp');

export interface Nlp {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type SetupModelFunction = (parent: Platform, nlp: Nlp) => void | Promise<void>;

export interface NlpjsNluConfig extends PluginConfig {
  languages: string[];
  preTrainedModelFilePath: string;
  useModel: boolean;
  modelsPath: string;
  setupModelCallback?: SetupModelFunction;
}

export class NlpjsNlu extends Plugin<NlpjsNluConfig> {
  nlpjs?: Nlp;

  // TODO fully determine default config
  getDefaultConfig(): NlpjsNluConfig {
    return {
      languages: ['en'],
      preTrainedModelFilePath: './model.nlp',
      useModel: false,
      modelsPath: '',
    };
  }

  async initialize(parent: Extensible): Promise<void> {
    if (!(parent instanceof Platform)) {
      // TODO: implement error
      throw new InvalidParentError();
    }
    const nlpjs = new Nlp({
      languages: this.config.languages,
      autoLoad: this.config.useModel,
      // TODO: add condition to check if writing is even possible
      autoSave: this.config.useModel,
      modelFileName: this.config.preTrainedModelFilePath,
      nlu: { log: false },
    });

    // TODO: register fs if write-access is available


    if (this.config.setupModelCallback) {
      await this.config.setupModelCallback(parent, nlpjs);
    } else if (this.config.useModel) {
      await nlpjs.load(this.config.preTrainedModelFilePath);
    } else {
      await this.addCorpus(this.config.modelsPath);
      await nlpjs.train();
    }

    this.nlpjs = nlpjs;
  }

  private addCorpus(dir: string) {
    return new Promise<void>((resolve, reject) => {
      readdir(dir, (err: Error | null, files: string[]) => {
        if (err) {
          return reject(err);
        }
        const jovoModelInstance = new JovoModelNlpjs();

        files.forEach((file: string) => {
          const extension = file.substr(file.lastIndexOf('.') + 1);
          const locale = file.substr(0, file.lastIndexOf('.'));
          let jovoModelData;

          if (extension === 'js') {
            jovoModelData = require(path.join(this.config.modelsPath!, file));
          } else if (extension === 'json') {
            jovoModelData = JSON.parse(
              readFileSync(path.join(this.config.modelsPath!, file), 'utf-8'),
            );
          }
          jovoModelInstance.importJovoModel(jovoModelData, locale);
          const nlpjsModelFiles = jovoModelInstance.exportNative() || [];

          nlpjsModelFiles.forEach((model: NativeFileInformation) => {
            this.nlpjs?.addCorpus(model.content);
          });
        });
        resolve();
      });
    });
  }
}
