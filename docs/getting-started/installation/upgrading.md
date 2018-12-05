# Upgrading

Learn how to upgrade an existing Jovo Framework app.

* [Upgrading the Jovo Framework](#upgrading-the-jovo-framework)
   * [Minor Updates](#minor-updates)
   * [Major Updates](#major-updates)
* [Upgrading the Jovo CLI](#upgrading-the-jovo-cli)

> [For the full v2 migration guide, take a look here](./v1-migration.md './v1-migration').

## Upgrading the Jovo Framework

You can find the current version of your Jovo Framework installation in your `package-lock.json` file.

You can do:
* [Minor Updates](#minor-updates), e.g. from `2.0.x` to `2.1.x` or from `2.0.1` to `2.0.2`
* [Major Updates](#major-updates), e.g. from `1.x` to `2.x`

### Minor Updates

To update to the latest minor update (updating either `x` or `y` in `1.x.y` or `2.x.y`) of the framework, use the following command:

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

# Add sudo if you run into permission problems
$ sudo npm install -g jovo-cli
```

For major updates, consider uninstalling the Jovo CLI globally before you install it again:

```sh
$ npm remove -g jovo-cli

# Add sudo if you run into permission problems
$ sudo npm remove -g jovo-cli
```

> For more information on installation and troubleshooting, take a look at our [Installation Guide](./installation.md './installation').

<!--[metadata]: {"description": "Learn how to upgrade an existing Jovo Framework app.", "route": "installation/upgrading"}-->
