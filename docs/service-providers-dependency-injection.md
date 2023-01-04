---
title: 'Services, Providers & Dependency Injection'
excerpt: 'Learn how you can add custom providers to your Jovo app using dependency injection.'
url: 'https://www.jovo.tech/docs/service-providers-dependency-injection'
---

# Services, Providers & Dependency Injection

Learn how you can add custom providers to your Jovo app using dependency injection.

## Introduction

To separate business logic from dialogue management (which is usually happening in [components](./components.md) and [output classes](./output-classes.md)), we recommend using service classes. For example, a class called `OrderService` could handle everything related to making orders and interact with an order backend or API:

```typescript
// src/services/OrderService.ts

class OrderService {
  async performOrder() {
    // ...
  }
}
```

All services could be placed in a `services` folder. Component-specific services could also be put in a component subfolder. [Learn more about Jovo project structure](./project-structure.md).

```
📦your-project
 ┣ 📂src
 ┃ ┣ 📂components
 ┃ ┣ 📂output
 ┃ ┣ 📂services
 ┃ ┃ ┣ 📜OrderService.ts
 ┃ ┃ ┗ ...
 ┃ ┣ 📜app.dev.ts
 ┃ ┣ 📜app.ts
 ┃ ┗ ...
 ┗ ...
```

The service can then be instantiated in a component or an output class. Here is an example using the `OrderService` in a handler:

```typescript
// src/components/OrderPizzaComponent.ts

import { OrderService } from './services/OrderService';
// ...

@Component()
class OrderPizzaComponent extends BaseComponent {

  @Intents('ConfirmOrderIntent')
  async confirmOrder() {
    try {
      const orderService = new OrderService();
      await orderService.performOrder();
      // ...
    } catch (e) {
      // ...
    }
  }
}
```

The service could also be instantiated in the `constructor()`. This is helpful if it's used across handlers. [Learn more about component constructors here](./components.md#component-constructor).

```typescript
import { OrderService } from './services/OrderService';
// ...

@Component()
class OrderPizzaComponent extends BaseComponent {
  orderService: OrderService;

  constructor(jovo: Jovo, options: UnknownObject | undefined) {
    super(jovo, options);
    this.orderService = new OrderService(/* options could potentially be passed here */);
  }

  @Intents('ConfirmOrderIntent')
  async confirmOrder() {
    try {
      await this.orderService.performOrder();
      // ...
    } catch (e) {
      // ...
    }
  }
}
```

You could import and instantiate the classes wherever needed. However, this comes with a few drawbacks, depending on your use case:
- You would have to create a lot of instances of services that are used in multiple components and/or output classes.
- It makes it a bit difficult to switch providers based on the [stage](./staging.md) you're in, or to mock API calls in [unit tests](#unit-testing).
- If a service needs access to the `jovo` instance, this would need to be passed at every instantiation.

