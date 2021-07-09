import { JovoResponse } from '@jovotech/output';
import { UserData } from './interfaces';
import { Jovo } from './Jovo';
import { JovoRequest } from './JovoRequest';
import { JovoSession, PersistableSessionData } from './JovoSession';

export type JovoUserConstructor = new () => JovoUser;

export interface PersistableUserData {
  data: UserData;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class JovoUser {
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  $data: UserData = {};

  abstract id: string;

  getPersistableData(): PersistableUserData {
    return {
      data: this.$data,
      createdAt: this.createdAt || undefined,
      updatedAt: this.updatedAt || undefined,
    };
  }

  setPersistableData(data: PersistableUserData): this {
    this.$data = data.data;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    return this;
  }

  getDefaultPersistableData(): PersistableUserData {
    return {
      data: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  toJSON() {
    return { ...this, jovo: undefined };
  }
}
