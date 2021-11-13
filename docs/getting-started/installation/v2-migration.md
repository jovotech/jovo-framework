# Jovo v2 Migration Guide

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/installation/v2-migration

We just released a huge update to the Jovo Framework: Version 3! Learn how to migrate from a Jovo v2 project to the new v3 of the Jovo Framework, or [check out our Quickstart guide](../README.md '../quickstart').

- [Breaking Changes in v3](#breaking-changes-in-v3)
- [Getting Started with v3](#getting-started-with-v3)

## Breaking Changes in v3

Although `v3` of Jovo was a big update, it was important to us to minimize the time it takes for our users to migrate existing projects to the new version.

The only breaking change is the Node version. We dropped support for Node `8.10` (major cloud providers like AWS are doing the same) and recommend anyone to use at least Node `10.8`.

## Getting Started with v3

> New to Jovo? [Check out our Quickstart guide](../README.md '../quickstart').

To migrate an existing project, you can either use the `jovo update` command like this:

```sh
# Update Jovo CLI to 3.x
$ npm install -g jovo-cli@latest

# Update all Jovo packages
$ jovo3 update
```

Alternatively, you can also update all Jovo packages in your project manually by using:

```sh
# Update Jovo package to 3.x
$ npm install jovo-<package-name>@latest

# Example
$ npm install jovo-core@latest
```

<!--[metadata]: {"description": "Learn how to migrate from a Jovo v2 project to the new v3 of the Jovo Framework.", "route": "installation/v2-migration"}-->
