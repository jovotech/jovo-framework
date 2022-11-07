---
title: 'Output'
excerpt: 'Learn more about how to return structured output that works across platforms like Alexa, Google Assistant, Facebook Messenger, the web, and more.'
url: 'https://www.jovo.tech/docs/output'
---

# Output

Learn more about how to return output to the user.

## Introduction

A big part of building a Jovo app is returning output to the user. This output could include all sorts of things, speech (for voice interfaces) or text (for visual interfaces) messages being the most prominent.

The goal of a [handler](./handlers.md) is to return one or more structured [output templates](#output-templates) that get stored inside the Jovo `$output` array. This `$output` then gets translated into a native platform response in the next step of the [RIDR lifecycle](./ridr-lifecycle.md).

The most popular way to return output is using the `$send()` method:

```typescript
yourHandler() {

  // ...

  return this.$send(/* output */);
}
```

`$output` is always an array, even if you only send one output template.

Learn more about [ways to return output](#ways-to-return-output), [output templates](#output-templates), and [output classes](#output-classes) below.

## Ways to Return Output

We recommend using the `$send()` method to return output:

```typescript
yourHandler() {

  // ...

  return this.$send(/* output */);
}
```

You can either [send a message](#send-a-message) by passing a string:

```typescript
return this.$send('Hello World!');
```

If you want to add output elements beyond a message, you can [send an output template](#send-an-output-template):

```typescript
return this.$send({ message: 'Hello World!' /* ... */ });
```

You can also [send an output class](#send-an-output-class):

```typescript
return this.$send(SomeOutput, {
  /* output options */
});
```

The `$send()` method comes with additional features like making it possible to [send multiple responses](#send-multiple-responses):

```typescript
someHandler() {
  this.$send('Hello world!');

  // ...

  return this.$send('This is a second chat bubble.')
}
```

While we recommend using `$send()`, it is also possible to populate `$output` directly:

```typescript
yourHandler() {

  // ...

  this.$output = [{
    message: 'Hello world',
  }];
  return;
}
```

### Send a Message

You can pass a string to the `$send()` method:

```typescript
yourHandler() {

  // ...

  return this.$send('Hello World!');
}
```

This will populate the [`message` output element](https://www.jovo.tech/docs/output-templates#message) and is the same as the below example that [sends an output template](#send-an-output-template):

```typescript
yourHandler() {

  // ...

  return this.$send({ message: 'Hello World!' });
}
```

### Send an Output Template

You can directly add an [output template](#output-templates) to the `$send()` method:

```typescript
yourHandler() {

  // ...

  return this.$send({ /* output */ });
}
```

This object can contain all output template elements that are described in the [output template documentation](./output-templates.md).

Here is an example output that just contains a `message`:

```typescript
yourHandler() {

  // ...

  return this.$send({ message: 'Hello World!' });
}
```

### Send an Output Class

For more complex output, we recommend using [output classes](#output-classes).

The below example imports an output class called `SomeOutput` and passes it to `$send()` together with potential options:

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

You can also return an array of output templates:

```typescript
[
  {
    message: 'Hello world!',
  },
  {
    message: 'This is a second chat bubble.',
  },
];
```

This can also be done by doing multiple `$send()` calls in a [handler](./handlers.md).

```typescript
someHandler() {
  this.$send('Hello world!');

  // ...

  return this.$send('This is a second chat bubble.')
}
```

Platforms that support multiple responses will display the example above in 2 chat bubbles. Synchronous platforms like Alexa will concatenate the `message` to a single response:

```typescript
{
  message: 'Hello world! This is a second chat bubble.',
}
```

### i18n

You can also add internationalization by storing all strings in an `i18n` file for each locale. This way, you can return output using the `$t()` method:

```typescript
// Without i18n
return this.$send({ message: 'Hello World!' });

// With i18n
return this.$send({ message: this.$t('hello') });
```

[Learn more in the i18n docs](./i18n.md).

## Output Templates

Output templates offer a structured format to return output to a user. These templates can be added to `$send()` directly or returned from an output class.

```typescript
{
  message: 'Do you like pizza?',
  quickReplies: [ 'yes', 'no' ],
  listen: true,
}
```

[Learn more about the structure of output templates here](./output-templates.md).

## Output Classes

For better separation between logic and output, Jovo has a concept called output classes. These classes can are typically stored in an `output` folder. As a convention, the files are usually named like the class, for example `MenuOutput.ts`.

Here is an example of a `HelloWorldOutput` class:

```typescript
import { Output, BaseOutput, OutputTemplate } from '@jovotech/framework';

@Output()
export class HelloWorldOutput extends BaseOutput {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      message: 'Hello World!',
    };
  }
}
```

[Learn more in the output classes docs](./output-classes.md).
