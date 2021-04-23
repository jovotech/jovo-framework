import { JovoResponse } from '@jovotech/output';
import { Jovo } from './Jovo';
import { JovoRequest } from './JovoRequest';

export type JovoUserConstructor<
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE>
> = new (jovo: JOVO) => JovoUser<REQUEST, RESPONSE, JOVO>;

export abstract class JovoUser<
  REQUEST extends JovoRequest,
  RESPONSE extends JovoResponse,
  JOVO extends Jovo<REQUEST, RESPONSE>
> {
  constructor(readonly jovo: JOVO) {}
}
