---
title: 'MongoDB Database Integration'
excerpt: 'The MongoDB Jovo integration allows you to store user specific data and more in a MongoDB database.'
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
  databaseName: 'jovoDb',
  collectionName: 'jovoUsers',
}),
```

- `connectionString`: The URI string used to connect to the MongoDB database. Learn more in the [official MongoDB docs](https://docs.mongodb.com/manual/reference/connection-string/).
- `databaseName`: Name of the [MongoDB database](https://docs.mongodb.com/manual/core/databases-and-collections/#databases). Default: `test`.
- `collectionName`: Name of the [MongoDB collection](https://docs.mongodb.com/manual/core/databases-and-collections/#collections) that stores the user specific data. A new collection is created with that name if doesn't exist yet. Default: `jovoUsers`.s

## Advanced Usage

The MongoDB integration works just like any other [database integration](https://www.jovo.tech/docs/databases): The database connection is done in the background so you can focus building app logic.

If you want to access the connection from a handler, for example if you want to access other users' data, you can do so like this:

// TODO

// note from jrglg: Jan, I leave this part as I can see you recovered from an older commit when it was a Singleton. I only change the namings.

```typescript
async START() {
    // You can read data from another user
    const users = mongoDb.getCollection();
    const otherUserData = (await users).find({ _id: '<another_id>' });

    // Also store documents in other collections in the same DB Jovo handles users
    const defaultDb = await mongoDb.getDb();
    await defaultDb.collection('myCollection').insertOne({ foo: 'bar' });

    // Or just get the single client to open a transaction
    const client = await mongoDb.client;
    const transactionResults = await client.startSession().withTransaction(async () => {
      // Modify some data
      // ...
    });

    // Or create a new DB
    const newDb = client.db("anotherDb");
}
```
