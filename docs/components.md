# Components

- [Introduction](#introduction)
- [Component Registration](#component-registration)
- [Component Class](#component-class)
- [Component Options](#component-options)
  - [Handlers](#handlers)
  - [State Management](#state-management)
- [Output](#output)
- [Models](#models)

## Introduction

Components are self-contained and reusable elements in a Jovo app. Similar to web frameworks like Vue and React, Jovo allows you to build complex applications composed of components of varying sizes.

You could see a component as an isolated part of your app that handles a specific task. It could be something small like asking for a confirmation (yes or no), and something bigger like collecting all necessary information for a restaurant table reservation. For larger cases like the latter example, it's also possible for a component to have multiple subcomponents.

Components consist of several elements:

- [Component Class](#component-class): The TypeScript/JavaScript class containing the logic of the component. One component has at least a class with the component's name, and potentially a few subcomponent classes.
- [Output](#output): A folder of output classes that are referenced by the component's handlers.
- [Models](#models): A folder with the component's specific language model files.
 

## Component Registration

When we talk about components in this documentation, we typically talk about a specific component class. These classes are registered in the `app.ts` file. Each Jovo template usually comes with a `MainComponent` that is added like this:

```typescript
// src/app.ts

import { MainComponent } from './components/MainComponent/MainComponent';

// ...

const app = new App({

  // ...

  components: [
    MainComponent,
  ],

  // ...
});
```

// TODO: Add ComponentDeclaration for components with options

## Component Class

Each component consists of at least a component class that is imported in the `app.ts` file. The smallest possible component class could look like this:

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


## Component Options

Each component class contains a decorator `@Component` that takes an object of options as an argument.

```typescript
@Component({ /* options */ })
class YourComponent extends BaseComponent {
  
	// ...

}
```

> **A note on decorators and JavaScript**: To make the code more readable, Jovo uses decorators, a feature only available in TypeScript. No worries, though, if you're a JavaScript user: Jovo uses Babel to transpile the code with decorators to a supported format.

// TODO: Add subcomponent docs

### Handlers

The core of a class are [handlers](./handlers.md) that are responsible to turn structured meaning (e.g. an *intent*) into structured output. 

### State Management

If you're used to building state machines (for example Jovo `v3`), a good way to see a Jovo component as a state.

Once a component is entered, it is added to the Jovo `$state` stack:

```typescript
$state = [
	{
		componentPath: 'MainComponent'
	}
]
```

The component is removed from the stack once it resolves or the session closes. You can find out more about component delegation and routing in our [handlers documentation](./handlers.md).

## Output

This folder contains all output classes that are used by the Jovo `$send` command. Learn more about this in our [handlers documentation](./handlers.md).

## Models

*Models functionality is added soon.*