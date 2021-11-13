# Local Development

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/local-development

Learn more about local development of Jovo projects.

- [Introduction](#introduction)
- [Jovo Webhook](#jovo-webhook)
- [FileDb](#filedb)
- [Debugging](#debugging)

## Introduction

Local development allows you to quickly test your code without having to go through the hassle of deploying your project every time you make changes.

To make local development easier, Jovo provides two tools. First, there is the Jovo Webhook that creates a link to your local webserver which you can use as an endpoint for testing. Second, the FileDb plugin which is a file based system to persist user data.

## Jovo Webhook

The Jovo Webhook is a quick and easy way to create a link to your local webserver which you can use as an endpoint to test your app. In addition to that, it allows you to use the [Jovo Debugger](../tools/debugger.md '../debugger'), a tool to make debugging Jovo projects easier.

Every client receives their very own static webhook ID in the following format:

```sh
https://webhook.jovo.cloud/[your-id]
```

To allow multiple users to work on the same repository locally, the webhook URL doesn't have to be referenced directly in the project's configuration. Instead, you use the `${JOVO_WEBHOOK_URL}` string which will be automatically replaced by the client's webhook URL:

```js
// ./project.js

module.exports = {
	// ...
	endpoint: '${JOVO_WEBHOOK_URL}',
};
```

> We provide an on-premise solution for enterprises who want to use the Jovo Webhook. [Please use contact us here](https://v3.jovo.tech/on-premise-deployment).

Find out more about the Jovo Webhook [here](../tools/webhook.md '../webhook').

## FileDb

The Jovo FileDb plugin is the default database for prototyping. It's a file based system that stores the user data in a JSON file.

A `db/` folder will be added to the root of your project which will include a `db.json` file storing all the user data:

```js
[
	{
		userId: 'someUser',
		userData: {
			data: {
				someKey: 'someValue',
			},
		},
	},
	{
		userId: 'otherUser',
		// ...
	},
];
```

You can find out more about the Jovo FileDb plugin [here](../integrations/databases/file-db.md '../integrations/databases/file-db).

## Debugging

Debugging plays a big part in local development. To help with that, Jovo provides two tools that might make debugging easier. You can find out more about it in the [debugging section](./debugging.md './debugging').

<!--[metadata]: {"description": "Learn more about local development of Jovo projects.", "route": "local-development"}-->
