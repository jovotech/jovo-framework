# Installation

Jovo is an open-source framework based on [Typescript](https://www.typescriptlang.org/) which can be used with [Node.js](https://nodejs.org/). If you run into any problems while installing it, please let us know [in the Jovo forum](https://community.jovo.tech/), [create an issue on GitHub](https://github.com/jovotech/jovo-framework/issues), or [join our Developer Slack community](https://www.jovo.tech/slack).

Please note that this `v4` release is still experimental.

## Quickstart Guide

### Install the CLI

You can install the new Jovo CLI like this:

```sh
$ npm install -g @jovotech/cli
```

After successful installation, you should be able to see the Jovo CLI menu by typing the following into your command line:

```sh
$ jovov4 -v
```

**A note on versions:** For Jovo `v4`, we're moving to [organization scoped packages](https://docs.npmjs.com/creating-and-publishing-an-organization-scoped-package). Instead of e.g. `jovo-cli`, you are now installing `@jovotech/cli`. This is especially helpful for the beta phase: You will still be able to use the `jovo-cli` package with the CLI name `jovo` in parallel with the `@jovotech/cli` package and the CLI name `jovov4`.


### Create a new Project

After installing the Jovo CLI, you can install the template (which can be found in [this repository](https://github.com/jovotech/jovo-v4-template)) using the `new` command:

```sh
$ jovov4 new <directory>
```

### Run the Local Development Server

Change your working directory into your newly created project directory and run your app:

```sh
# Change working directory to your previously specified directory
$ cd <directory>

# Run voice app, optionally with a --watch flag to restart on code changes.
$ jovov4 run [-w]
```

You can now open the Jovo Debugger with the `.` key. 

**Note:** The v4 Debugger can be reached using `webhookv4.jovo.cloud` instead of `webhook.jovo.cloud`.