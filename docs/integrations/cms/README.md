# CMS Integrations

Learn how to use a CMS for your Alexa Skills and Google Actions with the Jovo CMS integrations.

* [Introduction](#introduction)
* [Available Integrations](#available-integrations)
* [Build your own CMS Integration](#build-your-own-cms-integration)


## Introduction

The Jovo CMS Interface is an abstraction layer for managing and localizing content for your voice apps. By default, [`i18next` JSON support](../../basic-concepts/output/i18n.md './output/i18n') is enabled, which can be extended with cloud-based CMS integrations like [Google Sheets](./google-sheets.md './cms/google-sheets').

## Available Integrations

Here is a list of all available CMS integrations for Jovo:

Name | Description
------------ | -------------
[Google Sheets](./google-sheets.md './cms/google-sheets') | Manage content in a Google Spreadsheet



## Build your own CMS Integration

Take a look at the [implementation of the Jovo GoogleSheets CMS](https://github.com/jovotech/jovo-framework-nodejs/tree/v2/jovo-integrations/jovo-cms-googlesheets/src) to get an understanding of how to build your own CMS integration.


<!--[metadata]: {"description": "Learn how to use a CMS for your Alexa Skills and Google Actions with the Jovo CMS integrations.",
"route": "cms" }-->
