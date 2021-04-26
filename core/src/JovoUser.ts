import { JovoResponse } from '@jovotech/output';
import { PersistableSessionData, SessionData, StateStack, UserData } from '.';
import { Jovo } from './Jovo';
import { JovoRequest } from './JovoRequest';

export type JovoUserConstructor<REQUEST extends JovoRequest, RESPONSE extends JovoResponse> = new (
  jovo: Jovo<REQUEST, RESPONSE>,
) => JovoUser<REQUEST, RESPONSE>;

export interface PersistableUserData {
  data: UserData;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class JovoUser<REQUEST extends JovoRequest, RESPONSE extends JovoResponse> {
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  $data: UserData = {};

  constructor(readonly jovo: Jovo<REQUEST, RESPONSE>) {}

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
}
