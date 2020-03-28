import {
  EnumRequestType,
  ErrorCode,
  Extensible,
  HandleRequest,
  Inputs,
  Jovo,
  JovoError,
  Platform,
  Plugin,
  PluginConfig,
  Project,
} from 'jovo-core';
import { NlpjsEntity, NlpjsResponse } from './Interfaces';
import _merge = require('lodash.merge');
import ErrnoException = NodeJS.ErrnoException;
const { dockStart, NlpManager } = require('@nlpjs/basic');

const fs = require('fs');
import * as path from 'path';
import { JovoModelNlpjs } from 'jovo-model-nlpjs';
import { NativeFileInformation } from 'jovo-model';

export type PrepareModelFunction = (
  handleRequest: HandleRequest,
  nlpManager: any, // tslint:disable-line:no-any
) => void | Promise<void>;

export interface Config extends PluginConfig {
  preTrainedModelFilePath?: string;
  useModel?: boolean;
  modelsPath?: string;
  prepareModelCallback?: PrepareModelFunction;
}

export class NlpjsNlu implements Plugin {
  config: Config = {
    preTrainedModelFilePath: './model.nlp',
    useModel: false,
    modelsPath: Project.getModelsPath(),
    prepareModelCallback: undefined,
  };
  // tslint:disable-next-line:no-any
  dock: any;
  // tslint:disable-next-line:no-any
  nlp: any;

  constructor(config: Config) {
    this.config = _merge(this.config, config);
  }

  get name(): string {
    return this.constructor.name;
  }

  install(parent: Extensible) {
    if (!(parent instanceof Platform)) {
      throw new JovoError(
        `'${this.name}' has to be an immediate plugin of a platform!`,
        ErrorCode.ERR_PLUGIN,
        this.name,
      );
    }
    parent.middleware('setup')!.use(this.setup.bind(this));
    parent.middleware('$nlu')!.use(this.nlu.bind(this));
    parent.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  async setup(handleRequest: HandleRequest) {
    this.dock = await dockStart({ use: ['Basic'], nlp: { log: false } });
    this.nlp = this.dock.get('nlp');
    // this.nlp = new NlpManager({ languages: ['en'], nlu: { log: false } }); // <== from the docs

    if (this.config.prepareModelCallback) {
      await this.config.prepareModelCallback(handleRequest, this.nlp);
      await this.nlp.train();
    } else if (this.config.useModel) {
      await this.nlp.load(this.config.preTrainedModelFilePath);
    } else {
      await this.addCorpus(this.config.modelsPath!);
      await this.nlp.train();
    }
  }

  async nlu(jovo: Jovo) {
    const text = (jovo.$asr && jovo.$asr.text) || jovo.getRawText();
    const language = jovo.$request!.getLocale().substr(0, 2);
    let response: NlpjsResponse | null = null;
    if (text) {
      response = await this.nlp.process(language, text);
    } else if (jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError('No text input to process.', ErrorCode.ERR_PLUGIN, this.name);
    }

    let intentName = 'None';
    if (jovo.$type.type === EnumRequestType.LAUNCH) {
      intentName = 'LAUNCH';
    } else if (jovo.$type.type === EnumRequestType.END) {
      intentName = 'END';
    } else if (response && response.intent) {
      intentName = response.intent;
    }
    jovo.$nlu = {
      intent: {
        name: intentName,
      },
      [this.name]: response,
    };
  }

  async inputs(jovo: Jovo) {
    if ((!jovo.$nlu || !jovo.$nlu[this.name]) && jovo.$type.type === EnumRequestType.INTENT) {
      throw new JovoError(
        'No nlu data to get inputs off was given.',
        ErrorCode.ERR_PLUGIN,
        this.name,
      );
    } else if (
      jovo.$type.type === EnumRequestType.LAUNCH ||
      jovo.$type.type === EnumRequestType.END
    ) {
      jovo.$inputs = {};
      return;
    }

    const response: NlpjsResponse = jovo.$nlu![this.name];

    const inputs: Inputs = {};
    const entities = response.entities;
    if (!entities) {
      return inputs;
    }

    entities.forEach((entity: NlpjsEntity) => {
      inputs[entity.entity] = {
        key: entity.option,
        name: entity.option,
        value: entity.sourceText,
      };
    });

    jovo.$inputs = inputs;
  }

  async train() {
    this.dock = await dockStart({ use: ['Basic'] });
    this.nlp = this.dock.get('nlp');
    await this.addCorpus(this.config.modelsPath!);
    await this.nlp.train();
    await this.nlp.load(this.config.preTrainedModelFilePath);
  }
  private addCorpus(dir: string) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err: ErrnoException, files: string[]) => {
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
              fs.readFileSync(path.join(this.config.modelsPath!, file), 'utf-8'),
            );
          }
          jovoModelInstance.importJovoModel(jovoModelData, locale);
          const nlpjsModelFiles = jovoModelInstance.exportNative() || [];

          nlpjsModelFiles.forEach((model: NativeFileInformation) => {
            this.nlp.addCorpus(model.content);
          });
        });
        resolve();
      });
    });
  }
}
