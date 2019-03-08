# Airtable CMS Integration

Learn how to use Airtable as CMS for your Alexa Skills and Google Actions.

* [Introduction](#introduction)
* [Configuration](#configuration)
* [Default Sheet Types](#default-sheet-types)
  * [Default](#default)
  * [Responses](#responses)
  * [KeyValue](#keyvalue)
  * [ObjectArray](#objectarray)

## Introduction

With this Jovo CMS integration, you can manage all the content of your Alexa Skills and Google Actions in a Google Spreadsheet. This makes collaboration easier and enables you update and add content faster.

Here's what a sample table could look like:

![Airtable CMS for Alexa and Google Assistant](TODO)

> [You can use this as template](TODO)

## Configuration

To get started, install the following package:

```sh
$ npm install --save jovo-cms-airtable
```

Add it to your `app.js` file and register it with the `use` command:

```javascript
const { AirtableCMS } = require('jovo-cms-airtable');

app.use( new AirtableCMS());
```

Next, add the necessary configurations to your `config.js` file:

```javascript
// config.js
cms: {
    AirtableCMS: {
        apiKey: '<api-key>',
        baseId: '<base-id>',
        sheets: [
            {
                name: '<sheetName>',
                table: '<tableName>',
                type: '<SheetType>'
            },
        ]
    }
}
```

## Default Sheet Types

Google Sheets offers flexible ways to structure data. This is why the Jovo CMS integration supports several sheet types that are already built in:

* [Default](#default)
* [Responses](#responses)
* [KeyValue](#keyvalue)
* [ObjectArray](#objectarray)

### Default

If you don't define a sheet type in the `config.js`, you receive an array of arrays that can be accessed like this:

```javascript
this.$cms.sheetName
```

### Responses

If you define the sheet type as `Responses`, the integration expects a spreadsheet of at least two columns:
* a `key`
* a locale, e.g. `en`, `en-US`, or `de-DE`

For this locale, you can then access the responses like this:

```javascript
// i18n notation
this.t('key')

// Alternative
this.$cms.t('key')
```

You can add as many locales as you want by adding additional columns for each key.


### KeyValue

If you define the sheet type as `KeyValue`, the integration expects a spreadsheet of at least two columns:
* a `key`
* a `value`

For every key, this will return the value as a string:

```javascript
this.$cms.sheetName.key
```

### ObjectArray

If you define the sheet type as `ObjectArray`, you will receive an array of objects where each row is converted to an object with the first row of the spreadsheet specifying the keys

Here's an example sheet:

Name | Location | Date
:--- | :--- | :---
Voice Summit | Newark, New Jersey, USA | 7/22/2019
SuperBot | San Francisco, California, USA | 4/2/2019

And here's the array of objects you will receive:

```javascript
[ 
    { 
        name: 'Voice Summit',
        location: 'Newark, New Jersey, USA',
        date: '7/22/2019' 
    },
    {
        name: 'SuperBot',
        location: 'San Francisco, California, USA',
        date: '4/2/2019' 
    }
]
```

Access the array using:

```javascript
this.$cms.sheetName
```

<!--[metadata]: {"description": "Learn how to use Airtable as CMS for your Alexa Skills and Google Actions.",
"route": "cms/airtable" }-->
