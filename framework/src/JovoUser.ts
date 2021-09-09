import { UserData } from './interfaces';
import { Jovo } from './Jovo';

export type JovoUserConstructor<JOVO extends Jovo> = new (jovo: JOVO) => JOVO['$user'];

export interface PersistableUserData {
  data: UserData;
}

export abstract class JovoUser<JOVO extends Jovo = Jovo> {
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  data: UserData = {};

  constructor(readonly jovo: JOVO) {}

  abstract id: string;

  isNew = true;

  getPersistableData(): PersistableUserData {
    return {
      data: this.data,
    };
  }

  setPersistableData(data?: PersistableUserData): this {
    this.data = data?.data || {};
    return this;
  }

  toJSON(): JovoUser<JOVO> {
    return { ...this, jovo: undefined };
  }
}
