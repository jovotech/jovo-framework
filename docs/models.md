---
title: 'Models'
excerpt: 'Learn more about how to use Jovo Model files to maintain language models that work across platforms and NLU services.'
---

# Models

Learn more about how to use Jovo Model files to maintain language models that work across platforms and NLU services.

## Introduction

A big part of a Jovo app is the interpretation of natural language into structured meaning. This step of the [RIDR Lifecycle](./ridr-lifecycle.md) is often called natural language understanding (NLU).

The result of the NLU process usually includes the following:

- At least one `intent`: This is the underlying reason behind the user's request. For example, "_my name is max_" and "_I'm max_" could both be matching a `MyNameIsIntent`.
- Sometimes `entities`: An intent could include one or more variable element, called an entity. For example, "_my name is max_" could result in an entity `name: 'max'`.

The [router](./routing.md) then uses this information as part of the [`$input` object](./input.md) to find the right [handler](./handlers.md) to respond to a user request.

Depending on the setup, the natural language understanding is either done by a [platform](./platforms.md) (e.g. Alexa requests already contain intents etc.) or [NLU](./nlu.md) integration. These services train a language model based on a specific schema that contains sample phrases for each intent, and values for each entity type

Maintaining language models across platforms and services can be a tedious task. For this, Jovo offers the [Jovo Model](https://github.com/jovotech/jovo-model), an open source schema that can be translated into models specifications that work for platforms like Alexa, Google Assistant, Rasa, LUIS, and more. [Learn more about the schema here](https://www.jovo.tech/docs/model-schema).

You can find all model files in the `models` folder of your Jovo project. You can use the Jovo CLI `build` command to translate them into native model files for each platform or service.

## Model Schema

Each locale (e.g. `en`, `en-US`, `de-DE`) has its own file that is structured in a specific schema.

Here is an example model file:

```json
{
  "version": "4.0",
  "invocation": "my test app",
  "intents": {
    "YesIntent": {
      "phrases": ["yes", "yes please", "sure"]
    },
    "NoIntent": {
      "phrases": ["no", "no thanks"]
    }
  }
}
```

[Learn more about the model schema here](https://www.jovo.tech/docs/model-schema).
