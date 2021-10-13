---
title: 'Components'
excerpt: 'Learn more about Jovo Components, which are self-contained and reusable elements in a Jovo app.'
---
# Components

Components are self-contained and reusable elements in a Jovo app. Similar to web frameworks like Vue and React, Jovo allows you to build complex applications composed of components of varying sizes.

## Introduction

You can see a component as an isolated part of your app that handles a specific task. It could be something small like asking for a confirmation (yes or no), and something bigger like collecting all necessary information for a restaurant table reservation. For larger cases like the latter example, it's also possible for a component to have multiple subcomponents.

Components are located in the `src/components` folder of a Jovo app and consist of several elements:

- [Component Class](#component-class): The TypeScript/JavaScript class containing the logic of the component. One component has at least a class with the component's name, and potentially a few subcomponent classes.
- [Output](#output): A folder of output classes that are referenced by the component's handlers.
- [Models](#models): A folder with the component's specific language model files.
 

## Component Registration

When we talk about components in this documentation, we typically talk about a specific component class. These classes can either be registered globally in the `app.ts` file (root components) or as subcomponents of other component classes.

### Register Root Components

Root components are registered in the `app.ts` file. These are all top-level components that are accessible using [global handlers](./handlers.md#global-handlers). 

Each Jovo template usually comes with a `GlobalComponent` that is added like this:

```typescript
// src/app.ts

import { GlobalComponent } from './components/GlobalComponent/GlobalComponent';

// ...

const app = new App({

  // ...

  components: [
    GlobalComponent,
  ],

  // ...
});
```

You can add more components by importing their classes and referencing them in the `components` array:

```typescript
// src/app.ts

import { GlobalComponent } from './components/GlobalComponent/GlobalComponent';
import { YourComponent } from './components/YourComponent/YourComponent';

// ...

const app = new App({

  // ...

  components: [
    GlobalComponent,
    YourComponent,
  ],

  // ...
});
```

Some components (especially from third parties) may require you to add options. [Learn more about component options below](#component-options).

There are two ways how you can add those to your root component registration:
* Using `ComponentDeclaration` (this will allow you to access the types of the component options)
* Using an object

If you're a TypeScript user, we recommend using `ComponentDeclaration`. This way, your code editor will be able to provide the option types with code completion:

```typescript
// src/app.ts

import { ComponentDeclaration } from '@jovotech/framework';
import { YourComponent } from './components/YourComponent/YourComponent';

// ...

const app = new App({

  // ...

  components: [
    new ComponentDeclaration(YourComponent, { /* options */ }),
  ],

  // ...
});
```

You can also use an object:

```typescript
// src/app.ts

import { YourComponent } from './components/YourComponent/YourComponent';

// ...

const app = new App({

  // ...

  components: [
    { component: YourComponent, options: { /* options */ } },
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

  components: [
    MenuComponent, 
    new ComponentDeclaration(MenuComponent2, { name: 'MenuComponent2' })
  ],

  // ...
});
```


### Register Subcomponents

Subcomponents  They are registered inside their parent component using the `components` property in the `@Component` decorator.


```typescript
import { YourSubComponent } from './YourSubComponent';

// ...

@Component({
  components: [ YourSubComponent ],
})
class YourComponent extends BaseComponent {
  // ...
}
```

## Component Class

Each component consists of at least a component class that is imported in the `app.ts` file (for root components) or a parent component class (for subcomponents). The smallest possible component class could look like this:

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


### Handlers

The core of a class are [handlers](./handlers.md) that are responsible to turn structured meaning (e.g. an *intent*) into structured output. 

### Routing and State Management

If you're used to building state machines (for example Jovo `v3`), you can see a Jovo component as a state.

Once a component is entered, it is added to the Jovo [`$state` stack](./state-stack.md):

```typescript
$state = [
  {
    component: 'SomeComponent'
  }
]
```

The component is removed from the stack once it resolves or the session closes.

There are two ways how a component can be entered:
* Through one of its global handlers
* By getting called from a different component using `$redirect` or `$delegate`

You can find out more about the [`$state` stack here](./state-stack.md) and learn about component delegation in our [handlers documentation](./handlers.md).

### Global Components

A Jovo project usually comes with a `GlobalComponent`. This (and potentially other components) is a special `global` component that has the following characteristics:

* Each of its handlers is global, no need to add a `global` property.
* It does not get added to the [`$state` stack](./state-stack.md) (except it uses `$delegate`, then it is added to the stack just until the delegation was resolved).
* It does not store [component data](#component-data): If you want to store data, we recommend using [session data](./data.md#session-data).

You can either add the `global` property to the [component options](#component-options):

```typescript
@Component({ global: true, /* other options */ })
class YourComponent extends BaseComponent {
  
  // ...

}
```

Or use the `@Global` convenience decorator:

```typescript
@Global()
@Component({ /* options */ })
class YourComponent extends BaseComponent {
  
  // ...

}
```

As a rule of thumb, a global component can be seen as a "last resort" that is only triggered if no other more specific component matches a request. Global `LAUNCH`, `UNHANDLED`, or a help handler are often part of a global component. 

### Component Data

For data that is only relevant for this specific component, you can use component data:

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
  }
]
```

[Global components](#global-components) don't store component data because they're not added to the `$state` stack. We recommend using session data instead. [Learn more about the different Jovo data types here](./data.md).


### Component Options

For some components, it may be helpful (or necessary) to add options for customization or configuration. The following options can be added:

- `components`: Subcomponents that are used by this component
- `config`: The custom config used by the component
- `models`: Model files for component-specific intents and entities (*in development*)
- `name`: If two components have the same class name, one component's name can be changed here

In the [Register Root Components](#register-root-components) section, we already talked about how to pass options when registering existing components.

It is also possible to add options to a component class using its `@Component` decorator:

```typescript
@Component({ /* options */ })
class YourComponent extends BaseComponent {
  
  // ...

}
```

> **A note on decorators and JavaScript**: To make the code more readable, Jovo uses decorators, a feature only available in TypeScript. No worries, though, if you're a JavaScript user: Jovo uses Babel to transpile the code with decorators to a supported format.

The hierarchy of options being used by the component is as follows (starting with the most important one):
* Options passed using the constructor when registering the component
* Options in the `@Component` decorator
* Default options of the component

## Component Folder Structure

There are multiple ways how a component can be structured:

- A single file, for example `components/YourComponent.ts`
- A folder, for example `components/YourComponent/YourComponent.ts`
- A folder that contains a group of components, e.g. `components/YourComponent/YourComponent.ts` and its subcomponents like `components/YourComponent/SomeOtherComponent.ts`

A folder allows for a modular approach where all relevant elements of a component can be included in one place:

- `output`
- `models`
- `services`
- subcomponents

### Output

This folder contains all output classes that are used by the Jovo `$send` command. Learn more about this in our [output classes documentation](./output-classes.md).

### Models

*Models functionality is added soon.*

This folder contains the language model files for this specific component. The files are merged into the main model using the jovo `build` command.

### Services

We recommend placing all component specific backend services like API calls in a `services` folder inside the component folder.
