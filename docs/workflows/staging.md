# Staging

> To view this page on the Jovo website, visit https://www.jovo.tech/docs/staging

Learn more about the Jovo framework's staging feature.

- [Introduction](#introduction)
- [Project Configuration Stages](#project-configuration-stages)
- [App Configuration Stages](#app-configuration-stages)

## Introduction

Staging allows you to define separate deployment configurations (`project.js`) and app configurations (`config.js`) for each of your stages, usually local development, qa, and production.

## Project Configuration Stages

In your `project.js` file you can define different stages that can have the same properties as the `project.js` file itself.

```js
module.exports = {
  // ...
  stages: {
    dev: {
      endpoint: '${JOVO_WEBHOOK_URL}'
      alexaSkill: {
        skillId: 'some-skill-id'
      }
    },
    test: {
      alexaSkill: {
        endpoint: 'some-lambda-arn',
        skillId: 'different-skill-id'
      },
      googleAction: {
        dialogflow: {
          endpoint: 'some-api-gateway-endpoint'
        }
      }
    },
    prod: {
      // ...
    }
  }
}
```

> You can find a detailed explanation about the `project.js` file's properties [here](../configuration/project-js.md '../project-js').

The defined stages can be referenced with the Jovo CLI while building the platforms files or deploying the project using the `--stage` option:

```shell
$ jovo3 build -p alexaSkill --stage test --deploy
```

## App Configuration Stages

The app configuration stages are not defined in the same file as the project configuration. Here we use separate files for each stage with the following naming pattern: `config.<stage-name>.js`, e.g. `config.dev.js`.

The stage configs can have the same attributes as the default `config.js` file. For a detailed explanation of each property check the app configuration documentation [here](../configuration/config-js.md '../config-js').

The current active stage config will overwrite the default configs (`config.js`) properties.

```javascript
// @language=javascript

// src/config.js, default config

module.exports = {
	db: {
		FileDb: {
			pathToFile: '../db/db.json',
		},
	},

	// ...
};

// config.prod.js, config overrides for NODE_ENV=prod

module.exports = {
	db: {
		DynamoDb: {
			tableName: 'yourTableName',
		},
	},

	// ...
};

// @language=typescript

// src/config.ts, default config

const config = {
	db: {
		FileDb: {
			pathToFile: '../db/db.json',
		},
	},

	// ...
};

// config.prod.ts, config overrides for NODE_ENV=prod

const config = {
	db: {
		DynamoDb: {
			tableName: 'yourTableName',
		},
	},

	// ...
};
```

For the app to know in which environment it is currently in, use the `NODE_ENV` or `STAGE` environment variables:

```js
process.env.STAGE = 'prod';
```

On cloud services like AWS Lambda you have to use the built-in environment variable tools:

![AWS Lambda Environment Variable](../img/staging-env-lambda.png)

<!--[metadata]: {"description": "Learn how to use staging effectively with your Jovo projects.", "route": "staging"}-->
