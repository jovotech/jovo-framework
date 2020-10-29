# Jovo Web Client - Vue

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-client-web-vue

Build voice and conversational experiences for the web with Vue.js and Jovo. You can find the vanilla JavaScript web client here: [Jovo Web Client](https://www.jovo.tech/marketplace/jovo-client-web).

- [Introduction](#introduction)
  - [Installation](#installation)
- [Configuration](#configuration)


## Introduction

![Jovo Client and Jovo Web Platform](https://raw.githubusercontent.com/jovotech/jovo-framework/master/jovo-platforms/jovo-platform-web/img/jovo-client-platform-communication.png "How Jovo Core Platform communicates with clients like web apps")

[Jovo Clients](https://www.jovo.tech/marketplace/tag/clients) are used as a frontend that collects user input. This input (e.g. speech or text) is then passed to the [Jovo Web Platform](https://www.jovo.tech/marketplace/jovo-platform-web) that handles the conversational logic.

The "Jovo for Web" client can be used on websites and web apps built with Vue.js. It comes with helpful features that make it easier to capture speech input, detect when a user stops speaking, and display information that is returned from the Jovo app. The client is open source and fully customizable.

You can check out one of these starter templates to get a first impression how it looks like:
* [Standalone Voice Experience](https://github.com/jovotech/jovo-starter-web-standalone)
* [Voice Overlay](https://github.com/jovotech/jovo-starter-web-overlay)
* [Chat Widget](https://github.com/jovotech/jovo-starter-web-chatwidget)
* [Embedded Chat](https://github.com/jovotech/jovo-starter-web-embeddedchat)


### Installation

This package is a plugin for Vue.js and does not work without it.

`vue` is a peer-dependency of this package and therefore needs to be installed as well.

```sh
$ npm install jovo-client-web-vue vue
```


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
