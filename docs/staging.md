---
title: 'Staging'
excerpt: 'Learn how staging provides the ability to build, deploy, and run Jovo apps in different environments, including local development.'
---

# Staging

Staging provides the ability to build, deploy, and run Jovo apps in different environments, including local development.

## Introduction

Most Jovo projects start with local development. After a while, the app needs to get deployed somewhere for testing, later for production use. While already being deployed, there might be some local development going on.

For use cases like this, Jovo offers different staging features that make it easier to have [different app versions depending on a stage](#app-staging) as well as [different project versions](#project-staging) (e.g. different Skills in the Alexa Developer Console).

## App Staging

The [app configuration](./app-config.md) is usually spread across multiple files:

- `app.ts`: Default configurations
- `app.<stage>.ts`: Stage-specific configurations

For example, new Jovo templates come with an `app.ts` for all default configurations that should work across stages (platform integrations, components, ...) and an `app.dev.ts` file that comes with specific configuration for local development ([FileDb](https://www.jovo.tech/marketplace/db-filedb), [ExpressJS server](https://www.jovo.tech/marketplace/server-express) and the [Jovo Debugger](https://www.jovo.tech/docs/debugger)).

Stage-specific configurations get merged into the default `app.ts` config.

You can create a new stage file using the [`new:stage` command](https://www.jovo.tech/docs/new-command#new-stage):

```sh
$ jovo new:stage <stage>

# Example that creates a new app.prod.ts file
$ jovo new:stage prod
```

This command also lets you specify which [server integration](./server.md) should be used for that stage.

Learn more about app staging [in the app config documentation](./app-config.md#staging).

## Project Staging

The [project configuration](./project-config.md) can contain multiple `stages` for different deployment environments. Depending on the stage, the `build` command then creates different files into the `build` directory.

Here is an example that uses different Alexa Skill IDs and endpoints for a `dev` (local development) and a `prod` (deployed in production) stage:

```js
const project = new ProjectConfig({
  // ...

  defaultStage: 'dev',
  stages: {
    dev: {
      endpoint: '${JOVO_WEBHOOK_URL}',
      plugins: [
        new AlexaCli({
          skillId: 'devSkillId',
        }),
      ],
      // ...
    },
    prod: {
      endpoint: process.env.ENDPOINT_PROD,
      plugins: [
        new AlexaCli({
          skillId: 'prodSkillId',
        }),
      ],
      // ...
    },
  },
});
```

Learn more about project staging [in the project config documentation](./project-config.md#staging).
