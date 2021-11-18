# MySQL Database Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-db-mysql

Learn how to store user specific data of your Alexa Skills and Google Actions to a MySQL database.

* [Introduction](#introduction)
* [Configuration](#configuration)


## Introduction

The MySQL database integration allows you to store user specific data into this widely adopted relational database. 


## Configuration

Download the package like this:

```sh
$ npm install --save jovo-db-mysql
```

MySQL database integration can be enabled in the `src/app.js` file like this:

```javascript
// @language=javascript

// src/app.js

const { MySQL } = require('jovo-db-mysql');

// Enable DB after app initialization
app.use(new MySQL());

// @language=typescript

// src/app.ts

import { MySQL } from 'jovo-db-mysql';

// Enable DB after app initialization
app.use(new MySQL());
```

In your `config.js` file, you can set the `db` configuration like this:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    db: {
        MySQL: {
            tableName: 'yourTableName',
            connection: {
                host: process.env.MYSQL_ADDR || 'localhost',
                port:  process.env.MYSQL_PORT || '9000',
                user: process.env.MYSQL_USER || 'user',
                password: process.env.MYSQL_PASSWORD || 'password',
                database: process.env.MYSQL_DATABASE || 'jovoapp',
                },
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    db: {
        MySQL: {
            tableName: 'yourTableName',
            connection: {
                host: process.env.MYSQL_ADDR || 'localhost',
                port:  process.env.MYSQL_PORT || '9000',
                user: process.env.MYSQL_USER || 'user',
                password: process.env.MYSQL_PASSWORD || 'password',
                database: process.env.MYSQL_DATABASE || 'jovoapp',
                },
        },
    },

    // ...

};
```

This is the default configuration for MySQL, if not specified otherwise:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    db: {
        MySQL: {
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
        MySQL: {
            tableName: 'users',
            primaryKeyColumn: 'userId',
            dataColumnName: 'userData',
            connection: {},
        },
    },

    // ...

};
```

Once the configuration is done, the MySQL database integration will create a table in your Database on the first read/write attempt. 