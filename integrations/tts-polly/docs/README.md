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

If you are running your Jovo app on [AWS Lambda](https://www.jovo.tech/marketplace/server-lambda), there is no need to add configurations if you want to stick to the [default options](#configuration). For apps outside AWS Lambda, you need to add a `region` and `credentials` to the [`libraryConfig`](#libraryconfig) like this:

```typescript
new PollyTts({
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

Learn more about all configurations in the [configuration section](#configuration).

## Configuration

The following configurations can be added:

```typescript
new PollyTts({
  outputFormat: 'mp3',
  fallbackLocale: 'en-US',
  voiceId: 'Matthew',
  sampleRate: '16000',
  engine: 'standard',
  lexiconNames: [],
  languageCode: 'en-IN',
  speechMarkTypes: [],
  cache: new SampleTtsCache({/* ... */}),
  libraryConfig: {
    region: 'us-east-1',
    // ...
  }
}),
```

- `outputFormat`: The format in which the returned output will be encoded. See [`outputFormat` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#outputformat) for more information. Default: `mp3`.
- `fallbackLocale`: Used as a fallback if the locale from Jovo is not found. Default: `en-US`.
- `voiceId`: Voice ID to use for the synthesis. See [`voiceId` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#voiceid) for more information. Default: `Matthew`.
- `sampleRate`: The audio frequency specified in Hz. See [`sampleRate` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#samplerate) for more information. Default: `16000`.
- `engine`: Specifies the engine (standard or neural) for Amazon Polly to use when processing input text for speech synthesis. See [`engine` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#engine) for more information. Default: `standard`.
- `lexiconNames`: List of one or more pronunciation lexicon names you want the service to apply during synthesis. See [`lexiconNames` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#lexiconnames) for more information. Optional.
- `languageCode`: Language code for the Synthesize Speech request. This is only necessary if using a bilingual voice, such as Aditi, which can be used for either Indian English (en-IN) or Hindi (hi-IN). See [`languageCode` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#languagecode) for more information. Optional.
- `speechMarkTypes`: The type of speech marks returned for the input text. See [`speechMarkTypes` Polly docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/synthesizespeechcommandinput.html#speechmarktypes) for more information. Optional.
- `cache`: [TTS Cache](#tts-cache) integration. Optional.
- [`libraryConfig`](#libraryconfig): [`PollyClientConfig` object](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/pollyclientconfig.html) that is passed to the Polly client. Use this for configurations like `region` or `credentials`. Optional.

### TTS Cache

Without a TTS cache, each time text is passed to Polly, you will incur the cost and time of generating the TTS response.

Use a TTS cache to reduce costs and save time.

See [TTS](https://www.jovo.tech/docs/tts) for more information and a list of TTS cache implementations.


### libraryConfig

The `libraryConfig` property can be used to pass configurations to the AWS Polly SDK that is used by this integration.

```typescript
new PollyTts({
  libraryConfig: { /* ... */ },
  // ...
}),
```

You can learn more about all config options in the [official `PollyClientConfig` reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-polly/interfaces/pollyclientconfig.html).

For example, you can add a `region` and `credentials` like shown below. This is necessary if you are hosting your Jovo app outside of an AWS environment.

```typescript
new PollyTts({
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

