# Components

## Introduction

Components are self-contained and reusable elements in a Jovo app. Similar to web frameworks like Vue and React, Jovo allows you to build complex applications composed of components of varying sizes.

Components consist of several elements:

- **Component Class**: The TypeScript/JavaScript class containing the logic of the component. One component has at least a class with the component's name, and potentially a few subcomponent classes.
- **Output**: A folder of output classes that are referenced by the component's handlers.
- **Models**: A folder with the component's specific language model files.

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

## Component Class

Each component consists of at least a component class that is imported in the `app.ts` file. The smallest possible component class could look like this:

```typescript
// src/components/YourComponent.ts

import { BaseComponent } from '@jovotech/framework';

@Component()
class YourComponent extends BaseComponent {
  
	START() {
		// ...
	}
}
```

> **A note on decorators and JavaScript**: To make the code more readable, Jovo uses decorators, a feature only available in TypeScript. No worries, though, if you're a JavaScript user: Jovo uses Babel to transpile the code with decorators to a supported format.

The core of a class are [handlers](./handlers.md) that are responsible to turn structured meaning (e.g. an *intent*) into structured output. 



## Output


## Models

*Models functionality is added soon.*