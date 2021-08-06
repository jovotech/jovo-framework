# NLP.js NLU Integration

Turn raw text into structured meaning with the Jovo Framework integration for the open source natural language understanding service NLP.js.
- [Introduction](#introduction)
- [Installation](#installation)
- [Configuration](#configuration)
- [Jovo Model](#jovo-model)

## Introduction

[NLP.js](https://github.com/axa-group/nlp.js) is an open source [natural language understanding (NLU)](https://www.jovo.tech/marketplace/tag/nlu) library with features like entity extraction, sentiment analysis, and language detection.

Since it is an open source service, you can host NLP.js on your own servers without any external API calls.

You can use the Jovo NLP.js integration for projects where you receive raw text input that needs to be translated into structured meaning to work with the Jovo intent structure. Patforms like the [Jovo Core Platform](https://www.jovo.tech/marketplace/jovo-platform-core) (e.g. in conjunction with the [Jovo Web Client](https://www.jovo.tech/marketplace/jovo-client-web)), [Facebook Messenger](https://www.jovo.tech/marketplace/jovo-platform-facebookmessenger), and [Google Business Messages](https://www.jovo.tech/marketplace/jovo-platform-googlebusiness) are some examples where this would work.

Smaller NLP.js language models are fast to train and can even be used on serverless infrastructure like [AWS Lambda](https://www.jovo.tech/docs/hosting/aws-lambda) without having to use any additional server infrastructure. We recommend taking a close look at the execution times though, as larger models can take quite some time to build.


## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/nlu-nlpjs --save
```

NLU plugins can be added to Jovo platform integrations. Here is an example how it can be added to the Jovo Core Platform in `app.ts`:

```typescript
import { CorePlatform } from '@jovotech/platform-core';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';

// ...

app.configure({
  plugins: [
    new CorePlatform().use(new NlpjsNlu({
      // Configuration
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
  setupModelCallback: () => { /* ... */ },
}),
```


* `languageMap`: TODO
* `useModel` and `preTrainedModelFilePath`: NLP.js can take a pretrained model if `useModel` is set to `true`. It looks for the model in the `preTrainedModelFilePath`. The default is `./model.nlp`.
* `setupModelCallback`: TODO



## Jovo Model

You can use the [Jovo Model](https://www.jovo.tech/marketplace/jovo-model) to turn the language model files in your `models` folder into an NLP.js model. [Learn more about the NLP.js Jovo Model integration here](https://www.jovo.tech/marketplace/jovo-model/nlpjs).