# Database Integrations

Jovo offers a variety of integrations that allow you to store elements like user data, session data, and a user's interaction history in a database. [Learn more about the different data types here](./data.md).

- [Integrations](#integrations)
- [Configuration](#configuration)

## Integrations

The following database integrations are currently working with Jovo `v4`:

* `FileDb`: File-based system for local prototyping. Added to the `app.dev` stage by default.
* `DynamoDb`: NoSQL database by AWS, typically used together with AWS Lambda.

## Configuration

You can add a database integration as a plugin. For example, many Jovo projects have `FileDb` added to `app.dev.ts`:

```typescript
app.configure({
  plugins: [
    new FileDb({
      pathToFile: '../db/db.json',
    }),
    // ...
  ],
});
```

Along with integration specific options (which can be found in each integration's documentation), there are also features that are configured the same way across all databases. This section uses `FileDb` for its code examples, which can be replaced with the database integration of your choice.

By default, a database integration stores data like this:

```json
{
  "id": "someUserId",
  "user": {
    "data": {
      }
  },
  "createdAt": "2021-06-30T05:50:04.034Z",
  "updatedAt": "2021-06-30T05:50:04.095Z"
}
```

It includes:
* A user `id` to identify the current user. This is either taken from the platform (e.g. an Alexa Skill user ID) or created internally by Jovo.
* A `user` object that stores [user data](./data.md#user-data).
* Timestamps `createdAt` and `updatedAt` that help debug users in large datasets.

There are also additional elements that can be stored in the database. These can be configured with `storedElements`, which makes it possible to granularly define which types of data should be stored in the database.

The default configuration for each database integration is this:

```typescript
new FileDb({
  // ...
  storedElements: {
    user: true, // this.$user.data
    session: false, // this.$session.data
    history: false, // this.$history
    createdAt: true,
    updatedAt: true,
  }
}),
```

* `user`: Persist user data across sessions using `this.$user.data`. Enabled by default.
* `session`: Persist session data across interactions using `this.$session.data`. This is necessary for some platforms (like Facebook Messenger) that don't allow for session storage.
* `history`: Persist an interaction history and define which elements (e.g. `nlu` or `output`) data you want to store from previous requests and responses.
* `createdAt` and `updatedAt`: These timestamps are enabled by default.

[Learn more about the different data types here](./data.md).
