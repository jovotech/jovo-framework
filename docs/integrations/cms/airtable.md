# Airtable CMS Integration

Learn how to use Airtable as CMS for your Alexa Skills and Google Actions.

* [Introduction](#introduction)
* [Configuration](#configuration)
* [Default Table Types](#default-table-types)
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
        tables: [
            {
                name: '<name>',
                table: '<tableName>',
                type: '<SheetType>',
                selectOptions: {
                    fields: ['UserId', 'Name', 'Location']
                    sort: [
                        {
                            field: "UserId",
                            direction: "desc"
                        }
                    ],
                }
            },
        ]
    }
}
```

Name | Description | Value | Required
:--- | :--- | :--- | :---
`apiKey` | Your Airtable api key | `string` | Yes
`baseId` | The id of your base | `string` | Yes
`tables` | Contains information about the tables of your base | `object[]` | Yes
`tables.name` | The name which you will use to access the table: `this.$cms.name` | `string` | Yes
`tables.table` | The name you've given the table in your base | `string` | Yes
`tables.type` | The table type you want to use. Default: `default` | `string` - either `default`, `responses`, `keyvalue` or `objectarray` | Nos
`tables.selectOptions` | Allows you to specify how the data should be retrieved from your table | `object` | No
`tables.selectOptions.fields` | Specify the fields (columns) that should be retrieved. If you decide to not retrieve the primary column of your table, keep in mind that in that case the last column of your table will be put in the first place of the array | `string[]` | No
`tables.selectOptions.filterByFormula` | A [formula](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference) used to filter records. The formula will be evaluated for each record, and if the result is not `0`, `false`, `""`, `NaN`, `[]`, or `#Error!` the record will be included in the response | `string` | No
`tables.selectOptions.maxRecords` | The maximum total number of records that will be retrieved | `number` | No
`tables.selectOptions.sort` | An array of sort objects that specifies how the records will be ordered. Each sort object must have a field key specifying the name of the field to sort on, and an optional direction key that is either "asc" or "desc". The default direction is "asc". | `object[]` | No


## Default Table Types

Table types specify how the data will be transformed and saved.

* [Default](#default)
* [Responses](#responses)
* [KeyValue](#keyvalue)
* [ObjectArray](#objectarray)

### Default

If you don't define a table type in the `config.js`, you receive an array of arrays that can be accessed like this:

```javascript
this.$cms.name
```

### Responses

If you define the table type as `Responses`, the integration expects a spreadsheet of at least two columns:
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

If you define the table type as `KeyValue`, the integration expects a spreadsheet of at least two columns:
* a `key`
* a `value`

For every key, this will return the value as a string:

```javascript
this.$cms.name.key
```

### ObjectArray

If you define the table type as `ObjectArray`, you will receive an array of objects where each row is converted to an object with the first row of the spreadsheet specifying the keys

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
this.$cms.name
```

<!--[metadata]: {"description": "Learn how to use Airtable as CMS for your Alexa Skills and Google Actions.",
"route": "cms/airtable" }-->
