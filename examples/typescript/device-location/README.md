# Jovo v4 Template

A sample voice app for the Jovo `v4` alpha version. Please note that this release is still very experimental. [You can find the documentation here](https://github.com/jovotech/jovo-framework/tree/v4dev/docs).

This is the default template for the `jovov4 new` command.

## Quick Start

You can install the new Jovo CLI like this:

```sh
# Install globally
$ npm install -g @jovotech/cli

# Test the installation
$ jovov4 -v
```

This will install the new CLI. For the beta phase, you can use it with `jovov4`. This way, you'll still be able to use Jovo CLI v3 (`jovo-cli` package) with `jovo`.

After successfully installing the Jovo CLI, you can install the template using this command:

```sh
$ jovov4 new <directory>
```

Change your working directory into your newly created project directory and run your voice app:

```sh
# Change working directory to your previously specified directory
$ cd <directory>

# Run local development server
$ jovov4 run
```

You can now open the Jovo Debugger with the `.` key. Note: The v4 Debugger can be reached using `webhookv4.jovo.cloud` instead of `webhook.jovo.cloud`.
