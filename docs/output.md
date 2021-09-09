---
title: 'Output'
excerpt: 'Learn more about how to return structured output that works across platforms like Alexa, Google Assistant, Facebook Messenger, the web, and more.'
---
# Output

Learn more about how to return output to the user.

## Introduction

A big part of building a Jovo app is returning output to the user. This output could include all sorts of things, speech (for voice interfaces) or text (for visual interfaces) messages being the most prominent.

The goal of a [handler](./handlers.md) is to return a structured [output template](#output-templates), which gets stored inside the Jovo `$output` property. This `$output` then gets translated into a native platform response in the next step of the [RIDR lifecycle](./ridr-lifecycle.md).

The most popular way to return output is using the `$send` method:

```typescript
yourHandler() {
  
  // ...

  return this.$send(/* output */);
}
```

Learn more about [ways to return output](#ways-to-return-output), [output templates](#output-templates), and [output classes](#output-classes) below.

## Ways to Return Output

We recommend using the `$send` method to return output:

```typescript
yourHandler() {
  
  // ...

  return this.$send(/* output */);
}
```

You can either [send an output template directly](#send-an-output-template) or [send an output class](#send-an-output-class). The `$send` method comes with additional features like making it possible to [send multiple responses](#send-multiple-responses).

While we recommend using `$send`, it is also possible to populate `$output` directly:

```typescript
yourHandler() {
  
  // ...

  this.$output = {
    message: 'Hello world',
  };
  return;
}
```

### Send an Output Template

You can directly add an [output template](#output-templates) to the `$send` method:

```typescript
yourHandler() {
  
  // ...

  return this.$send({ /* output */ });
}
```
This object can contain all output template elements that are described in the [output template documentation](https://v4.jovo.tech/docs/output-templates).

Here is an example output that just contains a `message`:

```typescript
yourHandler() {
  
  // ...

  return this.$send({ message: 'Hello World!' });
}
```

### Send an Output Class

For more complex output, we recommend using [output classes](#output-classes).

The below example imports an output class called `SomeOutput` and passes it to `$send` together with potential options:

```typescript
import { SomeOutput } from './output/SomeOutput';

// ...

yourHandler() {
  
  // ...

  return this.$send(SomeOutput, { /* output options */ });
}
```

The options can also override reserved properties from the output class, like the `message`:

```typescript
import { SomeOutput } from './output/SomeOutput';

// ...

yourHandler() {
  
  // ...

  return this.$send(SomeOutput, { message: 'This overrides the message from SomeOutput' });
}
```

Learn more about [reserved properties in the output classes documentation](./output-classes.md#reserved-properties).

### Send Multiple Responses

You can also return an array of output objects:

```typescript
[
  {
    message: 'Hello world!',
  },
  {
    message: 'This is a second chat bubble.',
  }
]
```

This can also be done by doing multiple `$send` calls in a [handler](./handlers.md).

```typescript
someHandler() {
  this.$send({ message: 'Hello world!' });

  // ...

  return this.$send({ message: 'This is a second chat bubble.' })
}
```

Platforms that support multiple responses will display the example above in 2 chat bubbles. Synchronous platforms like Alexa will concatenate the `message` to a single response:

```typescript
{
  message: 'Hello world! This is a second chat bubble.',
}
```


## Output Templates

Output templates offer a structured format to return output to a user. These templates can be added to `$send` directly or returned from an output class.

```typescript
{
  message: 'Do you like pizza?',
  quickReplies: [ 'yes', 'no' ],
  listen: true,
}
```

[Learn more about the structure of output templates here](https://v4.jovo.tech/docs/output-templates).

## Output Classes

For better separation between logic and output, Jovo has a concept called output classes. These classes can are typically stored in an `output` folder. As a convention, the files are usually named like the class, for example `MenuOutput.ts`.

Here is an example of a `HelloWorldOutput` class:

```typescript
import { Output, BaseOutput } from '@jovotech/framework';

@Output()
export class HelloWorldOutput extends BaseOutput {

  build() {
    return {
      message: 'Hello World!',
    };
  }
}
```

[Learn more in the output classes docs](./output-classes.md).


