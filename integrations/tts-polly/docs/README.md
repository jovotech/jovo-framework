title: 'Amazon Polly TTS Integration'
excerpt: 'Turn text into audio files with the Jovo Framework text to speech (TTS) integration for Amazon Polly.'

---

# Amazon Polly TTS Integration

Turn text into audio files with the Jovo Framework text to speech (TTS) integration for Amazon Polly.

## Introduction

[Polly](https://aws.amazon.com/polly/) is a [text to speech (TTS)](https://www.jovo.tech/docs/tts) service that turns text into lifelike speech with dozens of voices across a broad set of languages.

Learn more in the following sections:

- [Installation](#installation)
- [Configuration](#configuration)
-

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/tts-polly
```

TTS plugins can be added to Jovo platform integrations. Here is an example how it can be added to the [Jovo Core Platform](https://www.jovo.tech/marketplace/server-lambda) in your `app.ts` [app configuration](https://www.jovo.tech/marketplace/platform-core):

```typescript
import { CorePlatform } from '@jovotech/platform-core';
import { PollyTts } from '@jovotech/tts-polly';
// ...

app.configure({
  plugins: [
    new CorePlatform({
      plugins: [new PollyTts()],
    }),
    // ...
  ],
});
```

## Configuration

The following configurations can be added:

```typescript
new PollyTts({
    region: 'us-east-1',
    credentials: {/* ... */},
    cache: new SampleTtsCache({/* ... */}),
    outputFormat: 'mp3',
    fallbackLocale: 'en-US',
    voiceId: 'Matthew',
    sampleRate: '16000',
    engine: 'standard',
    lexiconNames: [],
    languageCode: 'en-IN',
    speechMarkTypes: []
}),
```

- `region`: Required. AWS region
- `credentials`: Required. AWS credentials. See [credentials](#credentials) for more information.
- `cache`: Optional. [TTS Cache](#tts-cache) implementation.
- `fallbackLocale`: Required. Default: 'en-US'. Used as a fallback if the locale from Jovo is not found.
- `outputFormat`: Required. Default: 'mp3'. The format in which the returned output will be encoded. See [`outputFormat` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#outputformat) for more information.
- `voiceId`: Required. Default: 'Matthew'. Voice ID to use for the synthesis. See [`voiceId` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#voiceid) for more information.
- `sampleRate`: Required. Default: '16000'. The audio frequency specified in Hz. See [`sampleRate` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#samplerate) for more information.
- `engine`: Required. Default: 'standard'. Specifies the engine (standard or neural) for Amazon Polly to use when processing input text for speech synthesis. See [`engine` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#engine) for more information.
- `lexiconNames`: Optional. List of one or more pronunciation lexicon names you want the service to apply during synthesis. See [`lexiconNames` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#lexiconnames) for more information.
- `languageCode`: Optional. Optional language code for the Synthesize Speech request. This is only necessary if using a bilingual voice, such as Aditi, which can be used for either Indian English (en-IN) or Hindi (hi-IN). See [`languageCode` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#languagecode) for more information.
- `speechMarkTypes`: Optional. The type of speech marks returned for the input text. See [`speechMarkTypes` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#speechmarktypes) for more information.

### Credentials

The AWS credentials includes:

```typescript
new PollyTts({
    credentials: {
        accessKeyId: '',
        secretAccessKey: '',
    },
    // ...
}),
```

- `accessKeyId`: AWS access key id
- `secretAccessKey`: AWS secret access key

### TTS Cache

Without a TTS cache, each time text is passed to Polly, you will incur the cost and time of generating the TTS response.

Use a TTS cache to reduce costs and save time.

See [TTS](https://www.jovo.tech/docs/tts) for more information and a list of TTS cache implementations.
