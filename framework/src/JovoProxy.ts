import { AnyObject, JovoComponentInfo } from './index';
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
    keys.forEach((key) => {
      if (key !== 'jovo' && key !== 'constructor' && key !== '$component') {
        // if the value is a function just return it as a value and not as getter and setter
        const propertyDescriptor: PropertyDescriptor =
          typeof this.jovo[key as keyof Jovo] === 'function'
            ? { value: this.jovo[key as keyof Jovo].bind(this.jovo) }
            : {
                get: () => {
                  return this.jovo[key as keyof Jovo];
                },
                set: (val: unknown) => {
                  (this.jovo as AnyObject)[key] = val;
                },
              };
        Object.defineProperty(this, key, propertyDescriptor);
      }
    });
  }

  get $component(): JovoComponentInfo {
    return this.jovo.$component;
  }

  toJSON(): JovoProxy {
    return { ...this, jovo: undefined };
  }
}
