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

  constructor(options: JovoErrorOptions) {
    super(options.message);
    this.name = options.name || this.constructor.name;

    if (options.package) {
      this.package = options.package;
    }
    if (options.context) {
      this.context = options.context;
    }
    if (options.hint) {
      this.hint = options.hint;
    }
    if (options.learnMore) {
      this.learnMore = options.learnMore;
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
