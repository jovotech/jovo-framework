import { UserData } from './interfaces';

export type JovoUserConstructor = new () => JovoUser;

export interface PersistableUserData {
  data: UserData;
}

export abstract class JovoUser {
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  $data: UserData = {};

  abstract id: string;

  isNew = true;

  getPersistableData(): PersistableUserData {
    return {
      data: this.$data,
    };
  }

  setPersistableData(data?: PersistableUserData): this {
    this.$data = data?.data || {};
    return this;
  }

  getDefaultPersistableData(): PersistableUserData {
    return {
      data: {},
    };
  }

  toJSON() {
    return { ...this, jovo: undefined };
  }
}
