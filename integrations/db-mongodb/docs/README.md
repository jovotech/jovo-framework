---
title: 'MongoDB Database Integration'
excerpt: 'The MongoDB Jovo integration allows you to store user specific data in a MongoDB table.'
---

# MongoDB Database Integration

This [database integration](https://www.jovo.tech/docs/databases) allows you to store user specific data in a MongoDB table.

## Introduction

[MongoDB](https://aws.amazon.com/mongodb/) is the NoSQL database service by Amazon Web Services (AWS). Many Jovo apps that are hosted on [AWS Lambda](https://www.jovo.tech/marketplace/server-lambda) rely on MongoDB to persist user data.

If you use AWS for your deployment, we recommend [FileDb](https://www.jovo.tech/marketplace/db-filedb) for local development and MongoDB for deployed versions. [Learn more about staging here](https://www.jovo.tech/docs/staging).

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/db-mongodb
```

Add it as plugin to any stage you like, e.g. `app.prod.ts`:

```typescript
import { MongoDb } from '@jovotech/db-mongodb';

// ...

app.configure({
  plugins: [
    new MongoDb({
      // Configuration
    }),
    // ...
  ],
});
```

Once the configuration is done, the MongoDB database integration will create a MongoDB collection and a document on the first read/write attempt (might take some seconds). No need for you to create the table.

The rest of this section provides an introduction to the steps you need to take depending on where you host your Jovo app:

- [On MongoDB Atlas](#for-apps-hosted-on-mongodb-atlas)

The [configuration section](#configuration) then provides a detailed overview of all configuration options.

### Sample MongoDB Atlas configuration

```typescript
new MongoDb({
    connectionString: "mongodb+srv://<user>:<password>@<cluster>.mongodb.net/",
    databaseName: "jovo-db-2",
    collectionName: "jovo-collection",
}),
```

## Configuration

The following configurations can be added:

```typescript
new MongoDb({
  /** Specify username, password and clusterUrl. See https://docs.mongodb.com/drivers/node/current/fundamentals/connection/#connection-uri for more details */
  connectionString: string;
  /** The name of the database we want to use. If not provided, use database name from connection string. A new database is created if doesn't exist yet. */
  databaseName?: string;
  /** A new collection is created with that name if doesn't exist yet. */
  collectionName?: string;
}),
```

### Reuse connection

For better performance, you can reuse the connection by importing it from:

Change: Can't find a way to do it well

### libraryConfig

Will be added later