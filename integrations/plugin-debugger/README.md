# Jovo Debugger

Learn more about the Jovo debugging environment.
- [Introduction](#introduction)
- [Installation](#installation)

## Introduction

The Jovo Debugger allows you to test and debug your Jovo app by displaying the most important information about each interaction in one place. 

The Debugger contains both an interaction and a lifecycle view. The interaction view shows all input and output in a chat-like interface. The lifecycle allows you to see how data changes throughout a request lifecycle.

The Debugger can be used in the browser, where messages can be sent to your Jovo Webhook right from the tool itself. Additionally, it also displays any requests that go through the Jovo Webhook server, even if you're testing on a device like an Echo Dot.

## Installation

Most Jovo projects already have the Debugger plugin added to the development stage at `app.dev.ts`. [Learn more about staging here](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/staging.md).

If it is not already added to the project, you can install the Debugger plugin like this:

```sh
$ npm install @jovotech/plugin-debugger
```

The Debugger can only be used for local development, so we recommend adding it to the `app.dev.ts` [app configuration](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/app-config.md):

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
