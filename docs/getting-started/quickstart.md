# Jovo Quickstart Guide

Learn how to quickly create a Jovo app for the Amazon Alexa and Google Assistant voice platforms.

* [Install the Jovo CLI](#introduction)
* [Create a new Jovo Project](#create-a-new-jovo-project)
* [Run and Test the Code](#run-and-test-the-code)
* [Next Steps](#next-steps)



## Install the Jovo CLI

We highly recommend using the Jovo CLI if you want to benefit from all the features coming with Jovo. Install the Jovo CLI globally with:

```sh
$ npm install -g jovo-cli
```

After successful installation, you should be able to see the jovo menu by just typing the following into your command line:

```sh
$ jovo
```

You can check the version number (and compare it to the [jovo-cli npm package](https://www.npmjs.com/package/jovo-cli) version) with this command:

```sh
$ jovo -V
```

[Find a full list of Jovo CLI Commands here](../workflows/cli './cli').


## Create a new Jovo Project

You can create a Jovo project into a new directory with the following command:

```sh
$ jovo new <directory>
```

This will create a new folder, clone the [Jovo Sample App](#jovo-sample-voice-app) and install all the necessary dependencies so you can get started right away.

This is how a typical Jovo project looks like:

```javascript
src/
  |── app.js
  |── config.js
  └── index.js
models/
  └── en-US.json
project.js
```

You can find out more about the Jovo project structure in [Configuration](../configuration './configuration').


## Run and Test the Code

For your first "Hello World!", you need to run the software on
* a local development server with `$ jovo run` (recommended), as described in [App Configuration > Server Configuration > Webhook](../03_app-configuration/02_server/webhook.md './server/webhook')


## Next Steps

You can find a full step-by-step course for both Amazon Alexa and Google Assistant here: [Voice App Project 1: Hello World](https://www.jovo.tech/blog/project-1-hello-world/). 



<!--[metadata]: {"description": "Learn how to quickly create a Jovo app for the Amazon Alexa and Google Assistant voice platforms.", "route": "quickstart"}-->
