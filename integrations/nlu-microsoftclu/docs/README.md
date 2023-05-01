---
title: 'Microsoft CLU NLU Integration'
excerpt: 'Turn raw text into structured meaning with the Jovo Framework integration for the conversational language understanding service from Microsoft.'
url: 'https://www.jovo.tech/marketplace/nlu-microsoftclu'
---

# Microsoft Conversational Language Understanding (CLU) NLU Integration

Turn raw text into structured meaning with the Jovo Framework integration for the conversational language understanding service from Microsoft.

## Introduction

[Microsoft CLU](https://learn.microsoft.com/en-us/azure/cognitive-services/language-service/conversational-language-understanding/overview) is a [natural language understanding (NLU)](https://www.jovo.tech/docs/nlu) service offered by Microsoft Azure. You can learn more in the [official Microsoft CLU documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/language-service/conversational-language-understanding/how-to/create-project?tabs=language-studio%2CLanguage-Studio).

You can use the Jovo Microsoft CLU NLU integration for projects where you receive raw text input that needs to be translated into structured meaning to work with the Jovo intent structure. Learn more in the [NLU integration docs](https://www.jovo.tech/docs/nlu).


## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/nlu-microsoftclu
```

NLU plugins can be added to Jovo platform integrations. Here is an example how it can be added to the Jovo Core Platform in [`app.ts`](https://www.jovo.tech/docs/app-config):

```typescript
import { App } from '@jovotech/framework';
import { CorePlatform } from '@jovotech/platform-core';
import { MicrosoftCluNlu } from '@jovotech/nlu-microsoftclu';

const app = new App({
  plugins: [
    new CorePlatform({
      plugins: [
        new MicrosoftCluNlu({
          endpoint: 'https://x.cognitiveservices.azure.com/',
          credential: 'your-key',
          libraryConfig: {
            taskParameters: {
              projectName: 'project-name',
              deploymentName: 'deployment-name',
            },
          },          
        }),
      ],
    }),
    // ...
  ],
});
```

To access the Microsoft CLU API, you need to provide an `endpoint`, `credential`, `projectName` and `deploymentName`.

## Configuration

The following configurations can be added:

```typescript
new MicrosoftCluNlu({
  endpoint: 'https://x.cognitiveservices.azure.com/',
  credential: 'your-key',
  libraryConfig: {
    taskParameters: {
      projectName: 'project-name',
      deploymentName: 'deployment-name',
    },
  },          
}),
```

- `endpoint`: Supported Cognitive Services endpoint (e.g., https://.api.cognitiveservices.azure.com).
- `credential`: Credential used to access your Cognitive Service API. Setting to a string (`my-key`) is the same as setting it to `new AzureKeyCredential('my-key')`. Can also be set to [TokenCredential](https://github.com/Azure/azure-sdk-for-js/blob/6758bdbdd6f1e077921eaed6e9dc7cae3cb30a82/sdk/core/core-auth/src/tokenCredential.ts) or [KeyCredential](https://github.com/Azure/azure-sdk-for-js/blob/6758bdbdd6f1e077921eaed6e9dc7cae3cb30a82/sdk/core/core-auth/src/azureKeyCredential.ts).
- `fallbackLanguage`: The language that gets used if the request does not come with a locale property. Default: `en`.
- [`libraryConfig`](#libraryconfig): Settings specific to the client libary used to call Azure CLU.

### libraryConfig

To access the Conversaton Analysis Runtime API, you need to specify various parameters for the client SDK. Other parameters are optional.

- `id`: The ID of a conversation item. Default: generated UUID.
- `participantId`: The participant ID of a conversation item. Default: generated UUID.
- `options`: Optional parameters for the Conversation Analysis Client. For more info, see the [ConversationAnalysisClientOptionalParams](https://github.com/Azure/azure-sdk-for-js/blob/8c9b021b3566b12a10296a656433b4d9c44629e5/sdk/cognitivelanguage/ai-language-conversations/src/models.ts#L2174) interface.
- [`taskParameters`](#taskparameters): Parameters necessary for a Conversation task.

### taskParameters

Each request to the Conversation Analysis API is a task. Only `projectName` and `deploymentName` are required.

- `projectName`: The name of the project.
- `deploymentName`: The name of the deployment.
- `verbose`: If true, the service will return more detailed information in the response.
- `isLoggingEnabled`: If true, the service will keep the query for further review.

For other properties, see the [ConversationTaskParameters](https://github.com/Azure/azure-sdk-for-js/blob/8c9b021b3566b12a10296a656433b4d9c44629e5/sdk/cognitivelanguage/ai-language-conversations/src/models.ts#L202) interface.


## Entities

You can access Microsoft CLU entities by using the `$entities` property. You can learn more in the [Jovo Model](https://www.jovo.tech/docs/models) and the [`$entities` documentation](https://www.jovo.tech/docs/entities).

The Microsoft CLU entity values are translated into the following Jovo entity properties:

```typescript
{
  value: text, // what the user said
  resolved: resolved, // the resolved value
  id: resolved, // same as resolved
  native: { /* raw API response for this entity */ }
}
```

