---
title: 'Vue3 Web Client'
excerpt: 'Build voice experiences and chatbots for the web with Jovo and VueJS v3.'
---

# Web Client (Vue3)

Build voice experiences and chatbots for the web. This frontend client brings your Jovo app to websites and web apps with Vue.js 3.

## Introduction

![Jovo Client and Jovo Core Platform](https://github.com/jovotech/jovo-framework/raw/master/jovo-platforms/jovo-platform-core/img/jovo-client-platform-communication.png 'How Jovo Core Platform communicates with clients like web apps')

[Jovo Clients](https://v4.jovo.tech/docs/clients) help with two tasks:

- [Record user input](#record-user-input) (speech, text, buttons) and send it as a [request to the Jovo app](#send-a-request-to-jovo) (where the [Web Platform](https://v4.jovo.tech/marketplace/platform-web) handles the conversational logic).
- [Handle the response from the Jovo app](#handle-the-response-from-jovo) and play/show output to the user.

The Jovo Web Client can be used on websites and web apps. This is the version for clients build with the popular framework Vue.js, version 3. You can also find a version for [Vue2](https://v4.jovo.tech/marketplace/client-web-vue2) and a [vanilla JavaScript client](https://v4.jovo.tech/marketplace/client-web).

## Installation

Install the client package:

```bash
$ npm install @jovotech/client-web-vue3
```

You can add the client to your Vue app like this:

```typescript
import JovoWebClientVue, { JovoWebClientVueConfig } from '@jovotech/client-web-vue3';
import Vue from 'vue';
// ...

Vue.use<JovoWebClientVueConfig>(JovoWebClientVue, {
  url: 'http://localhost:3000/webhook',
  client: {
    // Configuration
});
```

The constructor accepts two parameters:

- `endpointUrl`: For local development of your Jovo app with [Express](https://v4.jovo.tech/marketplace/server-express), you can use `http://localhost:3000/webhook`.
- `options`: Learn more in the [vanilla JS client docs](https://v4.jovo.tech/marketplace/client-web#configuration).

## Differences to Vanilla JS Client

> The Vue client offers the same features as the [vanilla JavaScript client](https://v4.jovo.tech/marketplace/client-web). You can find all features and configurations in [its documentation](https://v4.jovo.tech/marketplace/client-web).

The Vue client enhances the experience by adding a `$client` property to your Vue app, which makes it possible to reference it across all Vue components.

```typescript
this.$client;
```

Known issue: It seems like it is impossible to attach reactive data to Vue 3 from a plugin. This means that compared to the Vue 2 variant, this will require workarounds to use properties of the client. Another solution would be to add the client to the data of the root component and provide it from there. This would fix the reactivity issue.
