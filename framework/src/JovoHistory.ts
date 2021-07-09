import { OutputTemplate } from '@jovotech/output';
import { AsrData, EntityMap, NluData } from './interfaces';
import { JovoSession } from './JovoSession';

export interface JovoHistoryItem {
  output?: OutputTemplate | OutputTemplate[];
  nlu?: NluData;
  state?: JovoSession['$state'];
  entities?: EntityMap;
  asr?: AsrData;
  [key: string]: unknown;
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
