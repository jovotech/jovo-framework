---
title: 'User'
excerpt: 'Learn more about the Jovo User property.'
---

# User

Learn more about the Jovo `$user` property.

## Introduction

The `$user` property contains data and features about the specific user interacting with the app.

```typescript
this.$user;
```

The user class is mainly used to store [user data](#user-data) that needs to be persisted across sessions. The property also includes [metadata](#user-metadata) about the user.

In addition to the data, platforms offer their own user specific features (for example, retrieving a user's email address from their profile) that can be found in the respective platform's documentation.

## User Data

User data makes it possible to store user specific data across sessions using the [Jovo database integrations](./databases.md). Learn more about all data types [here](./data.md).

After a request has been received, the app loads the data from the database. You can then access it like this:

```typescript
this.$user.data;
```

The data can be manipulated (see [store data](#store-data) and [read data](#read-data)) and is saved to the database after the handler logic.

### Store Data

You can add and manipulate data entries like this:

```typescript
this.$user.data.key = value;

// Example
this.$user.data.score = 20;
```

### Read Data

You can access a specific data element like this:

```typescript
this.$user.data.key;

// Example
const score = this.$user.data.score;
```

## User Metadata

Additionally to the persisted data, you can also access the following information about the user:

- `this.$user.id`: The user's ID is also the key to their database entry. This is either a string or `undefined` (if the platform does not support user IDs).
- `this.$user.accessToken`: For platforms that offer account linking, the `accessToken` is a string for signed in users. The value is `undefined` if the user hasn't linked their account, or the platform does not support account linking.
- `this.$user.createdAt`: When was this user's database entry created?
- `this.$user.updatedAt`: When was this user's data last updated?
- `this.$user.isNew`: A `boolean` that is `true` for first-time users.
