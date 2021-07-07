import { ComponentData, SessionData } from './interfaces';

export interface StateStackItem {
  [key: string]: unknown;

  component: string;
  $subState?: string;
  $data?: ComponentData;

  resolve?: Record<string, string>;
  config?: Record<string, unknown>;
}

export type StateStack = StateStackItem[];

export interface PersistableSessionData {
  id?: string;
  data: SessionData;
  state?: StateStack;
  createdAt: Date;
  updatedAt: Date;
}

export class JovoSession {
  [key: string]: unknown;

  id?: string;
  $data: SessionData;
  $state?: StateStack;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<JovoSession>) {
    this.id = data?.id;
    this.$data = data?.$data || {};
    this.$state = data?.$state;
    this.isNew = data?.isNew ?? true;
    this.createdAt = data?.createdAt || new Date();
    this.updatedAt = data?.updatedAt || new Date();
  }

  getPersistableData(): PersistableSessionData {
    return {
      id: this.id,
      data: this.$data,
      state: this.$state,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  setPersistableData(data: PersistableSessionData): this {
    this.id = data.id;
    this.$data = data.data;
    this.$state = data.state;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    return this;
  }

  getDefaultPersistableData(): PersistableSessionData {
    return {
      data: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
