---
title: 'ExpressJS Server Integration'
excerpt: 'Host Jovo apps on your own server using ExpressJS.'
---

# ExpressJS Server Integration

Host Jovo apps on your own server using ExpressJS.

## Introduction

This [server integration](https://www.jovo.tech/docs/server) allows you to host yor Jovo apps on your own server. [Learn more about ExpressJS in their official documentation](https://expressjs.com/).

For example, the [`app.dev.ts` stage](https://www.jovo.tech/docs/app-config#staging) uses ExpressJS as a local development server. The server is referenced in the last line of `app.dev.ts`:

```typescript
export * from './server.lambda';
```

You can find the [`server.express.ts` file here](https://github.com/jovotech/jovo-framework/blob/v4/release/integrations/server-express/boilerplate/server.express.ts).

## Installation

Create a new stage using the [`new:stage` command](https://www.jovo.tech/docs/new-command#new-stage) as explained in the [app config documentation](https://www.jovo.tech/docs/app-config#staging).

When it prompts you to select a server integration, choose ExpressJS. This will add a [`server.express.ts` file](https://github.com/jovotech/jovo-framework/blob/v4/release/integrations/server-express/boilerplate/server.express.ts) to your project's `src` folder.

## Run Server

If you're not using the [Jovo Webhook](https://www.jovo.tech/docs/webhook) with the [`run` command](https://www.jovo.tech/docs/run-command) to start the server, you can use the following npm script:

```sh
$ npm run start:<stage>

# Example
$ npm run start:dev
```
