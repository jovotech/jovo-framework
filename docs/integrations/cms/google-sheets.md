# Google Sheets CMS Integration

Learn how to use Google Sheets as CMS for your Alexa Skills and Google Actions.

* [Introduction](#introduction)
* [Configuration](#configuration)
   * [Public Spreadsheets](#public-spreadsheets)
   * [Private Spreadsheets](#private-spreadsheets)
* [Sheet Types](#sheet-types)
   * [Responses](#responses)
   * [KeyValue](#keyvalue)
* [Writing your own Parser](#writing-your-own-parser)


## Introduction

![GoogleSheets CMS for Alexa and Google Assistant](../../img/cms-sample-google-sheets.jpg)

> You can use this Spreadsheet as a starter template: ID [1vgz5oZca1J7a37qV_nkwWK2ryYSCyh8008SsjLf5-Sk](https://docs.google.com/spreadsheets/d/1vgz5oZca1J7a37qV_nkwWK2ryYSCyh8008SsjLf5-Sk/)

## Configuration

```sh
$ npm install --save jovo-cms-googlesheets
```

`const { GoogleSheetsCMS } = require('jovo-cms-googlesheets');`

```javascript
app.use(
    // Other modules
    new GoogleSheetsCMS()
);
```

### Public Spreadsheets

```javascript
cms: {
    GoogleSheetsCMS: {
        sheets: [
            {
                spreadsheetId: '1dSM_4n7zUgZwLevo8QwGS_ZKcWADHk1kvmscI0tEu24',
                name: 'responses',
                access: 'public',
                type: 'Responses',
                position: 1,
            },
            {
                spreadsheetId: '1dSM_4n7zUgZwLevo8QwGS_ZKcWADHk1kvmscI0tEu24',
                name: 'answers',
                access: 'public',
                type: 'KeyValue',
                position: 2,
            }
        ]
    }
},
```

// Oder?

```javascript
cms: {
    GoogleSheetsCMS: {
        spreadsheetId: '1dSM_4n7zUgZwLevo8QwGS_ZKcWADHk1kvmscI0tEu24',
        access: 'public',
        sheets: [
            {
                name: 'responses',
                type: 'Responses',
                position: 1,
            },
            {
                name: 'answers',
                type: 'KeyValue',
                position: 2,
            }
        ]
    }
},
```


### Private Spreadsheets

```javascript
cms: {
    GoogleSheetsCMS: {
        spreadsheetId: '1dSM_4n7zUgZwLevo8QwGS_ZKcWADHk1kvmscI0tEu24',
        access: 'private',
        credentials: './credentials.json',
        sheets: [
            {
                name: 'responses',
                type: 'Responses',
            },
            {
                name: 'answers',
                type: 'KeyValue',
            }
        ]
    }
},
```

## Sheet Types

### Responses

`this.t()` or `this.$cms.t()`

For example...

### KeyValue

Key and a string

`this.$cms.<sheet>.<key>`

For example...


## Writing your own Parser





<!--[metadata]: {"description": "Learn how to use Google Sheets as CMS for your Alexa Skills and Google Actions.",
"route": "cms/google-sheets" }-->
