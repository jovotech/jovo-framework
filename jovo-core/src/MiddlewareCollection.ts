import { Middleware } from './Middleware';

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

export class MiddlewareCollection<N extends string[] = string[]> {
  readonly middlewares: Record<string, Middleware>;

  constructor(...names: N) {
    this.middlewares = {};
    for (let i = 0, len = names.length; i < len; i++) {
      this.middlewares[names[i]] = new Middleware(names[i]);
    }
  }

  add(name: string): void;
  add(middleware: Middleware): void;
  add(nameOrMiddleware: Middleware | string): void {
    if (typeof nameOrMiddleware === 'string') {
      this.middlewares[nameOrMiddleware] = new Middleware(nameOrMiddleware);
    } else {
      this.middlewares[nameOrMiddleware.name] = nameOrMiddleware;
    }
  }

  has<M extends ArrayElement<N>>(name: M): boolean;
  has<M extends string>(name: M): boolean;
  has(name: string): boolean {
    return !!this.middlewares[name] && this.middlewares[name] instanceof Middleware;
  }

  get<M extends ArrayElement<N>>(name: M): Middleware<M> | undefined;
  get<M extends string>(name: M): Middleware<M> | undefined;
  get(name: string): Middleware | undefined {
    return this.middlewares[name];
  }

  remove<M extends ArrayElement<N>>(name: M): void;
  remove<M extends string>(name: M): void;
  remove(name: string): void {
    if (this.has(name)) {
      delete this.middlewares[name];
    }
  }

  // TODO determine better type for data
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async run<M extends ArrayElement<N>, T extends any[]>(name: M, ...args: T): Promise<void>;
  async run<M extends string, T extends any[]>(name: M, ...args: T): Promise<void>;
  async run<T extends any[]>(name: string, ...args: T): Promise<void> {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const middleware = this.get(name);
    if (!middleware) {
      return;
    }
    const beforeName = `before.${name}`;
    if (this.has(beforeName)) {
      await this.run(beforeName, ...args);
    }

    await middleware.run(...args);

    const afterName = `after.${name}`;
    if (this.has(afterName)) {
      await this.run(afterName, ...args);
    }
  }

  clone(): MiddlewareCollection<N> {
    const collection = new MiddlewareCollection<N>(...(Object.keys(this.middlewares) as N));
    for (const name in this.middlewares) {
      if (this.middlewares.hasOwnProperty(name)) {
        collection.middlewares[name].fns.push(...this.middlewares[name].fns);
        collection.middlewares[name].enabled = this.middlewares[name].enabled;
      }
    }
    return collection;
  }
}
