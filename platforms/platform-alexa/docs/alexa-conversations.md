---
title: 'Alexa Conversations'
excerpt: 'Learn how to build Alexa Skills with Alexa Conversations using Jovo.'
---

# Alexa Conversations

Learn how to build Alexa Skills with Alexa Conversations using Jovo.

## Introduction

[Alexa Conversations](https://developer.amazon.com/docs/alexa/conversations/about-alexa-conversations.html) is a new way to build Alexa Skills using probabilistic dialogue management.

By defining sample dialogues, you can have the Alexa Conversations dialogue engine take care of the back and forth between the user and your Alexa Skill.

The Jovo integration for Alexa Conversations allows you to manage ACDL and response files that can then be deployed to the Alexa Developer Console using the Jovo CLI. Learn more in the [manage files section](#manage-files).

You can also use your Jovo code to build APIs that respond to Alexa Conversation requests. Learn more in the [handle API calls section](#handle-api-calls).

Usually, an Alexa Conversations project follows a hybrid approach:

- Some tasks (for example slot filling) are done by Alexa Conversations
- Other tasks (where you need full control and deterministic code) are handled by your app code

The [delegation section](#delegation) introduces different ways for your app code to accept requests from and delegate requests to Alexa Conversations.

## Configuration

You can enable Alexa Conversations for your project in your [`jovo.project.js` Alexa config](./project-config.md):

```js
new AlexaCli({
  conversations: true,
  // ...
});
```

By setting `conversations` to `true`, the following default configuration will be used. You can also turn the `conversations` option into an object for more granular configuration:

```js
new AlexaCli({
  conversations: {
    enabled: true,
    directory: 'resources/alexa/conversations',
    acdlDirectory: 'acdl',
    responsesDirectory: 'responses',
    sessionStartDelegationStrategy: {
      target: 'skill',
    },
    skipValidation: false,
  },
  // ...
});
```

- `directory`: This is the directory that contains the AC configuration files that should be deployed to the Alexa Developer Console. Learn more in the [manage files section](#manage-files).
- `acdlDirectory`: The folder for ACDL files inside the `directory`. Default: `acdl`, which means that the files are stored in a `resources/alexa/conversations/acdl` folder.
- `responsesDirectory`: The folder for response files inside the `directory`. Default: `responses`, which means that the files are stored in a `resources/alexa/conversations/responses` folder.
- `sessionStartDelegationStrategy`: The `target` means where a new session should be directed to,either the `skill` (your app code) or `AMAZON.Conversations`. Default: `skill`.
- `skipValidation`: If this is set to `true`, the ACDL compiler does not run a validation of the ACDL files before turning them into JSON during deployment. Learn more in the [manage files section](#manage-files).

## Manage Files

The Jovo integration for Alexa Conversations allows you to store the following files in your Jovo project and then deploy them to the Alexa Developer Console using the Jovo CLI:

- [ACDL](https://developer.amazon.com/docs/alexa/conversations/acdl-files.html): Alexa Conversations Description Language (ACDL) files can be stored in a folder called `resources/alexa/conversations/acdl` in the root of your Jovo project.
- [Responses](https://developer.amazon.com/docs/alexa/conversations/acdl-response-prompt-files.html): Response prompt files can be stored in a folder called `resources/alexa/conversations/responses` in the root of your Jovo project.

The [`build` command](./cli-commands.md#build) then copies these files over to the `build/platform.alexa` folder along with other operations. The files can then be found in `conversations` (for ACDL files) and `response` (for responses) subfolders inside the `skill-package` directory.

```sh
$ jovo build:platform alexa
```

As a convention, the Jovo `build` folder should not be pushed to e.g. your Git repository. The `jovo.project.js` can be seen as a single source of truth that generates the contents of the `build` folder. For additional files like ACDL files (or maybe outsourcing some of the `jovo.project.js` contents into separate files), we recommend sticking to the `resources/alexa` folder convention.

It is, however, also possible to work from the `build/platform.alexa` folder and manage the files there.

The [`deploy` command](./cli-commands.md#deploy) uploads the contents of the Alexa project in the `build` folder to the Alexa Developer Console. Before doing that, it compiles the ACDL files into JSON. Since the building of the Alexa Conversations model can take a while during deployment, we recommend adding the `--async` flag.

```sh
$ jovo deploy:platform alexa --async

# You can also skip the validation step of the ACDL compiler
$ jovo deploy:platform alexa --async --skip-validation
```

Learn more about all [Alexa CLI commands here](./cli-commands.md).

## Handle API Calls

With Alexa Conversations, you can define APIs that respond to `Dialog.API.Invoked` requests. Learn more in the [official Alexa docs](https://developer.amazon.com/docs/alexa/conversations/handle-api-calls.html).

You can have a [handler](https://www.jovo.tech/docs/handlers) accept a request like this by using the `onDialogApiInvoked` helper that can be used inside the [`@Handle` decorator](https://www.jovo.tech/docs/handle-decorators).

```typescript
import { AlexaHandles } from '@jovotech/platform-alexa';
// ...

@Handle(AlexaHandles.onDialogApiInvoked('<yourApiName>'))
handleApiRequest() { // Name this method however you like
  // ...
}
```

Under the hood, the object used by `@Handle` looks like this:

```typescript
{
  global: true,
  types: ['Dialog.API.Invoked'],
  platforms: ['alexa'],
  if: (jovo: Jovo) =>
    name ? (jovo.$request as AlexaRequest).request?.apiRequest?.name === name : true,
}
```

You can then choose between sending an API response back for Alexa Conversations to operate on, or delegate control back to your handler.

### Send an API response

You can send an API response by using the `ApiResponseOutput` [output class](https://www.jovo.tech/docs/output-classes), for example:

```typescript
import { AlexaHandles, ApiResponseOutput } from '@jovotech/platform-alexa';

// ...

@Handle(AlexaHandles.onDialogApiInvoked('<yourApiName>'))
handleApiRequest() { // Name this method however you like
  // ...

  return this.$send(ApiResponseOutput, {
    apiResponse: {
      cityName: cityNameWithId.name,
      lowTemperature: weather.lowTemperature,
      highTemperature: weather.highTemperature
    },
    listen: false, // Should close the session
  });
}
```

Under the hood, it looks like this:

```js
{
  listen: this.options.listen,
  platforms: {
    alexa: {
      nativeResponse: {
        version: '1.0',
        sessionAttributes: {},
        response: {
          apiResponse: this.options.apiResponse,
        },
      },
    },
  },
};
```

The [`listen` property](./output.md#listen) needs to be set to indicate that the session should stay open or be closed. Learn more in the [official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/conversations/handle-api-calls.html#ending-the-skill-session).

### Send a DialogDelegateRequest

You can also choose to delegate the conversational flow back to your handler. Learn more in the [Accept Requests from Alexa Conversations section](#accept-requests-from-alexa-conversations).

## Delegation

There are multiple ways how your app code can communicate with Alexa Conversations:

- [Delegate to Alexa Conversations](#delegate-to-alexa-conversations)
- [Accept requests from Alexa Conversations](#accept-requests-from-alexa-conversations)

You can also learn more in the official Alexa docs: [Hand off Dialog Management to and from Alexa Conversations](https://developer.amazon.com/docs/alexa/conversations/hand-off-dialog-management.html).

### Delegate to Alexa Conversations

To delegate to Alexa Conversations, you have to send a [Dialog Delegate Request](https://developer.amazon.com/en-US/docs/alexa/conversations/hand-off-dialog-management.html#hand-off-to-alexa-conversations).

In your handler, you can use the `DialogDelegateRequestOutput` [output class](https://www.jovo.tech/docs/output-classes) for this, for example:

```typescript
import { DialogDelegateRequestOutput } from '@jovotech/platform-alexa';
// ...

someHandler() {
  // ...

  return this.$send(DialogDelegateRequestOutput, {
    target: 'AMAZON.Conversations',
    updatedRequest: {
      type: 'Dialog.InputRequest',
      input: {
        name: '<utteranceSetName>', // Utterance set must use the Invoke APIs dialog act
      },
    },
  });
}
```

Under the hood, it looks like this:

```js
{
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          directives: [
            {
              type: 'Dialog.DelegateRequest',
              target: this.options.target,
              period: {
                until: 'EXPLICIT_RETURN',
              },
              updatedRequest: this.options.updatedRequest,
            },
          ],
        },
      },
    },
  },
}
```

By default, you don't need to define `slots` as part of the `updatedRequest` property. The entities stored in [`$entities`](https://www.jovo.tech/marketplace/platform-alexa#entities-slots-) will be automatically added in the background. If you want to customize this behaviour, you can still pass them in the same way it's done in the [official Alexa documentation](https://developer.amazon.com/docs/alexa/conversations/hand-off-dialog-management.html#hand-off-to-alexa-conversations).

### Accept Requests from Alexa Conversations

Alexa Conversations can also hand off to your Alexa Skill. To do this, you need to send a `DialogDelegateRequest` similar to the delegation to [Alexa Conversations](#delegate-to-alexa-conversations). [Learn more in the official Alexa docs](https://developer.amazon.com/docs/alexa/conversations/hand-off-dialog-management.html#hand-off-to-skill).

```typescript
import { DialogDelegateRequestOutput } from '@jovotech/platform-alexa';
// ...

someHandler() {
  // ...

  return this.$send(DialogDelegateRequestOutput, {
    target: 'skill',
    updatedRequest: {
      type: 'IntentRequest',
      intent: {
        name: 'SomeIntent',
      },
    },
  });
}
```

By default, you don't need to define `slots` as part of the `updatedRequest` property. The entities stored in [`$entities`](https://www.jovo.tech/marketplace/platform-alexa#entities-slots-) will be automatically added in the background. You can still pass them in the same way it's done in the [official Alexa documentation](https://developer.amazon.com/en-US/docs/alexa/conversations/hand-off-dialog-management.html#hand-off-to-skill).

