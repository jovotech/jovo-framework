import { JovoError, JovoErrorOptions } from '@jovotech/framework';

export enum AlexaApiErrorCode {
  PARSE_ERROR = 'PARSE_ERROR',
  ACCESS_NOT_REQUESTED = 'ACCESS_NOT_REQUESTED',
  NO_USER_PERMISSION = 'NO_USER_PERMISSION',
  NO_SKILL_PERMISSION = 'NO_SKILL_PERMISSION',
  LIST_NOT_FOUND = 'LIST_NOT_FOUND',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  ERROR = 'ERROR',
}

export interface AlexaApiErrorOptions extends JovoErrorOptions {
  code: AlexaApiErrorCode;
}

export class AlexaApiError extends JovoError {
  constructor(options: AlexaApiErrorOptions) {
    super(options);
  }
}
