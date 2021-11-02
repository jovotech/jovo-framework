---
title: 'GoogleSheets CMS Integration'
excerpt: 'The GoogleSheets Jovo integration lets you manage your content in Google Spreadsheets.'
---

# GoogleSheets CMS Integration

This [CMS integration](https://v4.jovo.tech/docs/cms) lets you manage your content in Google Spreadsheets.

## Introduction

With [Google Spreadsheets](), you can manage all the content of your Jovo app in a Google Spreadsheet. This makes collaboration easier and enables you update and add content faster.

Here is what a sample spreadsheet could look like:
![Google Sheets CMS for Alexa and Google Assistant]()

> [You can use this Spreadsheet as a starter template]().

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/cms-googlesheets
```

Add it as a a plugin to your `app.ts`:

```typescript
import { GoogleSheetsCms } from '@jovotech/cms-googlesheets';

// ...

const app = new App({
  plugins: [
    new GoogleSheetsCms({
      // Configuration
    }),
    // ...
  ],
});
```

## Configuration

The following configurations can be added:

```typescript
new DynamoDb({
  caching: false,
  credentialsFile: 'path/to/credentials.json',
  spreadsheetId: '<YOUR-SPREADSHEET-ID>';
  sheets: { /* ... */ },

}),
```

- `caching`: Determines whether to cache spreadsheet data for faster response times. True by default. [Learn more below](#caching).
- `credentialsFile`: Path to your credentials from your configured service account. [Learn more below](#credentialsFile).
- `spreadsheetId`: Unique spreadsheet ID. [Learn more below](#spreadsheetid).
- `sheets`: Configurations for your different sheets. [Learn more below](#sheets).

### caching

The content of all sheets is cached by default, meaning that the data is fetched once and then stored for faster response times. However, for some use cases, it might make sense to refresh the data with every request by setting `caching` to `false`.

```typescript
new GoogleSheetsCms({
  caching: false,
});
```

### credentialsFile

To work with the GoogleSheets CMS integration, you need to create a service account with the Google Sheets API enabled and create security credentials. These can be downloaded as a JSON file and then referenced with the `credentialsFile` property. The default value is `./credentials.json`.

```typescript
new GoogleSheetsCms({
  credentialsFile: 'path/to/credentials.json',
});
```

### spreadsheetId

Every spreadsheet is represented by a unique `spreadsheetId`, which is used to fetch the sheet contents. You can find the ID in the URL of your spreadsheet: `https://docs.google.com/spreadsheets/d/<spreadsheetId>/edit#gid=0`

```typescript
new GoogleSheetsCms({
  spreadsheetId: <YOUR-SPREADSHEET-ID>,
});
```

### sheets

Google Sheets offer flexible ways to structure your data. This is why the GoogleSheets CMS integration provides several sheet types to handle your data:

- [TranslationsSheet](#translationssheet)
- [KeyValueSheet](#keyvaluesheet)
- [KeyObjectSheet](#keyobjectsheet)
- [ObjectArraySheet](#objectarraysheet)

For each sheet you want to use in your Jovo app, you need to add the sheet name with the corresponding sheet type and it's configuration to the `sheets` element:

```typescript
new GoogleSheetsCms({
  sheets: {
    yourSheet: new KeyObjectSheet({
      /* ... */
    }),
  },
});
```

You can access your data inside your handler by accessing `this.$cms`:

```typescript
this.$cms.yourSheet;
```

Each sheet type accepts the following configuration:

```typescript
{
  range: 'A:Z',
  spreadsheetId: '<YOUR-SPREADSHEET-ID>',
  caching: false,
}
```

- `range`: Represents a range of cells, e.g. `A:C`, `A1:B2`, ...
- `caching`: Determines whether to cache the data for this specific sheet. True by default. [Learn more above](#caching).
- `spreadsheetId`: Unique spreadsheet ID for this specific sheet. [Learn more above](#spreadsheetid).

#### TranslationsSheet

If you define your sheet as `TranslationsSheet`, the integration expects a sheet of at least two columns:

- keys, e.g. `welcome` or `bye`
- a locale, such as `en` or `en-US`

In addition to being added to `this.$cms`, this sheet type will add your resources to the [I18n integration](), so you can access your values like this:

```typescript
this.$t('welcome');
```

#### KeyValueSheet

`KeyValueSheet` expects a sheet of at least two columns. The first one will be used as keys, the second one as values.
If you define more than two columns, the last one will override the prior ones, in that case we recommend to use [KeyObjectSheet](#keyobjectsheet).

```typescript
new GoogleSheetsCms({
  sheets: {
    yourSheet: new KeyValueSheet({
      /* ... */
    }),
  },
});
```

Here's an example sheet:

| key   | taste |
| :---- | :---- |
| apple | sour  |
| peach | sweet |

And here's the data you will receive:

```typescript
{
  apple: 'sour',
  peach: 'sweet',
}
```

Access the data using:

```typescript
const taste: string = this.$cms.yourSheet.apple;
```

#### KeyObjectSheet

`KeyObjectSheet` is an extension of [`KeyValueSheet`](#keyvaluesheet), but instead of assigning a single value to each key, an object containing the values of all columns is assigned.

```typescript
new GoogleSheetsCms({
  sheets: {
    yourSheet: new KeyObjectSheet({
      /* ... */
    }),
  },
});
```

Here's an example sheet:

| key   | taste | color |
| :---- | :---- | :---- |
| apple | sour  | green |
| peach | sweet | red   |

And here's the data you will receive:

```typescript
{
  apple: { taste: 'sour', color: 'green' },
  peach: { taste: 'sweet', color: 'red' },
}
```

Access the data using:

```typescript
const { taste, color } = this.$cms.yourSheet.apple;
```

#### ObjectArraySheet

If you define your sheet as `ObjectArraySheet`, you will receive an array of objects where each row is converted to an object with the first row specifying the keys.

```typescript
new GoogleSheetsCms({
  sheets: {
    yourSheet: new ObjectArraySheet({
      /* ... */
    }),
  },
});
```

Here's an example sheet:

| key   | taste | color |
| :---- | :---- | :---- |
| apple | sour  | green |
| peach | sweet | red   |

And here's the data you will receive:

```typescript
[
  {
    key: 'apple',
    taste: 'sour',
    color: 'green',
  },
  {
    key: 'peach',
    taste: 'sweet',
    color: 'red',
  },
];
```

Access the data using:

```typescript
const { taste, color } = this.$cms.yourSheet[0];
```

## Define your own sheet type

If you want to customize how the GoogleSheets integration handles your data, you can build your own sheet type and use it inside your app configuration.

```typescript
// src/sheets/OwnSheetType.ts

import { Jovo } from '@jovotech/framework';
import { GoogleSheetsCmsSheet, GoogleSheetsCmsSheetConfig } from '@jovotech/cms-googlesheets';

export class OwnSheetType extends GoogleSheetsCmsSheet {
  getDefaultConfig(): GoogleSheetsCmsSheetConfig {
    return { range: 'A:B' };
  }

  parse(values: unknown[][]): unknown {
    // Act upon values
    return {
      /* ... */
    };
  }
}
```

You can then integrate your own sheet type into the GoogleSheets integration:

```typescript
// src/app.ts

new GoogleSheetsCms({
  sheets: {
    yourSheet: new OwnSheetType({
      /* ... */
    }),
  },
});
```

The plugin consists of two functions:

- `getDefaultConfig()`: Returns an initial config with default values, which will be merged with the config you pass into the constructor.
- `parse()`: Accepts a two-dimensional array of values, which represents your rows with the respective cells, and can return any data you'd like, which you can then access in your handler with `this.$cms`.

You can also extend the sheet config:

```typescript
// src/sheets/OwnSheetType.ts

export interface OwnSheetTypeConfig extends GoogleSheetsCmsSheetConfig {
  configKey: string;
}

export class OwnSheetType extends GoogleSheetsCmsSheet<OwnSheetTypeConfig> {
  getDefaultConfig(): OwnSheetTypeConfig {
    // ...
  }

  parse(values: unknown[][]): unknown {
    // ...
  }
}
```
