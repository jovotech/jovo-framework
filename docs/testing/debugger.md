# Jovo Debugger

Learn how to use the Jovo Debugger for simple testing and debugging of Alexa Skills and Google Actions.

* [Introduction](#introduction)
* [Configuration](#configuration)

## Introduction

To test the logic of your code, you can use the local development server provided by Jovo, and the Jovo Debugger. 

To get started, use the following command:

```sh
$ jovo run
```

This will start the development server on port `3000` and create a Jovo Webhook URL that can be used for local development. Copy this link and open it in your browser to use the [Jovo Debugger](../testing/debugger.md './debugger').

![Jovo Debugger](../img/jovo-debugger-helloworld.gif)

In the Debugger, you can quickly test if the flow of your voice app works. For this example, click on the `LAUNCH` button, and then specify a name on the `MyNameIsIntent` button. The Debugger will create requests and run them agains your local webhook.

## Configuration

```javascript
// @language=javascript

// src/app.js

const { JovoDebugger } = require('jovo-plugin-debugger');

app.use(new JovoDebugger());

// @language=typescript

// src/app.ts

import { JovoDebugger } from 'jovo-plugin-debugger';

app.use(new JovoDebugger());
```




<!--[metadata]: { "description": "Learn how to debug Alexa Skills and Google Actions with the Jovo Debugger.", "route": "debugger"
                }-->
