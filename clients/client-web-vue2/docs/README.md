---
title: 'Vue2 Web Client'
excerpt: 'Build voice experiences and chatbots for the web with Jovo and VueJS v2.'
---

# Web Client (Vue2)

Build voice experiences and chatbots for the web. This frontend client brings your Jovo app to websites and web apps with Vue.js 2.

## Introduction

![Jovo Client and Jovo Core Platform](https://github.com/jovotech/jovo-framework/raw/master/jovo-platforms/jovo-platform-core/img/jovo-client-platform-communication.png 'How Jovo Core Platform communicates with clients like web apps')

[Jovo Clients](https://www.jovo.tech/docs/clients) help with two tasks:

- [Record user input](#record-user-input) (speech, text, buttons) and send it as a [request to the Jovo app](#send-a-request-to-jovo) (where the [Web Platform](https://www.jovo.tech/marketplace/platform-web) handles the conversational logic).
- [Handle the response from the Jovo app](#handle-the-response-from-jovo) and play/show output to the user.

The Jovo Web Client can be used on websites and web apps. This is the version for clients build with the popular framework Vue.js, version 2. You can also find a version for [Vue3](https://www.jovo.tech/marketplace/client-web-vue3) and a [vanilla JavaScript client](https://www.jovo.tech/marketplace/client-web).

## Installation

Install the client package:

```bash
$ npm install @jovotech/client-web-vue2
```

You can add the client to your Vue app like this:

```typescript
import JovoWebClientVue, { JovoWebClientVueConfig } from '@jovotech/client-web-vue2';
import Vue from 'vue';
// ...

Vue.use<JovoWebClientVueConfig>(JovoWebClientVue, {
  endpointUrl: 'http://localhost:3000/webhook',
  config: {
    // Configuration
});
```

The constructor accepts two parameters:

- `endpointUrl`: For local development of your Jovo app with [Express](https://www.jovo.tech/marketplace/server-express), you can use `http://localhost:3000/webhook`.
- `config`: Learn more in the [vanilla JS client docs](https://www.jovo.tech/marketplace/client-web#configuration).

## Differences to Vanilla JS Client

> The Vue client offers the same features as the [vanilla JavaScript client](https://www.jovo.tech/marketplace/client-web). You can find all features and configurations in [its documentation](https://www.jovo.tech/marketplace/client-web).

The Vue client enhances the experience by adding a `$client` property to your Vue app, which makes it possible to reference it across all Vue components.

```typescript
this.$client;
```
