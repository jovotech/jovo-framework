---
title: 'GoogleSheets CMS Integration'
excerpt: 'The GoogleSheets Jovo integration lets you manage your content in Google Spreadsheets.'
---

# GoogleSheets CMS Integration

This [CMS integration](https://v4.jovo.tech/docs/cms) lets you manage your content in Google Spreadsheets.

## Introduction

With [Google Sheets](https://www.google.com/sheets/about/), you can manage all the content of your Jovo app in a Google Spreadsheet. This makes collaboration easier and enables you to update and add content faster.

Here is a screenshot of our [sample spreadsheet](https://docs.google.com/spreadsheets/d/1YxNwxpZB32DBN0WI8SbcO828i1mutFriTgvjkw4UnW8/edit?usp=sharing) that stores [translations](#translationssheet) for the [Jovo v4 template](https://github.com/jovotech/jovo-v4-template):

![Google Sheets CMS for Voice Apps and Chatbots](./img/jovo-cms-sample-spreadsheet.png)

Learn more about setting up Google Sheets with Jovo in the [installation](#installation) and [configuration](#configuration) sections.

It's possible to use pre-defined sheet types (like [translations](#translationssheet) in the example above) as well as defining your own ones. Learn more in the [sheet types](#sheet-types) section.

## Installation

As first step, create a Google Spreadsheet with at least one sheet. Most projects usually contain a [`translations` sheet](#translationssheet) for [i18n](https://v4.jovo.tech/docs/i18n). You can get started by copying our [sample spreadsheet](https://docs.google.com/spreadsheets/d/1YxNwxpZB32DBN0WI8SbcO828i1mutFriTgvjkw4UnW8/edit?usp=sharing).

Install the plugin like this:

```sh
$ npm install @jovotech/cms-googlesheets
```

Add it as a plugin to your [app configuration](https://v4.jovo.tech/docs/app-config), for example `app.ts`:

```typescript
import { GoogleSheetsCms, TranslationsSheet } from '@jovotech/cms-googlesheets';
// ...

const app = new App({
  plugins: [
    new GoogleSheetsCms({
      spreadsheetId: '<YOUR-SPREADSHEET-ID>',
      sheets: {
        translations: new TranslationsSheet(),
      },
      // ...
    }),
    // ...
  ],
});
```

You need the following for the integration to work:

- The ID of your Google Spreadsheet as `spreadsheetId` property. [Learn how to retrieve the ID below](#spreadsheetid).
- A credentials file that gives you permission to access the spreadsheet's content. By default, the plugin expects it to be in the root of your `src` folder. [Learn how to retrieve the credentials file below](#credentialsfile).

All other configuration options can be found in the [configuration section](#configuration).

## Configuration

The following configurations can be added:

```typescript
new GoogleSheetsCms({
  caching: true,
  credentialsFile: './credentials.json',
  spreadsheetId: '<YOUR-SPREADSHEET-ID>',
  sheets: { /* ... */ },
}),
```

- [`caching`](#caching): Determines whether to cache spreadsheet data for faster response times. `true` by default.
- [`credentialsFile`](#credentialsfile): Path to your credentials from your configured service account.
- [`spreadsheetId`](#spreadsheetid): Unique spreadsheet ID.
- [`sheets`](#sheets): Configurations for your different sheets.

### caching

The content of all sheets is cached by default, meaning that the data is fetched once and then stored for faster response times. However, for some use cases, it might make sense to refresh the data with every request by setting `caching` to `false`.

```typescript
new GoogleSheetsCms({
  caching: false,
});
```

### credentialsFile

To work with the GoogleSheets CMS integration, you need to create a service account with the Google Sheets API enabled and create security credentials:

- Go to the [API Library of the Google Cloud Console](https://console.cloud.google.com/apis/library)
- Search for _Google Sheets API_ and enable it (you can also follow [this link](https://console.cloud.google.com/apis/library/sheets.googleapis.com))
- After that, select _Credentials_ and create credentials, specifically a _Service Account_
- Create a service account and then create and download a key under _Manage Keys_

Place this file in your project (relative to the `src` folder) and reference the path to it with the `credentialsFile` property. The default value is `./credentials.json`.

```typescript
new GoogleSheetsCms({
  credentialsFile: 'path/to/credentials.json',
});
```

### spreadsheetId

Every spreadsheet is represented by a unique `spreadsheetId`, which is used to fetch the sheet contents. You can find the ID in the URL of your spreadsheet, for example: `https://docs.google.com/spreadsheets/d/<YOUR-SPREADSHEET-ID>/edit#gid=0`.

```typescript
new GoogleSheetsCms({
  spreadsheetId: '<YOUR-SPREADSHEET-ID>',
});
```

### sheets

Google Sheets offer flexible ways to structure your data. This is why the GoogleSheets CMS integration provides several sheet types to handle your data, for example:

- [TranslationsSheet](#translationssheet)
- [KeyValueSheet](#keyvaluesheet)
- [KeyObjectSheet](#keyobjectsheet)
- [ObjectArraySheet](#objectarraysheet)

You can learn more about those types in the [sheet types](#sheet-types) section.

For each sheet you want to use in your Jovo app, you need to add the sheet name (the one you can see in the tab in Google Sheets, for example `translations` in the [sample spreadsheet](https://docs.google.com/spreadsheets/d/1YxNwxpZB32DBN0WI8SbcO828i1mutFriTgvjkw4UnW8/edit?usp=sharing)) with the corresponding sheet type and its configuration to the `sheets` element:

```typescript
import { GoogleSheetsCms, KeyObjectSheet } from '@jovotech/cms-googlesheets';
// ...

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
- `caching`: Determines whether to cache the data for this specific sheet. `true` by default. [Learn more above](#caching).
- `spreadsheetId`: Unique spreadsheet ID for this specific sheet. [Learn more above](#spreadsheetid).

## Sheet Types

The Jovo Google Sheets integration comes with a few default sheet types:

- [TranslationsSheet](#translationssheet)
- [KeyValueSheet](#keyvaluesheet)
- [KeyObjectSheet](#keyobjectsheet)
- [ObjectArraySheet](#objectarraysheet)

You can also learn more about creating your own [custom sheet types](#custom-sheet-types).

### TranslationsSheet

This sheet type makes use of the Jovo [i18n](https://v4.jovo.tech/docs/i18n) and allows you to store translation strings in a Google spreadsheet.

```typescript
import { GoogleSheetsCms, TranslationsSheet } from '@jovotech/cms-googlesheets';
// ...

new GoogleSheetsCms({
  sheets: {
    translations: new TranslationsSheet({
      /* ... */
    }),
  },
});
```

If you define your sheet as `TranslationsSheet`, the integration expects a sheet of at least two columns:

- keys, e.g. `welcome` or `bye`
- a locale, such as `en` or `en-US`

By using this sheet type, you can access translation strings like this:

```typescript
this.$t('welcome');
```

### KeyValueSheet

`KeyValueSheet` expects a sheet of at least two columns. The first one will be used as keys, the second one as values.

If you define more than two columns, the last one will override the prior ones. In that case we recommend to use [KeyObjectSheet](#keyobjectsheet).

```typescript
import { GoogleSheetsCms, KeyValueSheet } from '@jovotech/cms-googlesheets';
// ...

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

### KeyObjectSheet

`KeyObjectSheet` is an extension of [`KeyValueSheet`](#keyvaluesheet), but instead of assigning a single value to each key, an object containing the values of all columns is assigned.

```typescript
import { GoogleSheetsCms, KeyObjectSheet } from '@jovotech/cms-googlesheets';
// ...

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

// Or
this.$cms.yourSheet.apple.taste;
```

### ObjectArraySheet

If you define your sheet as `ObjectArraySheet`, you will receive an array of objects where each row is converted to an object with the first row specifying the keys.

```typescript
import { GoogleSheetsCms, ObjectArraySheet } from '@jovotech/cms-googlesheets';
// ...

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

// Or
this.$cms.yourSheet[0].taste;
```

### Custom Sheet Types

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
