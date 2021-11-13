# Contributing to Jovo

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/contributing

Thank you for choosing to fix bugs or add new features to the Jovo Framework! This doc will walk you through the process.

- [Prepare your Workspace](#prepare-your-workspace)
  - [Configure your App to use your Local Copy of the Jovo Framework](#configure-your-app-to-use-your-local-copy-of-the-jovo-framework)
- [Make your Changes](#make-your-changes)
- [Test your Changes](#test-your-changes)
- [Share your Changes](#share-your-changes)
- [Create a Pull-Request on GitHub](#create-a-pull-request-on-github)

## Prepare your Workspace

You'll need to make your changes in your own fork of the jovo-framework repo.
If you're not familiar with forking in GitHub, this article will help you get started: https://help.github.com/en/articles/fork-a-repo

> The packages that make up Jovo are all contained in a single monorepo. Jovo uses [Lerna](https://lerna.js.org/) to manage these packages.

Initialize your workspace (run this in the top level of your jovo-framework clone):

```shell
$ npm install
$ npm run init
$ npm run devsetup
```

### Configure your App to use your Local Copy of the Jovo Framework

If you have a Jovo app that depends on the feature or fix you are implementing, configure your Jovo app to use your local version of the jovo-framework. If that's not the case, you can skip this section and just test your change with unit tests.

Create [links](https://docs.npmjs.com/cli/link.html) for the framework
This will create symlinks to jovo-framework and jovo-core in your system's global npm modules.

> Note that the repo is called jovo-framework, but `npm link` must be run in jovo-framework/jovo-framework

```shell
$ cd jovo-framework
$ npm run tsc
$ npm link

$ cd ../jovo-core
$ npm run tsc
$ npm link
```

Now create links in your project:

```shell
$ cd <your project>
$ npm link jovo-framework
$ npm link jovo-core
```

If you are modifying other packages in the Jovo Framework, e.g. plugins, you should repeat this process for those packages.

> Note that if you run `npm install` in your app, it will install the actual packages, overwriting the symlinks.

## Make your Changes

Create a new branch for your fix or feature:

```shell
$ git checkout -b <new-branch-name>
```

Add and edit files.

## Test your Changes

Run all of these commands at the top level of your jovo-framework clone.

> Jovo uses [Jest](https://jestjs.io/) for unit tests and [tslint](https://palantir.github.io/tslint/) for static analysis.

Compile TypeScript:

```shell
$ npm run tsc
```

Run linter:

```shell
$ npm run tslint
```

Run tests:

```shell
$ npm run test
```

## Share your Changes

> [We're using Gitmoji for commit messages. Learn more here.](https://gitmoji.carloscuesta.me)

Add and commit code:

```shell
$ git add .
$ git commit -m ":GITMOJI: Text"
$ git push origin -u <branchname>
```

### Create a Pull-Request on GitHub

See this article from GitHub: https://help.github.com/en/articles/creating-a-pull-request-from-a-fork

<!--[metadata]: {
                "description": "Learn how you can contribute to the Jovo Framework, the open source developer toolkit for voice apps on Alexa and Google Assistant.",
		        "route": "contributing"
                }-->
