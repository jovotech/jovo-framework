---
title: 'TTS Integrations'
excerpt: 'Learn more about text to speech (TTS) services that can be integrated with Jovo.'
---

# TTS Integrations

Learn more about text to speech (TTS) services that can be integrated with Jovo.

## Introduction

Text to speech (in short, TTS) is the process of turning text-based responses into spoken audio. It is part of the `response` step of the [RIDR lifecycle](./ridr-lifecycle.md). The `response.tts` step occurs after the platform-specific [response](./response.md) has been created.

Jovo offers (and is working on) integrations with a variety of TTS services that can either be self-hosted or accessed via an API. [You can find all the current integrations here](#integrations).

TTS integrations are helpful for platforms that can play audio files or when you want to replace the platform's default TTS implementation. The integration replaces the [response](./response.md) speech and reprompt entry with an audio tag. If the response supports multiple speech or reprompts then each will be replaced.

The original speech or reprompt needs to be either plain text or Speech Synthesis Markup Language (SSML) as supported by the chosen TTS integration. For example, if the Amazon Polly TTS implementation was selected then speech and reprompt should only contain SSML tags supported by Polly.

Learn more about Jovo TTS integrations in the following sections:

- [Integrations](#integrations)
- [Configuration](#configuration)
- [Custom Implementation](#custom-tts-integration)

## Integrations

Currently, the following integrations are available with Jovo `v4`:

- Polly TTS (_work in progress_)

## Configuration

A TTS integration needs to be added as a [platform](./platforms.md) plugin in the [app configuration](./app-config.md). Here is an example how it could look like in the `app.ts` file:

```typescript
import { CorePlatform } from '@jovotech/platform-core';
import { PollyTts } from '@jovotech/tts-polly';
// ...

const app = new App({
  plugins: [
    new CorePlatform({
      plugins: [new PollyTts()],
    }),
    // ...
  ],
});
```

Along with integration specific options (which can be found in each integration's documentation), there are also features that are configured the same way across all TTS integrations.

The following configurations can be set for each TTS integration:

```typescript
new PollyTts({
  // ...
  cache: new S3TtsCache({ /* ... */ }),
  fallbackLocale: 'en',
  fileExtension: 'mp3',
}),
```

- `cache`: Initialize a TTS Cache integration here to store converted audio files on a cloud service, for example AWS S3.
- `fallbackLocale`: The locale that gets used for the creation of the audio files in case no locale can be found in the [request](./request.md).
- `fileExtension`: The desired format of the resulting audio, for example `mp3`.

## Custom Implementation

Learn more about building your own custom TTS (and TTS Cache) integrations in the following sections:

- [Custom TTS Integration](#custom-tts-integration)
- [TTS Data](#tts-data)
- [Custom TTS Cache](#custom-tts-cache)

### Custom TTS Integration

If you want to create your own TTS integration, you can build your own plugin, which extends [`TtsPlugin`](https://github.com/jovotech/jovo-framework/blob/v4/latest/framework/src/plugins/TtsPlugin.ts).

```ts
import { Jovo, TtsPlugin, TtsPluginConfig } from '@jovotech/framework';

export interface SampleTtsConfig extends TtsPluginConfig {
  myKey: string;
}

export class SampleTts extends TtsPlugin<SampleTtsConfig> {
  supportedSsmlTags: string[] = [
    'break',
    'emphasis',
    'speak',
    // ...
  ];

  constructor(config: SampleTtsConfig) {
    super(config);

    // init TTS client
  }

  getDefaultConfig(): SampleTtsConfig {
    return {
      fallbackLocale: 'en-US',
      fileExtension: 'mp3',
      // ...

      // integration-specific config values
      myKey: 'myValue',
    };
  }

  getKeyPrefix(): string | undefined {
    return `sampletts-${this.config.myKey.toLowerCase()}`;
  }

  async processTts(jovo: Jovo, text: string, textType: TtsTextType): Promise<TtsData | undefined> {
    // text - string to process with TTS client
    // textType - is text TtsTextType.Text or TtsTextType.Ssml

    // Call TTS client

    return {
      text: text, // text or ssml passed as param
      key: 'sampletts-myValue-XXXXX...', // prefix + MD5 hash of text
      contentType: 'audio/mpeg', // audio MIME type
      fileExtension: 'mp3',
      encodedAudio: 'XXXXXX...', // base64 encoded audio
    };
  }
}
```

The plugin consists of the following methods:

- `supportedSsmlTags`: An array of strings listing which SSML tags the TTS plugin supports.
- `getKeyPrefix()`: An optional function that returns a prefix used to generate a cache key for a given text string.
- `processTts()`: A function that performs th

### TTS Data

```ts
export interface TtsData {
  contentType?: string;
  encodedAudio?: string;
  fileExtension?: string;
  key?: string;
  text?: string;
  url?: string;
}
```

The TtsData object includes the following fields:

- `contentType`: Audio MIME type. ex: `audio/mpeg`
- `encodedAudio`: Base64 encoded audio. Often this is the format the TTS provides support.
- `fileExtension`: File extension based on content type. ex: `mp3`
- `key`: Key that can be used for caching the TTS response. Includes prefix + MD5 hash of text.
- `text`: The speech or reprompt text passed to the TTS integration. Can be plain text or SSML.
- `url`: Source URL for audio file. The filename is the key + fileExtension. Often the TTS cache sets the `url` value.

### Custom TTS Cache

Without a TTS Cache, the TTS integration could (over time) be called multiple times for the same speech or reprompt text. This could be costly and slow. A TTS Cache solves this issue by checking if the TTS response exists in the cache before it makes the call to the TTS client. If the cached entry exists, it will be used. If not, the TTS client will be called and the TTS response will be added to the cache. The `key` property in `TtsData` will be used as the cache key.

The configure a TTS integration to use a cache, set the `cache` configuration value:

```ts
import { CorePlatform } from '@jovotech/platform-core';
import { SampleTts } from 'sample-tts';
import { SampleTtsCache } from 'sample-tts-cache';
// ...

const app = new App({
  plugins: [
    new CorePlatform({
      plugins: [
        new SampleTts({
          cache: new SampleTtsCache({
            // ...
          }),
        }),
      ],
    }),
    // ...
  ],
});
```

If you want to create your own TTS cache, you can build your own plugin.

```ts
import { Jovo, TtsPlugin, TtsPluginConfig } from '@jovotech/framework';

export interface SampleTtsCacheConfig extends TtsCachePluginConfig {
  myKey: string;
}

export class SampleTtsCache extends TtsCachePlugin<SampleTtsCacheConfig> {
  constructor(config: SampleTtsCacheConfig) {
    super(config);

    // init TTS cache client
  }

  getDefaultConfig(): SampleTtsCacheConfig {
    return {
      returnEncodedAudio: false,
      // ...

      // integration-specific config values
      myKey: 'myValue',
    };
  }

  async getItem(key: string, locale: string, fileExtension: string): Promise<TtsData | undefined> {
    // key - the TTS cache key
    // locale - The locale of the TTS response. ex: `en-US`.
    // fileExtension - The file extension for the audio source URL. ex: `mp3`

    // Call TTS client

    // return TtsData
    return {
      key: 'sampletts-myValue-XXXXX...', // prefix + MD5 hash of text
      contentType: 'audio/mpeg', // audio MIME type
      encodedAudio: 'XXXXXX...', // base64 encoded audio. Only when this.config.returnEncodedAudio is `true`.
      url: 'https://example.com/sampletts-myValue-XXXXX...', // Source URL for audio file.
    };
  }

  async storeItem(key: string, locale: string, data: TtsData): Promise<string | undefined> {
    // key - the TTS cache key
    // locale - The locale of the TTS response. ex: `en-US`.
    // data - TtsData created after TTS client called.

    // Call TTS client

    // return audio source URL, if caching is successful
    return 'https://example.com/sampletts-myValue-XXXXX...';
  }
}
```

The plugin consists of the following:

- `getItem()`: Attempts to get the TTS response from the cache. If success, does not call TTS integration to generate response.
- `storeItem()`: If TTS response does not exist in TTS cache, store the item in the cache and return source URL.
