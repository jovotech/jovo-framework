---
title: 'MongoDB Database Integration'
excerpt: 'The MongoDB Jovo integration allows you to store user specific data and more in a MongoDB database.'
url: 'https://www.jovo.tech/marketplace/db-mongodb'
---

# MongoDB Database Integration

This [database integration](https://www.jovo.tech/docs/databases) allows you to store user specific data in a MongoDB table.

## Introduction

[MongoDB](https://www.mongodb.com/) is a source-available document database that can be used to store [long-term data](https://www.jovo.tech/docs/data#long-term-data-storage) for your Jovo app.

MongoDB can be hosted on your own servers, which is helpful if you want to run your Jovo apps on your own premises, for example using [Express](https://www.jovo.tech/marketplace/server-express). Alternatively, you can also use [MongoDB Atlas](https://www.mongodb.com/atlas/database) for fast and easy setup.

Learn more about connecting your Jovo app to a MongoDB database in the [installation](#installation) and [configuration](#configuration) sections.

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/db-mongodb
```

Add it as plugin to any [stage](https://www.jovo.tech/docs/staging) you like, e.g. `app.prod.ts`:

```typescript
import { MongoDb } from '@jovotech/db-mongodb';
// ...

app.configure({
  plugins: [
    new MongoDb({
      connectionString: '<YOUR-MONGODB-URI>',
    }),
    // ...
  ],
});
```

Once the configuration is done, the MongoDB database integration will create a MongoDB database and a collection on the first read/write attempt (might take some seconds). No need for you to create the database.

For the integration to work, you need to at least add the `connectionString` config property. Learn more in the [official MongoDB docs](https://docs.mongodb.com/manual/reference/connection-string/).

The [configuration section](#configuration) provides a detailed overview of all configuration options.

## Configuration

The following configurations can be added:

```typescript
new MongoDb({
  connectionString: '<YOUR-MONGODB-URI>',
  databaseName: '<YOUR-DATABASE-NAME>', // optional, can also be set using connectionString
  collectionName: 'jovoUsers',
  libraryConfig: { /* MongoClientOptions */ },
}),
```

- `connectionString`: The URI string used to connect to the MongoDB database. Learn more in the [official MongoDB docs](https://docs.mongodb.com/manual/reference/connection-string/).
- `databaseName`: Name of the [MongoDB database](https://docs.mongodb.com/manual/core/databases-and-collections/#databases). This is an optional property. Generally, it is recommended to use the `connectionString` to reference the database name. If it doesn't contain a database name and the `databaseName` property is not set either, MongoDb will use the default value `test`.
- `collectionName`: Name of the [MongoDB collection](https://docs.mongodb.com/manual/core/databases-and-collections/#collections) that stores the user specific data. A new collection is created with that name if doesn't exist yet. Default: `jovoUsers`.
- `libraryConfig`: Additional options that can be passed to the MongoDB client. You can find all options in the [official `MongoClientOptions` reference](https://mongodb.github.io/node-mongodb-native/4.4/interfaces/MongoClientOptions.html).

If you're testing MongoDb in development together with the [Jovo Debugger](https://www.jovo.tech/docs/debugger), we recommend ignoring the `$mongoDb` object. Update your `app.dev.ts` like this then:

```typescript
app.use(
  // ...
  new JovoDebugger({
    ignoredProperties: ['$app', '$handleRequest', '$platform', '$mongoDb'],
  }),
  new MongoDb({
    connectionString: '<YOUR-MONGODB-URI>',
  }),
);
```

## Advanced Usage

The MongoDb integration works just like any other [database integration](https://www.jovo.tech/docs/databases): The database connection is done in the background so you can focus building app logic.

If you want to access the connection from a handler, for example if you want to access other users' data, you can also use the `$mongoDb` property:

```typescript
this.$mongoDb;

// Features
await this.$mongoDb.getClient();
await this.$mongoDb.getDb();
await this.$mongoDb.getCollection();
```

Here is an example:

```typescript
async someHandler() {
    // You can read data from another user
    const users = await this.$mongoDb.getCollection();
    const otherUserData = (await users).find({ _id: '<another_id>' });

    // Also store documents in other collections in the same DB Jovo handles users
    const defaultDb = await this.$mongoDb.getDb();
    await defaultDb.collection('myCollection').insertOne({ foo: 'bar' });

    // Or just get the single client to open a transaction
    const client = await this.$mongoDb.getClient();
    const transactionResults = await client.startSession().withTransaction(async () => {
      // Modify some data
      // ...
    });

    // Or create a new DB
    const newDb = client.db("anotherDb");
}
```


## Deployment

If you run into a problem during [deployment](https://www.jovo.tech/docs/deployment), you may be related to the `mongodb-client-encryption` dependency of MongoDb (see [this issue](https://github.com/jovotech/jovo-framework/issues/1381) for more information).

To solve this, add `--external:mongodb-client-encryption` to the [`bundle` script](https://www.jovo.tech/docs/deployment#bundle) of your Jovo app's `package.json` (find an [example here](https://github.com/jovotech/jovo-v4-template/blob/master/package.json)).

```json
{
  "scripts": {
    "bundle": "[...] --external:mongodb-client-encryption",
  }
}
```