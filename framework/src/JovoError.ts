import { AnyObject } from './index';

export interface JovoErrorOptions {
  [key: string]: unknown;
  message: string;
  context?: AnyObject;
  details?: string;
  hint?: string;
  learnMore?: string;
  name?: string;
}

export class JovoError extends Error {
  [key: string]: unknown;
  context?: AnyObject;
  details?: string;
  hint?: string;
  learnMore?: string;

  constructor(options: JovoErrorOptions) {
    super(options.message);
    for (const key in options) {
      if (!['message', 'name'].includes(key) && options.hasOwnProperty(key) && options[key]) {
        this[key] = options[key];
      }
    }
    this.name = options.name || this.constructor.name;
  }

  // Used by JSON.stringify
  toJSON(): JovoError {
    return {
      ...this,
      message: this.message,
    };
  }
}
