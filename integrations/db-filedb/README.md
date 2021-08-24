# FileDb Local JSON Database Integration

This is the default database for prototyping with Jovo: A file based system that stores data in a JSON file.

- [Introduction](#introduction)
- [Installation](#installation)
- [Configuration](#configuration)

## Introduction

> Note: This database type is not supposed to be used in production. See other [database integrations](https://www.jovo.tech/marketplace/tag/databases) for production deployments.

The FileDb database integration allows you to easily store user specific data in a JSON file. This is especially helpful for local development and prototyping. Data will be stored in a `db.json` file that can be found in a `db` folder:

```js
db/
  └── db.json
models/
src/
jovo.project.js
```

Once the configuration is done, the File DB database integration will create a file in the specified folder (the default being `../db/db.json`) on the first read/write attempt. No need for you to create the file.


## Installation

Most Jovo templates already come with FileDb as default database integration for local development. If you're starting from scratch, though, you can install the plugin like this:

```sh
$ npm install @jovotech/db-filedb
```

We strongly recommend to only use this database integration for local prototyping. Add it as plugin to your `app.dev.ts` file like this:

```typescript
import { FileDb } from '@jovotech/db-filedb';

// ...

app.configure({
  plugins: [
    new FileDb(),
    // ...
  ],
});
```

## Configuration

After you've added the `FileDb` plugin to the app as discussed in the [installation section](#installation), you can add configuration like this:

```typescript
new FileDb({
  // Configuration
}),
```

The following configurations can be added:

* `pathToFile`: Where the database is stored. Default: `'../db/db.json'`.
* `storedElements`: What should be stored in the database. [Learn more in the database integration documentation](../../docs/databases.md).

Here is an example of a configuration with a `pathToFile` property:

```typescript
new FileDb({
  pathToFile: '../db/db.json',
}),
```