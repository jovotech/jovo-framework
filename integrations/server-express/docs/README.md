---
title: 'Express Server Integration'
excerpt: 'Host Jovo apps on your own server using Express.'
---

# Express Server Integration

Host Jovo apps on your own server using Express.

## Introduction

This [server integration](https://v4.jovo.tech/docs/server) allows you to host yor Jovo apps on your own server. [Learn more about Express in their official documentation](https://expressjs.com/).

For example, the [`app.dev.ts` stage](https://v4.jovo.tech/docs/app-config#staging) uses Express as a local development server. The server is referenced in the last line of `app.dev.ts`:

```typescript
export * from './server.express';
```

You can find the [`server.express.ts` file here](https://github.com/jovotech/jovo-framework/blob/v4/latest/integrations/server-express/boilerplate/server.express.ts).

## Installation

Create a new stage using the [`new:stage` command](https://v4.jovo.tech/docs/new-command#new-stage) as explained in the [app config documentation](https://v4.jovo.tech/docs/app-config#staging).

When it prompts you to select a server integration, choose Express. This will add a [`server.express.ts` file](https://github.com/jovotech/jovo-framework/blob/v4/latest/integrations/server-express/boilerplate/server.express.ts) to your project's `src` folder.

## Run Server

If you're not using the [Jovo Webhook](https://v4.jovo.tech/docs/webhook) with the [`run` command](https://v4.jovo.tech/docs/run-command) to start the server, you can use the following npm script:

```sh
$ npm run start:<stage>

# Example
$ npm run start:dev
```
