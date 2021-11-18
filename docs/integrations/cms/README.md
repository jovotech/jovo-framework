# CMS Integrations

Learn how to use a CMS for your Alexa Skills and Google Actions with the Jovo CMS integrations.

- [Introduction](#introduction)
- [Available Integrations](#available-integrations)
- [Features](#features)
  - [i18n](#i18n)
  - [Caching](#caching)
- [Build your own CMS Integration](#build-your-own-cms-integration)

## Introduction

The Jovo CMS Interface is an abstraction layer for managing and localizing content for your voice apps. By default, [`i18next` JSON support](../../basic-concepts/output/i18n.md './output/i18n') is enabled, which can be extended with cloud-based CMS integrations like [Google Sheets](./google-sheets.md './cms/google-sheets').

## Available Integrations

Here is a list of all available CMS integrations for Jovo:

| Name                                                                    | Description                            |
| ----------------------------------------------------------------------- | -------------------------------------- |
| [Google Sheets](https://v3.jovo.tech/marketplace/jovo-cms-googlesheets) | Manage content in a Google Spreadsheet |
| [Airtable](https://v3.jovo.tech/marketplace/jovo-cms-airtable)          | Manage content using Airtable          |

## Features

The Jovo CMS integrations interface offers features that are available acros CMS platforms, like:

- [i18n](#i18n)
- [Caching](#caching)

For all features of a CMS integration, take a look at the specific docs of the [available integrations](#available-integrations) above.

### i18n

> [Learn more about Jovo i18n here](../../basic-concepts/output/i18n.md './output/i18n').

This feature uses the [Jovo `i18next` integration](https://v3.jovo.tech/marketplace/jovo-cms-i18next) to creat localized content with specific features for voice and conversational experiences:

- multilingual apps
- randomized output
- platform-specific responses

### Caching

The content of the CMS interfaces is by default retrieved when the Jovo app is initialized (e.g. when the server starts with `jovo run` or when the Lambda function does a cold start) and then stored into the `app` object ([learn more about `app` data here](../../basic-concepts/data#app-data './data#app-data')). This is configured with the default configuration `caching: true` for each CMS integration.

For some use cases (like testing), however, it might make sense to retrieve the CMS with every request. You can enable these instant updates by setting the `caching` option to `false`.

Learn how to enable this option in the documentations of the [available integrations](#available-integrations) above.

## Build your own CMS Integration

Take a look at the [implementation of the Jovo GoogleSheets CMS](https://github.com/jovotech/jovo-framework-nodejs/tree/master/jovo-integrations/jovo-cms-googlesheets/src) to get an understanding of how to build your own CMS integration.

<!--[metadata]: {"description": "Learn how to use a CMS for your Alexa Skills and Google Actions with the Jovo CMS integrations.",
"route": "cms" }-->
