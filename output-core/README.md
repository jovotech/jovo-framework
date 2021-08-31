# Core Platform Output

Learn more about output templates for [Jovo Core Platform](https://github.com/jovotech/jovo-framework/blob/v4dev/platforms/platform-core).
- [Introduction](#introduction)
- [Generic Output Elements](#generic-output-elements)
- [Core-specific Output Elements](#core-specific-output-elements)
  - [Native Response](#native-response)


## Introduction

Jovo offers the ability to [create structured output](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/output.md) that is then translated into native platform responses.

This structured output is called [output template](https://github.com/jovotech/jovo-output/blob/master/docs/output-templates.md). Its root properties are generic output elements that work across platforms. [Learn more about how generic output is translated into a Core response below](#generic-output-elements).

```typescript
{
  message: `Hello world! What's your name?`,
  reprompt: 'Could you tell me your name?',
  listen: true,
}
```

You can also add platform-specific output to an output template. [Learn more about Core-specific output below](#core-specific-output-elements).

```typescript
{
  // ...
  platforms: {
    core: {
      // ...
    }
  }
}
```


## Generic Output Elements

Generic output elements are in the root of the output template and work across platforms. [Learn more in the Jovo Output docs](https://github.com/jovotech/jovo-output/blob/master/docs/output-templates.md).

The Core Platform supports exactly the same output elements as they appear in the generic output.

## Core-specific Output Elements

It is possible to add platform-specific output elements to an output template. [Learn more in the Jovo output documentation](https://github.com/jovotech/jovo-output/blob/master/docs/output-templates.md#platform-specific-output-elements).

For Core, you can add output elements inside an `core` object:

```typescript
{
  // ...
  platforms: {
    core: {
      // ...
    }
  }
}
```

### Native Response

The [`nativeResponse` property](https://github.com/jovotech/jovo-output/blob/master/docs/output-templates.md#native-response) allows you to add native elements exactly how they would be added to the Core JSON response.

```typescript
{
  // ...
  platforms: {
    core: {
      nativeResponse: {
        // ...
      }
    }
  }
}
```
