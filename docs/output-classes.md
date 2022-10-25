---
title: 'Output Classes'
excerpt: 'Learn more about Jovo Output classes, which offer a way to return structured output templates.'
url: 'https://www.jovo.tech/docs/output-classes'
---

# Output Classes

Output classes offer a way to return structured output templates.

## Introduction

The goal of an output class is to have a modular, reusable class that returns output. [Learn more about output here](./output.md).

Output classes are stored in a component's `output` folder. As a convention, the files are usually named like the class, for example `MenuOutput.ts`.

Each output class contains:

- A [`build()` method](#build-method) that returns an output template
- [`options`](#output-options) that can be passed using `$send()`
- Optionally [helper methods](#helper-methods) that can be used to build the output object

Here is an example of a `HelloWorldOutput` class:

```typescript
import { BaseOutput, Output, OutputTemplate } from '@jovotech/framework';

@Output()
export class HelloWorldOutput extends BaseOutput {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      message: 'Hello World!',
    };
  }
}
```

An output class can get passed to the `$send()` method (which you can learn more about in the [output documentation](./output.md)):

```typescript
import { SomeOutput } from './output/SomeOutput';

// ...

yourHandler() {

  // ...

  return this.$send(SomeOutput, { /* output options */ });
}
```

## Build Method

The most important part of an output class is an [output template](#output-template) that is returned by a [`build()` method](#build-method). This object is then translated into the appropriate platform response.

```typescript
build(): OutputTemplate | OutputTemplate[] {
  return {
    message: 'Hello World!',
  };
}
```

Usually, you don't do more inside `build()` than modifying the output object directly.

There are several ways how you could add further modifications. For example, you can add [helper methods](#helper-methods) like this:

```typescript
build(): OutputTemplate | OutputTemplate[] {
  return {
    message: 'Hello World!',
    carousel: this.getCarousel(),
  };
}

getCarousel() {
  // ...
}
```

There's also the possibility that there is completely distinct output depending on a few factors. For example, output could differ for voice and text based interfaces. You could modify `build()` in a way that it returns different output objects:

```typescript
build(): OutputTemplate | OutputTemplate[] {
  if(/* some condition */) {
    return {
      message: 'Output A',
    };
  } else {
    return {
      message: 'Output B',
    };
  }
}
```

## Output Options

As a convention, an output template should only be responsible for organizing the output, not collecting any data. To achieve this, the handler should first collect all necessary information and then pass it to the output class as `options`:

```typescript
return this.$send(YourOutput, {
  /* options */
});
```

There are two types of properties that can be passed:

- [Reserved properties](#reserved-properties): You can pass elements like `message` to be automatically added to the output template
- [Custom options](#custom-options): Pass any additional data to be used in the output class

### Reserved Properties

Reserved properties are output elements that can be passed as options. They are automatically added to the output object and allow the `$send()` method to override [generic output properties](./output-templates.md#generic-output-elements) in the output template.

For example, a `message` can be passed right from the handler:

```typescript
return this.$send(YourOutput, { message: 'Hi there!' });
```

Even if `YourOutput` already includes a `message` property, it will be replaced with `"Hi there!"`.

The following properties are reserved:

- `message`
- `reprompt`
- `listen`
- `quickReplies`
- `card`
- `carousel`
- `platforms`

All properties except `platforms` replace the current property in the output template. For `platforms`, the content gets merged to allow for more granularity.

### Custom Options

You can pass any other options that are not [reserved properties](#reserved-properties) and reference them inside the output class using `this.options`.

For example, here we're passing a user's `name`:

```typescript
return this.$send(YourOutput, { name: 'Sam' });
```

We can then greet them by their name using `this.options.name`:

```typescript
build(): OutputTemplate | OutputTemplate[] {
  return {
    message: `Hey ${this.options.name}!`,
  };
}
```

### Option Types

Extend `OutputOptions` to create an interface for your output option types:

```typescript
import { BaseOutput, OutputOptions } from '@jovotech/framework';

// ...

export interface YourOutputOptions extends OutputOptions {
  name: string;
}

export class YourOutput extends BaseOutput<YourOutputOptions> {
  // ...
}
```

The above code example creates `YourOutputOptions` that are then passed to `BaseOutput` as generics with `BaseOutput<YourOutputOptions>`.

### getDefaultOptions

If you want to set default options, you can implement the following method:

```typescript
getDefaultOptions() {
  return { /* default options */ };
}
```

Using TypeScript, you can also add the types:

```typescript
import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

// ...

export interface YourOutputOptions extends OutputOptions {
  name: string;
}

@Output()
export class YourOutput extends BaseOutput<YourOutputOptions> {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      message: `Hey ${this.options.name}!`,
    };
  }

  getDefaultOptions(): YourOutputOptions {
    return {
      name: 'there',
    };
  }
}
```

If the `$send()` method doesn't pass a proper `name` to the output class in the above example, the response will be `Hey there!`.

## Helper Methods

You can add helper methods to the output class and reference them with `this.helperMethodName()`.

```typescript
build(): OutputTemplate | OutputTemplate[] {
  return {
    message: `Here are our categories: ${this.listCategories(this.options.categories)}`,
  };
}

listCategories(categories) {
  // ...
}
```

You can also use `get` properties:

```typescript
build(): OutputTemplate | OutputTemplate[] {
  return {
    message: `Here are our categories: ${this.listCategories}`,
  };
}

get listCategories() {
  this.options.categories.forEach(/* ... */);
  // ...
}
```

## Constructor

By default, your class does not need a custom constructor.

However, if you wish to add one, you can do the following:

```typescript
import { Output, BaseOutput, OutputOptions } from '@jovotech/framework';

// ...

export interface YourOutputOptions extends OutputOptions {
  // ...
}

Output();
export class YourOutput extends BaseOutput<YourOutputOptions> {
  // ...

  constructor(jovo: Jovo, options: DeepPartial<YourOutputOptions>) {
    super(jovo, options);
    // Do something
  }
}
```
