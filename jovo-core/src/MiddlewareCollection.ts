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

  add(...names: string[]): this;
  add(...middlewares: Middleware[]): this;
  add(...namesOrMiddlewares: Array<Middleware | string>): this {
    for (let i = 0, len = namesOrMiddlewares.length; i < len; i++) {
      const nameOrMiddleware = namesOrMiddlewares[i];
      if (typeof nameOrMiddleware === 'string') {
        this.middlewares[nameOrMiddleware] = new Middleware(nameOrMiddleware);
      } else {
        this.middlewares[nameOrMiddleware.name] = nameOrMiddleware;
      }
    }
    return this;
  }

  has(name: ArrayElement<N>): boolean;
  has(name: string): boolean;
  has(name: string | ArrayElement<N>): boolean {
    return !!this.middlewares[name] && this.middlewares[name] instanceof Middleware;
  }

  get<M extends ArrayElement<N>>(name: M): Middleware<M> | undefined;
  get<M extends string>(name: M): Middleware<M> | undefined;
  get(name: string | ArrayElement<N>): Middleware | undefined {
    return this.middlewares[name];
  }

  remove(...names: ArrayElement<N>[]): this;
  remove(...names: string[]): this;
  remove(...names: Array<string | ArrayElement<N>>): this {
    for (let i = 0, len = names.length; i < len; i++) {
      if (this.has(names[i])) {
        delete this.middlewares[names[i]];
      }
    }
    return this;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async run<T extends any[]>(name: ArrayElement<N>, ...args: T): Promise<void>;
  async run<T extends any[]>(name: string, ...args: T): Promise<void>;
  async run<T extends any[]>(name: string | ArrayElement<N>, ...args: T): Promise<void> {
    /*  eslint-enable @typescript-eslint/no-explicit-any */
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

  disable(...names: ArrayElement<N>[]): this;
  disable(...names: string[]): this;
  disable(...names: Array<string | ArrayElement<N>>): this {
    for (let i = 0, len = names.length; i < len; i++) {
      const middleware = this.get(names[i]);
      if (middleware) {
        middleware.enabled = false;
      }
    }
    return this;
  }

  enable(...names: ArrayElement<N>[]): this;
  enable(...names: string[]): this;
  enable(...names: Array<string | ArrayElement<N>>): this {
    for (let i = 0, len = names.length; i < len; i++) {
      const middleware = this.get(names[i]);
      if (middleware) {
        middleware.enabled = true;
      }
    }
    return this;
  }
}
