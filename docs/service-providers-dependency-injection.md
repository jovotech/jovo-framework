---
title: 'Services, Providers & Dependency Injection'
excerpt: ''
url: 'https://www.jovo.tech/docs/services-providers-dependency-injection'
---

# Services, Providers & Dependency Injection

Learn how you can add custom providers to your Jovo app by using dependency injection.

## Introduction

To separate business logic from dialogue management (which is usually happening in [components](./components.md) and [output classes](./output-classes.md)), we recommend using service classes. For example, a class called `OrderService` could handle everything related to making orders and interact with an order backend or API.

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

The service could also be instantiated in the `constructor()`. This is helpful if it's used across handlers.

```typescript
import { OrderService } from './services/OrderService';
// ...

@Component()
class OrderPizzaComponent extends BaseComponent {
  orderService: OrderService;

  constructor(jovo: Jovo, options: UnknownObject) {
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
- It makes it a bit difficult to switch providers based on the [stage](./staging.md) you're in, or to mock API calls in [unit testing](./unit-testing.md).
- If a service needs access to the `jovo` instance, this would need to be passed at every instantiation.

To solve this, Jovo service providers can be passed to components and output classes using [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection). This feature is inspired by the dependency injection feature of [NestJS](https://docs.nestjs.com/fundamentals/custom-providers).

You can create a provider by adding the [`Injectable()` decorator](https://github.com/jovotech/jovo-framework/blob/v4/latest/framework/src/decorators/Injectable.ts) to a class:

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

You can then add providers to your [app configuration](./app-config.md):

```typescript
// src/app.ts

import { OrderService } from './services/OrderService';
// ...

const app = new App({
  providers: [
    OrderService,
    // ...
  ]
});
```

This will instantiate the class and pass the instance to your components and output classes. By adding the service to the `constructor()`, you can then access it:

```typescript
// src/components/OrderPizzaComponent.ts

@Component()
class OrderPizzaComponent extends BaseComponent {
  constructor(jovo: Jovo, options: UnknownObject, private readonly orderService: OrderService) {
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
- [Types of Providers](#types-of-providers)
- [Unit Testing](#unit-testing)
- [Middlewares](#middlewares)


## Types of Providers

Learn more about providers that can be used with Jovo's dependency injection feature.

- [Class Providers](#class-providers)
- [Value Providers](#value-providers)
- [Factory Providers](#factory-providers)

#### Class Providers

You can mark a class as a provider by adding the [`Injectable()` decorator](https://github.com/jovotech/jovo-framework/blob/v4/latest/framework/src/decorators/Injectable.ts):

```typescript
// src/services/SomeService.ts

import { Injectable } from '@jovotech/framework';
// ...

@Injectable()
class SomeService {
  // ...
}
```

In the `constructor()`, you can acess both the `jovo` instance (which is a `systemProvider`) and all other injected providers (`OtherService` in the example below):

```typescript
// src/services/SomeService.ts

import { Injectable, Jovo } from '@jovotech/framework';
// ...

@Injectable()
class SomeService {
  constructor(readonly someOtherService: OtherService, jovo: Jovo) {}
}
```

In the [app configuration](./app-config.md), you can then pass the class to the `providers` array.

```typescript
// src/app.ts

import { SomeService } from './services/SomeService';
import { OtherService } from './services/OtherService';
// ...

const app = new App({
  providers: [
    SomeService,
    OtherService,
    // ...
  ]
});
```

Alternatively (for example for [unit testing](#unit-testing)), you can also use the `useClass` option to provide a different class:

```typescript
{
  providers: [
    {
      provide: OrderService,
      useClass: MockOrderService,
    },
    // ...
  ]
}
```


#### Value Providers

You can also use providers to inject values. For example, this can be helpful if you want to inject different values for different [stages](./staging.md) or for [unit testing](#unit-testing).

```typescript
export const EXAMPLE_TOKEN = Symbol('example');
// ...

const app = new App({
  {
    provide: EXAMPLE_TOKEN,
    useValue: '<SOME-VALUE>',
  }
});
```

Provider tokens can be:
- `Symbol`
- A `string` value
- A class
- An abstract class

You can access the value by using the [`Inject()`](https://github.com/jovotech/jovo-framework/blob/v4/latest/framework/src/decorators/Inject.ts) decorator:

```typescript
// src/components/OrderPizzaComponent.ts

import { EXAMPLE_TOKEN }  from '../app.ts';
// ...

@Component()
class OrderPizzaComponent extends BaseComponent {
  constructor(
    jovo: Jovo,
    options: UnknownObject
    @Inject(EXAMPLE_TOKEN) private readonly example: string
  ) {
      super(jovo, options);
  }
  // ...
}
```


#### Factory Providers

Factory providers can be used to access values of the [Jovo instance](https://www.jovo.tech/docs/jovo-properties).

Here are two examples:

```typescript
import { JovoUser } from '@jovotech/framework';
// ...

export const APP_CONFIG_TOKEN = Symbol('AppConfig');
// ...

const app = new App({
  {
    provide: APP_CONFIG_TOKEN,
    useFactory: (jovo: Jovo) => jovo.$config,
  },
  {
    provide: JovoUser,
    useFactory: (jovo: Jovo) => jovo.$user,
  }
});
```

In a component or output class `constructor()`, you could then access them like this:

```typescript
import { JovoUser, Inject, AppConfig } from '@jovotech/framework';
import { APP_CONFIG_TOKEN } from '../app.ts';
// ...

constructor(
  @Inject(APP_CONFIG_TOKEN) readonly config: AppConfig,
  readonly user: JovoUser
) {}
```

The example above shows that you can pass both tokens (see [value providers](#value-providers)) as well as classes (see [class providers](#class-providers)) using the `provide` option.


### Provider Access

- [In Components](#in-components)
- [In Output Classes](#in-output-classes)
- [In Providers](#in-providers)

#### In Components

In a [Jovo component](./components.md), you can access the instance using the component's `constructor()`:

```typescript
// src/components/OrderPizzaComponent.ts

import { Jovo, BaseComponent } from '@jovotech/framework';
import { UnknownObject } from '@jovotech/common';
import { OrderService } from '../services/OrderService.ts';
// ...

@Component()
class OrderPizzaComponent extends BaseComponent {
  constructor(jovo: Jovo, options: UnknownObject, private readonly orderService: OrderService) {
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

#### In Output Classes

In a [Jovo output class](./output-classes.md), you can access the instance using its `constructor()`:

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

### In Providers

In the `constructor()` of a provider class, you can acess both the `jovo` instance (which is a `systemProvider`) and all other injected providers (`OtherService` in the example below):

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
testSuite.app.configure({providers: [{
  provide: OrderService,
  useClass: MockOrderService,
}]})
```

## Middlewares

```typescript
app.middlewareCollection.use(
  'event.DependencyInjector.instantiateDependency',
  (jovo: Jovo, dependencyTree: DependencyTree<any>) => { 
    //... 
  },
);
```