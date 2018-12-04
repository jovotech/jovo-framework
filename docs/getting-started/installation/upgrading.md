# Upgrading

Learn how to upgrade an existing Jovo Framework app.

* [Upgrading the Jovo Framework](#upgrading-the-jovo-framework)
   * [Minor Updates](#minor-updates)
   * [Major Updates](#major-updates)
* [Upgrading the Jovo CLI](#upgrading-the-jovo-cli)

## Upgrading the Jovo Framework

You can see the current version of your Jovo Framework installation in your `package-lock.json` file.

### Minor Updates

To update to the latest minor update (`1.x` or `2.x` depending on your major version) of the framework, use the following command:

```sh
$ npm install --save jovo-framework
```

This should not only update to the latest minor update, but also save the current version into your `package.json` file.

### Major Updates

To learn more about how to do major updates (e.g. from version `1.x` to `2.x`), read the following migration guide:

> [Migrating to Jovo v2 from v1](./v1-migration.md './v1-migration').

## Upgrading the Jovo CLI

To update to the latest version of the Jovo CLI, use the following command:

```sh
$ npm install -g jovo-cli
```

For major updates, consider uninstalling the Jovo CLI globally before you install it again:

```sh
$ npm uninstall -g jovo-cli
```

For more information on installation and troubleshooting, take a look at our [Installation Guide](./installation.md './installation').

<!--[metadata]: {"description": "Learn how to upgrade an existing Jovo Framework app.", "route": "installation/upgrading"}-->
