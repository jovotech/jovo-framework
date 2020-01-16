import { Log } from '..';
import { Extensible } from './Extensible';

export class Middleware {
  fns: Function[];
  name: string;
  parent: Extensible;
  enabled = true;

  constructor(name: string, parent: Extensible) {
    this.name = name;
    this.parent = parent;
    this.fns = [];
  }

  /**
   * Adds function to middleware array
   * @param {Function[]} fns
   * @returns {this}
   */
  use(...fns: Function[]) {
    this.fns = this.fns.concat(fns);
    return this;
  }

  /**
   * Removes function from functions array
   * @param {Function} fn
   */
  remove(fn: Function) {
    this.fns = this.fns.filter((fnItem: Function) => {
      return fnItem !== fn;
    });
  }

  /**
   * Calls every function from the functions array.
   * Also checks for a 'before' middleware and calls it.
   * @emits middleware name
   * @param {any} obj
   * @param {boolean} concurrent
   * @return {Promise<void>}
   */
  // tslint:disable-next-line:no-any
  async run(obj: any, concurrent = false) {
    try {
      const isExcluded =
        obj && obj.excludedMiddlewareNames
          ? obj.excludedMiddlewareNames.includes(this.name)
          : false;
      if (!this.parent.config.enabled || !this.enabled || isExcluded) {
        return Promise.resolve();
      }

      // LOGGING
      if (this.parent.constructor.name === 'App') {
        if (this.fns.length > 0 || this.parent.listeners(this.name).length > 0) {
          Log.debugStart(`-- middleware '${this.name}' done`);
        }
      }
      // before middleware available?
      if (this.parent.hasMiddleware(`before.${this.name}`)) {
        await this.parent.middleware(`before.${this.name}`)!.run(obj);
      } else {
        this.parent.emit(`before.${this.name}`, obj);
      }

      if (concurrent) {
        const promiseArr = [];
        for (const fn of this.fns) {
          promiseArr.push(
            new Promise(async (resolve, reject) => {
              try {
                await fn.apply(null, arguments);
                resolve();
              } catch (e) {
                reject(e);
              }
            }),
          );
        }
        await Promise.all(promiseArr);
      } else {
        for (const fn of this.fns) {
          await fn.apply(null, arguments);
        }
      }

      this.parent.emit(`${this.name}`, obj);

      // after middleware available?
      if (this.parent.hasMiddleware(`after.${this.name}`)) {
        await this.parent.middleware(`after.${this.name}`)!.run(obj);
      } else {
        this.parent.emit(`after.${this.name}`, obj);
      }

      // LOGGING
      if (this.parent.constructor.name === 'App') {
        if (this.fns.length > 0 || this.parent.listeners(this.name).length > 0) {
          Log.debug();
          Log.debugEnd(`-- middleware '${this.name}' done`);
        }
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Disables middleware
   */
  disable() {
    this.enabled = false;
  }

  /**
   * Disables middleware
   */
  skip() {
    this.enabled = false;
  }
}
