---
title: 'NLP.js NLU Integration'
excerpt: 'Turn raw text into structured meaning with the Jovo Framework integration for the open source natural language understanding service NLP.js.'
---
# NLP.js NLU Integration

Turn raw text into structured meaning with the Jovo Framework integration for the open source natural language understanding service NLP.js.

## Introduction

[NLP.js](https://github.com/axa-group/nlp.js) is an open source [natural language understanding (NLU)](https://www.jovo.tech/docs/nlu) library with features like entity extraction, sentiment analysis, and language detection.

Since it is an open source service, you can host NLP.js on your own servers without any external API calls.

You can use the Jovo NLP.js integration for projects where you receive raw text input that needs to be translated into structured meaning to work with the Jovo intent structure. Learn more in the [NLU integration docs](https://www.jovo.tech/docs/nlu).

Smaller NLP.js language models are fast to train and can even be used on serverless infrastructure like [AWS Lambda](https://www.jovo.tech/docs/hosting/aws-lambda) without having to use any additional server infrastructure. We recommend taking a close look at the execution times though, as larger models can take quite some time to build.

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/nlu-nlpjs
```

NLU plugins can be added to Jovo platform integrations. Here is an example how it can be added to the Jovo Core Platform in `app.ts`:

```typescript
import { CorePlatform } from '@jovotech/platform-core';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';

// ...

app.configure({
  plugins: [
    new CorePlatform({
      plugins: [new NlpjsNlu()],
    }),
    // ...
  ],
});
```

## Configuration

The following configurations can be added:

```typescript
new NlpjsNlu({
  languageMap: { /* ... */ },
  preTrainedModelFilePath: './model.nlp',
  useModel: false,
  modelsPath: './models',
  setupModelCallback: (platform: Platform, nlpjs) => { /* ... */ },
}),
```

- `languageMap`: Maps locales to NLP.js language packages. The default is an empty object. See [language configuration](#language-configuration) for more information.
- `useModel` and `preTrainedModelFilePath`: NLP.js can take a pre-trained model if `useModel` is set to `true`. It looks for the model in the `preTrainedModelFilePath`. The default is `./model.nlp`.
- `setupModelCallback`: A function that can be passed to set up NLP.js. The first parameter is the current `Platform` and the second parameter is the `Nlp`-instance of NLP.js.

Depending on the configuration, NlpjsNlu will try to use the `setupModelCallback` if it exists.
Otherwise, the integration will check if `useModel` is set to `true`, if that's the case, the model is getting loaded from `preTrainedModelFilePath`.
If `setupModelCallback` does not exist and `useModel` is falsy, the integration will attempt to build a model based on the local models and train it.

### Language Configuration

By default, the Jovo NLP.js integration comes with the [NLP.js language package for `en` (English)](https://github.com/axa-group/nlp.js/tree/master/packages/lang-en).

To make it work with other languages, you need to download the respective language package. Here is an example for `de` (German):

```sh
$ npm install @nlpjs/lang-de
```

You can then add this to your `languageMap`:

```typescript
import { LangEn } from '@nlpjs/lang-en';
import { LangDe } from '@nlpjs/lang-de';
// ...

new NlpjsNlu({
  languageMap: {
    en: LangEn,
    de: LangDe
  },
  // ...
}),
```

Each key (in the above case `en` and `de`) represents a locale that can be found in your [Jovo Model](#jovo-model).

You can find more information about [supported languages](https://github.com/axa-group/nlp.js/blob/master/docs/v4/language-support.md) and [available packages](https://github.com/axa-group/nlp.js/tree/master/packages) in the official NLP.js docs.


## Jovo Model

You can use the [Jovo Model](https://www.jovo.tech/marketplace/jovo-model) to turn the language model files in your `models` folder into an NLP.js model. [Learn more about the NLP.js Jovo Model integration here](https://v4.jovo.tech/marketplace/nlu-nlpjs/model).
