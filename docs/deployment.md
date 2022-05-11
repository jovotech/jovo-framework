---
title: 'Deployment'
excerpt: 'Learn how you can deploy your Jovo app to a server or cloud provider.'
---

# Deployment

Learn how you can deploy your Jovo app to a server or cloud provider.

## Introduction

Jovo offers [server integrations](./server.md) that allow you to run your Jovo app code on different servers and cloud providers, for example [AWS Lambda](https://www.jovo.tech/marketplace/server-lambda).

This page details the process of bundling and deploying the code. Usually, this is done using the [`deploy:code` command](https://www.jovo.tech/docs/deploy-command#deploy-code), for example with the [Serverless CLI integration](https://www.jovo.tech/marketplace/target-serverless).

## Deployment Steps

Learn more about the deployment process in the sections below:

- [Bundle](#bundle): Create a code bundle based on the stage
- [Deploy](#deploy): Deploy the bundle to a cloud provider

### Bundle

Jovo uses [`esbuild`](https://github.com/evanw/esbuild) to bundle and minify your `src` code. The result is a `bundle.zip` file that can then be deployed to a cloud provider.

Usually, the bundling is happening as part of the [`deploy:code` command](https://www.jovo.tech/docs/deploy-command#deploy-code). Under the hood, it calls the `bundle:<stage>` script, for example:

```sh
# Bundle src files (stage: dev)
$ npm run bundle:dev
```

This will bundle the files based on your [`app.dev.ts` stage config](./app-config.md#staging).

The stage specific scripts are usually created using the [`new:stage` command](https://www.jovo.tech/docs/new-command#new-stage). For example, the `dev` stage script looks like this in your [`package.json` file](https://github.com/jovotech/jovo-v4-template/blob/master/package.json):

```json
{
  "bundle:dev": "npm run bundle -- src/app.dev.ts"
}
```

The script calls the `bundle` script together with an entry point, in this case the `app.dev.ts` stage config. This makes sure that only dependencies used by the respective stage are used in the bundle.

`bundle` includes the following scripts:

```json
{
  "bundle": "esbuild --bundle --outfile=bundle/index.js --sourcemap --minify --keep-names --platform=node --target=node14 --format=cjs  --external:aws-sdk --external:@oclif/* --external:@jovotech/cli*",
  "prebundle": "rimraf bundle",
  "postbundle": "cd bundle && bestzip ../bundle.zip * && cd .."
}
```

The scripts do the following:

- `bundle`: Uses `esbuild` to bundle the code into a `bundle` folder.
- `prebundle`: Executed before `bundle`. Deletes the `bundle` folder.
- `postbundle`: Executed after `bundle`. Creates a ZIP file from the `bundle` folder.

If you need to make any changes to the `bundle` folder before the ZIP file is created (for example, move some files into the directory), we recommend modifying the `bundle` script.

### Deploy

After the `bundle.zip` file was created in the [bundle](#bundle) step, it can be deployed to a cloud provider.

You can do that manually or by using your own scripts. We recommend using the [`deploy:code` command](https://www.jovo.tech/docs/deploy-command#deploy-code) (for example with the [Serverless CLI integration](https://www.jovo.tech/marketplace/target-serverless)) because it does the bundling and deployment all in a single command.
