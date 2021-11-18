# PostgreSQL Database Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-db-postgresql

Learn how to use PostgreSQL as your app's database to store user specific data.

* [Installation](#installation)

## Installation

Download the package like this:

```sh
$ npm install --save jovo-db-postgresql
```

PostgreSQL database integration can be enabled in the `src/app.js` file like this:

```javascript
// @language=javascript

// src/app.js

const { PostgreSQL } = require('jovo-db-postgresql');

// Enable DB after app initialization
app.use(new PostgreSQL());

// @language=typescript

// src/app.ts

import { PostgreSQL } from 'jovo-db-postgresql';

// Enable DB after app initialization
app.use(new PostgreSQL());
```

In your `config.js` file, you can set the `db` configuration like this:

```javascript
// @language=javascript

// src/config.js

module.exports = {
  db: {
    PostgreSQL: {
      tableName: 'yourTableName',
      connection: {
        host: '',
        port: 3000,
        user: '',
        password: '',
        database: '',
      },
    },
  },

  // ...
};

// @language=typescript

// src/config.ts

const config = {
  db: {
    PostgreSQL: {
      tableName: 'yourTableName',
      connection: {
        host: '',
        port: 3000,
        user: '',
        password: '',
        database: '',
      },
    },
  },

  // ...
};
```

This is the default configuration for PostgreSQL, if not specified otherwise:

```javascript
// @language=javascript

// src/config.js

module.exports = {
  db: {
    PostgreSQL: {
      tableName: 'users',
      primaryKeyColumn: 'userId',
      dataColumnName: 'userData',
      connection: {},
    },
  },

  // ...
};

// @language=typescript

// src/config.ts

const config = {
  db: {
    PostgreSQL: {
      tableName: 'users',
      primaryKeyColumn: 'userId',
      dataColumnName: 'userData',
      connection: {},
    },
  },

  // ...
};
```

Once the configuration is done, the PostgreSQL database integration will create a table in your Database on the first read/write attempt. 