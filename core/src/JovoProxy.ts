import { Jovo } from './Jovo';

export class JovoProxy extends Jovo {
  constructor(public jovo: Jovo) {
    super(jovo.$app, jovo.$handleRequest, jovo.$platform);
    this.overwritePropertiesToPropagateChangesToJovo();
  }

  // Make `this[key]` reference `this.jovo[key]` for every `key` in `this.jovo`.
  // Without, mutations of `this` would not affect `this.jovo`.
  private overwritePropertiesToPropagateChangesToJovo() {
    // TODO: check if functions should be ignored
    for (const key in this.jovo) {
      if (
        key !== 'jovo' &&
        this.jovo.hasOwnProperty(key) &&
        typeof this.jovo[key as keyof Jovo] !== 'function' &&
        this[key as keyof Jovo]
      ) {
        Object.defineProperty(this, key, {
          get() {
            return this.jovo[key];
          },
          set(val: unknown) {
            this.jovo[key] = val;
          },
        });
      }
    }
  }
}
