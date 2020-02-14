# jovo update

Learn how to update all the Jovo packages in your project.

## Introduction

Every Jovo project consists of multiple Jovo packages with the `jovo-framework` package being the main one.
Many of these packages depend on each other, which makes them prone to dependency issues. Most of the times the issue is that package A and package B depend on package C but both use a different version.

One of the more common errors you get when that happens is the following `TypeError`:

```shell
TypeError: this.toIntent is not a function
```

The easiest way to fix that is by using the latest version of each package. For that we provide the `jovo update` command.

## Workflow

Running the `jovo update` command in your Jovo project will update all of your Jovo packages to the latest version

```shell
$ jovo update
```

After that, the dependency issues should be fixed.

<!--[metadata]: {"description": "Learn more about how to load your Conversational Component into your voice application.", "route": "cli/update"}-->
