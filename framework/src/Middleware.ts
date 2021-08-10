// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MiddlewareFunction<T extends unknown[] = any[]> = (
  ...args: T
) => Promise<unknown> | unknown;

export class Middleware<NAME extends string = string> {
  readonly fns: MiddlewareFunction[];
  enabled = true;

  constructor(readonly name: NAME) {
    this.fns = [];
  }

  use(...fns: MiddlewareFunction[]): this {
    this.fns.push(...fns);
    return this;
  }

  async run<T extends unknown[]>(...args: T): Promise<void> {
    if (!this.enabled) {
      return;
    }
    for (let i = 0, len = this.fns.length; i < len; i++) {
      await this.fns[i].apply(null, args);
    }
  }

  remove(fn: MiddlewareFunction): this {
    const index = this.fns.indexOf(fn);
    if (index >= 0) {
      this.fns.splice(index, 1);
    }
    return this;
  }
}
