# Google Cloud Datastore

Learn how to store user specific data of your Alexa Skills and Google Actions to Google Cloud Datastore.

* [Introduction](#introduction)
* [Configuration](#configuration)


## Introduction

The Google Cloud Datastore integration allows you to store user session data in the NoSQL service running on Google Cloud. This integration is especially convenient if you're running your voice app on Google Cloud Functions. You can find the official documentation about Google Cloud Datastore here: [cloud.google.com/datastore](https://cloud.google.com/datastore/).

> [Learn more about hosting your application on Google Cloud Functions](../../configuration/hosting/google-cloud-functions.md '../hosting/google-cloud-functions').

## Configuration

Download the package like this:

```sh
$ npm install --save jovo-db-datastore
```

Google Cloud Datastore can be enabled in the `src/app.js` file like this:

```javascript
// @language=javascript

// src/app.js

const { DatastoreDb } = require('jovo-db-datastore');

// Enable DB after app initialization
app.use(new DatastoreDb());

// @language=typescript

// src/app.ts

import { DatastoreDb } from 'jovo-db-datastore';

// Enable DB after app initialization
app.use(new DatastoreDb());
```

In your `config.js` file, you can set the `db` configuration like this:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    db: {
        DatastoreDb: {
            entity: 'yourEntityName',
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    db: {
        DatastoreDb: {
            entity: 'yourEntityName',
        },
    },

    // ...

};
```


<!--[metadata]: {"description": "Learn how to store user specific data of your Alexa Skills and Google Actions to Google Cloud Datastore.",
"route": "databases/google-datastore" }-->