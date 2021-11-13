import { Log } from '../util/Log';

export enum ErrorCode {
  ERR = 'ERR',
  ERR_PLUGIN = 'ERR_PLUGIN',
}

export class JovoError extends Error {
  /**
   * Prints JovoError instance in an uniformed style.
   * @param {JovoError} e
   */
  static printError(e: JovoError) {
    Log.red().error(Log.header('Error'));

    if (e.code) {
      Log.error('Code:');
      Log.error(e.code);
      Log.error();
    }
    Log.error('Message:');
    Log.error(e.message);

    if (e.stack) {
      Log.error();
      Log.error('Stack:');
      Log.error(e.stack);
    }
    if (e.message.indexOf('is not a function') > -1) {
      e.hint =
        'This might be an issue with upgrading the Jovo packages. Try to run `jovo update` instead of `npm install`';
      e.seeMore = 'https://v3.jovo.tech/docs/installation/upgrading';
    }

    if (e.module) {
      Log.error();
      Log.error('Module:');
      Log.error(e.module);
    }

    if (e.details) {
      Log.error();
      Log.error('Details:');
      Log.error(e.details);
    }

    if (e.hint) {
      Log.error();
      Log.error('Hint:');
      Log.error(e.hint);
    }

    if (e.seeMore) {
      Log.error();
      Log.error('Learn more:');
      Log.error(e.seeMore);
    }

    Log.red().error(Log.header());
  }

  code: ErrorCode | string = ErrorCode.ERR;
  module: string | undefined;
  details: string | undefined;
  hint: string | undefined;
  seeMore: string | undefined;

  constructor(
    message: string,
    code: ErrorCode | string = ErrorCode.ERR,
    module?: string,
    details?: string,
    hint?: string,
    seeMore?: string,
  ) {
    super(message);
    this.module = module;
    this.details = details;
    this.hint = hint;
    this.code = code;
    this.seeMore = seeMore;
  }
}
