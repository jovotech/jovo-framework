---
title: 'Contributing to Jovo Open Source'
excerpt: 'Learn more about setting up your Jovo development environment and contributing to the open source framework by submitting pull requests on GitHub.'
---

# Contributing to Jovo

Learn more about setting up your Jovo development environment and contributing to the open source framework by submitting pull requests on GitHub.

## Introduction

Jovo is open source under an [Apache 2.0 license](https://github.com/jovotech/jovo-framework/blob/v4/latest/LICENSE), which means that the source code is openly available and a community of contributors helps us add new features, fix bugs, and write documentation. [Financial contributors](https://opencollective.com/jovo-framework) also help our core team focus on building new features and supporting the community.

The [`jovo-framework` repository](https://github.com/jovotech/jovo-framework) uses a [monorepo structure](https://en.wikipedia.org/wiki/Monorepo) that contains all packages needed for development. There is also a [`docs` folder](https://github.com/jovotech/jovo-framework/tree/v4/latest/docs) that contains all general documentation. Each integration also contains its own `docs` folder with documentation for the respective pages in the [Jovo Marketplace](https://www.jovo.tech/marketplace). For example, all [Alexa docs](https://www.jovo.tech/marketplace/platform-alexa) can be found in [`platforms/platform-alexa/docs`](https://github.com/jovotech/jovo-framework/tree/v4/latest/platforms/platform-alexa/docs).

If you want to contribute to Jovo, you can learn more in the sections below:

- [Development setup](#development-setup): Learn how to run the Jovo code locally
- [PR Workflow](#pr-workflow): All the steps needed to contribute to Jovo by submitting a pull request (PR) on GitHub

## Development Setup

To clone and run the Jovo Framework code, use the following commands:

```sh
# Clone jovo-framework repository (this could also be your fork)
$ git clone https://github.com/jovotech/jovo-framework.git

# Go into the framework directory
$ cd jovo-framework

# Install dependencies
$ npm install

# Run setup script
$ npm run setup:dev
```

To learn more about all scripts, take a look at the [`package.json` file](https://github.com/jovotech/jovo-framework/blob/v4/latest/package.json).

If you want to test your updates, we recommend using a project in the [`examples` folder](https://github.com/jovotech/jovo-framework/tree/v4/latest/examples). The examples are linked with the local packages of the `jovo-framework` monorepo.

If you are making updates to a specific package in the repository, make sure that its content is compiled before testing:

```sh
## Package folder, e.g. integrations/db-dynamodb

# Build files of updated package
$ npm run build

# Alternative: Watch package and build on file change
$ npm run watch
```

In the example project, you can run and watch the code like this and then test it in the [Jovo Debugger](https://www.jovo.tech/docs/debugger):

```sh
## Example folder, e.g. examples/typescript/basic

# Run (and watch) Jovo src files
$ npm run start:dev
```

## PR Workflow

If you want to contribute to the Jovo open source code by opening a [pull request (PR)](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests), you can learn more about all steps of the workflow in the sections below:

- [Branches](#branches)
- [Commits](#commits)
- [PR creation](#pr-creation)
- [Merge and release](#merge-and-release)

If you're new to working with PRs and GitHub, you can learn more by going through this repository: [first-contributions](https://github.com/firstcontributions/first-contributions).

### Branches

We use the following conventions for [branches](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches):

- [`v4/latest`](https://github.com/jovotech/jovo-framework/tree/v4/latest): This branch is up to date with the latest version on [npm](https://www.npmjs.com/package/@jovotech/framework) and the docs on the Jovo website. Docs-only PRs should point to this branch.
- [`v4/dev`](https://github.com/jovotech/jovo-framework/tree/v4/dev): The main branch for development before a new version gets released on npm. Most PRs should point to this branch.

We follow the [feature branch workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow), which means that each PR gets its own branch, that can be named like this: `v4/feature/<name>`, `v4/bugfix/<name>`, `v4/docs/<name>`.

For example, if you want to create a new feature or fix a bug, you can create a new branch from `v4/dev` like this:

```sh
$ git checkout -b v4/feature/<name> origin/v4/dev

# Example
$ git checkout -b v4/feature/alexa-audioplayer origin/v4/dev
```

For docs, you can create a new brach from `v4/latest` like this:

```sh
$ git checkout -b v4/docs/<name> origin/v4/latest

# Example
$ git checkout -b v4/docs/alexa-improvements origin/v4/latest
```

There is no strict convention for branch names. If it is for an integration (like a [platform](./platforms.md)), we usually add the integration name at the beginning, for example: `v4/feature/alexa-<feature>`.

### Commits

We use [gitmoji](https://gitmoji.dev/) for our commit messages. The convention is to have a commit for each isolated change. This way, commits can be scanned more easily by other contributors.

Here are a few examples:

```sh
# Docs
:memo: Add account linking section

# Feature
:sparkles: Add LinkAccountCardOutput

# Bug
:bug: Fix user session bug
```

### PR Creation

After pushing all commits to a branch in your [fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo), you can create a [pull request (PR)](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) that points to:

- `v4/dev` for code changes
- `v4/latest` for changes to the docs only

Please also check the [allow changes from maintainers](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork) option for the core team to make updates during review.

### Merge and Release

A PR will be merged once it passes the following two review steps:

- Code review: This ensures that the code works and follows our conventions. This is usually done by [Alex](https://github.com/aswetlow).
- Doc review: This ensures that all added features are documented. This is usually done by [Jan](https://github.com/jankoenig).

We are very thankful for each contribution and are working hard on merging PRs as soon as possible, but please be considerate that each review takes time and work on our side. The more community members ask for a feature, the higher we can prioritize the work we put into the PR for it. PRs submitted by [financial contributors](https://opencollective.com/jovo-framework) are also prioritized. We reserve the right to close PRs if they don't fit our strategy or process.

After the review, we merge the PR and usually publish updates to npm 2-3 times a month. Bugfixes get released faster.

Thank you for your contribution!
