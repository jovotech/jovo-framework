# Conversational Components

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/components

- [Introduction](#introduction)
- [Component Structure](#component-structure)
  - [handler](#handler)
  - [config](#config)
  - [i18n](#i18n)
  - [index](#index)
- [Using Conversational Components](#using-conversational-components)
- [Developing Conversational Components](#developing-conversational-components)

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

The component's handler contains the states/intents to fulfill the incoming request. It has to have a `START` intent which is the entry point for the component.

```js
// @language=typescript
// handler.ts

const handler: Handler = {
	START() {},
	// other intents
};

// @language=javascript
// handler.js

const handler = {
	START() {},
	// other intents
};
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
		'AMAZON.NoIntent': 'NoIntent',
		'AMAZON.StopIntent': 'END',
		StopIntent: 'END',
		'AMAZON.YesIntent': 'YesIntent',
	},
	numberOfQuestions: 3,
};

export { SurveyConfig, config as Config };

// @language=javascript
// config.js

const config = {
	intentMap: {
		'AMAZON.HelpIntent': 'HelpIntent',
		'AMAZON.NoIntent': 'NoIntent',
		'AMAZON.StopIntent': 'END',
		StopIntent: 'END',
		'AMAZON.YesIntent': 'YesIntent',
	},
	numberOfFails: 3,
};

module.exports = config;
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

The `index.ts` file at the root is the entry point of each component. It exports a class which contains references to the handler and config object as well as the path to the i18n folder. The component's handler has to be nested inside a state named after the component itself to prevent intents from being overwritten. It also has a `name` property which has to be the same as the package name.

```js
// @language=typescript
// index.ts

import { ComponentPlugin, Handler } from 'jovo-framework';

import { Config, SurveyConfig } from './src/config';
import { surveyHandler } from './src/handler';

export class ConductSurvey extends ComponentPlugin {
	config: SurveyConfig = Config;
	pathToI18n = './src/i18n/';
	name = 'jovo-component-conduct-survey';
	handler: Handler = {
		[this.name]: surveyHandler,
	};

	constructor(config?: SurveyConfig) {
		super(config);
	}
}

// @language=javascript
// index.js

const { ComponentPlugin } = require('jovo-framework');

const componentConfig = require('./src/config');
const componentHandler = require('./src/handler');

class GetPhoneNumber extends ComponentPlugin {
	constructor(config) {
		super(config);
		this.config = componentConfig;
		this.name = 'jovo-component-get-phone-number';
		this.pathToI18n = './src/i18n/';
		this.handler = {
			[this.name]: componentHandler,
		};
	}
}

module.exports = GetPhoneNumber;
```

| Name         | Description                                                                            | Value    | Required |
| ------------ | -------------------------------------------------------------------------------------- | -------- | -------- |
| `name`       | Name of your component. Has to be the same as the package name                         | `string` | Yes      |
| `handler`    | Contains the logic of your component, i.e. states & intents                            | `object` | Yes      |
| `config`     | Contains the default configuration                                                     | `object` | Yes      |
| `pathToI18n` | Specifies the path to your i18n folder containing the responses used in your component | `string` | Yes      |

That's the basic structure of a component.

## Using Conversational Components

Learn how to integrate existing Conversational Components into your Jovo project [here](./using-components.md './components/using-components').

## Developing Conversational Components

Learn how to develop your own Conversational Components [here](./developing-components.md './components/developing-components').

<!--[metadata]: {
  "description": "Learn about the basic structure of Conversational Components.",
  "route": "components"
}-->
