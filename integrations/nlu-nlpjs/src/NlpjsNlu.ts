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

export interface NlpJsEntityResolutionDuration {
  timex?: string;
  type?: string;
  value?: string;
}

export interface NlpJsEntityResolution {
  strValue?: string;
  strFutureValue?: string;
  value?: string | number;
  subType?: string;
  values?: NlpJsEntityResolutionDuration[];
  timex?: string;
}

export enum NlpJsEntityType {
  Age = 'age',
  Boolean = 'boolean',
  Currency = 'currency',
  Date = 'date',
  DateRange = 'daterange',
  DateTime = 'datetime',
  DateTimeRange = 'datetimerange',
  Dimension = 'dimension',
  Duration = 'duration',
  Email = 'email',
  Enum = 'enum',
  Hashtag = 'hashtag',
  Ip = 'ip',
  Mention = 'mention',
  Number = 'number',
  NumberRange = 'numberrange',
  Ordinal = 'ordinal',
  Percentage = 'percentage',
  PhoneNumber = 'phoneNumber',
  Regex = 'regex',
  Temperature = 'temperature',
  Time = 'time',
  TimeRange = 'timerange',
  Timezone = 'timezone',
  Url = 'url',
}

export interface NlpJsEntity {
  start: number;
  end: number;
  len: number;
  levenshtein: number;
  accuracy: number;
  entity: string;
  type: 'enum' | string | NlpJsEntityType;
  option: string;
  sourceText: string;
  utteranceText: string;
  alias?: string;
  resolution?: NlpJsEntityResolution;
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

  // TODO fully determine default config
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

  async processText(jovo: Jovo, text: string): Promise<NluData | undefined> {
    const language = jovo.$request.getLocale()?.substr(0, 2) || 'en';
    const nlpResult = await this.nlpjs?.process(language, text);

    const entities = (nlpResult?.entities || []).reduce(
      (entityMap: EntityMap, entity: NlpJsEntity) => {
        const entityName = entity.alias || entity.entity;
        const resolvedValue = this.getResolvedValue(entity);
        entityMap[entityName] = {
          id: resolvedValue,
          resolved: resolvedValue,
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
          native: nlpResult,
          raw: nlpResult, // @deprecated please use 'native' property
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
        jovoModelData = require(join(process.cwd(), filePath));
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

  private getResolvedValue(entity: NlpJsEntity): string {
    switch (entity.type) {
      case NlpJsEntityType.Enum:
        return entity.option ?? entity.utteranceText;

      case NlpJsEntityType.Regex:
        return entity.utteranceText;

      case NlpJsEntityType.Age:
      case NlpJsEntityType.Currency:
      case NlpJsEntityType.Dimension:
      case NlpJsEntityType.Number:
      case NlpJsEntityType.Ordinal:
      case NlpJsEntityType.Temperature:
        return entity?.resolution?.strValue ?? entity.utteranceText;

      case NlpJsEntityType.Date:
        return (
          entity?.resolution?.strValue ?? entity?.resolution?.strFutureValue ?? entity.utteranceText
        );

      case NlpJsEntityType.Boolean:
      case NlpJsEntityType.Percentage:
        return entity?.resolution?.value
          ? entity.resolution.value.toString()
          : entity.utteranceText;

      case NlpJsEntityType.Time:
      case NlpJsEntityType.DateTime:
        return entity?.resolution?.values?.[0]?.value ?? entity.utteranceText;

      case NlpJsEntityType.Duration:
      case NlpJsEntityType.TimeRange:
        return entity?.resolution?.values?.[0]?.timex ?? entity.utteranceText;

      case NlpJsEntityType.Email:
      case NlpJsEntityType.Hashtag:
      case NlpJsEntityType.Ip:
      case NlpJsEntityType.Mention:
      case NlpJsEntityType.PhoneNumber:
      case NlpJsEntityType.Url:
        return entity?.resolution?.value?.toString() ?? entity.utteranceText;

      case NlpJsEntityType.DateRange:
      case NlpJsEntityType.DateTimeRange:
        return entity?.resolution?.timex ?? entity.utteranceText;

      case NlpJsEntityType.NumberRange:
      case NlpJsEntityType.Timezone:
      default:
        // if no explicit mapping, use utteranceText
        // can still access full details from "native" property
        return entity.utteranceText;
    }
  }
}
