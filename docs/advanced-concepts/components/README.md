# Conversational Components

* [Introduction](#introduction)
* [Component Structure](#component-structure)
  * [handler](#handler)
  * [config](#config)
  * [i18n](#i18n)
  * [index](#index)
* [Using Conversational Components](#using-conversational-components)
* [Developing Conversational Components](#developing-conversational-components)

## Introduction

The idea behind Conversational Components is to provide solutions for recurring problems you might encounter while creating voice apps.

They are pre-built npm packages containing the necessary **language model**, **handler** (logic) and **i18n** (cms) files, which you utilize by delegating the task to the component.

## Component Structure

Each component has the following structure:

```
models/
  └── en-US.json
  └── de-DE.json
  └── ...
src/
  └── i18n/
    └── en-US.json
    └── de-DE.json
    └── ...
  └── handler.js
  └── config.js
index.js
```

The `models` folder contains the language model, the `src` folder contains the logic and the `i18n` folder contains the components responses.

### handler

The component's handler contains the states/intents to fulfill the incoming request. The only difference between the Jovo project's handler and component's handler is, that all of its intents are inside a state named after the component itself with the `START` intent being its entry point.

```js
// @language=typescript
// handler.ts

const handler: Handler = {
    ConductSurvey: {
        START() {

        },
        // other intents
    }
}
```

### config

Every component has its own default configuration, which can be overwritten by the developer. 

They provide you with a way to customize them without having to go through the handler and modifying stuff there. The possible options should be documented in each component's own README file.

```js
// @language=typescript
// config.ts

import { ComponentConfig } from 'jovo-framework';

interface SurveyConfig extends ComponentConfig {
    numberOfQuestions: number;
}

const config: SurveyConfig = {
    intentMap: {
        'AMAZON.HelpIntent': 'HelpIntent',
        'AMAZON.StopIntent': 'END',
        'StopIntent': 'END'
    },
    numberOfQuestions: 3
};

export {SurveyConfig, config as Config};
```

### i18n

The i18n folder contains the component's responses. Again, it's a way for the developer to customize the component, without having to dig through the handler.

The sample dialogs in the component's README file, should give you the necessary information you need to make changes to the responses.

For now, i18n is the only supported CMS, with other external ones planned.

```js
{
    "translation": {
        "component-ConductSurvey": {
            "help": "Simply answer to the questions with a number between 1 and 5, where 1 is the worst and 5 is the best.",
            "questions": {
                "1": "Question 1",
                "2": "Question 2",
                "3": "Question 3",
                "4": "Question 4"
            },
            "start": "Please help me improve by answering the {{numberOfQuestions}} following questions with a number between 1 and 5, where 1 is the worst and 5 is the best.",
            "invalid-answer": "Please answer with a number between 1 and 5. "
        }
    }
}
```

### index

The `index.ts` file at the root is the entry point of each component. It exports a class which contains references to the handler and config object as well as the path to the i18n folder.

```js
// @language=typescript
// index.ts

import { Handler } from 'jovo-core';
import { ComponentPlugin } from 'jovo-framework';

import { Config, SurveyConfig } from './src/config';
import { surveyHandler } from './src/handler';

export class ConductSurvey extends ComponentPlugin {
    handler: Handler = surveyHandler;
    config: SurveyConfig = Config;
    pathToI18n = './src/i18n/';

    constructor(config?: SurveyConfig) {
        super(config);
    }
}
```

Name | Description | Value | Required 
--- | --- | --- | ---
`handler` | Contains the logic of your component, i.e. states & intents | `object` | Yes
`config` | Contains the default configuration | `object` | Yes
`pathToI18n` | Specifies the path to your i18n folder containing the responses used in your component | `string` | Yes


That's the basic structure of a component.

## Using Conversational Components

Learn how to integrate existing Conversational Components into your Jovo project [here](./using-components.md './using-components').

## Developing Conversational Components

Learn how to develop your own Conversational Components [here](./developing-components.md './developing-components').

<!--[metadata]: {
  "description": "Learn about the basic structure of Conversational Components.",
  "route": "components"
}-->