# Snips NLU Integration

Turn raw text into structured meaning with the Jovo Framework integration for the open source natural language understanding service Snips NLU.

- [Introduction](#introduction)
- [Installation](#installation)
- [Configuration](#configuration)
- [Dynamic Entities](#dynamic-entities)

## Introduction

[Snips NLU](https://github.com/snipsco/snips-nlu) is an open source [natural language understanding (NLU)](https://www.jovo.tech/marketplace/tag/nlu) library.

Since it is an open source service, you can host Snips NLU on your own servers without any external API calls. You can learn how to set up a server in the [official Snips NLU documentation](https://snips-nlu.readthedocs.io/en/latest/).

You can use the Jovo Snips NLU integration for projects where you receive raw text input that needs to be translated into structured meaning to work with the Jovo intent structure. Platforms like the [Jovo Core Platform](https://www.jovo.tech/marketplace/jovo-platform-core) (e.g. in conjunction with the [Jovo Web Client](https://www.jovo.tech/marketplace/jovo-client-web)), [Facebook Messenger](https://www.jovo.tech/marketplace/jovo-platform-facebookmessenger), and [Google Business Messages](https://www.jovo.tech/marketplace/jovo-platform-googlebusiness) are some examples where this would work.


## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/nlu-snips --save
```

NLU plugins can be added to Jovo platform integrations. Here is an example how it can be added to the Jovo Core Platform in `app.ts`:

```typescript
import { CorePlatform } from '@jovotech/platform-core';
import { SnipsNlu } from '@jovotech/nlu-snips';

// ...

const app = new App({
  plugins: [
    new CorePlatform({
      plugins: [new SnipsNlu()],
    }),
    // ...
  ],
});
```

## Configuration

The following configurations can be added:

```typescript
new SnipsNlu({
  serverUrl: 'http://localhost:5000/',
  serverPath: '/engine/parse',
  fallbackLanguage: 'en',
  modelsDirectory: 'models',
  engineId: '',
}),
```

- `serverUrl` and `serverPath`: The API endpoint where the Snips NLU server can be reached.
- `fallbackLanguage`: The language that gets used if the request doess not come with a language property. Default: `en`.
- `modelsDirectory`: For [dynamic entities](#dynamic-entities), it is necessary to set the path to the Jovo Model files. Default: `models`.
- `engineId`: This ID gets passed to the Snips NLU server. Default: Random `uuid`.


## Dynamic Entities

It is possible to set up Snips NLU to work with [dynamic entities](../../docs/entities.md).

The Jovo Snips NLU integration automatically parses the entities that are added to the `listen` object of the output, and sends them to the Snips NLU server along with the session ID.

The Snips NLU server then trains an updated model just for the intents that use the `entities` from `listen`.