---
title: 'Web Platform'
excerpt: 'The Jovo Web Platform is a standalone platform integration that can be used to deploy a voice and chat experiences to the web, including React and VueJS.'
---

# Web Platform

The Jovo Web Platform is a standalone [platform integration](https://v4.jovo.tech/docs/platforms) that can be used to deploy a voice and chat experiences to the web, including React and VueJS.

## Introduction

![Jovo Client and Jovo Core Platform](https://github.com/jovotech/jovo-framework/raw/master/jovo-platforms/jovo-platform-core/img/jovo-client-platform-communication.png 'How Jovo Web Platform communicates with web clients')

Besides integrations with major platforms like Alexa, Google Assistant, or Facebook Messenger, Jovo also enables you to connect your own clients to build fully custom conversational experiences for both voice and chat.

The Jovo Web Platform can be connected to any web client (the "frontend" that records speech or text input and passes it to the Jovo app). You can either implement your own client or use existing [Jovo Clients](https://v4.jovo.tech/docs/clients), e.g. the [vanilla JS web client](https://v4.jovo.tech/marketplace/client-web), [Vue2](https://v4.jovo.tech/marketplace/client-web-vue2) or [Vue3 client](https://v4.jovo.tech/marketplace/client-web-vue3).

The client sends a request to the Jovo app that may contain audio, text, or other input. The Jovo Web Platform then deals with this information and returns a response back to the client.

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/platform-web
```

Add it as plugin to your [app configuration](https://v4.jovo.tech/docs/app-config), e.g. `app.ts`:

```typescript
import { App } from '@jovotech/framework';
import { WebPlatform } from '@jovotech/platform-web';
// ...

const app = new App({
  plugins: [
    new WebPlatform(),
    // ...
  ],
});
```

## Web Platform and Core Platform

The Jovo Web Platform is a customization of the [Jovo Core Platform](https://v4.jovo.tech/marketplace/platform-core). You can find all Web Platform features in the [Core Platform docs](https://v4.jovo.tech/marketplace/client-web).

## Platform-Specific Features

You can access the Core specific object like this:

```typescript
this.$web;
```

You can also use this object to see if the request is coming from Core (or a different platform):

```typescript
if (this.$web) {
  // ...
}
```
