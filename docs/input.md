---
title: 'Input'
excerpt: 'Learn more about the Jovo Input property, which includes structured user input.'
---

# Input

Learn more about the Jovo `$input` property, which includes structured user input.

## Introduction

The `$input` property contains structured data that is derived from a request. For example, speech recognition (ASR) and [natural language understanding (NLU)](./nlu.md) data. It is the result of the second step of the [RIDR lifecycle](./ridr-lifecycle.md).

Depending on the type of request, Jovo derives an either a [default input type](#default-input-types) or [custom input type](#custom-input-types).

Depending on the input type, the `$input` object contains different properties. For example, if a [platform](./platforms.md) sends a request that already includes intent information, the input of the [type `INTENT`](#intent) could look like this:

```typescript
{
  type: 'INTENT',
  intent: 'HelloWorldIntent',
}
```

If the request only contains raw text, the input of the [type `TEXT`](#text) could look like this:

```typescript
{
  type: 'TEXT',
  text: 'My name is Max',
}
```

This text gets turned into structured meaning by using an [NLU integration](./nlu.md).

## Handlers

You can use the `types` property to let a [handler](./handlers.md) respond to a specific type.

This works for [default input types](#default-input-types):

```typescript
@Handle({
  types: 'ERROR',
})
respondToError() {
  // ...
}
```

As well as [custom ones](#custom-input-types):

```typescript
@Handle({
  types: 'Connections.Response',
})
onSuccessfulConnection() {
  // ...
}
```

## Default Input Types

The following default input types are available:

- [`LAUNCH`](#launch)
- [`INTENT`](#intent)
- [`TEXT`](#text)
- [`SPEECH`](#speech)
- [`TRANSCRIBED_SPEECH`](#transcribed_speech)
- [`ERROR`](#error)
- [`END`](#end)

The input types are all available through the [`@jovotech/common` package](https://github.com/jovotech/jovo-framework/blob/v4/latest/common/src/Input.ts). You can import them like this:

```typescript
import { InputType } from '@jovotech/common';
// ...

{
  type: InputType.Launch,
}
```

### LAUNCH

A `LAUNCH` input (`InputType.Launch`) is usually reserved for the initial interaction, the first request of a session.

```typescript
{
  type: 'LAUNCH',
}
```

A `LAUNCH` input gets automatically mapped to a global `LAUNCH` handler:

```typescript
LAUNCH() {
  // ...
}
```

### INTENT

An `INTENT` input (`InputType.Intent`) happens when the platform already delivers NLU information like an intent and entities with the request.

It can include just an intent:

```typescript
{
  type: 'INTENT',
  intent: 'HelloWorldIntent',
}
```

It can also include entity information:

```typescript
{
  type: 'INTENT',
  intent: 'MyNameIsIntent',
  entities: {
    name: {
      value: 'Max',
    },
  },
}
```

### TEXT

A `TEXT` input (`InputType.Text`) happens when a platform sends raw text input.

```typescript
{
  type: 'TEXT',
  text: 'My name is Max',
}
```

This text gets turned into structured meaning by using an [NLU integration](./nlu.md).

Here is an example how the result could look like:

```typescript
{
  type: 'TEXT',
  text: 'My name is Max',
  nlu: {
    intent: 'MyNameIsIntent',
    entities: {
      name: {
        value: 'Max',
      },
    },
  },
}
```

If the intent from the NLU is part of the [`intentMap` configuration](./app-config.md#intentmap), the original intent stays in the `nlu` object and an additonal `intent` property is added to `$input`:

```typescript
{
  type: 'TEXT',
  text: 'My name is Max',
  nlu: {
    intent: 'MyNameIsIntent',
    entities: {
      name: {
        value: 'Max',
      },
    },
  },
  intent: 'MappedMyNameIsIntent',
}
```

### SPEECH

A `SPEECH` input (`InputType.Speech`) means that the platform sent a request that contains a speech audio file that needs to get transcribed.

```typescript
{
  type: 'SPEECH',
  audio: {
    base64: '...',
    sampleRate: 44100,
  },
}
```

The `audio` typically includes a [Base64](https://en.wikipedia.org/wiki/Base64) string and a sample rate. It usually gets turned into transcribed speech by using an ASR integration.

### TRANSCRIBED_SPEECH

A `TRANSCRIBED_SPEECH` input (`InputType.TranscribedSpeech`) means that, although the user used speech input to interact with the platform, the speech was already transcribed by the client. This means that the input contains a `text` even though the input modality was speech.

```typescript
{
  type: 'TRANSCRIBED_SPEECH',
  text: 'My name is Max',
}
```

This text gets turned into structured meaning by using an [NLU integration](./nlu.md).

### ERROR

An `ERROR` input (`InputType.Error`) happens when the platform throws an error and sends an error request.

```typescript
{
  type: 'ERROR',
}
```

### END

An `END` input (`InputType.End`) means that the user (or platform) requested the session to be closed.

```typescript
{
  type: 'END',
}
```

An `END` input gets automatically mapped to the default `END` handler:

```typescript
END() {
  // ...
}
```

## Custom Input Types

Many platforms come with their own request types. If those request types can't be mapped to a [default input type](#default-input-types), Jovo adds the request type to `$input`.

For example, an Alexa request of the type `Connections.Response` gets added like this:

```typescript
{
  type: 'Connections.Response',
}
```

You can map a [handler](./handlers.md) to a type like this:

```typescript
@Handle({
  types: 'Connections.Response',
})
onSuccessfulConnection() {
  // ...
}
```
