---
title: 'Clients'
excerpt: 'Clients handle the recording of user input and communicate with platform integrations in a Jovo app.'
---

# Clients

Clients handle the recording of user input and communicate with platform integrations in a Jovo app.

## Introduction

![Jovo Client and Jovo Core Platform](https://github.com/jovotech/jovo-framework/raw/master/jovo-platforms/jovo-platform-core/img/jovo-client-platform-communication.png 'How Jovo Core Platform communicates with clients like web apps')

Besides integrations with major platforms like [Alexa](https://www.jovo.tech/marketplace/platform-alexa), [Google Assistant](https://www.jovo.tech/marketplace/platform-googleassistant), or [Facebook Messenger](https://www.jovo.tech/marketplace/platform-facebookmessenger), Jovo also enables you to connect your own clients to build fully custom conversational experiences for both voice and chat.

A client (for example a website or a mobile app) is mainly responsible for the user facing elements of the experience, for example:

- Recording user input (speech, text, buttons) and sending that data as a request to the Jovo app
- Receiving a response from the Jovo app and showing/playing the output to the user

On the Jovo app side, a [platform integration](./platforms.md) needs to handle the client requests and return responses that work for that client. This could be, for example, the [Core Platform](https://www.jovo.tech/marketplace/platform-core), [Web Platform](https://www.jovo.tech/marketplace/platform-web), or a custom platform implementation.

## Available Jovo Clients

While you can build your own clients that send Jovo requests and accept responses, you can use existing Jovo Clients already come with the right request and response formats for Jovo platforms, and help with recording input and displaying output:

- [Web Client](https://www.jovo.tech/marketplace/client-web): A vanilla JS client that can be used in websites and web apps.
- [Web Client (Vue2)](https://www.jovo.tech/marketplace/client-web-vue2): A Vue2 wrapper of the Web Client.
- [Web Client (Vue3)](https://www.jovo.tech/marketplace/client-web-vue3): A Vue3 wrapper of the Web Client.
