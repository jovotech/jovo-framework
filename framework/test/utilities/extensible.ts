import { Extensible, ExtensibleConfig, MiddlewareCollection } from '../../src';

export class EmptyExtensible extends Extensible {
  getDefaultConfig(): ExtensibleConfig {
    return {};
  }

  initializeMiddlewareCollection(): MiddlewareCollection<string[]> {
    return new MiddlewareCollection();
  }
}

export interface ExampleExtensibleConfig extends ExtensibleConfig {
  text: string;
}

export class ExampleExtensible extends Extensible<ExampleExtensibleConfig> {
  getDefaultConfig(): ExampleExtensibleConfig {
    return {
      text: 'default',
    };
  }

  initializeMiddlewareCollection(): MiddlewareCollection<string[]> {
    return new MiddlewareCollection();
  }
}

export class AppLikeExtensible extends Extensible {
  getDefaultConfig(): ExtensibleConfig {
    return {};
  }

  initializeMiddlewareCollection(): MiddlewareCollection<string[]> {
    return new MiddlewareCollection();
  }

  mount(): Promise<void> | void {
    return this.mountPlugins();
  }

  initialize(): Promise<void> {
    return this.initializePlugins();
  }
}
