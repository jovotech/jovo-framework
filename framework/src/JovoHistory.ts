import { EntityMap, UnknownObject } from '@jovotech/common';
import { JovoResponse, OutputTemplate } from '@jovotech/output';
import { Jovo, JovoInput, JovoRequest, Platform } from './index';
import { JovoSession } from './JovoSession';
import { plainToClass } from 'class-transformer';

export interface JovoHistoryItem extends UnknownObject {
  request?: JovoRequest;
  input?: JovoInput;

  state?: JovoSession['$state'];
  entities?: EntityMap;

  output?: OutputTemplate[];
  response?: JovoResponse | JovoResponse[];
}

export interface PersistableHistoryData {
  items: JovoHistoryItem[];
}
export class JovoHistory {
  items: JovoHistoryItem[];
  jovo: Jovo;

  constructor(jovo: Jovo, items: JovoHistoryItem[] = []) {
    this.items = items;
    this.jovo = jovo;
  }

  get prev(): JovoHistoryItem | undefined {
    return this.items.length > 0 ? this.items[0] : undefined;
  }

  getPersistableData(): PersistableHistoryData {
    return {
      items: this.items,
    };
  }

  setPersistableData(data?: PersistableHistoryData): this {
    this.items = data?.items || [];
    for (const item of this.items) {
      if (item.request) {
        item.request = plainToClass(this.jovo.$platform.requestClass, item.request);
      }
      if (item.response) {
        item.response = plainToClass(
          this.jovo.$platform.outputTemplateConverterStrategy.responseClass,
          item.response,
        );
      }
      if (item.input) {
        item.input = plainToClass(JovoInput, item.input);
      }
    }
    return this;
  }
}
