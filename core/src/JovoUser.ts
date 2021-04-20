import { JovoResponse } from '@jovotech/output';
import { UserData } from '.';
import { Jovo } from './Jovo';
import { JovoRequest } from './JovoRequest';

export type JovoUserConstructor<REQUEST extends JovoRequest, RESPONSE extends JovoResponse> = new (
  jovo: Jovo<REQUEST, RESPONSE>,
) => JovoUser<REQUEST, RESPONSE>;

export abstract class JovoUser<REQUEST extends JovoRequest, RESPONSE extends JovoResponse> {
  $data: UserData = {};

  constructor(readonly jovo: Jovo<REQUEST, RESPONSE>) {}

  abstract id: string;
}
