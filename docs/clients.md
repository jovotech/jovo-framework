---
title: 'Clients'
excerpt: 'Clients are the user facing interfaces that handle the recording of user input and communicate with platform integrations in a Jovo app.'
---

# Clients

Clients are the user facing interfaces that handle the recording of user input and communicate with platform integrations in a Jovo app.

## Introduction

![Jovo Client and Jovo Core Platform](https://github.com/jovotech/jovo-framework/raw/master/jovo-platforms/jovo-platform-core/img/jovo-client-platform-communication.png 'How Jovo Core Platform communicates with clients like web apps')

A client can be seen as the "frontend" (for example a website or a mobile app) of your conversational app built with Jovo that is mainly responsible for the user facing elements of the experience, for example:

- Recording user input (speech, text, buttons) and sending that data as a request to the Jovo app
- Receiving a response from the Jovo app and showing/playing the output to the user

Besides integrations with major platforms like [Alexa](https://www.jovo.tech/marketplace/platform-alexa), [Google Assistant](https://www.jovo.tech/marketplace/platform-googleassistant), or [Facebook Messenger](https://www.jovo.tech/marketplace/platform-facebookmessenger), Jovo also enables you to connect your own clients to build fully custom conversational experiences for both voice and chat.

On the Jovo app side, a [platform integration](./platforms.md) needs to handle the client requests and return responses that work for that client. This could be, for example, the [Core Platform](https://www.jovo.tech/marketplace/platform-core), [Web Platform](https://www.jovo.tech/marketplace/platform-web), or a custom platform implementation.

Learn more in the sections below:
- [Available Jovo clients](#available-jovo-clients)
- [Jovo app integration](#jovo-app-integration)
- [Custom client implementation](#custom-client-implementation)
- [Examples](#examples)

## Available Jovo Clients

While you can build your own clients that send Jovo requests and accept responses, you can use existing Jovo Clients already come with the right request and response formats for Jovo platforms, and help with recording input and displaying output:

- [Web Client](https://www.jovo.tech/marketplace/client-web): A vanilla JS client that can be used in websites and web apps.
- [Web Client (Vue2)](https://www.jovo.tech/marketplace/client-web-vue2): A Vue2 wrapper of the Web Client.
- [Web Client (Vue3)](https://www.jovo.tech/marketplace/client-web-vue3): A Vue3 wrapper of the Web Client.

You can also find examples for Jovo web apps in the Web Starters section on the [Jovo Examples](https://www.jovo.tech/examples) page.

## Jovo App Integration

To have your Jovo app accept requests from a client and return responses, you need to add a platform integration. The platform should work with the request and response format that the client uses. Usually, you can rely on the following platforms (or build your own [platform integration](./platforms.md)):

- [Core Platform](https://www.jovo.tech/marketplace/platform-core): Generic platform that can be used by any custom client
- [Web Platform](https://www.jovo.tech/marketplace/platform-web): Web specific platform that can be used by web clients

Depending on the type of client, you might also need to add [ASR](./asr.md), [NLU](./nlu.md), and/or [TT](./tts.md) integrations to the platforms.

Here is an [example `app.ts`](https://github.com/jovotech/jovo-starter-web-standalone/blob/v4/app/src/app.ts) of a web app:

```typescript
import { App } from '@jovotech/framework';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';
import { WebPlatform } from '@jovotech/platform-web';
import { LangEn } from '@nlpjs/lang-en';
// ...

const app = new App({
  plugins: [
    new WebPlatform({ // Accepts requests from Web Clients
      plugins: [
        new NlpjsNlu({ // Turns raw text into structured input
          languageMap: {
            en: LangEn,
          },
        }),
      ],
    }),
  ],
  // ...
});
```

The example uses the following plugins:
- [Web Platform](https://www.jovo.tech/marketplace/platform-web) accepts the requests and returns appropriate responses that can be used by the Web Clients
- [NLP.js](https://www.jovo.tech/marketplace/nlu-nlpjs) is used as an [NLU integration](./nlu.md) to turn raw text into structured input (intents and entities)


## Custom Client Implementation

You can build your own custom client that records user input and displays/plays responses. Any language can be used. The only requirement is that it needs to be able to do the following:

- Record user input and turn it into a JSON request
- Send that JSON request to the Jovo backend app
- Parse the JSON response from Jovo
- Use response data to show/play a response to the user

We using the [Core Platform request & response schema](https://www.jovo.tech/marketplace/platform-core#requests-and-responses).


## Examples

The following [examples](https://www.jovo.tech/examples) can be used to learn more about Jovo Clients:

- [Standalone Voice App (Vue)](https://github.com/jovotech/jovo-starter-web-standalone)
- [Chat Widget (Vue)](https://github.com/jovotech/jovo-starter-web-chatwidget)
- [Standalone Voice App (React)](https://github.com/jovotech/jovo-starter-web-standalone-react)
- [Chat Widget (React)](https://github.com/jovotech/jovo-starter-web-chatwidget-react)