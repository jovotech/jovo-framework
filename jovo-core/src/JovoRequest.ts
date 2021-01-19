import { JovoRequestType } from './Jovo';

export abstract class JovoRequest {
  [key: string]: unknown;

  abstract getRequestType(): JovoRequestType | undefined;
}
