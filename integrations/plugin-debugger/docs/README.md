---
title: 'Jovo Debugger'
excerpt: 'The Jovo Debugger allows you to test and debug your Jovo app by displaying the most important information about each interaction in one place.'
---

# Jovo Debugger

Learn more about the Jovo debugging environment.

## Introduction

The Jovo Debugger allows you to test and debug your Jovo app by displaying the most important information about each interaction in one place. It is connected to the [Jovo Webhook](https://www.jovo.tech/docs/webhook), which makes it possible to test your local code without deploying it to any server.

The Debugger contains both an interaction and a lifecycle view. The interaction view shows all input and output in a chat-like interface. The lifecycle allows you to see how data changes throughout a request lifecycle.

The Debugger can be used in two ways:

- Send requests to the local development server right from the Jovo Debugger by typing or clicking buttons.
- Watch requests from platforms that go through the [Jovo Webhook](https://www.jovo.tech/docs/webhook) server, even if you're testing on a different device (for example an Echo Dot for Alexa).

You can access the Jovo Debugger by executing the [`run` command](https://www.jovo.tech/docs/run-command) and then going to your [Jovo Webhook](https://www.jovo.tech/docs/webhook) URL in the browser (you can do that by typing `.` after `run`).

After the [installation](#installation) section, we're going to take a look at configuration. There are two different types of configurations that you can make when using the Jovo Debugger:

- [Make changes to the Debugger plugin](#debugger-plugin-configuration) that is responsible for connecting your Jovo app with the Debugger
- [Customize your Debugger experience](#debugger-customization), for example which buttons should be displayed in the frontend

## Installation

To connect your Jovo app to the Debugger, you need to install the Jovo Debugger plugin. Most Jovo projects already have the plugin added to the development stage at `app.dev.ts`. [Learn more about staging here](https://www.jovo.tech/docs/staging).

If it is not already added to the project, you can install the Debugger plugin like this:

```sh
$ npm install @jovotech/plugin-debugger
```

The Debugger can only be used for local development, so we recommend adding it to the `app.dev.ts` [app configuration](https://www.jovo.tech/docs/app-config):

```typescript
import { JovoDebugger } from '@jovotech/plugin-debugger';
// ...

app.configure({
  plugins: [
    new JovoDebugger(),
    // ...
  ],
});
```

Learn more about its configuration options in the [Debugger plugin configuration](#debugger-plugin-configuration) section.

## Debugger Plugin Configuration

You can configure the Jovo Debugger plugin in the [app configuration](https://www.jovo.tech/docs/app-config). It includes everything that is needed from the app side for the Debugger to work properly ([for Debugger frontend customization, take a look here](#debugger-customization)).

```typescript
import { JovoDebugger } from '@jovotech/plugin-debugger';
// ...

app.configure({
  plugins: [
    new JovoDebugger({
      nlu: new NlpjsNlu(),
      plugins: [],
      webhookUrl: 'https://webhook.jovo.cloud',
      debuggerConfigPath: './jovo.debugger.js',
      modelsPath: './models',
      ignoredProperties: ['$app', '$handleRequest', '$platform'],
    }),
    // ...
  ],
});
```

It includes the following properties:

- [`nlu`](#nlu): Lets you define which [NLU integration](https://www.jovo.tech/docs/nlu) should be used if the Debugger sends a text request. Learn more in the [NLU section](#nlu) below.
- `plugins`: Under the hood, Jovo Debugger extends the [Jovo Core Platform](https://www.jovo.tech/marketplace/platform-core). You can add any plugin to the `plugins` array in the way you would add it to the Core platform.
- `webhookUrl`: The webhook to pass to the Debugger. By default, your [Jovo Webhook](https://www.jovo.tech/docs/webhook) URL is used.
- [`debuggerConfigPath`](#debugger-customization): The path to the Debugger Config file. Learn more in the [Debugger customization](#debugger-customization) section.
- `modelsPath`: The path to the [Jovo Models](https://www.jovo.tech/docs/models) folder.
- `ignoredProperties`: The [Jovo properties](https://www.jovo.tech/docs/jovo-properties) that should be ignored by the Debugger lifecycle view.

### nlu

> **Important**: Text input in the Debugger does not support built-in entity types like `AMAZON.City` if you are using the default configuration, which uses [NLP.js](https://www.jovo.tech/marketplace/nlu-nlpjs) as NLU.

The `nlu` property defines which [NLU integration](https://www.jovo.tech/docs/nlu) should be used in case the Debugger sends raw text. This usually happens if you type text into the Debugger input field. This raw text is then sent to your Jovo app where it is then turned into structured meaning by using an NLU integration. Depending on which NLU integration you use, there are certain limitations to what types of input can be managed by the Debugger text field.

By default, the Debugger uses [NLP.js as NLU integration](https://www.jovo.tech/marketplace/nlu-nlpjs) with the following default config:

```typescript
nlu: new NlpjsNlu({
  languageMap: {
    de: LangDe,
    en: LangEn,
    es: LangEs,
    fr: LangFr,
    it: LangIt,
  },
});
```

By default, the languages `de`, `en`, `es`, `fr`, and `it` are supported. If you want to support a different language, you need to install the NLP.js language package as explained in the [NLP.js Jovo integration docs](https://www.jovo.tech/marketplace/nlu-nlpjs#language-configuration), and then add it like this:

```typescript
import { JovoDebugger } from '@jovotech/plugin-debugger';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';
import { LangHi } from '@nlpjs/lang-hi';
// ...

app.configure({
  plugins: [
    new JovoDebugger({
      nlu: new NlpjsNlu({
        languageMap: {
          hi: LangHi,
        },
      }),
      // ...
    }),
    // ...
  ],
});
```

This overrides the existing `languageMap` from the default configuration. You can add it back like this:

```typescript
import { JovoDebugger, getDefaultLanguageMap } from '@jovotech/plugin-debugger';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';
import { LangHi } from '@nlpjs/lang-hi';
// ...

app.configure({
  plugins: [
    new JovoDebugger({
      nlu: new NlpjsNlu({
        languageMap: {
          ...getDefaultLanguageMap(),
          hi: LangHi,
        },
      }),
      // ...
    }),
    // ...
  ],
});
```

You can also add a different NLU integration like [Snips NLU](https://www.jovo.tech/marketplace/nlu-snips):

```typescript
import { JovoDebugger } from '@jovotech/plugin-debugger';
import { SnipsNlu } from '@jovotech/nlu-snips';
// ...

app.configure({
  plugins: [
    new JovoDebugger({
      nlu: new SnipsNlu(),
      // ...
    }),
    // ...
  ],
});
```

## Debugger Customization

You can customize the Debugger frontend using the `jovo.debugger.js` file in the root of your Jovo project. [Learn more about the Debugger configuration here](https://www.jovo.tech/docs/debugger-config).

```js
const { DebuggerConfig } = require('@jovotech/plugin-debugger');
// ...

const debugger = new DebuggerConfig({
  locales: [ 'en' ],
  buttons: [
		{
			label: 'LAUNCH',
			input: {
				type: 'LAUNCH'
			}
		},
		{
			label: 'yes',
			input: {
				intent: 'YesIntent'
			}
		},
    // ...
  ]
});
```
