---
title: 'Redis Database Integration'
excerpt: 'The Redis Jovo integration allows you to store user specific data in Redis.'
url: 'https://www.jovo.tech/marketplace/db-redis'
---

# Redis Database Integration

This [database integration](https://www.jovo.tech/docs/databases) allows you to store user specific data in Redis.

## Introduction

[Redis](https://redis.io) is an open source, in-memory data store. 

Learn more about connecting your Jovo app to a Redis in the [installation](#installation) and [configuration](#configuration) sections.

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/db-redis
```

Add it as plugin to any [stage](https://www.jovo.tech/docs/staging) you like, e.g. `app.prod.ts`:

```typescript
import { RedisDb, RedisDbConfig, RedisEntryConfig } from '@jovotech/db-redis';
// ...

app.configure({
  plugins: [
    new RedisDb({
      connectionString: '<YOUR-REDIS-URI>',
    }),
    // ...
  ],
});
```

For the integration to work, you need to at least add the `connectionString` config property. Learn more in the [IANA docs](https://www.iana.org/assignments/uri-schemes/prov/redis).

The [configuration section](#configuration) provides a detailed overview of all configuration options.

## Configuration

The following configurations can be added:

```typescript
new RedisDb({
  connectionString: '<YOUR-REDIS-URI>',
  keyPrefix: 'myapp',
}),
```

The following configurations can be added:

- `connectionString`: The Redis connection string in the format: `redis[s]://[[username][:password]@][host][:port][/db-number]`
- `keyPrefix`: An optional prefix to be added to Redis keys. Default: `''`.
- `keySeparator`: An separator used between sections of a Redis key. Default: `':'`.
- `storedElements`: What should be stored in the database. [Learn more in the database integration documentation](https://www.jovo.tech/docs/databases).
- `entries`: An array of configurations for each entry stored as a separate key-value pair in Redis. See [entries](#entries) for more information.
- `onCreateKey`: A function that generates the key for each `entry` in `entries`. See [onCreateKey](#oncreatekey) for more info.
- `onDecodeValue`: A function that converts a string to a `DbItem` as it is read from Redis. See [onDecodeValue](#ondecodevalue) for more info.
- `onEncodeValue`: A function that converts a `DbItem` to a string so that it can be stored as a value in Redis. See [onEncodeValue](#onencodevalue) for more info.

Here is an example of a configuration with default values:

```typescript
new RedisDb({
  connectionString: '<YOUR-REDIS-URI>',
  keyPrefix: '',
  keySeparator: ':',
  entries: [
    {
      id: 'data',
      user: true,
      session: true,
      history: true,
      createdAt: true,
      updatedAt: true,
      ttlSeconds: 0,
    },
  ],
}),
```

Here is an example of splitting values across multiple Redis entries:

```typescript
new RedisDb({
  storedElements: {
    user: true,
    session: true,
    history: {
      enabled: true,
      size: 1,
      output: true,
    },
  },
  entries: [
    {
      id: 'user',
      ttlSeconds: 0,
      user: true,
      createdAt: true,
      updatedAt: true,
    },
    {
      id: 'session',
      ttlSeconds: 1200,
      session: true,
    },
    {
      id: 'history',
      ttlSeconds: 1200,
      history: true,
    },
  ],
  // ...
}),
```

## Advanced Usage

When you use minimal settings for this plugin, you will get all configured `storedElements` values saved to a single Redis entry.

To take advantage of multiple entries, TTL and custom functions, use these advanced settings:

### entries

Configure which values to store for a given Redis key. The possible values are configured in the [storedElements](https://www.jovo.tech/docs/databases#storedelements) section. The settings in `storedElements` determines what gets stored. The settings for each `entry` determines what gets included as part of a specific Redis value if it is present.

Here are some Redis entry configurations:

```typescript
new RedisDb({
  // ...
  entries: [
    {
      id: 'user',
      ttlSeconds: 1000,
      user: true,
      createdAt: true,
      updatedAt: true,
    },
    {
      id: 'session',
      ttlSeconds: 100,
      session: true,
    },
    {
      id: 'history',
      ttlSeconds: 500,
      history: true,
    },
  ],
  // ...
}),
```
- `id`: Unique identifier that can be used as part of the Redis key.
- `user`: Set to `true` to include user data in this Redis entry.
- `session`: Set to `true` to include session data in this Redis entry.
- `history`: Set to `true` to include interaction history in this Redis entry.
- `createdAt` and `updatedAt`: Set to `true` to include timestamps in this Redis entry.
- `ttlSeconds`: If the value is an integer greater than 0, then a Time-to-Live (TTL) value is set for this entry each time it is saved to Redis. Once the TTL expires, the entry is automatically deleted.

### onCreateKey

The default `onCreateKey` function generates a key in the format:

`<config.keyPrefix><config.keySeparator><entry.id><config.keySeparator><userId>`

Example keys:
- myapp:user:aaad82ba-bbac-4f93-a44d-aae37e842a77
- myapp:session:aaad82ba-bbac-4f93-a44d-aae37e842a77
- myapp:history:aaad82ba-bbac-4f93-a44d-aae37e842a77

You can use your own `onCreateKey` function to construct keys to match a custom format.

Here is a sample of the default function:

```ts
function onCreateKey(
  userId: string,
  config: RedisDbConfig,
  jovo: Jovo,
  entry: RedisEntryConfig,
): Promise<string> | string {
  const parts: string[] = [];

  if (config.keyPrefix) {
    parts.push(config.keyPrefix);
  }

  parts.push(entry.id);
  parts.push(userId);

  return parts.join(config.keySeparator);
}
```

If you don't want to use the `userId` as the key in Redis, you can call a hash function in `onCreateKey`:

```ts
// ...
parts.push(getKeyHash(userId));
// ...
```

If you want to use the session ID as part of the key for the entry with an `id` of `'session'`:

```ts
// ...
if (configEntry.id === 'session') {
  parts.push(jovo.$request.getSessionId() ?? userId);
}
// ...
```


### onDecodeValue

The default `onDecodeValue` function parses the string from Redis into a JSON object:

```ts
function onDecodeValue(entryId: string, value: string): Promise<DbItem> | DbItem {
  return JSON.parse(value);
}
```

You can use this function to decrypt a value that was stored encrypted in Redis. Here is an example that only decrypts the entry with an `id` of `'user'`:

```ts
onDecodeValue: (entryId: string, value: string) => {
  if (entryId === 'user') {
    return JSON.parse(decryptValue(value, 'secret'));
  }

  return JSON.parse(value);
},
```

You can provide a custom implementation for `decryptValue`:

```ts
function decryptValue(encryptedValue: string, secret: string): string {
  // ...
}
```

### onEncodeValue

The default `onEncodeValue` function converts a JSON data object into a string so it can be stored as a value in Redis:

```ts
function onEncodeValue(entryId: string, dbItem: DbItem): Promise<string> | string {
  return JSON.stringify(dbItem);
}
```

You can use this function to encrypt a value before storing it in Redis. Here is an example that only encrypts the entry with an `id` of `'user'`:

```ts
onEncodeValue: (entryId: string, dbItem: DbItem) => {
  const value = JSON.stringify(dbItem);
  if (entryId === 'user') {
    return encryptValue(value, 'secret');
  }
  return value;
},
```

You can provide a custom implementation for `encryptValue`:

```ts
function encryptValue(value: string, secret: string): string {
  // ...
}
```