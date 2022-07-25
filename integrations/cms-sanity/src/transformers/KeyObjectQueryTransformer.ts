import { Jovo } from '@jovotech/framework';
import {
  BaseSanityQueryTransformer,
  SanityQueryTransformerConfig,
} from './BaseSanityQueryTransformer';

export interface KeyObjectQueryTransformerConfig extends SanityQueryTransformerConfig {
  key: string;
}

export class KeyObjectQueryTransformer extends BaseSanityQueryTransformer<KeyObjectQueryTransformerConfig> {
  private convertArrayToObject = (array: any[], key: string) =>
    array.reduce((acc, curr) => {
      acc[curr[key]] = curr;
      return acc;
    }, {});

  getDefaultConfig(): KeyObjectQueryTransformerConfig {
    return {
      query: '',
      key: '_id',
    };
  }

  execute(values: unknown | unknown[], jovo: Jovo): unknown | unknown[] {
    if (Array.isArray(values)) {
      return this.convertArrayToObject(values, this.config.key);
    }

    if (Object.keys(values as any).includes(this.config.key)) {
      const result: any = {};
      result[this.config.key] = values as any;
      return result;
    } else {
      return {};
    }
  }
}
