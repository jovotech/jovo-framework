---
title: 'Getting Started with the Jovo Framework'
excerpt: 'Learn how to build your first project with Jovo v4, the framework that lets you create powerful conversational apps that work across voice and chat platforms like Alexa, Google Assistant, Facebook Messenger, the web, and more.'
---

# Getting Started

Learn how to build your first project with Jovo `v4`, the framework that lets you create powerful conversational apps that work across voice and chat platforms like Alexa, Google Assistant, Facebook Messenger, the web, and more.

## Introduction

With Jovo `v4`, we've completely redesigned how Jovo apps are built. Over the last year, we translated everything we learned from 4 years Jovo into a completely new framework.

If you're used to Jovo `v3`, you will see that there are a few differences which make the framework more powerful, extensible, and fun to use. Many of the underlying concepts stay the same, though. This guide is supposed to help you get started with a new Jovo project.

Here are a few of the key concepts of Jovo `v4`:

- [Components](./components.md): A component can be seen as the equivalent of a _state_ in Jovo `v3`. A Jovo app usually consists of multiple components. Each component has its own file that may contain multiple handlers.
- [Handlers](./handlers.md): A handler responds to a certain type of request (for example, an intent) and contains the app logic. A handler can delegate to other components and return output.
- [Output](./output.md): Using the `$send()` method, you can return structured output that is then translated into a native platform response.

In this guide, we will take a look at [first steps with Jovo](#first-steps-with-jovo) by installing a new project, and then go from there with [next steps](#next-steps).

## First Steps with Jovo

In this section, we will [install the Jovo CLI](#install-the-cli), [create a new project](#create-a-new-project), understand the [Jovo v4 project structure](#a-look-at-the-project-structure), and then [test the app in the Jovo Debugger](#run-the-local-development-server).

### Install the CLI

You can install the new Jovo CLI like this:

```sh
$ npm install -g @jovotech/cli
```

After successful installation, you should be able to see the Jovo CLI menu by typing the following into your command line:

```sh
$ jovo
```

### Create a new Project

After installing the Jovo CLI, you can install the template ([TypeScript](https://github.com/jovotech/jovo-v4-template) or [JavaScript](https://github.com/jovotech/jovo-v4-template-js)) using the [`new` command](https://v4.jovo.tech/docs/new-command):

```sh
$ jovo new <directory>
```

This will download the template into a new `<directory>` folder and install all necessary dependencies.

By using the "select features manually" option, you can choose which platforms you want to build Jovo apps for.

### A Look at the Project Structure

Change your working directory into your newly created project and open it in the code editor of your choice.

```sh
$ cd <directory>
```

The [Jovo `v4` template](https://github.com/jovotech/jovo-v4-template) includes the following key folders and files:

- `jovo.project.js`: This file contains the [Jovo project configuration](./project-config.md) that is used by the Jovo CLI.
- `models`: This folder contains the [Jovo Model files](./models.md).
- `src`: This folder contains the actual app logic.

Here are all the files and folders inside `src`:

- `app.ts`: This file contains the default [Jovo app configuration](./app-config.md). Plugins and other configurations are added here.
- `app.dev.ts`: This file contains the app configuration for local development (`dev` stage). [Learn more about staging here](./staging.md).
- `components`: This folder contains all [components](./components.md). In this example, a `GlobalComponent` and a `LoveHatePizzaComponent`.
- `output`: This folder contains all [output classes](./output-classes.md), which offer a modular way to return structured output. This example includes a `YesNoOutput` class that is used by th `START` handler of the `LoveHatePizzaComponent`.

If we take a look at the `GlobalComponent`, we can find a `LAUNCH` [handler](./handlers.md) that is executed for users who open the app:

```typescript
LAUNCH() {
  return this.$redirect(LoveHatePizzaComponent);
}
```

It [redirects](./handlers.md#redirect-to-components) to the `LoveHatePizzaComponent`. This means that the `START` handler of that component will be executed:

```typescript
START() {
  return this.$send(YesNoOutput, { message: 'Do you like Pizza?' });
}
```

`START` uses an [output class](./output-classes.md) `YesNoOutput` to ask the user if they like pizza. This output is then returned to the user. If they respond with "yes", the `lovesPizza` handler get triggered, for "no" the `hatesPizza` handler:

```typescript
@Intents('YesIntent')
lovesPizza() {
  return this.$send({ message: 'Yes! I love pizza, too.' });
}

@Intents('NoIntent')
hatesPizza() {
  return this.$send({ message: `That's OK! Not everyone likes pizza.` });
}
```

### Run the Local Development Server

You can test the app code by running the local development server from the project directory:

```sh
$ jovo run
```

You can now open the Jovo Debugger with the `.` key.

**Note:** The v4 Debugger can be reached using `webhookv4.jovo.cloud` instead of `webhook.jovo.cloud`.

You can then use the request buttons or type input to test the flow of the app.

## Next Steps

Here are a few things you can do to extend the app:

- Add more intents and entities to the [Jovo Model](./models.md).
- Add [handlers](./handlers.md) for these intents to the existing components.
- Create new [components](./components.md).
- Learn more about [routing](./routing.md) to understand when which components ad handlers are executed.
- Learn more about [Jovo properties](./jovo-properties.md) and how to use them.
