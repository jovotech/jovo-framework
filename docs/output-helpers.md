---
title: 'Output Helpers'
excerpt: 'Learn more about helper methods that make it easier to create Jovo output templates that work across voice and chat platforms.'
url: 'https://www.jovo.tech/docs/output-helpers'
---

# Output Helpers

Jovo Output helpers offer a set of methods that make it easier to build great [output templates](./output-templates.md).

## Introduction

The `OutputHelpers` class offers a variety of methods that help you interact with Jovo [output templates](./output-templates.md). For example, the [`randomize()` method](#randomize) helps you add variety to your output.

```typescript
import { OutputHelpers } from '@jovotech/output';
// ...

OutputHelpers.randomize([
  // ...
]);
```

## Helpers

- [`randomize`](#randomize): Pick a random element from a string.

### randomize

The generic [`message`](./output-templates.md#message) and [`reprompt`](./output-templates.md#reprompt) elements already support randomization. If you add an array, one random item gets picked:

```typescript
{
  message: [
    'Hi!',
    'Hello!',
    'Hey there.',
  ],
}
```

For other elements, you can use the `randomize` helper to add variety to your output:

```typescript
import { OutputHelpers } from '@jovotech/output';
// ...

OutputHelpers.randomize([
  // ...
]);
```
