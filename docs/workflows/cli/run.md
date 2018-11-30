# jovo run

Learn how to use the `jovo run` command of the Jovo CLI to test your code locally.

* [Introduction](#introduction)


## Introduction

![jovo run command](../img/jovo-run.png "jovo run command")

You can use the `jovo run` command to start the development server in your `index.js` file, and then add the [Jovo Webhook](../03_app-configuration/02_server/webhook#jovo-webhook './server/webhook#jovo-webhook') as an endpoint to the respective developer consoles.

Learn more here: [App Configuration > Server Configuration](../03_app-configuration/server './server').

```sh
# Default
$ jovo run

# Options
$ jovo run [-b | --bst-proxy] [-w | --watch] [-p, --port <port>] [--inspect] [--stage <stage>] [--webhook-only]
  [--disable-jovo-debugger] [--model-test] [--timeout <timeout>] [-r | --record <name>]
```

You can also specify the file you want to run:
```sh
$ jovo run <file>

# Example
$ jovo run index.js

# Alternative
$ node index.js --webhook
```

You can also use other tools like [bst proxy](#bst-proxy) to tunnel to your local server.

**Options**

`--port`, `-p`: Defines the port that will be used to run the local development server. Default: `3000`.

`--inspect`: Run debugging mode.

`--stage`: Specify the stage where the configuration will be taken from.

`--webhook-only`: Starts the Jovo webhook proxy without executing the code.

`--disable-jovo-debugger`: Disables the Jovo debugger.

`--model-test`: Activates the language model test.

`--timeout`: Sets timeout in milliseconds.

`--record`, `-r`: Can be used to record requests and responses of your Jovo app for testing purposes.


**Integrations**

> If you want to see another integration, please feel free to [submit an issue](https://github.com/jovotech/jovo-cli/issues). Thanks!

Here is a list of integrations that work with `jovo run`:

Command | Description 
------------ | ------------- 
[`--bst-proxy`](#bst-proxy) | Creates a webhook URL for local testing and integrates with [Bespoken Analytics](../06_integrations/analytics)
[`--watch`](#watch) | Uses `nodemon` to monitor changes and automatically restart the server


##### bst proxy

You can use the bst proxy to create a webhook URL easily:

```sh
$ jovo run --bst-proxy
```

The result should look like this:

![Jovo and bst proxy](../img/terminal-bst-proxy-1.jpg)

The URL also comes with logging and analytics capabilities for prototyping and testing.

##### watch

With this integration, you don't have to manually restart your server with every change you make to the application:

```sh
$ jovo run --watch
```

For this, we're using [`nodemon`](https://github.com/remy/nodemon), a neat package that monitors your app files and automatically restarts the server.



<!--[metadata]: {"description": "Learn how to use the jovo run command of the Jovo CLI to test your code locally.",
                "route": "cli/run"}-->
