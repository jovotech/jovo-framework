---
title: 'Response'
excerpt: 'Learn more about the Jovo response object, which is the generated native JSON response which gets returned to voice and chat platforms.'
---

# Response

The Jovo `$response` object is the native JSON response which gets returned to voice and chat platforms.

## Introduction

The `$response` is generated from the [`$output` array](./output.md) as part of the _response_ step of the [RIDR lifecycle](./ridr-lifecycle.md).

Since `$response` isn't fully propagated until the response step, it is recommended to only make changes to the response (for example by using a [plugin](./plugins.md) or a [hook](./hooks.md)) in the `before.response.end` middleware.

## Features

You can check if a session ends with this response by using the following method:

```typescript
this.$response.hasSessionEnded(); // boolean
```
