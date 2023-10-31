---
title: 'NLP.js NLU Integration'
excerpt: 'Turn raw text into structured meaning with the Jovo Framework integration for the open source natural language understanding service NLP.js.'
url: 'https://www.jovo.tech/marketplace/nlu-nlpjs'
---

# NLP.js NLU Integration

Turn raw text into structured meaning with the Jovo Framework integration for the open source natural language understanding service NLP.js.

## Introduction

[NLP.js](https://github.com/axa-group/nlp.js) is an open source [natural language understanding (NLU)](https://www.jovo.tech/docs/nlu) library with features like entity extraction, sentiment analysis, and language detection.

Since it is an open source service, you can host NLP.js on your own servers without any external API calls.

You can use the Jovo NLP.js integration for projects where you receive raw text input that needs to be translated into structured meaning to work with the Jovo intent structure. Learn more in the [NLU integration docs](https://www.jovo.tech/docs/nlu).

Smaller NLP.js language models are fast to train and can even be used on serverless infrastructure like [AWS Lambda](https://www.jovo.tech/marketplace/server-lambda) without having to use any additional server infrastructure. We recommend taking a close look at the execution times though, as larger models can take quite some time to build.

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/nlu-nlpjs
```

NLU plugins can be added to Jovo platform integrations. Here is an example how it can be added to the [Jovo Core Platform](https://www.jovo.tech/marketplace/server-lambda) in your `app.ts` [app configuration](https://www.jovo.tech/marketplace/platform-core):

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

For each language you want to use with NLP.js, you need to download the respective language package. Here is an example for [`en` (English)](https://github.com/axa-group/nlp.js/tree/master/packages/lang-en):

```sh
$ npm install @nlpjs/lang-en
```

You can then add this to your `languageMap`:

```typescript
import { LangEn } from '@nlpjs/lang-en';
// ...

new NlpjsNlu({
  languageMap: {
    en: LangEn,
    // ...
  },
  // ...
}),
```

Each key (in the above case `en`) represents a locale that can be found in your [Jovo Model](#jovo-model).

You can find more information about [supported languages](https://github.com/axa-group/nlp.js/blob/master/docs/v4/language-support.md) and [available packages](https://github.com/axa-group/nlp.js/tree/master/packages) in the official NLP.js docs.

## Intents

When user input matches a defined intent, the NLU response includes the name in `$input.nlu`:

```json
// $input.nlu
{
  "intent": {
    "name": "YesIntent"
  }
}
```

When no intent is matched, `$input.nlu` will include the `None` intent:

```json
// $input.nlu

{
  "intent": {
    "name": "None"
  }
}
```

## Entities

You can access NLP.js entities by using the `$entities` property. You can learn more in the [Jovo Model](https://www.jovo.tech/docs/models) and the [`$entities` documentation](https://www.jovo.tech/docs/entities).

The NLP.js entity values are translated into the following Jovo entity properties:

```typescript
{
  value: utteranceText, // what the user said
  resolved: option, // the resolved value
  id: option, // same as resolved, since NLP.js doesn't support IDs
  native: { /* raw API response for this entity */ }
}
```

## Jovo Model

You can use the [Jovo Model](https://www.jovo.tech/docs/models) to turn the language model files in your `models` folder into an NLP.js model. [Learn more about the NLP.js Jovo Model integration here](https://www.jovo.tech/marketplace/nlu-nlpjs/model).

See the sample [Jovo model](./jovo4-model-en.json) and the corresponding [NLP.js model](./nlpjs-corpus-en.json).

For NLP.js, the Jovo Model supports the following Intent items:

- [Intent only](#intent-only)
- [Custom enum entities](#custom-enum-entities)
- [Custom regex entities](#custom-regex-entities)
- [Builtin entities](#builtin-entities)
- [Combined builtin and custom entities](#combined-builtin-and-custom-entities)

To learn more, see [NER Manager](https://github.com/axa-group/nlp.js/blob/master/docs/v4/ner-manager.md) from the NLP.js docs.

### Intent only

An intent-only entry includes an array of `phrases`:

```json
// Jovo model
{
  "invocation": "my test app",
  "version": "4.0",
  "intents": {
    "YesIntent": {
      "phrases": [
        "yes",
        "yes please",
        "sure"
      ]
    }
  }
}
```

### Custom enum entities

An intent can include an array of `phrases` with `{variables}` that map to a key in the `entities` object. The developer defines the name of the variable.

For a custom enum entity, the `type` is a custom name that you define and a corresponding entry must be added to the `entityTypes` section. Custom enum entity types can include synonyms:

```json
// Jovo model
{
  "invocation": "my test app",
  "version": "4.0",
  "intents": {
    "ColorIntent": {
      "phrases": [
        "i pick {color}",
        "my favorite color is {color}"
      ],
      "entities": {
        "color": {
          "type": "CUSTOM_COLORS"
        }
      }
    }
  },
  "entityTypes": {
    "CUSTOM_COLORS": {
      "name": "CUSTOM_COLORS",
      "values": [
        {
          "value": "red",
          "synonyms": [
            "crimson"
          ]
        },
        {
          "value": "yellow",
          "synonyms": []
        },
        {
          "value": "blue",
          "synonyms": []
        },
        {
          "value": "green",
          "synonyms": []
        },
        {
          "value": "orange",
          "synonyms": []
        },
        {
          "value": "purple",
          "synonyms": []
        }
      ]
    }
  }
}
```

In NLP.js, the list of values for an enum is "closed" meaning that only values (or synonyms) listed will be recognized.


### Custom regex entities

An intent can include an array of `phrases` with `{variables}` that map to a key in the `entities` object. The developer defines the name of the variable.

For a regex entity, the `type` starts with `"regex:"` followed by a regular expression:

```json
// Jovo model

{
  "invocation": "my test app",
  "version": "4.0",
  "intents": {
    "SsnIntent": {
      "phrases": [
        "my tax id is {ssn}"
      ],
      "entities": {
        "ssn": {
          "type": "regex:/(?!000)(?!666)(?!9)[0-9]{3}[ -]?(?!00)[0-9]{2}[ -]?(?!0000)[0-9]{4}/g"
        }
      }
    }
  }
}
```

### Builtin entities

When defining the Jovo Model for builtin entities, you don't need to include the `entities` object.

```json
// Jovo model
{
  "invocation": "my test app",
  "version": "4.0",
  "intents": {
    "NumberIntent": {
      "phrases": [
        "the number is {number}",
        "pick a number between {number_0} and {number_1}"
      ]
    }
  }
}
```

The NLP.js integration picks the names of the variables when an entity is matched. It doesn't matter what name you use in the utterance. For consistency, see the list of names [below](#microsoft-builtin) found in the `allowList` array.

#### Builtin libraries

The NLP.js library allows for various builtin entity libraries to be configured. These libraries include popular regex matchers (recognizers) and post processing for numbers, dates and more.

#### Microsoft Builtin
To configure the [Microsoft Builtin library](https://github.com/axa-group/nlp.js/blob/master/packages/builtin-microsoft/src/builtin-microsoft.js), you must use the plug-in configuration `setupModelCallback` function:

```ts
// app.ts

import { Nlp, NlpjsNlu } from '@jovotech/nlu-nlpjs';
import { LangEn } from '@nlpjs/lang-en';
import { Platform } from '@jovotech/framework';
import { BuiltinMicrosoft } from '@nlpjs/builtin-microsoft';

const nlp = new NlpjsNlu({
  languageMap: { en: LangEn },
  enabled: true,
  setupModelCallback: async (platform: Platform, nlpjs: Nlp) => {
    // configure builtin
    const builtin = new BuiltinMicrosoft({
      tag: 'builtin-microsoft',
      builtins: [
        'Age',
        'Boolean',
        'Currency',
        'DateTime',
        'Dimension',
        'Email',
        'Hashtag',
        'IpAddress',
        'Mention',
        'Number',
        'Ordinal',
        'Percentage',
        'PhoneNumber',
        'Temperature',
        'URL',
      ],
      allowList: [
        'age',
        'boolean',
        'currency',
        'date',
        'daterange',
        'datetime',
        'datetimealt',
        'datetimerange',
        'dimension',
        'duration',
        'email',
        'hashtag',
        'ip',
        'mention',
        'number',
        'numberrange',
        'ordinal',
        'percentage',
        'phonenumber',
        'set',
        'temperature',
        'time',
        'timerange',
        'timezone',
        'url',
      ],
    });

    // register builtin
    nlpjs.container.register('extract-builtin-??', builtin, true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    // convert Jovo Model to NLP.js corpus and add
    await nlp.addCorpusFromModelsIn('./models');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    // train corpus
    await nlpjs.train();
  },
});

app.configure({
  plugins: [
    new JovoDebugger({
      nlu: nlp, // overwrite default NLP.js config
    }),
  ],
});
```
NOTE: 
To get TypeScript to compile with the Microsoft Builtin library, you may need to add a custom type file and update `tsconfig.json`:

```ts
// types/custom.d.ts
declare module '@nlpjs/builtin-microsoft';
```

```json
// tsconfig.json

{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./types"]
  },
  "include": [
    "src",
    "types"
  ],
}
```

The constructor for the `BuiltinMicrosoft` object accepts a configuration. An empty config gets the [default configuration](https://github.com/axa-group/nlp.js/blob/master/packages/builtin-microsoft/src/builtin-microsoft.js#L84-L134). The tag must be `"builtin-microsoft"`. The `builtins` array is used to determine which recognizers are called. The `allowList` array determines which entities appear in the result. You can tell by the names used in each list which recognizers go with which entity names.

NLP.js will call every recognizer listed for every input without regard to the intent matched. Whenever the regex in a recognizer matches a string pattern, the entity is added to the `$entities` property. Only include the recognizers that you want to process in the `builtins` array and confirm that the corresponding entity names are listed in the `allowList`.


### Combined builtin and custom entities

Here is an example of using an enum entity with a builtin entity:

```json
// Jovo model
{
  "invocation": "my test app",
  "version": "4.0",
  "intents": {
    "PetIntent": {
      "phrases": [
        "i have a {pet}",
        "i want {number} {pet}"
      ],
      "entities": {
        "pet": {
          "type": {
            "nlpjs": "CUSTOM_PET"
          }
        }
      }
    }
  },
  "entityTypes": {
    "CUSTOM_PET": {
      "name": "CUSTOM_PET",
      "values": [
        {
          "value": "dog",
          "synonyms": ["dogs"]
        },
        {
          "value": "cat",
          "synonyms": ["cats"]
        }
      ]
    },
  }  
}
```

## Limitations

### Same type different name
NLP.js does not support multiple entities of the same type in the same phrase, for example `fly from {fromCity} to {toCity}`. In that example, it is possible that the input `fly from Berlin to Amsterdam` is mapped to two `toCity` entities.

If you need to use a pattern like this, we recommend taking a look at other NLU integrations like [Snips NLU](https://www.jovo.tech/marketplace/nlu-snips).

### Multiple Matches
For enum, regex and builtin entities if there are multiple matches, the entities are named with a suffix `_0`, `_1`, etc.

Examples:
- "pick red and blue" (enum): color_0, color_1
- "they are 111-22-3333 and 222-33-4444" (regex): ssn_0, ssn_1
- "from 1 to 10" (builtin): number_0, number_1

Matches are always left to right.

### Aggressive entity matching
Another limitation of NLP.js is that the intent matching is separate from the processing of entities. This means that you could end up with entities for an intent that doesn't define it. This applies to enum, regex and builtin entities.

For example, here is an intent definition that includes no entities:

```json
// Jovo model
{
  "invocation": "my test app",
  "version": "4.0",
  "intents": {
    "YesIntent": {
      "phrases": [
        "yes",
        "yes please",
        "sure"
      ]
    }
  }
}
```

The plug-in is configured to use builtin entities and also defines a CUSTOM_COLOR enum.

When the input is `"yes red please"` the NLU response includes entities:

```json
// $input.nlu
{
  "intent": {
    "name": "YesIntent"
  },
  "entities": {
    "color": {
      "id": "red",
      "resolved": "red",
      "value": "red",
      "native": {
        "start": 4,
        "end": 6,
        "len": 3,
        "levenshtein": 0,
        "accuracy": 1,
        "entity": "color",
        "type": "enum",
        "option": "red",
        "sourceText": "red",
        "utteranceText": "red"
      }
    },
    "boolean": {
      "value": "yes",
      "native": {
        "start": 0,
        "end": 2,
        "len": 3,
        "accuracy": 0.95,
        "sourceText": "yes",
        "utteranceText": "yes",
        "entity": "boolean",
        "rawEntity": "boolean",
        "resolution": {
          "value": true,
          "score": 0.6,
          "otherResults": []
        }
      }
    }
  }
}
```

### Trim entities
NLP.js allows for the definition of trim rules for entity matching. This is not supported by the Jovo Model v4.0 format.

Learn more about Trim entities [here](https://github.com/axa-group/nlp.js/blob/master/docs/v4/ner-manager.md#trim-entities).

To get around this Jovo 4 model limitation, you can train an NLP.js corpus file directly:

```ts
// app.ts
import { Nlp, NlpjsNlu } from '@jovotech/nlu-nlpjs';
import { LangEn } from '@nlpjs/lang-en';
import { Platform } from '@jovotech/framework';
import corpus from './nlpjs-corpus-en.json';

const nlp = new NlpjsNlu({
  languageMap: { en: LangEn },
  enabled: true,
  setupModelCallback: async (platform: Platform, nlpjs: Nlp) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // await nlp.addCorpusFromModelsIn('./models');
    nlpjs.addCorpus(corpus[0].content);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await nlpjs.train();
  },
});


app.configure({
  plugins: [
    new JovoDebugger({
      nlu: nlp, // overwrite default NLP.js config
    }),
  ],
});
```