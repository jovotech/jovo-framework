import { UnknownObject } from './index';
import { ComponentData, SessionData } from './interfaces';

export interface StateStackItem extends UnknownObject {
  component: string;
  $subState?: string;
  $data?: ComponentData;

  resolve?: Record<string, string>;
  config?: UnknownObject;
}

export type StateStack = StateStackItem[];

export interface PersistableSessionData {
  id?: string;
  data: SessionData;
  state?: StateStack;
  createdAt?: string;
  updatedAt?: string;
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
    this.createdAt = this.isNew
      ? new Date()
      : data?.createdAt
      ? new Date(data.createdAt)
      : new Date();
  }

  getPersistableData(): PersistableSessionData {
    return {
      id: this.id,
      data: this.$data,
      state: this.$state,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  setPersistableData(data?: PersistableSessionData): this {
    this.id = data?.id || this.id;
    this.$data = data?.data || this.$data;
    this.$state = data?.state || this.$state;

    this.updatedAt = new Date();
    this.createdAt = this.isNew ? new Date() : new Date(data?.createdAt || new Date());
    return this;
  }

  getDefaultPersistableData(): PersistableSessionData {
    return {
      data: {},
    };
  }
}
