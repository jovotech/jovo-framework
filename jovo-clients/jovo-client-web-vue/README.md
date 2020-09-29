# Jovo Web Client - Vue

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-client-web-vue

Build voice and conversational experiences for the web with Vue.js and Jovo. You can find the vanilla JavaScript web client here: [Jovo Web Client](https://www.jovo.tech/marketplace/jovo-client-web).

* [Introduction](#introduction)
   * [Installation](#installation)
   * [Quickstart](#quickstart)


## Introduction

![Jovo Client and Jovo Core Platform](https://raw.githubusercontent.com/jovotech/jovo-framework/master/jovo-platforms/jovo-platform-core/img/jovo-client-platform-communication.png "How Jovo Core Platform communicates with clients like web apps")

[Jovo Clients](https://www.jovo.tech/marketplace/tag/clients) are used as a frontend that collects user input. This input (e.g. speech or text) is then passed to the [Jovo Core Platform](https://www.jovo.tech/marketplace/jovo-platform-core) that handles the conversational logic.

The "Jovo for Web" client can be used on websites and web apps built with Vue.js. It comes with helpful features that make it easier to capture speech input, detect when a user stops speaking, and display information that is returned from the Jovo app. The client is open source and fully customizable.


### Installation

This package is a plugin for Vue.js and does not work without it.

`vue` is a peer-dependency of this package and therefore needs to be installed as well.

```sh
$ npm install jovo-client-web-vue vue
```


### Quickstart

Download one of the [starter templates](https://github.com/jovotech/jovo-client-web-starters).

In your `main.ts` file, change the URL to your [Jovo Webhook](https://www.jovo.tech/docs/webhook) URL.

In your Jovo app, make sure to install the [Jovo Core Platform](https://www.jovo.tech/marketplace/jovo-platform-core).


## Configuration

You can configure the client like this:

```javascript
Vue.use(JovoClientWebVue, {
  url: WEBHOOK_URL,
  client: {
    debugMode: true,
    locale: 'en-US',
    defaultInputType: 'voice',
  },
});
```
