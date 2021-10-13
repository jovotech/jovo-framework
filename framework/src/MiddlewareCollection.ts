import { ArrayElement, Jovo } from './index';
import { Middleware, MiddlewareFunction } from './Middleware';

export type PossibleMiddlewareNames<MIDDLEWARES extends string[]> = PossibleMiddlewareName<
  ArrayElement<MIDDLEWARES>
>;

export type PossibleMiddlewareName<NAME extends string> = NAME | `after.${NAME}` | `before.${NAME}`;

export class MiddlewareCollection<MIDDLEWARES extends string[] = string[]> {
  readonly middlewares: Record<string, Middleware>;

  constructor(...names: MIDDLEWARES) {
    this.middlewares = names.reduce((middlewares: Record<string, Middleware>, middlewareName) => {
      middlewares[middlewareName] = new Middleware(middlewareName);
      return middlewares;
    }, {});
  }

  get names(): Array<PossibleMiddlewareNames<MIDDLEWARES> | string> {
    return Object.keys(this.middlewares);
  }

  use(name: PossibleMiddlewareNames<MIDDLEWARES>, ...fns: MiddlewareFunction[]): this;
  use(name: string, ...fns: MiddlewareFunction[]): this;
  use(name: string | PossibleMiddlewareNames<MIDDLEWARES>, ...fns: MiddlewareFunction[]): this {
    let middleware = this.get(name);
    if (!middleware) {
      middleware = new Middleware(name);
      this.add(middleware);
    }
    middleware.use(...fns);
    return this;
  }

  add(...names: string[]): this;
  add(...middlewares: Middleware[]): this;
  add(...namesOrMiddlewares: Array<Middleware | string>): this {
    namesOrMiddlewares.forEach((nameOrMiddleware) => {
      if (typeof nameOrMiddleware === 'string') {
        this.middlewares[nameOrMiddleware] = new Middleware(nameOrMiddleware);
      } else {
        this.middlewares[nameOrMiddleware.name] = nameOrMiddleware;
      }
    });
    return this;
  }

  has(name: PossibleMiddlewareNames<MIDDLEWARES>): boolean;
  has(name: string): boolean;
  has(name: string | PossibleMiddlewareNames<MIDDLEWARES>): boolean {
    return !!this.middlewares[name] && this.middlewares[name] instanceof Middleware;
  }

  get<MIDDLEWARE extends PossibleMiddlewareNames<MIDDLEWARES>>(
    name: MIDDLEWARE,
  ): Middleware<MIDDLEWARE> | undefined;
  get<MIDDLEWARE extends string>(name: MIDDLEWARE): Middleware<MIDDLEWARE> | undefined;
  get(name: string | PossibleMiddlewareNames<MIDDLEWARES>): Middleware | undefined {
    return this.middlewares[name];
  }

  remove(...names: PossibleMiddlewareNames<MIDDLEWARES>[]): this;
  remove(...names: string[]): this;
  remove(...names: Array<string | PossibleMiddlewareNames<MIDDLEWARES>>): this {
    names.forEach((name) => {
      if (this.has(name)) {
        delete this.middlewares[name];
      }
    });
    return this;
  }

  clear(): this {
    this.remove(...this.names);
    return this;
  }

  async run(name: PossibleMiddlewareNames<MIDDLEWARES>, jovo: Jovo): Promise<void>;
  async run(name: string, jovo: Jovo): Promise<void>;
  async run(names: PossibleMiddlewareNames<MIDDLEWARES>[], jovo: Jovo): Promise<void>;
  async run(names: string[], jovo: Jovo): Promise<void>;
  async run(
    nameOrNames:
      | string
      | PossibleMiddlewareNames<MIDDLEWARES>
      | Array<string | PossibleMiddlewareNames<MIDDLEWARES>>,
    jovo: Jovo,
  ): Promise<void> {
    const names = typeof nameOrNames === 'string' ? [nameOrNames] : nameOrNames;
    for (const name of names) {
      const beforeName = `before.${name}`;
      if (this.has(beforeName)) {
        await this.run(beforeName, jovo);
      }

      const middleware = this.get(name);
      await middleware?.run(jovo);

      const afterName = `after.${name}`;
      if (this.has(afterName)) {
        await this.run(afterName, jovo);
      }
    }
  }

  disable(...names: PossibleMiddlewareNames<MIDDLEWARES>[]): this;
  disable(...names: string[]): this;
  disable(...names: Array<string | PossibleMiddlewareNames<MIDDLEWARES>>): this {
    names.forEach((name) => {
      const middleware = this.get(name);
      if (middleware) {
        middleware.enabled = false;
      }
    });
    return this;
  }

  enable(...names: PossibleMiddlewareNames<MIDDLEWARES>[]): this;
  enable(...names: string[]): this;
  enable(...names: Array<string | PossibleMiddlewareNames<MIDDLEWARES>>): this {
    names.forEach((name) => {
      const middleware = this.get(name);
      if (middleware) {
        middleware.enabled = true;
      }
    });
    return this;
  }
}
