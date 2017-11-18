# [Tools](../) > CLI

The Jovo Command Line Tools (see [GitHub Repository](https://github.com/jovotech/jovo-cli)) offer the ability to create, prototype, and test your voice app quickly.

* [Installation](#installation)
 * [Troubleshooting](#troubleshooting)
* [jovo new](#jovo-new)
  * [Templates](#templates)
* [jovo run](#jovo-run)
  * [Integrations](#integrations)

## Installation

To make best use of the Jovo CLI, install it globally via npm:

```sh
$ npm install -g jovo-cli
```

You can check the version number (and compare it to the [jovo-cli npm package](https://www.npmjs.com/package/jovo-cli) version) with this command:

```sh
$ jovo -V
```


### Troubleshooting

If you run into problems, please submit an issue here: [jovotech/jovo-cli](https://github.com/jovotech/jovo-cli). Thank you! 


## jovo new

You can create a Jovo project into a new directory with the following command:

```sh
$ jovo new <directory>
```

Currently, this creates a project from a "Hello World" template (see [sample voice app repository on GitHub](https://github.com/jovotech/jovo-sample-voice-app-nodejs)).

### Templates

We're currently working on adding more starter templates, with `helloworld` being the default. 

```sh
$ jovo new <directory> --template <template>

# Example
$ jovo new HelloWorld --template helloworld
```

You can find a list of templates here:

Template | Description | Repository
------------ | ------------- | -------------
helloworld | Creates a "Hello World" sample voice app | [jovo-sample-voice-app-nodejs](https://github.com/jovotech/jovo-sample-voice-app-nodejs)


## jovo run

You can use the `jovo run` command to start the development server in your `index.js` file.

```sh
$ jovo run
```

You can also specify the file you want to run:

```sh
$ jovo run <file>

# Example
$ jovo run index.js

# Alternative
$ node index.js
```

You can then use ngrok or another tool (like [bst proxy](#bst-proxy)) to tunnel to your local server.


### Integrations

> If you want to see another integration, please feel free to submit an issue. Thanks!

Here is a list of integrations that work with `jovo run`:

Command | Description | Docs
------------ | ------------- | -------------
`--bst-proxy` | Creates a webhook URL for local testing | [📝](#bst-proxy)
`--watch` | Uses `nodemon` to monitor changes and automatically restart the server | [📝](#watch)


#### bst proxy

You can use the bst proxy to create a webhook URL easily:

```sh
$ jovo run --bst-proxy
```

The result should look like this:

![Jovo and bst proxy](https://www.jovo.tech/blog/wp-content/uploads/2017/10/terminal-bst-proxy-1.jpg)

The URL also comes with logging and analytics capabilities for prototyping and testing.

#### watch

With this integration, you don't have to manually restart your server with every change you make to the application:

```sh
$ jovo run --watch
```

For this, we're using [`nodemon`](https://github.com/remy/nodemon), a neat package that monitors your app files and automatically restarts the server.
