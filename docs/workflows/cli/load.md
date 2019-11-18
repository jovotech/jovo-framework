# jovo load

Learn more about how to load your Conversational Component into your existing voice application.

* [Introduction](#introduction)
* [Workflow](#workflow)

## Introduction

`jovo load` is the Jovo CLI command to load a Conversational Component into your voice application's code base.

> [Find out more about Jovo's Conversational Components](https://www.jovo.tech/docs/components)

## Workflow

The `jovo load` command is followed by the name of the Conversational Component you want to load, that you installed into your `node_modules` folder prior.

```sh
# Install Component into node_modules/
$ npm install jovo-component-get-email -s

# Load Component from node_modules/ to components folder
$ jovo load jovo-component-get-email
```

This will load the component into either `./src/components/`, or just `./components/`. Now you can import it in your `app.js`, instantiate it in `app.useComponents()` and use it in your handler by calling `this.delegate()` with the respective parameters.

<!--[metadata]: {"description": "Learn more about how to load your Conversational Component into your voice application.",
                "route": "cli/load"}-->
