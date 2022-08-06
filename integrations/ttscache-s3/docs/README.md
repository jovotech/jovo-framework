title: 'Amazon S3 TTS Cache'
excerpt: 'Use a TTS cache plugin with a text to speech (TTS) integration to improve the speed of retrieval of TTS responses and reduce costs over re-generating the TTS for the same text multiple times. This integration stores TTS responses in an Amazon S3 bucket and is able to access the audio source URL using S3's Object URLs.'

---

# Amazon S3 TTS Cache

Use a TTS cache plugin with a text to speech (TTS) integration to improve the speed of retrieval of TTS responses and reduce costs over re-generating the TTS for the same text multiple times. This integration stores TTS responses in an Amazon S3 bucket and is able to access the audio source URL using S3's Object URLs.

## Introduction

[S3](https://aws.amazon.com/s3/) is an object storage service that allows for cost-effect storage and easy data retrieval.

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
          cache: new S3TtsCache(),
        }),
      ],
    }),
    // ...
  ],
});
```

## Configuration

The following configurations can be added:

```typescript
new S3TtsCache({
    credentials: {/* ... */},
    bucket: 'mybucket-public',
    path: 'tts',
    baseUrl: 'https://mybucket-public.s3.amazonaws.com',
    returnEncodedAudio: false
}),
```

- `credentials`: Required. AWS credentials. See [credentials](#credentials) for more information.
- `bucket`: Required. The S3 bucket to cache the audio files.
- `path`: Required. Part of the key to store the object in the bucket.
- `baseUrl`: Required. The base part of the Object URL for the S3 bucket. Used for the audio source URL.
- `returnEncodedAudio`: Required. Default: false. When true, call to cache's `getItem()` function will retrieve the base64 encoded audio from S3. When false, only a check to see if the object exists in S3 is done.

### Credentials

The AWS credentials includes:

```typescript
new S3TtsCache({
    credentials: {
        accessKeyId: '',
        secretAccessKey: '',
    },
    // ...
}),
```

- `accessKeyId`: AWS access key id
- `secretAccessKey`: AWS secret access key

### Storage

Files are stored in S3 with a storage class of 'Standard' and an ACL of 'public-read' meaning everyone can read it.

The TTS cache uses values in `TtsData` (some of them coming from the TTS integration) and configuration to determine where the audio will be stored in S3.

If the TtsData includes the following values:

```typescript
{
    text: 'Yes! I love pizza, too.', 
    contentType: 'audio/mpeg', 
    fileExtension: 'mp3', 
    encodedAudio: 'SUQzBAAAAAAAI1RTU...VVVVVVVVVVV', // partial
    key: 'polly-matthew-a4a1acc36c97d06fe092511f0e2655e3'
}
```

And the S3TtsCache is configured like this:

```typescript
{
    bucket: 'mybucket-public',
    path: 'tts',
    baseUrl: 'https://mybucket-public.s3.amazonaws.com',
    returnEncodedAudio: false
}
```

And the TTS integration determines that the locale is `en` (which is passed to S3TtsCache).

Then the audio file will be stored in the `mybucket-public` S3 bucket at `tts/en/polly-matthew-a4a1acc36c97d06fe092511f0e2655e3.mp3`

And the audio source URL will be: `https://mybucket-public.s3.amazonaws.com/tts/en/polly-matthew-a4a1acc36c97d06fe092511f0e2655e3.mp3`


NOTE: You may want to create an S3 lifecycle rule to delete the cached audio files from the bucket that are older than a certain number of days. Use a filter to limit the rule to the TTS folder.