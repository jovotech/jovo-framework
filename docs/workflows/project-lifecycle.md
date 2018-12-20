# Project Lifecycle

Learn more about the different steps of a Jovo project.

* [Introduction](#introduction)
* [Local Development](#local-development)
   * [Jovo Webhook](#jovo-webhook)
   * [Alternatives](#alternatives)
* [Deployment](#deployment)
   * [Deploy Platform Projects](#deploy-platform-projects)
   * [Deploy Source Code](#deploy-source-code)


## Introduction

Jovo offers different tools for different phases of the application development process.

* [Local Development](#local-development)
* [Deployment](#deployment)


## Local Development

Jovo offers a development server based on ExpressJS for local testing and debugging.

You can use either of the following commands to run the server locally:

```sh
# Using the Jovo CLI and Jovo Webhook
$ jovo run

# Alternative
$ npm run start
```

Make sure that, with every file update, you terminate the server with `ctrl+c` and run it again. You can also use the `nodemon` Jovo CLI integration. 

> [Find more information on the `jovo run` command here](../workflows/cli/run.md './cli/run').

`$ jovo run` should return this:

```sh
Local development server listening on port 3000.
This is your webhook url: https://webhook.jovo.cloud/[your-id]
```

As you can see, a [Jovo Webhook](#jovo-webhook) URL is automatically created, which serves as a link to your local webhook and can be added as a HTTPS endpoint to the voice platforms.

Here are all the services that can point to your local development server:
* [Jovo Webhook](#jovo-webhook) (default)
* [Alternatives](#alternatives)
   * [bst proxy](#bst-proxy)
   * [ngrok](#ngrok)


### Jovo Webhook

The Jovo Webhook is a free service that creates a link to your local webserver. This way, you can prototype locally without having to deal with servers or Lambda uploads all the time.

By using the [`jovo run`](../workflows/cli/run './cli/run'), a unique, anonymized link is created that looks like this:

```sh
https://webhook.jovo.cloud/[your-id]
```

This link simply makes it easier for you to prototype locally by being able to see the logs in your command line, and to make fast changes without uploading your code to AWS Lambda.

You can either use this link and paste it into the respective developer platform consoles, or use the [`jovo deploy`](../workflows/cli/deploy '../cli/deploy') command to upload it from the command line. Your Jovo Webhook URL is the default `endpoint` in your [`project.js`](../configuration/project-js.md './project-js') file.


### Alternatives

#### bst proxy

With the bst proxy by [Bespoken](https://bespoken.io/), you can create a link similar to the [Jovo Webhook](#jovo-webhook), but with additional features like logging.

You can run the proxy with the `jovo run` command:

```sh
$ jovo run --bst-proxy
```
This is what the result looks like:

![bst proxy result](https://www.jovo.tech/blog/wp-content/uploads/2017/10/terminal-bst-proxy-1.jpg)

Now, you can not only use the link as an endpoint, but also use it to access [Bespoken Analytics](../integrations/analytics/bespoken.md './analytics/bespoken') for powerful logging capabilities:

![bst proxy result](https://www.jovo.tech/blog/wp-content/uploads/2017/10/bespoken-logging.jpg)

#### ngrok

[Ngrok](https://ngrok.com/) is a tunneling service that makes your localhost accessible to outside APIs.

You can download ngrok like so:

```sh
# Open a new tab in your command line tool, then:
$ npm install ngrok -g

# Point ngrok to your localhost:3000
$ ngrok http 3000
```

It should display something similar to this:

![ngrok window](https://www.jovo.tech/img/docs/building-a-voice-app/webhook-url.jpg)


## Deployment

### Deploy Platform Projects

```sh
# Build platforms based on project.js
$ jovo build

# Deploy platform projects
$ jovo deploy
```

> [Learn more about the project.js configuration here](../configuration/project-js.md './project-js').



### Deploy Source Code

> [Learn more about hosting providers here](../configuration/hosting './hosting').

If you have an Lambda endpoint defined in your `project.js` file, the `jovo deploy` command will also bundle and upload your source code to AWS Lambda:

```sh
# Deploy platform projects and source code
$ jovo deploy
```

You can also just bundle the files and then upload the resulting `bundle.zip` file manually:

```sh
# Bundle files
$ jovo deploy --target zip

# Alternative
$ npm run bundle
```


<!--[metadata]: {"description": "Learn more about the different steps of a Jovo project.", "route": "project-lifecycle"}-->
