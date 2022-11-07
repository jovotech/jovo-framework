---
title: 'Project Structure'
excerpt: 'Learn how you can organize your Jovo project.'
url: 'https://www.jovo.tech/docs/project-structure'
---

# Project Structure

Learn how you can organize your Jovo project.

## Introduction

Each Jovo app (for example the [Jovo `v4` template](https://github.com/jovotech/jovo-v4-template)) usually includes the following key folders and files:

```
📦jovo-v4-template
 ┣ 📂models
 ┃ ┗ 📜en.json
 ┣ 📂src
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📜GlobalComponent.ts
 ┃ ┃ ┗ 📜LoveHatePizzaComponent.ts
 ┃ ┣ 📂output
 ┃ ┃ ┗ 📜YesNoOutput.ts
 ┃ ┣ 📜app.dev.ts
 ┃ ┣ 📜app.ts
 ┃ ┗ 📜server.express.ts
 ┣ 📂test
 ┃ ┗ 📜sample.test.ts
 ┣ 📜jovo.debugger.js
 ┣ 📜jovo.project.js
 ┗ ... + more files like package.json
```

- [`models`](#models) folder: Contains the [Jovo Model](./models.md) files for each locale, for example `en`, `en-US`, `de`.
- [`src`](#src) folder: Contains the actual app logic, e.g. components and output.
- [`test`](#test) folder: Contains [unit tests](./unit-testing.md).
- `jovo.debugger.js`: The [Jovo Debugger configuration](https://www.jovo.tech/docs/debugger-config).
- `jovo.project.js`: The [Jovo project configuration](./project-config.md) that is used by the [Jovo CLI](https://www.jovo.tech/docs/cli).

For projects that include both a Jovo app as well as, for example, a frontend (like this [voice web app](https://github.com/jovotech/jovo-starter-web-standalone)), the Jovo app is usually inside an `app` folder:

```
📦jovo-starter-web-standalone
 ┣ 📂app
 ┃ ┣ 📂models
 ┃ ┣ 📂src
 ┃ ┗ ... + more Jovo files
 ┣ 📂client
 ┃ ┗ ... frontend files
 ┗ ... + more files like package.json
```

You can also find more [example Jovo projects here](https://www.jovo.tech/examples).


## models

The `models` folder contains the [Jovo Model](./models.md) files:

```
📦models
 ┣ 📜de.json
 ┣ 📜en.json
 ┗ 📜en-US.json
```

The files are usually used by the [Jovo CLI](https://www.jovo.tech/docs/cli) during the [`build` command](https://www.jovo.tech/docs/build-command).

Each locale (e.g. `de`, `en`) has its own file, which can be either a `.json` or a `.js` file.

Some platform CLI integrations allow to configure mappings for each locale. For example, since Alexa needs specific locales like `en-US` and `en-GB`, it's possible to use the [`locales` project config property](https://www.jovo.tech/marketplace/platform-alexa/project-config#locales) to use a generic `en` model to create specific models:

```
// Jovo Model
📦models
 ┗ 📜en.json

// Alexa Interaction Models after build
📦build/platform.alexa/skill-package/interactionModels/custom
 ┣ 📜en-GB.json
 ┗ 📜en-US.json
```

Learn more in the [Jovo Model documentation](./models.md).

## src

The `src` folder contains the app logic. Everything about the conversation flow usually goes in here.

Here is an [example `src` folder](https://github.com/jovotech/jovo-v4-template/tree/master/src):

```
📦src
 ┣ 📂components
 ┃ ┣ 📜GlobalComponent.ts
 ┃ ┗ 📜LoveHatePizzaComponent.ts
 ┣ 📂output
 ┃ ┗ 📜YesNoOutput.ts
 ┣ 📜app.dev.ts
 ┣ 📜app.ts
 ┗ 📜server.express.ts
```

- [`components`](#components) folder: Contains all [components](./components.md) that are responsible for handling the conversation.
- [`output`](#output) folder: Contains [output classes](./output-classes.md), which offer a modular way to return structured output.
- [App configuration](./app-config.md) files:
    - `app.ts` contains the default Jovo app config. Plugins and other configurations are added here.
    - `app.dev.ts` contains the app configuration for local development (`dev` stage). [Learn more about staging here](./staging.md).
    - `server.express.ts` is used for the [Express server integration](https://www.jovo.tech/marketplace/server-express) for local development.
    - Other server integrations like [AWS Lambda](https://www.jovo.tech/marketplace/server-lambda) can also be added here. 

### components

The `components` folder contains all [Jovo Components](./components.md) that take care of the conversation logic.

```
📦src
 ┣ 📂components
 ┃ ┣ 📜GlobalComponent.ts
 ┃ ┣ 📜LoveHatePizzaComponent.ts
 ┃ ┗ ...
```

There are multiple ways how a component can be structured:

- A single file, for example `components/GlobalComponent.ts`
- A folder, for example `components/TableReservationComponent/` that contains multiple components and related files.

A folder allows for a modular approach where all relevant elements of a component can be included in one place:

```
📦components
 ┣ 📂TableReservationComponent
 ┃ ┣ 📂output
 ┃ ┣ 📂services
 ┃ ┣ 📜TableReservationComponent.ts
 ┃ ┣ 📜CollectPhoneNumberComponent.ts 
 ┃ ┗ ...
 ┣ 📜GlobalComponent.ts
 ┗ ...
```

- `output` folder: Similar to the [global `output folder`](#output), a component folder can also have a folder that contains all its output classes.
- `services` folder: All component specific backend services like API calls.
- component classes: The main component class (e.g. `TableReservationComponent`) and subcomponents (e.g. `CollectPhoneNumberComponent`) are usually in the root of the folder.



### output

The global `output` folder contains all [output classes](./output-classes.md) that can be used by the Jovo `$send()` method to return structured [output](./output.md).

```
📦src
 ┣ 📂output
 ┃ ┣ 📜MenuOutput.ts
 ┃ ┣ 📜YesNoOutput.ts
 ┃ ┗ ...
```

This example includes both a `MenuOutput` and a `YesNoOutput` class, two types of responses that could be used quite often in various components. For an example of how `YesNoOutput` is used, take a look at the `START` handler of the [`LoveHatePizzaComponent`](https://github.com/jovotech/jovo-v4-template/blob/master/src/components/LoveHatePizzaComponent.ts).

A [component folder](#components) can also have its own `output` folder for component-specific output classes:

```
📦components
 ┣ 📂TableReservationComponent
 ┃ ┣ 📂output
 ┃ ┣ 📂services
 ┃ ┣ 📜TableReservationComponent.ts
 ┃ ┣ 📜CollectPhoneNumberComponent.ts 
 ┃ ┗ ...
 ┣ 📜GlobalComponent.ts
 ┗ ...
```

## test

The `test` folder contains all [unit tests](./unit-testing.md) of a Jovo project, for example:

```
📦test
 ┣ 📜GlobalComponent.test.ts
 ┗ 📜LovesHatesPizzaComponent.test.ts
```

There are various ways how these test files can be structured:
- Around a specific user goal or task
- Test each component in a single file (as in the example above)

All tests in the `test` folder will run when using the following command:

```sh
$ npm test
```

