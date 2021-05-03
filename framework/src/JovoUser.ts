import { JovoResponse } from '@jovotech/output';
import { UserData } from './interfaces';
import { Jovo } from './Jovo';
import { JovoRequest } from './JovoRequest';

export type JovoUserConstructor<
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE>
> = new (jovo: JOVO) => JovoUser<REQUEST, RESPONSE, JOVO>;

export interface PersistableUserData {
  data: UserData;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class JovoUser<
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE>
> {
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  $data: UserData = {};

  constructor(readonly jovo: JOVO) {}

  abstract id: string;

  getPersistableData(): PersistableUserData {
    return {
      data: this.$data,
      createdAt: this.createdAt || undefined,
      updatedAt: this.updatedAt || undefined,
    };
  }

  setPersistableData(data: PersistableUserData): void {
    this.$data = data.data;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
  }

  get defaultPersistableData(): PersistableUserData {
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
