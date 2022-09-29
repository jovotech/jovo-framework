---
title: 'Components'
excerpt: 'Learn more about Jovo Components, which are self-contained and reusable elements in a Jovo app.'
---

# Components

Components are self-contained and reusable elements in a Jovo app that handle the conversational flow. Similar to web frameworks like Vue and React, Jovo allows you to build complex applications composed of components of varying sizes.

## Introduction

You can see a component as an isolated part of your app that handles a specific task. It could be something small like asking for a confirmation (yes or no), and something bigger like collecting all necessary information for a restaurant table reservation. For larger cases like the latter example, it's also possible for a component to have multiple subcomponents.

```
📦src
 ┣ 📂components
 ┃ ┣ 📜GlobalComponent.ts
 ┃ ┣ 📜LoveHatePizzaComponent.ts
 ┃ ┗ ...
```

Components are located in the `src/components` folder of a Jovo app. While a component can be a [complete folder](./project-structure.md#components) (that may contain its own [output classes](./output-classes.md), subcomponents, and more), the most common approach to get started is to have single component classes.

For example, the [Jovo `v4` template](https://github.com/jovotech/jovo-v4-template) contains a [`GlobalComponent`](https://github.com/jovotech/jovo-v4-template/blob/master/src/components/GlobalComponent.ts) that looks like this:

```typescript
// src/components/GlobalComponent.ts

import { Component, BaseComponent, Global } from '@jovotech/framework';
import { LoveHatePizzaComponent } from './LoveHatePizzaComponent';

/*
|--------------------------------------------------------------------------
| Global Component
|--------------------------------------------------------------------------
|
| The global component handlers can be reached from anywhere in the app
| Learn more here: www.jovo.tech/docs/components#global-components
|
*/
@Global()
@Component()
export class GlobalComponent extends BaseComponent {
  LAUNCH() {
    return this.$redirect(LoveHatePizzaComponent);
  }
}
```

The [component class](#component-class) section dives deeper into the contents of the example above.

Root components like `GlobalComponent` are [registered](#component-registration) in the `app.ts` ([example](https://github.com/jovotech/jovo-v4-template/blob/master/src/app.ts)) like this:

```typescript
import { GlobalComponent } from './components/GlobalComponent';
import { LoveHatePizzaComponent } from './components/LoveHatePizzaComponent';
// ...

const app = new App({
  /*
  |--------------------------------------------------------------------------
  | Components
  |--------------------------------------------------------------------------
  |
  | Components contain the Jovo app logic
  | Learn more here: www.jovo.tech/docs/components
  |
  */
  components: [GlobalComponent, LoveHatePizzaComponent],
});
```

Learn more about components in the sections below:
- [Component class](#component-class): How files like `YourComponent.ts` are structured
- [Component registration](#component-registration): How components are added to your app
- [Advanced component features](#advanced-component-features)

## Component Class

Each component consists of at least a component class that is [imported](#component-registration) in the [app configuration](./app-config.md) (for root components) or a parent component class (for subcomponents). The smallest possible component class could look like this:

```typescript
// src/components/YourComponent.ts

import { Component, BaseComponent } from '@jovotech/framework';

@Component()
class YourComponent extends BaseComponent {
  START() {
    // ...
  }
}
```

It includes the following elements:

- `@Component()` decorator: This is used to mark this class as a component. It can also include [component options](#component-options).
- [Handlers](#handlers) like `START`: These handlers contain the dialogue logic of the component.

Besides those, the following stages also dive into the following concepts:

- [Routing and state management](#routing-and-state-management)
- [Global components](#global-components)
- [Component data](#component-data)

### Handlers

The core of a component class are [handlers](./handlers.md) that are responsible for responding to a request and returning output.

For example, the [`LoveHatePizzaComponent`](https://github.com/jovotech/jovo-v4-template/blob/master/src/components/LoveHatePizzaComponent.ts) in the Jovo `v4` template includes the following handlers:

```typescript
@Component()
export class LoveHatePizzaComponent extends BaseComponent {
  START() {
    return this.$send(YesNoOutput, { message: 'Do you like pizza?' });
  }

  @Intents(['YesIntent'])
  lovesPizza() {
    return this.$send({ message: 'Yes! I love pizza, too.', listen: false });
  }

  @Intents(['NoIntent'])
  hatesPizza() {
    return this.$send({ message: `That's OK! Not everyone likes pizza.`, listen: false });
  }

  UNHANDLED() {
    return this.START();
  }
}
```

[Learn more about handlers here](./handlers.md).

### Routing and State Management

If you're used to building state machines (for example Jovo `v3`), you can see a Jovo component as a state.

Once a component is entered, it is added to the Jovo [`$state` stack](./state-stack.md):

```typescript
$state = [
  {
    component: 'SomeComponent',
  },
];
```

The component is removed from the stack once it [resolves](./handlers.md#resolve-a-component) or the [session closes](./output-templates.md#listen).

There are two ways how a component can be entered:

- Through one of its global handlers (or any handlers if it's a [global component](#global-components))
- By getting called from a different component using [`$redirect()`](./handlers.md#redirect-to-components) or [`$delegate()`](./handlers.md#delegate-to-components)

You can find out more about the [`$state` stack here](./state-stack.md) and learn about component delegation in our [handlers documentation](./handlers.md).

### Global Components

A Jovo project usually comes with a [`GlobalComponent`](https://github.com/jovotech/jovo-v4-template/blob/master/src/components/GlobalComponent.ts). This (and potentially other components) is a special `global` component that has the following characteristics:

- Each of its handlers is global, no need to add a [`global` property](./handle-decorators.md#global).
- It does not get added to the [`$state` stack](./state-stack.md) (except it uses [`$delegate()`](./handlers.md#delegate-to-components), then it is added to the stack just until the delegation was resolved).
- It does not store [component data](#component-data): If you want to store data, we recommend using [session data](./data.md#session-data).
- [`subState`](./handle-decorators.md#substate) does not work. We recommend using [`$delegate()`](./handlers.md#delegate-to-components).

You can either add the `global` property to the [component options](#component-options):

```typescript
@Component({ global: true /* other options */ })
class YourComponent extends BaseComponent {
  // ...
}
```

Or use the `@Global` convenience decorator:

```typescript
@Global()
@Component({
  /* options */
})
class YourComponent extends BaseComponent {
  // ...
}
```

As a rule of thumb, a global component can be seen as a "last resort" that is only triggered if no other more specific component matches a request. Global [`LAUNCH`](./handlers.md#launch), [`UNHANDLED`](./handlers.md#unhandled), or a help handler are often part of a global component.

### Component Data

For [data](./data.md) that is only relevant for this specific component, you can use component data:

```typescript
this.$component.data.someKey = 'someValue';
```

This is then added to the [`$state` stack](./state-stack.md) and lost once the component resolves:

```typescript
$state = [
  {
    component: 'SomeComponent',
    data: {
      someKey: 'someValue',
    },
  },
];
```

[Global components](#global-components) don't store component data because they're not added to the `$state` stack. We recommend using session data instead. [Learn more about the different Jovo data types here](./data.md).

### Component Options

For some components, it may be helpful (or necessary) to add options for customization or configuration. The following options can be added:

- `components`: Subcomponents that are used by this component.
- `config`: The custom config used by the component. Can be accessed with `this.$component.config`.
- `models`: Model files for component-specific intents and entities (_in development_).
- `name`: If two components have the same class name, one component's name can be changed here.

In the [register root components](#register-root-components) section, we already talked about how to pass options when registering existing components.

It is also possible to add options to a component class using its `@Component` decorator:

```typescript
@Component({
  /* options */
})
class YourComponent extends BaseComponent {
  // ...
}
```

The hierarchy of options being used by the component is as follows (starting with the most important one):

- Options passed using the constructor when registering the component
- Options in the `@Component` decorator
- Default options of the component

## Component Registration

When we talk about components in this documentation, we typically talk about a specific [component class](#component-class). These classes can either be registered globally in the `app.ts` file (root components) or as subcomponents of other component classes.

### Register Root Components

Root components are registered in the `app.ts` file (or any other [app config](./app-config.md) file). These are all top-level components that are accessible using [global handlers](./handle-decorators.md#global).

Each Jovo template usually comes with a [`GlobalComponent`](https://github.com/jovotech/jovo-v4-template/blob/master/src/components/GlobalComponent.ts) that is added like this:

```typescript
// src/app.ts

import { GlobalComponent } from './components/GlobalComponent';
// ...

const app = new App({
  // ...

  components: [GlobalComponent],

  // ...
});
```

You can add more components by importing their classes and referencing them in the `components` array:

```typescript
// src/app.ts

import { GlobalComponent } from './components/GlobalComponent';
import { YourComponent } from './components/YourComponent';
// ...

const app = new App({
  // ...

  components: [GlobalComponent, YourComponent],

  // ...
});
```

Some components (especially from third parties) may require you to add options. [Learn more about component options here](#component-options).

There are two ways how you can add those to your root component registration:

- Using `ComponentDeclaration` (this will allow you to access the types of the component options)
- Using an object

If you're a TypeScript user, we recommend using `ComponentDeclaration`. This way, your code editor will be able to provide the option types with code completion:

```typescript
// src/app.ts

import { ComponentDeclaration } from '@jovotech/framework';
import { YourComponent } from './components/YourComponent';
// ...

const app = new App({
  // ...

  components: [
    new ComponentDeclaration(YourComponent, {
      /* options */
    }),
  ],

  // ...
});
```

You can also use an object:

```typescript
// src/app.ts

import { YourComponent } from './components/YourComponent';
// ...

const app = new App({
  // ...

  components: [
    {
      component: YourComponent,
      options: {
        /* options */
      },
    },
  ],

  // ...
});
```

One example of an option is `name`. If you use two components that have the same class name (especially relevant for third-party components), you can rename one and pass its adjusted name. In the below example, both imported files export a `MenuComponent` class:

```typescript
// src/app.ts

import { MenuComponent } from './components/MenuComponent';
import { MenuComponent as MenuComponent2 } from './components/MenuComponent2';
// ...

const app = new App({
  // ...

  components: [MenuComponent, new ComponentDeclaration(MenuComponent2, { name: 'MenuComponent2' })],

  // ...
});
```

### Register Subcomponents

Subcomponents They are registered inside their parent component using the `components` property in the `@Component` decorator.

```typescript
import { YourSubComponent } from './YourSubComponent';
// ...

@Component({
  components: [YourSubComponent],
})
class YourComponent extends BaseComponent {
  // ...
}
```

## Advanced Component Features

### ComponentTree

The [`ComponentTree`](https://github.com/jovotech/jovo-framework/blob/v4/latest/framework/src/ComponentTree.ts) contains all [registered components](#component-registration):

```typescript
this.$handleRequest.componentTree;
```

Here is an example tree:

```json
{
  "tree": {
    "GlobalComponent": {
      "path": ["GlobalComponent"],
      "metadata": {
        "options": {
          "global": true
        }
      }
    },
    "LoveHatePizzaComponent": {
      "path": ["LoveHatePizzaComponent"],
      "metadata": {
        "options": {}
      }
    }
  }
}
```

You can also access the active component like this:

```typescript
this.$handleRequest.activeComponentNode;
```
