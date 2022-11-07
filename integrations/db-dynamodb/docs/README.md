---
title: 'DynamoDB Database Integration'
excerpt: 'The DynamoDB Jovo integration allows you to store user specific data in a DynamoDB table.'
url: 'https://www.jovo.tech/marketplace/db-dynamodb'
---

# DynamoDB Database Integration

This [database integration](https://www.jovo.tech/docs/databases) allows you to store user specific data in a DynamoDB table.

## Introduction

[DynamoDB](https://aws.amazon.com/dynamodb/) is the NoSQL database service by Amazon Web Services (AWS). Many Jovo apps that are hosted on [AWS Lambda](https://www.jovo.tech/marketplace/server-lambda) rely on DynamoDB to persist user data.

If you use AWS for your deployment, we recommend [FileDb](https://www.jovo.tech/marketplace/db-filedb) for local development and DynamoDB for deployed versions. [Learn more about staging here](https://www.jovo.tech/docs/staging).

[You can also find an example on GitHub](https://github.com/jovotech/jovo-sample-alexa-googleassistant-lambda).

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/db-dynamodb
```

Add it as plugin to any stage you like, e.g. `app.prod.ts`:

```typescript
import { DynamoDb } from '@jovotech/db-dynamodb';

// ...

app.configure({
  plugins: [
    new DynamoDb({
      table: {
        name: '<YOUR_TABLE_NAME>',
      },
    }),
    // ...
  ],
});
```

For the plugin to work, you need to at least add a table name to the configuration. The [configuration section](#configuration) then provides a detailed overview of all options.

Once the configuration is done, the DynamoDB database integration will create a DynamoDB table on the first read/write attempt. This might take some seconds and could lead to the app returning an error during the first request. The second request should then work as expected.

The rest of this section provides an introduction to the steps you need to take depending on where you host your Jovo app:

- [On AWS (e.g. Lambda)](#for-apps-hosted-on-aws)
- [Outside AWS](#for-apps-hosted-outside-aws)

### For Apps Hosted on AWS

If you host your app on [AWS Lambda](https://www.jovo.tech/marketplace/server-lambda) and want to use a DynamoDB table in the same region, you only need to add a table name to get started:

```typescript
new DynamoDb({
  table: {
    name: '<YOUR_TABLE_NAME>',
  }
}),
```

### For Apps Hosted Outside AWS

If you want to use DynamoDB from outside AWS Lambda, you need to set it up for programmatic access. Learn more in the official guide by Amazon: [Setting Up DynamoDB (Web Service)](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html).

You can then add the necessary keys using the [`libraryConfig` property](#libraryconfig):

```typescript
new DynamoDb({
  table: {
    name: '<YOUR_TABLE_NAME>',
  },
  libraryConfig: {
    dynamoDbClient: {
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'myAccessKeyId',
        secretAccessKey: 'mySecretAccessKey',
      },
    },
  }
}),
```

## Configuration

The following configurations can be added:

```typescript
new DynamoDb({
  table: { /* ... */ },
  libraryConfig: { /* ... */ },
  storedElements: { /* ... */ },
}),
```

- `table`: Configuration for the table that is going to be created by the plugin. [Learn more below](#table).
- `libraryConfig`: Any configuration for the AWS DynamoDb SDK can be passed here. [Learn more below](#libraryconfig).
- `storedElements`: What should be stored in the database. [Learn more in the database integration documentation](https://www.jovo.tech/docs/databases).

### table

The `table` property includes configuration for the creation of the DynamoDB table:

```typescript
new DynamoDb({
  table: {
    // Required properties
    name: '<YOUR_TABLE_NAME>',

    // Optional properties (with default values)
    createTableOnInit: true, // Creates a table if one does not already exist
    primaryKeyColumn: 'userId',
    readCapacityUnits: 2, // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html
    writeCapacityUnits: 2, // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html
    billingMode: 'PROVISIONED', // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html
  },
  // ...
}),
```

### libraryConfig

The `libraryConfig` property can be used to pass configurations to the AWS DynamoDB SDK that is used by this integration.

Currently, it includes options for the [DynamoDbClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/dynamodbclientconfig.html) and [marshall](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/interfaces/_aws_sdk_util_dynamodb.marshalloptions-1.html):

```typescript
new DynamoDb({
  libraryConfig: {
    dynamoDbClient: { /* ... */ },
    marshall: { /* ... */ },
  },
  // ...
}),
```

For example, you can add `credentials` like this:

```typescript
new DynamoDb({
  libraryConfig: {
    dynamoDbClient: {
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'myAccessKeyId',
        secretAccessKey: 'mySecretAccessKey',
      },
    },
    // ...
  }
}),
```

`marshall` includes the following default values:

```typescript
new DynamoDb({
  libraryConfig: {
    marshall: {
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
  },
  // ...
}),
```

## Permissions

The DynamoDB integration needs the following permissions. Learn more in the [official AWS docs](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Operations.html).

- `dynamodb:CreateTable`
- `dynamodb:DescribeTable`
- `dynamodb:Query`
- `dynamodb:Scan`
- `dynamodb:GetItem`
- `dynamodb:PutItem`
- `dynamodb:UpdateItem`
- `dynamodb:DeleteItem`

You can find all permissions for the [Serverless CLI](https://www.jovo.tech/marketplace/target-serverless) in this [example `jovo.project.js` file](https://github.com/jovotech/jovo-sample-alexa-googleassistant-lambda/blob/main/jovo.project.js).
