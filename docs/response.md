---
title: 'Response'
excerpt: 'Learn more about the Jovo response object, which is the generated native JSON response which gets returned to voice and chat platforms.'
url: 'https://www.jovo.tech/docs/response'
---

# Response

The Jovo `$response` object is the native JSON response which gets returned to voice and chat platforms.

## Introduction

The `$response` is generated from the [`$output` array](./output.md) as part of the _response_ step of the [RIDR lifecycle](./ridr-lifecycle.md).

Since `$response` isn't fully propagated until the response step, it is recommended to only make changes to the response (for example by using a [plugin](./plugins.md) or a [hook](./hooks.md)) in the `after.response.output` middleware, where the [`$output` array](./output.md) is turned into the response.

## Features

- [`hasSessionEnded`](#hassessionended)
- [Speech and reprompt](#speech-and-reprompt)

### hasSessionEnded

You can check if a session ends with this response by using the following method:

```typescript
this.$response.hasSessionEnded(); // boolean
```

### Speech and Reprompt

In some cases, it might be relevant to modify the speech and reprompt SSML elements _after_ `$output` has been turned into a `$response`. For example, you might want to access the final speech and reprompt to call a text to speech (TTS) API.

For that, you can use `getSpeech()` and `getReprompt()`. Since some platforms allow for multiple responses, the methods return either a `string` or an array `string[]`.

Those are optional methods that are only implemented by platforms that support SSML, so make sure to check if the methods are implemented before calling them:

```typescript
this.$response.getSpeech();
this.$response.getReprompt();

// Example for getSpeech
if (this.$response.getSpeech) {
  const speech = this.$response.getSpeech(); // string or string[]
}
```

After modifying the speech and reprompt, you can use `replaceSpeech()` and `replaceReprompt()` to update the elements in the `$response`.

They accept ether a `string` or an array `string[]`. If an array is provided, the response elements will be replaced in the order exactly how they are returned by `getSpeech()` and `getReprompt()`.

Like `getSpeech()` and `getReprompt()`, those are optional methods only implemented by platforms that support SSML:

```typescript
this.$response.replaceSpeech(speech);
this.$response.replaceReprompt(reprompt);

// Example for setSpeech
if (this.$response.replaceSpeech) {
  this.$response.replaceSpeech('<speak>Hi there!</speak>');
}
```
