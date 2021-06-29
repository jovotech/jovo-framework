import { ComponentData, SessionData } from './interfaces';

export interface StateStackItem {
  [key: string]: unknown;

  componentPath: string;
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
  createdAt?: Date;
  updatedAt?: Date;
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
    this.updatedAt = new Date();
    this.createdAt = this.isNew ? new Date() : data?.createdAt || new Date();
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

    this.updatedAt = new Date();
    this.createdAt = this.isNew ? new Date() : data?.createdAt || new Date();
    return this;
  }

  getDefaultPersistableData(): PersistableSessionData {
    return {
      data: {},
    };
  }
}
