import { UnknownObject } from '@jovotech/common';
import { JovoResponse, OutputTemplate } from '@jovotech/output';
import { JovoInput, JovoRequest } from './index';
import { EntityMap } from './interfaces';
import { JovoSession } from './JovoSession';

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

  constructor(items: JovoHistoryItem[] = []) {
    this.items = items;
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
    return this;
  }
}
