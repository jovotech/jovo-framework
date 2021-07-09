import { JovoResponse } from '@jovotech/output';
import { UserData } from './interfaces';
import { Jovo } from './Jovo';
import { JovoRequest } from './JovoRequest';

export type JovoUserConstructor<
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE>,
> = new (jovo: JOVO) => JovoUser<REQUEST, RESPONSE, JOVO>;

export interface PersistableUserData {
  data: UserData;
}

export abstract class JovoUser<
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE>,
> {
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  $data: UserData = {};

  constructor(readonly jovo: JOVO) {}

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

  toJSON(): JovoUser<REQUEST, RESPONSE, JOVO> {
    return { ...this, jovo: undefined };
  }
}
