# Upgrading

> To view this page on the Jovo website, visit https://www.jovo.tech/docs/installation/upgrading

Learn how to upgrade an existing Jovo Framework app. Also, take a look at our [Installation Guide](./README.md '../installation').

- [Upgrading the Jovo Framework](#upgrading-the-jovo-framework)
  - [Minor Updates](#minor-updates)
  - [Major Updates](#major-updates)
- [Upgrading the Jovo CLI](#upgrading-the-jovo-cli)

## Upgrading the Jovo Framework

You can find the current version of your Jovo Framework installation in your `package-lock.json` file.

You can do:

- [Minor Updates](#minor-updates), e.g. from `3.0.x` to `3.1.x`
- [Major Updates](#major-updates), e.g. from `2.x` to `3.x`

### Minor Updates

> Important: Updating by just using `$ npm install jovo-framework` can lead to errors. Make sure to use one of the commands provided below.

To update to the latest minor update (updating either `x` or `y` in `3.x.y` or `2.x.y`) of the framework, use one of the following commands:

```sh
# Update only Jovo packages
$ jovo3 update

# Update all npm packages
$ npm update
```

These commands are necessary (as opposed to `$ npm install jovo-framework`) because the framework is now split into different modules.

### Major Updates

Jovo `v3` does not come with any breaking changes except that we dropped the node 8 support. This is why you can also use the

```sh
# Update Jovo CLI to 3.x
$ npm install -g jovo-cli@latest

# Update all Jovo packages
$ jovo3 update
```

Learn more here: [v2 Migration](./v2-migration.md './installation/v2-migration').

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

> For more information on installation and troubleshooting, take a look at our [Installation Guide](./README.md '../installation').

<!--[metadata]: {"description": "Learn how to upgrade an existing Jovo Framework app.", "route": "installation/upgrading"}-->
