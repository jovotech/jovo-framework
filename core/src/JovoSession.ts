import { SessionData, StateStack } from './interfaces';

export interface PersistableSessionData {
  data: SessionData;
  state?: StateStack;
  createdAt: Date;
  updatedAt: Date;
}

export class JovoSession {
  [key: string]: unknown;

  $data: SessionData;
  $state?: StateStack;

  isNew = true;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: JovoSession) {
    this.$data = data?.$data || {};
    this.$state = data?.$state;
    this.createdAt = data?.createdAt || new Date();
    this.updatedAt = data?.updatedAt || new Date();
  }

  getPersistableData(): PersistableSessionData {
    return {
      data: this.$data,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      state: this.$state,
    };
  }

  setPersistableData(data: PersistableSessionData): void {
    this.$data = data.data;
    this.$state = data.state;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
  }

  get defaultPersistableData(): PersistableSessionData {
    return {
      data: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
