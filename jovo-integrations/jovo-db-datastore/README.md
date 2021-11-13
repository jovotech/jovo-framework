# Google Cloud Datastore Database Integration

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-db-datastore

Learn how to store user specific data of your Alexa Skills and Google Actions to Google Cloud Datastore.

* [Introduction](#introduction)
* [Configuration](#configuration)


## Introduction

The Google Cloud Datastore integration allows you to store user session data in the NoSQL service running on Google Cloud. This integration is especially convenient if you're running your voice app on Google Cloud Functions. You can find the official documentation about Google Cloud Datastore here: [cloud.google.com/datastore](https://cloud.google.com/datastore/).

> [Learn more about hosting your application on Google Cloud Functions](https://v3.jovo.tech/docs/hosting/google-cloud-functions').

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

The Jovo Datastore plugin and the official Google Datastore package ([Google Cloud Datastore Docs](https://googleapis.dev/nodejs/datastore/5.0.5/Datastore.html)) share the same configuration options. You can specify them in your `config.js` file the following way:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    db: {
        DatastoreDb: {
            gCloudConfig: {
				// Datastore configuration...
			},
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    db: {
        DatastoreDb: {
            gCloudConfig: {
				// Datastore configuration...
			}
        },
    },

    // ...

};
```

It's important that you authenticate your client with the Google Cloud API. The recommended way is to use a Google service account. You can specify the path to the service account's JSON key file path in your `config.js` file:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    db: {
        DatastoreDb: {
            gCloudConfig: {
				keyFilename: '<path-to-key-file>'
			},
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    db: {
        DatastoreDb: {
            gCloudConfig: {
				keyFilename: '<path-to-key-file>'
			}
        },
    },

    // ...

};
```