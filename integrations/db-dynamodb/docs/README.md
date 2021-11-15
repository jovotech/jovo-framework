---
title: 'DynamoDB Database Integration'
excerpt: 'The DynamoDB Jovo integration allows you to store user specific data in a DynamoDB table.'
---

# DynamoDB Database Integration

This [database integration](https://v4.jovo.tech/docs/databases) allows you to store user specific data in a DynamoDB table.

## Introduction

[DynamoDB](https://aws.amazon.com/dynamodb/) is the NoSQL database service by Amazon Web Services (AWS). Many Jovo apps that are hosted on [AWS Lambda](https://v4.jovo.tech/marketplace/server-lambda) rely on DynamoDB to persist user data.

If you use AWS for your deployment, we recommend [FileDb](https://v4.jovo.tech/marketplace/db-filedb) for local development and DynamoDB for deployed versions. [Learn more about staging here](https://v4.jovo.tech/docs/staging).

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
      // Configuration
    }),
    // ...
  ],
});
```

Once the configuration is done, the DynamoDB database integration will create a DynamoDB table on the first read/write attempt (might take some seconds). No need for you to create the table.

The rest of this section provides an introduction to the steps you need to take depending on where you host your Jovo app:

- [On AWS (e.g. Lambda)](#for-apps-hosted-on-aws)
- [Outside AWS](#for-apps-hosted-outside-aws)

The [configuration section](#configuration) then provides a detailed overview of all configuration options.

### For Apps Hosted on AWS

If you host your app on [AWS Lambda](https://v4.jovo.tech/marketplace/server-lambda) and want to use a DynamoDB table in the same region, you only need to add a table name to get started:

```typescript
new DynamoDb({
  table: {
    name: 'MyDynamoDbTable',
  }
}),
```

### For Apps Hosted Outside AWS

If you want to use DynamoDB from outside AWS Lambda, you need to set it up for programmatic access. Learn more in the official guide by Amazon: [Setting Up DynamoDB (Web Service)](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html).

You can then add the necessary keys using the [`libraryConfig` property](#libraryconfig):

```typescript
new DynamoDb({
  table: {
    name: 'MyDynamoDbTable',
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
- `storedElements`: What should be stored in the database. [Learn more in the database integration documentation](https://v4.jovo.tech/docs/databases).

### table

The `table` property includes configuration for the creation of the DynamoDB table:

```typescript
new DynamoDb({
  table: {
    // Required properties
    name: 'MyDynamoDbTable',

    // Optional properties (with default values)
    createTableOnInit: true, // Creates a table if one does not already exist
    primaryKeyColumn: 'userId',
    readCapacityUnits: 2, // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html
    writeCapacityUnits: 2, // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html
  },
  // ...
}),
```

### libraryConfig

The `libraryConfig` property can be used to pass configurations to the AWS DynamoDB SDK that is used by this integration.

Currently, it includes the DynamoDbClient([find the official documentation here](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/dynamodbclientconfig.html)):

```typescript
new DynamoDb({
  libraryConfig: {
    dynamoDbClient: {
      // Add configuration here
    },
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
