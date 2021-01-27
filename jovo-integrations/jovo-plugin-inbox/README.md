# Jovo Inbox Plugin


### Installation


```sh
npm install --save jovo-plugin-inbox
```

This plugin uses TypeORM to provide access to various databases.
Depending on the SQL Database you use, an additional installation
of the database driver is necessary.


MySQL or MariaDB
```sh
npm install --save mysql
```

PostgreSQL or CockraochDB
```sh
npm install pg --save
```
SQLite
```sh
npm install --save sqlite3
```

More databases: https://typeorm.io/#/undefined/installation


### Usage

```javascript
const { JovoInboxPlugin } = require('jovo-plugin-inbox');

app.use(
    new JovoInboxPlugin({
        appId: 'PizzaPlace',
        db: {
			type: 'mysql',
			host: 'host',
			port: 3306,
			username: 'user',
			password: 'pass',
			database: 'jovoinbox',
		},         
    })
);
```

See https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md for database specific config.

### Config

```javascript
{
    appId: string;
    defaultLocale: string; // defaultLocale for platforms without a locale in the request
    skipPlatforms?: string[]; // platforms where no data is stored, e.g. ['Alexa', 'GoogleAssistant']
    skipLocales?: string[]; // requests from given locales are skipped, e.g. ['de', 'en-US'],
    skipUserIds?: string[]; // users from given ids are skipped, e.g. ['jovo-debugger-user']
    skipRequestObjects?: string[]; // paths to objects in request json, e.g. ['context.System.apiAccessToken']
    skipResponseObjects?: string[]; // paths to objects in response json,
    maskRequestObjects?: string[]; // paths to objects in request json that are masked, e.g. sensitive data like access tokens
    maskResponseObjects?: string[]; // paths to objects in response json that are masked
    maskValue: string | Function; // new value for masked objects
    db: ConnectionOptions; // db connection options 
}


```

