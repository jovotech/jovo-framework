---
title: 'Amazon S3 TTS Cache'
excerpt: 'This text to speech (TTS) cache plugin allows you to store generated TTS responses in Amazon S3.'
---

# Amazon S3 TTS Cache

This [text to speech (TTS) cache plugin](https://www.jovo.tech/docs/tts#tts-cache) allows you to store generated TTS responses in Amazon S3.

## Introduction

[S3](https://aws.amazon.com/s3/) is an object storage service that allows for cost-effect storage and easy data retrieval.

You can use this integration together with a [text to speech (TTS)](https://www.jovo.tech/docs/tts) integration to improve the speed of retrieval of TTS responses and reduce costs over re-generating the TTS for the same text multiple times. This integration stores TTS responses in an Amazon S3 bucket and is able to access the audio source URL using S3's Object URLs.

Learn more in the following sections:

- [Installation](#installation)
- [Configuration](#configuration)
- [Example](#example)

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/ttscache-s3
```

A TTS cache plugin can be added to the `cache` property of a TTS integration plugin. Here is an example how it can be added to the [Jovo Core Platform](https://www.jovo.tech/marketplace/server-lambda) in your `app.ts` [app configuration](https://www.jovo.tech/marketplace/platform-core):

```typescript
import { CorePlatform } from '@jovotech/platform-core';
import { PollyTts } from '@jovotech/tts-polly';
import { S3TtsCache } from '@jovotech/ttscache-s3';
// ...

app.configure({
  plugins: [
    new CorePlatform({
      plugins: [
        new PollyTts({
          cache: new S3TtsCache({
            bucket: '<YOUR-BUCKET-NAME>', // Example: 'mybucket-public'
            path: '<YOUR-PATH>', // Example: 'tts'
            baseUrl: '<YOUR-BASE-URL>', // Example: 'https://mybucket-public.s3.amazonaws.com'
          }),
        }),
      ],
    }),
    // ...
  ],
});
```

If you are running your Jovo app on [AWS Lambda](https://www.jovo.tech/marketplace/server-lambda), only the configurations above are required for the integration to work.

For apps outside AWS Lambda, you also need to add a `region` and `credentials` to the [`libraryConfig`](#libraryconfig) like this:

```typescript
new S3TtsCache({
  // ...
  libraryConfig: {
    region: 'us-east-1',
    credentials: {
      accessKeyId: '<YOUR-ACCESS-KEY-ID>',
      secretAccessKey: '<YOUR-SECRET-ACCESS-KEY>'
    },
  },
  // ...
}),
```

Learn more about all configurations in the [configuration section](#configuration).

## Configuration

The following configurations can be added:

```typescript
new S3TtsCache({
  bucket: '<YOUR-BUCKET-NAME>', // Example: 'mybucket-public'
  path: '<YOUR-PATH>', // Example: 'tts'
  baseUrl: '<YOUR-BASE-URL>', // Example: 'https://mybucket-public.s3.amazonaws.com'
  returnEncodedAudio: false,
  libraryConfig: {
    region: 'us-east-1',
    // ...
  }
}),
```

- `bucket`: The S3 bucket to cache the audio files. Required.
- `path`: Part of the key to store the object in the bucket. Required.
- `baseUrl`: The base part of the Object URL for the S3 bucket. Used for the audio source URL. Required.
- `returnEncodedAudio`: When true, call to cache's `getItem()` function will retrieve the base64 encoded audio from S3. When false, only a check to see if the object exists in S3 is done. Default: `false`. 
- [`libraryConfig`](#libraryconfig): [`S3ClientConfig` object](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html) that is passed to the S3 client. Use this for configurations like `region` or `credentials`. Optional.


### libraryConfig

The `libraryConfig` property can be used to pass configurations to the S3 SDK that is used by this integration.

```typescript
new S3TtsCache({
  libraryConfig: { /* ... */ },
  // ...
}),
```

You can learn more about all config options in the [official `S3TtsCache` reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html).

For example, you can add a `region` and `credentials` like shown below. This is necessary if you are hosting your Jovo app outside of an AWS environment.

```typescript
new S3TtsCache({
  libraryConfig: {
    region: 'us-east-1',
    credentials: {
      accessKeyId: '<YOUR-ACCESS-KEY-ID>',
      secretAccessKey: '<YOUR-SECRET-ACCESS-KEY>'
    },
    // ...
  },
  // ...
}),
```

## Example

Files are stored in S3 with a storage class of 'Standard' and an ACL of 'public-read' meaning everyone can read it.

The TTS cache uses values in [`TtsData`](https://www.jovo.tech/docs/tts#ttsdata) (some of them coming from the TTS integration) and configuration to determine where the audio will be stored in S3.

If the `TtsData` includes the following values:

```typescript
{
    text: 'Yes! I love pizza, too.', 
    contentType: 'audio/mpeg', 
    fileExtension: 'mp3', 
    encodedAudio: 'SUQzBAAAAAAAI1RTU...VVVVVVVVVVV', // partial
    key: 'polly-matthew-a4a1acc36c97d06fe092511f0e2655e3'
}
```

And the `S3TtsCache` is configured like this:

```typescript
{
    bucket: 'mybucket-public',
    path: 'tts',
    baseUrl: 'https://mybucket-public.s3.amazonaws.com',
    returnEncodedAudio: false
}
```

And the TTS integration determines that the locale is `en` (which is passed to `S3TtsCache`).

Then the audio file will be stored in the `mybucket-public` S3 bucket at `tts/en/polly-matthew-a4a1acc36c97d06fe092511f0e2655e3.mp3`

And the audio source URL will be: `https://mybucket-public.s3.amazonaws.com/tts/en/polly-matthew-a4a1acc36c97d06fe092511f0e2655e3.mp3`

You may want to create an S3 lifecycle rule to delete the cached audio files from the bucket that are older than a certain number of days. Use a filter to limit the rule to the TTS folder.