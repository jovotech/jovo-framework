import { Jovo } from './Jovo';

export class JovoProxy extends Jovo {
  constructor(public jovo: Jovo) {
    super(jovo.$app, jovo.$handleRequest, jovo.$platform);
    this.overwritePropertiesToPropagateChangesToJovo();
  }

  // Make `this[key]` reference `this.jovo[key]` for every `key` in `this.jovo`.
  // Without, mutations of `this` would not affect `this.jovo`.
  private overwritePropertiesToPropagateChangesToJovo() {
    const keySet = new Set<string>();
    Object.getOwnPropertyNames(Jovo.prototype).forEach((key) => keySet.add(key));
    Object.keys(this.jovo).forEach((key) => keySet.add(key));
    const keys = Array.from(keySet);
    const indexOfConstructor = keys.indexOf('constructor');
    if (indexOfConstructor >= 0) {
      keys.splice(indexOfConstructor, 1);
    }
    keys.forEach((key) => {
      if (key !== 'jovo') {
        Object.defineProperty(this, key, {
          get() {
            return typeof this.jovo[key] === 'function'
              ? (this.jovo[key] as (...args: unknown[]) => unknown).bind(this.jovo)
              : this.jovo[key];
          },
          set(val: unknown) {
            this.jovo[key] = val;
          },
        });
      }
    });
  }

  hasScreenInterface(): boolean {
    return this.jovo.hasScreenInterface();
  }

  toJSON() {
    return { ...this, jovo: undefined };
  }
}
