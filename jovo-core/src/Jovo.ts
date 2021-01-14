import { GenericOutput } from 'jovo-output';
import { JovoRequest } from './JovoRequest';
import { JovoResponse } from './JovoResponse';
import { Platform } from './Platform';

export abstract class Jovo<
  REQ extends JovoRequest = JovoRequest,
  RES extends JovoResponse = JovoResponse
> {
  $response?: RES;
  $output: GenericOutput = {};

  constructor(readonly platform: Platform<REQ, RES>) {}
}
