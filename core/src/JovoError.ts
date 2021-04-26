export interface JovoErrorOptions {
  [key: string]: unknown;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
  details?: string;
  hint?: string;
  learnMore?: string;
  name?: string;
}

export class JovoError extends Error {
  [key: string]: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
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
  toJSON() {
    return this.message;
  }
}