To solve this, Jovo service providers can be passed to components and output classes using [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection). This feature is inspired by the dependency injection feature of [AngularJS](https://angular.io/guide/dependency-injection) and [NestJS](https://docs.nestjs.com/fundamentals/custom-providers).

To make it possible to automatically instantiate a class with the dependency injection system, you need to annotate it with the [`Injectable()` decorator](https://github.com/jovotech/jovo-framework/blob/v4/latest/framework/src/decorators/Injectable.ts):

```typescript
import { Injectable } from '@jovotech/framework';
// ...

@Injectable()
class OrderService {
  async performOrder() {
    // ...
  }
}
```

You can then add a provider for this type to your [app configuration](./app-config.md):

```typescript
// src/app.ts

import { OrderService } from './services/OrderService';
// ...

const app = new App({
  providers: [
    OrderService,
    // ...
  ],
});
```

You can then access your dependency by adding it to the `constructor()` of a component, an output class, or another `@Injectable()` service itself.
The dependency injection system will then instantiate the class for you and pass it to the constructor:

```typescript
// src/components/OrderPizzaComponent.ts

@Component()
class OrderPizzaComponent extends BaseComponent {
  constructor(
    jovo: Jovo,
    options: UnknownObject | undefined,
    private readonly orderService: OrderService
  ) {
    super(jovo, options);
  }

  @Intents('ConfirmOrderIntent')
  async confirmOrder() {
    try {
      await this.orderService.performOrder();
      // ...
    } catch (e) {
      // ...
    }
  }
}
```

Learn more in the following sections:
- [Dependency Tokens](#dependency-tokens)
- [Providers](#types-of-providers)
- [Dependency Access](#dependency-access)
- [Unit Testing](#unit-testing)
- [Middlewares](#middlewares)


## Dependency Tokens

The dependency injection system uses tokens to identify dependencies. A token can be a `string`, `Symbol`, or class type. 

When a component, output class or a service like `OrderService` is instantiated, constructor parameters will be populated by the dependency injection system. To determine what to inject for a parameter, the dependency injection will identify the dependency token for this parameter.

For parameters declared with a class type or abstract class type, this token can be automatically inferred. In the following example, the dependency token for the `otherService` constructor parameter is the `OtherService` class.

```typescript
class OrderService {
  constructor(readonly otherService: OtherService) {}
}
```

If you want to have more control over the dependency token or if you want to inject values of non-class types, you can use the [`@Inject` decorator](https://github.com/jovotech/jovo-framework/blob/v4/latest/framework/src/decorators/Inject.ts). In the following example, the dependency token for the `apiClient` constructor parameter is `'api_client'`:

```typescript
class OrderService {
  constructor(@Inject('api_client') readonly apiClient: ApiClient) {}
}
```

## Providers

Now that you have declared `OrderService` with multiple constructor parameters, you can tell the dependency injection system what value to inject for each dependency using a provider. 

A provider consists of two properties: A dependency token and information about what to inject for the token, the latter of which depends on what type of provider you are using.

Learn more about providers that can be used with Jovo's dependency injection feature.

- [Class Providers](#class-providers)
- [Value Providers](#value-providers)
- [Factory Providers](#factory-providers)
- [Existing Providers](#existing-providers)

### Class Providers

A provider can inject a class, which will be automatically instantiated by the dependency injection system.

Such a class must be declared with the `@Injectable()` decorator:

```typescript
@Injectable()
class SomeService {
  // ...
}
```

In the [app configuration](./app-config.md), you can then pass the class to the `providers` array.

```typescript
// src/app.ts

import { SomeService } from './services/SomeService';
// ...

const app = new App({
  providers: [
    {
      provide: SomeService,
      useClass: SomeService,
    },
  ],
});
```

Here, `provide` is the dependency token and `useClass` is the concrete class that will be instantiated.
When `provide` and `useClass` are the same, you can also shorten the provider declaration:

```typescript
{
  providers: [
    SomeService,
  ],
}
```

The former notation is especially useful for [unit testing](#unit-testing), where you can inject a mock instance:

```typescript
{
  providers: [
    {
      provide: SomeService,
      useClass: SomeServiceMock,
    },
  ],
}
```

Classes instantiated by the dependency injection system are not singletons. This means that if you inject the same class in multiple places or in later requests, you will get a new instance for each injection.

### Value Providers

You can also use providers to inject values. For example, this can be helpful if you want to inject configuration options.

```typescript
// src/config.ts

export const CONFIG_TOKEN = Symbol('config');
```

```typescript
// src/app.ts

import { CONFIG_TOKEN } from './config.ts';

const app = new App({
  providers: [
    {
      provide: CONFIG_TOKEN,
      useValue: '<SOME-VALUE>'
    }
  ]
});
```

You can then access the value by using the [`Inject()` decorator](https://github.com/jovotech/jovo-framework/blob/v4/latest/framework/src/decorators/Inject.ts):

```typescript
// src/components/OrderPizzaComponent.ts

import { CONFIG_TOKEN }  from '../config.ts';
// ...

@Component()
class OrderPizzaComponent extends BaseComponent {
  constructor(
    jovo: Jovo,
    options: UnknownObject | undefined,
    @Inject(EXAMPLE_TOKEN) private readonly example: string
  ) {
      super(jovo, options);
  }
  // ...
}
```


### Factory Providers

Factory providers can be used to access values of the [Jovo instance](https://www.jovo.tech/docs/jovo-properties).

Here are two examples:

```typescript
// src/config.ts

export const APP_CONFIG_TOKEN = Symbol('AppConfig');
```

```typescript
import { App, Jovo, JovoUser } from '@jovotech/framework';
import { APP_CONFIG_TOKEN } from './config.ts';
// ...

const app = new App({
  providers: [
    {
      provide: APP_CONFIG_TOKEN,
      useFactory: (jovo: Jovo) => jovo.$config,
    },
    {
      provide: JovoUser,
      useFactory: (jovo: Jovo) => jovo.$user,
    }
  ]
});
```

In a component or output class `constructor()`, you could then access them like this:

```typescript
import { JovoUser, Inject, AppConfig } from '@jovotech/framework';
import { APP_CONFIG_TOKEN } from '../config.ts';
// ...

constructor(
  @Inject(APP_CONFIG_TOKEN) readonly config: AppConfig,
  readonly user: JovoUser
) {}
```

The example above shows that you can use both Symbols and abstract classes as dependency tokens.

Like class providers, factory providers are not cached. This means that the factory method is re-evaluated for each injection.

### Existing Providers

Existing providers can be used to create an alias for a dependency token. This can for example be useful in situations where you want to narrow an interface:

```typescript
export interface OrderConfig {
  // ...
}

export interface SomeOtherConfig {
  // ...
}

export interface AppConfig extends OrderConfig, SomeOtherConfig {
  // ...
}

@Injectable()
class OrderService {
  constructor(
    @Inject('OrderConfig') readonly config: OrderConfig
  ) {}
}

const app = new App({
  providers: [
    OrderService,
    {
      provide: 'AppConfig',
      useValue: loadAppConfig(),
    },
    {
      provide: 'OrderConfig',
      useExisting: 'AppConfig',
    }
  ]
});
```

In this case, the order service does not need to know about the `SomeOtherConfig` interface. It only needs to know about the `OrderConfig` interface and dependency token.


## Dependency Access

Dependencies can be accessed using parameters of the `constructor()` in Components, Output Classes and Injectables.

In components and output classes, parameters after the `Jovo` instance and the component `options` are resolved by the dependency injection system:

```typescript
// src/components/OrderPizzaComponent.ts

import { Jovo, BaseComponent } from '@jovotech/framework';
import { UnknownObject } from '@jovotech/common';
import { OrderService } from '../services/OrderService.ts';
// ...

@Component()
class OrderPizzaComponent extends BaseComponent {
  constructor(
    jovo: Jovo,
    options: UnknownObject | undefined,
    private readonly orderService: OrderService
  ) {
    super(jovo, options);
  }

  @Intents('ConfirmOrderIntent')
  async confirmOrder() {
    try {
      await this.orderService.performOrder();
      // ...
    } catch (e) {
      // ...
    }
  }
}
```

```typescript
// src/output/ExampleOutput.ts

import { BaseOutput, Output, Jovo, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { DeepPartial } from '@jovotech/common';
import { ExampleService } from '../services/ExampleService.ts';
// ...

@Output()
class ExampleOutput extends BaseOutput {
  constructor(
    jovo: Jovo,
    options: DeepPartial<OutputOptions> | undefined,
    readonly exampleService: ExampleService,
  ) {
    super(jovo, options);
  }

  build(): OutputTemplate | OutputTemplate[] {
    return {
      message: this.exampleService.getMessage(),
    };
  }
}
```

In Injectables, all parameters are resolved by the dependency injection system. 

Besides all dependencies for which you defined providers, you can also access the `Jovo` instance, which is made accessible through a `systemProvider`:

```typescript
// src/services/SomeService.ts

import { Injectable, Jovo } from '@jovotech/framework';
// ...

@Injectable()
class SomeService {
  constructor(readonly someOtherService: OtherService, jovo: Jovo) {}
}
```


## Unit Testing

Dependency injection makes it possible to mock services for [unit testing](./unit-testing.md).

Below is an example how this can be done using [class providers](#class-providers):

```typescript
const testSuite = new TestSuite();

testSuite.$app.configure({providers: [{
  provide: OrderService,
  useClass: MockOrderService,
}]})
```

## Middlewares

To understand the dependency resolution process, you can declare an `event.DependencyInjector.instantiateDependency` middleware.

```typescript
app.middlewareCollection.use(
  'event.DependencyInjector.instantiateDependency',
  (jovo: Jovo, dependencyTree: DependencyTree<any>) => { 
    //... 
  },
);
```
