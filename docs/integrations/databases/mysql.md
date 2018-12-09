# MySQL

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

Google Cloud Datastore can be enabled in the `src/app.js` file like this:

```javascript
const { MySQL } = require('jovo-db-mysql');

// Enable DB after app initialization
app.use(new MySQL());
```

In your `config.js` file, you can set the `db` configuration like this:

```javascript
db: {
    MySQL: {
        tableName: 'yourTableName',
    }
}
```

This is the default configuration for MySQL, if not specified otherwise:

```javascript
db: {
    MySQL: {
        tableName: 'users',
        primaryKeyColumn: 'userId',
        dataColumnName: 'userData',
    }
}
```


<!--[metadata]: {"description": "Learn how to store user specific data of your Alexa Skills and Google Actions to a MySQL database.",
"route": "databases/google-mysql" }-->