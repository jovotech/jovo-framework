# jovo load

Learn more about how to load your Conversational Component into your existing voice application.

* [Introduction](#introduction)
* [Workflow](#workflow)

## Introduction

![jovo load <component>](../img/jovo-deploy.png "jovo load <component>")


`jovo load` is the Jovo CLI command to load a Conversational Component into your voice application's code base.

## Workflow

The `jovo load` command is followed by the name of the Conversational Component you want to load, that you installed into your `node_modules` folder prior.

```sh
# Default
$ jovo load jovo-component-email
```

This will load the component into either `./src/components/`, or just `./components/`. Now you can import it in your `app.js`, instantiate it in `app.useComponents()` and use it in your handler by calling `this.delegate()` with the respective parameters. 

<!--[metadata]: {"description": "Learn more about how to load your Conversational Component into your voice application.",
                "route": "cli/load"}-->
