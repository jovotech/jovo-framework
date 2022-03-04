import { AnyObject } from './index';

export interface JovoErrorOptions {
  message: string;
  name?: string;

  package?: string;
  context?: AnyObject;
  hint?: string;
  learnMore?: string;
}

export class JovoError extends Error {
  package?: string;
  context?: AnyObject;
  hint?: string;
  learnMore?: string;

  constructor(messageOrOptions: string | JovoErrorOptions) {
    super(typeof messageOrOptions === 'string' ? messageOrOptions : messageOrOptions.message);

    if (typeof messageOrOptions === 'string') {
      this.name = this.constructor.name;
    } else {
      this.name = messageOrOptions.name || this.constructor.name;

      if (messageOrOptions.package) {
        this.package = messageOrOptions.package;
      }
      if (messageOrOptions.context) {
        this.context = messageOrOptions.context;
      }
      if (messageOrOptions.hint) {
        this.hint = messageOrOptions.hint;
      }
      if (messageOrOptions.learnMore) {
        this.learnMore = messageOrOptions.learnMore;
      }
    }
  }

  // Used by JSON.stringify.
  toJSON(): JovoError {
    return {
      ...this,
      message: this.message,
    };
  }
}
